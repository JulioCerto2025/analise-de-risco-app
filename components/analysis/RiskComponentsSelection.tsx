import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Checkbox, Label, Input, Button } from '../ui';
import { PlusCircle, XCircle } from 'lucide-react';
import { AnalysisData, Zone } from '../../types';

interface RiskComponentsSelectionProps {
    data: AnalysisData;
    onChange: (newData: Partial<AnalysisData>) => void;
}

const riskTypeOptions = [
    { value: 'R1', label: 'R1 - Vida humana' },
    { value: 'R3', label: 'R3 - Patrimônio cultural' },
    { value: 'R4', label: 'R4 - Valor econômico' },
];

// Re-introducing all components as per the user's image
const sourceOfDamageComponents = {
    S1: [
        { key: 'RA', label: 'RA - Choque' },
        { key: 'RB', label: 'RB - Danos físicos' },
        { key: 'RC', label: 'RC - Falha sist. int.' },
    ],
    S2: [
        { key: 'RM', label: 'RM - Falha sist. int.' },
    ],
    S3: [
        { key: 'RU', label: 'RU - Choque' },
        { key: 'RV', label: 'RV - Danos físicos' },
        { key: 'RW', label: 'RW - Falha sist. int.' },
    ],
    S4: [
        { key: 'RZ', label: 'RZ - Falha sist. int.' },
    ],
};

const sourceOfDamageTitles = {
    S1: "S1- Descarga Atmosférica na Estrutura",
    S2: "S2 - Descarga Atmosférica na Proximidade da Estrutura",
    S3: "S3 - Descarga Atmosférica na Linha",
    S4: "S4 - Descarga Atmosférica na Proximidade da Linha",
};

const PHYSICAL_DAMAGE_COMPONENTS = ['RB', 'RV'];
const SYSTEM_FAILURE_COMPONENTS = ['RC', 'RM', 'RW', 'RZ'];
const ELECTRICAL_SHOCK_COMPONENTS = ['RA', 'RU'];


export function RiskComponentsSelection({ data, onChange }: RiskComponentsSelectionProps) {
    const { selected_risk_components, risks_to_analyze, zones } = data;

    const handleToggle = (component: keyof typeof selected_risk_components) => {
        onChange({
            selected_risk_components: {
                ...selected_risk_components,
                [component]: !selected_risk_components[component]
            }
        });
    };
    
    const handleRiskTypeChange = (risk: keyof typeof risks_to_analyze, checked: boolean) => {
        onChange({
            risks_to_analyze: {
                ...risks_to_analyze,
                [risk]: checked,
            },
        });
    };

    // This function will now toggle all system failure components
    const handleCriticalSystemsToggle = (checked: boolean) => {
        onChange({
            selected_risk_components: {
                ...selected_risk_components,
                RC: checked,
                RM: checked,
                RW: checked,
                RZ: checked,
            }
        });
    };

    const handleAddZone = () => {
        // FIX: Initialize `loss_data` as an empty object to satisfy the `Zone` type requirement.
        const newZone: Zone = {
            id: `zone_${Date.now()}`,
            name: `Zona ${zones.length + 1}`,
            loss_data: {}
        };
        onChange({
            zones: [...zones, newZone]
        });
    };

    const handleRemoveZone = (zoneId: string) => {
        if (zones.length <= 1) return; // Prevent removing the last zone
        onChange({
            zones: zones.filter(zone => zone.id !== zoneId)
        });
    };

    const handleZoneNameChange = (zoneId: string, newName: string) => {
        onChange({
            zones: zones.map(zone =>
                zone.id === zoneId ? { ...zone, name: newName } : zone
            )
        });
    };


    // Check if all system failure components are selected
    const areCriticalsSelected = selected_risk_components.RC && selected_risk_components.RM && selected_risk_components.RW && selected_risk_components.RZ;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <div className="lg:col-span-1 flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Risco de Perda a ser Calculado</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {riskTypeOptions.map(opt => (
                            <div key={opt.value} className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:bg-slate-700/60 transition-colors">
                                <Checkbox
                                    id={opt.value}
                                    checked={risks_to_analyze[opt.value as keyof typeof risks_to_analyze]}
                                    onCheckedChange={(checked) => handleRiskTypeChange(opt.value as keyof typeof risks_to_analyze, !!checked)}
                                />
                                <Label htmlFor={opt.value} className="cursor-pointer flex-1 text-slate-200">{opt.label}</Label>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {risks_to_analyze.R1 && (
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="critical_systems"
                                    checked={areCriticalsSelected}
                                    onCheckedChange={handleCriticalSystemsToggle}
                                />
                                <Label htmlFor="critical_systems" className="cursor-pointer font-medium text-slate-200 flex-1 text-xs">
                                    Perigo à vida por falha de sistema ou equipamento vital?
                                </Label>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="flex flex-col flex-grow">
                    <CardHeader>
                        <CardTitle>Zonas de Análise</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-grow">
                        <div className="flex-grow">
                            {zones.map((zone, index) => (
                                <div key={zone.id} className="flex items-center space-x-2 mb-3">
                                    <Input
                                        value={zone.name}
                                        onChange={(e) => handleZoneNameChange(zone.id, e.target.value)}
                                        placeholder={`Nome da Zona ${index + 1}`}
                                    />
                                    {zones.length > 1 && (
                                        <Button variant="outline" onClick={() => handleRemoveZone(zone.id)} className="px-2 py-1 h-auto text-red-400 hover:bg-red-500/20 flex-shrink-0">
                                            <XCircle className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" onClick={handleAddZone} className="w-full mt-4 flex items-center gap-2">
                            <PlusCircle className="w-4 h-4" /> Adicionar Zona
                        </Button>
                    </CardContent>
                </Card>
            </div>


            <div className="lg:col-span-2 flex flex-col gap-6">
                {Object.entries(sourceOfDamageComponents).map(([sourceKey, components]) => (
                    <Card key={sourceKey}>
                        <CardHeader className="py-4">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-200">
                                {sourceOfDamageTitles[sourceKey as keyof typeof sourceOfDamageTitles]}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {components.map(({ key, label }) => {
                                    const isSystemFailure = SYSTEM_FAILURE_COMPONENTS.includes(key);
                                    const isPhysicalDamage = PHYSICAL_DAMAGE_COMPONENTS.includes(key);
                                    const isElectricalShock = ELECTRICAL_SHOCK_COMPONENTS.includes(key);
                                    
                                    const baseClasses = "flex items-center space-x-3 p-3 rounded-lg border transition-colors";
                                    let colorClasses = "bg-slate-800/50 border-slate-600 hover:bg-slate-700/60"; // Default
                                    
                                    if (isSystemFailure) {
                                        colorClasses = "bg-emerald-950/60 border-emerald-700/60 hover:bg-emerald-900/70";
                                    } else if (isPhysicalDamage) {
                                        colorClasses = "bg-red-950/60 border-red-700/60 hover:bg-red-900/70";
                                    } else if (isElectricalShock) {
                                        colorClasses = "bg-blue-950/60 border-blue-700/60 hover:bg-blue-900/70";
                                    }
                                    
                                    let gridPositionClass = '';
                                    if (sourceKey === 'S2' || sourceKey === 'S4') {
                                        gridPositionClass = ' col-start-2 md:col-start-3';
                                    }

                                    const itemClassName = `${baseClasses} ${colorClasses}${gridPositionClass}`;

                                    return (
                                        <div key={key} className={itemClassName}>
                                            <Checkbox
                                                id={key}
                                                checked={selected_risk_components[key as keyof typeof selected_risk_components]}
                                                onCheckedChange={() => handleToggle(key as keyof typeof selected_risk_components)}
                                            />
                                            <Label htmlFor={key} className="cursor-pointer flex-1 text-sm text-slate-200">{label}</Label>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}