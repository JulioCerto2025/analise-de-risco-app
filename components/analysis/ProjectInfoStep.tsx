import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, AutoCorrectingInput, AutoCorrectingTextarea, Label, Button } from '../ui';
import { Briefcase, ShieldAlert, X, Clipboard, CheckCircle2, Save, FolderOpen } from 'lucide-react';
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

    const handleValueUpdate = (id: string, value: string) => {
        const patch: any = { [id]: value };
        onUpdate(patch);
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="py-4 px-8 border-b border-white/5">
                    <CardTitle className="flex items-center gap-3 text-lg leading-none">
                        <Briefcase className="w-5 h-5 text-blue-400" />
                        Informações Gerais do Projeto
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
                        {/* Formulário - Coluna da Esquerda */}
                        <div className="flex flex-col lg:col-span-2 gap-2">
                            <AutoCorrectingInput
                                id="clientName"
                                label="Título do Projeto - Cliente"
                                value={data.clientName}
                                onUpdate={(newValue) => handleValueUpdate('clientName', newValue)}
                                placeholder="Relatório Análise de Risco - Edifício Central"
                                className="h-9 text-sm"
                            />
                            <AutoCorrectingInput
                                id="clientAddress"
                                label="Endereço da Obra / Localização"
                                value={data.clientAddress}
                                onUpdate={(newValue) => handleValueUpdate('clientAddress', newValue)}
                                placeholder="Ex: Av. Paulista, 1000 - São Paulo/SP"
                                className="h-9 text-sm"
                            />
                            <AutoCorrectingTextarea
                                id="projectName"
                                label="Descrição detalhada conforme AVCB"
                                value={data.projectName}
                                onUpdate={(newValue) => handleValueUpdate('projectName', newValue)}
                                placeholder="Detalhes de pavimentos, área, uso e altura..."
                                rows={2}
                                className="text-sm min-h-[60px]"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <AutoCorrectingInput
                                    id="technicalManagerName"
                                    label="Responsável Técnico"
                                    value={data.technicalManagerName}
                                    onUpdate={(newValue) => handleValueUpdate('technicalManagerName', newValue)}
                                    placeholder="Engº João da Silva"
                                    className="h-9 text-sm"
                                />
                                 <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Data do Projeto</label>
                                    <DatePicker
                                        value={data.projectDate}
                                        onChange={(newValue) => handleValueUpdate('projectDate', newValue)}
                                        className="h-9 text-sm"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <AutoCorrectingInput
                                        id="licenseNumber"
                                        label="Habilitação e Registro Profissional"
                                        value={data.licenseNumber}
                                        onUpdate={(newValue) => handleValueUpdate('licenseNumber', newValue)}
                                        placeholder="Engº Eletricista / CREA-123456D-UF"
                                        className="h-9 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Gerenciamento de Projetos - ABRIR APENAS - VERSÃO COMPACTA */}
                            <div className="mt-1 p-2 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 shrink-0">
                                    <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
                                    <h4 className="text-[9px] uppercase font-black text-blue-400 tracking-widest leading-none">Abrir Projeto</h4>
                                </div>
                                <div className="relative flex-1 max-w-[140px]">
                                    <input 
                                        type="file" 
                                        accept=".spda,.json"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                try {
                                                    const json = JSON.parse(event.target?.result as string);
                                                    onUpdate(json);
                                                    alert('Projeto carregado com sucesso!');
                                                } catch (err) {
                                                    alert('Erro ao abrir o arquivo. Certifique-se de que é um arquivo .spda válido.');
                                                }
                                            };
                                            reader.readAsText(file);
                                        }}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                    />
                                    <Button 
                                        variant="outline" 
                                        className="w-full h-8 rounded-lg flex items-center justify-center gap-2 border-slate-700/50 hover:bg-slate-800 text-slate-300 font-bold text-[9px] uppercase tracking-wider pointer-events-none transition-all leading-none"
                                    >
                                        <FolderOpen className="w-3 h-3" />
                                        Selecionar Arquivo
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Imagem - Coluna da Direita */}
                        <div className="hidden lg:flex lg:col-span-3 items-stretch">
                            <div className="w-full h-full min-h-[380px] overflow-hidden rounded-2xl shadow-2xl relative border border-white/10 group">
                                <img
                                    src="https://i.imgur.com/siWXsaB.png"
                                    alt="Ilustração de tempestade e SPDA"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                                <AnimatePresence>
                                    {isAdmin && showAdminPanel && (
                                        <motion.div 
                                            initial={{ y: -100, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -100, opacity: 0 }}
                                            className="absolute top-0 left-0 right-0 z-20 bg-slate-950/60 backdrop-blur-xl border-b border-white/10 p-3"
                                        >
                                            <div className="flex items-center justify-between mb-3 px-1">
                                                <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-blue-400">
                                                    <ShieldAlert className="w-3.5 h-3.5" />
                                                    <span>Gestão de Senhas ADM</span>
                                                </div>
                                                <button 
                                                    onClick={() => setShowAdminPanel?.(false)}
                                                    className="p-1 hover:bg-white/10 rounded-lg transition-all text-slate-500 hover:text-red-400"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-4 gap-2">
                                                {[
                                                    { id: 'trial', label: '48 Horas', color: 'blue', pwd: passwords?.trial },
                                                    { id: 'month', label: 'Mensal', color: 'teal', pwd: passwords?.month },
                                                    { id: 'semestral', label: '6 Meses', color: 'purple', pwd: passwords?.semestral },
                                                    { id: 'annual', label: 'Anual', color: 'emerald', pwd: passwords?.annual }
                                                ].map((p) => {
                                                    const [isVisible, setIsVisible] = React.useState(false);
                                                    return (
                                                        <div 
                                                            key={p.id}
                                                            className={`bg-slate-900/60 border border-white/5 rounded-xl p-3 flex flex-col relative transition-all group overflow-hidden`}
                                                        >
                                                            <p className={`text-[8px] text-${p.color}-400/70 font-black uppercase tracking-widest mb-1.5`}>{p.label}</p>
                                                            <div className="flex items-center justify-between">
                                                                <span 
                                                                    onClick={() => setIsVisible(!isVisible)}
                                                                    className={`text-sm font-mono font-black ${isVisible ? 'text-white' : 'text-slate-800'} tracking-widest leading-none cursor-pointer hover:text-white transition-colors flex-1`}
                                                                    title="Clique para ver/ocultar"
                                                                >
                                                                    {isVisible ? p.pwd : '••••••'}
                                                                </span>
                                                                <button 
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        copyToClipboard?.(p.pwd, p.label);
                                                                    }}
                                                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-all ml-1 shrink-0"
                                                                    title="Copiar senha"
                                                                >
                                                                    <Clipboard className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400" />
                                                                </button>
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
