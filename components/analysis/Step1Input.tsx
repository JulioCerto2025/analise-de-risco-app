import React from 'react';
import { Label, Card, CardContent, CardHeader, CardTitle, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, FormulaTooltip, Input, Button } from '../ui';
import { Building, PlusCircle, XCircle } from "lucide-react";
import { DecimalInput } from "../DecimalInput";
import { AnalysisData } from '../../types';
import { CD_OPTIONS } from '../../constants';

interface Step1InputProps {
    data: AnalysisData;
    onUpdate: (newData: Partial<AnalysisData>) => void;
}

const ResultBox = ({ label, value, unit, color }: { label: React.ReactNode; value: number; unit: string; color: string; }) => {
    const colorClasses: { [key: string]: { bg: string, text: string } } = {
        blue: { bg: "bg-blue-950/80", text: "text-white" },
        purple: { bg: "bg-purple-950/80", text: "text-white" },
        green: { bg: "bg-green-950/80", text: "text-white" },
    };
    const { bg, text } = colorClasses[color] || colorClasses.blue;

    return (
        <div className={`p-4 rounded-lg flex flex-col items-center justify-center text-center ${bg}`}>
            <div className={`font-bold text-2xl ${text}`}>{value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</div>
            <div className={`font-semibold text-xs text-slate-200 mt-1 flex items-center justify-center gap-1`}>
                {label} <span>({unit})</span>
            </div>
        </div>
    );
};

const DimensionInput = ({ icon, label, id, value, onUpdate, color }: { icon: string; label: string; id: keyof AnalysisData; value: number; onUpdate: (val: number) => void; color: string }) => {
    const colorClasses: { [key: string]: { bg: string, text: string } } = {
        blue: { bg: "bg-blue-500", text: "text-blue-500" },
        green: { bg: "bg-green-500", text: "text-green-500" },
        red: { bg: "bg-red-500", text: "text-red-500" },
        orange: { bg: "bg-orange-500", text: "text-orange-500" },
    };
    const { bg } = colorClasses[color] || colorClasses.blue;

    return (
        <div className="relative">
            <div className={`absolute top-1/2 -translate-y-1/2 left-3 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs ${bg}`}>
                {icon}
            </div>
            <DecimalInput
                label={label}
                id={id}
                value={value}
                onUpdate={onUpdate}
                className="pl-11"
            />
        </div>
    );
};

export function Step1Input({ data, onUpdate }: Step1InputProps) {
    const handleSelectChange = (field: keyof AnalysisData, value: string) => {
        onUpdate({ [field]: parseFloat(value) || 0 });
    };

    const { ad = 0, adp = 0, adf = 0, am = 0 } = data.calculations;
    const { zones = [] } = data;

    const handleAddZone = () => {
        const newZone = { id: `zone_${Date.now()}`, name: `Zona ${zones.length + 1}`, loss_data: {} };
        onUpdate({ zones: [...zones, newZone] });
    };

    const handleRemoveZone = (zoneId: string) => {
        if (zones.length <= 1) return;
        onUpdate({ zones: zones.filter(z => z.id !== zoneId) });
    };

    const handleZoneNameChange = (zoneId: string, newName: string) => {
        onUpdate({ zones: zones.map(z => z.id === zoneId ? { ...z, name: newName } : z) });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Building className="w-5 h-5 text-slate-100" />Área de Exposição da Estrutura (Ad) e Próximo da Estrutura (Am)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label className="font-semibold text-slate-200">Dimensões da Estrutura</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                            <DimensionInput icon="L" label="Comprimento" id="l" value={data.l} onUpdate={val => onUpdate({ l: val })} color="blue" />
                            <DimensionInput icon="W" label="Largura" id="w" value={data.w} onUpdate={val => onUpdate({ w: val })} color="green" />
                            <DimensionInput icon="H" label="Altura" id="h" value={data.h} onUpdate={val => onUpdate({ h: val })} color="red" />
                            <DimensionInput icon="Hp" label="Altura de Protrusão" id="hp" value={data.hp} onUpdate={val => onUpdate({ hp: val })} color="orange" />
                        </div>
                    </div>
                    <div className="hidden sm:block">
                        <Label className="font-semibold text-slate-200">
                            Resultados da Área de Exposição
                        </Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                            <ResultBox label={<>A<sub>d</sub><FormulaTooltip formulas={{ Ad: "L×W+2(3×H)(L+W)+π(3×H)²" }} values={{ L: data.l, W: data.w, H: data.h }} /></>} value={ad} unit="m²" color="blue" />
                            <ResultBox label={<>A<sub>d'</sub><FormulaTooltip formulas={{ "Ad'": "π(3×Hp)²" }} values={{ Hp: data.hp }}/></>} value={adp} unit="m²" color="purple" />
                            <ResultBox label={<>A<sub>df</sub><FormulaTooltip formulas={{ Adf: "max(Ad, Adp)" }} values={{ Ad: ad, Adp: adp }}/></>} value={adf} unit="m² (max)" color="blue" />
                            <ResultBox label={<>A<sub>m</sub><FormulaTooltip formulas={{ Am: "2×500(L+W)+π(500)²" }} values={{ L: data.l, W: data.w }}/></>} value={am} unit="m²" color="green" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>CD - Fator de Localização (Tabela A.1)</CardTitle>
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

                {/* Zonas de Estudo de Proteção (Etapa 4) */}
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>Zonas de Estudo de Proteção</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-slate-200">Quantidade de Zonas: {zones.length}</Label>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleAddZone} className="flex items-center gap-2">
                                    <PlusCircle className="w-4 h-4" /> Adicionar Zona
                                </Button>
                                <Button variant="outline" onClick={() => handleRemoveZone(zones[zones.length-1]?.id)} className="flex items-center gap-2" disabled={zones.length <= 1}>
                                    <XCircle className="w-4 h-4" /> Remover Última
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {zones.map((zone, idx) => (
                                <div key={zone.id} className="flex items-center gap-3 p-3 rounded-lg border bg-slate-800/50 border-slate-600">
                                    <Label className="text-slate-200 w-28">Zona {idx + 1}</Label>
                                    <Input
                                        value={zone.name}
                                        onChange={(e) => handleZoneNameChange(zone.id, e.target.value)}
                                        placeholder={`Nome da zona ${idx + 1}`}
                                    />
                                    {zones.length > 1 && (
                                        <Button variant="outline" size="sm" onClick={() => handleRemoveZone(zone.id)} className="flex items-center gap-1 text-red-400 hover:bg-red-500/20">
                                            <XCircle className="w-4 h-4" /> Remover
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-slate-400">Defina a quantidade e os nomes das zonas de análise. Mínimo: 1 zona.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}