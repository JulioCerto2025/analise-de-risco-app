import * as React from 'react';
import { AnalysisData, AnalysisInputData, ZoneCalculations, Zone } from '../types';
import { getNgByCity, getCitiesByUf, getUfs } from '../data/ngByCity';
import { getRegionFromState } from '../utils/geoUtils';
 import { 
     calculateEvents, 
     calculateProbabilities, 
     calculateLossesForZone, 
     calculateRisksForZone,
     aggregateRiskResults,
     calculateFrequencies,
     aggregateFrequenciesForZones,
     mergeZoneProbabilities,
     calculatePld
  } from '../utils/calculations';
import { extractCityAndUf, normalizeCityName } from '../utils/addressParser';

const STORAGE_KEY = 'spda-analysis-data';

const initialInputData: AnalysisInputData = {
    // Preset inicial: Exemplo 1 — NBR 5419-2
    projectName: 'Exemplo 1 — NBR 5419-2',
    clientName: 'Cliente Exemplo',
    clientAddress: 'São Paulo/SP',
    projectDate: '',
    technicalManagerName: '',
    licenseNumber: '',
    zones: [{ 
        id: 'default-zone-1', 
        name: 'Zona 1',
        loss_data: { 
            // R1
            nz: 120, nt: 120, tz: 6903, te: 0,
            rt: 0.001, rp: 0.2, rf: 0.001, hz: 5, 
            LF: 0.1, LO: 0.001,
            // R3
            lf3: 0.1, cz: 1000000, ct_cultural: 1000000,
            // R4
            lf4: 0.2, lo4: 0.01, lt4: 0.01,
            ca: 1, cb: 200000, cc: 100000, cs: 10000, ce: 0, ct_economic: 1000000
        } 
    }],
    last_active_zone_id: 'default-zone-1',
    last_active_view_id: 'GLOBAL',
    h: 25.5,
    l: 23,
    w: 22.5,
    hp: 29.5,
    // Ng presetado para São Paulo (base local: 16)
    ng: 16,
    location: 'São Paulo - SP',
    mapRegion: 'sudeste',
    ufDraft: '',
    cityDraft: '',
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
    // Pré-seleções para facilitar o primeiro uso (Exemplo 1)
    selected_risk_components: { RA: true, RB: true, RC: true, RM: true, RU: true, RV: true, RW: true, RZ: true },
    risks_to_analyze: { R1: true, R3: false, R4: false },
    frequency_config: { is_critical_system: false, has_equipment_in_ZPR0A: true, analyze_by_most_critical_zone: false },
    probability_data: {
        // Estrutura
        PTA: 1, PB: 1,
        wm1: 5,
        wm2: 5,
        // Linha Elétrica - fatores compartilhados
        PSPD_electric: 1,
        PTU_electric: 1,
        PEB_electric: 1,
        // Linha Elétrica - Externa
        is_shielded_electric_ext: false,
        rs_electric_ext: 20,
        Uw_electric_ext: 2.5,
        PLD_electric_ext: 1.0,
        CLD_electric_ext: 1,
        CLI_electric_ext: 1,
        // Linha Elétrica - Interna
        is_shielded_electric_int: false,
        rs_electric_int: 20,
        CLD_electric_int: 1,
        CLI_electric_int: 1,
        PLD_electric_int: 1.0,
        Ks3_electric_int: 1,
        Uw_electric_int: 2.5,
        // Linha de Dados - fatores compartilhados
        PSPD_data: 1,
        PTU_data: 1,
        PEB_data: 1,
        // Linha de Dados - Externa
        is_shielded_data_ext: false,
        rs_data_ext: 20,
        Uw_data_ext: 1.5,
        PLD_data_ext: 1.0,
        CLD_data_ext: 1,
        CLI_data_ext: 1,
        // Linha de Dados - Interna
        is_shielded_data_int: false,
        rs_data_int: 20,
        CLD_data_int: 1,
        CLI_data_int: 1,
        PLD_data_int: 1.0,
        Ks3_data_int: 1,
        Uw_data_int: 1.5,
    },
    analyze_data_line_probabilities: true,
    analyze_electric_line_probabilities: true,
    fireRiskAiResult: null,
    fireRiskAiStatus: 'idle',
    fireRiskAiError: null,
    audit_mode: false,
    robust_infrastructure: true,
    rs: 1,
    map_transform: { scale: 1, x: 0, y: 0 },
    is_ng_manual: false,
};

export function useAnalysisData() {
    const sanitizeZones = (zs: any): Zone[] => {
        const defaultZoneTemplate: Zone = {
            id: 'default-zone-1',
            name: 'Zona 1',
            loss_data: { ...initialInputData.zones[0].loss_data },
            probability_overrides: {},
            homogeneous_type: 'L',
            analyze_data_line_probabilities: initialInputData.analyze_data_line_probabilities,
            analyze_electric_line_probabilities: initialInputData.analyze_electric_line_probabilities,
        } as Zone;
        if (!Array.isArray(zs) || zs.length === 0) return [defaultZoneTemplate];
        return zs.map((z: any, idx: number) => {
            const id = (z && typeof z.id === 'string') ? z.id : `zone_${idx+1}`;
            const name = (z && typeof z.name === 'string' && z.name.trim().length) ? z.name : `Zona ${idx+1}`;
            const loss = { ...defaultZoneTemplate.loss_data, ...(z && z.loss_data ? z.loss_data : {}) };
            if (loss.LO == null) (loss as any).LO = 0.001;
            if (loss.lt == null) (loss as any).lt = 0.01;
            const probability_data = (z && z.probability_data && typeof z.probability_data === 'object') ? z.probability_data : undefined;
            const probability_overrides = (z && z.probability_overrides && typeof z.probability_overrides === 'object') ? z.probability_overrides : {};
            const homogeneous_type = (z && (z.homogeneous_type === 'P' || z.homogeneous_type === 'L')) ? z.homogeneous_type : 'L';
            const analyze_data_line_probabilities = (typeof z?.analyze_data_line_probabilities === 'boolean') ? z.analyze_data_line_probabilities : defaultZoneTemplate.analyze_data_line_probabilities!;
            const analyze_electric_line_probabilities = (typeof z?.analyze_electric_line_probabilities === 'boolean') ? z.analyze_electric_line_probabilities : defaultZoneTemplate.analyze_electric_line_probabilities!;

            return { id, name, loss_data: loss, probability_data, probability_overrides, homogeneous_type, analyze_data_line_probabilities, analyze_electric_line_probabilities } as Zone;
        });
    };

    const sanitizeData = (raw: any): AnalysisInputData => {
        try {
            const base = { ...initialInputData } as AnalysisInputData;
            const safe: AnalysisInputData = {
                ...base,
                ...(raw || {}),
                zones: sanitizeZones(raw?.zones ?? base.zones),
                last_active_zone_id: (() => {
                    const candidate = (raw?.last_active_zone_id ?? base.last_active_zone_id) as string | undefined;
                    const zoneIds = (raw?.zones ?? base.zones).map((z: any) => z?.id || z?.name).filter(Boolean);
                    if (candidate && zoneIds.includes(candidate)) return candidate;
                    return zoneIds[0] || base.zones[0].id;
                })(),
                last_active_view_id: (() => {
                    const candidate = (raw?.last_active_view_id ?? base.last_active_view_id) as string | undefined;
                    const zoneIds = (raw?.zones ?? base.zones).map((z: any) => z?.id || z?.name).filter(Boolean);
                    if (candidate === 'GLOBAL') return 'GLOBAL';
                    if (candidate && zoneIds.includes(candidate)) return candidate;
                    return 'GLOBAL';
                })(),
                selected_risk_components: { ...base.selected_risk_components, ...(raw?.selected_risk_components || {}) },
                risks_to_analyze: { ...base.risks_to_analyze, ...(raw?.risks_to_analyze || {}) },
                frequency_config: { ...base.frequency_config, ...(raw?.frequency_config || {}) },
                probability_data: { ...base.probability_data, ...(raw?.probability_data || {}) },
                line_sections_1: Array.isArray(raw?.line_sections_1) ? raw.line_sections_1 : base.line_sections_1,
                line_sections_2: Array.isArray(raw?.line_sections_2) ? raw.line_sections_2 : base.line_sections_2,
            };
            const numericKeys: (keyof AnalysisInputData)[] = ['h','l','w','hp','ad_override','cd','l_adj_1','w_adj_1','h_adj_1','hp_adj_1','cd_adj_1','l_adj_2','w_adj_2','h_adj_2','hp_adj_2','cd_adj_2'];
            numericKeys.forEach((k) => {
                const v = (safe as any)[k];
                if (v === null) return;
                if (typeof v === 'string') {
                    const n = parseFloat(v);
                    (safe as any)[k] = isNaN(n) ? (base as any)[k] : n;
                }
            });
            if (typeof safe.ng === 'string') {
                const n = parseFloat(safe.ng as any);
                safe.ng = isNaN(n) ? undefined : n;
            }
            const normalizeStatus = (s: any): 'idle' | 'success' | 'error' => s === 'success' || s === 'error' ? s : 'idle';
            safe.fireRiskAiStatus = normalizeStatus((raw?.fireRiskAiStatus ?? safe.fireRiskAiStatus));
            if (safe.fireRiskAiStatus === 'idle') safe.fireRiskAiError = null;
            return safe;
        } catch {
            return initialInputData;
        }
    };

    const [data, setData] = React.useState<AnalysisInputData>(() => {
        try {
            const storedData = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
            return storedData ? sanitizeData(JSON.parse(storedData)) : initialInputData;
        } catch (error) {
            return initialInputData;
        }
    });

    const saveTimeoutRef = React.useRef<number | null>(null);

    // Persistência
    React.useEffect(() => {
        if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = window.setTimeout(() => {
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (error) {}
        }, 400);
        return () => { if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current); };
    }, [data]);

    // Automação: Sincroniza Ng/Localização quando o endereço do cliente muda
    React.useEffect(() => {
        const syncFromAddress = async () => {
            try {
                const address = (data.clientAddress || '').toString().trim();
                if (!address) return;
                const parsed = extractCityAndUf(address);
                if (!parsed) return;
                const { city: rawCity, uf: rawUf } = parsed;
                let city = rawCity.replace(/[-/;,]$/, '').trim(); 
                
                try {
                    const ufs = await getUfs();
                    if (ufs.includes(rawUf.toUpperCase())) {
                        const cities = await getCitiesByUf(rawUf);
                        const rawNorm = normalizeCityName(city);
                        
                        const exactMatch = cities.find(c => normalizeCityName(c) === rawNorm);
                        if (exactMatch) {
                            city = exactMatch;
                        } else {
                            const partialMatch = cities.find(c => {
                                const cn = normalizeCityName(c);
                                return cn.startsWith(rawNorm) || rawNorm.startsWith(cn);
                            });
                            if (partialMatch) city = partialMatch;
                        }

                        const preset = await getNgByCity(rawUf, city);
                        const nextNg = (typeof preset === 'number' && preset > 0) ? preset : data.ng;
                        const cleanCity = city.trim();
                        const nextLoc = `${cleanCity} - ${rawUf.toUpperCase()}`;

                        setData(prev => {
                            if (prev.location === nextLoc && prev.ng === nextNg) return prev;
                            // Ao mudar o endereço principal, limpamos rascunhos para não conflitar na etapa 2
                            return { ...prev, location: nextLoc, mapRegion: getRegionFromState(rawUf) as any, ng: nextNg, ufDraft: '', cityDraft: '' };
                        });
                    }
                } catch (_) {}
            } catch (_) {}
        };
        const t = setTimeout(syncFromAddress, 500);
        return () => clearTimeout(t);
    }, [data.clientAddress]);

    // Cálculos
    const eventCalculations = React.useMemo(() => calculateEvents(data), [
        data.h, data.l, data.w, data.hp, data.ad_override, data.ng, data.cd, 
        data.has_electric_line, data.line_sections_1, data.use_adj_structure_1, data.l_adj_1, data.w_adj_1, data.h_adj_1, data.hp_adj_1, data.cd_adj_1,
        data.has_data_line, data.line_sections_2, data.use_adj_structure_2, data.l_adj_2, data.w_adj_2, data.h_adj_2, data.hp_adj_2, data.cd_adj_2
    ]);

    const probabilityCalculations = React.useMemo(() => calculateProbabilities(
        data.probability_data,
        data.analyze_data_line_probabilities,
        data.has_data_line,
        data.analyze_electric_line_probabilities
    ), [data.probability_data, data.analyze_data_line_probabilities, data.has_data_line, data.analyze_electric_line_probabilities]);
    
    const zoneCalculations: ZoneCalculations[] = React.useMemo(() => {
        return data.zones.map(zone => {
            const lossCalculations = calculateLossesForZone(zone, data.rs);
            const zoneBaseProbCalculations = calculateProbabilities(
                (zone.probability_data || data.probability_data),
                (zone.analyze_data_line_probabilities ?? data.analyze_data_line_probabilities),
                data.has_data_line,
                (zone.analyze_electric_line_probabilities ?? data.analyze_electric_line_probabilities)
            );
            const zoneProbCalculations = mergeZoneProbabilities(zoneBaseProbCalculations, zone);
            const riskCalculations = calculateRisksForZone(eventCalculations, zoneProbCalculations, lossCalculations, data.selected_risk_components);
            return { zone, lossCalculations, riskCalculations };
        });
    }, [data.zones, eventCalculations, data.selected_risk_components, data.has_data_line, data.probability_data]);

    const totalRiskResults = React.useMemo(() => aggregateRiskResults(zoneCalculations), [zoneCalculations]);

    const frequencyResults = React.useMemo(() => {
        const aggregated = aggregateFrequenciesForZones(data.zones, eventCalculations, data.probability_data, data.analyze_data_line_probabilities, data.analyze_electric_line_probabilities, data.frequency_config, data.has_electric_line, data.has_data_line);
        
        if (data.frequency_config.analyze_by_most_critical_zone && data.zones.length > 0) {
            // Find most critical zone frequency data
            let maxF = -1;
            let criticalFreq = aggregated;
            data.zones.forEach(z => {
                const zBase = calculateProbabilities(z.probability_data || data.probability_data, !!z.analyze_data_line_probabilities, data.has_data_line, !!z.analyze_electric_line_probabilities);
                const pZ = mergeZoneProbabilities(zBase, z);
                const fZ = calculateFrequencies(eventCalculations, pZ, data.frequency_config, data.has_electric_line, data.has_data_line);
                if (fZ.F > maxF) {
                    maxF = fZ.F;
                    criticalFreq = fZ;
                }
            });
            return criticalFreq;
        }
        return aggregated;
    }, [data.zones, eventCalculations, data.probability_data, data.analyze_data_line_probabilities, data.analyze_electric_line_probabilities, data.frequency_config, data.has_electric_line, data.has_data_line]);

    const fullAnalysisData: AnalysisData = React.useMemo(() => ({
        ...data,
        calculations: eventCalculations,
        probability_calculations: probabilityCalculations,
        loss_calculations: zoneCalculations[0]?.lossCalculations || {},
        risk_results: totalRiskResults,
        frequency_results: frequencyResults,
    }), [data, eventCalculations, probabilityCalculations, zoneCalculations, totalRiskResults, frequencyResults]);

    const updateData = React.useCallback((newData: Partial<AnalysisInputData>) => {
        setData(prevData => ({ ...prevData, ...newData }));
    }, []);

    const restoreDefaultPreset = React.useCallback(() => {
        setData(prev => ({
            ...prev,
            probability_data: {
                ...prev.probability_data,
                is_shielded_electric_ext: false, rs_electric_ext: 20, Uw_electric_ext: 2.5, CLD_electric_ext: 1, CLI_electric_ext: 1, PLD_electric_ext: calculatePld(20, 2.5, false),
                CLD_electric_int: 1, Ks3_electric_int: 1, Uw_electric_int: 2.5,
                is_shielded_data_ext: false, rs_data_ext: 20, Uw_data_ext: 1.5, CLD_data_ext: 1, CLI_data_ext: 1, PLD_data_ext: calculatePld(20, 1.5, false),
                CLD_data_int: 1, Ks3_data_int: 1, Uw_data_int: 1.5,
            }
        }));
    }, []);

    const resetToInitialPreset = React.useCallback(() => {
        try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
        setData({ ...initialInputData });
    }, []);

    return { data: fullAnalysisData, updateData, restoreDefaultPreset, resetToInitialPreset };
}
