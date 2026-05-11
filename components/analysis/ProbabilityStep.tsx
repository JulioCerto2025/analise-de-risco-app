import * as React from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Label, TabButton, useIsMobile, useAuditMode } from '../ui';
import { formatSmartNumber } from '../../lib/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { AnalysisData, ProbabilityData } from '../../types';
import { PB_OPTIONS, PSPD_OPTIONS, PTA_OPTIONS, PTU_OPTIONS, KS3_OPTIONS, UW_OPTIONS, CLD_ONLY_OPTIONS } from '../../constants';
import { DecimalInput } from '../DecimalInput';
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { calculatePld, calculateProbabilities, mergeZoneProbabilities } from '../../utils/calculations';
import { motion, AnimatePresence } from 'framer-motion';

interface ProbabilityStepProps {
    data: AnalysisData;
    onChange: (newData: Partial<AnalysisData>) => void;
}

// Exibe números como "9,98 × 10⁻⁷" com precisão ajustável para seção Detalhe/Valor
const ScientificNotation = ({ value, precision = 2, className = "" }: { value: number; precision?: number; className?: string }) => {
    if (value === 0 || !isFinite(value)) return <span className={className}>0</span>;
    let [mantissa, exponent] = value.toExponential(precision).split('e');
    const expInt = parseInt(exponent, 10);
    return (
        <span className={`inline-flex items-baseline ${className}`}>
            <span className="font-black leading-none">{mantissa.replace('.', ',')}</span>
            <span className="text-[0.7em] ml-1 opacity-90 font-black">&times;10</span>
            <sup className="text-[0.6em] leading-none -top-[0.6em] font-black">{expInt}</sup>
        </span>
    );
};

const PROBABILITY_FORMULAS: { [key: string]: { formula: string; symbols: string[]; vars: string[] } } = {
    PA: { formula: "PTA × PB", symbols: ["PTA", "PB"], vars: ["PTA", "PB"] },
    PB: { formula: "Seleção Direta (Nível SPDA)", symbols: [], vars: ["PB"] },
    PC: { formula: "PSPD<sub>e</sub> × CLD<sub>e</sub>(int)", symbols: ["PSPD<sub>e</sub>", "CLD<sub>e</sub>(int)"], vars: ["PSPD_electric", "CLD_electric_int"] },
    PCT: { formula: "PSPD<sub>a</sub> × CLD<sub>a</sub>(int)", symbols: ["PSPD<sub>a</sub>", "CLD<sub>a</sub>(int)"], vars: ["PSPD_data", "CLD_data_int"] },
    Pms: { formula: "(Ks1 × Ks2 × Ks3<sub>e</sub>(int) × Ks4<sub>e</sub>(int))²", symbols: ["Ks1", "Ks2", "Ks3<sub>e</sub>(int)", "Ks4<sub>e</sub>(int)"], vars: ["Ks1", "Ks2", "Ks3_electric_int", "Ks4_electric_int"] },
    Pmst: { formula: "(Ks1 × Ks2 × Ks3<sub>a</sub>(int) × Ks4<sub>a</sub>(int))²", symbols: ["Ks1", "Ks2", "Ks3<sub>a</sub>(int)", "Ks4<sub>a</sub>(int)"], vars: ["Ks1", "Ks2", "Ks3_data_int", "Ks4_data_int"] },
    PM: { formula: "PSPD<sub>e</sub> × Pms", symbols: ["PSPD<sub>e</sub>", "Pms"], vars: ["PSPD_electric", "Pms"] },
    PMT: { formula: "PSPD<sub>a</sub> × Pmst", symbols: ["PSPD<sub>a</sub>", "Pmst"], vars: ["PSPD_data", "Pmst"] },
    PU: { formula: "PTU<sub>e</sub> × PEB<sub>e</sub> × PLD<sub>e</sub>(ext) × CLD<sub>e</sub>(ext)", symbols: ["PTU<sub>e</sub>", "PEB<sub>e</sub>", "PLD<sub>e</sub>(ext)", "CLD<sub>e</sub>(ext)"], vars: ["PTU_electric", "PEB_electric", "PLD_electric_ext", "CLD_electric_ext"] },
    PUT: { formula: "PTU<sub>a</sub> × PEB<sub>a</sub> × PLD<sub>a</sub>(ext) × CLD<sub>a</sub>(ext)", symbols: ["PTU<sub>a</sub>", "PEB<sub>a</sub>", "PLD<sub>a</sub>(ext)", "CLD<sub>a</sub>(ext)"], vars: ["PTU_data", "PEB_data", "PLD_data_ext", "CLD_data_ext"] },
    PV: { formula: "PEB<sub>e</sub> × PLD<sub>e</sub>(ext) × CLD<sub>e</sub>(ext)", symbols: ["PEB<sub>e</sub>", "PLD<sub>e</sub>(ext)", "CLD<sub>e</sub>(ext)"], vars: ["PEB_electric", "PLD_electric_ext", "CLD_electric_ext"] },
    PVT: { formula: "PEB<sub>a</sub> × PLD<sub>a</sub>(ext) × CLD<sub>a</sub>(ext)", symbols: ["PEB<sub>a</sub>", "PLD<sub>a</sub>(ext)", "CLD<sub>a</sub>(ext)"], vars: ["PEB_data", "PLD_data_ext", "CLD_data_ext"] },
    PW: { formula: "PSPD<sub>e</sub> × PLD<sub>e</sub>(ext) × CLD<sub>e</sub>(ext)", symbols: ["PSPD<sub>e</sub>", "PLD<sub>e</sub>(ext)", "CLD<sub>e</sub>(ext)"], vars: ["PSPD_electric", "PLD_electric_ext", "CLD_electric_ext"] },
    PWT: { formula: "PSPD<sub>a</sub> × PLD<sub>a</sub>(ext) × CLD<sub>a</sub>(ext)", symbols: ["PSPD<sub>a</sub>", "PLD<sub>a</sub>(ext)", "CLD<sub>a</sub>(ext)"], vars: ["PSPD_data", "PLD_data_ext", "CLD_data_ext"] },
    PZ: { formula: "PSPD<sub>e</sub> × CLI<sub>e</sub>(ext) × Pli<sub>e</sub>(ext)", symbols: ["PSPD<sub>e</sub>", "CLI<sub>e</sub>(ext)", "Pli<sub>e</sub>(ext)"], vars: ["PSPD_electric", "CLI_electric_ext", "Pli_electric_ext"] },
    PZT: { formula: "PSPD<sub>a</sub> × CLI<sub>a</sub>(ext) × Pli<sub>a</sub>(ext)", symbols: ["PSPD<sub>a</sub>", "CLI<sub>a</sub>(ext)", "Pli<sub>a</sub>(ext)"], vars: ["PSPD_data", "CLI_data_ext", "Pli_data_ext"] },
};

const ProbEditorialPortal = ({ label, probData, probCalcs, onClose }: { label: string; probData: ProbabilityData; probCalcs: any; onClose: () => void }) => {
    const { auditMode } = useAuditMode();
    const isMobile = useIsMobile();
    const portalRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (portalRef.current && !portalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    if (!auditMode || isMobile) return null;

    const formulaInfo = PROBABILITY_FORMULAS[label];
    const allValues = { ...probData, ...probCalcs };

    let subComponentLabel: string | null = null;
    if (label === 'PM') subComponentLabel = 'Pms';
    else if (label === 'PMT') subComponentLabel = 'Pmst';

    const formatPtBR = (n: number) => {
        const val = Number(n || 0);
        if (val > 0 && val < 0.0001) {
            return formatSmartNumber(val, { useScientificBelow: 1, scientificPrecision: 2 });
        }
        return val.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 4 });
    };

    const formatFormulaWithValues = (info: any, rawFormula: string) => {
        if (!info || !rawFormula) return "N/A";
        let result = rawFormula;
        if (info.symbols && info.symbols.length > 0) {
            info.symbols.forEach((symbol: string, index: number) => {
                const varKey = info.vars[index];
                const val = Number(allValues[varKey] || 0);
                result = result.split(symbol).join(formatPtBR(val));
            });
        } else if (info.vars) {
            return info.vars.map((v: string) => formatPtBR(Number(allValues[v] || 0))).join(' ; ');
        }
        return result;
    };

    const valuesString = formatFormulaWithValues(formulaInfo, formulaInfo?.formula);
    
    const getCalcStringForSub = (subLabel: string): React.ReactNode => {
        const k1 = allValues.Ks1 || 0;
        const k2 = allValues.Ks2 || 0;
        const k3 = subLabel === 'Pms' ? (allValues.Ks3_electric_int || 0) : (allValues.Ks3_data_int || 0);
        const k4 = subLabel === 'Pms' ? (allValues.Ks4_electric_int || 0) : (allValues.Ks4_data_int || 0);
        const subVal = (allValues[subLabel] || Math.pow(k1 * k2 * k3 * k4, 2));
        return (
            <span className="inline-flex items-baseline">
                <span>({formatPtBR(k1)} × {formatPtBR(k2)} × {formatPtBR(k3)} × {formatPtBR(k4)})² = </span>
                <ScientificNotation value={Number(subVal)} precision={2} />
            </span>
        );
    };

    const finalValue = allValues[label] || 0;

    return createPortal(
        <div className="fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px] pointer-events-none animate-in fade-in duration-200" />
            <div 
                ref={portalRef}
                className="fixed right-6 top-[100px] w-[min(90vw,540px)] p-6 bg-slate-800/98 border border-blue-500/40 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl z-[9999] animate-in slide-in-from-right-10 fade-in duration-300 pointer-events-auto"
            >
                <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    <p className="font-black text-slate-100 uppercase tracking-[0.2em] text-[10px]">Detalhamento de Probabilidade Editorial</p>
                </div>
                <div className="space-y-6">
                    <div className="flex items-center justify-between bg-slate-900/40 p-4 rounded-2xl border border-white/5">
                        <span className="font-black text-slate-100 text-lg uppercase tracking-wider">{label}</span>
                        <div className="flex items-baseline gap-2 text-right">
                            <span className="text-[10px] uppercase font-black text-blue-500/70 tracking-widest">Valor Final</span>
                            <p className="text-blue-400 font-black text-xl"><ScientificNotation value={Number(finalValue)} precision={2} /></p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {formulaInfo && (
                            <>
                                <div className="space-y-1.5">
                                    <p className="text-slate-500 text-[9px] uppercase font-black tracking-[0.2em] ml-1">Fórmula (Variáveis):</p>
                                    <div className="font-mono bg-slate-900/40 p-4 rounded-2xl text-slate-200 text-xs sm:text-base leading-relaxed border border-white/5 shadow-inner" dangerouslySetInnerHTML={{ __html: formulaInfo.formula }} />
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-slate-500 text-[9px] uppercase font-black tracking-[0.2em] ml-1">Aplicação de Valores:</p>
                                    <div className="font-mono bg-blue-500/5 p-4 rounded-2xl text-blue-100 text-xs sm:text-base leading-relaxed border border-blue-500/20 shadow-inner" dangerouslySetInnerHTML={{ __html: valuesString }} />
                                </div>
                            </>
                        )}
                        {subComponentLabel && (
                            <div className="space-y-1.5 mt-4 pt-4 border-t border-white/5">
                                <p className="text-slate-500 text-[9px] uppercase font-black tracking-[0.2em] ml-1">Cálculo de Sub-componente ({subComponentLabel}):</p>
                                <div className="font-mono bg-cyan-500/5 p-4 rounded-2xl text-cyan-200 text-xs sm:text-base leading-relaxed border border-cyan-500/20 shadow-inner">{getCalcStringForSub(subComponentLabel)}</div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-8 pt-4 border-t border-white/5 flex justify-center"><p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em]">NBR 5419-2:2026 Audit Ready</p></div>
            </div>
        </div>,
        document.body
    );
};

const RS_BLINDAGEM_OPTIONS = [
    { value: -1, label: "Sem blindagem" },
    { value: 0, label: "rs ≤ 1 Ω/km" },
    { value: 5, label: "1 < rs ≤ 5 Ω/km" },
    { value: 20, label: "5 < rs ≤ 20 Ω/km" },
    { value: 100, label: "rs > 20 Ω/km" }
];

const CLI_OPTIONS = [
    { value: 1, label: "Sem blindagem (CLI=1)" },
    { value: 0.3, label: "L. subt. blind. n/ equip. (CLI=0,3)" },
    { value: 0.2, label: "L. neutro mult. (CLI=0,2)" },
    { value: 0.1, label: "L. aérea blind. n/ equip. (CLI=0,1)" },
    { value: 0, label: "Equipotencial (CLI=0)" }
];

export function ProbabilityStep({ data, onChange }: ProbabilityStepProps) {
    const [activeTab, setActiveTab] = React.useState('structure');
    const [electricSubTab, setElectricSubTab] = React.useState<'external' | 'internal'>('external');
    const [dataSubTab, setDataSubTab] = React.useState<'external' | 'internal'>('external');
    const [selectedProb, setSelectedProb] = React.useState<string | null>(null);
    const isMobile = useIsMobile();
    const { auditMode, setActiveTooltipId } = useAuditMode();

    const { zones = [] } = data;
    const hasMultipleZones = zones.length > 1;
    const activeViewId = data.last_active_view_id || 'GLOBAL';
    
    const currentZone = activeViewId === 'GLOBAL' ? undefined : (zones.find(z => z.id === activeViewId) || zones[0]);
    const prob = (currentZone?.probability_data || data.probability_data);

    const handleProbabilityChange = React.useCallback((updates: Partial<ProbabilityData>) => {
        const nextUpdate: Partial<AnalysisData> = {};
        
        const updatePlds = (pData: ProbabilityData, upds: Partial<ProbabilityData>) => {
            const result = { ...pData, ...upds };
            if ('is_shielded_electric_ext' in upds || 'rs_electric_ext' in upds || 'Uw_electric_ext' in upds) {
                result.PLD_electric_ext = calculatePld(result.rs_electric_ext, result.Uw_electric_ext, !!result.is_shielded_electric_ext);
            }
            if ('is_shielded_data_ext' in upds || 'rs_data_ext' in upds || 'Uw_data_ext' in upds) {
                result.PLD_data_ext = calculatePld(result.rs_data_ext, result.Uw_data_ext, !!result.is_shielded_data_ext);
            }
            return result;
        };

        if (activeViewId === 'GLOBAL') {
            const newGlobalProb = updatePlds(data.probability_data, updates);
            nextUpdate.probability_data = newGlobalProb;
            // Modo GLOBAL: Propaga todas as alterações para todas as zonas
            nextUpdate.zones = (data.zones || []).map(zone => {
                const base = (zone.probability_data || data.probability_data);
                const merged = updatePlds(base, updates);
                const nextOverrides = { ...(zone.probability_overrides || {}) } as any;
                Object.keys(updates).forEach(k => delete nextOverrides[k]);
                return { ...zone, probability_data: merged, probability_overrides: nextOverrides };
            });
        } else {
            // Modo LOCAL: Ajusta apenas a zona atual
            nextUpdate.zones = (data.zones || []).map(zone => {
                if (zone.id !== activeViewId) return zone;
                const base = (zone.probability_data || data.probability_data);
                return { ...zone, probability_data: updatePlds(base, updates) };
            });
        }
        
        onChange(nextUpdate);
    }, [activeViewId, data.probability_data, data.zones, onChange]);

    const zoneAnalyzeData = currentZone?.analyze_data_line_probabilities ?? data.analyze_data_line_probabilities ?? true;
    const zoneAnalyzeElectric = currentZone?.analyze_electric_line_probabilities ?? data.analyze_electric_line_probabilities ?? true;
    const zoneProbCalcs = calculateProbabilities(prob, zoneAnalyzeData, data.has_data_line, zoneAnalyzeElectric);
    
    const chartData = Object.entries(zoneProbCalcs)
        .filter(([key]) => !['Ks1','Ks2','Ks4_electric_int','Ks4_data_int','Pli_electric_ext','Pli_data_ext','PEB_electric','PEB_data','Pms','Pmst','PSPD_electric','PSPD_data'].includes(key)) 
        .map(([key, value]) => ({ 
            name: key, 
            value: Number.isFinite(value) ? value : 0 
        }));
    
    const calculatedKs1 = zoneProbCalcs.Ks1 || 0;
    const calculatedKs2 = zoneProbCalcs.Ks2 || 0;
    const viewOrder = ['GLOBAL', ...zones.map(z => z.id)];
    const activeHeading = activeViewId === 'GLOBAL' ? 'Global' : (currentZone?.name || 'ZONA');

    const goNextView = () => {
        const order = hasMultipleZones ? viewOrder : zones.map(z => z.id);
        const currentIdx = order.indexOf(activeViewId);
        const nextIdx = (currentIdx + 1) % order.length;
        onChange({ last_active_view_id: order[nextIdx] });
    };
    const goPrevView = () => {
        const order = hasMultipleZones ? viewOrder : zones.map(z => z.id);
        const currentIdx = order.indexOf(activeViewId);
        const prevIdx = (currentIdx - 1 + order.length) % order.length;
        onChange({ last_active_view_id: order[prevIdx] });
    };

    return (
        <div className="grid grid-cols-1 gap-2" onClick={() => setSelectedProb(null)}>
            <Card 
                className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-center mt-3">
                    <div className="flex items-center gap-2 sm:gap-4 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-slate-950 border border-slate-800 shadow-2xl">
                        {hasMultipleZones && <button onClick={goPrevView} className="p-1 sm:p-1.5 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"><ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5" /></button>}
                        <span className="text-white font-black text-[9px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.3em] min-w-[140px] sm:min-w-[200px] text-center">
                            <span className="sm:hidden">
                                {activeViewId === 'GLOBAL' ? 'Proteções — GLOBAL' : `Prot. — ${currentZone?.name || 'ZONA'}`}
                            </span>
                            <span className="hidden sm:inline">
                                {activeViewId === 'GLOBAL' ? 'Ajustar Proteções — GLOBAL' : `Proteções — ${currentZone?.name || 'ZONA'}`}
                            </span>
                        </span>
                        {hasMultipleZones && <button onClick={goNextView} className="p-1 sm:p-1.5 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"><ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>}
                    </div>
                </div>
                <CardContent className="space-y-3 py-3 px-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div className="flex space-x-1 p-1 bg-slate-800/40 rounded-xl w-fit mx-auto sm:mx-0">
                            <TabButton isActive={activeTab === 'structure'} onClick={() => setActiveTab('structure')} className="py-1.5 px-2 sm:px-4 text-[10px] sm:text-[11px] min-w-[55px] sm:min-w-0">
                                <span className="sm:hidden">Estrut.</span>
                                <span className="hidden sm:inline">Estrutura</span>
                            </TabButton>
                            {data.has_electric_line && (
                                <TabButton isActive={activeTab === 'electric'} onClick={() => setActiveTab('electric')} className="py-1.5 px-2 sm:px-4 text-[10px] sm:text-[11px] min-w-[55px] sm:min-w-0">
                                    <span className="sm:hidden">Elétr.</span>
                                    <span className="hidden sm:inline">Elétrica</span>
                                </TabButton>
                            )}
                            {data.has_data_line && (
                                <TabButton isActive={activeTab === 'data'} onClick={() => setActiveTab('data')} className="py-1.5 px-2 sm:px-4 text-[10px] sm:text-[11px] min-w-[55px] sm:min-w-0">
                                    Dados
                                </TabButton>
                            )}
                        </div>
                        <AnimatePresence mode="wait">
                            {activeTab === 'electric' && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex items-center space-x-4 px-6 py-1.5 bg-blue-500/5 hover:bg-blue-500/10 rounded-full border border-blue-500/30 shadow-lg shadow-blue-500/5 transition-all group cursor-pointer" onClick={() => {
                                    const newVal = !zoneAnalyzeElectric;
                                    if (activeViewId === 'GLOBAL') {
                                        const updatedZones = zones.map(z => ({ ...z, analyze_electric_line_probabilities: newVal }));
                                        onChange({ analyze_electric_line_probabilities: newVal, zones: updatedZones });
                                    } else {
                                        const updatedZones = zones.map(z => z.id === activeViewId ? { ...z, analyze_electric_line_probabilities: newVal } : z);
                                        onChange({ zones: updatedZones });
                                    }
                                }}>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${zoneAnalyzeElectric ? 'bg-blue-500 border-blue-400' : 'border-slate-600 bg-slate-900/40'}`}>
                                        {zoneAnalyzeElectric && <div className="w-1.5 h-2.5 border-r-2 border-b-2 border-white rotate-45 mb-0.5" />}
                                    </div>
                                    <span className="text-[9px] font-black text-blue-100 uppercase tracking-[0.25em]">Análise Ativa</span>
                                </motion.div>
                            )}
                            {activeTab === 'data' && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex items-center space-x-4 px-6 py-1.5 bg-amber-500/5 hover:bg-amber-500/10 rounded-full border border-amber-500/30 shadow-lg shadow-amber-500/5 transition-all group cursor-pointer" onClick={() => {
                                    const newVal = !zoneAnalyzeData;
                                    if (activeViewId === 'GLOBAL') {
                                        const updatedZones = zones.map(z => ({ ...z, analyze_data_line_probabilities: newVal }));
                                        onChange({ analyze_data_line_probabilities: newVal, zones: updatedZones });
                                    } else {
                                        const updatedZones = zones.map(z => z.id === activeViewId ? { ...z, analyze_data_line_probabilities: newVal } : z);
                                        onChange({ zones: updatedZones });
                                    }
                                }}>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${zoneAnalyzeData ? 'bg-amber-500 border-amber-400' : 'border-slate-600 bg-slate-900/40'}`}>
                                        {zoneAnalyzeData && <div className="w-1.5 h-2.5 border-r-2 border-b-2 border-white rotate-45 mb-0.5" />}
                                    </div>
                                    <span className="text-[9px] font-black text-amber-100 uppercase tracking-[0.25em]">Análise Ativa</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {activeTab === 'structure' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-3 pt-2.5 border-t border-white/5 px-2 text-center">
                            <SelectInput label="Nível SPDA (PB)" value={prob.PB} options={PB_OPTIONS} onUpdate={v => handleProbabilityChange({ PB: v })} />
                            <SelectInput label="Prot. PTA" value={prob.PTA} options={PTA_OPTIONS} onUpdate={v => handleProbabilityChange({ PTA: v })} />
                            <div className="col-span-2 sm:col-span-1">
                                <SelectInput label="Prot. PTU" value={prob.PTU_electric} options={PTU_OPTIONS} onUpdate={v => handleProbabilityChange({ PTU_electric: v, PTU_data: v })} />
                            </div>
                            <div className="space-y-1 flex flex-col items-center">
                                <DecimalInput label="wm1 (m)" value={prob.wm1 || 0} onUpdate={v => handleProbabilityChange({ wm1: v })} min={0} className="w-full max-w-[80px] text-center" />
                                <span className="text-[9px] font-mono font-black text-blue-400">Ks1: {formatSmartNumber(calculatedKs1, { maxDecimals: 3 })}</span>
                            </div>
                            <div className="space-y-1 flex flex-col items-center">
                                <DecimalInput label="wm2 (m)" value={prob.wm2 || 0} onUpdate={v => handleProbabilityChange({ wm2: v })} min={0} className="w-full max-w-[80px] text-center" />
                                <span className="text-[9px] font-mono font-black text-blue-400">Ks2: {formatSmartNumber(calculatedKs2, { maxDecimals: 3 })}</span>
                            </div>
                        </div>
                    )}

                    {activeTab === 'electric' && (
                        <div className="space-y-3 pt-2.5 border-t border-white/5">
                            <div className={`flex flex-col lg:flex-row lg:items-center justify-start gap-3 lg:gap-6 bg-slate-950/30 p-1.5 md:p-2.5 rounded-2xl border border-white/5 ${!zoneAnalyzeElectric ? 'opacity-30 pointer-events-none' : ''}`}>
                                <div className="flex flex-col items-center gap-1.5 lg:pr-6 lg:border-r border-white/10">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/90">Localização</Label>
                                    <div className="flex p-1 bg-slate-900/60 rounded-full border border-white/5">
                                        <TabButton isActive={electricSubTab === 'internal'} onClick={() => setElectricSubTab('internal')} className="py-1 px-4 text-[10px]">Interna</TabButton>
                                        <TabButton isActive={electricSubTab === 'external'} onClick={() => setElectricSubTab('external')} className="py-1 px-4 text-[10px]">Externa</TabButton>
                                    </div>
                                </div>
                                <div className="w-full lg:min-w-[140px]"><SelectInput label="Equipot. (PEB)" value={prob.PEB_electric} options={PSPD_OPTIONS} onUpdate={v => handleProbabilityChange({ PEB_electric: v })} /></div>
                                <div className="w-full lg:min-w-[140px]"><SelectInput label="Equipot. (PSPD)" value={prob.PSPD_electric} options={PSPD_OPTIONS} onUpdate={v => handleProbabilityChange({ PSPD_electric: v })} /></div>
                                <div className="w-full lg:min-w-[120px]"><SelectInput label="Uw (kV)" value={prob.Uw_electric_ext} options={UW_OPTIONS} onUpdate={v => handleProbabilityChange({ Uw_electric_ext: v, Uw_electric_int: v })} /></div>
                            </div>
                            <div className={`grid gap-2 md:gap-3 items-end bg-slate-900/40 p-2 md:p-3 rounded-2xl border border-white/5 ${!zoneAnalyzeElectric ? 'opacity-30 pointer-events-none' : ''} ${electricSubTab === 'internal' ? 'grid-cols-1 lg:grid-cols-4' : 'grid-cols-1 lg:grid-cols-3'}`}>
                                <SelectInput label="Fator CLD" value={electricSubTab === 'external' ? prob.CLD_electric_ext : prob.CLD_electric_int} options={CLD_ONLY_OPTIONS} onUpdate={v => handleProbabilityChange(electricSubTab === 'external' ? { CLD_electric_ext: v } : { CLD_electric_int: v })} />
                                <SelectInput label="Fator CLI" value={electricSubTab === 'external' ? prob.CLI_electric_ext : prob.CLI_electric_int} options={CLI_OPTIONS} onUpdate={v => handleProbabilityChange(electricSubTab === 'external' ? { CLI_electric_ext: v } : { CLI_electric_int: v })} />
                                {electricSubTab === 'internal' && <SelectInput label="Ks3 (Fiação)" value={prob.Ks3_electric_int || 0} options={KS3_OPTIONS} onUpdate={v => handleProbabilityChange({ Ks3_electric_int: v })} />}
                                <SelectInput label={electricSubTab === 'external' ? "Blindagem (rs) - Ext." : "Blindagem (rs) - Int."} value={(() => { const isShielded = electricSubTab === 'external' ? prob.is_shielded_electric_ext : prob.is_shielded_electric_int; const rs = electricSubTab === 'external' ? prob.rs_electric_ext : prob.rs_electric_int; return isShielded ? rs : -1; })()} options={RS_BLINDAGEM_OPTIONS} onUpdate={v => { if (v === -1) handleProbabilityChange(electricSubTab === 'external' ? { is_shielded_electric_ext: false, rs_electric_ext: 20 } : { is_shielded_electric_int: false, rs_electric_int: 20 }); else handleProbabilityChange(electricSubTab === 'external' ? { is_shielded_electric_ext: true, rs_electric_ext: v } : { is_shielded_electric_int: true, rs_electric_int: v }); }} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'data' && (
                        <div className="space-y-3 pt-2.5 border-t border-white/5">
                            <div className={`flex flex-col lg:flex-row lg:items-center justify-start gap-3 lg:gap-6 bg-slate-950/30 p-1.5 md:p-2.5 rounded-2xl border border-white/5 ${!zoneAnalyzeData ? 'opacity-30 pointer-events-none' : ''}`}>
                                <div className="flex flex-col items-center gap-1.5 lg:pr-6 lg:border-r border-white/10">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/90">Localização</Label>
                                    <div className="flex p-1 bg-slate-900/60 rounded-full border border-white/5">
                                        <TabButton isActive={dataSubTab === 'internal'} onClick={() => setDataSubTab('internal')} className="py-1 px-4 text-[10px]">Interna</TabButton>
                                        <TabButton isActive={dataSubTab === 'external'} onClick={() => setDataSubTab('external')} className="py-1 px-4 text-[10px]">Externa</TabButton>
                                    </div>
                                </div>
                                <div className="w-full lg:min-w-[140px]"><SelectInput label="Equipot. (PEB)" value={prob.PEB_data} options={PSPD_OPTIONS} onUpdate={v => handleProbabilityChange({ PEB_data: v })} /></div>
                                <div className="w-full lg:min-w-[140px]"><SelectInput label="Equipot. (PSPD)" value={prob.PSPD_data} options={PSPD_OPTIONS} onUpdate={v => handleProbabilityChange({ PSPD_data: v })} /></div>
                                <div className="w-full lg:min-w-[120px]"><SelectInput label="Uw (kV)" value={prob.Uw_data_ext} options={UW_OPTIONS} onUpdate={v => handleProbabilityChange({ Uw_data_ext: v, Uw_data_int: v })} /></div>
                            </div>
                            <div className={`grid gap-2 md:gap-3 items-end bg-slate-900/40 p-2 md:p-3 rounded-2xl border border-white/5 ${!zoneAnalyzeData ? 'opacity-30 pointer-events-none' : ''} ${dataSubTab === 'internal' ? 'grid-cols-1 lg:grid-cols-4' : 'grid-cols-1 lg:grid-cols-3'}`}>
                                <SelectInput label="Fator CLD" value={dataSubTab === 'external' ? prob.CLD_data_ext : prob.CLD_data_int} options={CLD_ONLY_OPTIONS} onUpdate={v => handleProbabilityChange(dataSubTab === 'external' ? { CLD_data_ext: v } : { CLD_data_int: v })} />
                                <SelectInput label="Fator CLI" value={dataSubTab === 'external' ? prob.CLI_data_ext : prob.CLI_data_int} options={CLI_OPTIONS} onUpdate={v => handleProbabilityChange(dataSubTab === 'external' ? { CLI_data_ext: v } : { CLI_data_int: v })} />
                                {dataSubTab === 'internal' && <SelectInput label="Ks3 (Fiação)" value={prob.Ks3_data_int || 0} options={KS3_OPTIONS} onUpdate={v => handleProbabilityChange({ Ks3_data_int: v })} />}
                                <SelectInput label={dataSubTab === 'external' ? "Blindagem (rs) - Ext." : "Blindagem (rs) - Int."} value={(() => { const isShielded = dataSubTab === 'external' ? prob.is_shielded_data_ext : prob.is_shielded_data_int; const rs = dataSubTab === 'external' ? prob.rs_data_ext : prob.rs_data_int; return isShielded ? rs : -1; })()} options={RS_BLINDAGEM_OPTIONS} onUpdate={v => { if (v === -1) handleProbabilityChange(dataSubTab === 'external' ? { is_shielded_data_ext: false, rs_data_ext: 20 } : { is_shielded_data_int: false, rs_data_int: 20 }); else handleProbabilityChange(dataSubTab === 'external' ? { is_shielded_data_ext: true, rs_data_ext: v } : { is_shielded_data_int: true, rs_data_int: v }); }} />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-center mt-3 mb-2">
                <span className="px-5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] shadow-lg shadow-black/40 whitespace-nowrap">
                    {`Graf. de Prob. — ${activeHeading}`}
                </span>
            </div>
            <Card 
                className="relative overflow-hidden border-slate-700/30 bg-slate-900/40 backdrop-blur-md shadow-2xl shadow-black/40 group"
                onClick={(e) => e.stopPropagation()}
            >
                <CardContent className="h-[9rem] md:h-[11.5rem] pt-2 md:pt-4 pb-1 md:pb-2 flex flex-col">
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%" className="outline-none focus:outline-none">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} className="outline-none focus:outline-none">
                                <defs>
                                    <linearGradient id="glassShock" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity={0.7} /><stop offset="50%" stopColor="#3b82f6" stopOpacity={0.5} /><stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} /></linearGradient>
                                    <linearGradient id="glassFire" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f43f5e" stopOpacity={0.7} /><stop offset="50%" stopColor="#f43f5e" stopOpacity={0.5} /><stop offset="100%" stopColor="#f43f5e" stopOpacity={0.3} /></linearGradient>
                                    <linearGradient id="glassSystems" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#94a3b8" stopOpacity={0.7} /><stop offset="50%" stopColor="#94a3b8" stopOpacity={0.5} /><stop offset="100%" stopColor="#94a3b8" stopOpacity={0.3} /></linearGradient>
                                </defs>
                                <Tooltip cursor={false} content={<></>} />
                                <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} strokeOpacity={0.1} />
                                <XAxis 
                                    dataKey="name" 
                                    tick={(props) => {
                                        const { x, y, payload } = props;
                                        return (
                                            <g transform={`translate(${x},${y})`} className="cursor-pointer group outline-none" onClick={() => {
                                                setSelectedProb(payload.value);
                                                setActiveTooltipId(null);
                                            }}>
                                                <text x={0} y={0} dy={16} textAnchor="middle" fill="#94a3b8" fontSize={10} fontWeight={700} className="group-hover:fill-white transition-colors outline-none">
                                                    {payload.value}
                                                </text>
                                            </g>
                                        );
                                    }}
                                    axisLine={false} 
                                    tickLine={false} 
                                />
                                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Bar 
                                    dataKey="value" 
                                    radius={[4, 4, 0, 0]} 
                                    barSize={40}
                                    minPointSize={10}
                                >
                                    {chartData.map((entry, index) => {
                                        const name = entry.name.toUpperCase();
                                        let fillUrl = "url(#glassSystems)";
                                        let strokeColor = "#cbd5e1";
                                        if (name.includes('PA') || name.includes('PU')) { fillUrl = "url(#glassShock)"; strokeColor = "#3b82f6"; }
                                        if (name === 'PB' || name.startsWith('PV')) { fillUrl = "url(#glassFire)"; strokeColor = "#f43f5e"; }
                                        return (
                                            <Cell 
                                                key={`cell-p-${index}`} 
                                                fill={fillUrl} 
                                                stroke={strokeColor} 
                                                strokeWidth={0.8} 
                                                strokeOpacity={1} 
                                                className="cursor-pointer outline-none transition-all duration-300" 
                                                fillOpacity={selectedProb === null || selectedProb === entry.name ? 1 : 0.2}
                                                onClick={(e: any) => {
                                                    if(e && e.stopPropagation) e.stopPropagation();
                                                    setSelectedProb(entry.name);
                                                    setActiveTooltipId(null);
                                                }}
                                            />
                                        );
                                    })}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2 pt-2 border-t border-white/5 px-2">
                        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" /><span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Choque (PA, PU)</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]" /><span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Incêndio (PB, PV)</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#94a3b8]" /><span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Sistemas (PC)</span></div>
                    </div>
                </CardContent>
            </Card>

            {selectedProb && auditMode && (
                <ProbEditorialPortal 
                    label={selectedProb} 
                    probData={prob} 
                    probCalcs={zoneProbCalcs} 
                    onClose={() => setSelectedProb(null)} 
                />
            )}
        </div>
    );
}

function SelectInput({ label, value, options, onUpdate }: { label: string; value: number | undefined; options: { value: number; label: string }[]; onUpdate: (val: number) => void }) {
    const stringValue = value !== undefined ? value.toString() : "";
    return (
        <div className="space-y-1 w-full flex flex-col items-center text-center">
            <Label className="text-[11px] font-black uppercase tracking-widest text-white leading-none mb-0.5">{label}</Label>
            <Select value={stringValue} onValueChange={(v) => onUpdate(parseFloat(v))} options={options}>
                <SelectTrigger className="h-7 text-[11px] px-3 bg-slate-950/70 border-slate-700 w-full max-w-[320px] rounded-full !rounded-full focus:ring-1 focus:ring-blue-500/50"><SelectValue /></SelectTrigger>
                <SelectContent>{options.map(opt => <SelectItem key={opt.value} value={opt.value.toString()} label={opt.label} />)}</SelectContent>
            </Select>
        </div>
    );
}
