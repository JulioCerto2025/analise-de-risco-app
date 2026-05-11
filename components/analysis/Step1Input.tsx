import React from 'react';
import { Label, Card, CardContent, CardHeader, CardTitle, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, FormulaTooltip, Input, Button, InfoTooltip } from '../ui';
import { Building, PlusCircle, XCircle, Info } from "lucide-react";
import { DecimalInput } from "../DecimalInput";
import { AnalysisData } from '../../types';
import { CD_OPTIONS } from '../../constants';
import { formatSmartNumber } from '../../lib/format';

interface Step1InputProps {
    data: AnalysisData;
    onUpdate: (newData: Partial<AnalysisData>) => void;
}

const ResultBox = ({ label, value, unit, color, formula, formulaKey, formulaValues, extraFormulas, extraValues }: { label: React.ReactNode; value: number; unit: string; color: string; formula?: string; formulaKey?: string; formulaValues?: { [key: string]: any }, extraFormulas?: { [key: string]: string }, extraValues?: { [key: string]: any } }) => {
    const colorClasses: { [key: string]: { bg: string, text: string } } = {
        blue: { bg: "bg-slate-500/10 backdrop-blur-sm border border-white/5", text: "text-white" },
        purple: { bg: "bg-purple-500/10 backdrop-blur-sm border border-white/5", text: "text-white" },
        green: { bg: "bg-emerald-500/10 backdrop-blur-sm border border-white/5", text: "text-white" },
    };
    const { bg, text } = colorClasses[color] || colorClasses.blue;

    const displayValue = formatSmartNumber(value, { maxDecimals: 2, useScientificBelow: 0 });
    
    const content = (
        <div className={`w-full p-3 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-blue-500/30 ${bg}`}>
            <div className={`font-black text-xl md:text-2xl tracking-tighter ${text}`}>{displayValue}</div>
            <div className="font-black text-[9px] uppercase tracking-[0.2em] text-slate-400 mt-1 flex items-center justify-center gap-1 leading-none mr-[-0.2em]">
                {label} <span className="opacity-60">({unit})</span>
            </div>
        </div>
    );

    const formulasObj = {
        ...(extraFormulas || {}),
        ...(formula && formulaKey ? { [formulaKey]: formula } : {}),
    };
    const valuesObj = {
        ...(extraValues || {}),
        ...(formulaValues || {}),
        ...(formulaKey ? { [formulaKey]: value } : {}),
    };

    if (Object.keys(formulasObj).length > 0) {
        return (
            <FormulaTooltip formulas={formulasObj} values={valuesObj} className="w-full block" triggerClassName="w-full cursor-default block">
                {content}
            </FormulaTooltip>
        );
    }

    return content;
};

const DimensionInput = ({ icon, label, id, value, onUpdate, color, tooltipText }: { icon: string; label: string; id: keyof AnalysisData; value: number; onUpdate: (val: number) => void; color: string; tooltipText?: string }) => {
    const colorClasses: { [key: string]: { bg: string, text: string } } = {
        blue: { bg: "bg-blue-500", text: "text-blue-500" },
        green: { bg: "bg-green-500", text: "text-green-500" },
        red: { bg: "bg-red-500", text: "text-red-500" },
        orange: { bg: "bg-orange-500", text: "text-orange-500" },
    };
    const { bg } = colorClasses[color] || colorClasses.blue;

    return (
        <div className="space-y-1">
            <div className="flex items-center gap-1.5">
                <Label htmlFor={String(id)}>{label}</Label>
                {tooltipText && (
                    <InfoTooltip text={tooltipText}>
                        <Info className="w-3 h-3 text-slate-400 hover:text-blue-400 cursor-help transition-colors" />
                    </InfoTooltip>
                )}
            </div>
            <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs ${bg}`}>
                    {icon}
                </div>
                <DecimalInput
                    id={String(id)}
                    value={value}
                    onUpdate={onUpdate}
                    noWrapper
                    className="flex-1"
                />
            </div>
        </div>
    );
};

export function Step1Input({ data, onUpdate }: Step1InputProps) {
    const handleSelectChange = (field: keyof AnalysisData, value: string) => {
        onUpdate({ [field]: parseFloat(value) || 0 });
    };

    const { ad = 0, adp = 0, adf = 0, am = 0, nd = 0, nm = 0 } = data.calculations;

    // Handlers de Zonas (manter criação e nome; remover textos informativos)
    const addZone = () => {
        const defaultLoss = (data.zones && data.zones[0] && data.zones[0].loss_data) ? data.zones[0].loss_data : {};
        const newZone = {
            id: `zone_${Date.now()}`,
            name: `Zona ${data.zones.length + 1}`,
            loss_data: { ...defaultLoss },
        };
        onUpdate({ zones: [...data.zones, newZone] });
    };

    const removeZone = (id: string) => {
        const next = data.zones.filter(z => z.id !== id);
        // Garantir pelo menos 1 zona
        onUpdate({ zones: next.length > 0 ? next : data.zones });
    };

    const renameZone = (id: string, name: string) => {
        const next = data.zones.map(z => z.id === id ? { ...z, name } : z);
        onUpdate({ zones: next });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <div className="flex flex-col gap-4">
            <Card>
                <CardHeader className="py-2">
                    <CardTitle className="flex items-start gap-3">
                        <Building className="w-5 h-5 text-slate-100" />
                        <div className="leading-tight">
                            <div className="text-slate-100 font-semibold">
                                <span className="hidden md:inline">Área Exp. Estrut. (Ad) e Próximo (Am)</span>
                                <span className="md:hidden whitespace-nowrap">A. Exp. Estr. (Ad) e Prox. (Am)</span>
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-1">
                        <div className="mx-auto max-w-sm space-y-2">
                            <span className="block text-center px-3 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-200 font-semibold text-xs tracking-wider uppercase">Dimensões da Estrutura</span>
                            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-blue-950/30 border border-slate-700/50">
                                <DimensionInput icon="L" label="Comprimento" id="l" value={data.l} onUpdate={val => onUpdate({ l: val })} color="blue" />
                                <DimensionInput icon="W" label="Largura" id="w" value={data.w} onUpdate={val => onUpdate({ w: val })} color="green" />
                                <DimensionInput icon="H" label="Altura" id="h" value={data.h} onUpdate={val => onUpdate({ h: val })} color="red" />
                                <DimensionInput icon="Hp" label="Altura Protrusão" id="hp" value={data.hp} onUpdate={val => onUpdate({ hp: val })} color="orange" tooltipText="Refere-se a caixas d'água, chaminés ou torres. IMPORTANTE: Meça sempre do nível do solo (chão) até o topo da estrutura, mesmo que ela esteja sobre o telhado ou na lateral da edificação. Insira o valor total acumulado do chão ao topo." />
                            </div>

                            <div className="hidden lg:block p-4 rounded-2xl bg-blue-950/30 border border-slate-700/50 shadow-inner group transition-all hover:border-amber-500/30 mt-2">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/80 leading-none">Área Manual (A<sub>D</sub>)</span>
                                        <span className="text-[9px] font-medium text-slate-500 uppercase tracking-wider italic">Opcional • Método Gráfico NBR 5419</span>
                                    </div>
                                    <div className="relative w-36">
                                        <input
                                            type="number"
                                            value={data.ad_override ?? ""}
                                            onChange={(e) => onUpdate({ ad_override: e.target.value ? parseFloat(e.target.value) : null })}
                                            className="w-full h-9 bg-black border border-slate-700/50 rounded-xl px-4 text-sm text-center font-bold text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/30 transition-all placeholder:text-slate-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            placeholder="Digitar m²"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-amber-500/20 uppercase pointer-events-none">m²</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <div className="hidden lg:block pt-2 border-t border-slate-700/50 mt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {/* Coluna 1: Estrutura (Adf + Nd) */}
                            <div className="flex flex-col items-center gap-2">
                                <span className="w-full max-w-[210px] px-5 py-2 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-black/40 flex items-center justify-center text-center whitespace-nowrap">Área Expos.</span>
                                <div className="w-full max-w-[210px]">
                                    <ResultBox 
                                        label={<span className="flex items-center gap-1.5"><span className="text-blue-400">A<sub>DF</sub></span></span>} 
                                        value={adf} unit="m² (max)" color="blue" 
                                        formula="max(Ad, Adp)" formulaKey="Adf" 
                                        formulaValues={{ Ad: ad, Adp: adp }}
                                        extraFormulas={{
                                            Ad: data.ad_override ? "Valor Manual (Método Gráfico)" : "L×W+2(3×H)(L+W)+π(3×H)²",
                                            Adp: "π(3×Hp)²", // Usando Adp para dar match com o valor calculado
                                        }}
                                        extraValues={{
                                            L: data.l, W: data.w, H: data.h, Hp: data.hp,
                                            Ad: ad, Adp: adp, Adf: adf,
                                            ...(data.ad_override ? { ad_override: data.ad_override } : {})
                                        }}
                                    />
                                </div>
                                <span className="w-full max-w-[210px] px-5 py-2 rounded-full bg-slate-900 border border-slate-700 text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-black/40 flex items-center justify-center text-center whitespace-nowrap">
                                    <span className="hidden sm:inline">Freq. (Estrutura)</span>
                                    <span className="sm:hidden">Freq. (Estr.)</span>
                                </span>
                                <div className="w-full max-w-[210px]">
                                    <ResultBox 
                                        label={<span className="flex items-center gap-1.5"><span className="text-blue-400">N<sub>D</sub></span></span>} 
                                        value={nd} unit="desc./ano" color="blue" 
                                        formula="Ng × Ad × Cd × 10⁻⁶" 
                                        formulaKey="Nd"
                                        formulaValues={{ Ng: data.ng, Ad: ad, Cd: data.cd }}
                                    />
                                </div>
                            </div>

                            {/* Coluna 2: Próximo (Am + Nm) */}
                            <div className="flex flex-col items-center gap-2">
                                <span className="w-full max-w-[210px] px-5 py-2 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-black/40 flex items-center justify-center text-center whitespace-nowrap">Geom. Magnética</span>
                                <div className="w-full max-w-[210px]">
                                    <ResultBox 
                                        label={<span className="flex items-center gap-1.5"><span className="text-emerald-400">A<sub>M</sub></span></span>} 
                                        value={am} unit="m²" color="green" 
                                        formula="2×500(L+W)+π(500)²" formulaKey="Am" formulaValues={{ L: data.l, W: data.w }}
                                    />
                                </div>
                                <span className="w-full max-w-[210px] px-5 py-2 rounded-full bg-slate-900 border border-slate-700 text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-black/40 flex items-center justify-center text-center whitespace-nowrap">
                                    <span className="hidden sm:inline">Freq. (Próximo)</span>
                                    <span className="sm:hidden">Freq. (Prox.)</span>
                                </span>
                                <div className="w-full max-w-[210px]">
                                    <ResultBox 
                                        label={<span className="flex items-center gap-1.5"><span className="text-emerald-400">N<sub>M</sub></span></span>} 
                                        value={nm} unit="desc./ano" color="green" 
                                        formula="Ng × Am × 10⁻⁶" 
                                        formulaKey="Nm"
                                        formulaValues={{ Ng: data.ng, Am: am }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            </div>

            <div className="w-full space-y-4">
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>CD - Fator de Localização</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select value={String(data.cd)} onValueChange={(val) => handleSelectChange('cd', val)} placeholder="Selecione o fator de localização..." options={CD_OPTIONS}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {CD_OPTIONS.map(opt => <SelectItem key={opt.value} value={String(opt.value)} label={opt.label} />)}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>Zonas de Estudo de Proteção</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {/* Removido: "Quantidade de Zonas" e texto explicativo; mantida apenas a edição/criação */}
                        <div className="space-y-2">
                            {data.zones.map((zone) => (
                                <div key={zone.id} className="flex items-center gap-2">
                                    <Input
                                        value={zone.name}
                                        onChange={(e) => renameZone(zone.id, e.target.value)}
                                        placeholder="Nome da zona"
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => removeZone(zone.id)}
                                        aria-label={`Remover ${zone.name}`}
                                    >
                                        <XCircle className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button type="button" onClick={addZone} className="mt-1">
                            <PlusCircle className="w-4 h-4 mr-2" /> Adicionar zona
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}