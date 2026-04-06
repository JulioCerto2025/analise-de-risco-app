import{r as S,j as i,A as Qe,m as je}from"./motion-CZTIYVKD.js";import{P as et,t as ke,w as ye,K as tt,v as at,I as ot,R as nt,J as it,M as st,N as rt,O as lt,Q as ct,r as Ie,E as mt,s as pt,G as dt,V as ut,C as qe,a as Oe,b as Ve,B as ve,e as We}from"./index-Di98Qc-U.js";import{F as Ue,X as xt,n as gt,L as ht,l as $t,T as Pt}from"./icons-ggQqh8om.js";import"./react-Bzgz95E1.js";import"./charts-CdRy354i.js";function A(e,t){const a=e.find($=>String($.value)===String(t));return a?a.label:`Valor ${t}`}function ft(e){var I,v,M,_,E,B,j,N,D,u,w,Z,k,V,b,C,z,K,te,Ae,oe,ne,ie,se,re,le,ce,me,pe,de,ue,xe,ge,he,$e,Pe,l,f,F;const{calculations:t,probability_calculations:a,loss_calculations:$,risk_results:c,frequency_results:m,probability_data:o,zones:d,selected_risk_components:T}=e,s=((I=d[0])==null?void 0:I.loss_data)||{};let r="";r+=`### Etapa — Probabilidade (P)

`,r+=`> Resumo: PC_total = 1 − (1−PC) × (1−PCT); PM_total = 1 − (1−PM) × (1−PMT). Probabilidades nas linhas utilizam PTU/PV/PW/PZ combinadas com PEB/CLD/PLD conforme NBR 5419.

`,r+=`**PA - Danos a seres vivos por choque (Descarga na Estrutura)**
* *Fórmula:* PA = PTA × PB
* *Variáveis:*
    * PTA: **${o.PTA}** (${A(et,o.PTA)})
    * PB: **${o.PB}** (${A(ke,o.PB)})
* *Cálculo:* PA = ${o.PTA} × ${o.PB}
* *Resultado:* **PA = ${(v=a.PA)==null?void 0:v.toExponential(3)}**

`,r+=`**PB - Danos físicos (Descarga na Estrutura)**
* *Fórmula:* PB = PB
* *Variáveis:*
    * PB (Nível do SPDA): **${o.PB}** (${A(ke,o.PB)})
* *Resultado:* **PB = ${(M=a.PB)==null?void 0:M.toExponential(3)}**

`,e.has_electric_line&&(r+=`**PC - Falha de sistemas (Descarga na Estrutura, Linha Elétrica)**
* *Fórmula:* PC = PSPDₑ × CLDₑ
* *Variáveis:*
    * PSPDₑ: **${o.PSPD_electric}** (${A(ye,o.PSPD_electric)})
    * CLDₑ_int: **${o.CLD_electric_int}**
    * CLDₑ_ext: **${o.CLD_electric_ext}**
* *Cálculo:* PC = ${o.PSPD_electric} × (CLDₑ conforme configuração)
* *Resultado:* **PC = ${(_=a.PC)==null?void 0:_.toExponential(3)}**

`),e.has_data_line&&(r+=`**PCT - Falha de sistemas (Descarga na Estrutura, Linha de Dados)**
* *Fórmula:* PCT = PSPDₐ × CLDₐ
* *Variáveis:*
    * PSPDₐ: **${o.PSPD_data}** (${A(ye,o.PSPD_data)})
    * CLDₐ_int: **${o.CLD_data_int}**
    * CLDₐ_ext: **${o.CLD_data_ext}**
* *Cálculo:* PCT = ${o.PSPD_data} × (CLDₐ conforme configuração)
* *Resultado:* **PCT = ${(E=a.PCT)==null?void 0:E.toExponential(3)}**

`),e.has_electric_line&&(r+=`**PM - Falha de sistemas (Descarga Próxima, Linha Elétrica)**
* *Fórmula:* PM = PSPDₑ × (Ks1 × Ks2 × Ks3ₑ × Ks4ₑ)²
* *Variáveis:*
    * PSPDₑ: **${o.PSPD_electric}** (${A(ye,o.PSPD_electric)})
    * Ks1 (Malha wm1=${o.wm1}m): **${(B=a.Ks1)==null?void 0:B.toFixed(3)}**
    * Ks2 (Malha wm2=${o.wm2}m): **${(j=a.Ks2)==null?void 0:j.toFixed(3)}**
    * Ks3ₑ: **${o.Ks3_electric_int}** (${A(tt,o.Ks3_electric_int)})
    * Ks4ₑ (Uw=${o.Uw_electric_int}kV): **${(N=a.Ks4_electric)==null?void 0:N.toFixed(3)}**
* *Cálculo:* PM = ${o.PSPD_electric} × (${(D=a.Ks1)==null?void 0:D.toFixed(3)} × ${(u=a.Ks2)==null?void 0:u.toFixed(3)} × ${o.Ks3_electric_int} × ${(w=a.Ks4_electric)==null?void 0:w.toFixed(3)})²
* *Resultado:* **PM = ${(Z=a.PM)==null?void 0:Z.toExponential(3)}**

`),e.has_electric_line&&(r+=`**PU - Danos a seres vivos por choque (Descarga na Linha Elétrica)**
* *Fórmula:* PU = PTU × PEB × PLD × CLD
* *Variáveis:*
    * PTU: **${o.PTU_electric}** (${A(at,o.PTU_electric)})
    * PEB: **${o.PEB_electric}** (${A(ye,o.PEB_electric)})
    * PLD (ext): **${(k=o.PLD_electric_ext)==null?void 0:k.toFixed(2)}**
    * CLD (ext): **${o.CLD_electric_ext}**
* *Cálculo:* PU = ${o.PTU_electric} × ${o.PEB_electric} × ${(V=o.PLD_electric_ext)==null?void 0:V.toFixed(2)} × ${o.CLD_electric_ext}
* *Resultado:* **PU = ${(b=a.PU)==null?void 0:b.toExponential(3)}**

`),r+=`### Etapa — Perdas Consequentes (L) — ${(C=d[0])==null?void 0:C.name}

`,r+=`> Resumo: LA (choque), LB (incêndio/pânico) e LC (falha de sistemas) usam fatores normativos (rt, rp, rf, hz, LO) e a fração de tempo/pessoas na zona (tz, nz/nt). Demais perdas usam equivalências LU=LA, LV=LB, LM=LW=LZ=LC.

`,r+=`**LA - Perda por choque elétrico**
* *Fórmula:* LA = rt × 0.01 × (nz / nt) × (tz / 8760) × rs
* *Variáveis:*
    * rt (Resist. Piso): **${s.rt}** (${A(ot,s.rt)})
    * nz (Pessoas na Zona): **${s.nz}**
    * nt (Pessoas Total): **${s.nt}**
    * tz (Tempo na Zona): **${s.tz}** h/ano
    * rs (Tipo Estrutura): **${s.rs}** (${s.rs===1?"Robusta":"Simples"})
* *Cálculo:* LA = ${s.rt} × 0.01 × (${s.nz} / ${s.nt}) × (${s.tz} / 8760) × ${s.rs}
* *Resultado:* **LA = ${(z=$.LA)==null?void 0:z.toExponential(3)}**

`,r+=`**LB - Perda por danos físicos (incêndio)**
* *Fórmula:* LB = rs × rp × rf × hz × LF × (nz / nt) × (tz / 8760)
* *Variáveis:*
    * rs (Tipo Estrutura): **${s.rs}** (${s.rs===1?"Robusta":"Simples"})
    * rp (Prot. Incêndio): **${s.rp}** (${A(nt,s.rp)})
    * rf (Risco Incêndio): **${s.rf}** (${A(it,s.rf)})
    * hz (Pânico): **${s.hz}** (${A(st,s.hz)})
    * LF (Tipo Dano): **${s.LF}** (${A(rt,s.LF)})
    * nz, nt, tz: **${s.nz}**, **${s.nt}**, **${s.tz}**
* *Cálculo:* LB = ${s.rs} × ${s.rp} × ${s.rf} × ${s.hz} × ${s.LF} × (${s.nz} / ${s.nt}) × (${s.tz} / 8760)
* *Resultado:* **LB = ${(K=$.LB)==null?void 0:K.toExponential(3)}**

`,r+=`**LC - Perda por falha de sistemas**
* *Fórmula:* LC = LO × (nz / nt) × (tz / 8760) × rs
* *Variáveis:*
    * LO (Tipo Falha): **${s.LO}** (${A(lt,s.LO)})
    * nz, nt, tz, rs: **${s.nz}**, **${s.nt}**, **${s.tz}**, **${s.rs}**
* *Cálculo:* LC = ${s.LO} × (${s.nz} / ${s.nt}) × (${s.tz} / 8760) × ${s.rs}
* *Resultado:* **LC = ${(te=$.LC)==null?void 0:te.toExponential(3)}**

`,r+=`**Demais Perdas:** LU=LA, LV=LB, LM=LW=LZ=LC.

`,r+=`### Etapa — Componentes de Risco (R)

`;const L=Object.entries(T).filter(([,x])=>x).map(([x])=>{const n={RA:"RA = Nd × PA × LA",RB:"RB = Nd × PB × LB",RC:"RC = Nd × PC × LC",RM:"RM = Nm × PM × LM",RU:"RU = Nl × PU × LU",RV:"RV = Nl × PV × LV",RW:"RW = Nl × PW × LW",RZ:"RZ = Ni × PZ × LZ"},W=c[x];return`* **${x}:** ${n[x]||"N/A"} -> Resultado: **${W==null?void 0:W.toExponential(3)}**`}).join(`
`);r+=L+`

`,r+=`### Etapa — Frequência de Danos a Sistemas (F)

`,r+=`> Resumo: F = FB + FC + FM + FV + FW + FZ (quando aplicável), com combinação de sistemas internos via PC_total e PM_total.

`,m.FB&&e.frequency_config.has_equipment_in_ZPR0A&&(r+=`**FB - Danos por descarga na estrutura (Equip. ZPR0A)**
* *Fórmula:* FB = Nd × PB
* *Cálculo:* FB = ${(Ae=t.nd)==null?void 0:Ae.toExponential(3)} × ${a.PB}
* *Resultado:* **FB = ${(oe=m.FB)==null?void 0:oe.toExponential(3)}**

`),m.FC&&(r+=`**FC - Danos por descarga na estrutura (Sistemas Internos)**
* *Fórmula:* FC = Nd × PC_total
* *Cálculo:* FC = ${(ne=t.nd)==null?void 0:ne.toExponential(3)} × ${(1-(1-(a.PC||0))*(1-(a.PCT||0))).toFixed(3)}
* *Resultado:* **FC = ${(ie=m.FC)==null?void 0:ie.toExponential(3)}**

`),m.FM&&(r+=`**FM - Danos por descarga próxima (Sistemas Internos)**
* *Fórmula:* FM = Nm × PM_total
* *Cálculo:* FM = ${(se=t.nm)==null?void 0:se.toExponential(3)} × ${(1-(1-(a.PM||0))*(1-(a.PMT||0))).toFixed(3)}
* *Resultado:* **FM = ${(re=m.FM)==null?void 0:re.toExponential(3)}**

`),m.FV&&(r+=`**FV - Danos por descarga na linha**
* *Fórmula:* FV = Nlₑ × PEBₑ + Nlₐ × PEBₐ
* *Cálculo:* FV = (${(le=t.nl_electric)==null?void 0:le.toExponential(3)} × ${a.PEB_electric}) + (${(ce=t.nl_data)==null?void 0:ce.toExponential(3)} × ${a.PEB_data})
* *Resultado:* **FV = ${(me=m.FV)==null?void 0:me.toExponential(3)}**

`),m.FW&&(r+=`**FW - Danos por surto na linha**
* *Fórmula:* FW = Nlₑ × PW + Nlₐ × PWT
* *Cálculo:* FW = (${(pe=t.nl_electric)==null?void 0:pe.toExponential(3)} × ${(de=a.PW)==null?void 0:de.toExponential(3)}) + (${(ue=t.nl_data)==null?void 0:ue.toExponential(3)} × ${(xe=a.PWT)==null?void 0:xe.toExponential(3)})
* *Resultado:* **FW = ${(ge=m.FW)==null?void 0:ge.toExponential(3)}**

`),m.FZ&&(r+=`**FZ - Danos por surto induzido na linha**
* *Fórmula:* FZ = Niₑ × PZ + Niₐ × PZT
* *Cálculo:* FZ = (${(he=t.ni_electric)==null?void 0:he.toExponential(3)} × ${($e=a.PZ)==null?void 0:$e.toExponential(3)}) + (${(Pe=t.ni_data)==null?void 0:Pe.toExponential(3)} × ${(l=a.PZT)==null?void 0:l.toExponential(3)})
* *Resultado:* **FZ = ${(f=m.FZ)==null?void 0:f.toExponential(3)}**

`);const y=[];return e.frequency_config.has_equipment_in_ZPR0A&&y.push("FB"),y.push("FC","FM","FV","FW","FZ"),r+=`**F - Frequência Total de Danos**
* *Fórmula:* F = ${y.join(" + ")}
* *Cálculo:* F = ${y.map(x=>{var n;return((n=m[x])==null?void 0:n.toExponential(3))||0}).join(" + ")}
* *Resultado:* **F = ${(F=m.F)==null?void 0:F.toExponential(3)}**

`,r}async function Rt(e){var oe,ne,ie,se,re,le,ce,me,pe,de,ue,xe,ge,he,$e,Pe;const{calculations:t,risk_results:a,frequency_results:$}=e,c={dados:1,parametros:2,calculos:3,resultados:4,parecer:5},m=ft(e),o=l=>{var Q,ee;const f=Object.entries(l.risks_to_analyze).filter(([,g])=>g).map(([g])=>g),F={R1:1e-5,R3:.001,R4:.001},x=[];f.forEach(g=>{const q=l.risk_results[g]||0,O=F[g];q>O&&x.push(g)});const n=l.frequency_config.is_critical_system?.1:1,W=(((Q=l.frequency_results)==null?void 0:Q.F)||0)>n,U=["RA","RB","RC","RM","RU","RV","RW","RZ"].map(g=>({k:g,v:l.risk_results[g]||0})).sort((g,q)=>q.v-g.v).slice(0,2).map(g=>{var q;return`${String(g.k)} (${(q=g.v)==null?void 0:q.toExponential(2)})`}).join(", "),H=`Este parecer foi elaborado com base na NBR 5419, considerando os riscos selecionados (${f.join(", ")||"nenhum"}) e a frequência de danos aos sistemas.`,Re=`Frequência de Danos (F): **${(((ee=l.frequency_results)==null?void 0:ee.F)||0).toExponential(3)}**; Limite (FT): **${n.toFixed(1)}** → ${W?"**NÃO ACEITÁVEL**":"**ACEITÁVEL**"}.`,Y=f.length?`Riscos totais: ${f.map(g=>`**${g}=${(l.risk_results[g]||0).toExponential(3)}** (RT=${F[g].toExponential(1)})`).join("; ")}.`:"Nenhum risco foi selecionado para análise próxima.",G=`Componentes dominantes observados: ${U}.`,ae=`Recomendações prioritárias:
* Adequar o nível do SPDA (captores, descidas, aterramento) para reduzir PA/PB e efeitos de descargas na estrutura.
* Coordenar DPS (classes I/II/III) em entradas e quadros, nas linhas elétrica e de dados, para reduzir PC/PM e perdas associadas (RC, RM, FC, FM).
* Reforçar malhas de aterramento e equipotencialização, interligando elementos metálicos e melhorando conexões, reduzindo tensões de passo/toque (impacto em LA/LC).
* Otimizar blindagens/roteamento de cabos e separação física, diminuindo acoplamentos (RW/RZ).
* Revisar parâmetros de ocupação e medidas internas (rf, hz, LO) e rotinas operacionais em zonas críticas.`,X=x.length||W?`Conclusão: Há itens **NÃO ACEITÁVEIS** (${[...x,W?"F":null].filter(Boolean).join(", ")}). Recomenda-se implementar as medidas acima e reprocessar a análise para verificar a redução dos componentes dominantes e a conformidade com os limites.`:"Conclusão: Todos os itens analisados estão **ACEITÁVEIS** frente aos limites. Recomenda-se manter as medidas propostas, documentação e manutenção periódica do sistema.";return[H,Re,Y,G,ae,X].join(`

`)},d=Object.entries(e.risks_to_analyze).filter(([,l])=>l).map(([l],f)=>{var Y,G,ae,X,Q,ee,g,q,O;const F=a[l]||0,x={R1:1e-5,R3:.001,R4:.001}[l]||0,n=F<=x,W={R1:"Perda de Vidas Humanas",R3:"Perda de Patrimônio Cultural",R4:"Perda de Valor Econômico"}[l],fe=n?"🟢 ✅":"🔴 ❌",P=e.selected_risk_components;let U="",H="";if(l==="R1"){const h=[],p=[];P.RA&&(h.push("RA"),p.push(`${(Y=a.RA)==null?void 0:Y.toExponential(3)}`)),P.RB&&(h.push("RB"),p.push(`${(G=a.RB)==null?void 0:G.toExponential(3)}`)),P.RC&&(h.push("RC"),p.push(`${(ae=a.RC)==null?void 0:ae.toExponential(3)}`)),P.RM&&(h.push("RM"),p.push(`${(X=a.RM)==null?void 0:X.toExponential(3)}`)),P.RU&&(h.push("RU"),p.push(`${((a.RU||0)+(a.RUT||0)).toExponential(3)}`)),P.RV&&(h.push("RV"),p.push(`${((a.RV||0)+(a.RVT||0)).toExponential(3)}`)),P.RW&&(h.push("RW"),p.push(`${((a.RW||0)+(a.RWT||0)).toExponential(3)}`)),P.RZ&&(h.push("RZ"),p.push(`${((a.RZ||0)+(a.RZT||0)).toExponential(3)}`)),U=h.join(" + "),H=`${p.join(" + ")} = ${F.toExponential(3)}`}else if(l==="R3"){const h=[],p=[];P.RB&&(h.push("RB3"),p.push(`${(Q=a.RB3)==null?void 0:Q.toExponential(3)}`)),P.RV&&(h.push("RV3"),p.push(`${((a.RV3||0)+(a.RVT3||0)).toExponential(3)}`)),U=h.join(" + "),H=`${p.join(" + ")} = ${F.toExponential(3)}`}else if(l==="R4"){const h=[],p=[];P.RA&&(h.push("RA4"),p.push(`${(ee=a.RA4)==null?void 0:ee.toExponential(3)}`)),P.RB&&(h.push("RB4"),p.push(`${(g=a.RB4)==null?void 0:g.toExponential(3)}`)),P.RC&&(h.push("RC4"),p.push(`${(q=a.RC4)==null?void 0:q.toExponential(3)}`)),P.RM&&(h.push("RM4"),p.push(`${(O=a.RM4)==null?void 0:O.toExponential(3)}`)),P.RU&&(h.push("RU4"),p.push(`${((a.RU4||0)+(a.RUT4||0)).toExponential(3)}`)),P.RV&&(h.push("RV4"),p.push(`${((a.RV4||0)+(a.RVT4||0)).toExponential(3)}`)),P.RW&&(h.push("RW4"),p.push(`${((a.RW4||0)+(a.RWT4||0)).toExponential(3)}`)),P.RZ&&(h.push("RZ4"),p.push(`${((a.RZ4||0)+(a.RZT4||0)).toExponential(3)}`)),U=h.join(" + "),H=`${p.join(" + ")} = ${F.toExponential(3)}`}const Re=U?`
* *Composição (${l}):* ${U}
* *Cálculo:* ${H}`:"";return`### ${c.resultados}.${f+1}. Risco ${l} - ${W}
* **Risco Total Calculado (${l}):** **${F.toExponential(3)}**
* **Risco Tolerável (RT):** **${x.toExponential(1)}**
* **Resultado:** ${fe} O risco ${l} é **${n?"ACEITÁVEL":"NÃO ACEITÁVEL"}**.${Re}`}).join(`

`),T=e.frequency_config.is_critical_system?.1:1,s=($.F||0)<=T,r=s?"🟢 ✅":"🔴 ❌",L=l=>{try{return btoa(unescape(encodeURIComponent(l)))}catch{return""}},y=(l,f,F=720,x=300,n)=>{const fe=n!=null&&n.showLegend?72:48,P=44,U=8,H=f.length,Re=F-80,Y=x-fe-P,G=Math.max(10,Math.floor((Re-(H-1)*U)/H)),ae=typeof(n==null?void 0:n.toleranceLine)=="number"?Math.max(n.toleranceLine,0):0,X=R=>Math.log10(Math.max(R,1e-12)),Q=[...f.map(R=>R.value),ae].filter(R=>R>0),ee=Math.max(...Q.map(R=>X(R))),g=Math.min(...f.map(R=>X(R.value))),q=(n==null?void 0:n.barColor)||"#60A5FA",O=n==null?void 0:n.barColors,h=(n==null?void 0:n.bg)||"#FFFFFF",p="#111827",He="#475569",Se=typeof(n==null?void 0:n.labelAngle)=="number"?n.labelAngle:-35,Ge="";let Ce="";f.forEach((R,Ee)=>{const Fe=40+Ee*(G+U),ze=(X(R.value)-g)/Math.max(ee-g,1e-6),Le=Math.max(2,Math.floor(ze*Y)),J=fe+(Y-Le),_e=R.value.toExponential(2),Te=O?O[Ee%O.length]:q,Me=x-P+18,Be=Fe+G/2,be=R.name==="R Total"||R.name==="F Total",Xe=0,Je=be?12:10,Ye=be?"700":"400";Ce+=`
  <rect x="${Fe}" y="${J}" width="${G}" height="${Le}" fill="${Te}" rx="${Xe}" />`,Ce+=`
  <text x="${Be}" y="${Me}" fill="${p}" font-size="11" text-anchor="${Se<0?"end":Se>0?"start":"middle"}" transform="rotate(${Se} ${Be} ${Me})">${R.name}</text>`,Ce+=`
  <text x="${Fe+G/2}" y="${J-6}" fill="${p}" font-size="${Je}" font-weight="${Ye}" text-anchor="middle">${_e}</text>`});let Ne="";if(!!(n!=null&&n.showLegend)&&O&&f.length){const R=typeof(n==null?void 0:n.legendBoxSize)=="number"?Math.max(6,n.legendBoxSize):10,Ee=typeof(n==null?void 0:n.legendColGap)=="number"?Math.max(2,n.legendColGap):8,Fe=typeof(n==null?void 0:n.legendRowGap)=="number"?Math.max(2,n.legendRowGap):8,ze=typeof(n==null?void 0:n.legendFontSize)=="number"?Math.max(8,n.legendFontSize):11,Le=Math.min(F-40,Math.max(120,(n==null?void 0:n.legendMaxWidth)||F-40));let J=40,_e=46;f.forEach((Te,Me)=>{const Be=O[Me%O.length],be=Math.min(160,Math.max(40,Te.name.length*7));J+R+4+be>Le&&(J=40,_e+=R+Fe),Ne+=`
  <rect x="${J}" y="${_e}" width="${R}" height="${R}" fill="${Be}" rx="2" />`,Ne+=`
  <text x="${J+R+6}" y="${_e+R-1}" fill="${p}" font-size="${ze}">${Te.name}</text>`,J+=R+6+be+Ee})}const Ke=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${F}" height="${x}" viewBox="0 0 ${F} ${x}">
  ${Ge}
  <rect x="0" y="0" width="${F}" height="${x}" fill="${h}"/>
  <text x="40" y="24" fill="${p}" font-size="14" font-weight="bold">${l}</text>
  ${Ne}
  <line x1="40" y1="${x-P}" x2="${F-40}" y2="${x-P}" stroke="${He}" stroke-width="1"/>
  ${Ce}
</svg>`;return`data:image/svg+xml;base64,${L(Ke)}`},v=["RA","RB","RC","RM","RU","RV","RW","RZ"].map(l=>({name:l,value:e.risk_results[l]||1e-12,active:!!e.selected_risk_components[l]})),M=e.risks_to_analyze.R1?"R1":e.risks_to_analyze.R3?"R3":e.risks_to_analyze.R4?"R4":"R1",_=e.risk_results[M]||0,E=[...v.map(l=>({name:l.name,value:l.value})),{name:"R Total",value:_}],B=Object.entries(e.frequency_results||{}).filter(([l])=>l!=="F").map(([l,f])=>({name:l,value:f||0})),j=["#60A5FA","#A78BFA","#F472B6","#FB7185","#F59E0B","#34D399","#22D3EE","#93C5FD"],N="#CBD5E1",D=e.risks_to_analyze.R1?1e-5:e.risks_to_analyze.R3||e.risks_to_analyze.R4?.001:1e-5,w=_<=D?"#10B981":"#EF4444",Z=E.map((l,f)=>{var x;return l.name==="R Total"?w:((x=v[f])==null?void 0:x.active)?j[f%j.length]:N}),k=["#F87171","#60A5FA","#A78BFA","#34D399","#F59E0B","#FB7185","#64748B"],V=y("Componentes de Risco — Global",E,720,300,{barColors:Z,labelAngle:-30,legendMaxWidth:420,toleranceLine:D}),b=[...B,{name:"F Total",value:((oe=e.frequency_results)==null?void 0:oe.F)||0}],C=(((ne=e.frequency_results)==null?void 0:ne.F)||0)<=T,z="#CBD5E1",K=b.map((l,f)=>{if(l.name==="F Total")return C?"#10B981":"#EF4444";const F=k[f%k.length];return(l.value||0)>0?F:z}),te=y("Frequência de Danos — Global",b,720,280,{barColors:K,labelAngle:-40,legendFontSize:10,legendMaxWidth:500,toleranceLine:T});return`
**ASSUNTO:** Memorial de Cálculo — Análise de Risco (NBR 5419)

---

## ${c.dados}. DADOS DO PROJETO
* **Projeto/Cliente:** ${e.clientName}
* **Endereço:** ${e.clientAddress}
* **Descrição:** ${e.projectName}
* **Data:** ${e.projectDate}
* **Responsável Técnico:** ${e.technicalManagerName} (${e.licenseNumber})

## ${c.parametros}. PARÂMETROS GERAIS DA ANÁLISE
* **Localização (Cidade/UF):** ${e.location}
* **Densidade de Descargas (Ng):** **${e.ng}** descargas/km²/ano
* **Geometria da Estrutura:** **${e.l}**m (C) × **${e.w}**m (L) × **${e.h}**m (A)
* **Fator de Localização (Cd):** **${e.cd}**

## ${c.calculos}. CÁLCULOS DETALHADOS

### ${c.calculos}.1. Áreas de Exposição Equivalentes
* **Área de Exposição (Ad):**
  * *Fórmula:* Ad = L×W + 2×(3H)×(L+W) + π×(3H)²
  * *Cálculo:* Ad = ${e.l}×${e.w} + 2×(3×${e.h})×(${e.l}+${e.w}) + π×(3×${e.h})²
  * *Resultado:* **Ad = ${(ie=t.ad)==null?void 0:ie.toFixed(2)} m²**
* **Área de Exposição Final (Adf):**
  * *Resultado:* **Adf = ${(se=t.adf)==null?void 0:se.toFixed(2)} m²** (Considerando protrusões)
* **Área de Exposição Próxima (Am):**
  * *Fórmula:* Am = 2×500×(L+W) + π×500²
  * *Cálculo:* Am = 2×500×(${e.l}+${e.w}) + π×500²
  * *Resultado:* **Am = ${(re=t.am)==null?void 0:re.toFixed(2)} m²**
* **Linha Elétrica (Al1, Ai1):** **Al1 = ${(le=t.al1)==null?void 0:le.toFixed(2)} m²**, **Ai1 = ${(ce=t.ai1)==null?void 0:ce.toFixed(2)} m²**
* **Linha de Dados (Al2, Ai2):** **Al2 = ${(me=t.al2)==null?void 0:me.toFixed(2)} m²**, **Ai2 = ${(pe=t.ai2)==null?void 0:pe.toFixed(2)} m²**

### ${c.calculos}.2. Frequência Média Anual de Eventos Danosos (N)
* **Nd:** Nd = Ng × Adf × Cd × 10⁻⁶ → **${(de=t.nd)==null?void 0:de.toExponential(3)}** eventos/ano
* **Nm:** Nm = Ng × Am × 10⁻⁶ → **${(ue=t.nm)==null?void 0:ue.toExponential(3)}** eventos/ano
* **Nl/ Ni (Elétrica):** **Nl = ${(xe=t.nl_electric)==null?void 0:xe.toExponential(3)}**, **Ni = ${(ge=t.ni_electric)==null?void 0:ge.toExponential(3)}** eventos/ano
* **Nl/ Ni (Dados):** **Nl = ${(he=t.nl_data)==null?void 0:he.toExponential(3)}**, **Ni = ${($e=t.ni_data)==null?void 0:$e.toExponential(3)}** eventos/ano

${m}

## ${c.resultados}. RESULTADOS E CONCLUSÕES

${d}

### Figura 1 — Componentes de Risco — Global
![Componentes de Risco — Global](${V})


### ${c.resultados}.${Object.values(e.risks_to_analyze).filter(l=>l).length+1}. Frequência de Danos aos Sistemas (F)
* **Frequência Calculada (F):** **${(Pe=$.F)==null?void 0:Pe.toExponential(3)}** danos/ano
* **Frequência Tolerável (FT):** **${T.toFixed(1)}** danos/ano
* **Resultado:** ${r} A frequência F é **${s?"ACEITÁVEL":"NÃO ACEITÁVEL"}**.

### Figura 2 — Frequência de Danos — Global
![Frequência de Danos — Global](${te})

## ${c.parecer}. PARECER TÉCNICO
${o(e)}

---

## ✅ Responsabilidade Técnica e Conferência Final do Relatório
A **NBR 5419:2025** deve ser utilizada como **fonte principal** para validação dos dados e referência normativa do relatório.

Este aplicativo atua **exclusivamente como ferramenta de apoio** para cálculos e emissão de relatórios, **não isentando o usuário** de sua responsabilidade legal e técnica quanto à **veracidade**, **precisão** e **adequação** das informações fornecidas.

### 🤝 Informações de Contato
* **Autor do Aplicativo:** Engº Júlio César Certo
* **Contato (WhatsApp):** (35) 9 8811-3746
* **E-mail:** julio.certo@hotmail.com

> Ao utilizar este aplicativo, cite a fonte: **Engº Júlio César Certo — Ferramenta de Análise de Risco SPDA NBR 5419**.
`.trim()}const De=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),Ze={paragraphFontSizePt:11,paragraphLineHeight:1.35,paragraphMarginTopPx:6,paragraphMarginBottomPx:8,listItemMarginTopPx:4,listItemMarginBottomPx:4,listItemExtraMarginBottomPx:10,blockMarginBetweenItemsPx:20,listMarginTopPx:8,listMarginBottomPx:12,listPaddingLeftPx:18,h2FontSizeRem:1.25,h2MarginTopPx:14,h2MarginBottomPx:10,h3FontSizeRem:1.1,h3MarginTopPx:10,h3MarginBottomPx:8,figureMarginTopPx:10,figureMarginBottomPx:10,emptyLineHeightPx:20},we=(e,t)=>{if(!e)return"";const $=e.replace(/\\n/g,`
`).split(`
`);let c="",m=!1;for(let o=0;o<$.length;o++){let d=$[o];if(d.trim()===""){m?c+=`<li style="list-style:none;margin:${t.listItemMarginTopPx}px 0 ${t.listItemMarginBottomPx}px"><span style="display:inline-block;height:${t.emptyLineHeightPx}px"></span></li>
`:c+=`<p style="margin:${t.emptyLineHeightPx}px 0 ${t.emptyLineHeightPx}px;font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">&nbsp;</p>
`;continue}if(/^\s*\*+\s*$/.test(d))continue;const T=r=>{let L=De(r);return L=L.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),L=L.replace(/(^|[^*])\*(?!\*)([^*]+?)\*(?!\*)/g,(y,I,v)=>`${I}<em>${v}</em>`),L=L.replace(/\*/g,""),L};if(d.trim()==="---"){m&&(c+=`</ul>
`,m=!1),c+=`<hr style="border:0;border-top:1px solid #cbd5e1;margin:12px 0"/>
`;continue}const s=d.trim().match(/^!\[(.*?)\]\((.*?)\)$/);if(s){const[,r,L]=s;m&&(c+=`</ul>
`,m=!1);const y=o+1<$.length?$[o+1].trim():"",I=o-1>=0?$[o-1].trim():"",v=/^(Figura|FIGURA)\s*([0-9]+(?:\.[0-9]+)*)[\.:\-]\s*(.*)$/;let M=null;const _=y.match(v),E=I.match(v);_?(M=`Figura ${_[2]} — ${_[3]}`.trim(),o+=1):E?M=`Figura ${E[2]} — ${E[3]}`.trim():r&&r.trim().length>0&&(M=r.trim());const B=M?`<figcaption>${T(M)}</figcaption>`:"";c+=`<figure style="margin:${t.figureMarginTopPx}px 0 ${t.figureMarginBottomPx}px"><img src="${De(L)}" alt="${De(r)}" style="max-width:100%;height:auto;border-radius:4px;border:none;display:inline-block;page-break-inside:avoid"/>${B}</figure>
`;continue}if(d.startsWith("> ")){m&&(c+=`</ul>
`,m=!1);const r=T(d.substring(2));c+=`<p style="margin:${t.paragraphMarginTopPx}px 0 ${t.paragraphMarginBottomPx}px;font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${r}</p>
`;continue}if(d.startsWith("## ")){m&&(c+=`</ul>
`,m=!1),c+=`<h2 style="font-size:${t.h2FontSizeRem}rem;line-height:1.6;font-weight:700;margin:${t.h2MarginTopPx}px 0 ${t.h2MarginBottomPx}px;">${T(d.substring(3))}</h2>
`;continue}if(d.startsWith("### ")){m&&(c+=`</ul>
`,m=!1),c+=`<h3 style="font-size:${t.h3FontSizeRem}rem;line-height:1.5;font-weight:700;margin:${t.h3MarginTopPx}px 0 ${t.h3MarginBottomPx}px;">${T(d.substring(4))}</h3>
`;continue}if(d.trim().startsWith("* ")){m||(c+=`<ul style="margin:${t.listMarginTopPx}px 0 ${t.listMarginBottomPx}px;padding-left:${t.listPaddingLeftPx}px">
`,m=!0);let r=d.trim().substring(2);for(;o+1<$.length&&$[o+1].startsWith("  ");)r+=" "+$[o+1].trim(),o++;const L=r.replace(/\*/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),y=/\bresultado:\b/.test(L),I=/\bcalculo:\b/.test(L),v=/\bformula:\b/.test(L),M=/^\*\*[^*]+?\*\*:/.test(r.trim()),_=M?t.blockMarginBetweenItemsPx:Math.max(0,t.listItemMarginTopPx),E=M||y||I||v?t.blockMarginBetweenItemsPx:t.listItemMarginBottomPx,B=`${_}px 0 ${E}px`,j=/(F[óo]rmula:|C[áa]lculo:|Resultado:)/gi,N="§§",u=r.replace(j,N+"$1").split(N).filter(w=>w.trim().length>0);if(u.length>1||/:\s*$/.test(r.trim())){let w="";for(const Z of u){const k=Z.replace(/\*/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),V=/\bresultado:\b/.test(k),b=/\bcalculo:\b/.test(k),C=/\bformula:\b/.test(k),z=V||b||C?`${t.paragraphMarginTopPx}px 0 ${t.listItemExtraMarginBottomPx}px`:`${t.paragraphMarginTopPx}px 0 ${t.paragraphMarginBottomPx}px`;w+=`<p style="margin:${z};font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${T(Z)}</p>`,V&&(w+=`<p style="margin:0;height:${t.emptyLineHeightPx}px;line-height:0">&nbsp;</p>`)}c+=`<li style="margin:${B};font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${w}</li>
`}else c+=`<li style="margin:${B};font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${T(r)}</li>
`;continue}if(m&&(c+=`</ul>
`,m=!1),d.trim()){const r=o+1<$.length?$[o+1].trim():"";if(!(/^(Figura|FIGURA)\s*([0-9]+(?:\.[0-9]+)*)[\.:\-]\s*(.*)$/.test(d.trim())&&/^!\[(.*?)\]\((.*?)\)$/.test(r))){const y=/(F[óo]rmula:|C[áa]lculo:|Resultado:)/gi,M=d.replace(y,"§§$1").split("§§").filter(_=>_.trim().length>0);if(M.length>1)for(const _ of M){const E=_.replace(/\*/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),B=/\bresultado:\b/.test(E),j=/\bcalculo:\b/.test(E),N=/\bformula:\b/.test(E),D=B||j||N?`${t.paragraphMarginTopPx}px 0 ${t.listItemExtraMarginBottomPx}px`:`${t.paragraphMarginTopPx}px 0 ${t.paragraphMarginBottomPx}px`;c+=`<p style="margin:${D};font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${T(_)}</p>
`,B&&(c+=`<p style="margin:0;height:${t.emptyLineHeightPx}px;line-height:0">&nbsp;</p>
`)}else{const _=d.replace(/\*/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),E=/\bresultado:\b/.test(_),B=/\bcalculo:\b/.test(_),j=/\bformula:\b/.test(_),N=E||B||j?`${t.paragraphMarginTopPx}px 0 ${t.listItemExtraMarginBottomPx}px`:`${t.paragraphMarginTopPx}px 0 ${t.paragraphMarginBottomPx}px`;c+=`<p style="margin:${N};font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${T(d)}</p>
`,E&&(c+=`<p style="margin:0;height:${t.emptyLineHeightPx}px;line-height:0">&nbsp;</p>
`);const D=o+1<$.length&&$[o+1].trim().startsWith("* ");!E&&D&&(c+=`<p style="margin:0;height:${t.emptyLineHeightPx}px;line-height:0">&nbsp;</p>
`)}}}}return m&&(c+=`</ul>
`),c};function Tt({data:e,onUpdate:t}){const[a,$]=S.useState(!1),[c,m]=S.useState(""),[o,d]=S.useState(!1),[T,s]=S.useState(22),[r,L]=S.useState(15),[y,I]=S.useState(22),[v,M]=S.useState(6),[_,E]=S.useState(22),[B,j]=S.useState(6),N="report_format_prefs",D=()=>{try{const b=localStorage.getItem(N);if(b){const C=JSON.parse(b);return{...Ze,...C}}}catch{}return Ze},[u]=S.useState(D()),w=async()=>{$(!0),m("");try{const b=await Rt(e);m(b)}finally{$(!1)}},Z=async()=>{if(!c)return;const b=we(c,u),C=c.replace(/\!\[[^\]]*\]\([^\)]*\)/g,"").replace(/^###\s+/gm,"").replace(/^##\s+/gm,"").replace(/\*\*(.*?)\*\*/g,"$1").replace(/^>\s+/gm,"").replace(/\n\n+/g,`

`);try{if(typeof window.ClipboardItem<"u"){const z=new window.ClipboardItem({"text/html":new Blob([b],{type:"text/html"}),"text/plain":new Blob([C],{type:"text/plain"})});await navigator.clipboard.write([z])}else await navigator.clipboard.writeText(C);d(!0),setTimeout(()=>d(!1),2e3)}catch{try{await navigator.clipboard.writeText(C)}catch{}d(!0),setTimeout(()=>d(!1),2e3)}},k=S.useMemo(()=>ct(e),[e.h,e.l,e.w,e.hp,e.ng,e.cd,e.has_electric_line,e.line_sections_1,e.use_adj_structure_1,e.l_adj_1,e.w_adj_1,e.h_adj_1,e.hp_adj_1,e.cd_adj_1,e.has_data_line,e.line_sections_2,e.use_adj_structure_2,e.l_adj_2,e.w_adj_2,e.h_adj_2,e.hp_adj_2,e.cd_adj_2]);S.useMemo(()=>Ie(e.probability_data,e.analyze_data_line_probabilities,e.has_data_line),[e.probability_data,e.analyze_data_line_probabilities,e.has_data_line]);const V=S.useMemo(()=>e.zones.map(b=>{const C=mt(b),z=Ie(b.probability_data||e.probability_data,e.analyze_data_line_probabilities,e.has_data_line),K=pt(z,b),te=dt(k,K,C,e.selected_risk_components);return{zone:b,lossCalculations:C,riskCalculations:te}}),[e.zones,k,e.selected_risk_components,e.analyze_data_line_probabilities,e.has_data_line,e.probability_data]);return S.useMemo(()=>ut(V),[V]),i.jsxs("div",{children:[i.jsxs(qe,{children:[i.jsx(Oe,{className:"p-3",children:i.jsxs(Ve,{className:"flex items-center justify-between",children:[i.jsxs("div",{className:"flex items-center gap-2",children:[i.jsx(Ue,{className:"w-5 h-5 text-slate-100"}),"Relatório Técnico Detalhado"]}),c&&!a&&i.jsx(ve,{variant:"outline",size:"icon",onClick:()=>m(""),className:"h-8 w-8 flex-shrink-0",children:i.jsx(xt,{className:"w-4 h-4"})})]})}),c&&!a&&i.jsxs("div",{className:"flex justify-end gap-2 px-2 pb-0",children:[i.jsx(ve,{variant:"secondary",size:"sm",onClick:()=>{const b=we(c,u),C=window.open("","_blank");if(!C)return;const z=Math.max(4,v),K=Math.max(4,B);C.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title></title><style>
@page{margin:${T}mm ${r}mm;}
*{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu; background:#ffffff; color:#111827; margin:0; line-height:1.6;}
main{padding:${z}mm ${r}mm ${K}mm; overflow:visible;}
h2{font-size:${u.h2FontSizeRem}rem; line-height:1.6; color:#0f172a; font-weight:700; margin:${u.h2MarginTopPx}px 0 ${u.h2MarginBottomPx}px; break-inside:avoid; break-after:avoid-page;}
h3{font-size:${u.h3FontSizeRem}rem; line-height:1.5; color:#1f2937; font-weight:700; margin:${u.h3MarginTopPx}px 0 ${u.h3MarginBottomPx}px; break-inside:avoid; break-after:avoid-page;}
ul{margin:${u.listMarginTopPx}px 0 ${u.listMarginBottomPx}px; padding-left:${u.listPaddingLeftPx}px; break-inside:avoid;}
li{break-inside:avoid; font-size:${u.paragraphFontSizePt}pt; line-height:${u.paragraphLineHeight};}
p{margin:${u.paragraphMarginTopPx}px 0 ${u.paragraphMarginBottomPx}px; break-inside:avoid; font-size:${u.paragraphFontSizePt}pt; line-height:${u.paragraphLineHeight};}
img{max-width:100%; height:auto; display:block; page-break-inside:avoid; break-inside:avoid;}
blockquote{margin:8px 0; padding:10px 12px; border-left:3px solid #3b82f6; background:transparent; color:#0f172a; border-radius:6px; break-inside:avoid;}
hr{border:0; border-top:1px solid #cbd5e1; margin:12px 0; break-inside:avoid;}
</style></head><body><main>${b}</main>
<script>
(function(){
  const mmPerPx = 25.4/96;
  const pxPerMm = 1/mmPerPx;
  const main = document.querySelector('main');
  if(!main) return;
  const first = main.querySelector('img, table, canvas');
  if(!first) return;
  const rect = first.getBoundingClientRect();
  const hPx = rect.height;
  const extraTopMm = Math.min(Math.max((hPx*mmPerPx)*0.06, 4), 18);
  const extraBottomMm = Math.min(Math.max((hPx*mmPerPx)*0.04, 4), 14);
  const computed = getComputedStyle(main);
  const curTopPx = parseFloat(computed.paddingTop)||0;
  const curBottomPx = parseFloat(computed.paddingBottom)||0;
  main.style.paddingTop = (curTopPx + extraTopMm*pxPerMm) + 'px';
  main.style.paddingBottom = (curBottomPx + extraBottomMm*pxPerMm) + 'px';
  try { document.title = ''; } catch {}
})();
<\/script></body></html>`),C.document.close(),C.focus(),setTimeout(()=>{try{C.print()}catch{}},300)},children:"Gerar PDF"}),i.jsxs(ve,{variant:"secondary",size:"sm",onClick:Z,children:[i.jsx(gt,{className:"w-4 h-4 mr-2"}),o?"Texto copiado!":"Copiar para Word (formatado)"]})]}),i.jsx(We,{className:"text-center px-3 pt-0 pb-3",children:i.jsx(Qe,{mode:"wait",children:a?i.jsxs(je.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},className:"flex flex-col items-center justify-center min-h-[10rem]",children:[i.jsx(ht,{className:"w-6 h-6 animate-spin text-blue-400"}),i.jsx("p",{className:"mt-3 text-slate-300",children:"Gerando Relatório..."})]},"loading"):c?i.jsx(je.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},className:"text-left pt-4 relative",children:i.jsx("div",{className:"w-full h-[30rem] overflow-y-auto p-5 rounded-lg border border-slate-700/40 bg-slate-900/50 text-[17px] leading-loose tracking-[0.02em] text-slate-100 focus:outline-none prose-styles",dangerouslySetInnerHTML:{__html:we(c,u)}})},"report"):i.jsx(je.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},children:i.jsxs(ve,{onClick:w,disabled:a,className:"w-full max-w-sm mx-auto my-3",children:[i.jsx(Ue,{className:"w-4 h-4 mr-2"}),"Gerar Relatório Técnico da Análise de Risco"]})},"initial")})})]}),i.jsxs(qe,{className:"mt-4 bg-slate-900/80 border-slate-600/60",children:[i.jsx(Oe,{className:"p-3",children:i.jsxs(Ve,{className:"flex items-start gap-2",children:[i.jsxs("span",{className:"flex items-start gap-2",children:[i.jsx($t,{className:"w-5 h-5 text-green-400 flex-shrink-0"}),i.jsx("span",{className:"text-slate-100 text-sm sm:text-base leading-relaxed text-justify",children:"Responsabilidade Técnica e Conferência Final do Relatório"})]}),i.jsx(Pt,{className:"w-5 h-5 text-yellow-400 flex-shrink-0"})]})}),i.jsxs(We,{className:"p-4 space-y-4 text-sm text-slate-200",children:[i.jsxs("div",{className:"space-y-2",children:[i.jsxs("p",{children:["A ",i.jsx("strong",{children:"NBR 5419:2025"})," deve ser utilizada como ",i.jsx("strong",{children:"fonte principal"})," para validação dos dados e referência normativa do relatório."]}),i.jsxs("p",{children:["Este aplicativo atua ",i.jsx("strong",{children:"exclusivamente como uma ferramenta de apoio"})," para cálculos e emissão de relatórios, ",i.jsx("strong",{children:"não isentando o usuário"})," de sua responsabilidade legal e técnica quanto à ",i.jsx("strong",{children:"veracidade"}),", ",i.jsx("strong",{children:"precisão"})," e ",i.jsx("strong",{children:"adequação"})," das informações fornecidas."]})]}),i.jsxs("div",{className:"space-y-3",children:[i.jsx("h3",{className:"font-semibold text-slate-100",children:"🤝 Informações de Contato para Negócios com Eng° Júlio Certo"}),i.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-3",children:[i.jsxs("div",{className:"rounded-md border border-slate-700 p-3 bg-slate-800/60",children:[i.jsx("div",{className:"text-xs text-slate-400",children:"Autor do Aplicativo"}),i.jsx("div",{className:"font-medium",children:"Engº Júlio César Certo"})]}),i.jsxs("div",{className:"rounded-md border border-slate-700 p-3 bg-slate-800/60",children:[i.jsx("div",{className:"text-xs text-slate-400",children:"Contato (WhatsApp)"}),i.jsx("div",{className:"font-medium",children:"(35) 9 8811-3746"})]}),i.jsxs("div",{className:"rounded-md border border-slate-700 p-3 bg-slate-800/60",children:[i.jsx("div",{className:"text-xs text-slate-400",children:"E-mail"}),i.jsx("div",{className:"font-medium",children:"julio.certo@hotmail.com"})]})]}),i.jsx("p",{className:"text-sm text-slate-300",children:"Ao utilizar este aplicativo em estudos ou projetos, cite a fonte: Engº Júlio César Certo — Ferramenta de Análise de Risco SPDA NBR 5419."})]})]})]})]})}export{Tt as ReportStep};
