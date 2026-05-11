import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Checkbox, Label } from '../ui';
import { 
    CheckCircle2, 
    ShieldAlert, 
    HardHat, 
    Home,
    Building2,
    HeartPulse,
    Landmark,
    CircleDollarSign,
    Cable
} from 'lucide-react';
import { AnalysisData } from '../../types';
import { motion } from 'framer-motion';
import { Zap, Radio, AlertCircle, Info } from 'lucide-react';

const SourceBadge = ({ type, label }: { type: 'S1' | 'S2' | 'S3' | 'S4', label: string }) => {
    const isDirect = type === 'S1' || type === 'S3';
    return (
        <div className="hidden lg:flex flex-col gap-2 mb-4 group/badge">
            <div className="flex items-center gap-3">
                <div className={`relative w-10 h-10 rounded-2xl border flex items-center justify-center transition-all duration-300 shadow-xl ${
                    isDirect 
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 group-hover/badge:bg-amber-500/30 group-hover/badge:shadow-amber-500/20' 
                        : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400 group-hover/badge:bg-cyan-500/30 group-hover/badge:shadow-cyan-500/20'
                }`}>
                    <div className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-md bg-slate-950 border border-inherit text-[10px] font-black tracking-tighter">
                        {type}
                    </div>
                    {isDirect ? <Zap className="w-5 h-5" /> : <Radio className="w-5 h-5" />}
                </div>
                <div className="flex flex-col">
                    <span className="text-[12px] font-black uppercase tracking-[0.15em] text-white leading-none mb-1">{label}</span>
                    <span className={`text-[8px] font-bold uppercase tracking-widest ${isDirect ? 'text-amber-500/70' : 'text-cyan-500/70'}`}>
                        {isDirect ? 'Energia de Impacto' : 'Indução Eletromagnética'}
                    </span>
                </div>
            </div>
        </div>
    );
};

interface RiskComponentsSelectionProps {
    data: AnalysisData;
    onChange: (newData: Partial<AnalysisData>) => void;
}

const riskTypeOptions = [
    { value: 'R1', label: 'R1 - Vida humana', icon: HeartPulse, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    { value: 'R3', label: 'R3 - Patr. Cultural', icon: Landmark, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { value: 'R4', label: 'R4 - Valor Econ.', icon: CircleDollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
];

const sourceOfDamageComponents = {
    S1: [
        { key: 'RA', label: 'RA - Choque' },
        { key: 'RB', label: 'RB - Danos físicos' },
        { key: 'RC', label: 'RC - Falha sis. int.' },
    ],
    S2: [
        { key: 'RM', label: 'RM - Falha sis. int.' },
    ],
    S3: [
        { key: 'RU', label: 'RU - Choque' },
        { key: 'RV', label: 'RV - Danos físicos' },
        { key: 'RW', label: 'RW - Falha sis. int.' },
    ],
    S4: [
        { key: 'RZ', label: 'RZ - Falha sis. int.' },
    ],
};

const PHYSICAL_DAMAGE_COMPONENTS = ['RB', 'RV'];
const SYSTEM_FAILURE_COMPONENTS = ['RC', 'RM', 'RW', 'RZ'];
const ELECTRICAL_SHOCK_COMPONENTS = ['RA', 'RU'];

export function RiskComponentsSelection({ data, onChange }: RiskComponentsSelectionProps) {
    const { selected_risk_components, risks_to_analyze, robust_infrastructure } = data;

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

    const handleCriticalSystemsToggle = () => {
        const areCriticalsSelected = selected_risk_components.RC && selected_risk_components.RM && selected_risk_components.RW && selected_risk_components.RZ;
        const targetValue = !areCriticalsSelected;
        
        onChange({
            selected_risk_components: {
                ...selected_risk_components,
                RC: targetValue,
                RM: targetValue,
                RW: targetValue,
                RZ: targetValue,
            }
        });
    };

    const areCriticalsSelected = selected_risk_components.RC && selected_risk_components.RM && selected_risk_components.RW && selected_risk_components.RZ;

    return (
        <div className="grid grid-cols-1 gap-6 items-start">
            <div className="flex flex-col gap-6">
                {/* TIPO DE CONSTRUÇÃO E FALHA DE SISTEMAS - AGORA NO TOPO */}
                <Card className="w-full">
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            
                            {/* Coluna 1: Tipo de Construção */}
                            <div className={`bg-slate-950/60 border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-2xl backdrop-blur-xl group hover:border-red-500/30 transition-all duration-300 h-full`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2.5 rounded-xl transition-all duration-300 ${!robust_infrastructure ? 'bg-red-500/20 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-slate-900 text-slate-500'}`}>
                                        {!robust_infrastructure ? <Building2 className="w-6 h-6 animate-pulse" /> : <Home className="w-6 h-6" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white leading-none mb-1.5">Tipo de Construção</h4>
                                        <p className="text-[9px] text-slate-300 uppercase font-black tracking-widest opacity-80 leading-tight pr-4">
                                            {!robust_infrastructure ? 'Simples / Frágil (rs = 2)' : 'Robusta (rs = 1)'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => {
                                            const nextRobust = !robust_infrastructure;
                                            onChange({ 
                                                robust_infrastructure: nextRobust,
                                                rs: nextRobust ? 1 : 2
                                            });
                                        }}
                                        className={`relative w-12 h-6.5 rounded-full transition-all duration-500 p-1 flex items-center ${
                                            !robust_infrastructure ? 'bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-slate-800 border border-white/10'
                                        }`}
                                    >
                                        <motion.div
                                            animate={{ x: !robust_infrastructure ? 22 : 0 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            className={`w-4.5 h-4.5 rounded-full bg-white shadow-xl flex items-center justify-center`}
                                        >
                                            {!robust_infrastructure && <CheckCircle2 className="w-3 h-3 text-red-600" />}
                                        </motion.div>
                                    </button>
                                </div>
                            </div>

                            {/* Coluna 2: Falha de Sistemas */}
                            <div className={`bg-slate-950/60 border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-2xl backdrop-blur-xl group hover:border-red-500/30 transition-all duration-300 h-full`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2.5 rounded-xl transition-all duration-300 ${areCriticalsSelected ? 'bg-red-500/20 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-slate-900 text-slate-500'}`}>
                                        {areCriticalsSelected ? <ShieldAlert className="w-6 h-6 animate-pulse" /> : <HardHat className="w-6 h-6" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white leading-none mb-1.5">
                                            Falha de Sistemas
                                        </h4>
                                        <p className="text-[9px] text-slate-300 uppercase font-black tracking-widest opacity-80 leading-tight pr-4">
                                            {areCriticalsSelected 
                                                ? 'Colocam a vida em risco' 
                                                : <><span className="text-blue-400 font-black">NÃO</span> colocam a vida em risco</>}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handleCriticalSystemsToggle}
                                        className={`relative w-12 h-6.5 rounded-full transition-all duration-500 p-1 flex items-center ${
                                            areCriticalsSelected ? 'bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-slate-800 border border-white/10'
                                        }`}
                                    >
                                        <motion.div
                                            animate={{ x: areCriticalsSelected ? 22 : 0 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            className={`w-4.5 h-4.5 rounded-full bg-white shadow-xl flex items-center justify-center`}
                                        >
                                            {areCriticalsSelected && <CheckCircle2 className="w-3 h-3 text-red-600" />}
                                        </motion.div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* RISCO DE PERDA A SER CALCULADO - AGORA ABAIXO */}
                <Card>
                    <CardHeader className="hidden lg:block">
                        <CardTitle>Risco de Perda a ser Calculado</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {riskTypeOptions.map(opt => {
                            const Icon = opt.icon;
                            const isSelected = risks_to_analyze[opt.value as keyof typeof risks_to_analyze];
                            return (
                                <div 
                                    key={opt.value} 
                                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-300 w-full cursor-pointer group relative overflow-hidden ${
                                        isSelected 
                                            ? `${opt.bg} ${opt.border} shadow-[0_0_20px_rgba(0,0,0,0.2)] scale-[1.02] ring-1 ring-white/10` 
                                            : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/60'
                                    }`} 
                                    onClick={() => handleRiskTypeChange(opt.value as keyof typeof risks_to_analyze, !isSelected)}
                                >
                                    <div className={`p-2 rounded-xl transition-all duration-300 ${isSelected ? opt.color : 'text-slate-500 group-hover:text-slate-400'}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <Label 
                                            htmlFor={opt.value} 
                                            className={`cursor-pointer text-[12px] font-black uppercase tracking-[0.15em] transition-colors ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}
                                        >
                                            {opt.label}
                                        </Label>
                                    </div>
                                    <Checkbox
                                        id={opt.value}
                                        checked={isSelected}
                                        onCheckedChange={(checked) => handleRiskTypeChange(opt.value as keyof typeof risks_to_analyze, !!checked)}
                                        className={`transition-all duration-300 ${isSelected ? 'border-none bg-blue-600' : 'border-slate-700'}`}
                                    />
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <Card className="h-fit w-full lg:order-1 hidden lg:block border-none bg-slate-900/40 shadow-2xl backdrop-blur-md overflow-hidden">
                    <CardHeader className="hidden lg:block bg-slate-950/60 border-b border-blue-500/20 py-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <CardTitle className="text-[14px] font-black uppercase tracking-[0.05em] text-blue-100">
                                S1/S2 - Descargas na Estrutura
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                            <div className="sm:col-span-1 space-y-2 lg:pr-4 lg:border-r border-white/5">
                                <SourceBadge type="S1" label="Incidência Direta" />
                                {sourceOfDamageComponents.S1.map(({ key, label }) => {
                                    const isSystemFailure = SYSTEM_FAILURE_COMPONENTS.includes(key);
                                    const isPhysicalDamage = PHYSICAL_DAMAGE_COMPONENTS.includes(key);
                                    const isElectricalShock = ELECTRICAL_SHOCK_COMPONENTS.includes(key);
                                    const baseClasses = "flex items-center justify-between gap-3 px-3 py-2 rounded-xl border transition-all w-full cursor-pointer group";
                                    let colorClasses = "bg-slate-950/60 border-slate-700/50 hover:bg-slate-900/90";
                                    if (isSystemFailure) colorClasses = "bg-emerald-950/60 border-emerald-900/40 hover:bg-emerald-900/60";
                                    else if (isPhysicalDamage) colorClasses = "bg-red-950/60 border-red-900/40 hover:bg-red-900/60";
                                    else if (isElectricalShock) colorClasses = "bg-blue-950/60 border-blue-900/40 hover:bg-blue-900/60";
                                    
                                    return (
                                        <div key={key} className={`${baseClasses} ${colorClasses}`} onClick={() => handleToggle(key as keyof typeof selected_risk_components)}>
                                            <Checkbox id={key} checked={selected_risk_components[key as keyof typeof selected_risk_components]} onCheckedChange={() => handleToggle(key as keyof typeof selected_risk_components)} />
                                            <Label htmlFor={key} className="cursor-pointer flex-1 text-[11px] font-bold text-slate-300 uppercase tracking-wider group-hover:text-white">{label}</Label>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="sm:col-span-1 sm:pl-4">
                                <SourceBadge type="S2" label="Incidência Próxima" />
                                <div className="space-y-2">
                                    {sourceOfDamageComponents.S2.map(({ key, label }) => {
                                        const isSystemFailure = SYSTEM_FAILURE_COMPONENTS.includes(key);
                                        const baseClasses = "flex items-center justify-between gap-3 px-3 py-2 rounded-xl border transition-all w-full cursor-pointer group";
                                        let colorClasses = isSystemFailure ? "bg-emerald-950/60 border-emerald-900/40 hover:bg-emerald-900/60" : "bg-slate-950/60 border-slate-700/50 hover:bg-slate-900/90";
                                        return (
                                            <div key={key} className={`${baseClasses} ${colorClasses}`} onClick={() => handleToggle(key as keyof typeof selected_risk_components)}>
                                                <Checkbox id={key} checked={selected_risk_components[key as keyof typeof selected_risk_components]} onCheckedChange={() => handleToggle(key as keyof typeof selected_risk_components)} />
                                                <Label htmlFor={key} className="cursor-pointer flex-1 text-[11px] font-bold text-slate-300 uppercase tracking-wider group-hover:text-white">{label}</Label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="h-fit w-full lg:order-2 hidden lg:block border-none bg-slate-900/40 shadow-2xl backdrop-blur-md overflow-hidden">
                    <CardHeader className="hidden lg:block bg-slate-950/60 border-b border-amber-500/20 py-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                                <Cable className="w-5 h-5" />
                            </div>
                            <CardTitle className="text-[14px] font-black uppercase tracking-[0.05em] text-amber-100">
                                S3/S4 - Descargas na Linha
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                            <div className="sm:col-span-1 space-y-2 sm:pr-4 border-r border-white/5">
                                <SourceBadge type="S3" label="Incidência Direta" />
                                {sourceOfDamageComponents.S3.map(({ key, label }) => {
                                    const isSystemFailure = SYSTEM_FAILURE_COMPONENTS.includes(key);
                                    const isPhysicalDamage = PHYSICAL_DAMAGE_COMPONENTS.includes(key);
                                    const isElectricalShock = ELECTRICAL_SHOCK_COMPONENTS.includes(key);
                                    const baseClasses = "flex items-center justify-between gap-3 px-3 py-2 rounded-xl border transition-all w-full cursor-pointer group";
                                    let colorClasses = "bg-slate-950/60 border-slate-700/50 hover:bg-slate-900/90";
                                    if (isSystemFailure) colorClasses = "bg-emerald-950/60 border-emerald-900/40 hover:bg-emerald-900/60";
                                    else if (isPhysicalDamage) colorClasses = "bg-red-950/60 border-red-900/40 hover:bg-red-900/60";
                                    else if (isElectricalShock) colorClasses = "bg-blue-950/60 border-blue-900/40 hover:bg-blue-900/60";
                                    
                                    return (
                                        <div key={key} className={`${baseClasses} ${colorClasses}`} onClick={() => handleToggle(key as keyof typeof selected_risk_components)}>
                                            <Checkbox id={key} checked={selected_risk_components[key as keyof typeof selected_risk_components]} onCheckedChange={() => handleToggle(key as keyof typeof selected_risk_components)} />
                                            <Label htmlFor={key} className="cursor-pointer flex-1 text-[11px] font-bold text-slate-300 uppercase tracking-wider group-hover:text-white">{label}</Label>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="sm:col-span-1 sm:pl-4">
                                <SourceBadge type="S4" label="Incidência Próxima" />
                                <div className="space-y-2">
                                    {sourceOfDamageComponents.S4.map(({ key, label }) => {
                                        const isSystemFailure = SYSTEM_FAILURE_COMPONENTS.includes(key);
                                        const baseClasses = "flex items-center justify-between gap-3 px-3 py-2 rounded-xl border transition-all w-full cursor-pointer group";
                                        let colorClasses = isSystemFailure ? "bg-emerald-950/60 border-emerald-900/40 hover:bg-emerald-900/60" : "bg-slate-950/60 border-slate-700/50 hover:bg-slate-900/90";
                                        return (
                                            <div key={key} className={`${baseClasses} ${colorClasses}`} onClick={() => handleToggle(key as keyof typeof selected_risk_components)}>
                                                <Checkbox id={key} checked={selected_risk_components[key as keyof typeof selected_risk_components]} onCheckedChange={() => handleToggle(key as keyof typeof selected_risk_components)} />
                                                <Label htmlFor={key} className="cursor-pointer flex-1 text-[11px] font-bold text-slate-300 uppercase tracking-wider group-hover:text-white">{label}</Label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}