import React, { useCallback, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Label, TabButton, Alert, AlertDescription, Checkbox, useIsMobile } from '../ui';
import { formatSmartNumber } from '../../lib/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Rectangle } from "recharts";
import { AnalysisData, ProbabilityData } from '../../types';
import { PB_OPTIONS, PSPD_OPTIONS, PTA_OPTIONS, COMBINED_CLD_CLI_OPTIONS, PTU_OPTIONS, KS3_OPTIONS, UW_OPTIONS } from '../../constants';
import { DecimalInput } from '../DecimalInput';
import { AlertTriangle } from 'lucide-react';
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


const PROBABILITY_FORMULAS: { [key: string]: { formula: string; vars: string[] } } = {
    PA: { formula: "PTA × PB", vars: ["PTA", "PB"] },
    PB: { formula: "Seleção Direta (Nível SPDA)", vars: ["PB"] },
    // Internas
    PC: { formula: "PSPDₑ × CLDₑ(int)", vars: ["PSPD_electric", "CLD_electric_int"] },
    PCT: { formula: "PSPDₐ × CLDₐ(int)", vars: ["PSPD_data", "CLD_data_int"] },
    Pms: { formula: "(Ks1 × Ks2 × Ks3ₑ(int) × Ks4ₑ(int))²", vars: ["Ks1", "Ks2", "Ks3_electric_int", "Ks4_electric_int"] },
    Pmst: { formula: "(Ks1 × Ks2 × Ks3ₐ(int) × Ks4ₐ(int))²", vars: ["Ks1", "Ks2", "Ks3_data_int", "Ks4_data_int"] },
    PM: { formula: "PSPDₑ × Pms", vars: ["PSPD_electric", "Pms"] },
    PMT: { formula: "PSPDₐ × Pmst", vars: ["PSPD_data", "Pmst"] },
    // Externas
    PU: { formula: "PTUₑ × PEBₑ × PLDₑ(ext) × CLDₑ(ext)", vars: ["PTU_electric", "PEB_electric", "PLD_electric_ext", "CLD_electric_ext"] },
    PUT: { formula: "PTUₐ × PEBₐ × PLDₐ(ext) × CLDₐ(ext)", vars: ["PTU_data", "PEB_data", "PLD_data_ext", "CLD_data_ext"] },
    PV: { formula: "PEBₑ × PLDₑ(ext) × CLDₑ(ext)", vars: ["PEB_electric", "PLD_electric_ext", "CLD_electric_ext"] },
    PVT: { formula: "PEBₐ × PLDₐ(ext) × CLDₐ(ext)", vars: ["PEB_data", "PLD_data_ext", "CLD_data_ext"] },
    PW: { formula: "PSPDₑ × PLDₑ(ext) × CLDₑ(ext)", vars: ["PSPD_electric", "PLD_electric_ext", "CLD_electric_ext"] },
    PWT: { formula: "PSPDₐ × PLDₐ(ext) × CLDₐ(ext)", vars: ["PSPD_data", "PLD_data_ext", "CLD_data_ext"] },
    PZ: { formula: "PSPDₑ × CLIₑ(ext) × Pliₑ(ext)", vars: ["PSPD_electric", "CLI_electric_ext", "Pli_electric_ext"] },
    PZT: { formula: "PSPDₐ × CLIₐ(ext) × Pliₐ(ext)", vars: ["PSPD_data", "CLI_data_ext", "Pli_data_ext"] },
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
            if (!info || !rawFormula) return formatValues(info);
            if (!info.vars || info.vars.length === 0) return rawFormula;
            try {
                const regex = new RegExp(`\\b(${info.vars.join('|')})\\b`, 'g');
                return rawFormula.replace(regex, (match) => (allValues[match] ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 3 }));
            } catch {
                return formatValues(info);
            }
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

        const tooltipStyle: React.CSSProperties = {
            transform: 'translate(10px, calc(-100% - 10px))',
            pointerEvents: 'none',
        };

            return (
                <div 
                    style={tooltipStyle}
                    className="p-3 bg-slate-800/90 border rounded-lg shadow-lg text-sm border-slate-600 backdrop-blur-sm w-auto min-w-[18rem] max-w-[48rem]"
                >
                <p className="font-bold text-slate-100 text-base mb-1">{label}</p>
                {showGlobalBars && payload[0]?.payload?.globalValue !== undefined && (
                    <p className="text-indigo-400 font-mono">Global: <ScientificNotation value={Number(payload[0].payload.globalValue)} precision={2} /></p>
                )}
                <p className="text-blue-400 font-mono">Zona: <ScientificNotation value={Number(payload[0].value)} precision={2} /></p>
                
                {formulaInfo && (
                    <div className="mt-2 border-b border-slate-700 pb-2">
                        <p className="text-slate-300 font-semibold">Fórmula:</p>
                        <p className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs sm:text-sm leading-tight">{formulaInfo.formula}</p>
                        <p className="text-slate-300 mt-2 font-semibold">Valores:</p>
                        <p className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs sm:text-sm break-normal whitespace-normal leading-tight">{valuesString}</p>
                        <p className="text-slate-300 mt-2 font-semibold">{label === 'PM' ? 'Cálculo (PM)' : label === 'PMT' ? 'Cálculo (PMT)' : 'Cálculo:'}</p>
                        <p className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs sm:text-sm break-normal whitespace-normal leading-tight">
                            <span className="inline-flex items-baseline">{valuesString}</span>
                            <span className="mx-0.5">=</span>
                            <ScientificNotation value={Number(payload[0].value)} precision={2} />
                        </p>
                    </div>
                )}
                
                {subComponentLabel && subComponentFormulaInfo && (
                    <div className="mt-2">
                         <p className="font-bold text-slate-200 text-sm mb-1">Componente: {subComponentLabel}</p>
                         <p className="text-cyan-400 font-mono text-xs">Valor: <ScientificNotation value={Number(allValues[subComponentLabel] ?? 0)} precision={2} /></p>
                        
                         <p className="text-slate-300 mt-2 font-semibold text-xs">Fórmula ({subComponentLabel}):</p>
                         <p className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs sm:text-sm leading-tight">{subComponentFormulaInfo.formula}</p>
                         <p className="text-slate-300 mt-2 font-semibold text-xs">Valores ({subComponentLabel}):</p>
                         <p className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs sm:text-sm break-normal whitespace-normal leading-tight">{formatFormulaWithValues(subComponentFormulaInfo, subComponentFormulaInfo?.formula)}</p>
                         <p className="text-slate-300 mt-2 font-semibold text-xs">Cálculo ({subComponentLabel}):</p>
                         <p className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs sm:text-sm break-normal whitespace-normal leading-tight">{getCalcStringForSub(subComponentLabel)}</p>
                    </div>
                )}
            </div>
        );
    }
    return null;
};

// Removido: utilitário de modo de testes (não utilizado)

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
    // Removido conceito de visão Global para etapa 7
    useEffect(() => {
        const desired = data.last_active_zone_id || zones[0]?.id || '';
        if (desired && desired !== activeZoneId) {
            setActiveZoneId(desired);
        } else if (!zones.find(z => z.id === activeZoneId)) {
            setActiveZoneId(zones[0]?.id || '');
        }
    }, [data.last_active_zone_id, zones, activeZoneId]);
    // Global só disponível quando há múltiplas zonas
    const currentZone = (zones.find(z => z.id === activeZoneId) || zones[0]);
    const prob = (currentZone?.probability_data || data.probability_data);
    // Removidos: estados do modo de testes
    // Estado de zonas para edição de overrides por zona
    // Removidos: estados do modo de testes

    useEffect(() => {
        if (activeTab === 'electric' && !data.has_electric_line) {
            setActiveTab('structure');
        }
        if (activeTab === 'data' && !data.has_data_line) {
            setActiveTab('structure');
        }
    }, [data.has_electric_line, data.has_data_line, activeTab]);

    // Persistir seleção de "Mostrar barras globais" entre navegações
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('probability_showGlobalBars', String(showGlobalBars));
        }
    }, [showGlobalBars]);

    // Chaves que devem sincronizar entre global e todas as zonas
    const GLOBAL_SYNC_KEYS = ['PB', 'PEB_electric', 'PEB_data', 'PSPD_electric', 'PSPD_data'];

    // Centralized function to handle all probability state changes and recalculate PLD immediately.
    const handleProbabilityChange = useCallback((updates: Partial<ProbabilityData>) => {
        const fields = Object.keys(updates);
        const keysToSync = GLOBAL_SYNC_KEYS.filter(k => fields.includes(k));
        // Se existe uma zona ativa, atualiza os parâmetros de probabilidade apenas daquela zona.
        if (currentZone) {
            const newZoneProb: ProbabilityData = { ...(currentZone.probability_data || data.probability_data), ...updates } as ProbabilityData;

            // Recalcular PLD somente para parâmetros EXTERNOS
            const electricExtChanged = 'is_shielded_electric_ext' in updates || 'rs_electric_ext' in updates || 'Uw_electric_ext' in updates;
            if (electricExtChanged) {
                newZoneProb.PLD_electric_ext = calculatePld(
                    newZoneProb.rs_electric_ext,
                    newZoneProb.Uw_electric_ext,
                    newZoneProb.is_shielded_electric_ext
                );
            }
            const dataExtChanged = 'is_shielded_data_ext' in updates || 'rs_data_ext' in updates || 'Uw_data_ext' in updates;
            if (dataExtChanged) {
                newZoneProb.PLD_data_ext = calculatePld(
                    newZoneProb.rs_data_ext,
                    newZoneProb.Uw_data_ext,
                    newZoneProb.is_shielded_data_ext
                );
            }

            if (keysToSync.length > 0) {
                const changesForAll: Partial<ProbabilityData> = {};
                keysToSync.forEach(k => { (changesForAll as any)[k] = (newZoneProb as any)[k]; });
                const updatedZones = zones.map(z => {
                    const base = (z.probability_data || data.probability_data);
                    const merged = { ...base, ...changesForAll } as ProbabilityData;
                    // Para a zona ativa, manter também outras mudanças específicas
                    const finalProb = z.id === (currentZone?.id || activeZoneId) ? { ...merged, ...updates } as ProbabilityData : merged;
                    const nextOverrides = { ...(z.probability_overrides || {}) } as any;
                    keysToSync.forEach(k => { delete nextOverrides[k]; });
                    return { ...z, probability_data: finalProb, probability_overrides: nextOverrides };
                });
                onChange({ zones: updatedZones, probability_data: { ...data.probability_data, ...changesForAll } });
            } else {
                const updatedZones = zones.map(z => z.id === (currentZone?.id || activeZoneId) ? { ...z, probability_data: newZoneProb } : z);
                onChange({ zones: updatedZones });
            }
        } else {
            const newProbData = { ...data.probability_data, ...updates };
            const electricExtChanged = 'is_shielded_electric_ext' in updates || 'rs_electric_ext' in updates || 'Uw_electric_ext' in updates;
            if (electricExtChanged) {
                newProbData.PLD_electric_ext = calculatePld(
                    newProbData.rs_electric_ext,
                    newProbData.Uw_electric_ext,
                    newProbData.is_shielded_electric_ext
                );
            }
            const dataExtChanged = 'is_shielded_data_ext' in updates || 'rs_data_ext' in updates || 'Uw_data_ext' in updates;
            if (dataExtChanged) {
                newProbData.PLD_data_ext = calculatePld(
                    newProbData.rs_data_ext,
                    newProbData.Uw_data_ext,
                    newProbData.is_shielded_data_ext
                );
            }
            if (keysToSync.length > 0) {
                const changesForAll: Partial<ProbabilityData> = {};
                keysToSync.forEach(k => { (changesForAll as any)[k] = (newProbData as any)[k]; });
                const updatedZones = zones.map(z => {
                    const base = (z.probability_data || data.probability_data);
                    const merged = { ...base, ...changesForAll } as ProbabilityData;
                    const nextOverrides = { ...(z.probability_overrides || {}) } as any;
                    keysToSync.forEach(k => { delete nextOverrides[k]; });
                    return { ...z, probability_data: merged, probability_overrides: nextOverrides };
                });
                onChange({ probability_data: newProbData, zones: updatedZones });
            } else {
                onChange({ probability_data: newProbData });
            }
        }
    }, [currentZone, zones, activeZoneId, data.probability_data, onChange]);
    
    const handleCombinedChange = (value: string, lineType: 'electric' | 'data', scope: 'external' | 'internal' = 'external') => {
        const [cld, cli] = value.split('_').map(parseFloat);
        if (lineType === 'electric') {
            if (scope === 'external') {
                handleProbabilityChange({ CLD_electric_ext: cld, CLI_electric_ext: cli });
            } else {
                handleProbabilityChange({ CLD_electric_int: cld });
            }
        } else {
            if (scope === 'external') {
                handleProbabilityChange({ CLD_data_ext: cld, CLI_data_ext: cli });
            } else {
                handleProbabilityChange({ CLD_data_int: cld });
            }
        }
    };

    // ===== Handlers específicos por zona =====
    const handleProbabilityChangeForZone = useCallback((zoneId: string, updates: Partial<ProbabilityData>) => {
        const zone = zones.find(z => z.id === zoneId);
        if (zone) {
            const baseProb = (zone.probability_data || data.probability_data);
            const newZoneProb: ProbabilityData = { ...baseProb, ...updates } as ProbabilityData;

            // Limpeza de overrides dependentes quando parâmetros-base mudam
            const fields = Object.keys(updates);
            const clearKeys = new Set<string>();

            // PB selecionado diretamente: remover override PB
            if (fields.includes('PB')) {
                clearKeys.add('PB');
                // PB impacta PA = PTA × PB, limpar override de PA para refletir novo PB
                clearKeys.add('PA');
            }
            // PTA impacta PA = PTA × PB, limpar override de PA quando PTA muda
            if (fields.includes('PTA')) {
                clearKeys.add('PA');
            }
            // Mudanças que afetam probabilidades internas de linha elétrica
            if (fields.includes('PSPD_electric') || fields.includes('CLD_electric_int') || fields.includes('Ks3_electric_int') || fields.includes('Ks4_electric_int')) {
                clearKeys.add('PC');
                clearKeys.add('PM');
                // PSPD_electric também impacta probabilidades externas PW/PZ
                if (fields.includes('PSPD_electric')) { clearKeys.add('PW'); clearKeys.add('PZ'); }
            }
            // Ks1/Ks2 dependem de wm1/wm2 e impactam PM/PMT via Pms/Pmst
            if (fields.includes('wm1') || fields.includes('wm2')) {
                clearKeys.add('PM');
                clearKeys.add('PMT');
            }
            // Mudanças que afetam probabilidades internas de linha de dados
            if (fields.includes('PSPD_data') || fields.includes('CLD_data_int') || fields.includes('Ks3_data_int') || fields.includes('Ks4_data_int')) {
                clearKeys.add('PCT');
                clearKeys.add('PMT');
                // PSPD_data também impacta probabilidades externas PWT/PZT
                if (fields.includes('PSPD_data')) { clearKeys.add('PWT'); clearKeys.add('PZT'); }
            }
            // Mudanças externas que impactam PU/PV/PW/PZ (elétrica)
            if (fields.includes('CLD_electric_ext') || fields.includes('CLI_electric_ext') || fields.includes('is_shielded_electric_ext') || fields.includes('rs_electric_ext') || fields.includes('Uw_electric_ext')) {
                clearKeys.add('PU');
                clearKeys.add('PV');
                clearKeys.add('PW');
                clearKeys.add('PZ');
            }
            // Mudanças externas que impactam PUT/PVT/PWT/PZT (dados)
            if (fields.includes('CLD_data_ext') || fields.includes('CLI_data_ext') || fields.includes('is_shielded_data_ext') || fields.includes('rs_data_ext') || fields.includes('Uw_data_ext')) {
                clearKeys.add('PUT');
                clearKeys.add('PVT');
                clearKeys.add('PWT');
                clearKeys.add('PZT');
            }
            // PTU e PEB impactam conjuntos específicos
            if (fields.includes('PTU_electric')) { clearKeys.add('PU'); }
            if (fields.includes('PTU_data')) { clearKeys.add('PUT'); }
            if (fields.includes('PEB_electric')) { clearKeys.add('PV'); clearKeys.add('PU'); }
            if (fields.includes('PEB_data')) { clearKeys.add('PVT'); clearKeys.add('PUT'); }

            const electricExtChanged = 'is_shielded_electric_ext' in updates || 'rs_electric_ext' in updates || 'Uw_electric_ext' in updates;
            if (electricExtChanged) {
                newZoneProb.PLD_electric_ext = calculatePld(
                    newZoneProb.rs_electric_ext,
                    newZoneProb.Uw_electric_ext,
                    newZoneProb.is_shielded_electric_ext
                );
            }

            const dataExtChanged = 'is_shielded_data_ext' in updates || 'rs_data_ext' in updates || 'Uw_data_ext' in updates;
            if (dataExtChanged) {
                newZoneProb.PLD_data_ext = calculatePld(
                    newZoneProb.rs_data_ext,
                    newZoneProb.Uw_data_ext,
                    newZoneProb.is_shielded_data_ext
                );
            }

            const fields = Object.keys(updates);
            const keysToSync = GLOBAL_SYNC_KEYS.filter(k => fields.includes(k));
            if (keysToSync.length > 0) {
                const changesForAll: Partial<ProbabilityData> = {};
                keysToSync.forEach(k => { (changesForAll as any)[k] = (newZoneProb as any)[k]; });
                const updatedZones = zones.map(z => {
                    const base = (z.probability_data || data.probability_data);
                    const mergedBase = { ...base, ...changesForAll } as ProbabilityData;
                    const finalProb = z.id === zoneId ? { ...mergedBase, ...updates } as ProbabilityData : mergedBase;
                    const nextOverrides = { ...(z.probability_overrides || {}) } as any;
                    // Remover todas as chaves marcadas para limpeza
                    clearKeys.forEach(k => { delete nextOverrides[k]; });
                    keysToSync.forEach(k => { delete nextOverrides[k]; });
                    return { ...z, probability_data: finalProb, probability_overrides: nextOverrides };
                });
                onChange({ zones: updatedZones, probability_data: { ...data.probability_data, ...changesForAll } });
            } else {
                const updatedZones = zones.map(z => {
                    if (z.id !== zoneId) return z;
                    const nextOverrides = { ...(z.probability_overrides || {}) };
                    // Remover todas as chaves marcadas para limpeza
                    clearKeys.forEach(k => { delete nextOverrides[k]; });
                    return { ...z, probability_data: newZoneProb, probability_overrides: nextOverrides };
                });
                onChange({ zones: updatedZones });
            }
        } else {
            const newProbData = { ...data.probability_data, ...updates };
            const electricExtChanged = 'is_shielded_electric_ext' in updates || 'rs_electric_ext' in updates || 'Uw_electric_ext' in updates;
            if (electricExtChanged) {
                newProbData.PLD_electric_ext = calculatePld(
                    newProbData.rs_electric_ext,
                    newProbData.Uw_electric_ext,
                    newProbData.is_shielded_electric_ext
                );
            }
            const dataExtChanged = 'is_shielded_data_ext' in updates || 'rs_data_ext' in updates || 'Uw_data_ext' in updates;
            if (dataExtChanged) {
                newProbData.PLD_data_ext = calculatePld(
                    newProbData.rs_data_ext,
                    newProbData.Uw_data_ext,
                    newProbData.is_shielded_data_ext
                );
            }
            const fields = Object.keys(updates);
            const keysToSync = GLOBAL_SYNC_KEYS.filter(k => fields.includes(k));
            if (keysToSync.length > 0) {
                const changesForAll: Partial<ProbabilityData> = {};
                keysToSync.forEach(k => { (changesForAll as any)[k] = (newProbData as any)[k]; });
                const updatedZones = zones.map(z => {
                    const base = (z.probability_data || data.probability_data);
                    const merged = { ...base, ...changesForAll } as ProbabilityData;
                    const nextOverrides = { ...(z.probability_overrides || {}) } as any;
                    keysToSync.forEach(k => { delete nextOverrides[k]; });
                    return { ...z, probability_data: merged, probability_overrides: nextOverrides };
                });
                onChange({ probability_data: newProbData, zones: updatedZones });
            } else {
                onChange({ probability_data: newProbData });
            }
        }
    }, [zones, data.probability_data, onChange]);

    const handleCombinedChangeForZone = (zoneId: string, value: string, lineType: 'electric' | 'data', scope: 'external' | 'internal' = 'external') => {
        const [cld, cli] = value.split('_').map(parseFloat);
        if (lineType === 'electric') {
            if (scope === 'external') {
                handleProbabilityChangeForZone(zoneId, { CLD_electric_ext: cld, CLI_electric_ext: cli });
            } else {
                handleProbabilityChangeForZone(zoneId, { CLD_electric_int: cld });
            }
        } else {
            if (scope === 'external') {
                handleProbabilityChangeForZone(zoneId, { CLD_data_ext: cld, CLI_data_ext: cli });
            } else {
                handleProbabilityChangeForZone(zoneId, { CLD_data_int: cld });
            }
        }
    };

    // Removido: cálculos locais de Ks4 não utilizados

    const zoneAnalyzeData = (currentZone?.analyze_data_line_probabilities ?? data.analyze_data_line_probabilities);
    const zoneAnalyzeElectric = (currentZone?.analyze_electric_line_probabilities ?? data.analyze_electric_line_probabilities);
    const zoneProbCalcsBase = calculateProbabilities(
        prob,
        zoneAnalyzeData,
        data.has_data_line,
        zoneAnalyzeElectric
    );
    // Cálculos globais (projeto) para comparação nas barras — usam os parâmetros globais do projeto
    const globalAnalyzeData = (data.analyze_data_line_probabilities ?? zoneAnalyzeData);
    const globalAnalyzeElectric = (data.analyze_electric_line_probabilities ?? zoneAnalyzeElectric);
    const globalProbCalcsBase = calculateProbabilities(
        data.probability_data,
        globalAnalyzeData,
        data.has_data_line,
        globalAnalyzeElectric
    );
    const zoneProbCalcs = mergeZoneProbabilities(zoneProbCalcsBase, currentZone || { id: '', name: '', loss_data: {} });
    // Garantir que o gráfico receba apenas números finitos para evitar falhas do Recharts
    const toFinite = (v: any) => {
        const n = Number(v);
        return Number.isFinite(n) && !Number.isNaN(n) ? n : 0;
    };
    const chartData = Object.entries(zoneProbCalcs)
        .filter(([key]) => ![
            'Ks1',
            'Ks2',
            'Ks4_electric_int',
            'Ks4_data_int',
            'Pli_electric_ext',
            'Pli_data_ext',
            'PEB_electric',
            'PEB_data',
            'Pms',
            'Pmst',
            // Ocultar barras de parâmetros PSPD (elétrica e dados) conforme solicitado
            'PSPD_electric',
            'PSPD_data'
        ].includes(key)) 
        .map(([key, value]) => ({ 
            name: key, 
            value: toFinite(value), 
            ...(showGlobalBars ? { globalValue: toFinite((globalProbCalcsBase as any)[key]) } : {}), 
            fill: '#3b82f6' 
        }));
    
    const { Ks1: calculatedKs1 = 0, Ks2: calculatedKs2 = 0 } = zoneProbCalcsBase;
    const isKs1Capped = (prob.wm1 || 0) * 0.12 > 1;
    const isKs2Capped = (prob.wm2 || 0) * 0.12 > 1;

    // ===== Overrides de Probabilidade por Zona =====
    const homogeneousType = currentZone?.homogeneous_type || 'P';
    const PROB_KEYS: string[] = ['PA','PB','PC','PCT','PM','PMT','PU','PUT','PV','PVT','PW','PWT','PZ','PZT'];

    const handleHomogeneousTypeChange = (type: 'P' | 'L') => {
        const updatedZones = zones.map(z => z.id === (currentZone?.id || activeZoneId) ? { ...z, homogeneous_type: type } : z);
        onChange({ zones: updatedZones });
    };

    const handleProbOverrideUpdate = (key: string, value: number) => {
        const updatedZones = zones.map(z => {
            if (z.id !== (currentZone?.id || activeZoneId)) return z;
            const nextOverrides = { ...(z.probability_overrides || {}) };
            nextOverrides[key] = value;
            return { ...z, probability_overrides: nextOverrides };
        });
        onChange({ zones: updatedZones });
    };

    const handleRemoveProbOverride = (key: string) => {
        const updatedZones = zones.map(z => {
            if (z.id !== (currentZone?.id || activeZoneId)) return z;
            const next = { ...(z.probability_overrides || {}) };
            delete next[key];
            return { ...z, probability_overrides: next };
        });
        onChange({ zones: updatedZones });
    };

    // Heading helper para nome da zona ativa
    const currentZoneIndex = zones.findIndex(z => z.id === (currentZone?.id || activeZoneId));
    const makeZoneHeading = (zoneName: string | undefined, idx: number) => {
        const base = `Zona ${idx + 1}`;
        const name = (zoneName || '').trim();
        if (!name) return base;
        const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
        if (norm(name) === norm(base)) return base;
        return `${base} (${name})`;
    };
    const zoneHeading = makeZoneHeading(currentZone?.name, Math.max(0, currentZoneIndex));
    const multipleZones = zones.length > 1;
    const activeHeading = zoneHeading;


    // Removido conceito Global na etapa 7 — usamos apenas cálculos da zona ativa

    return (
        <div className="grid grid-cols-1 gap-6">
            {/* Configuração/Resultados — Aba Global + Zonas no mesmo card */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{`Ajuste de Probabilidades — ${activeHeading}`}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {multipleZones && (
                            <div className="flex space-x-1 p-1 bg-slate-800/70 rounded-lg">
                                {zones.map(zone => (
                                    <TabButton 
                                        key={zone.id} 
                                        isActive={activeZoneId === zone.id} 
                                        onClick={() => {
                                            setActiveZoneId(zone.id);
                                            // Persistir última zona ativa
                                            try { onChange({ last_active_zone_id: zone.id } as any); } catch { /* noop */ }
                                        }}
                                    >
                                        {zone.name}
                                    </TabButton>
                                ))}
                            </div>
                        )}

                        <div className="flex space-x-2 p-1 bg-slate-800/70 rounded-lg">
                            <TabButton isActive={activeTab === 'structure'} onClick={() => setActiveTab('structure')}>Estrutura</TabButton>
                            {data.has_electric_line && <TabButton isActive={activeTab === 'electric'} onClick={() => setActiveTab('electric')}>Linha Elétrica</TabButton>}
                            {data.has_data_line && <TabButton isActive={activeTab === 'data'} onClick={() => setActiveTab('data')}>Linha de Dados</TabButton>}
                        </div>

                        {activeTab === 'structure' && (
                            <div className="grid md:grid-cols-2 gap-4 pt-2">
                                <div>
                                    <SelectInput label="PTA - Medidas de Proteção" value={prob.PTA} options={PTA_OPTIONS} onUpdate={v => handleProbabilityChangeForZone(activeZoneId, { PTA: v })} />
                                </div>
                                <div>
                                    <SelectInput 
                                        label="PB - Nível do SPDA" 
                                        value={currentZone?.probability_overrides?.PB ?? prob.PB} 
                                        options={PB_OPTIONS} 
                                        onUpdate={(v) => {
                                            // Atualiza PB e remove override em UM patch para evitar corrida de estado
                                            const updatedZones = zones.map(z => {
                                                if (z.id !== (currentZone?.id || activeZoneId)) return z;
                                                const baseProb = (z.probability_data || data.probability_data);
                                                const newZoneProb = { ...baseProb, PB: v } as ProbabilityData;
                                                const nextOverrides = { ...(z.probability_overrides || {}) };
                                                delete nextOverrides.PB;
                                                return { ...z, probability_data: newZoneProb, probability_overrides: nextOverrides };
                                            });
                                            onChange({ zones: updatedZones });
                                        }} 
                                    />
                                </div>
                                <div>
                                    <DecimalInput label="KS1: Largura da malha wm1 (m)" value={prob.wm1} onUpdate={v => handleProbabilityChangeForZone(activeZoneId, { wm1: v })} />
                                    <p className="text-xs text-slate-400 mt-1">Ks1 calculado: <span className="font-bold text-blue-300">{formatSmartNumber(zoneProbCalcsBase.Ks1 || 0, { maxDecimals: 3, useScientificBelow: 0 })}</span></p>
                                    {isKs1Capped && (
                                        <Alert variant="destructive" className="mt-2 p-2 text-xs flex items-center">
                                            <AlertTriangle className="h-4 w-4 mr-2"/>
                                            <AlertDescription>O valor de Ks1 foi limitado a 1.0. Valor máximo de wm1 é ~8.33m.</AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                                <div>
                                    <DecimalInput label="KS2: Largura da malha wm2 (m)" value={prob.wm2} onUpdate={v => handleProbabilityChangeForZone(activeZoneId, { wm2: v })} />
                                    <p className="text-xs text-slate-400 mt-1">Ks2 calculado: <span className="font-bold text-blue-300">{formatSmartNumber(zoneProbCalcsBase.Ks2 || 0, { maxDecimals: 3, useScientificBelow: 0 })}</span></p>
                                    {isKs2Capped && (
                                        <Alert variant="destructive" className="mt-2 p-2 text-xs flex items-center">
                                            <AlertTriangle className="h-4 w-4 mr-2"/>
                                            <AlertDescription>O valor de Ks2 foi limitado a 1.0. Valor máximo de wm2 é ~8.33m.</AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'electric' && (
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center space-x-2 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                                    <Checkbox
                                        id={`analyze_electric_line_probs_active`}
                                        checked={zoneAnalyzeElectric}
                                        onCheckedChange={(checked) => {
                                            const val = !!checked;
                                            if (currentZone) {
                                                const updatedZones = zones.map(z => {
                                                    if (z.id !== (currentZone?.id || activeZoneId)) return z;
                                                    // Ao desativar a análise da linha elétrica na zona, limpar overrides relacionados
                                                    const nextOverrides = { ...(z.probability_overrides || {}) };
                                                    if (!val) {
                                                        ['PC','PM','PU','PV','PW','PZ'].forEach(k => { delete nextOverrides[k]; });
                                                    }
                                                    return { ...z, analyze_electric_line_probabilities: val, probability_overrides: nextOverrides };
                                                });
                                                onChange({ zones: updatedZones });
                                            } else {
                                                onChange({ analyze_electric_line_probabilities: val });
                                            }
                                        }}
                                    />
                                    <Label htmlFor={`analyze_electric_line_probs_active`} className="cursor-pointer flex-1">
                                        Analisar Fatores de Probabilidade para Linha Elétrica
                                    </Label>
                                </div>
                                <p className="text-xs text-slate-400 px-1">
                                    Desmarque esta opção se a linha elétrica não possui cabeamento interno.
                                </p>
                                <AnimatePresence>
                                    {zoneAnalyzeElectric && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-visible"
                                        >
                                            <div className="grid md:grid-cols-6 lg:grid-cols-12 gap-4 pt-2">
                                                <div className="md:col-span-3 lg:col-span-3">
                                                    <SelectInput label="PTU - Medida de proteção" value={prob.PTU_electric} options={PTU_OPTIONS} onUpdate={(v) => handleProbabilityChangeForZone(activeZoneId, { PTU_electric: v })} />
                                                </div>
                                                <div className="md:col-span-3 lg:col-span-3">
                                                    <SelectInput label="PEB - Prot. Surto Cond. D1/D2" value={prob.PEB_electric} options={pebOptions} onUpdate={(v) => handleProbabilityChangeForZone(activeZoneId, { PEB_electric: v })} />
                                                </div>
                                                <div className="md:col-span-3 lg:col-span-3">
                                                    <SelectInput label="PSPD - Surto Ind. - D3" value={prob.PSPD_electric} options={PSPD_OPTIONS} onUpdate={(v) => handleProbabilityChangeForZone(activeZoneId, { PSPD_electric: v })} />
                                                </div>
                                            </div>

                                            <div className="flex space-x-2 p-1 bg-slate-800/70 rounded-lg mt-3">
                                                <TabButton isActive={electricSubTab === 'external'} onClick={() => setElectricSubTab('external')}>Externa</TabButton>
                                                <TabButton isActive={electricSubTab === 'internal'} onClick={() => setElectricSubTab('internal')}>Interna</TabButton>
                                            </div>

                                            {electricSubTab === 'external' && (
                                                <div className="grid md:grid-cols-6 lg:grid-cols-12 gap-4">
                                                    <div className="md:col-span-3 lg:col-span-3">
                                                        <SelectInput label="Uw - Tensão Suportável (kV)" value={prob.Uw_electric_ext} options={UW_OPTIONS} onUpdate={v => handleProbabilityChangeForZone(activeZoneId, { Uw_electric_ext: v })} />
                                                    </div>
                                                    <div className="md:col-span-3 lg:col-span-3">
                                                        <ShieldingSlider 
                                                            isShielded={prob.is_shielded_electric_ext}
                                                            rsValue={prob.rs_electric_ext}
                                                            uw={prob.Uw_electric_ext}
                                                            onChange={(isShielded, rs) => handleProbabilityChangeForZone(activeZoneId, { is_shielded_electric_ext: isShielded, rs_electric_ext: rs })}
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2 lg:col-span-2">
                                                        <Ks4DisplayBox value={(prob.Uw_electric_ext || 1) > 0 ? (1 / (prob.Uw_electric_ext || 1)) : 1} />
                                                    </div>
                                                    <div className="md:col-span-2 lg:col-span-2">
                                                        <PldDisplayBox value={prob.PLD_electric_ext || 0} />
                                                    </div>
                                                    <div className="md:col-span-2 lg:col-span-2">
                                                        <PliDisplayBox value={zoneProbCalcsBase.Pli_electric_ext || 0} />
                                                    </div>
                                                    <div className="md:col-span-6 lg:col-span-12">
                                                        <div className="space-y-2">
                                                            <Label>CLD/CLI - Blindagem da Linha e Comp. Interno (Tabela B.4)</Label>
                                                            <Select
                                                                value={`${prob.CLD_electric_ext}_${prob.CLI_electric_ext}`}
                                                                onValueChange={(v) => handleCombinedChangeForZone(activeZoneId, v, 'electric', 'external')}
                                                                options={COMBINED_CLD_CLI_OPTIONS}
                                                                placeholder="Selecione o tipo de blindagem e componente..."
                                                            >
                                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                                <SelectContent>
                                                                    {COMBINED_CLD_CLI_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value} label={opt.label} />)}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="text-xs text-slate-300 italic mt-2">
                                                            Estes parâmetros (CLD/CLI, Uw, Rs) impactam PU, PV, PW e PZ.
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {electricSubTab === 'internal' && (
                                                <div className="grid md:grid-cols-6 lg:grid-cols-12 gap-4">
                                                    <div className="md:col-span-3 lg:col-span-3">
                                                        <SelectInput label="Ks3 - Fiação interna" value={prob.Ks3_electric_int} options={KS3_OPTIONS} onUpdate={(v) => handleProbabilityChangeForZone(activeZoneId, { Ks3_electric_int: v })} />
                                                    </div>
                                                    <div className="md:col-span-3 lg:col-span-3">
                                                        <SelectInput label="Uw - Tensão Suportável (kV)" value={prob.Uw_electric_int} options={UW_OPTIONS} onUpdate={v => handleProbabilityChangeForZone(activeZoneId, { Uw_electric_int: v })} />
                                                    </div>
                                                    <div className="md:col-span-2 lg:col-span-2">
                                                        <Ks4DisplayBox value={(prob.Uw_electric_int || 1) > 0 ? (1 / (prob.Uw_electric_int || 1)) : 1} />
                                                    </div>
                                                    <div className="md:col-span-6 lg:col-span-12">
                                                        <div className="space-y-2">
                                                            <Label>CLD - Blindagem da Linha (Tabela B.4)</Label>
                                                            <Select
                                                                value={`${prob.CLD_electric_int}_1`}
                                                                onValueChange={(v) => handleCombinedChangeForZone(activeZoneId, v, 'electric', 'internal')}
                                                                options={COMBINED_CLD_CLI_OPTIONS}
                                                                placeholder="Selecione o tipo de blindagem..."
                                                            >
                                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                                <SelectContent>
                                                                    {COMBINED_CLD_CLI_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value} label={opt.label} />)}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="text-xs text-slate-300 italic mt-2">
                                                            Estes parâmetros (CLD, Ks3, Uw) impactam PC e PM.
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {activeTab === 'data' && (
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center space-x-2 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                                    <Checkbox
                                        id={`analyze_data_line_probs_active`}
                                        checked={zoneAnalyzeData}
                                        onCheckedChange={(checked) => {
                                            const val = !!checked;
                                            if (currentZone) {
                                                const updatedZones = zones.map(z => {
                                                    if (z.id !== (currentZone?.id || activeZoneId)) return z;
                                                    // Ao desativar a análise da linha de dados na zona, limpar overrides relacionados
                                                    const nextOverrides = { ...(z.probability_overrides || {}) };
                                                    if (!val) {
                                                        ['PCT','PMT','PUT','PVT','PWT','PZT'].forEach(k => { delete nextOverrides[k]; });
                                                    }
                                                    return { ...z, analyze_data_line_probabilities: val, probability_overrides: nextOverrides };
                                                });
                                                onChange({ zones: updatedZones });
                                            } else {
                                                onChange({ analyze_data_line_probabilities: val });
                                            }
                                        }}
                                    />
                                    <Label htmlFor={`analyze_data_line_probs_active`} className="cursor-pointer flex-1">
                                        Analisar Fatores de Probabilidade para Linha de Dados
                                    </Label>
                                </div>
                                <p className="text-xs text-slate-400 px-1">
                                    Desmarque esta opção se a linha de dados termina na entrada (ex: modem) e não possui cabeamento interno.
                                </p>
                                <AnimatePresence>
                                    {zoneAnalyzeData && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-visible"
                                        >
                                            <div className="grid md:grid-cols-6 lg:grid-cols-12 gap-4 pt-2">
                                                <div className="md:col-span-3 lg:col-span-3">
                                                    <SelectInput label="PTU - Medida de proteção" value={prob.PTU_data} options={PTU_OPTIONS} onUpdate={(v) => handleProbabilityChangeForZone(activeZoneId, { PTU_data: v })} />
                                                </div>
                                                <div className="md:col-span-3 lg:col-span-3">
                                                    <SelectInput label="PEB - Prot. Surto Cond. D1/D2" value={prob.PEB_data} options={pebOptions} onUpdate={(v) => handleProbabilityChangeForZone(activeZoneId, { PEB_data: v })} />
                                                </div>
                                                <div className="md:col-span-3 lg:col-span-3">
                                                    <SelectInput label="PSPD - Surto Ind. - D3" value={prob.PSPD_data} options={PSPD_OPTIONS} onUpdate={(v) => handleProbabilityChangeForZone(activeZoneId, { PSPD_data: v })} />
                                                </div>
                                                <div className="flex space-x-2 p-1 bg-slate-800/70 rounded-lg md:col-span-6 lg:col-span-12 mt-3">
                                                    <TabButton isActive={dataSubTab === 'external'} onClick={() => setDataSubTab('external')}>Externa</TabButton>
                                                    <TabButton isActive={dataSubTab === 'internal'} onClick={() => setDataSubTab('internal')}>Interna</TabButton>
                                                </div>

                                                {dataSubTab === 'external' && (
                                                    <>
                                                        <div className="md:col-span-3 lg:col-span-3">
                                                            <SelectInput label="Uw - Tensão Suportável (kV)" value={prob.Uw_data_ext} options={UW_OPTIONS} onUpdate={v => handleProbabilityChangeForZone(activeZoneId, { Uw_data_ext: v })} />
                                                        </div>
                                                        <div className="md:col-span-3 lg:col-span-3">
                                                            <ShieldingSlider 
                                                                isShielded={prob.is_shielded_data_ext}
                                                                rsValue={prob.rs_data_ext}
                                                                uw={prob.Uw_data_ext}
                                                                onChange={(isShielded, rs) => handleProbabilityChangeForZone(activeZoneId, { is_shielded_data_ext: isShielded, rs_data_ext: rs })}
                                                            />
                                                        </div>
                                                        <div className="md:col-span-2 lg:col-span-2">
                                                            <Ks4DisplayBox value={(prob.Uw_data_ext || 1) > 0 ? (1 / (prob.Uw_data_ext || 1)) : 1} />
                                                        </div>
                                                        <div className="md:col-span-2 lg:col-span-2">
                                                            <PldDisplayBox value={prob.PLD_data_ext || 0} />
                                                        </div>
                                        <div className="md:col-span-2 lg:col-span-2">
                                        <PliDisplayBox value={zoneProbCalcsBase.Pli_data_ext || 0} />
                                        </div>
                                                        <div className="md:col-span-6 lg:col-span-12">
                                                            <div className="space-y-2">
                                                                <Label>CLD/CLI - Blindagem da Linha e Comp. Interno (Tabela B.4)</Label>
                                                                <Select
                                                                    value={`${prob.CLD_data_ext}_${prob.CLI_data_ext}`}
                                                                    onValueChange={(v) => handleCombinedChangeForZone(activeZoneId, v, 'data', 'external')}
                                                                    options={COMBINED_CLD_CLI_OPTIONS}
                                                                    placeholder="Selecione o tipo de blindagem e componente..."
                                                                >
                                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                                    <SelectContent>
                                                                        {COMBINED_CLD_CLI_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value} label={opt.label} />)}
                                                                    </SelectContent>
                                                                </Select>
                                                                <div className="text-xs text-slate-300 italic mt-2">
                                                                    Estes parâmetros (CLD/CLI, Uw, Rs) impactam PUT, PVT, PWT e PZT.
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {dataSubTab === 'internal' && (
                                                    <>
                                                        <div className="md:col-span-3 lg:col-span-3">
                                                            <SelectInput label="Ks3 - Fiação interna" value={prob.Ks3_data_int} options={KS3_OPTIONS} onUpdate={(v) => handleProbabilityChangeForZone(activeZoneId, { Ks3_data_int: v })} />
                                                        </div>
                                                        <div className="md:col-span-3 lg:col-span-3">
                                                            <SelectInput label="Uw - Tensão Suportável (kV)" value={prob.Uw_data_int} options={UW_OPTIONS} onUpdate={v => handleProbabilityChangeForZone(activeZoneId, { Uw_data_int: v })} />
                                                        </div>
                                                        <div className="md:col-span-2 lg:col-span-2">
                                                            <Ks4DisplayBox value={(prob.Uw_data_int || 1) > 0 ? (1 / (prob.Uw_data_int || 1)) : 1} />
                                                        </div>
                                                        <div className="md:col-span-6 lg:col-span-12">
                                                            <div className="space-y-2">
                                                                <Label>CLD - Blindagem da Linha (Tabela B.4)</Label>
                                                                <Select
                                                                    value={`${prob.CLD_data_int}_1`}
                                                                    onValueChange={(v) => handleCombinedChangeForZone(activeZoneId, v, 'data', 'internal')}
                                                                    options={COMBINED_CLD_CLI_OPTIONS}
                                                                    placeholder="Selecione o tipo de blindagem..."
                                                                >
                                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                                    <SelectContent>
                                                                        {COMBINED_CLD_CLI_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value} label={opt.label} />)}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="text-xs text-slate-300 italic mt-2">
                                                                Estes parâmetros (CLD, Ks3, Uw) impactam PCT e PMT.
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Resultados das Probabilidades — {activeHeading}</CardTitle>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                        <Checkbox
                            checked={showGlobalBars}
                            onCheckedChange={(v) => setShowGlobalBars(!!v)}
                        />
                        <button
                            type="button"
                            className="text-slate-300 hover:text-slate-200 cursor-pointer select-none"
                            onClick={() => setShowGlobalBars((prev) => !prev)}
                        >
                            Mostrar barras globais
                        </button>
                    </div>
                </div>
            </CardHeader>
                    <CardContent className="h-[15rem]">
                        <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                                <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                                <YAxis tick={{ fill: '#94a3b8' }} />
                                {!isMobile && (
                                    <Tooltip 
                                        content={<CustomTooltip probData={prob} probCalcs={zoneProbCalcs} showGlobalBars={showGlobalBars} />}
                                        cursor={{ fill: 'rgba(30, 41, 59, 0.7)' }}
                                    />
                                )}
                                <Bar dataKey="value" fill="#3b82f6" />
                                {showGlobalBars && (
                                    <Bar 
                                        dataKey="globalValue"
                                        fill="#8b5cf6"
                                        fillOpacity={0.22}
                                        stroke="#a78bfa"
                                        shape={(props) => <Rectangle {...props} strokeDasharray="4 3" />}
                                    />
                                )}
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


const SelectInput = ({ label, value, options, onUpdate }: { label: string, value: number, options: {value: number, label: string}[], onUpdate: (val: number) => void }) => {
    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <Select 
                value={String(value)} 
                onValueChange={(v) => onUpdate(parseFloat(v))} 
                options={options}
            >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    {options.map(opt => <SelectItem key={opt.value} value={String(opt.value)} label={opt.label} />)}
                </SelectContent>
            </Select>
        </div>
    );
};
