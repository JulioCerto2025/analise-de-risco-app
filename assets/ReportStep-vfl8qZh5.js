import{r as M,j as e,A as it,m as ke}from"./motion-CZTIYVKD.js";import{P as ot,t as We,w as ze,K as st,v as rt,I as lt,R as ct,J as mt,M as dt,N as pt,O as ut,Q as xt,r as Ue,E as ht,s as gt,G as $t,V as ft,C as He,a as Ze,b as Ge,B as q,e as Xe,W as Pt,L as D,X as y}from"./index-BVvhx7OG.js";import{F as Ke,X as Rt,n as bt,L as Ct,l as Ft,T as _t}from"./icons-ggQqh8om.js";import"./react-Bzgz95E1.js";import"./charts-wPg4HxFZ.js";function j(t,a){const n=t.find(C=>String(C.value)===String(a));return n?n.label:`Valor ${a}`}function vt(t){var B,L,N,w,k,G,se,he,re,ge,$e,Q,ee,r,F,te,le,ce,me,de,X,l,_,A,V,ae,fe,Pe,Re,be,Ce,Fe,_e,ve,Ee,Le,m,R,b;const{calculations:a,probability_calculations:n,loss_calculations:C,risk_results:d,frequency_results:p,probability_data:o,zones:h,selected_risk_components:T}=t,s=((B=h[0])==null?void 0:B.loss_data)||{};let c="";c+=`### Etapa — Probabilidade (P)

`,c+=`> Resumo: PC_total = 1 − (1−PC) × (1−PCT); PM_total = 1 − (1−PM) × (1−PMT). Probabilidades nas linhas utilizam PTU/PV/PW/PZ combinadas com PEB/CLD/PLD conforme NBR 5419.

`,c+=`**PA - Danos a seres vivos por choque (Descarga na Estrutura)**
* *Fórmula:* PA = PTA × PB
* *Variáveis:*
    * PTA: **${o.PTA}** (${j(ot,o.PTA)})
    * PB: **${o.PB}** (${j(We,o.PB)})
* *Cálculo:* PA = ${o.PTA} × ${o.PB}
* *Resultado:* **PA = ${(L=n.PA)==null?void 0:L.toExponential(3)}**

`,c+=`**PB - Danos físicos (Descarga na Estrutura)**
* *Fórmula:* PB = PB
* *Variáveis:*
    * PB (Nível do SPDA): **${o.PB}** (${j(We,o.PB)})
* *Resultado:* **PB = ${(N=n.PB)==null?void 0:N.toExponential(3)}**

`,t.has_electric_line&&(c+=`**PC - Falha de sistemas (Descarga na Estrutura, Linha Elétrica)**
* *Fórmula:* PC = PSPDₑ × CLDₑ
* *Variáveis:*
    * PSPDₑ: **${o.PSPD_electric}** (${j(ze,o.PSPD_electric)})
    * CLDₑ_int: **${o.CLD_electric_int}**
    * CLDₑ_ext: **${o.CLD_electric_ext}**
* *Cálculo:* PC = ${o.PSPD_electric} × (CLDₑ conforme configuração)
* *Resultado:* **PC = ${(w=n.PC)==null?void 0:w.toExponential(3)}**

`),t.has_data_line&&(c+=`**PCT - Falha de sistemas (Descarga na Estrutura, Linha de Dados)**
* *Fórmula:* PCT = PSPDₐ × CLDₐ
* *Variáveis:*
    * PSPDₐ: **${o.PSPD_data}** (${j(ze,o.PSPD_data)})
    * CLDₐ_int: **${o.CLD_data_int}**
    * CLDₐ_ext: **${o.CLD_data_ext}**
* *Cálculo:* PCT = ${o.PSPD_data} × (CLDₐ conforme configuração)
* *Resultado:* **PCT = ${(k=n.PCT)==null?void 0:k.toExponential(3)}**

`),t.has_electric_line&&(c+=`**PM - Falha de sistemas (Descarga Próxima, Linha Elétrica)**
* *Fórmula:* PM = PSPDₑ × (Ks1 × Ks2 × Ks3ₑ × Ks4ₑ)²
* *Variáveis:*
    * PSPDₑ: **${o.PSPD_electric}** (${j(ze,o.PSPD_electric)})
    * Ks1 (Malha wm1=${o.wm1}m): **${(G=n.Ks1)==null?void 0:G.toFixed(3)}**
    * Ks2 (Malha wm2=${o.wm2}m): **${(se=n.Ks2)==null?void 0:se.toFixed(3)}**
    * Ks3ₑ: **${o.Ks3_electric_int}** (${j(st,o.Ks3_electric_int)})
    * Ks4ₑ (Uw=${o.Uw_electric_int}kV): **${(he=n.Ks4_electric)==null?void 0:he.toFixed(3)}**
* *Cálculo:* PM = ${o.PSPD_electric} × (${(re=n.Ks1)==null?void 0:re.toFixed(3)} × ${(ge=n.Ks2)==null?void 0:ge.toFixed(3)} × ${o.Ks3_electric_int} × ${($e=n.Ks4_electric)==null?void 0:$e.toFixed(3)})²
* *Resultado:* **PM = ${(Q=n.PM)==null?void 0:Q.toExponential(3)}**

`),t.has_electric_line&&(c+=`**PU - Danos a seres vivos por choque (Descarga na Linha Elétrica)**
* *Fórmula:* PU = PTU × PEB × PLD × CLD
* *Variáveis:*
    * PTU: **${o.PTU_electric}** (${j(rt,o.PTU_electric)})
    * PEB: **${o.PEB_electric}** (${j(ze,o.PEB_electric)})
    * PLD (ext): **${(ee=o.PLD_electric_ext)==null?void 0:ee.toFixed(2)}**
    * CLD (ext): **${o.CLD_electric_ext}**
* *Cálculo:* PU = ${o.PTU_electric} × ${o.PEB_electric} × ${(r=o.PLD_electric_ext)==null?void 0:r.toFixed(2)} × ${o.CLD_electric_ext}
* *Resultado:* **PU = ${(F=n.PU)==null?void 0:F.toExponential(3)}**

`),c+=`### Etapa — Perdas Consequentes (L) — ${(te=h[0])==null?void 0:te.name}

`,c+=`> Resumo: LA (choque), LB (incêndio/pânico) e LC (falha de sistemas) usam fatores normativos (rt, rp, rf, hz, LO) e a fração de tempo/pessoas na zona (tz, nz/nt). Demais perdas usam equivalências LU=LA, LV=LB, LM=LW=LZ=LC.

`,c+=`**LA - Perda por choque elétrico**
* *Fórmula:* LA = rt × 0.01 × (nz / nt) × (tz / 8760) × rs
* *Variáveis:*
    * rt (Resist. Piso): **${s.rt}** (${j(lt,s.rt)})
    * nz (Pessoas na Zona): **${s.nz}**
    * nt (Pessoas Total): **${s.nt}**
    * tz (Tempo na Zona): **${s.tz}** h/ano
    * rs (Tipo Estrutura): **${s.rs}** (${s.rs===1?"Robusta":"Simples"})
* *Cálculo:* LA = ${s.rt} × 0.01 × (${s.nz} / ${s.nt}) × (${s.tz} / 8760) × ${s.rs}
* *Resultado:* **LA = ${(le=C.LA)==null?void 0:le.toExponential(3)}**

`,c+=`**LB - Perda por danos físicos (incêndio)**
* *Fórmula:* LB = rs × rp × rf × hz × LF × (nz / nt) × (tz / 8760)
* *Variáveis:*
    * rs (Tipo Estrutura): **${s.rs}** (${s.rs===1?"Robusta":"Simples"})
    * rp (Prot. Incêndio): **${s.rp}** (${j(ct,s.rp)})
    * rf (Risco Incêndio): **${s.rf}** (${j(mt,s.rf)})
    * hz (Pânico): **${s.hz}** (${j(dt,s.hz)})
    * LF (Tipo Dano): **${s.LF}** (${j(pt,s.LF)})
    * nz, nt, tz: **${s.nz}**, **${s.nt}**, **${s.tz}**
* *Cálculo:* LB = ${s.rs} × ${s.rp} × ${s.rf} × ${s.hz} × ${s.LF} × (${s.nz} / ${s.nt}) × (${s.tz} / 8760)
* *Resultado:* **LB = ${(ce=C.LB)==null?void 0:ce.toExponential(3)}**

`,c+=`**LC - Perda por falha de sistemas**
* *Fórmula:* LC = LO × (nz / nt) × (tz / 8760) × rs
* *Variáveis:*
    * LO (Tipo Falha): **${s.LO}** (${j(ut,s.LO)})
    * nz, nt, tz, rs: **${s.nz}**, **${s.nt}**, **${s.tz}**, **${s.rs}**
* *Cálculo:* LC = ${s.LO} × (${s.nz} / ${s.nt}) × (${s.tz} / 8760) × ${s.rs}
* *Resultado:* **LC = ${(me=C.LC)==null?void 0:me.toExponential(3)}**

`,c+=`**Demais Perdas:** LU=LA, LV=LB, LM=LW=LZ=LC.

`,c+=`### Etapa — Componentes de Risco (R)

`;const v=Object.entries(T).filter(([,g])=>g).map(([g])=>{const i={RA:"RA = Nd × PA × LA",RB:"RB = Nd × PB × LB",RC:"RC = Nd × PC × LC",RM:"RM = Nm × PM × LM",RU:"RU = Nl × PU × LU",RV:"RV = Nl × PV × LV",RW:"RW = Nl × PW × LW",RZ:"RZ = Ni × PZ × LZ"},I=d[g];return`* **${g}:** ${i[g]||"N/A"} -> Resultado: **${I==null?void 0:I.toExponential(3)}**`}).join(`
`);c+=v+`

`,c+=`### Etapa — Frequência de Danos a Sistemas (F)

`,c+=`> Resumo: F = FB + FC + FM + FV + FW + FZ (quando aplicável), com combinação de sistemas internos via PC_total e PM_total.

`,p.FB&&t.frequency_config.has_equipment_in_ZPR0A&&(c+=`**FB - Danos por descarga na estrutura (Equip. ZPR0A)**
* *Fórmula:* FB = Nd × PB
* *Cálculo:* FB = ${(de=a.nd)==null?void 0:de.toExponential(3)} × ${n.PB}
* *Resultado:* **FB = ${(X=p.FB)==null?void 0:X.toExponential(3)}**

`),p.FC&&(c+=`**FC - Danos por descarga na estrutura (Sistemas Internos)**
* *Fórmula:* FC = Nd × PC_total
* *Cálculo:* FC = ${(l=a.nd)==null?void 0:l.toExponential(3)} × ${(1-(1-(n.PC||0))*(1-(n.PCT||0))).toFixed(3)}
* *Resultado:* **FC = ${(_=p.FC)==null?void 0:_.toExponential(3)}**

`),p.FM&&(c+=`**FM - Danos por descarga próxima (Sistemas Internos)**
* *Fórmula:* FM = Nm × PM_total
* *Cálculo:* FM = ${(A=a.nm)==null?void 0:A.toExponential(3)} × ${(1-(1-(n.PM||0))*(1-(n.PMT||0))).toFixed(3)}
* *Resultado:* **FM = ${(V=p.FM)==null?void 0:V.toExponential(3)}**

`),p.FV&&(c+=`**FV - Danos por descarga na linha**
* *Fórmula:* FV = Nlₑ × PEBₑ + Nlₐ × PEBₐ
* *Cálculo:* FV = (${(ae=a.nl_electric)==null?void 0:ae.toExponential(3)} × ${n.PEB_electric}) + (${(fe=a.nl_data)==null?void 0:fe.toExponential(3)} × ${n.PEB_data})
* *Resultado:* **FV = ${(Pe=p.FV)==null?void 0:Pe.toExponential(3)}**

`),p.FW&&(c+=`**FW - Danos por surto na linha**
* *Fórmula:* FW = Nlₑ × PW + Nlₐ × PWT
* *Cálculo:* FW = (${(Re=a.nl_electric)==null?void 0:Re.toExponential(3)} × ${(be=n.PW)==null?void 0:be.toExponential(3)}) + (${(Ce=a.nl_data)==null?void 0:Ce.toExponential(3)} × ${(Fe=n.PWT)==null?void 0:Fe.toExponential(3)})
* *Resultado:* **FW = ${(_e=p.FW)==null?void 0:_e.toExponential(3)}**

`),p.FZ&&(c+=`**FZ - Danos por surto induzido na linha**
* *Fórmula:* FZ = Niₑ × PZ + Niₐ × PZT
* *Cálculo:* FZ = (${(ve=a.ni_electric)==null?void 0:ve.toExponential(3)} × ${(Ee=n.PZ)==null?void 0:Ee.toExponential(3)}) + (${(Le=a.ni_data)==null?void 0:Le.toExponential(3)} × ${(m=n.PZT)==null?void 0:m.toExponential(3)})
* *Resultado:* **FZ = ${(R=p.FZ)==null?void 0:R.toExponential(3)}**

`);const E=[];return t.frequency_config.has_equipment_in_ZPR0A&&E.push("FB"),E.push("FC","FM","FV","FW","FZ"),c+=`**F - Frequência Total de Danos**
* *Fórmula:* F = ${E.join(" + ")}
* *Cálculo:* F = ${E.map(g=>{var i;return((i=p[g])==null?void 0:i.toExponential(3))||0}).join(" + ")}
* *Resultado:* **F = ${(b=p.F)==null?void 0:b.toExponential(3)}**

`,c}async function Et(t){var X,l,_,A,V,ae,fe,Pe,Re,be,Ce,Fe,_e,ve,Ee,Le;const{calculations:a,risk_results:n,frequency_results:C}=t,d={dados:1,parametros:2,calculos:3,resultados:4,parecer:5},p=vt(t),o=m=>{var ne,K;const R=Object.entries(m.risks_to_analyze).filter(([,x])=>x).map(([x])=>x),b={R1:1e-5,R3:.001,R4:.001},g=[];R.forEach(x=>{const S=m.risk_results[x]||0,z=b[x];S>z&&g.push(x)});const i=m.frequency_config.is_critical_system?.1:1,I=(((ne=m.frequency_results)==null?void 0:ne.F)||0)>i,O=["RA","RB","RC","RM","RU","RV","RW","RZ"].map(x=>({k:x,v:m.risk_results[x]||0})).sort((x,S)=>S.v-x.v).slice(0,2).map(x=>{var S;return`${String(x.k)} (${(S=x.v)==null?void 0:S.toExponential(2)})`}).join(", "),W=`Este parecer foi elaborado com base na NBR 5419, considerando os riscos selecionados (${R.join(", ")||"nenhum"}) e a frequência de danos aos sistemas.`,Me=`Frequência de Danos (F): **${(((K=m.frequency_results)==null?void 0:K.F)||0).toExponential(3)}**; Limite (FT): **${i.toFixed(1)}** → ${I?"**NÃO ACEITÁVEL**":"**ACEITÁVEL**"}.`,U=R.length?`Riscos totais: ${R.map(x=>`**${x}=${(m.risk_results[x]||0).toExponential(3)}** (RT=${b[x].toExponential(1)})`).join("; ")}.`:"Nenhum risco foi selecionado para análise próxima.",H=`Componentes dominantes observados: ${O}.`,ue=`Recomendações prioritárias:
* Adequar o nível do SPDA (captores, descidas, aterramento) para reduzir PA/PB e efeitos de descargas na estrutura.
* Coordenar DPS (classes I/II/III) em entradas e quadros, nas linhas elétrica e de dados, para reduzir PC/PM e perdas associadas (RC, RM, FC, FM).
* Reforçar malhas de aterramento e equipotencialização, interligando elementos metálicos e melhorando conexões, reduzindo tensões de passo/toque (impacto em LA/LC).
* Otimizar blindagens/roteamento de cabos e separação física, diminuindo acoplamentos (RW/RZ).
* Revisar parâmetros de ocupação e medidas internas (rf, hz, LO) e rotinas operacionais em zonas críticas.`,Z=g.length||I?`Conclusão: Há itens **NÃO ACEITÁVEIS** (${[...g,I?"F":null].filter(Boolean).join(", ")}). Recomenda-se implementar as medidas acima e reprocessar a análise para verificar a redução dos componentes dominantes e a conformidade com os limites.`:"Conclusão: Todos os itens analisados estão **ACEITÁVEIS** frente aos limites. Recomenda-se manter as medidas propostas, documentação e manutenção periódica do sistema.";return[W,Me,U,H,ue,Z].join(`

`)},h=Object.entries(t.risks_to_analyze).filter(([,m])=>m).map(([m],R)=>{var U,H,ue,Z,ne,K,x,S,z;const b=n[m]||0,g={R1:1e-5,R3:.001,R4:.001}[m]||0,i=b<=g,I={R1:"Perda de Vidas Humanas",R3:"Perda de Patrimônio Cultural",R4:"Perda de Valor Econômico"}[m],pe=i?"🟢 ✅":"🔴 ❌",P=t.selected_risk_components;let O="",W="";if(m==="R1"){const $=[],u=[];P.RA&&($.push("RA"),u.push(`${(U=n.RA)==null?void 0:U.toExponential(3)}`)),P.RB&&($.push("RB"),u.push(`${(H=n.RB)==null?void 0:H.toExponential(3)}`)),P.RC&&($.push("RC"),u.push(`${(ue=n.RC)==null?void 0:ue.toExponential(3)}`)),P.RM&&($.push("RM"),u.push(`${(Z=n.RM)==null?void 0:Z.toExponential(3)}`)),P.RU&&($.push("RU"),u.push(`${((n.RU||0)+(n.RUT||0)).toExponential(3)}`)),P.RV&&($.push("RV"),u.push(`${((n.RV||0)+(n.RVT||0)).toExponential(3)}`)),P.RW&&($.push("RW"),u.push(`${((n.RW||0)+(n.RWT||0)).toExponential(3)}`)),P.RZ&&($.push("RZ"),u.push(`${((n.RZ||0)+(n.RZT||0)).toExponential(3)}`)),O=$.join(" + "),W=`${u.join(" + ")} = ${b.toExponential(3)}`}else if(m==="R3"){const $=[],u=[];P.RB&&($.push("RB3"),u.push(`${(ne=n.RB3)==null?void 0:ne.toExponential(3)}`)),P.RV&&($.push("RV3"),u.push(`${((n.RV3||0)+(n.RVT3||0)).toExponential(3)}`)),O=$.join(" + "),W=`${u.join(" + ")} = ${b.toExponential(3)}`}else if(m==="R4"){const $=[],u=[];P.RA&&($.push("RA4"),u.push(`${(K=n.RA4)==null?void 0:K.toExponential(3)}`)),P.RB&&($.push("RB4"),u.push(`${(x=n.RB4)==null?void 0:x.toExponential(3)}`)),P.RC&&($.push("RC4"),u.push(`${(S=n.RC4)==null?void 0:S.toExponential(3)}`)),P.RM&&($.push("RM4"),u.push(`${(z=n.RM4)==null?void 0:z.toExponential(3)}`)),P.RU&&($.push("RU4"),u.push(`${((n.RU4||0)+(n.RUT4||0)).toExponential(3)}`)),P.RV&&($.push("RV4"),u.push(`${((n.RV4||0)+(n.RVT4||0)).toExponential(3)}`)),P.RW&&($.push("RW4"),u.push(`${((n.RW4||0)+(n.RWT4||0)).toExponential(3)}`)),P.RZ&&($.push("RZ4"),u.push(`${((n.RZ4||0)+(n.RZT4||0)).toExponential(3)}`)),O=$.join(" + "),W=`${u.join(" + ")} = ${b.toExponential(3)}`}const Me=O?`
* *Composição (${m}):* ${O}
* *Cálculo:* ${W}`:"";return`### ${d.resultados}.${R+1}. Risco ${m} - ${I}
* **Risco Total Calculado (${m}):** **${b.toExponential(3)}**
* **Risco Tolerável (RT):** **${g.toExponential(1)}**
* **Resultado:** ${pe} O risco ${m} é **${i?"ACEITÁVEL":"NÃO ACEITÁVEL"}**.${Me}`}).join(`

`),T=t.frequency_config.is_critical_system?.1:1,s=(C.F||0)<=T,c=s?"🟢 ✅":"🔴 ❌",v=m=>{try{return btoa(unescape(encodeURIComponent(m)))}catch{return""}},E=(m,R,b=720,g=300,i)=>{const pe=i!=null&&i.showLegend?72:48,P=44,O=8,W=R.length,Me=b-80,U=g-pe-P,H=Math.max(10,Math.floor((Me-(W-1)*O)/W)),ue=typeof(i==null?void 0:i.toleranceLine)=="number"?Math.max(i.toleranceLine,0):0,Z=f=>Math.log10(Math.max(f,1e-12)),ne=[...R.map(f=>f.value),ue].filter(f=>f>0),K=Math.max(...ne.map(f=>Z(f))),x=Math.min(...R.map(f=>Z(f.value))),S=(i==null?void 0:i.barColor)||"#60A5FA",z=i==null?void 0:i.barColors,$=(i==null?void 0:i.bg)||"#FFFFFF",u="#111827",Je="#475569",De=typeof(i==null?void 0:i.labelAngle)=="number"?i.labelAngle:-35,Ye=`
  <defs>
    <filter id="glowGreen" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="3.2" flood-color="#10B981" flood-opacity="0.45"/>
    </filter>
    <filter id="glowRed" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="3.2" flood-color="#EF4444" flood-opacity="0.45"/>
    </filter>
  </defs>`;let Ne="";R.forEach((f,xe)=>{const ie=40+xe*(H+O),Te=(Z(f.value)-x)/Math.max(K-x,1e-6),oe=Math.max(2,Math.floor(Te*U)),J=pe+(U-oe),je=f.value.toExponential(2),Y=z?z[xe%z.length]:S,Be=g-P+18,Ae=ie+H/2,Se=Y==="#CBD5E1",ye=f.name==="R Total"||f.name==="F Total",et=Se?' stroke="#94a3b8" stroke-width="1" stroke-dasharray="2 2" fill-opacity="0.25"':ye?` stroke="${Y==="#10B981"?"#065f46":Y==="#EF4444"?"#7f1d1d":"#334155"}" stroke-width="3"`:"",tt=ye?5:3,at=ye?12:10,nt=ye?"700":"400";Ne+=`
  <rect x="${ie}" y="${J}" width="${H}" height="${oe}" fill="${Y}" rx="${tt}"${et}${ye?Y==="#10B981"?' filter="url(#glowGreen)"':' filter="url(#glowRed)"':""} />`,Ne+=`
  <text x="${Ae}" y="${Be}" fill="${u}" font-size="11" text-anchor="${De<0?"end":De>0?"start":"middle"}" transform="rotate(${De} ${Ae} ${Be})">${f.name}</text>`,Ne+=`
  <text x="${ie+H/2}" y="${J-6}" fill="${u}" font-size="${at}" font-weight="${nt}" text-anchor="middle">${je}</text>`});let Ve="";if(typeof(i==null?void 0:i.toleranceLine)=="number"){const f=Math.max(i.toleranceLine,1e-12),xe=(Z(f)-x)/Math.max(K-x,1e-6),ie=Math.min(1,Math.max(0,xe)),Te=Math.max(2,Math.floor(ie*U)),oe=pe+(U-Te);Ve=`
  <line x1="40" y1="${oe}" x2="${b-40}" y2="${oe}" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 3" />`}let we="";if(!!(i!=null&&i.showLegend)&&z&&R.length){const f=typeof(i==null?void 0:i.legendBoxSize)=="number"?Math.max(6,i.legendBoxSize):10,xe=typeof(i==null?void 0:i.legendColGap)=="number"?Math.max(2,i.legendColGap):8,ie=typeof(i==null?void 0:i.legendRowGap)=="number"?Math.max(2,i.legendRowGap):8,Te=typeof(i==null?void 0:i.legendFontSize)=="number"?Math.max(8,i.legendFontSize):11,oe=Math.min(b-40,Math.max(120,(i==null?void 0:i.legendMaxWidth)||b-40));let J=40,je=46;R.forEach((Y,Be)=>{const Ae=z[Be%z.length],Se=Math.min(160,Math.max(40,Y.name.length*7));J+f+4+Se>oe&&(J=40,je+=f+ie),we+=`
  <rect x="${J}" y="${je}" width="${f}" height="${f}" fill="${Ae}" rx="2" />`,we+=`
  <text x="${J+f+6}" y="${je+f-1}" fill="${u}" font-size="${Te}">${Y.name}</text>`,J+=f+6+Se+xe})}const Qe=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${b}" height="${g}" viewBox="0 0 ${b} ${g}">
  ${Ye}
  <rect x="0" y="0" width="${b}" height="${g}" fill="${$}"/>
  <text x="40" y="24" fill="${u}" font-size="14" font-weight="bold">${m}</text>
  ${we}
  <line x1="40" y1="${g-P}" x2="${b-40}" y2="${g-P}" stroke="${Je}" stroke-width="1"/>
  ${Ve}
  ${Ne}
</svg>`;return`data:image/svg+xml;base64,${v(Qe)}`},L=["RA","RB","RC","RM","RU","RV","RW","RZ"].map(m=>({name:m,value:t.risk_results[m]||1e-12,active:!!t.selected_risk_components[m]})),N=t.risks_to_analyze.R1?"R1":t.risks_to_analyze.R3?"R3":t.risks_to_analyze.R4?"R4":"R1",w=t.risk_results[N]||0,k=[...L.map(m=>({name:m.name,value:m.value})),{name:"R Total",value:w}],G=Object.entries(t.frequency_results||{}).filter(([m])=>m!=="F").map(([m,R])=>({name:m,value:R||0})),se=["#60A5FA","#A78BFA","#F472B6","#FB7185","#F59E0B","#34D399","#22D3EE","#93C5FD"],he="#CBD5E1",re=t.risks_to_analyze.R1?1e-5:t.risks_to_analyze.R3||t.risks_to_analyze.R4?.001:1e-5,$e=w<=re?"#10B981":"#EF4444",Q=k.map((m,R)=>{var g;return m.name==="R Total"?$e:((g=L[R])==null?void 0:g.active)?se[R%se.length]:he}),ee=["#F87171","#60A5FA","#A78BFA","#34D399","#F59E0B","#FB7185","#64748B"],r=E("Componentes de Risco — Global",k,720,300,{barColors:Q,labelAngle:-30,legendMaxWidth:420,toleranceLine:re}),F=[...G,{name:"F Total",value:((X=t.frequency_results)==null?void 0:X.F)||0}],te=(((l=t.frequency_results)==null?void 0:l.F)||0)<=T,le="#CBD5E1",ce=F.map((m,R)=>{if(m.name==="F Total")return te?"#10B981":"#EF4444";const b=ee[R%ee.length];return(m.value||0)>0?b:le}),me=E("Frequência de Danos — Global",F,720,280,{barColors:ce,labelAngle:-40,legendFontSize:10,legendMaxWidth:500,toleranceLine:T});return`
**ASSUNTO:** Memorial de Cálculo — Análise de Risco (NBR 5419)

---

## ${d.dados}. DADOS DO PROJETO
* **Projeto/Cliente:** ${t.clientName}
* **Endereço:** ${t.clientAddress}
* **Descrição:** ${t.projectName}
* **Data:** ${t.projectDate}
* **Responsável Técnico:** ${t.technicalManagerName} (${t.licenseNumber})

## ${d.parametros}. PARÂMETROS GERAIS DA ANÁLISE
* **Localização (Cidade/UF):** ${t.location}
* **Densidade de Descargas (Ng):** **${t.ng}** descargas/km²/ano
* **Geometria da Estrutura:** **${t.l}**m (C) × **${t.w}**m (L) × **${t.h}**m (A)
* **Fator de Localização (Cd):** **${t.cd}**

## ${d.calculos}. CÁLCULOS DETALHADOS

### ${d.calculos}.1. Áreas de Exposição Equivalentes
* **Área de Exposição (Ad):**
  * *Fórmula:* Ad = L×W + 2×(3H)×(L+W) + π×(3H)²
  * *Cálculo:* Ad = ${t.l}×${t.w} + 2×(3×${t.h})×(${t.l}+${t.w}) + π×(3×${t.h})²
  * *Resultado:* **Ad = ${(_=a.ad)==null?void 0:_.toFixed(2)} m²**
* **Área de Exposição Final (Adf):**
  * *Resultado:* **Adf = ${(A=a.adf)==null?void 0:A.toFixed(2)} m²** (Considerando protrusões)
* **Área de Exposição Próxima (Am):**
  * *Fórmula:* Am = 2×500×(L+W) + π×500²
  * *Cálculo:* Am = 2×500×(${t.l}+${t.w}) + π×500²
  * *Resultado:* **Am = ${(V=a.am)==null?void 0:V.toFixed(2)} m²**
* **Linha Elétrica (Al1, Ai1):** **Al1 = ${(ae=a.al1)==null?void 0:ae.toFixed(2)} m²**, **Ai1 = ${(fe=a.ai1)==null?void 0:fe.toFixed(2)} m²**
* **Linha de Dados (Al2, Ai2):** **Al2 = ${(Pe=a.al2)==null?void 0:Pe.toFixed(2)} m²**, **Ai2 = ${(Re=a.ai2)==null?void 0:Re.toFixed(2)} m²**

### ${d.calculos}.2. Frequência Média Anual de Eventos Danosos (N)
* **Nd:** Nd = Ng × Adf × Cd × 10⁻⁶ → **${(be=a.nd)==null?void 0:be.toExponential(3)}** eventos/ano
* **Nm:** Nm = Ng × Am × 10⁻⁶ → **${(Ce=a.nm)==null?void 0:Ce.toExponential(3)}** eventos/ano
* **Nl/ Ni (Elétrica):** **Nl = ${(Fe=a.nl_electric)==null?void 0:Fe.toExponential(3)}**, **Ni = ${(_e=a.ni_electric)==null?void 0:_e.toExponential(3)}** eventos/ano
* **Nl/ Ni (Dados):** **Nl = ${(ve=a.nl_data)==null?void 0:ve.toExponential(3)}**, **Ni = ${(Ee=a.ni_data)==null?void 0:Ee.toExponential(3)}** eventos/ano

${p}

## ${d.resultados}. RESULTADOS E CONCLUSÕES

> As figuras são numeradas conforme ABNT: “Figura N — Título”. Escala logarítmica nos gráficos para melhor comparação entre ordens de grandeza.

${h}

### Figura 1 — Componentes de Risco — Global
![Componentes de Risco — Global](${r})


### ${d.resultados}.${Object.values(t.risks_to_analyze).filter(m=>m).length+1}. Frequência de Danos aos Sistemas (F)
* **Frequência Calculada (F):** **${(Le=C.F)==null?void 0:Le.toExponential(3)}** danos/ano
* **Frequência Tolerável (FT):** **${T.toFixed(1)}** danos/ano
* **Resultado:** ${c} A frequência F é **${s?"ACEITÁVEL":"NÃO ACEITÁVEL"}**.

### Figura 2 — Frequência de Danos — Global
![Frequência de Danos — Global](${me})

## ${d.parecer}. PARECER TÉCNICO
${o(t)}

---

## ✅ Responsabilidade Técnica e Conferência Final do Relatório
A **NBR 5419:2025** deve ser utilizada como **fonte principal** para validação dos dados e referência normativa do relatório.

Este aplicativo atua **exclusivamente como ferramenta de apoio** para cálculos e emissão de relatórios, **não isentando o usuário** de sua responsabilidade legal e técnica quanto à **veracidade**, **precisão** e **adequação** das informações fornecidas.

### 🤝 Informações de Contato
* **Autor do Aplicativo:** Engº Júlio César Certo
* **Contato (WhatsApp):** (35) 9 8811-3746
* **E-mail:** julio.certo@hotmail.com

> Ao utilizar este aplicativo, cite a fonte: **Engº Júlio César Certo — Ferramenta de Análise de Risco SPDA NBR 5419**.
`.trim()}const Ie=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),Oe={paragraphFontSizePt:11,paragraphLineHeight:1.35,paragraphMarginTopPx:8,paragraphMarginBottomPx:8,listItemMarginTopPx:4,listItemMarginBottomPx:4,listItemExtraMarginBottomPx:14,listMarginTopPx:8,listMarginBottomPx:12,listPaddingLeftPx:18,h2FontSizeRem:1.25,h2MarginTopPx:16,h2MarginBottomPx:10,h3FontSizeRem:1.1,h3MarginTopPx:12,h3MarginBottomPx:8,figureMarginTopPx:12,figureMarginBottomPx:12,emptyLineHeightPx:12},qe=(t,a)=>{if(!t)return"";const C=t.replace(/\\n/g,`
`).split(`
`);let d="",p=!1;for(let o=0;o<C.length;o++){let h=C[o];if(h.trim()===""){p?d+=`<li style="list-style:none;margin:${a.listItemMarginTopPx}px 0 ${a.listItemMarginBottomPx}px"><span style="display:inline-block;height:${a.emptyLineHeightPx}px"></span></li>
`:d+=`<p style="margin:${a.emptyLineHeightPx}px 0 ${a.emptyLineHeightPx}px;font-size:${a.paragraphFontSizePt}pt;line-height:${a.paragraphLineHeight}">&nbsp;</p>
`;continue}const T=c=>{let v=Ie(c);return v=v.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),v=v.replace(/(^|[^*])\*(?!\*)([^*]+?)\*(?!\*)/g,(E,B,L)=>`${B}<em>${L}</em>`),v};if(h.trim()==="---"){p&&(d+=`</ul>
`,p=!1),d+=`<hr style="border:0;border-top:1px solid #cbd5e1;margin:12px 0"/>
`;continue}const s=h.trim().match(/^!\[(.*?)\]\((.*?)\)$/);if(s){const[,c,v]=s;p&&(d+=`</ul>
`,p=!1);const E=o+1<C.length?C[o+1].trim():"",B=o-1>=0?C[o-1].trim():"",L=/^(Figura|FIGURA)\s*([0-9]+(?:\.[0-9]+)*)[\.:\-]\s*(.*)$/;let N=null;const w=E.match(L),k=B.match(L);w?(N=`Figura ${w[2]} — ${w[3]}`.trim(),o+=1):k?N=`Figura ${k[2]} — ${k[3]}`.trim():c&&c.trim().length>0&&(N=c.trim());const G=N?`<figcaption>${T(N)}</figcaption>`:"";d+=`<figure style="margin:${a.figureMarginTopPx}px 0 ${a.figureMarginBottomPx}px"><img src="${Ie(v)}" alt="${Ie(c)}" style="max-width:100%;height:auto;border-radius:4px;border:none;display:inline-block;page-break-inside:avoid"/>${G}</figure>
`;continue}if(h.startsWith("> ")){p&&(d+=`</ul>
`,p=!1);const c=T(h.substring(2));d+=`<p style="margin:${a.paragraphMarginTopPx}px 0 ${a.paragraphMarginBottomPx}px;font-size:${a.paragraphFontSizePt}pt;line-height:${a.paragraphLineHeight}">${c}</p>
`;continue}if(h.startsWith("## ")){p&&(d+=`</ul>
`,p=!1),d+=`<h2 style="font-size:${a.h2FontSizeRem}rem;line-height:1.6;font-weight:700;margin:${a.h2MarginTopPx}px 0 ${a.h2MarginBottomPx}px;">${T(h.substring(3))}</h2>
`;continue}if(h.startsWith("### ")){p&&(d+=`</ul>
`,p=!1),d+=`<h3 style="font-size:${a.h3FontSizeRem}rem;line-height:1.5;font-weight:700;margin:${a.h3MarginTopPx}px 0 ${a.h3MarginBottomPx}px;">${T(h.substring(4))}</h3>
`;continue}if(h.trim().startsWith("* ")){p||(d+=`<ul style="margin:${a.listMarginTopPx}px 0 ${a.listMarginBottomPx}px;padding-left:${a.listPaddingLeftPx}px">
`,p=!0);let c=h.trim().substring(2);for(;o+1<C.length&&C[o+1].startsWith("  ");)c+=" "+C[o+1].trim(),o++;const v=c.replace(/\*/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),E=/\bresultado:\b/.test(v),B=/\bcalculo:\b/.test(v),L=E||B?`${Math.max(0,a.listItemMarginTopPx)}px 0 ${a.listItemExtraMarginBottomPx}px`:`${a.listItemMarginTopPx}px 0 ${a.listItemMarginBottomPx}px`;d+=`<li style="margin:${L};font-size:${a.paragraphFontSizePt}pt;line-height:${a.paragraphLineHeight}">${T(c)}</li>
`;continue}if(p&&(d+=`</ul>
`,p=!1),h.trim()){const c=o+1<C.length?C[o+1].trim():"";if(!(/^(Figura|FIGURA)\s*([0-9]+(?:\.[0-9]+)*)[\.:\-]\s*(.*)$/.test(h.trim())&&/^!\[(.*?)\]\((.*?)\)$/.test(c))){const E=h.replace(/\*/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),B=/\bresultado:\b/.test(E),L=/\bcalculo:\b/.test(E),N=B||L?`${a.paragraphMarginTopPx}px 0 ${a.listItemExtraMarginBottomPx}px`:`${a.paragraphMarginTopPx}px 0 ${a.paragraphMarginBottomPx}px`;d+=`<p style="margin:${N};font-size:${a.paragraphFontSizePt}pt;line-height:${a.paragraphLineHeight}">${T(h)}</p>
`}}}return p&&(d+=`</ul>
`),d};function St({data:t,onUpdate:a}){const[n,C]=M.useState(!1),[d,p]=M.useState(""),[o,h]=M.useState(!1),[T,s]=M.useState(!1),[c,v]=M.useState(""),[E,B]=M.useState(22),[L,N]=M.useState(15),[w,k]=M.useState(22),[G,se]=M.useState(6),[he,re]=M.useState(22),[ge,$e]=M.useState(6),Q="report_format_prefs",ee=()=>{try{const l=localStorage.getItem(Q);if(l){const _=JSON.parse(l);return{...Oe,..._}}}catch{}return Oe},[r,F]=M.useState(ee()),[te,le]=M.useState(!1),ce=async()=>{C(!0),p("");try{const l=await Et(t);p(l)}finally{C(!1)}},me=async()=>{if(!d)return;const l=qe(d,r),_=d.replace(/\!\[[^\]]*\]\([^\)]*\)/g,"").replace(/^###\s+/gm,"").replace(/^##\s+/gm,"").replace(/\*\*(.*?)\*\*/g,"$1").replace(/^>\s+/gm,"").replace(/\n\n+/g,`

`);try{if(typeof window.ClipboardItem<"u"){const A=new window.ClipboardItem({"text/html":new Blob([l],{type:"text/html"}),"text/plain":new Blob([_],{type:"text/plain"})});await navigator.clipboard.write([A])}else await navigator.clipboard.writeText(_);h(!0),setTimeout(()=>h(!1),2e3)}catch{try{await navigator.clipboard.writeText(_)}catch{}h(!0),setTimeout(()=>h(!1),2e3)}},de=M.useMemo(()=>xt(t),[t.h,t.l,t.w,t.hp,t.ng,t.cd,t.has_electric_line,t.line_sections_1,t.use_adj_structure_1,t.l_adj_1,t.w_adj_1,t.h_adj_1,t.hp_adj_1,t.cd_adj_1,t.has_data_line,t.line_sections_2,t.use_adj_structure_2,t.l_adj_2,t.w_adj_2,t.h_adj_2,t.hp_adj_2,t.cd_adj_2]);M.useMemo(()=>Ue(t.probability_data,t.analyze_data_line_probabilities,t.has_data_line),[t.probability_data,t.analyze_data_line_probabilities,t.has_data_line]);const X=M.useMemo(()=>t.zones.map(l=>{const _=ht(l),A=Ue(l.probability_data||t.probability_data,t.analyze_data_line_probabilities,t.has_data_line),V=gt(A,l),ae=$t(de,V,_,t.selected_risk_components);return{zone:l,lossCalculations:_,riskCalculations:ae}}),[t.zones,de,t.selected_risk_components,t.analyze_data_line_probabilities,t.has_data_line,t.probability_data]);return M.useMemo(()=>ft(X),[X]),e.jsxs("div",{children:[e.jsxs(He,{children:[e.jsx(Ze,{className:"p-3",children:e.jsxs(Ge,{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(Ke,{className:"w-5 h-5 text-slate-100"}),"Relatório Técnico Detalhado"]}),d&&!n&&e.jsx(q,{variant:"outline",size:"icon",onClick:()=>p(""),className:"h-8 w-8 flex-shrink-0",children:e.jsx(Rt,{className:"w-4 h-4"})})]})}),d&&!n&&e.jsxs("div",{className:"flex justify-end gap-2 px-2 pb-0",children:[e.jsx(q,{variant:"outline",size:"sm",onClick:()=>{s(!0),v(d)},children:"Editar conteúdo"}),e.jsx(q,{variant:"secondary",size:"sm",onClick:()=>{const l=qe(d,r),_=window.open("","_blank");if(!_)return;const A=Math.max(4,G),V=Math.max(4,ge);_.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title></title><style>
@page{margin:${E}mm ${L}mm;}
*{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu; background:#ffffff; color:#111827; margin:0; line-height:1.6;}
main{padding:${A}mm ${L}mm ${V}mm; overflow:visible;}
h2{font-size:${r.h2FontSizeRem}rem; line-height:1.6; color:#0f172a; font-weight:700; margin:${r.h2MarginTopPx}px 0 ${r.h2MarginBottomPx}px; break-inside:avoid; break-after:avoid-page;}
h3{font-size:${r.h3FontSizeRem}rem; line-height:1.5; color:#1f2937; font-weight:700; margin:${r.h3MarginTopPx}px 0 ${r.h3MarginBottomPx}px; break-inside:avoid; break-after:avoid-page;}
ul{margin:${r.listMarginTopPx}px 0 ${r.listMarginBottomPx}px; padding-left:${r.listPaddingLeftPx}px; break-inside:avoid;}
li{break-inside:avoid; font-size:${r.paragraphFontSizePt}pt; line-height:${r.paragraphLineHeight};}
p{margin:${r.paragraphMarginTopPx}px 0 ${r.paragraphMarginBottomPx}px; break-inside:avoid; font-size:${r.paragraphFontSizePt}pt; line-height:${r.paragraphLineHeight};}
img{max-width:100%; height:auto; display:block; page-break-inside:avoid; break-inside:avoid;}
blockquote{margin:8px 0; padding:10px 12px; border-left:3px solid #3b82f6; background:transparent; color:#0f172a; border-radius:6px; break-inside:avoid;}
hr{border:0; border-top:1px solid #cbd5e1; margin:12px 0; break-inside:avoid;}
</style></head><body><main>${l}</main>
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
<\/script></body></html>`),_.document.close(),_.focus(),setTimeout(()=>{try{_.print()}catch{}},300)},children:"Gerar PDF"}),e.jsxs(q,{variant:"secondary",size:"sm",onClick:me,children:[e.jsx(bt,{className:"w-4 h-4 mr-2"}),o?"Texto copiado!":"Copiar para Word (formatado)"]})]}),e.jsx(Xe,{className:"text-center px-3 pt-0 pb-3",children:e.jsx(it,{mode:"wait",children:n?e.jsxs(ke.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},className:"flex flex-col items-center justify-center min-h-[10rem]",children:[e.jsx(Ct,{className:"w-6 h-6 animate-spin text-blue-400"}),e.jsx("p",{className:"mt-3 text-slate-300",children:"Gerando Relatório..."})]},"loading"):d?e.jsxs(ke.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},className:"text-left pt-4 relative",children:[T?e.jsxs("div",{className:"mb-4",children:[e.jsx(Pt,{className:"w-full h-[22rem]",value:c,onChange:l=>v(l.target.value)}),e.jsxs("div",{className:"mt-2 flex gap-2",children:[e.jsx(q,{size:"sm",onClick:()=>{p(c),s(!1)},children:"Aplicar alterações"}),e.jsx(q,{variant:"outline",size:"sm",onClick:()=>s(!1),children:"Cancelar"})]}),e.jsx("p",{className:"mt-2 text-xs text-slate-400",children:"Dica: insira linhas vazias (Enter) entre parágrafos e itens para criar espaçamentos visuais."})]}):null,e.jsxs("div",{className:"mb-3 flex items-center justify-between",children:[e.jsx(q,{variant:"outline",size:"sm",onClick:()=>le(l=>!l),children:te?"Ocultar Formatação":"Ajustar Formatação"}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(q,{size:"sm",onClick:()=>{try{localStorage.setItem(Q,JSON.stringify(r))}catch{}},children:"Salvar Formatação (Local)"}),e.jsx(q,{variant:"outline",size:"sm",onClick:()=>F(Oe),children:"Restaurar Padrão"})]})]}),te&&e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 p-3 rounded-md border border-slate-700 bg-slate-800/50",children:[e.jsxs("div",{children:[e.jsx("div",{className:"font-semibold text-sm mb-2",children:"Parágrafo"}),e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(D,{children:"Tamanho (pt)"}),e.jsx(y,{type:"number",step:"0.5",value:r.paragraphFontSizePt,onChange:l=>F({...r,paragraphFontSizePt:Number(l.target.value)})})]}),e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(D,{children:"Line-height"}),e.jsx(y,{type:"number",step:"0.05",value:r.paragraphLineHeight,onChange:l=>F({...r,paragraphLineHeight:Number(l.target.value)})})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(D,{children:"Margem inf. (px)"}),e.jsx(y,{type:"number",value:r.paragraphMarginBottomPx,onChange:l=>F({...r,paragraphMarginBottomPx:Number(l.target.value)})})]}),e.jsxs("div",{className:"flex items-center gap-2 mt-2",children:[e.jsx(D,{children:"Altura da linha vazia (px)"}),e.jsx(y,{type:"number",value:r.emptyLineHeightPx,onChange:l=>F({...r,emptyLineHeightPx:Number(l.target.value)})})]})]}),e.jsxs("div",{children:[e.jsx("div",{className:"font-semibold text-sm mb-2",children:"Lista"}),e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(D,{children:"Margem itens (top/bot px)"}),e.jsx(y,{type:"number",value:r.listItemMarginTopPx,onChange:l=>F({...r,listItemMarginTopPx:Number(l.target.value)})}),e.jsx(y,{type:"number",value:r.listItemMarginBottomPx,onChange:l=>F({...r,listItemMarginBottomPx:Number(l.target.value)})})]}),e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(D,{children:"Margem extra após Cálculo/Resultado (px)"}),e.jsx(y,{type:"number",value:r.listItemExtraMarginBottomPx,onChange:l=>F({...r,listItemExtraMarginBottomPx:Number(l.target.value)})})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(D,{children:"Padding esquerdo da lista (px)"}),e.jsx(y,{type:"number",value:r.listPaddingLeftPx,onChange:l=>F({...r,listPaddingLeftPx:Number(l.target.value)})})]})]}),e.jsxs("div",{children:[e.jsx("div",{className:"font-semibold text-sm mb-2",children:"Títulos"}),e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(D,{children:"H2 tamanho (rem)"}),e.jsx(y,{type:"number",step:"0.05",value:r.h2FontSizeRem,onChange:l=>F({...r,h2FontSizeRem:Number(l.target.value)})})]}),e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(D,{children:"H2 margens (top/bot px)"}),e.jsx(y,{type:"number",value:r.h2MarginTopPx,onChange:l=>F({...r,h2MarginTopPx:Number(l.target.value)})}),e.jsx(y,{type:"number",value:r.h2MarginBottomPx,onChange:l=>F({...r,h2MarginBottomPx:Number(l.target.value)})})]}),e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(D,{children:"H3 tamanho (rem)"}),e.jsx(y,{type:"number",step:"0.05",value:r.h3FontSizeRem,onChange:l=>F({...r,h3FontSizeRem:Number(l.target.value)})})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(D,{children:"H3 margens (top/bot px)"}),e.jsx(y,{type:"number",value:r.h3MarginTopPx,onChange:l=>F({...r,h3MarginTopPx:Number(l.target.value)})}),e.jsx(y,{type:"number",value:r.h3MarginBottomPx,onChange:l=>F({...r,h3MarginBottomPx:Number(l.target.value)})})]})]})]}),e.jsx("div",{className:"w-full h-[30rem] overflow-y-auto p-5 rounded-lg border border-slate-700/40 bg-slate-900/50 text-[17px] leading-loose tracking-[0.02em] text-slate-100 focus:outline-none prose-styles",dangerouslySetInnerHTML:{__html:qe(d,r)}})]},"report"):e.jsx(ke.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},children:e.jsxs(q,{onClick:ce,disabled:n,className:"w-full max-w-sm mx-auto my-3",children:[e.jsx(Ke,{className:"w-4 h-4 mr-2"}),"Gerar Relatório Técnico da Análise de Risco"]})},"initial")})})]}),e.jsxs(He,{className:"mt-4 bg-slate-900/80 border-slate-600/60",children:[e.jsx(Ze,{className:"p-3",children:e.jsxs(Ge,{className:"flex items-start gap-2",children:[e.jsxs("span",{className:"flex items-start gap-2",children:[e.jsx(Ft,{className:"w-5 h-5 text-green-400 flex-shrink-0"}),e.jsx("span",{className:"text-slate-100 text-sm sm:text-base leading-relaxed text-justify",children:"Responsabilidade Técnica e Conferência Final do Relatório"})]}),e.jsx(_t,{className:"w-5 h-5 text-yellow-400 flex-shrink-0"})]})}),e.jsxs(Xe,{className:"p-4 space-y-4 text-sm text-slate-200",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsxs("p",{children:["A ",e.jsx("strong",{children:"NBR 5419:2025"})," deve ser utilizada como ",e.jsx("strong",{children:"fonte principal"})," para validação dos dados e referência normativa do relatório."]}),e.jsxs("p",{children:["Este aplicativo atua ",e.jsx("strong",{children:"exclusivamente como uma ferramenta de apoio"})," para cálculos e emissão de relatórios, ",e.jsx("strong",{children:"não isentando o usuário"})," de sua responsabilidade legal e técnica quanto à ",e.jsx("strong",{children:"veracidade"}),", ",e.jsx("strong",{children:"precisão"})," e ",e.jsx("strong",{children:"adequação"})," das informações fornecidas."]})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsx("h3",{className:"font-semibold text-slate-100",children:"🤝 Informações de Contato para Negócios com Eng° Júlio Certo"}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-3",children:[e.jsxs("div",{className:"rounded-md border border-slate-700 p-3 bg-slate-800/60",children:[e.jsx("div",{className:"text-xs text-slate-400",children:"Autor do Aplicativo"}),e.jsx("div",{className:"font-medium",children:"Engº Júlio César Certo"})]}),e.jsxs("div",{className:"rounded-md border border-slate-700 p-3 bg-slate-800/60",children:[e.jsx("div",{className:"text-xs text-slate-400",children:"Contato (WhatsApp)"}),e.jsx("div",{className:"font-medium",children:"(35) 9 8811-3746"})]}),e.jsxs("div",{className:"rounded-md border border-slate-700 p-3 bg-slate-800/60",children:[e.jsx("div",{className:"text-xs text-slate-400",children:"E-mail"}),e.jsx("div",{className:"font-medium",children:"julio.certo@hotmail.com"})]})]}),e.jsx("p",{className:"text-sm text-slate-300",children:"Ao utilizar este aplicativo em estudos ou projetos, cite a fonte: Engº Júlio César Certo — Ferramenta de Análise de Risco SPDA NBR 5419."})]})]})]})]})}export{St as ReportStep};
