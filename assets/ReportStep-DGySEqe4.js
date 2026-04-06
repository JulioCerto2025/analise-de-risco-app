import{r as v,j as i,A as at,m as De}from"./motion-CZTIYVKD.js";import{P as ot,t as qe,w as Be,K as nt,v as it,I as st,R as rt,J as lt,M as ct,N as dt,O as mt,Q as pt,r as Oe,E as ut,s as xt,G as ht,V as $t,C as Ve,a as We,b as Ue,B as Ne,e as Ze}from"./index-BV6WRxHn.js";import{F as He,X as gt,n as ft,L as Pt,l as Rt,T as Ft}from"./icons-ggQqh8om.js";import"./react-Bzgz95E1.js";import"./charts-wPg4HxFZ.js";function M(e,t){const a=e.find(R=>String(R.value)===String(t));return a?a.label:`Valor ${t}`}function _t(e){var y,L,A,z,j,V,ee,te,K,F,ae,oe,W,X,_,C,B,U,ne,Se,le,ce,de,me,pe,ue,xe,he,$e,ge,fe,Pe,Re,Fe,_e,Ce,l,f,P;const{calculations:t,probability_calculations:a,loss_calculations:R,risk_results:c,frequency_results:d,probability_data:n,zones:u,selected_risk_components:T}=e,s=((y=u[0])==null?void 0:y.loss_data)||{};let r="";r+=`### Etapa — Probabilidade (P)

`,r+=`> Resumo: PC_total = 1 − (1−PC) × (1−PCT); PM_total = 1 − (1−PM) × (1−PMT). Probabilidades nas linhas utilizam PTU/PV/PW/PZ combinadas com PEB/CLD/PLD conforme NBR 5419.

`,r+=`**PA - Danos a seres vivos por choque (Descarga na Estrutura)**
* *Fórmula:* PA = PTA × PB
* *Variáveis:*
    * PTA: **${n.PTA}** (${M(ot,n.PTA)})
    * PB: **${n.PB}** (${M(qe,n.PB)})
* *Cálculo:* PA = ${n.PTA} × ${n.PB}
* *Resultado:* **PA = ${(L=a.PA)==null?void 0:L.toExponential(3)}**

`,r+=`**PB - Danos físicos (Descarga na Estrutura)**
* *Fórmula:* PB = PB
* *Variáveis:*
    * PB (Nível do SPDA): **${n.PB}** (${M(qe,n.PB)})
* *Resultado:* **PB = ${(A=a.PB)==null?void 0:A.toExponential(3)}**

`,e.has_electric_line&&(r+=`**PC - Falha de sistemas (Descarga na Estrutura, Linha Elétrica)**
* *Fórmula:* PC = PSPDₑ × CLDₑ
* *Variáveis:*
    * PSPDₑ: **${n.PSPD_electric}** (${M(Be,n.PSPD_electric)})
    * CLDₑ_int: **${n.CLD_electric_int}**
    * CLDₑ_ext: **${n.CLD_electric_ext}**
* *Cálculo:* PC = ${n.PSPD_electric} × (CLDₑ conforme configuração)
* *Resultado:* **PC = ${(z=a.PC)==null?void 0:z.toExponential(3)}**

`),e.has_data_line&&(r+=`**PCT - Falha de sistemas (Descarga na Estrutura, Linha de Dados)**
* *Fórmula:* PCT = PSPDₐ × CLDₐ
* *Variáveis:*
    * PSPDₐ: **${n.PSPD_data}** (${M(Be,n.PSPD_data)})
    * CLDₐ_int: **${n.CLD_data_int}**
    * CLDₐ_ext: **${n.CLD_data_ext}**
* *Cálculo:* PCT = ${n.PSPD_data} × (CLDₐ conforme configuração)
* *Resultado:* **PCT = ${(j=a.PCT)==null?void 0:j.toExponential(3)}**

`),e.has_electric_line&&(r+=`**PM - Falha de sistemas (Descarga Próxima, Linha Elétrica)**
* *Fórmula:* PM = PSPDₑ × (Ks1 × Ks2 × Ks3ₑ × Ks4ₑ)²
* *Variáveis:*
    * PSPDₑ: **${n.PSPD_electric}** (${M(Be,n.PSPD_electric)})
    * Ks1 (Malha wm1=${n.wm1}m): **${(V=a.Ks1)==null?void 0:V.toFixed(3)}**
    * Ks2 (Malha wm2=${n.wm2}m): **${(ee=a.Ks2)==null?void 0:ee.toFixed(3)}**
    * Ks3ₑ: **${n.Ks3_electric_int}** (${M(nt,n.Ks3_electric_int)})
    * Ks4ₑ (Uw=${n.Uw_electric_int}kV): **${(te=a.Ks4_electric)==null?void 0:te.toFixed(3)}**
* *Cálculo:* PM = ${n.PSPD_electric} × (${(K=a.Ks1)==null?void 0:K.toFixed(3)} × ${(F=a.Ks2)==null?void 0:F.toFixed(3)} × ${n.Ks3_electric_int} × ${(ae=a.Ks4_electric)==null?void 0:ae.toFixed(3)})²
* *Resultado:* **PM = ${(oe=a.PM)==null?void 0:oe.toExponential(3)}**

`),e.has_electric_line&&(r+=`**PU - Danos a seres vivos por choque (Descarga na Linha Elétrica)**
* *Fórmula:* PU = PTU × PEB × PLD × CLD
* *Variáveis:*
    * PTU: **${n.PTU_electric}** (${M(it,n.PTU_electric)})
    * PEB: **${n.PEB_electric}** (${M(Be,n.PEB_electric)})
    * PLD (ext): **${(W=n.PLD_electric_ext)==null?void 0:W.toFixed(2)}**
    * CLD (ext): **${n.CLD_electric_ext}**
* *Cálculo:* PU = ${n.PTU_electric} × ${n.PEB_electric} × ${(X=n.PLD_electric_ext)==null?void 0:X.toFixed(2)} × ${n.CLD_electric_ext}
* *Resultado:* **PU = ${(_=a.PU)==null?void 0:_.toExponential(3)}**

`),r+=`### Etapa — Perdas Consequentes (L) — ${(C=u[0])==null?void 0:C.name}

`,r+=`> Resumo: LA (choque), LB (incêndio/pânico) e LC (falha de sistemas) usam fatores normativos (rt, rp, rf, hz, LO) e a fração de tempo/pessoas na zona (tz, nz/nt). Demais perdas usam equivalências LU=LA, LV=LB, LM=LW=LZ=LC.

`,r+=`**LA - Perda por choque elétrico**
* *Fórmula:* LA = rt × 0.01 × (nz / nt) × (tz / 8760) × rs
* *Variáveis:*
    * rt (Resist. Piso): **${s.rt}** (${M(st,s.rt)})
    * nz (Pessoas na Zona): **${s.nz}**
    * nt (Pessoas Total): **${s.nt}**
    * tz (Tempo na Zona): **${s.tz}** h/ano
    * rs (Tipo Estrutura): **${s.rs}** (${s.rs===1?"Robusta":"Simples"})
* *Cálculo:* LA = ${s.rt} × 0.01 × (${s.nz} / ${s.nt}) × (${s.tz} / 8760) × ${s.rs}
* *Resultado:* **LA = ${(B=R.LA)==null?void 0:B.toExponential(3)}**

`,r+=`**LB - Perda por danos físicos (incêndio)**
* *Fórmula:* LB = rs × rp × rf × hz × LF × (nz / nt) × (tz / 8760)
* *Variáveis:*
    * rs (Tipo Estrutura): **${s.rs}** (${s.rs===1?"Robusta":"Simples"})
    * rp (Prot. Incêndio): **${s.rp}** (${M(rt,s.rp)})
    * rf (Risco Incêndio): **${s.rf}** (${M(lt,s.rf)})
    * hz (Pânico): **${s.hz}** (${M(ct,s.hz)})
    * LF (Tipo Dano): **${s.LF}** (${M(dt,s.LF)})
    * nz, nt, tz: **${s.nz}**, **${s.nt}**, **${s.tz}**
* *Cálculo:* LB = ${s.rs} × ${s.rp} × ${s.rf} × ${s.hz} × ${s.LF} × (${s.nz} / ${s.nt}) × (${s.tz} / 8760)
* *Resultado:* **LB = ${(U=R.LB)==null?void 0:U.toExponential(3)}**

`,r+=`**LC - Perda por falha de sistemas**
* *Fórmula:* LC = LO × (nz / nt) × (tz / 8760) × rs
* *Variáveis:*
    * LO (Tipo Falha): **${s.LO}** (${M(mt,s.LO)})
    * nz, nt, tz, rs: **${s.nz}**, **${s.nt}**, **${s.tz}**, **${s.rs}**
* *Cálculo:* LC = ${s.LO} × (${s.nz} / ${s.nt}) × (${s.tz} / 8760) × ${s.rs}
* *Resultado:* **LC = ${(ne=R.LC)==null?void 0:ne.toExponential(3)}**

`,r+=`**Demais Perdas:** LU=LA, LV=LB, LM=LW=LZ=LC.

`,r+=`### Etapa — Componentes de Risco (R)

`;const b=Object.entries(T).filter(([,x])=>x).map(([x])=>{const o={RA:"RA = Nd × PA × LA",RB:"RB = Nd × PB × LB",RC:"RC = Nd × PC × LC",RM:"RM = Nm × PM × LM",RU:"RU = Nl × PU × LU",RV:"RV = Nl × PV × LV",RW:"RW = Nl × PW × LW",RZ:"RZ = Ni × PZ × LZ"},D=c[x];return`* **${x}:** ${o[x]||"N/A"} -> Resultado: **${D==null?void 0:D.toExponential(3)}**`}).join(`
`);r+=b+`

`,r+=`### Etapa — Frequência de Danos a Sistemas (F)

`,r+=`> Resumo: F = FB + FC + FM + FV + FW + FZ (quando aplicável), com combinação de sistemas internos via PC_total e PM_total.

`,d.FB&&e.frequency_config.has_equipment_in_ZPR0A&&(r+=`**FB - Danos por descarga na estrutura (Equip. ZPR0A)**
* *Fórmula:* FB = Nd × PB
* *Cálculo:* FB = ${(Se=t.nd)==null?void 0:Se.toExponential(3)} × ${a.PB}
* *Resultado:* **FB = ${(le=d.FB)==null?void 0:le.toExponential(3)}**

`),d.FC&&(r+=`**FC - Danos por descarga na estrutura (Sistemas Internos)**
* *Fórmula:* FC = Nd × PC_total
* *Cálculo:* FC = ${(ce=t.nd)==null?void 0:ce.toExponential(3)} × ${(1-(1-(a.PC||0))*(1-(a.PCT||0))).toFixed(3)}
* *Resultado:* **FC = ${(de=d.FC)==null?void 0:de.toExponential(3)}**

`),d.FM&&(r+=`**FM - Danos por descarga próxima (Sistemas Internos)**
* *Fórmula:* FM = Nm × PM_total
* *Cálculo:* FM = ${(me=t.nm)==null?void 0:me.toExponential(3)} × ${(1-(1-(a.PM||0))*(1-(a.PMT||0))).toFixed(3)}
* *Resultado:* **FM = ${(pe=d.FM)==null?void 0:pe.toExponential(3)}**

`),d.FV&&(r+=`**FV - Danos por descarga na linha**
* *Fórmula:* FV = Nlₑ × PEBₑ + Nlₐ × PEBₐ
* *Cálculo:* FV = (${(ue=t.nl_electric)==null?void 0:ue.toExponential(3)} × ${a.PEB_electric}) + (${(xe=t.nl_data)==null?void 0:xe.toExponential(3)} × ${a.PEB_data})
* *Resultado:* **FV = ${(he=d.FV)==null?void 0:he.toExponential(3)}**

`),d.FW&&(r+=`**FW - Danos por surto na linha**
* *Fórmula:* FW = Nlₑ × PW + Nlₐ × PWT
* *Cálculo:* FW = (${($e=t.nl_electric)==null?void 0:$e.toExponential(3)} × ${(ge=a.PW)==null?void 0:ge.toExponential(3)}) + (${(fe=t.nl_data)==null?void 0:fe.toExponential(3)} × ${(Pe=a.PWT)==null?void 0:Pe.toExponential(3)})
* *Resultado:* **FW = ${(Re=d.FW)==null?void 0:Re.toExponential(3)}**

`),d.FZ&&(r+=`**FZ - Danos por surto induzido na linha**
* *Fórmula:* FZ = Niₑ × PZ + Niₐ × PZT
* *Cálculo:* FZ = (${(Fe=t.ni_electric)==null?void 0:Fe.toExponential(3)} × ${(_e=a.PZ)==null?void 0:_e.toExponential(3)}) + (${(Ce=t.ni_data)==null?void 0:Ce.toExponential(3)} × ${(l=a.PZT)==null?void 0:l.toExponential(3)})
* *Resultado:* **FZ = ${(f=d.FZ)==null?void 0:f.toExponential(3)}**

`);const E=[];return e.frequency_config.has_equipment_in_ZPR0A&&E.push("FB"),E.push("FC","FM","FV","FW","FZ"),r+=`**F - Frequência Total de Danos**
* *Fórmula:* F = ${E.join(" + ")}
* *Cálculo:* F = ${E.map(x=>{var o;return((o=d[x])==null?void 0:o.toExponential(3))||0}).join(" + ")}
* *Resultado:* **F = ${(P=d.F)==null?void 0:P.toExponential(3)}**

`,r}async function Ct(e){var le,ce,de,me,pe,ue,xe,he,$e,ge,fe,Pe,Re,Fe,_e,Ce;const{calculations:t,risk_results:a,frequency_results:R}=e,c={dados:1,parametros:2,calculos:3,resultados:4,parecer:5},d=_t(e),n=l=>{var J,Z;const f=Object.entries(l.risks_to_analyze).filter(([,p])=>p).map(([p])=>p),P={R1:1e-5,R3:.001,R4:.001},x=[];f.forEach(p=>{const N=l.risk_results[p]||0,S=P[p];N>S&&x.push(p)});const o=l.frequency_config.is_critical_system?.1:1,D=(((J=l.frequency_results)==null?void 0:J.F)||0)>o,w=["RA","RB","RC","RM","RU","RV","RW","RZ"].map(p=>({k:p,v:l.risk_results[p]||0})).sort((p,N)=>N.v-p.v).slice(0,2).map(p=>{var N;return`${String(p.k)} (${(N=p.v)==null?void 0:N.toExponential(2)})`}).join(", "),k=`Este parecer foi elaborado com base na NBR 5419, considerando os riscos selecionados (${f.join(", ")||"nenhum"}) e a frequência de danos aos sistemas.`,be=`Frequência de Danos (F): **${(((Z=l.frequency_results)==null?void 0:Z.F)||0).toExponential(3)}**; Limite (FT): **${o.toFixed(1)}** → ${D?"**NÃO ACEITÁVEL**":"**ACEITÁVEL**"}.`,I=f.length?`Riscos totais: ${f.map(p=>`**${p}=${(l.risk_results[p]||0).toExponential(3)}** (RT=${P[p].toExponential(1)})`).join("; ")}.`:"Nenhum risco foi selecionado para análise próxima.",q=`Componentes dominantes observados: ${w}.`,se=`Recomendações prioritárias:
* Adequar o nível do SPDA (captores, descidas, aterramento) para reduzir PA/PB e efeitos de descargas na estrutura.
* Coordenar DPS (classes I/II/III) em entradas e quadros, nas linhas elétrica e de dados, para reduzir PC/PM e perdas associadas (RC, RM, FC, FM).
* Reforçar malhas de aterramento e equipotencialização, interligando elementos metálicos e melhorando conexões, reduzindo tensões de passo/toque (impacto em LA/LC).
* Otimizar blindagens/roteamento de cabos e separação física, diminuindo acoplamentos (RW/RZ).
* Revisar parâmetros de ocupação e medidas internas (rf, hz, LO) e rotinas operacionais em zonas críticas.`,O=x.length||D?`Conclusão: Há itens **NÃO ACEITÁVEIS** (${[...x,D?"F":null].filter(Boolean).join(", ")}). Recomenda-se implementar as medidas acima e reprocessar a análise para verificar a redução dos componentes dominantes e a conformidade com os limites.`:"Conclusão: Todos os itens analisados estão **ACEITÁVEIS** frente aos limites. Recomenda-se manter as medidas propostas, documentação e manutenção periódica do sistema.";return[k,be,I,q,se,O].join(`

`)},u=Object.entries(e.risks_to_analyze).filter(([,l])=>l).map(([l],f)=>{var I,q,se,O,J,Z,p,N,S;const P=a[l]||0,x={R1:1e-5,R3:.001,R4:.001}[l]||0,o=P<=x,D={R1:"Perda de Vidas Humanas",R3:"Perda de Patrimônio Cultural",R4:"Perda de Valor Econômico"}[l],ie=o?"🟢 ✅":"🔴 ❌",g=e.selected_risk_components;let w="",k="";if(l==="R1"){const h=[],m=[];g.RA&&(h.push("RA"),m.push(`${(I=a.RA)==null?void 0:I.toExponential(3)}`)),g.RB&&(h.push("RB"),m.push(`${(q=a.RB)==null?void 0:q.toExponential(3)}`)),g.RC&&(h.push("RC"),m.push(`${(se=a.RC)==null?void 0:se.toExponential(3)}`)),g.RM&&(h.push("RM"),m.push(`${(O=a.RM)==null?void 0:O.toExponential(3)}`)),g.RU&&(h.push("RU"),m.push(`${((a.RU||0)+(a.RUT||0)).toExponential(3)}`)),g.RV&&(h.push("RV"),m.push(`${((a.RV||0)+(a.RVT||0)).toExponential(3)}`)),g.RW&&(h.push("RW"),m.push(`${((a.RW||0)+(a.RWT||0)).toExponential(3)}`)),g.RZ&&(h.push("RZ"),m.push(`${((a.RZ||0)+(a.RZT||0)).toExponential(3)}`)),w=h.join(" + "),k=`${m.join(" + ")} = ${P.toExponential(3)}`}else if(l==="R3"){const h=[],m=[];g.RB&&(h.push("RB3"),m.push(`${(J=a.RB3)==null?void 0:J.toExponential(3)}`)),g.RV&&(h.push("RV3"),m.push(`${((a.RV3||0)+(a.RVT3||0)).toExponential(3)}`)),w=h.join(" + "),k=`${m.join(" + ")} = ${P.toExponential(3)}`}else if(l==="R4"){const h=[],m=[];g.RA&&(h.push("RA4"),m.push(`${(Z=a.RA4)==null?void 0:Z.toExponential(3)}`)),g.RB&&(h.push("RB4"),m.push(`${(p=a.RB4)==null?void 0:p.toExponential(3)}`)),g.RC&&(h.push("RC4"),m.push(`${(N=a.RC4)==null?void 0:N.toExponential(3)}`)),g.RM&&(h.push("RM4"),m.push(`${(S=a.RM4)==null?void 0:S.toExponential(3)}`)),g.RU&&(h.push("RU4"),m.push(`${((a.RU4||0)+(a.RUT4||0)).toExponential(3)}`)),g.RV&&(h.push("RV4"),m.push(`${((a.RV4||0)+(a.RVT4||0)).toExponential(3)}`)),g.RW&&(h.push("RW4"),m.push(`${((a.RW4||0)+(a.RWT4||0)).toExponential(3)}`)),g.RZ&&(h.push("RZ4"),m.push(`${((a.RZ4||0)+(a.RZT4||0)).toExponential(3)}`)),w=h.join(" + "),k=`${m.join(" + ")} = ${P.toExponential(3)}`}const be=w?`
* *Composição (${l}):* ${w}
* *Cálculo:* ${k}`:"";return`### ${c.resultados}.${f+1}. Risco ${l} - ${D}
* **Risco Total Calculado (${l}):** **${P.toExponential(3)}**
* **Risco Tolerável (RT):** **${x.toExponential(1)}**
* **Resultado:** ${ie} O risco ${l} é **${o?"ACEITÁVEL":"NÃO ACEITÁVEL"}**.${be}`}).join(`

`),T=e.frequency_config.is_critical_system?.1:1,s=(R.F||0)<=T,r=s?"🟢 ✅":"🔴 ❌",b=l=>{try{return btoa(unescape(encodeURIComponent(l)))}catch{return""}},E=(l,f,P=720,x=300,o)=>{const ie=o!=null&&o.showLegend?72:48,g=44,w=8,k=f.length,be=P-80,I=x-ie-g,q=Math.max(10,Math.floor((be-(k-1)*w)/k)),se=typeof(o==null?void 0:o.toleranceLine)=="number"?Math.max(o.toleranceLine,0):0,O=$=>Math.log10(Math.max($,1e-12)),J=[...f.map($=>$.value),se].filter($=>$>0),Z=Math.max(...J.map($=>O($))),p=Math.min(...f.map($=>O($.value))),N=(o==null?void 0:o.barColor)||"#60A5FA",S=o==null?void 0:o.barColors,h=(o==null?void 0:o.bg)||"#FFFFFF",m="#111827",Ke="#475569",ze=typeof(o==null?void 0:o.labelAngle)=="number"?o.labelAngle:-35,Xe=`
  <defs>
    <filter id="glowGreen" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="3.2" flood-color="#10B981" flood-opacity="0.45"/>
    </filter>
    <filter id="glowRed" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="3.2" flood-color="#EF4444" flood-opacity="0.45"/>
    </filter>
  </defs>`;let Me="";f.forEach(($,re)=>{const Y=40+re*(q+w),Ee=(O($.value)-p)/Math.max(Z-p,1e-6),Q=Math.max(2,Math.floor(Ee*I)),H=ie+(I-Q),Le=$.value.toExponential(2),G=S?S[re%S.length]:N,ve=x-g+18,Ae=Y+q/2,ye=G==="#CBD5E1",Te=$.name==="R Total"||$.name==="F Total",Ye=ye?' stroke="#94a3b8" stroke-width="1" stroke-dasharray="2 2" fill-opacity="0.25"':Te?` stroke="${G==="#10B981"?"#065f46":G==="#EF4444"?"#7f1d1d":"#334155"}" stroke-width="3"`:"",Qe=Te?5:3,et=Te?12:10,tt=Te?"700":"400";Me+=`
  <rect x="${Y}" y="${H}" width="${q}" height="${Q}" fill="${G}" rx="${Qe}"${Ye}${Te?G==="#10B981"?' filter="url(#glowGreen)"':' filter="url(#glowRed)"':""} />`,Me+=`
  <text x="${Ae}" y="${ve}" fill="${m}" font-size="11" text-anchor="${ze<0?"end":ze>0?"start":"middle"}" transform="rotate(${ze} ${Ae} ${ve})">${$.name}</text>`,Me+=`
  <text x="${Y+q/2}" y="${H-6}" fill="${m}" font-size="${et}" font-weight="${tt}" text-anchor="middle">${Le}</text>`});let Ie="";if(typeof(o==null?void 0:o.toleranceLine)=="number"){const $=Math.max(o.toleranceLine,1e-12),re=(O($)-p)/Math.max(Z-p,1e-6),Y=Math.min(1,Math.max(0,re)),Ee=Math.max(2,Math.floor(Y*I)),Q=ie+(I-Ee);Ie=`
  <line x1="40" y1="${Q}" x2="${P-40}" y2="${Q}" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 3" />`}let je="";if(!!(o!=null&&o.showLegend)&&S&&f.length){const $=typeof(o==null?void 0:o.legendBoxSize)=="number"?Math.max(6,o.legendBoxSize):10,re=typeof(o==null?void 0:o.legendColGap)=="number"?Math.max(2,o.legendColGap):8,Y=typeof(o==null?void 0:o.legendRowGap)=="number"?Math.max(2,o.legendRowGap):8,Ee=typeof(o==null?void 0:o.legendFontSize)=="number"?Math.max(8,o.legendFontSize):11,Q=Math.min(P-40,Math.max(120,(o==null?void 0:o.legendMaxWidth)||P-40));let H=40,Le=46;f.forEach((G,ve)=>{const Ae=S[ve%S.length],ye=Math.min(160,Math.max(40,G.name.length*7));H+$+4+ye>Q&&(H=40,Le+=$+Y),je+=`
  <rect x="${H}" y="${Le}" width="${$}" height="${$}" fill="${Ae}" rx="2" />`,je+=`
  <text x="${H+$+6}" y="${Le+$-1}" fill="${m}" font-size="${Ee}">${G.name}</text>`,H+=$+6+ye+re})}const Je=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${P}" height="${x}" viewBox="0 0 ${P} ${x}">
  ${Xe}
  <rect x="0" y="0" width="${P}" height="${x}" fill="${h}"/>
  <text x="40" y="24" fill="${m}" font-size="14" font-weight="bold">${l}</text>
  ${je}
  <line x1="40" y1="${x-g}" x2="${P-40}" y2="${x-g}" stroke="${Ke}" stroke-width="1"/>
  ${Ie}
  ${Me}
</svg>`;return`data:image/svg+xml;base64,${b(Je)}`},L=["RA","RB","RC","RM","RU","RV","RW","RZ"].map(l=>({name:l,value:e.risk_results[l]||1e-12,active:!!e.selected_risk_components[l]})),A=e.risks_to_analyze.R1?"R1":e.risks_to_analyze.R3?"R3":e.risks_to_analyze.R4?"R4":"R1",z=e.risk_results[A]||0,j=[...L.map(l=>({name:l.name,value:l.value})),{name:"R Total",value:z}],V=Object.entries(e.frequency_results||{}).filter(([l])=>l!=="F").map(([l,f])=>({name:l,value:f||0})),ee=["#60A5FA","#A78BFA","#F472B6","#FB7185","#F59E0B","#34D399","#22D3EE","#93C5FD"],te="#CBD5E1",K=e.risks_to_analyze.R1?1e-5:e.risks_to_analyze.R3||e.risks_to_analyze.R4?.001:1e-5,ae=z<=K?"#10B981":"#EF4444",oe=j.map((l,f)=>{var x;return l.name==="R Total"?ae:((x=L[f])==null?void 0:x.active)?ee[f%ee.length]:te}),W=["#F87171","#60A5FA","#A78BFA","#34D399","#F59E0B","#FB7185","#64748B"],X=E("Componentes de Risco — Global",j,720,300,{barColors:oe,labelAngle:-30,legendMaxWidth:420,toleranceLine:K}),_=[...V,{name:"F Total",value:((le=e.frequency_results)==null?void 0:le.F)||0}],C=(((ce=e.frequency_results)==null?void 0:ce.F)||0)<=T,B="#CBD5E1",U=_.map((l,f)=>{if(l.name==="F Total")return C?"#10B981":"#EF4444";const P=W[f%W.length];return(l.value||0)>0?P:B}),ne=E("Frequência de Danos — Global",_,720,280,{barColors:U,labelAngle:-40,legendFontSize:10,legendMaxWidth:500,toleranceLine:T});return`
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
  * *Resultado:* **Ad = ${(de=t.ad)==null?void 0:de.toFixed(2)} m²**
* **Área de Exposição Final (Adf):**
  * *Resultado:* **Adf = ${(me=t.adf)==null?void 0:me.toFixed(2)} m²** (Considerando protrusões)
* **Área de Exposição Próxima (Am):**
  * *Fórmula:* Am = 2×500×(L+W) + π×500²
  * *Cálculo:* Am = 2×500×(${e.l}+${e.w}) + π×500²
  * *Resultado:* **Am = ${(pe=t.am)==null?void 0:pe.toFixed(2)} m²**
* **Linha Elétrica (Al1, Ai1):** **Al1 = ${(ue=t.al1)==null?void 0:ue.toFixed(2)} m²**, **Ai1 = ${(xe=t.ai1)==null?void 0:xe.toFixed(2)} m²**
* **Linha de Dados (Al2, Ai2):** **Al2 = ${(he=t.al2)==null?void 0:he.toFixed(2)} m²**, **Ai2 = ${($e=t.ai2)==null?void 0:$e.toFixed(2)} m²**

### ${c.calculos}.2. Frequência Média Anual de Eventos Danosos (N)
* **Nd:** Nd = Ng × Adf × Cd × 10⁻⁶ → **${(ge=t.nd)==null?void 0:ge.toExponential(3)}** eventos/ano
* **Nm:** Nm = Ng × Am × 10⁻⁶ → **${(fe=t.nm)==null?void 0:fe.toExponential(3)}** eventos/ano
* **Nl/ Ni (Elétrica):** **Nl = ${(Pe=t.nl_electric)==null?void 0:Pe.toExponential(3)}**, **Ni = ${(Re=t.ni_electric)==null?void 0:Re.toExponential(3)}** eventos/ano
* **Nl/ Ni (Dados):** **Nl = ${(Fe=t.nl_data)==null?void 0:Fe.toExponential(3)}**, **Ni = ${(_e=t.ni_data)==null?void 0:_e.toExponential(3)}** eventos/ano

${d}

## ${c.resultados}. RESULTADOS E CONCLUSÕES

> As figuras são numeradas conforme ABNT: “Figura N — Título”. Escala logarítmica nos gráficos para melhor comparação entre ordens de grandeza.

${u}

### Figura 1 — Componentes de Risco — Global
![Componentes de Risco — Global](${X})


### ${c.resultados}.${Object.values(e.risks_to_analyze).filter(l=>l).length+1}. Frequência de Danos aos Sistemas (F)
* **Frequência Calculada (F):** **${(Ce=R.F)==null?void 0:Ce.toExponential(3)}** danos/ano
* **Frequência Tolerável (FT):** **${T.toFixed(1)}** danos/ano
* **Resultado:** ${r} A frequência F é **${s?"ACEITÁVEL":"NÃO ACEITÁVEL"}**.

### Figura 2 — Frequência de Danos — Global
![Frequência de Danos — Global](${ne})

## ${c.parecer}. PARECER TÉCNICO
${n(e)}

---

## ✅ Responsabilidade Técnica e Conferência Final do Relatório
A **NBR 5419:2025** deve ser utilizada como **fonte principal** para validação dos dados e referência normativa do relatório.

Este aplicativo atua **exclusivamente como ferramenta de apoio** para cálculos e emissão de relatórios, **não isentando o usuário** de sua responsabilidade legal e técnica quanto à **veracidade**, **precisão** e **adequação** das informações fornecidas.

### 🤝 Informações de Contato
* **Autor do Aplicativo:** Engº Júlio César Certo
* **Contato (WhatsApp):** (35) 9 8811-3746
* **E-mail:** julio.certo@hotmail.com

> Ao utilizar este aplicativo, cite a fonte: **Engº Júlio César Certo — Ferramenta de Análise de Risco SPDA NBR 5419**.
`.trim()}const we=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),Ge={paragraphFontSizePt:11,paragraphLineHeight:1.35,paragraphMarginTopPx:8,paragraphMarginBottomPx:8,listItemMarginTopPx:4,listItemMarginBottomPx:4,listItemExtraMarginBottomPx:14,listMarginTopPx:8,listMarginBottomPx:12,listPaddingLeftPx:18,h2FontSizeRem:1.25,h2MarginTopPx:16,h2MarginBottomPx:10,h3FontSizeRem:1.1,h3MarginTopPx:12,h3MarginBottomPx:8,figureMarginTopPx:12,figureMarginBottomPx:12,emptyLineHeightPx:12},ke=(e,t)=>{if(!e)return"";const R=e.replace(/\\n/g,`
`).split(`
`);let c="",d=!1;for(let n=0;n<R.length;n++){let u=R[n];if(u.trim()===""){d?c+=`<li style="list-style:none;margin:${t.listItemMarginTopPx}px 0 ${t.listItemMarginBottomPx}px"><span style="display:inline-block;height:${t.emptyLineHeightPx}px"></span></li>
`:c+=`<p style="margin:${t.emptyLineHeightPx}px 0 ${t.emptyLineHeightPx}px;font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">&nbsp;</p>
`;continue}const T=r=>{let b=we(r);return b=b.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),b=b.replace(/(^|[^*])\*(?!\*)([^*]+?)\*(?!\*)/g,(E,y,L)=>`${y}<em>${L}</em>`),b};if(u.trim()==="---"){d&&(c+=`</ul>
`,d=!1),c+=`<hr style="border:0;border-top:1px solid #cbd5e1;margin:12px 0"/>
`;continue}const s=u.trim().match(/^!\[(.*?)\]\((.*?)\)$/);if(s){const[,r,b]=s;d&&(c+=`</ul>
`,d=!1);const E=n+1<R.length?R[n+1].trim():"",y=n-1>=0?R[n-1].trim():"",L=/^(Figura|FIGURA)\s*([0-9]+(?:\.[0-9]+)*)[\.:\-]\s*(.*)$/;let A=null;const z=E.match(L),j=y.match(L);z?(A=`Figura ${z[2]} — ${z[3]}`.trim(),n+=1):j?A=`Figura ${j[2]} — ${j[3]}`.trim():r&&r.trim().length>0&&(A=r.trim());const V=A?`<figcaption>${T(A)}</figcaption>`:"";c+=`<figure style="margin:${t.figureMarginTopPx}px 0 ${t.figureMarginBottomPx}px"><img src="${we(b)}" alt="${we(r)}" style="max-width:100%;height:auto;border-radius:4px;border:none;display:inline-block;page-break-inside:avoid"/>${V}</figure>
`;continue}if(u.startsWith("> ")){d&&(c+=`</ul>
`,d=!1);const r=T(u.substring(2));c+=`<p style="margin:${t.paragraphMarginTopPx}px 0 ${t.paragraphMarginBottomPx}px;font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${r}</p>
`;continue}if(u.startsWith("## ")){d&&(c+=`</ul>
`,d=!1),c+=`<h2 style="font-size:${t.h2FontSizeRem}rem;line-height:1.6;font-weight:700;margin:${t.h2MarginTopPx}px 0 ${t.h2MarginBottomPx}px;">${T(u.substring(3))}</h2>
`;continue}if(u.startsWith("### ")){d&&(c+=`</ul>
`,d=!1),c+=`<h3 style="font-size:${t.h3FontSizeRem}rem;line-height:1.5;font-weight:700;margin:${t.h3MarginTopPx}px 0 ${t.h3MarginBottomPx}px;">${T(u.substring(4))}</h3>
`;continue}if(u.trim().startsWith("* ")){d||(c+=`<ul style="margin:${t.listMarginTopPx}px 0 ${t.listMarginBottomPx}px;padding-left:${t.listPaddingLeftPx}px">
`,d=!0);let r=u.trim().substring(2);for(;n+1<R.length&&R[n+1].startsWith("  ");)r+=" "+R[n+1].trim(),n++;const b=r.replace(/\*/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),E=/\bresultado:\b/.test(b),y=/\bcalculo:\b/.test(b),L=E||y?`${Math.max(0,t.listItemMarginTopPx)}px 0 ${t.listItemExtraMarginBottomPx}px`:`${t.listItemMarginTopPx}px 0 ${t.listItemMarginBottomPx}px`;c+=`<li style="margin:${L};font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${T(r)}</li>
`;continue}if(d&&(c+=`</ul>
`,d=!1),u.trim()){const r=n+1<R.length?R[n+1].trim():"";if(!(/^(Figura|FIGURA)\s*([0-9]+(?:\.[0-9]+)*)[\.:\-]\s*(.*)$/.test(u.trim())&&/^!\[(.*?)\]\((.*?)\)$/.test(r))){const E=u.replace(/\*/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),y=/\bresultado:\b/.test(E),L=/\bcalculo:\b/.test(E),A=y||L?`${t.paragraphMarginTopPx}px 0 ${t.listItemExtraMarginBottomPx}px`:`${t.paragraphMarginTopPx}px 0 ${t.paragraphMarginBottomPx}px`;c+=`<p style="margin:${A};font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${T(u)}</p>
`}}}return d&&(c+=`</ul>
`),c};function Bt({data:e,onUpdate:t}){const[a,R]=v.useState(!1),[c,d]=v.useState(""),[n,u]=v.useState(!1),[T,s]=v.useState(22),[r,b]=v.useState(15),[E,y]=v.useState(22),[L,A]=v.useState(6),[z,j]=v.useState(22),[V,ee]=v.useState(6),te="report_format_prefs",K=()=>{try{const _=localStorage.getItem(te);if(_){const C=JSON.parse(_);return{...Ge,...C}}}catch{}return Ge},[F]=v.useState(K()),ae=async()=>{R(!0),d("");try{const _=await Ct(e);d(_)}finally{R(!1)}},oe=async()=>{if(!c)return;const _=ke(c,F),C=c.replace(/\!\[[^\]]*\]\([^\)]*\)/g,"").replace(/^###\s+/gm,"").replace(/^##\s+/gm,"").replace(/\*\*(.*?)\*\*/g,"$1").replace(/^>\s+/gm,"").replace(/\n\n+/g,`

`);try{if(typeof window.ClipboardItem<"u"){const B=new window.ClipboardItem({"text/html":new Blob([_],{type:"text/html"}),"text/plain":new Blob([C],{type:"text/plain"})});await navigator.clipboard.write([B])}else await navigator.clipboard.writeText(C);u(!0),setTimeout(()=>u(!1),2e3)}catch{try{await navigator.clipboard.writeText(C)}catch{}u(!0),setTimeout(()=>u(!1),2e3)}},W=v.useMemo(()=>pt(e),[e.h,e.l,e.w,e.hp,e.ng,e.cd,e.has_electric_line,e.line_sections_1,e.use_adj_structure_1,e.l_adj_1,e.w_adj_1,e.h_adj_1,e.hp_adj_1,e.cd_adj_1,e.has_data_line,e.line_sections_2,e.use_adj_structure_2,e.l_adj_2,e.w_adj_2,e.h_adj_2,e.hp_adj_2,e.cd_adj_2]);v.useMemo(()=>Oe(e.probability_data,e.analyze_data_line_probabilities,e.has_data_line),[e.probability_data,e.analyze_data_line_probabilities,e.has_data_line]);const X=v.useMemo(()=>e.zones.map(_=>{const C=ut(_),B=Oe(_.probability_data||e.probability_data,e.analyze_data_line_probabilities,e.has_data_line),U=xt(B,_),ne=ht(W,U,C,e.selected_risk_components);return{zone:_,lossCalculations:C,riskCalculations:ne}}),[e.zones,W,e.selected_risk_components,e.analyze_data_line_probabilities,e.has_data_line,e.probability_data]);return v.useMemo(()=>$t(X),[X]),i.jsxs("div",{children:[i.jsxs(Ve,{children:[i.jsx(We,{className:"p-3",children:i.jsxs(Ue,{className:"flex items-center justify-between",children:[i.jsxs("div",{className:"flex items-center gap-2",children:[i.jsx(He,{className:"w-5 h-5 text-slate-100"}),"Relatório Técnico Detalhado"]}),c&&!a&&i.jsx(Ne,{variant:"outline",size:"icon",onClick:()=>d(""),className:"h-8 w-8 flex-shrink-0",children:i.jsx(gt,{className:"w-4 h-4"})})]})}),c&&!a&&i.jsxs("div",{className:"flex justify-end gap-2 px-2 pb-0",children:[i.jsx(Ne,{variant:"secondary",size:"sm",onClick:()=>{const _=ke(c,F),C=window.open("","_blank");if(!C)return;const B=Math.max(4,L),U=Math.max(4,V);C.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title></title><style>
@page{margin:${T}mm ${r}mm;}
*{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu; background:#ffffff; color:#111827; margin:0; line-height:1.6;}
main{padding:${B}mm ${r}mm ${U}mm; overflow:visible;}
h2{font-size:${F.h2FontSizeRem}rem; line-height:1.6; color:#0f172a; font-weight:700; margin:${F.h2MarginTopPx}px 0 ${F.h2MarginBottomPx}px; break-inside:avoid; break-after:avoid-page;}
h3{font-size:${F.h3FontSizeRem}rem; line-height:1.5; color:#1f2937; font-weight:700; margin:${F.h3MarginTopPx}px 0 ${F.h3MarginBottomPx}px; break-inside:avoid; break-after:avoid-page;}
ul{margin:${F.listMarginTopPx}px 0 ${F.listMarginBottomPx}px; padding-left:${F.listPaddingLeftPx}px; break-inside:avoid;}
li{break-inside:avoid; font-size:${F.paragraphFontSizePt}pt; line-height:${F.paragraphLineHeight};}
p{margin:${F.paragraphMarginTopPx}px 0 ${F.paragraphMarginBottomPx}px; break-inside:avoid; font-size:${F.paragraphFontSizePt}pt; line-height:${F.paragraphLineHeight};}
img{max-width:100%; height:auto; display:block; page-break-inside:avoid; break-inside:avoid;}
blockquote{margin:8px 0; padding:10px 12px; border-left:3px solid #3b82f6; background:transparent; color:#0f172a; border-radius:6px; break-inside:avoid;}
hr{border:0; border-top:1px solid #cbd5e1; margin:12px 0; break-inside:avoid;}
</style></head><body><main>${_}</main>
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
<\/script></body></html>`),C.document.close(),C.focus(),setTimeout(()=>{try{C.print()}catch{}},300)},children:"Gerar PDF"}),i.jsxs(Ne,{variant:"secondary",size:"sm",onClick:oe,children:[i.jsx(ft,{className:"w-4 h-4 mr-2"}),n?"Texto copiado!":"Copiar para Word (formatado)"]})]}),i.jsx(Ze,{className:"text-center px-3 pt-0 pb-3",children:i.jsx(at,{mode:"wait",children:a?i.jsxs(De.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},className:"flex flex-col items-center justify-center min-h-[10rem]",children:[i.jsx(Pt,{className:"w-6 h-6 animate-spin text-blue-400"}),i.jsx("p",{className:"mt-3 text-slate-300",children:"Gerando Relatório..."})]},"loading"):c?i.jsx(De.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},className:"text-left pt-4 relative",children:i.jsx("div",{className:"w-full h-[30rem] overflow-y-auto p-5 rounded-lg border border-slate-700/40 bg-slate-900/50 text-[17px] leading-loose tracking-[0.02em] text-slate-100 focus:outline-none prose-styles",dangerouslySetInnerHTML:{__html:ke(c,F)}})},"report"):i.jsx(De.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},children:i.jsxs(Ne,{onClick:ae,disabled:a,className:"w-full max-w-sm mx-auto my-3",children:[i.jsx(He,{className:"w-4 h-4 mr-2"}),"Gerar Relatório Técnico da Análise de Risco"]})},"initial")})})]}),i.jsxs(Ve,{className:"mt-4 bg-slate-900/80 border-slate-600/60",children:[i.jsx(We,{className:"p-3",children:i.jsxs(Ue,{className:"flex items-start gap-2",children:[i.jsxs("span",{className:"flex items-start gap-2",children:[i.jsx(Rt,{className:"w-5 h-5 text-green-400 flex-shrink-0"}),i.jsx("span",{className:"text-slate-100 text-sm sm:text-base leading-relaxed text-justify",children:"Responsabilidade Técnica e Conferência Final do Relatório"})]}),i.jsx(Ft,{className:"w-5 h-5 text-yellow-400 flex-shrink-0"})]})}),i.jsxs(Ze,{className:"p-4 space-y-4 text-sm text-slate-200",children:[i.jsxs("div",{className:"space-y-2",children:[i.jsxs("p",{children:["A ",i.jsx("strong",{children:"NBR 5419:2025"})," deve ser utilizada como ",i.jsx("strong",{children:"fonte principal"})," para validação dos dados e referência normativa do relatório."]}),i.jsxs("p",{children:["Este aplicativo atua ",i.jsx("strong",{children:"exclusivamente como uma ferramenta de apoio"})," para cálculos e emissão de relatórios, ",i.jsx("strong",{children:"não isentando o usuário"})," de sua responsabilidade legal e técnica quanto à ",i.jsx("strong",{children:"veracidade"}),", ",i.jsx("strong",{children:"precisão"})," e ",i.jsx("strong",{children:"adequação"})," das informações fornecidas."]})]}),i.jsxs("div",{className:"space-y-3",children:[i.jsx("h3",{className:"font-semibold text-slate-100",children:"🤝 Informações de Contato para Negócios com Eng° Júlio Certo"}),i.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-3",children:[i.jsxs("div",{className:"rounded-md border border-slate-700 p-3 bg-slate-800/60",children:[i.jsx("div",{className:"text-xs text-slate-400",children:"Autor do Aplicativo"}),i.jsx("div",{className:"font-medium",children:"Engº Júlio César Certo"})]}),i.jsxs("div",{className:"rounded-md border border-slate-700 p-3 bg-slate-800/60",children:[i.jsx("div",{className:"text-xs text-slate-400",children:"Contato (WhatsApp)"}),i.jsx("div",{className:"font-medium",children:"(35) 9 8811-3746"})]}),i.jsxs("div",{className:"rounded-md border border-slate-700 p-3 bg-slate-800/60",children:[i.jsx("div",{className:"text-xs text-slate-400",children:"E-mail"}),i.jsx("div",{className:"font-medium",children:"julio.certo@hotmail.com"})]})]}),i.jsx("p",{className:"text-sm text-slate-300",children:"Ao utilizar este aplicativo em estudos ou projetos, cite a fonte: Engº Júlio César Certo — Ferramenta de Análise de Risco SPDA NBR 5419."})]})]})]})]})}export{Bt as ReportStep};
