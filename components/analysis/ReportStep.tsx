import React, { useMemo, useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../ui';
import { FileText, Copy, Loader2, Sparkles, X, AlertTriangle, CheckCircle } from "lucide-react";
import { AnalysisData, ZoneCalculations } from '../../types';
import { generateFullReportText } from '../../lib/reportBuilder';
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

        // Horizontal rule ---
        if (line.trim() === '---') {
            if (inList) { html += '</ul>\n'; inList = false; }
            html += '<hr style="border:0;border-top:1px solid #cbd5e1;margin:12px 0"/>\n';
            continue;
        }

        // Image markdown with optional caption handling
        const imgMatch = line.trim().match(/^!\[(.*?)\]\((.*?)\)$/);
        if (imgMatch) {
            const [, alt, src] = imgMatch;
            if (inList) { html += '</ul>\n'; inList = false; }

            // Check if next or previous textual line is a caption (e.g., "Figura 3.1: Nome")
            const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
            const prevLine = i - 1 >= 0 ? lines[i - 1].trim() : '';
            const captionRegex = /^(Figura|FIGURA)\s*([0-9]+(?:\.[0-9]+)*)[\.:\-]\s*(.*)$/;
            let captionText: string | null = null;

            // Prefer caption on the next line (below image), else previous line, else use alt
            const nextCap = nextLine.match(captionRegex);
            const prevCap = prevLine.match(captionRegex);
            if (nextCap) {
                captionText = `Figura ${nextCap[2]} — ${nextCap[3]}`.trim();
                // Skip the next line as it's consumed as caption
                i += 1;
            } else if (prevCap) {
                // Remove previously added paragraph if it was just appended
                // A simple approach: do not append previous caption paragraph earlier.
                // Since we can't remove, we avoid adding it by detecting in its branch below.
                captionText = `Figura ${prevCap[2]} — ${prevCap[3]}`.trim();
            } else if (alt && alt.trim().length > 0) {
                captionText = alt.trim();
            }

            const figCaptionHtml = captionText ? `<figcaption>${processInline(captionText)}</figcaption>` : '';
            html += `<figure>` +
                    `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" style="max-width:100%;height:auto;border-radius:4px;border:none;display:inline-block;page-break-inside:avoid"/>` +
                    `${figCaptionHtml}` +
                    `</figure>\n`;
            continue;
        }

        // Callouts iniciados por "> " viram parágrafos simples (sem caixa)
        if (line.startsWith('> ')) {
            if (inList) { html += '</ul>\n'; inList = false; }
            const content = processInline(line.substring(2));
            html += `<p>${content}</p>\n`;
            continue;
        }

        if (line.startsWith('## ')) {
            if (inList) { html += '</ul>\n'; inList = false; }
            html += `<h2 style="font-size:1.25rem;line-height:1.6;font-weight:700;">${processInline(line.substring(3))}</h2>\n`;
            continue;
        }
        if (line.startsWith('### ')) {
            if (inList) { html += '</ul>\n'; inList = false; }
            html += `<h3 style="font-size:1.1rem;line-height:1.5;font-weight:700;">${processInline(line.substring(4))}</h3>\n`;
            continue;
        }

        if (line.trim().startsWith('* ')) {
            if (!inList) {
                html += '<ul>\n';
                inList = true;
            }
            let itemContent = line.trim().substring(2);
            while (i + 1 < lines.length && lines[i + 1].startsWith('  ')) {
                itemContent += ' ' + lines[i + 1].trim();
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
            // Avoid emitting caption lines as paragraphs when followed by an image
            const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
            const isCaptionAhead = /^(Figura|FIGURA)\s*([0-9]+(?:\.[0-9]+)*)[\.:\-]\s*(.*)$/.test(line.trim()) && /^!\[(.*?)\]\((.*?)\)$/.test(nextLine);
            if (!isCaptionAhead) {
                html += `<p>${processInline(line)}</p>\n`;
            }
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
    // Configurações ergonômicas e comuns para impressão
    // Preset "Amplo" como padrão
    const [pageMarginTB, setPageMarginTB] = useState<number>(22); // mm (topo/base)
    const [pageMarginLR, setPageMarginLR] = useState<number>(15); // mm (laterais)
    // Usamos estes dois pares como "zona segura topo/base" (altura + padding)
    const [headerHeight, setHeaderHeight] = useState<number>(22); // mm (zona segura topo – altura)
    const [headerPadding, setHeaderPadding] = useState<number>(6); // mm (zona segura topo – padding)
    const [footerHeight, setFooterHeight] = useState<number>(22); // mm (zona segura base – altura)
    const [footerPadding, setFooterPadding] = useState<number>(6); // mm (zona segura base – padding)

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

    const copyToClipboard = async () => {
        if (!reportText) return;

        // Convert Markdown to HTML to copy with formatting
        const html = markdownToHtml(reportText);

        // Generate readable plain text as fallback
        const plainText = reportText
            .replace(/\!\[[^\]]*\]\([^\)]*\)/g, '') // remove image markdown
            .replace(/^###\s+/gm, '')
            .replace(/^##\s+/gm, '')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/^>\s+/gm, '')
            .replace(/\n\n+/g, '\n\n');

        try {
            if (typeof (window as any).ClipboardItem !== 'undefined') {
                const item = new (window as any).ClipboardItem({
                    'text/html': new Blob([html], { type: 'text/html' }),
                    'text/plain': new Blob([plainText], { type: 'text/plain' }),
                });
                await navigator.clipboard.write([item]);
            } else {
                await navigator.clipboard.writeText(plainText);
            }
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            try { await navigator.clipboard.writeText(plainText); } catch {}
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
                {/* Barra de ações abaixo do título, alinhada à direita */}
                {reportText && !isGenerating && (
                    <div className="flex justify-end gap-2 px-2 pb-0">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                                const html = markdownToHtml(reportText);
                                const win = window.open('', '_blank');
                                if (!win) return;
                                const padTop = Math.max(4, headerPadding);
                                const padBottom = Math.max(4, footerPadding);
                                win.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title></title><style>
@page{margin:${pageMarginTB}mm ${pageMarginLR}mm;}
*{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu; background:#ffffff; color:#111827; margin:0; line-height:1.6;}
main{padding:${padTop}mm ${pageMarginLR}mm ${padBottom}mm; overflow:visible;}
h2{font-size:20px; line-height:1.6; color:#0f172a; font-weight:700; margin:16px 0 10px; break-inside:avoid; break-after:avoid-page;}
h3{font-size:18px; line-height:1.5; color:#1f2937; font-weight:700; margin:12px 0 8px; break-inside:avoid; break-after:avoid-page;}
ul{margin:8px 0 12px; padding-left:18px; break-inside:avoid;}
li{break-inside:avoid;}
p{margin:8px 0; break-inside:avoid;}
img{max-width:100%; height:auto; display:block; page-break-inside:avoid; break-inside:avoid;}
blockquote{margin:8px 0; padding:10px 12px; border-left:3px solid #3b82f6; background:transparent; color:#0f172a; border-radius:6px; break-inside:avoid;}
hr{border:0; border-top:1px solid #cbd5e1; margin:12px 0; break-inside:avoid;}
</style></head><body><main>${html}</main>
<script>
(function(){
  const mmPerPx = 25.4/96;
  const pxPerMm = 1/mmPerPx;
  const main = document.querySelector('main');
  if(!main) return;
  const first = main.querySelector('img, table, canvas');
  if(!first) return;
  const rect = first.getBoundingClientRect();
  const hPx = rect.height;
  const extraTopMm = Math.min(Math.max((hPx*mmPerPx)*0.06, 4), 18);
  const extraBottomMm = Math.min(Math.max((hPx*mmPerPx)*0.04, 4), 14);
  const computed = getComputedStyle(main);
  const curTopPx = parseFloat(computed.paddingTop)||0;
  const curBottomPx = parseFloat(computed.paddingBottom)||0;
  main.style.paddingTop = (curTopPx + extraTopMm*pxPerMm) + 'px';
  main.style.paddingBottom = (curBottomPx + extraBottomMm*pxPerMm) + 'px';
  try { document.title = ''; } catch {}
})();
</script></body></html>`);
                                win.document.close();
                                win.focus();
                                setTimeout(() => { try { win.print(); } catch {} }, 300);
                            }}
                        >
                            Gerar PDF
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={copyToClipboard}
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            {copySuccess ? 'Texto copiado!' : 'Copiar para Word (formatado)'}
                        </Button>
                    </div>
                )}
                <CardContent className="text-center px-3 pt-0 pb-3">
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
                                    className="w-full h-[30rem] overflow-y-auto p-5 rounded-lg border border-slate-700/40 bg-slate-900/50 text-[17px] leading-loose tracking-[0.02em] text-slate-100 focus:outline-none prose-styles"
                                    dangerouslySetInnerHTML={{ __html: markdownToHtml(reportText) }}
                                />
                                {/* Configurações removidas: impressão agora usa valores ergonômicos automáticos */}
                                {/* Barra de ações movida para fora da caixa */}
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
                                    className="w-full max-w-sm mx-auto my-3"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Gerar Relatório Técnico da Análise de Risco
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
            {/* Barra externa removida: ações agora ficam abaixo do título dentro do Card */}
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
