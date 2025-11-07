import { AnalysisData } from '../types';
import {
    PB_OPTIONS,
    PSPD_OPTIONS,
    RP_OPTIONS,
    PTA_OPTIONS,
    PTU_OPTIONS,
    KS3_OPTIONS,
    RT_OPTIONS,
    RF_OPTIONS,
    HZ_OPTIONS,
    LF_OPTIONS,
    LO_OPTIONS,
} from '../constants';

function getOptionLabel(options: {value: any, label: string}[], value: any): string {
    const option = options.find(opt => String(opt.value) === String(value));
    return option ? option.label : `Valor ${value}`;
}

function buildDetailedCalculations(data: AnalysisData): string {
    const { calculations: c, probability_calculations: pc, loss_calculations: lc, risk_results: r, frequency_results: f, probability_data: p, zones, selected_risk_components } = data;
    const ld = zones[0]?.loss_data || {} as any;
    let details = '';

    // Etapa — Probabilidade
    details += `### Etapa — Probabilidade (P)\n\n`;
    details += `> Resumo: PC_total = 1 − (1−PC) × (1−PCT); PM_total = 1 − (1−PM) × (1−PMT). Probabilidades nas linhas utilizam PTU/PV/PW/PZ combinadas com PEB/CLD/PLD conforme NBR 5419.\n\n`;
    details += `**PA - Danos a seres vivos por choque (Descarga na Estrutura)**\n* *Fórmula:* PA = PTA × PB\n* *Variáveis:*\n    * PTA: **${p.PTA}** (${getOptionLabel(PTA_OPTIONS, p.PTA)})\n    * PB: **${p.PB}** (${getOptionLabel(PB_OPTIONS, p.PB)})\n* *Cálculo:* PA = ${p.PTA} × ${p.PB}\n* *Resultado:* **PA = ${pc.PA?.toExponential(3)}**\n\n`;
    details += `**PB - Danos físicos (Descarga na Estrutura)**\n* *Fórmula:* PB = PB\n* *Variáveis:*\n    * PB (Nível do SPDA): **${p.PB}** (${getOptionLabel(PB_OPTIONS, p.PB)})\n* *Resultado:* **PB = ${pc.PB?.toExponential(3)}**\n\n`;
    if (data.has_electric_line) details += `**PC - Falha de sistemas (Descarga na Estrutura, Linha Elétrica)**\n* *Fórmula:* PC = PSPDₑ × CLDₑ\n* *Variáveis:*\n    * PSPDₑ: **${p.PSPD_electric}** (${getOptionLabel(PSPD_OPTIONS, p.PSPD_electric)})\n    * CLDₑ_int: **${p.CLD_electric_int}**\n    * CLDₑ_ext: **${p.CLD_electric_ext}**\n* *Cálculo:* PC = ${p.PSPD_electric} × (CLDₑ conforme configuração)\n* *Resultado:* **PC = ${pc.PC?.toExponential(3)}**\n\n`;
    if (data.has_data_line) details += `**PCT - Falha de sistemas (Descarga na Estrutura, Linha de Dados)**\n* *Fórmula:* PCT = PSPDₐ × CLDₐ\n* *Variáveis:*\n    * PSPDₐ: **${p.PSPD_data}** (${getOptionLabel(PSPD_OPTIONS, p.PSPD_data)})\n    * CLDₐ_int: **${p.CLD_data_int}**\n    * CLDₐ_ext: **${p.CLD_data_ext}**\n* *Cálculo:* PCT = ${p.PSPD_data} × (CLDₐ conforme configuração)\n* *Resultado:* **PCT = ${pc.PCT?.toExponential(3)}**\n\n`;
    if (data.has_electric_line) details += `**PM - Falha de sistemas (Descarga Próxima, Linha Elétrica)**\n* *Fórmula:* PM = PSPDₑ × (Ks1 × Ks2 × Ks3ₑ × Ks4ₑ)²\n* *Variáveis:*\n    * PSPDₑ: **${p.PSPD_electric}** (${getOptionLabel(PSPD_OPTIONS, p.PSPD_electric)})\n    * Ks1 (Malha wm1=${p.wm1}m): **${pc.Ks1?.toFixed(3)}**\n    * Ks2 (Malha wm2=${p.wm2}m): **${pc.Ks2?.toFixed(3)}**\n    * Ks3ₑ: **${p.Ks3_electric_int}** (${getOptionLabel(KS3_OPTIONS, p.Ks3_electric_int)})\n    * Ks4ₑ (Uw=${p.Uw_electric_int}kV): **${pc.Ks4_electric?.toFixed(3)}**\n* *Cálculo:* PM = ${p.PSPD_electric} × (${pc.Ks1?.toFixed(3)} × ${pc.Ks2?.toFixed(3)} × ${p.Ks3_electric_int} × ${pc.Ks4_electric?.toFixed(3)})²\n* *Resultado:* **PM = ${pc.PM?.toExponential(3)}**\n\n`;
    if (data.has_electric_line) details += `**PU - Danos a seres vivos por choque (Descarga na Linha Elétrica)**\n* *Fórmula:* PU = PTU × PEB × PLD × CLD\n* *Variáveis:*\n    * PTU: **${p.PTU_electric}** (${getOptionLabel(PTU_OPTIONS, p.PTU_electric)})\n    * PEB: **${p.PEB_electric}** (${getOptionLabel(PSPD_OPTIONS, p.PEB_electric)})\n    * PLD (ext): **${p.PLD_electric_ext?.toFixed(2)}**\n    * CLD (ext): **${p.CLD_electric_ext}**\n* *Cálculo:* PU = ${p.PTU_electric} × ${p.PEB_electric} × ${p.PLD_electric_ext?.toFixed(2)} × ${p.CLD_electric_ext}\n* *Resultado:* **PU = ${pc.PU?.toExponential(3)}**\n\n`;

    // Etapa — Perdas Consequentes
    details += `### Etapa — Perdas Consequentes (L) — ${zones[0]?.name}\n\n`;
    details += `> Resumo: LA (choque), LB (incêndio/pânico) e LC (falha de sistemas) usam fatores normativos (rt, rp, rf, hz, LO) e a fração de tempo/pessoas na zona (tz, nz/nt). Demais perdas usam equivalências LU=LA, LV=LB, LM=LW=LZ=LC.\n\n`;
    details += `**LA - Perda por choque elétrico**\n* *Fórmula:* LA = rt × 0.01 × (nz / nt) × (tz / 8760) × rs\n* *Variáveis:*\n    * rt (Resist. Piso): **${ld.rt}** (${getOptionLabel(RT_OPTIONS, ld.rt)})\n    * nz (Pessoas na Zona): **${ld.nz}**\n    * nt (Pessoas Total): **${ld.nt}**\n    * tz (Tempo na Zona): **${ld.tz}** h/ano\n    * rs (Tipo Estrutura): **${ld.rs}** (${ld.rs === 1 ? 'Robusta' : 'Simples'})\n* *Cálculo:* LA = ${ld.rt} × 0.01 × (${ld.nz} / ${ld.nt}) × (${ld.tz} / 8760) × ${ld.rs}\n* *Resultado:* **LA = ${lc.LA?.toExponential(3)}**\n\n`;
    details += `**LB - Perda por danos físicos (incêndio)**\n* *Fórmula:* LB = rs × rp × rf × hz × LF × (nz / nt) × (tz / 8760)\n* *Variáveis:*\n    * rs (Tipo Estrutura): **${ld.rs}** (${ld.rs === 1 ? 'Robusta' : 'Simples'})\n    * rp (Prot. Incêndio): **${ld.rp}** (${getOptionLabel(RP_OPTIONS, ld.rp)})\n    * rf (Risco Incêndio): **${ld.rf}** (${getOptionLabel(RF_OPTIONS, ld.rf)})\n    * hz (Pânico): **${ld.hz}** (${getOptionLabel(HZ_OPTIONS, ld.hz)})\n    * LF (Tipo Dano): **${ld.LF}** (${getOptionLabel(LF_OPTIONS, ld.LF)})\n    * nz, nt, tz: **${ld.nz}**, **${ld.nt}**, **${ld.tz}**\n* *Cálculo:* LB = ${ld.rs} × ${ld.rp} × ${ld.rf} × ${ld.hz} × ${ld.LF} × (${ld.nz} / ${ld.nt}) × (${ld.tz} / 8760)\n* *Resultado:* **LB = ${lc.LB?.toExponential(3)}**\n\n`;
    details += `**LC - Perda por falha de sistemas**\n* *Fórmula:* LC = LO × (nz / nt) × (tz / 8760) × rs\n* *Variáveis:*\n    * LO (Tipo Falha): **${ld.LO}** (${getOptionLabel(LO_OPTIONS, ld.LO)})\n    * nz, nt, tz, rs: **${ld.nz}**, **${ld.nt}**, **${ld.tz}**, **${ld.rs}**\n* *Cálculo:* LC = ${ld.LO} × (${ld.nz} / ${ld.nt}) × (${ld.tz} / 8760) × ${ld.rs}\n* *Resultado:* **LC = ${lc.LC?.toExponential(3)}**\n\n`;
    details += `**Demais Perdas:** LU=LA, LV=LB, LM=LW=LZ=LC.\n\n`;

    // Etapa — Riscos
    details += `### Etapa — Componentes de Risco (R)\n\n`;
    const selectedRisksText = Object.entries(selected_risk_components)
        .filter(([,isSelected]) => isSelected)
        .map(([key]) => {
            const formulaMap: {[key: string]: string} = { RA: 'RA = Nd × PA × LA', RB: 'RB = Nd × PB × LB', RC: 'RC = Nd × PC × LC', RM: 'RM = Nm × PM × LM', RU: 'RU = Nl × PU × LU', RV: 'RV = Nl × PV × LV', RW: 'RW = Nl × PW × LW', RZ: 'RZ = Ni × PZ × LZ' };
            const riskValue = (r as any)[key];
            return `* **${key}:** ${formulaMap[key] || 'N/A'} -> Resultado: **${riskValue?.toExponential(3)}**`;
        }).join('\n');
    details += selectedRisksText + '\n\n';

    // Etapa — Frequências
    details += `### Etapa — Frequência de Danos a Sistemas (F)\n\n`;
    details += `> Resumo: F = FB + FC + FM + FV + FW + FZ (quando aplicável), com combinação de sistemas internos via PC_total e PM_total.\n\n`;
    if(f.FB && data.frequency_config.has_equipment_in_ZPR0A) details += `**FB - Danos por descarga na estrutura (Equip. ZPR0A)**\n* *Fórmula:* FB = Nd × PB\n* *Cálculo:* FB = ${c.nd?.toExponential(3)} × ${pc.PB}\n* *Resultado:* **FB = ${f.FB?.toExponential(3)}**\n\n`;
    if(f.FC) details += `**FC - Danos por descarga na estrutura (Sistemas Internos)**\n* *Fórmula:* FC = Nd × PC_total\n* *Cálculo:* FC = ${c.nd?.toExponential(3)} × ${ (1 - (1-(pc.PC || 0)) * (1-(pc.PCT || 0))).toFixed(3) }\n* *Resultado:* **FC = ${f.FC?.toExponential(3)}**\n\n`;
    if(f.FM) details += `**FM - Danos por descarga próxima (Sistemas Internos)**\n* *Fórmula:* FM = Nm × PM_total\n* *Cálculo:* FM = ${c.nm?.toExponential(3)} × ${ (1 - (1-(pc.PM || 0)) * (1-(pc.PMT || 0))).toFixed(3) }\n* *Resultado:* **FM = ${f.FM?.toExponential(3)}**\n\n`;
    if(f.FV) details += `**FV - Danos por descarga na linha**\n* *Fórmula:* FV = Nlₑ × PEBₑ + Nlₐ × PEBₐ\n* *Cálculo:* FV = (${c.nl_electric?.toExponential(3)} × ${pc.PEB_electric}) + (${c.nl_data?.toExponential(3)} × ${pc.PEB_data})\n* *Resultado:* **FV = ${f.FV?.toExponential(3)}**\n\n`;
    if(f.FW) details += `**FW - Danos por surto na linha**\n* *Fórmula:* FW = Nlₑ × PW + Nlₐ × PWT\n* *Cálculo:* FW = (${c.nl_electric?.toExponential(3)} × ${pc.PW?.toExponential(3)}) + (${c.nl_data?.toExponential(3)} × ${pc.PWT?.toExponential(3)})\n* *Resultado:* **FW = ${f.FW?.toExponential(3)}**\n\n`;
    if(f.FZ) details += `**FZ - Danos por surto induzido na linha**\n* *Fórmula:* FZ = Niₑ × PZ + Niₐ × PZT\n* *Cálculo:* FZ = (${c.ni_electric?.toExponential(3)} × ${pc.PZ?.toExponential(3)}) + (${c.ni_data?.toExponential(3)} × ${pc.PZT?.toExponential(3)})\n* *Resultado:* **FZ = ${f.FZ?.toExponential(3)}**\n\n`;
    const fFormulaParts = [] as string[];
    if (data.frequency_config.has_equipment_in_ZPR0A) fFormulaParts.push('FB');
    fFormulaParts.push('FC', 'FM', 'FV', 'FW', 'FZ');
    details += `**F - Frequência Total de Danos**\n* *Fórmula:* F = ${fFormulaParts.join(' + ')}\n* *Cálculo:* F = ${fFormulaParts.map(key => (f as any)[key]?.toExponential(3) || 0).join(' + ')}\n* *Resultado:* **F = ${f.F?.toExponential(3)}**\n\n`;

    return details;
}

export async function generateFullReportText(data: AnalysisData): Promise<string> {
    const { calculations: c, risk_results: r, frequency_results: f } = data;
    const sectionNumbering = { dados: 1, parametros: 2, calculos: 3, resultados: 4, parecer: 5 };
    const detailedCalculations = buildDetailedCalculations(data);

    const buildTechnicalOpinion = (data: AnalysisData) => {
        const selectedRisks = Object.entries(data.risks_to_analyze)
            .filter(([, v]) => v)
            .map(([k]) => k as 'R1' | 'R3' | 'R4');
        const toleranceMap: Record<'R1' | 'R3' | 'R4', number> = { R1: 1e-5, R3: 1e-3, R4: 1e-3 };
        const unacceptable: string[] = [];
        selectedRisks.forEach(k => {
            const val = (data.risk_results as any)[k] || 0;
            const tol = toleranceMap[k];
            if (val > tol) unacceptable.push(k);
        });
        const freqTol = (data.frequency_config.is_critical_system ? 0.1 : 1.0);
        const freqUnacceptable = (data.frequency_results?.F || 0) > freqTol;

        // Identificar componentes dominantes (top 2) para orientar recomendações
        const componentKeys: (keyof AnalysisData['selected_risk_components'])[] = ['RA','RB','RC','RM','RU','RV','RW','RZ'];
        const compSorted = componentKeys
            .map(k => ({ k, v: (data.risk_results as any)[k] || 0 }))
            .sort((a, b) => b.v - a.v)
            .slice(0, 2);
        const topComponents = compSorted.map(c => `${String(c.k)} (${(c.v)?.toExponential(2)})`).join(', ');

        const intro = `Este parecer foi elaborado com base na NBR 5419, considerando os riscos selecionados (${selectedRisks.join(', ') || 'nenhum'}) e a frequência de danos aos sistemas.`;
        const freqLine = `Frequência de Danos (F): **${(data.frequency_results?.F || 0).toExponential(3)}**; Limite (FT): **${freqTol.toFixed(1)}** → ${freqUnacceptable ? '**NÃO ACEITÁVEL**' : '**ACEITÁVEL**'}.`;
        const risksLine = selectedRisks.length
            ? `Riscos totais: ${selectedRisks.map(k => `**${k}=${((data.risk_results as any)[k] || 0).toExponential(3)}** (RT=${toleranceMap[k].toExponential(1)})`).join('; ')}.`
            : 'Nenhum risco foi selecionado para análise próxima.';
        const componentsLine = `Componentes dominantes observados: ${topComponents}.`;

        const recs = `Recomendações prioritárias:
* Adequar o nível do SPDA (captores, descidas, aterramento) para reduzir PA/PB e efeitos de descargas na estrutura.
* Coordenar DPS (classes I/II/III) em entradas e quadros, nas linhas elétrica e de dados, para reduzir PC/PM e perdas associadas (RC, RM, FC, FM).
* Reforçar malhas de aterramento e equipotencialização, interligando elementos metálicos e melhorando conexões, reduzindo tensões de passo/toque (impacto em LA/LC).
* Otimizar blindagens/roteamento de cabos e separação física, diminuindo acoplamentos (RW/RZ).
* Revisar parâmetros de ocupação e medidas internas (rf, hz, LO) e rotinas operacionais em zonas críticas.`;

        const conclusion = (unacceptable.length || freqUnacceptable)
            ? `Conclusão: Há itens **NÃO ACEITÁVEIS** (${[...unacceptable, freqUnacceptable ? 'F' : null].filter(Boolean).join(', ')}). Recomenda-se implementar as medidas acima e reprocessar a análise para verificar a redução dos componentes dominantes e a conformidade com os limites.`
            : `Conclusão: Todos os itens analisados estão **ACEITÁVEIS** frente aos limites. Recomenda-se manter as medidas propostas, documentação e manutenção periódica do sistema.`;

        return [intro, freqLine, risksLine, componentsLine, recs, conclusion].join('\n\n');
    };

    const resultadosSection = Object.entries(data.risks_to_analyze)
        .filter(([,v])=>v)
        .map(([riskKey], index) => {
            const riskValue = (r as any)[riskKey] || 0;
            const tolerance = ({R1: 1e-5, R3: 1e-3, R4: 1e-3} as any)[riskKey] || 0;
            const isAcceptable = riskValue <= tolerance;
            const label = ({'R1': 'Perda de Vidas Humanas', 'R3': 'Perda de Patrimônio Cultural', 'R4': 'Perda de Valor Econômico'} as any)[riskKey];
            const statusEmoji = isAcceptable ? '🟢 ✅' : '🔴 ❌';
            const sel = data.selected_risk_components;
            let compositionFormula = '';
            let calculationBreakdown = '';
            if (riskKey === 'R1') {
                const parts: string[] = [];
                const calcParts: string[] = [];
                if (sel.RA) { parts.push('RA'); calcParts.push(`${(r as any).RA?.toExponential(3)}`); }
                if (sel.RB) { parts.push('RB'); calcParts.push(`${(r as any).RB?.toExponential(3)}`); }
                if (sel.RC) { parts.push('RC'); calcParts.push(`${(r as any).RC?.toExponential(3)}`); }
                if (sel.RM) { parts.push('RM'); calcParts.push(`${(r as any).RM?.toExponential(3)}`); }
                if (sel.RU) { parts.push('RU'); calcParts.push(`${(((r as any).RU||0) + ((r as any).RUT||0)).toExponential(3)}`); }
                if (sel.RV) { parts.push('RV'); calcParts.push(`${(((r as any).RV||0) + ((r as any).RVT||0)).toExponential(3)}`); }
                if (sel.RW) { parts.push('RW'); calcParts.push(`${(((r as any).RW||0) + ((r as any).RWT||0)).toExponential(3)}`); }
                if (sel.RZ) { parts.push('RZ'); calcParts.push(`${(((r as any).RZ||0) + ((r as any).RZT||0)).toExponential(3)}`); }
                compositionFormula = parts.join(' + ');
                calculationBreakdown = `${calcParts.join(' + ')} = ${riskValue.toExponential(3)}`;
            } else if (riskKey === 'R3') {
                const parts: string[] = [];
                const calcParts: string[] = [];
                if (sel.RB) { parts.push('RB3'); calcParts.push(`${(r as any).RB3?.toExponential(3)}`); }
                if (sel.RV) { parts.push('RV3'); calcParts.push(`${(((r as any).RV3||0) + ((r as any).RVT3||0)).toExponential(3)}`); }
                compositionFormula = parts.join(' + ');
                calculationBreakdown = `${calcParts.join(' + ')} = ${riskValue.toExponential(3)}`;
            } else if (riskKey === 'R4') {
                const parts: string[] = [];
                const calcParts: string[] = [];
                if (sel.RA) { parts.push('RA4'); calcParts.push(`${(r as any).RA4?.toExponential(3)}`); }
                if (sel.RB) { parts.push('RB4'); calcParts.push(`${(r as any).RB4?.toExponential(3)}`); }
                if (sel.RC) { parts.push('RC4'); calcParts.push(`${(r as any).RC4?.toExponential(3)}`); }
                if (sel.RM) { parts.push('RM4'); calcParts.push(`${(r as any).RM4?.toExponential(3)}`); }
                if (sel.RU) { parts.push('RU4'); calcParts.push(`${(((r as any).RU4||0) + ((r as any).RUT4||0)).toExponential(3)}`); }
                if (sel.RV) { parts.push('RV4'); calcParts.push(`${(((r as any).RV4||0) + ((r as any).RVT4||0)).toExponential(3)}`); }
                if (sel.RW) { parts.push('RW4'); calcParts.push(`${(((r as any).RW4||0) + ((r as any).RWT4||0)).toExponential(3)}`); }
                if (sel.RZ) { parts.push('RZ4'); calcParts.push(`${(((r as any).RZ4||0) + ((r as any).RZT4||0)).toExponential(3)}`); }
                compositionFormula = parts.join(' + ');
                calculationBreakdown = `${calcParts.join(' + ')} = ${riskValue.toExponential(3)}`;
            }
            const compositionLines = compositionFormula
                ? `\n* *Composição (${riskKey}):* ${compositionFormula}\n* *Cálculo:* ${calculationBreakdown}`
                : '';
            return `### ${sectionNumbering.resultados}.${index + 1}. Risco ${riskKey} - ${label}\n* **Risco Total Calculado (${riskKey}):** **${riskValue.toExponential(3)}**\n* **Risco Tolerável (RT):** **${tolerance.toExponential(1)}**\n* **Resultado:** ${statusEmoji} O risco ${riskKey} é **${isAcceptable ? 'ACEITÁVEL' : 'NÃO ACEITÁVEL'}**.${compositionLines}`;
        }).join('\n\n');

    const freqTolerance = (data.frequency_config.is_critical_system ? 0.1 : 1.0);
    const freqAcceptable = (f.F || 0) <= freqTolerance;
    const freqStatusEmoji = freqAcceptable ? '🟢 ✅' : '🔴 ❌';

    // Helper to base64 encode unicode safely
    const toBase64 = (s: string) => {
        try {
            return btoa(unescape(encodeURIComponent(s)));
        } catch {
            return '';
        }
    };

    // Simple SVG bar chart generator for embedding figures in the Markdown
    const buildSvgBarChart = (
        title: string,
        items: { name: string; value: number }[],
        width = 720,
        height = 300,
        opts?: {
            barColor?: string;
            barColors?: string[];
            bg?: string;
            labelAngle?: number; // ângulo dos rótulos do eixo X (negativo inclina para cima à esquerda)
            legendMaxWidth?: number; // largura máxima para quebra de linha da legenda
            legendBoxSize?: number;
            legendFontSize?: number;
            legendRowGap?: number;
            legendColGap?: number;
            showLegend?: boolean; // controla renderização da legenda (padrão: false)
            toleranceLine?: number; // valor de tolerância para renderizar linha horizontal em vermelho pontilhado
        }
    ) => {
        const paddingX = 40;
        const paddingTop = (opts?.showLegend ? 72 : 48); // espaço para título e legendas
        const paddingBottom = 44; // espaço para rótulos do eixo X
        const barGap = 8;
        const barCount = items.length;
        const chartWidth = width - paddingX * 2;
        const chartHeight = height - paddingTop - paddingBottom;
        const barWidth = Math.max(10, Math.floor((chartWidth - (barCount - 1) * barGap) / barCount));
        const tolForScale = typeof opts?.toleranceLine === 'number' ? Math.max(opts.toleranceLine!, 0) : 0;
        const log = (v: number) => Math.log10(Math.max(v, 1e-12));
        const allValuesForScale = [...items.map(i => i.value), tolForScale].filter(v => v > 0);
        const maxLog = Math.max(...allValuesForScale.map(v => log(v)));
        const minLog = Math.min(...items.map(i => log(i.value)));
        const color = opts?.barColor || '#60A5FA';
        const barColors = opts?.barColors;
        // Tema claro para impressão econômica e melhor legibilidade
        const bg = opts?.bg || '#FFFFFF';
        const labelColor = '#111827';
        const axisColor = '#475569';
        const angle = typeof opts?.labelAngle === 'number' ? opts!.labelAngle! : -35;

        // Sem filtros de brilho para evitar linhas/halos coloridos nos totais
        const defs = ``;

        // Barras e rótulos
        let bars = '';
        items.forEach((it, idx) => {
            const x = paddingX + idx * (barWidth + barGap);
            const hRatio = (log(it.value) - minLog) / Math.max(maxLog - minLog, 1e-6);
            const barH = Math.max(2, Math.floor(hRatio * chartHeight));
            const y = paddingTop + (chartHeight - barH);
            const valText = (it.value).toExponential(2);
            const fill = barColors ? (barColors[idx % barColors.length]) : color;
            const labelY = height - paddingBottom + 18;
            const labelX = x + barWidth / 2;
            const isInactive = fill === '#CBD5E1';
            const isTotal = it.name === 'R Total' || it.name === 'F Total';
            const cornerRadius = 0;
            const valueFontSize = isTotal ? 12 : 10;
            const valueFontWeight = isTotal ? '700' : '400';
            bars += `\n  <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" fill="${fill}" rx="${cornerRadius}" />`;
            bars += `\n  <text x="${labelX}" y="${labelY}" fill="${labelColor}" font-size="11" text-anchor="${angle < 0 ? 'end' : angle > 0 ? 'start' : 'middle'}" transform="rotate(${angle} ${labelX} ${labelY})">${it.name}</text>`;
            bars += `\n  <text x="${x + barWidth / 2}" y="${y - 6}" fill="${labelColor}" font-size="${valueFontSize}" font-weight="${valueFontWeight}" text-anchor="middle">${valText}</text>`;
        });

        // Linha de tolerância (vermelha pontilhada) — restaurada quando fornecida
        let toleranceSvg = '';
        if (typeof opts?.toleranceLine === 'number') {
            const tolVal = Math.max(opts.toleranceLine!, 1e-12);
            const tolRatioRaw = (log(tolVal) - minLog) / Math.max(maxLog - minLog, 1e-6);
            const tolRatio = Math.min(1, Math.max(0, tolRatioRaw));
            const tolH = Math.max(2, Math.floor(tolRatio * chartHeight));
            const tolY = paddingTop + (chartHeight - tolH);
            toleranceSvg = `\n  <line x1="${paddingX}" y1="${tolY}" x2="${width - paddingX}" y2="${tolY}" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 3" />`;
        }

        // Legenda colorida sob o título (quando há paleta categórica)
        let legend = '';
        const showLegend = Boolean(opts?.showLegend);
        if (showLegend && barColors && items.length) {
            const boxSize = typeof opts?.legendBoxSize === 'number' ? Math.max(6, opts!.legendBoxSize!) : 10;
            const gapX = typeof opts?.legendColGap === 'number' ? Math.max(2, opts!.legendColGap!) : 8;
            const gapY = typeof opts?.legendRowGap === 'number' ? Math.max(2, opts!.legendRowGap!) : 8;
            const fontSize = typeof opts?.legendFontSize === 'number' ? Math.max(8, opts!.legendFontSize!) : 11;
            const maxWidth = Math.min(width - paddingX, Math.max(120, opts?.legendMaxWidth || (width - paddingX)));
            let curX = paddingX;
            let curY = 46; // abaixo do título
            items.forEach((it, idx) => {
                const fill = barColors[idx % barColors.length];
                const labelWidth = Math.min(160, Math.max(40, it.name.length * 7));
                if (curX + boxSize + 4 + labelWidth > maxWidth) {
                    curX = paddingX;
                    curY += boxSize + gapY;
                }
                legend += `\n  <rect x="${curX}" y="${curY}" width="${boxSize}" height="${boxSize}" fill="${fill}" rx="2" />`;
                legend += `\n  <text x="${curX + boxSize + 6}" y="${curY + boxSize - 1}" fill="${labelColor}" font-size="${fontSize}">${it.name}</text>`;
                curX += boxSize + 6 + labelWidth + gapX;
            });
        }

        const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n  ${defs}\n  <rect x="0" y="0" width="${width}" height="${height}" fill="${bg}"/>\n  <text x="${paddingX}" y="24" fill="${labelColor}" font-size="14" font-weight="bold">${title}</text>\n  ${legend}\n  <line x1="${paddingX}" y1="${height - paddingBottom}" x2="${width - paddingX}" y2="${height - paddingBottom}" stroke="${axisColor}" stroke-width="1"/>\n  ${toleranceSvg}\n  ${bars}\n</svg>`;
        return `data:image/svg+xml;base64,${toBase64(svg)}`;
    };

    // Build global figures (risk components and frequency components) when data is available
    const allRiskKeys: (keyof AnalysisData['selected_risk_components'])[] = ['RA','RB','RC','RM','RU','RV','RW','RZ'];
    const baseItems = allRiskKeys.map(name => ({
        name,
        value: (data.risk_results as any)[name] || 1e-12,
        active: Boolean((data.selected_risk_components as any)[name])
    }));
    const selectedRiskKey = (data.risks_to_analyze.R1 ? 'R1' : data.risks_to_analyze.R3 ? 'R3' : data.risks_to_analyze.R4 ? 'R4' : 'R1');
    const riskTotalValue = (data.risk_results as any)[selectedRiskKey] || 0;
    const riskChartItems = [...baseItems.map(i => ({ name: i.name, value: i.value })), { name: 'R Total', value: riskTotalValue }];
    const freqComponents = Object.entries(data.frequency_results || {})
        .filter(([key]) => key !== 'F')
        .map(([name, value]) => ({ name, value: (value as number) || 0 }));
    const activePalette = ['#60A5FA','#A78BFA','#F472B6','#FB7185','#F59E0B','#34D399','#22D3EE','#93C5FD'];
    const inactiveColor = '#CBD5E1'; // cinza desbotado + traço para itens não somados
    // Escolha do limite de tolerância para referência visual: prioriza R1, depois R3, R4
    const riskTolRef = (data.risks_to_analyze.R1 ? 1e-5 : data.risks_to_analyze.R3 ? 1e-3 : data.risks_to_analyze.R4 ? 1e-3 : 1e-5);
    const isRiskAcceptable = riskTotalValue <= riskTolRef;
    const totalColor = isRiskAcceptable ? '#10B981' : '#EF4444'; // verde quando abaixo do limite; vermelho caso contrário
    const riskPalette = riskChartItems.map((it, idx) => {
        if (it.name === 'R Total') return totalColor;
        const isActive = baseItems[idx]?.active;
        return isActive ? activePalette[idx % activePalette.length] : inactiveColor;
    });
    const freqPalette = ['#F87171','#60A5FA','#A78BFA','#34D399','#F59E0B','#FB7185','#64748B'];
    const riskChartUrl = buildSvgBarChart('Componentes de Risco — Global', riskChartItems, 720, 300, { barColors: riskPalette, labelAngle: -30, legendMaxWidth: 420, toleranceLine: riskTolRef });
    const freqItems = [...freqComponents, { name: 'F Total', value: (data.frequency_results?.F || 0) }];
    const isFreqAcceptable = (data.frequency_results?.F || 0) <= freqTolerance;
    const freqInactiveColor = '#CBD5E1';
    const freqPaletteDynamic = freqItems.map((it, idx) => {
        if (it.name === 'F Total') return isFreqAcceptable ? '#10B981' : '#EF4444';
        // Desbotar componentes que são zero (não contribuem)
        const base = freqPalette[idx % freqPalette.length];
        return (it.value || 0) > 0 ? base : freqInactiveColor;
    });
    const freqChartUrl = buildSvgBarChart('Frequência de Danos — Global', freqItems, 720, 280, { barColors: freqPaletteDynamic, labelAngle: -40, legendFontSize: 10, legendMaxWidth: 500, toleranceLine: freqTolerance });

    const markdown = `
**ASSUNTO:** Memorial de Cálculo — Análise de Risco (NBR 5419)

---

## ${sectionNumbering.dados}. DADOS DO PROJETO
* **Projeto/Cliente:** ${data.clientName}
* **Endereço:** ${data.clientAddress}
* **Descrição:** ${data.projectName}
* **Data:** ${data.projectDate}
* **Responsável Técnico:** ${data.technicalManagerName} (${data.licenseNumber})

## ${sectionNumbering.parametros}. PARÂMETROS GERAIS DA ANÁLISE
* **Localização (Cidade/UF):** ${data.location}
* **Densidade de Descargas (Ng):** **${data.ng}** descargas/km²/ano
* **Geometria da Estrutura:** **${data.l}**m (C) × **${data.w}**m (L) × **${data.h}**m (A)
* **Fator de Localização (Cd):** **${data.cd}**

## ${sectionNumbering.calculos}. CÁLCULOS DETALHADOS

### ${sectionNumbering.calculos}.1. Áreas de Exposição Equivalentes
* **Área de Exposição (Ad):**
  * *Fórmula:* Ad = L×W + 2×(3H)×(L+W) + π×(3H)²
  * *Cálculo:* Ad = ${data.l}×${data.w} + 2×(3×${data.h})×(${data.l}+${data.w}) + π×(3×${data.h})²
  * *Resultado:* **Ad = ${c.ad?.toFixed(2)} m²**
* **Área de Exposição Final (Adf):**
  * *Resultado:* **Adf = ${c.adf?.toFixed(2)} m²** (Considerando protrusões)
* **Área de Exposição Próxima (Am):**
  * *Fórmula:* Am = 2×500×(L+W) + π×500²
  * *Cálculo:* Am = 2×500×(${data.l}+${data.w}) + π×500²
  * *Resultado:* **Am = ${c.am?.toFixed(2)} m²**
* **Linha Elétrica (Al1, Ai1):** **Al1 = ${c.al1?.toFixed(2)} m²**, **Ai1 = ${c.ai1?.toFixed(2)} m²**
* **Linha de Dados (Al2, Ai2):** **Al2 = ${c.al2?.toFixed(2)} m²**, **Ai2 = ${c.ai2?.toFixed(2)} m²**

### ${sectionNumbering.calculos}.2. Frequência Média Anual de Eventos Danosos (N)
* **Nd:** Nd = Ng × Adf × Cd × 10⁻⁶ → **${c.nd?.toExponential(3)}** eventos/ano
* **Nm:** Nm = Ng × Am × 10⁻⁶ → **${c.nm?.toExponential(3)}** eventos/ano
* **Nl/ Ni (Elétrica):** **Nl = ${c.nl_electric?.toExponential(3)}**, **Ni = ${c.ni_electric?.toExponential(3)}** eventos/ano
* **Nl/ Ni (Dados):** **Nl = ${c.nl_data?.toExponential(3)}**, **Ni = ${c.ni_data?.toExponential(3)}** eventos/ano

${detailedCalculations}

## ${sectionNumbering.resultados}. RESULTADOS E CONCLUSÕES

${resultadosSection}

### Figura 1 — Componentes de Risco — Global
![Componentes de Risco — Global](${riskChartUrl})


### ${sectionNumbering.resultados}.${Object.values(data.risks_to_analyze).filter(v=>v).length + 1}. Frequência de Danos aos Sistemas (F)
* **Frequência Calculada (F):** **${f.F?.toExponential(3)}** danos/ano
* **Frequência Tolerável (FT):** **${freqTolerance.toFixed(1)}** danos/ano
* **Resultado:** ${freqStatusEmoji} A frequência F é **${freqAcceptable ? 'ACEITÁVEL' : 'NÃO ACEITÁVEL'}**.

### Figura 2 — Frequência de Danos — Global
![Frequência de Danos — Global](${freqChartUrl})

## ${sectionNumbering.parecer}. PARECER TÉCNICO
${buildTechnicalOpinion(data)}

---

## ✅ Responsabilidade Técnica e Conferência Final do Relatório
A **NBR 5419:2025** deve ser utilizada como **fonte principal** para validação dos dados e referência normativa do relatório.

Este aplicativo atua **exclusivamente como ferramenta de apoio** para cálculos e emissão de relatórios, **não isentando o usuário** de sua responsabilidade legal e técnica quanto à **veracidade**, **precisão** e **adequação** das informações fornecidas.

### 🤝 Informações de Contato
* **Autor do Aplicativo:** Engº Júlio César Certo
* **Contato (WhatsApp):** (35) 9 8811-3746
* **E-mail:** julio.certo@hotmail.com

> Ao utilizar este aplicativo, cite a fonte: **Engº Júlio César Certo — Ferramenta de Análise de Risco SPDA NBR 5419**.
`;

    return markdown.trim();
}
