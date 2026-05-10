import * as React from "react";
import { ArrowRight, ArrowLeft, Calculator, CheckCircle, AlertTriangle, MessageCircle, Users, ShieldCheck, Copy, ShieldAlert, X, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Alert, AlertDescription, AlertTitle, AuditProvider } from "./components/ui";
import { Step1Input } from './components/analysis/Step1Input';
import { NgInputStep } from './components/analysis/NgInputStep';
import { ConnectedLinesStep } from './components/analysis/ConnectedLinesStep';
import { Step3Events } from './components/analysis/Step3Events';
import { RiskComponentsSelection } from './components/analysis/RiskComponentsSelection';
import { ProbabilityStep } from './components/analysis/ProbabilityStep';
import { LossStep } from './components/analysis/LossStep';
import { RiskResultsStep } from './components/analysis/RiskResultsStep';
import { ReportStep } from './components/analysis/ReportStep';
import { FrequencyConfigStep } from './components/analysis/FrequencyConfigStep';
import { ProjectInfoStep } from './components/analysis/ProjectInfoStep';
import { ToolboxStep } from './components/analysis/ToolboxStep';
import { STEPS } from "./constants";
import { AnalysisData, AnalysisInputData } from './types';
import { useAnalysisData } from './hooks/useAnalysisData';
import { validateStep } from './utils/validation';
import ErrorBoundary from './components/ErrorBoundary';
import { getNgByCity, getCitiesByUf } from './data/ngByCity';
import { extractCityAndUf } from './utils/addressParser';
import CadWorkspacePreview from './components/tools/CadWorkspacePreview';
// FIX: Removed unused import from './lib/geminiService' which was causing a build error.
const MOBILE_STEP_NAMES: { [key: string]: string } = {
    "Informações do Projeto": "Proj. Info",
    "Componentes de Risco": "Comp. Risco",
    "Densidade de Descargas": "Dens. Desc.",
    "Características da Estrutura": "Carac. Estrut.",
    "Linhas Conectadas": "Linhas Conect.",
    "Eventos Danosos": "Ev. Danosos",
    "Probabilidade de Dano": "Prob. Dano",
    "Perda Consequente": "Perda Cons.",
    "Riscos Calculados": "Risc. Calc.",
    "Frequência de Danos": "Freq. Danos",
    "Conclusão e Relatório": "Conc. e Relat.",
    "Caixa de Ferramentas": "Ferramentas"
};

const SidebarNav = ({ currentStep, setStep }: { currentStep: number; setStep: (step: number) => void }) => {
    return (
        <div className="bg-slate-950/70 backdrop-blur-lg border border-slate-500/30 p-3 rounded-xl shadow-xl overflow-hidden font-['Outfit']">
            <div className="flex items-center gap-3 mb-3 px-1 pt-1">
                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/30 shrink-0">
                    <Calculator className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-sm font-bold text-slate-100 uppercase tracking-widest leading-none">
                        Análise de Risco
                    </h1>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-[0.2em] mt-1.5 opacity-80">NBR 5419-2</p>
                </div>
            </div>
            <nav className="space-y-1">
                {STEPS.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isActive = stepNumber === currentStep;
                    const isClickable = isCompleted;
                    const shouldShowCheck = isCompleted || (stepNumber === STEPS.length && isActive);

                    return (
                        <button
                            key={step}
                            onClick={() => isClickable && setStep(stepNumber)}
                            disabled={!isClickable}
                            className={`w-full text-left flex items-center gap-3 py-2 px-3 rounded-xl transition-all ${
                                isActive
                                    ? "bg-blue-600 text-white font-bold text-[13px] shadow-lg shadow-blue-900/30 ring-1 ring-blue-400"
                                    : isCompleted
                                    ? "text-slate-100 font-semibold text-[12px] hover:bg-slate-800/80 cursor-pointer"
                                    : "text-slate-600 text-[12px] cursor-not-allowed"
                            }`}
                        >
                            <div className="flex items-center justify-center w-5 h-5 shrink-0">
                                {shouldShowCheck ? (
                                    <CheckCircle className={`w-4 h-4 ${isActive ? 'text-white' : 'text-green-500/80'}`} />
                                ) : (
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isActive ? 'border-white/50' : 'border-slate-800'}`}>
                                        <span className={`${isActive ? 'text-white' : 'text-slate-800' } text-[9px] font-bold`}>
                                            {stepNumber}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <span className="truncate tracking-wide">{step}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

import { getRegionFromState } from './utils/geoUtils';
import VisitorCounter from './components/VisitorCounter';

// Função base para geração de senhas determinísticas
const generateSecurePassword = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0;
    }
    const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; 
    let pwd = "";
    for (let i = 0; i < 6; i++) {
        const charIdx = Math.abs((hash ^ (i * 1234567)) % charset.length);
        pwd += charset[charIdx];
    }
    return pwd;
};

const generateTrialPassword = () => {
    const now = new Date();
    const daysSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
    const trialPeriod = Math.floor(daysSinceEpoch / 2); // Reseta a cada 2 dias
    return generateSecurePassword(`TRIAL-${trialPeriod}-JULIO-2026`);
};

const generateMonthlyPassword = () => {
    const now = new Date();
    const monthSeed = `${now.getFullYear()}-${now.getMonth() + 1}`;
    return generateSecurePassword(`MONTHLY-${monthSeed}-JULIO-2026`);
};

const generateSemestralPassword = () => {
    const now = new Date();
    const year = now.getFullYear();
    const semester = now.getMonth() < 6 ? 1 : 2; 
    return generateSecurePassword(`SEMESTRAL-${year}-S${semester}-JULIO-2026`);
};

const generateAnnualPassword = () => {
    const now = new Date();
    return generateSecurePassword(`ANNUAL-${now.getFullYear()}-JULIO-2026`);
};



export default function App() {
    const isCadPreview = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('cad') !== null;
    
    // Autenticação: sempre exige senha ao recarregar (não usa localStorage de propósito para "sempre aparecer")
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [passwordInput, setPasswordInput] = React.useState("");
    const [authError, setAuthError] = React.useState(false);
    const [showAdminPanel, setShowAdminPanel] = React.useState(true);

    const passwords = React.useMemo(() => ({
        trial: generateTrialPassword(),
        month: generateMonthlyPassword(),
        semestral: generateSemestralPassword(),
        annual: generateAnnualPassword()
    }), []);

    const { data, updateData, loadProject } = useAnalysisData();
    const results = React.useMemo(() => data.calculations, [data.calculations]);

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        const input = passwordInput.trim();
        
        if (input === "Julio2014") {
            setIsAdmin(true);
            setIsAuthenticated(true);
            setAuthError(false);
            setShowAdminPanel(true); // Resetar ao logar
            return;
        }

        if (input === passwords.trial || input === passwords.month || input === passwords.semestral || input === passwords.annual) {
            setIsAdmin(false);
            setIsAuthenticated(true);
            setAuthError(false);
            return;
        }

        setAuthError(true);
    };

    const copyToClipboard = (text: string, label: string = 'Senha') => {
        navigator.clipboard.writeText(text);
        alert(`${label} copiada com sucesso!`);
    };
    const initialStep = React.useMemo(() => {
        try {
            const isBrowser = typeof window !== 'undefined';
            if (!isBrowser) return 1;
            const url = new URL(window.location.href);
            const fromQuery = url.searchParams.get('step');
            const fromHash = url.hash.startsWith('#step=') ? url.hash.replace('#step=', '') : null;
            const raw = fromQuery ?? fromHash ?? '1';
            const n = parseInt(raw, 10);
            if (!isNaN(n) && n >= 1 && n <= STEPS.length) return n;
            return 1;
        } catch {
            return 1;
        }
    }, []);
    const [currentStep, setCurrentStep] = React.useState(initialStep);
    // Removido: controle de loop por zona entre etapas 7 e 8
    const [errors, setErrors] = React.useState<string[]>([]);

    const [activeTooltipId, setActiveTooltipId] = React.useState<string | null>(null);

    const auditProviderValue = React.useMemo(() => ({
        auditMode: !!data.audit_mode,
        setAuditMode: (m: boolean) => updateData({ audit_mode: m }),
        activeTooltipId,
        setActiveTooltipId
    }), [data.audit_mode, updateData, activeTooltipId]);

    const handleNext = React.useCallback(async () => {
        try {
            const validationErrors = validateStep(currentStep, data);
            if (validationErrors.length > 0) {
                setErrors(validationErrors);
                return;
            }

            // Steps logic
            if (currentStep === 1) {
                // Address sync is now handled reactively in useAnalysisData.ts
            }

            // Garantir que dados necessários estejam inicializados para a etapa 3 (NgInputStep)
            if (currentStep === 2) {
                // Mantém visualização padrão como 'Brasil' se região não estiver definida
                if (!data.mapRegion) {
                    updateData({ mapRegion: 'brasil' });
                }
                if (!data.ng) {
                    updateData({ ng: 5 }); // Valor padrão
                }
            }

            // Removido: lógica de loop automático de zonas entre etapas 7 e 8.

            setErrors([]);
            if (currentStep < STEPS.length) setCurrentStep(prev => prev + 1);
        } catch (error) {
            console.error("Erro ao avançar para próxima etapa:", error);
            setErrors(["Ocorreu um erro ao avançar. Por favor, tente novamente."]);
        }
    }, [currentStep, data, updateData]);

    const handlePrev = React.useCallback(() => {
        setErrors([]);
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    }, [currentStep]);
    
    const setStep = React.useCallback((step: number) => {
        if (step > 0 && step <= STEPS.length) {
            setErrors([]);
            setCurrentStep(step);
        }
    }, []);

    // Sincroniza a etapa atual com a URL para permitir deep-linking (?step=11)
    React.useEffect(() => {
        try {
            const isBrowser = typeof window !== 'undefined';
            if (!isBrowser) return;
            const url = new URL(window.location.href);
            url.searchParams.set('step', String(currentStep));
            window.history.replaceState(null, '', url.toString());
        } catch (_) {
            // silencioso
        }
    }, [currentStep]);

    const renderStep = React.useMemo(() => {
        try {
            switch (currentStep) {
                case 1: return (
                    <ProjectInfoStep 
                        data={data} 
                        onUpdate={updateData} 
                        onLoadProject={loadProject}
                        isAdmin={isAdmin}
                        showAdminPanel={showAdminPanel}
                        setShowAdminPanel={setShowAdminPanel}
                        passwords={passwords}
                        copyToClipboard={copyToClipboard}
                    />
                );
                case 2: return <RiskComponentsSelection data={data} onChange={updateData} />;
                case 3: return <NgInputStep data={data} onUpdate={updateData} />;
                case 4: return <Step1Input data={data} onUpdate={updateData} />;
                case 5: return <ConnectedLinesStep data={data} onUpdate={updateData} />;
                case 6: return <Step3Events data={data} />;
                case 7: return <ProbabilityStep data={data} onChange={updateData} />;
                case 8: return <LossStep data={data} onChange={updateData} />;
                case 9: return <RiskResultsStep data={data} onUpdate={updateData} />;
                case 10: return <FrequencyConfigStep data={data} onUpdate={updateData} />;
                case 11: return <ReportStep data={data} onUpdate={updateData} />;
                case 12: return <ToolboxStep />;
                default: return <div className="p-6 bg-slate-800 rounded-lg">
                    <h2 className="text-xl font-bold text-slate-100 mb-4">Etapa não encontrada</h2>
                    <p className="text-slate-300">Por favor, retorne à etapa anterior e tente novamente.</p>
                </div>;
            }
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error("Erro ao renderizar etapa:", error);
            }
            return <div className="p-6 bg-slate-800 rounded-lg">
                <h2 className="text-xl font-bold text-red-400 mb-4">Erro ao carregar esta etapa</h2>
                <p className="text-slate-300">Ocorreu um erro ao carregar esta etapa. Por favor, tente retornar à etapa anterior.</p>
            </div>;
        }
    }, [currentStep, data, updateData, isAdmin, showAdminPanel, setShowAdminPanel, passwords, copyToClipboard]);

    if (isCadPreview) {
        return <CadWorkspacePreview />;
    }

    if (!isAuthenticated) {
        return (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-2 bg-[url('https://i.imgur.com/vdpG5uQ.jpeg')] bg-cover bg-center">
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"></div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-full max-w-[460px] bg-slate-950/50 backdrop-blur-xl border border-white/10 rounded-[1.8rem] shadow-[0_0_100px_-20px_rgba(59,130,246,0.4)] overflow-hidden flex flex-col"
                >
                    {/* Header Ultra-Compacto */}
                    <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-3 text-center border-b border-white/10 shrink-0">
                        <div className="flex items-center justify-center gap-3">
                            <div className="relative w-9 h-9 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                                <Calculator className="w-5 h-5 text-white" />
                                <div className="absolute -bottom-1.5 -right-1.5 bg-blue-700 rounded-full p-[2px] shadow-md border border-white/10">
                                    <Settings className="w-3.5 h-3.5 text-blue-100" />
                                </div>
                            </div>
                            <div className="text-left leading-tight">
                                <h2 className="text-xl font-bold text-white tracking-wider uppercase">Controle de Acesso</h2>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 space-y-3.5 flex-1 overflow-hidden">
                        <div className="text-center py-2 space-y-1.5">
                            <h3 className="text-blue-200 text-[13px] font-black uppercase tracking-[0.15em] leading-tight drop-shadow-md">
                                <span className="hidden sm:inline">Plataforma </span>Análise de Risco NBR 5419-2 2026
                            </h3>
                            <p className="text-slate-200 text-[9.5px] font-bold uppercase tracking-widest leading-none">
                                Engº Júlio César Certo <span className="text-slate-400 mx-1">—</span> <span className="text-blue-400 font-black">Especialista em PDA</span>
                            </p>
                        </div>

                        {/* Seção 1: Login Form */}
                        <form onSubmit={handleAuth} className="py-2.5">
                            <div className="flex flex-col gap-2">
                                <label className="text-[9.5px] uppercase font-bold tracking-widest text-slate-400 px-1 flex justify-between leading-none">
                                    <span>Senha de Acesso</span>
                                    {authError && <span className="text-red-400/80 text-[8px] tracking-normal font-semibold">Acesso Negado</span>}
                                </label>
                                <div className="flex gap-3 items-center">
                                    <input 
                                        type="password"
                                        value={passwordInput}
                                        onChange={(e) => setPasswordInput(e.target.value)}
                                        placeholder="••••••••"
                                        className={`flex-1 min-w-0 h-12 bg-slate-950 border ${authError ? 'border-red-500/30' : 'border-slate-800 focus:border-blue-500/30'} rounded-xl px-4 text-white text-center text-xl tracking-[0.3em] outline-none transition-all placeholder:tracking-normal placeholder:text-slate-800 font-mono`}
                                        autoFocus
                                    />
                                    <button 
                                        type="submit" 
                                        className="shrink-0 px-6 h-12 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-widest text-[10px] rounded-xl transition-all active:scale-95 uppercase whitespace-nowrap leading-none shadow-lg shadow-blue-900/20 group"
                                    >
                                        Entrar no App
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </form>



                        <div className="opacity-40 hover:opacity-100 transition-opacity duration-500">
                            {/* Seção 2: Planos com Cores Progressivas */}
                            <div className="grid grid-cols-3 gap-1.5 py-1">
                            {/* Mensal: Mais sóbrio/discreto */}
                            <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-2 sm:p-3 flex flex-col gap-0.5 sm:gap-1 shadow-inner relative overflow-hidden group">
                                <span className="text-[7.5px] sm:text-[8.5px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap leading-none">Plano Mensal</span>
                                <div className="flex items-baseline gap-0.5 sm:gap-1">
                                    <span className="text-[9px] sm:text-[11px] font-bold text-slate-600 uppercase leading-none">R$</span>
                                    <span className="text-lg sm:text-2xl font-bold text-slate-300 tracking-tight leading-none">50,00</span>
                                </div>
                            </div>
                            
                            {/* Semestral: Intermediário */}
                            <div className="bg-blue-900/10 border border-blue-500/10 rounded-xl p-2 sm:p-3 flex flex-col gap-0.5 sm:gap-1 shadow-inner relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
                                <span className="text-[7.5px] sm:text-[8.5px] font-bold text-blue-400/70 uppercase tracking-widest whitespace-nowrap leading-none relative z-10">Premium Semestral</span>
                                <div className="flex items-baseline gap-0.5 sm:gap-1 relative z-10">
                                    <span className="text-[9px] sm:text-[11px] font-bold text-blue-500/50 uppercase leading-none">R$</span>
                                    <span className="text-lg sm:text-2xl font-bold text-blue-100 tracking-tight leading-none">200,00</span>
                                </div>
                            </div>

                            {/* Anual: O mais convidativo/chamativo */}
                            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-2 sm:p-3 flex flex-col gap-0.5 sm:gap-1 shadow-[0_0_15px_-5px_rgba(16,185,129,0.4)] relative overflow-hidden group ring-1 ring-emerald-500/30">
                                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-teal-500/10 pointer-events-none" />
                                <span className="text-[7.5px] sm:text-[8.5px] font-bold text-emerald-400 uppercase tracking-widest whitespace-nowrap leading-none relative z-10">Especial Anual</span>
                                <div className="flex items-baseline gap-0.5 sm:gap-1 relative z-10">
                                    <span className="text-[9px] sm:text-[11px] font-bold text-emerald-500 uppercase leading-none font-black">R$</span>
                                    <span className="text-lg sm:text-2xl font-black text-white tracking-tight leading-none">300,00</span>
                                </div>
                                <div className="absolute -right-2 -top-2 w-10 h-10 bg-emerald-500/20 blur-xl rounded-full group-hover:bg-emerald-500/40 transition-all" />
                            </div>
                        </div>

                        {/* Seção 3: CPF PIX (Logo abaixo dos Planos) */}
                        <div className="bg-slate-950/40 border border-slate-800/50 rounded-xl p-3 space-y-2 my-1">
                            <div className="flex items-center gap-2 text-slate-400 px-1 leading-none">
                                <CheckCircle className="w-3 h-3 text-emerald-400" />
                                <p className="text-[8.5px] font-bold uppercase tracking-widest leading-tight text-slate-300">Depósito PIX — Envie o Comprovante - Whatsapp (35) 9 8811-3746</p>
                            </div>
                            
                            <div 
                                onClick={() => copyToClipboard('04727277611', 'Chave PIX')}
                                className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center cursor-pointer hover:bg-slate-900 hover:border-slate-700 transition-all border-dashed group active:scale-[0.98] flex flex-col items-center justify-center gap-1.5"
                            >
                                <p className="text-[8.5px] font-bold text-blue-400/70 uppercase tracking-widest group-hover:text-blue-400 transition-colors italic leading-none">PIX CPF - JÚLIO CESAR CERTO</p>
                                <div className="flex items-center gap-2 text-slate-300 group-hover:text-white transition-colors">
                                    <span className="text-xl font-medium tracking-widest font-mono">047.272.776-11</span>
                                    <Copy className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                                </div>
                            </div>

                            <p className="text-[9.5px] text-slate-300 font-bold italic text-center px-1 leading-normal">
                                * Valor referente ao acesso à ferramenta. Assessorias e Projetos à combinar.
                            </p>
                        </div>
                        </div>

                        <div className="py-2 opacity-40 hover:opacity-100 transition-opacity duration-500">
                            {/* Seção 4: Links de Apoio (Tutorial e WhatsApp) */}
                            <div className="grid grid-cols-2 gap-2">
                                <a 
                                    href="https://www.youtube.com/watch?v=NpSiWh-LiOk&t=131s" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-slate-950/40 border border-slate-800 rounded-xl p-2 px-3 flex flex-row items-center justify-center gap-2.5 transition-all hover:bg-red-500/10 hover:border-red-500/30 group shadow-lg"
                                >
                                    <div className="p-2 bg-red-500/20 rounded-lg group-hover:bg-red-500/30 transition-colors">
                                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-red-400 group-hover:scale-110 transition-transform" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505a3.017 3.017 0 00-2.122 2.136C0 8.055 0 12 0 12s0 3.945.501 5.814a3.017 3.017 0 002.122 2.136c1.872.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.945 24 12 24 12s0-3.945-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                        </svg>
                                    </div>
                                    <span className="font-black text-[9.5px] text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors">Tutorial</span>
                                </a>

                                <a 
                                    href="https://chat.whatsapp.com/IawpsONjvohHjlE8Yhwe9s" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-slate-950/40 border border-slate-800 rounded-xl p-2 px-3 flex flex-row items-center justify-center gap-2.5 transition-all hover:bg-emerald-500/10 hover:border-emerald-500/30 group shadow-lg"
                                >
                                    <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-emerald-400 group-hover:scale-110 transition-transform" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                        </svg>
                                    </div>
                                    <span className="font-black text-[9.5px] text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors">Comunidade</span>
                                </a>
                            </div>
                        </div>

                    </div>

                    <div className="bg-slate-950/90 px-8 py-2.5 border-t border-slate-800 text-[8px] text-slate-600 flex justify-between items-center shrink-0 leading-none">
                        <span className="uppercase tracking-widest font-bold">Direitos Reservados</span>
                        <span className="font-black">2026 @ SPDA</span>
                    </div>
                </motion.div>
                <VisitorCounter />
            </div>
        );
    }

    return (
        <AuditProvider value={auditProviderValue}>
            <div className="min-h-screen bg-[url('https://i.imgur.com/vdpG5uQ.jpeg')] bg-cover bg-fixed bg-center selection:bg-blue-500/30 overflow-x-hidden overflow-y-auto">
                <div className="w-full flex justify-center py-1 px-1">
                    <div className="w-full md:w-[1100px] lg:w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-[256px_1fr] lg:grid-cols-[288px_1fr] gap-3 items-start pt-2 pb-2 px-4">
                        <aside className="hidden md:block">
                            <div className="sticky top-2 w-full flex flex-col gap-2 pb-2">
                                <SidebarNav currentStep={currentStep} setStep={setStep}/>
                                <div className="flex items-center gap-2 pt-2 border-t border-slate-700/30">
                                    <Button
                                        variant="outline"
                                        onClick={handlePrev}
                                        disabled={currentStep === 1}
                                        className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold rounded-xl hover:bg-slate-800/80 transition-all border-slate-700/50 min-h-[40px] flex-1"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        <span className="uppercase tracking-widest text-[11px]">Anterior</span>
                                    </Button>
                                    <Button
                                        onClick={handleNext}
                                        disabled={currentStep === STEPS.length}
                                        className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold bg-blue-600 hover:bg-blue-500 rounded-xl shadow-xl shadow-blue-500/20 transition-all border-none min-h-[40px] flex-[1.5]"
                                    >
                                        <span className="uppercase tracking-widest text-[11px]">{currentStep === STEPS.length ? "Finalizar" : "Próximo"}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </aside>

                        <main className="flex-1 min-w-0 max-w-full">
                            {/* Cabeçalho móvel: visível apenas no celular */}
                            <div className="md:hidden mb-3 bg-slate-950/70 backdrop-blur-lg border border-slate-500/40 p-2.5 px-3.5 rounded-xl shadow-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/20">
                                        <Calculator className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline gap-2">
                                            <h1 className="text-[15px] font-black text-slate-100 uppercase tracking-wider">Análise de Risco</h1>
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-70">NBR 5419-2</span>
                                        </div>
                                        <div className="mt-0.5 flex items-center gap-2">
                                            <span className="px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-tighter whitespace-nowrap border border-blue-500/10">
                                                Et. {currentStep} de {STEPS.length}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                                                {MOBILE_STEP_NAMES[STEPS[currentStep - 1]] || STEPS[currentStep - 1]}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Alertas */}
                            <div className="hidden md:block">
                                <AnimatePresence>
                                {errors.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="mb-6"
                                    >
                                        <Alert variant="destructive">
                                            <AlertTriangle className="h-5 w-5 mr-2 text-red-300" />
                                            <AlertTitle>Por favor, corrija os seguintes erros:</AlertTitle>
                                            <AlertDescription>
                                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                                    {errors.map((error, i) => <li key={i}>{error}</li>)}
                                                </ul>
                                            </AlertDescription>
                                        </Alert>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </div>

                            {/* Convites e Conteúdo */}



                            <div className="min-h-full max-md:pb-[calc(56px+env(safe-area-inset-bottom))]">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentStep}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.25, ease: "easeOut" }}
                                    >
                                        <ErrorBoundary variant="inline">
                                            {renderStep}
                                        </ErrorBoundary>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Barra de navegação móvel */}
                            <div className="md:hidden fixed left-0 right-0 z-50 shadow-2xl" style={{ bottom: 'env(safe-area-inset-bottom)' }}>
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[80px]" style={{ background: 'linear-gradient(to top, rgba(2,6,23,0.95), rgba(2,6,23,0))' }} />
                                <div className="mx-auto max-w-7xl px-3 pb-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={handlePrev}
                                            disabled={currentStep === 1}
                                            className="flex items-center gap-2 w-full h-12 text-base"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Anterior
                                        </Button>
                                        <Button
                                            onClick={handleNext}
                                            disabled={currentStep === STEPS.length}
                                            className="flex items-center gap-2 w-full h-12 text-base"
                                        >
                                            {currentStep === STEPS.length ? "Finalizar" : "Próximo"}
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </AuditProvider>
    );
}
