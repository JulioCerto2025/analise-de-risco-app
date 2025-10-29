import { useState, useCallback, useEffect, useMemo } from 'react';
import { AnalysisData, AnalysisInputData, ZoneCalculations } from '../types';
import { 
    calculateEvents, 
    calculateProbabilities, 
    calculateLossesForZone, 
    calculateRisksForZone,
    aggregateRiskResults,
    calculateFrequencies
} from '../utils/calculations';

const STORAGE_KEY = 'spda-analysis-data';

const initialInputData: AnalysisInputData = {
    projectName: 'Edifício Residencial Multifamiliar, 8 andares, 4 apartamentos por andar, totalizando 32 Apartamentos. Altura do piso ocupado á descarga 24 m, Área aproximada de 2400 m2',
    clientName: 'Conjunto Residencial Multifamiliar',
    clientAddress: 'Centro - Joinville/SC',
    projectDate: new Date().toISOString().split('T')[0],
    technicalManagerName: 'Eng. Júlio César Certo',
    licenseNumber: 'Eng. Eletricista / CREA-SP: 506291022/D',
    zones: [{ 
        id: 'default-zone-1', 
        name: 'Zona 1',
        loss_data: { 
            // R1
            nz: 120, nt: 120, tz: 6903, te: 0,
            rt: 0.001, rp: 0.2, rf: 0.001, hz: 5, 
            rs: 1,
            LF: 0.1, LO: 0,
            // R3
            lf3: 0.1, cz: 1000000, ct_cultural: 1000000,
            // R4
            lf4: 0.2, lo4: 0.01, lt4: 0.01,
            ca: 1, cb: 200000, cc: 100000, cs: 10000, ce: 0, ct_economic: 1000000
        } 
    }],
    h: 25.5,
    l: 23,
    w: 22.5,
    hp: 29.5,
    ng: 18,
    location: '',
    mapRegion: 'sudeste',
    cd: 0.5,
    has_electric_line: true,
    line_sections_1: [
        { id: 'sec1_1', ll: 200, ci: 1, ct: 0.2, ce: 0.1 },
    ],
    use_adj_structure_1: false,
    l_adj_1: 5,
    w_adj_1: 5,
    h_adj_1: 4,
    hp_adj_1: 4,
    cd_adj_1: 1.0,
    has_data_line: true,
    line_sections_2: [
        { id: 'sec2_1', ll: 100, ci: 1, ct: 1, ce: 0.1 },
    ],
    use_adj_structure_2: false,
    l_adj_2: 5,
    w_adj_2: 5,
    h_adj_2: 4,
    hp_adj_2: 4,
    cd_adj_2: 0.25,
    selected_risk_components: { RA: true, RB: true, RC: false, RM: false, RU: true, RV: true, RW: false, RZ: false },
    risks_to_analyze: { R1: true, R3: false, R4: false },
    frequency_config: { is_critical_system: false, has_equipment_in_ZPR0A: true },
    probability_data: {
        // Structure
        PTA: 1, PB: 1, 
        wm1: 5, // Default mesh width for Ks1
        wm2: 5, // Default mesh width for Ks2
        // Electric Line - Default to NOT shielded
        is_shielded_electric: false, 
        rs_electric: 20, 
        Uw_electric: 1.5,
        PLD_electric: 1.0, 
        PSPD_electric: 1, 
        CLD_electric: 1, 
        PTU_electric: 1, 
        PEB_electric: 1, 
        CLI_electric: 1,
        Ks3_electric: 1,
        // Data Line - Default to NOT shielded
        is_shielded_data: false,
        rs_data: 20,
        Uw_data: 1.5,
        PLD_data: 1.0,
        PSPD_data: 1,
        CLD_data: 1,
        PTU_data: 1,
        PEB_data: 1,
        CLI_data: 1,
        Ks3_data: 1,
    },
    analyze_data_line_probabilities: false,
    fireRiskAiResult: null,
    fireRiskAiStatus: 'idle',
    fireRiskAiError: null,
    preliminaryAiResult: null,
    preliminaryAiStatus: 'idle',
    preliminaryAiError: null,
};


export function useAnalysisData() {
    const [data, setData] = useState<AnalysisInputData>(() => {
        try {
            const storedData = localStorage.getItem(STORAGE_KEY);
            return storedData ? JSON.parse(storedData) : initialInputData;
        } catch (error) {
            console.error("Failed to load data from localStorage", error);
            return initialInputData;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error("Failed to save data to localStorage", error);
        }
    }, [data]);

    // Memoized calculation for events (N)
    const eventCalculations = useMemo(() => calculateEvents(data), [
        data.h, data.l, data.w, data.hp, data.ng, data.cd, 
        data.has_electric_line, data.line_sections_1, data.use_adj_structure_1, data.l_adj_1, data.w_adj_1, data.h_adj_1, data.hp_adj_1, data.cd_adj_1,
        data.has_data_line, data.line_sections_2, data.use_adj_structure_2, data.l_adj_2, data.w_adj_2, data.h_adj_2, data.hp_adj_2, data.cd_adj_2
    ]);

    // Memoized calculation for probabilities (P)
    const probabilityCalculations = useMemo(() => calculateProbabilities(
        data.probability_data,
        data.analyze_data_line_probabilities,
        data.has_data_line
    ), [data.probability_data, data.analyze_data_line_probabilities, data.has_data_line]);
    
    // Memoized calculation for losses and risks per zone
    const zoneCalculations: ZoneCalculations[] = useMemo(() => {
        return data.zones.map(zone => {
            const lossCalculations = calculateLossesForZone(zone);
            const riskCalculations = calculateRisksForZone(
                eventCalculations, 
                probabilityCalculations, 
                lossCalculations,
                data.selected_risk_components // Pass selections to the calculator
            );
            return { zone, lossCalculations, riskCalculations };
        });
    }, [data.zones, eventCalculations, probabilityCalculations, data.selected_risk_components]); // Add dependency

    // Memoized aggregation of risks from all zones
    const totalRiskResults = useMemo(() => aggregateRiskResults(zoneCalculations), [zoneCalculations]);

    // Memoized calculation for frequencies (F)
    const frequencyResults = useMemo(() => calculateFrequencies(
        eventCalculations, 
        probabilityCalculations, 
        data.frequency_config,
        data.has_electric_line,
        data.has_data_line
    ), 
        [eventCalculations, probabilityCalculations, data.frequency_config, data.has_electric_line, data.has_data_line]
    );

    // Assemble the final, complete data object
    const fullAnalysisData: AnalysisData = useMemo(() => ({
        ...data,
        calculations: eventCalculations,
        probability_calculations: probabilityCalculations,
        // For UI compatibility, loss_calculations shows data for the first zone
        loss_calculations: zoneCalculations[0]?.lossCalculations || {},
        risk_results: totalRiskResults,
        frequency_results: frequencyResults,
    }), [data, eventCalculations, probabilityCalculations, zoneCalculations, totalRiskResults, frequencyResults]);


    const updateData = useCallback((newData: Partial<AnalysisInputData>) => {
        setData(prevData => ({ ...prevData, ...newData }));
    }, []);


    return { data: fullAnalysisData, updateData };
}