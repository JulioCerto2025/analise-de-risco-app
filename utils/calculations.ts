import { AnalysisData, CalculationResults, ProbabilityData, Zone, ZoneCalculations } from '../types';

export function calculateEvents(data: Pick<AnalysisData, 
    'h' | 'l' | 'w' | 'hp' | 'ng' | 'cd' | 
    'has_electric_line' | 'line_sections_1' | 'use_adj_structure_1' | 'l_adj_1' | 'w_adj_1' | 'h_adj_1' | 'hp_adj_1' | 'cd_adj_1' |
    'has_data_line' | 'line_sections_2' | 'use_adj_structure_2' | 'l_adj_2' | 'w_adj_2' | 'h_adj_2' | 'hp_adj_2' | 'cd_adj_2' 
>): CalculationResults {
    const { 
        h = 0, l = 0, w = 0, hp = 0, ng = 0, cd = 0, 
        has_electric_line = false, line_sections_1 = [], use_adj_structure_1 = false, 
        l_adj_1 = 0, w_adj_1 = 0, h_adj_1 = 0, hp_adj_1 = 0, cd_adj_1 = 0,
        has_data_line = false, line_sections_2 = [], use_adj_structure_2 = false, 
        l_adj_2 = 0, w_adj_2 = 0, h_adj_2 = 0, hp_adj_2 = 0, cd_adj_2 = 0 
    } = data;
    
    // Validação para evitar NaN
    const safeH = Number(h) || 0;
    const safeL = Number(l) || 0;
    const safeW = Number(w) || 0;
    const safeHp = Number(hp) || 0;
    const safeNg = Number(ng) || 0;
    const safeCd = Number(cd) || 0;
    
    // Main structure calculations
    const h3 = 3 * safeH;
    const ad = (safeL * safeW) + (2 * h3 * (safeL + safeW)) + (Math.PI * h3 * h3);
    const hp3 = 3 * safeHp;
    const adp = Math.PI * hp3 * hp3;
    const adf = Math.max(ad, adp);
    const am = (2 * 500 * (safeL + safeW)) + (Math.PI * 500 * 500);
        
    // Main events
    const nd = safeNg > 0 ? safeNg * adf * safeCd * 1e-6 : 0;
    const nm = safeNg > 0 ? safeNg * am * 1e-6 : 0;

    // Line 1 (Electric) Calculations from sections
    let al1_total = 0;
    let ai1_total = 0;
    let nl1_base = 0;
    let ni1_base = 0;

    if (has_electric_line && Array.isArray(line_sections_1)) {
        line_sections_1.forEach(section => {
            if (!section) return;
            const ll = Number(section.ll) || 0;
            const ci = Number(section.ci) || 0;
            const ce = Number(section.ce) || 0;
            const ct = Number(section.ct) || 0;
            
            const al_section = 40 * ll;
            const ai_section = 4000 * ll;
            al1_total += al_section;
            ai1_total += ai_section;
            nl1_base += safeNg > 0 ? safeNg * al_section * ci * ce * ct * 1e-6 : 0;
            ni1_base += safeNg > 0 ? safeNg * ai_section * ci * ce * ct * 1e-6 : 0;
        });
    }

    // Line 2 (Data) Calculations from sections
    let al2_total = 0;
    let ai2_total = 0;
    let nl2_base = 0;
    let ni2_base = 0;

    if (has_data_line && Array.isArray(line_sections_2)) {
        line_sections_2.forEach(section => {
            if (!section) return;
            const ll = Number(section.ll) || 0;
            const ci = Number(section.ci) || 0;
            const ce = Number(section.ce) || 0;
            const ct = Number(section.ct) || 0;
            
            const al_section = 40 * ll;
            const ai_section = 4000 * ll;
            al2_total += al_section;
            ai2_total += ai_section;
            nl2_base += safeNg > 0 ? safeNg * al_section * ci * ce * ct * 1e-6 : 0;
            ni2_base += safeNg > 0 ? safeNg * ai_section * ci * ce * ct * 1e-6 : 0;
        });
    }

    // Adjacent structure calculations
    let nadj_electric = 0;
    let ad_adj_1 = 0;
    if (use_adj_structure_1 && safeNg > 0 && has_electric_line) {
        const safeL_adj_1 = Number(l_adj_1) || 0;
        const safeW_adj_1 = Number(w_adj_1) || 0;
        const safeH_adj_1 = Number(h_adj_1) || 0;
        const safeHp_adj_1 = Number(hp_adj_1) || 0;
        const safeCd_adj_1 = Number(cd_adj_1) || 0;
        
        const h3_adj = 3 * safeH_adj_1;
        const ad_adj = (safeL_adj_1 * safeW_adj_1) + (2 * h3_adj * (safeL_adj_1 + safeW_adj_1)) + (Math.PI * h3_adj * h3_adj);
        const hp3_adj = 3 * safeHp_adj_1;
        const adp_adj = Math.PI * hp3_adj * hp3_adj;
        ad_adj_1 = Math.max(ad_adj, adp_adj);
        
        // Direct flash contribution to Nl (S3)
        nadj_electric = safeNg * ad_adj_1 * safeCd_adj_1 * 1e-6;
    }

    let nadj_data = 0;
    let ad_adj_2 = 0;
    if (use_adj_structure_2 && safeNg > 0 && has_data_line) {
        const safeL_adj_2 = Number(l_adj_2) || 0;
        const safeW_adj_2 = Number(w_adj_2) || 0;
        const safeH_adj_2 = Number(h_adj_2) || 0;
        const safeHp_adj_2 = Number(hp_adj_2) || 0;
        const safeCd_adj_2 = Number(cd_adj_2) || 0;
        
        const h3_adj = 3 * safeH_adj_2;
        const ad_adj = (safeL_adj_2 * safeW_adj_2) + (2 * h3_adj * (safeL_adj_2 + safeW_adj_2)) + (Math.PI * h3_adj * h3_adj);
        const hp3_adj = 3 * safeHp_adj_2;
        const adp_adj = Math.PI * hp3_adj * hp3_adj;
        ad_adj_2 = Math.max(ad_adj, adp_adj);

        // Direct flash contribution to Nl (S3)
        nadj_data = safeNg * ad_adj_2 * safeCd_adj_2 * 1e-6;
    }
    
    // Ensure all values are numbers and not NaN
    const safeReturn = {
        ad: Number(ad) || 0, 
        adp: Number(adp) || 0, 
        adf: Number(adf) || 0, 
        am: Number(am) || 0,
        al1: Number(al1_total) || 0, 
        al2: Number(al2_total) || 0, 
        ai1: Number(ai1_total) || 0, 
        ai2: Number(ai2_total) || 0,
        nd: Number(nd) || 0, 
        nm: Number(nm) || 0,
        nl_electric: Number(nl1_base + nadj_electric) || 0,
        nl_data: Number(nl2_base + nadj_data) || 0,
        ni_electric: Number(ni1_base) || 0, // Per correction, nim_adj is removed
        ni_data: Number(ni2_base) || 0,   // Per correction, nim_adj is removed
        nadj_electric: Number(nadj_electric) || 0, 
        nadj_data: Number(nadj_data) || 0,
        ad_adj_1: Number(ad_adj_1) || 0, 
        ad_adj_2: Number(ad_adj_2) || 0
    };
    
    return safeReturn;
}

/**
 * Calculates the PLI value based on Tabela B.9 from NBR 5419-2.
 * @param lineType The type of line, either 'electric' or 'data'.
 * @param uw Nominal impulse withstand voltage in kV.
 * @returns The calculated PLI value.
 */
export function calculatePli(lineType: 'electric' | 'data', uw: number): number {
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


export function calculateProbabilities(
    probData: ProbabilityData,
    analyzeDataLineProbs: boolean,
    has_data_line: boolean,
    analyzeElectricLineProbs: boolean = true
): { [key: string]: number } {
    const p: Partial<ProbabilityData> = probData || {};

    // Garantir que todos os valores sejam números válidos
    const safeValues = {
        wm1: Number(p.wm1) || 0,
        wm2: Number(p.wm2) || 0,
        PTA: Number(p.PTA) || 0,
        PB: Number(p.PB) || 0,
        // Elétrica - compartilhados
        PSPD_electric: Number(p.PSPD_electric) || 0,
        PTU_electric: Number(p.PTU_electric) || 0,
        PEB_electric: Number(p.PEB_electric) || 0,
        // Elétrica - externa
        Uw_electric_ext: Number(p.Uw_electric_ext) || 1,
        PLD_electric_ext: Number(p.PLD_electric_ext) || 0,
        CLD_electric_ext: Number(p.CLD_electric_ext) || 0,
        CLI_electric_ext: Number(p.CLI_electric_ext) || 0,
        // Elétrica - interna
        Uw_electric_int: Number(p.Uw_electric_int) || 1,
        Ks3_electric_int: Number(p.Ks3_electric_int) || 0,
        CLD_electric_int: Number(p.CLD_electric_int) || 0,
        // Dados - compartilhados
        PSPD_data: Number(p.PSPD_data) || 0,
        PTU_data: Number(p.PTU_data) || 0,
        PEB_data: Number(p.PEB_data) || 0,
        // Dados - externa
        Uw_data_ext: Number(p.Uw_data_ext) || 1,
        PLD_data_ext: Number(p.PLD_data_ext) || 0,
        CLD_data_ext: Number(p.CLD_data_ext) || 0,
        CLI_data_ext: Number(p.CLI_data_ext) || 0,
        // Dados - interna
        Uw_data_int: Number(p.Uw_data_int) || 1,
        Ks3_data_int: Number(p.Ks3_data_int) || 0,
        CLD_data_int: Number(p.CLD_data_int) || 0,
    };

    // Fatores derivados
    const Ks1 = Math.min(1, safeValues.wm1 * 0.12);
    const Ks2 = Math.min(1, safeValues.wm2 * 0.12);
    const Ks4_electric_int = safeValues.Uw_electric_int > 0 ? 1 / safeValues.Uw_electric_int : 1;
    
    // Probabilidades - Estrutura e Linha Elétrica
    const PA = safeValues.PTA * safeValues.PB;
    let PC = safeValues.PSPD_electric * safeValues.CLD_electric_int;
    const Pms = Math.pow(Ks1 * Ks2 * safeValues.Ks3_electric_int * Ks4_electric_int, 2);
    let PM = safeValues.PSPD_electric * Pms;
    const PU = safeValues.PTU_electric * safeValues.PEB_electric * safeValues.PLD_electric_ext * safeValues.CLD_electric_ext;
    const PV = safeValues.PEB_electric * safeValues.PLD_electric_ext * safeValues.CLD_electric_ext;
    const PW = safeValues.PSPD_electric * safeValues.PLD_electric_ext * safeValues.CLD_electric_ext;
    const Pli_electric_ext = calculatePli('electric', safeValues.Uw_electric_ext);
    const PZ = safeValues.PSPD_electric * safeValues.CLI_electric_ext * Pli_electric_ext; 

    // Probabilidades - Linha de Dados
    const Ks4_data_int = safeValues.Uw_data_int > 0 ? 1 / safeValues.Uw_data_int : 1;
    const Pli_data_ext = calculatePli('data', safeValues.Uw_data_ext);
    
    let PUT = 0, PVT = 0, PWT = 0, PZT = 0;
    let PCT = 0, Pmst = 0, PMT = 0;

    if (has_data_line) {
        PUT = safeValues.PTU_data * safeValues.PEB_data * safeValues.PLD_data_ext * safeValues.CLD_data_ext;
        PVT = safeValues.PEB_data * safeValues.PLD_data_ext * safeValues.CLD_data_ext;
        PWT = safeValues.PSPD_data * safeValues.PLD_data_ext * safeValues.CLD_data_ext;
        PZT = safeValues.PSPD_data * safeValues.CLI_data_ext * Pli_data_ext;

        // These probabilities relate to the failure of INTERNAL systems.
        // They are only calculated if the user wants to analyze the internal data line.
        if (analyzeDataLineProbs) {
            PCT = safeValues.PSPD_data * safeValues.CLD_data_int;
            Pmst = Math.pow(Ks1 * Ks2 * safeValues.Ks3_data_int * Ks4_data_int, 2);
            PMT = safeValues.PSPD_data * Pmst;
        }

        // Se a análise da linha de dados estiver desativada para a zona, zere também os externos
        if (!analyzeDataLineProbs) {
            PUT = 0; PVT = 0; PWT = 0; PZT = 0; PCT = 0; PMT = 0;
        }
    }
    
    // Se a análise da linha elétrica estiver desativada para a zona,
    // zere internos (PC, PM) e externos (PU, PV, PW, PZ)
    if (!analyzeElectricLineProbs) {
        PC = 0; PM = 0; PU = 0; PV = 0; PW = 0; PZ = 0;
    }

    // Garantir que todos os valores retornados sejam números válidos
    const result = {
        PA: Number(PA) || 0,
        PB: Number(safeValues.PB) || 0,
        PC: Number(PC) || 0,
        PCT: Number(PCT) || 0,
        Pms: Number(Pms) || 0,
        Pmst: Number(Pmst) || 0,
        PM: Number(PM) || 0,
        PMT: Number(PMT) || 0,
        PU: Number(PU) || 0,
        PUT: Number(PUT) || 0,
        PV: Number(PV) || 0,
        PVT: Number(PVT) || 0,
        PW: Number(PW) || 0,
        PWT: Number(PWT) || 0,
        PZ: Number(PZ) || 0,
        PZT: Number(PZT) || 0,
        Ks1: Number(Ks1) || 0,
        Ks2: Number(Ks2) || 0,
        Ks4_electric_int: Number(Ks4_electric_int) || 0,
        Ks4_data_int: Number(Ks4_data_int) || 0,
        Pli_electric_ext: Number(Pli_electric_ext) || 0,
        Pli_data_ext: Number(Pli_data_ext) || 0,
        PEB_electric: Number(safeValues.PEB_electric) || 0,
        PEB_data: Number(safeValues.PEB_data) || 0
    };
    
    return result;
}

export function calculateLossesForZone(zone: Zone): { [key: string]: any } {
    const losses: { [key: string]: any } = {};
    const ld = zone?.loss_data;
    // LT pode ser configurável pelo usuário (padrão 0,01)

    if (!ld) return {};
    
    // Garantir que todos os valores sejam números válidos
    const safeValues = {
        nt: Number(ld.nt) || 1,
        nz: Number(ld.nz) || 0,
        tz: Number(ld.tz) || 0,
        rt: Number(ld.rt) || 0,
        lt: Number((ld as any).lt) || 0.01,
        rs: Number(ld.rs) || 1,
        rp: Number(ld.rp) || 0,
        rf: Number(ld.rf) || 0,
        hz: Number(ld.hz) || 0,
        LF: Number(ld.LF) || 0,
        LO: Number(ld.LO) || 0
    };
    
    // R1 Losses
    const nt_r1 = safeValues.nt;
    const factor_r1 = nt_r1 > 0 ? (safeValues.nz / nt_r1) * (safeValues.tz / 8760) : 0;
    
    losses.LA = safeValues.rt * safeValues.lt * factor_r1 * safeValues.rs;
    losses.LB = safeValues.rs * safeValues.rp * safeValues.rf * safeValues.hz * safeValues.LF * factor_r1;
    losses.LC = safeValues.LO * factor_r1 * safeValues.rs;
    losses.LU = losses.LA;
    losses.LV = losses.LB;
    losses.LM = losses.LC;
    losses.LW = losses.LC;
    losses.LZ = losses.LC;

    // R3 Losses
    const ct_cultural = Number(ld.ct_cultural) || 1;
    const safeRp = Number(ld.rp) || 0;
    const safeRf = Number(ld.rf) || 0;
    const safeLf3 = Number(ld.lf3) || 0;
    const safeCz = Number(ld.cz) || 0;
    losses.LB3 = safeRp * safeRf * safeLf3 * (safeCz / ct_cultural); // Corrected: rs removed
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

    // Combinação de probabilidades para falha de sistemas internos (estrutura e proximidade)
    // Quando mais de um sistema interno é considerado na zona, aplica-se:
    // P_total = 1 − (1 − P1) × (1 − P2) × ...
    const PC_total = 1 - ((1 - (p.PC || 0)) * (1 - (p.PCT || 0)));
    const PM_total = 1 - ((1 - (p.PM || 0)) * (1 - (p.PMT || 0)));

    // R1 Components
    const RA = nd * (p.PA || 0) * (l.LA || 0);
    const RB = nd * (p.PB || 0) * (l.LB || 0);
    // Internal system failures use combined probability across systems
    const RC = nd * (PC_total) * (l.LC || 0);
    const RM = nm * (PM_total) * (l.LM || 0);
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
    // Internal system failures use combined probability across systems (R4)
    const RC4 = nd * (PC_total) * (l.LC4 || 0);
    const RM4 = nm * (PM_total) * (l.LM4 || 0);
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
 * Merge global probability calculations with zone-specific overrides.
 * Zone overrides are keyed by the derived probability labels (e.g., PA, PB, PC, PCT...).
 */
export function mergeZoneProbabilities(
    baseProbCalcs: { [key: string]: number },
    zone: Zone
): { [key: string]: number } {
    const overrides = zone?.probability_overrides || {};
    return { ...baseProbCalcs, ...overrides };
}

/**
 * Calculate and aggregate frequency components across zones.
 * Only use zone-level aggregation when zones define probability overrides;
 * otherwise, callers should keep using global frequency calculation to avoid duplicating totals.
 */
export function aggregateFrequenciesForZones(
    zones: Zone[],
    eventCalcs: Partial<CalculationResults>,
    globalProbData: ProbabilityData,
    analyze_data_line_probabilities: boolean,
    analyze_electric_line_probabilities: boolean,
    freqConfig: AnalysisData['frequency_config'],
    has_electric_line: boolean,
    has_data_line: boolean
): { [key: string]: number } {
    const total: { [key: string]: number } = { F: 0, FB: 0, FC: 0, FM: 0, FV: 0, FW: 0, FZ: 0 };
    zones.forEach((zone) => {
        const zoneBaseCalcs = calculateProbabilities(
            zone.probability_data || globalProbData,
            (zone.analyze_data_line_probabilities ?? analyze_data_line_probabilities),
            has_data_line,
            (zone.analyze_electric_line_probabilities ?? analyze_electric_line_probabilities)
        );
        const pZone = mergeZoneProbabilities(zoneBaseCalcs, zone);
        const fr = calculateFrequencies(eventCalcs, pZone, freqConfig, has_electric_line, has_data_line);
        total.F += fr.F || 0;
        total.FB += fr.FB || 0;
        total.FC += fr.FC || 0;
        total.FM += fr.FM || 0;
        total.FV += fr.FV || 0;
        total.FW += fr.FW || 0;
        total.FZ += fr.FZ || 0;
    });
    return total;
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
