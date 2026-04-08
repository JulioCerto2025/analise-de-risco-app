'use client';

import React, { useRef, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent, Checkbox, Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, FormulaTooltip, useIsMobile, useAuditMode } from '../ui';
import { formatSmartNumber } from '../../lib/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";
import { AlertTriangle, CheckCircle, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnalysisData, ProbabilityData, LossData, Zone } from '../../types';
import { calculateProbabilities, mergeZoneProbabilities, calculateFrequencies } from '../../utils/calculations';
import { PSPD_OPTIONS } from '../../constants';

// Component to format numbers in scientific notation like "9.98 × 10⁻⁷"
const ScientificNotation = ({ value, precision = 2, className = "" }: { value: number; precision?: number; className?: string }) => {
    if (value === 0 || !isFinite(value)) return <span className={className}>0</span>;
    const [mantissa, exponent] = value.toExponential(precision).split('e');
    const expInt = parseInt(exponent);
    
    return (
        <span className={`inline-flex items-baseline tracking-tight ${className}`}>
            <span className="font-black">{mantissa.replace('.', ',')}</span>
            <span className="text-[0.85em] ml-2 opacity-100 font-bold">×10</span>
            <sup className="text-[0.75em] leading-none -top-[0.8em] font-bold">{expInt}</sup>
        </span>
    );
};

const formatValue = (value: number) => {
    if (value === 0) return '0';
    return formatSmartNumber(value, { useScientificBelow: 0.001, scientificPrecision: 2, maxDecimals: 3 });
};

const BASE_FREQUENCY_FORMULAS: { [key: string]: { formula: string; vars: string[] } } = {
    FB: { formula: "nd × PB", vars: ["nd", "PB"] },
    FV: { formula: "nl_e × PEB_e + nl_t × PEB_t", vars: ["nl_electric", "PEB_electric", "nl_data", "PEB_data"] },
    FW: { formula: "nl_e × PW + nl_t × PWT", vars: ["nl_electric", "PW", "nl_data", "PWT"] },
    FZ: { formula: "ni_e × PZ + ni_t × PZT", vars: ["ni_electric", "PZ", "ni_data", "PZT"] },
};

const CustomTooltip = ({ active, payload, label, data, ctx, formulas }: any) => {
    const { auditMode } = useAuditMode();
    const isMobile = useIsMobile();

    if (active && payload && payload.length && auditMode && !isMobile) {
        const { calculations: cGlob, probability_calculations: pGlob, frequency_results: fGlob, frequency_config: config } = data;
        const p = ctx?.probCalcs ?? pGlob;
        const f = ctx?.freqCalcs ?? fGlob;
        const isTotal = label === 'F Total';
        
        let formulaString = "N/A";
        let valuesNodes: React.ReactNode = null;
        let valuesString: string | null = null;

        if (isTotal) {
            const components = ['FC', 'FM', 'FV', 'FW', 'FZ'];
            if (config.has_equipment_in_ZPR0A) components.unshift('FB');
            formulaString = components.join(' + ');
            valuesNodes = (
                <span className="font-mono break-normal whitespace-normal">
                    {components.map((key, idx) => (
                        <span key={key} className="inline-flex items-baseline">
                            <ScientificNotation value={f[key] || 0} precision={2} />
                            {idx < components.length - 1 ? <span className="mx-0.5">+</span> : null}
                        </span>
                    ))}
                </span>
            );
            valuesString = components.map(key => formatValue(f[key] || 0)).join(' + ');
        } else {
            const formulaInfo = formulas[label];
            if (formulaInfo) {
                formulaString = formulaInfo.formula;
                const valueMap = { ...cGlob, ...p };
                
                if (label === 'FC') {
                    const PC_total = 1 - ((1 - (valueMap.PC||0)) * (1 - (valueMap.PCT||0)));
                    valuesNodes = (
                        <span className="font-mono block">
                            <span className="inline-flex items-baseline">
                                <ScientificNotation value={valueMap.nd||0} precision={2} />
                                <span className="mx-0.5">×</span>
                                <ScientificNotation value={PC_total} precision={2} />
                            </span>
                        </span>
                    );
                } else if (label === 'FM') {
                    const PM_total = 1 - ((1 - (valueMap.PM||0)) * (1 - (valueMap.PMT||0)));
                    valuesNodes = (
                        <span className="font-mono block">
                            <span className="inline-flex items-baseline">
                                <ScientificNotation value={valueMap.nm||0} precision={2} />
                                <span className="mx-0.5">×</span>
                                <ScientificNotation value={PM_total} precision={2} />
                            </span>
                        </span>
                    );
                } else {
                    const parts = formulaInfo.vars.map((v: string) => valueMap[v] || 0);
                    valuesNodes = (
                        <span className="font-mono">
                            {parts.map((val: number, idx: number) => (
                                <span key={idx} className="inline-flex items-baseline">
                                    <ScientificNotation value={val} precision={2} />
                                    {idx < parts.length - 1 ? <span className="mx-0.5">×</span> : null}
                                </span>
                            ))}
                        </span>
                    );
                }
                const regex = new RegExp(`\\b(${formulaInfo.vars.join('|')})\\b`, 'gi');
                valuesString = formulaString.replace(regex, (match) => formatValue(valueMap[match] || 0));
            }
        }

        return createPortal(
            <>
                <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-[9998] pointer-events-none animate-in fade-in duration-200" />
                <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(95vw,540px)] max-h-[85vh] p-6 bg-slate-800/98 border border-blue-500/40 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl z-[9999] overflow-auto custom-scrollbar animate-in zoom-in-95 fade-in duration-300 pointer-events-auto">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                        <p className="font-black text-slate-100 uppercase tracking-[0.2em] text-[10px]">Detalhamento de Frequência Editorial</p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between bg-slate-900/40 p-4 rounded-2xl border border-white/5">
                            <div className="flex flex-col">
                                <span className="font-black text-slate-100 text-lg uppercase tracking-wider">{label}</span>
                                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-tight">Frequência de Dano NBR 5419</p>
                            </div>
                            <div className="flex items-baseline gap-2 text-right">
                                <span className="text-[10px] uppercase font-black text-blue-500/70 tracking-widest text-right">Valor Final</span>
                                <p className="text-blue-400 font-mono font-black text-xl">
                                    {Number(payload[0].value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <p className="text-slate-500 text-[9px] uppercase font-black tracking-[0.2em] ml-1">Fórmula (Variáveis):</p>
                                <div className="font-mono bg-slate-900/40 p-4 rounded-2xl text-slate-200 text-xs sm:text-base leading-relaxed border border-white/5 shadow-inner">
                                    {formulaString}
                                </div>
                            </div>
                            {valuesString && (
                                <div className="space-y-1.5">
                                    <p className="text-slate-500 text-[9px] uppercase font-black tracking-[0.2em] ml-1">Aplicação de Valores:</p>
                                    <div className="font-mono bg-blue-500/5 p-4 rounded-2xl text-blue-100 text-xs sm:text-base leading-relaxed border border-blue-500/20 shadow-inner">
                                        {valuesString}
                                    </div>
                                </div>
                            )}
                            {valuesNodes && (
                                <div className="space-y-1.5">
                                    <p className="text-slate-500 text-[9px] uppercase font-black tracking-[0.2em] ml-1">Memória de Cálculo (Detalhado):</p>
                                    <div className="font-mono bg-slate-900/40 p-4 rounded-2xl text-slate-200 text-xs sm:text-base leading-relaxed border border-white/5 shadow-inner">
                                        {valuesNodes}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/5 flex justify-center">
                        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em]">NBR 5419-2:2026 Audit Ready</p>
                    </div>
                </div>
            </>
,
            document.body
        );
    }
    return null;
};

export function FrequencyConfigStep({ data, onUpdate }: { data: AnalysisData, onUpdate: (newData: Partial<AnalysisData>) => void }) {
    const isMobile = useIsMobile();
    const [openSelect, setOpenSelect] = useState<string | null>(null);
    const config = data.frequency_config;
    const calculations = data.frequency_results;
    
    const dynamicFrequencyFormulas = useMemo(() => {
        const formulas: { [key: string]: { formula: string; vars: string[] } } = { ...BASE_FREQUENCY_FORMULAS };
        const hasE = data.has_electric_line;
        const hasD = data.has_data_line;

        if (hasE && hasD) formulas.FC = { formula: "nd × (1 - (1-PC)×(1-PCT))", vars: ["nd", "PC", "PCT"] };
        else if (hasE) formulas.FC = { formula: "nd × PC", vars: ["nd", "PC"] };
        else if (hasD) formulas.FC = { formula: "nd × PCT", vars: ["nd", "PCT"] };
        else formulas.FC = { formula: "0", vars: [] };

        if (hasE && hasD) formulas.FM = { formula: "nm × (1 - (1-PM)×(1-PMT))", vars: ["nm", "PM", "PMT"] };
        else if (hasE) formulas.FM = { formula: "nm × PM", vars: ["nm", "PM"] };
        else if (hasD) formulas.FM = { formula: "nm × PMT", vars: ["nm", "PMT"] };
        else formulas.FM = { formula: "0", vars: [] };

        return formulas;
    }, [data.has_electric_line, data.has_data_line]);

    const handleSimulatorUpdate = (field: keyof ProbabilityData, value: number) => {
        const v = Number(value);
        const updatedProbData: Partial<ProbabilityData> = { [field]: v };

        const nextUpdate: Partial<AnalysisData> = { 
            probability_data: { ...data.probability_data, ...updatedProbData } 
        };

        // Propagação Inteligente baseada no contexto (Global vs Local)
        const activeViewId = data.last_active_view_id || "GLOBAL";
        if (activeViewId === "GLOBAL") {
            nextUpdate.probability_data = { ...data.probability_data, ...updatedProbData };
            nextUpdate.zones = (data.zones || []).map(zone => {
                const probData = { ...(zone.probability_data || data.probability_data), ...updatedProbData };
                const overrides = { ...(zone.probability_overrides || {}) } as any;
                
                // Limpa overrides para o global mandar em tudo
                Object.keys(updatedProbData).forEach(k => delete overrides[k]);
                
                return { ...zone, probability_data: probData, probability_overrides: overrides };
            });
        } else {
            // Modo LOCAL: Ajusta apenas a zona ativa
            nextUpdate.zones = (data.zones || []).map(zone => {
                if (zone.id !== activeViewId) return zone;
                const probData = { ...(zone.probability_data || data.probability_data), ...updatedProbData };
                return { ...zone, probability_data: probData };
            });
        }

        onUpdate(nextUpdate);
    };

    const handleConfigChange = (field: keyof typeof config, value: boolean) => {
        onUpdate({ frequency_config: { ...config, [field]: value } });
    };

    const activeViewId = data.last_active_view_id || 'GLOBAL';
    const zoneIds = (data.zones || []).map(z => z.id);
    const multipleZones = zoneIds.length > 1;
    const viewOrder = ['GLOBAL', ...zoneIds];
    const currentViewIndex = Math.max(0, viewOrder.indexOf(activeViewId));
    const activeZone = activeViewId === 'GLOBAL' ? undefined : data.zones.find(z => z.id === activeViewId);
    
    // Zone Heading logic
    const makeZoneHeading = (zoneName: string | undefined, idx: number) => {
        const base = `Zona ${idx + 1}`;
        const name = (zoneName || '').trim();
        if (!name || name.toLowerCase() === base.toLowerCase()) return base;
        return `${base} (${name})`;
    };
    const activeHeading = activeViewId === 'GLOBAL' ? 'Global' : makeZoneHeading(activeZone?.name, data.zones.indexOf(activeZone!));

    // Per-zone frequency calculations
    const activeData = useMemo(() => {
        if (!activeZone) return { freq: calculations, p: data.probability_calculations, isAcceptable: (calculations?.F || 0) <= (config.is_critical_system ? 0.1 : 1) };
        const pBase = calculateProbabilities(activeZone.probability_data || data.probability_data, !!activeZone.analyze_data_line_probabilities, data.has_data_line, !!activeZone.analyze_electric_line_probabilities);
        const p = mergeZoneProbabilities(pBase, activeZone);
        const f = calculateFrequencies(data.calculations, p, config, data.has_electric_line, data.has_data_line);
        return { freq: f, p, isAcceptable: (f.F || 0) <= (config.is_critical_system ? 0.1 : 1) };
    }, [activeZone, calculations, data, config]);

    const toleranceLimit = config.is_critical_system ? 0.1 : 1;
    const chartDataRaw = Object.entries(activeData.freq).map(([name, value]) => ({ 
        name: name === 'F' ? 'F Total' : name, 
        value: Number(value) || 0 
    }));
    
    // Position "F Total" at the end
    const chartData = [
        ...chartDataRaw.filter(d => d.name !== 'F Total'),
        ...chartDataRaw.filter(d => d.name === 'F Total')
    ];
    
    const yMaxDomain = Math.max(...chartData.map(d => d.value), toleranceLimit) * 1.2;

    const goPrevView = () => onUpdate({ last_active_view_id: viewOrder[(currentViewIndex - 1 + viewOrder.length) % viewOrder.length] });
    const goNextView = () => onUpdate({ last_active_view_id: viewOrder[(currentViewIndex + 1) % viewOrder.length] });

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-4 items-stretch">
                
                {/* Config Card */}
                <Card className="h-full relative overflow-hidden border-slate-700/50 bg-slate-100/5 backdrop-blur-sm shadow-xl shadow-black/20 group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/30 via-blue-400 to-blue-500/30 opacity-50" />
                    <div className="flex justify-start my-4 px-4">
                        <span className="px-5 py-2 rounded-full bg-slate-900 border border-slate-700 text-white font-black text-[9px] uppercase tracking-[0.2em] shadow-lg shadow-black/40 text-left truncate">
                            {`AJUSTAR FREQ. DANO — ${activeHeading.toUpperCase()}`}
                        </span>
                    </div>
                    <CardContent className="space-y-4 py-4 px-4">
                        <div className="grid grid-cols-2 gap-x-3 gap-y-4 pt-1">
                            <div>
                                <Label className="text-[9px] font-black text-blue-600 mb-1 block uppercase tracking-[0.2em] text-left">PEB Elétrica</Label>
                                <Select 
                                    value={String(activeZone ? (activeZone.probability_data?.PEB_electric ?? data.probability_data.PEB_electric) : data.probability_data.PEB_electric)}
                                    onValueChange={(val) => handleSimulatorUpdate('PEB_electric', parseFloat(val))}
                                    options={PSPD_OPTIONS}
                                    onOpenChange={(open) => setOpenSelect(open ? 'peb_e' : null)}
                                    wrapperClassName={openSelect === 'peb_e' ? 'relative z-20' : 'relative'}
                                >
                                    <SelectTrigger className="h-7 text-[10px] px-2 bg-slate-900 shadow-inner border-slate-700/50"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {PSPD_OPTIONS.map(opt => <SelectItem key={opt.value} value={String(opt.value)} label={opt.label} />)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-[9px] font-black text-amber-400 mb-1 block uppercase tracking-[0.2em] text-left">PEB Dados</Label>
                                <Select 
                                    value={String(activeZone ? (activeZone.probability_data?.PEB_data ?? data.probability_data.PEB_data) : data.probability_data.PEB_data)}
                                    onValueChange={(val) => handleSimulatorUpdate('PEB_data', parseFloat(val))}
                                    options={PSPD_OPTIONS}
                                    onOpenChange={(open) => setOpenSelect(open ? 'peb_d' : null)}
                                    wrapperClassName={openSelect === 'peb_d' ? 'relative z-20' : 'relative'}
                                >
                                    <SelectTrigger className="h-7 text-[10px] px-2 bg-slate-900 shadow-inner border-slate-700/50"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {PSPD_OPTIONS.map(opt => <SelectItem key={opt.value} value={String(opt.value)} label={opt.label} />)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-[9px] font-black text-blue-600 mb-1 block uppercase tracking-[0.2em] text-left">PSPD Elétrica</Label>
                                <Select 
                                    value={String(activeZone ? (activeZone.probability_data?.PSPD_electric ?? data.probability_data.PSPD_electric) : data.probability_data.PSPD_electric)}
                                    onValueChange={(val) => handleSimulatorUpdate('PSPD_electric', parseFloat(val))}
                                    options={PSPD_OPTIONS}
                                    onOpenChange={(open) => setOpenSelect(open ? 'pspd_e' : null)}
                                    wrapperClassName={openSelect === 'pspd_e' ? 'relative z-20' : 'relative'}
                                >
                                    <SelectTrigger className="h-7 text-[10px] px-2 bg-slate-900 shadow-inner border-slate-700/50"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {PSPD_OPTIONS.map(opt => <SelectItem key={opt.value} value={String(opt.value)} label={opt.label} />)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-[9px] font-black text-amber-400 mb-1 block uppercase tracking-[0.2em] text-left">PSPD Dados</Label>
                                <Select 
                                    value={String(activeZone ? (activeZone.probability_data?.PSPD_data ?? data.probability_data.PSPD_data) : data.probability_data.PSPD_data)}
                                    onValueChange={(val) => handleSimulatorUpdate('PSPD_data', parseFloat(val))}
                                    options={PSPD_OPTIONS}
                                    onOpenChange={(open) => setOpenSelect(open ? 'pspd_d' : null)}
                                    wrapperClassName={openSelect === 'pspd_d' ? 'relative z-20' : 'relative'}
                                >
                                    <SelectTrigger className="h-7 text-[10px] px-2 bg-slate-900 shadow-inner border-slate-700/50"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {PSPD_OPTIONS.map(opt => <SelectItem key={opt.value} value={String(opt.value)} label={opt.label} />)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {multipleZones && (
                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Navegação Zonas</span>
                                <div className="flex items-center gap-1">
                                    <button onClick={goPrevView} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400"><ChevronLeft className="w-4 h-4" /></button>
                                    <button onClick={goNextView} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400"><ChevronRight className="w-4 h-4" /></button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Main Frequency Result Card */}
                <Card className={`relative lg:col-span-2 overflow-hidden border border-white/10 bg-slate-950/40 backdrop-blur-2xl h-full transition-all duration-500 group hover:shadow-2xl rounded-[2.5rem] ${activeData.isAcceptable ? 'hover:shadow-green-500/10' : 'hover:shadow-red-500/10'}`}>
                    <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${activeData.isAcceptable ? 'from-green-500 via-emerald-400 to-green-500' : 'from-red-600 via-rose-500 to-red-600'} shadow-[0_0_15px_rgba(255,255,255,0.3)]`} />
                    
                    <div className="pt-6 px-8 flex justify-between items-start">
                         <FormulaTooltip formulas={{ F: "FC + FM + FV + FW + FZ" }} values={activeData.freq}>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 transition-colors leading-none mb-1">Avaliação de Frequência</span>
                                <span className="text-base font-black text-white tracking-[0.2em] uppercase">{`Frequência Total (F) — ${activeHeading}`}</span>
                            </div>
                        </FormulaTooltip>
                        <div className={`p-3 rounded-2xl ${activeData.isAcceptable ? 'bg-green-500/10 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)] border border-green-500/20' : 'bg-red-500/10 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)] border border-red-500/20'}`}>
                            {activeData.isAcceptable ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                        </div>
                    </div>

                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 px-8 items-center">
                        <div className="flex flex-col items-center">
                            <div className={`relative z-10 text-7xl font-black mb-4 transition-transform duration-300 group-hover:scale-105 ${activeData.isAcceptable ? 'text-green-400 drop-shadow-[0_0_30px_rgba(34,197,94,0.4)]' : 'text-red-400 drop-shadow-[0_0_30px_rgba(239,68,68,0.4)]'}`}>
                                {(activeData.freq.F || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className={`relative z-10 py-2 px-10 rounded-full text-[11px] font-black uppercase tracking-[0.3em] border-2 transition-all duration-500 shadow-xl ${
                                activeData.isAcceptable 
                                ? 'bg-green-500/10 border-green-500/30 text-green-300 shadow-green-500/10' 
                                : 'bg-red-500/10 border-red-500/30 text-red-300 shadow-red-500/10'
                            }`}>
                                {activeData.isAcceptable ? 'Aceitável' : 'Inaceitável'}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => handleConfigChange('is_critical_system', true)} className={`py-3 px-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${config.is_critical_system ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30' : 'bg-white/[0.03] border-white/5 text-slate-500'}`}>
                                    Crítico (≤ 0,1)
                                </button>
                                <button onClick={() => handleConfigChange('is_critical_system', false)} className={`py-3 px-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${!config.is_critical_system ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30' : 'bg-white/[0.03] border-white/5 text-slate-500'}`}>
                                    Padrão (≤ 1)
                                </button>
                            </div>
                            <label className="flex items-center space-x-3 px-5 py-3 bg-white/[0.04] hover:bg-white/[0.08] rounded-2xl border border-white/10 cursor-pointer transition-all group/check">
                                <Checkbox checked={config.has_equipment_in_ZPR0A} onCheckedChange={(c) => handleConfigChange('has_equipment_in_ZPR0A', !!c)} className="w-5 h-5 border-slate-500 data-[state=checked]:bg-blue-500" />
                                <span className="text-[11px] font-black text-slate-200 group-hover/check:text-white transition-colors uppercase tracking-[0.2em]">Expos. Equip. ZPR0A</span>
                            </label>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Chart Section */}
            <div className="flex justify-center mt-6 mb-4">
                <span className="px-6 py-2 rounded-full bg-slate-900 border border-slate-700 text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-black/40">
                    {`Gráfico de Componentes (F) — ${activeHeading}`}
                </span>
            </div>
            <Card className="relative overflow-hidden border-slate-700/30 bg-slate-900/40 backdrop-blur-md shadow-2xl shadow-black/40 group">
                <CardContent className="h-[19rem] pt-6 pb-2 flex flex-col">
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="glassFireF" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.7} />
                                        <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.3} />
                                    </linearGradient>
                                    <linearGradient id="glassSystemsF" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.7} />
                                        <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.3} />
                                    </linearGradient>
                                    <linearGradient id="glassGreenF" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#22c55e" stopOpacity={0.7} />
                                        <stop offset="100%" stopColor="#22c55e" stopOpacity={0.3} />
                                    </linearGradient>
                                    <linearGradient id="glassRedF" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#ef4444" stopOpacity={0.7} />
                                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} strokeOpacity={0.1} />
                                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, yMaxDomain]} />
                                {!isMobile && (
                                    <Tooltip content={<CustomTooltip data={data} formulas={dynamicFrequencyFormulas} ctx={{ probCalcs: activeData.p, freqCalcs: activeData.freq }} />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
                                )}
                                <ReferenceLine y={toleranceLimit} strokeWidth={2} stroke="#f43f5e" strokeDasharray="4 4" strokeOpacity={0.5} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={80}>
                                    {chartData.map((entry, index) => {
                                        const name = entry.name.toUpperCase();
                                        const isTotal = name === 'F TOTAL';
                                        
                                        let fillUrl = "url(#glassSystemsF)";
                                        let strokeColor = "#cbd5e1"; // Slate 300 (Cinza Claro)
                                        
                                        if (name === 'FB' || name === 'FV') {
                                            fillUrl = "url(#glassFireF)";
                                            strokeColor = "#f43f5e";
                                        } else if (isTotal) {
                                            fillUrl = activeData.isAcceptable ? "url(#glassGreenF)" : "url(#glassRedF)";
                                            strokeColor = activeData.isAcceptable ? "#22c55e" : "#ef4444";
                                        }
                                        
                                        return <Cell key={`cell-f-${index}`} fill={fillUrl} stroke={strokeColor} strokeWidth={0.8} strokeOpacity={1} />;
                                    })}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Legenda Discreta e Alinhada Interna */}
                    <div className="grid grid-cols-4 gap-2 mt-2 pt-2 border-t border-white/5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]" />
                            <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Danos Físicos (FB, FV)</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#94a3b8]" />
                            <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Sistemas (FC, FM, FW, FZ)</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                            <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Aceitável</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                            <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Crítico</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
