import React, { useCallback, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Label, TabButton, Alert, AlertDescription, Checkbox, useIsMobile } from '../ui';
import { formatSmartNumber } from '../../lib/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Rectangle } from "recharts";
import { AnalysisData, ProbabilityData } from '../../types';
import { PB_OPTIONS, PSPD_OPTIONS, PTA_OPTIONS, COMBINED_CLD_CLI_OPTIONS, PTU_OPTIONS, KS3_OPTIONS, UW_OPTIONS, CLD_ONLY_OPTIONS } from '../../constants';
import { DecimalInput } from '../DecimalInput';
import { AlertTriangle, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { ShieldingSlider } from '../ShieldingSlider';
import { calculatePld, calculateProbabilities, mergeZoneProbabilities } from '../../utils/calculations';
import { motion, AnimatePresence } from 'framer-motion';

interface ProbabilityStepProps {
    data: AnalysisData;
    onChange: (newData: Partial<AnalysisData>) => void;
}

const pebOptions = PSPD_OPTIONS; 

const PldDisplayBox = ({ value }: { value: number }) => (
    <div className="space-y-2">
        <Label>PLD Calculado</Label>
        <div className="flex h-10 w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-950/70 px-3 font-mono text-slate-200">
            {formatSmartNumber(value, { maxDecimals: 2, useScientificBelow: 0 })}
        </div>
    </div>
);

const Ks4DisplayBox = ({ value }: { value: number }) => (
    <div className="space-y-2">
        <Label>Ks4 Calculado</Label>
        <div className="flex h-10 w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-950/70 px-3 font-mono text-slate-200">
            {formatSmartNumber(value, { maxDecimals: 2, useScientificBelow: 0 })}
        </div>
    </div>
);

const PliDisplayBox = ({ value }: { value: number }) => (
    <div className="space-y-2">
        <Label>PLI Calculado</Label>
        <div className="flex h-10 w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-950/70 px-3 font-mono text-slate-200">
            {formatSmartNumber(value, { maxDecimals: 2, useScientificBelow: 0 })}
        </div>
    </div>
);

// Exibe números como "9,98 × 10⁻⁷" com precisão ajustável para seção Detalhe/Valor
const ScientificNotation = ({ value, precision = 2 }: { value: number; precision?: number }) => {

    if (value === 0 || !isFinite(value)) {
        return <span>0</span>;
    }
    const [mantissa, exponent] = value.toExponential(precision).split('e');
    return (
        <span className="font-mono tracking-tight" dangerouslySetInnerHTML={{ __html: `${mantissa.replace('.', ',')} &times; 10<sup>${exponent}</sup>` }} />
    );
};

const PROBABILITY_FORMULAS: { [key: string]: { formula: string; symbols: string[]; vars: string[] } } = {
    PA: { formula: "PTA × PB", symbols: ["PTA", "PB"], vars: ["PTA", "PB"] },
    PB: { formula: "Seleção Direta (Nível SPDA)", symbols: [], vars: ["PB"] },
    // Internas
    PC: { formula: "PSPDₑ × CLDₑ(int)", symbols: ["PSPDₑ", "CLDₑ(int)"], vars: ["PSPD_electric", "CLD_electric_int"] },
    PCT: { formula: "PSPDₐ × CLDₐ(int)", symbols: ["PSPDₐ", "CLDₐ(int)"], vars: ["PSPD_data", "CLD_data_int"] },
    Pms: { formula: "(Ks1 × Ks2 × Ks3ₑ(int) × Ks4ₑ(int))²", symbols: ["Ks1", "Ks2", "Ks3ₑ(int)", "Ks4ₑ(int)"], vars: ["Ks1", "Ks2", "Ks3_electric_int", "Ks4_electric_int"] },
    Pmst: { formula: "(Ks1 × Ks2 × Ks3ₐ(int) × Ks4ₐ(int))²", symbols: ["Ks1", "Ks2", "Ks3ₐ(int)", "Ks4ₐ(int)"], vars: ["Ks1", "Ks2", "Ks3_data_int", "Ks4_data_int"] },
    PM: { formula: "PSPDₑ × Pms", symbols: ["PSPDₑ", "Pms"], vars: ["PSPD_electric", "Pms"] },
    PMT: { formula: "PSPDₐ × Pmst", symbols: ["PSPDₐ", "Pmst"], vars: ["PSPD_data", "Pmst"] },
    // Externas
    PU: { formula: "PTUₑ × PEBₑ × PLDₑ(ext) × CLDₑ(ext)", symbols: ["PTUₑ", "PEBₑ", "PLDₑ(ext)", "CLDₑ(ext)"], vars: ["PTU_electric", "PEB_electric", "PLD_electric_ext", "CLD_electric_ext"] },
    PUT: { formula: "PTUₐ × PEBₐ × PLDₐ(ext) × CLDₐ(ext)", symbols: ["PTUₐ", "PEBₐ", "PLDₐ(ext)", "CLDₐ(ext)"], vars: ["PTU_data", "PEB_data", "PLD_data_ext", "CLD_data_ext"] },
    PV: { formula: "PEBₑ × PLDₑ(ext) × CLDₑ(ext)", symbols: ["PEBₑ", "PLDₑ(ext)", "CLDₑ(ext)"], vars: ["PEB_electric", "PLD_electric_ext", "CLD_electric_ext"] },
    PVT: { formula: "PEBₐ × PLDₐ(ext) × CLDₐ(ext)", symbols: ["PEBₐ", "PLDₐ(ext)", "CLDₐ(ext)"], vars: ["PEB_data", "PLD_data_ext", "CLD_data_ext"] },
    PW: { formula: "PSPDₑ × PLDₑ(ext) × CLDₑ(ext)", symbols: ["PSPDₑ", "PLDₑ(ext)", "CLDₑ(ext)"], vars: ["PSPD_electric", "PLD_electric_ext", "CLD_electric_ext"] },
    PWT: { formula: "PSPDₐ × PLDₐ(ext) × CLDₐ(ext)", symbols: ["PSPDₐ", "PLDₐ(ext)", "CLDₐ(ext)"], vars: ["PSPD_data", "PLD_data_ext", "CLD_data_ext"] },
    PZ: { formula: "PSPDₑ × CLIₑ(ext) × Pliₑ(ext)", symbols: ["PSPDₑ", "CLIₑ(ext)", "Pliₑ(ext)"], vars: ["PSPD_electric", "CLI_electric_ext", "Pli_electric_ext"] },
    PZT: { formula: "PSPDₐ × CLIₐ(ext) × Pliₐ(ext)", symbols: ["PSPDₐ", "CLIₐ(ext)", "Pliₐ(ext)"], vars: ["PSPD_data", "CLI_data_ext", "Pli_data_ext"] },
};

const CustomTooltip = ({ active, payload, label, probData, probCalcs, showGlobalBars }: any) => {
    if (active && payload && payload.length) {
        const formulaInfo = PROBABILITY_FORMULAS[label];
        const allValues = { ...probData, ...probCalcs };

        let subComponentLabel: string | null = null;
        let subComponentFormulaInfo: any = null;

        if (label === 'PM') {
            subComponentLabel = 'Pms';
            subComponentFormulaInfo = PROBABILITY_FORMULAS[subComponentLabel];
        } else if (label === 'PMT') {
            subComponentLabel = 'Pmst';
            subComponentFormulaInfo = PROBABILITY_FORMULAS[subComponentLabel];
        }

        const formatValues = (info: any) => {
            if (!info) return "N/A";
            return info.vars
                .map((v: string) => (allValues[v] ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 3 }))
                .join(' × ');
        };

        const formatFormulaWithValues = (info: any, rawFormula: string) => {
            if (!info || !rawFormula) return "N/A";
            let result = rawFormula;
            if (info.symbols && info.symbols.length > 0) {
                info.symbols.forEach((symbol: string, index: number) => {
                    const varKey = info.vars[index];
                    const rawVal = allValues[varKey] !== undefined ? allValues[varKey] : 0;
                    const val = Number(rawVal);
                    // Formatação amigável para auditoria (evita muitos decimais se for exato)
                    const formatted = val.toLocaleString('pt-BR', { 
                        minimumFractionDigits: 1, 
                        maximumFractionDigits: 4 
                    });
                    // Substituição literal para evitar problemas de regex com caracteres especiais
                    result = result.split(symbol).join(formatted);
                });
            } else {
                // Caso não tenha símbolos (ex: PB), mostra apenas os valores das variáveis
                return info.vars.map((v: string) => {
                    const val = Number(allValues[v] || 0);
                    return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
                }).join(' ; ');
            }
            return result;
        };

        const valuesString = formatFormulaWithValues(formulaInfo, formulaInfo?.formula);
        const formatPtBR = (n: number) => (n ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 3 });
        
        const getCalcStringForSub = (subLabel: string): React.ReactNode => {
            const k1 = allValues.Ks1 || 0;
            const k2 = allValues.Ks2 || 0;
            const k3 = subLabel === 'Pms' ? (allValues.Ks3_electric_int || 0) : (allValues.Ks3_data_int || 0);
            const k4 = subLabel === 'Pms' ? (allValues.Ks4_electric_int || 0) : (allValues.Ks4_data_int || 0);
            const baseStr = `(${formatPtBR(k1)} × ${formatPtBR(k2)} × ${formatPtBR(k3)} × ${formatPtBR(k4)})²`;
            const subVal = (allValues[subLabel] ?? Math.pow(k1 * k2 * k3 * k4, 2));
            return (
                <span className="inline-flex items-baseline">
                    <span>{baseStr}</span>
                    <span className="mx-0.5">=</span>
                    <ScientificNotation value={Number(subVal)} precision={2} />
                </span>
            );
        };

        return (
            <div className="p-2.5 bg-slate-900/95 border border-blue-500/30 rounded shadow-2xl text-xs backdrop-blur-md min-w-[20rem]">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-1">
                        <span className="font-bold text-blue-400 tracking-tighter">{label}</span>
                        <div className="flex items-center space-x-2">
                            {showGlobalBars && payload[0]?.payload?.globalValue !== undefined && (
                                <span className="text-indigo-300/80 font-mono text-[10px]">G: <ScientificNotation value={Number(payload[0].payload.globalValue)} precision={2} /></span>
                            )}
                            <span className="text-blue-300 font-mono">Z: <ScientificNotation value={Number(payload[0].value)} precision={2} /></span>
                        </div>
                    </div>
                    {formulaInfo && (
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 bg-blue-500/5 px-2 py-1 rounded border border-blue-500/10">
                                <span className="text-slate-400 font-medium text-[10px] shrink-0">Fórmula:</span>
                                <span className="text-slate-200 font-mono text-[11px] truncate">{formulaInfo.formula}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-slate-800/40 px-2 py-1 rounded border border-white/5">
                                <span className="text-slate-400 font-medium text-[10px] shrink-0">Cálculo:</span>
                                <span className="text-slate-100 font-mono text-[11px] flex items-center gap-1">
                                    {valuesString} = <ScientificNotation value={Number(payload[0].value)} precision={2} />
                                </span>
                            </div>
                        </div>
                    )}
                    {subComponentLabel && subComponentFormulaInfo && (
                        <div className="mt-1 pt-1.5 border-t border-white/5 space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-cyan-400">{subComponentLabel}</span>
                                <span className="text-cyan-300 font-mono text-[10px]"><ScientificNotation value={Number(allValues[subComponentLabel] ?? 0)} precision={2} /></span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/10">
                                <span className="text-slate-200 font-mono text-[10px] truncate">{getCalcStringForSub(subComponentLabel)}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    return null;
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
    const [activeTab, setActiveTab] = useState('structure');
    const [electricSubTab, setElectricSubTab] = useState<'external' | 'internal'>('external');
    const [dataSubTab, setDataSubTab] = useState<'external' | 'internal'>('external');
    const isMobile = useIsMobile();
    const [showGlobalBars, setShowGlobalBars] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            const saved = window.localStorage.getItem('probability_showGlobalBars');
            return saved === 'true';
        }
        return false;
    });

    const { zones = [] } = data;
    const [activeZoneId, setActiveZoneId] = useState<string>(data.last_active_zone_id || zones[0]?.id || '');
    
    useEffect(() => {
        const desired = data.last_active_zone_id || zones[0]?.id || '';
        if (desired && desired !== activeZoneId) {
            setActiveZoneId(desired);
        } else if (!zones.find(z => z.id === activeZoneId)) {
            setActiveZoneId(zones[0]?.id || '');
        }
    }, [data.last_active_zone_id, zones, activeZoneId]);
    
    const currentZone = (zones.find(z => z.id === activeZoneId) || zones[0]);
    const prob = (currentZone?.probability_data || data.probability_data);

    useEffect(() => {
        if (activeTab === 'electric' && !data.has_electric_line) setActiveTab('structure');
        if (activeTab === 'data' && !data.has_data_line) setActiveTab('structure');
    }, [data.has_electric_line, data.has_data_line, activeTab]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('probability_showGlobalBars', String(showGlobalBars));
        }
    }, [showGlobalBars]);

    const GLOBAL_SYNC_KEYS = ['PB', 'PEB_electric', 'PEB_data', 'PSPD_electric', 'PSPD_data'];

    const handleProbabilityChange = useCallback((updates: Partial<ProbabilityData>) => {
        const fields = Object.keys(updates);
        
        // Se mudou algum campo de proteção (PEB ou PSPD), força a sincronia em todos
        if (fields.some(k => ['PEB_electric', 'PEB_data', 'PSPD_electric', 'PSPD_data'].includes(k))) {
             const v = (updates as any).PEB_electric ?? (updates as any).PEB_data ?? (updates as any).PSPD_electric ?? (updates as any).PSPD_data;
             updates.PEB_electric = v;
             updates.PEB_data = v;
             updates.PSPD_electric = v;
             updates.PSPD_data = v;
        }

        const keysToSync = GLOBAL_SYNC_KEYS.filter(k => Object.keys(updates).includes(k));
        
        const updatePlds = (pData: ProbabilityData, upds: Partial<ProbabilityData>) => {
            const result = { ...pData, ...upds };
            if ('is_shielded_electric_ext' in upds || 'rs_electric_ext' in upds || 'Uw_electric_ext' in upds) {
                result.PLD_electric_ext = calculatePld(result.rs_electric_ext, result.Uw_electric_ext, result.is_shielded_electric_ext);
            }
            if ('is_shielded_data_ext' in upds || 'rs_data_ext' in upds || 'Uw_data_ext' in upds) {
                result.PLD_data_ext = calculatePld(result.rs_data_ext, result.Uw_data_ext, result.is_shielded_data_ext);
            }
            if ('is_shielded_electric_int' in upds || 'rs_electric_int' in upds || 'Uw_electric_int' in upds) {
                result.PLD_electric_int = calculatePld(result.rs_electric_int, result.Uw_electric_int, result.is_shielded_electric_int);
            }
            if ('is_shielded_data_int' in upds || 'rs_data_int' in upds || 'Uw_data_int' in upds) {
                result.PLD_data_int = calculatePld(result.rs_data_int, result.Uw_data_int, result.is_shielded_data_int);
            }
            return result;
        };

        if (currentZone) {
            const baseProb = (currentZone.probability_data || data.probability_data);
            const newZoneProb = updatePlds(baseProb, updates);

            if (keysToSync.length > 0) {
                const changesForAll: Partial<ProbabilityData> = {};
                keysToSync.forEach(k => { (changesForAll as any)[k] = (newZoneProb as any)[k]; });
                const updatedZones = zones.map(z => {
                    const base = (z.probability_data || data.probability_data);
                    const merged = updatePlds(base, changesForAll);
                    const finalProb = z.id === currentZone.id ? { ...merged, ...updates } : merged;
                    const nextOverrides = { ...(z.probability_overrides || {}) } as any;
                    keysToSync.forEach(k => { delete nextOverrides[k]; });
                    return { ...z, probability_data: finalProb, probability_overrides: nextOverrides };
                });
                onChange({ zones: updatedZones, probability_data: updatePlds(data.probability_data, changesForAll) });
            } else {
                const updatedZones = zones.map(z => z.id === currentZone.id ? { ...z, probability_data: newZoneProb } : z);
                onChange({ zones: updatedZones });
            }
        } else {
            const newProbData = updatePlds(data.probability_data, updates);
            if (keysToSync.length > 0) {
                const changesForAll: Partial<ProbabilityData> = {};
                keysToSync.forEach(k => { (changesForAll as any)[k] = (newProbData as any)[k]; });
                const updatedZones = zones.map(z => {
                    const base = (z.probability_data || data.probability_data);
                    const merged = updatePlds(base, changesForAll);
                    const nextOverrides = { ...(z.probability_overrides || {}) } as any;
                    keysToSync.forEach(k => { delete nextOverrides[k]; });
                    return { ...z, probability_data: merged, probability_overrides: nextOverrides };
                });
                onChange({ probability_data: newProbData, zones: updatedZones });
            } else {
                onChange({ probability_data: newProbData });
            }
        }
    }, [currentZone, zones, data.probability_data, onChange]);

    const zoneAnalyzeData = (currentZone?.analyze_data_line_probabilities ?? data.analyze_data_line_probabilities);
    const zoneAnalyzeElectric = (currentZone?.analyze_electric_line_probabilities ?? data.analyze_electric_line_probabilities);
    
    const zoneProbCalcsBase = calculateProbabilities(prob, zoneAnalyzeData, data.has_data_line, zoneAnalyzeElectric);
    const globalProbCalcsBase = calculateProbabilities(data.probability_data, data.analyze_data_line_probabilities ?? true, data.has_data_line, data.analyze_electric_line_probabilities ?? true);
    
    const zoneProbCalcs = mergeZoneProbabilities(zoneProbCalcsBase, currentZone);
    const globalForDisplay = (zones.length <= 1) ? zoneProbCalcsBase : globalProbCalcsBase;

    const chartData = Object.entries(zoneProbCalcs)
        .filter(([key]) => !['Ks1','Ks2','Ks4_electric_int','Ks4_data_int','Pli_electric_ext','Pli_data_ext','PEB_electric','PEB_data','Pms','Pmst','PSPD_electric','PSPD_data'].includes(key)) 
        .map(([key, value]) => ({ 
            name: key, 
            value: Number.isFinite(value) ? value : 0, 
            ...(showGlobalBars ? { globalValue: Number.isFinite((globalForDisplay as any)[key]) ? (globalForDisplay as any)[key] : 0 } : {}), 
        }));
    
    const calculatedKs1 = zoneProbCalcsBase.Ks1 || 0;
    const calculatedKs2 = zoneProbCalcsBase.Ks2 || 0;
    const activeHeading = currentZone?.name || 'Projeto Global';
    
    const goNextView = () => {
        const idx = zones.findIndex(z => z.id === activeZoneId);
        const nextIdx = (idx + 1) % zones.length;
        setActiveZoneId(zones[nextIdx].id);
        onChange({ last_active_zone_id: zones[nextIdx].id });
    };
    const goPrevView = () => {
        const idx = zones.findIndex(z => z.id === activeZoneId);
        const prevIdx = (idx - 1 + zones.length) % zones.length;
        setActiveZoneId(zones[prevIdx].id);
        onChange({ last_active_zone_id: zones[prevIdx].id });
    };

    return (
        <div className="grid grid-cols-1 gap-2">
            <Card className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm">
                <CardHeader className="py-2.5 px-4 border-b border-white/5">
                    <CardTitle className="text-sm font-bold tracking-wide text-slate-300 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                            {`Ajuste de Probabilidades — ${activeHeading}`}
                        </span>
                        {zones.length > 1 && (
                            <div className="flex items-center gap-1">
                                <button className="p-0.5 rounded hover:bg-slate-700" onClick={goPrevView}><ChevronLeft className="w-4 h-4" /></button>
                                <button className="p-0.5 rounded hover:bg-slate-700" onClick={goNextView}><ChevronRight className="w-4 h-4" /></button>
                            </div>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 py-3 px-4">
                    <div className="flex space-x-1 p-1 bg-slate-800/40 rounded-lg">
                        <TabButton isActive={activeTab === 'structure'} onClick={() => setActiveTab('structure')} className="py-1.5 text-xs">Estrutura</TabButton>
                        {data.has_electric_line && <TabButton isActive={activeTab === 'electric'} onClick={() => setActiveTab('electric')} className="py-1.5 text-xs">L. Elétrica</TabButton>}
                        {data.has_data_line && <TabButton isActive={activeTab === 'data'} onClick={() => setActiveTab('data')} className="py-1.5 text-xs">L. Dados</TabButton>}
                    </div>

                    {activeTab === 'structure' && (
                        <div className="grid gap-2" style={{ gridTemplateColumns: '1fr 1fr 0.55fr' }}>
                            <div className="space-y-2">
                                <SelectInput label="Nível SPDA (PB)" value={prob.PB} options={PB_OPTIONS} onUpdate={v => handleProbabilityChange({ PB: v })} />
                                <SelectInput label="PEB" value={prob.PEB_electric} options={pebOptions} onUpdate={v => handleProbabilityChange({ PEB_electric: v })} />
                            </div>
                            <div className="space-y-2">
                                <SelectInput label="PTA (Prot)" value={prob.PTA} options={PTA_OPTIONS} onUpdate={v => handleProbabilityChange({ PTA: v })} />
                                <SelectInput label="PTU (Prot)" value={prob.PTU_electric} options={PTU_OPTIONS} onUpdate={v => handleProbabilityChange({ PTU_electric: v, PTU_data: v })} />
                            </div>
                            <div className="space-y-2">
                                <div className="space-y-1">
                                    <DecimalInput label="Malha wm1 (m)" value={prob.wm1} onUpdate={v => handleProbabilityChange({ wm1: v })} min={0} />
                                    <p className="text-[10px] text-slate-400">Ks1: <span className="font-bold text-blue-300">{formatSmartNumber(calculatedKs1, { maxDecimals: 3 })}</span></p>
                                </div>
                                <div className="space-y-1">
                                    <DecimalInput label="Malha wm2 (m)" value={prob.wm2} onUpdate={v => handleProbabilityChange({ wm2: v })} min={0} />
                                    <p className="text-[10px] text-slate-400">Ks2: <span className="font-bold text-blue-300">{formatSmartNumber(calculatedKs2, { maxDecimals: 3 })}</span></p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'electric' && (
                        <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <SelectInput label="PEB" value={prob.PSPD_electric} options={PSPD_OPTIONS} onUpdate={v => handleProbabilityChange({ PSPD_electric: v })} />
                                <SelectInput label="Uw (kV)" value={prob.Uw_electric_ext} options={UW_OPTIONS} onUpdate={v => handleProbabilityChange({ Uw_electric_ext: v, Uw_electric_int: v })} />
                            </div>
                            <div className="flex space-x-1 p-0.5 bg-slate-800/30 rounded">
                                <TabButton isActive={electricSubTab === 'internal'} onClick={() => setElectricSubTab('internal')}>Interna</TabButton>
                                <TabButton isActive={electricSubTab === 'external'} onClick={() => setElectricSubTab('external')}>Externa</TabButton>
                            </div>
                            <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-700/30">
                                <SelectInput label="Fator CLD" value={electricSubTab === 'external' ? prob.CLD_electric_ext : prob.CLD_electric_int} options={CLD_ONLY_OPTIONS} onUpdate={v => handleProbabilityChange(electricSubTab === 'external' ? { CLD_electric_ext: v } : { CLD_electric_int: v })} />
                                <div className="space-y-1">
                                    <SelectInput label="Fator CLI" value={electricSubTab === 'external' ? prob.CLI_electric_ext : prob.CLI_electric_int} options={CLI_OPTIONS} onUpdate={v => handleProbabilityChange(electricSubTab === 'external' ? { CLI_electric_ext: v } : { CLI_electric_int: v })} />
                                    <p className="text-[10px] text-slate-400">PLD: <span className="font-bold text-blue-300">{formatSmartNumber(electricSubTab === 'external' ? zoneProbCalcs.PLD_electric_ext : zoneProbCalcs.PLD_electric_int, { maxDecimals: 3 })}</span></p>
                                </div>
                                {electricSubTab === 'internal' && (
                                    <SelectInput label="Ks3 (Fiação)" value={prob.Ks3_electric_int || 0} options={KS3_OPTIONS} onUpdate={v => handleProbabilityChange({ Ks3_electric_int: v })} />
                                )}
                                <SelectInput
                                    label="Resistência da Blindagem (rs)"
                                    value={(() => { const isShielded = electricSubTab === 'external' ? prob.is_shielded_electric_ext : prob.is_shielded_electric_int; const rs = electricSubTab === 'external' ? prob.rs_electric_ext : prob.rs_electric_int; return isShielded ? rs : -1; })()}
                                    options={RS_BLINDAGEM_OPTIONS}
                                    onUpdate={v => {
                                        if (v === -1) {
                                            handleProbabilityChange(electricSubTab === 'external' ? { is_shielded_electric_ext: false, rs_electric_ext: 20 } : { is_shielded_electric_int: false, rs_electric_int: 20 });
                                        } else {
                                            handleProbabilityChange(electricSubTab === 'external' ? { is_shielded_electric_ext: true, rs_electric_ext: v } : { is_shielded_electric_int: true, rs_electric_int: v });
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'data' && (
                        <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <SelectInput label="PEB" value={prob.PSPD_data} options={PSPD_OPTIONS} onUpdate={v => handleProbabilityChange({ PSPD_data: v })} />
                                <SelectInput label="Uw (kV)" value={prob.Uw_data_ext} options={UW_OPTIONS} onUpdate={v => handleProbabilityChange({ Uw_data_ext: v, Uw_data_int: v })} />
                            </div>
                            <div className="flex space-x-1 p-0.5 bg-slate-800/30 rounded">
                                <TabButton isActive={dataSubTab === 'internal'} onClick={() => setDataSubTab('internal')}>Interna</TabButton>
                                <TabButton isActive={dataSubTab === 'external'} onClick={() => setDataSubTab('external')}>Externa</TabButton>
                            </div>
                            <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-700/30">
                                <SelectInput label="Fator CLD" value={dataSubTab === 'external' ? prob.CLD_data_ext : prob.CLD_data_int} options={CLD_ONLY_OPTIONS} onUpdate={v => handleProbabilityChange(dataSubTab === 'external' ? { CLD_data_ext: v } : { CLD_data_int: v })} />
                                <div className="space-y-1">
                                    <SelectInput label="Fator CLI" value={dataSubTab === 'external' ? prob.CLI_data_ext : prob.CLI_data_int} options={CLI_OPTIONS} onUpdate={v => handleProbabilityChange(dataSubTab === 'external' ? { CLI_data_ext: v } : { CLI_data_int: v })} />
                                    <p className="text-[10px] text-slate-400">PLD: <span className="font-bold text-blue-300">{formatSmartNumber(dataSubTab === 'external' ? zoneProbCalcs.PLD_data_ext : zoneProbCalcs.PLD_data_int, { maxDecimals: 3 })}</span></p>
                                </div>
                                {dataSubTab === 'internal' && (
                                    <SelectInput label="Ks3 (Fiação)" value={prob.Ks3_data_int || 0} options={KS3_OPTIONS} onUpdate={v => handleProbabilityChange({ Ks3_data_int: v })} />
                                )}
                                <SelectInput
                                    label="Resistência da Blindagem (rs)"
                                    value={(() => { const isShielded = dataSubTab === 'external' ? prob.is_shielded_data_ext : prob.is_shielded_data_int; const rs = dataSubTab === 'external' ? prob.rs_data_ext : prob.rs_data_int; return isShielded ? rs : -1; })()}
                                    options={RS_BLINDAGEM_OPTIONS}
                                    onUpdate={v => {
                                        if (v === -1) {
                                            handleProbabilityChange(dataSubTab === 'external' ? { is_shielded_data_ext: false, rs_data_ext: 20 } : { is_shielded_data_int: false, rs_data_int: 20 });
                                        } else {
                                            handleProbabilityChange(dataSubTab === 'external' ? { is_shielded_data_ext: true, rs_data_ext: v } : { is_shielded_data_int: true, rs_data_int: v });
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-slate-700/50 bg-slate-900/60 backdrop-blur-sm shadow-xl shadow-black/20 group">
                <CardHeader className="py-2 px-4 border-b border-slate-700/20 bg-slate-900/40">
                    <CardTitle className="text-xs font-bold tracking-widest text-slate-400 flex items-center justify-between">
                        <span className="group-hover:text-slate-200 transition-colors">
                            {`Componentes de Probabilidade — ${activeHeading}`}
                        </span>
                        <div className="flex items-center gap-2">
                            <Checkbox id="show-global" checked={showGlobalBars} onCheckedChange={(v) => setShowGlobalBars(!!v)} className="border-slate-500" />
                            <Label htmlFor="show-global" className="text-[10px] text-slate-400 cursor-pointer uppercase tracking-widest font-bold">Global</Label>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[16rem] pt-3 pb-2">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} strokeOpacity={0.2} />
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
                        {!isMobile && (
                            <Tooltip content={<CustomTooltip probData={prob} probCalcs={zoneProbCalcs} showGlobalBars={showGlobalBars} />} cursor={{ fill: 'rgba(30, 41, 59, 0.4)' }} />
                        )}
                        <Bar dataKey="value" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                        {showGlobalBars && (
                            <Bar dataKey="globalValue" fill="#8b5cf6" fillOpacity={0.15} stroke="#a78bfa" strokeWidth={1} strokeDasharray="3 2" radius={[2, 2, 0, 0]} />
                        )}
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    </div>
    );
}

function SelectInput({ label, value, options, onUpdate }: { label: string; value: number; options: { value: number; label: string }[]; onUpdate: (val: number) => void }) {
    return (
        <div className="space-y-1">
            <Label className="text-[11px] font-semibold text-slate-300 leading-none">{label}</Label>
            <Select value={String(value)} onValueChange={(v) => onUpdate(parseFloat(v))} options={options}>
                <SelectTrigger className="h-7 text-[11px] px-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                    {options.map(opt => <SelectItem key={opt.value} value={String(opt.value)} label={opt.label} />)}
                </SelectContent>
            </Select>
        </div>
    );
}
