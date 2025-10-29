export const CD_OPTIONS = [
    { value: 0.25, label: 'Estrutura rodeada por estruturas mais altas' },
    { value: 0.5, label: 'Estrutura rodeada por objetos da mesma altura ou menores' },
    { value: 1, label: 'Estrutura isolada em terreno plano' },
    { value: 2, label: 'Estrutura isolada no topo de um morro ou colina' }
];

export const CI_OPTIONS = [
    { value: 1, label: 'Aéreo' },
    { value: 0.5, label: 'Enterrado' },
    { value: 0.01, label: 'Enterrado em malha' }
];

export const CE_OPTIONS = [
    { value: 1, label: 'Rural' },
    { value: 0.5, label: 'Suburbano' },
    { value: 0.1, label: 'Urbano' },
    { value: 0.01, label: 'Urbano denso' }
];

export const CT_OPTIONS_ELECTRIC = [
    { value: 1, label: 'BT ou sinal' },
    { value: 0.2, label: 'AT com transformador' }
];

export const CT_OPTIONS_DATA = [
    { value: 1, label: 'Linha de dados/sinal' }
];

export const RISK_COMPONENTS_DEFS: { [key: string]: { description: string, type: string } } = {
    RA: { description: "Choque elétrico (Estrutura)", type: 'D1' },
    RB: { description: "Danos físicos (Estrutura)", type: 'D2' },
    RC: { description: "Falha de sistemas internos (Estrutura)", type: 'D3' },
    RM: { description: "Falha de sistemas internos (Proximidade)", type: 'D3' },
    RU: { description: "Choque elétrico (Linha)", type: 'D1' },
    RV: { description: "Danos físicos (Linha)", type: 'D2' },
    RW: { description: "Falha de sistemas internos (Linha)", type: 'D3' },
    RZ: { description: "Falha sistemas int. (Surto Induzido)", type: 'D3' },
    R1: { description: "Perda de vida humana", type: 'D1' },
    R3: { description: "Perda de patrimônio cultural", type: 'D2' },
    R4: { description: "Perda de valor econômico", type: 'D3' }
};

export const TOLERABLE_RISKS: { [key: string]: number } = {
    R1: 1e-5,
    R3: 1e-3,
    R4: 1e-3
};


export const DAMAGE_TYPES = {
    D1: { color: '#EF4444' }, // Red for Loss of life
    D2: { color: '#F59E0B' }, // Orange for Physical Damage
    D3: { color: '#3B82F6' }  // Blue for System Failure
};

export const STEPS = [
    "Informações do Projeto",
    "Componentes de Risco",
    "Densidade de Descargas",
    "Características da Estrutura",
    "Linhas Conectadas",
    "Eventos Danosos",
    "Probabilidade de Dano",
    "Perda Consequente",
    "Riscos Calculados",
    "Frequência de Danos",
    "Conclusão e Relatório"
];

// Options for Probability and Loss Steps, centralized for reuse in ReportStep simulator
export const PB_OPTIONS = [
    { value: 1, label: "Não protegida" }, 
    { value: 0.2, label: "SPDA Nível IV" }, 
    { value: 0.1, label: "SPDA Nível III" }, 
    { value: 0.05, label: "SPDA Nível II" }, 
    { value: 0.02, label: "SPDA Nível I" },
    { value: 0.01, label: "SPDA Nível I+" },
    { value: 0.001, label: "SPDA Nível I++" }
];

export const PSPD_OPTIONS = [
    { value: 1, label: "Sem DPS" }, 
    { value: 0.05, label: "DPS III e IV" }, 
    { value: 0.02, label: "DPS II" },
    { value: 0.01, label: "DPS I" }
];

export const RP_OPTIONS = [
    { value: 1, label: "Nenhuma" }, 
    { value: 0.5, label: "Não Automática" }, 
    { value: 0.2, label: "Automática" }
];

// From ProbabilityStep
export const PTA_OPTIONS = [
    { value: 1, label: "Nenhuma" },
    { value: 0.1, label: "Avisos de alerta" },
    { value: 0.01, label: "Isolamento elétrico" },
    { value: 0.01, label: "Equip. Solo" },
    { value: 0.001, label: "Est Metálica ou CA" },
    { value: 0.0001, label: "Equip Solo + Isol. Desc" },
    { value: 0, label: "Restrições Acesso" }
];

export const COMBINED_CLD_CLI_OPTIONS = [
    { value: '1_1', label: 'L. Elét. aérea ou subt. n/ blind. (CLD=1, CLI=1)' },
    { value: '1_0.2', label: 'L. Elét. neutro multiat. (CLD=1, CLI=0.2)' },
    { value: '1_0.3', label: 'L. Elét. subt. blind. n/ equipot. c/ equip. (CLD=1, CLI=0.3)' },
    { value: '1_0.1', label: 'L. Elét. aérea blind. n/ equipot. c/ equip. (CLD=1, CLI=0.1)' },
    { value: '1_0',   label: 'L. Elét. aérea/subt. blind. equip. c/ equip. (CLD=1, CLI=0)' },
    { value: '0_0',   label: 'Linha/Cabo sem risco (Isolada, Metálica, Fibra, etc.) (CLD=0, CLI=0)' },
];

export const PTU_OPTIONS = [
    { value: 1, label: "Sem Proteção" },
    { value: 0.1, label: "Alertas Visíveis" },
    { value: 0.01, label: "Isolação elétrica" },
    { value: 0, label: "Restrições físicas" }
];

export const KS3_OPTIONS = [
    { value: 1, label: "Laços ≤ 50m²" },
    { value: 0.5, label: "Laços ≤ 25m²" },
    { value: 0.2, label: "Laços ≤ 10m²" },
    { value: 0.01, label: "Laços ≤ 0,5m²" },
    { value: 0.0001, label: "Blind. Met." }
];

export const UW_OPTIONS = [
    { value: 0.35, label: "0,35 kV" },
    { value: 0.5, label: "0,5 kV" },
    { value: 1.0, label: "1,0 kV" },
    { value: 1.5, label: "1,5 kV" },
    { value: 2.5, label: "2,5 kV" },
    { value: 4.0, label: "4,0 kV" },
    { value: 6.0, label: "6,0 kV" },
];

// From LossStep
export const RT_OPTIONS = [{ value: 0.01, label: "Terra" }, { value: 0.001, label: "Mármore/Cerâmica" }, { value: 0.0001, label: "Brita" }, { value: 0.00001, label: "Asfalto" }];
export const RF_OPTIONS = [{ value: 0.001, label: "Baixo" }, { value: 0.01, label: "Médio" }, { value: 0.1, label: "Alto" }, { value: 1, label: "Explosivo" }];
export const HZ_OPTIONS = [{ value: 1, label: "Nenhum" }, { value: 2, label: "Baixo" }, { value: 5, label: "Médio" }, { value: 10, label: "Alto" }];
export const LF_OPTIONS = [{ value: 0.1, label: 'Hospital/Hotel/Escola D2' }, { value: 0.02, label: 'Industrial/Comercial D2' }, { value: 0.01, label: 'Outros D2' }];
export const LO_OPTIONS = [{ value: 0.01, label: 'UTI/Centro Cirúrgico D3' }, { value: 0.001, label: 'Outras partes de hospital D3' }, { value: 0, label: 'Não é um hospital' }];
export const LF3_OPTIONS = [{ value: 0.1, label: 'Museus, galerias' }];
export const LF4_OPTIONS = [{ value: 0.5, label: 'Hospital, industrial, museu' }, { value: 0.2, label: 'Hotel, escola, escritório' }];
export const LO4_OPTIONS = [{ value: 0.01, label: 'Hospital, Industrial' }];