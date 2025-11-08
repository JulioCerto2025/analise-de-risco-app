import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Label, TabButton, Button, Alert, AlertDescription, FormulaTooltip, AlertTitle, useIsMobile } from '../ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Sparkles, Loader2, ChevronDown, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DecimalInput } from "../DecimalInput";
import { AnalysisData, LossData, FireRiskInfo } from '../../types';
import { RP_OPTIONS, RT_OPTIONS, RF_OPTIONS, HZ_OPTIONS, LF_OPTIONS, LO_OPTIONS, LF3_OPTIONS, LF4_OPTIONS, LO4_OPTIONS, LT_OPTIONS } from '../../constants';
import { getFireRiskFactor } from '../../lib/geminiService';
import { calculateLossesForZone } from '../../utils/calculations';
import { formatSmartNumber } from '../../lib/format';

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


// #region Sub-components for AI Panels
interface FireRiskAnalysisPanelProps {
    isPanelOpen: boolean;
    setIsPanelOpen: (isOpen: boolean) => void;
    status: AnalysisData['fireRiskAiStatus'];
    result: AnalysisData['fireRiskAiResult'];
    error: AnalysisData['fireRiskAiError'];
    onAnalyze: () => void;
}

const FireRiskAnalysisPanel: React.FC<FireRiskAnalysisPanelProps> = ({ isPanelOpen, setIsPanelOpen, status, result, error, onAnalyze }) => (
    <div className="mt-6 pt-4 border-t border-slate-600">
        <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="w-full flex justify-between items-center text-left p-2 -m-2 rounded-lg hover:bg-slate-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
            aria-expanded={isPanelOpen}
            aria-controls="fire-risk-panel"
        >
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2 pl-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Apoio à Decisão: Risco de Incêndio (rf)
            </h4>
            <motion.div animate={{ rotate: isPanelOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-5 h-5 text-slate-400" />
            </motion.div>
        </button>
        <AnimatePresence initial={false}>
            {isPanelOpen && (
                <motion.div
                    id="fire-risk-panel"
                    key="content"
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                        open: { opacity: 1, height: 'auto', marginTop: '16px' },
                        collapsed: { opacity: 0, height: 0, marginTop: '0px' },
                    }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-visible"
                >
                    <div className="space-y-4 px-2">
                        {status === 'loading' && (
                            <div className="flex items-center justify-center p-4 text-slate-400 bg-slate-800/50 rounded-lg">
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                <span>Analisando risco de incêndio...</span>
                            </div>
                        )}
                        {['idle', 'error'].includes(status || 'idle') && (
                            <div className="flex flex-col items-center gap-3 text-center">
                                <p className="text-sm text-slate-400">
                                    Use a IA para determinar o fator de risco de incêndio (rf) com base no tipo e localização do projeto.
                                </p>
                                <Button onClick={onAnalyze} disabled={status === 'loading'}>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Analisar Risco de Incêndio
                                </Button>
                            </div>
                        )}
                        {error && status === 'error' && (
                            <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
                        )}
                        {status === 'success' && result && (
                            <Alert className="bg-slate-900/60 border-slate-500/50">
                                <AlertTitle>Análise de Risco de Incêndio da IA:</AlertTitle>
                                <AlertDescription>
          <div className="prose-styles text-[17px] leading-loose tracking-[0.02em] text-slate-100" dangerouslySetInnerHTML={{ __html: markdownToHtml(result.explanation) }} />
                                    <p className="text-xs text-slate-500 mt-3 italic">
                                        O fator 'rf' sugerido de <strong className="text-blue-300">{result.rf}</strong> já foi aplicado. Você pode ajustá-lo se necessário.
                                    </p>
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

// #endregion

interface LossStepProps {
    data: AnalysisData;
    onChange: (newData: Partial<AnalysisData>) => void;
    forceActiveZoneId?: string;
    hideProbabilityEditor?: boolean;
}

const SelectInput = ({ label, value, options, onUpdate }: { label: string, value: number, options: {value: number, label: string}[], onUpdate: (val: number) => void }) => {
    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <Select 
                value={String(value)} 
                onValueChange={(v) => onUpdate(parseFloat(v))} 
                options={options}
            >
                <SelectTrigger className="min-w-[220px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                    {options.map(opt => <SelectItem key={opt.value} value={String(opt.value)} label={opt.label} />)}
                </SelectContent>
            </Select>
        </div>
    );
};

const ReadOnlyValue = ({ label, value, currency }: { label: string; value: number; currency?: boolean }) => (
    <div className="space-y-2">
        <Label>{label}</Label>
        <div className="px-3 py-2 rounded bg-slate-800/60 border border-slate-700 text-slate-100 font-mono">
            {currency ? `R$ ${Number(value || 0).toLocaleString('pt-BR')}` : Number(value || 0).toLocaleString('pt-BR')}
        </div>
    </div>
);

const formatValue = (value: number) => formatSmartNumber(value, { useScientificBelow: 0.001, scientificPrecision: 2, maxDecimals: 3 });

// Formata números como "9,98 × 10⁻⁷" para melhor leitura em Detalhe
const ScientificNotation = ({ value, precision = 2 }: { value: number; precision?: number }) => {
    if (value === 0 || !isFinite(value)) {
        return <span>0</span>;
    }
    const [mantissa, exponent] = value.toExponential(precision).split('e');
    return (
        <span className="font-mono tracking-tight" dangerouslySetInnerHTML={{ __html: `${mantissa.replace('.', ',')} &times; 10<sup>${exponent}</sup>` }} />
    );
};

// Opções para Robustez da Estrutura (rs) — rótulos resumidos para evitar truncamento
const RS_OPTIONS = [
    { value: 1, label: 'Robusta (1)' },
    { value: 2, label: 'Vulnerável (2)' },
];

const LOSS_FORMULAS: { [key: string]: { formula: string; vars: string[] } } = {
    LA: { formula: "rt * LT * rs * (nz / nt) * (tz / 8760)", vars: ["rt", "LT", "rs", "nz", "nt", "tz"] },
    LB: { formula: "rs * rp * rf * hz * LF * (nz / nt) * (tz / 8760)", vars: ["rs", "rp", "rf", "hz", "LF", "nz", "nt", "tz"] },
    LC: { formula: "LO * rs * (nz / nt) * (tz / 8760)", vars: ["LO", "rs", "nz", "nt", "tz"] },
};


const CustomTooltip = ({ active, payload, label, lossData, isGlobal, zones }: any) => {
    if (active && payload && payload.length) {
        const value = Number(payload[0].value);
        const description = payload[0]?.payload?.description;
        
        const lossKey = label.split(' = ')[0];
        const formulaInfo = LOSS_FORMULAS[lossKey as keyof typeof LOSS_FORMULAS];
        
        let formulaString = "N/A";
        let valuesString = "N/A";
        let detailNodes: React.ReactNode | null = null;

        if (formulaInfo && (lossData || isGlobal)) {
            formulaString = isGlobal ? `Σ_z [ ${formulaInfo.formula} ]` : formulaInfo.formula;
            
            const formatVarValue = (v: any) => {
                if (typeof v !== 'number') return '0';
                if (v === 0) return '0';
                if (Math.abs(v) > 1000) return v.toLocaleString('pt-BR');
                if (Math.abs(v) < 0.01) return v.toExponential(1).replace('.',',');
                return String(v).replace('.',',');
            };

            if (!isGlobal) {
                valuesString = formulaInfo.vars.reduce(
                    (acc, v) => acc.replace(new RegExp(`\\b${v}\\b`, 'g'), formatVarValue((lossData as any)[v] ?? 0)),
                    formulaInfo.formula
                );
                valuesString = valuesString.replace(/\*/g, '×');
            } else {
                const base = zones?.[0]?.loss_data || {};
                const sumNz = (zones || []).reduce((acc: number, z: any) => acc + (Number(z.loss_data?.nz) || 0), 0);
                const avgTz = (zones || []).length > 0 ? (zones || []).reduce((acc: number, z: any) => acc + (Number(z.loss_data?.tz) || 0), 0) / (zones || []).length : 0;
                if (lossKey === 'LA') {
                    valuesString = `rt × LT × rs × (Σ nz / nt) × (média tz / 8760)`
                        .replace('rt', formatVarValue(base.rt ?? 0))
                        .replace('LT', formatVarValue((base as any).LT ?? (base as any).lt ?? 0))
                        .replace('rs', formatVarValue(base.rs ?? 0))
                        .replace('Σ nz', formatVarValue(sumNz))
                        .replace('nt', formatVarValue(base.nt ?? 0))
                        .replace('média tz', formatVarValue(avgTz));
                } else if (lossKey === 'LB') {
                    valuesString = `rs × rp × rf × hz × LF × (Σ nz / nt) × (média tz / 8760)`
                        .replace('rs', formatVarValue(base.rs ?? 0))
                        .replace('rp', formatVarValue(base.rp ?? 0))
                        .replace('rf', formatVarValue(base.rf ?? 0))
                        .replace('hz', formatVarValue(base.hz ?? 0))
                        .replace('LF', formatVarValue(base.LF ?? 0))
                        .replace('Σ nz', formatVarValue(sumNz))
                        .replace('nt', formatVarValue(base.nt ?? 0))
                        .replace('média tz', formatVarValue(avgTz));
                } else if (lossKey === 'LC') {
                    valuesString = `LO × rs × (Σ nz / nt) × (média tz / 8760)`
                        .replace('LO', formatVarValue(base.LO ?? 0))
                        .replace('rs', formatVarValue(base.rs ?? 0))
                        .replace('Σ nz', formatVarValue(sumNz))
                        .replace('nt', formatVarValue(base.nt ?? 0))
                        .replace('média tz', formatVarValue(avgTz));
                }
            }

            // Construir "Detalhe" com notação científica e estrutura de multiplicação/divisão
            if (!isGlobal) {
                const vm: Record<string, number> = { ...(lossData || {}) };
                if (lossKey === 'LA') {
                    const rt = vm['rt'] || 0;
                    const LT = (vm['lt4'] ?? vm['LT'] ?? vm['lt'] ?? 0.01);
                    const rs = vm['rs'] || 0;
                    const nz = vm['nz'] || 0;
                    const nt = vm['nt'] || 0;
                    const tz = vm['tz'] || 0;
                    detailNodes = (
                        <span className="font-mono">
                            <span className="inline-flex items-baseline"><ScientificNotation value={rt} precision={2} /></span>
                            <span className="mx-0.5">×</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={LT} precision={2} /></span>
                            <span className="mx-0.5">×</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={rs} precision={2} /></span>
                            <span className="mx-0.5">×</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={nz} precision={2} /></span>
                            <span className="mx-0.5">/</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={nt} precision={2} /></span>
                            <span className="mx-0.5">×</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={tz} precision={2} /></span>
                            <span className="mx-0.5">/</span>
                            <span>8760</span>
                        </span>
                    );
                } else if (lossKey === 'LB') {
                    const rs = vm['rs'] || 0;
                    const rp = vm['rp'] || 0;
                    const rf = vm['rf'] || 0;
                    const hz = vm['hz'] || 0;
                    const LF = vm['LF'] || 0;
                    const nz = vm['nz'] || 0;
                    const nt = vm['nt'] || 0;
                    const tz = vm['tz'] || 0;
                    detailNodes = (
                        <span className="font-mono">
                            <span className="inline-flex items-baseline"><ScientificNotation value={rs} precision={2} /></span>
                            <span className="mx-0.5">×</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={rp} precision={2} /></span>
                            <span className="mx-0.5">×</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={rf} precision={2} /></span>
                            <span className="mx-0.5">×</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={hz} precision={2} /></span>
                            <span className="mx-0.5">×</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={LF} precision={2} /></span>
                            <span className="mx-0.5">×</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={nz} precision={2} /></span>
                            <span className="mx-0.5">/</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={nt} precision={2} /></span>
                            <span className="mx-0.5">×</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={tz} precision={2} /></span>
                            <span className="mx-0.5">/</span>
                            <span>8760</span>
                        </span>
                    );
                } else if (lossKey === 'LC') {
                    const LO = vm['LO'] || 0;
                    const rs = vm['rs'] || 0;
                    const nz = vm['nz'] || 0;
                    const nt = vm['nt'] || 0;
                    const tz = vm['tz'] || 0;
                    detailNodes = (
                        <span className="font-mono">
                            <span className="inline-flex items-baseline"><ScientificNotation value={LO} precision={2} /></span>
                            <span className="mx-0.5">×</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={rs} precision={2} /></span>
                            <span className="mx-0.5">×</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={nz} precision={2} /></span>
                            <span className="mx-0.5">/</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={nt} precision={2} /></span>
                            <span className="mx-0.5">×</span>
                            <span className="inline-flex items-baseline"><ScientificNotation value={tz} precision={2} /></span>
                            <span className="mx-0.5">/</span>
                            <span>8760</span>
                        </span>
                    );
                }
            } else {
                // Global: mostrar contribuição por zona
                const contributions = (zones || []).map((z: any) => {
                    const rl = calculateLossesForZone(z);
                    const val = (rl as any)[lossKey] || 0;
                    return { name: z.name || 'Zona', value: val };
                }).filter(c => c.value > 0);
                detailNodes = (
                    <div className="space-y-1">
                        <p className="text-slate-300 font-semibold">Contribuição por zona:</p>
                        <ul className="text-slate-100 font-mono text-xs sm:text-sm">
                            {contributions.map((c, idx) => (
                                <li key={`${c.name}-${idx}`}>{c.name}: <ScientificNotation value={c.value} precision={2} /></li>
                            ))}
                        </ul>
                    </div>
                );
            }
        }

        const tooltipStyle: React.CSSProperties = {
            transform: 'translate(10px, calc(-100% - 10px))',
            pointerEvents: 'none',
        };

        return (
            <div 
                style={tooltipStyle}
                className="p-3 bg-slate-800/90 border rounded-lg shadow-lg text-sm border-slate-600 backdrop-blur-sm w-auto min-w-[18rem] max-w-[48rem]"
            >
                <p className="font-bold text-slate-100 text-base mb-1">{label}</p>
                {description && <p className="text-slate-400 text-xs mb-2">{description}</p>}
                <p className="text-blue-400 font-mono">Valor {isGlobal ? 'Agregado' : ''}: <ScientificNotation value={Number(value)} precision={2} /></p>
                {formulaInfo && (
                     <>
                        <p className="text-slate-300 mt-2 font-semibold">Fórmula:</p>
                        <p className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs sm:text-sm leading-tight">{formulaString}</p>
                        <p className="text-slate-300 mt-2 font-semibold">Valores:</p>
                        <p className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs sm:text-sm break-normal whitespace-normal leading-tight">{valuesString}</p>
                        {detailNodes && (
                            <>
                                <p className="text-slate-300 mt-2 font-semibold">Detalhe:</p>
                                <div className="text-slate-100 font-mono bg-slate-700/50 px-2 py-1 rounded text-xs sm:text-sm break-normal whitespace-normal leading-tight">{detailNodes}</div>
                            </>
                        )}
                    </>
                )}
            </div>
        );
    }
    return null;
};


export function LossStep({ data, onChange, forceActiveZoneId, hideProbabilityEditor }: LossStepProps) {
    const { zones, risks_to_analyze } = data;
    const GLOBAL_ID = 'GLOBAL';
    const [activeZoneId, setActiveZoneId] = useState<string>(data.last_active_zone_id || zones[0]?.id || '');
    useEffect(() => {
        const desired = forceActiveZoneId || data.last_active_zone_id || zones[0]?.id || '';
        if (desired && desired !== activeZoneId) {
            setActiveZoneId(desired);
        } else if (!zones.find(z => z.id === activeZoneId)) {
            setActiveZoneId(zones[0]?.id || '');
        }
    }, [forceActiveZoneId, data.last_active_zone_id, zones, activeZoneId]);
    const isMobile = useIsMobile();

    const [isFireRiskPanelOpen, setIsFireRiskPanelOpen] = useState(false);
    
    // Validações de população/tempo removidas para permitir digitação livre

    const availableTabs = useMemo(() => {
        const tabs = [];
        if (risks_to_analyze.R1) {
            tabs.push({ id: 'populacao', label: 'População (R1)' });
            tabs.push({ id: 'choque', label: 'Choque Elétrico (R1)' });
            tabs.push({ id: 'incendio', label: 'Incêndio (R1)' });
            tabs.push({ id: 'equipamentos', label: 'Perda de Equipamentos (R1)' });
        }
        if (risks_to_analyze.R3) {
            tabs.push({ id: 'cultural', label: 'Patrimônio Cultural (R3)' });
        }
        if (risks_to_analyze.R4) {
            tabs.push({ id: 'economica', label: 'Perda Econômica (R4)' });
        }
        return tabs;
    }, [risks_to_analyze]);

    const [activeLossTypeTab, setActiveLossTypeTab] = useState(availableTabs[0]?.id || '');
    
    useEffect(() => {
        if (availableTabs.length > 0 && !availableTabs.find(t => t.id === activeLossTypeTab)) {
            setActiveLossTypeTab(availableTabs[0].id);
        }
    }, [availableTabs, activeLossTypeTab]);


    // Global só disponível quando há múltiplas zonas
    const isGlobal = (zones.length > 1) && activeZoneId === GLOBAL_ID;
    const currentZone = (zones.find(z => z.id === activeZoneId) || zones[0]);
    const lossData = currentZone?.loss_data || {};
    // Fixar modo em Perdas (L) e remover alternância obsoleta
    const effectiveHomogeneousType: 'P' | 'L' = 'L';

    // Se não há múltiplas zonas e a aba atual é GLOBAL, normaliza para primeira zona
    useEffect(() => {
        if ((zones.length <= 1) && activeZoneId === GLOBAL_ID) {
            const fallback = zones[0]?.id || '';
            setActiveZoneId(fallback);
            try { onChange({ last_active_zone_id: fallback } as any); } catch { /* noop */ }
        }
    }, [zones.length, activeZoneId, onChange]);

    const handleUpdate = useCallback((field: keyof LossData, rawValue: number) => {
        const value = Number.isFinite(rawValue) ? rawValue : rawValue;

        let nextZones = zones.map(z => ({ ...z, loss_data: { ...z.loss_data } }));

        if (field === 'nt') {
            // nt é global: aplicar em todas as zonas, sem travas
            nextZones.forEach((z) => { z.loss_data.nt = value as number; });
        } else if (field === 'nz') {
            // Atualiza nz apenas na zona ativa, sem clamps
            const activeIndex = nextZones.findIndex(z => z.id === activeZoneId);
            if (activeIndex < 0) {
                nextZones[0].loss_data.nz = value as number;
            } else {
                nextZones[activeIndex].loss_data.nz = value as number;
            }
        } else {
            // Outros campos: aplicar na zona ativa ou em todas as zonas quando em modo Global
            nextZones = nextZones.map(z => {
                if (!isGlobal && z.id !== activeZoneId) return z;
                const updatedLoss = { ...z.loss_data, [field]: value as number } as LossData;
                // Se mudou algum componente econômico, atualizar CT automaticamente como soma de ca+cb+cc+cs+ce
                if (['ca','cb','cc','cs','ce'].includes(field as string)) {
                    const ctSum = (Number(updatedLoss.ca) || 0)
                        + (Number(updatedLoss.cb) || 0)
                        + (Number(updatedLoss.cc) || 0)
                        + (Number(updatedLoss.cs) || 0)
                        + (Number(updatedLoss.ce) || 0);
                    (updatedLoss as any).ct_economic = ctSum;
                }
                return { ...z, loss_data: updatedLoss };
            });
        }

        onChange({ zones: nextZones });
    }, [zones, activeZoneId, onChange]);

    // Alternância de modo homogêneo removida (obsoleta)

    const PROB_KEYS: string[] = ['PA','PB','PC','PCT','PM','PMT','PU','PUT','PV','PVT','PW','PWT','PZ','PZT'];

    const handleProbOverrideUpdate = useCallback((key: string, value: number) => {
        const updatedZones = zones.map(z => {
            if (z.id !== activeZoneId) return z;
            const nextOverrides = { ...(z.probability_overrides || {}) };
            if (!key) return z;
            nextOverrides[key] = value;
            return { ...z, probability_overrides: nextOverrides };
        });
        onChange({ zones: updatedZones });
    }, [zones, activeZoneId, onChange]);

    const handleRemoveProbOverride = useCallback((key: string) => {
        const updatedZones = zones.map(z => {
            if (z.id !== activeZoneId) return z;
            const next = { ...(z.probability_overrides || {}) };
            delete next[key];
            return { ...z, probability_overrides: next };
        });
        onChange({ zones: updatedZones });
    }, [zones, activeZoneId, onChange]);

    const handleAnalyzeFireRisk = useCallback(async () => {
        onChange({ fireRiskAiStatus: 'loading', fireRiskAiResult: null, fireRiskAiError: null });
        try {
            const result = await getFireRiskFactor(data.projectName, data.clientAddress);
            if (result) {
                const updatedLossData = { ...lossData, rf: result.rf };
                const updatedZones = data.zones.map(z => z.id === activeZoneId ? { ...z, loss_data: updatedLossData } : z);
                onChange({
                    zones: updatedZones,
                    fireRiskAiStatus: 'success',
                    fireRiskAiResult: result
                });
            } else {
                onChange({ fireRiskAiStatus: 'error', fireRiskAiError: 'Não foi possível determinar o fator de risco de incêndio.' });
            }
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error("Fire Risk Analysis Error:", error);
            }
            onChange({ fireRiskAiStatus: 'error', fireRiskAiError: 'Ocorreu um erro ao analisar o risco de incêndio. Verifique a Etapa 1 e tente novamente.' });
        }
    }, [data.projectName, data.clientAddress, data.zones, activeZoneId, lossData, onChange]);
    
    // Calcular perdas para o gráfico (global ou zona)
    const l = isGlobal
        ? zones.reduce((acc, z) => {
            const rl = calculateLossesForZone(z);
            return {
                LA: (acc.LA || 0) + (rl.LA || 0),
                LB: (acc.LB || 0) + (rl.LB || 0),
                LC: (acc.LC || 0) + (rl.LC || 0),
            } as any;
        }, { LA: 0, LB: 0, LC: 0 } as any)
        : calculateLossesForZone(currentZone);

    // Group identical loss components for a cleaner chart visualization
    const groupedLossComponents = [
        { name: 'LA = LU', description: "Perda por choque elétrico (D1)", value: l.LA, color: '#ef4444' },
        { name: 'LB = LV', description: "Perda por danos físicos (D2)", value: l.LB, color: '#f59e0b' },
        { name: 'LC = LM = LW = LZ', description: "Perda por falha de sistemas (D3)", value: l.LC, color: '#3b82f6' },
    ];

    const chartData = groupedLossComponents
        .map(item => ({ name: item.name, description: item.description, value: item.value || 0, fill: item.color }))
        .filter(item => item.value > 1e-9); // Filter out zero/negligible values

    if (zones.length === 0) {
        return (
             <Card>
                <CardHeader><CardTitle>Perda Consequente (L)</CardTitle></CardHeader>
                <CardContent><p>Nenhuma zona de análise foi criada. Por favor, volte à etapa 2 e adicione uma zona.</p></CardContent>
            </Card>
        )
    }

    const currentZoneIndex = zones.findIndex(z => z.id === currentZone?.id);
    const makeZoneHeading = (zoneName: string | undefined, idx: number) => {
        const base = `Zona ${idx + 1}`;
        const name = (zoneName || '').trim();
        if (!name) return base;
        const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
        if (norm(name) === norm(base)) return base;
        return `${base} (${name})`;
    };
    const zoneHeading = makeZoneHeading(currentZone?.name, currentZoneIndex);
    const multipleZones = zones.length > 1;
    const activeHeading = isGlobal ? 'Global' : (multipleZones ? zoneHeading : 'Global');

    const editorCard = (
        <Card>
            <CardHeader>
                <CardTitle>
                    {`Fatores de Perda Consequente (L) — ${activeHeading}`}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {(zones.length > 1) && (
                    <div className="flex space-x-1 p-1 bg-slate-800/70 rounded-lg">
                        <TabButton
                            isActive={activeZoneId === GLOBAL_ID}
                            onClick={() => {
                                setActiveZoneId(GLOBAL_ID);
                                try { onChange({ last_active_zone_id: GLOBAL_ID } as any); } catch { /* noop */ }
                            }}
                        >
                            Global
                        </TabButton>
                        {zones.map(zone => (
                            <TabButton 
                                key={zone.id} 
                                isActive={activeZoneId === zone.id} 
                                onClick={() => {
                                    setActiveZoneId(zone.id);
                                    // Persistir última zona ativa
                                    try { onChange({ last_active_zone_id: zone.id } as any); } catch { /* noop */ }
                                }}
                            >
                                {zone.name}
                            </TabButton>
                        ))}
                    </div>
                )}


                {effectiveHomogeneousType === 'L' && availableTabs.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-1 bg-slate-800/70 rounded-lg">
                        {availableTabs.map(tab => (
                            <TabButton
                                key={tab.id}
                                isActive={activeLossTypeTab === tab.id}
                                onClick={() => setActiveLossTypeTab(tab.id)}
                            >
                                {tab.label}
                            </TabButton>
                        ))}
                    </div>
                )}

                {effectiveHomogeneousType === 'L' && activeLossTypeTab === 'populacao' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 items-start">
                            <DecimalInput
                                label="Nº Pessoas na Zona (nz)"
                                value={lossData.nz ?? 0}
                                onUpdate={val => { if (!isGlobal) handleUpdate('nz', val); }}
                                readOnly={isGlobal}
                                title={isGlobal ? 'Edite por zona; indisponível no modo Global' : undefined}
                                className={`space-y-2`}
                            />
                            <DecimalInput
                                label="Nº Pessoas Total (nt)"
                                value={lossData.nt ?? 1}
                                onUpdate={val => handleUpdate('nt', val)}
                                isAiSuggested={false}
                                className="space-y-2"
                            />
                            <DecimalInput
                                label="Tempo na Zona (tz) h/ano"
                                value={lossData.tz ?? 8760}
                                onUpdate={val => handleUpdate('tz', val)}
                                isAiSuggested={false}
                                className="space-y-2"
                            />
                            <SelectInput
                                label="rs - Robustez da Estrutura"
                                value={lossData.rs ?? 1}
                                options={RS_OPTIONS}
                                onUpdate={val => handleUpdate('rs', val)}
                            />
                        </div>
                    </>
                )}

                {effectiveHomogeneousType === 'L' && activeLossTypeTab === 'incendio' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <SelectInput label="LF - Danos Físicos" value={lossData.LF ?? 0.1} options={LF_OPTIONS} onUpdate={val => handleUpdate('LF', val)} />
                            <SelectInput label="rp - Medidas de Proteção" value={lossData.rp ?? 1} options={RP_OPTIONS} onUpdate={val => handleUpdate('rp', val)} />
                            <SelectInput label="rf - Risco de Incêndio" value={lossData.rf ?? 0.001} options={RF_OPTIONS} onUpdate={val => handleUpdate('rf', val)} />
                            <SelectInput label="hz - Risco de Pânico" value={lossData.hz ?? 1} options={HZ_OPTIONS} onUpdate={val => handleUpdate('hz', val)} />
                        </div>
                    </>
                )}

                {effectiveHomogeneousType === 'L' && activeLossTypeTab === 'choque' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <SelectInput label="rt - Resist. do Piso" value={lossData.rt ?? 0.01} options={RT_OPTIONS} onUpdate={val => handleUpdate('rt', val)} />
                        <SelectInput label="LT - Choque" value={(lossData as any).lt ?? 0.01} options={LT_OPTIONS} onUpdate={val => handleUpdate('lt', val)} />
                    </div>
                )}

                {effectiveHomogeneousType === 'L' && activeLossTypeTab === 'equipamentos' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <SelectInput label="LO - Falha de Sist." value={lossData.LO ?? 0.001} options={LO_OPTIONS} onUpdate={val => handleUpdate('LO', val)} />
                    </div>
                )}

                {effectiveHomogeneousType === 'L' && activeLossTypeTab === 'cultural' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                            <SelectInput label="Lf3 - Tipo de Dano" value={lossData.lf3 ?? 0.1} options={LF3_OPTIONS} onUpdate={val => handleUpdate('lf3', val)} />
                            <DecimalInput label="Valor do Patrimônio (cz)" value={lossData.cz ?? 0} onUpdate={val => handleUpdate('cz', val)} useThousands currency />
                            <DecimalInput label="Valor Total (ct)" value={lossData.ct_cultural ?? 1} onUpdate={val => handleUpdate('ct_cultural', val)} useThousands currency />
                        </div>
                )}

                {effectiveHomogeneousType === 'L' && activeLossTypeTab === 'economica' && (
                    <div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 pt-2">
                            <SelectInput label="Lf4 - Dano Físico" value={lossData.lf4 ?? 0.2} options={LF4_OPTIONS} onUpdate={val => handleUpdate('lf4', val)} />
                            <SelectInput label="Lo4 - Falha de Sist." value={lossData.lo4 ?? 0.01} options={LO4_OPTIONS} onUpdate={val => handleUpdate('lo4', val)} />
                            <SelectInput label="LT4 - Choque" value={(lossData as any).lt4 ?? 0.01} options={LT_OPTIONS} onUpdate={val => handleUpdate('lt4', val)} />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <DecimalInput label="Animais (ca)" value={lossData.ca ?? 0} onUpdate={val => handleUpdate('ca', val)} useThousands currency />
                            <DecimalInput label="Edificação (cb)" value={lossData.cb ?? 0} onUpdate={val => handleUpdate('cb', val)} useThousands currency />
                            <DecimalInput label="Conteúdo (cc)" value={lossData.cc ?? 0} onUpdate={val => handleUpdate('cc', val)} useThousands currency />
                            <DecimalInput label="Sistemas (cs)" value={lossData.cs ?? 0} onUpdate={val => handleUpdate('cs', val)} useThousands currency />
                            <DecimalInput label="Atividades (ce)" value={lossData.ce ?? 0} onUpdate={val => handleUpdate('ce', val)} useThousands currency />
                            <ReadOnlyValue label="Valor Total (ct)" value={(Number(lossData.ca)||0)+(Number(lossData.cb)||0)+(Number(lossData.cc)||0)+(Number(lossData.cs)||0)+(Number(lossData.ce)||0)} currency />
                        </div>
                    </div>
                )}

                {effectiveHomogeneousType === 'P' && !hideProbabilityEditor && (
                    <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Probabilidade (P) da zona</Label>
                                <Select 
                                    value={''}
                                    onValueChange={() => {}}
                                    options={PROB_KEYS.map(k => ({ value: k, label: k }))}
                                >
                                    <SelectTrigger><SelectValue placeholder="Selecione uma probabilidade" /></SelectTrigger>
                                    <SelectContent>
                                        {PROB_KEYS.map(k => (
                                            <SelectItem key={k} value={k} label={k} />
                                        ))}
                                    </SelectContent>
                                </Select>
                                {/* Campo manual simples para inserir/ajustar overrides */}
                                <div className="grid grid-cols-2 gap-2">
                                    {PROB_KEYS.slice(0,6).map(k => (
                                        <div key={k}>
                                            <DecimalInput label={k} value={Number(currentZone?.probability_overrides?.[k]) || 0} onUpdate={(v) => handleProbOverrideUpdate(k, Number(v) || 0)} />
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {PROB_KEYS.slice(6).map(k => (
                                        <div key={k}>
                                            <DecimalInput label={k} value={Number(currentZone?.probability_overrides?.[k]) || 0} onUpdate={(v) => handleProbOverrideUpdate(k, Number(v) || 0)} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {currentZone?.probability_overrides && Object.keys(currentZone.probability_overrides).length > 0 && (
                            <div className="mt-2">
                                <Label>Overrides definidos</Label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {Object.entries(currentZone.probability_overrides).map(([k,v]) => (
                                        <div key={k} className="px-3 py-1 bg-slate-800/70 rounded-lg border border-slate-600 text-sm flex items-center gap-2">
                                            <span className="text-slate-200">{k}: {String(v).replace('.', ',')}</span>
                                            <button className="text-red-400 hover:text-red-300" onClick={() => handleRemoveProbOverride(k)}>remover</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );

    const baseLoss = zones[0]?.loss_data || {};
    const sumNz = zones.reduce((acc, z) => acc + (Number(z.loss_data?.nz) || 0), 0);
    const avgTz = zones.length > 0 ? zones.reduce((acc, z) => acc + (Number(z.loss_data?.tz) || 0), 0) / zones.length : 0;
    const chartCard = (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Resultados das Perdas — {activeHeading}</CardTitle>
            </CardHeader>
            <CardContent className="h-[16rem]">
                {isGlobal ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                        <div className="h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                                    <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                                    <YAxis tick={{ fill: '#94a3b8' }} />
                                    {!isMobile && (
                                        <Tooltip 
                                            content={<CustomTooltip lossData={lossData} isGlobal={isGlobal} zones={zones} />}
                                            cursor={{ fill: 'rgba(30, 41, 59, 0.7)' }}
                                        />
                                    )}
                                    <Bar dataKey="value">
                                        {chartData.map((entry) => (
                                            <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-2 bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                            <p className="text-slate-200 font-semibold">Parâmetros Globais Ativos</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <Label>nt</Label>
                                    <div className="font-mono">{Number(baseLoss.nt || 0).toLocaleString('pt-BR')}</div>
                                </div>
                                <div>
                                    <Label>rs</Label>
                                    <div className="font-mono">{String(baseLoss.rs ?? 0).replace('.', ',')}</div>
                                </div>
                                <div>
                                    <Label>rf</Label>
                                    <div className="font-mono">{String(baseLoss.rf ?? 0).replace('.', ',')}</div>
                                </div>
                                <div>
                                    <Label>rp</Label>
                                    <div className="font-mono">{String(baseLoss.rp ?? 0).replace('.', ',')}</div>
                                </div>
                                <div>
                                    <Label>hz</Label>
                                    <div className="font-mono">{String(baseLoss.hz ?? 0).replace('.', ',')}</div>
                                </div>
                                <div>
                                    <Label>LF</Label>
                                    <div className="font-mono">{String(baseLoss.LF ?? 0).replace('.', ',')}</div>
                                </div>
                                <div>
                                    <Label>LO</Label>
                                    <div className="font-mono">{String(baseLoss.LO ?? 0).replace('.', ',')}</div>
                                </div>
                                <div>
                                    <Label>rt</Label>
                                    <div className="font-mono">{String(baseLoss.rt ?? 0).replace('.', ',')}</div>
                                </div>
                                <div>
                                    <Label>LT</Label>
                                    <div className="font-mono">{String((baseLoss as any).LT ?? (baseLoss as any).lt ?? 0).replace('.', ',')}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                                <div>
                                    <Label>Σ nz (todas as zonas)</Label>
                                    <div className="font-mono">{Number(sumNz || 0).toLocaleString('pt-BR')}</div>
                                </div>
                                <div>
                                    <Label>tz médio</Label>
                                    <div className="font-mono">{String(avgTz || 0).replace('.', ',')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                            <YAxis tick={{ fill: '#94a3b8' }} />
                            {!isMobile && (
                                <Tooltip 
                                    content={<CustomTooltip lossData={lossData} />}
                                    cursor={{ fill: 'rgba(30, 41, 59, 0.7)' }}
                                />
                            )}
                            <Bar dataKey="value">
                                {chartData.map((entry) => (
                                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );

    return (
        <div className="grid grid-cols-1 gap-6">
            {editorCard}
            {chartCard}
        </div>
    );
}
