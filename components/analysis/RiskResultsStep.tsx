import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Alert, AlertDescription, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Label, FormulaTooltip, useIsMobile } from '../ui';
import { formatSmartNumber } from '../../lib/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";
import { AlertTriangle, CheckCircle, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { AnalysisData, ProbabilityData, LossData, Zone } from '../../types';
import { RISK_COMPONENTS_DEFS, TOLERABLE_RISKS, PB_OPTIONS, RP_OPTIONS, PSPD_OPTIONS } from '../../constants';
import { calculateLossesForZone, calculateProbabilities, mergeZoneProbabilities, calculateRisksForZone } from '../../utils/calculations';

// Component to format numbers in scientific notation like "9.98 × 10⁻⁷"
const ScientificNotation = ({ value, precision = 2 }: { value: number; precision?: number }) => {
    if (value === 0 || !isFinite(value)) {
        return <span>0</span>;
    }
    const [mantissa, exponent] = value.toExponential(precision).split('e');
    return (
        <span className="font-mono tracking-tight whitespace-nowrap" dangerouslySetInnerHTML={{ __html: `${mantissa.replace('.', ',')} &times; 10<sup>${exponent}</sup>` }} />
    );
};

const formatValue = (value: number) => {
    if (value === 0) return '0';
    return formatSmartNumber(value, { useScientificBelow: 0.001, scientificPrecision: 2, maxDecimals: 3 });
};

const RISK_FORMULAS: { [key: string]: { formula: string; vars: string[] } } = {
    RA: { formula: "Nd × PA × LA", vars: ["nd", "PA", "LA"] },
    RB: { formula: "Nd × PB × LB", vars: ["nd", "PB", "LB"] },
    // Estrutura e proximidade: combinação de sistemas internos (elétrica + dados)
    RC: { formula: "Nd × [1 − (1 − PC) × (1 − PCT)] × LC", vars: ["nd", "PC", "PCT", "LC"] },
    RM: { formula: "Nm × [1 − (1 − PM) × (1 − PMT)] × LM", vars: ["nm", "PM", "PMT", "LM"] },
    // Componentes de linha: fórmula como soma de energia + telecom
    RU: { formula: "Nl_e × PU × LU + Nl_t × PUT × LU", vars: ["nl_electric", "PU", "LU", "nl_data", "PUT", "LU"] },
    RV: { formula: "Nl_e × PV × LV + Nl_t × PVT × LV", vars: ["nl_electric", "PV", "LV", "nl_data", "PVT", "LV"] },
    RW: { formula: "Nl_e × PW × LW + Nl_t × PWT × LW", vars: ["nl_electric", "PW", "LW", "nl_data", "PWT", "LW"] },
    RZ: { formula: "Ni_e × PZ × LZ + Ni_t × PZT × LZ", vars: ["ni_electric", "PZ", "LZ", "ni_data", "PZT", "LZ"] },
};

const CustomTooltip = ({ active, payload, label, data, ctx }: any) => {
    if (active && payload && payload.length) {
        const { calculations: c, probability_calculations: pGlobal, loss_calculations: lGlobal, selected_risk_components: selected } = data;
        // Quando estamos na visão por zona, usamos cálculos específicos da zona ativa.
        const p = ctx?.probCalcs ?? pGlobal;
        const l = ctx?.lossCalcs ?? lGlobal;
        const componentDef = RISK_COMPONENTS_DEFS[label];
        const isTotalRisk = ['R1', 'R3', 'R4'].includes(label);

        let formulaString = "N/A";
        let valuesNodes: React.ReactNode = null;
        let valuesString: string | null = null;
        
        if (isTotalRisk) {
            const components = ALL_RISK_COMPONENTS.filter(key => selected[key]);
            formulaString = components.join(' + ');
            // Render valores como soma dos componentes selecionados
            valuesNodes = (
                <span className="font-mono break-normal whitespace-normal">
                    {components.map((key, idx) => (
                        <span key={key} className="inline-flex items-baseline">
                            <ScientificNotation value={data.risk_results[key] || 0} precision={2} />
                            {idx < components.length - 1 ? <span className="mx-0.5">+</span> : null}
                        </span>
                    ))}
                </span>
            );
            valuesString = components.map(key => formatValue(data.risk_results[key] || 0)).join(' + ');
        } else {
            const formulaInfo = RISK_FORMULAS[label];
            if (formulaInfo) {
                formulaString = formulaInfo.formula;
                const valueMap: { [key: string]: number } = { ...c, ...p, ...l };

                // Valores com substituição direta na fórmula
                try {
                    const regex = new RegExp(`\\b(${formulaInfo.vars.join('|')})\\b`, 'g');
                    valuesString = formulaString.replace(regex, (match) => formatValue(valueMap[match] || 0));
                } catch {
                    valuesString = null;
                }

                if (["RU","RV","RW","RZ"].includes(label)) {
                    // Render como soma de dois termos: energia + telecom para componentes de linha
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
                    // RC: Nd × PC_total × LC, onde PC_total = 1 − (1 − PC)(1 − PCT)
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
                    // RM: Nm × PM_total × LM, onde PM_total = 1 − (1 − PM)(1 − PMT)
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
                    // Demais componentes: produto simples
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
                {componentDef && <p className="text-slate-400 text-xs">{componentDef.description}</p>}
                <p className="text-blue-400 font-mono">Valor: <ScientificNotation value={Number(payload[0].value)} precision={2} /></p>
                <>
                    <p className="text-slate-300 mt-2 font-semibold">Fórmula:</p>
                    <p className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs sm:text-sm leading-tight">{formulaString}</p>
                    {valuesString && (
                        <>
                            <p className="text-slate-300 mt-2 font-semibold">Valores:</p>
                            <p className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs sm:text-sm break-normal whitespace-normal leading-tight">{valuesString}</p>
                        </>
                    )}
                    {valuesNodes && (
                        <>
                            <p className="text-slate-300 mt-2 font-semibold">Detalhe:</p>
                            <div className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs sm:text-sm break-normal whitespace-normal leading-tight">{valuesNodes}</div>
                        </>
                    )}
                </>
            </div>
        );
    }
    return null;
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

    const handleSimulatorUpdate = (
        field: keyof ProbabilityData | keyof LossData,
        value: number
    ) => {
        if (field in data.probability_data) {
            const updatedProbData: Partial<ProbabilityData> = { [field]: value };
            if (field === 'PSPD_electric') {
                updatedProbData.PSPD_data = value;
            }
            // Atualiza dados globais de probabilidade
            const nextUpdate: Partial<AnalysisData> = { probability_data: { ...data.probability_data, ...updatedProbData } };

            // Propaga PB GLOBAL para todas as zonas
            if (field === 'PB') {
                const newZones = (data.zones || []).map(zone => {
                    const overrides = { ...(zone.probability_overrides || {}) };
                    const probData = { ...(zone.probability_data || data.probability_data) } as any;
                    overrides.PB = Number(value);
                    probData.PB = Number(value);
                    // Limpa derivados para que recalculados globais entrem em vigor
                    delete overrides.PA;
                    return { ...zone, probability_overrides: overrides, probability_data: probData };
                });
                nextUpdate.zones = newZones;
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
    const compact = hasR3 || hasR4; // aplicar ajustes se houver R3 ou R4
    const totalCards = 1 + selectedRisks.length; // Ajustar Proteções + riscos selecionados
    // Layout responsivo baseado no total de cards: 2 cols para 2 cards, 3 cols para 3 cards, 4 cols para 4+
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

    // Garantir que o eixo Y inclua a linha de tolerância mesmo quando os valores das barras são menores
    const currentChart = chartData;
    const maxBarValue = currentChart.reduce((max, d) => (typeof d.value === 'number' ? Math.max(max, d.value) : max), 1e-9);
    const yMaxDomain = Math.max(maxBarValue, displayedToleranceValue);
    
    const riskFormulas: { [key: string]: string } = {
        R1: ALL_RISK_COMPONENTS.filter(c => selected_risk_components[c]).join(' + '),
        R3: "RB3 + RV3", // Simplified for display
        R4: ALL_RISK_COMPONENTS.filter(c => selected_risk_components[c]).map(c => c + '4').join(' + '),
    };

    // Helpers for per-zone updates
    const handleZoneLossUpdate = (zoneId: string, field: keyof LossData, value: number) => {
        const newZones = data.zones.map(z => z.id === zoneId ? { ...z, loss_data: { ...z.loss_data, [field]: value } } : z);
        onUpdate({ zones: newZones });
    };
    const handleZoneProbOverrideUpdate = (zoneId: string, field: string, value: number) => {
        const newZones = data.zones.map(z => {
            if (z.id !== zoneId) return z;
            const overrides = { ...(z.probability_overrides || {}) };
            overrides[field] = Number(value);
            return { ...z, probability_overrides: overrides };
        });
        onUpdate({ zones: newZones });
    };

    const multipleZones = (data.zones?.length || 0) > 1;

    // Helper to build a clean zone heading without duplicated text (e.g. "Zona 1 (Zona 1)")
    const makeZoneHeading = (zoneName: string | undefined, idx: number) => {
        const base = `Zona ${idx + 1}`;
        const name = (zoneName || '').trim();
        if (!name) return base;
        const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
        if (norm(name) === norm(base)) return base;
        return `${base} (${name})`;
    };

    // Pre-compute per-zone risk calculations when needed
    const perZoneRisk: { zone: Zone; risk: { [key: string]: number } }[] = multipleZones ? data.zones.map(zone => {
        const lossCalcs = calculateLossesForZone(zone);
        const zoneBaseProbCalcs = calculateProbabilities(
            zone.probability_data || data.probability_data,
            (zone.analyze_data_line_probabilities ?? data.analyze_data_line_probabilities),
            data.has_data_line,
            (zone.analyze_electric_line_probabilities ?? data.analyze_electric_line_probabilities)
        );
        const zoneProbCalcs = mergeZoneProbabilities(zoneBaseProbCalcs, zone);
        const r = calculateRisksForZone(data.calculations, zoneProbCalcs, lossCalcs, data.selected_risk_components);
        return { zone, risk: r };
    }) : [];

    const activeViewId = data.last_active_view_id || 'GLOBAL';
    const zoneIds = (data.zones || []).map(z => z.id);
    const viewOrder = ['GLOBAL', ...zoneIds];
    const currentViewIndex = Math.max(0, viewOrder.indexOf(activeViewId));
    const goPrevView = () => {
        const nextView = viewOrder[(currentViewIndex - 1 + viewOrder.length) % viewOrder.length];
        onUpdate({ last_active_view_id: nextView });
    };
    const goNextView = () => {
        const nextView = viewOrder[(currentViewIndex + 1) % viewOrder.length];
        onUpdate({ last_active_view_id: nextView });
    };

    const activeZoneIndex = activeViewId === 'GLOBAL' ? -1 : zoneIds.indexOf(activeViewId);
    const activeZone = activeZoneIndex >= 0 ? data.zones[activeZoneIndex] : undefined;
    const activeHeading = activeViewId === 'GLOBAL' ? 'Global' : makeZoneHeading(activeZone?.name, Math.max(0, activeZoneIndex));

    // Título ajustado deve ser calculado após activeHeading existir
    const adjustTitle = compact
        ? `Aj. Prot. - ${activeHeading === 'Global' ? 'Glob.' : activeHeading}`
        : `Ajustar Proteções — ${activeHeading}`;

    // Dados por visão ativa
    let activeZoneRisk: { [key: string]: number } | null = null;
    let activeZoneChart: { name: string; value: number }[] = [];
    // Contexto para o Tooltip: probabilidades e perdas usadas na visão atual
    let tooltipCtx: { probCalcs: any; lossCalcs: any } | null = null;
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
        tooltipCtx = { probCalcs: zoneProbCalcs, lossCalcs };
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
        <div className="space-y-4">
            {/* Cards lado a lado quando R3 e R4 presentes (e R1, se ativo) */}
            <div className={`grid grid-cols-1 ${gridColsClass} gap-4 items-stretch`}>

                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between text-base">
                            <span className="flex items-center gap-2">
                                <SlidersHorizontal className="w-5 h-5 text-blue-400" />
                                {adjustTitle}
                            </span>
                            {multipleZones && (
                                <div className="flex items-center gap-1">
                                    <button aria-label="Zona anterior" className="p-1 rounded hover:bg-slate-700" onClick={goPrevView}>
                                        <ChevronLeft className="w-5 h-5 text-slate-300" />
                                    </button>
                                    <button aria-label="Próxima zona" className="p-1 rounded hover:bg-slate-700" onClick={goNextView}>
                                        <ChevronRight className="w-5 h-5 text-slate-300" />
                                    </button>
                                </div>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-1 pb-4 px-4">
                        <div>
                            <Label className="text-base font-semibold text-slate-200">Nível do SPDA (PB)</Label>
                            <Select
                                value={String(activeZone ? (activeZone.probability_overrides?.PB ?? data.probability_data.PB) : data.probability_data.PB)}
                                onValueChange={(val) => {
                                    const v = parseFloat(val);
                                    if (activeZone) {
                                        // Atualização atômica: definir PB na probability_data da zona e remover override PB
                                        const newZones = data.zones.map(z => {
                                            if (z.id !== activeZone.id) return z;
                                            const baseProb = (z.probability_data || data.probability_data);
                                            const nextProb = { ...baseProb, PB: v } as ProbabilityData;
                                            const nextOverrides = { ...(z.probability_overrides || {}) };
                                            delete nextOverrides.PB;
                                            return { ...z, probability_data: nextProb, probability_overrides: nextOverrides };
                                        });
                                        onUpdate({ zones: newZones });
                                    } else {
                                        // Visão Global: apenas atualiza probabilidade base
                                        handleSimulatorUpdate('PB', v);
                                    }
                                }}
                                options={PB_OPTIONS}
                                onOpenChange={(open) => setOpenSelect(open ? 'pb' : null)}
                                wrapperClassName={openSelect === 'pb' ? 'relative z-20 mt-2' : 'relative mt-2'}
                            >
                                <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {PB_OPTIONS.map(opt => <SelectItem key={opt.value} value={String(opt.value)} label={opt.label} />)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-base font-semibold text-slate-200">Proteção Incêndio (rp)</Label>
                            <Select
                                value={String(activeZone ? (activeZone.loss_data.rp ?? (data.zones[0]?.loss_data.rp ?? 1)) : (data.zones[0]?.loss_data.rp ?? 1))}
                                onValueChange={(val) => activeZone ? handleZoneLossUpdate(activeZone.id, 'rp', parseFloat(val)) : handleSimulatorUpdate('rp', parseFloat(val))}
                                options={RP_OPTIONS}
                                onOpenChange={(open) => setOpenSelect(open ? 'rp' : null)}
                                wrapperClassName={openSelect === 'rp' ? 'relative z-20 mt-2' : 'relative mt-2'}
                            >
                                <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {RP_OPTIONS.map(opt => <SelectItem key={opt.value} value={String(opt.value)} label={opt.label} />)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-base font-semibold text-slate-200">Proteção contra Surtos (MPS)</Label>
                            <Select
                                value={String(activeZone ? (activeZone.probability_data?.PSPD_electric ?? data.probability_data.PSPD_electric) : data.probability_data.PSPD_electric)}
                                onValueChange={(val) => {
                                    const v = parseFloat(val);
                                    if (activeZone) {
                                        const newZones = data.zones.map(z => {
                                            if (z.id !== activeZone.id) return z;
                                            const baseProb = (z.probability_data || data.probability_data);
                                            // Atualiza PSPD_electric e sincroniza PSPD_data
                                            return { ...z, probability_data: { ...baseProb, PSPD_electric: v, PSPD_data: v } };
                                        });
                                        onUpdate({ zones: newZones });
                                    } else {
                                        handleSimulatorUpdate('PSPD_electric', v);
                                    }
                                }}
                                options={PSPD_OPTIONS}
                                onOpenChange={(open) => setOpenSelect(open ? 'pspd' : null)}
                                wrapperClassName={openSelect === 'pspd' ? 'relative z-20 mt-2' : 'relative mt-2'}
                            >
                                <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {PSPD_OPTIONS.map(opt => <SelectItem key={opt.value} value={String(opt.value)} label={opt.label} />)}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {selectedRisks.length > 0 ? (
                    selectedRisks.map(riskKey => {
                            const riskTolerance = TOLERABLE_RISKS[riskKey];
                            const currentTotalRiskValue = activeZone ? (activeZoneRisk?.[riskKey] || 0) : (risk_results[riskKey] || 0);
                            const isAcceptable = currentTotalRiskValue <= riskTolerance;
                            const formula = riskFormulas[riskKey];
                            return (
                                <Card key={riskKey} className={`border-2 ${isAcceptable ? 'border-green-500/80' : 'border-red-500/80'} h-full`}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between text-base">
                                            {formula ? (
                                                <FormulaTooltip formulas={{ [riskKey]: formula }} values={activeZone ? (activeZoneRisk || {}) : risk_results}>
                                                    <span className="flex items-center gap-2">{`RT (${riskKey}) — ${activeHeading}`}</span>
                                                </FormulaTooltip>
                                            ) : (
                                                <span className="flex items-center gap-2">{`RT (${riskKey}) — ${activeHeading}`}</span>
                                            )}
                                            {isAcceptable ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertTriangle className="w-5 h-5 text-red-500" />}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-center p-4">
                                        <div className="text-2xl font-bold mb-1 whitespace-nowrap ${isAcceptable ? 'text-green-400' : 'text-red-400'}">
                                            <ScientificNotation value={currentTotalRiskValue} />
                                        </div>
                                        <div className="text-[10px] text-slate-400 mb-2">Limite: <ScientificNotation value={riskTolerance} precision={2} /></div>
                                        <div className="rounded-md py-1.5 px-3 text-xs font-semibold ${isAcceptable ? 'bg-green-950/70 text-green-200' : 'bg-red-950/70 text-red-200'}">
                                            {isAcceptable ? 'Risco Aceitável' : 'Risco Não Aceitável'}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <Alert className="border-yellow-500/50 bg-yellow-900/40 text-yellow-200 h-full flex flex-col justify-center">
                            <AlertTriangle className="h-4 w-4 text-yellow-300" />
                            <AlertDescription>Nenhum tipo de risco foi selecionado para análise.</AlertDescription>
                        </Alert>
                    )}
                </div>

            <Card>
                <CardHeader><CardTitle>{`Componentes de Risco — ${activeHeading}`}</CardTitle></CardHeader>
                <CardContent className="h-[13.5rem] pt-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={activeZone ? activeZoneChart : chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis type="category" dataKey="name" tick={{ fill: '#94a3b8' }} />
                            <YAxis type="number" scale="log" domain={[1e-9, yMaxDomain]} allowDataOverflow tickFormatter={(tick) => tick.toExponential(0)} tick={{ fill: '#94a3b8' }} />
                            {!isMobile && (
                                <Tooltip content={<CustomTooltip data={data} ctx={activeZone ? tooltipCtx : { probCalcs: data.probability_calculations, lossCalcs: data.loss_calculations }} />} cursor={{ fill: 'rgba(30, 41, 59, 0.7)' }} />
                            )}
                            {/* Linha de tolerância (pontilhada) restaurada */}
                            <ReferenceLine y={displayedToleranceValue} strokeWidth={2} stroke="#ef4444" strokeDasharray="3 3" />
                            <Bar dataKey="value">
                                {(activeZone ? activeZoneChart : chartData).map((entry, index) => {
                                    const isTotalRiskBar = selectedRisks.includes(entry.name as any);
                                    const componentKey = entry.name as keyof typeof selected_risk_components;
                                    const isComponentSelected = selected_risk_components[componentKey];
                                    let color: string;
                                    let strokeColor = 'none';
                                    let strokeWidth = 0;
                                    if (isTotalRiskBar) {
                                        const riskKey = entry.name as keyof typeof TOLERABLE_RISKS;
                                        const riskValueForView = activeZone ? (activeZoneRisk?.[riskKey] || 0) : (risk_results[riskKey] || 0);
                                        const isAcceptable = riskValueForView <= TOLERABLE_RISKS[riskKey];
                                        color = isAcceptable ? '#22c55e' : '#ef4444';
                                        // Sem traço nas barras totais para eliminar linhas coloridas no pé
                                    } else if (isComponentSelected) {
                                        color = '#3B82F6';
                                    } else {
                                        color = '#64748b80';
                                    }
                                    return <Cell key={`cell-view-${index}`} fill={color} stroke={strokeColor} strokeWidth={strokeWidth} />;
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Renderização por zona removida em favor da navegação por setas (Global/Zona) */}
        </div>
    );
}
