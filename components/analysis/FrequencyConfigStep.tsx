import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Checkbox, Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, FormulaTooltip, useIsMobile } from '../ui';
import { formatSmartNumber } from '../../lib/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";
import { AlertTriangle, CheckCircle, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnalysisData, ProbabilityData, LossData } from '../../types';
import { calculateProbabilities, mergeZoneProbabilities, calculateFrequencies } from '../../utils/calculations';
import { PSPD_OPTIONS } from '../../constants';

interface FrequencyConfigStepProps {
    data: AnalysisData;
    onUpdate: (newData: Partial<AnalysisData>) => void;
}

const formatValue = (value: number) => formatSmartNumber(value, { useScientificBelow: 0.001, scientificPrecision: 2, maxDecimals: 3 });

// Exibe números como "9,98 × 10⁻⁷" com precisão ajustável para seção Detalhe
const ScientificNotation = ({ value, precision = 2 }: { value: number; precision?: number }) => {
    if (value === 0 || !isFinite(value)) {
        return <span>0</span>;
    }
    const [mantissa, exponent] = value.toExponential(precision).split('e');
    return (
        <span className="font-mono tracking-tight whitespace-nowrap" dangerouslySetInnerHTML={{ __html: `${mantissa.replace('.', ',')} &times; 10<sup>${exponent}</sup>` }} />
    );
};


const BASE_FREQUENCY_FORMULAS: { [key: string]: { formula: string; vars: string[] } } = {
    FB: { formula: "nd × PB", vars: ["nd", "PB"] },
    // FC e FM serão determinados dinamicamente
    FV: { formula: "nl_electric × PEB_electric + nl_data × PEB_data", vars: ["nl_electric", "PEB_electric", "nl_data", "PEB_data"] },
    FW: { formula: "nl_electric × PW + nl_data × PWT", vars: ["nl_electric", "PW", "nl_data", "PWT"] },
    FZ: { formula: "ni_electric × PZ + ni_data × PZT", vars: ["ni_electric", "PZ", "ni_data", "PZT"] },
};

const CustomTooltip = ({ active, payload, label, data, formulas }: any) => {
    if (active && payload && payload.length) {
        const { calculations: c, probability_calculations: p, frequency_config: config } = data;
        const isTotal = label === 'F Total';
        
        let formulaString = "N/A";
        let valuesString = "N/A";
        let extraComboString: string | null = null;
        let detailNodes: React.ReactNode | null = null;

        if (isTotal) {
            const components = ['FC', 'FM', 'FV', 'FW', 'FZ'];
            if (config.has_equipment_in_ZPR0A) components.unshift('FB');
            formulaString = components.join(' + ');
            valuesString = components.map(key => formatValue(data.frequency_results[key] || 0)).join(' + ');
            // Detalhe: soma dos componentes em notação científica
            detailNodes = (
                <span className="font-mono break-normal whitespace-normal leading-tight">
                    {components.map((key, idx) => (
                        <span key={key} className="inline-flex items-baseline">
                            <ScientificNotation value={data.frequency_results[key] || 0} precision={2} />
                            {idx < components.length - 1 ? <span className="mx-0.5">+</span> : null}
                        </span>
                    ))}
                </span>
            );
        } else {
            const formulaInfo = formulas[label];
            if (formulaInfo) {
                formulaString = formulaInfo.formula;
                const valueMap = { ...c, ...p };
                // Use a more robust regex with word boundaries
                if (formulaInfo.vars.length > 0) {
                    const regex = new RegExp(`\\b(${formulaInfo.vars.join('|')})\\b`, 'g');
                    valuesString = formulaString.replace(regex, (match) => formatValue((valueMap as any)[match] || 0));
                } else {
                    valuesString = formulaString;
                }

                // Exibir explicitamente a combinação quando FC/FM
                if (label === 'FC') {
                    const PC = (valueMap as any).PC || 0;
                    const PCT = (valueMap as any).PCT || 0;
                    const PC_total = 1 - ((1 - PC) * (1 - PCT));
                    extraComboString = `PC_total = 1 − (1 − ${formatValue(PC)}) × (1 − ${formatValue(PCT)}) = ${formatValue(PC_total)}`;
                    const nd = (valueMap as any).nd || 0;
                    // Detalhe: nd × PC_total ou nd × PC/PCT conforme fórmula dinâmica
                    if (formulaInfo.vars.includes('PC') && formulaInfo.vars.includes('PCT')) {
                        detailNodes = (
                            <span className="font-mono break-normal whitespace-normal leading-tight">
                                <span className="inline-flex items-baseline"><ScientificNotation value={nd} precision={2} /></span>
                                <span className="mx-0.5">×</span>
                                <span className="inline-flex items-baseline"><ScientificNotation value={PC_total} precision={2} /></span>
                                <span className="block mt-1 text-xs leading-tight">
                                    PC_total = 1 − (1 − <ScientificNotation value={PC} precision={2} />) × (1 − <ScientificNotation value={PCT} precision={2} />) = <ScientificNotation value={PC_total} precision={2} />
                                </span>
                            </span>
                        );
                    } else if (formulaInfo.vars.includes('PC')) {
                        detailNodes = (
                            <span className="font-mono break-normal whitespace-normal leading-tight">
                                <span className="inline-flex items-baseline"><ScientificNotation value={nd} precision={2} /></span>
                                <span className="mx-0.5">×</span>
                                <span className="inline-flex items-baseline"><ScientificNotation value={PC} precision={2} /></span>
                            </span>
                        );
                    } else if (formulaInfo.vars.includes('PCT')) {
                        detailNodes = (
                            <span className="font-mono break-normal whitespace-normal leading-tight">
                                <span className="inline-flex items-baseline"><ScientificNotation value={nd} precision={2} /></span>
                                <span className="mx-0.5">×</span>
                                <span className="inline-flex items-baseline"><ScientificNotation value={PCT} precision={2} /></span>
                            </span>
                        );
                    }
                } else if (label === 'FM') {
                    const PM = (valueMap as any).PM || 0;
                    const PMT = (valueMap as any).PMT || 0;
                    const PM_total = 1 - ((1 - PM) * (1 - PMT));
                    extraComboString = `PM_total = 1 − (1 − ${formatValue(PM)}) × (1 − ${formatValue(PMT)}) = ${formatValue(PM_total)}`;
                    const nm = (valueMap as any).nm || 0;
                    if (formulaInfo.vars.includes('PM') && formulaInfo.vars.includes('PMT')) {
                        detailNodes = (
                            <span className="font-mono break-normal whitespace-normal leading-tight">
                                <span className="inline-flex items-baseline"><ScientificNotation value={nm} precision={2} /></span>
                                <span className="mx-0.5">×</span>
                                <span className="inline-flex items-baseline"><ScientificNotation value={PM_total} precision={2} /></span>
                                <span className="block mt-1 text-xs leading-tight">
                                    PM_total = 1 − (1 − <ScientificNotation value={PM} precision={2} />) × (1 − <ScientificNotation value={PMT} precision={2} />) = <ScientificNotation value={PM_total} precision={2} />
                                </span>
                            </span>
                        );
                    } else if (formulaInfo.vars.includes('PM')) {
                        detailNodes = (
                            <span className="font-mono break-normal whitespace-normal leading-tight">
                                <span className="inline-flex items-baseline"><ScientificNotation value={nm} precision={2} /></span>
                                <span className="mx-0.5">×</span>
                                <span className="inline-flex items-baseline"><ScientificNotation value={PM} precision={2} /></span>
                            </span>
                        );
                    } else if (formulaInfo.vars.includes('PMT')) {
                        detailNodes = (
                            <span className="font-mono break-normal whitespace-normal leading-tight">
                                <span className="inline-flex items-baseline"><ScientificNotation value={nm} precision={2} /></span>
                                <span className="mx-0.5">×</span>
                                <span className="inline-flex items-baseline"><ScientificNotation value={PMT} precision={2} /></span>
                            </span>
                        );
                    }
                } else if (label === 'FB') {
                    const nd = (valueMap as any).nd || 0;
                    const PB = (valueMap as any).PB || 0;
                    detailNodes = (
                        <span className="font-mono break-normal whitespace-normal leading-tight">
                            <span className="inline-flex items-baseline"><ScientificNotation value={nd} precision={2} /></span>
                            <span className="mx-0.5">×</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={PB} precision={2} /></span>
                        </span>
                    );
                } else if (label === 'FV') {
                    const nl_electric = (valueMap as any).nl_electric || 0;
                    const PEB_electric = (valueMap as any).PEB_electric || 0;
                    const nl_data = (valueMap as any).nl_data || 0;
                    const PEB_data = (valueMap as any).PEB_data || 0;
                    detailNodes = (
                        <span className="font-mono break-normal whitespace-normal leading-tight">
                            <span className="inline-flex items-baseline"><ScientificNotation value={nl_electric} precision={2} /></span>
                            <span className="mx-0.5">×</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={PEB_electric} precision={2} /></span>
                            <span className="mx-0.5">+</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={nl_data} precision={2} /></span>
                            <span className="mx-0.5">×</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={PEB_data} precision={2} /></span>
                        </span>
                    );
                } else if (label === 'FW') {
                    const nl_electric = (valueMap as any).nl_electric || 0;
                    const PW = (valueMap as any).PW || 0;
                    const nl_data = (valueMap as any).nl_data || 0;
                    const PWT = (valueMap as any).PWT || 0;
                    detailNodes = (
                        <span className="font-mono break-normal whitespace-normal leading-tight">
                            <span className="inline-flex items-baseline"><ScientificNotation value={nl_electric} precision={2} /></span>
                            <span className="mx-0.5">×</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={PW} precision={2} /></span>
                            <span className="mx-0.5">+</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={nl_data} precision={2} /></span>
                            <span className="mx-0.5">×</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={PWT} precision={2} /></span>
                        </span>
                    );
                } else if (label === 'FZ') {
                    const ni_electric = (valueMap as any).ni_electric || 0;
                    const PZ = (valueMap as any).PZ || 0;
                    const ni_data = (valueMap as any).ni_data || 0;
                    const PZT = (valueMap as any).PZT || 0;
                    detailNodes = (
                        <span className="font-mono break-normal whitespace-normal leading-tight">
                            <span className="inline-flex items-baseline"><ScientificNotation value={ni_electric} precision={2} /></span>
                            <span className="mx-0.5">×</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={PZ} precision={2} /></span>
                            <span className="mx-0.5">+</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={ni_data} precision={2} /></span>
                            <span className="mx-0.5">×</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={PZT} precision={2} /></span>
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
                <p className="text-blue-400 font-mono">Valor: <ScientificNotation value={Number(payload[0].value)} precision={2} /></p>
                <>
                    <p className="text-slate-300 mt-2 font-semibold">Fórmula:</p>
                    <p className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs sm:text-sm leading-tight">{formulaString}</p>
                    <p className="text-slate-300 mt-2 font-semibold">Valores:</p>
                    <p className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs sm:text-sm break-normal whitespace-normal leading-tight">{valuesString}</p>
                    {detailNodes && (
                        <>
                            <p className="text-slate-300 mt-2 font-semibold">Detalhe:</p>
                            <div className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs sm:text-sm break-normal whitespace-normal leading-tight">{detailNodes}</div>
                        </>
                    )}
                    {extraComboString && (
                        <>
                            <p className="text-slate-300 mt-2 font-semibold">Combinação:</p>
                            <p className="text-cyan-200 font-mono bg-slate-900/50 px-2 py-1 rounded text-xs sm:text-sm break-normal whitespace-normal leading-tight">{extraComboString}</p>
                        </>
                    )}
                </>
            </div>
        );
    }
    return null;
};

// A reusable Select component for the simulator card
const SimulatorSelect = ({ label, value, options, onUpdate, isOpen, onOpenChange }: { label: string, value: number, options: {value: number, label: string}[], onUpdate: (val: number) => void, isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    const wrapperClassName = isOpen ? 'relative z-20 mt-2' : 'relative mt-2';
    return (
        <div className="space-y-2">
            <Label className="text-base font-semibold text-slate-200">{label}</Label>
            <Select
                value={String(value)}
                onValueChange={(v) => onUpdate(parseFloat(v))}
                options={options}
                onOpenChange={onOpenChange}
                wrapperClassName={wrapperClassName}
            >
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                    {options.map(opt => <SelectItem key={opt.value} value={String(opt.value)} label={opt.label} />)}
                </SelectContent>
            </Select>
        </div>
    );
};


export function FrequencyConfigStep({ data, onUpdate }: FrequencyConfigStepProps) {
    const isMobile = useIsMobile();
    const [openSelect, setOpenSelect] = React.useState<string | null>(null);
    const config = data.frequency_config;
    const calculations = data.frequency_results;
    const { has_electric_line, has_data_line, analyze_data_line_probabilities } = data;

    const dynamicFrequencyFormulas = React.useMemo(() => {
        const formulas: { [key: string]: { formula: string; vars: string[] } } = { ...BASE_FREQUENCY_FORMULAS };

        const hasInternalElectric = has_electric_line;
        // Sempre considerar a presença de linha de dados para a combinação de FC/FM,
        // mesmo quando a análise detalhada de probabilidades de dados estiver desativada.
        const hasInternalData = has_data_line;

        // Dynamic FC formula
        if (hasInternalElectric && hasInternalData) {
            formulas.FC = { formula: "nd × (1 - (1-PC)×(1-PCT))", vars: ["nd", "PC", "PCT"] };
        } else if (hasInternalElectric) {
            formulas.FC = { formula: "nd × PC", vars: ["nd", "PC"] };
        } else if (hasInternalData) {
            formulas.FC = { formula: "nd × PCT", vars: ["nd", "PCT"] };
        } else {
            formulas.FC = { formula: "0", vars: [] };
        }

        // Dynamic FM formula
        if (hasInternalElectric && hasInternalData) {
            formulas.FM = { formula: "nm × (1 - (1-PM)×(1-PMT))", vars: ["nm", "PM", "PMT"] };
        } else if (hasInternalElectric) {
            formulas.FM = { formula: "nm × PM", vars: ["nm", "PM"] };
        } else if (hasInternalData) {
            formulas.FM = { formula: "nm × PMT", vars: ["nm", "PMT"] };
        } else {
            formulas.FM = { formula: "0", vars: [] };
        }

        return formulas;
    }, [has_electric_line, has_data_line]);


    const handleConfigChange = (field: keyof typeof config, value: boolean) => {
        onUpdate({
            frequency_config: { ...config, [field]: value }
        });
    };
    
    const handleSimulatorUpdate = (
        field: keyof ProbabilityData | keyof LossData,
        value: number
    ) => {
        if (field in data.probability_data) {
            const updatedProbData: Partial<ProbabilityData> = { [field]: value };
            if (field === 'PSPD_electric') {
                updatedProbData.PSPD_data = value;
            }
            if (field === 'PEB_electric') {
                updatedProbData.PEB_data = value;
            }
            // Atualiza dados globais
            const nextUpdate: Partial<AnalysisData> = { probability_data: { ...data.probability_data, ...updatedProbData } };

            // Propaga alterações relevantes para TODAS as zonas
            if (field === 'PSPD_electric' || field === 'PEB_electric') {
                const newZones = (data.zones || []).map(zone => {
                    const overrides = { ...(zone.probability_overrides || {}) };
                    const probData = { ...(zone.probability_data || data.probability_data) } as any;

                    // Atualiza o valor principal nos overrides (garante precedência) e nos dados da zona
                    overrides[field as keyof typeof overrides] = Number(value);
                    probData[field] = Number(value);
                    // Sincroniza com variantes de dados
                    if (field === 'PSPD_electric') { overrides.PSPD_data = Number(value); probData.PSPD_data = Number(value); }
                    if (field === 'PEB_electric') { overrides.PEB_data = Number(value); probData.PEB_data = Number(value); }

                    // Remove chaves derivadas para forçar recálculo com novos valores
                    if (field === 'PSPD_electric') {
                        delete overrides.PC; delete overrides.PM; delete overrides.PW; delete overrides.PZ;
                        delete overrides.PCT; delete overrides.PMT; delete overrides.PWT; delete overrides.PZT;
                    }
                    if (field === 'PEB_electric') {
                        delete overrides.PV; delete overrides.PVT; delete overrides.PU; delete overrides.PUT;
                    }

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


    if (!calculations) return <p>Calculando...</p>;
    
    const { F = 0 } = calculations;
    const { is_critical_system } = data.frequency_config;
    const toleranceLimit = is_critical_system ? 0.1 : 1;
    const isAcceptable = F <= toleranceLimit;
    
    const chartCalculations = { ...calculations };
    
    const componentData = Object.entries(chartCalculations)
        .filter(([key]) => key !== 'F')
        .map(([name, value]) => ({ name, value }));
        
    const chartData = [...componentData, { name: 'F Total', value: F }];

    const yMaxDomain = Math.max(...chartData.map(d => d.value), toleranceLimit) * 1.2;
    
    const getFFormulaString = () => {
        const components = ['FC', 'FM', 'FV', 'FW', 'FZ'];
        if (config.has_equipment_in_ZPR0A) components.unshift('FB');
        return components.join(' + ');
    }

    // Navegação entre Global e Zonas
    const [activeViewId, setActiveViewId] = React.useState<string>(data.last_active_zone_id || 'GLOBAL');
    React.useEffect(() => {
        // Se houver última zona ativa persistida, usar como visão inicial
        const desired = data.last_active_zone_id || 'GLOBAL';
        if (desired !== activeViewId) setActiveViewId(desired);
    }, [data.last_active_zone_id]);
    // Sempre que a visão ativa mudar para uma zona, persistir essa zona
    React.useEffect(() => {
        if (activeViewId && activeViewId !== 'GLOBAL') {
            try { onUpdate({ last_active_zone_id: activeViewId } as any); } catch { /* noop */ }
        }
    }, [activeViewId]);
    const zoneIds = (data.zones || []).map((z, idx) => z.id || z.name || String(idx));
    const multipleZones = zoneIds.length > 1;
    const viewOrder = ['GLOBAL', ...zoneIds];
    const currentViewIndex = Math.max(0, viewOrder.indexOf(activeViewId));
    const goPrevView = () => {
        const nextView = viewOrder[(currentViewIndex - 1 + viewOrder.length) % viewOrder.length];
        setActiveViewId(nextView);
        if (nextView !== 'GLOBAL') try { onUpdate({ last_active_zone_id: nextView } as any); } catch { /* noop */ }
    };
    const goNextView = () => {
        const nextView = viewOrder[(currentViewIndex + 1) % viewOrder.length];
        setActiveViewId(nextView);
        if (nextView !== 'GLOBAL') try { onUpdate({ last_active_zone_id: nextView } as any); } catch { /* noop */ }
    };

    // Em caso de zona única, sempre manter visão Global
    React.useEffect(() => {
        if (!multipleZones && activeViewId !== 'GLOBAL') {
            setActiveViewId('GLOBAL');
        }
    }, [multipleZones]);
    const makeZoneHeading = (zoneName: string | undefined, i: number) => {
        const base = `Zona ${i + 1}`;
        const name = (zoneName || '').trim();
        if (!name) return base;
        const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
        if (norm(name) === norm(base)) return base;
        return `${base} (${name})`;
    };
    const activeZoneIndex = activeViewId === 'GLOBAL' ? -1 : zoneIds.indexOf(activeViewId);
    const activeZone = activeZoneIndex >= 0 ? (data.zones || [])[activeZoneIndex] : undefined;
    const activeHeading = activeViewId === 'GLOBAL' ? 'Global' : makeZoneHeading(activeZone?.name, activeZoneIndex);
    let zoneFr: any = null;
    let zoneChart: { name: string; value: number }[] = [];
    let zoneMaxDomain = 0;
    let zoneAcceptable = false;
    if (activeZone) {
        const zoneBaseCalcs = calculateProbabilities(
            activeZone.probability_data || data.probability_data,
            data.analyze_data_line_probabilities,
            data.has_data_line
        );
        const pZone = mergeZoneProbabilities(zoneBaseCalcs, activeZone);
        zoneFr = calculateFrequencies(
            data.calculations,
            pZone,
            data.frequency_config,
            data.has_electric_line,
            data.has_data_line
        );
        zoneAcceptable = (zoneFr.F || 0) <= toleranceLimit;
        const zoneComponents = Object.entries(zoneFr)
            .filter(([key]) => key !== 'F')
            .map(([name, value]) => ({ name, value }));
        zoneChart = [...zoneComponents, { name: 'F Total', value: zoneFr.F || 0 }];
        zoneMaxDomain = Math.max(...zoneChart.map(d => d.value), toleranceLimit) * 1.2;
    }


    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                
                {activeViewId === 'GLOBAL' ? (
                    <>
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between text-base">
                                    <span className="flex items-center gap-2">
                                        <SlidersHorizontal className="w-5 h-5 text-blue-400" />
                                        {`Ajustar Freq. Dano — ${activeHeading}`}
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
                            <CardContent className="space-y-4 pt-4">
                                <SimulatorSelect
                                    label="PEB - Prot. Surto Cond. D1/D2"
                                    value={data.probability_data.PEB_electric}
                                    options={PSPD_OPTIONS}
                                    onUpdate={(val) => handleSimulatorUpdate('PEB_electric', val)}
                                    isOpen={openSelect === 'peb'}
                                    onOpenChange={(open) => setOpenSelect(open ? 'peb' : null)}
                                />
                                <SimulatorSelect
                                    label="PSPD - Surto Ind. - D3"
                                    value={data.probability_data.PSPD_electric}
                                    options={PSPD_OPTIONS}
                                    onUpdate={(val) => handleSimulatorUpdate('PSPD_electric', val)}
                                    isOpen={openSelect === 'pspd'}
                                    onOpenChange={(open) => setOpenSelect(open ? 'pspd' : null)}
                                />
                            </CardContent>
                        </Card>

                        <Card className={`border-2 ${isAcceptable ? 'border-green-500/80' : 'border-red-500/80'} h-full`}>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between text-base">
                                    <FormulaTooltip formulas={{ F: getFFormulaString() }} values={calculations}>
                                        <span className="flex items-center gap-2">{`Frequência Total (F) — ${activeHeading}`}</span>
                                    </FormulaTooltip>
                                    {isAcceptable ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertTriangle className="w-5 h-5 text-red-500" />}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center p-6">
                                <div className={`text-4xl font-bold mb-2 ${isAcceptable ? 'text-green-400' : 'text-red-400'}`}>{formatSmartNumber(F, { maxDecimals: 3, useScientificBelow: 0.001 })}</div>
                                <div className={`py-3 px-4 rounded-md text-base font-semibold ${isAcceptable ? 'bg-green-950/70 text-green-200' : 'bg-red-950/70 text-red-200'}`}>
                                    {isAcceptable ? "Frequência Aceitável." : "Frequência Não Aceitável."}
                                </div>
                                {/* Controles movidos para a base do card de F (Global) */}
                                <div className="mt-5">
                                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleConfigChange('is_critical_system', true)}
                                            className={`p-2.5 sm:p-3 rounded-lg border text-center transition-colors max-sm:text-[11px] sm:text-sm min-w-0 ${
                                                config.is_critical_system 
                                                ? 'bg-blue-600 border-blue-500 text-white font-semibold' 
                                                : 'bg-slate-800/50 border-slate-600 hover:bg-slate-700/60 text-slate-300'
                                            }`}
                                        >
                                            <span className="truncate whitespace-nowrap leading-tight">Sist. Crít. ≤ 0,1</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleConfigChange('is_critical_system', false)}
                                            className={`p-2.5 sm:p-3 rounded-lg border text-center transition-colors max-sm:text-[11px] sm:text-sm min-w-0 ${
                                                !config.is_critical_system 
                                                ? 'bg-blue-600 border-blue-500 text-white font-semibold' 
                                                : 'bg-slate-800/50 border-slate-600 hover:bg-slate-700/60 text-slate-300'
                                            }`}
                                        >
                                            <span className="truncate whitespace-nowrap leading-tight">Sist. N Crít. ≤ 1</span>
                                        </button>
                                    </div>
                                    <div className="mt-4 text-left">
                                        <div className="flex items-center space-x-2 mt-2">
                                            <Checkbox id="equipment_outside" checked={config.has_equipment_in_ZPR0A} onCheckedChange={(c) => handleConfigChange('has_equipment_in_ZPR0A', !!c)} />
                                            <Label htmlFor="equipment_outside" className="cursor-pointer">Exposição de Equip. ZPR0A</Label>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <>
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between text-base">
                                    <span className="flex items-center gap-2">
                                        <SlidersHorizontal className="w-5 h-5 text-blue-400" />
                                        {`Ajustar Freq. Dano — ${activeHeading}`}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <button aria-label="Zona anterior" className="p-1 rounded hover:bg-slate-700" onClick={goPrevView}>
                                            <ChevronLeft className="w-5 h-5 text-slate-300" />
                                        </button>
                                        <button aria-label="Próxima zona" className="p-1 rounded hover:bg-slate-700" onClick={goNextView}>
                                            <ChevronRight className="w-5 h-5 text-slate-300" />
                                        </button>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {activeZone && (
                                    <>
                                        <SimulatorSelect
                                            label="PEB - Prot. Surto Cond. D1/D2"
                                            value={(activeZone.probability_data?.PEB_electric) ?? data.probability_data.PEB_electric}
                                            options={PSPD_OPTIONS}
                                            onUpdate={(val) => {
                                                const newZones = (data.zones || []).map(z => (
                                                    (z.id || z.name) === (activeZone.id || activeZone.name)
                                                    ? { ...z, probability_data: { ...(z.probability_data || data.probability_data), PEB_electric: val, PEB_data: val } }
                                                    : z
                                                ));
                                                onUpdate({ zones: newZones });
                                            }}
                                            isOpen={openSelect === `peb-${activeZone.id || activeZoneIndex}`}
                                            onOpenChange={(open) => setOpenSelect(open ? `peb-${activeZone.id || activeZoneIndex}` : null)}
                                        />
                                        <SimulatorSelect
                                            label="PSPD - Surto Ind. - D3"
                                            value={(activeZone.probability_data?.PSPD_electric) ?? data.probability_data.PSPD_electric}
                                            options={PSPD_OPTIONS}
                                            onUpdate={(val) => {
                                                const newZones = (data.zones || []).map(z => (
                                                    (z.id || z.name) === (activeZone.id || activeZone.name)
                                                    ? { ...z, probability_data: { ...(z.probability_data || data.probability_data), PSPD_electric: val, PSPD_data: val } }
                                                    : z
                                                ));
                                                onUpdate({ zones: newZones });
                                            }}
                                            isOpen={openSelect === `pspd-${activeZone.id || activeZoneIndex}`}
                                            onOpenChange={(open) => setOpenSelect(open ? `pspd-${activeZone.id || activeZoneIndex}` : null)}
                                        />
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {multipleZones && (
                        <Card className={`border-2 ${zoneAcceptable ? 'border-green-500/80' : 'border-red-500/80'} h-full`}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    {`Frequência Total (F) — ${activeHeading}`}
                                    {zoneAcceptable ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertTriangle className="w-5 h-5 text-red-500" />}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center p-6">
                                <div className={`text-4xl font-bold mb-2 ${zoneAcceptable ? 'text-green-400' : 'text-red-400'}`}>{formatSmartNumber(zoneFr?.F || 0, { maxDecimals: 3, useScientificBelow: 0.001 })}</div>
                                <div className={`py-3 px-4 rounded-md text-base font-semibold ${zoneAcceptable ? 'bg-green-950/70 text-green-200' : 'bg-red-950/70 text-red-200'}`}>{zoneAcceptable ? 'Frequência Aceitável.' : 'Frequência Não Aceitável.'}</div>
                                {/* Controles movidos para a parte de baixo deste card */}
                                <div className="mt-4 text-left">
                                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleConfigChange('is_critical_system', true)}
                                            className={`p-2.5 sm:p-3 rounded-lg border text-center transition-colors max-sm:text-[11px] sm:text-sm min-w-0 ${
                                                config.is_critical_system 
                                                ? 'bg-blue-600 border-blue-500 text-white font-semibold' 
                                                : 'bg-slate-800/50 border-slate-600 hover:bg-slate-700/60 text-slate-300'
                                            }`}
                                        >
                                            <span className="truncate whitespace-nowrap leading-tight">Sist. Crít. ≤ 0,1</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleConfigChange('is_critical_system', false)}
                                            className={`p-2.5 sm:p-3 rounded-lg border text-center transition-colors max-sm:text-[11px] sm:text-sm min-w-0 ${
                                                !config.is_critical_system 
                                                ? 'bg-blue-600 border-blue-500 text-white font-semibold' 
                                                : 'bg-slate-800/50 border-slate-600 hover:bg-slate-700/60 text-slate-300'
                                            }`}
                                        >
                                            <span className="truncate whitespace-nowrap leading-tight">Sist. N Crít. ≤ 1</span>
                                        </button>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <Checkbox id="equipment_outside_zone_bottom" checked={config.has_equipment_in_ZPR0A} onCheckedChange={(c) => handleConfigChange('has_equipment_in_ZPR0A', !!c)} />
                                        <Label htmlFor="equipment_outside_zone_bottom" className="cursor-pointer">Exposição de Equip. ZPR0A</Label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        )}
                    </>
                )}
            </div>

            <Card>
                <CardHeader><CardTitle>{`Componentes de Frequência — ${activeHeading}`}</CardTitle></CardHeader>
                <CardContent className="h-[16.25rem]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={activeViewId === 'GLOBAL' ? chartData : zoneChart}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                            <YAxis tick={{ fill: '#94a3b8' }} domain={[0, activeViewId === 'GLOBAL' ? yMaxDomain : zoneMaxDomain]} />
                            {!isMobile && (
                                <Tooltip content={<CustomTooltip data={data} formulas={dynamicFrequencyFormulas} />} cursor={{ fill: 'rgba(30, 41, 59, 0.7)' }} />
                            )}
                            <ReferenceLine y={toleranceLimit} strokeWidth={2} stroke="#ef4444" strokeDasharray="3 3" />
                            <Bar dataKey="value">
                                {(activeViewId === 'GLOBAL' ? chartData : zoneChart).map((entry) => {
                                    const color = entry.name === 'F Total'
                                        ? ((activeViewId === 'GLOBAL' ? isAcceptable : zoneAcceptable) ? '#22c55e' : '#ef4444')
                                        : '#818cf8';
                                    return <Cell key={`cell-${entry.name}`} fill={color} />;
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Lista por zonas removida: navegação por setas controla a visão */}
            
        </div>
    );
}
