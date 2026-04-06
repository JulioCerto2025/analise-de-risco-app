import React, { useState, useMemo, useCallback, useEffect } from "react";
import { ArrowRight, ArrowLeft, Calculator, CheckCircle, AlertTriangle, MessageCircle, Users, ShieldCheck, Copy, ShieldAlert, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Alert, AlertDescription, AlertTitle } from "./components/ui";
import { Step1Input } from './components/analysis/Step1Input';
import { NgInputStep } from './components/analysis/NgInputStep';
const ConnectedLinesStepLazy = React.lazy(() => import('./components/analysis/ConnectedLinesStep').then(m => ({ default: m.ConnectedLinesStep })));
const Step3EventsLazy = React.lazy(() => import('./components/analysis/Step3Events').then(m => ({ default: m.Step3Events })));
import { RiskComponentsSelection } from './components/analysis/RiskComponentsSelection';
const ProbabilityStepLazy = React.lazy(() => import('./components/analysis/ProbabilityStep').then(m => ({ default: m.ProbabilityStep })));
import { LossStep } from './components/analysis/LossStep';
const RiskResultsStepLazy = React.lazy(() => import('./components/analysis/RiskResultsStep').then(m => ({ default: m.RiskResultsStep })));
const ReportStepLazy = React.lazy(() => import('./components/analysis/ReportStep').then(m => ({ default: m.ReportStep })));
const FrequencyConfigStepLazy = React.lazy(() => import('./components/analysis/FrequencyConfigStep').then(m => ({ default: m.FrequencyConfigStep })));
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

const SidebarNav = ({ currentStep, setStep }: { currentStep: number; setStep: (step: number) => void }) => {
    return (
        <div className="bg-slate-950/70 backdrop-blur-lg border border-slate-500/30 p-3 rounded-xl shadow-2xl overflow-hidden font-['Outfit']">
            <div className="flex items-center gap-3 mb-5 px-1 pt-1">
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

const getRegionFromState = (stateUF: string = ''): string => {
    const uf = stateUF.toUpperCase();
    if (['GO', 'MT', 'MS', 'DF'].includes(uf)) return 'centro-oeste';
    if (['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'].includes(uf)) return 'nordeste';
    if (['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'].includes(uf)) return 'norte';
    if (['ES', 'MG', 'RJ', 'SP'].includes(uf)) return 'sudeste';
    if (['PR', 'RS', 'SC'].includes(uf)) return 'sul';
    return 'sudeste'; // Default fallback
};


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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [authError, setAuthError] = useState(false);
    const [showAdminPanel, setShowAdminPanel] = useState(true);

    const passwords = useMemo(() => ({
        trial: generateTrialPassword(),
        month: generateMonthlyPassword(),
        semestral: generateSemestralPassword(),
        annual: generateAnnualPassword()
    }), []);

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
    const initialStep = useMemo(() => {
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
    const [currentStep, setCurrentStep] = useState(initialStep);
    // Removido: controle de loop por zona entre etapas 7 e 8
    const { data, updateData } = useAnalysisData();
    const [errors, setErrors] = useState<string[]>([]);

    const handleNext = useCallback(async () => {
        try {
            const validationErrors = validateStep(currentStep, data);
            if (validationErrors.length > 0) {
                setErrors(validationErrors);
                return;
            }

            if (currentStep === 1) {
                const address = data.clientAddress || '';
                const parsed = extractCityAndUf(address);

                if (parsed) {
                    const { city: parsedCity, uf: parsedUf } = parsed;

                    // Resolver cidade ignorando bairro, usando lista oficial de cidades do UF para garantir precisão
                    const normalize = (s: string) => (s || '')
                        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                        .toLowerCase().replace(/[.,/]/g, ' ')
                        .replace(/\s+/g, ' ').trim();
                    
                    let city = (parsedCity || '').trim();
                    try {
                        const cities = await getCitiesByUf(parsedUf);
                        const rawNorm = normalize(parsedCity);
                        let best: string | null = null;
                        for (const c of cities) {
                            const cn = normalize(c);
                            // Verificação de match exato ou parcial para suportar variações na digitação
                            if (rawNorm === cn || rawNorm.endsWith(cn) || rawNorm.includes(' ' + cn) || rawNorm.startsWith(cn + ' ')) {
                                if (!best || normalize(best).length < cn.length) best = c;
                            }
                        }
                        if (best) city = best;
                    } catch (_) {
                        // mantém o que foi extraído originalmente se falhar o carregamento
                    }

                    // Buscar Ng pela cidade/UF e preencher a etapa de densidade de descarga
                    let nextNg = (typeof data.ng === 'number' && data.ng > 0) ? data.ng : 18; 
                    try {
                        const preset = await getNgByCity(parsedUf, city);
                        if (typeof preset === 'number' && preset > 0) {
                            nextNg = preset;
                        }
                    } catch (_) { /* fallback safe */ }

                    updateData({
                        location: `${city} - ${parsedUf}`,
                        ng: nextNg
                    });
                }
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

    const handlePrev = useCallback(() => {
        setErrors([]);
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    }, [currentStep]);
    
    const setStep = useCallback((step: number) => {
        if (step > 0 && step <= STEPS.length) {
            setErrors([]);
            setCurrentStep(step);
        }
    }, []);

    // Sincroniza a etapa atual com a URL para permitir deep-linking (?step=11)
    useEffect(() => {
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

    const renderStep = useMemo(() => {
        try {
            switch (currentStep) {
                case 1: return (
                    <ProjectInfoStep 
                        data={data} 
                        onUpdate={updateData} 
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
                case 5: return (
                    <React.Suspense fallback={<div className="p-6 text-slate-300">Carregando etapa...</div>}>
                        <ConnectedLinesStepLazy data={data} onUpdate={updateData} />
                    </React.Suspense>
                );
                case 6: return (
                    <React.Suspense fallback={<div className="p-6 text-slate-300">Carregando etapa...</div>}>
                        <Step3EventsLazy data={data} />
                    </React.Suspense>
                );
                case 7: return (
                    <React.Suspense fallback={<div className="p-6 text-slate-300">Carregando etapa...</div>}>
                        <ProbabilityStepLazy data={data} onChange={updateData} />
                    </React.Suspense>
                );
                case 8: return <LossStep data={data} onChange={updateData} />;
                case 9: return (
                    <React.Suspense fallback={<div className="p-6 text-slate-300">Carregando etapa...</div>}>
                        <RiskResultsStepLazy data={data} onUpdate={updateData} />
                    </React.Suspense>
                );
                case 10: return (
                    <React.Suspense fallback={<div className="p-6 text-slate-300">Carregando etapa...</div>}>
                        <FrequencyConfigStepLazy data={data} onUpdate={updateData} />
                    </React.Suspense>
                );
                case 11: return (
                    <React.Suspense fallback={<div className="p-6 text-slate-300">Carregando etapa...</div>}>
                        <ReportStepLazy data={data} onUpdate={updateData} />
                    </React.Suspense>
                );
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
                            <div className="w-9 h-9 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                                <Calculator className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left leading-tight">
                                <h2 className="text-xl font-bold text-white tracking-wider uppercase">Controle de Acesso</h2>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 space-y-3.5 flex-1 overflow-hidden">
                        <div className="text-center py-2 space-y-1.5">
                            <h3 className="text-blue-400 text-[13px] font-black uppercase tracking-[0.15em] leading-tight drop-shadow-sm">
                                Plataforma Análise de Risco NBR 5419-2 2026
                            </h3>
                            <p className="text-slate-400 text-[9.5px] font-bold uppercase tracking-widest leading-none opacity-80">
                                Engº Júlio César Certo <span className="text-slate-600 mx-1">—</span> <span className="text-blue-500/60">Especialista em PDA</span>
                            </p>
                        </div>

                        {/* Seção 1: Planos com Cores Progressivas */}
                        <div className="grid grid-cols-3 gap-2 py-1">
                            {/* Mensal: Mais sóbrio/discreto */}
                            <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-3 flex flex-col gap-1 shadow-inner relative overflow-hidden group">
                                <span className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap leading-none">Plano Mensal</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-[11px] font-bold text-slate-600 uppercase leading-none">R$</span>
                                    <span className="text-2xl font-bold text-slate-300 tracking-tight leading-none">50,00</span>
                                </div>
                            </div>
                            
                            {/* Semestral: Intermediário */}
                            <div className="bg-blue-900/10 border border-blue-500/10 rounded-xl p-3 flex flex-col gap-1 shadow-inner relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
                                <span className="text-[8.5px] font-bold text-blue-400/70 uppercase tracking-widest whitespace-nowrap leading-none relative z-10">Premium Semestral</span>
                                <div className="flex items-baseline gap-1 relative z-10">
                                    <span className="text-[11px] font-bold text-blue-500/50 uppercase leading-none">R$</span>
                                    <span className="text-2xl font-bold text-blue-100 tracking-tight leading-none">200,00</span>
                                </div>
                            </div>

                            {/* Anual: O mais convidativo/chamativo */}
                            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 flex flex-col gap-1 shadow-[0_0_15px_-5px_rgba(16,185,129,0.4)] relative overflow-hidden group ring-1 ring-emerald-500/30">
                                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-teal-500/10 pointer-events-none" />
                                <span className="text-[8.5px] font-bold text-emerald-400 uppercase tracking-widest whitespace-nowrap leading-none relative z-10">Especial Anual</span>
                                <div className="flex items-baseline gap-1 relative z-10">
                                    <span className="text-[11px] font-bold text-emerald-500 uppercase leading-none font-black">R$</span>
                                    <span className="text-2xl font-black text-white tracking-tight leading-none">300,00</span>
                                </div>
                                <div className="absolute -right-2 -top-2 w-10 h-10 bg-emerald-500/20 blur-xl rounded-full group-hover:bg-emerald-500/40 transition-all" />
                            </div>
                        </div>

                        {/* Seção 2: CPF PIX (Logo abaixo dos Planos) */}
                        <div className="bg-slate-950/40 border border-slate-800/50 rounded-xl p-3 space-y-2 my-1">
                            <div className="flex items-center gap-2 text-slate-400 px-1 leading-none">
                                <CheckCircle className="w-3 h-3 text-emerald-400" />
                                <p className="text-[8.5px] font-bold uppercase tracking-widest leading-none text-slate-300 whitespace-nowrap">Depósito PIX — Envie o Comprovante - Whatsapp 35 9 8811-3746</p>
                            </div>
                            
                            <div 
                                onClick={() => copyToClipboard('04727277611', 'Chave PIX')}
                                className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center cursor-pointer hover:bg-slate-900 transition-all border-dashed group active:scale-[0.98]"
                            >
                                <p className="text-[8.5px] font-bold text-blue-400/70 uppercase tracking-widest mb-1.5 group-hover:text-blue-400/90 transition-colors italic leading-none">PIX CPF - JÚLIO CESAR CERTO</p>
                                <span className="text-[1.65rem] font-bold text-white tracking-widest block leading-none">047.272.776-11</span>
                            </div>

                            <p className="text-[9.5px] text-slate-300 font-bold italic text-center px-1 leading-normal whitespace-nowrap">
                                * Valor referente ao acesso à ferramenta. Assessorias e Projetos à combinar.
                            </p>
                        </div>

                        {/* Seção 3: Login Form */}
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
                                        className="shrink-0 px-6 h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-widest text-[10px] rounded-xl transition-all active:scale-95 uppercase whitespace-nowrap leading-none shadow-lg shadow-blue-900/20"
                                    >
                                        Entrar no App
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Seção 4: Botões Tutorial e Suporte */}
                        <div className="grid grid-cols-2 gap-2 py-1">
                            <a 
                                href="https://www.youtube.com/watch?v=NpSiWh-LiOk&t=131s" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-slate-950/40 border border-slate-800 rounded-xl p-2 flex flex-col items-center gap-1 transition-all hover:bg-red-500/10 group"
                            >
                                <Users className="w-5 h-5 text-red-500/60" />
                                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-red-400 leading-none">Tutorial</span>
                            </a>
                            <a 
                                href="https://wa.me/5535988113746" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-slate-950/40 border border-slate-800 rounded-xl p-3 flex flex-col items-center gap-1 transition-all hover:bg-emerald-500/10 group"
                            >
                                <MessageCircle className="w-5 h-5 text-emerald-500/60" />
                                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-emerald-400 leading-none">WhatsApp</span>
                            </a>
                        </div>

                        {/* Seção 5: Banner Comunidade */}
                        <a 
                            href="https://chat.whatsapp.com/IawpsONjvohHjlE8Yhwe9s" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex flex-col items-center gap-1 transition-all group my-1"
                        >
                            <div className="flex items-center gap-2.5 leading-none">
                                <Users className="w-4 h-4 text-emerald-400/80" />
                                <span className="text-[10.5px] font-bold text-emerald-400/90 uppercase tracking-wider">Comunidade PDA</span>
                            </div>
                            <p className="text-[10px] text-slate-300 font-medium text-center leading-none mt-1">
                                Troca de informações e ajuda mútua entre usuários do app.
                            </p>
                        </a>
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
        <div className="min-h-screen bg-[url('https://i.imgur.com/vdpG5uQ.jpeg')] bg-cover bg-fixed bg-center selection:bg-blue-500/30 overflow-x-hidden overflow-y-auto">
            <div className="w-full flex justify-center py-2 px-1">
                <div className="w-full md:w-[1100px] lg:w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-[256px_1fr] lg:grid-cols-[288px_1fr] gap-4 items-start pt-6 pb-6 px-4">
                <aside className="hidden md:block">
                    <div className="sticky top-6 w-full flex flex-col gap-4 pb-4">
                        <SidebarNav currentStep={currentStep} setStep={setStep}/>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            <Button
                                variant="outline"
                                onClick={handlePrev}
                                disabled={currentStep === 1}
                                className="flex items-center gap-2 h-12 rounded-2xl border-slate-700/50 hover:bg-slate-800 text-[10.5px] font-bold uppercase tracking-widest text-slate-400 group"
                            >
                                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                                Anterior
                            </Button>
                            
                            <Button
                                onClick={handleNext}
                                onClickCapture={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                disabled={currentStep === STEPS.length}
                                className="flex items-center justify-center gap-2 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.12em] shadow-xl shadow-blue-900/40 group active:scale-95 transition-all"
                            >
                                {currentStep === STEPS.length ? "Finalizar" : "Próximo"}
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 min-w-0 max-w-full">
                    {/* Cabeçalho móvel: visível apenas no celular */}
                    <div className="md:hidden mb-4 bg-slate-950/70 backdrop-blur-lg border border-slate-500/50 p-4 rounded-lg shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                                <Calculator className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-base font-bold text-slate-100">Análise de Risco</h1>
                                <p className="text-xs text-slate-400">NBR 5419-2</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-md bg-blue-500/30 text-blue-300 text-xs font-semibold">
                                        Etapa {currentStep} de {STEPS.length}
                                    </span>
                                    <span className="text-xs text-slate-300">
                                        {STEPS[currentStep - 1]}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Texto do desenvolvedor removido conforme solicitado */}
                    </div>
                    {/* Alertas: ocultos no mobile para mostrar apenas cabeçalho + etapa */}
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
                    <div className="min-h-full md:pb-0" style={{ paddingBottom: 'calc(56px + env(safe-area-inset-bottom))' }}>
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
                    {/* Barra de navegação móvel fixa com respeito ao safe-area e leve fundo */}
                    <div className="md:hidden fixed left-0 right-0 z-50" style={{ bottom: 'env(safe-area-inset-bottom)' }}>
                        {/* Fundo sutil para evitar faixa branca ao tocar o final */}
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
    );
}
