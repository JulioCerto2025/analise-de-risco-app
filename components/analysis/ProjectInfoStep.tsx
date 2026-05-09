import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input, Textarea, Label, Button, useAuditMode } from '../ui';
import { Briefcase, ShieldAlert, X, Clipboard, CheckCircle2, Save, FolderOpen, Search, ShieldCheck } from 'lucide-react';
import { AnalysisData } from '../../types';
import { DatePicker } from '../DatePicker';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectInfoStepProps {
    data: AnalysisData;
    onUpdate: (newData: Partial<AnalysisData>) => void;
    onLoadProject?: (projectData: any) => void;
    isAdmin?: boolean;
    showAdminPanel?: boolean;
    setShowAdminPanel?: (val: boolean) => void;
    passwords?: any;
    copyToClipboard?: (text: string, label: string) => void;
}

export function ProjectInfoStep({ 
    data, 
    onUpdate, 
    onLoadProject,
    isAdmin, 
    showAdminPanel, 
    setShowAdminPanel, 
    passwords, 
    copyToClipboard 
}: ProjectInfoStepProps) {

    const { auditMode, setAuditMode } = useAuditMode();

    const handleValueUpdate = (id: string, value: any) => {
        onUpdate({ [id]: value });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try { 
                const loadedData = JSON.parse(event.target?.result as string);
                if (onLoadProject) onLoadProject(loadedData);
                else onUpdate(loadedData);
                alert('Projeto carregado com sucesso!');
            }
            catch (err) { alert('Erro ao abrir o arquivo.'); }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const btnAbrir = (
        <div className="relative group/btn bg-slate-800/50 border border-white/5 rounded-2xl p-2 px-2.5 sm:px-3 flex items-center gap-1.5 sm:gap-2 hover:bg-blue-600 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/30 cursor-pointer transition-all hover:scale-105 active:scale-95">
            <div className="bg-slate-700 text-slate-400 group-hover/btn:bg-white group-hover/btn:text-blue-600 p-1 rounded-lg shadow-sm group-hover/btn:-rotate-12 transition-all">
                <FolderOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-black text-slate-400 group-hover/btn:text-white uppercase tracking-widest drop-shadow-md transition-colors">Abrir</span>
            <input type="file" accept=".spda,.json" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
        </div>
    );

    const btnAuditoria = (
        <div className={`bg-slate-900/60 backdrop-blur-md border ${auditMode ? 'border-emerald-500/50 shadow-emerald-900/20' : 'border-white/10 shadow-black/20'} rounded-2xl p-2 px-2.5 sm:px-3 flex items-center gap-1.5 sm:gap-2.5 shadow-xl transition-all hover:scale-105 cursor-pointer`} onClick={() => setAuditMode(!auditMode)}>
            <div className={`p-1 rounded-lg shadow-sm transition-all ${auditMode ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                <ShieldCheck className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${auditMode ? 'animate-pulse' : ''}`} />
            </div>
            <span className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-widest drop-shadow-md select-none">Auditoria</span>
            <button className={`relative w-8 sm:w-9 h-4.5 sm:h-5 rounded-full transition-all duration-500 p-0.5 flex items-center shadow-inner pointer-events-none ${ auditMode ? 'bg-emerald-500' : 'bg-slate-800 border border-white/10 ' }`}>
                <motion.div animate={{ x: auditMode ? (window.innerWidth < 640 ? 14 : 16) : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white shadow-md flex items-center justify-center`}>
                    {auditMode && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />}
                </motion.div>
            </button>
        </div>
    );

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="py-4 px-6 border-b border-white/5">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-8 items-center w-full">
                        <CardTitle className="lg:col-span-2 flex items-center gap-2 sm:gap-3 text-base sm:text-lg leading-none text-slate-100 w-full m-0">
                            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 shrink-0" />
                            <span className="truncate sm:whitespace-normal">
                                <span className="sm:hidden">Dados do Projeto</span>
                                <span className="hidden sm:inline">Informações Gerais do Projeto</span>
                            </span>
                        </CardTitle>
                        <div className="flex lg:col-span-3 items-center justify-start sm:justify-between gap-2 sm:gap-4 w-full">
                            {btnAbrir}
                            {btnAuditoria}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
                        <div className="flex flex-col lg:col-span-2 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="clientName">Título do Projeto - Cliente</Label>
                                <Input
                                    id="clientName"
                                    value={data.clientName}
                                    onChange={(e) => handleValueUpdate('clientName', e.target.value)}
                                    placeholder="Relatório Análise de Risco - Edifício Central"
                                    className="h-10 text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="clientAddress">Endereço da Obra / Localização</Label>
                                <Input
                                    id="clientAddress"
                                    value={data.clientAddress}
                                    onChange={(e) => handleValueUpdate('clientAddress', e.target.value)}
                                    placeholder="Ex: Av. Paulista, 1000 - São Paulo/SP"
                                    className="h-10 text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="projectName">Descrição Detalhada do Projeto</Label>
                                <Textarea
                                    id="projectName"
                                    value={data.projectName}
                                    onChange={(e) => handleValueUpdate('projectName', e.target.value)}
                                    placeholder="Descreva a edificação e detalhes técnicos conforme AVCB..."
                                    rows={4}
                                    className="text-sm min-h-[120px]"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                                <div className="space-y-1">
                                    <Label htmlFor="technicalManagerName">Responsável Técnico</Label>
                                    <Input
                                        id="technicalManagerName"
                                        value={data.technicalManagerName}
                                        onChange={(e) => handleValueUpdate('technicalManagerName', e.target.value)}
                                        placeholder="Engº João da Silva"
                                        className="h-10 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Data do Projeto</label>
                                    <DatePicker
                                        value={data.projectDate}
                                        onChange={(val) => handleValueUpdate('projectDate', val)}
                                        className="h-10 text-sm bg-slate-900/50"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <div className="space-y-1">
                                        <Label htmlFor="licenseNumber">Habilitação e Registro Profissional</Label>
                                        <Input
                                            id="licenseNumber"
                                            value={data.licenseNumber}
                                            onChange={(e) => handleValueUpdate('licenseNumber', e.target.value)}
                                            placeholder="Engº Eletricista / CREA-123456D-UF"
                                            className="h-10 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:flex lg:col-span-3 items-stretch">
                            <div className="w-full h-full min-h-[400px] overflow-hidden rounded-2xl shadow-2xl relative border border-white/5 group">
                                <img
                                    src="https://i.imgur.com/siWXsaB.png"
                                    alt="Ilustração de tempestade e SPDA"
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                                <AnimatePresence>
                                    {isAdmin && showAdminPanel && (
                                        <motion.div 
                                            initial={{ y: -100, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -100, opacity: 0 }}
                                            className="absolute top-0 left-0 right-0 z-20 bg-slate-950/70 backdrop-blur-2xl border-b border-white/10 p-2.5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
                                        >
                                            <div className="flex items-center justify-between mb-2 px-2">
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400">
                                                    <ShieldAlert className="w-3.5 h-3.5" />
                                                    <span>Gestão de Senhas ADM</span>
                                                </div>
                                                <button onClick={() => setShowAdminPanel?.(false)} className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-red-400"><X className="w-4 h-4" /></button>
                                            </div>
                                            <div className="grid grid-cols-4 gap-2 px-1">
                                                {[
                                                    { id: 'trial', label: '48H', pwd: passwords?.trial },
                                                    { id: 'month', label: 'MÊS', pwd: passwords?.month },
                                                    { id: 'semestral', label: '6M', pwd: passwords?.semestral },
                                                    { id: 'annual', label: 'ANO', pwd: passwords?.annual }
                                                ].map((p) => {
                                                    const [isVisible, setIsVisible] = React.useState(false);
                                                    return (
                                                        <div key={p.id} className="bg-slate-900/80 border border-white/10 rounded-xl p-2 px-2.5 flex flex-col group hover:border-blue-500/30">
                                                            <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-0.5 group-hover:text-blue-400 transition-colors">{p.label}</p>
                                                            <div className="flex items-center justify-between gap-1">
                                                                <span onClick={() => setIsVisible(!isVisible)} className={`text-xs font-mono font-black ${isVisible ? 'text-white' : 'text-slate-600'} cursor-pointer flex-1 truncate`}>{isVisible ? p.pwd : '••••••'}</span>
                                                                <button onClick={(e) => { e.stopPropagation(); copyToClipboard?.(p.pwd, p.label); }} className="p-1.5 hover:bg-white/10 rounded-lg transition-all"><Clipboard className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-300" /></button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
