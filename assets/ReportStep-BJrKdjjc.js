import{r as N,j as n,A as V,m as D}from"./motion-CZTIYVKD.js";import{P as j,v as q,I as G,R as H,w as F,U as I,t as L,J as k,B as v,C as Z}from"./index-C0ckmZeI.js";import{L as J,t as _,X as K,u as Q,o as X}from"./icons-CPiUAXfr.js";import"./react-Bzgz95E1.js";import"./charts-CPftjIMm.js";function S(a,t){const p=a.find($=>String($.value)===String(t));return p?p.label:`Valor ${t}`}function u(a){if(a===void 0||isNaN(a)||a===0)return"0,00";if(Math.abs(a)<.01&&a!==0){const t=a.toExponential(2).split("e"),p=t[0].replace(".",","),$=parseInt(t[1]);return`${p} x 10<sup>${$}</sup>`}return a.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}function C(a){return a===void 0||isNaN(a)?"0,00 x 10⁻⁵":`${(a*1e5).toFixed(2).replace(".",",")} x 10<sup>-5</sup>`}function A(a){return a===void 0||isNaN(a)?"0,00":a.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}function Y(a){if(!a)return new Date().toLocaleDateString("pt-BR");if(a.includes("-")){const[t,p,$]=a.split("-");return`${$}/${p}/${t}`}return a}function W(a,t=!1){var h,c;const{calculations:p}=a,$=t?"#000000":"#f8fafc",f=t?"#000000":"rgba(226,232,240,0.1)",x=t?"#f1f5f9":"rgba(15,23,42,0.5)";let s=`width: 100%; border-collapse: collapse; margin-bottom: 32px; border: ${t?"1.5pt solid #000000":`1px solid ${f}`}; table-layout: fixed; box-shadow: ${t?"none":"0 4px 6px -1px rgba(0,0,0,0.1)"};`;const r=`padding: 3px 5px; border: 1px solid ${f}; text-align: center; color: ${$}; overflow: hidden;`,e=`padding: 3px 5px; border: 1px solid ${f}; text-align: left; color: ${$}; overflow: hidden;`,m=`padding: 12px 14px; text-align: left; font-weight: 900; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: ${t?"#1e3a8a":"#6070fa"}; vertical-align: middle; background-color: ${x};`,b=`padding: 12px 14px; text-align: center; font-weight: 900; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: ${t?"#1e3a8a":"#6070fa"}; vertical-align: middle; background-color: ${x};`,i=(p.al1||0)+(p.al2||0),g=(p.ai1||0)+(p.ai2||0);return`### 2.1. PARÂMETROS FÍSICOS E AMBIENTAIS (ESTRUTURA)
<table style="${s}">
  <thead>
    <tr style="border-bottom: ${t?"1.5pt solid black":"2px solid #0f172a"};">
      <th style="${b} width: 15%;">Item</th>
      <th style="${m} width: 40%;">Variável de Entrada (Normativa)</th>
      <th style="${b} width: 28%;">Valor</th>
      <th style="${b} width: 17%;">Unid.</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="${r}">L</td><td style="${e}">Comprimento da estrutura (Longitudinal)</td><td style="${r}"><b>${a.l}</b></td><td style="${r}">m</td></tr>
    <tr><td style="${r}">W</td><td style="${e}">Largura da estrutura (Transversal)</td><td style="${r}"><b>${a.w}</b></td><td style="${r}">m</td></tr>
    <tr><td style="${r}">H</td><td style="${e}">Altura máxima da estrutura</td><td style="${r}"><b>${a.h}</b></td><td style="${r}">m</td></tr>
    <tr><td style="${r}">Ng</td><td style="${e}">Densidade de descargas (Regional)</td><td style="${r}"><b>${a.ng}</b></td><td style="${r}">/km².ano</td></tr>
    <tr><td style="${r}">Cd</td><td style="${e}">Fator de localização ambiental</td><td style="${r}"><b>${a.cd}</b></td><td style="${r}">-</td></tr>
  </tbody>
</table>

### 2.2. ÁREAS DE EXPOSIÇÃO EQUIVALENTES (GEOMÉTRICO)
<table style="${s}">
  <thead>
    <tr style="border-bottom: ${t?"1.5pt solid black":"2px solid #0f172a"};">
      <th style="${b} width: 15%;">Cód.</th>
      <th style="${m} width: 40%;">Definição da Área (Anexo A) / Fonte de Dano</th>
      <th style="${b} width: 28%;">Resultado</th>
      <th style="${b} width: 17%;">Unid.</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="${r}">Ad</td><td style="${e}">Área de captação isolada (S1 — Descarga na Estrutura)</td><td style="${r}"><b>${(h=p.ad)==null?void 0:h.toFixed(2)}</b></td><td style="${r}">m²</td></tr>
    <tr><td style="${r}">Am</td><td style="${e}">Área de descargas próximas (S2 — Indução na Estrutura)</td><td style="${r}"><b>${(c=p.am)==null?void 0:c.toFixed(2)}</b></td><td style="${r}">m²</td></tr>
    <tr><td style="${r}">Al</td><td style="${e}">Área de captação das linhas (S3 — Descarga na Linha)</td><td style="${r}"><b>${i.toFixed(2)}</b></td><td style="${r}">m²</td></tr>
    <tr><td style="${r}">Ai</td><td style="${e}">Área de indução das linhas (S4 — Indução na Linha)</td><td style="${r}"><b>${g.toFixed(2)}</b></td><td style="${r}">m²</td></tr>
  </tbody>
</table>`}function tt(a,t=!1,p=0){const $=`width:100%; border-collapse: collapse; font-size: 10.5px; margin-bottom: 12px; table-layout: fixed; border: ${t?"1pt solid #000":"none"};`,f=t?"#000000":"rgba(226,232,240,0.1)",x=t?"#f1f5f9":"rgba(15,23,42,0.5)",s=t?"#1e3a8a":"#60a5fa",e=`padding: 3px 5px; border: 1px solid ${f}; text-align: left; color: ${t?"#000000":"#f1f5f9"}; overflow: hidden;`,m=`padding: 4px 6px; border: 1px solid ${f}; text-align: left; background-color: ${x}; font-weight: bold; color: ${s};`,b=a.zones[p],i=(b==null?void 0:b.probability_data)||a.probability_data,g=(b==null?void 0:b.loss_data)||{},h=`${i.CLD_electric_ext||0}_${i.CLI_electric_ext||0}`,c=`${i.CLD_data_ext||0}_${i.CLI_data_ext||0}`,l=t?"#e2e8f0":"rgba(59,130,246,0.05)",d=a.zones.length>1?` — [${(b==null?void 0:b.name)||`Zona ${p+1}`}]`:"",o=Math.min(1,(i.wm1||5)*.12),y=Math.min(1,(i.wm2||5)*.12);return`### 2.3. PARÂMETROS TÉCNICOS E PREMISSAS DE PROJETO (ESTRUTURA E LINHAS)${d}
<table style="${$}">
  <thead>
    <tr style="border-bottom: ${t?"1.5pt solid black":"2px solid #0f172a"};">
      <th style="${m} width: 20%;">Cód.</th>
      <th style="${m} width: 36%;">Fator Técnico Normativo</th>
      <th style="${m} width: 7%;">Valor</th>
      <th style="${m} width: 37%;">Detalhamento da Premissa Escolhida (NBR 5419-2)</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background: ${l};"><td colspan="4" style="padding: 3px 6px; font-weight: bold; border: 1px solid ${f}; color: ${t?"#000":"inherit"};">A. PROTEÇÃO CONTRA DESCARGAS NA ESTRUTURA (S1 / S2)</td></tr>
    <tr><td style="${e}">PB</td><td style="${e}">Eficácia do SPDA</td><td style="${e}"><b>${i.PB}</b></td><td style="${e}">${S(j,i.PB)}</td></tr>
    <tr><td style="${e}">PTA</td><td style="${e}">Controle de Choque</td><td style="${e}"><b>${i.PTA}</b></td><td style="${e}">${S(q,i.PTA)}</td></tr>
    <tr><td style="${e}">Ks1</td><td style="${e}">Blindagem (L. Malha wm1)</td><td style="${e}"><b>${o.toFixed(2)}</b></td><td style="${e}">Malha de ${i.wm1||5}m (Calculado Ks1)</td></tr>
    <tr><td style="${e}">Ks2</td><td style="${e}">Blindagem (L. Malha wm2)</td><td style="${e}"><b>${y.toFixed(2)}</b></td><td style="${e}">Malha de ${i.wm2||5}m (Calculado Ks2)</td></tr>
    <tr><td style="${e}">Rf</td><td style="${e}">Risco de Incêndio</td><td style="${e}"><b>${g.rf??"N/A"}</b></td><td style="${e}">${S(G,g.rf)}</td></tr>
    <tr><td style="${e}">Rp</td><td style="${e}">Combate ao Fogo</td><td style="${e}"><b>${g.rp??"N/A"}</b></td><td style="${e}">${S(H,g.rp)}</td></tr>
    
    <tr style="background: ${l};"><td colspan="4" style="padding: 3px 6px; font-weight: bold; border: 1px solid ${f}; color: ${t?"#000":"inherit"};">B. PROTEÇÃO DA LINHA DE ENERGIA (S3 / S4)</td></tr>
    <tr><td style="${e}">PTU</td><td style="${e}">Choque na Linha</td><td style="${e}"><b>${i.PTU_electric}</b></td><td style="${e}">${S(F,i.PTU_electric)}</td></tr>
    <tr><td style="${e}">CLI</td><td style="${e}">Tipo da Rede</td><td style="${e}"><b>${i.CLI_electric_ext}</b></td><td style="${e}">${S(k,h)}</td></tr>
    <tr><td style="${e}">Uw</td><td style="${e}">Suportabilidade Eqp</td><td style="${e}"><b>${i.Uw_electric_ext}</b></td><td style="${e}">${S(I,i.Uw_electric_ext)}</td></tr>
    <tr><td style="${e}">PSPD</td><td style="${e}">Eficácia DPS Elét.</td><td style="${e}"><b>${i.PSPD_electric}</b></td><td style="${e}">${S(L,i.PSPD_electric)}</td></tr>

    <tr style="background: ${l};"><td colspan="4" style="padding: 3px 6px; font-weight: bold; border: 1px solid ${f}; color: ${t?"#000":"inherit"};">C. PROTEÇÃO DA LINHA DE DADOS (S3 / S4)</td></tr>
    <tr><td style="${e}">PTU</td><td style="${e}">Choque na Linha</td><td style="${e}"><b>${i.PTU_data}</b></td><td style="${e}">${S(F,i.PTU_data)}</td></tr>
    <tr><td style="${e}">CLI</td><td style="${e}">Blindagem Linha</td><td style="${e}"><b>${i.CLI_data_ext}</b></td><td style="${e}">${S(k,c)}</td></tr>
    <tr><td style="${e}">Uw</td><td style="${e}">Suportabilidade Eqp</td><td style="${e}"><b>${i.Uw_data_ext}</b></td><td style="${e}">${S(I,i.Uw_data_ext)}</td></tr>
    <tr><td style="${e}">PSPD</td><td style="${e}">Eficácia DPS Dados</td><td style="${e}"><b>${i.PSPD_data}</b></td><td style="${e}">${S(L,i.PSPD_data)}</td></tr>
  </tbody>
</table>`}function et(a,t=!1,p=0){var T;const{calculations:$,probability_calculations:f,frequency_results:x,risk_results:s}=a,r=((T=a.zones[p])==null?void 0:T.loss_data)||{},e=(s.R1||0)<=1e-5,m=a.frequency_config.is_critical_system?.1:1,b=(x.F||0)<=m,i=t?"#000000":"rgba(148,163,184,0.1)",g=t?"#000000":"#ffffff",h=t?"#000000":"#94a3b8",c=t?"background: #f8fafc; padding: 8px 12px; font-weight: 900; color: #000000; border-bottom: 1.5pt solid #000000; margin-top: 25pt; margin-bottom: 12pt; text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.5px;":"background: rgba(96,165,250,0.05); padding: 10px 16px; font-weight: 800; color: #60a5fa; border-left: 4px solid #60a5fa; margin-top: 40px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1.2px; font-size: 11.5px;",l=`padding: 8px 10px; text-align: left; vertical-align: middle; border-bottom: 1px solid ${i}; width: 15%; font-weight: bold; color: ${g}; font-size: 11px;`,d=`padding: 8px 10px; text-align: left; vertical-align: middle; border-bottom: 1px solid ${i}; width: 55%; color: ${h};`,o=`padding: 8px 10px; text-align: right; vertical-align: middle; border-bottom: 1px solid ${i}; width: 30%; font-family: "Arial", monospace; font-weight: bold; color: ${g}; font-size: 11px;`,y=`width:100%; border-collapse: collapse; font-size: 10.2px; margin-bottom: 30px; table-layout: fixed; border: ${t?"1pt solid black":"none"};`,E=($.nl_electric||0)+($.nl_data||0),w=($.ni_electric||0)+($.ni_data||0),R=(U,B,z)=>`
    <tr>
      <td style="${l}">${U}</td>
      <td style="${d}">${z}</td>
      <td style="${o}">${u(B)}</td>
    </tr>`;let O="";return a.risks_to_analyze.R1&&(O+=`
<div style="${c}">3.7. COMPONENTES DO RISCO À VIDA HUMANA (R1)</div>
<table style="${y}">
  <tr><td style="${l}">RA</td><td style="${d}">Choque em seres vivos (Estrutura)</td><td style="${o}">${C(s.RA)}</td></tr>
  <tr><td style="${l}">RB</td><td style="${d}">Danos físicos (Estrutura - Fogo/Explosão)</td><td style="${o}">${C(s.RB)}</td></tr>
  <tr><td style="${l}">RC</td><td style="${d}">Falhas de sistemas internos (Estrutura)</td><td style="${o}">${C(s.RC)}</td></tr>
  <tr><td style="${l}">RM</td><td style="${d}">Falhas de sistemas (Estrutura - Campo Magnético)</td><td style="${o}">${C(s.RM)}</td></tr>
  <tr><td style="${l}">RU</td><td style="${d}">Choque em seres vivos (Linhas)</td><td style="${o}">${C((s.RU||0)+(s.RUT||0))}</td></tr>
  <tr><td style="${l}">RV</td><td style="${d}">Danos físicos (Linhas - Fogo/Explosão)</td><td style="${o}">${C((s.RV||0)+(s.RVT||0))}</td></tr>
  <tr><td style="${l}">RW</td><td style="${d}">Falhas de sistemas (Linhas - Surtos)</td><td style="${o}">${C((s.RW||0)+(s.RWT||0))}</td></tr>
  <tr><td style="${l}">RZ</td><td style="${d}">Falhas de sistemas (Linhas - Indução)</td><td style="${o}">${C((s.RZ||0)+(s.RZT||0))}</td></tr>
  <tr style="background: ${t?"#f1f5f9":"rgba(15,23,42,0.3)"};">
    <td style="${l}">TOTAL</td>
    <td style="${d}; font-weight: bold;">R1 TOTAL (Σ componentes avaliados)</td>
    <td style="${o}">${C(s.R1)}</td>
  </tr>
</table>`),a.risks_to_analyze.R3&&(O+=`
<div style="${c}">3.8. COMPONENTES DO RISCO AO PATRIMÔNIO CULTURAL (R3)</div>
<table style="${y}">
  ${R("RB",s.RB3,"Danos físicos - Fogo/Explosão (Estrutura)")}
  ${R("RV",(s.RV3||0)+(s.RVT3||0),"Danos físicos - Fogo/Explosão (Linhas)")}
  <tr style="background: ${t?"#f1f5f9":"rgba(15,23,42,0.3)"};">
    <td style="${l}">TOTAL</td>
    <td style="${d}; font-weight: bold;">R3 TOTAL (Σ componentes avaliados)</td>
    <td style="${o}">${u(s.R3)}</td>
  </tr>
</table>`),a.risks_to_analyze.R4&&(O+=`
<div style="${c}">3.9. COMPONENTES DO RISCO ECONÔMICO (R4)</div>
<table style="${y}">
  ${R("RA",s.RA4,"Choque em seres vivos (Estrutura)")}
  ${R("RB",s.RB4,"Danos físicos (Estrutura - Fogo/Explosão)")}
  ${R("RC",s.RC4,"Falhas de sistemas internos (Estrutura)")}
  ${R("RM",s.RM4,"Falhas de sistemas (Estrutura - Campo Magnético)")}
  ${R("RU",(s.RU4||0)+(s.RUT4||0),"Choque em seres vivos (Linhas)")}
  ${R("RV",(s.RV4||0)+(s.RVT4||0),"Danos físicos (Linhas - Fogo/Explosão)")}
  ${R("RW",(s.RW4||0)+(s.RWT4||0),"Falhas de sistemas (Linhas - Surtos)")}
  ${R("RZ",(s.RZ4||0)+(s.RZT4||0),"Falhas de sistemas (Linhas - Indução)")}
  <tr style="background: ${t?"#f1f5f9":"rgba(15,23,42,0.3)"};">
    <td style="${l}">TOTAL</td>
    <td style="${d}; font-weight: bold;">R4 TOTAL (Σ componentes avaliados)</td>
    <td style="${o}">${u(s.R4)}</td>
  </tr>
</table>`),O+=`
<div style="${c}">3.10. COMPONENTES DA FREQUÊNCIA DE DANOS (FD)</div>
<table style="${y}">
  <tr><td style="${l}">FB</td><td style="${d}">Frequência de danos físicos na estrutura</td><td style="${o}">${A(x.FB)}</td></tr>
  <tr><td style="${l}">FC</td><td style="${d}">Frequência de falhas de sistemas internos</td><td style="${o}">${A(x.FC)}</td></tr>
  <tr><td style="${l}">FM</td><td style="${d}">Frequência de falhas por campos magnéticos</td><td style="${o}">${A(x.FM)}</td></tr>
  <tr><td style="${l}">FV</td><td style="${d}">Frequência de danos físicos nas linhas</td><td style="${o}">${A(x.FV)}</td></tr>
  <tr><td style="${l}">FW</td><td style="${d}">Frequência de falhas de sistemas via linhas (surtos)</td><td style="${o}">${A(x.FW)}</td></tr>
  <tr><td style="${l}">FZ</td><td style="${d}">Frequência de falhas de sistemas via indução</td><td style="${o}">${A(x.FZ)}</td></tr>
  <tr style="background: ${t?"#f1f5f9":"rgba(15,23,42,0.3)"};">
    <td style="${l}">TOTAL</td>
    <td style="${d}; font-weight: bold;">FD TOTAL (Σ componentes avaliados)</td>
    <td style="${o}">${A(x.F)}</td>
  </tr>
</table>`,`
<div style="${c}">3.1. ESTIMATIVA DE EVENTOS PERIGOSOS ANUAIS (N)</div>
<table style="${y}">
  <tr><td style="${l}">Nd (S1)</td><td style="${d}">Ng x Ad x Cd x 10⁻⁶</td><td style="${o}">${u($.nd)}</td></tr>
  <tr><td style="${l}">Nm (S2)</td><td style="${d}">Ng x Am x 10⁻⁶</td><td style="${o}">${u($.nm)}</td></tr>
  <tr><td style="${l}">Nl (S3)</td><td style="${d}">Somatório das descargas diretas na rede</td><td style="${o}">${u(E)}</td></tr>
  <tr><td style="${l}">Ni (S4)</td><td style="${d}">Somatório das induções laterais na rede</td><td style="${o}">${u(w)}</td></tr>
</table>

<div style="${c}">3.2. PROBABILIDADES DE DANO RESIDUAL (P)</div>
<table style="${y}">
  <tr><td style="${l}">PA</td><td style="${d}">Choque: PTA x Nível PB (Combinado)</td><td style="${o}">${u(s.RA&&$.nd?s.RA/($.nd*(r.LA||1)):f.PA)}</td></tr>
  <tr><td style="${l}">PB</td><td style="${d}">Dano Físico: Eficácia SPDA GLOBAL</td><td style="${o}">${u(f.PB)}</td></tr>
  <tr><td style="${l}">PC</td><td style="${d}">Falhas: Eficácia MPS (DPS) GLOBAL</td><td style="${o}">${u(f.PC)}</td></tr>
</table>

<div style="${c}">3.3. FATORES DE PERDAS ESTIMADOS (L)</div>
<table style="${y}">
  <tr><td style="${l}">LA</td><td style="${d}">Fator de Perda (Choque - Estrutura)</td><td style="${o}">${u(r.LA)}</td></tr>
  <tr><td style="${l}">LB</td><td style="${d}">Fator de Perda (Danos Físicos - Estrutura)</td><td style="${o}">${u(r.LB)}</td></tr>
  <tr><td style="${l}">LC</td><td style="${d}">Fator de Perda (Sistemas Internos - Estrutura)</td><td style="${o}">${u(r.LC)}</td></tr>
  <tr><td style="${l}">LT</td><td style="${d}">Fator de Perda (Choque - Linhas)</td><td style="${o}">${u(r.LT)}</td></tr>
  <tr><td style="${l}">LV</td><td style="${d}">Fator de Perda (Danos Físicos - Linhas)</td><td style="${o}">${u(r.LV)}</td></tr>
  <tr><td style="${l}">LW/LZ</td><td style="${d}">Fator de Perda (Sistemas - Linhas)</td><td style="${o}">${u(r.LO)}</td></tr>
</table>

${O}

<div style="${c}">3.11. RESUMO DE CONFORMIDADE E RESULTADOS FINAIS</div>

<div style="display: flex; gap: 20px; align-items: stretch; margin-bottom: 40px; ${t?"display: block;":""}">
  <div style="flex: 1; border: ${t?"2.5pt solid #000000":"1px solid rgba(251,191,36,0.2)"}; padding: 25px; border-radius: 12px; background: ${t?"#ffffff":"rgba(251,191,36,0.03)"}; ${t?"margin-bottom: 25pt;":""}">
    <div style="font-size: 10px; font-weight: 900; letter-spacing: 2.5px; color: ${t?"#000000":"#fbbf24"}; text-transform: uppercase; margin-bottom: 12px; border-bottom: 1.5pt solid ${t?"#000000":"rgba(251,191,36,0.1)"}; padding-bottom: 8px;">
      <b>📉 RT (R1) — GLOBAL</b>
    </div>
    <div style="font-size: 28px; font-weight: 950; color: ${t?"#000000":"#ffffff"}; margin-bottom: 8px; font-family: 'Arial', monospace; letter-spacing: -0.5px;">
      ${C(s.R1)}
    </div>
    <div style="font-size: 11px; font-weight: 800; color: ${t?"#000000":"#94a3b8"}; margin-bottom: 20px;">
      LIMITE TOLERÁVEL: <span style="color: ${t?"#000000":"#ffffff"}">1,00 x 10⁻⁵</span>
    </div>
    <div style="display: inline-block; padding: 8px 18px; border-radius: 4px; background: ${e?"#059669":"#dc2626"}; color: white; font-size: 13px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase;">
      ${e?"✓ CONFORME":"❌ CRÍTICO"}
    </div>
  </div>

  <div style="flex: 1; border: ${t?"2.5pt solid #000000":"1px solid rgba(96,165,250,0.2)"}; padding: 25px; border-radius: 12px; background: ${t?"#ffffff":"rgba(96,165,250,0.03)"};">
    <div style="font-size: 10px; font-weight: 900; letter-spacing: 2.5px; color: ${t?"#000000":"#60a5fa"}; text-transform: uppercase; margin-bottom: 12px; border-bottom: 1.5pt solid ${t?"#000000":"rgba(96,165,250,0.1)"}; padding-bottom: 8px;">
      <b>⚡ Frequência Total (F) — Global</b>
    </div>
    <div style="font-size: 28px; font-weight: 950; color: ${t?"#000000":"#ffffff"}; margin-bottom: 8px; font-family: 'Arial', monospace; letter-spacing: -0.5px;">
      ${A(x.F)}
    </div>
    <div style="font-size: 11px; font-weight: 800; color: ${t?"#000000":"#94a3b8"}; margin-bottom: 20px;">
      LIMITE TOLERÁVEL: <span style="color: ${t?"#000000":"#ffffff"}">${A(m)}</span>
    </div>
    <div style="display: inline-block; padding: 8px 18px; border-radius: 4px; background: ${b?"#059669":"#dc2626"}; color: white; font-size: 13px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase;">
      ${b?"✓ CONFORME":"❌ CRÍTICO"}
    </div>
  </div>
</div>

<div style="border-top: 2px dashed ${t?"#000000":"rgba(148,163,184,0.1)"}; margin: 20px 0; height: 1px;"></div>`}async function M(a,t=!1){const{risk_results:p,frequency_results:$}=a,f=!Object.entries(a.risks_to_analyze).some(([g,h])=>h&&a.risk_results[g]>{R1:1e-5,R3:.001,R4:.001}[g]),x=a.frequency_config.is_critical_system?.1:1,s=($.F||0)<=x,r=()=>{const g=f&&s?"✅ CONFORMIDADE TÉCNICA NBR 5419:2026":"❌ NÃO CONFORMIDADE DETECTADA",h=f&&s?"safe":"danger";let c="";if(f&&s){const y=a.probability_data.PB,E=a.probability_data.PSPD_electric,w=T=>T.replace(/\s+[0-9,.]+$/,"").trim(),R=y===1?"à **ausência de SPDA externo**":`à **presença do ${w(S(j,y))}**`,O=E===1?"e à **ausência de MPS (DPS)**":`e à **presença das MPS (${w(S(L,E))}) PEB e PSPD**`;c=`A edificação encontra-se **PROTEGIDA**. A conformidade está vinculada ${R} ${O}, conforme parâmetros detalhados nas tabelas de premissas por zona.`}else c="**O RISCO SUPERA OS LIMITES.** Recomenda-se: 1) Elevar Classe SPDA; 2) DPS coordenados Classe I; 3) Reforçar combate a incêndio (Rp).";const l=(p.R1||0)<=1e-5,d=a.frequency_config.is_critical_system?.1:1,o=($.F||0)<=d;return`## 5. CONCLUSÃO TÉCNICA
<div class="status-box ${h}">
    <h3>${g}</h3>
    <p style="color: ${t?"#000000":"inherit"}">${c}</p>
</div>

### RESUMO DOS INDICADORES DE CONFORMIDADE:
<table style="width:100%; border-collapse: collapse; font-size: 11px; table-layout: fixed; margin-top: 5px; border: ${t?"1pt solid black":"none"};">
  <tr style="background: ${t?"#f1f5f9":"rgba(251,191,36,0.08)"}; border-bottom: 2px solid ${t?"#1e3a8a":"#fbbf24"};">
    <td colspan="4" style="padding: 16px 14px; font-weight: 900; color: ${t?"#1e3a8a":"#fbbf24"}; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; border-left: 5px solid ${t?"#1e3a8a":"#fbbf24"};">${g}</td>
  </tr>
  <tr style="background: ${t?"#f1f5f9":"rgba(15,23,42,0.5)"}; color: ${t?"#1e3a8a":"#60a5fa"};">
    <th style="padding: 6px; border: 1px solid ${t?"black":"rgba(248,250,252,0.1)"}; text-align: left; width: 45%;">Parâmetro Analisado</th>
    <th style="padding: 6px; border: 1px solid ${t?"black":"rgba(248,250,252,0.1)"}; text-align: center; width: 20%;">Calculado</th>
    <th style="padding: 6px; border: 1px solid ${t?"black":"rgba(248,250,252,0.1)"}; text-align: center; width: 20%;">Tolerável</th>
    <th style="padding: 6px; border: 1px solid ${t?"black":"rgba(248,250,252,0.1)"}; text-align: center; width: 15%;">Status</th>
  </tr>
  <tr>
    <td style="padding: 6px; border: 1px solid ${t?"black":"rgba(248,250,252,0.1)"}; color: ${t?"black":"#f8fafc"};">Risco à Vida Humana (R1)</td>
    <td colspan="2" style="padding: 6px; border: 1px solid ${t?"black":"rgba(248,250,252,0.1)"}; text-align: center; color: ${t?"black":"#f8fafc"}; font-family: monospace;"><b>${C(p.R1)} ${l?"≤":">"} 1,00 x 10⁻⁵</b></td>
    <td style="padding: 6px; border: 1px solid ${t?"black":"rgba(248,250,252,0.1)"}; text-align: center; color: ${l?"#059669":"#dc2626"}; font-weight: bold;">${l?"CONFORME":"CRÍTICO"}</td>
  </tr>
  <tr>
    <td style="padding: 6px; border: 1px solid ${t?"black":"rgba(248,250,252,0.1)"}; color: ${t?"black":"#f8fafc"};">Frequência de Danos (FD)</td>
    <td colspan="2" style="padding: 6px; border: 1px solid ${t?"black":"rgba(248,250,252,0.1)"}; text-align: center; color: ${t?"black":"#f8fafc"}; font-family: monospace;"><b>${A($.F)} ${o?"≤":">"} ${A(d)}</b></td>
    <td style="padding: 6px; border: 1px solid ${t?"black":"rgba(248,250,252,0.1)"}; text-align: center; color: ${o?"#059669":"#dc2626"}; font-weight: bold;">${o?"CONFORME":"CRÍTICO"}</td>
  </tr>
</table>`},e=(g,h,c,l)=>{if(t)return"";const d=l==="R1"?C:A,o=l==="R1"?"1,00 x 10⁻⁵":A(c),y=h<=c,E=Math.min(100,h/c*100),w=y?"#10b981":"#ef4444",R=`<svg width="400" height="70" viewBox="0 0 400 70" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="70" fill="rgba(248,250,252,0.8)" rx="8"/>
            <text x="12" y="20" font-family="Arial" font-size="11" font-weight="900" fill="#334155">${g}</text>
            <rect x="12" y="32" width="376" height="10" fill="#e2e8f0" rx="5"/>
            <rect x="12" y="32" width="${(E*3.76).toFixed(0)}" height="10" fill="${w}" rx="5"/>
            <text x="12" y="58" font-family="Arial" font-size="10" font-weight="bold" fill="#1e293b">${d(h).replace(/<\/?sup>/g,"")} ${y?"≤":">"} ${o.replace(/<\/?sup>/g,"")} [${y?"CONFORME":"CRÍTICO"}]</text>
            <circle cx="${(E*3.76+12).toFixed(0)}" cy="37" r="4" fill="white" stroke="${w}" stroke-width="3"/>
        </svg>`.trim();return`data:image/svg+xml;base64,${typeof window<"u"?window.btoa(unescape(encodeURIComponent(R))):Buffer.from(R).toString("base64")}`},m=t?"_[Gráficos omitidos para maior compatibilidade com Word. Consulte os dados na tabela de conformidade no final do relatório.]_":`![Gráfico de Risco R1](${e("SISTEMA 01: RISCO À VIDA HUMANA (R1)",p.R1||0,1e-5,"R1")})`,b=t?"":`![Gráfico de Frequência FD](${e("SISTEMA 02: FREQUÊNCIA DE DANOS (FD)",$.F||0,x,"FD")})`,i=a.zones.map((g,h)=>tt(a,t,h)).join(`

`);return`
# <span style="color: ${t?"#000000":"#ffffff"};">RELATÓRIO TÉCNICO:</span>
# <span style="color: ${t?"#1e3a8a":"#fbbf24"};">ANÁLISE DE RISCO PDA (NBR 5419-2 2026)</span>

## 🏛️ <span style="color: ${t?"#1e3a8a":"#fbbf24"};">1. IDENTIFICAÇÃO E DADOS GERAIS</span>
<div style="background: ${t?"#f1f5f9":"rgba(30,41,59,0.5)"}; border: 1px solid ${t?"#000000":"rgba(148,163,184,0.2)"}; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
<table style="width:100%; border-collapse: collapse; font-size: 12px; table-layout: fixed;">
  <tr><td style="padding: 6px 12px; width: 15%; color: ${t?"#000000":"#94a3b8"};"><b>CLIENTE:</b></td><td style="padding: 6px 12px; border-bottom: 1px solid ${t?"#000000":"rgba(148,163,184,0.1)"}; color: ${t?"#000000":"#f8fafc"};">${a.clientName||"N/A"}</td></tr>
  <tr><td style="padding: 6px 12px; color: ${t?"#000000":"#94a3b8"};"><b>RESPONSÁVEL:</b></td><td style="padding: 6px 12px; border-bottom: 1px solid ${t?"#000000":"rgba(148,163,184,0.1)"}; color: ${t?"#000000":"#f8fafc"};">Engº ${a.technicalManagerName||"N/A"}</td></tr>
  <tr><td style="padding: 6px 12px; color: ${t?"#000000":"#94a3b8"};"><b>LOCALIDADE:</b></td><td style="padding: 6px 12px; border-bottom: 1px solid ${t?"#000000":"rgba(148,163,184,0.1)"}; color: ${t?"#000000":"#f8fafc"};">${a.location||"Brasil"}</td></tr>
  <tr><td style="padding: 6px 12px; color: ${t?"#000000":"#94a3b8"};"><b>DATA EMISSÃO:</b></td><td style="padding: 6px 12px; color: ${t?"#000000":"#f8fafc"};">${Y(a.projectDate)}</td></tr>
</table>
</div>

## 📊 <span style="color: ${t?"#1e3a8a":"#fbbf24"};">2. ENTRADA DE DADOS E PREMISSAS NORMATIVAS</span>
${W(a,t)}

${i}

## 📐 <span style="color: ${t?"#1e3a8a":"#fbbf24"};">3. MEMORIAL DE CÁLCULO</span>
${et(a,t)}

## 🚦 <span style="color: ${t?"#1e3a8a":"#fbbf24"};">4. ANÁLISE GRÁFICA DE CONFORMIDADE</span>
O gráfico abaixo compara os valores calculados contra os limites de tolerância da NBR 5419:

${m}

${b}

## ⚖️ <span style="color: ${t?"#1e3a8a":"#fbbf24"};">5. CONCLUSÃO TÉCNICA E PARECER FINAL</span>
${r()}

<div style="text-align: center; margin-top: 120px; padding-top: 6px; border-top: 1px solid #000000; max-width: 320px; margin-left: auto; margin-right: auto;">
  <p style="font-size: 14px; margin-bottom: 0; color: ${t?"#000000":"#f8fafc"};"><b>Engº ${a.technicalManagerName||"Responsável Técnico"}</b></p>
  <p style="font-size: 11px; color: ${t?"#475569":"#94a3b8"}; margin-top: 4px;">Analista Especialista em PDA — NBR 5419:2:2026</p>
</div>
`.trim()}const P=(a,t)=>{const p=t.isWord||!1,$=p?"#000000":"#f8fafc",f=p?"#000000":"#3b82f6",x=p?"#1e3a8a":"#60a5fa",s=p?"#000000":"rgba(148,163,184,0.15)",e=a.replace(/^# (.*$)/gm,`<h1 style="font-size: 2rem; font-weight: 900; color: ${f}; margin-bottom: 1rem; text-align: center; border-bottom: 4px solid ${f}; padding-bottom: 0.5rem;">$1</h1>`).replace(/^## (.*$)/gm,`<h2 style="font-size: ${t.h2FontSizeRem}rem; font-weight: ${t.h2Weight||700}; color: ${x}; margin-top: ${t.h2MarginTopPx}px; margin-bottom: ${t.h2MarginBottomPx}px; border-left: 3px solid ${p?"#1e3a8a":"#3b82f6"}; padding-left: 0.75rem;">$1</h2>`).replace(/^### (.*$)/gm,`<h3 style="font-size: 1.25rem; font-weight: 700; color: ${p?"#334155":"#94a3b8"}; margin-top: 1.5rem; margin-bottom: 0.75rem;">$1</h3>`).replace(/\*\*(.*?)\*\*/g,'<strong style="color: inherit;">$1</strong>').replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/!\[(.*?)\]\((.*?)\)/g,'<div style="text-align: center; margin: 20px 0;"><img src="$2" alt="$1" style="max-width: 100%; height: auto; border: 1px solid #e2e8f0; border-radius: 8px;" /></div>').replace(/^\| (.*) \|$/gm,m=>{const b=m.split("|").filter(i=>i.trim()!=="").map(i=>`<td style="border: 1px solid ${s}; padding: 4px 6px; text-align: left; color: ${$};">${i.trim()}</td>`).join("");return`<table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem; border: 1px solid ${s};"><tr style="background: ${p?"#f8fafc":"rgba(15,23,42,0.3)"};">${b}</tr></table>`}).replace(/<div class="status-box danger">([\s\S]*?)<\/div>/g,'<div style="background: rgba(239,68,68,0.1); border: 2px solid #ef4444; border-radius: 1rem; padding: 1.5rem; margin: 2rem 0; color: #ef4444;">$1</div>').replace(/^\d\. (.*$)/gm,`<li style="margin-bottom: 0.2rem; color: ${t.isWord?"#000":"#cbd5e1"}; font-size: 0.9rem;">$1</li>`).replace(/\*\*(.*?)\*\*/g,`<strong style="color: ${t.isWord?"#1e40af":"#60a5fa"}; font-weight: 700;">$1</strong>`).replace(/^- (.*$)/gm,`<li style="margin-left: 0.75rem; margin-bottom: 0.15rem; color: ${t.isWord?"#000":"#94a3b8"}; font-size: 0.9rem;">$1</li>`).replace(/^> (.*$)/gm,`<blockquote style="border-left: 4px solid #3b82f6; padding: 0.5rem 1rem; margin: 1rem 0; background: rgba(59,130,246,0.05); font-style: italic; color: ${t.isWord?"#1e293b":"#94a3b8"};">$1</blockquote>`).replace(/<\/h[1-3]>\s*\n+/g,m=>m.replace(/\n+/g,"<br/>")).replace(/\n\s*\n/g,'<div style="margin-bottom: 12px;"></div>').replace(/\n/g," ");return`<div class="prose-styles" style="font-family: 'Inter', sans-serif; line-height: 1.5; text-align: justify; color: ${$};">${e}</div>`},rt=({data:a,onUpdate:t})=>{const[p,$]=N.useState(!1),[f,x]=N.useState(""),[s,r]=N.useState(!1),[e,m]=N.useState(""),b={h2FontSizeRem:1.15,h2Weight:700,h2MarginTopPx:48,h2MarginBottomPx:8,h3FontSizeRem:1,h3MarginTopPx:8,h3MarginBottomPx:2},i=async()=>{$(!0);try{m("Iniciando análise normativa NBR 5419-2:2026..."),await new Promise(l=>setTimeout(l,600)),m("Processando dados de densidade (Ng) e áreas (Ad, Am)..."),await new Promise(l=>setTimeout(l,600)),m("Calculando componentes de probabilidade e perdas..."),await new Promise(l=>setTimeout(l,600)),m("Consolidando resultados e gerando parecer técnico..."),await new Promise(l=>setTimeout(l,600)),m("Formatando relatório executivo premium...");const c=await M(a);x(c)}catch(c){console.error("Erro ao gerar relatório:",c)}finally{$(!1),m("")}},g=async()=>{$(!0);try{m("Gerando versão MS Word...");const c=await M(a,!0),l=P(c,{...b,isWord:!0}),d=`RELATORIO_SPDA_${(a.clientName||"PROJETO").replace(/\s+/g,"_").toUpperCase()}.doc`,o=`
                <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                <head>
                    <meta charset='utf-8'>
                    <style>
                        body { font-family: 'Arial', sans-serif; font-size: 11pt; color: #000000; }
                        table { border-collapse: collapse; width: 100%; border: 1pt solid #000; }
                        td, th { border: 1pt solid #000; padding: 4pt; font-size: 10pt; }
                    </style>
                </head>
                <body>${l}</body>
                </html>
            `,y=new Blob(["\uFEFF",o],{type:"application/msword"}),E=URL.createObjectURL(y),w=document.createElement("a");w.href=E,w.download=d,w.click(),URL.revokeObjectURL(E)}catch(c){console.error("Erro ao baixar Word:",c)}finally{$(!1),m("")}},h=()=>{const c=P(f,{...b,isWord:!0}),l=window.open("","_blank");l&&(l.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title>Relatório SPDA</title>
            <style>
                @page { size: A4; margin: 15mm; }
                body { font-family: sans-serif; color: #000; line-height: 1.4; }
                table { width: 100%; border-collapse: collapse; margin: 4mm 0; border: 1pt solid #000; }
                td, th { border: 0.5pt solid #000; padding: 2mm; font-size: 9.5pt; }
                
                td[style*="width: 11%"] { width: 11% !important; }
                td[style*="width: 5%"] { width: 5% !important; }
                td[style*="width: 14%"] { width: 14% !important; }

                .status-box { border: 2pt solid #000; padding: 5mm; margin: 6mm 0; }
                .footer { margin-top: 10mm; border-top: 0.5pt solid #ccc; font-size: 8pt; text-align: center; }
            </style></head><body>
                ${c}
                <div class="footer text-muted">Gerado em ${new Date().toLocaleDateString("pt-BR")}</div>
            </body></html>`),l.document.close(),setTimeout(()=>{l.focus(),l.print()},800))};return n.jsxs("div",{className:"space-y-4",children:[n.jsxs("div",{className:"flex flex-col md:flex-row items-stretch gap-4",children:[n.jsx(V,{mode:"wait",children:f?n.jsxs(D.div,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},className:"flex-1 bg-slate-900 border border-slate-700 rounded-3xl p-5",children:[n.jsxs("div",{className:"flex items-center justify-between mb-6",children:[n.jsxs("h3",{className:"text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2",children:[n.jsx(_,{className:"w-6 h-6 text-blue-400"})," Relatório Técnico"]}),n.jsxs("div",{className:"flex gap-2",children:[n.jsx(v,{variant:"outline",size:"sm",onClick:g,children:"Word"}),n.jsx(v,{variant:"outline",size:"sm",onClick:h,children:"PDF"}),n.jsx(v,{variant:"outline",size:"icon",onClick:()=>x(""),children:n.jsx(K,{className:"w-4 h-4"})})]})]}),n.jsx("div",{className:"bg-slate-950 p-8 rounded-2xl border border-slate-800 max-h-[600px] overflow-y-auto",dangerouslySetInnerHTML:{__html:P(f,b)}})]},"report-view"):n.jsx(D.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},className:"flex-1",children:n.jsx(v,{onClick:i,disabled:p,className:"w-full h-20 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl",children:p?n.jsxs("div",{className:"flex items-center gap-2",children:[n.jsx(J,{className:"w-6 h-6 animate-spin"}),n.jsx("span",{children:e})]}):n.jsxs("div",{className:"flex items-center gap-3",children:[n.jsx(_,{className:"w-8 h-8"}),n.jsx("span",{className:"text-xl font-black tracking-widest uppercase",children:"Gerar Relatório"})]})})},"gen-btn")}),!f&&n.jsxs(D.div,{initial:{opacity:0,x:10},animate:{opacity:1,x:0},className:"md:w-64 h-20 bg-slate-950/40 border border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-1 group hover:bg-blue-900/10 cursor-pointer transition-all border-dashed",onClick:async()=>{const c=JSON.stringify(a,null,2),l=`PROJETO_SPDA_${(a.clientName||"PROJETO").replace(/\s+/g,"_").toUpperCase()}.spda`;if("showSaveFilePicker"in window)try{const w=await(await window.showSaveFilePicker({suggestedName:l,types:[{description:"Arquivo de Projeto SPDA",accept:{"application/json":[".spda"]}}]})).createWritable();await w.write(c),await w.close();return}catch(E){if(E.name==="AbortError")return}const d=new Blob([c],{type:"application/json"}),o=URL.createObjectURL(d),y=document.createElement("a");y.href=o,y.download=l,y.click(),URL.revokeObjectURL(o)},children:[n.jsx(Q,{className:"w-6 h-6 text-slate-500 group-hover:text-blue-400 group-hover:scale-110 transition-all"}),n.jsx("span",{className:"text-[10px] font-black text-slate-500 group-hover:text-blue-400 uppercase tracking-widest leading-none",children:"Salvar Projeto"})]})]}),!f&&n.jsx(D.div,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},children:n.jsxs(Z,{className:"bg-slate-950/60 border-slate-800 shadow-xl rounded-3xl overflow-hidden mt-6 p-5",children:[n.jsxs("div",{className:"flex items-center gap-2 text-slate-200 text-sm uppercase font-black tracking-widest mb-4",children:[n.jsx(X,{className:"w-4 h-4 text-emerald-500"})," Confirmação Técnica"]}),n.jsx("p",{className:"text-slate-300 leading-relaxed text-xs italic border-l-4 border-emerald-500/30 pl-4 py-1 mb-6",children:'"Este relatório automatizado é uma ferramenta de apoio para cálculos da NBR 5419:2026. A conferência final e a responsabilidade técnica integral pelo projeto cabem exclusivamente ao profissional habilitado."'}),n.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-3",children:[n.jsxs("div",{className:"p-3 rounded-xl bg-slate-900 border border-slate-800 text-center",children:[n.jsx("span",{className:"text-[9px] uppercase font-bold text-slate-500 tracking-widest block mb-1",children:"Autor da Ferramenta"}),n.jsx("span",{className:"text-slate-100 font-bold text-xs",children:"Engº Júlio César Certo"}),n.jsx("span",{className:"text-[8px] text-slate-500 block mt-1 leading-none italic",children:"(Não é o Resp. Técnico pela análise)"})]}),n.jsxs("div",{className:"p-3 rounded-xl bg-slate-900 border border-slate-800 text-center",children:[n.jsx("span",{className:"text-[9px] uppercase font-bold text-slate-500 tracking-widest block mb-1",children:"WhatsApp Apoio"}),n.jsx("span",{className:"text-slate-100 font-bold text-xs",children:"(35) 9 8811-3746"})]}),n.jsxs("div",{className:"p-3 rounded-xl bg-slate-900 border border-slate-800 text-center",children:[n.jsx("span",{className:"text-[9px] uppercase font-bold text-slate-500 tracking-widest block mb-1",children:"E-mail Suporte"}),n.jsx("span",{className:"text-slate-200 font-medium text-[10px]",children:"julio.certo@hotmail.com"})]})]})]})})]})};export{rt as ReportStep,P as markdownToHtml};
