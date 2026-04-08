import{r as O,j as p,A as K,m as D}from"./motion-CZTIYVKD.js";import{P as V,t as Q,J as X,R as Y,v as B,U,w as I,M as j,B as L,C as W}from"./index-Dm-AtlyY.js";import{L as tt,x as z,X as et,y as lt,t as st}from"./icons-s-On-H28.js";import"./react-Bzgz95E1.js";import"./charts-D7Odik-1.js";function S(l,t){const b=l.find(s=>String(s.value)===String(t));return b?b.label:`Valor ${t}`}function a(l){if(l===void 0||isNaN(l)||l===0)return"0,00";if(Math.abs(l)<.01&&l!==0){const t=l.toExponential(2).split("e"),b=t[0].replace(".",","),s=parseInt(t[1]);return`${b} x 10<sup>${s}</sup>`}return l.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}function _(l){if(l===void 0||isNaN(l)||l===0)return"0,00";const t=l.toExponential(2).split("e"),b=t[0].replace(".",","),s=parseInt(t[1]);return`${b} x 10<sup>${s}</sup>`}function R(l){return l===void 0||isNaN(l)?"0,00 x 10<sup>-5</sup>":`${(l*1e5).toFixed(2).replace(".",",")} x 10<sup>-5</sup>`}function C(l){return l===void 0||isNaN(l)?"0,00":l.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}function at(l){if(!l)return new Date().toLocaleDateString("pt-BR");if(l.includes("-")){const[t,b,s]=l.split("-");return`${s}/${b}/${t}`}return l}function ot(l,t=!1){var y,f;const{calculations:b}=l,s=t?"#000000":"#f8fafc",c=t?"#000000":"rgba(226,232,240,0.1)",g=t?"#f1f5f9":"rgba(59,130,246,0.05)",n=t?"#000000":"#60a5fa";let w=`width: 100%; border-collapse: collapse; margin-bottom: 32px; border: ${t?"1.5pt solid #000000":`1px solid ${c}`}; table-layout: fixed;`;const o=`padding: 3px 5px; border: 1px solid ${c}; text-align: center; color: ${s}; word-wrap: break-word;`,e=`padding: 3px 5px; border: 1px solid ${c}; text-align: left; color: ${s}; word-wrap: break-word;`,P=`padding: 12px 14px; text-align: left; font-weight: 950; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: ${n}; vertical-align: middle; background-color: ${g};`,m=`padding: 12px 14px; text-align: center; font-weight: 950; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: ${n}; vertical-align: middle; background-color: ${g};`,$=(b.al1||0)+(b.al2||0),h=(b.ai1||0)+(b.ai2||0);return`### 2.1. PARÂMETROS FÍSICOS E AMBIENTAIS (ESTRUTURA)
<table style="${w}">
  <thead>
    <tr style="border-bottom: ${t?"1.5pt solid black":"2px solid #0f172a"};">
      <th style="${m} width: 15%;">Item</th>
      <th style="${P} width: 40%;">Variável de Entrada (Normativa)</th>
      <th style="${m} width: 28%;">Valor</th>
      <th style="${m} width: 17%;">Unid.</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="${o}">L</td><td style="${e}">Comprimento da estrutura (Longitudinal)</td><td style="${o}"><b>${l.l}</b></td><td style="${o}">m</td></tr>
    <tr><td style="${o}">W</td><td style="${e}">Largura da estrutura (Transversal)</td><td style="${o}"><b>${l.w}</b></td><td style="${o}">m</td></tr>
    <tr><td style="${o}">H</td><td style="${e}">Altura máxima da estrutura</td><td style="${o}"><b>${l.h}</b></td><td style="${o}">m</td></tr>
    <tr><td style="${o}">Ng</td><td style="${e}">Densidade de descargas (Regional)</td><td style="${o}"><b>${l.ng}</b></td><td style="${o}">/km².ano</td></tr>
    <tr><td style="${o}">Cd</td><td style="${e}">Fator de localização ambiental</td><td style="${o}"><b>${l.cd}</b></td><td style="${o}">-</td></tr>
    <tr><td style="${o}">rs</td><td style="${e}">Tipo de Construção (<b>${l.rs===1?"Robusta":"Simples"}</b>)</td><td style="${o}"><b>${l.rs}</b></td><td style="${o}">-</td></tr>
  </tbody>
</table>

### 2.2. ÁREAS DE EXPOSIÇÃO EQUIVALENTES (GEOMÉTRICO)
<table style="${w}">
  <thead>
    <tr style="border-bottom: ${t?"1.5pt solid black":"2px solid #0f172a"};">
      <th style="${m} width: 15%;">Cód.</th>
      <th style="${P} width: 40%;">Definição da Área (Anexo A) / Fonte de Dano</th>
      <th style="${m} width: 28%;">Resultado</th>
      <th style="${m} width: 17%;">Unid.</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="${o}">Ad</td><td style="${e}">Área de captação isolada (S1 — Descarga na Estrutura)</td><td style="${o}"><b>${(y=b.ad)==null?void 0:y.toFixed(2)}</b></td><td style="${o}">m²</td></tr>
    <tr><td style="${o}">Am</td><td style="${e}">Área de descargas próximas (S2 — Indução na Estrutura)</td><td style="${o}"><b>${(f=b.am)==null?void 0:f.toFixed(2)}</b></td><td style="${o}">m²</td></tr>
    <tr><td style="${o}">Al</td><td style="${e}">Área de captação das linhas (S3 — Descarga na Linha)</td><td style="${o}"><b>${$.toFixed(2)}</b></td><td style="${o}">m²</td></tr>
    <tr><td style="${o}">Ai</td><td style="${e}">Área de indução das linhas (S4 — Indução na Linha)</td><td style="${o}"><b>${h.toFixed(2)}</b></td><td style="${o}">m²</td></tr>
  </tbody>
</table>`}function rt(l,t=!1,b=0){var u,N;const s=l.calculations,c=`width:100%; border-collapse: collapse; font-size: 10.5px; margin-bottom: 12px; table-layout: auto; border: ${t?"1pt solid #000":"none"};`,g=t?"#000000":"rgba(226,232,240,0.1)",n=t?"#f1f5f9":"rgba(15,23,42,0.5)",w=t?"#000000":"#60a5fa",e=`padding: 3px 5px; border: 1px solid ${g}; text-align: left; color: ${t?"#000000":"#f1f5f9"}; word-wrap: break-word;`,P=`padding: 4px 6px; border: 1px solid ${g}; text-align: left; background-color: ${n}; font-weight: bold; color: ${w};`,m=l.zones[b],$=(m==null?void 0:m.probability_data)||l.probability_data,h=(m==null?void 0:m.loss_data)||{},y=`${$.CLD_electric_ext||0}_${$.CLI_electric_ext||0}`,f=`${$.CLD_data_ext||0}_${$.CLI_data_ext||0}`,x=t?"#e2e8f0":"rgba(59,130,246,0.05)",i=l.zones.length>1?` — [${(m==null?void 0:m.name)||`Zona ${b+1}`}]`:"",r=Math.min(1,($.wm1||5)*.12),d=Math.min(1,($.wm2||5)*.12);return`### 2.3. PARÂMETROS TÉCNICOS E PREMISSAS DE PROJETO (ESTRUTURA E LINHAS)${i}
<table style="${c}">
  <thead>
    <tr style="border-bottom: ${t?"1.5pt solid black":"2px solid #0f172a"};">
      <th style="${P} width: 20%;">Cód.</th>
      <th style="${P} width: 36%;">Fator Técnico Normativo</th>
      <th style="${P} width: 7%;">Valor</th>
      <th style="${P} width: 37%;">Detalhamento da Premissa Escolhida (NBR 5419-2)</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background: ${x};"><td colspan="4" style="padding: 3px 6px; font-weight: bold; border: 1px solid ${g}; color: ${t?"#000":"inherit"};">A. PROTEÇÃO CONTRA DESCARGAS NA ESTRUTURA (S1 / S2)</td></tr>
    <tr><td style="${e}">PB</td><td style="${e}">Eficácia do SPDA</td><td style="${e}"><b>${$.PB}</b></td><td style="${e}">${S(V,$.PB)}</td></tr>
    <tr><td style="${e}">PTA</td><td style="${e}">Controle de Choque</td><td style="${e}"><b>${$.PTA}</b></td><td style="${e}">${S(Q,$.PTA)}</td></tr>
    <tr><td style="${e}">Ks1</td><td style="${e}">Blindagem (L. Malha wm1)</td><td style="${e}"><b>${r.toFixed(2)}</b></td><td style="${e}">Malha de ${$.wm1||5}m (Calculado Ks1)</td></tr>
    <tr><td style="${e}">Ks2</td><td style="${e}">Blindagem (L. Malha wm2)</td><td style="${e}"><b>${d.toFixed(2)}</b></td><td style="${e}">Malha de ${$.wm2||5}m (Calculado Ks2)</td></tr>
    <tr><td style="${e}">Rf</td><td style="${e}">Risco de Incêndio</td><td style="${e}"><b>${h.rf??"N/A"}</b></td><td style="${e}">${S(X,h.rf)}</td></tr>
    <tr><td style="${e}">Rp</td><td style="${e}">Combate ao Fogo</td><td style="${e}"><b>${h.rp??"N/A"}</b></td><td style="${e}">${S(Y,h.rp)}</td></tr>
    <tr style="background: ${x}; font-size: 9px;"><td style="${e}"><b>Nd / Nm</b></td><td style="${e}">Frequência de Eventos (Engenharia)</td><td style="${e}"><b>Fórmula Audit.</b></td><td style="${e}">
        S1: [Ng:<b>${l.ng}</b> x Ad:<b>${(u=s.ad)==null?void 0:u.toFixed(1)}</b> x Cd:<b>${l.cd}</b>] x 10⁻⁶ = <b>${a(s.nd)}</b><br/>
        S2: [Ng:<b>${l.ng}</b> x Am:<b>${(N=s.am)==null?void 0:N.toFixed(1)}</b>] x 10⁻⁶ = <b>${a(s.nm)}</b>
    </td></tr>
    
    <tr style="background: ${x};"><td colspan="4" style="padding: 3px 6px; font-weight: bold; border: 1px solid ${g}; color: ${t?"#000":"inherit"};">B. PROTEÇÃO DA LINHA DE ENERGIA (S3 / S4)</td></tr>
    <tr><td style="${e}">PTU</td><td style="${e}">Choque na Linha</td><td style="${e}"><b>${$.PTU_electric}</b></td><td style="${e}">${S(B,$.PTU_electric)}</td></tr>
    <tr><td style="${e}">CLI</td><td style="${e}">Tipo da Rede</td><td style="${e}"><b>${$.CLI_electric_ext}</b></td><td style="${e}">${S(j,y)}</td></tr>
    <tr><td style="${e}">Uw</td><td style="${e}">Suportabilidade Eqp</td><td style="${e}"><b>${$.Uw_electric_ext}</b></td><td style="${e}">${S(U,$.Uw_electric_ext)}</td></tr>
    <tr><td style="${e}">PSPD</td><td style="${e}">Eficácia DPS Elét.</td><td style="${e}"><b>${$.PSPD_electric}</b></td><td style="${e}">${S(I,$.PSPD_electric)}</td></tr>
    <tr style="background: ${x}; font-size: 9px;"><td style="${e}"><b>Nl / Ni</b></td><td style="${e}">Frequência na Linha Elétrica</td><td style="${e}"><b>Fórmula Audit.</b></td><td style="${e}">
        S3 (Direta): [Ng:<b>${l.ng}</b> x Al:<b>${(s.al1||0).toFixed(0)}</b> x Ct:<b>0,2</b>] x 10⁻⁶ = <b>${a(s.nl_electric)}</b><br/>
        S4 (Indução): [Ng:<b>${l.ng}</b> x Ai:<b>${(s.ai1||0).toFixed(0)}</b>] x 10⁻⁶ = <b>${a(s.ni_electric)}</b>
    </td></tr>

    <tr style="background: ${x};"><td colspan="4" style="padding: 3px 6px; font-weight: bold; border: 1px solid ${g}; color: ${t?"#000":"inherit"};">C. PROTEÇÃO DA LINHA DE DADOS (S3 / S4)</td></tr>
    <tr><td style="${e}">PTU</td><td style="${e}">Choque na Linha</td><td style="${e}"><b>${$.PTU_data}</b></td><td style="${e}">${S(B,$.PTU_data)}</td></tr>
    <tr><td style="${e}">CLI</td><td style="${e}">Blindagem Linha</td><td style="${e}"><b>${$.CLI_data_ext}</b></td><td style="${e}">${S(j,f)}</td></tr>
    <tr><td style="${e}">Uw</td><td style="${e}">Suportabilidade Eqp</td><td style="${e}"><b>${$.Uw_data_ext}</b></td><td style="${e}">${S(U,$.Uw_data_ext)}</td></tr>
    <tr><td style="${e}">PSPD</td><td style="${e}">Eficácia DPS Dados</td><td style="${e}"><b>${$.PSPD_data}</b></td><td style="${e}">${S(I,$.PSPD_data)}</td></tr>
    <tr style="background: ${x}; font-size: 9px;"><td style="${e}"><b>Nl / Ni</b></td><td style="${e}">Frequência na Linha de Dados</td><td style="${e}"><b>Fórmula Audit.</b></td><td style="${e}">
        S3 (Direta): [Ng:<b>${l.ng}</b> x Al:<b>${(s.al2||0).toFixed(0)}</b> x Ct:<b>1,0</b>] x 10⁻⁶ = <b>${a(s.nl_data)}</b><br/>
        S4 (Indução): [Ng:<b>${l.ng}</b> x Ai:<b>${(s.ai2||0).toFixed(0)}</b>] x 10⁻⁶ = <b>${a(s.ni_data)}</b>
    </td></tr>
  </tbody>
</table>`}function dt(l,t=!1,b=0){var k,M;const{calculations:s,probability_calculations:c,frequency_results:g,risk_results:n}=l,w=l.zones[b],o=(w==null?void 0:w.loss_data)||{},e=(w==null?void 0:w.probability_data)||l.probability_data,P=(n.R1||0)<=1e-5,m=l.frequency_config.is_critical_system?.1:1,$=(g.F||0)<=m,h=t?"#000000":"rgba(148,163,184,0.1)",y=t?"#000000":"#ffffff",f=t?"#000000":"#94a3b8",x=t?"background: #f8fafc; padding: 8px 12px; font-weight: 900; color: #000000; border-bottom: 2pt solid #000000; margin-top: 25pt; margin-bottom: 12pt; text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.5px;":"background: rgba(96,165,250,0.05); padding: 10px 16px; font-weight: 800; color: #60a5fa; border-left: 4px solid #60a5fa; margin-top: 40px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1.2px; font-size: 11.5px;",i=`padding: 8px 10px; text-align: left; vertical-align: middle; border-bottom: 1px solid ${h}; width: 15%; font-weight: bold; color: ${y}; font-size: 11px; word-wrap: break-word;`,r=`padding: 8px 10px; text-align: left; vertical-align: middle; border-bottom: 1px solid ${h}; width: 55%; color: ${f}; word-wrap: break-word;`,d=`padding: 8px 10px; text-align: right; vertical-align: middle; border-bottom: 1px solid ${h}; width: 30%; font-family: "Arial", monospace; font-weight: bold; color: ${y}; font-size: 11px; word-wrap: break-word;`,u=`width:100%; border-collapse: collapse; font-size: 10.2px; margin-bottom: 30px; table-layout: auto; border: ${t?"1pt solid black":"none"};`,N=(s.nl_electric||0)+(s.nl_data||0),T=(s.ni_electric||0)+(s.ni_data||0),E=(G,H,J)=>`
    <tr>
      <td style="${i}">${G}</td>
      <td style="${r}">${J}</td>
      <td style="${d}">${a(H)}</td>
    </tr>`;let A="";l.risks_to_analyze.R1&&(A+=`
<div style="${x}">3.7. COMPONENTES DO RISCO À VIDA HUMANA (R1)</div>
<table style="${u}">
  <tr><td style="${i}">RA</td><td style="${r}">Choque em seres vivos (Estrutura)</td><td style="${d}">${R(n.RA)}</td></tr>
  <tr><td style="${i}">RB</td><td style="${r}">Danos físicos (Estrutura - Fogo/Explosão)</td><td style="${d}">${R(n.RB)}</td></tr>
  <tr><td style="${i}">RC</td><td style="${r}">Falhas de sistemas internos (Estrutura)</td><td style="${d}">${R(n.RC)}</td></tr>
  <tr><td style="${i}">RM</td><td style="${r}">Falhas de sistemas (Estrutura - Campo Magnético)</td><td style="${d}">${R(n.RM)}</td></tr>
  <tr><td style="${i}">RU</td><td style="${r}">Choque em seres vivos (Linhas)</td><td style="${d}">${R((n.RU||0)+(n.RUT||0))}</td></tr>
  <tr><td style="${i}">RV</td><td style="${r}">Danos físicos (Linhas - Fogo/Explosão)</td><td style="${d}">${R((n.RV||0)+(n.RVT||0))}</td></tr>
  <tr><td style="${i}">RW</td><td style="${r}">Falhas de sistemas (Linhas - Surtos)</td><td style="${d}">${R((n.RW||0)+(n.RWT||0))}</td></tr>
  <tr><td style="${i}">RZ</td><td style="${r}">Falhas de sistemas (Linhas - Indução)</td><td style="${d}">${R((n.RZ||0)+(n.RZT||0))}</td></tr>
  <tr style="background: ${t?"#f1f5f9":"rgba(15,23,42,0.3)"};">
    <td style="${i}">TOTAL</td>
    <td style="${r}; font-weight: bold;">R1 TOTAL (Σ componentes avaliados)</td>
    <td style="${d}">${R(n.R1)}</td>
  </tr>
</table>`),l.risks_to_analyze.R3&&(A+=`
<div style="${x}">3.8. COMPONENTES DO RISCO AO PATRIMÔNIO CULTURAL (R3)</div>
<table style="${u}">
  ${E("RB",n.RB3,"Danos físicos - Fogo/Explosão (Estrutura)")}
  ${E("RV",(n.RV3||0)+(n.RVT3||0),"Danos físicos - Fogo/Explosão (Linhas)")}
  <tr style="background: ${t?"#f1f5f9":"rgba(15,23,42,0.3)"};">
    <td style="${i}">TOTAL</td>
    <td style="${r}; font-weight: bold;">R3 TOTAL (Σ componentes avaliados)</td>
    <td style="${d}">${a(n.R3)}</td>
  </tr>
</table>`),l.risks_to_analyze.R4&&(A+=`
<div style="${x}">3.9. COMPONENTES DO RISCO ECONÔMICO (R4)</div>
<table style="${u}">
  ${E("RA",n.RA4,"Choque em seres vivos (Estrutura)")}
  ${E("RB",n.RB4,"Danos físicos (Estrutura - Fogo/Explosão)")}
  ${E("RC",n.RC4,"Falhas de sistemas internos (Estrutura)")}
  ${E("RM",n.RM4,"Falhas de sistemas (Estrutura - Campo Magnético)")}
  ${E("RU",(n.RU4||0)+(n.RUT4||0),"Choque em seres vivos (Linhas)")}
  ${E("RV",(n.RV4||0)+(n.RVT4||0),"Danos físicos (Linhas - Fogo/Explosão)")}
  ${E("RW",(n.RW4||0)+(n.RWT4||0),"Falhas de sistemas (Linhas - Surtos)")}
  ${E("RZ",(n.RZ4||0)+(n.RZT4||0),"Falhas de sistemas (Linhas - Indução)")}
  <tr style="background: ${t?"#f1f5f9":"rgba(15,23,42,0.3)"};">
    <td style="${i}">TOTAL</td>
    <td style="${r}; font-weight: bold;">R4 TOTAL (Σ componentes avaliados)</td>
    <td style="${d}">${a(n.R4)}</td>
  </tr>
</table>`);const q=l.has_electric_line&&l.has_data_line?1-(1-(c.PC||0))*(1-(c.PCT||0)):(l.has_electric_line?c.PC:c.PCT)||0,Z=l.has_electric_line&&l.has_data_line?1-(1-(c.PM||0))*(1-(c.PMT||0)):(l.has_electric_line?c.PM:c.PMT)||0;return A+=`
<div style="${x}">3.10. COMPONENTES DA FREQUÊNCIA DE DANOS (FD = N x P)</div>
<table style="${u}">
  <thead>
    <tr style="background: ${t?"#f1f5f9":"rgba(15,23,42,0.5)"}; color: ${t?"#000000":"#60a5fa"};">
       <th style="${i}">Fator</th>
       <th style="${r}">Equação Auditável: N x P [Valores Literais]</th>
       <th style="${d}">Resultado</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="${i}">FB</td><td style="${r}">[Nd:${a(s.nd)} x PB:${a(c.PB)}] ${l.frequency_config.has_equipment_in_ZPR0A?"":"(Ignorado: s/ eqp. ZPR0A)"}</td><td style="${d}">${C(g.FB)}</td></tr>
    <tr><td style="${i}">FC</td><td style="${r}">[Nd:${a(s.nd)} x PC_comb:${a(q)}]</td><td style="${d}">${C(g.FC)}</td></tr>
    <tr><td style="${i}">FM</td><td style="${r}">[Nm:${a(s.nm)} x PM_comb:${a(Z)}]</td><td style="${d}">${C(g.FM)}</td></tr>
    <tr><td style="${i}">FV</td><td style="${r}">[Nl_elétrica:${a(s.nl_electric)} x PEB_elétr.:${e.PEB_electric}] + [Nl_dados:${a(s.nl_data)} x PEB_dados:${e.PEB_data}]</td><td style="${d}">${C(g.FV)}</td></tr>
    <tr><td style="${i}">FW</td><td style="${r}">[Nl_elétrica:${a(s.nl_electric)} x PW:${a(c.PW)}] + [Nl_dados:${a(s.nl_data)} x PWT:${a(c.PWT)}]</td><td style="${d}">${C(g.FW)}</td></tr>
    <tr><td style="${i}">FZ</td><td style="${r}">[Ni_elétrica:${a(s.ni_electric)} x PZ:${a(c.PZ)}] + [Ni_dados:${a(s.ni_data)} x PZT:${a(c.PZT)}]</td><td style="${d}">${C(g.FZ)}</td></tr>
    <tr style="background: ${t?"#f1f5f9":"rgba(15,23,42,0.3)"};">
      <td style="${i}">TOTAL</td>
      <td style="${r}; font-weight: bold;">FD TOTAL (Σ componentes avaliados)</td>
      <td style="${d}">${C(g.F)}</td>
    </tr>
  </tbody>
</table>`,`
<div style="${x}">3.1. ESTIMATIVA DE EVENTOS PERIGOSOS ANUAIS (N)</div>
<table style="${u}">
  <tr><td style="${i}">Nd (S1)</td><td style="${r}">[Ng:${l.ng} x Ad:${(k=s.ad)==null?void 0:k.toFixed(2)} x Cd:${l.cd}] x 10⁻⁶</td><td style="${d}">${a(s.nd)}</td></tr>
  <tr><td style="${i}">Nm (S2)</td><td style="${r}">[Ng:${l.ng} x Am:${(M=s.am)==null?void 0:M.toFixed(2)}] x 10⁻⁶</td><td style="${d}">${a(s.nm)}</td></tr>
  <tr><td style="${i}">Nl (S3)</td><td style="${r}">[Somatório das descargas diretas na rede (Elétrica + Dados)]</td><td style="${d}">${a(N)}</td></tr>
  <tr><td style="${i}">Ni (S4)</td><td style="${r}">[Somatório das induções laterais na rede (Elétrica + Dados)]</td><td style="${d}">${a(T)}</td></tr>
</table>

<div style="${x}">3.2. PROBABILIDADES DE DANO RESIDUAL (P)</div>
<table style="${u}">
  <tr><td style="${i}">PA</td><td style="${r}">P<sub>TA</sub>:${e.PTA} x P<sub>B</sub>:${e.PB}</td><td style="${d}">${a(c.PA)}</td></tr>
  <tr><td style="${i}">PB</td><td style="${r}">Eficácia SPDA (Nível ${e.PB})</td><td style="${d}">${a(c.PB)}</td></tr>
  <tr><td style="${i}">PC</td><td style="${r}">P<sub>SPD</sub>:${e.PSPD_electric} x C<sub>LD</sub>:1,0 (Simplificado)</td><td style="${d}">${a(c.PC)}</td></tr>
  <tr><td style="${i}">PM</td><td style="${r}">P<sub>SPD</sub>:${e.PSPD_electric} x P<sub>MS</sub>:${a(c.Pms).replace(/<\/?sup>/g,"")}</td><td style="${d}">${a(c.PM)}</td></tr>
  <tr><td style="${i}">PU</td><td style="${r}">P<sub>TU</sub>:${e.PTU_electric} x P<sub>EB</sub>:${e.PEB_electric} x P<sub>LD</sub>:1,0 x C<sub>LD</sub>:1,0</td><td style="${d}">${a(c.PU)}</td></tr>
  <tr><td style="${i}">PV</td><td style="${r}">P<sub>EB</sub>:${e.PEB_electric} x P<sub>LD</sub>:1,0 x C<sub>LD</sub>:1,0</td><td style="${d}">${a(c.PV)}</td></tr>
  <tr><td style="${i}">PW</td><td style="${r}">P<sub>SPD</sub>:${e.PSPD_electric} x P<sub>LD</sub>:1,0 x C<sub>LD</sub>:1,0</td><td style="${d}">${a(c.PW)}</td></tr>
  <tr><td style="${i}">PZ</td><td style="${r}">P<sub>SPD</sub>:${e.PSPD_electric} x C<sub>LI</sub>:1,0 x P<sub>LI</sub>:${a(c.Pli_electric_ext).replace(/<\/?sup>/g,"")}</td><td style="${d}">${a(c.PZ)}</td></tr>
</table>

<div style="${x}">3.3. FATORES DE PERDAS ESTIMADOS (L)</div>
<table style="${u}">
  <tr><td style="${i}">LA / LU</td><td style="${r}">[rt:${o.rt} x lt:${o.lt||.01} x (nz:${o.nz||0}/nt:${o.nt||1}) x (tz:${o.tz||0}/8760) x rs:${l.rs||1}]</td><td style="${d}">${_(o.LA)}</td></tr>
  <tr><td style="${i}">LB / LV</td><td style="${r}">[rs:${l.rs||1} x rp:${o.rp} x rf:${o.rf} x hz:${o.hz} x LF:${o.LF} x (nz/nt * tz/8760)]</td><td style="${d}">${_(o.LB)}</td></tr>
  <tr><td style="${i}">LC/LM/LW/LZ</td><td style="${r}">[LO:${o.LO} x (nz/nt * tz/8760) x rs:${l.rs||1}]</td><td style="${d}">${_(o.LC)}</td></tr>
</table>

<div style="${x}">3.4. MEMORIAL DE CÁLCULO DOS COMPONENTES DE RISCO (R = N x P x L)</div>
<table style="${u}">
  <thead>
    <tr style="background: ${t?"#f1f5f9":"rgba(15,23,42,0.5)"}; color: ${t?"#000000":"#60a5fa"};">
       <th style="${i}">Comp.</th>
       <th style="${r}">Equação Auditável: N x P x L [Valores Literais]</th>
       <th style="${d}">Resultado</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="${i}">RA</td><td style="${r}">[Nd:${a(s.nd)} x PA:${a(c.PA)} x LA:${a(o.LA)}]</td><td style="${d}">${R(n.RA)}</td></tr>
    <tr><td style="${i}">RB</td><td style="${r}">[Nd:${a(s.nd)} x PB:${a(c.PB)} x LB:${a(o.LB)}]</td><td style="${d}">${R(n.RB)}</td></tr>
    <tr><td style="${i}">RC</td><td style="${r}">[Nd:${a(s.nd)} x PC:${a(c.PC)} x LC:${a(o.LC)}]</td><td style="${d}">${R(n.RC)}</td></tr>
    <tr><td style="${i}">RM</td><td style="${r}">[Nm:${a(s.nm)} x PM:${a(c.PM)} x LM:${a(o.LC)}]</td><td style="${d}">${R(n.RM)}</td></tr>
    <tr><td style="${i}">RU</td><td style="${r}">[Nl:${a(s.nl_electric)} x PU:${a(c.PU)} x LU:${a(o.LA)}]</td><td style="${d}">${R(n.RU)}</td></tr>
    <tr><td style="${i}">RV</td><td style="${r}">[Nl:${a(s.nl_electric)} x PV:${a(c.PV)} x LV:${a(o.LB)}]</td><td style="${d}">${R(n.RV)}</td></tr>
    <tr><td style="${i}">RW</td><td style="${r}">[Nl:${a(s.nl_electric)} x PW:${a(c.PW)} x LW:${a(o.LC)}]</td><td style="${d}">${R(n.RW)}</td></tr>
    <tr><td style="${i}">RZ</td><td style="${r}">[Ni:${a(s.ni_electric)} x PZ:${a(c.PZ)} x LZ:${a(o.LC)}]</td><td style="${d}">${R(n.RZ)}</td></tr>
  </tbody>
</table>

${A}

<div style="${x}">3.11. RESUMO DE CONFORMIDADE E RESULTADOS FINAIS</div>

<div style="display: flex; gap: 20px; align-items: stretch; margin-bottom: 40px; ${t?"display: block;":""}">
  <div style="flex: 1; border: ${t?"2.5pt solid #000000":"1px solid rgba(251,191,36,0.2)"}; padding: 25px; border-radius: 12px; background: ${t?"#ffffff":"rgba(251,191,36,0.03)"}; ${t?"margin-bottom: 25pt;":""}">
    <div style="font-size: 10px; font-weight: 900; letter-spacing: 2.5px; color: ${t?"#000000":"#fbbf24"}; text-transform: uppercase; margin-bottom: 12px; border-bottom: 1.5pt solid ${t?"#000000":"rgba(251,191,36,0.1)"}; padding-bottom: 8px;">
      <b>📉 RT (R1) — GLOBAL</b>
    </div>
    <div style="font-size: 28px; font-weight: 950; color: ${t?"#000000":"#ffffff"}; margin-bottom: 8px; font-family: 'Arial', monospace; letter-spacing: -0.5px;">
      ${R(n.R1)}
    </div>
    <div style="font-size: 11px; font-weight: 800; color: ${t?"#000000":"#94a3b8"}; margin-bottom: 20px;">
      LIMITE TOLERÁVEL: <span style="color: ${t?"#000000":"#ffffff"}">1,00 x 10⁻⁵</span>
    </div>
    <div style="display: inline-block; padding: 8px 18px; border-radius: 4px; background: ${P?"#059669":"#dc2626"}; color: white; font-size: 13px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase;">
      ${P?"✓ CONFORME":"❌ CRÍTICO"}
    </div>
  </div>

  <div style="flex: 1; border: ${t?"2.5pt solid #000000":"1px solid rgba(96,165,250,0.2)"}; padding: 25px; border-radius: 12px; background: ${t?"#ffffff":"rgba(96,165,250,0.03)"};">
    <div style="font-size: 10px; font-weight: 900; letter-spacing: 2.5px; color: ${t?"#000000":"#60a5fa"}; text-transform: uppercase; margin-bottom: 12px; border-bottom: 1.5pt solid ${t?"#000000":"rgba(96,165,250,0.1)"}; padding-bottom: 8px;">
      <b>⚡ Frequência Total (F) — Global</b>
    </div>
    <div style="font-size: 28px; font-weight: 950; color: ${t?"#000000":"#ffffff"}; margin-bottom: 8px; font-family: 'Arial', monospace; letter-spacing: -0.5px;">
      ${C(g.F)}
    </div>
    <div style="font-size: 11px; font-weight: 800; color: ${t?"#000000":"#94a3b8"}; margin-bottom: 20px;">
      LIMITE TOLERÁVEL: <span style="color: ${t?"#000000":"#ffffff"}">${C(m)}</span>
    </div>
    <div style="display: inline-block; padding: 8px 18px; border-radius: 4px; background: ${$?"#059669":"#dc2626"}; color: white; font-size: 13px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase;">
      ${$?"✓ CONFORME":"❌ CRÍTICO"}
    </div>
  </div>
</div>

<div style="border-top: 2px dashed ${t?"#000000":"rgba(148,163,184,0.1)"}; margin: 20px 0; height: 1px;"></div>`}async function v(l,t=!1){const{risk_results:b,frequency_results:s}=l,c=!Object.entries(l.risks_to_analyze).some(([$,h])=>h&&l.risk_results[$]>{R1:1e-5,R3:.001,R4:.001}[$]),g=l.frequency_config.is_critical_system?.1:1,n=(s.F||0)<=g,w=()=>{const $=c&&n?"✅ CONFORMIDADE TÉCNICA NBR 5419:2026":"❌ NÃO CONFORMIDADE DETECTADA",h=c&&n?"safe":"danger";let y="";if(c&&n){const r=l.probability_data.PB,d=l.probability_data.PSPD_electric,u=E=>E.replace(/\s+[0-9,.]+$/,"").trim(),N=r===1?"à **ausência de SPDA externo**":`à **presença do ${u(S(V,r))}**`,T=d===1?"e à **ausência de MPS (DPS)**":`e à **presença das MPS (${u(S(I,d))}) PEB e PSPD**`;y=`A edificação encontra-se **PROTEGIDA**. A conformidade está vinculada ${N} ${T}, conforme parâmetros detalhados nas tabelas de premissas por zona.`}else y="**O RISCO SUPERA OS LIMITES.** Recomenda-se: 1) Elevar Classe SPDA; 2) DPS coordenados Classe I; 3) Reforçar combate a incêndio (Rp).";const f=(b.R1||0)<=1e-5,x=l.frequency_config.is_critical_system?.1:1,i=(s.F||0)<=x;return`## 5. CONCLUSÃO TÉCNICA
<div class="status-box ${h}">
    <h3>${$}</h3>
    <p style="color: ${t?"#000000":"inherit"}">${y}</p>
</div>

### RESUMO DOS INDICADORES DE CONFORMIDADE:
<table style="width:100%; border-collapse: collapse; font-size: 11px; table-layout: fixed; margin-top: 5px; border: ${t?"1pt solid black":"none"};">
  <tr style="background: ${t?"#f1f5f9":"rgba(251,191,36,0.08)"}; border-bottom: 2px solid ${t?"#1e3a8a":"#fbbf24"};">
    <td colspan="4" style="padding: 16px 14px; font-weight: 900; color: ${t?"#1e3a8a":"#fbbf24"}; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; border-left: 5px solid ${t?"#1e3a8a":"#fbbf24"};">${$}</td>
  </tr>
  <tr style="background: ${t?"#f1f5f9":"rgba(15,23,42,0.5)"}; color: ${t?"#1e3a8a":"#60a5fa"};">
    <th style="padding: 6px; border: 1px solid ${t?"black":"rgba(248,250,252,0.1)"}; text-align: left; width: 45%;">Parâmetro Analisado</th>
    <th style="padding: 6px; border: 1px solid ${t?"black":"rgba(248,250,252,0.1)"}; text-align: center; width: 20%;">Calculado</th>
    <th style="padding: 6px; border: 1px solid ${t?"black":"rgba(248,250,252,0.1)"}; text-align: center; width: 20%;">Tolerável</th>
    <th style="padding: 6px; border: 1px solid ${t?"black":"rgba(248,250,252,0.1)"}; text-align: center; width: 15%;">Status</th>
  </tr>
  <tr>
    <td style="padding: 6px; border: 1px solid ${t?"black":"rgba(248,250,252,0.1)"}; color: ${t?"black":"#f8fafc"};">Risco à Vida Humana (R1)</td>
    <td colspan="2" style="padding: 6px; border: 1px solid ${t?"black":"rgba(248,250,252,0.1)"}; text-align: center; color: ${t?"black":"#f8fafc"}; font-family: monospace;"><b>${R(b.R1)} ${f?"≤":">"} 1,00 x 10⁻⁵</b></td>
    <td style="padding: 6px; border: 1px solid ${t?"black":"rgba(248,250,252,0.1)"}; text-align: center; color: ${f?"#059669":"#dc2626"}; font-weight: bold;">${f?"CONFORME":"CRÍTICO"}</td>
  </tr>
  <tr>
    <td style="padding: 6px; border: 1px solid ${t?"black":"rgba(248,250,252,0.1)"}; color: ${t?"black":"#f8fafc"};">Frequência de Danos (FD)</td>
    <td colspan="2" style="padding: 6px; border: 1px solid ${t?"black":"rgba(248,250,252,0.1)"}; text-align: center; color: ${t?"black":"#f8fafc"}; font-family: monospace;"><b>${C(s.F)} ${i?"≤":">"} ${C(x)}</b></td>
    <td style="padding: 6px; border: 1px solid ${t?"black":"rgba(248,250,252,0.1)"}; text-align: center; color: ${i?"#059669":"#dc2626"}; font-weight: bold;">${i?"CONFORME":"CRÍTICO"}</td>
  </tr>
</table>`},o=($,h,y,f)=>{if(t)return"";const x=f==="R1"?R:C,i=f==="R1"?"1,00 x 10⁻⁵":C(y),r=h<=y,d=Math.min(100,h/y*100),u=r?"#10b981":"#ef4444",N=`<svg width="400" height="70" viewBox="0 0 400 70" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="70" fill="rgba(248,250,252,0.8)" rx="8"/>
            <text x="12" y="20" font-family="Arial" font-size="11" font-weight="900" fill="#334155">${$}</text>
            <rect x="12" y="32" width="376" height="10" fill="#e2e8f0" rx="5"/>
            <rect x="12" y="32" width="${(d*3.76).toFixed(0)}" height="10" fill="${u}" rx="5"/>
            <text x="12" y="58" font-family="Arial" font-size="10" font-weight="bold" fill="#1e293b">${x(h).replace(/<\/?sup>/g,"")} ${r?"≤":">"} ${i.replace(/<\/?sup>/g,"")} [${r?"CONFORME":"CRÍTICO"}]</text>
            <circle cx="${(d*3.76+12).toFixed(0)}" cy="37" r="4" fill="white" stroke="${u}" stroke-width="3"/>
        </svg>`.trim();return`data:image/svg+xml;base64,${typeof window<"u"?window.btoa(unescape(encodeURIComponent(N))):Buffer.from(N).toString("base64")}`},e=t?"_[Gráficos omitidos para maior compatibilidade com Word. Consulte os dados na tabela de conformidade no final do relatório.]_":`![Gráfico de Risco R1](${o("SISTEMA 01: RISCO À VIDA HUMANA (R1)",b.R1||0,1e-5,"R1")})`,P=t?"":`![Gráfico de Frequência FD](${o("SISTEMA 02: FREQUÊNCIA DE DANOS (FD)",s.F||0,g,"FD")})`,m=l.zones.map(($,h)=>rt(l,t,h)).join(`

`);return`
# <span style="color: ${t?"#000000":"#ffffff"};">RELATÓRIO TÉCNICO:</span>
# <span style="color: ${t?"#000000":"#fbbf24"};">ANÁLISE DE RISCO PDA (NBR 5419-2 2026)</span>

## 🏛️ <span style="color: ${t?"#000000":"#fbbf24"};">1. IDENTIFICAÇÃO E DADOS GERAIS</span>
<div style="background: ${t?"#f1f5f9":"rgba(30,41,59,0.5)"}; border: 1px solid ${t?"#000000":"rgba(148,163,184,0.2)"}; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
<table style="width:100%; border-collapse: collapse; font-size: 11.5px; table-layout: auto;">
  <tr><td style="padding: 6px 12px; width: 26%; color: ${t?"#000000":"#94a3b8"}; vertical-align: top;"><b>CLIENTE:</b></td><td style="padding: 6px 12px; border-bottom: 1px solid ${t?"#000000":"rgba(148,163,184,0.1)"}; color: ${t?"#000000":"#f8fafc"};">${l.clientName||"N/A"}</td></tr>
  <tr><td style="padding: 6px 12px; color: ${t?"#000000":"#94a3b8"}; vertical-align: top;"><b>RESPONSÁVEL:</b></td><td style="padding: 6px 12px; border-bottom: 1px solid ${t?"#000000":"rgba(148,163,184,0.1)"}; color: ${t?"#000000":"#f8fafc"};">Engº ${l.technicalManagerName||"N/A"}</td></tr>
  <tr><td style="padding: 6px 12px; color: ${t?"#000000":"#94a3b8"}; vertical-align: top;"><b>LOCALIDADE:</b></td><td style="padding: 6px 12px; border-bottom: 1px solid ${t?"#000000":"rgba(148,163,184,0.1)"}; color: ${t?"#000000":"#f8fafc"};">${l.location||"Brasil"}</td></tr>
  <tr><td style="padding: 6px 12px; color: ${t?"#000000":"#94a3b8"}; vertical-align: top;"><b>DATA EMISSÃO:</b></td><td style="padding: 6px 12px; color: ${t?"#000000":"#f8fafc"};">${at(l.projectDate)}</td></tr>
</table>
</div>

## 📊 <span style="color: ${t?"#1e3a8a":"#fbbf24"};">2. ENTRADA DE DADOS E PREMISSAS NORMATIVAS</span>
${ot(l,t)}

${m}

## 📐 <span style="color: ${t?"#1e3a8a":"#fbbf24"};">3. MEMORIAL DE CÁLCULO</span>
${dt(l,t)}

## 🚦 <span style="color: ${t?"#1e3a8a":"#fbbf24"};">4. ANÁLISE GRÁFICA DE CONFORMIDADE</span>
O gráfico abaixo compara os valores calculados contra os limites de tolerância da NBR 5419:

${e}

${P}

## ⚖️ <span style="color: ${t?"#1e3a8a":"#fbbf24"};">5. CONCLUSÃO TÉCNICA E PARECER FINAL</span>
${w()}

<div style="text-align: center; margin-top: 120px; padding-top: 6px; border-top: 1px solid #000000; max-width: 320px; margin-left: auto; margin-right: auto;">
  <p style="font-size: 14px; margin-bottom: 0; color: ${t?"#000000":"#f8fafc"};"><b>Engº ${l.technicalManagerName||"Responsável Técnico"}</b></p>
  <p style="font-size: 11px; color: ${t?"#475569":"#94a3b8"}; margin-top: 4px;">Analista Especialista em PDA — NBR 5419:2:2026</p>
</div>
`.trim()}const F=(l,t)=>{const b=t.isWord||!1,s=b?"#000000":"#f8fafc",c=b?"#000000":"#3b82f6",g=b?"#1e3a8a":"#60a5fa",n=b?"#000000":"rgba(148,163,184,0.15)",o=l.replace(/^# (.*$)/gm,`<h1 style="font-size: 2rem; font-weight: 900; color: ${c}; margin-bottom: 1rem; text-align: center; border-bottom: 4px solid ${c}; padding-bottom: 0.5rem;">$1</h1>`).replace(/^## (.*$)/gm,`<h2 style="font-size: ${t.h2FontSizeRem}rem; font-weight: ${t.h2Weight||700}; color: ${g}; margin-top: ${t.h2MarginTopPx}px; margin-bottom: ${t.h2MarginBottomPx}px; border-left: 3px solid ${b?"#1e3a8a":"#3b82f6"}; padding-left: 0.75rem;">$1</h2>`).replace(/^### (.*$)/gm,`<h3 style="font-size: 1.25rem; font-weight: 700; color: ${b?"#334155":"#94a3b8"}; margin-top: 1.5rem; margin-bottom: 0.75rem;">$1</h3>`).replace(/\*\*(.*?)\*\*/g,'<strong style="color: inherit;">$1</strong>').replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/!\[(.*?)\]\((.*?)\)/g,'<div style="text-align: center; margin: 20px 0;"><img src="$2" alt="$1" style="max-width: 100%; height: auto; border: 1px solid #e2e8f0; border-radius: 8px;" /></div>').replace(/^\| (.*) \|$/gm,e=>{const P=e.split("|").filter(m=>m.trim()!=="").map(m=>`<td style="border: 1px solid ${n}; padding: 4px 6px; text-align: left; color: ${s};">${m.trim()}</td>`).join("");return`<table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem; border: 1px solid ${n};"><tr style="background: ${b?"#f8fafc":"rgba(15,23,42,0.3)"};">${P}</tr></table>`}).replace(/<div class="status-box danger">([\s\S]*?)<\/div>/g,'<div style="background: rgba(239,68,68,0.1); border: 2px solid #ef4444; border-radius: 1rem; padding: 1.5rem; margin: 2rem 0; color: #ef4444;">$1</div>').replace(/^\d\. (.*$)/gm,`<li style="margin-bottom: 0.2rem; color: ${t.isWord?"#000":"#cbd5e1"}; font-size: 0.9rem;">$1</li>`).replace(/\*\*(.*?)\*\*/g,`<strong style="color: ${t.isWord?"#1e40af":"#60a5fa"}; font-weight: 700;">$1</strong>`).replace(/^- (.*$)/gm,`<li style="margin-left: 0.75rem; margin-bottom: 0.15rem; color: ${t.isWord?"#000":"#94a3b8"}; font-size: 0.9rem;">$1</li>`).replace(/^> (.*$)/gm,`<blockquote style="border-left: 4px solid #3b82f6; padding: 0.5rem 1rem; margin: 1rem 0; background: rgba(59,130,246,0.05); font-style: italic; color: ${t.isWord?"#1e293b":"#94a3b8"};">$1</blockquote>`).replace(/<\/h[1-3]>\s*\n+/g,e=>e.replace(/\n+/g,"<br/>")).replace(/\n\s*\n/g,'<div style="margin-bottom: 12px;"></div>').replace(/\n/g," ");return`<div class="prose-styles" style="font-family: 'Inter', sans-serif; line-height: 1.5; text-align: justify; color: ${s};">${o}</div>`},bt=({data:l,onUpdate:t})=>{const[b,s]=O.useState(!1),[c,g]=O.useState(""),[n,w]=O.useState(!1),[o,e]=O.useState(""),P={h2FontSizeRem:1.15,h2Weight:700,h2MarginTopPx:48,h2MarginBottomPx:8,h3FontSizeRem:1,h3MarginTopPx:8,h3MarginBottomPx:2},m=async()=>{s(!0);try{e("Iniciando análise normativa NBR 5419-2:2026..."),await new Promise(f=>setTimeout(f,600)),e("Processando dados de densidade (Ng) e áreas (Ad, Am)..."),await new Promise(f=>setTimeout(f,600)),e("Calculando componentes de probabilidade e perdas..."),await new Promise(f=>setTimeout(f,600)),e("Consolidando resultados e gerando parecer técnico..."),await new Promise(f=>setTimeout(f,600)),e("Formatando relatório executivo premium...");const y=await v(l);g(y)}catch(y){console.error("Erro ao gerar relatório:",y)}finally{s(!1),e("")}},$=async()=>{s(!0);try{e("Gerando versão MS Word...");const y=await v(l,!0),f=F(y,{...P,isWord:!0}),x=`RELATORIO_SPDA_${(l.clientName||"PROJETO").replace(/\s+/g,"_").toUpperCase()}.doc`,i=`
                <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                <head>
                    <meta charset='utf-8'>
                    <style>
                        body { font-family: 'Arial', sans-serif; font-size: 11pt; color: #000000; }
                        table { border-collapse: collapse; width: 100%; border: 1pt solid #000; }
                        td, th { border: 1pt solid #000; padding: 4pt; font-size: 10pt; }
                    </style>
                </head>
                <body>${f}</body>
                </html>
            `,r=new Blob(["\uFEFF",i],{type:"application/msword"}),d=URL.createObjectURL(r),u=document.createElement("a");u.href=d,u.download=x,u.click(),URL.revokeObjectURL(d)}catch(y){console.error("Erro ao baixar Word:",y)}finally{s(!1),e("")}},h=async()=>{s(!0);try{e("Preparando versão para impressão PDF...");const y=await v(l,!0),f=F(y,{...P,isWord:!0}),x=window.open("","_blank");if(!x)return;x.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title>Relatório SPDA - ${l.clientName||"N/A"}</title>
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
                ${f}
                <div class="footer">Gerado via Plataforma SPDA — ${new Date().toLocaleDateString("pt-BR")} — Engº Júlio César Certo</div>
            </body></html>`),x.document.close(),setTimeout(()=>{x.focus(),x.print()},800)}catch(y){console.error("Erro ao preparar impressão:",y)}finally{s(!1),e("")}};return p.jsxs("div",{className:"space-y-4",children:[p.jsxs("div",{className:"flex flex-col md:flex-row items-stretch gap-4",children:[p.jsx(K,{mode:"wait",children:c?p.jsxs(D.div,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},className:"flex-1 bg-slate-900 border border-slate-700 rounded-3xl p-5",children:[p.jsxs("div",{className:"flex items-center justify-between mb-6",children:[p.jsxs("h3",{className:"text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2",children:[p.jsx(z,{className:"w-6 h-6 text-blue-400"})," Relatório Técnico"]}),p.jsxs("div",{className:"flex gap-2",children:[p.jsx(L,{variant:"outline",size:"sm",onClick:$,children:"Word"}),p.jsx(L,{variant:"outline",size:"sm",onClick:h,children:"PDF"}),p.jsx(L,{variant:"outline",size:"icon",onClick:()=>g(""),children:p.jsx(et,{className:"w-4 h-4"})})]})]}),p.jsx("div",{className:"bg-slate-950 p-8 rounded-2xl border border-slate-800 max-h-[600px] overflow-y-auto",dangerouslySetInnerHTML:{__html:F(c,P)}})]},"report-view"):p.jsx(D.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},className:"flex-1",children:p.jsx(L,{onClick:m,disabled:b,className:"w-full h-20 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl",children:b?p.jsxs("div",{className:"flex items-center gap-2",children:[p.jsx(tt,{className:"w-6 h-6 animate-spin"}),p.jsx("span",{children:o})]}):p.jsxs("div",{className:"flex items-center gap-3",children:[p.jsx(z,{className:"w-8 h-8"}),p.jsx("span",{className:"text-xl font-black tracking-widest uppercase",children:"Gerar Relatório"})]})})},"gen-btn")}),!c&&p.jsxs(D.div,{initial:{opacity:0,x:10},animate:{opacity:1,x:0},className:"md:w-64 h-20 bg-slate-950/40 border border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-1 group hover:bg-blue-900/10 cursor-pointer transition-all border-dashed",onClick:async()=>{const y=JSON.stringify(l,null,2),f=`PROJETO_SPDA_${(l.clientName||"PROJETO").replace(/\s+/g,"_").toUpperCase()}.spda`;if("showSaveFilePicker"in window)try{const u=await(await window.showSaveFilePicker({suggestedName:f,types:[{description:"Arquivo de Projeto SPDA",accept:{"application/json":[".spda"]}}]})).createWritable();await u.write(y),await u.close();return}catch(d){if(d.name==="AbortError")return}const x=new Blob([y],{type:"application/json"}),i=URL.createObjectURL(x),r=document.createElement("a");r.href=i,r.download=f,r.click(),URL.revokeObjectURL(i)},children:[p.jsx(lt,{className:"w-6 h-6 text-slate-500 group-hover:text-blue-400 group-hover:scale-110 transition-all"}),p.jsx("span",{className:"text-[10px] font-black text-slate-500 group-hover:text-blue-400 uppercase tracking-widest leading-none",children:"Salvar Projeto"})]})]}),!c&&p.jsx(D.div,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},children:p.jsxs(W,{className:"bg-slate-950/60 border-slate-800 shadow-xl rounded-3xl overflow-hidden mt-6 p-5",children:[p.jsxs("div",{className:"flex items-center gap-2 text-slate-200 text-sm uppercase font-black tracking-widest mb-4",children:[p.jsx(st,{className:"w-4 h-4 text-emerald-500"})," Confirmação Técnica"]}),p.jsx("p",{className:"text-slate-300 leading-relaxed text-xs italic border-l-4 border-emerald-500/30 pl-4 py-1 mb-6",children:'"Este relatório automatizado é uma ferramenta de apoio para cálculos da NBR 5419:2026. A conferência final e a responsabilidade técnica integral pelo projeto cabem exclusivamente ao profissional habilitado."'}),p.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-3",children:[p.jsxs("div",{className:"p-3 rounded-xl bg-slate-900 border border-slate-800 text-center",children:[p.jsx("span",{className:"text-[9px] uppercase font-bold text-slate-500 tracking-widest block mb-1",children:"Autor da Ferramenta"}),p.jsx("span",{className:"text-slate-100 font-bold text-xs",children:"Engº Júlio César Certo"}),p.jsx("span",{className:"text-[8px] text-slate-500 block mt-1 leading-none italic",children:"(Não é o Resp. Técnico pela análise)"})]}),p.jsxs("div",{className:"p-3 rounded-xl bg-slate-900 border border-slate-800 text-center",children:[p.jsx("span",{className:"text-[9px] uppercase font-bold text-slate-500 tracking-widest block mb-1",children:"WhatsApp Apoio"}),p.jsx("span",{className:"text-slate-100 font-bold text-xs",children:"(35) 9 8811-3746"})]}),p.jsxs("div",{className:"p-3 rounded-xl bg-slate-900 border border-slate-800 text-center",children:[p.jsx("span",{className:"text-[9px] uppercase font-bold text-slate-500 tracking-widest block mb-1",children:"E-mail Suporte"}),p.jsx("span",{className:"text-slate-200 font-medium text-[10px]",children:"julio.certo@hotmail.com"})]})]})]})})]})};export{bt as ReportStep,F as markdownToHtml};
