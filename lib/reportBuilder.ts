import { AnalysisData } from '../types';
import {
    PB_OPTIONS,
    PSPD_OPTIONS,
    PTA_OPTIONS,
    RF_OPTIONS,
    RP_OPTIONS,
    HZ_OPTIONS,
    PTU_OPTIONS,
    UW_OPTIONS,
    COMBINED_CLD_CLI_OPTIONS
} from '../constants';

function getOptionLabel(options: {value: any, label: string}[], value: any): string {
    const option = options.find(opt => String(opt.value) === String(value));
    return option ? option.label : `Valor ${value}`;
}

function formatScientific(val: number | undefined): string {
    if (val === undefined || isNaN(val)) return '0,00';
    if (val === 0) return '0';
    if (Math.abs(val) < 0.0000001) {
        return val.toExponential(3).replace('e', ' x 10<sup>').concat('</sup>');
    }
    return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 7 });
}

function formatDateBR(dateStr: string | undefined): string {
    if (!dateStr) return new Date().toLocaleDateString('pt-BR');
    if (dateStr.includes('-')) {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    }
    return dateStr;
}

function buildVariablesTable(data: AnalysisData, isWord: boolean = false): string {
    const { calculations: c } = data;
    const tableStyle = `width:100%; border-collapse: collapse; font-size: 11px; margin-bottom: 5px; table-layout: fixed; border: ${isWord ? '1pt solid #000000' : 'none'};`;
    
    // Cores: No Word usamos preto puro e fundos sólidos sem transparência
    const textColor = isWord ? '#000000' : '#f8fafc';
    const borderColor = isWord ? '#000000' : 'rgba(226,232,240,0.1)';
    const headerBg = isWord ? '#f1f5f9' : 'rgba(15,23,42,0.5)';
    const headerText = isWord ? '#1e3a8a' : '#60a5fa';

    const cellStyleCenter = `padding: 3px 5px; border: 1px solid ${borderColor}; text-align: center; color: ${textColor}; overflow: hidden;`;
    const cellStyleLeft = `padding: 3px 5px; border: 1px solid ${borderColor}; text-align: left; color: ${textColor}; overflow: hidden;`;
    const headerStyleCenter = `padding: 5px; border: 1px solid ${borderColor}; text-align: center; background-color: ${headerBg}; font-weight: bold; color: ${headerText};`;
    const headerStyleLeft = `padding: 5px; border: 1px solid ${borderColor}; text-align: left; background-color: ${headerBg}; font-weight: bold; color: ${headerText};`;

    const alTotal = (c.al1 || 0) + (c.al2 || 0);
    const aiTotal = (c.ai1 || 0) + (c.ai2 || 0);

    return `### 2.1. PARÂMETROS FÍSICOS E AMBIENTAIS (ESTRUTURA)
<table style="${tableStyle}">
  <thead>
    <tr style="border-bottom: ${isWord ? '1.5pt solid black' : '2px solid #0f172a'};">
      <th style="${headerStyleCenter} width: 10%;">Item</th>
      <th style="${headerStyleLeft} width: 60%;">Variável de Entrada (Normativa)</th>
      <th style="${headerStyleCenter} width: 15%;">Valor</th>
      <th style="${headerStyleCenter} width: 15%;">Unid.</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="${cellStyleCenter}">L</td><td style="${cellStyleLeft}">Comprimento da estrutura (Longitudinal)</td><td style="${cellStyleCenter}"><b>${data.l}</b></td><td style="${cellStyleCenter}">m</td></tr>
    <tr><td style="${cellStyleCenter}">W</td><td style="${cellStyleLeft}">Largura da estrutura (Transversal)</td><td style="${cellStyleCenter}"><b>${data.w}</b></td><td style="${cellStyleCenter}">m</td></tr>
    <tr><td style="${cellStyleCenter}">H</td><td style="${cellStyleLeft}">Altura máxima da estrutura</td><td style="${cellStyleCenter}"><b>${data.h}</b></td><td style="${cellStyleCenter}">m</td></tr>
    <tr><td style="${cellStyleCenter}">Ng</td><td style="${cellStyleLeft}">Densidade de descargas (Regional)</td><td style="${cellStyleCenter}"><b>${data.ng}</b></td><td style="${cellStyleCenter}">/km².ano</td></tr>
    <tr><td style="${cellStyleCenter}">Cd</td><td style="${cellStyleLeft}">Fator de localização ambiental</td><td style="${cellStyleCenter}"><b>${data.cd}</b></td><td style="${cellStyleCenter}">-</td></tr>
  </tbody>
</table>

### 2.2. ÁREAS DE EXPOSIÇÃO EQUIVALENTES (GEOMÉTRICO)
<table style="${tableStyle}">
  <thead>
    <tr style="border-bottom: ${isWord ? '1.5pt solid black' : '2px solid #0f172a'};">
      <th style="${headerStyleCenter} width: 10%;">Cód.</th>
      <th style="${headerStyleLeft} width: 60%;">Definição da Área (Anexo A) / Fonte de Dano</th>
      <th style="${headerStyleCenter} width: 15%;">Resultado</th>
      <th style="${headerStyleCenter} width: 15%;">Unid.</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="${cellStyleCenter}">Ad</td><td style="${cellStyleLeft}">Área de captação isolada (S1 — Descarga na Estrutura)</td><td style="${cellStyleCenter}"><b>${c.ad?.toFixed(2)}</b></td><td style="${cellStyleCenter}">m²</td></tr>
    <tr><td style="${cellStyleCenter}">Am</td><td style="${cellStyleLeft}">Área de descargas próximas (S2 — Indução na Estrutura)</td><td style="${cellStyleCenter}"><b>${c.am?.toFixed(2)}</b></td><td style="${cellStyleCenter}">m²</td></tr>
    <tr><td style="${cellStyleCenter}">Al</td><td style="${cellStyleLeft}">Área de captação das linhas (S3 — Descarga na Linha)</td><td style="${cellStyleCenter}"><b>${alTotal.toFixed(2)}</b></td><td style="${cellStyleCenter}">m²</td></tr>
    <tr><td style="${cellStyleCenter}">Ai</td><td style="${cellStyleLeft}">Área de indução das linhas (S4 — Indução na Linha)</td><td style="${cellStyleCenter}"><b>${aiTotal.toFixed(2)}</b></td><td style="${cellStyleCenter}">m²</td></tr>
  </tbody>
</table>`;
}

function buildFactorsTable(data: AnalysisData, isWord: boolean = false, zoneIndex: number = 0): string {
    const tableStyle = `width:100%; border-collapse: collapse; font-size: 10.5px; margin-bottom: 12px; table-layout: fixed; border: ${isWord ? '1pt solid #000' : 'none'};`;
    const borderColor = isWord ? '#000000' : 'rgba(226,232,240,0.1)';
    const headerBg = isWord ? '#f1f5f9' : 'rgba(15,23,42,0.5)';
    const headerText = isWord ? '#1e3a8a' : '#60a5fa';
    const textColor = isWord ? '#000000' : '#f1f5f9';
    
    const cellStyleLeft = `padding: 3px 5px; border: 1px solid ${borderColor}; text-align: left; color: ${textColor}; overflow: hidden;`;
    const headerStyleLeft = `padding: 4px 6px; border: 1px solid ${borderColor}; text-align: left; background-color: ${headerBg}; font-weight: bold; color: ${headerText};`;
    
    const zone = data.zones[zoneIndex];
    const p = zone?.probability_data || data.probability_data;
    const lz = zone?.loss_data || {};

    const cldCliElectric = `${p.CLD_electric_ext || 0}_${p.CLI_electric_ext || 0}`;
    const cldCliData = `${p.CLD_data_ext || 0}_${p.CLI_data_ext || 0}`;
    const sectionBg = isWord ? '#e2e8f0' : 'rgba(59,130,246,0.05)';

    const zoneNamePrefix = data.zones.length > 1 ? `[${zone?.name || `Zona ${zoneIndex + 1}`}] ` : '';

    return `### 2.3. PARÂMETROS TÉCNICOS E PREMISSAS — ${zoneNamePrefix}ZONA ATIVA
<table style="${tableStyle}">
  <thead>
    <tr style="border-bottom: ${isWord ? '1.5pt solid black' : '2px solid #0f172a'};">
      <th style="${headerStyleLeft} width: 10%;">Cód.</th>
      <th style="${headerStyleLeft} width: 33%;">Fator Técnico Normativo</th>
      <th style="${headerStyleLeft} width: 10%;">Valor</th>
      <th style="${headerStyleLeft} width: 47%;">Detalhamento da Premissa Escolhida (NBR 5419-2)</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background: ${sectionBg};"><td colspan="4" style="padding: 3px 6px; font-weight: bold; border: 1px solid ${borderColor}; color: ${isWord ? '#000' : 'inherit'};">A. PROTEÇÃO CONTRA DESCARGAS NA ESTRUTURA (S1 / S2)</td></tr>
    <tr><td style="${cellStyleLeft}">PB</td><td style="${cellStyleLeft}">Eficácia do SPDA</td><td style="${cellStyleLeft}"><b>${p.PB}</b></td><td style="${cellStyleLeft}">${getOptionLabel(PB_OPTIONS, p.PB)}</td></tr>
    <tr><td style="${cellStyleLeft}">PTA</td><td style="${cellStyleLeft}">Controle de Choque</td><td style="${cellStyleLeft}"><b>${p.PTA}</b></td><td style="${cellStyleLeft}">${getOptionLabel(PTA_OPTIONS, p.PTA)}</td></tr>
    <tr><td style="${cellStyleLeft}">Rf</td><td style="${cellStyleLeft}">Risco de Incêndio</td><td style="${cellStyleLeft}"><b>${lz.rf ?? 'N/A'}</b></td><td style="${cellStyleLeft}">${getOptionLabel(RF_OPTIONS, lz.rf)}</td></tr>
    <tr><td style="${cellStyleLeft}">Rp</td><td style="${cellStyleLeft}">Combate ao Fogo</td><td style="${cellStyleLeft}"><b>${lz.rp ?? 'N/A'}</b></td><td style="${cellStyleLeft}">${getOptionLabel(RP_OPTIONS, lz.rp)}</td></tr>
    
    <tr style="background: ${sectionBg};"><td colspan="4" style="padding: 3px 6px; font-weight: bold; border: 1px solid ${borderColor}; color: ${isWord ? '#000' : 'inherit'};">B. PROTEÇÃO DA LINHA DE ENERGIA (S3 / S4)</td></tr>
    <tr><td style="${cellStyleLeft}">PTU</td><td style="${cellStyleLeft}">Choque na Linha</td><td style="${cellStyleLeft}"><b>${p.PTU_electric}</b></td><td style="${cellStyleLeft}">${getOptionLabel(PTU_OPTIONS, p.PTU_electric)}</td></tr>
    <tr><td style="${cellStyleLeft}">CLI</td><td style="${cellStyleLeft}">Tipo da Rede</td><td style="${cellStyleLeft}"><b>${p.CLI_electric_ext}</b></td><td style="${cellStyleLeft}">${getOptionLabel(COMBINED_CLD_CLI_OPTIONS, cldCliElectric)}</td></tr>
    <tr><td style="${cellStyleLeft}">Uw</td><td style="${cellStyleLeft}">Suportabilidade Eqp</td><td style="${cellStyleLeft}"><b>${p.Uw_electric_ext}</b></td><td style="${cellStyleLeft}">${getOptionLabel(UW_OPTIONS, p.Uw_electric_ext)}</td></tr>
    <tr><td style="${cellStyleLeft}">PSPD</td><td style="${cellStyleLeft}">Eficácia DPS Elét.</td><td style="${cellStyleLeft}"><b>${p.PSPD_electric}</b></td><td style="${cellStyleLeft}">${getOptionLabel(PSPD_OPTIONS, p.PSPD_electric)}</td></tr>

    <tr style="background: ${sectionBg};"><td colspan="4" style="padding: 3px 6px; font-weight: bold; border: 1px solid ${borderColor}; color: ${isWord ? '#000' : 'inherit'};">C. PROTEÇÃO DA LINHA DE DADOS (S3 / S4)</td></tr>
    <tr><td style="${cellStyleLeft}">PTU</td><td style="${cellStyleLeft}">Choque na Linha</td><td style="${cellStyleLeft}"><b>${p.PTU_data}</b></td><td style="${cellStyleLeft}">${getOptionLabel(PTU_OPTIONS, p.PTU_data)}</td></tr>
    <tr><td style="${cellStyleLeft}">CLI</td><td style="${cellStyleLeft}">Blindagem Linha</td><td style="${cellStyleLeft}"><b>${p.CLI_data_ext}</b></td><td style="${cellStyleLeft}">${getOptionLabel(COMBINED_CLD_CLI_OPTIONS, cldCliData)}</td></tr>
    <tr><td style="${cellStyleLeft}">Uw</td><td style="${cellStyleLeft}">Suportabilidade Eqp</td><td style="${cellStyleLeft}"><b>${p.Uw_data_ext}</b></td><td style="${cellStyleLeft}">${getOptionLabel(UW_OPTIONS, p.Uw_data_ext)}</td></tr>
    <tr><td style="${cellStyleLeft}">PSPD</td><td style="${cellStyleLeft}">Eficácia DPS Dados</td><td style="${cellStyleLeft}"><b>${p.PSPD_data}</b></td><td style="${cellStyleLeft}">${getOptionLabel(PSPD_OPTIONS, p.PSPD_data)}</td></tr>
  </tbody>
</table>`;
}

function buildDetailedMemorial(data: AnalysisData, isWord: boolean = false, zoneIndex: number = 0): string {
    const { calculations: c, probability_calculations: pc, frequency_results: f, risk_results: r } = data;
    const p = data.probability_data;
    
    // Cálculos de linha agregados (S3 e S4)
    const nlTotal = (c.nl_electric || 0) + (c.nl_data || 0);
    const niTotal = (c.ni_electric || 0) + (c.ni_data || 0);

    const tableStyle = `width:100%; border-collapse: collapse; font-size: 10.2px; margin-bottom: 30px; table-layout: fixed; border: ${isWord ? '1pt solid black' : 'none'};`;
    const borderColor = isWord ? 'black' : 'rgba(148,163,184,0.1)';
    const textColorMain = isWord ? 'black' : '#ffffff';
    const textColorSub = isWord ? '#334155' : '#94a3b8';

    const cellFormula = `padding: 10px 6px; text-align: left; vertical-align: middle; border-bottom: 1px solid ${borderColor}; width: 60%; color: ${textColorSub};`;
    const cellResult = `padding: 10px 6px; text-align: right; vertical-align: middle; border-bottom: 1px solid ${borderColor}; width: 40%; font-family: "Arial", monospace; font-weight: bold; color: ${textColorMain}; font-size: 11px;`;
    const headerSection = isWord 
        ? 'background: #f1f5f9; padding: 8px 12px; font-weight: 800; color: #1e3a8a; border-bottom: 1pt solid #1e3a8a; margin-top: 25pt; margin-bottom: 12pt; text-transform: uppercase; font-size: 11px;'
        : 'background: rgba(251,191,36,0.1); padding: 12px 16px; font-weight: 800; color: #fbbf24; border-left: 6px solid #fbbf24; margin-top: 48px; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 1.5px; font-size: 12px;';

    const z = data.zones[zoneIndex] as any || {};
    const lz = z.loss_data || {};

    // Helper para formatar linhas de componentes
    const buildCompRow = (label: string, value: number, desc: string) => `
    <tr>
      <td style="${cellFormula}"><b>${label}</b>: ${desc}</td>
      <td style="${cellResult}">${formatScientific(value)}</td>
    </tr>`;

    let riskComponentsSection = '';
    
    // R1 Components
    if (data.risks_to_analyze.R1) {
        riskComponentsSection += `
<div style="${headerSection}">3.6. COMPONENTES DO RISCO À VIDA HUMANA (R1)</div>
<table style="${tableStyle}">
  ${buildCompRow('RA', r.RA, 'Choque em seres vivos (Estrutura)')}
  ${buildCompRow('RB', r.RB, 'Danos físicos (Estrutura - Fogo/Explosão)')}
  ${buildCompRow('RC', r.RC, 'Falhas de sistemas internos (Estrutura)')}
  ${buildCompRow('RM', r.RM, 'Falhas de sistemas (Estrutura - Campo Magnético)')}
  ${buildCompRow('RU', (r.RU||0) + (r.RUT||0), 'Choque em seres vivos (Linhas)')}
  ${buildCompRow('RV', (r.RV||0) + (r.RVT||0), 'Danos físicos (Linhas - Fogo/Explosão)')}
  ${buildCompRow('RW', (r.RW||0) + (r.RWT||0), 'Falhas de sistemas (Linhas - Surtos)')}
  ${buildCompRow('RZ', (r.RZ||0) + (r.RZT||0), 'Falhas de sistemas (Linhas - Indução)')}
  <tr style="background: ${isWord ? '#f1f5f9' : 'rgba(15,23,42,0.3)'};">
    <td style="${cellFormula}; font-weight: bold;">R1 TOTAL (Σ Comps)</td>
    <td style="${cellResult}">${formatScientific(r.R1)}</td>
  </tr>
</table>`;
    }

    // R3 Components
    if (data.risks_to_analyze.R3) {
        riskComponentsSection += `
<div style="${headerSection}">3.7. COMPONENTES DO RISCO AO PATRIMÔNIO CULTURAL (R3)</div>
<table style="${tableStyle}">
  ${buildCompRow('RB', r.RB3, 'Danos físicos - Fogo/Explosão (Estrutura)')}
  ${buildCompRow('RV', (r.RV3||0) + (r.RVT3||0), 'Danos físicos - Fogo/Explosão (Linhas)')}
  <tr style="background: ${isWord ? '#f1f5f9' : 'rgba(15,23,42,0.3)'};">
    <td style="${cellFormula}; font-weight: bold;">R3 TOTAL (Σ Comps)</td>
    <td style="${cellResult}">${formatScientific(r.R3)}</td>
  </tr>
</table>`;
    }

    // R4 Components
    if (data.risks_to_analyze.R4) {
        riskComponentsSection += `
<div style="${headerSection}">3.8. COMPONENTES DO RISCO ECONÔMICO (R4)</div>
<table style="${tableStyle}">
  ${buildCompRow('RA', r.RA4, 'Choque em seres vivos (Estrutura)')}
  ${buildCompRow('RB', r.RB4, 'Danos físicos (Estrutura - Fogo/Explosão)')}
  ${buildCompRow('RC', r.RC4, 'Falhas de sistemas internos (Estrutura)')}
  ${buildCompRow('RM', r.RM4, 'Falhas de sistemas (Estrutura - Campo Magnético)')}
  ${buildCompRow('RU', (r.RU4||0) + (r.RUT4||0), 'Choque em seres vivos (Linhas)')}
  ${buildCompRow('RV', (r.RV4||0) + (r.RVT4||0), 'Danos físicos (Linhas - Fogo/Explosão)')}
  ${buildCompRow('RW', (r.RW4||0) + (r.RWT4||0), 'Falhas de sistemas (Linhas - Surtos)')}
  ${buildCompRow('RZ', (r.RZ4||0) + (r.RZT4||0), 'Falhas de sistemas (Linhas - Indução)')}
  <tr style="background: ${isWord ? '#f1f5f9' : 'rgba(15,23,42,0.3)'};">
    <td style="${cellFormula}; font-weight: bold;">R4 TOTAL (Σ Comps)</td>
    <td style="${cellResult}">${formatScientific(r.R4)}</td>
  </tr>
</table>`;
    }

    // FD Components
    riskComponentsSection += `
<div style="${headerSection}">3.9. COMPONENTES DA FREQUÊNCIA DE DANOS (FD)</div>
<table style="${tableStyle}">
  ${buildCompRow('FB', data.frequency_results.FB, 'Frequência de danos físicos na estrutura')}
  ${buildCompRow('FC', data.frequency_results.FC, 'Frequência de falhas de sistemas internos')}
  ${buildCompRow('FM', data.frequency_results.FM, 'Frequência de falhas por campos magnéticos')}
  ${buildCompRow('FV', data.frequency_results.FV, 'Frequência de danos físicos nas linhas')}
  ${buildCompRow('FW', data.frequency_results.FW, 'Frequência de falhas de sistemas via linhas (surtos)')}
  ${buildCompRow('FZ', data.frequency_results.FZ, 'Frequência de falhas de sistemas via indução')}
  <tr style="background: ${isWord ? '#f1f5f9' : 'rgba(15,23,42,0.3)'};">
    <td style="${cellFormula}; font-weight: bold;">FD TOTAL (Σ Comps)</td>
    <td style="${cellResult}">${formatScientific(data.frequency_results.F)}</td>
  </tr>
</table>`;

    return `## 3. MEMORIAL DE CÁLCULO E RASTREABILIDADE MATEMÁTICA (GLOBAL)

<div style="${headerSection}">3.1. ESTIMATIVA DE EVENTOS PERIGOSOS ANUAIS (N)</div>
<table style="${tableStyle}">
  <tr><td style="${cellFormula}"><b>Nd (S1)</b>: Ng x Ad x Cd x 10⁻⁶</td><td style="${cellResult}">${formatScientific(c.nd)} ev./ano</td></tr>
  <tr><td style="${cellFormula}"><b>Nm (S2)</b>: Ng x Am x 10⁻⁶</td><td style="${cellResult}">${formatScientific(c.nm)} ev./ano</td></tr>
  <tr><td style="${cellFormula}"><b>Nl (S3)</b>: Somatório das descargas diretas na rede</td><td style="${cellResult}">${formatScientific(nlTotal)} ev./ano</td></tr>
  <tr><td style="${cellFormula}"><b>Ni (S4)</b>: Somatório das induções laterais na rede</td><td style="${cellResult}">${formatScientific(niTotal)} ev./ano</td></tr>
</table>

<div style="${headerSection}">3.2. PROBABILIDADES DE DANO RESIDUAL (P) — MÉDIA PONDERADA</div>
<table style="${tableStyle}">
  <tr><td style="${cellFormula}"><b>PA (Choque)</b>: Medida PTA x Nível PB</td><td style="${cellResult}">${formatScientific(pc.PA)}</td></tr>
  <tr><td style="${cellFormula}"><b>PB (Físico)</b>: Eficácia SPDA GLOBAL</td><td style="${cellResult}">${formatScientific(pc.PB)}</td></tr>
  <tr><td style="${cellFormula}"><b>PC (Sistemas)</b>: Eficácia DPS GLOBAL</td><td style="${cellResult}">${formatScientific(pc.PC)}</td></tr>
</table>

${riskComponentsSection}

<div style="${headerSection}">3.10. RESUMO DE RISCO FINAL (Σ N x P x L)</div>
<table style="${tableStyle}">
  <tr><td style="${cellFormula}"><b>RISCO À VIDA HUMANA (R1)</b></td><td style="${cellResult}">${formatScientific(r.R1)}</td></tr>
  ${data.risks_to_analyze.R3 ? `<tr><td style="${cellFormula}"><b>RISCO PATRIMÔNIO CULTURAL (R3)</b></td><td style="${cellResult}">${formatScientific(r.R3)}</td></tr>` : ''}
  ${data.risks_to_analyze.R4 ? `<tr><td style="${cellFormula}"><b>RISCO ECONÔMICO (R4)</b></td><td style="${cellResult}">${formatScientific(r.R4)}</td></tr>` : ''}
  <tr style="background: #0f172a; color: white;">
    <td style="${cellFormula}; border-bottom: none; font-weight: 800; color: #fff;">FREQUÊNCIA DE DANOS FINAL (FD)</td>
    <td style="${cellResult}; border-bottom: none; font-size: 13px; color: #fff;">${formatScientific(data.frequency_results.F)}</td>
  </tr>
</table>`;
}

export async function generateFullReportText(data: AnalysisData, isWord: boolean = false): Promise<string> {
    const { risk_results: r, frequency_results: f } = data;
    const isOk = !Object.entries(data.risks_to_analyze)
        .some(([k, v]) => v && (data.risk_results as any)[k] > ({ R1: 1e-5, R3: 1e-3, R4: 1e-3 } as any)[k]);
    const fdLimit = data.frequency_config.is_critical_system ? 0.1 : 1.0;
    const freqOk = (f.F || 0) <= fdLimit;

    const buildConclusion = () => {
        const title = isOk && freqOk ? "✅ CONFORMIDADE TÉCNICA NBR 5419:2026" : "❌ NÃO CONFORMIDADE DETECTADA";
        const cssClass = isOk && freqOk ? "safe" : "danger";
        
        let opinion = '';
        if (isOk && freqOk) {
            const pbValue = data.probability_data.PB;
            const pspdValue = data.probability_data.PSPD_electric;
            const cleanLabel = (text: string) => text.replace(/\s+[0-9,.]+$/, '').trim();

            const spdaText = pbValue === 1 
                ? "à **ausência de SPDA externo**" 
                : `ao **${cleanLabel(getOptionLabel(PB_OPTIONS, pbValue))}**`;
                
            const dpsText = pspdValue === 1 
                ? "à **ausência de MPS (DPS)**" 
                : `às **MPS (${cleanLabel(getOptionLabel(PSPD_OPTIONS, pspdValue))})**`;

            opinion = `A edificação encontra-se **PROTEGIDA**. A conformidade está vinculada ${spdaText} e ${dpsText}, conforme parâmetros detalhados nas tabelas de premissas por zona.`;
        } else {
            opinion = `**O RISCO SUPERA OS LIMITES.** Recomenda-se: 1) Elevar Classe SPDA; 2) DPS coordenados Classe I; 3) Reforçar combate a incêndio (Rp).`;
        }

        const r1Ok = (r.R1 || 0) <= 1e-5;
        const fdLimitVal = data.frequency_config.is_critical_system ? 0.1 : 1.0;
        const fOk = (f.F || 0) <= fdLimitVal;

        return `## 5. CONCLUSÃO TÉCNICA
<div class="status-box ${cssClass}">
    <h3>${title}</h3>
    <p style="color: ${isWord ? '#000000' : 'inherit'}">${opinion}</p>
</div>

### RESUMO DOS INDICADORES DE CONFORMIDADE:
<table style="width:100%; border-collapse: collapse; font-size: 11px; table-layout: fixed; margin-top: 5px; border: ${isWord ? '1pt solid black' : 'none'};">
  <tr style="background: ${isWord ? '#f1f5f9' : 'rgba(15,23,42,0.5)'}; color: ${isWord ? '#1e3a8a' : '#60a5fa'};">
    <th style="padding: 6px; border: 1px solid ${isWord ? 'black' : 'rgba(248,250,252,0.1)'}; text-align: left;">Parâmetro Analisado</th>
    <th style="padding: 6px; border: 1px solid ${isWord ? 'black' : 'rgba(248,250,252,0.1)'}; text-align: center;">Calculado</th>
    <th style="padding: 6px; border: 1px solid ${isWord ? 'black' : 'rgba(248,250,252,0.1)'}; text-align: center;">Tolerável</th>
    <th style="padding: 6px; border: 1px solid ${isWord ? 'black' : 'rgba(248,250,252,0.1)'}; text-align: center;">Status</th>
  </tr>
  <tr>
    <td style="padding: 6px; border: 1px solid ${isWord ? 'black' : 'rgba(248,250,252,0.1)'}; color: ${isWord ? 'black' : '#f8fafc'};">Risco à Vida Humana (R1)</td>
    <td style="padding: 6px; border: 1px solid ${isWord ? 'black' : 'rgba(248,250,252,0.1)'}; text-align: center; color: ${isWord ? 'black' : '#f8fafc'};">${formatScientific(r.R1)}</td>
    <td style="padding: 6px; border: 1px solid ${isWord ? 'black' : 'rgba(248,250,252,0.1)'}; text-align: center; color: ${isWord ? '#475569' : '#94a3b8'};">1.00 x 10⁻⁵</td>
    <td style="padding: 6px; border: 1px solid ${isWord ? 'black' : 'rgba(248,250,252,0.1)'}; text-align: center; color: ${r1Ok ? '#059669' : '#dc2626'}; font-weight: bold;">${r1Ok ? 'OK' : 'CRÍTICO'}</td>
  </tr>
  <tr>
    <td style="padding: 6px; border: 1px solid ${isWord ? 'black' : 'rgba(248,250,252,0.1)'}; color: ${isWord ? 'black' : '#f8fafc'};">Frequência de Danos (FD)</td>
    <td style="padding: 6px; border: 1px solid ${isWord ? 'black' : 'rgba(248,250,252,0.1)'}; text-align: center; color: ${isWord ? 'black' : '#f8fafc'};">${formatScientific(f.F)}</td>
    <td style="padding: 6px; border: 1px solid ${isWord ? 'black' : 'rgba(248,250,252,0.1)'}; text-align: center; color: ${isWord ? '#475569' : '#94a3b8'};">${fdLimitVal.toFixed(1)}</td>
    <td style="padding: 6px; border: 1px solid ${isWord ? 'black' : 'rgba(248,250,252,0.1)'}; text-align: center; color: ${fOk ? '#059669' : '#dc2626'}; font-weight: bold;">${fOk ? 'OK' : 'CRÍTICO'}</td>
  </tr>
</table>`;
    };

    const buildStatusChart = (title: string, value: number, limit: number) => {
        if (isWord) return ''; // O Word não suporta SVG Base64 de forma confiável no HTML

        const percent = Math.min(100, (value / limit) * 100);
        const color = value > limit ? "#ef4444" : "#10b981";
        const svg = `<svg width="400" height="70" viewBox="0 0 400 70" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="70" fill="rgba(248,250,252,0.8)" rx="8"/>
            <text x="12" y="20" font-family="Arial" font-size="11" font-weight="900" fill="#334155">${title}</text>
            <rect x="12" y="32" width="376" height="10" fill="#e2e8f0" rx="5"/>
            <rect x="12" y="32" width="${(percent * 3.76).toFixed(0)}" height="10" fill="${color}" rx="5"/>
            <text x="12" y="58" font-family="Arial" font-size="9" font-weight="bold" fill="#64748b">Calculado: ${formatScientific(value)} | Máximo Permitido: ${formatScientific(limit)}</text>
            <circle cx="${(percent * 3.76 + 12).toFixed(0)}" cy="37" r="4" fill="white" stroke="${color}" stroke-width="3"/>
        </svg>`.trim();
        const base64 = typeof window !== 'undefined' ? window.btoa(unescape(encodeURIComponent(svg))) : Buffer.from(svg).toString('base64');
        return `data:image/svg+xml;base64,${base64}`;
    };

    const riskChart = isWord ? '_[Gráficos omitidos para maior compatibilidade com Word. Consulte os dados na tabela de conformidade no final do relatório.]_' : `![Gráfico de Risco R1](${buildStatusChart("SISTEMA 01: RISCO À VIDA HUMANA (R1)", r.R1 || 0, 1e-5)})`;
    const freqChart = isWord ? '' : `![Gráfico de Frequência FD](${buildStatusChart("SISTEMA 02: FREQUÊNCIA DE DANOS (FD)", f.F || 0, fdLimit)})`;

    // Gera tabelas de fatores para todas as zonas
    const factorsTables = data.zones.map((_, idx) => buildFactorsTable(data, isWord, idx)).join('\n\n');

    return `
# <span style="color: ${isWord ? '#000000' : '#ffffff'};">RELATÓRIO TÉCNICO:</span>
# <span style="color: ${isWord ? '#1e3a8a' : '#fbbf24'};">ANÁLISE DE RISCO PDA (NBR 5419-2 2026)</span>

## 🏛️ <span style="color: ${isWord ? '#1e3a8a' : '#fbbf24'};">1. IDENTIFICAÇÃO E DADOS GERAIS</span>
<div style="background: ${isWord ? '#f1f5f9' : 'rgba(30,41,59,0.5)'}; border: 1px solid ${isWord ? '#000000' : 'rgba(148,163,184,0.2)'}; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
<table style="width:100%; border-collapse: collapse; font-size: 12px; table-layout: fixed;">
  <tr><td style="padding: 4px; width: 25%; color: ${isWord ? '#475569' : '#94a3b8'};"><b>CLIENTE:</b></td><td style="padding: 4px; border-bottom: 1px solid ${isWord ? '#000000' : 'rgba(148,163,184,0.1)'}; color: ${isWord ? '#000000' : '#f8fafc'};">${data.clientName || 'N/A'}</td></tr>
  <tr><td style="padding: 4px; color: ${isWord ? '#475569' : '#94a3b8'};"><b>RESPONSÁVEL:</b></td><td style="padding: 4px; border-bottom: 1px solid ${isWord ? '#000000' : 'rgba(148,163,184,0.1)'}; color: ${isWord ? '#000000' : '#f8fafc'};">Engº ${data.technicalManagerName || 'N/A'}</td></tr>
  <tr><td style="padding: 4px; color: ${isWord ? '#475569' : '#94a3b8'};"><b>LOCALIDADE:</b></td><td style="padding: 4px; border-bottom: 1px solid ${isWord ? '#000000' : 'rgba(148,163,184,0.1)'}; color: ${isWord ? '#000000' : '#f8fafc'};">${data.location || 'Brasil'}</td></tr>
  <tr><td style="padding: 4px; color: ${isWord ? '#475569' : '#94a3b8'};"><b>DATA EMISSÃO:</b></td><td style="padding: 4px; color: ${isWord ? '#000000' : '#f8fafc'};">${formatDateBR(data.projectDate)}</td></tr>
</table>
</div>

## 📊 <span style="color: ${isWord ? '#1e3a8a' : '#fbbf24'};">2. ENTRADA DE DADOS E PREMISSAS NORMATIVAS</span>
${buildVariablesTable(data, isWord)}

${factorsTables}

## 📐 <span style="color: ${isWord ? '#1e3a8a' : '#fbbf24'};">3. MEMORIAL DE CÁLCULO E RASTREABILIDADE</span>
${buildDetailedMemorial(data, isWord)}

## 🚦 <span style="color: ${isWord ? '#1e3a8a' : '#fbbf24'};">4. ANÁLISE GRÁFICA DE CONFORMIDADE</span>
O gráfico abaixo compara os valores calculados contra os limites de tolerância da NBR 5419:

${riskChart}

${freqChart}

## ⚖️ <span style="color: ${isWord ? '#1e3a8a' : '#fbbf24'};">5. CONCLUSÃO TÉCNICA E PARECER FINAL</span>
${buildConclusion()}

<div style="text-align: center; margin-top: 120px; padding-top: 6px; border-top: 1px solid #000000; max-width: 320px; margin-left: auto; margin-right: auto;">
  <p style="font-size: 14px; margin-bottom: 0; color: ${isWord ? '#000000' : '#f8fafc'};"><b>Engº ${data.technicalManagerName || 'Responsável Técnico'}</b></p>
  <p style="font-size: 11px; color: ${isWord ? '#475569' : '#94a3b8'}; margin-top: 4px;">Analista Especialista em PDA — NBR 5419:2:2026</p>
</div>
`.trim();
}
