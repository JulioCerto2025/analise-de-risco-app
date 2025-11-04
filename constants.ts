export const CD_OPTIONS = [
    { value: 0.25, label: 'Estrut. cercada p/ estrut. maiores 0,25' },
    { value: 0.5, label: 'Estrut. cercada p obj  alt igual ou menores 0,5' },
    { value: 1, label: 'Estrutura isolada em terreno plano 1' },
    { value: 2, label: 'Estrutura isolada no topo de um morro ou colina 2' }
];

export const CI_OPTIONS = [
    { value: 1, label: 'Aéreo 1' },
    { value: 0.5, label: 'Enterrado 0,5' },
    { value: 0.01, label: 'Enterrado em malha 0,01' }
];

export const CE_OPTIONS = [
    { value: 1, label: 'Rural 1' },
    { value: 0.5, label: 'Suburbano 0,5' },
    { value: 0.1, label: 'Urbano 0,1' },
    { value: 0.01, label: 'Urbano denso 0,01' }
];

export const CT_OPTIONS_ELECTRIC = [
    { value: 1, label: 'BT ou sinal 1' },
    { value: 0.2, label: 'AT com transformador 0,2' }
];

export const CT_OPTIONS_DATA = [
    { value: 1, label: 'Linha de dados/sinal 1' }
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
    { value: 1, label: "Não protegida 1" }, 
    { value: 0.2, label: "SPDA Nível IV 0,2" }, 
    { value: 0.1, label: "SPDA Nível III 0,1" }, 
    { value: 0.05, label: "SPDA Nível II 0,05" }, 
    { value: 0.02, label: "SPDA Nível I 0,02" },
    { value: 0.01, label: "SPDA Nível I+ 0,01" },
    { value: 0.001, label: "SPDA Nível I++ 0,001" }
];

export const PSPD_OPTIONS = [
    { value: 1, label: "Sem DPS 1" }, 
    { value: 0.05, label: "DPS III e IV 0,05" }, 
    { value: 0.02, label: "DPS II 0,02" },
    { value: 0.01, label: "DPS I 0,01" }
];

export const RP_OPTIONS = [
    { value: 1, label: "Nenhuma 1" }, 
    { value: 0.5, label: "Não Automática 0,5" }, 
    { value: 0.2, label: "Automática 0,2" }
];

// From ProbabilityStep
export const PTA_OPTIONS = [
    { value: 1, label: "Nenhuma 1" },
    { value: 0.1, label: "Avisos de alerta 0,1" },
    { value: 0.01, label: "Isolamento elétrico 0,01" },
    { value: 0.01, label: "Equip. Solo 0,01" },
    { value: 0.001, label: "Est Metálica ou CA 0,001" },
    { value: 0.0001, label: "Equip Solo + Isol. Desc 0,0001" },
    { value: 0, label: "Restrições Acesso 0" }
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
    { value: 1, label: "Sem Proteção 1" },
    { value: 0.1, label: "Alertas Visíveis 0,1" },
    { value: 0.01, label: "Isolação elétrica 0,01" },
    { value: 0, label: "Restrições físicas 0" }
];

export const KS3_OPTIONS = [
    { value: 1, label: "Laços ≤ 50m² 1" },
    { value: 0.5, label: "Laços ≤ 25m² 0,5" },
    { value: 0.2, label: "Laços ≤ 10m² 0,2" },
    { value: 0.01, label: "Laços ≤ 0,5m² 0,01" },
    { value: 0.0001, label: "Blind. Met. 0,0001" }
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
export const RT_OPTIONS = [
    { value: 0.01, label: "Terra, concreto 0,01" }, 
    { value: 0.001, label: "Mármore, cerâmica 0,001" }, 
    { value: 0.0001, label: "Brita, tapete, carpete 0,0001" }, 
    { value: 0.00001, label: "Asfalto, linóleo, madeira 0,00001" }
];
export const RF_OPTIONS = [{ value: 0.001, label: "Baixo 0,001" }, { value: 0.01, label: "Médio 0,01" }, { value: 0.1, label: "Alto 0,1" }, { value: 1, label: "Explosivo 1" }];
export const HZ_OPTIONS = [{ value: 1, label: "Nenhum 1" }, { value: 2, label: "Baixo 2" }, { value: 5, label: "Médio 5" }, { value: 10, label: "Alto 10" }];
export const LF_OPTIONS = [
    { value: 0.1, label: 'Hospital, hotel, escola, edifício cívico 0,1' },
    { value: 0.1, label: 'Risco de explosão 0,1' },
    { value: 0.05, label: 'Entretenimento público, igreja, museu 0,05' },
    { value: 0.02, label: 'Industrial, comercial 0,02' },
    { value: 0.01, label: 'Outros 0,01' }
];
export const LO_OPTIONS = [
  { value: 0.1, label: 'Risco de explosão 0,1' },
  { value: 0.01, label: 'UTI/Centro Cirúrgico D3 0,01' },
  { value: 0.001, label: 'Outras partes de hospital D3 0,001' }
];
export const LF3_OPTIONS = [{ value: 0.1, label: 'Museus, galerias 0,1' }];
export const LF4_OPTIONS = [{ value: 0.5, label: 'Hospital, industrial, museu 0,5' }, { value: 0.2, label: 'Hotel, escola, escritório 0,2' }];
export const LO4_OPTIONS = [{ value: 0.01, label: 'Hospital, Industrial 0,01' }];