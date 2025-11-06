import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, AutoCorrectingInput, AutoCorrectingTextarea, Textarea, Label } from '../ui';
import { Briefcase } from 'lucide-react';
import { AnalysisData } from '../../types';
 
import { DatePicker } from '../DatePicker';
// Removidos framer-motion e serviços de análise preliminar

// Removido o processador de Markdown e elementos de análise preliminar da IA.


interface ProjectInfoStepProps {
    data: AnalysisData;
    onUpdate: (newData: Partial<AnalysisData>) => void;
}

export function ProjectInfoStep({ data, onUpdate }: ProjectInfoStepProps) {

    const handleValueUpdate = (id: string, value: string) => {
        const patch: any = { [id]: value };
        onUpdate(patch);
    };

    // Validações detalhadas para mensagens precisas
    const getAddressIssues = (address: string): string[] => {
        const a = (address || '').trim();
        const issues: string[] = [];
        if (!a) {
            issues.push('Endereço vazio.');
            return issues;
        }
        const ufRegex = /\b(AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO)\b/i;
        const ufMatch = a.match(ufRegex);
        const statesFull = ['acre','alagoas','amapa','amazonas','bahia','ceara','distrito federal','espirito santo','goias','maranhao','mato grosso','mato grosso do sul','minas gerais','para','paraiba','parana','pernambuco','piaui','rio de janeiro','rio grande do norte','rio grande do sul','rondonia','roraima','santa catarina','sao paulo','sergipe','tocantins'];
        const norm = a.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
        const hasUF = !!ufMatch || statesFull.some(st => norm.includes(st));
        if (!hasUF) issues.push('Falta UF do estado (ex.: SP).');

        const cityUF = a.match(/([A-Za-zÀ-ÖØ-öø-ÿ'-.\s]{3,})\s*(?:-|\/|,|\s)\s*([A-Za-z]{2})/i);
        const hasCity = !!cityUF && (cityUF[1] || '').trim().length >= 3;
        if (!hasCity) issues.push('Falta cidade (ex.: São Paulo).');
        return issues;
    };

    const getDescriptionIssues = (text: string): string[] => {
        const t = (text || '').trim();
        const norm = t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
        const issues: string[] = [];

        const hasNumber = /\d/.test(t);
        const hasArea = /(m²|m2|metros?\s*quadrados?|\barea\b)/i.test(norm);
        const isGroundFloor = /(terreo|terrea|térreo|térrea|pavimento\s*unico|andar\s*unico|andar\s*\u00FAnico|sem\s*pavimentos?|\b0\s*pavimentos?\b|pavimentos?\s*0|andares?\s*0)/i.test(t);
        const hasFloorInfo = isGroundFloor || /(pavimentos?|andares?|\bum\s+pavimento\b|\b1\s+pavimento\b)/i.test(t);
        const hasHeight = /altura|h\s*=|\b\d+\s*m(?!2)\b/i.test(norm);
        const hasUsage = /(residencial|comercial|industrial|hospitalar|escolar|servico|serviço|galpao|galpão|escritorio|escritório|apartamento|condominio|condomínio|loja|casa\s+de\s+campo)/i.test(norm);

        // Texto curto só é problema se faltar elementos essenciais
        if (t.length < 40 && !(hasArea && hasUsage && hasFloorInfo && hasNumber)) {
            issues.push('Texto muito curto (mín. 40 caracteres ou informe itens essenciais).');
        }
        if (!hasNumber) issues.push('Faltam números úteis (altura, pavimentos, área).');
        if (!hasFloorInfo) issues.push('Informe nº de pavimentos/andares ou declare "térreo".');
        if (!hasArea) issues.push('Informe área aproximada (m²).');
        // Altura não é obrigatória para térreo
        if (!isGroundFloor && !hasHeight) issues.push('Informe altura aproximada (m).');
        if (!hasUsage) issues.push('Informe uso/ocupação (ex.: residencial, comercial).');
        return issues;
    };

    const getDescriptionCorrections = (text: string): string => {
        const t = (text || '').trim();
        const norm = t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
        const items: string[] = [];
        const isGroundFloor = /(terreo|terrea|térreo|térrea|pavimento\s*unico|andar\s*unico|andar\s*\u00FAnico|sem\s*pavimentos?|\b0\s*pavimentos?\b|pavimentos?\s*0|andares?\s*0)/i.test(t);
        const hasArea = /(m²|m2|metros?\s*quadrados?|\barea\b)/i.test(norm);
        const hasUsage = /(residencial|comercial|industrial|hospitalar|escolar|servico|serviço|galpao|galpão|escritorio|escritório|apartamento|condominio|condomínio|loja|casa\s+de\s+campo)/i.test(norm);
        const hasFloorInfo = isGroundFloor || /(pavimentos?|andares?|\bum\s+pavimento\b|\b1\s+pavimento\b)/i.test(t);
        const hasHeight = /altura|h\s*=|\b\d+\s*m(?!2)\b/i.test(norm);

        if (!hasFloorInfo) items.push('nº de pavimentos/andares');
        if (!isGroundFloor && !hasHeight) items.push('altura (m)');
        if (!hasArea) items.push('área (m²)');
        if (!hasUsage) items.push('uso/ocupação');

        const base = items.length > 0 ? `inclua ${items.join(', ')}` : 'dados parecem completos';
        const note = isGroundFloor ? ' Obs.: para térreo, altura pode ser 0 m ou omitida.' : '';
        return `${base}.${note}`;
    };
    
    

    // Removidos handlers e estados relacionados à Análise Preliminar da IA.

    // Contador de visitas local (discreto, sem backend)
    const [visitorCount, setVisitorCount] = useState<number>(() => {
        try {
            const v = parseInt(localStorage.getItem('visitor_count') || '0', 10);
            return isNaN(v) ? 0 : v;
        } catch {
            return 0;
        }
    });
    const [globalVisitorCount, setGlobalVisitorCount] = useState<number | null>(null);
    useEffect(() => {
        try {
            const v = parseInt(localStorage.getItem('visitor_count') || '0', 10) || 0;
            const next = v + 1;
            localStorage.setItem('visitor_count', String(next));
            setVisitorCount(next);
        } catch {
            // noop
        }
    }, []);
    // Contador global simples via CountAPI (https://countapi.xyz)
    useEffect(() => {
        let canceled = false;
        const namespace = 'spda-app';
        const key = 'global-visitors';
        fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
            .then(r => r.json())
            .then((json) => {
                if (canceled) return;
                const value = Number(json?.value);
                if (!isNaN(value)) setGlobalVisitorCount(value);
            })
            .catch(() => {
                // Falha silenciosa: mantém contador local
            });
        return () => { canceled = true; };
    }, []);


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
                            <AutoCorrectingTextarea
                                id="projectName"
                                label="Descrição detalhada conforme AVCB (Corpo de Bombeiros)"
                                value={data.projectName}
                                onUpdate={(newValue) => handleValueUpdate('projectName', newValue)}
                                placeholder="Exemplo: Hospital com 10 andares, 20.000m², com UTI, centro cirúrgico e apartamentos. Ocupação 24/7 por médicos, enfermeiros (em turnos de 12h) e pacientes. Horário de visitação das 14h às 18h com fluxo intenso de pessoas."
                                rows={8}
                            />
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
                            
                        </div>
                        {/* Ilustração visual (cidade com raios) */}
                        <div className="hidden md:flex md:col-span-3 items-stretch p-2">
                            <div className="w-full h-full overflow-hidden rounded-lg shadow-md">
                                <img
                                    src="https://i.imgur.com/siWXsaB.png"
                                    alt="Ilustração de cidade com sistema de proteção contra descargas"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                        <span className="text-xs text-slate-300 bg-slate-700/40 px-2 py-0.5 rounded">
                            {`Seja bem-vindo! Você é o visitante nº ${globalVisitorCount ?? visitorCount}`}
                        </span>
                    </div>
                </CardContent>
            </Card>


        </div>
    );
}