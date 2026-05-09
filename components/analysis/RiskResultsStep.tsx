import * as React from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent, CardHeader, CardTitle, Alert, AlertDescription, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Label, FormulaTooltip, useIsMobile, useAuditMode } from '../ui';
import { formatSmartNumber } from '../../lib/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";
import { AlertTriangle, CheckCircle, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { AnalysisData, ProbabilityData, LossData, Zone } from '../../types';
import { RISK_COMPONENTS_DEFS, TOLERABLE_RISKS, PB_OPTIONS, RP_OPTIONS, PSPD_OPTIONS } from '../../constants';
import { calculateLossesForZone, calculateProbabilities, mergeZoneProbabilities, calculateRisksForZone } from '../../utils/calculations';

// Component to format numbers in scientific notation like "9.98 × 10⁻⁷"
const ScientificNotation = ({ value, precision = 2, className = "" }: { value: number; precision?: number; className?: string }) => {
    if (value === 0 || !isFinite(value)) return <span className={className}>0</span>;
    let [mantissa, exponent] = value.toExponential(precision).split('e');
    const expInt = parseInt(exponent, 10);
    
    return (
        <span className={`inline-flex items-baseline tracking-tight ${className}`}>
            <span className="font-black">{mantissa.replace('.', ',')}</span>
            <span className="text-[0.85em] ml-2 opacity-100 font-bold">&times;10</span>
            <sup className="text-[0.75em] leading-none -top-[0.8em] font-bold">{expInt}</sup>
        </span>
    );
};

const formatValue = (value: number) => {
    if (value === 0) return '0';
    return formatSmartNumber(value, { useScientificBelow: 0.001, scientificPrecision: 2, maxDecimals: 3 });
};

const RISK_FORMULAS: { [key: string]: { formula: string; symbols: string[]; vars: string[] } } = {
    RA: { formula: "N<sub>d</sub> × P<sub>A</sub> × L<sub>A</sub>", symbols: ["N<sub>d</sub>", "P<sub>A</sub>", "L<sub>A</sub>"], vars: ["nd", "PA", "LA"] },
    RB: { formula: "N<sub>d</sub> × P<sub>B</sub> × L<sub>B</sub>", symbols: ["N<sub>d</sub>", "P<sub>B</sub>", "L<sub>B</sub>"], vars: ["nd", "PB", "LB"] },
    RC: { formula: "N<sub>d</sub> × PC_total × L<sub>C</sub>", symbols: ["N<sub>d</sub>", "PC_total", "L<sub>C</sub>"], vars: ["nd", "PC_total", "LC"] },
    RM: { formula: "N<sub>m</sub> × PM_total × L<sub>M</sub>", symbols: ["N<sub>m</sub>", "PM_total", "L<sub>M</sub>"], vars: ["nm", "PM_total", "LM"] },
    RU: { formula: "(N<sub>l(e)</sub> × P<sub>U</sub> × L<sub>U</sub>) + (N<sub>l(t)</sub> × P<sub>UT</sub> × L<sub>U</sub>)", symbols: ["N<sub>l(e)</sub>", "P<sub>U</sub>", "L<sub>U</sub>", "N<sub>l(t)</sub>", "P<sub>UT</sub>"], vars: ["nl_electric", "PU", "LU", "nl_data", "PUT"] },
    RV: { formula: "(N<sub>l(e)</sub> × P<sub>V</sub> × L<sub>V</sub>) + (N<sub>l(t)</sub> × P<sub>VT</sub> × L<sub>V</sub>)", symbols: ["N<sub>l(e)</sub>", "P<sub>V</sub>", "L<sub>V</sub>", "N<sub>l(t)</sub>", "P<sub>VT</sub>"], vars: ["nl_electric", "PV", "LV", "nl_data", "PVT"] },
    RW: { formula: "(N<sub>l(e)</sub> × P<sub>W</sub> × L<sub>W</sub>) + (N<sub>l(t)</sub> × P<sub>WT</sub> × L<sub>W</sub>)", symbols: ["N<sub>l(e)</sub>", "P<sub>W</sub>", "L<sub>W</sub>", "N<sub>l(t)</sub>", "P<sub>WT</sub>"], vars: ["nl_electric", "PW", "LW", "nl_data", "PWT"] },
    RZ: { formula: "(N<sub>i(e)</sub> × P<sub>Z</sub> × L<sub>Z</sub>) + (N<sub>i(t)</sub> × P<sub>ZT</sub> × L<sub>Z</sub>)", symbols: ["N<sub>i(e)</sub>", "P<sub>Z</sub>", "L<sub>Z</sub>", "N<sub>i(t)</sub>", "P<sub>ZT</sub>"], vars: ["ni_electric", "PZ", "LZ", "ni_data", "PZT"] },
};

const RiskEditorialPortal = ({ label, data, ctx, onClose }: { label: string; data: AnalysisData; ctx: any; onClose: () => void }) => {
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

    const { calculations: c, probability_calculations: pGlobal, loss_calculations: lGlobal, selected_risk_components: selected } = data;
    const p = ctx?.probCalcs ?? pGlobal;
    const l = ctx?.lossCalcs ?? lGlobal;
    const componentDef = RISK_COMPONENTS_DEFS[label];
    const isTotalRisk = ['R1', 'R2', 'R3', 'R4'].includes(label);

    let formulaString = "N/A";
    let valuesNodes: React.ReactNode = null;
    let valuesString: string | null = null;
    
    const riskResults = ctx?.riskResults || data.risk_results;

    if (isTotalRisk) {
        const components = ALL_RISK_COMPONENTS.filter(key => selected[key]);
        formulaString = components.join(' + ');
        valuesNodes = (
            <span className="font-mono break-normal whitespace-normal">
                {components.map((key, idx) => (
                    <span key={key} className="inline-flex items-baseline">
                        <ScientificNotation value={riskResults[key] || 0} precision={2} />
                        {idx < components.length - 1 ? <span className="mx-0.5">+</span> : null}
                    </span>
                ))}
            </span>
        );
        valuesString = components.map(key => formatValue(riskResults[key] || 0)).join(' + ');
    } else {
        const formulaInfo = RISK_FORMULAS[label];
        if (formulaInfo) {
            formulaString = formulaInfo.formula;
            const valueMap: { [key: string]: number } = { ...c, ...p, ...l };

            if (formulaInfo.symbols && formulaInfo.symbols.length > 0) {
                let res = formulaString;
                const valueMapCombined: { [key: string]: number } = { 
                    ...valueMap, 
                    PC_total: 1 - ((1 - (valueMap.PC || 0)) * (1 - (valueMap.PCT || 0))),
                    PM_total: 1 - ((1 - (valueMap.PM || 0)) * (1 - (valueMap.PMT || 0)))
                };
                formulaInfo.symbols.forEach((symbol, index) => {
                    const varKey = formulaInfo.vars[index];
                    const val = valueMapCombined[varKey] || 0;
                    res = res.split(symbol).join(formatValue(val));
                });
                valuesString = res;
            } else {
                try {
                    const regex = new RegExp(`\\b(${formulaInfo.vars.join('|')})\\b`, 'gi');
                    valuesString = formulaString.replace(regex, (match) => {
                        const val = valueMap[match] || valueMap[match.toLowerCase()] || valueMap[match.toUpperCase()] || 0;
                        return formatValue(val);
                    });
                } catch {
                    valuesString = null;
                }
            }

            if (["RU","RV","RW","RZ"].includes(label)) {
                const term1 = [valueMap[formulaInfo.vars[0]] || 0, valueMap[formulaInfo.vars[1]] || 0, valueMap[formulaInfo.vars[2]] || 0];
                const term2 = [valueMap[formulaInfo.vars[3]] || 0, valueMap[formulaInfo.vars[4]] || 0, valueMap[formulaInfo.vars[5]] || 0];
                valuesNodes = (
                    <span className="font-mono break-normal whitespace-normal">
                        <span className="inline-flex items-baseline">
                            <ScientificNotation value={term1[0]} precision={2} />
                            <span className="mx-0.5">×</span>
                            <ScientificNotation value={term1[1]} precision={2} />
                            <span className="mx-0.5">×</span>
                            <ScientificNotation value={term1[2]} precision={2} />
                        </span>
                        <span className="mx-0.5">+</span>
                        <span className="inline-flex items-baseline">
                            <ScientificNotation value={term2[0]} precision={2} />
                            <span className="mx-0.5">×</span>
                            <ScientificNotation value={term2[1]} precision={2} />
                            <span className="mx-0.5">×</span>
                            <ScientificNotation value={term2[2]} precision={2} />
                        </span>
                    </span>
                );
            } else if (label === "RC") {
                const nd = valueMap["nd"] || 0;
                const LC = valueMap["LC"] || 0;
                const PC = valueMap["PC"] || 0;
                const PCT = valueMap["PCT"] || 0;
                const PC_total = 1 - ((1 - PC) * (1 - PCT));
                valuesNodes = (
                    <span className="font-mono break-normal whitespace-normal leading-tight">
                        <span className="inline-flex items-baseline">
                            <ScientificNotation value={nd} precision={2} />
                            <span className="mx-0.5">×</span>
                            <ScientificNotation value={PC_total} precision={2} />
                            <span className="mx-0.5">×</span>
                            <ScientificNotation value={LC} precision={2} />
                        </span>
                        <span className="block mt-1 text-xs leading-tight">
                            PC_total = 1 − (1 − <ScientificNotation value={PC} precision={2} />) × (1 − <ScientificNotation value={PCT} precision={2} />) = <ScientificNotation value={PC_total} precision={2} />
                        </span>
                    </span>
                );
            } else if (label === "RM") {
                const nm = valueMap["nm"] || 0;
                const LM = valueMap["LM"] || 0;
                const PM = valueMap["PM"] || 0;
                const PMT = valueMap["PMT"] || 0;
                const PM_total = 1 - ((1 - PM) * (1 - PMT));
                valuesNodes = (
                    <span className="font-mono">
                        <span className="inline-flex items-baseline">
                        <ScientificNotation value={nm} precision={2} />
                        <span className="mx-0.5">×</span>
                        <ScientificNotation value={PM_total} precision={2} />
                        <span className="mx-0.5">×</span>
                            <ScientificNotation value={LM} precision={2} />
                        </span>
                        <span className="block mt-1 text-xs">
                            PM_total = 1 − (1 − <ScientificNotation value={PM} precision={2} />) × (1 − <ScientificNotation value={PMT} precision={2} />) = <ScientificNotation value={PM_total} precision={2} />
                        </span>
                    </span>
                );
            } else {
                const parts = formulaInfo.vars.map(v => valueMap[v] || 0);
                valuesNodes = (
                    <span className="font-mono">
                        {parts.map((val, idx) => (
                            <span key={idx} className="inline-flex items-baseline">
                            <ScientificNotation value={val} precision={2} />
                            {idx < parts.length - 1 ? <span className="mx-0.5">×</span> : null}
                            </span>
                        ))}
                    </span>
                );
            }
        }
    }

    const finalValue = riskResults[label] || 0;

    return createPortal(
        <div className="fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px] pointer-events-none animate-in fade-in duration-200" />
            <div 
                ref={portalRef}
                className="fixed right-6 top-[100px] w-[min(90vw,540px)] p-6 bg-slate-800/98 border border-blue-500/40 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl z-[9999] animate-in slide-in-from-right-10 fade-in duration-300 pointer-events-auto"
            >
                <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    <p className="font-black text-slate-100 uppercase tracking-[0.2em] text-[10px]">Detalhamento de Risco Editorial</p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between bg-slate-900/40 p-4 rounded-2xl border border-white/5">
                        <div className="flex flex-col">
                            <span className="font-black text-slate-100 text-lg uppercase tracking-wider">{label}</span>
                            {componentDef && <p className="text-slate-400 text-[10px] uppercase font-bold tracking-tight">{componentDef.description}</p>}
                        </div>
                        <div className="flex items-baseline gap-2 text-right">
                            <span className="text-[10px] uppercase font-black text-blue-500/70 tracking-widest text-right">Valor Final</span>
                            <p className="text-blue-400 font-black text-xl">
                                <ScientificNotation value={Number(finalValue)} precision={2} />
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
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

const ALL_RISK_COMPONENTS: (keyof AnalysisData['selected_risk_components'])[] = ['RA', 'RB', 'RC', 'RM', 'RU', 'RV', 'RW', 'RZ'];

interface RiskResultsStepProps {
    data: AnalysisData;
    onUpdate: (newData: Partial<AnalysisData>) => void;
}

export function RiskResultsStep({ data, onUpdate }: RiskResultsStepProps) {
    const [openSelect, setOpenSelect] = React.useState<string | null>(null);
    const { risk_results, risks_to_analyze, selected_risk_components } = data;
    const isMobile = useIsMobile();
    const { auditMode, setActiveTooltipId } = useAuditMode();
    const [selectedRisk, setSelectedRisk] = React.useState<string | null>(null);

    const handleSimulatorUpdate = (
        field: keyof ProbabilityData | keyof LossData,
        value: number
    ) => {
        const v = Number(value);
        if (field in data.probability_data) {
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
        } else {
             const newZones = data.zones.map(zone => {
                 const newLossData = { ...zone.loss_data, [field]: value };
                 return { ...zone, loss_data: newLossData };
             });
            onUpdate({ zones: newZones });
        }
    };

    const selectedRisks = (Object.keys(risks_to_analyze) as Array<keyof typeof risks_to_analyze>)
        .filter(key => risks_to_analyze[key]);
    
    const displayedToleranceValue = TOLERABLE_RISKS[selectedRisks[0] || 'R1'];
    const hasR3 = selectedRisks.includes('R3');
    const hasR4 = selectedRisks.includes('R4');
    const compact = hasR3 || hasR4; 
    const totalCards = 1 + selectedRisks.length; 
    const gridColsClass = totalCards >= 4
        ? 'lg:grid-cols-3 xl:grid-cols-4'
        : (totalCards === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2');

    let chartData: { name: string; value: number }[] = ALL_RISK_COMPONENTS.map(key => ({
        name: key,
        value:
            key === 'RU' ? ((risk_results.RU || 0) + (risk_results.RUT || 0)) :
            key === 'RV' ? ((risk_results.RV || 0) + (risk_results.RVT || 0)) :
            key === 'RW' ? ((risk_results.RW || 0) + (risk_results.RWT || 0)) :
            key === 'RZ' ? ((risk_results.RZ || 0) + (risk_results.RZT || 0)) :
            (risk_results[key] || 1e-12),
    }));
    selectedRisks.forEach(riskKey => {
         chartData.push({ name: riskKey, value: risk_results[riskKey] || 1e-12 });
    });

    const currentChart = chartData;
    const maxBarValue = currentChart.reduce((max, d) => (typeof d.value === 'number' ? Math.max(max, d.value) : max), 1e-9);
    const yMaxDomain = Math.max(maxBarValue, displayedToleranceValue);
    
    const riskFormulas: { [key: string]: string } = {
        R1: ALL_RISK_COMPONENTS.filter(c => selected_risk_components[c]).join(' + '),
        R3: "RB3 + RV3", 
        R4: ALL_RISK_COMPONENTS.filter(c => selected_risk_components[c]).map(c => c + '4').join(' + '),
    };

    const handleZoneLossUpdate = (zoneId: string, field: keyof LossData, value: number) => {
        const newZones = data.zones.map(z => z.id === zoneId ? { ...z, loss_data: { ...z.loss_data, [field]: value } } : z);
        onUpdate({ zones: newZones });
    };
    const multipleZones = (data.zones?.length || 0) > 1;

    const makeZoneHeading = (zoneName: string | undefined, idx: number) => {
        const base = `Zona ${idx + 1}`;
        const name = (zoneName || '').trim();
        if (!name) return base;
        const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
        if (norm(name) === norm(base)) return base;
        return `${base} (${name})`;
    };

    const activeViewId = data.last_active_view_id || 'GLOBAL';
    const zoneIds = (data.zones || []).map(z => z.id);
    const viewOrder = ['GLOBAL', ...zoneIds];
    const currentViewIndex = Math.max(0, viewOrder.indexOf(activeViewId));
    
    const activeZoneIndex = activeViewId === 'GLOBAL' ? -1 : zoneIds.indexOf(activeViewId);
    const activeZone = activeZoneIndex >= 0 ? data.zones[activeZoneIndex] : undefined;
    const activeHeading = activeViewId === 'GLOBAL' ? 'Global' : makeZoneHeading(activeZone?.name, Math.max(0, activeZoneIndex));


    const goPrevView = () => onUpdate({ last_active_view_id: viewOrder[(currentViewIndex - 1 + viewOrder.length) % viewOrder.length] });
    const goNextView = () => onUpdate({ last_active_view_id: viewOrder[(currentViewIndex + 1) % viewOrder.length] });

    let activeZoneRisk: { [key: string]: number } | null = null;
    let activeZoneChart: { name: string; value: number }[] = [];
    let tooltipCtx: { probCalcs: any; lossCalcs: any; riskResults: any } | null = null;
    if (activeZone) {
        const lossCalcs = calculateLossesForZone(activeZone);
        const zoneBaseProbCalcs = calculateProbabilities(
            activeZone.probability_data || data.probability_data,
            (activeZone.analyze_data_line_probabilities ?? data.analyze_data_line_probabilities),
            data.has_data_line,
            (activeZone.analyze_electric_line_probabilities ?? data.analyze_electric_line_probabilities)
        );
        const zoneProbCalcs = mergeZoneProbabilities(zoneBaseProbCalcs, activeZone);
        const r = calculateRisksForZone(data.calculations, zoneProbCalcs, lossCalcs, data.selected_risk_components);
        activeZoneRisk = r;
        tooltipCtx = { probCalcs: zoneProbCalcs, lossCalcs, riskResults: r };
        activeZoneChart = ALL_RISK_COMPONENTS.map(key => ({
            name: key,
            value:
                key === 'RU' ? ((r.RU || 0) + (r.RUT || 0)) :
                key === 'RV' ? ((r.RV || 0) + (r.RVT || 0)) :
                key === 'RW' ? ((r.RW || 0) + (r.RWT || 0)) :
                key === 'RZ' ? ((r.RZ || 0) + (r.RZT || 0)) :
                (r[key] || 1e-12),
        }));
        selectedRisks.forEach(riskKey => {
            activeZoneChart.push({ name: riskKey, value: r[riskKey] || 1e-12 });
        });
    }

    return (
        <div className="max-w-6xl w-full mx-auto space-y-6 overflow-visible pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
                <Card className="h-full relative overflow-hidden border-slate-700/50 bg-slate-100/5 backdrop-blur-sm shadow-xl shadow-black/20 group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/30 via-blue-400 to-blue-500/30 opacity-50" />
                    
                    <div className="flex justify-center mt-4">
                        <div className="flex items-center gap-4 px-6 py-2 rounded-full bg-slate-950 border border-slate-800 shadow-2xl">
                            {multipleZones && <button onClick={goPrevView} className="p-1.5 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"><ChevronLeft className="w-5 h-5" /></button>}
                            <span className="text-white font-black text-[9px] uppercase tracking-[0.3em] min-w-[200px] text-center">
                                {activeViewId === 'GLOBAL' ? 'Ajuste — GLOBAL' : `Ajuste — ${activeHeading.split('(')[0].trim()}`}
                            </span>
                            {multipleZones && <button onClick={goNextView} className="p-1.5 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"><ChevronRight className="w-5 h-5" /></button>}
                        </div>
                    </div>

                    <CardContent className="space-y-4 py-4 px-4">
                        <div className="grid grid-cols-2 gap-x-3">
                            <div>
                                <Label className="text-[11px] font-bold text-white mb-1 block uppercase tracking-wider text-left">Nível SPDA (PB)</Label>
                                <Select
                                    value={String(activeZone ? (activeZone.probability_overrides?.PB ?? data.probability_data.PB) : data.probability_data.PB)}
                                    onValueChange={(val) => handleSimulatorUpdate('PB', parseFloat(val))}
                                    options={PB_OPTIONS}
                                    onOpenChange={(open) => setOpenSelect(open ? 'pb' : null)}
                                    wrapperClassName={openSelect === 'pb' ? 'relative z-20 mt-1' : 'relative mt-1'}
                                >
                                <SelectTrigger className="h-9 text-xs px-2"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {PB_OPTIONS.map(opt => <SelectItem key={opt.value} value={String(opt.value)} label={opt.label} />)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-[11px] font-bold text-white mb-1 block uppercase tracking-wider text-left">Prot. Incêndio (rp)</Label>
                                <Select
                                    value={String(activeZone ? (activeZone.loss_data.rp ?? 1) : (data.zones[0]?.loss_data.rp ?? 1))}
                                    onValueChange={(val) => activeZone ? handleZoneLossUpdate(activeZone.id, 'rp', parseFloat(val)) : handleSimulatorUpdate('rp', parseFloat(val))}
                                    options={RP_OPTIONS}
                                    onOpenChange={(open) => setOpenSelect(open ? 'rp' : null)}
                                    wrapperClassName={openSelect === 'rp' ? 'relative z-20 mt-1' : 'relative mt-1'}
                                >
                                    <SelectTrigger className="h-9 text-xs px-2"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {RP_OPTIONS.map(opt => <SelectItem key={opt.value} value={String(opt.value)} label={opt.label} />)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
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

                {selectedRisks.length > 0 ? (
                    selectedRisks.map(riskKey => {
                        const riskTolerance = TOLERABLE_RISKS[riskKey];
                        const currentTotalRiskValue = activeZone ? (activeZoneRisk?.[riskKey] || 0) : (risk_results[riskKey] || 0);
                        const isAcceptable = currentTotalRiskValue <= riskTolerance;
                        return (
                            <Card key={riskKey} className={`relative lg:col-span-2 overflow-hidden border border-white/10 bg-slate-950/40 backdrop-blur-2xl h-full transition-all duration-500 group hover:shadow-2xl rounded-[2.5rem] ${isAcceptable ? 'hover:shadow-green-500/10' : 'hover:shadow-red-500/10'}`}>
                                <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${isAcceptable ? 'from-green-500 via-emerald-400 to-green-500' : 'from-red-600 via-rose-500 to-red-600'}`} />
                                <div className="pt-6 px-8 flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 leading-none mb-1">Avaliação de Risco</span>
                                        <span className="text-base font-black text-white tracking-[0.2em] uppercase">{`RT (${riskKey}) — ${activeHeading}`}</span>
                                    </div>
                                    <div className={`p-3 rounded-2xl ${isAcceptable ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {isAcceptable ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                                    </div>
                                </div>
                                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2 pb-4 px-8 items-center">
                                    <div className="flex flex-col items-center">
                                        <div className={`relative z-10 text-5xl md:text-6xl lg:text-7xl font-black mb-4 transition-transform ${isAcceptable ? 'text-green-400' : 'text-red-400'}`}>
                                            <ScientificNotation value={currentTotalRiskValue} precision={2} />
                                        </div>
                                        <div className={`relative z-10 py-2.5 px-10 rounded-full text-[11px] font-black uppercase tracking-[0.35em] border-2 ${isAcceptable ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
                                            {isAcceptable ? 'Aceitável' : 'Inaceitável'}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="text-xs text-slate-400 font-black uppercase tracking-[0.3em] flex items-center gap-1.5">
                                            Tolerável: <ScientificNotation value={riskTolerance} precision={1} className="text-slate-200" />
                                        </div>
                                        <div className={`p-4 bg-white/5 rounded-2xl border w-full text-left font-black uppercase tracking-[0.1em] text-sm ${isAcceptable ? 'text-green-400' : 'text-red-400 animate-pulse'}`}>
                                            {isAcceptable ? 'Dentro dos Limites NBR 5419' : 'Requer Medidas de Proteção'}
                                        </div>
                                    </div>
                                </CardContent>
                                <div className={`absolute bottom-0 left-0 w-full h-[6px] ${isAcceptable ? 'bg-green-500/10' : 'bg-red-500/10'}`} />
                            </Card>
                        );
                    })
                ) : (
                    <Alert className="border-yellow-500/50 bg-yellow-900/40 text-yellow-200 h-full flex flex-col justify-center lg:col-span-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-300" />
                        <AlertDescription>Nenhum tipo de risco foi selecionado para análise.</AlertDescription>
                    </Alert>
                )}
            </div>

            <div className="flex justify-center mt-4 mb-2">
                <span className="px-5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-black/40">
                    {`Gráfico de Componentes — ${activeHeading}`}
                </span>
            </div>

            <Card 
                className="relative overflow-hidden border-slate-700/30 bg-slate-900/40 backdrop-blur-md shadow-xl shadow-black/20 group"
                onClick={(e) => e.stopPropagation()}
            >
                <CardContent className="h-[15.2rem] pt-6 pb-2 flex flex-col">
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%" className="outline-none focus:outline-none">
                            <BarChart 
                                data={activeZone ? activeZoneChart : chartData} 
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                className="outline-none focus:outline-none"
                            >
                                <defs>
                                    <linearGradient id="glassShockR" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.7} />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    </linearGradient>
                                    <linearGradient id="glassFireR" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.7} />
                                        <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.3} />
                                    </linearGradient>
                                    <linearGradient id="glassSystemsR" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.7} />
                                        <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.3} />
                                    </linearGradient>
                                    <linearGradient id="glassTotalR" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.7} />
                                        <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.3} />
                                    </linearGradient>
                                </defs>
                                <Tooltip cursor={false} content={<></>} />
                                <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} strokeOpacity={0.1} />
                                <XAxis 
                                    type="category" 
                                    dataKey="name" 
                                    tick={(props) => {
                                        const { x, y, payload } = props;
                                        return (
                                            <g transform={`translate(${x},${y})`} className="cursor-pointer group outline-none" onClick={() => {
                                                setSelectedRisk(payload.value);
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
                                <YAxis 
                                    type="number" 
                                    domain={[0, yMaxDomain * 1.1]} 
                                    allowDataOverflow 
                                    tickFormatter={(tick) => {
                                        const formatPtBR = (val: number) => {
                                            if (val === 0) return '0';
                                            if (Math.abs(val) < 0.0001) {
                                                const [m, e] = val.toExponential(1).split('e');
                                                return `${m}×10${e}`;
                                            }
                                            return val.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 4 });
                                        };
                                        return formatPtBR(tick);
                                    }} 
                                    tick={{ fill: '#64748b', fontSize: 10 }} 
                                    axisLine={false} 
                                    tickLine={false} 
                                />
                                <ReferenceLine y={displayedToleranceValue} strokeWidth={2} stroke="#f43f5e" strokeDasharray="4 4" strokeOpacity={0.5} />
                                <Bar 
                                    dataKey="value" 
                                    radius={[4, 4, 0, 0]} 
                                    barSize={80}
                                    minPointSize={10}
                                >
                                    {(activeZone ? activeZoneChart : chartData).map((entry, index) => {
                                        const name = entry.name.toUpperCase();
                                        let fillUrl = "url(#glassSystemsR)";
                                        let strokeColor = "#cbd5e1"; // Slate 300 (Cinza Claro)
                                        
                                        if (name === 'RA' || name === 'RU') {
                                            fillUrl = "url(#glassShockR)";
                                            strokeColor = "#3b82f6";
                                        } else if (name === 'RB' || name === 'RV') {
                                            fillUrl = "url(#glassFireR)";
                                            strokeColor = "#f43f5e";
                                        } else if (['R1', 'R2', 'R3', 'R4'].includes(name)) {
                                            fillUrl = "url(#glassTotalR)";
                                            strokeColor = "#a78bfa";
                                        }
                                        
                                        return (
                                            <Cell 
                                                key={`cell-r-${index}`} 
                                                fill={fillUrl} 
                                                stroke={strokeColor} 
                                                strokeWidth={0.8} 
                                                strokeOpacity={1} 
                                                className="transition-all duration-300 cursor-pointer outline-none"
                                                onClick={(e: any) => {
                                                    if (e && e.stopPropagation) e.stopPropagation();
                                                    setSelectedRisk(entry.name);
                                                    setActiveTooltipId(null);
                                                }}
                                            />
                                        );
                                    })}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="overflow-x-auto no-scrollbar w-full">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-2 pt-2 border-t border-white/5 px-4 text-center min-w-[500px] lg:min-w-0">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                            <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Choque (RA, RU)</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]" />
                            <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Incêndio (RB, RV)</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#94a3b8]" />
                            <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Sistemas (RC, RM, RW, RZ)</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]" />
                            <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Riscos Totais (RT)</span>
                        </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {selectedRisk && auditMode && (
                <RiskEditorialPortal 
                    label={selectedRisk} 
                    data={data} 
                    ctx={activeZone ? tooltipCtx : { probCalcs: data.probability_calculations, lossCalcs: data.loss_calculations, riskResults: data.risk_results }} 
                    onClose={() => setSelectedRisk(null)} 
                />
            )}
        </div>
    );
}

const ALL_RISK_COMPONENTS_ALT: (keyof AnalysisData['selected_risk_components'])[] = ['RA', 'RB', 'RC', 'RM', 'RU', 'RV', 'RW', 'RZ'];
