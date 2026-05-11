'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent, FormulaTooltip, Alert, AlertTitle, AlertDescription, useIsMobile, useAuditMode } from '../ui';
import { formatSmartNumber } from '../../lib/format';
import { AnalysisData } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Zap, MapPin, Activity, AlertTriangle, Home } from 'lucide-react';

// Component to format numbers in scientific notation like "9.98 × 10⁻⁷"
const ScientificNotation = ({ value, precision = 2, className = "" }: { value: number; precision?: number; className?: string }) => {
    if (value === 0 || !isFinite(value)) return <span className={className}>0</span>;
    let [mantissa, exponent] = value.toExponential(precision).split('e');
    const expInt = parseInt(exponent, 10);
    
    return (
        <span className={`inline-flex items-baseline font-black tracking-tighter ${className}`}>
            <span>{mantissa.replace('.', ',')}</span>
            <span className="text-[0.6em] ml-0.5 opacity-80">&times;10</span>
            <sup className="text-[0.55em] leading-none -top-[0.8em]">{expInt}</sup>
        </span>
    );
};

// Formatting function for frequency as return period
const formatFrequencyAsPeriod = (value: number): { period: string; unit: string } => {
    if (value <= 0 || !isFinite(value)) return { period: '∞', unit: 'anos/evento' };
    const periodInYears = 1 / value;
    if (periodInYears < 1) {
        const periodInMonths = periodInYears * 12;
        if (periodInMonths < 1) {
            const periodInDays = periodInMonths * 30;
            return { period: String(Math.round(periodInDays)), unit: 'dias/evento' };
        }
        return { period: formatSmartNumber(periodInMonths, { maxDecimals: 1, useScientificBelow: 0 }), unit: 'meses/evento' };
    }
    return { period: formatSmartNumber(periodInYears, { maxDecimals: 1, useScientificBelow: 0 }), unit: 'anos/evento' };
};

const EVENT_FORMULAS: { [key: string]: { formula: string; vars: string[] } } = {
    ND: { formula: "Ng × Adf × Cd × 10<sup>-6</sup>", vars: ["ng", "adf", "cd"] },
    NM: { formula: "Ng × Am × 10<sup>-6</sup>", vars: ["ng", "am"] },
    NL: { formula: "Σ (Ng × Al × Ci × Ce × Ct) × 10<sup>-6</sup>", vars: ["nl_electric", "nl_data"] },
    NI: { formula: "Σ (Ng × Ai × Ci × Ce × Ct) × 10<sup>-6</sup>", vars: ["ni_electric", "ni_data"] },
};

const EventEditorialPortal = ({ eventKey, data, onClose }: { eventKey: string; data: AnalysisData; onClose: () => void }) => {
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

    const formulaInfo = EVENT_FORMULAS[eventKey];
    const calculations = data.calculations;
    const valueMap: any = { ...calculations, ng: data.ng, cd: data.cd };

    let valuesNodes: React.ReactNode = null;
    if (eventKey === 'ND') {
        const parts = [valueMap.ng || 0, valueMap.adf || 0, valueMap.cd || 0];
        valuesNodes = (
            <span className="font-mono">
                {parts.map((val: number, idx: number) => (
                    <span key={idx} className="inline-flex items-baseline">
                        <ScientificNotation value={val} precision={2} />
                        {idx < parts.length - 1 ? <span className="mx-0.5">&times;</span> : null}
                    </span>
                ))}
                <span className="mx-0.5">&times;</span>
                <span dangerouslySetInnerHTML={{ __html: "10<sup>-6</sup>" }} />
            </span>
        );
    } else if (eventKey === 'NM') {
        const parts = [valueMap.ng || 0, valueMap.am || 0];
        valuesNodes = (
            <span className="font-mono">
                {parts.map((val: number, idx: number) => (
                    <span key={idx} className="inline-flex items-baseline">
                        <ScientificNotation value={val} precision={2} />
                        {idx < parts.length - 1 ? <span className="mx-0.5">&times;</span> : null}
                    </span>
                ))}
                <span className="mx-0.5">&times;</span>
                <span dangerouslySetInnerHTML={{ __html: "10<sup>-6</sup>" }} />
            </span>
        );
    } else {
        const v1 = eventKey === 'NL' ? valueMap.nl_electric : valueMap.ni_electric;
        const v2 = eventKey === 'NL' ? valueMap.nl_data : valueMap.ni_data;
        valuesNodes = (
            <span className="font-mono flex items-baseline gap-1">
                <ScientificNotation value={v1 || 0} precision={2} />
                <span>+</span>
                <ScientificNotation value={v2 || 0} precision={2} />
            </span>
        );
    }

    const value = (calculations as any)[eventKey.toLowerCase()] || (eventKey === 'NL' ? (calculations.nl_electric + calculations.nl_data) : (calculations.ni_electric + calculations.ni_data));

    return createPortal(
        <div className="fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px] pointer-events-none animate-in fade-in duration-200" />
            <div 
                ref={portalRef}
                className="fixed right-6 top-[100px] w-[min(90vw,540px)] p-6 bg-slate-800/98 border border-blue-500/40 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl z-[9999] animate-in slide-in-from-right-10 fade-in duration-300 pointer-events-auto"
            >
                <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    <p className="font-black text-slate-100 uppercase tracking-[0.2em] text-[10px]">Detalhamento de Eventos Editorial</p>
                </div>
                <div className="space-y-6">
                    <div className="flex items-center justify-between bg-slate-900/40 p-4 rounded-2xl border border-white/5">
                        <div className="flex flex-col">
                            <span className="font-black text-slate-100 text-lg uppercase tracking-wider">{eventKey}</span>
                        </div>
                        <div className="flex items-baseline gap-2 text-right">
                            <span className="text-[10px] uppercase font-black text-blue-500/70 tracking-widest text-right">Valor Final</span>
                            <p className="text-blue-400 font-mono font-black text-xl">
                                {Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <p className="text-slate-500 text-[9px] uppercase font-black tracking-[0.2em] ml-1">Fórmula (Variáveis):</p>
                            <div className="font-mono bg-slate-900/40 p-4 rounded-2xl text-slate-200 text-xs sm:text-base leading-relaxed border border-white/5 shadow-inner" dangerouslySetInnerHTML={{ __html: formulaInfo?.formula || "N/A" }} />
                        </div>
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

const eventsConfig = [
    { name: 'ND', description: "Desc. Estrutura", color: '#3b82f6' },
    { name: 'NM', description: "Campo Próximo", color: '#ef4444' },
    { name: 'NL', description: "Desc. no Linha", color: '#10b981' },
    { name: 'NI', description: "Desc. próx. à Linha", color: '#f59e0b' }
];

export function Step3Events({ data }: { data: AnalysisData }) {
    const [selectedEvent, setSelectedEvent] = React.useState<string | null>(null);
    const isMobile = useIsMobile();
    const { auditMode, setActiveTooltipId } = useAuditMode();

    const { nd = 0, nm = 0, nl_electric = 0, nl_data = 0, ni_electric = 0, ni_data = 0 } = data.calculations;
    const nl = nl_electric + nl_data;
    const ni = ni_electric + ni_data;
    const eventValues: Record<string, number> = { ND: nd, NM: nm, NL: nl, NI: ni };

    const chartData = eventsConfig.map(e => ({ name: e.name, value: eventValues[e.name] || 1e-15, fill: e.color }));
    const yMax = Math.max(...chartData.map(d => d.value)) || 1e-6;

    const isNgMissing = !data.ng || data.ng <= 0;

    return (
        <div className="space-y-4" onClick={() => setSelectedEvent(null)}>
            {/* Bloco 1: Painel de Dados (ND, NM, NL, NI) */}
            <Card className="relative overflow-hidden border border-white/10 bg-slate-950/40 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 opacity-50" />
                
                <div className="pt-6 px-6">
                    <div className="flex justify-center mb-6">
                        <span className="px-6 py-2 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-black/40 flex items-center justify-center text-center">
                             Frequência Média de Eventos Danosos
                        </span>
                    </div>

                    <CardContent className="space-y-8 p-0 pb-8">
                        {isNgMissing && (
                            <Alert className="border-red-500/30 bg-red-500/5 text-red-300 rounded-3xl mx-6">
                                <AlertTriangle className="w-4 h-4" />
                                <AlertTitle className="text-xs font-black uppercase tracking-widest">Atenção!</AlertTitle>
                                <AlertDescription className="text-[10px] opacity-80">Ng não definido. Ajuste na Etapa 3.</AlertDescription>
                            </Alert>
                        )}

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 px-4 sm:px-6">
                            {eventsConfig.map(event => {
                                const value = eventValues[event.name] || 0;
                                const { period, unit } = formatFrequencyAsPeriod(value);
                                const isSelected = selectedEvent === event.name;

                                return (
                                    <div 
                                        key={event.name}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedEvent(current => current === event.name ? null : event.name);
                                            setActiveTooltipId(null);
                                        }}
                                        className={`relative p-3 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-300 cursor-pointer group hover:scale-[1.03] ${isSelected ? 'bg-blue-500/20 border-blue-500/60 shadow-xl' : 'bg-slate-950/60 border-white/10 hover:bg-slate-900/90 shadow-2xl shadow-black/40'}`}
                                    >
                                        <div className="flex items-start justify-between gap-1 mb-1 sm:mb-2">
                                            <div className="flex items-center gap-1 sm:gap-2">
                                                <span className="text-[9px] sm:text-[11px] font-black tracking-tight whitespace-nowrap">
                                                    <span className="text-blue-400 uppercase tracking-widest">{event.name}</span>
                                                    <span className="hidden sm:inline mx-1.5 text-slate-500 font-normal">-</span>
                                                    <span className="hidden sm:inline text-slate-100 uppercase tracking-tighter opacity-90">{event.description}</span>
                                                </span>
                                            </div>
                                            <Home className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600 group-hover:text-amber-500/50 transition-colors" />
                                        </div>
                                        <div className="flex flex-col items-center text-center">
                                            <span className="text-xl sm:text-4xl font-black text-white group-hover:scale-110 transition-transform origin-center leading-none mb-1">{period}</span>
                                            <span className="text-[8px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest opacity-90 leading-none">{unit}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </div>
            </Card>

            {/* Bloco 2: Gráfico em Card Separado (Igual à Etapa 7) */}
            <div className="flex justify-center mt-6 mb-4">
                <span className="px-6 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-black/40 flex items-center justify-center text-center">
                    Gráfico Comparativo de Eventos
                </span>
            </div>
            <Card 
                className="relative overflow-hidden border border-white/10 bg-slate-950/40 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                 <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 opacity-20" />
                 <CardContent className="h-[15.2rem] pt-6 pb-2 flex flex-col">
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%" className="outline-none focus:outline-none">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} className="outline-none focus:outline-none">
                                <defs>
                                    <linearGradient id="glassBlue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.7} />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    </linearGradient>
                                    <linearGradient id="glassRed" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#ef4444" stopOpacity={0.7} />
                                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
                                    </linearGradient>
                                    <linearGradient id="glassEmerald" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.7} />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
                                    </linearGradient>
                                    <linearGradient id="glassAmber" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.7} />
                                        <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.3} />
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
                                                setSelectedEvent(payload.value);
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
                                    domain={[0, yMax * 1.1]} 
                                    allowDataOverflow={true}
                                    tickFormatter={(tick) => tick < 0.01 && tick > 0 ? tick.toExponential(1) : tick.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                                    tick={{ fill: '#64748b', fontSize: 10 }} 
                                    axisLine={false} 
                                    tickLine={false} 
                                    hide={!auditMode && !isMobile}
                                />
                                <Bar 
                                    dataKey="value" 
                                    radius={[4, 4, 0, 0]} 
                                    barSize={80}
                                    minPointSize={10}
                                >
                                    {chartData.map((entry, index) => {
                                        const name = entry.name.toUpperCase();
                                        let fillUrl = "url(#glassBlue)";
                                        let strokeColor = "#3b82f6";
                                        
                                        if (name === 'NM') { fillUrl = "url(#glassRed)"; strokeColor = "#ef4444"; }
                                        else if (name === 'NL') { fillUrl = "url(#glassEmerald)"; strokeColor = "#10b981"; }
                                        else if (name === 'NI') { fillUrl = "url(#glassAmber)"; strokeColor = "#f59e0b"; }

                                        return (
                                            <Cell 
                                                key={`cell-e-${index}`} 
                                                fill={fillUrl} 
                                                stroke={strokeColor}
                                                strokeWidth={0.8}
                                                strokeOpacity={1}
                                                fillOpacity={selectedEvent === null || selectedEvent === entry.name ? 1 : 0.2}
                                                className="transition-all duration-300 cursor-pointer outline-none"
                                                onClick={(e: any) => {
                                                    if (e && e.stopPropagation) e.stopPropagation();
                                                    setSelectedEvent(entry.name);
                                                    setActiveTooltipId(null);
                                                }}
                                            />
                                        );
                                    })}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mt-2 pt-2 border-t border-white/5 px-6">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                            <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Nd (Estrutura)</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                            <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Nm (Próximo)</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                            <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Nl (Linha)</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                            <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Ni (Próx. Linha)</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {selectedEvent && auditMode && (
                <EventEditorialPortal 
                    eventKey={selectedEvent} 
                    data={data} 
                    onClose={() => setSelectedEvent(null)} 
                />
            )}
        </div>
    );
}