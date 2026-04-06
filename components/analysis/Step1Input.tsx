import React from 'react';
import { Label, Card, CardContent, CardHeader, CardTitle, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, FormulaTooltip, Input, Button, InfoTooltip } from '../ui';
import { Building, PlusCircle, XCircle, Info } from "lucide-react";
import { DecimalInput } from "../DecimalInput";
import { AnalysisData } from '../../types';
import { CD_OPTIONS } from '../../constants';

interface Step1InputProps {
    data: AnalysisData;
    onUpdate: (newData: Partial<AnalysisData>) => void;
}

const ResultBox = ({ label, value, unit, color, formula, formulaKey, formulaValues, extraFormulas, extraValues }: { label: React.ReactNode; value: number; unit: string; color: string; formula?: string; formulaKey?: string; formulaValues?: { [key: string]: any }, extraFormulas?: { [key: string]: string }, extraValues?: { [key: string]: any } }) => {
    const colorClasses: { [key: string]: { bg: string, text: string } } = {
        blue: { bg: "bg-blue-950/80", text: "text-white" },
        purple: { bg: "bg-purple-950/80", text: "text-white" },
        green: { bg: "bg-green-950/80", text: "text-white" },
    };
    const { bg, text } = colorClasses[color] || colorClasses.blue;

    const content = (
        <div className={`p-3 rounded-lg border border-slate-700 flex flex-col items-center justify-center text-center ${bg}`}>
            <div className={`font-bold text-xl md:text-2xl ${text}`}>{value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</div>
            <div className={`font-semibold text-[10px] text-slate-200 mt-0.5 flex items-center justify-center gap-1`}>
                {label} <span>({unit})</span>
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
    };

    if (Object.keys(formulasObj).length > 0) {
        return (
            <FormulaTooltip formulas={formulasObj} values={valuesObj}>
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

    const { ad = 0, adp = 0, adf = 0, am = 0 } = data.calculations;

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
                <CardHeader className="py-3">
                    <CardTitle className="flex items-start gap-3">
                        <Building className="w-5 h-5 text-slate-100" />
                        <div className="leading-tight">
                            <div className="text-slate-100 font-semibold">
                                Área Exp. Estrut. (Ad) <span className="text-slate-300 font-medium">e Próximo (Am)</span>
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-1">
                    <div className="space-y-1">
                        <span className="inline-block px-3 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-200 font-semibold">Dimensões da Estrutura</span>
                        <div className="grid grid-cols-2 gap-2 mt-0.5 p-2.5 rounded-lg bg-blue-950/30 border border-slate-700">
                            <DimensionInput icon="L" label="Comprimento" id="l" value={data.l} onUpdate={val => onUpdate({ l: val })} color="blue" />
                            <DimensionInput icon="W" label="Largura" id="w" value={data.w} onUpdate={val => onUpdate({ w: val })} color="green" />
                            <DimensionInput icon="H" label="Altura" id="h" value={data.h} onUpdate={val => onUpdate({ h: val })} color="red" />
                            <DimensionInput icon="Hp" label="Altura de Protrusão" id="hp" value={data.hp} onUpdate={val => onUpdate({ hp: val })} color="orange" tooltipText="Refere-se a caixas d'água, chaminés ou torres. IMPORTANTE: Meça sempre do nível do solo (chão) até o topo da estrutura, mesmo que ela esteja sobre o telhado ou na lateral da edificação. Insira o valor total acumulado do chão ao topo." />
                        </div>
                    </div>
                    <div className="hidden sm:block space-y-1">
                        <span className="inline-block px-3 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-200 font-semibold">Resultados da Área de Exposição</span>
                        <div className="grid grid-cols-2 gap-2 mt-0.5 p-2 rounded-lg bg-slate-900/40 border border-slate-700">
                            <ResultBox 
                                label={<span>A<sub>df</sub></span>} 
                                value={adf} unit="m² (max)" color="blue" 
                                formula="max(Ad, Adp)" formulaKey="Adf" 
                                formulaValues={{ Ad: ad, Adp: adp }}
                                extraFormulas={{
                                    Ad: "L×W+2(3×H)(L+W)+π(3×H)²",
                                    "Ad'": "π(3×Hp)²",
                                }}
                                extraValues={{
                                    L: data.l, W: data.w, H: data.h, Hp: data.hp,
                                    Ad: ad, Adp: adp, Adf: adf,
                                }}
                            />
                            <ResultBox 
                                label={<span>A<sub>m</sub></span>} 
                                value={am} unit="m²" color="green" 
                                formula="2×500(L+W)+π(500)²" formulaKey="Am" formulaValues={{ L: data.l, W: data.w }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
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
            </div>

            <div className="w-full">
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