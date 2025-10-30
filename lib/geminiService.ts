import { GoogleGenAI } from "@google/genai";
import { NG_DOCUMENT_CONTENT } from '../data/ng-document-content';
import { AnalysisData, FireRiskInfo, PreliminaryAiResult, ProbabilityData } from '../types';
import {
    PB_OPTIONS,
    PSPD_OPTIONS,
    RP_OPTIONS,
    PTA_OPTIONS,
    PTU_OPTIONS,
    KS3_OPTIONS,
    UW_OPTIONS,
    RT_OPTIONS,
    RF_OPTIONS,
    HZ_OPTIONS,
    LF_OPTIONS,
    LO_OPTIONS,
    LF3_OPTIONS,
    LF4_OPTIONS,
    LO4_OPTIONS
} from '../constants';


/**
 * Corrects spelling, grammar, and accents in a Portuguese text string using the Gemini API.
 * @param text The text to correct.
 * @returns A promise that resolves to the corrected text string, or the original text on error.
 */
export async function correctText(text: string): Promise<string> {
    // Avoid API calls for empty or very short strings
    if (!text || text.trim().length < 3) {
        return text;
    }

    const apiKey = (import.meta as any)?.env?.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        // Sem API key: não bloquear UI, retornar o próprio texto
        return text;
    }
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
        Corrija o seguinte texto em português do Brasil, ajustando a ortografia, acentuação e capitalização de forma sutil e natural. Mantenha a intenção original.
        Responda APENAS com o texto corrigido, sem nenhuma introdução, explicação, ou aspas ao redor.

        Texto original: "${text}"
        
        Texto corrigido:`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.2, // Lower temperature for more predictable corrections
            }
        });

        const correctedText = response.text.trim();
        
        // Return the corrected text if it's not empty, otherwise fallback to original
        return correctedText || text;
    } catch (error) {
        console.error("Error correcting text with Gemini API:", error);
        return text; // Fallback to original text in case of an API error
    }
}

interface LocationResult {
    location: string; // "City - State"
    ng: number;
    latitude: number;
    longitude: number;
}


/**
 * Gets Ng value and geographic coordinates from a textual address using the Gemini API.
 * @param address The full address of the project.
 * @returns A promise that resolves to a LocationResult object or null on error.
 */
export async function getNgFromAddress(address: string): Promise<LocationResult | null> {
    if (!address || address.trim().length < 5) {
        return null;
    }
    const apiKey = (import.meta as any)?.env?.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        return null;
    }
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
        Você é um especialista em geolocalização e na norma NBR 5419-2.
        Sua tarefa é analisar o endereço fornecido, encontrar suas coordenadas geográficas e o valor de Densidade de Descargas Atmosféricas (Ng) no documento de referência.

        Endereço Fornecido: "${address}"

        Instruções:
        1.  Identifique a cidade e o estado (UF) a partir do endereço.
        2.  Busque as coordenadas geográficas (latitude e longitude) para o centro da cidade identificada. Use uma casa decimal de precisão.
        3.  Consulte a lista de cidades no documento de referência abaixo. Encontre o valor de Ng para a cidade identificada.
        4.  Se a cidade exata não estiver na lista, encontre a cidade mais próxima DENTRO DO MESMO ESTADO e use o valor de Ng dela como uma aproximação.
        5.  Responda em um formato JSON estrito, contendo as chaves "location" (no formato "Cidade - UF"), "ng" (número), "latitude" (número), e "longitude" (número). Não inclua markdown (\`\`\`json\`\`\`) na sua resposta.

        Exemplo de Resposta para o endereço "Av. Paulista, 1578, São Paulo, SP":
        {
          "location": "São Paulo - SP",
          "ng": 6.8,
          "latitude": -23.6,
          "longitude": -46.6
        }
        
        --- INÍCIO DO DOCUMENTO DE REFERÊNCIA Ng ---
        ${NG_DOCUMENT_CONTENT}
        --- FIM DO DOCUMENTO DE REFERÊNCIA Ng ---
      `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const jsonString = response.text;
        const result = JSON.parse(jsonString);

        if (result.location && typeof result.location === 'string' &&
            result.ng !== undefined && typeof result.ng === 'number' &&
            result.latitude !== undefined && typeof result.latitude === 'number' &&
            result.longitude !== undefined && typeof result.longitude === 'number'
        ) {
            return result as LocationResult;
        }
        console.warn("Gemini response for getNgFromAddress did not match expected format:", result);
        return null;
    } catch (error) {
        console.error("Error getting Ng from address with Gemini API:", error);
        return null;
    }
}

/**
 * Gets fire risk factor (rf) from the Gemini API based on project location and type.
 * @param projectName A description of the building/project to infer its occupation.
 * @param address The full address of the project.
 * @returns A promise that resolves to a FireRiskInfo object or null.
 */
export async function getFireRiskFactor(projectName: string, address: string): Promise<FireRiskInfo | null> {
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY! });

    const prompt = `
    Aja como um engenheiro especialista em segurança contra incêndio e pânico.
    Sua tarefa é consultar as normas do Corpo de Bombeiros para a localidade fornecida, determinar o risco de incêndio e recomendar o fator 'rf' da NBR 5419-2.

    **Dados de Entrada:**
    - Ocupação/Tipo do Projeto: "${projectName}"
    - Endereço do Projeto: "${address}"

    **Sua Tarefa:**
    1.  **Análise:** Identifique a ocupação, classifique o risco (Baixo, Médio, Alto) com base nas normas do CB do estado, e determine o valor de 'rf' correspondente (0.001, 0.01, 0.1).
    2.  **Justificativa:** Elabore uma explicação concisa em markdown detalhando seu raciocínio.
    3.  **Resposta JSON:** Responda em um formato JSON ESTRITO, sem markdown ao redor, com as chaves "rf" (número) e "explanation" (string).

    **Exemplo de Resposta JSON:**
    {
      "rf": 0.01,
      "explanation": "**Análise de Risco de Incêndio:**\\n\\n*   **Ocupação Provável:** Comercial (Shopping Center).\\n*   **Classificação de Risco:** Conforme a IT-XX do CB local, a ocupação é de **Risco Médio**.\\n*   **Recomendação de 'rf':** Para Risco Médio, o fator 'rf' sugerido é **0.01**"
    }
    `;

    // Guardar contra falta de API key
    const apiKey2 = (import.meta as any)?.env?.VITE_GEMINI_API_KEY;
    if (!apiKey2) {
        return null;
    }
    const ai2 = new GoogleGenAI({ apiKey: apiKey2 });
    try {
        const response = await ai2.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.2,
            }
        });
        const jsonString = response.text;
        const result = JSON.parse(jsonString);

        if (result && typeof result.rf === 'number' && typeof result.explanation === 'string') {
            return result as FireRiskInfo;
        }
        return null;
    } catch (error) {
        console.error("Error getting fire risk factor with Gemini API:", error);
        return null;
    }
}

export async function getPreliminaryAnalysis(projectName: string, address: string): Promise<PreliminaryAiResult | null> {
    if (!projectName || !address) return null;

    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY! });
    
    const prompt = `
        Aja como um engenheiro sênior especialista em segurança contra incêndio e pânico, com profundo conhecimento das Instruções Técnicas (ITs) do Corpo de Bombeiros (CB) brasileiro.
        Sua tarefa é realizar uma análise preliminar completa, consultando as normas do CB para a localidade especificada.

        **Dados de Entrada:**
        - **Descrição do Projeto:** "${projectName}"
        - **Endereço do Projeto:** "${address}"

        **Sua Tarefa (Análise e Resposta JSON):**
        1.  **Consulta às Normas:** Com base no endereço e na descrição (principalmente altura e uso), determine as exigências prováveis do Corpo de Bombeiros local. Foque em:
            *   Tipo de saída de emergência (escada) exigida. (Ex: Edifícios > 23m de altura geralmente exigem Escada Enclausurada à Prova de Fumaça - EPF).
            *   Sistemas de alarme, iluminação, sinalização e extintores/hidrantes.
            *   Necessidade de detecção automática de fumaça.
        2.  **Análise de Risco de Incêndio (rf):** Classifique o risco (Baixo, Médio, Alto) e atribua o 'rf' (0.001, 0.01, 0.1). **REGRA CRÍTICA:** Edificações residenciais multifamiliares (Grupo A, divisão A-2) possuem carga de incêndio de 300 MJ/m², o que é classificado como **RISCO BAIXO**. Para projetos A-2, o fator 'rf' deve ser **0.001**.
        3.  **Análise de Pânico (hz):** Avalie o nível de pânico com base na robustez das rotas de fuga. **Quanto mais protegida a rota de fuga, menor o pânico.** Uma escada enclausurada e à prova de fumaça (EPF) indica **Pânico Baixo (hz=2)**. Uma escada protegida simples também indica Pânico Baixo (hz=2). A presença de iluminação e sinalização de emergência também reduz o pânico. Atribua 'hz' (1, 2, 5, 10).
        4.  **Estimativa de População (nz):** **REGRA CRÍTICA:** Para edificações residenciais, use uma média de moradores por unidade (ex: 4 pessoas por apartamento), conforme padrões do IBGE e práticas do CB, em vez de densidade por m². Calcule 'nz' com base no número de unidades.
        5.  **Tempo de Permanência (tz):** Com base no perfil de uso (residencial, comercial 8h/dia, hospital 24h), estime o tempo médio que uma pessoa permanece na edificação em horas por ano (tz). Para um residencial, um valor comum é 70% a 80% de 8760 horas (ex: 6903h).
        6.  **Medidas de Proteção (rp):** **SEJA CUIDADOSO AQUI.** Diferencie sistemas **automáticos** (que incluem detectores de fumaça, acionadores de sprinklers) de sistemas **não-automáticos** (acionamento humano, como hidrantes e alarmes por botoeira manual). A menos que a presença de detectores automáticos seja explícita, presuma que o sistema é **Não Automático (rp = 0.5)**.
        7.  **Justificativa Detalhada (explanation):** Crie um parecer técnico em Markdown BEM ESTRUTURADO. Use títulos (##), listas (*) e negrito (**). Garanta espaçamento. Conecte as exigências do CB (especialmente o tipo de escada) diretamente às suas decisões sobre 'hz', 'rp' e 'tz'.
        8.  **Formato da Resposta:** Responda em um formato JSON ESTRITO, sem markdown ao redor, com as chaves "rf", "hz", "nz", "rp", "tz", e "explanation".

        **Exemplo de Resposta para um Edifício Residencial de 8 andares (FORMATO MELHORADO):**
        {
          "rf": 0.001,
          "hz": 2,
          "nz": 128,
          "rp": 0.5,
          "tz": 6903,
          "explanation": "## Análise Preliminar de Segurança (Corpo de Bombeiros)\\n\\nCom base na descrição do projeto e na localização, esta é uma avaliação preliminar das exigências de segurança e dos fatores de risco correspondentes.\\n\\n### Exigências Prováveis do CB\\nPara um edifício residencial multifamiliar com altura de 24m, as Instruções Técnicas (ITs) locais geralmente exigem:\\n*   **Saídas de Emergência:** Escada Enclausurada à Prova de Fumaça (EPF), por se tratar de edificação com altura superior a 23m.\\n*   **Sistemas de Apoio:** Iluminação de Emergência, Sinalização de Rota de Fuga, Extintores e Hidrantes.\\n*   **Alarme:** Alarme de Incêndio (acionado por botoeiras manuais).\\n\\nNão costuma ser exigido um Sistema de Detecção Automática (com detectores de fumaça) para este perfil residencial.\\n\\n### Fatores de Risco Derivados\\n\\n*   **Risco de Incêndio (rf):** A ocupação A-2 (Residencial Multifamiliar) possui carga de incêndio de 300 MJ/m², classificada como **Risco Baixo**. \\n  **Fator rf = 0.001**.\\n\\n*   **Medidas de Proteção (rp):** A principal medida ativa exigida (hidrantes e alarme por botoeira) é de acionamento manual, classificando-se como **Não Automática**. A ausência de detectores automáticos é o fator preponderante. \\n  **Fator rp = 0.5**.\\n\\n*   **Pânico (hz):** A exigência de uma **Escada Enclausurada à Prova de Fumaça (EPF)**, somada à iluminação e sinalização de emergência, garante uma rota de fuga altamente segura e protegida contra fumaça, resultando em um cenário de **Pânico Baixo**. \\n  **Fator hz = 2**.\\n\\n*   **População (nz):** Considerando 32 apartamentos com uma média de 4 moradores por unidade (padrão IBGE/CB), a população estimada é de **nz = 128**.\\n\\n*   **Tempo de Permanência (tz):** Para uso residencial, considera-se uma permanência de aproximadamente 78% do ano (incluindo sono, lazer, etc.).\\n  **Fator tz = 6903 horas/ano**."
        }
    `;

    const apiKey3 = (import.meta as any)?.env?.VITE_GEMINI_API_KEY;
    if (!apiKey3) {
        return null;
    }
    const ai3 = new GoogleGenAI({ apiKey: apiKey3 });
    try {
        const response = await ai3.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.3,
            }
        });
        const jsonString = response.text;
        const result = JSON.parse(jsonString);

        if (result && typeof result.rf === 'number' && typeof result.hz === 'number' && typeof result.nz === 'number' && typeof result.rp === 'number' && typeof result.tz === 'number' && typeof result.explanation === 'string') {
            return result as PreliminaryAiResult;
        }
        return null;
    } catch (error) {
        console.error("Error in preliminary analysis with Gemini API:", error);
        return null;
    }
}


function getOptionLabel(options: {value: any, label: string}[], value: any): string {
    const option = options.find(opt => String(opt.value) === String(value));
    return option ? option.label : `Valor ${value}`;
}

function buildDetailedCalculations(data: AnalysisData): string {
    const { calculations: c, probability_calculations: pc, loss_calculations: lc, risk_results: r, frequency_results: f, probability_data: p, zones, selected_risk_components } = data;
    const ld = zones[0]?.loss_data || {};
    let details = '';

    // Section 4.3: Probabilities
    details += `### 4.3. Probabilidades de Dano (P)\n\n`;
    details += `**PA - Danos a seres vivos por choque (Descarga na Estrutura)**\n* *Fórmula:* PA = PTA × PB\n* *Variáveis:*\n    * PTA: **${p.PTA}** (${getOptionLabel(PTA_OPTIONS, p.PTA)})\n    * PB: **${p.PB}** (${getOptionLabel(PB_OPTIONS, p.PB)})\n* *Cálculo:* PA = ${p.PTA} × ${p.PB}\n* *Resultado:* **PA = ${pc.PA?.toExponential(3)}**\n\n`;
    details += `**PB - Danos físicos (Descarga na Estrutura)**\n* *Fórmula:* PB = PB\n* *Variáveis:*\n    * PB (Nível do SPDA): **${p.PB}** (${getOptionLabel(PB_OPTIONS, p.PB)})\n* *Resultado:* **PB = ${pc.PB?.toExponential(3)}**\n\n`;
    if (data.has_electric_line) details += `**PC - Falha de sistemas (Descarga na Estrutura, Linha Elétrica)**\n* *Fórmula:* PC = PSPDₑ × CLDₑ\n* *Variáveis:*\n    * PSPDₑ: **${p.PSPD_electric}** (${getOptionLabel(PSPD_OPTIONS, p.PSPD_electric)})\n    * CLDₑ: **${p.CLD_electric}**\n* *Cálculo:* PC = ${p.PSPD_electric} × ${p.CLD_electric}\n* *Resultado:* **PC = ${pc.PC?.toExponential(3)}**\n\n`;
    if (data.has_data_line) details += `**PCT - Falha de sistemas (Descarga na Estrutura, Linha de Dados)**\n* *Fórmula:* PCT = PSPDₐ × CLDₐ\n* *Variáveis:*\n    * PSPDₐ: **${p.PSPD_data}** (${getOptionLabel(PSPD_OPTIONS, p.PSPD_data)})\n    * CLDₐ: **${p.CLD_data}**\n* *Cálculo:* PCT = ${p.PSPD_data} × ${p.CLD_data}\n* *Resultado:* **PCT = ${pc.PCT?.toExponential(3)}**\n\n`;
    if (data.has_electric_line) details += `**PM - Falha de sistemas (Descarga Próxima, Linha Elétrica)**\n* *Fórmula:* PM = PSPDₑ × (Ks1 × Ks2 × Ks3ₑ × Ks4ₑ)²\n* *Variáveis:*\n    * PSPDₑ: **${p.PSPD_electric}** (${getOptionLabel(PSPD_OPTIONS, p.PSPD_electric)})\n    * Ks1 (Malha wm1=${p.wm1}m): **${pc.Ks1?.toFixed(3)}**\n    * Ks2 (Malha wm2=${p.wm2}m): **${pc.Ks2?.toFixed(3)}**\n    * Ks3ₑ: **${p.Ks3_electric}** (${getOptionLabel(KS3_OPTIONS, p.Ks3_electric)})\n    * Ks4ₑ (Uw=${p.Uw_electric}kV): **${pc.Ks4_electric?.toFixed(3)}**\n* *Cálculo:* PM = ${p.PSPD_electric} × (${pc.Ks1?.toFixed(3)} × ${pc.Ks2?.toFixed(3)} × ${p.Ks3_electric} × ${pc.Ks4_electric?.toFixed(3)})²\n* *Resultado:* **PM = ${pc.PM?.toExponential(3)}**\n\n`;
    if (data.has_data_line) details += `**PU - Danos a seres vivos por choque (Descarga na Linha)**\n* *Fórmula:* PU = PTU × PEB × PLD × CLD\n* *Variáveis:*\n    * PTU: **${p.PTU_electric}** (${getOptionLabel(PTU_OPTIONS, p.PTU_electric)})\n    * PEB: **${p.PEB_electric}** (${getOptionLabel(PSPD_OPTIONS, p.PEB_electric)})\n    * PLD: **${p.PLD_electric?.toFixed(2)}**\n    * CLD: **${p.CLD_electric}**\n* *Cálculo:* PU = ${p.PTU_electric} × ${p.PEB_electric} × ${p.PLD_electric?.toFixed(2)} × ${p.CLD_electric}\n* *Resultado:* **PU = ${pc.PU?.toExponential(3)}**\n\n`;

    // Section 4.4: Losses
    details += `### 4.4. Perdas Consequentes (L) - ${zones[0]?.name}\n\n`;
    details += `**LA - Perda por choque elétrico**\n* *Fórmula:* LA = rt × 0.01 × (nz / nt) × (tz / 8760) × rs\n* *Variáveis:*\n    * rt (Resist. Piso): **${ld.rt}** (${getOptionLabel(RT_OPTIONS, ld.rt)})\n    * nz (Pessoas na Zona): **${ld.nz}**\n    * nt (Pessoas Total): **${ld.nt}**\n    * tz (Tempo na Zona): **${ld.tz}** h/ano\n    * rs (Tipo Estrutura): **${ld.rs}** (${ld.rs === 1 ? 'Robusta' : 'Simples'})\n* *Cálculo:* LA = ${ld.rt} × 0.01 × (${ld.nz} / ${ld.nt}) × (${ld.tz} / 8760) × ${ld.rs}\n* *Resultado:* **LA = ${lc.LA?.toExponential(3)}**\n\n`;
    details += `**LB - Perda por danos físicos (incêndio)**\n* *Fórmula:* LB = rs × rp × rf × hz × LF × (nz / nt) × (tz / 8760)\n* *Variáveis:*\n    * rs (Tipo Estrutura): **${ld.rs}** (${ld.rs === 1 ? 'Robusta' : 'Simples'})\n    * rp (Prot. Incêndio): **${ld.rp}** (${getOptionLabel(RP_OPTIONS, ld.rp)})\n    * rf (Risco Incêndio): **${ld.rf}** (${getOptionLabel(RF_OPTIONS, ld.rf)})\n    * hz (Pânico): **${ld.hz}** (${getOptionLabel(HZ_OPTIONS, ld.hz)})\n    * LF (Tipo Dano): **${ld.LF}** (${getOptionLabel(LF_OPTIONS, ld.LF)})\n    * nz, nt, tz: **${ld.nz}**, **${ld.nt}**, **${ld.tz}**\n* *Cálculo:* LB = ${ld.rs} × ${ld.rp} × ${ld.rf} × ${ld.hz} × ${ld.LF} × (${ld.nz} / ${ld.nt}) × (${ld.tz} / 8760)\n* *Resultado:* **LB = ${lc.LB?.toExponential(3)}**\n\n`;
    details += `**LC - Perda por falha de sistemas**\n* *Fórmula:* LC = LO × (nz / nt) × (tz / 8760) × rs\n* *Variáveis:*\n    * LO (Tipo Falha): **${ld.LO}** (${getOptionLabel(LO_OPTIONS, ld.LO)})\n    * nz, nt, tz, rs: **${ld.nz}**, **${ld.nt}**, **${ld.tz}**, **${ld.rs}**\n* *Cálculo:* LC = ${ld.LO} × (${ld.nz} / ${ld.nt}) × (${ld.tz} / 8760) × ${ld.rs}\n* *Resultado:* **LC = ${lc.LC?.toExponential(3)}**\n\n`;
    details += `**Demais Perdas:** LU=LA, LV=LB, LM=LW=LZ=LC.\n\n`;

    // Section 4.5: Risks
    details += `### 4.5. Componentes de Risco (R)\n\n`;
    const selectedRisksText = Object.entries(selected_risk_components)
        .filter(([,isSelected]) => isSelected)
        .map(([key]) => {
            const formulaMap: {[key: string]: string} = { RA: 'RA = Nd × PA × LA', RB: 'RB = Nd × PB × LB', RC: 'RC = Nd × PC × LC', RM: 'RM = Nm × PM × LM', RU: 'RU = Nl × PU × LU', RV: 'RV = Nl × PV × LV', RW: 'RW = Nl × PW × LW', RZ: 'RZ = Ni × PZ × LZ' }
            const riskValue = r[key as keyof typeof r];
            return `* **${key}:** ${formulaMap[key] || 'N/A'} -> Resultado: **${riskValue?.toExponential(3)}**`
        }).join('\n');
    details += selectedRisksText + '\n\n';

    // Section 4.6: Frequencies
    details += `### 4.6. Frequência de Danos a Sistemas (F)\n\n`;
    if(f.FB && data.frequency_config.has_equipment_in_ZPR0A) details += `**FB - Danos por descarga na estrutura (Equip. ZPR0A)**\n* *Fórmula:* FB = Nd × PB\n* *Cálculo:* FB = ${c.nd?.toExponential(3)} × ${pc.PB}\n* *Resultado:* **FB = ${f.FB?.toExponential(3)}**\n\n`;
    if(f.FC) details += `**FC - Danos por descarga na estrutura (Sistemas Internos)**\n* *Fórmula:* FC = Nd × PC_total\n* *Cálculo:* FC = ${c.nd?.toExponential(3)} × ${ (1 - (1-(pc.PC || 0)) * (1-(pc.PCT || 0))).toFixed(3) }\n* *Resultado:* **FC = ${f.FC?.toExponential(3)}**\n\n`;
    if(f.FM) details += `**FM - Danos por descarga próxima (Sistemas Internos)**\n* *Fórmula:* FM = Nm × PM_total\n* *Cálculo:* FM = ${c.nm?.toExponential(3)} × ${ (1 - (1-(pc.PM || 0)) * (1-(pc.PMT || 0))).toFixed(3) }\n* *Resultado:* **FM = ${f.FM?.toExponential(3)}**\n\n`;
    if(f.FV) details += `**FV - Danos por descarga na linha**\n* *Fórmula:* FV = Nlₑ × PEBₑ + Nlₐ × PEBₐ\n* *Cálculo:* FV = (${c.nl_electric?.toExponential(3)} × ${pc.PEB_electric}) + (${c.nl_data?.toExponential(3)} × ${pc.PEB_data})\n* *Resultado:* **FV = ${f.FV?.toExponential(3)}**\n\n`;
    if(f.FW) details += `**FW - Danos por surto na linha**\n* *Fórmula:* FW = Nlₑ × PW + Nlₐ × PWT\n* *Cálculo:* FW = (${c.nl_electric?.toExponential(3)} × ${pc.PW?.toExponential(3)}) + (${c.nl_data?.toExponential(3)} × ${pc.PWT?.toExponential(3)})\n* *Resultado:* **FW = ${f.FW?.toExponential(3)}**\n\n`;
    if(f.FZ) details += `**FZ - Danos por surto induzido na linha**\n* *Fórmula:* FZ = Niₑ × PZ + Niₐ × PZT\n* *Cálculo:* FZ = (${c.ni_electric?.toExponential(3)} × ${pc.PZ?.toExponential(3)}) + (${c.ni_data?.toExponential(3)} × ${pc.PZT?.toExponential(3)})\n* *Resultado:* **FZ = ${f.FZ?.toExponential(3)}**\n\n`;
    
    const fFormulaParts = [];
    if (data.frequency_config.has_equipment_in_ZPR0A) fFormulaParts.push('FB');
    fFormulaParts.push('FC', 'FM', 'FV', 'FW', 'FZ');

    details += `**F - Frequência Total de Danos**\n* *Fórmula:* F = ${fFormulaParts.join(' + ')}\n* *Cálculo:* F = ${fFormulaParts.map(key => f[key as keyof typeof f]?.toExponential(3) || 0).join(' + ')}\n* *Resultado:* **F = ${f.F?.toExponential(3)}**\n\n`;

    return details;
}

/**
 * Generates a full technical report in Markdown format using the Gemini API.
 * @param data The complete analysis data.
 * @returns A promise that resolves to the formatted report string.
 */
export async function generateFullReportText(data: AnalysisData): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY! });
    
    const { calculations: c, risk_results: r, frequency_results: f } = data;

    const preliminaryAnalysisSection = data.preliminaryAiResult?.explanation ? `
## 1. Análise Preliminar (Assistida por IA)
A análise foi iniciada com o auxílio de Inteligência Artificial para estabelecer parâmetros iniciais com base na descrição do projeto e nas normas aplicáveis do Corpo de Bombeiros. O parecer gerado foi o seguinte:

${data.preliminaryAiResult.explanation}
` : '';

    const sectionNumbering = {
        dados: preliminaryAnalysisSection ? 2 : 1,
        parametros: preliminaryAnalysisSection ? 3 : 2,
        calculos: preliminaryAnalysisSection ? 4 : 3,
        resultados: preliminaryAnalysisSection ? 5 : 4,
        parecer: preliminaryAnalysisSection ? 6 : 5,
    }

    const detailedCalculations = buildDetailedCalculations(data);

    const prompt = `
**ASSUNTO:** Memorial de Cálculo - Análise de Risco (NBR 5419-2:2015)

**INSTRUÇÕES:**
1.  Você é um engenheiro sênior especialista em SPDA.
2.  Redija um "Memorial de Cálculo" técnico, formal e didático em formato Markdown. O layout do texto é CRÍTICO. Ele deve ser ergonômico e visualmente agradável para um engenheiro ler. Use títulos de diferentes níveis (##, ###), negrito, listas com asteriscos e bastante espaçamento (linhas em branco) para criar uma hierarquia visual clara e uma leitura intuitiva.
3.  **NÃO USE CRASES (\`)** para formatar fórmulas ou valores.
4.  Use **negrito** (com asteriscos duplos) para destacar todos os **rótulos, variáveis e resultados finais** (ex: **Ad = 1234.56 m²**).
5.  O espaçamento é fundamental para a legibilidade. Insira linhas em branco entre os blocos de informação, como antes e depois de listas ou cálculos, para "arejar" o documento.
6.  Na seção de resultados, use emojis para indicar o resultado: ✅ para ACEITÁVEL, ❌ para NÃO ACEITÁVEL.

---

${preliminaryAnalysisSection}

## ${sectionNumbering.dados}. DADOS DO PROJETO
* **Projeto/Cliente:** ${data.clientName}
* **Endereço:** ${data.clientAddress}
* **Descrição:** ${data.projectName}
* **Data:** ${data.projectDate}
* **Responsável Técnico:** ${data.technicalManagerName} (${data.licenseNumber})

## ${sectionNumbering.parametros}. PARÂMETROS GERAIS DA ANÁLISE
* **Localização (Cidade/UF):** ${data.location}
* **Densidade de Descargas (Ng):** **${data.ng}** descargas/km²/ano
* **Geometria da Estrutura:** **${data.l}**m (C) x **${data.w}**m (L) x **${data.h}**m (A)
* **Fator de Localização (Cd):** **${data.cd}**

## ${sectionNumbering.calculos}. CÁLCULOS DETALHADOS

### ${sectionNumbering.calculos}.1. Áreas de Exposição Equivalentes
* **Área de Exposição (Ad):**
  * *Fórmula:* Ad = L×W + 2×(3H)×(L+W) + π×(3H)²
  * *Cálculo:* Ad = ${data.l}×${data.w} + 2×(3×${data.h})×(${data.l}+${data.w}) + π×(3×${data.h})²
  * *Resultado:* **Ad = ${c.ad?.toFixed(2)} m²**
* **Área de Exposição Final (Adf):**
  * *Resultado:* **Adf = ${c.adf?.toFixed(2)} m²** (Considerando protrusões)
* **Área de Exposição Próxima (Am):**
  * *Fórmula:* Am = 2×500×(L+W) + π×500²
  * *Cálculo:* Am = 2×500×(${data.l}+${data.w}) + π×500²
  * *Resultado:* **Am = ${c.am?.toFixed(2)} m²**
* **Área de Exposição da Linha Elétrica (Al1, Ai1):**
  * *Resultados:* **Al1 = ${c.al1?.toFixed(2)} m²**, **Ai1 = ${c.ai1?.toFixed(2)} m²**
* **Área de Exposição da Linha de Dados (Al2, Ai2):**
  * *Resultados:* **Al2 = ${c.al2?.toFixed(2)} m²**, **Ai2 = ${c.ai2?.toFixed(2)} m²**

### ${sectionNumbering.calculos}.2. Frequência Média Anual de Eventos Danosos (N)
* **Descargas na Estrutura (Nd):**
  * *Fórmula:* Nd = Ng × Adf × Cd × 10⁻⁶
  * *Cálculo:* Nd = ${data.ng} × ${c.adf?.toFixed(2)} × ${data.cd} × 10⁻⁶
  * *Resultado:* **Nd = ${c.nd?.toExponential(3)} eventos/ano**
* **Descargas Próximas (Nm):**
  * *Fórmula:* Nm = Ng × Am × 10⁻⁶
  * *Cálculo:* Nm = ${data.ng} × ${c.am?.toFixed(2)} × 10⁻⁶
  * *Resultado:* **Nm = ${c.nm?.toExponential(3)} eventos/ano**
* **Descargas na Linha Elétrica (Nl elétrico):**
  * *Resultado:* **Nl = ${c.nl_electric?.toExponential(3)} eventos/ano**
* **Surtos na Linha Elétrica (Ni elétrico):**
  * *Resultado:* **Ni = ${c.ni_electric?.toExponential(3)} eventos/ano**
* **Descargas na Linha de Dados (Nl dados):**
  * *Resultado:* **Nl = ${c.nl_data?.toExponential(3)} eventos/ano**
* **Surtos na Linha de Dados (Ni dados):**
  * *Resultado:* **Ni = ${c.ni_data?.toExponential(3)} eventos/ano**

${detailedCalculations}

## ${sectionNumbering.resultados}. RESULTADOS E CONCLUSÕES

${Object.entries(data.risks_to_analyze).filter(([,v])=>v).map(([riskKey], index) => {
    const riskValue = r[riskKey] || 0;
    const tolerance = {R1: 1e-5, R3: 1e-3, R4: 1e-3}[riskKey as 'R1'|'R3'|'R4'] || 0;
    const isAcceptable = riskValue <= tolerance;
    return `
### ${sectionNumbering.resultados}.${index + 1}. Risco ${riskKey} - ${{'R1': 'Perda de Vidas Humanas', 'R3': 'Perda de Patrimônio Cultural', 'R4': 'Perda de Valor Econômico'}[riskKey as 'R1'|'R3'|'R4']}
* **Risco Total Calculado (${riskKey}):** **${riskValue.toExponential(3)}**
* **Risco Tolerável (RT):** **${tolerance.toExponential(1)}**
* **Resultado:** O risco ${riskKey} é **${isAcceptable ? 'ACEITÁVEL ✅' : 'NÃO ACEITÁVEL ❌'}**.
`}).join('\n')}

### ${sectionNumbering.resultados}.${Object.values(data.risks_to_analyze).filter(v=>v).length + 1}. Frequência de Danos aos Sistemas (F)
* **Frequência Calculada (F):** **${f.F?.toExponential(3)}** danos/ano
* **Frequência Tolerável (FT):** **${(data.frequency_config.is_critical_system ? 0.1 : 1.0).toFixed(1)}** danos/ano
* **Resultado:** A frequência F é **${(f.F || 0) <= (data.frequency_config.is_critical_system ? 0.1 : 1.0) ? 'ACEITÁVEL ✅' : 'NÃO ACEITÁVEL ❌'}**.

## ${sectionNumbering.parecer}. PARECER TÉCNICO
[Comece aqui seu parecer técnico. Se algum risco ou a frequência F for 'NÃO ACEITÁVEL', detalhe as razões e sugira medidas de proteção adicionais (ex: "O risco R1 excedeu o limite. Recomenda-se a instalação de um SPDA Classe II (fator PB=0.05) e DPS Classe I+II (fator PSPD=0.02) para mitigar o risco."). Se tudo estiver 'ACEITÁVEL', confirme que as medidas consideradas são suficientes e recomende a implementação e manutenção periódica.]

---
`;

    const apiKey4 = (import.meta as any)?.env?.VITE_GEMINI_API_KEY;
    if (!apiKey4) {
        return "Relatório Técnico gerado localmente. Configure a variável VITE_GEMINI_API_KEY para habilitar análise AI.";
    }
    const ai4 = new GoogleGenAI({ apiKey: apiKey4 });
    try {
        const response = await ai4.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.1,
            }
        });

        let text = response.text.trim();
        // Clean up potential markdown code fences
        if (text.startsWith('```markdown')) text = text.substring(10).trim();
        if (text.startsWith('```')) text = text.substring(3).trim();
        if (text.endsWith('```')) text = text.slice(0, -3).trim();
        
        // Append mandatory Responsibility and Support information to the report
        const rtFooter = `
---

## ✅ Responsabilidade Técnica e Conferência Final do Relatório

A **NBR 5419:2025** deve ser utilizada como **fonte principal** para validação dos dados e referência normativa do relatório.

Este aplicativo atua **exclusivamente como uma ferramenta de apoio** para cálculos e emissão de relatórios, **não isentando o usuário** de sua responsabilidade legal e técnica quanto à **veracidade**, **precisão** e **adequação** das informações fornecidas.

### 🤝 Informações de Contato para Negócios com Eng° Júlio Certo
* **Autor do Aplicativo:** Engº Júlio César Certo
* **Contato (WhatsApp):** (35) 9 8811-3746
* **E-mail:** julio.certo@hotmail.com

> Ao utilizar este aplicativo em estudos ou projetos, cite a fonte: **Engº Júlio César Certo — Ferramenta de Análise de Risco SPDA NBR 5419**.
`;

        return `${text}\n\n${rtFooter}`;
    } catch (error) {
        console.error("Error generating full report with Gemini API:", error);
        return "Ocorreu um erro ao gerar o relatório. Por favor, tente novamente.";
    }
}