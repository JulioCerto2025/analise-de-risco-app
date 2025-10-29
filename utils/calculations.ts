import { AnalysisData, CalculationResults, ProbabilityData, Zone, ZoneCalculations } from '../types';

export function calculateEvents(data: Pick<AnalysisData, 
    'h' | 'l' | 'w' | 'hp' | 'ng' | 'cd' | 
    'has_electric_line' | 'line_sections_1' | 'use_adj_structure_1' | 'l_adj_1' | 'w_adj_1' | 'h_adj_1' | 'hp_adj_1' | 'cd_adj_1' |
    'has_data_line' | 'line_sections_2' | 'use_adj_structure_2' | 'l_adj_2' | 'w_adj_2' | 'h_adj_2' | 'hp_adj_2' | 'cd_adj_2' 
>): CalculationResults {
    const { 
        h, l, w, hp, ng, cd, 
        has_electric_line, line_sections_1, use_adj_structure_1, l_adj_1, w_adj_1, h_adj_1, hp_adj_1, cd_adj_1,
        has_data_line, line_sections_2, use_adj_structure_2, l_adj_2, w_adj_2, h_adj_2, hp_adj_2, cd_adj_2 
    } = data;
    
    // Main structure calculations
    const h3 = 3 * h;
    const ad = (l * w) + (2 * h3 * (l + w)) + (Math.PI * h3 * h3);
    const hp3 = 3 * hp;
    const adp = Math.PI * hp3 * hp3;
    const adf = Math.max(ad, adp);
    const am = (2 * 500 * (l + w)) + (Math.PI * 500 * 500);
        
    // Main events
    const nd = ng > 0 ? ng * adf * cd * 1e-6 : 0;
    const nm = ng > 0 ? ng * am * 1e-6 : 0;

    // Line 1 (Electric) Calculations from sections
    let al1_total = 0;
    let ai1_total = 0;
    let nl1_base = 0;
    let ni1_base = 0;

    if (has_electric_line) {
        line_sections_1.forEach(section => {
            const { ll, ci, ce, ct } = section;
            const al_section = 40 * ll;
            const ai_section = 4000 * ll;
            al1_total += al_section;
            ai1_total += ai_section;
            nl1_base += ng > 0 ? ng * al_section * ci * ce * ct * 1e-6 : 0;
            ni1_base += ng > 0 ? ng * ai_section * ci * ce * ct * 1e-6 : 0;
        });
    }

    // Line 2 (Data) Calculations from sections
    let al2_total = 0;
    let ai2_total = 0;
    let nl2_base = 0;
    let ni2_base = 0;

    if (has_data_line) {
        line_sections_2.forEach(section => {
            const { ll, ci, ce, ct } = section;
            const al_section = 40 * ll;
            const ai_section = 4000 * ll;
            al2_total += al_section;
            ai2_total += ai_section;
            nl2_base += ng > 0 ? ng * al_section * ci * ce * ct * 1e-6 : 0;
            ni2_base += ng > 0 ? ng * ai_section * ci * ce * ct * 1e-6 : 0;
        });
    }

    // Adjacent structure calculations
    let nadj_electric = 0;
    let ad_adj_1 = 0;
    if (use_adj_structure_1 && ng > 0 && has_electric_line) {
        const h3_adj = 3 * h_adj_1;
        const ad_adj = (l_adj_1 * w_adj_1) + (2 * h3_adj * (l_adj_1 + w_adj_1)) + (Math.PI * h3_adj * h3_adj);
        const hp3_adj = 3 * hp_adj_1;
        const adp_adj = Math.PI * hp3_adj * hp3_adj;
        ad_adj_1 = Math.max(ad_adj, adp_adj);
        
        // Direct flash contribution to Nl (S3)
        nadj_electric = ng * ad_adj_1 * cd_adj_1 * 1e-6;
    }

    let nadj_data = 0;
    let ad_adj_2 = 0;
    if (use_adj_structure_2 && ng > 0 && has_data_line) {
        const h3_adj = 3 * h_adj_2;
        const ad_adj = (l_adj_2 * w_adj_2) + (2 * h3_adj * (l_adj_2 + w_adj_2)) + (Math.PI * h3_adj * h3_adj);
        const hp3_adj = 3 * hp_adj_2;
        const adp_adj = Math.PI * hp3_adj * hp3_adj;
        ad_adj_2 = Math.max(ad_adj, adp_adj);

        // Direct flash contribution to Nl (S3)
        nadj_data = ng * ad_adj_2 * cd_adj_2 * 1e-6;
    }
    
    return {
        ad, adp, adf, am,
        al1: al1_total, al2: al2_total, 
        ai1: ai1_total, ai2: ai2_total,
        nd, nm,
        nl_electric: nl1_base + nadj_electric,
        nl_data: nl2_base + nadj_data,
        ni_electric: ni1_base, // Per correction, nim_adj is removed
        ni_data: ni2_base,   // Per correction, nim_adj is removed
        nadj_electric, nadj_data,
        ad_adj_1, ad_adj_2
    };
}

/**
 * Calculates the PLI value based on Tabela B.9 from NBR 5419-2.
 * @param lineType The type of line, either 'electric' or 'data'.
 * @param uw Nominal impulse withstand voltage in kV.
 * @returns The calculated PLI value.
 */
function calculatePli(lineType: 'electric' | 'data', uw: number): number {
    const uwValue = Number(uw);

    // According to Table B.9, for Uw=1kV, PLI is 1. It is assumed that for any Uw <= 1kV, the probability is 1.
    if (uwValue <= 1.0) {
        return 1.0;
    }

    if (lineType === 'electric') { // Linhas elétricas de energia
        if (uwValue === 1.5) return 0.6;
        if (uwValue === 2.5) return 0.3;
        if (uwValue === 4.0) return 0.16;
        if (uwValue === 6.0) return 0.1;
    } else { // Linhas elétricas de sinais (data)
        if (uwValue === 1.5) return 0.5;
        if (uwValue === 2.5) return 0.2;
        if (uwValue === 4.0) return 0.08;
        if (uwValue === 6.0) return 0.04;
    }

    // Fallback for values not in the table (should not happen with dropdowns)
    // Return 1 as the highest probability (worst case).
    return 1.0;
}


export function calculateProbabilities(probData: ProbabilityData, analyzeDataLineProbs: boolean, has_data_line: boolean): { [key: string]: number } {
    const p = probData;

    // Fatores derivados
    const Ks1 = Math.min(1, (p.wm1 || 0) * 0.12);
    const Ks2 = Math.min(1, (p.wm2 || 0) * 0.12);
    const Ks4_electric = p.Uw_electric > 0 ? 1 / p.Uw_electric : 1;
    
    // Probabilidades - Estrutura e Linha Elétrica
    const PA = p.PTA * p.PB;
    const PC = p.PSPD_electric * p.CLD_electric;
    const Pms = Math.pow(Ks1 * Ks2 * p.Ks3_electric * Ks4_electric, 2);
    const PM = p.PSPD_electric * Pms;
    const PU = p.PTU_electric * p.PEB_electric * p.PLD_electric * p.CLD_electric;
    const PV = p.PEB_electric * p.PLD_electric * p.CLD_electric;
    const PW = p.PSPD_electric * p.PLD_electric * p.CLD_electric;
    const Pli_electric = calculatePli('electric', p.Uw_electric);
    const PZ = p.PSPD_electric * p.CLI_electric * Pli_electric; 

    // Probabilidades - Linha de Dados
    const Ks4_data = p.Uw_data > 0 ? 1 / p.Uw_data : 1;
    const Pli_data = calculatePli('data', p.Uw_data);
    
    let PUT = 0, PVT = 0, PWT = 0, PZT = 0;
    let PCT = 0, Pmst = 0, PMT = 0;

    if (has_data_line) {
        PUT = p.PTU_data * p.PEB_data * p.PLD_data * p.CLD_data;
        PVT = p.PEB_data * p.PLD_data * p.CLD_data;
        PWT = p.PSPD_data * p.PLD_data * p.CLD_data;
        PZT = p.PSPD_data * p.CLI_data * Pli_data;

        // These probabilities relate to the failure of INTERNAL systems.
        // They are only calculated if the user wants to analyze the internal data line.
        if (analyzeDataLineProbs) {
            PCT = p.PSPD_data * p.CLD_data;
            Pmst = Math.pow(Ks1 * Ks2 * p.Ks3_data * Ks4_data, 2);
            PMT = p.PSPD_data * Pmst;
        }
    }
    
    return { 
        PA, PB: p.PB, PC, PCT, Pms, Pmst, PM, PMT, PU, PUT, PV, PVT, PW, PWT, PZ, PZT, 
        Ks1, Ks2, Ks4_electric, Ks4_data, Pli_electric, Pli_data,
        PEB_electric: p.PEB_electric, PEB_data: p.PEB_data // Pass through for Frequency calculation
    };
}

export function calculateLossesForZone(zone: Zone): { [key: string]: any } {
    const losses: { [key: string]: any } = {};
    const ld = zone.loss_data;
    const LT_CONSTANT = 0.01; // LT is a constant for injuries

    if (!ld) return {};
    
    // R1 Losses
    const nt_r1 = Number(ld.nt) || 1;
    const factor_r1 = (Number(ld.nz) / nt_r1) * (Number(ld.tz) / 8760);
    losses.LA = (ld.rt ?? 0) * LT_CONSTANT * factor_r1 * (ld.rs ?? 1); // Corrected: rs added
    losses.LB = (ld.rs ?? 1) * (ld.rp ?? 0) * (ld.rf ?? 0) * (ld.hz ?? 0) * (ld.LF ?? 0) * factor_r1;
    losses.LC = (ld.LO ?? 0) * factor_r1 * (ld.rs ?? 1); // Corrected: rs added
    losses.LU = losses.LA;
    losses.LV = losses.LB;
    losses.LM = losses.LC;
    losses.LW = losses.LC;
    losses.LZ = losses.LC;

    // R3 Losses
    const ct_cultural = Number(ld.ct_cultural) || 1;
    losses.LB3 = (ld.rp ?? 0) * (ld.rf ?? 0) * (ld.lf3 ?? 0) * ((ld.cz ?? 0) / ct_cultural); // Corrected: rs removed
    losses.LV3 = losses.LB3;

    // R4 Losses
    const ct_economic = Number(ld.ct_economic) || 1;
    losses.LA4 = (ld.rt ?? 0) * (ld.lt4 ?? 0) * ((ld.ca ?? 0) / ct_economic);
    const economic_sum = (ld.ca ?? 0) + (ld.cb ?? 0) + (ld.cc ?? 0) + (ld.cs ?? 0);
    losses.LB4 = (ld.rs ?? 1) * (ld.rp ?? 0) * (ld.rf ?? 0) * (ld.lf4 ?? 0) * (economic_sum / ct_economic);
    losses.LC4 = (ld.lo4 ?? 0) * ((ld.cs ?? 0) / ct_economic);
    const le4 = 0; // Lfe4 * (ce / ct) - ce is usually 0
    losses.LFT4 = (ld.lf4 ?? 0) + le4; // Used in some versions
    
    losses.LU4 = losses.LA4;
    losses.LV4 = losses.LB4;
    losses.LM4 = losses.LC4;
    losses.LW4 = losses.LC4;
    losses.LZ4 = losses.LC4;

    return losses;
}


export function calculateRisksForZone(
    eventCalcs: Partial<CalculationResults>, 
    probCalcs: { [key: string]: number }, 
    lossCalcs: { [key: string]: any },
    selected: AnalysisData['selected_risk_components']
): { [key: string]: number } {
    const { nd=0, nm=0, nl_electric=0, nl_data=0, ni_electric=0, ni_data=0 } = eventCalcs;
    const p = probCalcs;
    const l = lossCalcs;

    // R1 Components
    const RA = nd * (p.PA || 0) * (l.LA || 0);
    const RB = nd * (p.PB || 0) * (l.LB || 0);
    const RC = nd * (p.PC || 0) * (l.LC || 0);
    const RM = nm * (p.PM || 0) * (l.LM || 0);
    const RU = nl_electric * (p.PU || 0) * (l.LU || 0);
    const RUT = nl_data * (p.PUT || 0) * (l.LU || 0);
    const RV = nl_electric * (p.PV || 0) * (l.LV || 0);
    const RVT = nl_data * (p.PVT || 0) * (l.LV || 0);
    const RW = nl_electric * (p.PW || 0) * (l.LW || 0);
    const RWT = nl_data * (p.PWT || 0) * (l.LW || 0);
    const RZ = ni_electric * (p.PZ || 0) * (l.LZ || 0);
    const RZT = ni_data * (p.PZT || 0) * (l.LZ || 0);

    // R3 Components
    const RB3 = nd * (p.PB || 0) * (l.LB3 || 0);
    const RV3 = nl_electric * (p.PV || 0) * (l.LV3 || 0);
    const RVT3 = nl_data * (p.PVT || 0) * (l.LV3 || 0);
    
    // R4 Components
    const RA4 = nd * (p.PA || 0) * (l.LA4 || 0);
    const RB4 = nd * (p.PB || 0) * (l.LB4 || 0);
    const RC4 = nd * (p.PC || 0) * (l.LC4 || 0);
    const RM4 = nm * (p.PM || 0) * (l.LM4 || 0);
    const RU4 = nl_electric * (p.PU || 0) * (l.LU4 || 0);
    const RUT4 = nl_data * (p.PUT || 0) * (l.LU4 || 0);
    const RV4 = nl_electric * (p.PV || 0) * (l.LV4 || 0);
    const RVT4 = nl_data * (p.PVT || 0) * (l.LV4 || 0);
    const RW4 = nl_electric * (p.PW || 0) * (l.LW4 || 0);
    const RWT4 = nl_data * (p.PWT || 0) * (l.LW4 || 0);
    const RZ4 = ni_electric * (p.PZ || 0) * (l.LZ4 || 0);
    const RZT4 = ni_data * (p.PZT || 0) * (l.LZ4 || 0);

    const R1 = (selected.RA ? RA : 0) + (selected.RB ? RB : 0) + (selected.RC ? RC : 0) + (selected.RM ? RM : 0) +
               (selected.RU ? (RU + RUT) : 0) + (selected.RV ? (RV + RVT) : 0) +
               (selected.RW ? (RW + RWT) : 0) + (selected.RZ ? (RZ + RZT) : 0);
               
    const R3 = (selected.RB ? RB3 : 0) + (selected.RV ? (RV3 + RVT3) : 0);
    
    const R4 = (selected.RA ? RA4 : 0) + (selected.RB ? RB4 : 0) + (selected.RC ? RC4 : 0) + (selected.RM ? RM4 : 0) +
               (selected.RU ? (RU4 + RUT4) : 0) + (selected.RV ? (RV4 + RVT4) : 0) +
               (selected.RW ? (RW4 + RWT4) : 0) + (selected.RZ ? (RZ4 + RZT4) : 0);
    
    return { 
      RA, RB, RC, RM, RU, RUT, RV, RVT, RW, RWT, RZ, RZT,
      RB3, RV3, RVT3,
      RA4, RB4, RC4, RM4, RU4, RUT4, RV4, RVT4, RW4, RWT4, RZ4, RZT4,
      R1, R3, R4 
    };
}

export function aggregateRiskResults(zoneCalculations: ZoneCalculations[]): { [key: string]: number } {
    const totalRiskResults: { [key: string]: number } = {};
    
    zoneCalculations.forEach(({ riskCalculations }) => {
        for (const key in riskCalculations) {
            if (Object.prototype.hasOwnProperty.call(riskCalculations, key)) {
                totalRiskResults[key] = (totalRiskResults[key] || 0) + riskCalculations[key];
            }
        }
    });

    return totalRiskResults;
}


export function calculateFrequencies(
    eventCalcs: Partial<CalculationResults>,
    probCalcs: { [key: string]: number },
    freqConfig: AnalysisData['frequency_config'],
    has_electric_line: boolean,
    has_data_line: boolean
): { [key: string]: number } {
    const ND = eventCalcs.nd || 0;
    const NM = eventCalcs.nm || 0;
    const NLe = (eventCalcs.nl_electric || 0);
    const NLd = (eventCalcs.nl_data || 0);
    const NIe = eventCalcs.ni_electric || 0;
    const NId = eventCalcs.ni_data || 0;
    const p = probCalcs;
    
    let PC_total;
    let PM_total;

    const numSystems = (has_electric_line ? 1 : 0) + (has_data_line ? 1 : 0);

    if (numSystems > 1) {
        // More than one system (e.g., electric and data lines), apply combination formula.
        PC_total = 1 - ((1 - (p.PC || 0)) * (1 - (p.PCT || 0)));
        PM_total = 1 - ((1 - (p.PM || 0)) * (1 - (p.PMT || 0)));
    } else if (has_electric_line) {
        // Only electric line.
        PC_total = p.PC || 0;
        PM_total = p.PM || 0;
    } else if (has_data_line) {
        // Only data line.
        PC_total = p.PCT || 0;
        PM_total = p.PMT || 0;
    } else {
        // No internal systems considered for this component.
        PC_total = 0;
        PM_total = 0;
    }

    const FB = freqConfig.has_equipment_in_ZPR0A ? (ND * (p.PB || 0)) : 0;
    const FC = ND * PC_total;
    const FM = NM * PM_total;
    const FV = NLe * (p.PEB_electric || 0) + NLd * (p.PEB_data || 0);
    const FW = NLe * (p.PW || 0) + NLd * (p.PWT || 0);
    const FZ = NIe * (p.PZ || 0) + NId * (p.PZT || 0);
    
    const F = FB + FC + FM + FV + FW + FZ;

    return { F, FB, FC, FM, FV, FW, FZ };
}

/**
 * Calculates the PLD value based on Tabela B.8 from NBR 5419-2.
 * @param rs Shield resistance in Ω/km.
 * @param uw Nominal impulse withstand voltage in kV.
 * @param isShielded Whether the line is shielded or not.
 * @returns The calculated PLD value.
 */
export function calculatePld(rs: number, uw: number, isShielded: boolean): number {
    if (!isShielded) {
        return 1.0; // "Linha... não blindada..."
    }

    const numericUw = Number(uw);

    // Faixa de resistência: Rs ≤ 1 Ω/km
    if (rs <= 1) {
        if (numericUw === 6.0) return 0.02;
        if (numericUw === 4.0) return 0.04;
        if (numericUw === 2.5) return 0.2;
        if (numericUw === 1.5) return 0.4;
        if (numericUw === 1.0) return 0.6;
        if (numericUw === 0.5) return 0.85;
        if (numericUw === 0.35) return 1.0;
        return 1.0;
    }

    // Faixa de resistência: 1 < Rs ≤ 5 Ω/km
    if (rs > 1 && rs <= 5) {
        if (numericUw === 6.0) return 0.1;
        if (numericUw === 4.0) return 0.3;
        if (numericUw === 2.5) return 0.6;
        if (numericUw === 1.5) return 0.8;
        if (numericUw === 1.0) return 0.9;
        if (numericUw === 0.5) return 1.0;
        if (numericUw === 0.35) return 1.0;
        return 1.0;
    }

    // Faixa de resistência: 5 < Rs ≤ 20 Ω/km
    if (rs > 5 && rs <= 20) {
        if (numericUw === 6.0) return 0.8;
        if (numericUw === 4.0) return 0.9;
        if (numericUw === 2.5) return 0.95;
        if (numericUw === 1.5) return 1.0;
        if (numericUw === 1.0) return 1.0;
        if (numericUw === 0.5) return 1.0;
        if (numericUw === 0.35) return 1.0;
        return 1.0;
    }

    // Para Rs > 20, o valor é sempre 1.0.
    return 1.0;
}