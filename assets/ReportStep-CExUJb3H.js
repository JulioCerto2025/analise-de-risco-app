import{r as S,j as i,A as at,m as je}from"./motion-CZTIYVKD.js";import{P as ot,t as qe,w as Be,K as nt,v as it,I as st,R as rt,J as lt,M as ct,N as mt,O as dt,Q as pt,r as Oe,E as ut,s as xt,G as gt,V as ht,C as Ve,a as We,b as Ue,B as Se,e as Ze}from"./index-BAZDJ9Lt.js";import{F as He,X as $t,n as Pt,L as ft,l as Rt,T as Ft}from"./icons-ggQqh8om.js";import"./react-Bzgz95E1.js";import"./charts-wPg4HxFZ.js";function B(e,t){const a=e.find(F=>String(F.value)===String(t));return a?a.label:`Valor ${t}`}function _t(e){var j,v,M,_,C,N,z,A,D,x,K,X,q,W,b,E,w,J,ne,Ne,le,ce,me,de,pe,ue,xe,ge,he,$e,Pe,fe,Re,Fe,_e,Ce,l,f,R;const{calculations:t,probability_calculations:a,loss_calculations:F,risk_results:c,frequency_results:m,probability_data:n,zones:u,selected_risk_components:L}=e,s=((j=u[0])==null?void 0:j.loss_data)||{};let r="";r+=`### Etapa — Probabilidade (P)

`,r+=`> Resumo: PC_total = 1 − (1−PC) × (1−PCT); PM_total = 1 − (1−PM) × (1−PMT). Probabilidades nas linhas utilizam PTU/PV/PW/PZ combinadas com PEB/CLD/PLD conforme NBR 5419.

`,r+=`**PA - Danos a seres vivos por choque (Descarga na Estrutura)**
* *Fórmula:* PA = PTA × PB
* *Variáveis:*
    * PTA: **${n.PTA}** (${B(ot,n.PTA)})
    * PB: **${n.PB}** (${B(qe,n.PB)})
* *Cálculo:* PA = ${n.PTA} × ${n.PB}
* *Resultado:* **PA = ${(v=a.PA)==null?void 0:v.toExponential(3)}**

`,r+=`**PB - Danos físicos (Descarga na Estrutura)**
* *Fórmula:* PB = PB
* *Variáveis:*
    * PB (Nível do SPDA): **${n.PB}** (${B(qe,n.PB)})
* *Resultado:* **PB = ${(M=a.PB)==null?void 0:M.toExponential(3)}**

`,e.has_electric_line&&(r+=`**PC - Falha de sistemas (Descarga na Estrutura, Linha Elétrica)**
* *Fórmula:* PC = PSPDₑ × CLDₑ
* *Variáveis:*
    * PSPDₑ: **${n.PSPD_electric}** (${B(Be,n.PSPD_electric)})
    * CLDₑ_int: **${n.CLD_electric_int}**
    * CLDₑ_ext: **${n.CLD_electric_ext}**
* *Cálculo:* PC = ${n.PSPD_electric} × (CLDₑ conforme configuração)
* *Resultado:* **PC = ${(_=a.PC)==null?void 0:_.toExponential(3)}**

`),e.has_data_line&&(r+=`**PCT - Falha de sistemas (Descarga na Estrutura, Linha de Dados)**
* *Fórmula:* PCT = PSPDₐ × CLDₐ
* *Variáveis:*
    * PSPDₐ: **${n.PSPD_data}** (${B(Be,n.PSPD_data)})
    * CLDₐ_int: **${n.CLD_data_int}**
    * CLDₐ_ext: **${n.CLD_data_ext}**
* *Cálculo:* PCT = ${n.PSPD_data} × (CLDₐ conforme configuração)
* *Resultado:* **PCT = ${(C=a.PCT)==null?void 0:C.toExponential(3)}**

`),e.has_electric_line&&(r+=`**PM - Falha de sistemas (Descarga Próxima, Linha Elétrica)**
* *Fórmula:* PM = PSPDₑ × (Ks1 × Ks2 × Ks3ₑ × Ks4ₑ)²
* *Variáveis:*
    * PSPDₑ: **${n.PSPD_electric}** (${B(Be,n.PSPD_electric)})
    * Ks1 (Malha wm1=${n.wm1}m): **${(N=a.Ks1)==null?void 0:N.toFixed(3)}**
    * Ks2 (Malha wm2=${n.wm2}m): **${(z=a.Ks2)==null?void 0:z.toFixed(3)}**
    * Ks3ₑ: **${n.Ks3_electric_int}** (${B(nt,n.Ks3_electric_int)})
    * Ks4ₑ (Uw=${n.Uw_electric_int}kV): **${(A=a.Ks4_electric)==null?void 0:A.toFixed(3)}**
* *Cálculo:* PM = ${n.PSPD_electric} × (${(D=a.Ks1)==null?void 0:D.toFixed(3)} × ${(x=a.Ks2)==null?void 0:x.toFixed(3)} × ${n.Ks3_electric_int} × ${(K=a.Ks4_electric)==null?void 0:K.toFixed(3)})²
* *Resultado:* **PM = ${(X=a.PM)==null?void 0:X.toExponential(3)}**

`),e.has_electric_line&&(r+=`**PU - Danos a seres vivos por choque (Descarga na Linha Elétrica)**
* *Fórmula:* PU = PTU × PEB × PLD × CLD
* *Variáveis:*
    * PTU: **${n.PTU_electric}** (${B(it,n.PTU_electric)})
    * PEB: **${n.PEB_electric}** (${B(Be,n.PEB_electric)})
    * PLD (ext): **${(q=n.PLD_electric_ext)==null?void 0:q.toFixed(2)}**
    * CLD (ext): **${n.CLD_electric_ext}**
* *Cálculo:* PU = ${n.PTU_electric} × ${n.PEB_electric} × ${(W=n.PLD_electric_ext)==null?void 0:W.toFixed(2)} × ${n.CLD_electric_ext}
* *Resultado:* **PU = ${(b=a.PU)==null?void 0:b.toExponential(3)}**

`),r+=`### Etapa — Perdas Consequentes (L) — ${(E=u[0])==null?void 0:E.name}

`,r+=`> Resumo: LA (choque), LB (incêndio/pânico) e LC (falha de sistemas) usam fatores normativos (rt, rp, rf, hz, LO) e a fração de tempo/pessoas na zona (tz, nz/nt). Demais perdas usam equivalências LU=LA, LV=LB, LM=LW=LZ=LC.

`,r+=`**LA - Perda por choque elétrico**
* *Fórmula:* LA = rt × 0.01 × (nz / nt) × (tz / 8760) × rs
* *Variáveis:*
    * rt (Resist. Piso): **${s.rt}** (${B(st,s.rt)})
    * nz (Pessoas na Zona): **${s.nz}**
    * nt (Pessoas Total): **${s.nt}**
    * tz (Tempo na Zona): **${s.tz}** h/ano
    * rs (Tipo Estrutura): **${s.rs}** (${s.rs===1?"Robusta":"Simples"})
* *Cálculo:* LA = ${s.rt} × 0.01 × (${s.nz} / ${s.nt}) × (${s.tz} / 8760) × ${s.rs}
* *Resultado:* **LA = ${(w=F.LA)==null?void 0:w.toExponential(3)}**

`,r+=`**LB - Perda por danos físicos (incêndio)**
* *Fórmula:* LB = rs × rp × rf × hz × LF × (nz / nt) × (tz / 8760)
* *Variáveis:*
    * rs (Tipo Estrutura): **${s.rs}** (${s.rs===1?"Robusta":"Simples"})
    * rp (Prot. Incêndio): **${s.rp}** (${B(rt,s.rp)})
    * rf (Risco Incêndio): **${s.rf}** (${B(lt,s.rf)})
    * hz (Pânico): **${s.hz}** (${B(ct,s.hz)})
    * LF (Tipo Dano): **${s.LF}** (${B(mt,s.LF)})
    * nz, nt, tz: **${s.nz}**, **${s.nt}**, **${s.tz}**
* *Cálculo:* LB = ${s.rs} × ${s.rp} × ${s.rf} × ${s.hz} × ${s.LF} × (${s.nz} / ${s.nt}) × (${s.tz} / 8760)
* *Resultado:* **LB = ${(J=F.LB)==null?void 0:J.toExponential(3)}**

`,r+=`**LC - Perda por falha de sistemas**
* *Fórmula:* LC = LO × (nz / nt) × (tz / 8760) × rs
* *Variáveis:*
    * LO (Tipo Falha): **${s.LO}** (${B(dt,s.LO)})
    * nz, nt, tz, rs: **${s.nz}**, **${s.nt}**, **${s.tz}**, **${s.rs}**
* *Cálculo:* LC = ${s.LO} × (${s.nz} / ${s.nt}) × (${s.tz} / 8760) × ${s.rs}
* *Resultado:* **LC = ${(ne=F.LC)==null?void 0:ne.toExponential(3)}**

`,r+=`**Demais Perdas:** LU=LA, LV=LB, LM=LW=LZ=LC.

`,r+=`### Etapa — Componentes de Risco (R)

`;const T=Object.entries(L).filter(([,g])=>g).map(([g])=>{const o={RA:"RA = Nd × PA × LA",RB:"RB = Nd × PB × LB",RC:"RC = Nd × PC × LC",RM:"RM = Nm × PM × LM",RU:"RU = Nl × PU × LU",RV:"RV = Nl × PV × LV",RW:"RW = Nl × PW × LW",RZ:"RZ = Ni × PZ × LZ"},O=c[g];return`* **${g}:** ${o[g]||"N/A"} -> Resultado: **${O==null?void 0:O.toExponential(3)}**`}).join(`
`);r+=T+`

`,r+=`### Etapa — Frequência de Danos a Sistemas (F)

`,r+=`> Resumo: F = FB + FC + FM + FV + FW + FZ (quando aplicável), com combinação de sistemas internos via PC_total e PM_total.

`,m.FB&&e.frequency_config.has_equipment_in_ZPR0A&&(r+=`**FB - Danos por descarga na estrutura (Equip. ZPR0A)**
* *Fórmula:* FB = Nd × PB
* *Cálculo:* FB = ${(Ne=t.nd)==null?void 0:Ne.toExponential(3)} × ${a.PB}
* *Resultado:* **FB = ${(le=m.FB)==null?void 0:le.toExponential(3)}**

`),m.FC&&(r+=`**FC - Danos por descarga na estrutura (Sistemas Internos)**
* *Fórmula:* FC = Nd × PC_total
* *Cálculo:* FC = ${(ce=t.nd)==null?void 0:ce.toExponential(3)} × ${(1-(1-(a.PC||0))*(1-(a.PCT||0))).toFixed(3)}
* *Resultado:* **FC = ${(me=m.FC)==null?void 0:me.toExponential(3)}**

`),m.FM&&(r+=`**FM - Danos por descarga próxima (Sistemas Internos)**
* *Fórmula:* FM = Nm × PM_total
* *Cálculo:* FM = ${(de=t.nm)==null?void 0:de.toExponential(3)} × ${(1-(1-(a.PM||0))*(1-(a.PMT||0))).toFixed(3)}
* *Resultado:* **FM = ${(pe=m.FM)==null?void 0:pe.toExponential(3)}**

`),m.FV&&(r+=`**FV - Danos por descarga na linha**
* *Fórmula:* FV = Nlₑ × PEBₑ + Nlₐ × PEBₐ
* *Cálculo:* FV = (${(ue=t.nl_electric)==null?void 0:ue.toExponential(3)} × ${a.PEB_electric}) + (${(xe=t.nl_data)==null?void 0:xe.toExponential(3)} × ${a.PEB_data})
* *Resultado:* **FV = ${(ge=m.FV)==null?void 0:ge.toExponential(3)}**

`),m.FW&&(r+=`**FW - Danos por surto na linha**
* *Fórmula:* FW = Nlₑ × PW + Nlₐ × PWT
* *Cálculo:* FW = (${(he=t.nl_electric)==null?void 0:he.toExponential(3)} × ${($e=a.PW)==null?void 0:$e.toExponential(3)}) + (${(Pe=t.nl_data)==null?void 0:Pe.toExponential(3)} × ${(fe=a.PWT)==null?void 0:fe.toExponential(3)})
* *Resultado:* **FW = ${(Re=m.FW)==null?void 0:Re.toExponential(3)}**

`),m.FZ&&(r+=`**FZ - Danos por surto induzido na linha**
* *Fórmula:* FZ = Niₑ × PZ + Niₐ × PZT
* *Cálculo:* FZ = (${(Fe=t.ni_electric)==null?void 0:Fe.toExponential(3)} × ${(_e=a.PZ)==null?void 0:_e.toExponential(3)}) + (${(Ce=t.ni_data)==null?void 0:Ce.toExponential(3)} × ${(l=a.PZT)==null?void 0:l.toExponential(3)})
* *Resultado:* **FZ = ${(f=m.FZ)==null?void 0:f.toExponential(3)}**

`);const y=[];return e.frequency_config.has_equipment_in_ZPR0A&&y.push("FB"),y.push("FC","FM","FV","FW","FZ"),r+=`**F - Frequência Total de Danos**
* *Fórmula:* F = ${y.join(" + ")}
* *Cálculo:* F = ${y.map(g=>{var o;return((o=m[g])==null?void 0:o.toExponential(3))||0}).join(" + ")}
* *Resultado:* **F = ${(R=m.F)==null?void 0:R.toExponential(3)}**

`,r}async function Ct(e){var le,ce,me,de,pe,ue,xe,ge,he,$e,Pe,fe,Re,Fe,_e,Ce;const{calculations:t,risk_results:a,frequency_results:F}=e,c={dados:1,parametros:2,calculos:3,resultados:4,parecer:5},m=_t(e),n=l=>{var te,Y;const f=Object.entries(l.risks_to_analyze).filter(([,p])=>p).map(([p])=>p),R={R1:1e-5,R3:.001,R4:.001},g=[];f.forEach(p=>{const k=l.risk_results[p]||0,I=R[p];k>I&&g.push(p)});const o=l.frequency_config.is_critical_system?.1:1,O=(((te=l.frequency_results)==null?void 0:te.F)||0)>o,V=["RA","RB","RC","RM","RU","RV","RW","RZ"].map(p=>({k:p,v:l.risk_results[p]||0})).sort((p,k)=>k.v-p.v).slice(0,2).map(p=>{var k;return`${String(p.k)} (${(k=p.v)==null?void 0:k.toExponential(2)})`}).join(", "),U=`Este parecer foi elaborado com base na NBR 5419, considerando os riscos selecionados (${f.join(", ")||"nenhum"}) e a frequência de danos aos sistemas.`,be=`Frequência de Danos (F): **${(((Y=l.frequency_results)==null?void 0:Y.F)||0).toExponential(3)}**; Limite (FT): **${o.toFixed(1)}** → ${O?"**NÃO ACEITÁVEL**":"**ACEITÁVEL**"}.`,Z=f.length?`Riscos totais: ${f.map(p=>`**${p}=${(l.risk_results[p]||0).toExponential(3)}** (RT=${R[p].toExponential(1)})`).join("; ")}.`:"Nenhum risco foi selecionado para análise próxima.",H=`Componentes dominantes observados: ${V}.`,se=`Recomendações prioritárias:
* Adequar o nível do SPDA (captores, descidas, aterramento) para reduzir PA/PB e efeitos de descargas na estrutura.
* Coordenar DPS (classes I/II/III) em entradas e quadros, nas linhas elétrica e de dados, para reduzir PC/PM e perdas associadas (RC, RM, FC, FM).
* Reforçar malhas de aterramento e equipotencialização, interligando elementos metálicos e melhorando conexões, reduzindo tensões de passo/toque (impacto em LA/LC).
* Otimizar blindagens/roteamento de cabos e separação física, diminuindo acoplamentos (RW/RZ).
* Revisar parâmetros de ocupação e medidas internas (rf, hz, LO) e rotinas operacionais em zonas críticas.`,G=g.length||O?`Conclusão: Há itens **NÃO ACEITÁVEIS** (${[...g,O?"F":null].filter(Boolean).join(", ")}). Recomenda-se implementar as medidas acima e reprocessar a análise para verificar a redução dos componentes dominantes e a conformidade com os limites.`:"Conclusão: Todos os itens analisados estão **ACEITÁVEIS** frente aos limites. Recomenda-se manter as medidas propostas, documentação e manutenção periódica do sistema.";return[U,be,Z,H,se,G].join(`

`)},u=Object.entries(e.risks_to_analyze).filter(([,l])=>l).map(([l],f)=>{var Z,H,se,G,te,Y,p,k,I;const R=a[l]||0,g={R1:1e-5,R3:.001,R4:.001}[l]||0,o=R<=g,O={R1:"Perda de Vidas Humanas",R3:"Perda de Patrimônio Cultural",R4:"Perda de Valor Econômico"}[l],ie=o?"🟢 ✅":"🔴 ❌",P=e.selected_risk_components;let V="",U="";if(l==="R1"){const h=[],d=[];P.RA&&(h.push("RA"),d.push(`${(Z=a.RA)==null?void 0:Z.toExponential(3)}`)),P.RB&&(h.push("RB"),d.push(`${(H=a.RB)==null?void 0:H.toExponential(3)}`)),P.RC&&(h.push("RC"),d.push(`${(se=a.RC)==null?void 0:se.toExponential(3)}`)),P.RM&&(h.push("RM"),d.push(`${(G=a.RM)==null?void 0:G.toExponential(3)}`)),P.RU&&(h.push("RU"),d.push(`${((a.RU||0)+(a.RUT||0)).toExponential(3)}`)),P.RV&&(h.push("RV"),d.push(`${((a.RV||0)+(a.RVT||0)).toExponential(3)}`)),P.RW&&(h.push("RW"),d.push(`${((a.RW||0)+(a.RWT||0)).toExponential(3)}`)),P.RZ&&(h.push("RZ"),d.push(`${((a.RZ||0)+(a.RZT||0)).toExponential(3)}`)),V=h.join(" + "),U=`${d.join(" + ")} = ${R.toExponential(3)}`}else if(l==="R3"){const h=[],d=[];P.RB&&(h.push("RB3"),d.push(`${(te=a.RB3)==null?void 0:te.toExponential(3)}`)),P.RV&&(h.push("RV3"),d.push(`${((a.RV3||0)+(a.RVT3||0)).toExponential(3)}`)),V=h.join(" + "),U=`${d.join(" + ")} = ${R.toExponential(3)}`}else if(l==="R4"){const h=[],d=[];P.RA&&(h.push("RA4"),d.push(`${(Y=a.RA4)==null?void 0:Y.toExponential(3)}`)),P.RB&&(h.push("RB4"),d.push(`${(p=a.RB4)==null?void 0:p.toExponential(3)}`)),P.RC&&(h.push("RC4"),d.push(`${(k=a.RC4)==null?void 0:k.toExponential(3)}`)),P.RM&&(h.push("RM4"),d.push(`${(I=a.RM4)==null?void 0:I.toExponential(3)}`)),P.RU&&(h.push("RU4"),d.push(`${((a.RU4||0)+(a.RUT4||0)).toExponential(3)}`)),P.RV&&(h.push("RV4"),d.push(`${((a.RV4||0)+(a.RVT4||0)).toExponential(3)}`)),P.RW&&(h.push("RW4"),d.push(`${((a.RW4||0)+(a.RWT4||0)).toExponential(3)}`)),P.RZ&&(h.push("RZ4"),d.push(`${((a.RZ4||0)+(a.RZT4||0)).toExponential(3)}`)),V=h.join(" + "),U=`${d.join(" + ")} = ${R.toExponential(3)}`}const be=V?`
* *Composição (${l}):* ${V}
* *Cálculo:* ${U}`:"";return`### ${c.resultados}.${f+1}. Risco ${l} - ${O}
* **Risco Total Calculado (${l}):** **${R.toExponential(3)}**
* **Risco Tolerável (RT):** **${g.toExponential(1)}**
* **Resultado:** ${ie} O risco ${l} é **${o?"ACEITÁVEL":"NÃO ACEITÁVEL"}**.${be}`}).join(`

`),L=e.frequency_config.is_critical_system?.1:1,s=(F.F||0)<=L,r=s?"🟢 ✅":"🔴 ❌",T=l=>{try{return btoa(unescape(encodeURIComponent(l)))}catch{return""}},y=(l,f,R=720,g=300,o)=>{const ie=o!=null&&o.showLegend?72:48,P=44,V=8,U=f.length,be=R-80,Z=g-ie-P,H=Math.max(10,Math.floor((be-(U-1)*V)/U)),se=typeof(o==null?void 0:o.toleranceLine)=="number"?Math.max(o.toleranceLine,0):0,G=$=>Math.log10(Math.max($,1e-12)),te=[...f.map($=>$.value),se].filter($=>$>0),Y=Math.max(...te.map($=>G($))),p=Math.min(...f.map($=>G($.value))),k=(o==null?void 0:o.barColor)||"#60A5FA",I=o==null?void 0:o.barColors,h=(o==null?void 0:o.bg)||"#FFFFFF",d="#111827",Ke="#475569",ze=typeof(o==null?void 0:o.labelAngle)=="number"?o.labelAngle:-35,Xe=`
  <defs>
    <filter id="glowGreen" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="3.2" flood-color="#10B981" flood-opacity="0.45"/>
    </filter>
    <filter id="glowRed" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="3.2" flood-color="#EF4444" flood-opacity="0.45"/>
    </filter>
  </defs>`;let Me="";f.forEach(($,re)=>{const ae=40+re*(H+V),Ee=(G($.value)-p)/Math.max(Y-p,1e-6),oe=Math.max(2,Math.floor(Ee*Z)),Q=ie+(Z-oe),Le=$.value.toExponential(2),ee=I?I[re%I.length]:k,ye=g-P+18,ve=ae+H/2,Ae=ee==="#CBD5E1",Te=$.name==="R Total"||$.name==="F Total",Ye=Ae?' stroke="#94a3b8" stroke-width="1" stroke-dasharray="2 2" fill-opacity="0.25"':Te?` stroke="${ee==="#10B981"?"#065f46":ee==="#EF4444"?"#7f1d1d":"#334155"}" stroke-width="3"`:"",Qe=Te?5:3,et=Te?12:10,tt=Te?"700":"400";Me+=`
  <rect x="${ae}" y="${Q}" width="${H}" height="${oe}" fill="${ee}" rx="${Qe}"${Ye}${Te?ee==="#10B981"?' filter="url(#glowGreen)"':' filter="url(#glowRed)"':""} />`,Me+=`
  <text x="${ve}" y="${ye}" fill="${d}" font-size="11" text-anchor="${ze<0?"end":ze>0?"start":"middle"}" transform="rotate(${ze} ${ve} ${ye})">${$.name}</text>`,Me+=`
  <text x="${ae+H/2}" y="${Q-6}" fill="${d}" font-size="${et}" font-weight="${tt}" text-anchor="middle">${Le}</text>`});let Ie="";if(typeof(o==null?void 0:o.toleranceLine)=="number"){const $=Math.max(o.toleranceLine,1e-12),re=(G($)-p)/Math.max(Y-p,1e-6),ae=Math.min(1,Math.max(0,re)),Ee=Math.max(2,Math.floor(ae*Z)),oe=ie+(Z-Ee);Ie=`
  <line x1="40" y1="${oe}" x2="${R-40}" y2="${oe}" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 3" />`}let De="";if(!!(o!=null&&o.showLegend)&&I&&f.length){const $=typeof(o==null?void 0:o.legendBoxSize)=="number"?Math.max(6,o.legendBoxSize):10,re=typeof(o==null?void 0:o.legendColGap)=="number"?Math.max(2,o.legendColGap):8,ae=typeof(o==null?void 0:o.legendRowGap)=="number"?Math.max(2,o.legendRowGap):8,Ee=typeof(o==null?void 0:o.legendFontSize)=="number"?Math.max(8,o.legendFontSize):11,oe=Math.min(R-40,Math.max(120,(o==null?void 0:o.legendMaxWidth)||R-40));let Q=40,Le=46;f.forEach((ee,ye)=>{const ve=I[ye%I.length],Ae=Math.min(160,Math.max(40,ee.name.length*7));Q+$+4+Ae>oe&&(Q=40,Le+=$+ae),De+=`
  <rect x="${Q}" y="${Le}" width="${$}" height="${$}" fill="${ve}" rx="2" />`,De+=`
  <text x="${Q+$+6}" y="${Le+$-1}" fill="${d}" font-size="${Ee}">${ee.name}</text>`,Q+=$+6+Ae+re})}const Je=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${R}" height="${g}" viewBox="0 0 ${R} ${g}">
  ${Xe}
  <rect x="0" y="0" width="${R}" height="${g}" fill="${h}"/>
  <text x="40" y="24" fill="${d}" font-size="14" font-weight="bold">${l}</text>
  ${De}
  <line x1="40" y1="${g-P}" x2="${R-40}" y2="${g-P}" stroke="${Ke}" stroke-width="1"/>
  ${Ie}
  ${Me}
</svg>`;return`data:image/svg+xml;base64,${T(Je)}`},v=["RA","RB","RC","RM","RU","RV","RW","RZ"].map(l=>({name:l,value:e.risk_results[l]||1e-12,active:!!e.selected_risk_components[l]})),M=e.risks_to_analyze.R1?"R1":e.risks_to_analyze.R3?"R3":e.risks_to_analyze.R4?"R4":"R1",_=e.risk_results[M]||0,C=[...v.map(l=>({name:l.name,value:l.value})),{name:"R Total",value:_}],N=Object.entries(e.frequency_results||{}).filter(([l])=>l!=="F").map(([l,f])=>({name:l,value:f||0})),z=["#60A5FA","#A78BFA","#F472B6","#FB7185","#F59E0B","#34D399","#22D3EE","#93C5FD"],A="#CBD5E1",D=e.risks_to_analyze.R1?1e-5:e.risks_to_analyze.R3||e.risks_to_analyze.R4?.001:1e-5,K=_<=D?"#10B981":"#EF4444",X=C.map((l,f)=>{var g;return l.name==="R Total"?K:((g=v[f])==null?void 0:g.active)?z[f%z.length]:A}),q=["#F87171","#60A5FA","#A78BFA","#34D399","#F59E0B","#FB7185","#64748B"],W=y("Componentes de Risco — Global",C,720,300,{barColors:X,labelAngle:-30,legendMaxWidth:420,toleranceLine:D}),b=[...N,{name:"F Total",value:((le=e.frequency_results)==null?void 0:le.F)||0}],E=(((ce=e.frequency_results)==null?void 0:ce.F)||0)<=L,w="#CBD5E1",J=b.map((l,f)=>{if(l.name==="F Total")return E?"#10B981":"#EF4444";const R=q[f%q.length];return(l.value||0)>0?R:w}),ne=y("Frequência de Danos — Global",b,720,280,{barColors:J,labelAngle:-40,legendFontSize:10,legendMaxWidth:500,toleranceLine:L});return`
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
  * *Resultado:* **Ad = ${(me=t.ad)==null?void 0:me.toFixed(2)} m²**
* **Área de Exposição Final (Adf):**
  * *Resultado:* **Adf = ${(de=t.adf)==null?void 0:de.toFixed(2)} m²** (Considerando protrusões)
* **Área de Exposição Próxima (Am):**
  * *Fórmula:* Am = 2×500×(L+W) + π×500²
  * *Cálculo:* Am = 2×500×(${e.l}+${e.w}) + π×500²
  * *Resultado:* **Am = ${(pe=t.am)==null?void 0:pe.toFixed(2)} m²**
* **Linha Elétrica (Al1, Ai1):** **Al1 = ${(ue=t.al1)==null?void 0:ue.toFixed(2)} m²**, **Ai1 = ${(xe=t.ai1)==null?void 0:xe.toFixed(2)} m²**
* **Linha de Dados (Al2, Ai2):** **Al2 = ${(ge=t.al2)==null?void 0:ge.toFixed(2)} m²**, **Ai2 = ${(he=t.ai2)==null?void 0:he.toFixed(2)} m²**

### ${c.calculos}.2. Frequência Média Anual de Eventos Danosos (N)
* **Nd:** Nd = Ng × Adf × Cd × 10⁻⁶ → **${($e=t.nd)==null?void 0:$e.toExponential(3)}** eventos/ano
* **Nm:** Nm = Ng × Am × 10⁻⁶ → **${(Pe=t.nm)==null?void 0:Pe.toExponential(3)}** eventos/ano
* **Nl/ Ni (Elétrica):** **Nl = ${(fe=t.nl_electric)==null?void 0:fe.toExponential(3)}**, **Ni = ${(Re=t.ni_electric)==null?void 0:Re.toExponential(3)}** eventos/ano
* **Nl/ Ni (Dados):** **Nl = ${(Fe=t.nl_data)==null?void 0:Fe.toExponential(3)}**, **Ni = ${(_e=t.ni_data)==null?void 0:_e.toExponential(3)}** eventos/ano

${m}

## ${c.resultados}. RESULTADOS E CONCLUSÕES

> As figuras são numeradas conforme ABNT: “Figura N — Título”. Escala logarítmica nos gráficos para melhor comparação entre ordens de grandeza.

${u}

### Figura 1 — Componentes de Risco — Global
![Componentes de Risco — Global](${W})


### ${c.resultados}.${Object.values(e.risks_to_analyze).filter(l=>l).length+1}. Frequência de Danos aos Sistemas (F)
* **Frequência Calculada (F):** **${(Ce=F.F)==null?void 0:Ce.toExponential(3)}** danos/ano
* **Frequência Tolerável (FT):** **${L.toFixed(1)}** danos/ano
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
`.trim()}const we=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),Ge={paragraphFontSizePt:11,paragraphLineHeight:1.35,paragraphMarginTopPx:6,paragraphMarginBottomPx:8,listItemMarginTopPx:4,listItemMarginBottomPx:4,listItemExtraMarginBottomPx:10,listMarginTopPx:8,listMarginBottomPx:12,listPaddingLeftPx:18,h2FontSizeRem:1.25,h2MarginTopPx:14,h2MarginBottomPx:10,h3FontSizeRem:1.1,h3MarginTopPx:10,h3MarginBottomPx:8,figureMarginTopPx:10,figureMarginBottomPx:10,emptyLineHeightPx:8},ke=(e,t)=>{if(!e)return"";const F=e.replace(/\\n/g,`
`).split(`
`);let c="",m=!1;for(let n=0;n<F.length;n++){let u=F[n];if(u.trim()===""){m?c+=`<li style="list-style:none;margin:${t.listItemMarginTopPx}px 0 ${t.listItemMarginBottomPx}px"><span style="display:inline-block;height:${t.emptyLineHeightPx}px"></span></li>
`:c+=`<p style="margin:${t.emptyLineHeightPx}px 0 ${t.emptyLineHeightPx}px;font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">&nbsp;</p>
`;continue}const L=r=>{let T=we(r);return T=T.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),T=T.replace(/(^|[^*])\*(?!\*)([^*]+?)\*(?!\*)/g,(y,j,v)=>`${j}<em>${v}</em>`),T};if(u.trim()==="---"){m&&(c+=`</ul>
`,m=!1),c+=`<hr style="border:0;border-top:1px solid #cbd5e1;margin:12px 0"/>
`;continue}const s=u.trim().match(/^!\[(.*?)\]\((.*?)\)$/);if(s){const[,r,T]=s;m&&(c+=`</ul>
`,m=!1);const y=n+1<F.length?F[n+1].trim():"",j=n-1>=0?F[n-1].trim():"",v=/^(Figura|FIGURA)\s*([0-9]+(?:\.[0-9]+)*)[\.:\-]\s*(.*)$/;let M=null;const _=y.match(v),C=j.match(v);_?(M=`Figura ${_[2]} — ${_[3]}`.trim(),n+=1):C?M=`Figura ${C[2]} — ${C[3]}`.trim():r&&r.trim().length>0&&(M=r.trim());const N=M?`<figcaption>${L(M)}</figcaption>`:"";c+=`<figure style="margin:${t.figureMarginTopPx}px 0 ${t.figureMarginBottomPx}px"><img src="${we(T)}" alt="${we(r)}" style="max-width:100%;height:auto;border-radius:4px;border:none;display:inline-block;page-break-inside:avoid"/>${N}</figure>
`;continue}if(u.startsWith("> ")){m&&(c+=`</ul>
`,m=!1);const r=L(u.substring(2));c+=`<p style="margin:${t.paragraphMarginTopPx}px 0 ${t.paragraphMarginBottomPx}px;font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${r}</p>
`;continue}if(u.startsWith("## ")){m&&(c+=`</ul>
`,m=!1),c+=`<h2 style="font-size:${t.h2FontSizeRem}rem;line-height:1.6;font-weight:700;margin:${t.h2MarginTopPx}px 0 ${t.h2MarginBottomPx}px;">${L(u.substring(3))}</h2>
`;continue}if(u.startsWith("### ")){m&&(c+=`</ul>
`,m=!1),c+=`<h3 style="font-size:${t.h3FontSizeRem}rem;line-height:1.5;font-weight:700;margin:${t.h3MarginTopPx}px 0 ${t.h3MarginBottomPx}px;">${L(u.substring(4))}</h3>
`;continue}if(u.trim().startsWith("* ")){m||(c+=`<ul style="margin:${t.listMarginTopPx}px 0 ${t.listMarginBottomPx}px;padding-left:${t.listPaddingLeftPx}px">
`,m=!0);let r=u.trim().substring(2);for(;n+1<F.length&&F[n+1].startsWith("  ");)r+=" "+F[n+1].trim(),n++;const T=r.replace(/\*/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),y=/\bresultado:\b/.test(T),j=/\bcalculo:\b/.test(T),v=/\bformula:\b/.test(T),M=y||j||v?`${Math.max(0,t.listItemMarginTopPx)}px 0 ${t.listItemExtraMarginBottomPx}px`:`${t.listItemMarginTopPx}px 0 ${t.listItemMarginBottomPx}px`,_=/(F[óo]rmula:|C[áa]lculo:|Resultado:)/gi,C="§§",z=r.replace(_,C+"$1").split(C).filter(A=>A.trim().length>0);if(z.length>1||/:\s*$/.test(r.trim())){let A="";for(const D of z){const x=D.replace(/\*/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),K=/\bresultado:\b/.test(x),X=/\bcalculo:\b/.test(x),q=/\bformula:\b/.test(x),W=K||X||q?`${t.paragraphMarginTopPx}px 0 ${t.listItemExtraMarginBottomPx}px`:`${t.paragraphMarginTopPx}px 0 ${t.paragraphMarginBottomPx}px`;A+=`<p style="margin:${W};font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${L(D)}</p>`}c+=`<li style="margin:${M};font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${A}</li>
`}else c+=`<li style="margin:${M};font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${L(r)}</li>
`;continue}if(m&&(c+=`</ul>
`,m=!1),u.trim()){const r=n+1<F.length?F[n+1].trim():"";if(!(/^(Figura|FIGURA)\s*([0-9]+(?:\.[0-9]+)*)[\.:\-]\s*(.*)$/.test(u.trim())&&/^!\[(.*?)\]\((.*?)\)$/.test(r))){const y=/(F[óo]rmula:|C[áa]lculo:|Resultado:)/gi,M=u.replace(y,"§§$1").split("§§").filter(_=>_.trim().length>0);if(M.length>1)for(const _ of M){const C=_.replace(/\*/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),N=/\bresultado:\b/.test(C),z=/\bcalculo:\b/.test(C),A=/\bformula:\b/.test(C),D=N||z||A?`${t.paragraphMarginTopPx}px 0 ${t.listItemExtraMarginBottomPx}px`:`${t.paragraphMarginTopPx}px 0 ${t.paragraphMarginBottomPx}px`;c+=`<p style="margin:${D};font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${L(_)}</p>
`}else{const _=u.replace(/\*/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),C=/\bresultado:\b/.test(_),N=/\bcalculo:\b/.test(_),z=/\bformula:\b/.test(_),A=C||N||z?`${t.paragraphMarginTopPx}px 0 ${t.listItemExtraMarginBottomPx}px`:`${t.paragraphMarginTopPx}px 0 ${t.paragraphMarginBottomPx}px`;c+=`<p style="margin:${A};font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${L(u)}</p>
`}}}}return m&&(c+=`</ul>
`),c};function Bt({data:e,onUpdate:t}){const[a,F]=S.useState(!1),[c,m]=S.useState(""),[n,u]=S.useState(!1),[L,s]=S.useState(22),[r,T]=S.useState(15),[y,j]=S.useState(22),[v,M]=S.useState(6),[_,C]=S.useState(22),[N,z]=S.useState(6),A="report_format_prefs",D=()=>{try{const b=localStorage.getItem(A);if(b){const E=JSON.parse(b);return{...Ge,...E}}}catch{}return Ge},[x]=S.useState(D()),K=async()=>{F(!0),m("");try{const b=await Ct(e);m(b)}finally{F(!1)}},X=async()=>{if(!c)return;const b=ke(c,x),E=c.replace(/\!\[[^\]]*\]\([^\)]*\)/g,"").replace(/^###\s+/gm,"").replace(/^##\s+/gm,"").replace(/\*\*(.*?)\*\*/g,"$1").replace(/^>\s+/gm,"").replace(/\n\n+/g,`

`);try{if(typeof window.ClipboardItem<"u"){const w=new window.ClipboardItem({"text/html":new Blob([b],{type:"text/html"}),"text/plain":new Blob([E],{type:"text/plain"})});await navigator.clipboard.write([w])}else await navigator.clipboard.writeText(E);u(!0),setTimeout(()=>u(!1),2e3)}catch{try{await navigator.clipboard.writeText(E)}catch{}u(!0),setTimeout(()=>u(!1),2e3)}},q=S.useMemo(()=>pt(e),[e.h,e.l,e.w,e.hp,e.ng,e.cd,e.has_electric_line,e.line_sections_1,e.use_adj_structure_1,e.l_adj_1,e.w_adj_1,e.h_adj_1,e.hp_adj_1,e.cd_adj_1,e.has_data_line,e.line_sections_2,e.use_adj_structure_2,e.l_adj_2,e.w_adj_2,e.h_adj_2,e.hp_adj_2,e.cd_adj_2]);S.useMemo(()=>Oe(e.probability_data,e.analyze_data_line_probabilities,e.has_data_line),[e.probability_data,e.analyze_data_line_probabilities,e.has_data_line]);const W=S.useMemo(()=>e.zones.map(b=>{const E=ut(b),w=Oe(b.probability_data||e.probability_data,e.analyze_data_line_probabilities,e.has_data_line),J=xt(w,b),ne=gt(q,J,E,e.selected_risk_components);return{zone:b,lossCalculations:E,riskCalculations:ne}}),[e.zones,q,e.selected_risk_components,e.analyze_data_line_probabilities,e.has_data_line,e.probability_data]);return S.useMemo(()=>ht(W),[W]),i.jsxs("div",{children:[i.jsxs(Ve,{children:[i.jsx(We,{className:"p-3",children:i.jsxs(Ue,{className:"flex items-center justify-between",children:[i.jsxs("div",{className:"flex items-center gap-2",children:[i.jsx(He,{className:"w-5 h-5 text-slate-100"}),"Relatório Técnico Detalhado"]}),c&&!a&&i.jsx(Se,{variant:"outline",size:"icon",onClick:()=>m(""),className:"h-8 w-8 flex-shrink-0",children:i.jsx($t,{className:"w-4 h-4"})})]})}),c&&!a&&i.jsxs("div",{className:"flex justify-end gap-2 px-2 pb-0",children:[i.jsx(Se,{variant:"secondary",size:"sm",onClick:()=>{const b=ke(c,x),E=window.open("","_blank");if(!E)return;const w=Math.max(4,v),J=Math.max(4,N);E.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title></title><style>
@page{margin:${L}mm ${r}mm;}
*{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu; background:#ffffff; color:#111827; margin:0; line-height:1.6;}
main{padding:${w}mm ${r}mm ${J}mm; overflow:visible;}
h2{font-size:${x.h2FontSizeRem}rem; line-height:1.6; color:#0f172a; font-weight:700; margin:${x.h2MarginTopPx}px 0 ${x.h2MarginBottomPx}px; break-inside:avoid; break-after:avoid-page;}
h3{font-size:${x.h3FontSizeRem}rem; line-height:1.5; color:#1f2937; font-weight:700; margin:${x.h3MarginTopPx}px 0 ${x.h3MarginBottomPx}px; break-inside:avoid; break-after:avoid-page;}
ul{margin:${x.listMarginTopPx}px 0 ${x.listMarginBottomPx}px; padding-left:${x.listPaddingLeftPx}px; break-inside:avoid;}
li{break-inside:avoid; font-size:${x.paragraphFontSizePt}pt; line-height:${x.paragraphLineHeight};}
p{margin:${x.paragraphMarginTopPx}px 0 ${x.paragraphMarginBottomPx}px; break-inside:avoid; font-size:${x.paragraphFontSizePt}pt; line-height:${x.paragraphLineHeight};}
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
<\/script></body></html>`),E.document.close(),E.focus(),setTimeout(()=>{try{E.print()}catch{}},300)},children:"Gerar PDF"}),i.jsxs(Se,{variant:"secondary",size:"sm",onClick:X,children:[i.jsx(Pt,{className:"w-4 h-4 mr-2"}),n?"Texto copiado!":"Copiar para Word (formatado)"]})]}),i.jsx(Ze,{className:"text-center px-3 pt-0 pb-3",children:i.jsx(at,{mode:"wait",children:a?i.jsxs(je.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},className:"flex flex-col items-center justify-center min-h-[10rem]",children:[i.jsx(ft,{className:"w-6 h-6 animate-spin text-blue-400"}),i.jsx("p",{className:"mt-3 text-slate-300",children:"Gerando Relatório..."})]},"loading"):c?i.jsx(je.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},className:"text-left pt-4 relative",children:i.jsx("div",{className:"w-full h-[30rem] overflow-y-auto p-5 rounded-lg border border-slate-700/40 bg-slate-900/50 text-[17px] leading-loose tracking-[0.02em] text-slate-100 focus:outline-none prose-styles",dangerouslySetInnerHTML:{__html:ke(c,x)}})},"report"):i.jsx(je.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},children:i.jsxs(Se,{onClick:K,disabled:a,className:"w-full max-w-sm mx-auto my-3",children:[i.jsx(He,{className:"w-4 h-4 mr-2"}),"Gerar Relatório Técnico da Análise de Risco"]})},"initial")})})]}),i.jsxs(Ve,{className:"mt-4 bg-slate-900/80 border-slate-600/60",children:[i.jsx(We,{className:"p-3",children:i.jsxs(Ue,{className:"flex items-start gap-2",children:[i.jsxs("span",{className:"flex items-start gap-2",children:[i.jsx(Rt,{className:"w-5 h-5 text-green-400 flex-shrink-0"}),i.jsx("span",{className:"text-slate-100 text-sm sm:text-base leading-relaxed text-justify",children:"Responsabilidade Técnica e Conferência Final do Relatório"})]}),i.jsx(Ft,{className:"w-5 h-5 text-yellow-400 flex-shrink-0"})]})}),i.jsxs(Ze,{className:"p-4 space-y-4 text-sm text-slate-200",children:[i.jsxs("div",{className:"space-y-2",children:[i.jsxs("p",{children:["A ",i.jsx("strong",{children:"NBR 5419:2025"})," deve ser utilizada como ",i.jsx("strong",{children:"fonte principal"})," para validação dos dados e referência normativa do relatório."]}),i.jsxs("p",{children:["Este aplicativo atua ",i.jsx("strong",{children:"exclusivamente como uma ferramenta de apoio"})," para cálculos e emissão de relatórios, ",i.jsx("strong",{children:"não isentando o usuário"})," de sua responsabilidade legal e técnica quanto à ",i.jsx("strong",{children:"veracidade"}),", ",i.jsx("strong",{children:"precisão"})," e ",i.jsx("strong",{children:"adequação"})," das informações fornecidas."]})]}),i.jsxs("div",{className:"space-y-3",children:[i.jsx("h3",{className:"font-semibold text-slate-100",children:"🤝 Informações de Contato para Negócios com Eng° Júlio Certo"}),i.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-3",children:[i.jsxs("div",{className:"rounded-md border border-slate-700 p-3 bg-slate-800/60",children:[i.jsx("div",{className:"text-xs text-slate-400",children:"Autor do Aplicativo"}),i.jsx("div",{className:"font-medium",children:"Engº Júlio César Certo"})]}),i.jsxs("div",{className:"rounded-md border border-slate-700 p-3 bg-slate-800/60",children:[i.jsx("div",{className:"text-xs text-slate-400",children:"Contato (WhatsApp)"}),i.jsx("div",{className:"font-medium",children:"(35) 9 8811-3746"})]}),i.jsxs("div",{className:"rounded-md border border-slate-700 p-3 bg-slate-800/60",children:[i.jsx("div",{className:"text-xs text-slate-400",children:"E-mail"}),i.jsx("div",{className:"font-medium",children:"julio.certo@hotmail.com"})]})]}),i.jsx("p",{className:"text-sm text-slate-300",children:"Ao utilizar este aplicativo em estudos ou projetos, cite a fonte: Engº Júlio César Certo — Ferramenta de Análise de Risco SPDA NBR 5419."})]})]})]})]})}export{Bt as ReportStep};
