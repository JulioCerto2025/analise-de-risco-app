import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { AnalysisData, AnalysisInputData, ZoneCalculations, Zone } from '../types';
import { getNgByCity, getCitiesByUf } from '../data/ngByCity';
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
            LF: 0.1, LO: 0.001,
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
        CLD_electric_int: 1,
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
        CLD_data_int: 1,
        Ks3_data_int: 1,
        Uw_data_int: 1.5,
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
    // Sanitizador para garantir forma esperada e preencher faltas
    const sanitizeZones = (zs: any): Zone[] => {
        const defaultZoneTemplate: Zone = {
            id: 'default-zone-1',
            name: 'Zona 1',
            loss_data: { ...initialInputData.zones[0].loss_data },
            probability_overrides: {},
            homogeneous_type: 'L'
        };
        if (!Array.isArray(zs) || zs.length === 0) {
            return [defaultZoneTemplate];
        }
        return zs.map((z: any, idx: number) => {
            const id = (z && typeof z.id === 'string') ? z.id : `zone_${idx+1}`;
            const name = (z && typeof z.name === 'string' && z.name.trim().length) ? z.name : `Zona ${idx+1}`;
            const loss = { ...defaultZoneTemplate.loss_data, ...(z && z.loss_data ? z.loss_data : {}) };
            // Aplicar LO padrão também para dados salvos antigos (quando ausente ou zerado)
            if (loss.LO == null || Number(loss.LO) === 0) {
                (loss as any).LO = 0.001;
            }
            const probability_overrides = (z && z.probability_overrides && typeof z.probability_overrides === 'object') ? z.probability_overrides : {};
            const homogeneous_type = (z && (z.homogeneous_type === 'P' || z.homogeneous_type === 'L')) ? z.homogeneous_type : 'L';
            return { id, name, loss_data: loss, probability_overrides, homogeneous_type } as Zone;
        });
    };

    const sanitizeData = (raw: any): AnalysisInputData => {
        try {
            const base = { ...initialInputData } as AnalysisInputData;
            const safe: AnalysisInputData = {
                ...base,
                ...(raw || {}),
                zones: sanitizeZones(raw?.zones ?? base.zones),
                selected_risk_components: {
                    ...base.selected_risk_components,
                    ...(raw?.selected_risk_components || {})
                },
                risks_to_analyze: {
                    ...base.risks_to_analyze,
                    ...(raw?.risks_to_analyze || {})
                },
                frequency_config: {
                    ...base.frequency_config,
                    ...(raw?.frequency_config || {})
                },
                probability_data: {
                    ...base.probability_data,
                    ...(raw?.probability_data || {})
                },
                line_sections_1: Array.isArray(raw?.line_sections_1) ? raw.line_sections_1 : base.line_sections_1,
                line_sections_2: Array.isArray(raw?.line_sections_2) ? raw.line_sections_2 : base.line_sections_2,
            };
            // Normalizar numéricos essenciais que podem ter vindo como string
            const numericKeys: (keyof AnalysisInputData)[] = ['h','l','w','hp','cd','l_adj_1','w_adj_1','h_adj_1','hp_adj_1','cd_adj_1','l_adj_2','w_adj_2','h_adj_2','hp_adj_2','cd_adj_2'];
            numericKeys.forEach((k) => {
                const v = (safe as any)[k];
                if (typeof v === 'string') {
                    const n = parseFloat(v);
                    (safe as any)[k] = isNaN(n) ? (base as any)[k] : n;
                }
            });
            if (typeof safe.ng === 'string') {
                const n = parseFloat(safe.ng as any);
                safe.ng = isNaN(n) ? undefined : n;
            }
            // Evitar travamento por estados de IA persistidos como "loading" no localStorage
            // Se encontramos 'loading', redefinimos para 'idle' na carga.
            const normalizeStatus = (s: any): 'idle' | 'success' | 'error' => {
                return s === 'success' || s === 'error' ? s : 'idle';
            };
            safe.preliminaryAiStatus = normalizeStatus((raw?.preliminaryAiStatus ?? safe.preliminaryAiStatus));
            safe.fireRiskAiStatus = normalizeStatus((raw?.fireRiskAiStatus ?? safe.fireRiskAiStatus));
            // Se estava em loading, não manter erro anterior
            if (safe.preliminaryAiStatus === 'idle') {
                // Mantém resultado, mas limpa erro para evitar bloqueio visual
                safe.preliminaryAiError = null;
            }
            if (safe.fireRiskAiStatus === 'idle') {
                safe.fireRiskAiError = null;
            }
            return safe;
        } catch {
            return initialInputData;
        }
    };

    const [data, setData] = useState<AnalysisInputData>(() => {
        try {
            const storedData = localStorage.getItem(STORAGE_KEY);
            return storedData ? sanitizeData(JSON.parse(storedData)) : initialInputData;
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

    // Migração de preset de inicialização: garante pré-seleções solicitadas quando houver dados antigos
    useEffect(() => {
        try {
            const p = data?.probability_data as any;
            if (!p) return;
            const probPatch: any = {};

            // Atualizar Uw antigo (1.5) para novo padrão (2.5) apenas para elétrica externa; para dados externa manter 1.5
            const toNum = (v: any) => typeof v === 'number' ? v : (typeof v === 'string' ? parseFloat(v) : undefined);
            if (toNum(p.Uw_electric_ext) === 1.5) probPatch.Uw_electric_ext = 2.5;
            // Para dados externa, se vier como string, apenas normaliza para número
            if (typeof p.Uw_data_ext === 'string') {
                const num = parseFloat(p.Uw_data_ext);
                if (!isNaN(num)) probPatch.Uw_data_ext = num;
            }

            // Garantir CLD/CLI externos = 1,1 e CLD internos = 1 quando ausentes
            if (typeof p.CLD_electric_ext !== 'number') probPatch.CLD_electric_ext = 1;
            if (typeof p.CLI_electric_ext !== 'number') probPatch.CLI_electric_ext = 1;
            if (typeof p.CLD_data_ext !== 'number') probPatch.CLD_data_ext = 1;
            if (typeof p.CLI_data_ext !== 'number') probPatch.CLI_data_ext = 1;
            if (typeof p.CLD_electric_int !== 'number') probPatch.CLD_electric_int = 1;
            if (typeof p.CLD_data_int !== 'number') probPatch.CLD_data_int = 1;

            // Garantir Ks3 internos = 1 quando ausentes
            if (typeof p.Ks3_electric_int !== 'number') probPatch.Ks3_electric_int = 1;
            if (typeof p.Ks3_data_int !== 'number') probPatch.Ks3_data_int = 1;

            // Garantir não blindado se ausente; normalizar strings 'true'/'false' para externos
            const toBool = (v: any) => typeof v === 'boolean' ? v : (typeof v === 'string' ? v.toLowerCase() === 'true' : undefined);
            if (typeof toBool(p.is_shielded_electric_ext) === 'undefined') probPatch.is_shielded_electric_ext = false;
            if (typeof toBool(p.is_shielded_data_ext) === 'undefined') probPatch.is_shielded_data_ext = false;

            if (Object.keys(probPatch).length > 0) {
                setData(prev => ({
                    ...prev,
                    probability_data: { ...prev.probability_data, ...probPatch }
                }));
            }
        } catch (_) { /* silencioso */ }
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
                    // Resolver cidade ignorando bairro usando lista do UF
                    const normalize = (s: string) => (s || '')
                        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                        .toLowerCase().replace(/[.,]/g, ' ')
                        .replace(/\s+/g, ' ').trim();
                    let resolvedCity = lastCity.trim();
                    try {
                        const cities = await getCitiesByUf(lastUf);
                        const rawNorm = normalize(lastCity);
                        let best: string | null = null;
                        for (const c of cities) {
                            const cn = normalize(c);
                            if (rawNorm === cn || rawNorm.endsWith(cn) || rawNorm.includes(' ' + cn) || rawNorm.startsWith(cn + ' ')) {
                                if (!best || normalize(best).length < cn.length) best = c;
                            }
                        }
                        if (best) resolvedCity = best;
                        else if (/[-–—]/.test(lastCity)) resolvedCity = lastCity.split(/[-–—]/).pop()!.trim();
                        else if (/,/.test(lastCity)) resolvedCity = lastCity.split(',').pop()!.trim();
                    } catch (_) {
                        // fallback conserva entrada original
                    }

                    const preset = await getNgByCity(lastUf, resolvedCity);
                    if (typeof preset === 'number' && preset > 0) {
                        nextNg = preset;
                    }
                    nextLocation = `${resolvedCity} - ${lastUf}`;
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

    // Sincroniza cidade/UF, região e Ng quando o endereço muda (Step 1)
    useEffect(() => {
        const syncFromAddress = async () => {
            try {
                const address = (data.clientAddress || '').toString().trim();
                if (!address) return;

                // Busca global pela última ocorrência de Cidade/UF em qualquer posição,
                // aceitando ponto, vírgula, traço ou espaço entre Cidade e UF.
                const globalPatterns: RegExp[] = [
                    /([A-Za-zÀ-ÖØ-öø-ÿ'-.\s]+)\s*\/\s*([A-Za-z]{2})/gi,
                    /([A-Za-zÀ-ÖØ-öø-ÿ'-.\s]+)\s-\s([A-Za-z]{2})/gi,
                    /([A-Za-zÀ-ÖØ-öø-ÿ'-.\s]+),\s*([A-Za-z]{2})/gi,
                    /([A-Za-zÀ-ÖØ-öø-ÿ'-.\s]+)\s([A-Za-z]{2})/gi,
                ];
                let lastCityGlobal: string | null = null;
                let lastUfGlobal: string | null = null;
                for (const re of globalPatterns) {
                    let match: RegExpExecArray | null;
                    while ((match = re.exec(address)) !== null) {
                        lastCityGlobal = (match[1] || '').trim();
                        lastUfGlobal = (match[2] || '').trim().toUpperCase();
                    }
                }

                // Se não encontrou UF (sigla) acima, tenta estado por extenso no FINAL do endereço.
                const normalizeSimple = (s: string) => (s || '')
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                    .toLowerCase().replace(/[.,]/g, ' ')
                    .replace(/\s+/g, ' ').trim();
                const mapStateNameToUf = (name: string): string | null => {
                    const n = normalizeSimple(name);
                    const dict: Record<string, string> = {
                        'acre': 'AC', 'alagoas': 'AL', 'amapa': 'AP', 'amazonas': 'AM', 'bahia': 'BA', 'ceara': 'CE',
                        'distrito federal': 'DF', 'espirito santo': 'ES', 'goias': 'GO', 'maranhao': 'MA', 'mato grosso': 'MT',
                        'mato grosso do sul': 'MS', 'minas gerais': 'MG', 'para': 'PA', 'paraiba': 'PB', 'parana': 'PR',
                        'pernambuco': 'PE', 'piaui': 'PI', 'rio de janeiro': 'RJ', 'rio grande do norte': 'RN',
                        'rio grande do sul': 'RS', 'rondonia': 'RO', 'roraima': 'RR', 'santa catarina': 'SC',
                        'sao paulo': 'SP', 'sergipe': 'SE', 'tocantins': 'TO'
                    };
                    return dict[n] || null;
                };

                if (!lastUfGlobal) {
                    const endPatterns: RegExp[] = [
                        /([A-Za-zÀ-ÖØ-öø-ÿ'-.\s]+)\s*\/\s*([A-Za-zÀ-ÖØ-öø-ÿ'-.\s]+)$/i,
                        /([A-Za-zÀ-ÖØ-öø-ÿ'-.\s]+)\s-\s([A-Za-zÀ-ÖØ-öø-ÿ'-.\s]+)$/i,
                        /([A-Za-zÀ-ÖØ-öø-ÿ'-.\s]+),\s*([A-Za-zÀ-ÖØ-öø-ÿ'-.\s]+)$/i,
                        /([A-Za-zÀ-ÖØ-öø-ÿ'-.\s]+)\s([A-Za-zÀ-ÖØ-öø-ÿ'-.\s]+)$/i,
                    ];
                    for (const re of endPatterns) {
                        const m = address.match(re);
                        if (m) {
                            const stateName = (m[2] || '').trim();
                            const ufFromName = mapStateNameToUf(stateName);
                            if (ufFromName) {
                                lastCityGlobal = (m[1] || '').trim();
                                lastUfGlobal = ufFromName;
                                break;
                            }
                        }
                    }
                }

                // Aceita sufixo no fim em diversos formatos: "Cidade/UF", "Cidade - UF", "Cidade, UF" e "Cidade UF"
                const mSlash = address.match(/([A-Za-zÀ-ÖØ-öø-ÿ'-.\s]+)\s*\/\s*([A-Za-z]{2})$/i);
                const mHyphen = address.match(/([A-Za-zÀ-ÖØ-öø-ÿ'-.\s]+)\s-\s([A-Za-z]{2})$/i);
                const mComma = address.match(/([A-Za-zÀ-ÖØ-öø-ÿ'-.\s]+),\s*([A-Za-z]{2})$/i);
                const mSpace = address.match(/([A-Za-zÀ-ÖØ-öø-ÿ'-.\s]+)\s([A-Za-z]{2})$/i);
                const cityRaw = ((lastCityGlobal && lastCityGlobal.trim()) || (mSlash?.[1] || mHyphen?.[1] || mComma?.[1] || mSpace?.[1] || '')).trim();
                const ufRaw = ((lastUfGlobal && lastUfGlobal.toUpperCase()) || (mSlash?.[2] || mHyphen?.[2] || mComma?.[2] || mSpace?.[2] || '')).toUpperCase();
                if (!cityRaw || !ufRaw) return;

                // Resolver cidade ignorando bairro/rua usando lista oficial do UF
                const normalize = (s: string) => (s || '')
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                    .toLowerCase().replace(/[.,]/g, ' ')
                    .replace(/\s+/g, ' ').trim();

                let resolvedCity = cityRaw;
                try {
                    const cities = await getCitiesByUf(ufRaw);
                    const rawNorm = normalize(cityRaw);
                    let best: string | null = null;
                    for (const c of cities) {
                        const cn = normalize(c);
                        if (rawNorm === cn || rawNorm.endsWith(cn) || rawNorm.includes(' ' + cn) || rawNorm.startsWith(cn + ' ')) {
                            if (!best || normalize(best).length < cn.length) best = c;
                        }
                    }
                    if (best) resolvedCity = best;
                    else if (/[-–—]/.test(cityRaw)) resolvedCity = cityRaw.split(/[-–—]/).pop()!.trim();
                    else if (/,/.test(cityRaw)) resolvedCity = cityRaw.split(',').pop()!.trim();
                } catch (_) { /* mantém cityRaw */ }

                const getRegionFromState = (uf: string = ''): string => {
                    const U = uf.toUpperCase();
                    if (["GO","MT","MS","DF"].includes(U)) return 'centro-oeste';
                    if (["AL","BA","CE","MA","PB","PE","PI","RN","SE"].includes(U)) return 'nordeste';
                    if (["AC","AP","AM","PA","RO","RR","TO"].includes(U)) return 'norte';
                    if (["ES","MG","RJ","SP"].includes(U)) return 'sudeste';
                    if (["PR","RS","SC"].includes(U)) return 'sul';
                    return 'sudeste';
                };

                let nextNg: number | undefined = undefined;
                try {
                    const preset = await getNgByCity(ufRaw, resolvedCity);
                    if (typeof preset === 'number' && preset > 0) nextNg = preset;
                } catch (_) { /* ignora erro */ }

                setData(prev => ({
                    ...prev,
                    location: `${resolvedCity} - ${ufRaw}`,
                    mapRegion: getRegionFromState(ufRaw) as any,
                    ng: (typeof nextNg === 'number') ? nextNg : prev.ng
                }));
            } catch (_) { /* silencioso */ }
        };

        syncFromAddress();
    }, [data.clientAddress]);

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
            // Mesclar probabilidades globais com overrides da zona (se houver)
            const zoneProbCalcs = mergeZoneProbabilities(probabilityCalculations, zone);
            const riskCalculations = calculateRisksForZone(
                eventCalculations, 
                zoneProbCalcs, 
                lossCalculations,
                data.selected_risk_components // Pass selections to the calculator
            );
            return { zone, lossCalculations, riskCalculations };
        });
    }, [data.zones, eventCalculations, probabilityCalculations, data.selected_risk_components]); // Add dependency

    // Memoized aggregation of risks from all zones
    const totalRiskResults = useMemo(() => aggregateRiskResults(zoneCalculations), [zoneCalculations]);

    // Helper to check if any zone defines probability overrides
    const anyZoneHasProbOverrides = useMemo(() => {
        return (data.zones || []).some(z => z?.probability_overrides && Object.keys(z.probability_overrides).length > 0);
    }, [data.zones]);

    // Memoized calculation for frequencies (F)
    const frequencyResults = useMemo(() => {
        if (anyZoneHasProbOverrides) {
            // Aggregate frequency across zones using per-zone probability overrides
            return aggregateFrequenciesForZones(
                data.zones,
                eventCalculations,
                probabilityCalculations,
                data.frequency_config,
                data.has_electric_line,
                data.has_data_line
            );
        }
        // Fallback to global calculation when no overrides are present to avoid duplicating totals
        return calculateFrequencies(
            eventCalculations,
            probabilityCalculations,
            data.frequency_config,
            data.has_electric_line,
            data.has_data_line
        );
    }, [
        data.zones,
        eventCalculations,
        probabilityCalculations,
        data.frequency_config,
        data.has_electric_line,
        data.has_data_line,
        anyZoneHasProbOverrides
    ]);

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

    // Restaura o preset padrão solicitado (CLD/CLI 1.1, Uw: elétrico 2.5 kV, dados 1.5 kV, Não blindada)
    const restoreDefaultPreset = useCallback(() => {
        setData(prev => ({
            ...prev,
            probability_data: {
                ...prev.probability_data,
                // Elétrica - Externa
                is_shielded_electric_ext: false,
                rs_electric_ext: 20,
                Uw_electric_ext: 2.5,
                CLD_electric_ext: 1,
                CLI_electric_ext: 1,
                PLD_electric_ext: calculatePld(20, 2.5, false),
                // Elétrica - Interna
                CLD_electric_int: 1,
                Ks3_electric_int: 1,
                Uw_electric_int: 2.5,
                // Dados - Externa
                is_shielded_data_ext: false,
                rs_data_ext: 20,
                Uw_data_ext: 1.5,
                CLD_data_ext: 1,
                CLI_data_ext: 1,
                PLD_data_ext: calculatePld(20, 1.5, false),
                // Dados - Interna
                CLD_data_int: 1,
                Ks3_data_int: 1,
                Uw_data_int: 1.5,
            }
        }));
    }, []);

    // Reseta todo o projeto para o estado inicial com preset padrão
    const resetToInitialPreset = useCallback(() => {
        try { localStorage.removeItem(STORAGE_KEY); } catch (_) { /* silencioso */ }
        setData({ ...initialInputData });
    }, []);


    return { data: fullAnalysisData, updateData, restoreDefaultPreset, resetToInitialPreset };
}