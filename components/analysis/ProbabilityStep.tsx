import React, { useCallback, memo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Label, TabButton, Alert, AlertDescription, Checkbox } from '../ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AnalysisData, ProbabilityData } from '../../types';
import { PB_OPTIONS, PSPD_OPTIONS, PTA_OPTIONS, COMBINED_CLD_CLI_OPTIONS, PTU_OPTIONS, KS3_OPTIONS, UW_OPTIONS } from '../../constants';
import { DecimalInput } from '../DecimalInput';
import { AlertTriangle } from 'lucide-react';
import { ShieldingSlider } from '../ShieldingSlider';
import { calculatePld } from '../../utils/calculations';
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
            {value.toFixed(2).replace('.', ',')}
        </div>
    </div>
);

const Ks4DisplayBox = ({ value }: { value: number }) => (
    <div className="space-y-2">
        <Label>Ks4 Calculado</Label>
        <div className="flex h-10 w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-950/70 px-3 font-mono text-slate-200">
            {value.toFixed(2).replace('.', ',')}
        </div>
    </div>
);

const PliDisplayBox = ({ value }: { value: number }) => (
    <div className="space-y-2">
        <Label>PLI Calculado</Label>
        <div className="flex h-10 w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-950/70 px-3 font-mono text-slate-200">
            {value.toFixed(2).replace('.', ',')}
        </div>
    </div>
);


const PROBABILITY_FORMULAS: { [key: string]: { formula: string; vars: string[] } } = {
    PA: { formula: "PTA × PB", vars: ["PTA", "PB"] },
    PB: { formula: "Seleção Direta (Nível SPDA)", vars: ["PB"] },
    PC: { formula: "PSPDₑ × CLDₑ", vars: ["PSPD_electric", "CLD_electric"] },
    PCT: { formula: "PSPDₐ × CLDₐ", vars: ["PSPD_data", "CLD_data"] },
    Pms: { formula: "(Ks1 × Ks2 × Ks3ₑ × Ks4ₑ)²", vars: ["Ks1", "Ks2", "Ks3_electric", "Ks4_electric"] },
    Pmst: { formula: "(Ks1 × Ks2 × Ks3ₐ × Ks4ₐ)²", vars: ["Ks1", "Ks2", "Ks3_data", "Ks4_data"] },
    PM: { formula: "PSPDₑ × Pms", vars: ["PSPD_electric", "Pms"] },
    PMT: { formula: "PSPDₐ × Pmst", vars: ["PSPD_data", "Pmst"] },
    PU: { formula: "PTUₑ × PEBₑ × PLDₑ × CLDₑ", vars: ["PTU_electric", "PEB_electric", "PLD_electric", "CLD_electric"] },
    PUT: { formula: "PTUₐ × PEBₐ × PLDₐ × CLDₐ", vars: ["PTU_data", "PEB_data", "PLD_data", "CLD_data"] },
    PV: { formula: "PEBₑ × PLDₑ × CLDₑ", vars: ["PEB_electric", "PLD_electric", "CLD_electric"] },
    PVT: { formula: "PEBₐ × PLDₐ × CLDₐ", vars: ["PEB_data", "PLD_data", "CLD_data"] },
    PW: { formula: "PSPDₑ × PLDₑ × CLDₑ", vars: ["PSPD_electric", "PLD_electric", "CLD_electric"] },
    PWT: { formula: "PSPDₐ × PLDₐ × CLDₐ", vars: ["PSPD_data", "PLD_data", "CLD_data"] },
    PZ: { formula: "PSPDₑ × CLIₑ × Pliₑ", vars: ["PSPD_electric", "CLI_electric", "Pli_electric"] },
    PZT: { formula: "PSPDₐ × CLIₐ × Pliₐ", vars: ["PSPD_data", "CLI_data", "Pli_data"] },
};

const CustomTooltip = ({ active, payload, label, probData, probCalcs }: any) => {
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
        
        const valuesString = formatValues(formulaInfo);

        const tooltipStyle: React.CSSProperties = {
            transform: 'translate(10px, calc(-100% - 10px))',
            pointerEvents: 'none',
        };

        return (
            <div 
                style={tooltipStyle}
                className="p-3 bg-slate-800/90 border rounded-lg shadow-lg text-sm border-slate-600 backdrop-blur-sm w-72"
            >
                <p className="font-bold text-slate-100 text-base mb-1">{label}</p>
                <p className="text-blue-400 font-mono">Valor: {Number(payload[0].value).toExponential(3).replace('.',',')}</p>
                
                {formulaInfo && (
                    <div className="mt-2 border-b border-slate-700 pb-2">
                        <p className="text-slate-300 font-semibold">Fórmula:</p>
                        <p className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs">{formulaInfo.formula}</p>
                        <p className="text-slate-300 mt-2 font-semibold">Valores:</p>
                        <p className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs break-all">{valuesString}</p>
                    </div>
                )}
                
                {subComponentLabel && subComponentFormulaInfo && (
                    <div className="mt-2">
                         <p className="font-bold text-slate-200 text-sm mb-1">Componente: {subComponentLabel}</p>
                         <p className="text-cyan-400 font-mono text-xs">Valor: {(allValues[subComponentLabel] ?? 0).toExponential(3).replace('.',',')}</p>
                        
                         <p className="text-slate-300 mt-2 font-semibold text-xs">Fórmula ({subComponentLabel}):</p>
                         <p className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs">{subComponentFormulaInfo.formula}</p>
                         <p className="text-slate-300 mt-2 font-semibold text-xs">Valores ({subComponentLabel}):</p>
                         <p className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs break-all">{formatValues(subComponentFormulaInfo)}</p>
                    </div>
                )}
            </div>
        );
    }
    return null;
};

export function ProbabilityStep({ data, onChange }: ProbabilityStepProps) {
    const [activeTab, setActiveTab] = useState('structure');
    const prob = data.probability_data;

    useEffect(() => {
        if (activeTab === 'electric' && !data.has_electric_line) {
            setActiveTab('structure');
        }
        if (activeTab === 'data' && !data.has_data_line) {
            setActiveTab('structure');
        }
    }, [data.has_electric_line, data.has_data_line, activeTab]);

    // Centralized function to handle all probability state changes and recalculate PLD immediately.
    const handleProbabilityChange = useCallback((updates: Partial<ProbabilityData>) => {
        const newProbData = { ...data.probability_data, ...updates };

        const electricInputsChanged = 'is_shielded_electric' in updates || 'rs_electric' in updates || 'Uw_electric' in updates;
        if (electricInputsChanged) {
            newProbData.PLD_electric = calculatePld(
                newProbData.rs_electric,
                newProbData.Uw_electric,
                newProbData.is_shielded_electric
            );
        }
        
        const dataInputsChanged = 'is_shielded_data' in updates || 'rs_data' in updates || 'Uw_data' in updates;
        if (dataInputsChanged) {
            newProbData.PLD_data = calculatePld(
                newProbData.rs_data,
                newProbData.Uw_data,
                newProbData.is_shielded_data
            );
        }

        onChange({ probability_data: newProbData });
    }, [data.probability_data, onChange]);
    
    const handleCombinedChange = (value: string, lineType: 'electric' | 'data') => {
        const [cld, cli] = value.split('_').map(parseFloat);
        if (lineType === 'electric') {
            handleProbabilityChange({ CLD_electric: cld, CLI_electric: cli });
        } else {
            handleProbabilityChange({ CLD_data: cld, CLI_data: cli });
        }
    };

    // Calculate Ks4 values
    const ks4_electric = prob.Uw_electric > 0 ? 1 / prob.Uw_electric : 1;
    const ks4_data = prob.Uw_data > 0 ? 1 / prob.Uw_data : 1;

    const chartData = Object.entries(data.probability_calculations)
        .filter(([key]) => !['Ks1', 'Ks2', 'Ks4_electric', 'Ks4_data', 'Pli_electric', 'Pli_data', 'PEB_electric', 'PEB_data', 'Pms', 'Pmst'].includes(key)) 
        .map(([key, value]) => ({ name: key, value, fill: '#3b82f6' }));
    
    const { Ks1: calculatedKs1 = 0, Ks2: calculatedKs2 = 0 } = data.probability_calculations;
    const isKs1Capped = (data.probability_data.wm1 || 0) * 0.12 > 1;
    const isKs2Capped = (data.probability_data.wm2 || 0) * 0.12 > 1;


    return (
        <div className="grid grid-cols-1 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Fatores de Probabilidade de Dano (P)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex space-x-2 p-1 bg-slate-800/70 rounded-lg">
                        <TabButton isActive={activeTab === 'structure'} onClick={() => setActiveTab('structure')}>Estrutura</TabButton>
                        {data.has_electric_line && <TabButton isActive={activeTab === 'electric'} onClick={() => setActiveTab('electric')}>Linha Elétrica</TabButton>}
                        {data.has_data_line && <TabButton isActive={activeTab === 'data'} onClick={() => setActiveTab('data')}>Linha de Dados</TabButton>}
                    </div>

                    {activeTab === 'structure' && (
                        <div className="grid md:grid-cols-2 gap-4 pt-2">
                            <SelectInput label="PTA - Medidas de Proteção" value={prob.PTA} options={PTA_OPTIONS} onUpdate={v => handleProbabilityChange({ PTA: v })} />
                            <SelectInput label="PB - Nível do SPDA" value={prob.PB} options={PB_OPTIONS} onUpdate={v => handleProbabilityChange({ PB: v })} />
                            
                            <div>
                                <DecimalInput label="Largura da malha wm1 (m)" value={prob.wm1} onUpdate={v => handleProbabilityChange({ wm1: v })} />
                                <p className="text-xs text-slate-400 mt-1">Ks1 calculado: <span className="font-bold text-blue-300">{calculatedKs1.toFixed(3)}</span></p>
                                {isKs1Capped && (
                                    <Alert variant="destructive" className="mt-2 p-2 text-xs flex items-center">
                                        <AlertTriangle className="h-4 w-4 mr-2"/>
                                        <AlertDescription>O valor de Ks1 foi limitado a 1.0. Valor máximo de wm1 é ~8.33m.</AlertDescription>
                                    </Alert>
                                )}
                            </div>
                             <div>
                                <DecimalInput label="Largura da malha wm2 (m)" value={prob.wm2} onUpdate={v => handleProbabilityChange({ wm2: v })} />
                                <p className="text-xs text-slate-400 mt-1">Ks2 calculado: <span className="font-bold text-blue-300">{calculatedKs2.toFixed(3)}</span></p>
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
                        <div className="grid md:grid-cols-6 lg:grid-cols-12 gap-4 pt-2">
                            <div className="md:col-span-3 lg:col-span-3">
                                <SelectInput label="PTU - Medida de proteção" value={prob.PTU_electric} options={PTU_OPTIONS} onUpdate={(v) => handleProbabilityChange({ PTU_electric: v })} />
                            </div>
                            <div className="md:col-span-3 lg:col-span-3">
                                <SelectInput label="PEB - Prot. Surto Cond. D1/D2 - PU/PV" value={prob.PEB_electric} options={pebOptions} onUpdate={(v) => handleProbabilityChange({ PEB_electric: v })} />
                            </div>
                            <div className="md:col-span-3 lg:col-span-3">
                                <SelectInput label="PSPD - Surto Ind. - D3 - PC/PM/PW/PZ" value={prob.PSPD_electric} options={PSPD_OPTIONS} onUpdate={(v) => handleProbabilityChange({ PSPD_electric: v })} />
                            </div>
                            <div className="md:col-span-3 lg:col-span-3">
                                <SelectInput label="Ks3 - Fiação interna" value={prob.Ks3_electric} options={KS3_OPTIONS} onUpdate={(v) => handleProbabilityChange({ Ks3_electric: v })} />
                            </div>

                            <div className="md:col-span-3 lg:col-span-3">
                                <SelectInput label="Uw - Tensão Suportável (kV)" value={prob.Uw_electric} options={UW_OPTIONS} onUpdate={v => handleProbabilityChange({ Uw_electric: v })} />
                            </div>
                            <div className="md:col-span-3 lg:col-span-3">
                                <ShieldingSlider 
                                    isShielded={prob.is_shielded_electric}
                                    rsValue={prob.rs_electric}
                                    onChange={(isShielded, rs) => handleProbabilityChange({ is_shielded_electric: isShielded, rs_electric: rs })}
                                />
                            </div>
                            <div className="md:col-span-2 lg:col-span-2">
                                <Ks4DisplayBox value={ks4_electric} />
                            </div>
                             <div className="md:col-span-2 lg:col-span-2">
                                <PldDisplayBox value={prob.PLD_electric} />
                            </div>
                            <div className="md:col-span-2 lg:col-span-2">
                                <PliDisplayBox value={data.probability_calculations.Pli_electric || 0} />
                            </div>

                            <div className="md:col-span-6 lg:col-span-12">
                                <div className="space-y-2">
                                    <Label>CLD/CLI - Blindagem da Linha e Comp. Interno (Tabela B.4)</Label>
                                    <Select
                                        value={`${prob.CLD_electric}_${prob.CLI_electric}`}
                                        onValueChange={(v) => handleCombinedChange(v, 'electric')}
                                        options={COMBINED_CLD_CLI_OPTIONS}
                                        placeholder="Selecione o tipo de blindagem e componente..."
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {COMBINED_CLD_CLI_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value} label={opt.label} />)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}
                     {activeTab === 'data' && (
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center space-x-2 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                                <Checkbox
                                    id="analyze_data_line_probs"
                                    checked={data.analyze_data_line_probabilities}
                                    onCheckedChange={(checked) => onChange({ analyze_data_line_probabilities: !!checked })}
                                />
                                <Label htmlFor="analyze_data_line_probs" className="cursor-pointer flex-1">
                                    Analisar Fatores de Probabilidade para Linha de Dados interna
                                </Label>
                            </div>
                             <p className="text-xs text-slate-400 px-1">
                                Desmarque esta opção se a linha de dados termina na entrada (ex: modem) e não possui cabeamento interno.
                            </p>
                            <AnimatePresence>
                                {data.analyze_data_line_probabilities && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="grid md:grid-cols-6 lg:grid-cols-12 gap-4 pt-2">
                                            <div className="md:col-span-3 lg:col-span-3">
                                                <SelectInput label="PTU - Medida de proteção" value={prob.PTU_data} options={PTU_OPTIONS} onUpdate={(v) => handleProbabilityChange({ PTU_data: v })} />
                                            </div>
                                            <div className="md:col-span-3 lg:col-span-3">
                                                <SelectInput label="PEB - Prot. Surto Cond. D1/D2 - PU/PV" value={prob.PEB_data} options={pebOptions} onUpdate={(v) => handleProbabilityChange({ PEB_data: v })} />
                                            </div>
                                            <div className="md:col-span-3 lg:col-span-3">
                                                <SelectInput label="PSPD - Surto Ind. - D3 - PC/PM/PW/PZ" value={prob.PSPD_data} options={PSPD_OPTIONS} onUpdate={(v) => handleProbabilityChange({ PSPD_data: v })} />
                                            </div>
                                            <div className="md:col-span-3 lg:col-span-3">
                                                <SelectInput label="Ks3 - Fiação interna" value={prob.Ks3_data} options={KS3_OPTIONS} onUpdate={(v) => handleProbabilityChange({ Ks3_data: v })} />
                                            </div>
                                            
                                            <div className="md:col-span-3 lg:col-span-3">
                                                <SelectInput label="Uw - Tensão Suportável (kV)" value={prob.Uw_data} options={UW_OPTIONS} onUpdate={v => handleProbabilityChange({ Uw_data: v })} />
                                            </div>
                                            <div className="md:col-span-3 lg:col-span-3">
                                                <ShieldingSlider 
                                                    isShielded={prob.is_shielded_data}
                                                    rsValue={prob.rs_data}
                                                    onChange={(isShielded, rs) => handleProbabilityChange({ is_shielded_data: isShielded, rs_data: rs })}
                                                />
                                            </div>
                                            <div className="md:col-span-2 lg:col-span-2">
                                                <Ks4DisplayBox value={ks4_data} />
                                            </div>
                                            <div className="md:col-span-2 lg:col-span-2">
                                                <PldDisplayBox value={prob.PLD_data} />
                                            </div>
                                            <div className="md:col-span-2 lg:col-span-2">
                                                <PliDisplayBox value={data.probability_calculations.Pli_data || 0} />
                                            </div>

                                            <div className="md:col-span-6 lg:col-span-12">
                                                <div className="space-y-2">
                                                    <Label>CLD/CLI - Blindagem da Linha e Comp. Interno (Tabela B.4)</Label>
                                                    <Select
                                                        value={`${prob.CLD_data}_${prob.CLI_data}`}
                                                        onValueChange={(v) => handleCombinedChange(v, 'data')}
                                                        options={COMBINED_CLD_CLI_OPTIONS}
                                                        placeholder="Selecione o tipo de blindagem e componente..."
                                                    >
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            {COMBINED_CLD_CLI_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value} label={opt.label} />)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
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
                    <CardTitle className="text-base">Resultados das Probabilidades</CardTitle>
                </CardHeader>
                <CardContent className="h-[15rem]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                            <YAxis tick={{ fill: '#94a3b8' }} />
                            <Tooltip 
                                content={<CustomTooltip probData={data.probability_data} probCalcs={data.probability_calculations} />} 
                                cursor={{ fill: 'rgba(30, 41, 59, 0.7)' }}
                            />
                            <Bar dataKey="value" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
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