import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Alert, AlertDescription, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Label, FormulaTooltip, Checkbox } from '../ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";
import { AlertTriangle, CheckCircle, SlidersHorizontal } from "lucide-react";
import { AnalysisData, ProbabilityData, LossData } from '../../types';
import { RISK_COMPONENTS_DEFS, TOLERABLE_RISKS, PB_OPTIONS, PSPD_OPTIONS, RP_OPTIONS } from '../../constants';

// Component to format numbers in scientific notation like "9.98 × 10⁻⁷"
const ScientificNotation = ({ value, precision = 2 }: { value: number; precision?: number }) => {
    if (value === 0 || !isFinite(value)) {
        return <span>0</span>;
    }
    const [mantissa, exponent] = value.toExponential(precision).split('e');
    return (
        <span className="font-mono tracking-tight" dangerouslySetInnerHTML={{ __html: `${mantissa.replace('.', ',')} &times; 10<sup>${exponent}</sup>` }} />
    );
};

const formatValue = (value: number) => {
    if (value === 0) return '0';
    return value.toExponential(2).replace('.', ',');
};

const RISK_FORMULAS: { [key: string]: { formula: string; vars: string[] } } = {
    RA: { formula: "Nd × PA × LA", vars: ["nd", "PA", "LA"] },
    RB: { formula: "Nd × PB × LB", vars: ["nd", "PB", "LB"] },
    RC: { formula: "Nd × PC × LC", vars: ["nd", "PC", "LC"] },
    RM: { formula: "Nm × PM × LM", vars: ["nm", "PM", "LM"] },
    RU: { formula: "Nl × PU × LU", vars: ["nl_total", "PU_total", "LU"] },
    RV: { formula: "Nl × PV × LV", vars: ["nl_total", "PV_total", "LV"] },
    RW: { formula: "Nl × PW × LW", vars: ["nl_total", "PW_total", "LW"] },
    RZ: { formula: "Ni × PZ × LZ", vars: ["ni_total", "PZ_total", "LZ"] },
};

const CustomTooltip = ({ active, payload, label, data }: any) => {
    if (active && payload && payload.length) {
        const { calculations: c, probability_calculations: p, loss_calculations: l, selected_risk_components: selected } = data;
        const componentDef = RISK_COMPONENTS_DEFS[label];
        const isTotalRisk = ['R1', 'R3', 'R4'].includes(label);

        let formulaString = "N/A";
        let valuesString = "N/A";
        
        if (isTotalRisk) {
            const components = ALL_RISK_COMPONENTS.filter(key => selected[key]);
            formulaString = components.join(' + ');
            valuesString = components.map(key => formatValue(data.risk_results[key] || 0)).join(' + ');
        } else {
            const formulaInfo = RISK_FORMULAS[label];
            if (formulaInfo) {
                formulaString = formulaInfo.formula;
                const nl_total = (c.nl_electric || 0) + (c.nl_data || 0);
                const ni_total = (c.ni_electric || 0) + (c.ni_data || 0);
                const PU_total = (p.PU || 0) + (p.PUT || 0);
                const PV_total = (p.PV || 0) + (p.PVT || 0);
                const PW_total = (p.PW || 0) + (p.PWT || 0);
                const PZ_total = (p.PZ || 0) + (p.PZT || 0);

                const valueMap: { [key: string]: number } = { ...c, ...p, ...l, nl_total, ni_total, PU_total, PV_total, PW_total, PZ_total };
                valuesString = formulaInfo.vars.map(v => formatValue(valueMap[v] || 0)).join(' × ');
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
                {componentDef && <p className="text-slate-400 text-xs">{componentDef.description}</p>}
                <p className="text-blue-400 font-mono">Valor: {formatValue(Number(payload[0].value))}</p>
                 <>
                    <p className="text-slate-300 mt-2 font-semibold">Fórmula:</p>
                    <p className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs">{formulaString}</p>
                    <p className="text-slate-300 mt-2 font-semibold">Valores:</p>
                    <p className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs break-all">{valuesString}</p>
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

    const handleSimulatorUpdate = (
        field: keyof ProbabilityData | keyof LossData,
        value: number
    ) => {
        if (field in data.probability_data) {
             const updatedProbData: Partial<ProbabilityData> = { [field]: value };
            if (field === 'PSPD_electric') {
                updatedProbData.PSPD_data = value;
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

    const selectedRisks = (Object.keys(risks_to_analyze) as Array<keyof typeof risks_to_analyze>)
        .filter(key => risks_to_analyze[key]);
    
    const displayedToleranceValue = TOLERABLE_RISKS[selectedRisks[0] || 'R1'];

    let chartData: { name: string; value: number }[] = ALL_RISK_COMPONENTS.map(key => ({
        name: key,
        value: risk_results[key] || 1e-12,
    }));
    selectedRisks.forEach(riskKey => {
         chartData.push({ name: riskKey, value: risk_results[riskKey] || 1e-12 });
    });
    
    const riskFormulas: { [key: string]: string } = {
        R1: ALL_RISK_COMPONENTS.filter(c => selected_risk_components[c]).join(' + '),
        R3: "RB3 + RV3", // Simplified for display
        R4: ALL_RISK_COMPONENTS.filter(c => selected_risk_components[c]).map(c => c + '4').join(' + '),
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <SlidersHorizontal className="w-5 h-5 text-blue-400" />
                            Configuração da Estrutura
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <Label className="text-base font-semibold text-slate-200 mb-2 block">Tipo de Estrutura (Fator rs)</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleSimulatorUpdate('rs', 1)}
                                    className={`p-3 rounded-lg border text-center transition-colors text-sm flex flex-col items-center justify-center h-20 ${
                                        (data.zones[0]?.loss_data.rs || 1) === 1
                                        ? 'bg-blue-600 border-blue-500 text-white font-semibold' 
                                        : 'bg-slate-800/50 border-slate-600 hover:bg-slate-700/60 text-slate-300'
                                    }`}
                                >
                                    <span className="font-bold">Robusta</span>
                                    <span className="text-xs mt-1 opacity-80">Metálica ou Concreto</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSimulatorUpdate('rs', 2)}
                                    className={`p-3 rounded-lg border text-center transition-colors text-sm flex flex-col items-center justify-center h-20 ${
                                        (data.zones[0]?.loss_data.rs || 1) === 2
                                        ? 'bg-blue-600 border-blue-500 text-white font-semibold' 
                                        : 'bg-slate-800/50 border-slate-600 hover:bg-slate-700/60 text-slate-300'
                                    }`}
                                >
                                    <span className="font-bold">Simples</span>
                                    <span className="text-xs mt-1 opacity-80">Madeira ou Alvenaria</span>
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <SlidersHorizontal className="w-5 h-5 text-blue-400" />
                            Ajustar Proteções
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div>
                            <Label className="text-base font-semibold text-slate-200">Nível do SPDA (PB)</Label>
                            <Select
                                value={String(data.probability_data.PB)}
                                onValueChange={(val) => handleSimulatorUpdate('PB', parseFloat(val))}
                                options={PB_OPTIONS}
                                onOpenChange={(open) => setOpenSelect(open ? 'pb' : null)}
                                wrapperClassName={openSelect === 'pb' ? 'relative z-20 mt-2' : 'relative mt-2'}
                            >
                                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {PB_OPTIONS.map(opt => <SelectItem key={opt.value} value={String(opt.value)} label={opt.label} />)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="text-base font-semibold text-slate-200">Proteção vs. Incêndio (rp)</Label>
                            <Select
                                value={String(data.zones[0]?.loss_data.rp || 1)}
                                onValueChange={(val) => handleSimulatorUpdate('rp', parseFloat(val))}
                                options={RP_OPTIONS}
                                onOpenChange={(open) => setOpenSelect(open ? 'rp' : null)}
                                wrapperClassName={openSelect === 'rp' ? 'relative z-20 mt-2' : 'relative mt-2'}
                            >
                                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {RP_OPTIONS.map(opt => <SelectItem key={opt.value} value={String(opt.value)} label={opt.label} />)}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
                
                <div className="space-y-6">
                    {selectedRisks.length > 0 ? (
                        selectedRisks.map(riskKey => {
                            const riskTolerance = TOLERABLE_RISKS[riskKey];
                            const currentTotalRiskValue = risk_results[riskKey] || 0;
                            const isAcceptable = currentTotalRiskValue <= riskTolerance;
                            const formula = riskFormulas[riskKey];

                            return (
                                <Card key={riskKey} className={`border-2 ${isAcceptable ? 'border-green-500/80' : 'border-red-500/80'} h-full`}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between text-base">
                                            <span className="flex items-center gap-2">
                                                RT ({riskKey})
                                                {formula && <FormulaTooltip formulas={{ [riskKey]: formula }} values={risk_results} />}
                                            </span>
                                            {isAcceptable ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertTriangle className="w-5 h-5 text-red-500" />}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-center p-6">
                                        <div className={`text-4xl font-bold mb-2 whitespace-nowrap ${isAcceptable ? 'text-green-400' : 'text-red-400'}`}>
                                            <ScientificNotation value={currentTotalRiskValue} />
                                        </div>
                                        <div className="text-sm text-slate-400 mb-3">
                                            Limite: <ScientificNotation value={riskTolerance} precision={0} />
                                        </div>
                                        <div className={`py-3 px-4 rounded-md text-base font-semibold ${isAcceptable ? 'bg-green-950/70 text-green-200' : 'bg-red-950/70 text-red-200'}`}>
                                            {isAcceptable ? 'Risco Aceitável' : 'Risco Não Aceitável'}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                         <Alert className="border-yellow-500/50 bg-yellow-900/40 text-yellow-200 h-full flex flex-col justify-center">
                            <AlertTriangle className="h-4 w-4 text-yellow-300" />
                            <AlertDescription>Nenhum tipo de risco foi selecionado para análise. Volte para a etapa "Seleção de Componentes de Risco" para escolher um ou mais tipos.</AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
            
            <Card>
                <CardHeader><CardTitle>Componentes de Risco</CardTitle></CardHeader>
                <CardContent className="h-[16.25rem]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis type="category" dataKey="name" tick={{ fill: '#94a3b8' }} />
                            <YAxis type="number" scale="log" domain={[1e-9, 'auto']} allowDataOverflow tickFormatter={(tick) => tick.toExponential(0)} tick={{ fill: '#94a3b8' }} />
                            <Tooltip content={<CustomTooltip data={data} />} cursor={{ fill: 'rgba(30, 41, 59, 0.7)' }} />
                            <ReferenceLine y={displayedToleranceValue} strokeWidth={2} stroke="#F59E0B" strokeDasharray="4 4" />
                            <Bar dataKey="value">
                                {chartData.map((entry, index) => {
                                    const isTotalRiskBar = selectedRisks.includes(entry.name as any);
                                    const componentKey = entry.name as keyof typeof selected_risk_components;
                                    const isComponentSelected = selected_risk_components[componentKey];

                                    let color: string;
                                    let strokeColor = 'rgba(255, 255, 255, 0.2)';
                                    let strokeWidth = 1;
                                    
                                    if (isTotalRiskBar) {
                                        const riskKey = entry.name as keyof typeof TOLERABLE_RISKS;
                                        const isAcceptable = (risk_results[riskKey] || 0) <= TOLERABLE_RISKS[riskKey];
                                        color = isAcceptable ? '#22c55e' : '#ef4444';
                                        strokeColor = '#facc15';
                                        strokeWidth = 1.5;
                                    } else if (isComponentSelected) {
                                        color = '#3B82F6';
                                    } else {
                                        color = '#64748b80';
                                    }
                                    
                                    return <Cell 
                                        key={`cell-${index}`} 
                                        fill={color} 
                                        stroke={strokeColor}
                                        strokeWidth={strokeWidth}
                                    />;
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}