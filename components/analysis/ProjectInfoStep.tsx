import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Label, AutoCorrectingInput, Textarea, Button, Alert, AlertDescription } from '../ui';
import { Briefcase, Sparkles, Loader2, X } from 'lucide-react';
import { AnalysisData } from '../../types';
import { getPreliminaryAnalysis } from '../../lib/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { DatePicker } from '../DatePicker';

// Adiciona um processador de Markdown para formatar a saída da IA corretamente.
const markdownToHtml = (markdown: string): string => {
    if (!markdown) return '';
    const text = markdown.replace(/\\n/g, '\n');

    const lines = text.split('\n');
    let html = '';
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        const processInline = (str: string) => str.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Cabeçalhos
        if (line.startsWith('## ')) {
            if (inList) { html += '</ul>\n'; inList = false; }
            html += `<h2>${processInline(line.substring(3))}</h2>\n`;
            continue;
        }
        if (line.startsWith('### ')) {
            if (inList) { html += '</ul>\n'; inList = false; }
            html += `<h3>${processInline(line.substring(4))}</h3>\n`;
            continue;
        }

        // Itens de Lista (com suporte para múltiplas linhas)
        if (line.trim().startsWith('* ')) {
            if (!inList) {
                html += '<ul>\n';
                inList = true;
            }
            let itemContent = line.trim().substring(2);
            while (i + 1 < lines.length && lines[i + 1].startsWith('  ')) {
                itemContent += '<br/>' + lines[i + 1].trim();
                i++;
            }
            html += `<li>${processInline(itemContent)}</li>\n`;
            continue;
        }

        // Fim de uma lista
        if (inList) {
            html += '</ul>\n';
            inList = false;
        }

        // Parágrafos
        if (line.trim()) {
            html += `<p>${processInline(line)}</p>\n`;
        }
    }

    // Fecha a lista se for o último elemento
    if (inList) {
        html += '</ul>\n';
    }

    return html;
};


interface ProjectInfoStepProps {
    data: AnalysisData;
    onUpdate: (newData: Partial<AnalysisData>) => void;
}

export function ProjectInfoStep({ data, onUpdate }: ProjectInfoStepProps) {

    const handleValueUpdate = (id: string, value: string) => {
        onUpdate({ [id]: value });
    };
    
    const handleAnalyze = async () => {
        onUpdate({ preliminaryAiStatus: 'loading', preliminaryAiResult: null, preliminaryAiError: null });
        try {
            const result = await getPreliminaryAnalysis(data.projectName, data.clientAddress);
            if(result && data.zones.length > 0) {
                const newTotalNt = result.nz; // AI result for population is considered the total `nt`.
                
                const updatedZones = data.zones.map((zone, index) => {
                    let updatedLossData = { ...zone.loss_data };
                    
                    // Apply all preliminary values to the first zone's loss data
                    if (index === 0) {
                       updatedLossData.rf = result.rf;
                       updatedLossData.hz = result.hz;
                       updatedLossData.rp = result.rp;
                       updatedLossData.tz = result.tz;
                    }
    
                    // Update 'nt' for ALL zones.
                    updatedLossData.nt = newTotalNt;
    
                    // If there is only one zone, its 'nz' must be the same as 'nt'.
                    if (data.zones.length === 1) {
                        updatedLossData.nz = newTotalNt;
                    }
    
                    return { ...zone, loss_data: updatedLossData };
                });
                
                onUpdate({
                    zones: updatedZones,
                    preliminaryAiStatus: 'success',
                    preliminaryAiResult: result,
                });
            } else {
                 onUpdate({ preliminaryAiStatus: 'error', preliminaryAiError: 'Não foi possível obter uma análise da IA. Verifique se a descrição do projeto e o endereço estão preenchidos.' });
            }
        } catch (error) {
            console.error("Preliminary Analysis Error:", error);
            onUpdate({ preliminaryAiStatus: 'error', preliminaryAiError: 'Ocorreu um erro ao conectar com o serviço de IA. Tente novamente mais tarde.' });
        }
    };


    return (
        <div className="space-y-6 h-full">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-white" />
                        Informações do Projeto
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-x-8 items-stretch">
                        <div className="flex flex-col md:col-span-2 gap-4">
                            <AutoCorrectingInput
                                id="clientName"
                                label="Titulo do Projeto - Cliente"
                                value={data.clientName}
                                onUpdate={(newValue) => handleValueUpdate('clientName', newValue)}
                                placeholder="Ex: Relatório Análise de Risco - Edifício Central"
                            />
                            <AutoCorrectingInput
                                id="clientAddress"
                                label="Endereço do Cliente"
                                value={data.clientAddress}
                                onUpdate={(newValue) => handleValueUpdate('clientAddress', newValue)}
                                placeholder="Ex: Rua Fictícia, 123, Rio de Janeiro - RJ"
                            />
                            <div className="space-y-2">
                                <Label htmlFor="projectName">Descrição detalhada conforme AVCB (Corpo de Bombeiros)</Label>
                                <Textarea
                                    id="projectName"
                                    value={data.projectName}
                                    onChange={(e) => handleValueUpdate('projectName', e.target.value)}
                                    placeholder="Exemplo: Hospital com 10 andares, 20.000m², com UTI, centro cirúrgico e apartamentos. Ocupação 24/7 por médicos, enfermeiros (em turnos de 12h) e pacientes. Horário de visitação das 14h às 18h com fluxo intenso de pessoas."
                                    rows={5}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                <AutoCorrectingInput
                                    id="technicalManagerName"
                                    label="Responsável Técnico"
                                    value={data.technicalManagerName}
                                    onUpdate={(newValue) => handleValueUpdate('technicalManagerName', newValue)}
                                    placeholder="Ex: João da Silva"
                                />
                                 <div className="space-y-2">
                                    <Label>Data do Projeto</Label>
                                    <DatePicker
                                        value={data.projectDate}
                                        onChange={(newValue) => handleValueUpdate('projectDate', newValue)}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <AutoCorrectingInput
                                        id="licenseNumber"
                                        label="Habilitação e Documento Profissional (CREA/CAU/CFT)"
                                        value={data.licenseNumber}
                                        onUpdate={(newValue) => handleValueUpdate('licenseNumber', newValue)}
                                        placeholder="Ex: Eng. Eletricista / 123456D-SP"
                                    />
                                </div>
                            </div>

                            {/* Integrated AI Analysis Button Section */}
                            <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-4">
                                <AnimatePresence mode="wait">
                                    {data.preliminaryAiStatus === 'loading' ? (
                                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <Button disabled className="w-full justify-center">
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Analisando...
                                            </Button>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="action" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <Button
                                                onClick={handleAnalyze}
                                                disabled={!data.projectName || !data.clientAddress}
                                                variant={data.preliminaryAiStatus === 'idle' ? 'default' : 'outline'}
                                                className="w-full justify-center"
                                            >
                                                <Sparkles className="w-4 h-4 mr-2" />
                                                {data.preliminaryAiStatus !== 'idle' ? 'Analisar Novamente' : 'Análise Preliminar - Corpo de Bombeiro'}
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                        <div className="hidden md:flex md:col-span-3 items-stretch p-2">
                            <div className="w-full h-full overflow-hidden rounded-lg shadow-md">
                                <img src="https://i.imgur.com/siWXsaB.png" alt="Ilustração de um sistema de proteção contra descargas atmosféricas" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <AnimatePresence>
                {data.preliminaryAiStatus === 'error' && data.preliminaryAiError && (
                    <motion.div 
                        key="error_card"
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                    >
                        <Card>
                            <CardContent className="p-4">
                                <Alert variant="destructive">
                                    <AlertDescription>{data.preliminaryAiError}</AlertDescription>
                                </Alert>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
                {data.preliminaryAiStatus === 'success' && data.preliminaryAiResult && (
                     <motion.div 
                        key="success_card"
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.4 } }} 
                        exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
                    >
                        <Card className="bg-slate-900/80 border-slate-500/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-slate-100">
                                        <Sparkles className="w-5 h-5 text-blue-400"/>
                                        Análise Preliminar da IA
                                    </span>
                                    <Button 
                                        variant="outline" 
                                        size="icon" 
                                        className="h-7 w-7 flex-shrink-0"
                                        onClick={() => onUpdate({ preliminaryAiStatus: 'idle', preliminaryAiResult: null })}
                                    >
                                        <X className="w-4 h-4"/>
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div 
                                    className="text-base text-slate-300 leading-relaxed prose-styles"
                                    dangerouslySetInnerHTML={{ __html: markdownToHtml(data.preliminaryAiResult.explanation) }} 
                                />
                                <p className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-700/50 italic">
                                    Valores de risco (rf), pânico (hz), proteção (rp), população (nz/nt) e tempo de permanência (tz) foram aplicados. Revise-os na Etapa 8 (Perda Consequente). Ao avançar, a cidade e o estado declarados serão usados para preencher a Etapa 3 (Densidade de Descargas), atualizando automaticamente o valor de Ng.
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}