import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Checkbox, Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, FormulaTooltip } from '../ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";
import { AlertTriangle, CheckCircle, SlidersHorizontal } from 'lucide-react';
import { AnalysisData, ProbabilityData, LossData } from '../../types';
import { PB_OPTIONS, PSPD_OPTIONS, RP_OPTIONS } from '../../constants';

interface FrequencyConfigStepProps {
    data: AnalysisData;
    onUpdate: (newData: Partial<AnalysisData>) => void;
}

const formatValue = (value: number) => {
    if (value === 0) return '0';
    if (Math.abs(value) < 0.001) return value.toExponential(2).replace('.', ',');
    return value.toFixed(3).replace('.', ',');
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

        if (isTotal) {
            const components = ['FC', 'FM', 'FV', 'FW', 'FZ'];
            if (config.has_equipment_in_ZPR0A) components.unshift('FB');
            formulaString = components.join(' + ');
            valuesString = components.map(key => formatValue(data.frequency_results[key] || 0)).join(' + ');
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
            }
        }

        const tooltipStyle: React.CSSProperties = {
            transform: 'translate(10px, calc(-100% - 10px))',
            pointerEvents: 'none',
        };

        return (
            <div 
                style={tooltipStyle}
                className="p-3 bg-slate-800/90 border rounded-lg shadow-lg text-sm border-slate-600 backdrop-blur-sm w-64"
            >
                <p className="font-bold text-slate-100 text-base mb-1">{label}</p>
                <p className="text-blue-400 font-mono">Valor: {formatValue(Number(payload[0].value))}</p>
                <>
                    <p className="text-slate-300 mt-2 font-semibold">Fórmula:</p>
                    <p className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs">{formulaString.replace(/×/g, '*')}</p>
                    <p className="text-slate-300 mt-2 font-semibold">Valores:</p>
                    <p className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs break-all">{valuesString}</p>
                </>
            </div>
        );
    }
    return null;
};

// A reusable Select component for the simulator card
const SimulatorSelect = ({ label, value, options, onUpdate, isOpen, onOpenChange }: { label: string, value: number, options: {value: number, label: string}[], onUpdate: (val: number) => void, isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    const wrapperClassName = isOpen ? 'relative z-20' : 'relative';
    return (
        <div className="space-y-2">
            <Label>{label}</Label>
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
    const [openSelect, setOpenSelect] = React.useState<string | null>(null);
    const config = data.frequency_config;
    const calculations = data.frequency_results;
    const { has_electric_line, has_data_line, analyze_data_line_probabilities } = data;

    const dynamicFrequencyFormulas = React.useMemo(() => {
        const formulas: { [key: string]: { formula: string; vars: string[] } } = { ...BASE_FREQUENCY_FORMULAS };

        const hasInternalElectric = has_electric_line;
        const hasInternalData = has_data_line && analyze_data_line_probabilities;

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
    }, [has_electric_line, has_data_line, analyze_data_line_probabilities]);


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
            onUpdate({ probability_data: { ...data.probability_data, ...updatedProbData } });
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


    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                <Card className="h-full">
                    <CardHeader><CardTitle>Configuração de Freq.  (F)</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div>
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
                        </div>

                        <div>
                            <Label className="text-base font-semibold text-slate-200">Exposição de Equipamentos</Label>
                            <div className="flex items-center space-x-2 mt-2">
                                <Checkbox id="equipment_outside" checked={config.has_equipment_in_ZPR0A} onCheckedChange={(c) => handleConfigChange('has_equipment_in_ZPR0A', !!c)} />
                                <Label htmlFor="equipment_outside" className="cursor-pointer">Exposição de Equip. ZPR0A</Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                 <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <SlidersHorizontal className="w-5 h-5 text-blue-400" />
                            Ajustar Freq. Dano
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <SimulatorSelect
                            label="PEB - Prot. Surto Cond. D1/D2 - PU/PV"
                            value={data.probability_data.PEB_electric}
                            options={PSPD_OPTIONS} // PEB and PSPD share the same options
                            onUpdate={(val) => handleSimulatorUpdate('PEB_electric', val)}
                            isOpen={openSelect === 'peb'}
                            onOpenChange={(open) => setOpenSelect(open ? 'peb' : null)}
                        />
                        <SimulatorSelect
                            label="PSPD - Surto Ind. - D3 - PC/PM/PW/PZ"
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
                            <span className="flex items-center gap-2">
                                Frequência Total (F)
                                <FormulaTooltip formulas={{ F: getFFormulaString() }} values={calculations} />
                            </span>
                            {isAcceptable ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertTriangle className="w-5 h-5 text-red-500" />}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center p-6">
                        <div className={`text-4xl font-bold mb-2 ${isAcceptable ? 'text-green-400' : 'text-red-400'}`}>{F.toFixed(3)}</div>
                        <div className="text-sm text-slate-400 mb-3">Limite: {toleranceLimit} ({is_critical_system ? 'Crítico' : 'Não Crítico'})</div>
                        <div className={`py-3 px-4 rounded-md text-base font-semibold ${isAcceptable ? 'bg-green-950/70 text-green-200' : 'bg-red-950/70 text-red-200'}`}>
                             {isAcceptable ? "Frequência Aceitável." : "Frequência Não Aceitável."}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><CardTitle>Componentes de Frequência</CardTitle></CardHeader>
                <CardContent className="h-[16.25rem]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                            <YAxis tick={{ fill: '#94a3b8' }} domain={[0, yMaxDomain]} />
                            <Tooltip content={<CustomTooltip data={data} formulas={dynamicFrequencyFormulas} />} cursor={{ fill: 'rgba(30, 41, 59, 0.7)' }} />
                            <ReferenceLine y={toleranceLimit} stroke="red" strokeDasharray="3 3" />
                            <Bar dataKey="value">
                                {chartData.map((entry) => {
                                    const color = entry.name === 'F Total'
                                        ? (isAcceptable ? '#22c55e' : '#ef4444') // green-500 / red-500
                                        : '#818cf8';
                                    return <Cell key={`cell-${entry.name}`} fill={color} />;
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}