import React, { useState, useMemo, useCallback } from "react";
import { ArrowRight, ArrowLeft, Calculator, CheckCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Alert, AlertDescription, AlertTitle } from "./components/ui";
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
import { STEPS } from "./constants";
import { AnalysisData } from './types';
import { useAnalysisData } from './hooks/useAnalysisData';
import { validateStep } from './utils/validation';
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
    const [currentStep, setCurrentStep] = useState(1);
    const { data, updateData } = useAnalysisData();
    const [errors, setErrors] = useState<string[]>([]);

    const handleNext = useCallback(() => {
        try {
            const validationErrors = validateStep(currentStep, data);
            if (validationErrors.length > 0) {
                setErrors(validationErrors);
                return;
            }

            if (currentStep === 1) {
                const address = data.clientAddress || '';
                // Aceita formatos no final do endereço como:
                // "Bairro - Cidade/UF", "Cidade/UF" ou "Cidade - UF".
                const matchWithSlash = address.match(/([^,]+?)\s*\/\s*([A-Z]{2})$/i);
                const matchWithHyphen = address.match(/([^,]+?)\s*-\s*([A-Z]{2})$/i);

                if ((matchWithSlash && matchWithSlash[1] && matchWithSlash[2]) || (matchWithHyphen && matchWithHyphen[1] && matchWithHyphen[2])) {
                    const rawCityPart = (matchWithSlash ? matchWithSlash[1] : matchWithHyphen![1]).trim();
                    const uf = (matchWithSlash ? matchWithSlash[2] : matchWithHyphen![2]).toUpperCase();

                    // Se houver "Bairro - Cidade", pegue somente a última parte como cidade.
                    const city = (rawCityPart.split(/\s-\s/).pop() || rawCityPart).trim();
                    const region = getRegionFromState(uf);

                    // Remover o hífen imediatamente antes de "Cidade/UF" no final
                    const sanitizedAddress = address.replace(/\s-\s(?=[^,]*\/[A-Z]{2}$)/, '  ');

                    updateData({
                        mapRegion: region,
                        location: `${city} - ${uf}`,
                        clientAddress: sanitizedAddress
                    });
                }
            }

            // Garantir que dados necessários estejam inicializados para a etapa 3 (NgInputStep)
            if (currentStep === 2) {
                if (!data.mapRegion) {
                    updateData({ mapRegion: 'sul' }); // Valor padrão
                }
                if (!data.ngValue) {
                    updateData({ ngValue: 5 }); // Valor padrão
                }
            }

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

    const renderStep = useMemo(() => {
        try {
            switch (currentStep) {
                case 1: return <ProjectInfoStep data={data} onUpdate={updateData} />;
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
                default: return <div className="p-6 bg-slate-800 rounded-lg">
                    <h2 className="text-xl font-bold text-slate-100 mb-4">Etapa não encontrada</h2>
                    <p className="text-slate-300">Por favor, retorne à etapa anterior e tente novamente.</p>
                </div>;
            }
        } catch (error) {
            console.error("Erro ao renderizar etapa:", error);
            return <div className="p-6 bg-slate-800 rounded-lg">
                <h2 className="text-xl font-bold text-red-400 mb-4">Erro ao carregar esta etapa</h2>
                <p className="text-slate-300">Ocorreu um erro ao carregar esta etapa. Por favor, tente retornar à etapa anterior.</p>
            </div>;
        }
    }, [currentStep, data, updateData]);

    return (
        <div className="min-h-screen p-3 sm:p-4 md:p-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-stretch">
                <aside className="hidden md:block md:w-64 lg:w-72 flex-shrink-0">
                    <div className="sticky top-4 flex flex-col gap-4">
                        <SidebarNav currentStep={currentStep} setStep={setStep}/>
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
                    <div className="min-h-full pb-20 md:pb-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                {renderStep}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    {/* Barra de navegação móvel fixa: somente botões, sem fundo */}
                    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
                        <div className="mx-auto max-w-7xl px-3 pb-2">
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
                    </div>
                </main>
            </div>
        </div>
    );
}