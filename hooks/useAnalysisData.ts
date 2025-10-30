import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { AnalysisData, AnalysisInputData, ZoneCalculations } from '../types';
import { getNgByCity } from '../data/ngByCity';
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
    clientAddress: 'Centro Joinville/SC',
    projectDate: new Date().toISOString().split('T')[0],
    technicalManagerName: 'Eng. Júlio Certo',
    licenseNumber: 'Eng. Eletricista / CREA-SP: 12345678910/D',
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
    // ng: (sem preset; usuário irá digitar manualmente na Etapa Ng)
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
    const saveTimeoutRef = useRef<number | null>(null);

    // One-time migration: update old default texts to the new requested values
    useEffect(() => {
        const OLD_NAME = 'Eng. Júlio César Certo';
        const NEW_NAME = 'Eng. Júlio Certo';
        const OLD_LICENSE = 'Eng. Eletricista / CREA-SP: 506291022/D';
        const NEW_LICENSE = 'Eng. Eletricista / CREA-SP: 12345678910/D';
        const ADDRESS_HYPHEN_REGEX = /\s-\s(?=[^,]*\/[A-Z]{2}\b)/; // hífen antes de Cidade/UF no final

        let needsUpdate = false;
        const nextData: Partial<AnalysisInputData> = {};

        if (data.technicalManagerName && data.technicalManagerName.trim() === OLD_NAME) {
            nextData.technicalManagerName = NEW_NAME;
            needsUpdate = true;
        }
        if (data.licenseNumber && data.licenseNumber.trim() === OLD_LICENSE) {
            nextData.licenseNumber = NEW_LICENSE;
            needsUpdate = true;
        }

        // Remover hífen em endereços no formato "Bairro - Cidade/UF"
        if (typeof data.clientAddress === 'string' && ADDRESS_HYPHEN_REGEX.test(data.clientAddress)) {
            nextData.clientAddress = data.clientAddress.replace(ADDRESS_HYPHEN_REGEX, ' ');
            needsUpdate = true;
        }

        if (needsUpdate) {
            setData(prev => ({ ...prev, ...nextData }));
        }
        // Run only once after initial load
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // Debounce gravar em localStorage para reduzir escrita e evitar travamentos
        if (saveTimeoutRef.current) {
            window.clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = window.setTimeout(() => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            } catch (error) {
                console.error("Failed to save data to localStorage", error);
            }
        }, 400);

        return () => {
            if (saveTimeoutRef.current) {
                window.clearTimeout(saveTimeoutRef.current);
                saveTimeoutRef.current = null;
            }
        };
    }, [data]);

    // Inicialização automática de Ng a partir de "Informações do Projeto" ou valor padrão
    useEffect(() => {
        const setDefaultsFromProjectInfo = async () => {
            try {
                // Se Ng já está definido (>0), não sobrescreve
                if (typeof data.ng === 'number' && data.ng > 0) return;

                const address = (data.clientAddress || '').toString();
                // Capturar o último padrão Cidade/UF presente no endereço
                // Exemplos aceitos: "Centro Joinville/SC", "Bairro - São Paulo/SP", "Rua X, Curitiba/PR"
                const pattern = /([A-Za-zÀ-ÖØ-öø-ÿ'\-.\s]+)\s*\/\s*([A-Za-z]{2})/g;
                let match: RegExpExecArray | null;
                let lastCity: string | null = null;
                let lastUf: string | null = null;
                while ((match = pattern.exec(address)) !== null) {
                    lastCity = (match[1] || '').trim();
                    lastUf = (match[2] || '').trim().toUpperCase();
                }

                // Função simples para mapear UF -> região
                const getRegionFromState = (uf: string = ''): string => {
                    const U = uf.toUpperCase();
                    if (['GO','MT','MS','DF'].includes(U)) return 'centro-oeste';
                    if (['AL','BA','CE','MA','PB','PE','PI','RN','SE'].includes(U)) return 'nordeste';
                    if (['AC','AP','AM','PA','RO','RR','TO'].includes(U)) return 'norte';
                    if (['ES','MG','RJ','SP'].includes(U)) return 'sudeste';
                    if (['PR','RS','SC'].includes(U)) return 'sul';
                    return 'sudeste';
                };

                let nextNg: number = 18; // valor padrão solicitado
                let nextLocation: string | undefined;
                let nextRegion: string | undefined;

                if (lastCity && lastUf) {
                    const preset = await getNgByCity(lastUf, lastCity);
                    if (typeof preset === 'number' && preset > 0) {
                        nextNg = preset;
                    }
                    nextLocation = `${lastCity} - ${lastUf}`;
                    nextRegion = getRegionFromState(lastUf);
                }

                const patch: Partial<AnalysisInputData> = { ng: nextNg };
                if (nextLocation) patch.location = nextLocation;
                if (nextRegion) patch.mapRegion = nextRegion as any;

                setData(prev => ({ ...prev, ...patch }));
            } catch (err) {
                // Se algo falhar, pelo menos define o padrão Ng=18
                setData(prev => ({ ...prev, ng: (typeof prev.ng === 'number' && prev.ng > 0) ? prev.ng : 18 }));
            }
        };

        // Executa apenas uma vez após carregar dados
        // Evita loop ajustando somente quando ng não está definido
        if (!(typeof data.ng === 'number' && data.ng > 0)) {
            setDefaultsFromProjectInfo();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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