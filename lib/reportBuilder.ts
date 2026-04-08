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
    if (val === 0) return '0,00';
    
    // Para valores muito pequenos, usa notação científica pura
    if (Math.abs(val) < 0.001) {
        const parts = val.toExponential(2).split('e');
        const coeff = parts[0].replace('.', ',');
        const exp = parseInt(parts[1]);
        return `${coeff} x 10<sup>${exp}</sup>`;
    }
    
    // Caso contrário, usa 2 casas decimais padrão
    return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 3 });
}

function formatLossScientific(val: number | undefined): string {
    if (val === undefined || isNaN(val)) return '0,00';
    if (val === 0) return '0,00';
    
    const parts = val.toExponential(2).split('e');
    const coefficient = parts[0].replace('.', ',');
    const exponent = parseInt(parts[1]);
    return `${coefficient} x 10<sup>${exponent}</sup>`;
}

function formatR1(val: number | undefined): string {
    if (val === undefined || isNaN(val)) return '0,00 x 10<sup>-5</sup>';
    if (val === 0) return '0,00';
    
    // Se o risco for menor que 10^-8, a notação x 10^-5 mostrará 0,00.
    // Nesses casos, mudamos para notação científica puras para o usuário ver o valor real.
    if (val < 1e-7 && val > 0) {
        return formatLossScientific(val);
    }
    
    const scaled = (val * 1e5).toFixed(2).replace('.', ',');
    return `${scaled} x 10<sup>-5</sup>`;
}

function formatFD(val: number | undefined): string {
    if (val === undefined || isNaN(val)) return '0,00';
    if (val === 0) return '0,00';
    if (val < 0.01) return formatLossScientific(val);
    return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
    const textColor = isWord ? '#000000' : '#f8fafc';
    const borderColor = isWord ? '#000000' : 'rgba(226,232,240,0.1)';
    const headerBg = isWord ? '#f1f5f9' : 'rgba(59,130,246,0.05)';
    const headerText = isWord ? '#000000' : '#60a5fa';

    let tableStyle = `width: 100%; border-collapse: collapse; margin-bottom: 32px; border: ${isWord ? '1.5pt solid #000000' : `1px solid ${borderColor}`}; table-layout: fixed;`;
    const cellStyleCenter = `padding: 3px 5px; border: 1px solid ${borderColor}; text-align: center; color: ${textColor}; word-wrap: break-word;`;
    const cellStyleLeft = `padding: 3px 5px; border: 1px solid ${borderColor}; text-align: left; color: ${textColor}; word-wrap: break-word;`;
    const headerStyleLeft = `padding: 12px 14px; text-align: left; font-weight: 950; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: ${headerText}; vertical-align: middle; background-color: ${headerBg};`;
    const headerStyleCenter = `padding: 12px 14px; text-align: center; font-weight: 950; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: ${headerText}; vertical-align: middle; background-color: ${headerBg};`;

    const alTotal = (c.al1 || 0) + (c.al2 || 0);
    const aiTotal = (c.ai1 || 0) + (c.ai2 || 0);

    return `### 2.1. PARÂMETROS FÍSICOS E AMBIENTAIS (ESTRUTURA)
<table style="${tableStyle}">
  <thead>
    <tr style="border-bottom: ${isWord ? '1.5pt solid black' : '2px solid #0f172a'};">
      <th style="${headerStyleCenter} width: 15%;">Item</th>
      <th style="${headerStyleLeft} width: 40%;">Variável de Entrada (Normativa)</th>
      <th style="${headerStyleCenter} width: 28%;">Valor</th>
      <th style="${headerStyleCenter} width: 17%;">Unid.</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="${cellStyleCenter}">L</td><td style="${cellStyleLeft}">Comprimento da estrutura (Longitudinal)</td><td style="${cellStyleCenter}"><b>${data.l}</b></td><td style="${cellStyleCenter}">m</td></tr>
    <tr><td style="${cellStyleCenter}">W</td><td style="${cellStyleLeft}">Largura da estrutura (Transversal)</td><td style="${cellStyleCenter}"><b>${data.w}</b></td><td style="${cellStyleCenter}">m</td></tr>
    <tr><td style="${cellStyleCenter}">H</td><td style="${cellStyleLeft}">Altura máxima da estrutura</td><td style="${cellStyleCenter}"><b>${data.h}</b></td><td style="${cellStyleCenter}">m</td></tr>
    <tr><td style="${cellStyleCenter}">Ng</td><td style="${cellStyleLeft}">Densidade de descargas (Regional)</td><td style="${cellStyleCenter}"><b>${data.ng}</b></td><td style="${cellStyleCenter}">/km².ano</td></tr>
    <tr><td style="${cellStyleCenter}">Cd</td><td style="${cellStyleLeft}">Fator de localização ambiental</td><td style="${cellStyleCenter}"><b>${data.cd}</b></td><td style="${cellStyleCenter}">-</td></tr>
    <tr><td style="${cellStyleCenter}">rs</td><td style="${cellStyleLeft}">Tipo de Construção (<b>${data.rs === 1 ? 'Robusta' : 'Simples'}</b>)</td><td style="${cellStyleCenter}"><b>${data.rs}</b></td><td style="${cellStyleCenter}">-</td></tr>
  </tbody>
</table>

### 2.2. ÁREAS DE EXPOSIÇÃO EQUIVALENTES (GEOMÉTRICO)
<table style="${tableStyle}">
  <thead>
    <tr style="border-bottom: ${isWord ? '1.5pt solid black' : '2px solid #0f172a'};">
      <th style="${headerStyleCenter} width: 15%;">Cód.</th>
      <th style="${headerStyleLeft} width: 40%;">Definição da Área (Anexo A) / Fonte de Dano</th>
      <th style="${headerStyleCenter} width: 28%;">Resultado</th>
      <th style="${headerStyleCenter} width: 17%;">Unid.</th>
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
    const c = data.calculations;
    const tableStyle = `width:100%; border-collapse: collapse; font-size: 10.5px; margin-bottom: 12px; table-layout: auto; border: ${isWord ? '1pt solid #000' : 'none'};`;
    const borderColor = isWord ? '#000000' : 'rgba(226,232,240,0.1)';
    const headerBg = isWord ? '#f1f5f9' : 'rgba(15,23,42,0.5)';
    const headerText = isWord ? '#000000' : '#60a5fa';
    const textColor = isWord ? '#000000' : '#f1f5f9';
    
    const cellStyleLeft = `padding: 3px 5px; border: 1px solid ${borderColor}; text-align: left; color: ${textColor}; word-wrap: break-word;`;
    const headerStyleLeft = `padding: 4px 6px; border: 1px solid ${borderColor}; text-align: left; background-color: ${headerBg}; font-weight: bold; color: ${headerText};`;
    
    const zone = data.zones[zoneIndex];
    const p = zone?.probability_data || data.probability_data;
    const lz = zone?.loss_data || {};

    const cldCliElectric = `${p.CLD_electric_ext || 0}_${p.CLI_electric_ext || 0}`;
    const cldCliData = `${p.CLD_data_ext || 0}_${p.CLI_data_ext || 0}`;
    const sectionBg = isWord ? '#e2e8f0' : 'rgba(59,130,246,0.05)';

    const zoneNamePrefix = data.zones.length > 1 ? ` — [${zone?.name || `Zona ${zoneIndex + 1}`}]` : '';
    const Ks1 = Math.min(1, (p.wm1 || 5) * 0.12);
    const Ks2 = Math.min(1, (p.wm2 || 5) * 0.12);

    return `### 2.3. PARÂMETROS TÉCNICOS E PREMISSAS DE PROJETO (ESTRUTURA E LINHAS)${zoneNamePrefix}
<table style="${tableStyle}">
  <thead>
    <tr style="border-bottom: ${isWord ? '1.5pt solid black' : '2px solid #0f172a'};">
      <th style="${headerStyleLeft} width: 20%;">Cód.</th>
      <th style="${headerStyleLeft} width: 36%;">Fator Técnico Normativo</th>
      <th style="${headerStyleLeft} width: 7%;">Valor</th>
      <th style="${headerStyleLeft} width: 37%;">Detalhamento da Premissa Escolhida (NBR 5419-2)</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background: ${sectionBg};"><td colspan="4" style="padding: 3px 6px; font-weight: bold; border: 1px solid ${borderColor}; color: ${isWord ? '#000' : 'inherit'};">A. PROTEÇÃO CONTRA DESCARGAS NA ESTRUTURA (S1 / S2)</td></tr>
    <tr><td style="${cellStyleLeft}">PB</td><td style="${cellStyleLeft}">Eficácia do SPDA</td><td style="${cellStyleLeft}"><b>${p.PB}</b></td><td style="${cellStyleLeft}">${getOptionLabel(PB_OPTIONS, p.PB)}</td></tr>
    <tr><td style="${cellStyleLeft}">PTA</td><td style="${cellStyleLeft}">Controle de Choque</td><td style="${cellStyleLeft}"><b>${p.PTA}</b></td><td style="${cellStyleLeft}">${getOptionLabel(PTA_OPTIONS, p.PTA)}</td></tr>
    <tr><td style="${cellStyleLeft}">Ks1</td><td style="${cellStyleLeft}">Blindagem (L. Malha wm1)</td><td style="${cellStyleLeft}"><b>${Ks1.toFixed(2)}</b></td><td style="${cellStyleLeft}">Malha de ${p.wm1 || 5}m (Calculado Ks1)</td></tr>
    <tr><td style="${cellStyleLeft}">Ks2</td><td style="${cellStyleLeft}">Blindagem (L. Malha wm2)</td><td style="${cellStyleLeft}"><b>${Ks2.toFixed(2)}</b></td><td style="${cellStyleLeft}">Malha de ${p.wm2 || 5}m (Calculado Ks2)</td></tr>
    <tr><td style="${cellStyleLeft}">Rf</td><td style="${cellStyleLeft}">Risco de Incêndio</td><td style="${cellStyleLeft}"><b>${lz.rf ?? 'N/A'}</b></td><td style="${cellStyleLeft}">${getOptionLabel(RF_OPTIONS, lz.rf)}</td></tr>
    <tr><td style="${cellStyleLeft}">Rp</td><td style="${cellStyleLeft}">Combate ao Fogo</td><td style="${cellStyleLeft}"><b>${lz.rp ?? 'N/A'}</b></td><td style="${cellStyleLeft}">${getOptionLabel(RP_OPTIONS, lz.rp)}</td></tr>
    <tr style="background: ${sectionBg}; font-size: 9px;"><td style="${cellStyleLeft}"><b>Nd / Nm</b></td><td style="${cellStyleLeft}">Frequência de Eventos (Engenharia)</td><td style="${cellStyleLeft}"><b>Fórmula Audit.</b></td><td style="${cellStyleLeft}">
        S1: [Ng:<b>${data.ng}</b> x Ad:<b>${c.ad?.toFixed(1)}</b> x Cd:<b>${data.cd}</b>] x 10⁻⁶ = <b>${formatScientific(c.nd)}</b><br/>
        S2: [Ng:<b>${data.ng}</b> x Am:<b>${c.am?.toFixed(1)}</b>] x 10⁻⁶ = <b>${formatScientific(c.nm)}</b>
    </td></tr>
    
    <tr style="background: ${sectionBg};"><td colspan="4" style="padding: 3px 6px; font-weight: bold; border: 1px solid ${borderColor}; color: ${isWord ? '#000' : 'inherit'};">B. PROTEÇÃO DA LINHA DE ENERGIA (S3 / S4)</td></tr>
    <tr><td style="${cellStyleLeft}">PTU</td><td style="${cellStyleLeft}">Choque na Linha</td><td style="${cellStyleLeft}"><b>${p.PTU_electric}</b></td><td style="${cellStyleLeft}">${getOptionLabel(PTU_OPTIONS, p.PTU_electric)}</td></tr>
    <tr><td style="${cellStyleLeft}">CLI</td><td style="${cellStyleLeft}">Tipo da Rede</td><td style="${cellStyleLeft}"><b>${p.CLI_electric_ext}</b></td><td style="${cellStyleLeft}">${getOptionLabel(COMBINED_CLD_CLI_OPTIONS, cldCliElectric)}</td></tr>
    <tr><td style="${cellStyleLeft}">Uw</td><td style="${cellStyleLeft}">Suportabilidade Eqp</td><td style="${cellStyleLeft}"><b>${p.Uw_electric_ext}</b></td><td style="${cellStyleLeft}">${getOptionLabel(UW_OPTIONS, p.Uw_electric_ext)}</td></tr>
    <tr><td style="${cellStyleLeft}">PSPD</td><td style="${cellStyleLeft}">Eficácia DPS Elét.</td><td style="${cellStyleLeft}"><b>${p.PSPD_electric}</b></td><td style="${cellStyleLeft}">${getOptionLabel(PSPD_OPTIONS, p.PSPD_electric)}</td></tr>
    <tr style="background: ${sectionBg}; font-size: 9px;"><td style="${cellStyleLeft}"><b>Nl / Ni</b></td><td style="${cellStyleLeft}">Frequência na Linha Elétrica</td><td style="${cellStyleLeft}"><b>Fórmula Audit.</b></td><td style="${cellStyleLeft}">
        S3 (Direta): [Ng:<b>${data.ng}</b> x Al:<b>${(c.al1 || 0).toFixed(0)}</b> x Ct:<b>0,2</b>] x 10⁻⁶ = <b>${formatScientific(c.nl_electric)}</b><br/>
        S4 (Indução): [Ng:<b>${data.ng}</b> x Ai:<b>${(c.ai1 || 0).toFixed(0)}</b>] x 10⁻⁶ = <b>${formatScientific(c.ni_electric)}</b>
    </td></tr>

    <tr style="background: ${sectionBg};"><td colspan="4" style="padding: 3px 6px; font-weight: bold; border: 1px solid ${borderColor}; color: ${isWord ? '#000' : 'inherit'};">C. PROTEÇÃO DA LINHA DE DADOS (S3 / S4)</td></tr>
    <tr><td style="${cellStyleLeft}">PTU</td><td style="${cellStyleLeft}">Choque na Linha</td><td style="${cellStyleLeft}"><b>${p.PTU_data}</b></td><td style="${cellStyleLeft}">${getOptionLabel(PTU_OPTIONS, p.PTU_data)}</td></tr>
    <tr><td style="${cellStyleLeft}">CLI</td><td style="${cellStyleLeft}">Blindagem Linha</td><td style="${cellStyleLeft}"><b>${p.CLI_data_ext}</b></td><td style="${cellStyleLeft}">${getOptionLabel(COMBINED_CLD_CLI_OPTIONS, cldCliData)}</td></tr>
    <tr><td style="${cellStyleLeft}">Uw</td><td style="${cellStyleLeft}">Suportabilidade Eqp</td><td style="${cellStyleLeft}"><b>${p.Uw_data_ext}</b></td><td style="${cellStyleLeft}">${getOptionLabel(UW_OPTIONS, p.Uw_data_ext)}</td></tr>
    <tr><td style="${cellStyleLeft}">PSPD</td><td style="${cellStyleLeft}">Eficácia DPS Dados</td><td style="${cellStyleLeft}"><b>${p.PSPD_data}</b></td><td style="${cellStyleLeft}">${getOptionLabel(PSPD_OPTIONS, p.PSPD_data)}</td></tr>
    <tr style="background: ${sectionBg}; font-size: 9px;"><td style="${cellStyleLeft}"><b>Nl / Ni</b></td><td style="${cellStyleLeft}">Frequência na Linha de Dados</td><td style="${cellStyleLeft}"><b>Fórmula Audit.</b></td><td style="${cellStyleLeft}">
        S3 (Direta): [Ng:<b>${data.ng}</b> x Al:<b>${(c.al2 || 0).toFixed(0)}</b> x Ct:<b>1,0</b>] x 10⁻⁶ = <b>${formatScientific(c.nl_data)}</b><br/>
        S4 (Indução): [Ng:<b>${data.ng}</b> x Ai:<b>${(c.ai2 || 0).toFixed(0)}</b>] x 10⁻⁶ = <b>${formatScientific(c.ni_data)}</b>
    </td></tr>
  </tbody>
</table>`;
}

function buildDetailedMemorial(data: AnalysisData, isWord: boolean = false, zoneIndex: number = 0): string {
    const { calculations: c, probability_calculations: pc, frequency_results: f, risk_results: r } = data;
    const zone = data.zones[zoneIndex];
    const lz = (zone as any)?.loss_data || {};
    const prob = zone?.probability_data || data.probability_data;
    
    const borderColor = isWord ? '#000000' : 'rgba(148,163,184,0.1)';
    const textColorMain = isWord ? '#000000' : '#ffffff';
    const textColorSub = isWord ? '#000000' : '#94a3b8';
    const subHeaderSection = isWord
        ? 'background: #f8fafc; padding: 8px 12px; font-weight: 900; color: #000000; border-bottom: 2pt solid #000000; margin-top: 25pt; margin-bottom: 12pt; text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.5px;'
        : 'background: rgba(96,165,250,0.05); padding: 10px 16px; font-weight: 800; color: #60a5fa; border-left: 4px solid #60a5fa; margin-top: 40px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1.2px; font-size: 11.5px;';

    const cellCode = `padding: 8px 10px; text-align: left; vertical-align: middle; border-bottom: 1px solid ${borderColor}; width: 15%; font-weight: bold; color: ${textColorMain}; font-size: 11px; word-wrap: break-word;`;
    const cellFormula = `padding: 8px 10px; text-align: left; vertical-align: middle; border-bottom: 1px solid ${borderColor}; width: 55%; color: ${textColorSub}; word-wrap: break-word;`;
    const cellResult = `padding: 8px 10px; text-align: right; vertical-align: middle; border-bottom: 1px solid ${borderColor}; width: 30%; font-family: "Arial", monospace; font-weight: bold; color: ${textColorMain}; font-size: 11px; word-wrap: break-word;`;
    const tableStyle = `width:100%; border-collapse: collapse; font-size: 10.2px; margin-bottom: 30px; table-layout: auto; border: ${isWord ? '1pt solid black' : 'none'};`;

    const nlTotal = (c.nl_electric || 0) + (c.nl_data || 0);
    const niTotal = (c.ni_electric || 0) + (c.ni_data || 0);

    const rs_val = data.rs || 1;
    const nz_val = lz.nz || 5; 
    const nt_val = lz.nt || 5;
    const tz_val = lz.tz || 8760;
    const timeRatio = (nz_val / nt_val) * (tz_val / 8760);
    
    const LA_val = (lz.rt || 0.00001) * (lz.lt || 0.01) * timeRatio * rs_val;
    const LB_val = (lz.rp || 0) * (lz.rf || 0) * (lz.hz || 1) * (lz.LF || 0) * timeRatio * rs_val;
    const LC_val = (lz.LO || 0) * timeRatio * rs_val;

    const pcTotalFreq = data.has_electric_line && data.has_data_line 
        ? 1 - ((1 - (pc.PC || 0)) * (1 - (pc.PCT || 0)))
        : (data.has_electric_line ? pc.PC : (pc.PCT || 0));
    const pmTotalFreq = data.has_electric_line && data.has_data_line 
        ? 1 - ((1 - (pc.PM || 0)) * (1 - (pc.PMT || 0)))
        : (data.has_electric_line ? pc.PM : (pc.PMT || 0));

    let mainContent = '';

    mainContent += `
<div style="${subHeaderSection}">3.1. ESTIMATIVA DE EVENTOS PERIGOSOS ANUAIS (N)</div>
<table style="${tableStyle}">
  <tr><td style="${cellCode}">Nd (S1)</td><td style="${cellFormula}">[Ng:${data.ng} x Ad:${c.ad?.toFixed(2)} x Cd:${data.cd}] x 10⁻⁶</td><td style="${cellResult}">${formatScientific(c.nd)}</td></tr>
  <tr><td style="${cellCode}">Nm (S2)</td><td style="${cellFormula}">[Ng:${data.ng} x Am:${c.am?.toFixed(2)}] x 10⁻⁶</td><td style="${cellResult}">${formatScientific(c.nm)}</td></tr>
  <tr><td style="${cellCode}">Nl (S3)</td><td style="${cellFormula}">[Descargas diretas na rede (Elétrica + Dados)]</td><td style="${cellResult}">${formatScientific(nlTotal)}</td></tr>
  <tr><td style="${cellCode}">Ni (S4)</td><td style="${cellFormula}">[Induções laterais na rede (Elétrica + Dados)]</td><td style="${cellResult}">${formatScientific(niTotal)}</td></tr>
</table>`;

    mainContent += `
<div style="${subHeaderSection}">3.2. PROBABILIDADES DE DANO RESIDUAL (P)</div>
<table style="${tableStyle}">
  <tr><td style="${cellCode}">PA</td><td style="${cellFormula}">P<sub>TA</sub>:${prob.PTA} x P<sub>B</sub>:${prob.PB}</td><td style="${cellResult}">${formatScientific(pc.PA)}</td></tr>
  <tr><td style="${cellCode}">PB</td><td style="${cellFormula}">Eficácia SPDA (Nível ${prob.PB})</td><td style="${cellResult}">${formatScientific(pc.PB)}</td></tr>
  <tr><td style="${cellCode}">PC</td><td style="${cellFormula}">P<sub>SPD</sub>:${prob.PSPD_electric} x C<sub>LD</sub>:1,0</td><td style="${cellResult}">${formatScientific(pc.PC)}</td></tr>
  <tr><td style="${cellCode}">PM</td><td style="${cellFormula}">P<sub>SPD</sub>:${prob.PSPD_electric} x P<sub>MS</sub>:${formatScientific(pc.Pms).replace(/<\/?sup>/g, '')}</td><td style="${cellResult}">${formatScientific(pc.PM)}</td></tr>
  <tr><td style="${cellCode}">PU</td><td style="${cellFormula}">P<sub>TU</sub>:${prob.PTU_electric} x P<sub>EB</sub>:${prob.PEB_electric}</td><td style="${cellResult}">${formatScientific(pc.PU)}</td></tr>
  <tr><td style="${cellCode}">PV</td><td style="${cellFormula}">P<sub>EB</sub>:${prob.PEB_electric} x P<sub>LD</sub>:1,0</td><td style="${cellResult}">${formatScientific(pc.PV)}</td></tr>
  <tr><td style="${cellCode}">PW</td><td style="${cellFormula}">P<sub>SPD</sub>:${prob.PSPD_electric} x P<sub>LD</sub>:1,0</td><td style="${cellResult}">${formatScientific(pc.PW)}</td></tr>
  <tr><td style="${cellCode}">PZ</td><td style="${cellFormula}">P<sub>SPD</sub>:${prob.PSPD_electric} x P<sub>LI</sub>:${formatScientific(pc.Pli_electric_ext).replace(/<\/?sup>/g, '')}</td><td style="${cellResult}">${formatScientific(pc.PZ)}</td></tr>
</table>`;

    mainContent += `
<div style="${subHeaderSection}">3.3. FATORES DE PERDAS ESTIMADOS (L)</div>
<table style="${tableStyle}">
  <thead>
     <tr style="background: ${isWord ? '#f1f5f9' : 'rgba(15,23,42,0.5)'}; color: ${isWord ? '#000000' : '#60a5fa'};">
        <th style="${cellCode}">Fator</th>
        <th style="${cellFormula}">Memória de Cálculo [Equação]</th>
        <th style="${cellResult}">VALOR CIENTÍFICO</th>
     </tr>
  </thead>
  <tbody>
    <tr><td style="${cellCode}">LA / LU</td><td style="${cellFormula}">[rt:${lz.rt || 0} x lt:${lz.lt || 0.01} x (nz/nt) x (tz/8760) x rs:${rs_val}]</td><td style="${cellResult}">${formatLossScientific(LA_val)}</td></tr>
    <tr><td style="${cellCode}">LB / LV</td><td style="${cellFormula}">[rp:${lz.rp || 0} x rf:${lz.rf || 0} x hz:${lz.hz || 1} x LF:${lz.LF || 0} x ... x rs:${rs_val}]</td><td style="${cellResult}">${formatLossScientific(LB_val)}</td></tr>
    <tr><td style="${cellCode}">LC/LM/LW/LZ</td><td style="${cellFormula}">[LO:${lz.LO || 0} x (nz/nt) x (tz/8760) x rs:${rs_val}]</td><td style="${cellResult}">${formatLossScientific(LC_val)}</td></tr>
  </tbody>
</table>`;

    mainContent += `
<div style="${subHeaderSection}">3.4. MEMORIAL DE CÁLCULO DOS COMPONENTES DE RISCO (R = N x P x L)</div>
<table style="${tableStyle}">
  <thead>
    <tr style="background: ${isWord ? '#f1f5f9' : 'rgba(15,23,42,0.5)'}; color: ${isWord ? '#000000' : '#60a5fa'};">
       <th style="${cellCode}">Comp.</th>
       <th style="${cellFormula}">Equação Auditável: N x P x L [Valores Literais]</th>
       <th style="${cellResult}">Resultado</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="${cellCode}">RA</td><td style="${cellFormula}">[Nd:${formatScientific(c.nd)} x PA:${formatScientific(pc.PA)} x LA:${formatLossScientific(LA_val)}]</td><td style="${cellResult}">${formatR1(r.RA)}</td></tr>
    <tr><td style="${cellCode}">RB</td><td style="${cellFormula}">[Nd:${formatScientific(c.nd)} x PB:${formatScientific(pc.PB)} x LB:${formatLossScientific(LB_val)}]</td><td style="${cellResult}">${formatR1(r.RB)}</td></tr>
    <tr><td style="${cellCode}">RC</td><td style="${cellFormula}">[Nd:${formatScientific(c.nd)} x PC:${formatScientific(pc.PC)} x LC:${formatLossScientific(LC_val)}]</td><td style="${cellResult}">${formatR1(r.RC)}</td></tr>
    <tr><td style="${cellCode}">RM</td><td style="${cellFormula}">[Nm:${formatScientific(c.nm)} x PM:${formatScientific(pc.PM)} x LM:${formatLossScientific(LC_val)}]</td><td style="${cellResult}">${formatR1(r.RM)}</td></tr>
    <tr><td style="${cellCode}">RU</td><td style="${cellFormula}">[Nl:${formatScientific(c.nl_electric)} x PU:${formatScientific(pc.PU)} x LU:${formatLossScientific(LA_val)}]</td><td style="${cellResult}">${formatR1(r.RU)}</td></tr>
    <tr><td style="${cellCode}">RV</td><td style="${cellFormula}">[Nl:${formatScientific(c.nl_electric)} x PV:${formatScientific(pc.PV)} x LV:${formatLossScientific(LB_val)}]</td><td style="${cellResult}">${formatR1(r.RV)}</td></tr>
    <tr><td style="${cellCode}">RW</td><td style="${cellFormula}">[Nl:${formatScientific(c.nl_electric)} x PW:${formatScientific(pc.PW)} x LW:${formatLossScientific(LC_val)}]</td><td style="${cellResult}">${formatR1(r.RW)}</td></tr>
    <tr><td style="${cellCode}">RZ</td><td style="${cellFormula}">[Ni:${formatScientific(c.ni_electric)} x PZ:${formatScientific(pc.PZ)} x LZ:${formatLossScientific(LC_val)}]</td><td style="${cellResult}">${formatR1(r.RZ)}</td></tr>
  </tbody>
</table>`;

    mainContent += `
<div style="${subHeaderSection}">3.5. COMPONENTES DA FREQUÊNCIA DE DANOS (FD = N x P)</div>
<table style="${tableStyle}">
  <thead>
    <tr style="background: ${isWord ? '#f1f5f9' : 'rgba(15,23,42,0.5)'}; color: ${isWord ? '#000000' : '#60a5fa'};">
       <th style="${cellCode}">Fator</th>
       <th style="${cellFormula}">Equação Auditável: N x P [Valores Literais]</th>
       <th style="${cellResult}">Resultado</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="${cellCode}">FB</td><td style="${cellFormula}">[Nd:${formatScientific(c.nd)} x PB:${formatScientific(pc.PB)}]</td><td style="${cellResult}">${formatFD(f.FB)}</td></tr>
    <tr><td style="${cellCode}">FC</td><td style="${cellFormula}">[Nd:${formatScientific(c.nd)} x PC_comb:${formatScientific(pcTotalFreq)}]</td><td style="${cellResult}">${formatFD(f.FC)}</td></tr>
    <tr><td style="${cellCode}">FM</td><td style="${cellFormula}">[Nm:${formatScientific(c.nm)} x PM_comb:${formatScientific(pmTotalFreq)}]</td><td style="${cellResult}">${formatFD(f.FM)}</td></tr>
    <tr><td style="${cellCode}">FV</td><td style="${cellFormula}">[Nl_elétrica:${formatScientific(c.nl_electric)} x PEB] + [Nl_dados:${formatScientific(c.nl_data)} x PEB]</td><td style="${cellResult}">${formatFD(f.FV)}</td></tr>
    <tr style="background: ${isWord ? '#f1f5f9' : 'rgba(15,23,42,0.3)'};">
      <td style="${cellCode}">TOTAL</td>
      <td style="${cellFormula}; font-weight: bold;">FD TOTAL (F)</td>
      <td style="${cellResult}">${formatFD(f.F)}</td>
    </tr>
  </tbody>
</table>`;

    if (data.risks_to_analyze.R1) {
        mainContent += `
<div style="${subHeaderSection}">3.6. COMPONENTES DO RISCO À VIDA HUMANA (R1)</div>
<table style="${tableStyle}">
  <tr><td style="${cellCode}">RA</td><td style="${cellFormula}">Choque em seres vivos (Estrutura)</td><td style="${cellResult}">${formatR1(r.RA)}</td></tr>
  <tr><td style="${cellCode}">RB</td><td style="${cellFormula}">Danos físicos (Estrutura)</td><td style="${cellResult}">${formatR1(r.RB)}</td></tr>
  <tr><td style="${cellCode}">RC</td><td style="${cellFormula}">Falhas de sistemas (Estrutura)</td><td style="${cellResult}">${formatR1(r.RC)}</td></tr>
  <tr style="background: ${isWord ? '#f1f5f9' : 'rgba(15,23,42,0.3)'};">
    <td style="${cellCode}">TOTAL</td>
    <td style="${cellFormula}; font-weight: bold;">R1 TOTAL</td>
    <td style="${cellResult}">${formatR1(r.R1)}</td>
  </tr>
</table>`;
    }

    if (data.risks_to_analyze.R3) {
        mainContent += `
<div style="${subHeaderSection}">3.7. COMPONENTES DO RISCO AO PATRIMÔNIO CULTURAL (R3)</div>
<table style="${tableStyle}">
  <tr><td style="${cellCode}">RB</td><td style="${cellFormula}">Danos físicos (Estrutura)</td><td style="${cellResult}">${formatScientific(r.R3)}</td></tr>
  <tr style="background: ${isWord ? '#f1f5f9' : 'rgba(15,23,42,0.3)'};">
    <td style="${cellCode}">TOTAL</td>
    <td style="${cellFormula}; font-weight: bold;">R3 TOTAL</td>
    <td style="${cellResult}">${formatScientific(r.R3)}</td>
  </tr>
</table>`;
    }

    if (data.risks_to_analyze.R4) {
        mainContent += `
<div style="${subHeaderSection}">3.8. COMPONENTES DO RISCO ECONÔMICO (R4)</div>
<table style="${tableStyle}">
  <tr><td style="${cellCode}">RA</td><td style="${cellFormula}">Choque seres vivos</td><td style="${cellResult}">${formatScientific(r.R4)}</td></tr>
  <tr style="background: ${isWord ? '#f1f5f9' : 'rgba(15,23,42,0.3)'};">
    <td style="${cellCode}">TOTAL</td>
    <td style="${cellFormula}; font-weight: bold;">R4 TOTAL</td>
    <td style="${cellResult}">${formatScientific(r.R4)}</td>
  </tr>
</table>`;
    }

    return mainContent;
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
                : `à **presença do ${cleanLabel(getOptionLabel(PB_OPTIONS, pbValue))}**`;
                
            const dpsText = pspdValue === 1 
                ? "e à **ausência de MPS (DPS)**" 
                : `e à **presença das MPS (${cleanLabel(getOptionLabel(PSPD_OPTIONS, pspdValue))}) PEB e PSPD**`;

            opinion = `A edificação encontra-se **PROTEGIDA**. A conformidade está vinculada ${spdaText} ${dpsText}, conforme parâmetros detalhados nas tabelas de premissas por zona.`;
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
  <tr style="background: ${isWord ? '#f1f5f9' : 'rgba(251,191,36,0.08)'}; border-bottom: 2px solid ${isWord ? '#1e3a8a' : '#fbbf24'};">
    <td colspan="4" style="padding: 16px 14px; font-weight: 900; color: ${isWord ? '#1e3a8a' : '#fbbf24'}; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; border-left: 5px solid ${isWord ? '#1e3a8a' : '#fbbf24'};">${title}</td>
  </tr>
  <tr style="background: ${isWord ? '#f1f5f9' : 'rgba(15,23,42,0.5)'}; color: ${isWord ? '#1e3a8a' : '#60a5fa'};">
    <th style="padding: 6px; border: 1px solid ${isWord ? 'black' : 'rgba(248,250,252,0.1)'}; text-align: left; width: 45%;">Parâmetro Analisado</th>
    <th style="padding: 6px; border: 1px solid ${isWord ? 'black' : 'rgba(248,250,252,0.1)'}; text-align: center; width: 20%;">Calculado</th>
    <th style="padding: 6px; border: 1px solid ${isWord ? 'black' : 'rgba(248,250,252,0.1)'}; text-align: center; width: 20%;">Tolerável</th>
    <th style="padding: 6px; border: 1px solid ${isWord ? 'black' : 'rgba(248,250,252,0.1)'}; text-align: center; width: 15%;">Status</th>
  </tr>
  <tr>
    <td style="padding: 6px; border: 1px solid ${isWord ? 'black' : 'rgba(248,250,252,0.1)'}; color: ${isWord ? 'black' : '#f8fafc'};">Risco à Vida Humana (R1)</td>
    <td colspan="2" style="padding: 6px; border: 1px solid ${isWord ? 'black' : 'rgba(248,250,252,0.1)'}; text-align: center; color: ${isWord ? 'black' : '#f8fafc'}; font-family: monospace;"><b>${formatR1(r.R1)} ${r1Ok ? '≤' : '>'} 1,00 x 10⁻⁵</b></td>
    <td style="padding: 6px; border: 1px solid ${isWord ? 'black' : 'rgba(248,250,252,0.1)'}; text-align: center; color: ${r1Ok ? '#059669' : '#dc2626'}; font-weight: bold;">${r1Ok ? 'CONFORME' : 'CRÍTICO'}</td>
  </tr>
  <tr>
    <td style="padding: 6px; border: 1px solid ${isWord ? 'black' : 'rgba(248,250,252,0.1)'}; color: ${isWord ? 'black' : '#f8fafc'};">Frequência de Danos (FD)</td>
    <td colspan="2" style="padding: 6px; border: 1px solid ${isWord ? 'black' : 'rgba(248,250,252,0.1)'}; text-align: center; color: ${isWord ? 'black' : '#f8fafc'}; font-family: monospace;"><b>${formatFD(f.F)} ${fOk ? '≤' : '>'} ${formatFD(fdLimitVal)}</b></td>
    <td style="padding: 6px; border: 1px solid ${isWord ? 'black' : 'rgba(248,250,252,0.1)'}; text-align: center; color: ${fOk ? '#059669' : '#dc2626'}; font-weight: bold;">${fOk ? 'CONFORME' : 'CRÍTICO'}</td>
  </tr>
</table>`;
    };

    const buildStatusChart = (title: string, value: number, limit: number, type: 'R1'|'FD') => {
        if (isWord) return '';

        const formatter = type === 'R1' ? formatR1 : formatFD;
        const limitStr = type === 'R1' ? '1,00 x 10⁻⁵' : formatFD(limit);
        const isSafe = value <= limit;

        const percent = Math.min(100, (value / limit) * 100);
        const color = isSafe ? "#10b981" : "#ef4444";
        
        const svg = `<svg width="400" height="70" viewBox="0 0 400 70" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="70" fill="rgba(248,250,252,0.8)" rx="8"/>
            <text x="12" y="20" font-family="Arial" font-size="11" font-weight="900" fill="#334155">${title}</text>
            <rect x="12" y="32" width="376" height="10" fill="#e2e8f0" rx="5"/>
            <rect x="12" y="32" width="${(percent * 3.76).toFixed(0)}" height="10" fill="${color}" rx="5"/>
            <text x="12" y="58" font-family="Arial" font-size="10" font-weight="bold" fill="#1e293b">${formatter(value).replace(/<\/?sup>/g, '')} ${isSafe ? '≤' : '>'} ${limitStr.replace(/<\/?sup>/g, '')} [${isSafe ? 'CONFORME' : 'CRÍTICO'}]</text>
            <circle cx="${(percent * 3.76 + 12).toFixed(0)}" cy="37" r="4" fill="white" stroke="${color}" stroke-width="3"/>
        </svg>`.trim();
        const base64 = typeof window !== 'undefined' ? window.btoa(unescape(encodeURIComponent(svg))) : Buffer.from(svg).toString('base64');
        return `data:image/svg+xml;base64,${base64}`;
    };

    const riskChart = isWord ? '_[Gráficos omitidos para maior compatibilidade com Word. Consulte os dados na tabela de conformidade no final do relatório.]_' : `![Gráfico de Risco R1](${buildStatusChart("SISTEMA 01: RISCO À VIDA HUMANA (R1)", r.R1 || 0, 1e-5, 'R1')})`;
    const freqChart = isWord ? '' : `![Gráfico de Frequência FD](${buildStatusChart("SISTEMA 02: FREQUÊNCIA DE DANOS (FD)", f.F || 0, fdLimit, 'FD')})`;

    // Gera tabelas de fatores para todas as zonas
    const factorsTables = data.zones.map((_, idx) => buildFactorsTable(data, isWord, idx)).join('\n\n');

    return `
# <span style="color: ${isWord ? '#000000' : '#ffffff'};">RELATÓRIO TÉCNICO:</span>
# <span style="color: ${isWord ? '#000000' : '#fbbf24'};">ANÁLISE DE RISCO PDA (NBR 5419-2 2026)</span>

## 🏛️ <span style="color: ${isWord ? '#000000' : '#fbbf24'};">1. IDENTIFICAÇÃO E DADOS GERAIS</span>
<div style="background: ${isWord ? '#f1f5f9' : 'rgba(30,41,59,0.5)'}; border: 1px solid ${isWord ? '#000000' : 'rgba(148,163,184,0.2)'}; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
<table style="width:100%; border-collapse: collapse; font-size: 11.5px; table-layout: auto;">
  <tr><td style="padding: 6px 12px; width: 26%; color: ${isWord ? '#000000' : '#94a3b8'}; vertical-align: top;"><b>CLIENTE:</b></td><td style="padding: 6px 12px; border-bottom: 1px solid ${isWord ? '#000000' : 'rgba(148,163,184,0.1)'}; color: ${isWord ? '#000000' : '#f8fafc'};">${data.clientName || 'N/A'}</td></tr>
  <tr><td style="padding: 6px 12px; color: ${isWord ? '#000000' : '#94a3b8'}; vertical-align: top;"><b>RESPONSÁVEL:</b></td><td style="padding: 6px 12px; border-bottom: 1px solid ${isWord ? '#000000' : 'rgba(148,163,184,0.1)'}; color: ${isWord ? '#000000' : '#f8fafc'};">Engº ${data.technicalManagerName || 'N/A'}</td></tr>
  <tr><td style="padding: 6px 12px; color: ${isWord ? '#000000' : '#94a3b8'}; vertical-align: top;"><b>LOCALIDADE:</b></td><td style="padding: 6px 12px; border-bottom: 1px solid ${isWord ? '#000000' : 'rgba(148,163,184,0.1)'}; color: ${isWord ? '#000000' : '#f8fafc'};">${data.location || 'Brasil'}</td></tr>
  <tr><td style="padding: 6px 12px; color: ${isWord ? '#000000' : '#94a3b8'}; vertical-align: top;"><b>DATA EMISSÃO:</b></td><td style="padding: 6px 12px; color: ${isWord ? '#000000' : '#f8fafc'};">${formatDateBR(data.projectDate)}</td></tr>
</table>
</div>

## 📊 <span style="color: ${isWord ? '#1e3a8a' : '#fbbf24'};">2. ENTRADA DE DADOS E PREMISSAS NORMATIVAS</span>
${buildVariablesTable(data, isWord)}

${factorsTables}

## 📐 <span style="color: ${isWord ? '#1e3a8a' : '#fbbf24'};">3. MEMORIAL DE CÁLCULO</span>
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
