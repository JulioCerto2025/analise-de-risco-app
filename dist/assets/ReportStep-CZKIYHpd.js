import{r as S,j as i,A as at,m as je}from"./motion-CZTIYVKD.js";import{P as ot,t as qe,w as Ae,K as nt,v as it,I as st,R as rt,J as lt,M as ct,N as mt,O as dt,Q as pt,r as Oe,E as ut,s as xt,G as ht,V as gt,C as Ve,a as We,b as Ue,B as Se,e as He}from"./index-CJdsrEYN.js";import{F as Ze,X as $t,n as Pt,L as ft,l as Rt,T as Ft}from"./icons-ggQqh8om.js";import"./react-Bzgz95E1.js";import"./charts-wPg4HxFZ.js";function A(e,t){const a=e.find(P=>String(P.value)===String(t));return a?a.label:`Valor ${t}`}function bt(e){var I,v,T,b,E,y,D,N,j,x,w,H,k,V,_,C,z,J,ne,Ne,le,ce,me,de,pe,ue,xe,he,ge,$e,Pe,fe,Re,Fe,be,_e,l,R,F;const{calculations:t,probability_calculations:a,loss_calculations:P,risk_results:c,frequency_results:m,probability_data:o,zones:p,selected_risk_components:L}=e,s=((I=p[0])==null?void 0:I.loss_data)||{};let r="";r+=`### Etapa — Probabilidade (P)

`,r+=`> Resumo: PC_total = 1 − (1−PC) × (1−PCT); PM_total = 1 − (1−PM) × (1−PMT). Probabilidades nas linhas utilizam PTU/PV/PW/PZ combinadas com PEB/CLD/PLD conforme NBR 5419.

`,r+=`**PA - Danos a seres vivos por choque (Descarga na Estrutura)**
* *Fórmula:* PA = PTA × PB
* *Variáveis:*
    * PTA: **${o.PTA}** (${A(ot,o.PTA)})
    * PB: **${o.PB}** (${A(qe,o.PB)})
* *Cálculo:* PA = ${o.PTA} × ${o.PB}
* *Resultado:* **PA = ${(v=a.PA)==null?void 0:v.toExponential(3)}**

`,r+=`**PB - Danos físicos (Descarga na Estrutura)**
* *Fórmula:* PB = PB
* *Variáveis:*
    * PB (Nível do SPDA): **${o.PB}** (${A(qe,o.PB)})
* *Resultado:* **PB = ${(T=a.PB)==null?void 0:T.toExponential(3)}**

`,e.has_electric_line&&(r+=`**PC - Falha de sistemas (Descarga na Estrutura, Linha Elétrica)**
* *Fórmula:* PC = PSPDₑ × CLDₑ
* *Variáveis:*
    * PSPDₑ: **${o.PSPD_electric}** (${A(Ae,o.PSPD_electric)})
    * CLDₑ_int: **${o.CLD_electric_int}**
    * CLDₑ_ext: **${o.CLD_electric_ext}**
* *Cálculo:* PC = ${o.PSPD_electric} × (CLDₑ conforme configuração)
* *Resultado:* **PC = ${(b=a.PC)==null?void 0:b.toExponential(3)}**

`),e.has_data_line&&(r+=`**PCT - Falha de sistemas (Descarga na Estrutura, Linha de Dados)**
* *Fórmula:* PCT = PSPDₐ × CLDₐ
* *Variáveis:*
    * PSPDₐ: **${o.PSPD_data}** (${A(Ae,o.PSPD_data)})
    * CLDₐ_int: **${o.CLD_data_int}**
    * CLDₐ_ext: **${o.CLD_data_ext}**
* *Cálculo:* PCT = ${o.PSPD_data} × (CLDₐ conforme configuração)
* *Resultado:* **PCT = ${(E=a.PCT)==null?void 0:E.toExponential(3)}**

`),e.has_electric_line&&(r+=`**PM - Falha de sistemas (Descarga Próxima, Linha Elétrica)**
* *Fórmula:* PM = PSPDₑ × (Ks1 × Ks2 × Ks3ₑ × Ks4ₑ)²
* *Variáveis:*
    * PSPDₑ: **${o.PSPD_electric}** (${A(Ae,o.PSPD_electric)})
    * Ks1 (Malha wm1=${o.wm1}m): **${(y=a.Ks1)==null?void 0:y.toFixed(3)}**
    * Ks2 (Malha wm2=${o.wm2}m): **${(D=a.Ks2)==null?void 0:D.toFixed(3)}**
    * Ks3ₑ: **${o.Ks3_electric_int}** (${A(nt,o.Ks3_electric_int)})
    * Ks4ₑ (Uw=${o.Uw_electric_int}kV): **${(N=a.Ks4_electric)==null?void 0:N.toFixed(3)}**
* *Cálculo:* PM = ${o.PSPD_electric} × (${(j=a.Ks1)==null?void 0:j.toFixed(3)} × ${(x=a.Ks2)==null?void 0:x.toFixed(3)} × ${o.Ks3_electric_int} × ${(w=a.Ks4_electric)==null?void 0:w.toFixed(3)})²
* *Resultado:* **PM = ${(H=a.PM)==null?void 0:H.toExponential(3)}**

`),e.has_electric_line&&(r+=`**PU - Danos a seres vivos por choque (Descarga na Linha Elétrica)**
* *Fórmula:* PU = PTU × PEB × PLD × CLD
* *Variáveis:*
    * PTU: **${o.PTU_electric}** (${A(it,o.PTU_electric)})
    * PEB: **${o.PEB_electric}** (${A(Ae,o.PEB_electric)})
    * PLD (ext): **${(k=o.PLD_electric_ext)==null?void 0:k.toFixed(2)}**
    * CLD (ext): **${o.CLD_electric_ext}**
* *Cálculo:* PU = ${o.PTU_electric} × ${o.PEB_electric} × ${(V=o.PLD_electric_ext)==null?void 0:V.toFixed(2)} × ${o.CLD_electric_ext}
* *Resultado:* **PU = ${(_=a.PU)==null?void 0:_.toExponential(3)}**

`),r+=`### Etapa — Perdas Consequentes (L) — ${(C=p[0])==null?void 0:C.name}

`,r+=`> Resumo: LA (choque), LB (incêndio/pânico) e LC (falha de sistemas) usam fatores normativos (rt, rp, rf, hz, LO) e a fração de tempo/pessoas na zona (tz, nz/nt). Demais perdas usam equivalências LU=LA, LV=LB, LM=LW=LZ=LC.

`,r+=`**LA - Perda por choque elétrico**
* *Fórmula:* LA = rt × 0.01 × (nz / nt) × (tz / 8760) × rs
* *Variáveis:*
    * rt (Resist. Piso): **${s.rt}** (${A(st,s.rt)})
    * nz (Pessoas na Zona): **${s.nz}**
    * nt (Pessoas Total): **${s.nt}**
    * tz (Tempo na Zona): **${s.tz}** h/ano
    * rs (Tipo Estrutura): **${s.rs}** (${s.rs===1?"Robusta":"Simples"})
* *Cálculo:* LA = ${s.rt} × 0.01 × (${s.nz} / ${s.nt}) × (${s.tz} / 8760) × ${s.rs}
* *Resultado:* **LA = ${(z=P.LA)==null?void 0:z.toExponential(3)}**

`,r+=`**LB - Perda por danos físicos (incêndio)**
* *Fórmula:* LB = rs × rp × rf × hz × LF × (nz / nt) × (tz / 8760)
* *Variáveis:*
    * rs (Tipo Estrutura): **${s.rs}** (${s.rs===1?"Robusta":"Simples"})
    * rp (Prot. Incêndio): **${s.rp}** (${A(rt,s.rp)})
    * rf (Risco Incêndio): **${s.rf}** (${A(lt,s.rf)})
    * hz (Pânico): **${s.hz}** (${A(ct,s.hz)})
    * LF (Tipo Dano): **${s.LF}** (${A(mt,s.LF)})
    * nz, nt, tz: **${s.nz}**, **${s.nt}**, **${s.tz}**
* *Cálculo:* LB = ${s.rs} × ${s.rp} × ${s.rf} × ${s.hz} × ${s.LF} × (${s.nz} / ${s.nt}) × (${s.tz} / 8760)
* *Resultado:* **LB = ${(J=P.LB)==null?void 0:J.toExponential(3)}**

`,r+=`**LC - Perda por falha de sistemas**
* *Fórmula:* LC = LO × (nz / nt) × (tz / 8760) × rs
* *Variáveis:*
    * LO (Tipo Falha): **${s.LO}** (${A(dt,s.LO)})
    * nz, nt, tz, rs: **${s.nz}**, **${s.nt}**, **${s.tz}**, **${s.rs}**
* *Cálculo:* LC = ${s.LO} × (${s.nz} / ${s.nt}) × (${s.tz} / 8760) × ${s.rs}
* *Resultado:* **LC = ${(ne=P.LC)==null?void 0:ne.toExponential(3)}**

`,r+=`**Demais Perdas:** LU=LA, LV=LB, LM=LW=LZ=LC.

`,r+=`### Etapa — Componentes de Risco (R)

`;const M=Object.entries(L).filter(([,h])=>h).map(([h])=>{const n={RA:"RA = Nd × PA × LA",RB:"RB = Nd × PB × LB",RC:"RC = Nd × PC × LC",RM:"RM = Nm × PM × LM",RU:"RU = Nl × PU × LU",RV:"RV = Nl × PV × LV",RW:"RW = Nl × PW × LW",RZ:"RZ = Ni × PZ × LZ"},W=c[h];return`* **${h}:** ${n[h]||"N/A"} -> Resultado: **${W==null?void 0:W.toExponential(3)}**`}).join(`
`);r+=M+`

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
* *Resultado:* **FV = ${(he=m.FV)==null?void 0:he.toExponential(3)}**

`),m.FW&&(r+=`**FW - Danos por surto na linha**
* *Fórmula:* FW = Nlₑ × PW + Nlₐ × PWT
* *Cálculo:* FW = (${(ge=t.nl_electric)==null?void 0:ge.toExponential(3)} × ${($e=a.PW)==null?void 0:$e.toExponential(3)}) + (${(Pe=t.nl_data)==null?void 0:Pe.toExponential(3)} × ${(fe=a.PWT)==null?void 0:fe.toExponential(3)})
* *Resultado:* **FW = ${(Re=m.FW)==null?void 0:Re.toExponential(3)}**

`),m.FZ&&(r+=`**FZ - Danos por surto induzido na linha**
* *Fórmula:* FZ = Niₑ × PZ + Niₐ × PZT
* *Cálculo:* FZ = (${(Fe=t.ni_electric)==null?void 0:Fe.toExponential(3)} × ${(be=a.PZ)==null?void 0:be.toExponential(3)}) + (${(_e=t.ni_data)==null?void 0:_e.toExponential(3)} × ${(l=a.PZT)==null?void 0:l.toExponential(3)})
* *Resultado:* **FZ = ${(R=m.FZ)==null?void 0:R.toExponential(3)}**

`);const B=[];return e.frequency_config.has_equipment_in_ZPR0A&&B.push("FB"),B.push("FC","FM","FV","FW","FZ"),r+=`**F - Frequência Total de Danos**
* *Fórmula:* F = ${B.join(" + ")}
* *Cálculo:* F = ${B.map(h=>{var n;return((n=m[h])==null?void 0:n.toExponential(3))||0}).join(" + ")}
* *Resultado:* **F = ${(F=m.F)==null?void 0:F.toExponential(3)}**

`,r}async function _t(e){var le,ce,me,de,pe,ue,xe,he,ge,$e,Pe,fe,Re,Fe,be,_e;const{calculations:t,risk_results:a,frequency_results:P}=e,c={dados:1,parametros:2,calculos:3,resultados:4,parecer:5},m=bt(e),o=l=>{var te,Y;const R=Object.entries(l.risks_to_analyze).filter(([,u])=>u).map(([u])=>u),F={R1:1e-5,R3:.001,R4:.001},h=[];R.forEach(u=>{const q=l.risk_results[u]||0,O=F[u];q>O&&h.push(u)});const n=l.frequency_config.is_critical_system?.1:1,W=(((te=l.frequency_results)==null?void 0:te.F)||0)>n,U=["RA","RB","RC","RM","RU","RV","RW","RZ"].map(u=>({k:u,v:l.risk_results[u]||0})).sort((u,q)=>q.v-u.v).slice(0,2).map(u=>{var q;return`${String(u.k)} (${(q=u.v)==null?void 0:q.toExponential(2)})`}).join(", "),Z=`Este parecer foi elaborado com base na NBR 5419, considerando os riscos selecionados (${R.join(", ")||"nenhum"}) e a frequência de danos aos sistemas.`,Ce=`Frequência de Danos (F): **${(((Y=l.frequency_results)==null?void 0:Y.F)||0).toExponential(3)}**; Limite (FT): **${n.toFixed(1)}** → ${W?"**NÃO ACEITÁVEL**":"**ACEITÁVEL**"}.`,G=R.length?`Riscos totais: ${R.map(u=>`**${u}=${(l.risk_results[u]||0).toExponential(3)}** (RT=${F[u].toExponential(1)})`).join("; ")}.`:"Nenhum risco foi selecionado para análise próxima.",K=`Componentes dominantes observados: ${U}.`,se=`Recomendações prioritárias:
* Adequar o nível do SPDA (captores, descidas, aterramento) para reduzir PA/PB e efeitos de descargas na estrutura.
* Coordenar DPS (classes I/II/III) em entradas e quadros, nas linhas elétrica e de dados, para reduzir PC/PM e perdas associadas (RC, RM, FC, FM).
* Reforçar malhas de aterramento e equipotencialização, interligando elementos metálicos e melhorando conexões, reduzindo tensões de passo/toque (impacto em LA/LC).
* Otimizar blindagens/roteamento de cabos e separação física, diminuindo acoplamentos (RW/RZ).
* Revisar parâmetros de ocupação e medidas internas (rf, hz, LO) e rotinas operacionais em zonas críticas.`,X=h.length||W?`Conclusão: Há itens **NÃO ACEITÁVEIS** (${[...h,W?"F":null].filter(Boolean).join(", ")}). Recomenda-se implementar as medidas acima e reprocessar a análise para verificar a redução dos componentes dominantes e a conformidade com os limites.`:"Conclusão: Todos os itens analisados estão **ACEITÁVEIS** frente aos limites. Recomenda-se manter as medidas propostas, documentação e manutenção periódica do sistema.";return[Z,Ce,G,K,se,X].join(`

`)},p=Object.entries(e.risks_to_analyze).filter(([,l])=>l).map(([l],R)=>{var G,K,se,X,te,Y,u,q,O;const F=a[l]||0,h={R1:1e-5,R3:.001,R4:.001}[l]||0,n=F<=h,W={R1:"Perda de Vidas Humanas",R3:"Perda de Patrimônio Cultural",R4:"Perda de Valor Econômico"}[l],ie=n?"🟢 ✅":"🔴 ❌",f=e.selected_risk_components;let U="",Z="";if(l==="R1"){const g=[],d=[];f.RA&&(g.push("RA"),d.push(`${(G=a.RA)==null?void 0:G.toExponential(3)}`)),f.RB&&(g.push("RB"),d.push(`${(K=a.RB)==null?void 0:K.toExponential(3)}`)),f.RC&&(g.push("RC"),d.push(`${(se=a.RC)==null?void 0:se.toExponential(3)}`)),f.RM&&(g.push("RM"),d.push(`${(X=a.RM)==null?void 0:X.toExponential(3)}`)),f.RU&&(g.push("RU"),d.push(`${((a.RU||0)+(a.RUT||0)).toExponential(3)}`)),f.RV&&(g.push("RV"),d.push(`${((a.RV||0)+(a.RVT||0)).toExponential(3)}`)),f.RW&&(g.push("RW"),d.push(`${((a.RW||0)+(a.RWT||0)).toExponential(3)}`)),f.RZ&&(g.push("RZ"),d.push(`${((a.RZ||0)+(a.RZT||0)).toExponential(3)}`)),U=g.join(" + "),Z=`${d.join(" + ")} = ${F.toExponential(3)}`}else if(l==="R3"){const g=[],d=[];f.RB&&(g.push("RB3"),d.push(`${(te=a.RB3)==null?void 0:te.toExponential(3)}`)),f.RV&&(g.push("RV3"),d.push(`${((a.RV3||0)+(a.RVT3||0)).toExponential(3)}`)),U=g.join(" + "),Z=`${d.join(" + ")} = ${F.toExponential(3)}`}else if(l==="R4"){const g=[],d=[];f.RA&&(g.push("RA4"),d.push(`${(Y=a.RA4)==null?void 0:Y.toExponential(3)}`)),f.RB&&(g.push("RB4"),d.push(`${(u=a.RB4)==null?void 0:u.toExponential(3)}`)),f.RC&&(g.push("RC4"),d.push(`${(q=a.RC4)==null?void 0:q.toExponential(3)}`)),f.RM&&(g.push("RM4"),d.push(`${(O=a.RM4)==null?void 0:O.toExponential(3)}`)),f.RU&&(g.push("RU4"),d.push(`${((a.RU4||0)+(a.RUT4||0)).toExponential(3)}`)),f.RV&&(g.push("RV4"),d.push(`${((a.RV4||0)+(a.RVT4||0)).toExponential(3)}`)),f.RW&&(g.push("RW4"),d.push(`${((a.RW4||0)+(a.RWT4||0)).toExponential(3)}`)),f.RZ&&(g.push("RZ4"),d.push(`${((a.RZ4||0)+(a.RZT4||0)).toExponential(3)}`)),U=g.join(" + "),Z=`${d.join(" + ")} = ${F.toExponential(3)}`}const Ce=U?`
* *Composição (${l}):* ${U}
* *Cálculo:* ${Z}`:"";return`### ${c.resultados}.${R+1}. Risco ${l} - ${W}
* **Risco Total Calculado (${l}):** **${F.toExponential(3)}**
* **Risco Tolerável (RT):** **${h.toExponential(1)}**
* **Resultado:** ${ie} O risco ${l} é **${n?"ACEITÁVEL":"NÃO ACEITÁVEL"}**.${Ce}`}).join(`

`),L=e.frequency_config.is_critical_system?.1:1,s=(P.F||0)<=L,r=s?"🟢 ✅":"🔴 ❌",M=l=>{try{return btoa(unescape(encodeURIComponent(l)))}catch{return""}},B=(l,R,F=720,h=300,n)=>{const ie=n!=null&&n.showLegend?72:48,f=44,U=8,Z=R.length,Ce=F-80,G=h-ie-f,K=Math.max(10,Math.floor((Ce-(Z-1)*U)/Z)),se=typeof(n==null?void 0:n.toleranceLine)=="number"?Math.max(n.toleranceLine,0):0,X=$=>Math.log10(Math.max($,1e-12)),te=[...R.map($=>$.value),se].filter($=>$>0),Y=Math.max(...te.map($=>X($))),u=Math.min(...R.map($=>X($.value))),q=(n==null?void 0:n.barColor)||"#60A5FA",O=n==null?void 0:n.barColors,g=(n==null?void 0:n.bg)||"#FFFFFF",d="#111827",Ke="#475569",ze=typeof(n==null?void 0:n.labelAngle)=="number"?n.labelAngle:-35,Xe=`
  <defs>
    <filter id="glowGreen" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="3.2" flood-color="#10B981" flood-opacity="0.45"/>
    </filter>
    <filter id="glowRed" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="3.2" flood-color="#EF4444" flood-opacity="0.45"/>
    </filter>
  </defs>`;let Te="";R.forEach(($,re)=>{const ae=40+re*(K+U),Ee=(X($.value)-u)/Math.max(Y-u,1e-6),oe=Math.max(2,Math.floor(Ee*G)),Q=ie+(G-oe),Le=$.value.toExponential(2),ee=O?O[re%O.length]:q,ye=h-f+18,Be=ae+K/2,ve=ee==="#CBD5E1",Me=$.name==="R Total"||$.name==="F Total",Ye=ve?' stroke="#94a3b8" stroke-width="1" stroke-dasharray="2 2" fill-opacity="0.25"':Me?` stroke="${ee==="#10B981"?"#065f46":ee==="#EF4444"?"#7f1d1d":"#334155"}" stroke-width="3"`:"",Qe=Me?5:3,et=Me?12:10,tt=Me?"700":"400";Te+=`
  <rect x="${ae}" y="${Q}" width="${K}" height="${oe}" fill="${ee}" rx="${Qe}"${Ye}${Me?ee==="#10B981"?' filter="url(#glowGreen)"':' filter="url(#glowRed)"':""} />`,Te+=`
  <text x="${Be}" y="${ye}" fill="${d}" font-size="11" text-anchor="${ze<0?"end":ze>0?"start":"middle"}" transform="rotate(${ze} ${Be} ${ye})">${$.name}</text>`,Te+=`
  <text x="${ae+K/2}" y="${Q-6}" fill="${d}" font-size="${et}" font-weight="${tt}" text-anchor="middle">${Le}</text>`});let Ie="";if(typeof(n==null?void 0:n.toleranceLine)=="number"){const $=Math.max(n.toleranceLine,1e-12),re=(X($)-u)/Math.max(Y-u,1e-6),ae=Math.min(1,Math.max(0,re)),Ee=Math.max(2,Math.floor(ae*G)),oe=ie+(G-Ee);Ie=`
  <line x1="40" y1="${oe}" x2="${F-40}" y2="${oe}" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 3" />`}let De="";if(!!(n!=null&&n.showLegend)&&O&&R.length){const $=typeof(n==null?void 0:n.legendBoxSize)=="number"?Math.max(6,n.legendBoxSize):10,re=typeof(n==null?void 0:n.legendColGap)=="number"?Math.max(2,n.legendColGap):8,ae=typeof(n==null?void 0:n.legendRowGap)=="number"?Math.max(2,n.legendRowGap):8,Ee=typeof(n==null?void 0:n.legendFontSize)=="number"?Math.max(8,n.legendFontSize):11,oe=Math.min(F-40,Math.max(120,(n==null?void 0:n.legendMaxWidth)||F-40));let Q=40,Le=46;R.forEach((ee,ye)=>{const Be=O[ye%O.length],ve=Math.min(160,Math.max(40,ee.name.length*7));Q+$+4+ve>oe&&(Q=40,Le+=$+ae),De+=`
  <rect x="${Q}" y="${Le}" width="${$}" height="${$}" fill="${Be}" rx="2" />`,De+=`
  <text x="${Q+$+6}" y="${Le+$-1}" fill="${d}" font-size="${Ee}">${ee.name}</text>`,Q+=$+6+ve+re})}const Je=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${F}" height="${h}" viewBox="0 0 ${F} ${h}">
  ${Xe}
  <rect x="0" y="0" width="${F}" height="${h}" fill="${g}"/>
  <text x="40" y="24" fill="${d}" font-size="14" font-weight="bold">${l}</text>
  ${De}
  <line x1="40" y1="${h-f}" x2="${F-40}" y2="${h-f}" stroke="${Ke}" stroke-width="1"/>
  ${Ie}
  ${Te}
</svg>`;return`data:image/svg+xml;base64,${M(Je)}`},v=["RA","RB","RC","RM","RU","RV","RW","RZ"].map(l=>({name:l,value:e.risk_results[l]||1e-12,active:!!e.selected_risk_components[l]})),T=e.risks_to_analyze.R1?"R1":e.risks_to_analyze.R3?"R3":e.risks_to_analyze.R4?"R4":"R1",b=e.risk_results[T]||0,E=[...v.map(l=>({name:l.name,value:l.value})),{name:"R Total",value:b}],y=Object.entries(e.frequency_results||{}).filter(([l])=>l!=="F").map(([l,R])=>({name:l,value:R||0})),D=["#60A5FA","#A78BFA","#F472B6","#FB7185","#F59E0B","#34D399","#22D3EE","#93C5FD"],N="#CBD5E1",j=e.risks_to_analyze.R1?1e-5:e.risks_to_analyze.R3||e.risks_to_analyze.R4?.001:1e-5,w=b<=j?"#10B981":"#EF4444",H=E.map((l,R)=>{var h;return l.name==="R Total"?w:((h=v[R])==null?void 0:h.active)?D[R%D.length]:N}),k=["#F87171","#60A5FA","#A78BFA","#34D399","#F59E0B","#FB7185","#64748B"],V=B("Componentes de Risco — Global",E,720,300,{barColors:H,labelAngle:-30,legendMaxWidth:420,toleranceLine:j}),_=[...y,{name:"F Total",value:((le=e.frequency_results)==null?void 0:le.F)||0}],C=(((ce=e.frequency_results)==null?void 0:ce.F)||0)<=L,z="#CBD5E1",J=_.map((l,R)=>{if(l.name==="F Total")return C?"#10B981":"#EF4444";const F=k[R%k.length];return(l.value||0)>0?F:z}),ne=B("Frequência de Danos — Global",_,720,280,{barColors:J,labelAngle:-40,legendFontSize:10,legendMaxWidth:500,toleranceLine:L});return`
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
* **Linha de Dados (Al2, Ai2):** **Al2 = ${(he=t.al2)==null?void 0:he.toFixed(2)} m²**, **Ai2 = ${(ge=t.ai2)==null?void 0:ge.toFixed(2)} m²**

### ${c.calculos}.2. Frequência Média Anual de Eventos Danosos (N)
* **Nd:** Nd = Ng × Adf × Cd × 10⁻⁶ → **${($e=t.nd)==null?void 0:$e.toExponential(3)}** eventos/ano
* **Nm:** Nm = Ng × Am × 10⁻⁶ → **${(Pe=t.nm)==null?void 0:Pe.toExponential(3)}** eventos/ano
* **Nl/ Ni (Elétrica):** **Nl = ${(fe=t.nl_electric)==null?void 0:fe.toExponential(3)}**, **Ni = ${(Re=t.ni_electric)==null?void 0:Re.toExponential(3)}** eventos/ano
* **Nl/ Ni (Dados):** **Nl = ${(Fe=t.nl_data)==null?void 0:Fe.toExponential(3)}**, **Ni = ${(be=t.ni_data)==null?void 0:be.toExponential(3)}** eventos/ano

${m}

## ${c.resultados}. RESULTADOS E CONCLUSÕES

${p}

### Figura 1 — Componentes de Risco — Global
![Componentes de Risco — Global](${V})


### ${c.resultados}.${Object.values(e.risks_to_analyze).filter(l=>l).length+1}. Frequência de Danos aos Sistemas (F)
* **Frequência Calculada (F):** **${(_e=P.F)==null?void 0:_e.toExponential(3)}** danos/ano
* **Frequência Tolerável (FT):** **${L.toFixed(1)}** danos/ano
* **Resultado:** ${r} A frequência F é **${s?"ACEITÁVEL":"NÃO ACEITÁVEL"}**.

### Figura 2 — Frequência de Danos — Global
![Frequência de Danos — Global](${ne})

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
`.trim()}const we=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),Ge={paragraphFontSizePt:11,paragraphLineHeight:1.35,paragraphMarginTopPx:6,paragraphMarginBottomPx:8,listItemMarginTopPx:4,listItemMarginBottomPx:4,listItemExtraMarginBottomPx:10,blockMarginBetweenItemsPx:20,listMarginTopPx:8,listMarginBottomPx:12,listPaddingLeftPx:18,h2FontSizeRem:1.25,h2MarginTopPx:14,h2MarginBottomPx:10,h3FontSizeRem:1.1,h3MarginTopPx:10,h3MarginBottomPx:8,figureMarginTopPx:10,figureMarginBottomPx:10,emptyLineHeightPx:20},ke=(e,t)=>{if(!e)return"";const P=e.replace(/\\n/g,`
`).split(`
`);let c="",m=!1;for(let o=0;o<P.length;o++){let p=P[o];if(p.trim()===""){m?c+=`<li style="list-style:none;margin:${t.listItemMarginTopPx}px 0 ${t.listItemMarginBottomPx}px"><span style="display:inline-block;height:${t.emptyLineHeightPx}px"></span></li>
`:c+=`<p style="margin:${t.emptyLineHeightPx}px 0 ${t.emptyLineHeightPx}px;font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">&nbsp;</p>
`;continue}if(/^\s*\*+\s*$/.test(p))continue;const L=r=>{let M=we(r);return M=M.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),M=M.replace(/(^|[^*])\*(?!\*)([^*]+?)\*(?!\*)/g,(B,I,v)=>`${I}<em>${v}</em>`),M};if(p.trim()==="---"){m&&(c+=`</ul>
`,m=!1),c+=`<hr style="border:0;border-top:1px solid #cbd5e1;margin:12px 0"/>
`;continue}const s=p.trim().match(/^!\[(.*?)\]\((.*?)\)$/);if(s){const[,r,M]=s;m&&(c+=`</ul>
`,m=!1);const B=o+1<P.length?P[o+1].trim():"",I=o-1>=0?P[o-1].trim():"",v=/^(Figura|FIGURA)\s*([0-9]+(?:\.[0-9]+)*)[\.:\-]\s*(.*)$/;let T=null;const b=B.match(v),E=I.match(v);b?(T=`Figura ${b[2]} — ${b[3]}`.trim(),o+=1):E?T=`Figura ${E[2]} — ${E[3]}`.trim():r&&r.trim().length>0&&(T=r.trim());const y=T?`<figcaption>${L(T)}</figcaption>`:"";c+=`<figure style="margin:${t.figureMarginTopPx}px 0 ${t.figureMarginBottomPx}px"><img src="${we(M)}" alt="${we(r)}" style="max-width:100%;height:auto;border-radius:4px;border:none;display:inline-block;page-break-inside:avoid"/>${y}</figure>
`;continue}if(p.startsWith("> ")){m&&(c+=`</ul>
`,m=!1);const r=L(p.substring(2));c+=`<p style="margin:${t.paragraphMarginTopPx}px 0 ${t.paragraphMarginBottomPx}px;font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${r}</p>
`;continue}if(p.startsWith("## ")){m&&(c+=`</ul>
`,m=!1),c+=`<h2 style="font-size:${t.h2FontSizeRem}rem;line-height:1.6;font-weight:700;margin:${t.h2MarginTopPx}px 0 ${t.h2MarginBottomPx}px;">${L(p.substring(3))}</h2>
`;continue}if(p.startsWith("### ")){m&&(c+=`</ul>
`,m=!1),c+=`<h3 style="font-size:${t.h3FontSizeRem}rem;line-height:1.5;font-weight:700;margin:${t.h3MarginTopPx}px 0 ${t.h3MarginBottomPx}px;">${L(p.substring(4))}</h3>
`;continue}if(p.trim().startsWith("* ")){m||(c+=`<ul style="margin:${t.listMarginTopPx}px 0 ${t.listMarginBottomPx}px;padding-left:${t.listPaddingLeftPx}px">
`,m=!0);let r=p.trim().substring(2);for(;o+1<P.length&&P[o+1].startsWith("  ");)r+=" "+P[o+1].trim(),o++;const M=r.replace(/\*/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),B=/\bresultado:\b/.test(M),I=/\bcalculo:\b/.test(M),v=/\bformula:\b/.test(M),T=/^\*\*[^*]+?\*\*:/.test(r.trim()),b=T?t.blockMarginBetweenItemsPx:Math.max(0,t.listItemMarginTopPx),E=T||B||I||v?t.blockMarginBetweenItemsPx:t.listItemMarginBottomPx,y=`${b}px 0 ${E}px`,D=/(F[óo]rmula:|C[áa]lculo:|Resultado:)/gi,N="§§",x=r.replace(D,N+"$1").split(N).filter(w=>w.trim().length>0);if(x.length>1||/:\s*$/.test(r.trim())){let w="";for(const H of x){const k=H.replace(/\*/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),V=/\bresultado:\b/.test(k),_=/\bcalculo:\b/.test(k),C=/\bformula:\b/.test(k),z=V||_||C?`${t.paragraphMarginTopPx}px 0 ${t.listItemExtraMarginBottomPx}px`:`${t.paragraphMarginTopPx}px 0 ${t.paragraphMarginBottomPx}px`;w+=`<p style="margin:${z};font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${L(H)}</p>`,V&&(w+=`<p style="margin:0;height:${t.emptyLineHeightPx}px;line-height:0">&nbsp;</p>`)}c+=`<li style="margin:${y};font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${w}</li>
`}else c+=`<li style="margin:${y};font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${L(r)}</li>
`;continue}if(m&&(c+=`</ul>
`,m=!1),p.trim()){const r=o+1<P.length?P[o+1].trim():"";if(!(/^(Figura|FIGURA)\s*([0-9]+(?:\.[0-9]+)*)[\.:\-]\s*(.*)$/.test(p.trim())&&/^!\[(.*?)\]\((.*?)\)$/.test(r))){const B=/(F[óo]rmula:|C[áa]lculo:|Resultado:)/gi,T=p.replace(B,"§§$1").split("§§").filter(b=>b.trim().length>0);if(T.length>1)for(const b of T){const E=b.replace(/\*/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),y=/\bresultado:\b/.test(E),D=/\bcalculo:\b/.test(E),N=/\bformula:\b/.test(E),j=y||D||N?`${t.paragraphMarginTopPx}px 0 ${t.listItemExtraMarginBottomPx}px`:`${t.paragraphMarginTopPx}px 0 ${t.paragraphMarginBottomPx}px`;c+=`<p style="margin:${j};font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${L(b)}</p>
`,y&&(c+=`<p style="margin:0;height:${t.emptyLineHeightPx}px;line-height:0">&nbsp;</p>
`)}else{const b=p.replace(/\*/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),E=/\bresultado:\b/.test(b),y=/\bcalculo:\b/.test(b),D=/\bformula:\b/.test(b),N=E||y||D?`${t.paragraphMarginTopPx}px 0 ${t.listItemExtraMarginBottomPx}px`:`${t.paragraphMarginTopPx}px 0 ${t.paragraphMarginBottomPx}px`;c+=`<p style="margin:${N};font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${L(p)}</p>
`,E&&(c+=`<p style="margin:0;height:${t.emptyLineHeightPx}px;line-height:0">&nbsp;</p>
`);const j=o+1<P.length&&P[o+1].trim().startsWith("* ");!E&&j&&(c+=`<p style="margin:0;height:${t.emptyLineHeightPx}px;line-height:0">&nbsp;</p>
`)}}}}return m&&(c+=`</ul>
`),c};function At({data:e,onUpdate:t}){const[a,P]=S.useState(!1),[c,m]=S.useState(""),[o,p]=S.useState(!1),[L,s]=S.useState(22),[r,M]=S.useState(15),[B,I]=S.useState(22),[v,T]=S.useState(6),[b,E]=S.useState(22),[y,D]=S.useState(6),N="report_format_prefs",j=()=>{try{const _=localStorage.getItem(N);if(_){const C=JSON.parse(_);return{...Ge,...C}}}catch{}return Ge},[x]=S.useState(j()),w=async()=>{P(!0),m("");try{const _=await _t(e);m(_)}finally{P(!1)}},H=async()=>{if(!c)return;const _=ke(c,x),C=c.replace(/\!\[[^\]]*\]\([^\)]*\)/g,"").replace(/^###\s+/gm,"").replace(/^##\s+/gm,"").replace(/\*\*(.*?)\*\*/g,"$1").replace(/^>\s+/gm,"").replace(/\n\n+/g,`

`);try{if(typeof window.ClipboardItem<"u"){const z=new window.ClipboardItem({"text/html":new Blob([_],{type:"text/html"}),"text/plain":new Blob([C],{type:"text/plain"})});await navigator.clipboard.write([z])}else await navigator.clipboard.writeText(C);p(!0),setTimeout(()=>p(!1),2e3)}catch{try{await navigator.clipboard.writeText(C)}catch{}p(!0),setTimeout(()=>p(!1),2e3)}},k=S.useMemo(()=>pt(e),[e.h,e.l,e.w,e.hp,e.ng,e.cd,e.has_electric_line,e.line_sections_1,e.use_adj_structure_1,e.l_adj_1,e.w_adj_1,e.h_adj_1,e.hp_adj_1,e.cd_adj_1,e.has_data_line,e.line_sections_2,e.use_adj_structure_2,e.l_adj_2,e.w_adj_2,e.h_adj_2,e.hp_adj_2,e.cd_adj_2]);S.useMemo(()=>Oe(e.probability_data,e.analyze_data_line_probabilities,e.has_data_line),[e.probability_data,e.analyze_data_line_probabilities,e.has_data_line]);const V=S.useMemo(()=>e.zones.map(_=>{const C=ut(_),z=Oe(_.probability_data||e.probability_data,e.analyze_data_line_probabilities,e.has_data_line),J=xt(z,_),ne=ht(k,J,C,e.selected_risk_components);return{zone:_,lossCalculations:C,riskCalculations:ne}}),[e.zones,k,e.selected_risk_components,e.analyze_data_line_probabilities,e.has_data_line,e.probability_data]);return S.useMemo(()=>gt(V),[V]),i.jsxs("div",{children:[i.jsxs(Ve,{children:[i.jsx(We,{className:"p-3",children:i.jsxs(Ue,{className:"flex items-center justify-between",children:[i.jsxs("div",{className:"flex items-center gap-2",children:[i.jsx(Ze,{className:"w-5 h-5 text-slate-100"}),"Relatório Técnico Detalhado"]}),c&&!a&&i.jsx(Se,{variant:"outline",size:"icon",onClick:()=>m(""),className:"h-8 w-8 flex-shrink-0",children:i.jsx($t,{className:"w-4 h-4"})})]})}),c&&!a&&i.jsxs("div",{className:"flex justify-end gap-2 px-2 pb-0",children:[i.jsx(Se,{variant:"secondary",size:"sm",onClick:()=>{const _=ke(c,x),C=window.open("","_blank");if(!C)return;const z=Math.max(4,v),J=Math.max(4,y);C.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title></title><style>
@page{margin:${L}mm ${r}mm;}
*{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu; background:#ffffff; color:#111827; margin:0; line-height:1.6;}
main{padding:${z}mm ${r}mm ${J}mm; overflow:visible;}
h2{font-size:${x.h2FontSizeRem}rem; line-height:1.6; color:#0f172a; font-weight:700; margin:${x.h2MarginTopPx}px 0 ${x.h2MarginBottomPx}px; break-inside:avoid; break-after:avoid-page;}
h3{font-size:${x.h3FontSizeRem}rem; line-height:1.5; color:#1f2937; font-weight:700; margin:${x.h3MarginTopPx}px 0 ${x.h3MarginBottomPx}px; break-inside:avoid; break-after:avoid-page;}
ul{margin:${x.listMarginTopPx}px 0 ${x.listMarginBottomPx}px; padding-left:${x.listPaddingLeftPx}px; break-inside:avoid;}
li{break-inside:avoid; font-size:${x.paragraphFontSizePt}pt; line-height:${x.paragraphLineHeight};}
p{margin:${x.paragraphMarginTopPx}px 0 ${x.paragraphMarginBottomPx}px; break-inside:avoid; font-size:${x.paragraphFontSizePt}pt; line-height:${x.paragraphLineHeight};}
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
<\/script></body></html>`),C.document.close(),C.focus(),setTimeout(()=>{try{C.print()}catch{}},300)},children:"Gerar PDF"}),i.jsxs(Se,{variant:"secondary",size:"sm",onClick:H,children:[i.jsx(Pt,{className:"w-4 h-4 mr-2"}),o?"Texto copiado!":"Copiar para Word (formatado)"]})]}),i.jsx(He,{className:"text-center px-3 pt-0 pb-3",children:i.jsx(at,{mode:"wait",children:a?i.jsxs(je.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},className:"flex flex-col items-center justify-center min-h-[10rem]",children:[i.jsx(ft,{className:"w-6 h-6 animate-spin text-blue-400"}),i.jsx("p",{className:"mt-3 text-slate-300",children:"Gerando Relatório..."})]},"loading"):c?i.jsx(je.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},className:"text-left pt-4 relative",children:i.jsx("div",{className:"w-full h-[30rem] overflow-y-auto p-5 rounded-lg border border-slate-700/40 bg-slate-900/50 text-[17px] leading-loose tracking-[0.02em] text-slate-100 focus:outline-none prose-styles",dangerouslySetInnerHTML:{__html:ke(c,x)}})},"report"):i.jsx(je.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},children:i.jsxs(Se,{onClick:w,disabled:a,className:"w-full max-w-sm mx-auto my-3",children:[i.jsx(Ze,{className:"w-4 h-4 mr-2"}),"Gerar Relatório Técnico da Análise de Risco"]})},"initial")})})]}),i.jsxs(Ve,{className:"mt-4 bg-slate-900/80 border-slate-600/60",children:[i.jsx(We,{className:"p-3",children:i.jsxs(Ue,{className:"flex items-start gap-2",children:[i.jsxs("span",{className:"flex items-start gap-2",children:[i.jsx(Rt,{className:"w-5 h-5 text-green-400 flex-shrink-0"}),i.jsx("span",{className:"text-slate-100 text-sm sm:text-base leading-relaxed text-justify",children:"Responsabilidade Técnica e Conferência Final do Relatório"})]}),i.jsx(Ft,{className:"w-5 h-5 text-yellow-400 flex-shrink-0"})]})}),i.jsxs(He,{className:"p-4 space-y-4 text-sm text-slate-200",children:[i.jsxs("div",{className:"space-y-2",children:[i.jsxs("p",{children:["A ",i.jsx("strong",{children:"NBR 5419:2025"})," deve ser utilizada como ",i.jsx("strong",{children:"fonte principal"})," para validação dos dados e referência normativa do relatório."]}),i.jsxs("p",{children:["Este aplicativo atua ",i.jsx("strong",{children:"exclusivamente como uma ferramenta de apoio"})," para cálculos e emissão de relatórios, ",i.jsx("strong",{children:"não isentando o usuário"})," de sua responsabilidade legal e técnica quanto à ",i.jsx("strong",{children:"veracidade"}),", ",i.jsx("strong",{children:"precisão"})," e ",i.jsx("strong",{children:"adequação"})," das informações fornecidas."]})]}),i.jsxs("div",{className:"space-y-3",children:[i.jsx("h3",{className:"font-semibold text-slate-100",children:"🤝 Informações de Contato para Negócios com Eng° Júlio Certo"}),i.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-3",children:[i.jsxs("div",{className:"rounded-md border border-slate-700 p-3 bg-slate-800/60",children:[i.jsx("div",{className:"text-xs text-slate-400",children:"Autor do Aplicativo"}),i.jsx("div",{className:"font-medium",children:"Engº Júlio César Certo"})]}),i.jsxs("div",{className:"rounded-md border border-slate-700 p-3 bg-slate-800/60",children:[i.jsx("div",{className:"text-xs text-slate-400",children:"Contato (WhatsApp)"}),i.jsx("div",{className:"font-medium",children:"(35) 9 8811-3746"})]}),i.jsxs("div",{className:"rounded-md border border-slate-700 p-3 bg-slate-800/60",children:[i.jsx("div",{className:"text-xs text-slate-400",children:"E-mail"}),i.jsx("div",{className:"font-medium",children:"julio.certo@hotmail.com"})]})]}),i.jsx("p",{className:"text-sm text-slate-300",children:"Ao utilizar este aplicativo em estudos ou projetos, cite a fonte: Engº Júlio César Certo — Ferramenta de Análise de Risco SPDA NBR 5419."})]})]})]})]})}export{At as ReportStep};
