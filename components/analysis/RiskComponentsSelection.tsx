import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Checkbox, Label } from '../ui';
import { PlusCircle, XCircle } from 'lucide-react';
import { AnalysisData } from '../../types';

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
    S1: "S1- Raio na Estrutura",
    S2: "S2 - Raio Próx. Estrut.",
    S3: "S3 - Raio na Linha",
    S4: "S4 - Raio Próx. Linha",
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

    // Card de Zonas reposicionado para RiskResultsStep


    // Check if all system failure components are selected
    const areCriticalsSelected = selected_risk_components.RC && selected_risk_components.RM && selected_risk_components.RW && selected_risk_components.RZ;

    return (
        <div className="grid grid-cols-1 gap-6 items-start">
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Risco de Perda a ser Calculado</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {riskTypeOptions.map(opt => (
                            <div key={opt.value} className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-600 hover:bg-slate-700/60 transition-colors w-full">
                                <Checkbox
                                    id={opt.value}
                                    checked={risks_to_analyze[opt.value as keyof typeof risks_to_analyze]}
                                    onCheckedChange={(checked) => handleRiskTypeChange(opt.value as keyof typeof risks_to_analyze, !!checked)}
                                />
                                <Label htmlFor={opt.value} className="cursor-pointer text-slate-200 text-base whitespace-nowrap">{opt.label}</Label>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {risks_to_analyze.R1 && (
                    <Card className="w-fit">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="critical_systems"
                                    checked={areCriticalsSelected}
                                    onCheckedChange={handleCriticalSystemsToggle}
                                />
                                <Label htmlFor="critical_systems" className="cursor-pointer font-medium text-slate-200 text-xs">
                                    Perigo à vida por falha de sistema ou equipamento vital?
                                </Label>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Zonas movido para Etapa 4 */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/** Card combinado: S1 + S2 (Estrutura) */}
                <Card className="h-fit w-full lg:order-1">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-200">S1/S2 - Estrutura</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {/* Wrapper com barra contínua */}
                        <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-0 items-start">
                            {/* Cabeçalho esquerdo (S1) */}
                            <div className="sm:col-span-1 text-xs font-semibold text-slate-300 mb-3 flex items-center gap-2 sm:pr-4">
                                <span className="px-2 py-0.5 rounded bg-slate-700/60">S1</span>
                                <span>Descarga Atm. Direta</span>
                            </div>
                            {/* Cabeçalho direito (S2) */}
                            <div className="sm:col-span-1 text-xs font-semibold text-slate-300 mb-3 flex items-center gap-2 sm:pl-4">
                                <span className="px-2 py-0.5 rounded bg-slate-700/60">S2</span>
                                <span>Desc. Atm. Próxima</span>
                            </div>
                            {/* Lista esquerda (S1) */}
                            <div className="sm:col-span-1 space-y-2 sm:pr-4">
                                {sourceOfDamageComponents.S1.map(({ key, label }) => {
                                    const isSystemFailure = SYSTEM_FAILURE_COMPONENTS.includes(key);
                                    const isPhysicalDamage = PHYSICAL_DAMAGE_COMPONENTS.includes(key);
                                    const isElectricalShock = ELECTRICAL_SHOCK_COMPONENTS.includes(key);
                                    const baseClasses = "flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg border transition-colors w-full";
                                    let colorClasses = "bg-slate-800/50 border-slate-600 hover:bg-slate-700/60";
                                    if (isSystemFailure) colorClasses = "bg-emerald-950/60 border-emerald-700/60 hover:bg-emerald-900/70";
                                    else if (isPhysicalDamage) colorClasses = "bg-red-950/60 border-red-700/60 hover:bg-red-900/70";
                                    else if (isElectricalShock) colorClasses = "bg-blue-950/60 border-blue-700/60 hover:bg-blue-900/70";
                                    return (
                                        <div key={key}>
                                            <div className={`${baseClasses} ${colorClasses}`}>
                                                <Checkbox id={key} checked={selected_risk_components[key as keyof typeof selected_risk_components]} onCheckedChange={() => handleToggle(key as keyof typeof selected_risk_components)} />
                                                <Label htmlFor={key} className="cursor-pointer flex-1 text-xs md:text-sm text-slate-200 whitespace-nowrap">{label}</Label>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* Lista direita (S2) */}
                            <div className="sm:col-span-1 sm:pl-4">
                                <div className="grid grid-rows-3 gap-2">
                                    {sourceOfDamageComponents.S2.map(({ key, label }) => {
                                        const isSystemFailure = SYSTEM_FAILURE_COMPONENTS.includes(key);
                                        const isPhysicalDamage = PHYSICAL_DAMAGE_COMPONENTS.includes(key);
                                        const isElectricalShock = ELECTRICAL_SHOCK_COMPONENTS.includes(key);
                                        const baseClasses = "flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg border transition-colors w-full";
                                        let colorClasses = "bg-slate-800/50 border-slate-600 hover:bg-slate-700/60";
                                        if (isSystemFailure) colorClasses = "bg-emerald-950/60 border-emerald-700/60 hover:bg-emerald-900/70";
                                        else if (isPhysicalDamage) colorClasses = "bg-red-950/60 border-red-700/60 hover:bg-red-900/70";
                                        else if (isElectricalShock) colorClasses = "bg-blue-950/60 border-blue-700/60 hover:bg-blue-900/70";
                                        return (
                                            <div key={key} className="row-start-3">
                                                <div className={`${baseClasses} ${colorClasses}`}>
                                                    <Checkbox id={key} checked={selected_risk_components[key as keyof typeof selected_risk_components]} onCheckedChange={() => handleToggle(key as keyof typeof selected_risk_components)} />
                                                    <Label htmlFor={key} className="cursor-pointer flex-1 text-xs md:text-sm text-slate-200 whitespace-nowrap">{label}</Label>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            {/* Barra contínua central */}
                            <div className="hidden sm:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-slate-400/80" />
                        </div>
                    </CardContent>
                </Card>

                {/** Card combinado: S3 + S4 (Linha) */}
                <Card className="h-fit w-full lg:order-2">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-200">S3/S4 - Linha</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {/* Wrapper com barra contínua */}
                        <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-0 items-start">
                            {/* Cabeçalho esquerdo (S3) */}
                            <div className="sm:col-span-1 text-xs font-semibold text-slate-300 mb-3 flex items-center gap-2 sm:pr-4">
                                <span className="px-2 py-0.5 rounded bg-slate-700/60">S3</span>
                                <span>Descarga Atm. Direta</span>
                            </div>
                            {/* Cabeçalho direito (S4) */}
                            <div className="sm:col-span-1 text-xs font-semibold text-slate-300 mb-3 flex items-center gap-2 sm:pl-4">
                                <span className="px-2 py-0.5 rounded bg-slate-700/60">S4</span>
                                <span>Desc. Atm. Próxima</span>
                            </div>
                            {/* Lista esquerda (S3) */}
                            <div className="sm:col-span-1 space-y-2 sm:pr-4">
                                {sourceOfDamageComponents.S3.map(({ key, label }) => {
                                    const isSystemFailure = SYSTEM_FAILURE_COMPONENTS.includes(key);
                                    const isPhysicalDamage = PHYSICAL_DAMAGE_COMPONENTS.includes(key);
                                    const isElectricalShock = ELECTRICAL_SHOCK_COMPONENTS.includes(key);
                                    const baseClasses = "flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg border transition-colors w-full";
                                    let colorClasses = "bg-slate-800/50 border-slate-600 hover:bg-slate-700/60";
                                    if (isSystemFailure) colorClasses = "bg-emerald-950/60 border-emerald-700/60 hover:bg-emerald-900/70";
                                    else if (isPhysicalDamage) colorClasses = "bg-red-950/60 border-red-700/60 hover:bg-red-900/70";
                                    else if (isElectricalShock) colorClasses = "bg-blue-950/60 border-blue-700/60 hover:bg-blue-900/70";
                                    return (
                                        <div key={key}>
                                            <div className={`${baseClasses} ${colorClasses}`}>
                                                <Checkbox id={key} checked={selected_risk_components[key as keyof typeof selected_risk_components]} onCheckedChange={() => handleToggle(key as keyof typeof selected_risk_components)} />
                                                <Label htmlFor={key} className="cursor-pointer flex-1 text-xs md:text-sm text-slate-200 whitespace-nowrap">{label}</Label>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* Lista direita (S4) */}
                            <div className="sm:col-span-1 sm:pl-4">
                                <div className="grid grid-rows-3 gap-2">
                                    {sourceOfDamageComponents.S4.map(({ key, label }) => {
                                        const isSystemFailure = SYSTEM_FAILURE_COMPONENTS.includes(key);
                                        const isPhysicalDamage = PHYSICAL_DAMAGE_COMPONENTS.includes(key);
                                        const isElectricalShock = ELECTRICAL_SHOCK_COMPONENTS.includes(key);
                                        const baseClasses = "flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg border transition-colors w-full";
                                        let colorClasses = "bg-slate-800/50 border-slate-600 hover:bg-slate-700/60";
                                        if (isSystemFailure) colorClasses = "bg-emerald-950/60 border-emerald-700/60 hover:bg-emerald-900/70";
                                        else if (isPhysicalDamage) colorClasses = "bg-red-950/60 border-red-700/60 hover:bg-red-900/70";
                                        else if (isElectricalShock) colorClasses = "bg-blue-950/60 border-blue-700/60 hover:bg-blue-900/70";
                                        return (
                                            <div key={key} className="row-start-3">
                                                <div className={`${baseClasses} ${colorClasses}`}>
                                                    <Checkbox id={key} checked={selected_risk_components[key as keyof typeof selected_risk_components]} onCheckedChange={() => handleToggle(key as keyof typeof selected_risk_components)} />
                                                    <Label htmlFor={key} className="cursor-pointer flex-1 text-xs md:text-sm text-slate-200 whitespace-nowrap">{label}</Label>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            {/* Barra contínua central */}
                            <div className="hidden sm:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-slate-400/80" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}