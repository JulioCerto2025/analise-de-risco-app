import React, { useState, FC } from "react";
import { Card, CardContent, CardHeader, CardTitle, FormulaTooltip, Alert, AlertTitle, AlertDescription, useIsMobile } from '../ui';
import { formatSmartNumber } from '../../lib/format';
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
                period: String(Math.round(periodInDays)), // dias como inteiros
                unit: 'dias/evento'
            };
        }
        return {
            period: formatSmartNumber(periodInMonths, { maxDecimals: 1, useScientificBelow: 0 }),
            unit: 'meses/evento'
        };
    }
    return {
        period: formatSmartNumber(periodInYears, { maxDecimals: 1, useScientificBelow: 0 }),
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
            <CardContent className="p-4 sm:p-3 flex items-center justify-between gap-3">
                <div className="flex-1">
                    <p className="text-[11px] sm:text-sm font-semibold text-slate-300 leading-tight flex items-center">
                        {formula ? (
                            <FormulaTooltip formulas={{[badge]: formula}} values={formulaValues}>
                                <span className="inline-flex items-center">{description}</span>
                            </FormulaTooltip>
                        ) : (
                            description
                        )}
                    </p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{period}</p>
                    <p className="text-[10px] sm:text-xs text-slate-400 -mt-1">{unit}</p>
                </div>
                <div className="relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
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

const formatValue = (value: number) => formatSmartNumber(value, { useScientificBelow: 0.001, scientificPrecision: 2, maxDecimals: 3 });

// Exibe números como "9,98 × 10⁻⁷" com precisão ajustável
const ScientificNotation = ({ value, precision = 2 }: { value: number; precision?: number }) => {
    if (value === 0 || !isFinite(value)) {
        return <span>0</span>;
    }
    const [mantissa, exponent] = value.toExponential(precision).split('e');
    return (
        <span className="font-mono tracking-tight whitespace-nowrap" dangerouslySetInnerHTML={{ __html: `${mantissa.replace('.', ',')} &times; 10<sup>${exponent}</sup>` }} />
    );
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
        const valueMap: Record<string, number> = { ...(calculations || {}) };

        // Substituição direta na fórmula para exibir "Valores"
        let formulaDisplay = formulaInfo?.formula || "N/A";
        if (eventKey === 'ND') formulaDisplay = "Ng × Adf × Cd × 10⁻⁶";
        if (eventKey === 'NM') formulaDisplay = "Ng × Am × 10⁻⁶";

        let valuesString = "N/A";
        if (formulaInfo) {
            const rawFormula = formulaInfo.formula;
            const formatVarValue = (v: any) => {
                if (typeof v !== 'number') return '0';
                if (v === 0) return '0';
                if (Math.abs(v) > 1000) return v.toLocaleString('pt-BR');
                if (Math.abs(v) < 0.01) return v.toExponential(1).replace('.', ',');
                return String(v).replace('.', ',');
            };
            valuesString = formulaInfo.vars.reduce(
                (acc, v) => acc.replace(new RegExp(`\\b${v}\\b`, 'g'), formatVarValue((valueMap as any)[v] ?? 0)),
                rawFormula
            );
    valuesString = valuesString.replace(/\*/g, '×');
            // Adiciona o fator 10⁻⁶ explicitamente para ND/NM
            if (eventKey === 'ND' || eventKey === 'NM') {
                valuesString = `${valuesString} × 10⁻⁶`;
            }
        }

        // Seção "Detalhe" com notação científica dos multiplicandos
        let detailNodes: React.ReactNode | null = null;
        if (formulaInfo) {
            if (eventKey === 'ND') {
                const parts = [valueMap['ng'] || 0, valueMap['adf'] || 0, valueMap['cd'] || 0];
                detailNodes = (
                    <span className="font-mono">
                        {parts.map((val, idx) => (
                            <span key={idx} className="inline-flex items-baseline">
                                    <ScientificNotation value={val} precision={2} />
                                {idx < parts.length - 1 ? <span className="mx-0.5">×</span> : null}
                            </span>
                        ))}
                        <span className="mx-0.5">×</span>
                        <span dangerouslySetInnerHTML={{ __html: `10<sup>-6</sup>` }} />
                    </span>
                );
            } else if (eventKey === 'NM') {
                const parts = [valueMap['ng'] || 0, valueMap['am'] || 0];
                detailNodes = (
                    <span className="font-mono">
                        {parts.map((val, idx) => (
                            <span key={idx} className="inline-flex items-baseline">
                                <ScientificNotation value={val} precision={2} />
                                {idx < parts.length - 1 ? <span className="mx-0.5">×</span> : null}
                            </span>
                        ))}
                        <span className="mx-0.5">×</span>
                        <span dangerouslySetInnerHTML={{ __html: `10<sup>-6</sup>` }} />
                    </span>
                );
            } else if (eventKey === 'NL') {
                const parts = [valueMap['nl_electric'] || 0, valueMap['nl_data'] || 0];
                detailNodes = (
                    <span className="font-mono">
                        <span className="inline-flex items-baseline">
                            <ScientificNotation value={parts[0]} precision={2} />
                        </span>
                        <span className="mx-0.5">+</span>
                        <span className="inline-flex items-baseline">
                            <ScientificNotation value={parts[1]} precision={2} />
                        </span>
                    </span>
                );
            } else if (eventKey === 'NI') {
                const parts = [valueMap['ni_electric'] || 0, valueMap['ni_data'] || 0];
                detailNodes = (
                    <span className="font-mono">
                        <span className="inline-flex items-baseline">
                            <ScientificNotation value={parts[0]} precision={2} />
                        </span>
                        <span className="mx-0.5">+</span>
                        <span className="inline-flex items-baseline">
                            <ScientificNotation value={parts[1]} precision={2} />
                        </span>
                    </span>
                );
            }
        }

        return (
            <div className="p-3 bg-slate-800/90 border rounded-lg shadow-lg text-sm border-slate-600 backdrop-blur-sm w-auto min-w-[18rem] max-w-[48rem]">
                <p className="font-bold text-slate-100 text-base mb-1">{`${eventKey} - ${eventInfo?.description}`}</p>
                <p className="text-blue-400 font-mono">Valor: <ScientificNotation value={Number(payload[0].value)} precision={2} /></p>
                 {formulaInfo && (
                    <>
                        <p className="text-slate-300 mt-2 font-semibold">Fórmula:</p>
                        <p className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs sm:text-sm leading-tight break-normal whitespace-normal">{formulaDisplay}</p>
                        <p className="text-slate-300 mt-2 font-semibold">Valores:</p>
                        <p className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs sm:text-sm leading-tight break-normal whitespace-normal">{valuesString}</p>
                        {detailNodes && (
                            <>
                                <p className="text-slate-300 mt-2 font-semibold">Detalhe:</p>
                                <div className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs sm:text-sm leading-tight break-normal whitespace-normal">{detailNodes}</div>
                            </>
                        )}
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
    const isMobile = useIsMobile();

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
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
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

                    <div className="h-[25rem] relative hidden sm:block">
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
                                {!isMobile && (
                                    <Tooltip 
                                        content={<CustomTooltip calculations={{...data.calculations, ng: data.ng, cd: data.cd}} />} 
                                        cursor={{ fill: 'rgba(30, 41, 59, 0.7)' }}
                                    />
                                )}
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