import React, { useState, useMemo, useCallback, useEffect } from "react";
import { ArrowRight, ArrowLeft, Calculator, CheckCircle, AlertTriangle, MessageCircle } from "lucide-react";
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
import { STEPS } from "./constants";
import { AnalysisData, AnalysisInputData } from './types';
import { useAnalysisData } from './hooks/useAnalysisData';
import { validateStep } from './utils/validation';
import ErrorBoundary from './components/ErrorBoundary';
import { getNgByCity, getCitiesByUf } from './data/ngByCity';
// FIX: Removed unused import from './lib/geminiService' which was causing a build error.

const SidebarNav = ({ currentStep, setStep }: { currentStep: number; setStep: (step: number) => void }) => {
    return (
        <div className="bg-slate-950/70 backdrop-blur-lg border border-slate-500/50 p-4 rounded-lg shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-slate-100">
                        Análise de Risco
                    </h1>
                    <p className="text-sm text-slate-400">NBR 5419-2</p>
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
                            className={`w-full text-left flex items-center gap-3 p-2.5 rounded-md transition-colors text-base ${
                                isActive
                                    ? "bg-blue-500/30 text-blue-300 font-semibold"
                                    : isCompleted
                                    ? "text-slate-200 font-semibold hover:bg-slate-700/60 cursor-pointer"
                                    : "text-slate-400 cursor-not-allowed"
                            }`}
                        >
                            <div className="flex items-center justify-center w-6 h-6">
                                {shouldShowCheck ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isActive ? 'border-blue-500' : 'border-slate-500'}`}>
                                        <span className={`${isActive ? 'text-blue-300 font-bold' : 'text-slate-400' } text-xs`}>
                                            {stepNumber}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <span>{step}</span>
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


export default function App() {
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
                // Aceita formatos ao final do endereço como:
                // "Cidade/UF", "Cidade - UF", "Cidade, UF" e "Cidade UF" (UF ao final)
                const matchWithSlash = address.match(/^(.*)\s\/\s([A-Z]{2})$/i);
                const matchWithHyphen = address.match(/^(.*)\s-\s([A-Z]{2})$/i);
                const matchWithComma = address.match(/^(.*),\s*([A-Z]{2})$/i);
                const matchWithSpace = address.match(/^(.*)\s([A-Z]{2})$/i);

                if (matchWithSlash || matchWithHyphen || matchWithComma || matchWithSpace) {
                    const rawCityPart = (matchWithSlash?.[1] || matchWithHyphen?.[1] || matchWithComma?.[1] || matchWithSpace?.[1] || '').trim();
                    const uf = (matchWithSlash?.[2] || matchWithHyphen?.[2] || matchWithComma?.[2] || matchWithSpace?.[2] || '').toUpperCase();

                    // Resolver cidade ignorando bairro, usando lista oficial de cidades do UF
                    const normalize = (s: string) => (s || '')
                        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                        .toLowerCase().replace(/[.,]/g, ' ')
                        .replace(/\s+/g, ' ').trim();
                    let city = (rawCityPart || '').trim();
                    try {
                        const cities = await getCitiesByUf(uf);
                        const rawNorm = normalize(rawCityPart);
                        let best: string | null = null;
                        for (const c of cities) {
                            const cn = normalize(c);
                            if (rawNorm === cn || rawNorm.endsWith(cn) || rawNorm.includes(' ' + cn) || rawNorm.startsWith(cn + ' ')) {
                                if (!best || normalize(best).length < cn.length) best = c;
                            }
                        }
                        if (best) city = best;
                        else if (/[-–—]/.test(rawCityPart)) city = rawCityPart.split(/[-–—]/).pop()!.trim();
                        else if (/,/.test(rawCityPart)) city = rawCityPart.split(',').pop()!.trim();
                    } catch (_) {
                        // fallback simples se lista não carregar
                        city = (rawCityPart.split(/\s-\s/).pop() || rawCityPart).trim();
                    }
                    const region = getRegionFromState(uf);

                    // Sanitiza apenas o caso com hífen antes de barra; demais formatos mantêm original
                    const sanitizedAddress = matchWithSlash ? address.replace(/\s-\s(?=[^,]*\/[A-Z]{2}$)/, '  ') : address;

                    // Buscar Ng pela cidade/UF e preencher Etapa 3 automaticamente
                    let nextNg = (typeof data.ng === 'number' && data.ng > 0) ? data.ng : 18; // fallback
                    try {
                        const preset = await getNgByCity(uf, city);
                        if (typeof preset === 'number' && preset > 0) {
                            nextNg = preset;
                        }
                    } catch (_) { /* ignora erro e usa fallback */ }

                    // Não altera automaticamente a região do mapa.
                    // O mapa deve permanecer em 'Brasil' até o usuário escolher outra região.
                    updateData({
                        location: `${city} - ${uf}`,
                        clientAddress: sanitizedAddress,
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
                case 1: return <ProjectInfoStep data={data} onUpdate={updateData} />;
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
    }, [currentStep, data, updateData]);

    return (
        <>
            <div className="min-h-screen p-3 sm:p-4 md:p-6" style={{ minHeight: '100svh' }}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-stretch">
                <aside className="hidden md:block md:w-64 lg:w-72 flex-shrink-0">
                    <div className="sticky top-4 flex flex-col gap-4">
                        <SidebarNav currentStep={currentStep} setStep={setStep}/>
                        {/* Ações rápidas do projeto removidas conforme solicitação */}
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant="outline"
                                onClick={handlePrev}
                                disabled={currentStep === 1}
                                className="flex items-center gap-2 w-full"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Anterior
                            </Button>
                            
                            <Button
                                onClick={handleNext}
                                disabled={currentStep === STEPS.length}
                                className="flex items-center gap-2 w-full"
                            >
                                {currentStep === STEPS.length ? "Finalizar" : "Próximo"}
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </aside>

                <main className="flex-1">
                    {/* Convite — Comunidade SPDA (WhatsApp) */}
                    <div className="mb-4 rounded-lg border border-green-600/50 bg-green-900/30 p-4 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-600/80 rounded-lg flex items-center justify-center shadow">
                                <MessageCircle className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm sm:text-base font-semibold text-green-100">Convite: Comunidade SPDA (WhatsApp)</div>
                                <p className="text-xs sm:text-sm text-green-200/90">Participe do grupo para aprender, tirar dúvidas e compartilhar experiências.</p>
                            </div>
                            <a
                                href="https://chat.whatsapp.com/IawpsONjvohHjlE8Yhwe9s"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-green-600 text-white hover:bg-green-700 h-10 px-4 py-2"
                            >
                                Entrar no grupo
                            </a>
                        </div>
                    </div>
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
                    <div className="min-h-full md:pb-0" style={{ paddingBottom: 'calc(88px + env(safe-area-inset-bottom))' }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
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
        </>
    );
}
