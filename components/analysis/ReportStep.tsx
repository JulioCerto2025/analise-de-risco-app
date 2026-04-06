import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Layers, BoxIcon, CheckCircle, AlertTriangle, Loader2, X, FileDown } from 'lucide-react';
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
        .replace(/^## (.*$)/gm, `<h2 style="font-size: ${prefs.h2FontSizeRem}rem; font-weight: 800; color: ${subheaderColor}; margin-top: ${prefs.h2MarginTopPx}px; margin-bottom: ${prefs.h2MarginBottomPx}px; border-left: 6px solid ${isWord ? '#1e3a8a' : '#3b82f6'}; padding-left: 0.75rem; background: ${bgHeader};">$1</h2>`)
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
    
    // Cleanup redundant newlines - extremely aggressive
    const cleanHtml = html
        .replace(/<\/h[1-3]>\n+/g, ' ') 
        .replace(/\n+<table/g, '<table') 
        .replace(/<\/table>\n+/g, '</table>')
        .replace(/\n\s*\n/g, '<div style="margin-bottom: 4px;"></div>')
        .replace(/\n/g, ' ');

    return `<div class="prose-styles" style="font-family: 'Inter', sans-serif; line-height: 1.35;">${cleanHtml}</div>`;
};

interface ReportStepProps {
    data: AnalysisData;
}

export const ReportStep: React.FC<ReportStepProps> = ({ data }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportText, setReportText] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);
    const [generationStep, setGenerationStep] = useState('');

    // Configurações de impressão (em mm)
    const pageMarginLR = 15;
    const pageMarginTB = 15;
    
    const formatPrefs = {
        h2FontSizeRem: 1.5,
        h2MarginTopPx: 12,
        h2MarginBottomPx: 4,
        h3FontSizeRem: 1.15,
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
            setGenerationStep('Gerando versão de alta compatibilidade para Microsoft Word...');
            // Gera o texto do relatório com o tema de alta visibilidade/contraste (isWord = true)
            const wordReportText = await generateFullReportText(data, true);
            const htmlContent = markdownToHtml(wordReportText, { ...formatPrefs, isWord: true });
            const defaultName = `RELATORIO_SPDA_${(data.clientName || 'PROJETO').replace(/\s+/g, '_').toUpperCase()}.doc`;
            
            // Estilo CSS base para o Word (força bordas sólidas e cores padrão)
            const wordHtml = `
                <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                <head>
                    <meta charset='utf-8'>
                    <title>Relatório SPDA - NBR 5419-2:2026</title>
                    <style>
                        body { font-family: 'Arial', sans-serif; font-size: 11pt; color: #000000; }
                        h1 { color: #000000; font-size: 18pt; text-align: center; }
                        h2 { color: #1e3a8a; font-size: 14pt; border-bottom: 0.5pt solid #1e3a8a; padding-bottom: 2pt; margin-top: 15pt; }
                        h3 { color: #334155; font-size: 12pt; margin-top: 10pt; }
                        table { border-collapse: collapse; width: 100%; margin-bottom: 10pt; border: 1pt solid #000000; }
                        td, th { border: 1pt solid #000000; padding: 4pt; font-size: 10pt; color: #000000; }
                        .status-box { padding: 10pt; border: 1.5pt solid #000000; margin: 10pt 0; background-color: #f8fafc; }
                        b, strong { color: #000000; }
                    </style>
                </head>
                <body>
                    ${htmlContent}
                    <div style="margin-top: 30pt; font-size: 8pt; color: #666666; text-align: center;">
                        Documento gerado automaticamente via Plataforma SPDA NBR 5419-2:2026 em ${new Date().toLocaleDateString('pt-BR')}
                    </div>
                </body>
                </html>
            `;
            
            // Tenta usar a File System Access API (Salvar Como)
            if ('showSaveFilePicker' in window) {
                try {
                    const handle = await (window as any).showSaveFilePicker({
                        suggestedName: defaultName,
                        types: [{
                            description: 'Relatório Microsoft Word (.doc)',
                            accept: { 'application/msword': ['.doc'] },
                        }],
                    });
                    const writable = await handle.createWritable();
                    await writable.write('\ufeff' + wordHtml);
                    await writable.close();
                    return;
                } catch (err: any) {
                    if (err.name === 'AbortError') return;
                }
            }

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

    const copyToClipboard = () => {
        try {
            const tempElement = document.createElement('div');
            tempElement.innerHTML = markdownToHtml(reportText, formatPrefs);
            const blob = new Blob([tempElement.innerHTML], { type: 'text/html' });
            const dataTransfer = [new (window as any).ClipboardItem({ 'text/html': blob })];
            (navigator.clipboard as any).write(dataTransfer).then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            });
        } catch (e) {
            navigator.clipboard.writeText(reportText).then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            });
        }
    };

    const handlePrint = () => {
        // HTML specifically for high-quality print - Clean and High Contrast
        const printableHtml = reportText
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/\| (.*) \|/g, (match) => {
                if (match.includes('---')) return '';
                const cells = match.split('|').filter(c => c.trim() !== '').map(c => `<td>${c.trim()}</td>`).join('');
                return `<tr>${cells}</tr>`;
            })
            .replace(/(<tr>.*?<\/tr>)+/g, (match) => `<table class="print-table">${match}</table>`)
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/^- (.*$)/gm, '<li>$1</li>')
            .replace(/^\d\. (.*$)/gm, '<li>$1</li>')
            .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
            .replace(/!\[(.*?)\]\((.*?)\)/g, '<div class="chart-container"><img src="$2" /></div>');

        const win = window.open('', '_blank');
        if (!win) return;
        win.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title>LAUDO TECNICO SPDA - NBR 5419-2</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
            <style>
                @page { size: A4; margin: 15mm; }
                body { font-family: 'Inter', -apple-system, sans-serif; color: #000 !important; background: #fff !important; line-height: 1.4; padding: 0; margin: 0; }
                
                /* GLOBAL OVERRIDES FOR PRINT PURITY */
                * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                
                /* OVERRIDE INLINE STYLES FROM CALCULATOR */
                div[style*="background"], div[style*="background-color"] { background: transparent !important; border-color: #000 !important; }
                span[style*="color"], p[style*="color"], td[style*="color"], b[style*="color"] { color: #000 !important; }
                td[style*="border"], th[style*="border"], table[style*="border"] { border: 0.5pt solid #000 !important; }
                
                .report { max-width: 100%; }
                h1 { font-size: 20pt; color: #1e3a8a !important; text-align: center; text-transform: uppercase; border-bottom: 2pt solid #1e3a8a !important; padding-bottom: 3mm; margin-bottom: 8mm; font-weight: 900; }
                h2 { font-size: 14pt; color: #1e40af !important; border-left: 5pt solid #1e40af !important; padding-left: 3mm; margin-top: 10mm; margin-bottom: 4mm; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 2mm; text-transform: uppercase; }
                h3 { font-size: 11pt; color: #1e293b !important; border-bottom: 0.5pt solid #cbd5e1 !important; margin-top: 6mm; padding-bottom: 1mm; font-weight: 700; text-transform: uppercase; }
                
                p, li { font-size: 10pt; text-align: justify; margin-bottom: 3pt; color: #000 !important; }
                
                table { width: 100%; border-collapse: collapse; margin: 4mm 0; table-layout: fixed; border: 1px solid #000 !important; }
                td, th { border: 0.5pt solid #000 !important; padding: 2mm; font-size: 9pt; color: #000 !important; }
                th, tr[style*="background: rgba(15,23,42,0.5)"] { background: #f1f5f9 !important; color: #000 !important; font-weight: bold; }
                
                /* STATUS COLORS - THE ONLY COLORS ALLOWED */
                .status-box { border: 2pt solid #000 !important; padding: 5mm; margin: 6mm 0; page-break-inside: avoid; border-radius: 4px; }
                .status-box.safe { border-color: #059669 !important; background: #f0fdf4 !important; }
                .status-box.safe h3, .status-box.safe p { color: #065f46 !important; }
                .status-box.danger { border-color: #dc2626 !important; background: #fef2f2 !important; }
                .status-box.danger h3, .status-box.danger p { color: #991b1b !important; }

                /* FORCE OK/CRITICAL COLORS */
                td[style*="color: #10b981"] { color: #059669 !important; font-weight: bold; }
                td[style*="color: #ef4444"] { color: #dc2626 !important; font-weight: bold; }
                
                .chart-container { text-align: center; margin: 5mm 0; page-break-inside: avoid; }
                .chart-container img { max-width: 130mm; }
                
                .footer { margin-top: 10mm; border-top: 0.5pt solid #e2e8f0; padding-top: 3mm; font-size: 7.5pt; color: #64748b !important; text-align: center; }
                
                @media print {
                    .no-print { display: none; }
                }
            </style></head><body>
            <div class="report">
                ${printableHtml}
                <div class="footer">
                    LAUDO TÉCNICO GERADO CONFORME NBR 5419-2:2026 — SISTEMA AUTOMATIZADO PROFISSIONAL<br/>
                    Data de Emissão: ${new Date().toLocaleDateString('pt-BR')} — Página 1 de 1
                </div>
            </div>
            </body></html>`);
        win.document.close();
        
        setTimeout(() => {
            win.focus();
            win.print();
        }, 800);
    };

    return (
        <div className="space-y-4">
            {/* Ação Central: Relatório Técnico */}
            <div className="flex flex-col items-center gap-4">
                <AnimatePresence mode="wait">
                    {!reportText ? (
                        <motion.div
                            key="gen-btn"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full"
                        >
                            <Button
                                onClick={handleGenerateReport}
                                disabled={isGenerating}
                                className="w-full h-20 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl shadow-[0_10px_40px_-5px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-4 group"
                            >
                                {isGenerating ? (
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center gap-4 mb-2">
                                            <Loader2 className="w-8 h-8 animate-spin" />
                                            <span className="text-xl font-black tracking-widest uppercase">Gerando Relatório Gerencial...</span>
                                        </div>
                                        <p className="text-[10px] text-blue-300 font-bold uppercase tracking-[0.3em] animate-pulse">
                                            {generationStep}
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <FileText className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                        <span className="text-xl font-black tracking-widest uppercase">Gerar Relatório Técnico Gerencial</span>
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="report-view"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full bg-slate-900/95 border border-slate-700/40 rounded-3xl p-5 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-blue-400" />
                                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Preview do Relatório Gerencial</h3>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={handleDownloadWord} className="h-10 px-4 bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/20 flex items-center gap-2">
                                        <FileDown className="w-4 h-4" />
                                        Exportar Word
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={handlePrint} className="h-10 px-4">Gerar PDF</Button>
                                    <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-10 px-4">
                                        {copySuccess ? 'Copiado' : 'Copiar Texto'}
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => setReportText('')} className="h-10 w-10">
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div 
                                className="bg-slate-950/80 p-8 rounded-2xl border border-slate-800 shadow-inner max-h-[600px] overflow-y-auto"
                                dangerouslySetInnerHTML={{ __html: markdownToHtml(reportText, formatPrefs) }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Rodapé: Responsabilidade Técnica - Só aparece se NÃO houver relatório gerado */}
            {!reportText && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Card className="bg-slate-950/60 border-slate-800 shadow-xl rounded-3xl overflow-hidden mt-6">
                        <CardHeader className="bg-slate-900/40 border-b border-slate-800 p-4">
                            <CardTitle className="flex items-center gap-2 text-slate-200 text-sm uppercase font-black tracking-widest">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                Confirmação Técnica
                                <AlertTriangle className="w-4 h-4 text-amber-500 ml-auto opacity-50" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4">
                            <p className="text-slate-300 leading-relaxed text-xs italic border-l-4 border-emerald-500/30 pl-4 py-1">
                                "Este relatório automatizado é uma ferramenta de apoio para cálculos da NBR 5419:2026. A conferência final e a responsabilidade técnica integral pelo projeto cabem exclusivamente ao profissional habilitado."
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 group hover:border-blue-500/30 transition-colors text-center">
                                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest block mb-1 leading-none">Autor da Ferramenta</span>
                                    <span className="text-slate-100 font-bold text-xs">Engº Júlio César Certo</span>
                                    <span className="text-[8px] text-slate-500 block mt-1 leading-none italic">(Não é o Resp. Técnico pela análise)</span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 group hover:border-emerald-500/30 transition-colors text-center">
                                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest block mb-1 font-black">WhatsApp Apoio</span>
                                    <span className="text-slate-100 font-bold text-xs">(35) 9 8811-3746</span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 group hover:border-slate-700 transition-colors text-center">
                                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest block mb-1 font-black">E-mail Suporte</span>
                                    <span className="text-slate-200 font-medium text-[10px]">julio.certo@hotmail.com</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
};
