import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Layers, BoxIcon, CheckCircle, AlertTriangle, Loader2, X, FileDown, FolderOpen } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '../ui';
import { AnalysisData } from '../../types';
import { 
    calculateEvents, 
    mergeZoneProbabilities, 
    calculateRisksForZone, 
    aggregateRiskResults,
    calculateLossesForZone 
} from '../../utils/calculations';
import { generateFullReportText } from '../../lib/reportBuilder';

// Enhanced markdown to HTML converter for professional preview
export const markdownToHtml = (md: string, prefs: any) => {
    const isWord = prefs.isWord || false;
    const textColor = isWord ? '#000000' : '#f8fafc';
    const headerColor = isWord ? '#000000' : '#3b82f6';
    const subheaderColor = isWord ? '#1e3a8a' : '#60a5fa';
    const borderColor = isWord ? '#000000' : 'rgba(148,163,184,0.15)';
    const bgHeader = isWord ? '#f1f5f9' : 'rgba(59,130,246,0.05)';

    let html = md
        .replace(/^# (.*$)/gm, `<h1 style="font-size: 2rem; font-weight: 900; color: ${headerColor}; margin-bottom: 1rem; text-align: center; border-bottom: 4px solid ${headerColor}; padding-bottom: 0.5rem;">$1</h1>`)
        .replace(/^## (.*$)/gm, `<h2 style="font-size: ${prefs.h2FontSizeRem}rem; font-weight: ${prefs.h2Weight || 700}; color: ${subheaderColor}; margin-top: ${prefs.h2MarginTopPx}px; margin-bottom: ${prefs.h2MarginBottomPx}px; border-left: 3px solid ${isWord ? '#1e3a8a' : '#3b82f6'}; padding-left: 0.75rem;">$1</h2>`)
        .replace(/^### (.*$)/gm, `<h3 style="font-size: 1.25rem; font-weight: 700; color: ${isWord ? '#334155' : '#94a3b8'}; margin-top: 1.5rem; margin-bottom: 0.75rem;">$1</h3>`)
        .replace(/\*\*(.*?)\*\*/g, '<strong style="color: inherit;">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/!\[(.*?)\]\((.*?)\)/g, '<div style="text-align: center; margin: 20px 0;"><img src="$2" alt="$1" style="max-width: 100%; height: auto; border: 1px solid #e2e8f0; border-radius: 8px;" /></div>')
        .replace(/^\| (.*) \|$/gm, (match) => {
            const cells = match.split('|').filter(c => c.trim() !== '').map(c => `<td style="border: 1px solid ${borderColor}; padding: 4px 6px; text-align: left; color: ${textColor};">${c.trim()}</td>`).join('');
            return `<table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem; border: 1px solid ${borderColor};"><tr style="background: ${isWord ? '#f8fafc' : 'rgba(15,23,42,0.3)'};">${cells}</tr></table>`;
        })
        .replace(/<div class="status-box danger">([\s\S]*?)<\/div>/g, '<div style="background: rgba(239,68,68,0.1); border: 2px solid #ef4444; border-radius: 1rem; padding: 1.5rem; margin: 2rem 0; color: #ef4444;">$1</div>')
        
        // Markdown elements
        .replace(/^\d\. (.*$)/gm, `<li style="margin-bottom: 0.2rem; color: ${prefs.isWord ? '#000' : '#cbd5e1'}; font-size: 0.9rem;">$1</li>`)
        .replace(/\*\*(.*?)\*\*/g, `<strong style="color: ${prefs.isWord ? '#1e40af' : '#60a5fa'}; font-weight: 700;">$1</strong>`)
        .replace(/^- (.*$)/gm, `<li style="margin-left: 0.75rem; margin-bottom: 0.15rem; color: ${prefs.isWord ? '#000' : '#94a3b8'}; font-size: 0.9rem;">$1</li>`)
        .replace(/^> (.*$)/gm, `<blockquote style="border-left: 4px solid #3b82f6; padding: 0.5rem 1rem; margin: 1rem 0; background: rgba(59,130,246,0.05); font-style: italic; color: ${prefs.isWord ? '#1e293b' : '#94a3b8'};">$1</blockquote>`);
    
    // Cleanup redundant newlines - more surgical approach
    const cleanHtml = html
        .replace(/<\/h[1-3]>\s*\n+/g, (match) => match.replace(/\n+/g, '<br/>'))
        .replace(/\n\s*\n/g, '<div style="margin-bottom: 12px;"></div>')
        .replace(/\n/g, ' ');

    return `<div class="prose-styles" style="font-family: 'Inter', sans-serif; line-height: 1.5; text-align: justify; color: ${textColor};">${cleanHtml}</div>`;
};

interface ReportStepProps {
    data: AnalysisData;
    onUpdate?: (newData: Partial<AnalysisData>) => void;
}

export const ReportStep: React.FC<ReportStepProps> = ({ data, onUpdate }) => {
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [reportText, setReportText] = React.useState('');
    const [copySuccess, setCopySuccess] = React.useState(false);
    const [generationStep, setGenerationStep] = React.useState('');

    const formatPrefs = {
        h2FontSizeRem: 1.15,
        h2Weight: 700,
        h2MarginTopPx: 48,
        h2MarginBottomPx: 8,
        h3FontSizeRem: 1.0,
        h3MarginTopPx: 8,
        h3MarginBottomPx: 2,
    };

    const handleGenerateReport = async () => {
        setIsGenerating(true);
        try {
            setGenerationStep('Iniciando análise normativa NBR 5419-2:2026...');
            await new Promise(r => setTimeout(r, 600));
            setGenerationStep('Processando dados de densidade (Ng) e áreas (Ad, Am)...');
            await new Promise(r => setTimeout(r, 600));
            setGenerationStep('Calculando componentes de probabilidade e perdas...');
            await new Promise(r => setTimeout(r, 600));
            setGenerationStep('Consolidando resultados e gerando parecer técnico...');
            await new Promise(r => setTimeout(r, 600));
            setGenerationStep('Formatando relatório executivo premium...');
            
            const fullReport = await generateFullReportText(data);
            setReportText(fullReport);
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
        } finally {
            setIsGenerating(false);
            setGenerationStep('');
        }
    };

    const handleDownloadWord = async () => {
        setIsGenerating(true);
        try {
            setGenerationStep('Gerando versão MS Word...');
            const wordReportText = await generateFullReportText(data, true);
            const htmlContent = markdownToHtml(wordReportText, { ...formatPrefs, isWord: true });
            const defaultName = `RELATORIO_SPDA_${(data.clientName || 'PROJETO').replace(/\s+/g, '_').toUpperCase()}.doc`;
            
            const wordHtml = `
                <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                <head>
                    <meta charset='utf-8'>
                    <style>
                        body { font-family: 'Arial', sans-serif; font-size: 11pt; color: #000000; }
                        table { border-collapse: collapse; width: 100%; border: 1pt solid #000; }
                        td, th { border: 1pt solid #000; padding: 4pt; font-size: 10pt; }
                    </style>
                </head>
                <body>${htmlContent}</body>
                </html>
            `;
            
            const blob = new Blob(['\ufeff', wordHtml], { type: 'application/msword' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = defaultName;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erro ao baixar Word:', error);
        } finally {
            setIsGenerating(false);
            setGenerationStep('');
        }
    };

    const handlePrint = async () => {
        setIsGenerating(true);
        try {
            setGenerationStep('Preparando versão para impressão PDF...');
            const printReportText = await generateFullReportText(data, true);
            const printableHtml = markdownToHtml(printReportText, { ...formatPrefs, isWord: true });
            const win = window.open('', '_blank');
            if (!win) return;
            win.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title>Relatório SPDA - ${data.clientName || 'N/A'}</title>
            <style>
                @page { size: A4; margin: 15mm; }
                body { font-family: sans-serif; color: #000; line-height: 1.4; }
                table { width: 100%; border-collapse: collapse; margin: 4mm 0; border: 1pt solid #000; }
                td, th { border: 0.5pt solid #000; padding: 2mm; font-size: 9.5pt; }
                
                td[style*="width: 11%"] { width: 11% !important; }
                td[style*="width: 5%"] { width: 5% !important; }
                td[style*="width: 14%"] { width: 14% !important; }

                .status-box { border: 2pt solid #000; padding: 5mm; margin: 6mm 0; }
                .footer { margin-top: 10mm; border-top: 0.5pt solid #ccc; font-size: 8pt; text-align: center; }
            </style></head><body>
                ${printableHtml}
                <div class="footer">Gerado via Plataforma SPDA — ${new Date().toLocaleDateString('pt-BR')} — Engº Júlio César Certo — WhatsApp (35) 9 8811-3746</div>
            </body></html>`);
            win.document.close();
            setTimeout(() => { win.focus(); win.print(); }, 800);
        } catch (error) {
            console.error('Erro ao preparar impressão:', error);
        } finally {
            setIsGenerating(false);
            setGenerationStep('');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-stretch gap-4">
                <AnimatePresence mode="wait">
                    {!reportText ? (
                        <motion.div key="gen-btn" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
                            <Button
                                onClick={handleGenerateReport}
                                disabled={isGenerating}
                                className="w-full h-20 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl"
                            >
                                {isGenerating ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span>{generationStep}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-8 h-8" />
                                        <span className="text-xl font-black tracking-widest uppercase">Gerar Relatório</span>
                                    </div>
                                )}
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div key="report-view" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 bg-slate-900 border border-slate-700 rounded-3xl p-5">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                    <FileText className="w-6 h-6 text-blue-400" /> Relatório Técnico
                                </h3>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={handleDownloadWord}>Word</Button>
                                    <Button variant="outline" size="sm" onClick={handlePrint}>PDF</Button>
                                    <Button variant="outline" size="icon" onClick={() => setReportText('')}><X className="w-4 h-4" /></Button>
                                </div>
                            </div>
                            <div 
                                className="bg-slate-950 p-8 rounded-2xl border border-slate-800 max-h-[600px] overflow-y-auto"
                                dangerouslySetInnerHTML={{ __html: markdownToHtml(reportText, formatPrefs) }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Sidebar discreto para salvar quando o relatório ainda não foi gerado ou junto a ele */}
                {!reportText && (
                    <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="md:w-64 h-20 bg-slate-950/40 border border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-1 group hover:bg-blue-900/10 cursor-pointer transition-all border-dashed"
                        onClick={async () => {
                            const json = JSON.stringify(data, null, 2);
                            const defaultName = `PROJETO_SPDA_${(data.clientName || 'PROJETO').replace(/\s+/g, '_').toUpperCase()}.spda`;
                            
                            if ('showSaveFilePicker' in window) {
                                try {
                                    const handle = await (window as any).showSaveFilePicker({
                                        suggestedName: defaultName,
                                        types: [{
                                            description: 'Arquivo de Projeto SPDA',
                                            accept: { 'application/json': ['.spda'] },
                                        }],
                                    });
                                    const writable = await handle.createWritable();
                                    await writable.write(json);
                                    await writable.close();
                                    return;
                                } catch (err: any) {
                                    if (err.name === 'AbortError') return;
                                }
                            }

                            const blob = new Blob([json], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = defaultName;
                            link.click();
                            URL.revokeObjectURL(url);
                         }}
                    >
                        <FileDown className="w-6 h-6 text-slate-500 group-hover:text-blue-400 group-hover:scale-110 transition-all" />
                        <span className="text-[10px] font-black text-slate-500 group-hover:text-blue-400 uppercase tracking-widest leading-none">Salvar Projeto</span>
                    </motion.div>
                )}
            </div>
            {!reportText && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card className="bg-slate-950/60 border-slate-800 shadow-xl rounded-3xl overflow-hidden mt-6 p-5">
                        <div className="flex items-center gap-2 text-slate-200 text-sm uppercase font-black tracking-widest mb-4">
                            <CheckCircle className="w-4 h-4 text-emerald-500" /> Confirmação Técnica
                        </div>
                        <p className="text-slate-300 leading-relaxed text-xs italic border-l-4 border-emerald-500/30 pl-4 py-1 mb-6">
                            "Este relatório automatizado é uma ferramenta de apoio para cálculos da NBR 5419:2026. A conferência final e a responsabilidade técnica integral pelo projeto cabem exclusivamente ao profissional habilitado."
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest block mb-1">Autor da Ferramenta</span>
                                <span className="text-slate-100 font-bold text-xs">Engº Júlio César Certo</span>
                                <span className="text-[8px] text-slate-500 block mt-1 leading-none italic">(Não é o Resp. Técnico pela análise)</span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest block mb-1">WhatsApp Apoio</span>
                                <span className="text-slate-100 font-bold text-xs">(35) 9 8811-3746</span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest block mb-1">E-mail Suporte</span>
                                <span className="text-slate-200 font-medium text-[10px]">julio.certo@hotmail.com</span>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            )}
        </div>
    );
};
