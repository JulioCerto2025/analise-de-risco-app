import React, { useState } from 'react';
import { Label, Card, CardContent, CardHeader, CardTitle, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Checkbox, Button, FormulaTooltip } from '../ui';
import { Zap, Server, PlusCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DecimalInput } from "../DecimalInput";
import { AnalysisData, LineSection } from '../../types';
import { CD_OPTIONS, CI_OPTIONS, CE_OPTIONS, CT_OPTIONS_ELECTRIC, CT_OPTIONS_DATA, COMBINED_CLD_CLI_OPTIONS, UW_OPTIONS } from '../../constants';
import { ShieldingSlider } from '../ShieldingSlider';
import { calculatePld, calculatePli } from '../../utils/calculations';
import { formatSmartNumber } from '../../lib/format';

interface ConnectedLinesStepProps {
    data: AnalysisData;
    onUpdate: (newData: Partial<AnalysisData>) => void;
}

const ResultBox = ({ label, value, unit, color, formula, formulaKey, formulaValues, hideInfo }: { label: React.ReactNode; value: number; unit: string; color: string; formula?: string; formulaKey?: string, formulaValues?: { [key: string]: any }, hideInfo?: boolean }) => {
    const colorClasses: { [key: string]: { bg: string, text: string } } = {
        blue: { bg: "bg-blue-950/80", text: "text-white" },
        green: { bg: "bg-green-950/80", text: "text-white" },
    };
    const { bg, text } = colorClasses[color] || colorClasses.blue;
    const formulas = formula && formulaKey ? { [formulaKey]: formula } : {};
    
    // Formatação consistente: sempre decimal, sem notação científica
    const displayValue = formatSmartNumber(value, { maxDecimals: 2, useScientificBelow: 0 });

    const content = (
        <div className={`w-full p-3 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-blue-500/30 ${bg}`}>
            <div className={`font-black text-xl md:text-2xl tracking-tighter ${text}`}>{displayValue}</div>
            {!hideInfo && (
                <div className={`font-black text-[9px] uppercase tracking-[0.2em] text-slate-400 mt-1 flex items-center justify-center gap-1 mr-[-0.2em]`}>
                    {label}
                    <span className="opacity-60">({unit})</span>
                </div>
            )}
        </div>
    );

    if (formula) {
        return (
            <FormulaTooltip formulas={formulas} values={formulaValues} className="w-full block" triggerClassName="w-full cursor-default block">
                {content}
            </FormulaTooltip>
        );
    }

    return content;
};

export function ConnectedLinesStep({ data, onUpdate }: ConnectedLinesStepProps) {
    const shortLabelForCombined = (value: string) => {
        const [cld, cli] = (value || '').split('_');
        return `${cld},${cli}`;
    };

    // Texto resumido para cada combinação CLD/CLI, mantendo entendimento sem truncar
    const shortTextForCombined = (value: string) => {
        const map: Record<string, string> = {
            '1_1': 'Aérea/Subt. s/ blind.',
            '1_0.2': 'Neutro multiat.',
            '1_0.3': 'Subt. blind. s/ equipot.',
            '1_0.1': 'Aérea blind. s/ equipot.',
            '1_0': 'Blind. equipot. c/ equip.',
            '0_0': 'Linha/Cabo sem risco'
        };
        return map[value] || shortLabelForCombined(value);
    };

    const handleSelectChange = (field: keyof AnalysisData, value: string) => {
        onUpdate({ [field]: parseFloat(value) || 0 });
    };

    const handleCheckboxChange = (field: keyof AnalysisData, value: boolean) => {
        onUpdate({ [field]: value });
    };

    const handleSectionChange = (lineKey: 'line_sections_1' | 'line_sections_2', sectionId: string, field: keyof LineSection, value: number | string) => {
        const sections = data[lineKey];
        const newSections = sections.map(s => {
            if (s.id === sectionId) {
                const numericValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) || 0 : value;
                return { ...s, [field]: numericValue };
            }
            return s;
        });
        onUpdate({ [lineKey]: newSections });
    };

    const addSection = (lineKey: 'line_sections_1' | 'line_sections_2') => {
        const sections = data[lineKey];
        const newSection: LineSection = {
            id: `${lineKey}_${Date.now()}`,
            ll: lineKey === 'line_sections_2' ? 100 : 0,
            ci: 1,
            ct: lineKey === 'line_sections_1' ? 0.2 : 1,
            ce: 1,
        };
        onUpdate({ [lineKey]: [...sections, newSection] });
    };

    const removeSection = (lineKey: 'line_sections_1' | 'line_sections_2', sectionId: string) => {
        const sections = data[lineKey];
        if (sections.length <= 1) return;
        const newSections = sections.filter(s => s.id !== sectionId);
        onUpdate({ [lineKey]: newSections });
    };


    const { 
        al1 = 0, ai1 = 0, al2 = 0, ai2 = 0, 
        ad_adj_1 = 0, ad_adj_2 = 0, 
        nl_electric = 0, ni_electric = 0, nl_data = 0, ni_data = 0,
        // FIX: Removed 'nim_adj_electric' and 'nim_adj_data' as they do not exist on the 'CalculationResults' type.
        nadj_electric = 0, nadj_data = 0
    } = data.calculations;

    const nl_electric_base = nl_electric - nadj_electric;
    // FIX: 'nim_adj_electric' was removed from calculations; ni_electric is now the base value.
    const ni_electric_base = ni_electric;
    const nl_data_base = nl_data - nadj_data;
    // FIX: 'nim_adj_data' was removed from calculations; ni_data is now the base value.
    const ni_data_base = ni_data;

    const total_ll_1 = data.line_sections_1.reduce((sum, section) => sum + section.ll, 0);
    const total_ll_2 = data.line_sections_2.reduce((sum, section) => sum + section.ll, 0);

    const motionVariants = {
        hidden: { opacity: 0, height: 0, y: -20, overflow: 'hidden' },
        visible: { opacity: 1, height: 'auto', y: 0, transition: { duration: 0.4, ease: "easeInOut" } },
        exit: { opacity: 0, height: 0, y: -20, transition: { duration: 0.3, ease: "easeInOut" } }
    };

    const prob = data.probability_data;
    const ks4_electric = (prob.Uw_electric_ext || 0) > 0 ? 1 / (prob.Uw_electric_ext || 1) : 1;
    const ks4_data = (prob.Uw_data_ext || 0) > 0 ? 1 / (prob.Uw_data_ext || 1) : 1;
    const pli_electric = calculatePli('electric', prob.Uw_electric_ext || 1);
    const handleCombinedChange = (_value: string, _lineType: 'electric' | 'data') => {
        // Step 5 no longer changes CLD/CLI; managed in Step 7.
        return;
    };

    const handleUwChange = (_uw: number, _lineType: 'electric' | 'data') => {
        // Step 5 no longer controls Uw/PLD; managed in Step 7.
        return;
    };

    const handleShieldingChange = (_lineType: 'electric' | 'data', _isShielded: boolean, _rsValue: number) => {
        // Step 5 no longer controls shielding; managed in Step 7.
        return;
    };


    return (
        <div className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3 items-start">
                {/* Card: Linha Elétrica com toggle embutido */}
                <Card>
                    <CardHeader className="py-2 px-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2"><Zap className="w-4 h-4 text-slate-100"/>Linha Elétrica</CardTitle>
                            <div className="flex items-center gap-2">
                                <Checkbox id="has_electric_line" checked={data.has_electric_line} onCheckedChange={(c) => onUpdate({ has_electric_line: !!c })} />
                                <Label htmlFor="has_electric_line" className="cursor-pointer text-slate-200 text-[10px] md:text-xs">Analisar</Label>
                            </div>
                        </div>
                    </CardHeader>
                    <AnimatePresence>
                        {data.has_electric_line && (
                            <motion.div
                                key="electric-line-content"
                                variants={motionVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <CardContent className="space-y-1.5 flex-grow">
                                    {data.line_sections_1.map((section, index) => (
                                        <div key={section.id} className="p-1 border border-slate-600 rounded-lg space-y-1 relative bg-slate-800/50">
                                            {data.line_sections_1.length > 1 && (
                                                <div className="flex justify-between items-center mb-1">
                                                    <h4 className="font-semibold text-slate-200">Trecho {index + 1}</h4>
                                                    <Button variant="outline" size="sm" onClick={() => removeSection('line_sections_1', section.id)} className="px-2 py-1 h-auto text-red-400 hover:bg-red-500/20">
                                                        <XCircle className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            )}
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                                                <DecimalInput label="Comp. (Ll)" value={section.ll} onUpdate={val => handleSectionChange('line_sections_1', section.id, 'll', val)} />
                                                <SelectField label="CI (A.2)" value={section.ci} options={CI_OPTIONS} onChange={(val) => handleSectionChange('line_sections_1', section.id, 'ci', val)} />
                                                <SelectField label="CE (A.4)" value={section.ce} options={CE_OPTIONS} onChange={(val) => handleSectionChange('line_sections_1', section.id, 'ce', val)} />
                                                <SelectField label="CT (A.3)" value={section.ct} options={CT_OPTIONS_ELECTRIC} onChange={(val) => handleSectionChange('line_sections_1', section.id, 'ct', val)} />
                                            </div>
                                        </div>
                                    ))}

                                    <Button variant="outline" onClick={() => addSection('line_sections_1')} className="w-full mt-1 flex items-center gap-2">
                                        <PlusCircle className="w-4 h-4" /> Adicionar Trecho
                                    </Button>

                                    <div className="hidden sm:block pt-4 border-t border-slate-700/50 mt-2">
                                        <div className="grid grid-cols-2 gap-6">
                                            {/* Coluna Energia L1: Al + NL */}
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="w-[210px] px-5 py-2 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-black/40 flex items-center justify-center text-center whitespace-nowrap">Área de Condução</span>
                                                <div className="w-[210px]">
                                                    <ResultBox label={<span className="flex items-center gap-1.5"><span className="text-blue-400">A<sub>L</sub></span></span>} value={al1} unit="m²" color="blue" formula="40 * L1_total" formulaKey="Al" formulaValues={{ "L1_total": total_ll_1 }} />
                                                </div>
                                                <span className="w-[210px] px-5 py-2 rounded-full bg-slate-900 border border-slate-700 text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-black/40 flex items-center justify-center text-center whitespace-nowrap">Freq. Linha</span>
                                                <div className="w-[210px]">
                                                    <ResultBox 
                                                        label={<span className="flex items-center gap-1.5"><span className="text-blue-400">N<sub>L</sub></span></span>} value={nl_electric} unit="desc./ano" color="blue" 
                                                        formula="Σ (Ng × Al × Ci × Ce × Ct) × 10⁻⁶" 
                                                        formulaKey="NL"
                                                        formulaValues={{ Ng: data.ng, Al: al1, sections: data.line_sections_1 }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Coluna Energia I1: Ai + NI */}
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="w-[210px] px-5 py-2 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-black/40 flex items-center justify-center text-center whitespace-nowrap">Área Indução</span>
                                                <div className="w-[210px]">
                                                    <ResultBox label={<span className="flex items-center gap-1.5"><span className="text-emerald-400">A<sub>I</sub></span></span>} value={ai1} unit="m²" color="green" formula="4000 * L1_total" formulaKey="Ai" formulaValues={{ "L1_total": total_ll_1 }} />
                                                </div>
                                                <span className="w-[210px] px-5 py-2 rounded-full bg-slate-900 border border-slate-700 text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-black/40 flex items-center justify-center text-center whitespace-nowrap">Desc. próx. à Linha</span>
                                                <div className="w-[210px]">
                                                    <ResultBox 
                                                        label={<span className="flex items-center gap-1.5"><span className="text-emerald-400">N<sub>I</sub></span></span>} value={ni_electric} unit="desc./ano" color="green" 
                                                        formula="Σ (Ng × Ai × Ci × Ce × Ct) × 10⁻⁶" 
                                                        formulaKey="NI"
                                                        formulaValues={{ Ng: data.ng, Ai: ai1, sections: data.line_sections_1 }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-1 md:pt-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="use_adj_1" checked={data.use_adj_structure_1} onCheckedChange={(c) => handleCheckboxChange('use_adj_structure_1', !!c)} />
                                            <Label htmlFor="use_adj_1" className="cursor-pointer font-semibold text-slate-200">Calcular área adjacente</Label>
                                        </div>
                                        <AnimatePresence>
                                            {data.use_adj_structure_1 && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-1 md:mt-2 pl-1 md:pl-2 border-l-2 border-slate-600 space-y-1 md:space-y-2"
                                                >
                                                    <div className="grid grid-cols-2 gap-1 md:gap-2">
                                                        <DecimalInput label="L (adj)" value={data.l_adj_1} onUpdate={val => onUpdate({ l_adj_1: val })} />
                                                        <DecimalInput label="W (adj)" value={data.w_adj_1} onUpdate={val => onUpdate({ w_adj_1: val })} />
                                                        <DecimalInput label="H (adj)" value={data.h_adj_1} onUpdate={val => onUpdate({ h_adj_1: val })} />
                                                        <DecimalInput label="Hp (adj)" value={data.hp_adj_1} onUpdate={val => onUpdate({ hp_adj_1: val })} />
                                                    </div>
                                                    <SelectField label="CD (adj) - Fator de Localização" value={data.cd_adj_1} options={CD_OPTIONS} onChange={(val) => handleSelectChange('cd_adj_1', val)} />
                                                    <div className="grid grid-cols-1 gap-1 pt-0.5">
                                                        <ResultBox label={<>A<sub>d</sub> (adj)</>} value={ad_adj_1} unit="m²" color="blue" formula="L×W+2(3×H)(L+W)+π(3×H)²" formulaKey="Ad_adj" formulaValues={{ L: data.l_adj_1, W: data.w_adj_1, H: data.h_adj_1 }} />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </CardContent>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>

                {/* Card: Linha de Dados com toggle embutido */}
                <Card>
                    <CardHeader className="py-2 px-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2"><Server className="w-4 h-4 text-slate-100"/>Linha de Dados</CardTitle>
                            <div className="flex items-center gap-2">
                                <Checkbox id="has_data_line" checked={data.has_data_line} onCheckedChange={(c) => onUpdate({ has_data_line: !!c })} />
                                <Label htmlFor="has_data_line" className="cursor-pointer text-slate-200 text-[10px] md:text-xs">Analisar</Label>
                            </div>
                        </div>
                    </CardHeader>
                    <AnimatePresence>
                        {data.has_data_line && (
                            <motion.div
                                key="data-line-content"
                                variants={motionVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <CardContent className="space-y-1.5 flex-grow">
                                    {data.line_sections_2.map((section, index) => (
                                        <div key={section.id} className="p-1 border border-slate-600 rounded-lg space-y-1 relative bg-slate-800/50">
                                            {data.line_sections_2.length > 1 && (
                                                <div className="flex justify-between items-center mb-1">
                                                    <h4 className="font-semibold text-slate-200">Trecho {index + 1}</h4>
                                                    <Button variant="outline" size="sm" onClick={() => removeSection('line_sections_2', section.id)} className="px-2 py-1 h-auto text-red-400 hover:bg-red-500/20">
                                                        <XCircle className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            )}
                                            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                                                <DecimalInput label="Comp. (Ll)" value={section.ll} onUpdate={val => handleSectionChange('line_sections_2', section.id, 'll', val)} />
                                                <SelectField label="CI (A.2)" value={section.ci} options={CI_OPTIONS} onChange={(val) => handleSectionChange('line_sections_2', section.id, 'ci', val)} />
                                                <SelectField label="CE (A.4)" value={section.ce} options={CE_OPTIONS} onChange={(val) => handleSectionChange('line_sections_2', section.id, 'ce', val)} />
                                                <SelectField label="CT (A.3)" value={section.ct} options={CT_OPTIONS_DATA} onChange={(val) => handleSectionChange('line_sections_2', section.id, 'ct', val)} />
                                            </div>
                                        </div>
                                    ))}

                                    <Button variant="outline" onClick={() => addSection('line_sections_2')} className="w-full mt-1 flex items-center gap-2">
                                        <PlusCircle className="w-4 h-4" /> Adicionar Trecho
                                    </Button>

                                    <div className="hidden sm:block pt-4 border-t border-slate-700/50 mt-2">
                                        <div className="grid grid-cols-2 gap-6">
                                            {/* Coluna Dados L2: Al + NL */}
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="w-[210px] px-5 py-2 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-black/40 flex items-center justify-center text-center whitespace-nowrap">Área de Condução</span>
                                                <div className="w-[210px]">
                                                    <ResultBox label={<span className="flex items-center gap-1.5"><span className="text-blue-400">A<sub>L</sub></span></span>} value={al2} unit="m²" color="blue" formula="40 * L2_total" formulaKey="Al" formulaValues={{ "L2_total": total_ll_2 }}/>
                                                </div>
                                                <span className="w-[210px] px-5 py-2 rounded-full bg-slate-900 border border-slate-700 text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-black/40 flex items-center justify-center text-center whitespace-nowrap">Freq. Linha</span>
                                                <div className="w-[210px]">
                                                    <ResultBox 
                                                        label={<span className="flex items-center gap-1.5"><span className="text-blue-400">N<sub>L</sub></span></span>} value={nl_data} unit="desc./ano" color="blue" 
                                                        formula="Σ (Ng × Al × Ci × Ce × Ct) × 10⁻⁶" 
                                                        formulaKey="NL"
                                                        formulaValues={{ Ng: data.ng, Al: al2, sections: data.line_sections_2 }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Coluna Dados I2: Ai + NI */}
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="w-[210px] px-5 py-2 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-black/40 flex items-center justify-center text-center whitespace-nowrap">Área Indução</span>
                                                <div className="w-[210px]">
                                                    <ResultBox label={<span className="flex items-center gap-1.5"><span className="text-emerald-400">A<sub>I</sub></span></span>} value={ai2} unit="m²" color="green" formula="4000 * L2_total" formulaKey="Ai" formulaValues={{ "L2_total": total_ll_2 }}/>
                                                </div>
                                                <span className="w-[210px] px-5 py-2 rounded-full bg-slate-900 border border-slate-700 text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-black/40 flex items-center justify-center text-center whitespace-nowrap">Desc. próx. à Linha</span>
                                                <div className="w-[210px]">
                                                    <ResultBox 
                                                        label={<span className="flex items-center gap-1.5"><span className="text-emerald-400">N<sub>I</sub></span></span>} value={ni_data} unit="desc./ano" color="green" 
                                                        formula="Σ (Ng × Ai × Ci × Ce × Ct) × 10⁻⁶" 
                                                        formulaKey="NI"
                                                        formulaValues={{ Ng: data.ng, Ai: ai2, sections: data.line_sections_2 }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-1 md:pt-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="use_adj_2" checked={data.use_adj_structure_2} onCheckedChange={(c) => handleCheckboxChange('use_adj_structure_2', !!c)} />
                                            <Label htmlFor="use_adj_2" className="cursor-pointer font-semibold text-slate-200">Calcular área adjacente</Label>
                                        </div>
                                        <AnimatePresence>
                                            {data.use_adj_structure_2 && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-1 md:mt-2 pl-1 md:pl-2 border-l-2 border-slate-600 space-y-1 md:space-y-2"
                                                >
                                                    <div className="grid grid-cols-2 gap-1 md:gap-2">
                                                        <DecimalInput label="L (adj)" value={data.l_adj_2} onUpdate={val => onUpdate({ l_adj_2: val })} />
                                                        <DecimalInput label="W (adj)" value={data.w_adj_2} onUpdate={val => onUpdate({ w_adj_2: val })} />
                                                        <DecimalInput label="H (adj)" value={data.h_adj_2} onUpdate={val => onUpdate({ h_adj_2: val })} />
                                                        <DecimalInput label="Hp (adj)" value={data.hp_adj_2} onUpdate={val => onUpdate({ hp_adj_2: val })} />
                                                    </div>
                                                    <SelectField label="CD (adj) - Fator de Localização" value={data.cd_adj_2} options={CD_OPTIONS} onChange={(val) => handleSelectChange('cd_adj_2', val)} />
                                                    <div className="grid grid-cols-1 gap-1 pt-0.5">
                                                        <ResultBox label={<>A<sub>d</sub> (adj)</>} value={ad_adj_2} unit="m²" color="blue" formula="L×W+2(3×H)(L+W)+π(3×H)²" formulaKey="Ad_adj" formulaValues={{ L: data.l_adj_2, W: data.w_adj_2, H: data.h_adj_2 }}/>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </CardContent>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
            </div>
        </div>
    );
}

const SelectField = ({ label, value, options, onChange }: { label: string; value: number; options: {value: number, label: string}[], onChange: (val: string) => void }) => (
    <div className="space-y-1">
        <Label className="text-xs uppercase font-black text-slate-500 tracking-wider mix-blend-plus-lighter">{label}</Label>
        <Select value={String(value)} onValueChange={onChange} options={options}>
            <SelectTrigger className="w-full truncate text-left h-9 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent className="w-[min(90vw,640px)]">
                {options.map(opt => <SelectItem key={opt.value} value={String(opt.value)} label={opt.label} />)}
            </SelectContent>
        </Select>
    </div>
);
