import React, { useMemo, useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../ui';
import { FileText, Copy, Loader2, Sparkles, X, AlertTriangle, CheckCircle } from "lucide-react";
import { AnalysisData, ZoneCalculations } from '../../types';
import { generateFullReportText } from '../../lib/geminiService';
const PdfOcrViewerLazy = React.lazy(() => import('../tools/PdfOcrViewer').then(m => ({ default: m.PdfOcrViewer })));
import { motion, AnimatePresence } from "framer-motion";
import { 
    calculateEvents,
    calculateProbabilities,
    calculateLossesForZone,
    calculateRisksForZone,
    aggregateRiskResults,
    mergeZoneProbabilities
} from '../../utils/calculations';

interface ReportStepProps {
    data: AnalysisData;
    onUpdate: (newData: Partial<AnalysisData>) => void;
}

const escapeHtml = (str: string) => str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const markdownToHtml = (markdown: string): string => {
    if (!markdown) return '';
    const text = markdown.replace(/\\n/g, '\n');

    const lines = text.split('\n');
    let html = '';
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        const processInline = (str: string) => escapeHtml(str).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

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

        if (inList) {
            html += '</ul>\n';
            inList = false;
        }

        if (line.trim()) {
            html += `<p>${processInline(line)}</p>\n`;
        }
    }

    if (inList) {
        html += '</ul>\n';
    }

    return html;
};


export function ReportStep({ data, onUpdate }: ReportStepProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportText, setReportText] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);
    const [showOcr, setShowOcr] = useState(false);

    const handleGenerateReport = async () => {
        setIsGenerating(true);
        setReportText('');
        try {
            const text = await generateFullReportText(data);
            setReportText(text);
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        if (reportText) {
            // Remove HTML tags for plain text copy
            const plainText = reportText.replace(/<[^>]*>/g, '\n').replace(/\n\n+/g, '\n\n');
            navigator.clipboard.writeText(plainText);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    // Calcular resultados atuais do app para comparação (espelhando hooks)
    const eventCalculations = useMemo(() => calculateEvents(data), [
        data.h, data.l, data.w, data.hp, data.ng, data.cd, 
        data.has_electric_line, data.line_sections_1, data.use_adj_structure_1, data.l_adj_1, data.w_adj_1, data.h_adj_1, data.hp_adj_1, data.cd_adj_1,
        data.has_data_line, data.line_sections_2, data.use_adj_structure_2, data.l_adj_2, data.w_adj_2, data.h_adj_2, data.hp_adj_2, data.cd_adj_2
    ]);
    const probabilityCalculations = useMemo(() => calculateProbabilities(
        data.probability_data,
        data.analyze_data_line_probabilities,
        data.has_data_line
    ), [data.probability_data, data.analyze_data_line_probabilities, data.has_data_line]);
    const zoneCalculations: ZoneCalculations[] = useMemo(() => {
        return data.zones.map(zone => {
            const lossCalculations = calculateLossesForZone(zone);
            const zoneBaseProbCalcs = calculateProbabilities(
                (zone.probability_data || data.probability_data),
                data.analyze_data_line_probabilities,
                data.has_data_line
            );
            const zoneProbCalcs = mergeZoneProbabilities(zoneBaseProbCalcs, zone);
            const riskCalculations = calculateRisksForZone(
                eventCalculations,
                zoneProbCalcs,
                lossCalculations,
                data.selected_risk_components
            );
            return { zone, lossCalculations, riskCalculations };
        });
    }, [data.zones, eventCalculations, data.selected_risk_components, data.analyze_data_line_probabilities, data.has_data_line, data.probability_data]);
    const totalRiskResults = useMemo(() => aggregateRiskResults(zoneCalculations), [zoneCalculations]);

    // Removido: lógica de comparação com exemplo NBR 5419-2:2015
    
    return (
        <div>
            <Card>
                 <CardHeader className="p-3">
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-slate-100" />
                            Relatório Técnico Detalhado
                        </div>
                        {(reportText && !isGenerating) && (
                            <Button variant="outline" size="icon" onClick={() => setReportText('')} className="h-8 w-8 flex-shrink-0">
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center p-3">
                    <div className="flex flex-wrap gap-2 mb-3 justify-start">
                        <Button variant="secondary" onClick={() => setShowOcr(s => !s)}>
                            {showOcr ? 'Ocultar OCR do PDF' : 'Extrair texto do PDF (OCR)'}
                        </Button>
                    </div>
                    <AnimatePresence mode="wait">
                        {isGenerating ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex flex-col items-center justify-center min-h-[10rem]"
                            >
                                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                                <p className="mt-3 text-slate-300">Gerando Relatório...</p>
                            </motion.div>
                        ) : reportText ? (
                            <motion.div
                                key="report"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-left pt-4 relative"
                            >
                                <div
                                    className="w-full h-[30rem] overflow-y-auto p-4 rounded-lg border border-slate-600 bg-slate-900/80 text-sm text-slate-200 focus:outline-none prose-styles"
                                    dangerouslySetInnerHTML={{ __html: markdownToHtml(reportText) }}
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={copyToClipboard}
                                    className="absolute top-6 right-2"
                                >
                                    <Copy className="w-4 h-4 mr-2" />
                                    {copySuccess ? 'Copiado!' : 'Copiar'}
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="initial"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <Button
                                    onClick={handleGenerateReport}
                                    disabled={isGenerating}
                                    className="w-full max-w-sm mx-auto"
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Gerar Relatório com IA
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
            {showOcr && (
                <React.Suspense fallback={<div className="text-slate-300 flex items-center gap-2"><Loader2 className="animate-spin" /> Carregando OCR…</div>}>
                    <PdfOcrViewerLazy />
                </React.Suspense>
            )}
            {/* Card de comparação removido conforme solicitado */}
            {/* Responsabilidade Técnica e Suporte */}
            <Card className="mt-4 bg-slate-900/80 border-slate-600/60">
                <CardHeader className="p-3">
                    <CardTitle className="flex items-start gap-2">
                        <span className="flex items-start gap-2">
                            {/* Ícone verde garantido no mobile */}
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                            <span className="text-slate-100 text-sm sm:text-base leading-relaxed text-justify">
                                Responsabilidade Técnica e Conferência Final do Relatório
                            </span>
                        </span>
                        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4 text-sm text-slate-200">
                    <div className="space-y-2">
                        <p>
                            A <strong>NBR 5419:2025</strong> deve ser utilizada como <strong>fonte principal</strong> para validação dos dados e referência normativa do relatório.
                        </p>
                        <p>
                            Este aplicativo atua <strong>exclusivamente como uma ferramenta de apoio</strong> para cálculos e emissão de relatórios, <strong>não isentando o usuário</strong> de sua responsabilidade legal e técnica quanto à <strong>veracidade</strong>, <strong>precisão</strong> e <strong>adequação</strong> das informações fornecidas.
                        </p>
                    </div>

                    

                    <div className="space-y-3">
                        <h3 className="font-semibold text-slate-100">🤝 Informações de Contato para Negócios com Eng° Júlio Certo</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="rounded-md border border-slate-700 p-3 bg-slate-800/60">
                                <div className="text-xs text-slate-400">Autor do Aplicativo</div>
                                <div className="font-medium">Engº Júlio César Certo</div>
                            </div>
                            <div className="rounded-md border border-slate-700 p-3 bg-slate-800/60">
                                <div className="text-xs text-slate-400">Contato (WhatsApp)</div>
                                <div className="font-medium">(35) 9 8811-3746</div>
                            </div>
                            <div className="rounded-md border border-slate-700 p-3 bg-slate-800/60">
                                <div className="text-xs text-slate-400">E-mail</div>
                                <div className="font-medium">julio.certo@hotmail.com</div>
                            </div>
                        </div>
                        <p className="text-sm text-slate-300">
                            Ao utilizar este aplicativo em estudos ou projetos, cite a fonte: Engº Júlio César Certo — Ferramenta de Análise de Risco SPDA NBR 5419.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}