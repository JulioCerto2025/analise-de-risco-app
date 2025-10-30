import React, { useState, FC } from "react";
import { Card, CardContent, CardHeader, CardTitle, FormulaTooltip, Alert, AlertTitle, AlertDescription } from '../ui';
import { AnalysisData } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Home, Zap } from 'lucide-react';

// Centralized formatting function for frequency
const formatFrequencyAsPeriod = (value: number): { period: string; unit: string } => {
    if (value <= 0 || !isFinite(value)) {
        return { period: '∞', unit: 'anos/evento' };
    }
    
    const periodInYears = 1 / value;

    if (periodInYears < 1) {
        const periodInMonths = periodInYears * 12;
        if (periodInMonths < 1) {
            const periodInDays = periodInMonths * 30;
            return {
                period: periodInDays.toFixed(0), // No decimals for days
                unit: 'dias/evento'
            };
        }
        return {
            period: periodInMonths.toFixed(1).replace('.', ','),
            unit: 'meses/evento'
        };
    }
    return {
        period: periodInYears.toFixed(1).replace('.', ','),
        unit: 'anos/evento'
    };
};


interface EventPeriodCardProps {
    description: string;
    value: number;
    badge: string;
    color: string;
    onClick: () => void;
    isSelected: boolean;
    formula?: string;
    formulaValues?: { [key:string]: any };
}

const EventPeriodCard: FC<EventPeriodCardProps> = ({
    description,
    value,
    badge,
    color,
    onClick,
    isSelected,
    formula,
    formulaValues
}) => {
    const { period, unit } = formatFrequencyAsPeriod(value);

    return (
        <Card
            onClick={onClick}
            className={`transition-all duration-300 ease-in-out cursor-pointer overflow-hidden ${
                isSelected ? 'transform scale-105 shadow-xl border-2 border-blue-400' : ''
            }`}
        >
            <CardContent className="p-2 sm:p-3 flex items-center justify-between gap-2 sm:gap-3">
                <div className="flex-1">
                    <p className="text-[11px] sm:text-sm font-semibold text-slate-300 leading-tight flex items-center">
                        {description}
                        {formula && <FormulaTooltip formulas={{[badge]: formula}} values={formulaValues} />}
                    </p>
                    <p className="text-xl sm:text-3xl font-extrabold text-white mt-1">{period}</p>
                    <p className="text-[10px] sm:text-xs text-slate-400 -mt-1">{unit}</p>
                </div>
                <div className="relative flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                    <Home className="w-full h-full text-slate-300" strokeWidth={1.5}/>
                    <Zap className="w-5 h-5 sm:w-7 sm:h-7 text-yellow-500 fill-yellow-400 absolute" />
                    <div className={`absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold border-2 border-slate-800 ${color}`}>
                        {badge}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const formatValue = (value: number) => {
    if (value === 0) return '0';
    return value.toExponential(2).replace('.', ',');
};


const EVENT_FORMULAS: { [key: string]: { formula: string; vars: string[] } } = {
    ND: { formula: "Ng × Adf × Cd", vars: ["ng", "adf", "cd"] },
    NM: { formula: "Ng × Am", vars: ["ng", "am"] },
    NL: { formula: "nl_electric + nl_data", vars: ["nl_electric", "nl_data"] },
    NI: { formula: "ni_electric + ni_data", vars: ["ni_electric", "ni_data"] },
};

const CustomTooltip = ({ active, payload, label, calculations }: any) => {
    if (active && payload && payload.length) {
        const eventKey = label === 'S1' ? 'ND' : label === 'S2' ? 'NM' : label === 'S3' ? 'NL' : 'NI';
        const eventInfo = events.find(e => e.key === label);
        const formulaInfo = EVENT_FORMULAS[eventKey];
        
        let valuesString = "N/A";
        if (formulaInfo) {
            valuesString = formulaInfo.vars.map(v => {
                 const value = (calculations as any)[v] ?? 0;
                 return formatValue(value);
            }).join(formulaInfo.formula.includes('+') ? ' + ' : ' × ');
        }
        
        let formulaDisplay = formulaInfo?.formula || "N/A";
        if (eventKey === 'ND') formulaDisplay = "Ng × Adf × Cd × 10⁻⁶";
        if (eventKey === 'NM') formulaDisplay = "Ng × Am × 10⁻⁶";


        return (
            <div className="p-3 bg-slate-800/90 border rounded-lg shadow-lg text-sm border-slate-600 backdrop-blur-sm w-64">
                <p className="font-bold text-slate-100 text-base mb-1">{`${eventKey} - ${eventInfo?.description}`}</p>
                <p className="text-blue-400 font-mono">Valor: {formatValue(Number(payload[0].value))}</p>
                 {formulaInfo && (
                    <>
                        <p className="text-slate-300 mt-2 font-semibold">Fórmula:</p>
                        <p className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs">{formulaDisplay}</p>
                        <p className="text-slate-300 mt-2 font-semibold">Valores:</p>
                        <p className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs break-all">{valuesString}</p>
                    </>
                )}
            </div>
        );
    }
    return null;
};

// Hoisted for access in CustomTooltip
const events = [
    { key: 'S1', name: 'ND', description: "Descargas na Estrutura", value: 0, color: '#3B82F6', bgColor: 'bg-blue-600' },
    { key: 'S2', name: 'NM', description: "Campo Magnético Próximo", value: 0, color: '#EF4444', bgColor: 'bg-red-600' },
    { key: 'S3', name: 'NL', description: "Descargas na Linha", value: 0, color: '#10B981', bgColor: 'bg-green-600' },
    { key: 'S4', name: 'NI', description: "Surtos Induzidos na Linha", value: 0, color: '#F59E0B', bgColor: 'bg-yellow-600' }
];

export function Step3Events({ data }: { data: AnalysisData }) {
    const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

    const handleSelectEvent = (eventKey: string | null) => {
        if (eventKey === null) {
            setSelectedEvent(null);
            return;
        }
        setSelectedEvent(current => (current === eventKey ? null : eventKey));
    };

    const { nd = 0, nm = 0, nl_electric = 0, nl_data = 0, ni_electric = 0, ni_data = 0 } = data.calculations;
    const nl = nl_electric + nl_data;
    const ni = ni_electric + ni_data;
    const isNgMissing = !data.ng || data.ng <= 0;
    const allZero = [nd, nm, nl, ni].every(v => v === 0);
    const yMax = Math.max(nd, nm, nl, ni) > 0 ? Math.max(nd, nm, nl, ni) : 1;

    // Update event values
    events[0].value = nd;
    events[1].value = nm;
    events[2].value = nl;
    events[3].value = ni;
    
    const periodDescriptions: {[key: string]: string} = {
        S1: 'ND', S2: 'NM', S3: 'NL', S4: 'NI',
    };

    const chartData = events.map(e => ({ name: e.key, value: e.value, fill: e.color }));
    
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Frequência Média Anual de Eventos Danosos</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {isNgMissing && (
                        <Alert variant="destructive" className="border-2">
                            <AlertTitle>Dados insuficientes para cálculo</AlertTitle>
                            <AlertDescription>
                                Defina o valor de <span className="font-semibold">Ng</span> e os parâmetros iniciais para exibir os valores e o gráfico. 
                                Você pode selecionar o município ou inserir Ng manualmente na etapa de entrada.
                            </AlertDescription>
                        </Alert>
                    )}
                    {!isNgMissing && allZero && (
                        <Alert>
                            <AlertTitle>Nenhum evento calculado</AlertTitle>
                            <AlertDescription>
                                Todos os valores (ND, NM, NL, NI) resultaram em 0. Verifique <span className="font-semibold">Cd</span>, 
                                <span className="font-semibold">Adf</span>, <span className="font-semibold">Am</span> e os dados das linhas (comprimentos/quantidades) para garantir que não estejam zerados.
                            </AlertDescription>
                        </Alert>
                    )}
                     <div
                        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5"
                        style={{ padding: '0 12px 0 0' }}
                    >
                        {events.map(event => {
                            const formulaInfo = EVENT_FORMULAS[event.name];
                            const allValues = { ...data.calculations, ng: data.ng, cd: data.cd };
                            const valuesForFormula = formulaInfo.vars.reduce((acc, v) => {
                                acc[v] = allValues[v as keyof typeof allValues];
                                return acc;
                            }, {} as {[key:string]:any});

                            return (
                                <EventPeriodCard 
                                    key={event.key}
                                    description={`${event.key} - ${periodDescriptions[event.key]}`}
                                    value={event.value}
                                    badge={event.key}
                                    color={event.bgColor}
                                    onClick={() => handleSelectEvent(event.key)}
                                    isSelected={selectedEvent === event.key}
                                    formula={formulaInfo.formula}
                                    formulaValues={valuesForFormula}
                                />
                            );
                        })}
                    </div>

                    <div className="h-[25rem] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                                data={chartData} 
                                margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                                onClick={(e) => {
                                    if (!e || !e.activeLabel) {
                                        handleSelectEvent(null);
                                    }
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                                <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                                <YAxis 
                                    domain={[0, yMax]}
                                    tick={{ fill: '#94a3b8' }}
                                />
                                <Tooltip 
                                    content={<CustomTooltip calculations={{...data.calculations, ng: data.ng, cd: data.cd}} />} 
                                    cursor={{ fill: 'rgba(30, 41, 59, 0.7)' }}
                                />
                                <Bar 
                                    dataKey="value"
                                    onClick={(data) => handleSelectEvent(data.name)}
                                >
                                    {chartData.map((entry) => (
                                        <Cell 
                                            key={`cell-${entry.name}`} 
                                            fill={entry.fill}
                                            className="transition-opacity duration-300 cursor-pointer"
                                            opacity={selectedEvent === null || selectedEvent === entry.name ? 1 : 0.3}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        {allZero && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="px-4 py-2 rounded-xl bg-slate-800/70 border border-slate-600 text-slate-200 text-sm">
                                    Sem barras no gráfico: todos os valores são 0.
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}