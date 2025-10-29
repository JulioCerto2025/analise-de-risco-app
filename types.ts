export interface LineSection {
  id: string;
  ll: number;
  ci: number;
  ct: number;
  ce: number;
}

export interface CalculationResults {
  ad: number;
  adp: number;
  adf: number;
  am: number;
  al1: number;
  al2: number;
  ai1: number;
  ai2: number;
  nd: number;
  nm: number;
  nl_electric: number;
  nl_data: number;
  ni_electric: number;
  ni_data: number;
  nadj_electric: number;
  nadj_data: number;
  ad_adj_1: number;
  ad_adj_2: number;
}

export interface SelectedRiskComponents {
  RA: boolean;
  RB: boolean;
  RC: boolean;
  RM: boolean;
  RU: boolean;
  RV: boolean;
  RW: boolean;
  RZ: boolean;
}

export interface FrequencyConfig {
  is_critical_system: boolean;
  has_equipment_in_ZPR0A: boolean;
}

export interface ProbabilityData {
  // For structure
  PTA: number;
  PB: number;
  wm1: number; // Mesh width for ZPR0 -> ZPR1 (replaces Ks1 selection)
  wm2: number; // Mesh width for ZPR1 -> ZPR2 (replaces Ks2 selection)
  
  // For electric line
  PSPD_electric: number;
  CLD_electric: number;
  PTU_electric: number;
  PEB_electric: number; 
  PLD_electric: number; 
  CLI_electric: number;
  Ks3_electric: number;
  Uw_electric: number;
  is_shielded_electric: boolean;
  rs_electric: number; // Shield resistance in Ω/km
  
  // For data line
  PSPD_data: number;
  CLD_data: number;
  PTU_data: number;
  PEB_data: number;
  PLD_data: number;
  CLI_data: number;
  Ks3_data: number;
  Uw_data: number;
  is_shielded_data: boolean;
  rs_data: number; // Shield resistance in Ω/km
}

export interface LossData {
  // R1
  nz?: number;
  nt?: number;
  tz?: number;
  te?: number;
  rt?: number;
  rp?: number;
  rf?: number;
  hz?: number;
  LF?: number;
  LO?: number;
  rs?: number;
  
  // R3
  lf3?: number;
  cz?: number;
  ct_cultural?: number;

  // R4
  lf4?: number;
  lo4?: number;
  lt4?: number;
  ca?: number;
  cb?: number;
  cc?: number;
  cs?: number;
  ce?: number;
  ct_economic?: number;
}

export interface Zone {
  id: string;
  name: string;
  loss_data: Partial<LossData>;
}

export interface FireRiskInfo {
    rf: number;
    explanation: string;
}

export interface PreliminaryAiResult {
    rf: number;
    hz: number;
    nz: number;
    rp: number;
    tz: number;
    explanation: string;
}

export interface CalculatedData {
    calculations: Partial<CalculationResults>;
    probability_calculations: { [key: string]: number };
    loss_calculations: { [key: string]: any }; // Loss for the first zone, for UI display
    risk_results: { [key: string]: number };
    frequency_results: { [key: string]: number };
}

export interface AnalysisInputData {
  projectName: string;
  clientName: string;
  clientAddress: string;
  projectDate: string;
  technicalManagerName: string;
  licenseNumber: string;
  zones: Zone[];
  h: number;
  l: number;
  w: number;
  hp: number;
  ng?: number;
  location: string;
  mapRegion: string;
  cd: number;
  has_electric_line: boolean;
  line_sections_1: LineSection[];
  use_adj_structure_1: boolean;
  l_adj_1: number;
  w_adj_1: number;
  h_adj_1: number;
  hp_adj_1: number;
  cd_adj_1: number;
  has_data_line: boolean;
  line_sections_2: LineSection[];
  use_adj_structure_2: boolean;
  l_adj_2: number;
  w_adj_2: number;
  h_adj_2: number;
  hp_adj_2: number;
  cd_adj_2: number;
  selected_risk_components: SelectedRiskComponents;
  risks_to_analyze: {
    R1: boolean;
    R3: boolean;
    R4: boolean;
  };
  frequency_config: FrequencyConfig;
  probability_data: ProbabilityData;
  analyze_data_line_probabilities: boolean;
    
  // Background AI analysis state
  fireRiskAiResult?: FireRiskInfo | null;
  fireRiskAiStatus?: 'idle' | 'loading' | 'success' | 'error';
  fireRiskAiError?: string | null;

  preliminaryAiResult?: PreliminaryAiResult | null;
  preliminaryAiStatus?: 'idle' | 'loading' | 'success' | 'error';
  preliminaryAiError?: string | null;
}


// Represents the complete data structure, combining inputs and calculated results.
export type AnalysisData = AnalysisInputData & CalculatedData;


// Data calculated per zone, used internally in the processing pipeline.
export interface ZoneCalculations {
    zone: Zone;
    lossCalculations: { [key: string]: any };
    riskCalculations: { [key: string]: number };
}