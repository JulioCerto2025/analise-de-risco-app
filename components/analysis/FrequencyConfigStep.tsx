'use client';

import * as React from 'react';
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
    if (Math.abs(value) >= 0.001 && Math.abs(value) < 1000) {
        return <span className={className}>{value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: precision })}</span>;
    }
    let [mantissa, exponent] = value.toExponential(precision).split('e');
    const expInt = parseInt(exponent, 10);
    
    return (
        <span className={`inline-flex items-baseline tracking-tight ${className}`}>
            <span className="font-black">{mantissa.replace('.', ',')}</span>
            <span className={`text-[0.85em] ml-1 opacity-80 font-bold ${expInt === 0 ? 'hidden' : ''}`}>&times;10</span>
            <sup className={`text-[0.75em] leading-none -top-[0.8em] font-bold ${expInt === 0 ? 'hidden' : ''}`}>{expInt}</sup>
        </span>
    );
};

const formatValue = (value: number) => {
    if (value === 0) return '0';
    return formatSmartNumber(value, { useScientificBelow: 0.001, scientificPrecision: 2, maxDecimals: 3 });
};

const BASE_FREQUENCY_FORMULAS: { [key: string]: { formula: string; vars: string[] } } = {
    FB: { formula: "n<sub>d</sub> × P<sub>B</sub>", vars: ["nd", "PB"] },
    FV: { formula: "n<sub>l(e)</sub> × P<sub>EB(e)</sub> + n<sub>l(t)</sub> × P<sub>EB(t)</sub>", vars: ["nl_electric", "PEB_electric", "nl_data", "PEB_data"] },
    FW: { formula: "n<sub>l(e)</sub> × P<sub>W</sub> + n<sub>l(t)</sub> × P<sub>WT</sub>", vars: ["nl_electric", "PW", "nl_data", "PWT"] },
    FZ: { formula: "n<sub>i(e)</sub> × P<sub>Z</sub> + n<sub>i(t)</sub> × P<sub>ZT</sub>", vars: ["ni_electric", "PZ", "ni_data", "PZT"] },
};

const FreqEditorialPortal = ({ label, data, ctx, formulas, onClose }: { label: string; data: AnalysisData; ctx: any; formulas: any; onClose: () => void }) => {
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

    const finalValue = f[label === 'F Total' ? 'F' : label] || 0;

    return createPortal(
        <div className="fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px] pointer-events-none animate-in fade-in duration-200" />
            <div 
                ref={portalRef}
                className="fixed right-6 top-[100px] w-[min(90vw,540px)] p-6 bg-slate-800/98 border border-blue-500/40 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl z-[9999] animate-in slide-in-from-right-10 fade-in duration-300 pointer-events-auto"
            >
                <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    <p className="font-black text-slate-100 uppercase tracking-[0.2em] text-[10px]">Detalhamento de Frequência Editorial</p>
                </div>
                <div className="space-y-6">
                    <div className="flex items-center justify-between bg-slate-900/40 p-4 rounded-2xl border border-white/5">
                        <span className="font-black text-slate-100 text-lg uppercase tracking-wider">{label}</span>
                        <div className="flex items-baseline gap-2 text-right">
                            <span className="text-[10px] uppercase font-black text-blue-500/70 tracking-widest text-right">Valor Final</span>
                            <p className="text-blue-400 font-black text-xl">
                                <ScientificNotation value={Number(finalValue)} precision={2} />
                            </p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <p className="text-slate-500 text-[9px] uppercase font-black tracking-[0.2em] ml-1">Fórmula (Variáveis):</p>
                            <div className="font-mono bg-slate-900/40 p-4 rounded-2xl text-slate-200 text-xs sm:text-base leading-relaxed border border-white/5 shadow-inner" dangerouslySetInnerHTML={{ __html: formulaString }} />
                        </div>
                        {valuesString && (
                            <div className="space-y-1.5">
                                <p className="text-slate-500 text-[9px] uppercase font-black tracking-[0.2em] ml-1">Aplicação de Valores:</p>
                                <div className="font-mono bg-blue-500/5 p-4 rounded-2xl text-blue-100 text-xs sm:text-base leading-relaxed border border-blue-500/20 shadow-inner" dangerouslySetInnerHTML={{ __html: valuesString }} />
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
        </div>,
        document.body
    );
};

export function FrequencyConfigStep({ data, onUpdate }: { data: AnalysisData, onUpdate: (newData: Partial<AnalysisData>) => void }) {
    const isMobile = useIsMobile();
    const { auditMode, setActiveTooltipId } = useAuditMode();
    const [selectedFreq, setSelectedFreq] = React.useState<string | null>(null);
    const [openSelect, setOpenSelect] = React.useState<string | null>(null);
    const config = data.frequency_config;
    const calculations = data.frequency_results;
    
    const dynamicFrequencyFormulas = React.useMemo(() => {
        const formulas: { [key: string]: { formula: string; vars: string[] } } = { ...BASE_FREQUENCY_FORMULAS };
        const hasE = data.has_electric_line;
        const hasD = data.has_data_line;

        if (hasE && hasD) formulas.FC = { formula: "n<sub>d</sub> × (1 - (1-P<sub>C</sub>)×(1-P<sub>CT</sub>))", vars: ["nd", "PC", "PCT"] };
        else if (hasE) formulas.FC = { formula: "n<sub>d</sub> × P<sub>C</sub>", vars: ["nd", "PC"] };
        else if (hasD) formulas.FC = { formula: "n<sub>d</sub> × P<sub>CT</sub>", vars: ["nd", "PCT"] };
        else formulas.FC = { formula: "0", vars: [] };

        if (hasE && hasD) formulas.FM = { formula: "n<sub>m</sub> × (1 - (1-P<sub>M</sub>)×(1-P<sub>MT</sub>))", vars: ["nm", "PM", "PMT"] };
        else if (hasE) formulas.FM = { formula: "n<sub>m</sub> × P<sub>M</sub>", vars: ["nm", "PM"] };
        else if (hasD) formulas.FM = { formula: "n<sub>m</sub> × P<sub>MT</sub>", vars: ["nm", "PMT"] };
        else formulas.FM = { formula: "0", vars: [] };

        return formulas;
    }, [data.has_electric_line, data.has_data_line]);

    const handleSimulatorUpdate = (field: keyof ProbabilityData, value: number) => {
        const v = Number(value);
        const updatedProbData: Partial<ProbabilityData> = { [field]: v };

        const nextUpdate: Partial<AnalysisData> = { 
            probability_data: { ...data.probability_data, ...updatedProbData } 
        };

        const activeViewId = data.last_active_view_id || "GLOBAL";
        if (activeViewId === "GLOBAL") {
            nextUpdate.probability_data = { ...data.probability_data, ...updatedProbData };
            nextUpdate.zones = (data.zones || []).map(zone => {
                const probData = { ...(zone.probability_data || data.probability_data), ...updatedProbData };
                const overrides = { ...(zone.probability_overrides || {}) } as any;
                Object.keys(updatedProbData).forEach(k => delete overrides[k]);
                return { ...zone, probability_data: probData, probability_overrides: overrides };
            });
        } else {
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
    
    const makeZoneHeading = (zoneName: string | undefined, idx: number) => {
        const base = `Zona ${idx + 1}`;
        const name = (zoneName || '').trim();
        if (!name || name.toLowerCase() === base.toLowerCase()) return base;
        return `${base} (${name})`;
    };
    const activeHeading = activeViewId === 'GLOBAL' ? 'Global' : makeZoneHeading(activeZone?.name, data.zones.indexOf(activeZone!));

    const activeData = React.useMemo(() => {
        const tol = (config.is_critical_system ? 0.1 : 1);
        if (!activeZone) {
            if (config.analyze_by_most_critical_zone && data.zones.length > 0) {
                // Calculate all zone frequencies and pick the max F
                const zoneFrequencies = data.zones.map(z => {
                    const pBase = calculateProbabilities(z.probability_data || data.probability_data, !!z.analyze_data_line_probabilities, data.has_data_line, !!z.analyze_electric_line_probabilities);
                    const p = mergeZoneProbabilities(pBase, z);
                    const f = calculateFrequencies(data.calculations, p, config, data.has_electric_line, data.has_data_line);
                    return { f, p, name: z.name };
                });
                const criticalIdx = zoneFrequencies.reduce((maxIdx, current, idx, arr) => (current.f.F || 0) > (arr[maxIdx].f.F || 0) ? idx : maxIdx, 0);
                const critical = zoneFrequencies[criticalIdx];
                return { freq: critical.f, p: critical.p, isAcceptable: (critical.f.F || 0) <= tol, isCriticalMode: true, criticalName: critical.name };
            }
            return { freq: calculations, p: data.probability_calculations, isAcceptable: (calculations?.F || 0) <= tol, isCriticalMode: false };
        }
        const pBase = calculateProbabilities(activeZone.probability_data || data.probability_data, !!activeZone.analyze_data_line_probabilities, data.has_data_line, !!activeZone.analyze_electric_line_probabilities);
        const p = mergeZoneProbabilities(pBase, activeZone);
        const f = calculateFrequencies(data.calculations, p, config, data.has_electric_line, data.has_data_line);
        return { freq: f, p, isAcceptable: (f.F || 0) <= tol, isCriticalMode: false };
    }, [activeZone, calculations, data, config]);

    const toleranceLimit = config.is_critical_system ? 0.1 : 1;
    const chartDataRaw = Object.entries(activeData.freq)
        .filter(([name]) => {
            // Exclui FB do gráfico se o checkbox estiver desmarcado
            if (name === 'FB' && !config.has_equipment_in_ZPR0A) return false;
            return true;
        })
        .map(([name, value]) => ({ 
            name: name === 'F' ? 'F Total' : name, 
            value: Number(value) || 0 
        }));
    
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
                <Card className="h-full relative overflow-hidden border-slate-700/50 bg-slate-100/5 backdrop-blur-sm shadow-xl shadow-black/20 group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/30 via-blue-400 to-blue-500/30 opacity-50" />
                    <div className="flex justify-center mt-4">
                        <div className="flex items-center gap-4 px-6 py-2 rounded-full bg-slate-950 border border-slate-800 shadow-2xl">
                            {multipleZones && <button onClick={goPrevView} className="p-1.5 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"><ChevronLeft className="w-5 h-5" /></button>}
                            <span className="text-white font-black text-[9px] uppercase tracking-[0.3em] min-w-[200px] text-center">
                                {activeViewId === 'GLOBAL' ? 'Freq. Dano — GLOBAL' : `Freq. Dano — ${activeHeading.split('(')[0].trim()}`}
                            </span>
                            {multipleZones && <button onClick={goNextView} className="p-1.5 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"><ChevronRight className="w-5 h-5" /></button>}
                        </div>
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
                    </CardContent>
                </Card>

                <Card className={`relative lg:col-span-2 overflow-hidden border border-white/10 bg-slate-950/40 backdrop-blur-2xl h-full transition-all duration-500 group hover:shadow-2xl rounded-[2.5rem] ${activeData.isAcceptable ? 'hover:shadow-green-500/10' : 'hover:shadow-red-500/10'}`}>
                    <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${activeData.isAcceptable ? 'from-green-500 via-emerald-400 to-green-500' : 'from-red-600 via-rose-500 to-red-600'} shadow-[0_0_15px_rgba(255,255,255,0.3)]`} />
                    <div className="pt-6 px-8 flex justify-between items-start">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 transition-colors leading-none mb-1">
                                {activeData.isCriticalMode ? `Zona Crítica: ${activeData.criticalName}` : 'Avaliação de Frequência'}
                            </span>
                            <span className="text-base font-black text-white tracking-[0.2em] uppercase">
                                {activeData.isCriticalMode ? `Frequência da Zona mais crítica` : `Frequência Total (F) — ${activeHeading}`}
                            </span>
                        </div>
                        <div className={`p-3 rounded-2xl ${activeData.isAcceptable ? 'bg-green-500/10 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)] border border-green-500/20' : 'bg-red-500/10 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)] border border-red-500/20'}`}>
                            {activeData.isAcceptable ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                        </div>
                    </div>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2 pb-4 px-8 items-center">
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
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Regra de Tolerância</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => handleConfigChange('is_critical_system', true)} className={`py-2 px-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${config.is_critical_system ? 'bg-blue-600/90 border-blue-400 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-900/50 border-white/10 text-slate-400 hover:bg-slate-800'}`}>
                                        Crítico (0,1)
                                    </button>
                                    <button onClick={() => handleConfigChange('is_critical_system', false)} className={`py-2 px-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${!config.is_critical_system ? 'bg-blue-600/90 border-blue-400 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-900/50 border-white/10 text-slate-400 hover:bg-slate-800'}`}>
                                        Padrão (1,0)
                                    </button>
                                </div>
                            </div>
                            
                            {multipleZones && (
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Escopo de Análise (Multizonas)</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => handleConfigChange('analyze_by_most_critical_zone', false)} className={`py-2 px-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${!config.analyze_by_most_critical_zone ? 'bg-slate-200 border-white text-slate-950 shadow-lg' : 'bg-slate-900/50 border-white/10 text-slate-300 hover:bg-slate-800'}`}>
                                            Global
                                        </button>
                                        <button onClick={() => handleConfigChange('analyze_by_most_critical_zone', true)} className={`py-2 px-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${config.analyze_by_most_critical_zone ? 'bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-500/30' : 'bg-slate-900/50 border-white/10 text-red-400/80 hover:bg-slate-800'}`}>
                                            Zona Crítica
                                        </button>
                                    </div>
                                </div>
                            )}

                            <label className="flex items-center space-x-3 px-5 py-3 bg-white/[0.04] hover:bg-white/[0.08] rounded-2xl border border-white/10 cursor-pointer transition-all group/check mt-2">
                                <Checkbox checked={config.has_equipment_in_ZPR0A} onCheckedChange={(c) => handleConfigChange('has_equipment_in_ZPR0A', !!c)} className="w-5 h-5 border-slate-500 data-[state=checked]:bg-blue-500" />
                                <span className="text-[11px] font-black text-slate-200 group-hover/check:text-white transition-colors uppercase tracking-[0.2em]">Expos. Equip. ZPR0A</span>
                            </label>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-center mt-6 mb-4">
                <span className="px-6 py-2 rounded-full bg-slate-900 border border-slate-700 text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-black/40">
                    {`Gráfico de Componentes (F) — ${activeHeading}`}
                </span>
            </div>
            <Card 
                className="relative overflow-hidden border-slate-700/30 bg-slate-900/40 backdrop-blur-md shadow-2xl shadow-black/40 group"
                onClick={(e) => e.stopPropagation()}
            >
                <CardContent className="h-[15.2rem] pt-6 pb-2 flex flex-col">
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%" className="outline-none focus:outline-none">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} className="outline-none focus:outline-none">
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
                                <Tooltip cursor={false} content={<></>} />
                                <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} strokeOpacity={0.1} />
                                <XAxis 
                                    dataKey="name" 
                                    tick={(props) => {
                                        const { x, y, payload } = props;
                                        return (
                                            <g transform={`translate(${x},${y})`} className="cursor-pointer group outline-none" onClick={() => {
                                                setSelectedFreq(payload.value);
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
                                <YAxis tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} domain={[0, yMaxDomain]} width={40} />
                                <ReferenceLine 
                                    y={toleranceLimit} 
                                    strokeWidth={2} 
                                    stroke="#ef4444" 
                                    strokeDasharray="4 4" 
                                    strokeOpacity={1}
                                    label={{ 
                                        value: 'LIMITE TOLERÁVEL', 
                                        position: 'top', 
                                        fill: '#ef4444', 
                                        fontSize: 9, 
                                        fontWeight: '900',
                                        offset: 8
                                    }}
                                />
                                <Bar 
                                    dataKey="value" 
                                    radius={[4, 4, 0, 0]} 
                                    barSize={80}
                                    minPointSize={10}
                                >
                                    {chartData.map((entry, index) => {
                                        const name = entry.name.toUpperCase();
                                        const isTotal = name === 'F TOTAL';
                                        let fillUrl = "url(#glassSystemsF)";
                                        let strokeColor = "#cbd5e1";
                                        if (name === 'FB' || name === 'FV') {
                                            fillUrl = "url(#glassFireF)";
                                            strokeColor = "#f43f5e";
                                        } else if (isTotal) {
                                            fillUrl = activeData.isAcceptable ? "url(#glassGreenF)" : "url(#glassRedF)";
                                            strokeColor = activeData.isAcceptable ? "#22c55e" : "#ef4444";
                                        }
                                        return (
                                            <Cell 
                                                key={`cell-f-${index}`} 
                                                fill={fillUrl} 
                                                stroke={strokeColor} 
                                                strokeWidth={0.8} 
                                                strokeOpacity={1} 
                                                className="transition-all duration-300 cursor-pointer outline-none"
                                                onClick={(e: any) => {
                                                    if (e && e.stopPropagation) e.stopPropagation();
                                                    setSelectedFreq(entry.name);
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
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#f43f5e] shadow-[0_0_5px_rgba(244,63,94,0.4)]" />
                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Danos Físicos (FB, FV)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#94a3b8] shadow-[0_0_5px_rgba(148,163,184,0.4)]" />
                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Sistemas (FC, FM, FW, FZ)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_5px_rgba(34,197,94,0.4)]" />
                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Aceitável</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444] shadow-[0_0_5px_rgba(239,68,68,0.4)]" />
                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Crítico</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {selectedFreq && auditMode && (
                <FreqEditorialPortal 
                    label={selectedFreq} 
                    data={data} 
                    ctx={{ probCalcs: activeData.p, freqCalcs: activeData.freq }} 
                    formulas={dynamicFrequencyFormulas} 
                    onClose={() => setSelectedFreq(null)} 
                />
            )}
        </div>
    );
}
