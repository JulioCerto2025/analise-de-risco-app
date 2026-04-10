'use client';

import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent, Label, TabButton, Button, Alert, AlertDescription, Checkbox, useIsMobile, useAuditMode, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Sparkles, Loader2, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { DecimalInput } from "../DecimalInput";
import { AnalysisData, LossData } from '../../types';
import { RP_OPTIONS, RT_OPTIONS, RF_OPTIONS, HZ_OPTIONS, LF_OPTIONS, LO_OPTIONS, LF3_OPTIONS, LF4_OPTIONS, LO4_OPTIONS, LT_OPTIONS } from '../../constants';
import { getFireRiskFactor } from '../../lib/geminiService';
import { calculateLossesForZone } from '../../utils/calculations';

const ScientificNotation = ({ value, precision = 2 }: { value: number; precision?: number }) => {
    if (value === 0 || !isFinite(value)) return <span>0</span>;
    const [mantissa, exponent] = value.toExponential(precision).split('e');
    return (
        <span className="font-mono tracking-tight" dangerouslySetInnerHTML={{ __html: `${mantissa.replace('.', ',')}&times;10<sup>${exponent}</sup>` }} />
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
    const { auditMode } = useAuditMode();
    const isMobile = useIsMobile();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !active || !payload || !payload.length || !auditMode || isMobile) return null;

    return createPortal(
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,500px)] p-6 bg-slate-800/98 border border-blue-500/40 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl z-[9999] animate-in zoom-in-95 fade-in duration-200">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                <p className="font-black text-slate-100 uppercase tracking-[0.2em] text-[10px]">Detalhamento de Perda Editorial</p>
            </div>
            <div className="space-y-6">
                <div className="flex items-center justify-between bg-slate-900/40 p-4 rounded-2xl border border-white/5">
                    <div className="flex flex-col">
                        <span className="font-black text-slate-100 text-lg uppercase tracking-wider">{label}</span>
                        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-tight">{payload[0].payload.description}</p>
                    </div>
                    <p className="text-blue-400 font-mono font-black text-xl">
                        <ScientificNotation value={Number(payload[0].value)} precision={2} />
                    </p>
                </div>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 flex justify-center">
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em]">NBR 5419-2:2026 Audit Ready</p>
            </div>
        </div>,
        document.body
    );
};

export function LossStep({ data, onChange, forceActiveZoneId }: { data: AnalysisData, onChange: (newData: Partial<AnalysisData>) => void, forceActiveZoneId?: string }) {
    const { zones = [], risks_to_analyze = {} } = data;
    
    const [activeZoneId, setActiveZoneId] = useState<string>(data.last_active_zone_id || (zones.length > 0 ? zones[0].id : ''));
    const isMobile = useIsMobile();
    const assistantRef = React.useRef<HTMLDivElement>(null);
    const fireAssistantRef = React.useRef<HTMLDivElement>(null);
    const [isAssistantExpanded, setIsAssistantExpanded] = useState(false);
    const [isFireAssistantExpanded, setIsFireAssistantExpanded] = useState(false);
    const [lastSuggestion, setLastSuggestion] = useState<any>(null);
    const [lastFireSuggestion, setLastFireSuggestion] = useState<any>(null);

    // Heuristic Suggestion Engine - Population
    const getHeuristicSuggestion = (text: string) => {
        text = text.toLowerCase();
        if (text.includes('residencial') || text.includes('apartamento') || text.includes('casa')) {
            const aptMatch = text.match(/(\d+)\s*apartamento/);
            const m2Match = text.match(/(\d+)\s*m/);
            let nz = 15;
            if (aptMatch) nz = parseInt(aptMatch[1]) * 3;
            else if (m2Match) nz = Math.ceil(parseInt(m2Match[1]) / 20);
            return { nz, nt: nz, tz: 6935, label: 'Residencial' };
        } else if (text.includes('escritorio') || text.includes('comercio') || text.includes('comercial')) {
            const m2Match = text.match(/(\d+)\s*m/);
            let nz = 10;
            if (m2Match) nz = Math.ceil(parseInt(m2Match[1]) / 9);
            return { nz, nt: Math.ceil(nz * 1.5), tz: 2500, label: 'Comercial' };
        } else if (text.includes('industria') || text.includes('metalurgica') || text.includes('fabrica')) {
            const funcMatch = text.match(/(\d+)\s*func/);
            let nz = 30;
            if (funcMatch) nz = parseInt(funcMatch[1]);
            return { nz, nt: Math.ceil(nz * 1.1), tz: 2400, label: 'Industrial' };
        } else if (text.includes('igreja') || text.includes('esportivo') || text.includes('estadio') || text.includes('evento')) {
            const m2Match = text.match(/(\d+)\s*m/);
            let nz = 100;
            if (m2Match) nz = Math.ceil(parseInt(m2Match[1]) / 1);
            return { nz, nt: nz * 2, tz: 800, label: 'Reunião de Público' };
        }
        return null;
    };

    // Heuristic Suggestion Engine - Fire
    const getFireHeuristicSuggestion = (text: string) => {
        text = text.toLowerCase();
        let rf = 0.001; // Default low
        let hz = 1;     // Default no panic
        let rp = 1;     // Default no protection
        let labels = [];

        // Fire Risk (rf)
        if (text.includes('explosiv') || text.includes('quimico') || text.includes('gasolin') || text.includes('gas')) {
            rf = 0.1; labels.push('Alto Risco');
        } else if (text.includes('papel') || text.includes('madeira') || text.includes('tecido') || text.includes('alto risco') || text.includes('carga alta')) {
            rf = 0.1; labels.push('Alto Risco/Carga');
        } else if (text.includes('deposito') || text.includes('almoxarifado') || text.includes('medio risco')) {
            rf = 0.01; labels.push('Médio Risco');
        } else if (text.includes('residenc') || text.includes('escritorio') || text.includes('baixo risco')) {
            rf = 0.001; labels.push('Baixo Risco');
        }

        // Panic Risk (hz)
        if (text.includes('hospital') || text.includes('idoso') || text.includes('paciente') || text.includes('dificil evacua') || text.includes('panico extremo')) {
            hz = 10; labels.push('Pânico Extremo');
        } else if (text.includes('estadio') || text.includes('igreja') || text.includes('evento') || text.includes('grande publico')) {
            hz = 5; labels.push('Pânico Elevado');
        } else if (text.includes('predio') || text.includes('apartamento') || text.includes('dormitorio')) {
            hz = 2; labels.push('Pânico Moderado');
        }

        // Protection (rp)
        if (text.includes('sprinkler') || text.includes('chuveiro auto')) {
            rp = 0.2; labels.push('Sprinklers');
        } else if (text.includes('hidrante') || text.includes('alarme auto') || text.includes('brigada')) {
            rp = 0.5; labels.push('Hidrantes/Alarme');
        } else if (text.includes('extintor')) {
            rp = 0.5; labels.push('Extintores');
        }

        return { rf, hz, rp, label: labels.join(' + ') || 'Configuração Sugerida' };
    };

    // Click outside to collapse
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (assistantRef.current && !assistantRef.current.contains(event.target as Node)) {
                setIsAssistantExpanded(false);
            }
            if (fireAssistantRef.current && !fireAssistantRef.current.contains(event.target as Node)) {
                setIsFireAssistantExpanded(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    useEffect(() => {
        if (zones.length > 0) {
            const id = forceActiveZoneId || data.last_active_zone_id || zones[0].id;
            if (id && id !== activeZoneId) setActiveZoneId(id);
        }
    }, [forceActiveZoneId, data.last_active_zone_id, zones, activeZoneId]);

    const availableTabs = useMemo(() => {
        const rta = data.risks_to_analyze || { R1: false, R3: false, R4: false };
        const tabs = [];
        if (rta.R1) {
            tabs.push({ id: 'populacao', label: 'População (R1)' }, { id: 'choque', label: 'Choque (R1)' }, { id: 'incendio', label: 'Incêndio (R1)' }, { id: 'equipamentos', label: 'Equipamentos (R1)' });
        }
        if (rta.R3) tabs.push({ id: 'cultural', label: 'Patrimônio (R3)' });
        if (rta.R4) tabs.push({ id: 'economica', label: 'Perda Econ. (R4)' });
        return tabs;
    }, [data.risks_to_analyze]);

    const [activeTab, setActiveTab] = useState(availableTabs[0]?.id || '');
    
    useEffect(() => {
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
            // Se for GLOBAL ou a zona ativa específica, atualiza
            if (activeZoneId === 'GLOBAL' || z.id === activeZoneId) {
                const next = { ...z.loss_data, [field]: finalValue } as LossData;
                if (['ca','cb','cc','cs','ce'].includes(field as string)) {
                    next.ct_economic = (Number(next.ca)||0)+(Number(next.cb)||0)+(Number(next.cc)||0)+(Number(next.cs)||0)+(Number(next.ce)||0);
                }
                return { ...z, loss_data: next };
            }
            // Sync nt (total de pessoas) se for global ou nt específico
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
        <div className="grid grid-cols-1 gap-2 animate-in fade-in duration-500 max-w-6xl w-full mx-auto overflow-hidden">
            <Card className="w-full border-slate-700/50 bg-slate-900/60 backdrop-blur-sm shadow-2xl">
                <div className="flex justify-center mt-4 mb-2">
                    <div className="flex items-center gap-4 px-6 py-2 rounded-full bg-slate-950 border border-slate-800 shadow-2xl">
                        {hasMultipleZones && <button onClick={goPrevView} className="p-1.5 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"><ChevronLeft className="w-5 h-5" /></button>}
                        <span className="text-white font-black text-[10px] uppercase tracking-[0.3em] min-w-[200px] text-center">
                            {`Parâmetros de Perda — ${activeHeading}`}
                        </span>
                        {hasMultipleZones && <button onClick={goNextView} className="p-1.5 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"><ChevronRight className="w-5 h-5" /></button>}
                    </div>
                </div>
                <CardContent className="space-y-2 py-2 px-4">

                    {availableTabs.length > 0 && (
                        <div className="flex justify-center mb-2">
                            <div className="flex space-x-2 p-1.5 bg-slate-800/40 rounded-xl w-fit min-w-[500px] justify-center overflow-x-auto no-scrollbar">
                                {availableTabs.map(tab => (
                                    <TabButton key={tab.id} isActive={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} className="py-2 min-w-[120px]">
                                        {tab.label}
                                    </TabButton>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="min-h-[140px] pt-4">
                        {activeTab === 'populacao' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 px-2 pt-2 border-t border-white/5">
                                    <DecimalInput label="Pessoas (nz)" value={lossData.nz ?? 0} onUpdate={v => handleUpdate('nz', v)} min={0} className="w-full max-w-[100px] mx-auto text-center" />
                                    <DecimalInput label="Total (nt)" value={lossData.nt ?? 1} onUpdate={v => handleUpdate('nt', v)} min={1} className="w-full max-w-[100px] mx-auto text-center" />
                                    <DecimalInput label="Horas (tz)" value={lossData.tz ?? 8760} onUpdate={v => handleUpdate('tz', v)} min={0} max={8760} className="w-full max-w-[100px] mx-auto text-center" />
                                </div>

                                {/* Intelligent Population Assistant (Collapsible) */}
                                <div 
                                    className={`mt-4 rounded-2xl transition-all duration-500 overflow-hidden border ${
                                        isAssistantExpanded 
                                        ? 'bg-blue-500/10 border-blue-500/30 p-4 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/20' 
                                        : 'bg-blue-500/5 border-blue-500/10 p-2 hover:bg-blue-500/10 cursor-pointer border-dashed'
                                    }`}
                                    onClick={() => !isAssistantExpanded && setIsAssistantExpanded(true)}
                                    ref={assistantRef}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-blue-500/20 rounded-lg">
                                                <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                                            </div>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">
                                                {isAssistantExpanded ? 'Assistente de Estimativa (AVCB)' : 'Clique para assistência inteligente de população e horas'}
                                            </h4>
                                        </div>
                                    </div>
                                    
                                    {isAssistantExpanded && (
                                        <div className="space-y-3 mt-4 animate-in fade-in zoom-in-95 duration-300">
                                            <div className="relative group">
                                                <textarea 
                                                    autoFocus
                                                    placeholder="Pressione ENTER para aplicar: ex: 'Indústria metalúrgica 50 funcionários'..."
                                                    className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none h-16"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            const text = (e.target as HTMLTextAreaElement).value.toLowerCase();
                                                            const sug = getHeuristicSuggestion(text);
                                                            if (sug) {
                                                                handleUpdate('nz', sug.nz);
                                                                handleUpdate('nt', sug.nt);
                                                                handleUpdate('tz', sug.tz);
                                                                setIsAssistantExpanded(false);
                                                            }
                                                        }
                                                        if (e.key === 'Escape') setIsAssistantExpanded(false);
                                                    }}
                                                    onChange={(e) => {
                                                        const text = e.target.value.toLowerCase();
                                                        const sug = getHeuristicSuggestion(text);
                                                        setLastSuggestion(sug);
                                                    }}
                                                />
                                            </div>

                                            {lastSuggestion && (
                                                <button 
                                                    onClick={() => {
                                                        handleUpdate('nz', lastSuggestion.nz);
                                                        handleUpdate('nt', lastSuggestion.nt);
                                                        handleUpdate('tz', lastSuggestion.tz);
                                                        setIsAssistantExpanded(false);
                                                    }}
                                                    className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-500 text-[10px] font-black uppercase tracking-widest text-white rounded-xl transition-all shadow-lg shadow-blue-900/20 border border-blue-400/30 animate-in fade-in duration-300"
                                                >
                                                    <SlidersHorizontal className="w-3 h-3" />
                                                    <span>Aplicar Sugestão: {lastSuggestion.label}</span>
                                                </button>
                                            )}
                                            
                                            <p className="text-[9px] text-center text-slate-500 font-bold uppercase tracking-widest opacity-60">Dica: Pressione ENTER após digitar</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === 'incendio' && (
                            <div className="space-y-6 pt-2 border-t border-white/5">
                                <div className="grid grid-cols-[1.8fr_1fr_1fr_1fr] gap-4 px-2">
                                    <SelectInput label="LF - Danos Físicos" value={lossData.LF} options={LF_OPTIONS} onUpdate={v => handleUpdate('LF', v)} />
                                    <SelectInput label="rf - Risco Incêndio" value={lossData.rf} options={RF_OPTIONS} onUpdate={v => handleUpdate('rf', v)} />
                                    <SelectInput label="rp - Proteções" value={lossData.rp} options={RP_OPTIONS} onUpdate={v => handleUpdate('rp', v)} />
                                    <SelectInput label="hz - Risco Pânico" value={lossData.hz} options={HZ_OPTIONS} onUpdate={v => handleUpdate('hz', v)} />
                                </div>
                                <div className="space-y-4">
                                    {/* Intelligent Fire Assistant (Collapsible - Matches Population Style) */}
                                    <div 
                                        className={`mt-4 rounded-2xl transition-all duration-500 overflow-hidden border ${
                                            isFireAssistantExpanded 
                                            ? 'bg-orange-500/10 border-orange-500/30 p-4 shadow-lg shadow-orange-500/10 ring-1 ring-orange-500/20' 
                                            : 'bg-orange-500/5 border-orange-500/10 p-2 hover:bg-orange-500/10 cursor-pointer border-dashed'
                                        }`}
                                        onClick={() => !isFireAssistantExpanded && setIsFireAssistantExpanded(true)}
                                        ref={fireAssistantRef}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-orange-500/20 rounded-lg">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
                                                </div>
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-300">
                                                    {isFireAssistantExpanded ? 'Assistente de Risco de Incêndio e Pânico' : 'Clique para assistência inteligente de incêndio e pânico'}
                                                </h4>
                                            </div>
                                        </div>
                                        
                                        {isFireAssistantExpanded && (
                                            <div className="space-y-3 mt-4 animate-in fade-in zoom-in-95 duration-300">
                                                <div className="relative group">
                                                    <textarea 
                                                        autoFocus
                                                        placeholder="Pressione ENTER para aplicar: ex: 'Hospital com alto risco de incêndio'..."
                                                        className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all resize-none h-16"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                const text = (e.target as HTMLTextAreaElement).value.toLowerCase();
                                                                const sug = getFireHeuristicSuggestion(text);
                                                                if (sug) {
                                                                    handleUpdate('rf', sug.rf);
                                                                    handleUpdate('hz', sug.hz);
                                                                    handleUpdate('rp', sug.rp);
                                                                    setIsFireAssistantExpanded(false);
                                                                }
                                                            }
                                                            if (e.key === 'Escape') setIsFireAssistantExpanded(false);
                                                        }}
                                                        onChange={(e) => {
                                                            const text = e.target.value.toLowerCase();
                                                            const sug = getFireHeuristicSuggestion(text);
                                                            setLastFireSuggestion(sug);
                                                        }}
                                                    />
                                                </div>

                                                {lastFireSuggestion && (
                                                    <button 
                                                        onClick={() => {
                                                            handleUpdate('rf', lastFireSuggestion.rf);
                                                            handleUpdate('hz', lastFireSuggestion.hz);
                                                            handleUpdate('rp', lastFireSuggestion.rp);
                                                            setIsFireAssistantExpanded(false);
                                                        }}
                                                        className="w-full flex flex-col items-center py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl transition-all shadow-lg shadow-orange-900/20 border border-orange-400/30 animate-in fade-in duration-300"
                                                    >
                                                        <SlidersHorizontal className="w-3 h-3 mb-1" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Aplicar Sugestão</span>
                                                        <span className="text-[8px] opacity-80 font-bold mt-1">{lastFireSuggestion.label}</span>
                                                    </button>
                                                )}
                                                
                                                <p className="text-[9px] text-center text-slate-500 font-bold uppercase tracking-widest opacity-60">Dica: Pressione ENTER após digitar</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'choque' && (
                            <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto pt-2 border-t border-white/5">
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
                            <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-6 pt-2 border-t border-white/5">
                                <SelectInput label="Lf3 - Tipo Dano" value={lossData.lf3} options={LF3_OPTIONS} onUpdate={v => handleUpdate('lf3', v)} />
                                <DecimalInput label="cz - Patrimônio" value={lossData.cz ?? 0} onUpdate={v => handleUpdate('cz', v)} className="w-full max-w-[120px] mx-auto text-center" />
                                <DecimalInput label="ct - Valor Total" value={lossData.ct_cultural ?? 1} onUpdate={v => handleUpdate('ct_cultural', v)} className="w-full max-w-[120px] mx-auto text-center" />
                            </div>
                        )}
                        {activeTab === 'economica' && (
                            <div className="space-y-6 pt-2 border-t border-white/5">
                                <div className="grid grid-cols-3 gap-4">
                                    <SelectInput label="Lf4 - Dano Físico" value={lossData.lf4} options={LF4_OPTIONS} onUpdate={v => handleUpdate('lf4', v)} />
                                    <SelectInput label="Lo4 - Falha Perda" value={lossData.lo4} options={LO4_OPTIONS} onUpdate={v => handleUpdate('lo4', v)} />
                                    <SelectInput label="LT4 - Choque" value={(lossData as any).lt4} options={LT_OPTIONS} onUpdate={v => handleUpdate('lt4' as any, v)} />
                                </div>
                                <div className="grid grid-cols-5 gap-2 pt-4 border-t border-white/5">
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

            <div className="flex justify-center mt-4 mb-2">
                <span className="px-5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-black/40">
                    {`Gráfico de Perdas — ${activeHeading}`}
                </span>
            </div>
            <Card className="relative overflow-hidden border-slate-700/30 bg-slate-900/40 backdrop-blur-md shadow-2xl shadow-black/40 group">
                <CardContent className="h-[18rem] pt-6 pb-2 flex flex-col">
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    {/* Efeito Vidro Safira (Choque) */}
                                    <linearGradient id="glassShockLoss" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.7} />
                                        <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.5} />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    </linearGradient>
                                    
                                    {/* Efeito Vidro Carmim (Incêndio) */}
                                    <linearGradient id="glassFireLoss" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.7} />
                                        <stop offset="50%" stopColor="#f43f5e" stopOpacity={0.5} />
                                        <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.3} />
                                    </linearGradient>
                                    
                                    {/* Efeito Vidro Nevoado (Sistemas) */}
                                    <linearGradient id="glassSystemsLoss" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.7} />
                                        <stop offset="50%" stopColor="#94a3b8" stopOpacity={0.5} />
                                        <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.3} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} strokeOpacity={0.1} />
                                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                                {!isMobile && (
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
                                )}
                                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={100}>
                                    {chartData.map((entry, index) => {
                                        const name = entry.name.toUpperCase();
                                        let fillUrl = "url(#glassSystemsLoss)";
                                        let strokeColor = "#cbd5e1"; // Slate 300 (Cinza Claro)
                                        
                                        if (name.includes('LA')) {
                                            fillUrl = "url(#glassShockLoss)";
                                            strokeColor = "#3b82f6"; // Sapphire
                                        }
                                        if (name.includes('LB')) {
                                            fillUrl = "url(#glassFireLoss)";
                                            strokeColor = "#f43f5e"; // Carmine
                                        }
                                        
                                        return <Cell key={`cell-l-${index}`} fill={fillUrl} stroke={strokeColor} strokeWidth={0.8} strokeOpacity={1} />;
                                    })}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Legenda Discreta e Alinhada Interna */}
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
