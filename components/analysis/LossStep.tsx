import * as React from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent, Label, TabButton, Button, Alert, AlertDescription, Checkbox, useIsMobile, useAuditMode, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Sparkles, Loader2, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { DecimalInput } from "../DecimalInput";
import { AnalysisData, LossData } from '../../types';
import { RP_OPTIONS, RT_OPTIONS, RF_OPTIONS, HZ_OPTIONS, LF_OPTIONS, LO_OPTIONS, LF3_OPTIONS, LF4_OPTIONS, LO4_OPTIONS, LT_OPTIONS } from '../../constants';
import { calculateLossesForZone } from '../../utils/calculations';

const ScientificNotation = ({ value, precision = 2 }: { value: number; precision?: number }) => {
    if (value === 0 || !isFinite(value)) return <span>0</span>;
    const [mantissa, exponent] = value.toExponential(precision).split('e');
    return (
        <span className="font-mono tracking-tight" dangerouslySetInnerHTML={{ __html: `${mantissa.replace('.', ',')}&times;10<sup>${exponent}</sup>` }} />
    );
};

const LossEditorialPortal = ({ label, description, value, onClose }: { label: string; description: string; value: number; onClose: () => void }) => {
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

    return createPortal(
        <div className="fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px] pointer-events-none animate-in fade-in duration-200" />
            <div 
                ref={portalRef}
                className="fixed right-6 top-[100px] w-[min(90vw,500px)] p-6 bg-slate-800/98 border border-blue-500/40 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl z-[9999] animate-in slide-in-from-right-10 fade-in duration-300 pointer-events-auto"
            >
                <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    <p className="font-black text-slate-100 uppercase tracking-[0.2em] text-[10px]">Detalhamento de Perda Editorial</p>
                </div>
                <div className="space-y-6">
                    <div className="flex items-center justify-between bg-slate-900/40 p-4 rounded-2xl border border-white/5">
                        <div className="flex flex-col text-left">
                            <span className="font-black text-slate-100 text-lg uppercase tracking-wider">{label}</span>
                            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-tight">{description}</p>
                        </div>
                        <p className="text-blue-400 font-mono font-black text-xl">
                            <ScientificNotation value={Number(value)} precision={2} />
                        </p>
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

export function LossStep({ data, onChange, forceActiveZoneId }: { data: AnalysisData, onChange: (newData: Partial<AnalysisData>) => void, forceActiveZoneId?: string }) {
    const { zones = [], risks_to_analyze = {} } = data;
    
    const [activeZoneId, setActiveZoneId] = React.useState<string>(data.last_active_zone_id || (zones.length > 0 ? zones[0].id : ''));
    const isMobile = useIsMobile();
    const { auditMode, setActiveTooltipId } = useAuditMode();
    const [selectedLoss, setSelectedLoss] = React.useState<any | null>(null);


    React.useEffect(() => {
        if (zones.length > 0) {
            const id = forceActiveZoneId || data.last_active_zone_id || zones[0].id;
            if (id && id !== activeZoneId) setActiveZoneId(id);
        }
    }, [forceActiveZoneId, data.last_active_zone_id, zones, activeZoneId]);

    const availableTabs = React.useMemo(() => {
        const rta = data.risks_to_analyze || { R1: false, R3: false, R4: false };
        const tabs = [];
        if (rta.R1) {
            tabs.push(
                { id: 'populacao', label: 'População', shortLabel: 'Pop.' }, 
                { id: 'choque', label: 'Choque', shortLabel: 'Chq.' }, 
                { id: 'incendio', label: 'Incêndio', shortLabel: 'Inc.' }, 
                { id: 'equipamentos', label: 'Sistemas', shortLabel: 'Sist.' }
            );
        }
        if (rta.R3) tabs.push({ id: 'cultural', label: 'Patrimônio', shortLabel: 'Patrim.' });
        if (rta.R4) tabs.push({ id: 'economica', label: 'Econômica', shortLabel: 'Econ.' });
        return tabs;
    }, [data.risks_to_analyze]);

    const [activeTab, setActiveTab] = React.useState(availableTabs[0]?.id || '');
    
    React.useEffect(() => {
        if (availableTabs.length > 0 && !availableTabs.find(t => t.id === activeTab)) {
            setActiveTab(availableTabs[0].id);
        }
    }, [availableTabs, activeTab]);

    if (zones.length === 0) {
        return (
            <Card className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm shadow-2xl">
                <CardContent className="p-16 text-center">
                    <p className="text-slate-400 font-black text-[12px] uppercase tracking-[0.3em] leading-relaxed">
                        Crie uma zona primeiro na Etapa 2 para prosseguir com a análise de perdas.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const globalTotals = zones.reduce((acc, z) => {
        const r = calculateLossesForZone(z);
        acc.LA += (r.LA || 0); acc.LB += (r.LB || 0); acc.LC += (r.LC || 0);
        return acc;
    }, { LA: 0, LB: 0, LC: 0 });
    const isGlobal = activeZoneId === 'GLOBAL';
    const currentZone = (zones.find(z => z.id === activeZoneId) || zones[0]);
    const lossData = currentZone?.loss_data || {};
    const l = isGlobal ? globalTotals : calculateLossesForZone(currentZone);

    const chartData = [
        { name: 'LA = LU (Choque)', description: "D1: Choque Elétrico", value: (l.LA || 0), color: '#3b82f6', globalValue: globalTotals.LA },
        { name: 'LB = LV (Incêndio)', description: "D2: Danos Físicos", value: (l.LB || 0), color: '#ef4444', globalValue: globalTotals.LB },
        { name: 'LC = LM... (Sistemas)', description: "D3: Falha de Sistemas", value: (l.LC || 0), color: '#eab308', globalValue: globalTotals.LC },
    ];

    const handleUpdate = (field: keyof LossData, rawValue: number | string) => {
        const value = typeof rawValue === 'string' ? parseFloat(rawValue) : rawValue;
        const finalValue = Number.isFinite(value) ? value : 0;
        
        const nextZones = zones.map(z => {
            if (activeZoneId === 'GLOBAL' || z.id === activeZoneId) {
                const next = { ...z.loss_data, [field]: finalValue } as LossData;
                if (['ca','cb','cc','cs','ce'].includes(field as string)) {
                    next.ct_economic = (Number(next.ca)||0)+(Number(next.cb)||0)+(Number(next.cc)||0)+(Number(next.cs)||0)+(Number(next.ce)||0);
                }
                return { ...z, loss_data: next };
            }
            if (field === 'nt') return { ...z, loss_data: { ...z.loss_data, nt: finalValue } };
            
            return z;
        });
        onChange({ zones: nextZones });
    };

    const handleZoneChange = (newId: string) => {
        setActiveZoneId(newId);
        onChange({ last_active_zone_id: newId });
    };

    const hasMultipleZones = zones.length > 1;
    const viewOrder = hasMultipleZones ? ['GLOBAL', ...zones.map(z => z.id)] : zones.map(z => z.id);
    const activeHeading = activeZoneId === 'GLOBAL' ? 'Ajuste GLOBAL' : (currentZone?.name || 'ZONA ATIVA').toUpperCase();

    const goNextView = () => {
        const currentIdx = viewOrder.indexOf(activeZoneId);
        const nextIdx = (currentIdx + 1) % viewOrder.length;
        handleZoneChange(viewOrder[nextIdx]);
    };
    const goPrevView = () => {
        const currentIdx = viewOrder.indexOf(activeZoneId);
        const prevIdx = (currentIdx - 1 + viewOrder.length) % viewOrder.length;
        handleZoneChange(viewOrder[prevIdx]);
    };

    return (
        <div className="grid grid-cols-1 gap-2 animate-in fade-in duration-500 max-w-6xl w-full mx-auto overflow-visible">
            <Card className="w-full border-slate-700/50 bg-slate-900/60 backdrop-blur-sm shadow-2xl">
                <div className="flex justify-center mt-4 mb-2">
                    <div className="flex items-center gap-2 sm:gap-4 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-slate-950 border border-slate-800 shadow-2xl">
                        {hasMultipleZones && <button onClick={goPrevView} className="p-1 sm:p-1.5 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"><ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5" /></button>}
                        <span className="text-white font-black text-[9px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.3em] min-w-[140px] sm:min-w-[200px] text-center">
                            <span className="sm:hidden">
                                {`Perdas — ${activeHeading}`}
                            </span>
                            <span className="hidden sm:inline">
                                {`Parâmetros de Perda — ${activeHeading}`}
                            </span>
                        </span>
                        {hasMultipleZones && <button onClick={goNextView} className="p-1 sm:p-1.5 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"><ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" /></button>}
                    </div>
                </div>
                <CardContent className="space-y-2 py-2 px-4">

                    {availableTabs.length > 0 && (
                        <div className="flex justify-center mb-2">
                            <div className="flex space-x-1 p-1 bg-slate-800/40 rounded-xl w-full sm:w-fit max-w-full justify-center overflow-x-hidden">
                                {availableTabs.map(tab => (
                                    <TabButton key={tab.id} isActive={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} className="py-2 px-1 min-w-[60px] sm:min-w-[120px] text-[9px] sm:text-[11px]">
                                        <span className="sm:hidden">{tab.shortLabel}</span>
                                        <span className="hidden sm:inline">{tab.label}</span>
                                    </TabButton>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="min-h-[140px] pt-4">
                        {activeTab === 'populacao' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 px-2 pt-2 border-t border-white/5">
                                    <DecimalInput label="Pessoas (nz)" value={lossData.nz ?? 0} onUpdate={v => handleUpdate('nz', v)} min={0} className="w-full max-w-[100px] mx-auto text-center" />
                                    <DecimalInput label="Total (nt)" value={lossData.nt ?? 1} onUpdate={v => handleUpdate('nt', v)} min={1} className="w-full max-w-[100px] mx-auto text-center" />
                                    <DecimalInput label="Horas (tz)" value={lossData.tz ?? 8760} onUpdate={v => handleUpdate('tz', v)} min={0} max={8760} className="w-full max-w-[100px] mx-auto text-center" />
                                </div>
                            </div>
                        )}
                        {activeTab === 'incendio' && (
                            <div className="space-y-6 pt-2 border-t border-white/5">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
                                    <SelectInput label="LF - Danos Físicos" value={lossData.LF} options={LF_OPTIONS} onUpdate={v => handleUpdate('LF', v)} />
                                    <SelectInput label="rf - Risco Incêndio" value={lossData.rf} options={RF_OPTIONS} onUpdate={v => handleUpdate('rf', v)} />
                                    <SelectInput label="rp - Proteções" value={lossData.rp} options={RP_OPTIONS} onUpdate={v => handleUpdate('rp', v)} />
                                    <SelectInput label="hz - Risco Pânico" value={lossData.hz} options={HZ_OPTIONS} onUpdate={v => handleUpdate('hz', v)} />
                                </div>
                            </div>
                        )}
                        {activeTab === 'choque' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-2 border-t border-white/5">
                                <SelectInput label="rt - Resistência Piso" value={lossData.rt ?? 0.01} options={RT_OPTIONS} onUpdate={v => handleUpdate('rt', v)} />
                                <SelectInput label="LT - Choque" value={(lossData as any).lt ?? 0.01} options={LT_OPTIONS} onUpdate={v => handleUpdate('lt' as any, v)} />
                            </div>
                        )}
                        {activeTab === 'equipamentos' && (
                            <div className="max-w-xs mx-auto">
                                <SelectInput label="LO - Falha de Sistemas" value={lossData.LO ?? 0.001} options={LO_OPTIONS} onUpdate={v => handleUpdate('LO', v)} />
                            </div>
                        )}
                        {activeTab === 'cultural' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2 border-t border-white/5">
                                <SelectInput label="Lf3 - Tipo Dano" value={lossData.lf3} options={LF3_OPTIONS} onUpdate={v => handleUpdate('lf3', v)} />
                                <DecimalInput label="cz - Patrimônio" value={lossData.cz ?? 0} onUpdate={v => handleUpdate('cz', v)} className="w-full max-w-[120px] mx-auto text-center" />
                                <DecimalInput label="ct - Valor Total" value={lossData.ct_cultural ?? 1} onUpdate={v => handleUpdate('ct_cultural', v)} className="w-full max-w-[120px] mx-auto text-center" />
                            </div>
                        )}
                        {activeTab === 'economica' && (
                            <div className="space-y-6 pt-2 border-t border-white/5">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <SelectInput label="lf4 - Dano Físico" value={lossData.lf4} options={LF4_OPTIONS} onUpdate={v => handleUpdate('lf4', v)} />
                                    <SelectInput label="lo4 - Falha Perda" value={lossData.lo4} options={LO4_OPTIONS} onUpdate={v => handleUpdate('lo4', v)} />
                                    <SelectInput label="lt4 - Choque" value={(lossData as any).lt4} options={LT_OPTIONS} onUpdate={v => handleUpdate('lt4' as any, v)} />
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-4 border-t border-white/5">
                                    <DecimalInput label="Anim. (ca)" value={lossData.ca ?? 0} onUpdate={v => handleUpdate('ca', v)} className="w-full max-w-[100px] mx-auto text-center" />
                                    <DecimalInput label="Edif. (cb)" value={lossData.cb ?? 0} onUpdate={v => handleUpdate('cb', v)} className="w-full max-w-[100px] mx-auto text-center" />
                                    <DecimalInput label="Cont. (cc)" value={lossData.cc ?? 0} onUpdate={v => handleUpdate('cc', v)} className="w-full max-w-[100px] mx-auto text-center" />
                                    <DecimalInput label="Sist. (cs)" value={lossData.cs ?? 0} onUpdate={v => handleUpdate('cs', v)} className="w-full max-w-[100px] mx-auto text-center" />
                                    <DecimalInput label="Ativ. (ce)" value={lossData.ce ?? 0} onUpdate={v => handleUpdate('ce', v)} className="w-full max-w-[100px] mx-auto text-center" />
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-center mt-3 mb-2">
                <span className="px-5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-black/40">
                    {`Gráfico de Perdas — ${activeHeading}`}
                </span>
            </div>
            <Card 
                className="relative overflow-hidden border-slate-700/30 bg-slate-900/40 backdrop-blur-md shadow-xl shadow-black/20 group"
                onClick={(e) => e.stopPropagation()}
            >
                <CardContent className="h-[13.5rem] pt-4 pb-2 flex flex-col">
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%" className="outline-none focus:outline-none">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }} className="outline-none focus:outline-none">
                                <defs>
                                    <linearGradient id="glassShockLoss" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.7} />
                                        <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.5} />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    </linearGradient>
                                    <linearGradient id="glassFireLoss" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.7} />
                                        <stop offset="50%" stopColor="#f43f5e" stopOpacity={0.5} />
                                        <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.3} />
                                    </linearGradient>
                                    <linearGradient id="glassSystemsLoss" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.7} />
                                        <stop offset="50%" stopColor="#94a3b8" stopOpacity={0.5} />
                                        <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.3} />
                                    </linearGradient>
                                </defs>
                                <Tooltip cursor={false} content={<></>} />
                                <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} strokeOpacity={0.1} />
                                <XAxis 
                                    dataKey="name" 
                                    tick={(props) => {
                                        const { x, y, payload, index } = props;
                                        return (
                                            <g transform={`translate(${x},${y})`} className="cursor-pointer group outline-none" onClick={() => {
                                                setSelectedLoss(chartData[index]);
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
                                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Bar 
                                    dataKey="value" 
                                    radius={[4, 4, 0, 0]} 
                                    barSize={100}
                                    minPointSize={10}
                                >
                                    {chartData.map((entry, index) => {
                                        const name = entry.name.toUpperCase();
                                        let fillUrl = "url(#glassSystemsLoss)";
                                        let strokeColor = "#cbd5e1"; 
                                        
                                        if (name.includes('LA')) {
                                            fillUrl = "url(#glassShockLoss)";
                                            strokeColor = "#3b82f6";
                                        }
                                        if (name.includes('LB')) {
                                            fillUrl = "url(#glassFireLoss)";
                                            strokeColor = "#f43f5e";
                                        }
                                        
                                        return (
                                            <Cell 
                                                key={`cell-l-${index}`} 
                                                fill={fillUrl} 
                                                stroke={strokeColor} 
                                                strokeWidth={0.8} 
                                                strokeOpacity={1} 
                                                className="transition-all duration-300 cursor-pointer outline-none"
                                                onClick={(e: any) => {
                                                    if (e && e.stopPropagation) e.stopPropagation();
                                                    setSelectedLoss(entry);
                                                    setActiveTooltipId(null);
                                                }}
                                            />
                                        );
                                    })}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-white/5 px-8">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                            <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Choque (LA)</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]" />
                            <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Incêndio (LB)</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#94a3b8]" />
                            <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Sistemas (LC)</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {selectedLoss && auditMode && (
                <LossEditorialPortal 
                    label={selectedLoss.name} 
                    description={selectedLoss.description} 
                    value={selectedLoss.value} 
                    onClose={() => setSelectedLoss(null)} 
                />
            )}
        </div>
    );
}

function SelectInput({ label, value, options, onUpdate }: { label: string; value: number | undefined; options: { value: number; label: string }[]; onUpdate: (val: number) => void }) {
    // Garantir que o valor seja uma string comparável e tratar undefined adequadamente
    const stringValue = value !== undefined ? value.toString() : "";
    
    return (
        <div className="space-y-1.5 w-full flex flex-col items-center text-center">
            <Label className="text-[11px] font-black uppercase tracking-widest text-white leading-snug mb-1">{label}</Label>
            <Select value={stringValue} onValueChange={(v) => onUpdate(parseFloat(v))} options={options}>
                <SelectTrigger className="h-10 text-xs px-3 bg-slate-950/70 border-slate-700 w-full max-w-[320px] focus:ring-1 focus:ring-blue-500/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                    {options.map(opt => (
                        <SelectItem key={opt.value} value={opt.value.toString()} label={opt.label} />
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
