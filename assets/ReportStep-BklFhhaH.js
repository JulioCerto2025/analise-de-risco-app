import{r as T,j as b,A as Q,m as _}from"./motion-CZTIYVKD.js";import{P as H,t as X,J as Y,R as W,v as V,U as q,w as U,M as G,B as L,C as tt}from"./index-B8wiwFK8.js";import{L as et,x as Z,X as lt,y as st,t as dt}from"./icons-s-On-H28.js";import"./react-Bzgz95E1.js";import"./charts-D7Odik-1.js";function w(l,t){const p=l.find(a=>String(a.value)===String(t));return p?p.label:`Valor ${t}`}function o(l){if(l===void 0||isNaN(l)||l===0)return"0,00";if(Math.abs(l)<.001){const t=l.toExponential(2).split("e"),p=t[0].replace(".",","),a=parseInt(t[1]);return`${p} x 10<sup>${a}</sup>`}return l.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:3})}function N(l){if(l===void 0||isNaN(l)||l===0)return"0,00";const t=l.toExponential(2).split("e"),p=t[0].replace(".",","),a=parseInt(t[1]);return`${p} x 10<sup>${a}</sup>`}function u(l){return l===void 0||isNaN(l)?"0,00 x 10<sup>-5</sup>":l===0?"0,00":l<1e-7&&l>0?N(l):`${(l*1e5).toFixed(2).replace(".",",")} x 10<sup>-5</sup>`}function A(l){return l===void 0||isNaN(l)||l===0?"0,00":l<.01?N(l):l.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}function rt(l){if(!l)return new Date().toLocaleDateString("pt-BR");if(l.includes("-")){const[t,p,a]=l.split("-");return`${a}/${p}/${t}`}return l}function at(l,t=!1){var s,d;const{calculations:p}=l,a=t?"#000000":"#f8fafc",n=t?"#000000":"rgba(226,232,240,0.1)",m=t?"#f1f5f9":"rgba(59,130,246,0.05)",c=t?"#000000":"#60a5fa";let P=`width: 100%; border-collapse: collapse; margin-bottom: 32px; border: ${t?"1.5pt solid #000000":`1px solid ${n}`}; table-layout: fixed;`;const i=`padding: 3px 5px; border: 1px solid ${n}; text-align: center; color: ${a}; word-wrap: break-word;`,e=`padding: 3px 5px; border: 1px solid ${n}; text-align: left; color: ${a}; word-wrap: break-word;`,h=`padding: 12px 14px; text-align: left; font-weight: 950; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: ${c}; vertical-align: middle; background-color: ${m};`,y=`padding: 12px 14px; text-align: center; font-weight: 950; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: ${c}; vertical-align: middle; background-color: ${m};`,$=(p.al1||0)+(p.al2||0),x=(p.ai1||0)+(p.ai2||0);return`### 2.1. PARÂMETROS FÍSICOS E AMBIENTAIS (ESTRUTURA)
<table style="${P}">
  <thead>
    <tr style="border-bottom: ${t?"1.5pt solid black":"2px solid #0f172a"};">
      <th style="${y} width: 15%;">Item</th>
      <th style="${h} width: 40%;">Variável de Entrada (Normativa)</th>
      <th style="${y} width: 28%;">Valor</th>
      <th style="${y} width: 17%;">Unid.</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="${i}">L</td><td style="${e}">Comprimento da estrutura (Longitudinal)</td><td style="${i}"><b>${l.l}</b></td><td style="${i}">m</td></tr>
    <tr><td style="${i}">W</td><td style="${e}">Largura da estrutura (Transversal)</td><td style="${i}"><b>${l.w}</b></td><td style="${i}">m</td></tr>
    <tr><td style="${i}">H</td><td style="${e}">Altura máxima da estrutura</td><td style="${i}"><b>${l.h}</b></td><td style="${i}">m</td></tr>
    <tr><td style="${i}">Ng</td><td style="${e}">Densidade de descargas (Regional)</td><td style="${i}"><b>${l.ng}</b></td><td style="${i}">/km².ano</td></tr>
    <tr><td style="${i}">Cd</td><td style="${e}">Fator de localização ambiental</td><td style="${i}"><b>${l.cd}</b></td><td style="${i}">-</td></tr>
    <tr><td style="${i}">rs</td><td style="${e}">Tipo de Construção (<b>${l.rs===1?"Robusta":"Simples"}</b>)</td><td style="${i}"><b>${l.rs}</b></td><td style="${i}">-</td></tr>
  </tbody>
</table>

### 2.2. ÁREAS DE EXPOSIÇÃO EQUIVALENTES (GEOMÉTRICO)
<table style="${P}">
  <thead>
    <tr style="border-bottom: ${t?"1.5pt solid black":"2px solid #0f172a"};">
      <th style="${y} width: 15%;">Cód.</th>
      <th style="${h} width: 40%;">Definição da Área (Anexo A) / Fonte de Dano</th>
      <th style="${y} width: 28%;">Resultado</th>
      <th style="${y} width: 17%;">Unid.</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="${i}">Ad</td><td style="${e}">Área de captação isolada (S1 — Descarga na Estrutura)</td><td style="${i}"><b>${(s=p.ad)==null?void 0:s.toFixed(2)}</b></td><td style="${i}">m²</td></tr>
    <tr><td style="${i}">Am</td><td style="${e}">Área de descargas próximas (S2 — Indução na Estrutura)</td><td style="${i}"><b>${(d=p.am)==null?void 0:d.toFixed(2)}</b></td><td style="${i}">m²</td></tr>
    <tr><td style="${i}">Al</td><td style="${e}">Área de captação das linhas (S3 — Descarga na Linha)</td><td style="${i}"><b>${$.toFixed(2)}</b></td><td style="${i}">m²</td></tr>
    <tr><td style="${i}">Ai</td><td style="${e}">Área de indução das linhas (S4 — Indução na Linha)</td><td style="${i}"><b>${x.toFixed(2)}</b></td><td style="${i}">m²</td></tr>
  </tbody>
</table>`}function ot(l,t=!1,p=0){var f,C;const a=l.calculations,n=`width:100%; border-collapse: collapse; font-size: 10.5px; margin-bottom: 12px; table-layout: auto; border: ${t?"1pt solid #000":"none"};`,m=t?"#000000":"rgba(226,232,240,0.1)",c=t?"#f1f5f9":"rgba(15,23,42,0.5)",P=t?"#000000":"#60a5fa",e=`padding: 3px 5px; border: 1px solid ${m}; text-align: left; color: ${t?"#000000":"#f1f5f9"}; word-wrap: break-word;`,h=`padding: 4px 6px; border: 1px solid ${m}; text-align: left; background-color: ${c}; font-weight: bold; color: ${P};`,y=l.zones[p],$=(y==null?void 0:y.probability_data)||l.probability_data,x=(y==null?void 0:y.loss_data)||{},s=`${$.CLD_electric_ext||0}_${$.CLI_electric_ext||0}`,d=`${$.CLD_data_ext||0}_${$.CLI_data_ext||0}`,r=t?"#e2e8f0":"rgba(59,130,246,0.05)",g=l.zones.length>1?` — [${(y==null?void 0:y.name)||`Zona ${p+1}`}]`:"",R=Math.min(1,($.wm1||5)*.12),S=Math.min(1,($.wm2||5)*.12);return`### 2.3. PARÂMETROS TÉCNICOS E PREMISSAS DE PROJETO (ESTRUTURA E LINHAS)${g}
<table style="${n}">
  <thead>
    <tr style="border-bottom: ${t?"1.5pt solid black":"2px solid #0f172a"};">
      <th style="${h} width: 20%;">Cód.</th>
      <th style="${h} width: 36%;">Fator Técnico Normativo</th>
      <th style="${h} width: 7%;">Valor</th>
      <th style="${h} width: 37%;">Detalhamento da Premissa Escolhida (NBR 5419-2)</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background: ${r};"><td colspan="4" style="padding: 3px 6px; font-weight: bold; border: 1px solid ${m}; color: ${t?"#000":"inherit"};">A. PROTEÇÃO CONTRA DESCARGAS NA ESTRUTURA (S1 / S2)</td></tr>
    <tr><td style="${e}">PB</td><td style="${e}">Eficácia do SPDA</td><td style="${e}"><b>${$.PB}</b></td><td style="${e}">${w(H,$.PB)}</td></tr>
    <tr><td style="${e}">PTA</td><td style="${e}">Controle de Choque</td><td style="${e}"><b>${$.PTA}</b></td><td style="${e}">${w(X,$.PTA)}</td></tr>
    <tr><td style="${e}">Ks1</td><td style="${e}">Blindagem (L. Malha wm1)</td><td style="${e}"><b>${R.toFixed(2)}</b></td><td style="${e}">Malha de ${$.wm1||5}m (Calculado Ks1)</td></tr>
    <tr><td style="${e}">Ks2</td><td style="${e}">Blindagem (L. Malha wm2)</td><td style="${e}"><b>${S.toFixed(2)}</b></td><td style="${e}">Malha de ${$.wm2||5}m (Calculado Ks2)</td></tr>
    <tr><td style="${e}">Rf</td><td style="${e}">Risco de Incêndio</td><td style="${e}"><b>${x.rf??"N/A"}</b></td><td style="${e}">${w(Y,x.rf)}</td></tr>
    <tr><td style="${e}">Rp</td><td style="${e}">Combate ao Fogo</td><td style="${e}"><b>${x.rp??"N/A"}</b></td><td style="${e}">${w(W,x.rp)}</td></tr>
    <tr style="background: ${r}; font-size: 9px;"><td style="${e}"><b>Nd / Nm</b></td><td style="${e}">Frequência de Eventos (Engenharia)</td><td style="${e}"><b>Fórmula Audit.</b></td><td style="${e}">
        S1: [Ng:<b>${l.ng}</b> x Ad:<b>${(f=a.ad)==null?void 0:f.toFixed(1)}</b> x Cd:<b>${l.cd}</b>] x 10⁻⁶ = <b>${o(a.nd)}</b><br/>
        S2: [Ng:<b>${l.ng}</b> x Am:<b>${(C=a.am)==null?void 0:C.toFixed(1)}</b>] x 10⁻⁶ = <b>${o(a.nm)}</b>
    </td></tr>
    
    <tr style="background: ${r};"><td colspan="4" style="padding: 3px 6px; font-weight: bold; border: 1px solid ${m}; color: ${t?"#000":"inherit"};">B. PROTEÇÃO DA LINHA DE ENERGIA (S3 / S4)</td></tr>
    <tr><td style="${e}">PTU</td><td style="${e}">Choque na Linha</td><td style="${e}"><b>${$.PTU_electric}</b></td><td style="${e}">${w(V,$.PTU_electric)}</td></tr>
    <tr><td style="${e}">CLI</td><td style="${e}">Tipo da Rede</td><td style="${e}"><b>${$.CLI_electric_ext}</b></td><td style="${e}">${w(G,s)}</td></tr>
    <tr><td style="${e}">Uw</td><td style="${e}">Suportabilidade Eqp</td><td style="${e}"><b>${$.Uw_electric_ext}</b></td><td style="${e}">${w(q,$.Uw_electric_ext)}</td></tr>
    <tr><td style="${e}">PSPD</td><td style="${e}">Eficácia DPS Elét.</td><td style="${e}"><b>${$.PSPD_electric}</b></td><td style="${e}">${w(U,$.PSPD_electric)}</td></tr>
    <tr style="background: ${r}; font-size: 9px;"><td style="${e}"><b>Nl / Ni</b></td><td style="${e}">Frequência na Linha Elétrica</td><td style="${e}"><b>Fórmula Audit.</b></td><td style="${e}">
        S3 (Direta): [Ng:<b>${l.ng}</b> x Al:<b>${(a.al1||0).toFixed(0)}</b> x Ct:<b>0,2</b>] x 10⁻⁶ = <b>${o(a.nl_electric)}</b><br/>
        S4 (Indução): [Ng:<b>${l.ng}</b> x Ai:<b>${(a.ai1||0).toFixed(0)}</b>] x 10⁻⁶ = <b>${o(a.ni_electric)}</b>
    </td></tr>

    <tr style="background: ${r};"><td colspan="4" style="padding: 3px 6px; font-weight: bold; border: 1px solid ${m}; color: ${t?"#000":"inherit"};">C. PROTEÇÃO DA LINHA DE DADOS (S3 / S4)</td></tr>
    <tr><td style="${e}">PTU</td><td style="${e}">Choque na Linha</td><td style="${e}"><b>${$.PTU_data}</b></td><td style="${e}">${w(V,$.PTU_data)}</td></tr>
    <tr><td style="${e}">CLI</td><td style="${e}">Blindagem Linha</td><td style="${e}"><b>${$.CLI_data_ext}</b></td><td style="${e}">${w(G,d)}</td></tr>
    <tr><td style="${e}">Uw</td><td style="${e}">Suportabilidade Eqp</td><td style="${e}"><b>${$.Uw_data_ext}</b></td><td style="${e}">${w(q,$.Uw_data_ext)}</td></tr>
    <tr><td style="${e}">PSPD</td><td style="${e}">Eficácia DPS Dados</td><td style="${e}"><b>${$.PSPD_data}</b></td><td style="${e}">${w(U,$.PSPD_data)}</td></tr>
    <tr style="background: ${r}; font-size: 9px;"><td style="${e}"><b>Nl / Ni</b></td><td style="${e}">Frequência na Linha de Dados</td><td style="${e}"><b>Fórmula Audit.</b></td><td style="${e}">
        S3 (Direta): [Ng:<b>${l.ng}</b> x Al:<b>${(a.al2||0).toFixed(0)}</b> x Ct:<b>1,0</b>] x 10⁻⁶ = <b>${o(a.nl_data)}</b><br/>
        S4 (Indução): [Ng:<b>${l.ng}</b> x Ai:<b>${(a.ai2||0).toFixed(0)}</b>] x 10⁻⁶ = <b>${o(a.ni_data)}</b>
    </td></tr>
  </tbody>
</table>`}function it(l,t=!1,p=0){var j,z;const{calculations:a,probability_calculations:n,frequency_results:m,risk_results:c}=l,P=l.zones[p],i=(P==null?void 0:P.loss_data)||{},e=(P==null?void 0:P.probability_data)||l.probability_data,h=t?"#000000":"rgba(148,163,184,0.1)",y=t?"#000000":"#ffffff",$=t?"#000000":"#94a3b8",x=t?"background: #f8fafc; padding: 8px 12px; font-weight: 900; color: #000000; border-bottom: 2pt solid #000000; margin-top: 25pt; margin-bottom: 12pt; text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.5px;":"background: rgba(96,165,250,0.05); padding: 10px 16px; font-weight: 800; color: #60a5fa; border-left: 4px solid #60a5fa; margin-top: 40px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1.2px; font-size: 11.5px;",s=`padding: 8px 10px; text-align: left; vertical-align: middle; border-bottom: 1px solid ${h}; width: 15%; font-weight: bold; color: ${y}; font-size: 11px; word-wrap: break-word;`,d=`padding: 8px 10px; text-align: left; vertical-align: middle; border-bottom: 1px solid ${h}; width: 55%; color: ${$}; word-wrap: break-word;`,r=`padding: 8px 10px; text-align: right; vertical-align: middle; border-bottom: 1px solid ${h}; width: 30%; font-family: "Arial", monospace; font-weight: bold; color: ${y}; font-size: 11px; word-wrap: break-word;`,g=`width:100%; border-collapse: collapse; font-size: 10.2px; margin-bottom: 30px; table-layout: auto; border: ${t?"1pt solid black":"none"};`,R=(a.nl_electric||0)+(a.nl_data||0),S=(a.ni_electric||0)+(a.ni_data||0),f=l.rs||1,C=i.nz||5,D=i.nt||5,F=i.tz||8760,I=C/D*(F/8760),v=(i.rt||1e-5)*(i.lt||.01)*I*f,k=(i.rp||0)*(i.rf||0)*(i.hz||1)*(i.LF||0)*I*f,O=(i.LO||0)*I*f,J=l.has_electric_line&&l.has_data_line?1-(1-(n.PC||0))*(1-(n.PCT||0)):l.has_electric_line?n.PC:n.PCT||0,K=l.has_electric_line&&l.has_data_line?1-(1-(n.PM||0))*(1-(n.PMT||0)):l.has_electric_line?n.PM:n.PMT||0;let E="";return E+=`
<div style="${x}">3.1. ESTIMATIVA DE EVENTOS PERIGOSOS ANUAIS (N)</div>
<table style="${g}">
  <tr><td style="${s}">Nd (S1)</td><td style="${d}">[Ng:${l.ng} x Ad:${(j=a.ad)==null?void 0:j.toFixed(2)} x Cd:${l.cd}] x 10⁻⁶</td><td style="${r}">${o(a.nd)}</td></tr>
  <tr><td style="${s}">Nm (S2)</td><td style="${d}">[Ng:${l.ng} x Am:${(z=a.am)==null?void 0:z.toFixed(2)}] x 10⁻⁶</td><td style="${r}">${o(a.nm)}</td></tr>
  <tr><td style="${s}">Nl (S3)</td><td style="${d}">[Descargas diretas na rede (Elétrica + Dados)]</td><td style="${r}">${o(R)}</td></tr>
  <tr><td style="${s}">Ni (S4)</td><td style="${d}">[Induções laterais na rede (Elétrica + Dados)]</td><td style="${r}">${o(S)}</td></tr>
</table>`,E+=`
<div style="${x}">3.2. PROBABILIDADES DE DANO RESIDUAL (P)</div>
<table style="${g}">
  <tr><td style="${s}">PA</td><td style="${d}">P<sub>TA</sub>:${e.PTA} x P<sub>B</sub>:${e.PB}</td><td style="${r}">${o(n.PA)}</td></tr>
  <tr><td style="${s}">PB</td><td style="${d}">Eficácia SPDA (Nível ${e.PB})</td><td style="${r}">${o(n.PB)}</td></tr>
  <tr><td style="${s}">PC</td><td style="${d}">P<sub>SPD</sub>:${e.PSPD_electric} x C<sub>LD</sub>:1,0</td><td style="${r}">${o(n.PC)}</td></tr>
  <tr><td style="${s}">PM</td><td style="${d}">P<sub>SPD</sub>:${e.PSPD_electric} x P<sub>MS</sub>:${o(n.Pms).replace(/<\/?sup>/g,"")}</td><td style="${r}">${o(n.PM)}</td></tr>
  <tr><td style="${s}">PU</td><td style="${d}">P<sub>TU</sub>:${e.PTU_electric} x P<sub>EB</sub>:${e.PEB_electric}</td><td style="${r}">${o(n.PU)}</td></tr>
  <tr><td style="${s}">PV</td><td style="${d}">P<sub>EB</sub>:${e.PEB_electric} x P<sub>LD</sub>:1,0</td><td style="${r}">${o(n.PV)}</td></tr>
  <tr><td style="${s}">PW</td><td style="${d}">P<sub>SPD</sub>:${e.PSPD_electric} x P<sub>LD</sub>:1,0</td><td style="${r}">${o(n.PW)}</td></tr>
  <tr><td style="${s}">PZ</td><td style="${d}">P<sub>SPD</sub>:${e.PSPD_electric} x P<sub>LI</sub>:${o(n.Pli_electric_ext).replace(/<\/?sup>/g,"")}</td><td style="${r}">${o(n.PZ)}</td></tr>
</table>`,E+=`
<div style="${x}">3.3. FATORES DE PERDAS ESTIMADOS (L)</div>
<table style="${g}">
  <thead>
     <tr style="background: ${t?"#f1f5f9":"rgba(15,23,42,0.5)"}; color: ${t?"#000000":"#60a5fa"};">
        <th style="${s}">Fator</th>
        <th style="${d}">Memória de Cálculo [Equação]</th>
        <th style="${r}">VALOR CIENTÍFICO</th>
     </tr>
  </thead>
  <tbody>
    <tr><td style="${s}">LA / LU</td><td style="${d}">[rt:${i.rt||0} x lt:${i.lt||.01} x (nz/nt) x (tz/8760) x rs:${f}]</td><td style="${r}">${N(v)}</td></tr>
    <tr><td style="${s}">LB / LV</td><td style="${d}">[rp:${i.rp||0} x rf:${i.rf||0} x hz:${i.hz||1} x LF:${i.LF||0} x ... x rs:${f}]</td><td style="${r}">${N(k)}</td></tr>
    <tr><td style="${s}">LC/LM/LW/LZ</td><td style="${d}">[LO:${i.LO||0} x (nz/nt) x (tz/8760) x rs:${f}]</td><td style="${r}">${N(O)}</td></tr>
  </tbody>
</table>`,E+=`
<div style="${x}">3.4. MEMORIAL DE CÁLCULO DOS COMPONENTES DE RISCO (R = N x P x L)</div>
<table style="${g}">
  <thead>
    <tr style="background: ${t?"#f1f5f9":"rgba(15,23,42,0.5)"}; color: ${t?"#000000":"#60a5fa"};">
       <th style="${s}">Comp.</th>
       <th style="${d}">Equação Auditável: N x P x L [Valores Literais]</th>
       <th style="${r}">Resultado</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="${s}">RA</td><td style="${d}">[Nd:${o(a.nd)} x PA:${o(n.PA)} x LA:${N(v)}]</td><td style="${r}">${u(c.RA)}</td></tr>
    <tr><td style="${s}">RB</td><td style="${d}">[Nd:${o(a.nd)} x PB:${o(n.PB)} x LB:${N(k)}]</td><td style="${r}">${u(c.RB)}</td></tr>
    <tr><td style="${s}">RC</td><td style="${d}">[Nd:${o(a.nd)} x PC:${o(n.PC)} x LC:${N(O)}]</td><td style="${r}">${u(c.RC)}</td></tr>
    <tr><td style="${s}">RM</td><td style="${d}">[Nm:${o(a.nm)} x PM:${o(n.PM)} x LM:${N(O)}]</td><td style="${r}">${u(c.RM)}</td></tr>
    <tr><td style="${s}">RU</td><td style="${d}">[Nl:${o(a.nl_electric)} x PU:${o(n.PU)} x LU:${N(v)}]</td><td style="${r}">${u(c.RU)}</td></tr>
    <tr><td style="${s}">RV</td><td style="${d}">[Nl:${o(a.nl_electric)} x PV:${o(n.PV)} x LV:${N(k)}]</td><td style="${r}">${u(c.RV)}</td></tr>
    <tr><td style="${s}">RW</td><td style="${d}">[Nl:${o(a.nl_electric)} x PW:${o(n.PW)} x LW:${N(O)}]</td><td style="${r}">${u(c.RW)}</td></tr>
    <tr><td style="${s}">RZ</td><td style="${d}">[Ni:${o(a.ni_electric)} x PZ:${o(n.PZ)} x LZ:${N(O)}]</td><td style="${r}">${u(c.RZ)}</td></tr>
  </tbody>
</table>`,E+=`
<div style="${x}">3.5. COMPONENTES DA FREQUÊNCIA DE DANOS (FD = N x P)</div>
<table style="${g}">
  <thead>
    <tr style="background: ${t?"#f1f5f9":"rgba(15,23,42,0.5)"}; color: ${t?"#000000":"#60a5fa"};">
       <th style="${s}">Fator</th>
       <th style="${d}">Equação Auditável: N x P [Valores Literais]</th>
       <th style="${r}">Resultado</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="${s}">FB</td><td style="${d}">[Nd:${o(a.nd)} x PB:${o(n.PB)}]</td><td style="${r}">${A(m.FB)}</td></tr>
    <tr><td style="${s}">FC</td><td style="${d}">[Nd:${o(a.nd)} x PC_comb:${o(J)}]</td><td style="${r}">${A(m.FC)}</td></tr>
    <tr><td style="${s}">FM</td><td style="${d}">[Nm:${o(a.nm)} x PM_comb:${o(K)}]</td><td style="${r}">${A(m.FM)}</td></tr>
    <tr><td style="${s}">FV</td><td style="${d}">[Nl_elétrica:${o(a.nl_electric)} x PEB] + [Nl_dados:${o(a.nl_data)} x PEB]</td><td style="${r}">${A(m.FV)}</td></tr>
    <tr><td style="${s}">FW</td><td style="${d}">[Nl_elétrica:${o(a.nl_electric)} x PW] + [Nl_dados:${o(a.nl_data)} x PW]</td><td style="${r}">${A(m.FW)}</td></tr>
    <tr><td style="${s}">FZ</td><td style="${d}">[Ni_elétrica:${o(a.ni_electric)} x PZ] + [Ni_dados:${o(a.ni_data)} x PZ]</td><td style="${r}">${A(m.FZ)}</td></tr>
    <tr style="background: ${t?"#f1f5f9":"rgba(15,23,42,0.3)"};">
      <td style="${s}">TOTAL</td>
      <td style="${d}; font-weight: bold;">FD TOTAL (F)</td>
      <td style="${r}">${A(m.F)}</td>
    </tr>
  </tbody>
</table>`,l.risks_to_analyze.R1&&(E+=`
<div style="${x}">3.6. COMPONENTES DO RISCO À VIDA HUMANA (R1)</div>
<table style="${g}">
  <tr><td style="${s}">RA</td><td style="${d}">Choque em seres vivos (Estrutura)</td><td style="${r}">${u(c.RA)}</td></tr>
  <tr><td style="${s}">RB</td><td style="${d}">Danos físicos (Estrutura)</td><td style="${r}">${u(c.RB)}</td></tr>
  <tr><td style="${s}">RC</td><td style="${d}">Falhas de sistemas (Estrutura)</td><td style="${r}">${u(c.RC)}</td></tr>
  <tr><td style="${s}">RM</td><td style="${d}">Falhas de sistemas (Magnético)</td><td style="${r}">${u(c.RM)}</td></tr>
  <tr><td style="${s}">RU</td><td style="${d}">Choque em seres vivos (Linhas)</td><td style="${r}">${u(c.RU)}</td></tr>
  <tr><td style="${s}">RV</td><td style="${d}">Danos físicos (Linhas)</td><td style="${r}">${u(c.RV)}</td></tr>
  <tr><td style="${s}">RW</td><td style="${d}">Falhas de sistemas (Linhas - Surtos)</td><td style="${r}">${u(c.RW)}</td></tr>
  <tr><td style="${s}">RZ</td><td style="${d}">Falhas de sistemas (Linhas - Indução)</td><td style="${r}">${u(c.RZ)}</td></tr>
  <tr style="background: ${t?"#f1f5f9":"rgba(15,23,42,0.3)"};">
    <td style="${s}">TOTAL</td>
    <td style="${d}; font-weight: bold;">R1 TOTAL</td>
    <td style="${r}">${u(c.R1)}</td>
  </tr>
</table>`),l.risks_to_analyze.R3&&(E+=`
<div style="${x}">3.7. COMPONENTES DO RISCO AO PATRIMÔNIO CULTURAL (R3)</div>
<table style="${g}">
  <tr><td style="${s}">RB</td><td style="${d}">Danos físicos (Estrutura)</td><td style="${r}">${o(c.RB3)}</td></tr>
  <tr><td style="${s}">RV</td><td style="${d}">Danos físicos (Linhas)</td><td style="${r}">${o(c.RV3)}</td></tr>
  <tr style="background: ${t?"#f1f5f9":"rgba(15,23,42,0.3)"};">
    <td style="${s}">TOTAL</td>
    <td style="${d}; font-weight: bold;">R3 TOTAL</td>
    <td style="${r}">${o(c.R3)}</td>
  </tr>
</table>`),l.risks_to_analyze.R4&&(E+=`
<div style="${x}">3.8. COMPONENTES DO RISCO ECONÔMICO (R4)</div>
<table style="${g}">
  <tr><td style="${s}">RA</td><td style="${d}">Choque seres vivos (Estrutura)</td><td style="${r}">${o(c.RA4)}</td></tr>
  <tr><td style="${s}">RB</td><td style="${d}">Danos físicos (Estrutura)</td><td style="${r}">${o(c.RB4)}</td></tr>
  <tr><td style="${s}">RC</td><td style="${d}">Falhas sistemas (Estrutura)</td><td style="${r}">${o(c.RC4)}</td></tr>
  <tr><td style="${s}">RM</td><td style="${d}">Falhas sistemas (Magnético)</td><td style="${r}">${o(c.RM4)}</td></tr>
  <tr><td style="${s}">RU</td><td style="${d}">Choque seres vivos (Linhas)</td><td style="${r}">${o(c.RU4)}</td></tr>
  <tr><td style="${s}">RV</td><td style="${d}">Danos físicos (Linhas)</td><td style="${r}">${o(c.RV4)}</td></tr>
  <tr><td style="${s}">RW</td><td style="${d}">Falhas sistemas (Surtos)</td><td style="${r}">${o(c.RW4)}</td></tr>
  <tr><td style="${s}">RZ</td><td style="${d}">Falhas sistemas (Indução)</td><td style="${r}">${o(c.RZ4)}</td></tr>
  <tr style="background: ${t?"#f1f5f9":"rgba(15,23,42,0.3)"};">
    <td style="${s}">TOTAL</td>
    <td style="${d}; font-weight: bold;">R4 TOTAL</td>
    <td style="${r}">${o(c.R4)}</td>
  </tr>
</table>`),E}async function M(l,t=!1){const{risk_results:p,frequency_results:a}=l,n=!Object.entries(l.risks_to_analyze).some(([$,x])=>x&&l.risk_results[$]>{R1:1e-5,R3:.001,R4:.001}[$]),m=l.frequency_config.is_critical_system?.1:1,c=(a.F||0)<=m,P=()=>{const $=n&&c?"✅ CONFORMIDADE TÉCNICA NBR 5419:2026":"❌ NÃO CONFORMIDADE DETECTADA",x=n&&c?"safe":"danger";let s="";if(n&&c){const R=l.probability_data.PB,S=l.probability_data.PSPD_electric,f=F=>F.replace(/\s+[0-9,.]+$/,"").trim(),C=R===1?"à **ausência de SPDA externo**":`à **presença do ${f(w(H,R))}**`,D=S===1?"e à **ausência de MPS (DPS)**":`e à **presença das MPS (${f(w(U,S))}) PEB e PSPD**`;s=`A edificação encontra-se **PROTEGIDA**. A conformidade está vinculada ${C} ${D}, conforme parâmetros detalhados nas tabelas de premissas por zona.`}else s="**O RISCO SUPERA OS LIMITES.** Recomenda-se: 1) Elevar Classe SPDA; 2) DPS coordenados Classe I; 3) Reforçar combate a incêndio (Rp).";const d=(p.R1||0)<=1e-5,r=l.frequency_config.is_critical_system?.1:1,g=(a.F||0)<=r;return`## 5. CONCLUSÃO TÉCNICA
<div class="status-box ${x}">
    <h3>${$}</h3>
    <p style="color: ${t?"#000000":"inherit"}">${s}</p>
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
    <td colspan="2" style="padding: 6px; border: 1px solid ${t?"black":"rgba(248,250,252,0.1)"}; text-align: center; color: ${t?"black":"#f8fafc"}; font-family: monospace;"><b>${u(p.R1)} ${d?"≤":">"} 1,00 x 10⁻⁵</b></td>
    <td style="padding: 6px; border: 1px solid ${t?"black":"rgba(248,250,252,0.1)"}; text-align: center; color: ${d?"#059669":"#dc2626"}; font-weight: bold;">${d?"CONFORME":"CRÍTICO"}</td>
  </tr>
  <tr>
    <td style="padding: 6px; border: 1px solid ${t?"black":"rgba(248,250,252,0.1)"}; color: ${t?"black":"#f8fafc"};">Frequência de Danos (FD)</td>
    <td colspan="2" style="padding: 6px; border: 1px solid ${t?"black":"rgba(248,250,252,0.1)"}; text-align: center; color: ${t?"black":"#f8fafc"}; font-family: monospace;"><b>${A(a.F)} ${g?"≤":">"} ${A(r)}</b></td>
    <td style="padding: 6px; border: 1px solid ${t?"black":"rgba(248,250,252,0.1)"}; text-align: center; color: ${g?"#059669":"#dc2626"}; font-weight: bold;">${g?"CONFORME":"CRÍTICO"}</td>
  </tr>
</table>`},i=($,x,s,d)=>{if(t)return"";const r=d==="R1"?u:A,g=d==="R1"?"1,00 x 10⁻⁵":A(s),R=x<=s,S=Math.min(100,x/s*100),f=R?"#10b981":"#ef4444",C=`<svg width="400" height="70" viewBox="0 0 400 70" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="70" fill="rgba(248,250,252,0.8)" rx="8"/>
            <text x="12" y="20" font-family="Arial" font-size="11" font-weight="900" fill="#334155">${$}</text>
            <rect x="12" y="32" width="376" height="10" fill="#e2e8f0" rx="5"/>
            <rect x="12" y="32" width="${(S*3.76).toFixed(0)}" height="10" fill="${f}" rx="5"/>
            <text x="12" y="58" font-family="Arial" font-size="10" font-weight="bold" fill="#1e293b">${r(x).replace(/<\/?sup>/g,"")} ${R?"≤":">"} ${g.replace(/<\/?sup>/g,"")} [${R?"CONFORME":"CRÍTICO"}]</text>
            <circle cx="${(S*3.76+12).toFixed(0)}" cy="37" r="4" fill="white" stroke="${f}" stroke-width="3"/>
        </svg>`.trim();return`data:image/svg+xml;base64,${typeof window<"u"?window.btoa(unescape(encodeURIComponent(C))):Buffer.from(C).toString("base64")}`},e=t?"_[Gráficos omitidos para maior compatibilidade com Word. Consulte os dados na tabela de conformidade no final do relatório.]_":`![Gráfico de Risco R1](${i("SISTEMA 01: RISCO À VIDA HUMANA (R1)",p.R1||0,1e-5,"R1")})`,h=t?"":`![Gráfico de Frequência FD](${i("SISTEMA 02: FREQUÊNCIA DE DANOS (FD)",a.F||0,m,"FD")})`,y=l.zones.map(($,x)=>ot(l,t,x)).join(`

`);return`
# <span style="color: ${t?"#000000":"#ffffff"};">RELATÓRIO TÉCNICO:</span>
# <span style="color: ${t?"#000000":"#fbbf24"};">ANÁLISE DE RISCO PDA (NBR 5419-2 2026)</span>

## 🏛️ <span style="color: ${t?"#000000":"#fbbf24"};">1. IDENTIFICAÇÃO E DADOS GERAIS</span>
<div style="background: ${t?"#f1f5f9":"rgba(30,41,59,0.5)"}; border: 1px solid ${t?"#000000":"rgba(148,163,184,0.2)"}; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
<table style="width:100%; border-collapse: collapse; font-size: 11.5px; table-layout: auto;">
  <tr><td style="padding: 6px 12px; width: 26%; color: ${t?"#000000":"#94a3b8"}; vertical-align: top;"><b>CLIENTE:</b></td><td style="padding: 6px 12px; border-bottom: 1px solid ${t?"#000000":"rgba(148,163,184,0.1)"}; color: ${t?"#000000":"#f8fafc"};">${l.clientName||"N/A"}</td></tr>
  <tr><td style="padding: 6px 12px; color: ${t?"#000000":"#94a3b8"}; vertical-align: top;"><b>RESPONSÁVEL:</b></td><td style="padding: 6px 12px; border-bottom: 1px solid ${t?"#000000":"rgba(148,163,184,0.1)"}; color: ${t?"#000000":"#f8fafc"};">Engº ${l.technicalManagerName||"N/A"}</td></tr>
  <tr><td style="padding: 6px 12px; color: ${t?"#000000":"#94a3b8"}; vertical-align: top;"><b>LOCALIDADE:</b></td><td style="padding: 6px 12px; border-bottom: 1px solid ${t?"#000000":"rgba(148,163,184,0.1)"}; color: ${t?"#000000":"#f8fafc"};">${l.location||"Brasil"}</td></tr>
  <tr><td style="padding: 6px 12px; color: ${t?"#000000":"#94a3b8"}; vertical-align: top;"><b>DATA EMISSÃO:</b></td><td style="padding: 6px 12px; color: ${t?"#000000":"#f8fafc"};">${rt(l.projectDate)}</td></tr>
</table>
</div>

## 📊 <span style="color: ${t?"#1e3a8a":"#fbbf24"};">2. ENTRADA DE DADOS E PREMISSAS NORMATIVAS</span>
${at(l,t)}

${y}

## 📐 <span style="color: ${t?"#1e3a8a":"#fbbf24"};">3. MEMORIAL DE CÁLCULO</span>
${it(l,t)}

## 🚦 <span style="color: ${t?"#1e3a8a":"#fbbf24"};">4. ANÁLISE GRÁFICA DE CONFORMIDADE</span>
O gráfico abaixo compara os valores calculados contra os limites de tolerância da NBR 5419:

${e}

${h}

## ⚖️ <span style="color: ${t?"#1e3a8a":"#fbbf24"};">5. CONCLUSÃO TÉCNICA E PARECER FINAL</span>
${P()}

<div style="text-align: center; margin-top: 120px; padding-top: 6px; border-top: 1px solid #000000; max-width: 320px; margin-left: auto; margin-right: auto;">
  <p style="font-size: 14px; margin-bottom: 0; color: ${t?"#000000":"#f8fafc"};"><b>Engº ${l.technicalManagerName||"Responsável Técnico"}</b></p>
  <p style="font-size: 11px; color: ${t?"#475569":"#94a3b8"}; margin-top: 4px;">Analista Especialista em PDA — NBR 5419:2:2026</p>
</div>
`.trim()}const B=(l,t)=>{const p=t.isWord||!1,a=p?"#000000":"#f8fafc",n=p?"#000000":"#3b82f6",m=p?"#1e3a8a":"#60a5fa",c=p?"#000000":"rgba(148,163,184,0.15)",i=l.replace(/^# (.*$)/gm,`<h1 style="font-size: 2rem; font-weight: 900; color: ${n}; margin-bottom: 1rem; text-align: center; border-bottom: 4px solid ${n}; padding-bottom: 0.5rem;">$1</h1>`).replace(/^## (.*$)/gm,`<h2 style="font-size: ${t.h2FontSizeRem}rem; font-weight: ${t.h2Weight||700}; color: ${m}; margin-top: ${t.h2MarginTopPx}px; margin-bottom: ${t.h2MarginBottomPx}px; border-left: 3px solid ${p?"#1e3a8a":"#3b82f6"}; padding-left: 0.75rem;">$1</h2>`).replace(/^### (.*$)/gm,`<h3 style="font-size: 1.25rem; font-weight: 700; color: ${p?"#334155":"#94a3b8"}; margin-top: 1.5rem; margin-bottom: 0.75rem;">$1</h3>`).replace(/\*\*(.*?)\*\*/g,'<strong style="color: inherit;">$1</strong>').replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/!\[(.*?)\]\((.*?)\)/g,'<div style="text-align: center; margin: 20px 0;"><img src="$2" alt="$1" style="max-width: 100%; height: auto; border: 1px solid #e2e8f0; border-radius: 8px;" /></div>').replace(/^\| (.*) \|$/gm,e=>{const h=e.split("|").filter(y=>y.trim()!=="").map(y=>`<td style="border: 1px solid ${c}; padding: 4px 6px; text-align: left; color: ${a};">${y.trim()}</td>`).join("");return`<table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem; border: 1px solid ${c};"><tr style="background: ${p?"#f8fafc":"rgba(15,23,42,0.3)"};">${h}</tr></table>`}).replace(/<div class="status-box danger">([\s\S]*?)<\/div>/g,'<div style="background: rgba(239,68,68,0.1); border: 2px solid #ef4444; border-radius: 1rem; padding: 1.5rem; margin: 2rem 0; color: #ef4444;">$1</div>').replace(/^\d\. (.*$)/gm,`<li style="margin-bottom: 0.2rem; color: ${t.isWord?"#000":"#cbd5e1"}; font-size: 0.9rem;">$1</li>`).replace(/\*\*(.*?)\*\*/g,`<strong style="color: ${t.isWord?"#1e40af":"#60a5fa"}; font-weight: 700;">$1</strong>`).replace(/^- (.*$)/gm,`<li style="margin-left: 0.75rem; margin-bottom: 0.15rem; color: ${t.isWord?"#000":"#94a3b8"}; font-size: 0.9rem;">$1</li>`).replace(/^> (.*$)/gm,`<blockquote style="border-left: 4px solid #3b82f6; padding: 0.5rem 1rem; margin: 1rem 0; background: rgba(59,130,246,0.05); font-style: italic; color: ${t.isWord?"#1e293b":"#94a3b8"};">$1</blockquote>`).replace(/<\/h[1-3]>\s*\n+/g,e=>e.replace(/\n+/g,"<br/>")).replace(/\n\s*\n/g,'<div style="margin-bottom: 12px;"></div>').replace(/\n/g," ");return`<div class="prose-styles" style="font-family: 'Inter', sans-serif; line-height: 1.5; text-align: justify; color: ${a};">${i}</div>`},yt=({data:l,onUpdate:t})=>{const[p,a]=T.useState(!1),[n,m]=T.useState(""),[c,P]=T.useState(!1),[i,e]=T.useState(""),h={h2FontSizeRem:1.15,h2Weight:700,h2MarginTopPx:48,h2MarginBottomPx:8,h3FontSizeRem:1,h3MarginTopPx:8,h3MarginBottomPx:2},y=async()=>{a(!0);try{e("Iniciando análise normativa NBR 5419-2:2026..."),await new Promise(d=>setTimeout(d,600)),e("Processando dados de densidade (Ng) e áreas (Ad, Am)..."),await new Promise(d=>setTimeout(d,600)),e("Calculando componentes de probabilidade e perdas..."),await new Promise(d=>setTimeout(d,600)),e("Consolidando resultados e gerando parecer técnico..."),await new Promise(d=>setTimeout(d,600)),e("Formatando relatório executivo premium...");const s=await M(l);m(s)}catch(s){console.error("Erro ao gerar relatório:",s)}finally{a(!1),e("")}},$=async()=>{a(!0);try{e("Gerando versão MS Word...");const s=await M(l,!0),d=B(s,{...h,isWord:!0}),r=`RELATORIO_SPDA_${(l.clientName||"PROJETO").replace(/\s+/g,"_").toUpperCase()}.doc`,g=`
                <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                <head>
                    <meta charset='utf-8'>
                    <style>
                        body { font-family: 'Arial', sans-serif; font-size: 11pt; color: #000000; }
                        table { border-collapse: collapse; width: 100%; border: 1pt solid #000; }
                        td, th { border: 1pt solid #000; padding: 4pt; font-size: 10pt; }
                    </style>
                </head>
                <body>${d}</body>
                </html>
            `,R=new Blob(["\uFEFF",g],{type:"application/msword"}),S=URL.createObjectURL(R),f=document.createElement("a");f.href=S,f.download=r,f.click(),URL.revokeObjectURL(S)}catch(s){console.error("Erro ao baixar Word:",s)}finally{a(!1),e("")}},x=async()=>{a(!0);try{e("Preparando versão para impressão PDF...");const s=await M(l,!0),d=B(s,{...h,isWord:!0}),r=window.open("","_blank");if(!r)return;r.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title>Relatório SPDA - ${l.clientName||"N/A"}</title>
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
                ${d}
                <div class="footer">Gerado via Plataforma SPDA — ${new Date().toLocaleDateString("pt-BR")} — Engº Júlio César Certo</div>
            </body></html>`),r.document.close(),setTimeout(()=>{r.focus(),r.print()},800)}catch(s){console.error("Erro ao preparar impressão:",s)}finally{a(!1),e("")}};return b.jsxs("div",{className:"space-y-4",children:[b.jsxs("div",{className:"flex flex-col md:flex-row items-stretch gap-4",children:[b.jsx(Q,{mode:"wait",children:n?b.jsxs(_.div,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},className:"flex-1 bg-slate-900 border border-slate-700 rounded-3xl p-5",children:[b.jsxs("div",{className:"flex items-center justify-between mb-6",children:[b.jsxs("h3",{className:"text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2",children:[b.jsx(Z,{className:"w-6 h-6 text-blue-400"})," Relatório Técnico"]}),b.jsxs("div",{className:"flex gap-2",children:[b.jsx(L,{variant:"outline",size:"sm",onClick:$,children:"Word"}),b.jsx(L,{variant:"outline",size:"sm",onClick:x,children:"PDF"}),b.jsx(L,{variant:"outline",size:"icon",onClick:()=>m(""),children:b.jsx(lt,{className:"w-4 h-4"})})]})]}),b.jsx("div",{className:"bg-slate-950 p-8 rounded-2xl border border-slate-800 max-h-[600px] overflow-y-auto",dangerouslySetInnerHTML:{__html:B(n,h)}})]},"report-view"):b.jsx(_.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},className:"flex-1",children:b.jsx(L,{onClick:y,disabled:p,className:"w-full h-20 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl",children:p?b.jsxs("div",{className:"flex items-center gap-2",children:[b.jsx(et,{className:"w-6 h-6 animate-spin"}),b.jsx("span",{children:i})]}):b.jsxs("div",{className:"flex items-center gap-3",children:[b.jsx(Z,{className:"w-8 h-8"}),b.jsx("span",{className:"text-xl font-black tracking-widest uppercase",children:"Gerar Relatório"})]})})},"gen-btn")}),!n&&b.jsxs(_.div,{initial:{opacity:0,x:10},animate:{opacity:1,x:0},className:"md:w-64 h-20 bg-slate-950/40 border border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-1 group hover:bg-blue-900/10 cursor-pointer transition-all border-dashed",onClick:async()=>{const s=JSON.stringify(l,null,2),d=`PROJETO_SPDA_${(l.clientName||"PROJETO").replace(/\s+/g,"_").toUpperCase()}.spda`;if("showSaveFilePicker"in window)try{const f=await(await window.showSaveFilePicker({suggestedName:d,types:[{description:"Arquivo de Projeto SPDA",accept:{"application/json":[".spda"]}}]})).createWritable();await f.write(s),await f.close();return}catch(S){if(S.name==="AbortError")return}const r=new Blob([s],{type:"application/json"}),g=URL.createObjectURL(r),R=document.createElement("a");R.href=g,R.download=d,R.click(),URL.revokeObjectURL(g)},children:[b.jsx(st,{className:"w-6 h-6 text-slate-500 group-hover:text-blue-400 group-hover:scale-110 transition-all"}),b.jsx("span",{className:"text-[10px] font-black text-slate-500 group-hover:text-blue-400 uppercase tracking-widest leading-none",children:"Salvar Projeto"})]})]}),!n&&b.jsx(_.div,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},children:b.jsxs(tt,{className:"bg-slate-950/60 border-slate-800 shadow-xl rounded-3xl overflow-hidden mt-6 p-5",children:[b.jsxs("div",{className:"flex items-center gap-2 text-slate-200 text-sm uppercase font-black tracking-widest mb-4",children:[b.jsx(dt,{className:"w-4 h-4 text-emerald-500"})," Confirmação Técnica"]}),b.jsx("p",{className:"text-slate-300 leading-relaxed text-xs italic border-l-4 border-emerald-500/30 pl-4 py-1 mb-6",children:'"Este relatório automatizado é uma ferramenta de apoio para cálculos da NBR 5419:2026. A conferência final e a responsabilidade técnica integral pelo projeto cabem exclusivamente ao profissional habilitado."'}),b.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-3",children:[b.jsxs("div",{className:"p-3 rounded-xl bg-slate-900 border border-slate-800 text-center",children:[b.jsx("span",{className:"text-[9px] uppercase font-bold text-slate-500 tracking-widest block mb-1",children:"Autor da Ferramenta"}),b.jsx("span",{className:"text-slate-100 font-bold text-xs",children:"Engº Júlio César Certo"}),b.jsx("span",{className:"text-[8px] text-slate-500 block mt-1 leading-none italic",children:"(Não é o Resp. Técnico pela análise)"})]}),b.jsxs("div",{className:"p-3 rounded-xl bg-slate-900 border border-slate-800 text-center",children:[b.jsx("span",{className:"text-[9px] uppercase font-bold text-slate-500 tracking-widest block mb-1",children:"WhatsApp Apoio"}),b.jsx("span",{className:"text-slate-100 font-bold text-xs",children:"(35) 9 8811-3746"})]}),b.jsxs("div",{className:"p-3 rounded-xl bg-slate-900 border border-slate-800 text-center",children:[b.jsx("span",{className:"text-[9px] uppercase font-bold text-slate-500 tracking-widest block mb-1",children:"E-mail Suporte"}),b.jsx("span",{className:"text-slate-200 font-medium text-[10px]",children:"julio.certo@hotmail.com"})]})]})]})})]})};export{yt as ReportStep,B as markdownToHtml};
