import React, { useState } from 'react';
import { Label, Card, CardContent, CardHeader, CardTitle, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Checkbox, Button, FormulaTooltip } from '../ui';
import { Zap, Server, PlusCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DecimalInput } from "../DecimalInput";
import { AnalysisData, LineSection } from '../../types';
import { CD_OPTIONS, CI_OPTIONS, CE_OPTIONS, CT_OPTIONS_ELECTRIC, CT_OPTIONS_DATA } from '../../constants';

interface ConnectedLinesStepProps {
    data: AnalysisData;
    onUpdate: (newData: Partial<AnalysisData>) => void;
}

const ResultBox = ({ label, value, unit, color, formula, formulaKey, formulaValues }: { label: React.ReactNode; value: number; unit: string; color: string; formula?: string; formulaKey?: string, formulaValues?: { [key: string]: any } }) => {
    const colorClasses: { [key: string]: { bg: string, text: string } } = {
        blue: { bg: "bg-blue-950/80", text: "text-white" },
        green: { bg: "bg-green-950/80", text: "text-white" },
    };
    const { bg, text } = colorClasses[color] || colorClasses.blue;
    const formulas = formula && formulaKey ? { [formulaKey]: formula } : {};
    
    // Format value: use toLocaleString for large numbers, toExponential for small decimals
    const displayValue = value >= 1 
        ? value.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) 
        : value.toExponential(2).replace('.', ',');

    return (
        <div className={`p-4 rounded-lg flex flex-col items-center justify-center text-center ${bg}`}>
            <div className={`font-bold text-2xl ${text}`}>{displayValue}</div>
            <div className={`font-semibold text-xs text-slate-200 mt-1 flex items-center justify-center gap-1`}>
                {label} <span>({unit})</span>
                {formula && <FormulaTooltip formulas={formulas} values={formulaValues} />}
            </div>
        </div>
    );
};

export function ConnectedLinesStep({ data, onUpdate }: ConnectedLinesStepProps) {

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


    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Seleção de Linhas Conectadas</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:bg-slate-700/60 transition-colors">
                        <Checkbox id="has_electric_line" checked={data.has_electric_line} onCheckedChange={(c) => onUpdate({ has_electric_line: !!c })} />
                        <Label htmlFor="has_electric_line" className="cursor-pointer flex-1 text-slate-200">Analisar Linha Elétrica</Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:bg-slate-700/60 transition-colors">
                        <Checkbox id="has_data_line" checked={data.has_data_line} onCheckedChange={(c) => onUpdate({ has_data_line: !!c })} />
                        <Label htmlFor="has_data_line" className="cursor-pointer flex-1 text-slate-200">Analisar Linha de Dados</Label>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 items-start">
                 <AnimatePresence>
                    {data.has_electric_line && (
                        <motion.div
                            key="electric-line-card"
                            variants={motionVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-slate-100"/>Linha Elétrica</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 flex-grow">
                                    
                                    {data.line_sections_1.map((section, index) => (
                                        <div key={section.id} className="p-4 border border-slate-600 rounded-lg space-y-4 relative bg-slate-800/50">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-semibold text-slate-200">Trecho {index + 1}</h4>
                                                {data.line_sections_1.length > 1 && (
                                                    <Button variant="outline" size="sm" onClick={() => removeSection('line_sections_1', section.id)} className="px-2 py-1 h-auto text-red-400 hover:bg-red-500/20">
                                                        <XCircle className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                            <DecimalInput label="Comprimento (Ll)" value={section.ll} onUpdate={val => handleSectionChange('line_sections_1', section.id, 'll', val)} />
                                            <SelectField label="CI - Instalação (Tabela A.2)" value={section.ci} options={CI_OPTIONS} onChange={(val) => handleSectionChange('line_sections_1', section.id, 'ci', val)} />
                                            <SelectField label="CE - Ambiental (Tabela A.4)" value={section.ce} options={CE_OPTIONS} onChange={(val) => handleSectionChange('line_sections_1', section.id, 'ce', val)} />
                                            <SelectField label="CT - Tipo de linha (Tabela A.3)" value={section.ct} options={CT_OPTIONS_ELECTRIC} onChange={(val) => handleSectionChange('line_sections_1', section.id, 'ct', val)} />
                                        </div>
                                    ))}

                                    <Button variant="outline" onClick={() => addSection('line_sections_1')} className="w-full mt-4 flex items-center gap-2">
                                        <PlusCircle className="w-4 h-4" /> Adicionar Trecho
                                    </Button>

                                    <div className="hidden sm:grid grid-cols-2 gap-3 pt-4 border-t border-slate-600 mt-4">
                                        <ResultBox label={<>A<sub>l</sub> (Total)</>} value={al1} unit="m²" color="blue" formula="40 * L1_total" formulaKey="Al" formulaValues={{ "L1_total": total_ll_1 }} />
                                        <ResultBox label={<>A<sub>i</sub> (Total)</>} value={ai1} unit="m²" color="green" formula="4000 * L1_total" formulaKey="Ai" formulaValues={{ "L1_total": total_ll_1 }} />
                                        <ResultBox label={<>N<sub>l</sub> (Elétrico)</>} value={nl_electric} unit="eventos/ano" color="blue" formula="Nl_linha + Nl_adj" formulaKey="Nl" formulaValues={{ Nl_linha: nl_electric_base, Nl_adj: nadj_electric }} />
                                        {/* FIX: Set 'Ni_adj' to 0 in formulaValues as 'nim_adj_electric' no longer exists. */}
                                        <ResultBox label={<>N<sub>i</sub> (Elétrico)</>} value={ni_electric} unit="eventos/ano" color="green" formula="Ni_linha + Ni_adj" formulaKey="Ni" formulaValues={{ Ni_linha: ni_electric_base, Ni_adj: 0 }} />
                                    </div>

                                    <div className="pt-2">
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
                                                className="mt-4 pl-2 border-l-2 border-slate-600 space-y-4"
                                            >
                                                <div className="grid grid-cols-2 gap-4">
                                                    <DecimalInput label="L (adj)" value={data.l_adj_1} onUpdate={val => onUpdate({ l_adj_1: val })} />
                                                    <DecimalInput label="W (adj)" value={data.w_adj_1} onUpdate={val => onUpdate({ w_adj_1: val })} />
                                                    <DecimalInput label="H (adj)" value={data.h_adj_1} onUpdate={val => onUpdate({ h_adj_1: val })} />
                                                    <DecimalInput label="Hp (adj)" value={data.hp_adj_1} onUpdate={val => onUpdate({ hp_adj_1: val })} />
                                                </div>
                                                <SelectField label="CD (adj) - Fator de Localização" value={data.cd_adj_1} options={CD_OPTIONS} onChange={(val) => handleSelectChange('cd_adj_1', val)} />
                                                <div className="grid grid-cols-1 gap-3 pt-2">
                                                    <ResultBox label={<>A<sub>d</sub> (adj)</>} value={ad_adj_1} unit="m²" color="blue" formula="L×W+2(3×H)(L+W)+π(3×H)²" formulaKey="Ad_adj" formulaValues={{ L: data.l_adj_1, W: data.w_adj_1, H: data.h_adj_1 }} />
                                                </div>
                                            </motion.div>
                                        )}
                                        </AnimatePresence>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                     )}
                 </AnimatePresence>
                <AnimatePresence>
                    {data.has_data_line && (
                        <motion.div
                            key="data-line-card"
                            variants={motionVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Server className="w-5 h-5 text-slate-100"/>Linha de Dados</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 flex-grow">

                                    {data.line_sections_2.map((section, index) => (
                                        <div key={section.id} className="p-4 border border-slate-600 rounded-lg space-y-4 relative bg-slate-800/50">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-semibold text-slate-200">Trecho {index + 1}</h4>
                                                {data.line_sections_2.length > 1 && (
                                                    <Button variant="outline" size="sm" onClick={() => removeSection('line_sections_2', section.id)} className="px-2 py-1 h-auto text-red-400 hover:bg-red-500/20">
                                                        <XCircle className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                            <DecimalInput label="Comprimento (Ll)" value={section.ll} onUpdate={val => handleSectionChange('line_sections_2', section.id, 'll', val)} />
                                            <SelectField label="CI - Instalação (Tabela A.2)" value={section.ci} options={CI_OPTIONS} onChange={(val) => handleSectionChange('line_sections_2', section.id, 'ci', val)} />
                                            <SelectField label="CE - Ambiental (Tabela A.4)" value={section.ce} options={CE_OPTIONS} onChange={(val) => handleSectionChange('line_sections_2', section.id, 'ce', val)} />
                                            <SelectField label="CT - Tipo de linha (Tabela A.3)" value={section.ct} options={CT_OPTIONS_DATA} onChange={(val) => handleSectionChange('line_sections_2', section.id, 'ct', val)} />
                                        </div>
                                    ))}

                                    <Button variant="outline" onClick={() => addSection('line_sections_2')} className="w-full mt-4 flex items-center gap-2">
                                        <PlusCircle className="w-4 h-4" /> Adicionar Trecho
                                    </Button>
                                    
                                    <div className="hidden sm:grid grid-cols-2 gap-3 pt-4 border-t border-slate-600 mt-4">
                                        <ResultBox label={<>A<sub>l</sub> (Total)</>} value={al2} unit="m²" color="blue" formula="40 * L2_total" formulaKey="Al" formulaValues={{ "L2_total": total_ll_2 }}/>
                                        <ResultBox label={<>A<sub>i</sub> (Total)</>} value={ai2} unit="m²" color="green" formula="4000 * L2_total" formulaKey="Ai" formulaValues={{ "L2_total": total_ll_2 }}/>
                                        <ResultBox label={<>N<sub>l</sub> (Dados)</>} value={nl_data} unit="eventos/ano" color="blue" formula="Nl_linha + Nl_adj" formulaKey="Nl" formulaValues={{ Nl_linha: nl_data_base, Nl_adj: nadj_data }} />
                                        {/* FIX: Set 'Ni_adj' to 0 in formulaValues as 'nim_adj_data' no longer exists. */}
                                        <ResultBox label={<>N<sub>i</sub> (Dados)</>} value={ni_data} unit="eventos/ano" color="green" formula="Ni_linha + Ni_adj" formulaKey="Ni" formulaValues={{ Ni_linha: ni_data_base, Ni_adj: 0 }} />
                                    </div>
                                    
                                    <div className="pt-2">
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
                                                className="mt-4 pl-2 border-l-2 border-slate-600 space-y-4"
                                            >
                                                <div className="grid grid-cols-2 gap-4">
                                                    <DecimalInput label="L (adj)" value={data.l_adj_2} onUpdate={val => onUpdate({ l_adj_2: val })} />
                                                    <DecimalInput label="W (adj)" value={data.w_adj_2} onUpdate={val => onUpdate({ w_adj_2: val })} />
                                                    <DecimalInput label="H (adj)" value={data.h_adj_2} onUpdate={val => onUpdate({ h_adj_2: val })} />
                                                    <DecimalInput label="Hp (adj)" value={data.hp_adj_2} onUpdate={val => onUpdate({ hp_adj_2: val })} />
                                                </div>
                                                <SelectField label="CD (adj) - Fator de Localização" value={data.cd_adj_2} options={CD_OPTIONS} onChange={(val) => handleSelectChange('cd_adj_2', val)} />
                                                <div className="grid grid-cols-1 gap-3 pt-2">
                                                    <ResultBox label={<>A<sub>d</sub> (adj)</>} value={ad_adj_2} unit="m²" color="blue" formula="L×W+2(3×H)(L+W)+π(3×H)²" formulaKey="Ad_adj" formulaValues={{ L: data.l_adj_2, W: data.w_adj_2, H: data.h_adj_2 }}/>
                                                </div>
                                            </motion.div>
                                        )}
                                        </AnimatePresence>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

const SelectField = ({ label, value, options, onChange }: { label: string; value: number; options: {value: number, label: string}[], onChange: (val: string) => void }) => (
    <div className="space-y-2">
        <Label>{label}</Label>
        <Select value={String(value)} onValueChange={onChange} options={options}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
                {options.map(opt => <SelectItem key={opt.value} value={String(opt.value)} label={opt.label} />)}
            </SelectContent>
        </Select>
    </div>
);