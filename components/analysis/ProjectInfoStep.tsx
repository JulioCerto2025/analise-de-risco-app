import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Label, Button, useAuditMode } from '../ui';
import { Briefcase, ShieldAlert, X, Clipboard, CheckCircle2, Save, FolderOpen, Search, ShieldCheck } from 'lucide-react';
import { AnalysisData } from '../../types';
import { DatePicker } from '../DatePicker';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectInfoStepProps {
    data: AnalysisData;
    onUpdate: (newData: Partial<AnalysisData>) => void;
    isAdmin?: boolean;
    showAdminPanel?: boolean;
    setShowAdminPanel?: (val: boolean) => void;
    passwords?: any;
    copyToClipboard?: (text: string, label: string) => void;
}

export function ProjectInfoStep({ 
    data, 
    onUpdate, 
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

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="py-4 px-8 border-b border-white/5">
                    <CardTitle className="flex items-center justify-between text-lg leading-none text-slate-100 w-full">
                        <div className="flex items-center gap-3">
                            <Briefcase className="w-5 h-5 text-blue-400" />
                            Informações Gerais do Projeto
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
                        <div className="flex flex-col lg:col-span-2 gap-3">
                            <AutoCorrectingInput
                                id="clientName"
                                label="Título do Projeto - Cliente"
                                value={data.clientName}
                                onUpdate={(val) => handleValueUpdate('clientName', val)}
                                placeholder="Relatório Análise de Risco - Edifício Central"
                                className="h-10 text-sm"
                            />
                            <input
                                id="clientAddress"
                                value={data.clientAddress}
                                onChange={(e) => handleValueUpdate('clientAddress', e.target.value)}
                                placeholder="Ex: Av. Paulista, 1000 - São Paulo/SP"
                                className="flex h-10 w-full rounded-xl border border-slate-600 bg-[#0f172a] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-400"
                            />
                            <AutoCorrectingTextarea
                                id="projectName"
                                label="Descrição Detalhada do Projeto"
                                value={data.projectName}
                                onUpdate={(val) => handleValueUpdate('projectName', val)}
                                placeholder="Descreva a edificação e detalhes técnicos conforme AVCB..."
                                rows={4}
                                className="text-sm min-h-[120px]"
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                                <AutoCorrectingInput
                                    id="technicalManagerName"
                                    label="Responsável Técnico"
                                    value={data.technicalManagerName}
                                    onUpdate={(val) => handleValueUpdate('technicalManagerName', val)}
                                    placeholder="Engº João da Silva"
                                    className="h-10 text-sm"
                                />
                                 <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Data do Projeto</label>
                                    <DatePicker
                                        value={data.projectDate}
                                        onChange={(val) => handleValueUpdate('projectDate', val)}
                                        className="h-10 text-sm bg-slate-900/50"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <AutoCorrectingInput
                                        id="licenseNumber"
                                        label="Habilitação e Registro Profissional"
                                        value={data.licenseNumber}
                                        onUpdate={(val) => handleValueUpdate('licenseNumber', val)}
                                        placeholder="Engº Eletricista / CREA-123456D-UF"
                                        className="h-10 text-sm"
                                    />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-2xl backdrop-blur-xl group hover:border-blue-500/30 transition-all duration-300">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 group-hover:scale-110 transition-transform">
                            <FolderOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white leading-none">Abrir Projeto</h4>
                            <p className="text-[9px] text-slate-300 uppercase font-black tracking-widest mt-1.5 opacity-80">Carregar dados salvos .SPDA</p>
                        </div>
                    </div>
                    <div className="relative group/btn">
                        <input type="file" accept=".spda,.json" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                try { onUpdate(JSON.parse(event.target?.result as string)); }
                                catch (err) { alert('Erro ao abrir o arquivo.'); }
                            };
                            reader.readAsText(file);
                        }} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <Button variant="outline" className="h-10 px-8 rounded-xl border-slate-700 bg-slate-900 group-hover/btn:border-blue-500/60 group-hover/btn:bg-blue-600/10 text-white font-black text-[10px] uppercase tracking-[0.2em] pointer-events-none transition-all shadow-lg">Selecionar Arquivo</Button>
                    </div>
                </div>

                <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-2xl backdrop-blur-xl group hover:border-blue-500/30 transition-all duration-300">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl transition-all duration-300 ${auditMode ? 'bg-blue-500/20 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'bg-slate-900 text-slate-500'}`}>
                            <ShieldCheck className={`w-6 h-6 ${auditMode ? 'animate-pulse' : ''}`} />
                        </div>
                        <div>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white leading-none">Auditoria / Fiscalização</h4>
                            <p className="text-[9px] text-slate-300 uppercase font-black tracking-widest mt-1.5 opacity-80">Habilitar transparência de cálculos</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setAuditMode(!auditMode)} className={`relative w-12 h-6.5 rounded-full transition-all duration-500 p-1 flex items-center ${ auditMode ? 'bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-slate-800 border border-white/10 ' }`}>
                            <motion.div animate={{ x: auditMode ? 22 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className={`w-4.5 h-4.5 rounded-full bg-white shadow-xl flex items-center justify-center`}>
                                {auditMode && <CheckCircle2 className="w-3 h-3 text-blue-600" />}
                            </motion.div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
