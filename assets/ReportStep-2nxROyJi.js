import{r as L,j as e,A as nt,m as ke}from"./motion-CZTIYVKD.js";import{P as it,t as We,w as ze,K as st,v as rt,I as lt,R as ct,J as mt,M as dt,N as pt,O as ut,Q as xt,r as Ue,E as ht,s as gt,G as $t,V as ft,C as Ze,a as He,b as Ge,B as le,e as Ke,L as O,W as y}from"./index-Cnyo8IPD.js";import{F as Xe,X as Pt,n as Rt,L as bt,l as Ft,T as Ct}from"./icons-ggQqh8om.js";import"./react-Bzgz95E1.js";import"./charts-wPg4HxFZ.js";function j(t,i){const a=t.find(F=>String(F.value)===String(i));return a?a.label:`Valor ${i}`}function _t(t){var B,M,N,z,D,H,ce,J,Y,r,C,Q,ee,me,te,ae,oe,c,_,w,q,ne,xe,he,ge,$e,fe,Pe,Re,be,Fe,Ce,_e,ve,Ee,Me,m,R,b;const{calculations:i,probability_calculations:a,loss_calculations:F,risk_results:d,frequency_results:p,probability_data:n,zones:f,selected_risk_components:T}=t,s=((B=f[0])==null?void 0:B.loss_data)||{};let l="";l+=`### Etapa — Probabilidade (P)

`,l+=`> Resumo: PC_total = 1 − (1−PC) × (1−PCT); PM_total = 1 − (1−PM) × (1−PMT). Probabilidades nas linhas utilizam PTU/PV/PW/PZ combinadas com PEB/CLD/PLD conforme NBR 5419.

`,l+=`**PA - Danos a seres vivos por choque (Descarga na Estrutura)**
* *Fórmula:* PA = PTA × PB
* *Variáveis:*
    * PTA: **${n.PTA}** (${j(it,n.PTA)})
    * PB: **${n.PB}** (${j(We,n.PB)})
* *Cálculo:* PA = ${n.PTA} × ${n.PB}
* *Resultado:* **PA = ${(M=a.PA)==null?void 0:M.toExponential(3)}**

`,l+=`**PB - Danos físicos (Descarga na Estrutura)**
* *Fórmula:* PB = PB
* *Variáveis:*
    * PB (Nível do SPDA): **${n.PB}** (${j(We,n.PB)})
* *Resultado:* **PB = ${(N=a.PB)==null?void 0:N.toExponential(3)}**

`,t.has_electric_line&&(l+=`**PC - Falha de sistemas (Descarga na Estrutura, Linha Elétrica)**
* *Fórmula:* PC = PSPDₑ × CLDₑ
* *Variáveis:*
    * PSPDₑ: **${n.PSPD_electric}** (${j(ze,n.PSPD_electric)})
    * CLDₑ_int: **${n.CLD_electric_int}**
    * CLDₑ_ext: **${n.CLD_electric_ext}**
* *Cálculo:* PC = ${n.PSPD_electric} × (CLDₑ conforme configuração)
* *Resultado:* **PC = ${(z=a.PC)==null?void 0:z.toExponential(3)}**

`),t.has_data_line&&(l+=`**PCT - Falha de sistemas (Descarga na Estrutura, Linha de Dados)**
* *Fórmula:* PCT = PSPDₐ × CLDₐ
* *Variáveis:*
    * PSPDₐ: **${n.PSPD_data}** (${j(ze,n.PSPD_data)})
    * CLDₐ_int: **${n.CLD_data_int}**
    * CLDₐ_ext: **${n.CLD_data_ext}**
* *Cálculo:* PCT = ${n.PSPD_data} × (CLDₐ conforme configuração)
* *Resultado:* **PCT = ${(D=a.PCT)==null?void 0:D.toExponential(3)}**

`),t.has_electric_line&&(l+=`**PM - Falha de sistemas (Descarga Próxima, Linha Elétrica)**
* *Fórmula:* PM = PSPDₑ × (Ks1 × Ks2 × Ks3ₑ × Ks4ₑ)²
* *Variáveis:*
    * PSPDₑ: **${n.PSPD_electric}** (${j(ze,n.PSPD_electric)})
    * Ks1 (Malha wm1=${n.wm1}m): **${(H=a.Ks1)==null?void 0:H.toFixed(3)}**
    * Ks2 (Malha wm2=${n.wm2}m): **${(ce=a.Ks2)==null?void 0:ce.toFixed(3)}**
    * Ks3ₑ: **${n.Ks3_electric_int}** (${j(st,n.Ks3_electric_int)})
    * Ks4ₑ (Uw=${n.Uw_electric_int}kV): **${(J=a.Ks4_electric)==null?void 0:J.toFixed(3)}**
* *Cálculo:* PM = ${n.PSPD_electric} × (${(Y=a.Ks1)==null?void 0:Y.toFixed(3)} × ${(r=a.Ks2)==null?void 0:r.toFixed(3)} × ${n.Ks3_electric_int} × ${(C=a.Ks4_electric)==null?void 0:C.toFixed(3)})²
* *Resultado:* **PM = ${(Q=a.PM)==null?void 0:Q.toExponential(3)}**

`),t.has_electric_line&&(l+=`**PU - Danos a seres vivos por choque (Descarga na Linha Elétrica)**
* *Fórmula:* PU = PTU × PEB × PLD × CLD
* *Variáveis:*
    * PTU: **${n.PTU_electric}** (${j(rt,n.PTU_electric)})
    * PEB: **${n.PEB_electric}** (${j(ze,n.PEB_electric)})
    * PLD (ext): **${(ee=n.PLD_electric_ext)==null?void 0:ee.toFixed(2)}**
    * CLD (ext): **${n.CLD_electric_ext}**
* *Cálculo:* PU = ${n.PTU_electric} × ${n.PEB_electric} × ${(me=n.PLD_electric_ext)==null?void 0:me.toFixed(2)} × ${n.CLD_electric_ext}
* *Resultado:* **PU = ${(te=a.PU)==null?void 0:te.toExponential(3)}**

`),l+=`### Etapa — Perdas Consequentes (L) — ${(ae=f[0])==null?void 0:ae.name}

`,l+=`> Resumo: LA (choque), LB (incêndio/pânico) e LC (falha de sistemas) usam fatores normativos (rt, rp, rf, hz, LO) e a fração de tempo/pessoas na zona (tz, nz/nt). Demais perdas usam equivalências LU=LA, LV=LB, LM=LW=LZ=LC.

`,l+=`**LA - Perda por choque elétrico**
* *Fórmula:* LA = rt × 0.01 × (nz / nt) × (tz / 8760) × rs
* *Variáveis:*
    * rt (Resist. Piso): **${s.rt}** (${j(lt,s.rt)})
    * nz (Pessoas na Zona): **${s.nz}**
    * nt (Pessoas Total): **${s.nt}**
    * tz (Tempo na Zona): **${s.tz}** h/ano
    * rs (Tipo Estrutura): **${s.rs}** (${s.rs===1?"Robusta":"Simples"})
* *Cálculo:* LA = ${s.rt} × 0.01 × (${s.nz} / ${s.nt}) × (${s.tz} / 8760) × ${s.rs}
* *Resultado:* **LA = ${(oe=F.LA)==null?void 0:oe.toExponential(3)}**

`,l+=`**LB - Perda por danos físicos (incêndio)**
* *Fórmula:* LB = rs × rp × rf × hz × LF × (nz / nt) × (tz / 8760)
* *Variáveis:*
    * rs (Tipo Estrutura): **${s.rs}** (${s.rs===1?"Robusta":"Simples"})
    * rp (Prot. Incêndio): **${s.rp}** (${j(ct,s.rp)})
    * rf (Risco Incêndio): **${s.rf}** (${j(mt,s.rf)})
    * hz (Pânico): **${s.hz}** (${j(dt,s.hz)})
    * LF (Tipo Dano): **${s.LF}** (${j(pt,s.LF)})
    * nz, nt, tz: **${s.nz}**, **${s.nt}**, **${s.tz}**
* *Cálculo:* LB = ${s.rs} × ${s.rp} × ${s.rf} × ${s.hz} × ${s.LF} × (${s.nz} / ${s.nt}) × (${s.tz} / 8760)
* *Resultado:* **LB = ${(c=F.LB)==null?void 0:c.toExponential(3)}**

`,l+=`**LC - Perda por falha de sistemas**
* *Fórmula:* LC = LO × (nz / nt) × (tz / 8760) × rs
* *Variáveis:*
    * LO (Tipo Falha): **${s.LO}** (${j(ut,s.LO)})
    * nz, nt, tz, rs: **${s.nz}**, **${s.nt}**, **${s.tz}**, **${s.rs}**
* *Cálculo:* LC = ${s.LO} × (${s.nz} / ${s.nt}) × (${s.tz} / 8760) × ${s.rs}
* *Resultado:* **LC = ${(_=F.LC)==null?void 0:_.toExponential(3)}**

`,l+=`**Demais Perdas:** LU=LA, LV=LB, LM=LW=LZ=LC.

`,l+=`### Etapa — Componentes de Risco (R)

`;const v=Object.entries(T).filter(([,h])=>h).map(([h])=>{const o={RA:"RA = Nd × PA × LA",RB:"RB = Nd × PB × LB",RC:"RC = Nd × PC × LC",RM:"RM = Nm × PM × LM",RU:"RU = Nl × PU × LU",RV:"RV = Nl × PV × LV",RW:"RW = Nl × PW × LW",RZ:"RZ = Ni × PZ × LZ"},k=d[h];return`* **${h}:** ${o[h]||"N/A"} -> Resultado: **${k==null?void 0:k.toExponential(3)}**`}).join(`
`);l+=v+`

`,l+=`### Etapa — Frequência de Danos a Sistemas (F)

`,l+=`> Resumo: F = FB + FC + FM + FV + FW + FZ (quando aplicável), com combinação de sistemas internos via PC_total e PM_total.

`,p.FB&&t.frequency_config.has_equipment_in_ZPR0A&&(l+=`**FB - Danos por descarga na estrutura (Equip. ZPR0A)**
* *Fórmula:* FB = Nd × PB
* *Cálculo:* FB = ${(w=i.nd)==null?void 0:w.toExponential(3)} × ${a.PB}
* *Resultado:* **FB = ${(q=p.FB)==null?void 0:q.toExponential(3)}**

`),p.FC&&(l+=`**FC - Danos por descarga na estrutura (Sistemas Internos)**
* *Fórmula:* FC = Nd × PC_total
* *Cálculo:* FC = ${(ne=i.nd)==null?void 0:ne.toExponential(3)} × ${(1-(1-(a.PC||0))*(1-(a.PCT||0))).toFixed(3)}
* *Resultado:* **FC = ${(xe=p.FC)==null?void 0:xe.toExponential(3)}**

`),p.FM&&(l+=`**FM - Danos por descarga próxima (Sistemas Internos)**
* *Fórmula:* FM = Nm × PM_total
* *Cálculo:* FM = ${(he=i.nm)==null?void 0:he.toExponential(3)} × ${(1-(1-(a.PM||0))*(1-(a.PMT||0))).toFixed(3)}
* *Resultado:* **FM = ${(ge=p.FM)==null?void 0:ge.toExponential(3)}**

`),p.FV&&(l+=`**FV - Danos por descarga na linha**
* *Fórmula:* FV = Nlₑ × PEBₑ + Nlₐ × PEBₐ
* *Cálculo:* FV = (${($e=i.nl_electric)==null?void 0:$e.toExponential(3)} × ${a.PEB_electric}) + (${(fe=i.nl_data)==null?void 0:fe.toExponential(3)} × ${a.PEB_data})
* *Resultado:* **FV = ${(Pe=p.FV)==null?void 0:Pe.toExponential(3)}**

`),p.FW&&(l+=`**FW - Danos por surto na linha**
* *Fórmula:* FW = Nlₑ × PW + Nlₐ × PWT
* *Cálculo:* FW = (${(Re=i.nl_electric)==null?void 0:Re.toExponential(3)} × ${(be=a.PW)==null?void 0:be.toExponential(3)}) + (${(Fe=i.nl_data)==null?void 0:Fe.toExponential(3)} × ${(Ce=a.PWT)==null?void 0:Ce.toExponential(3)})
* *Resultado:* **FW = ${(_e=p.FW)==null?void 0:_e.toExponential(3)}**

`),p.FZ&&(l+=`**FZ - Danos por surto induzido na linha**
* *Fórmula:* FZ = Niₑ × PZ + Niₐ × PZT
* *Cálculo:* FZ = (${(ve=i.ni_electric)==null?void 0:ve.toExponential(3)} × ${(Ee=a.PZ)==null?void 0:Ee.toExponential(3)}) + (${(Me=i.ni_data)==null?void 0:Me.toExponential(3)} × ${(m=a.PZT)==null?void 0:m.toExponential(3)})
* *Resultado:* **FZ = ${(R=p.FZ)==null?void 0:R.toExponential(3)}**

`);const E=[];return t.frequency_config.has_equipment_in_ZPR0A&&E.push("FB"),E.push("FC","FM","FV","FW","FZ"),l+=`**F - Frequência Total de Danos**
* *Fórmula:* F = ${E.join(" + ")}
* *Cálculo:* F = ${E.map(h=>{var o;return((o=p[h])==null?void 0:o.toExponential(3))||0}).join(" + ")}
* *Resultado:* **F = ${(b=p.F)==null?void 0:b.toExponential(3)}**

`,l}async function vt(t){var q,ne,xe,he,ge,$e,fe,Pe,Re,be,Fe,Ce,_e,ve,Ee,Me;const{calculations:i,risk_results:a,frequency_results:F}=t,d={dados:1,parametros:2,calculos:3,resultados:4,parecer:5},p=_t(t),n=m=>{var ie,G;const R=Object.entries(m.risks_to_analyze).filter(([,x])=>x).map(([x])=>x),b={R1:1e-5,R3:.001,R4:.001},h=[];R.forEach(x=>{const A=m.risk_results[x]||0,S=b[x];A>S&&h.push(x)});const o=m.frequency_config.is_critical_system?.1:1,k=(((ie=m.frequency_results)==null?void 0:ie.F)||0)>o,I=["RA","RB","RC","RM","RU","RV","RW","RZ"].map(x=>({k:x,v:m.risk_results[x]||0})).sort((x,A)=>A.v-x.v).slice(0,2).map(x=>{var A;return`${String(x.k)} (${(A=x.v)==null?void 0:A.toExponential(2)})`}).join(", "),V=`Este parecer foi elaborado com base na NBR 5419, considerando os riscos selecionados (${R.join(", ")||"nenhum"}) e a frequência de danos aos sistemas.`,Te=`Frequência de Danos (F): **${(((G=m.frequency_results)==null?void 0:G.F)||0).toExponential(3)}**; Limite (FT): **${o.toFixed(1)}** → ${k?"**NÃO ACEITÁVEL**":"**ACEITÁVEL**"}.`,W=R.length?`Riscos totais: ${R.map(x=>`**${x}=${(m.risk_results[x]||0).toExponential(3)}** (RT=${b[x].toExponential(1)})`).join("; ")}.`:"Nenhum risco foi selecionado para análise próxima.",U=`Componentes dominantes observados: ${I}.`,pe=`Recomendações prioritárias:
* Adequar o nível do SPDA (captores, descidas, aterramento) para reduzir PA/PB e efeitos de descargas na estrutura.
* Coordenar DPS (classes I/II/III) em entradas e quadros, nas linhas elétrica e de dados, para reduzir PC/PM e perdas associadas (RC, RM, FC, FM).
* Reforçar malhas de aterramento e equipotencialização, interligando elementos metálicos e melhorando conexões, reduzindo tensões de passo/toque (impacto em LA/LC).
* Otimizar blindagens/roteamento de cabos e separação física, diminuindo acoplamentos (RW/RZ).
* Revisar parâmetros de ocupação e medidas internas (rf, hz, LO) e rotinas operacionais em zonas críticas.`,Z=h.length||k?`Conclusão: Há itens **NÃO ACEITÁVEIS** (${[...h,k?"F":null].filter(Boolean).join(", ")}). Recomenda-se implementar as medidas acima e reprocessar a análise para verificar a redução dos componentes dominantes e a conformidade com os limites.`:"Conclusão: Todos os itens analisados estão **ACEITÁVEIS** frente aos limites. Recomenda-se manter as medidas propostas, documentação e manutenção periódica do sistema.";return[V,Te,W,U,pe,Z].join(`

`)},f=Object.entries(t.risks_to_analyze).filter(([,m])=>m).map(([m],R)=>{var W,U,pe,Z,ie,G,x,A,S;const b=a[m]||0,h={R1:1e-5,R3:.001,R4:.001}[m]||0,o=b<=h,k={R1:"Perda de Vidas Humanas",R3:"Perda de Patrimônio Cultural",R4:"Perda de Valor Econômico"}[m],de=o?"🟢 ✅":"🔴 ❌",P=t.selected_risk_components;let I="",V="";if(m==="R1"){const g=[],u=[];P.RA&&(g.push("RA"),u.push(`${(W=a.RA)==null?void 0:W.toExponential(3)}`)),P.RB&&(g.push("RB"),u.push(`${(U=a.RB)==null?void 0:U.toExponential(3)}`)),P.RC&&(g.push("RC"),u.push(`${(pe=a.RC)==null?void 0:pe.toExponential(3)}`)),P.RM&&(g.push("RM"),u.push(`${(Z=a.RM)==null?void 0:Z.toExponential(3)}`)),P.RU&&(g.push("RU"),u.push(`${((a.RU||0)+(a.RUT||0)).toExponential(3)}`)),P.RV&&(g.push("RV"),u.push(`${((a.RV||0)+(a.RVT||0)).toExponential(3)}`)),P.RW&&(g.push("RW"),u.push(`${((a.RW||0)+(a.RWT||0)).toExponential(3)}`)),P.RZ&&(g.push("RZ"),u.push(`${((a.RZ||0)+(a.RZT||0)).toExponential(3)}`)),I=g.join(" + "),V=`${u.join(" + ")} = ${b.toExponential(3)}`}else if(m==="R3"){const g=[],u=[];P.RB&&(g.push("RB3"),u.push(`${(ie=a.RB3)==null?void 0:ie.toExponential(3)}`)),P.RV&&(g.push("RV3"),u.push(`${((a.RV3||0)+(a.RVT3||0)).toExponential(3)}`)),I=g.join(" + "),V=`${u.join(" + ")} = ${b.toExponential(3)}`}else if(m==="R4"){const g=[],u=[];P.RA&&(g.push("RA4"),u.push(`${(G=a.RA4)==null?void 0:G.toExponential(3)}`)),P.RB&&(g.push("RB4"),u.push(`${(x=a.RB4)==null?void 0:x.toExponential(3)}`)),P.RC&&(g.push("RC4"),u.push(`${(A=a.RC4)==null?void 0:A.toExponential(3)}`)),P.RM&&(g.push("RM4"),u.push(`${(S=a.RM4)==null?void 0:S.toExponential(3)}`)),P.RU&&(g.push("RU4"),u.push(`${((a.RU4||0)+(a.RUT4||0)).toExponential(3)}`)),P.RV&&(g.push("RV4"),u.push(`${((a.RV4||0)+(a.RVT4||0)).toExponential(3)}`)),P.RW&&(g.push("RW4"),u.push(`${((a.RW4||0)+(a.RWT4||0)).toExponential(3)}`)),P.RZ&&(g.push("RZ4"),u.push(`${((a.RZ4||0)+(a.RZT4||0)).toExponential(3)}`)),I=g.join(" + "),V=`${u.join(" + ")} = ${b.toExponential(3)}`}const Te=I?`
* *Composição (${m}):* ${I}
* *Cálculo:* ${V}`:"";return`### ${d.resultados}.${R+1}. Risco ${m} - ${k}
* **Risco Total Calculado (${m}):** **${b.toExponential(3)}**
* **Risco Tolerável (RT):** **${h.toExponential(1)}**
* **Resultado:** ${de} O risco ${m} é **${o?"ACEITÁVEL":"NÃO ACEITÁVEL"}**.${Te}`}).join(`

`),T=t.frequency_config.is_critical_system?.1:1,s=(F.F||0)<=T,l=s?"🟢 ✅":"🔴 ❌",v=m=>{try{return btoa(unescape(encodeURIComponent(m)))}catch{return""}},E=(m,R,b=720,h=300,o)=>{const de=o!=null&&o.showLegend?72:48,P=44,I=8,V=R.length,Te=b-80,W=h-de-P,U=Math.max(10,Math.floor((Te-(V-1)*I)/V)),pe=typeof(o==null?void 0:o.toleranceLine)=="number"?Math.max(o.toleranceLine,0):0,Z=$=>Math.log10(Math.max($,1e-12)),ie=[...R.map($=>$.value),pe].filter($=>$>0),G=Math.max(...ie.map($=>Z($))),x=Math.min(...R.map($=>Z($.value))),A=(o==null?void 0:o.barColor)||"#60A5FA",S=o==null?void 0:o.barColors,g=(o==null?void 0:o.bg)||"#FFFFFF",u="#111827",Je="#475569",De=typeof(o==null?void 0:o.labelAngle)=="number"?o.labelAngle:-35,Ye=`
  <defs>
    <filter id="glowGreen" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="3.2" flood-color="#10B981" flood-opacity="0.45"/>
    </filter>
    <filter id="glowRed" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="3.2" flood-color="#EF4444" flood-opacity="0.45"/>
    </filter>
  </defs>`;let ye="";R.forEach(($,ue)=>{const se=40+ue*(U+I),Le=(Z($.value)-x)/Math.max(G-x,1e-6),re=Math.max(2,Math.floor(Le*W)),K=de+(W-re),je=$.value.toExponential(2),X=S?S[ue%S.length]:A,Be=h-P+18,Ae=se+U/2,Se=X==="#CBD5E1",Ne=$.name==="R Total"||$.name==="F Total",et=Se?' stroke="#94a3b8" stroke-width="1" stroke-dasharray="2 2" fill-opacity="0.25"':Ne?` stroke="${X==="#10B981"?"#065f46":X==="#EF4444"?"#7f1d1d":"#334155"}" stroke-width="3"`:"",tt=Ne?5:3,at=Ne?12:10,ot=Ne?"700":"400";ye+=`
  <rect x="${se}" y="${K}" width="${U}" height="${re}" fill="${X}" rx="${tt}"${et}${Ne?X==="#10B981"?' filter="url(#glowGreen)"':' filter="url(#glowRed)"':""} />`,ye+=`
  <text x="${Ae}" y="${Be}" fill="${u}" font-size="11" text-anchor="${De<0?"end":De>0?"start":"middle"}" transform="rotate(${De} ${Ae} ${Be})">${$.name}</text>`,ye+=`
  <text x="${se+U/2}" y="${K-6}" fill="${u}" font-size="${at}" font-weight="${ot}" text-anchor="middle">${je}</text>`});let Ve="";if(typeof(o==null?void 0:o.toleranceLine)=="number"){const $=Math.max(o.toleranceLine,1e-12),ue=(Z($)-x)/Math.max(G-x,1e-6),se=Math.min(1,Math.max(0,ue)),Le=Math.max(2,Math.floor(se*W)),re=de+(W-Le);Ve=`
  <line x1="40" y1="${re}" x2="${b-40}" y2="${re}" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 3" />`}let we="";if(!!(o!=null&&o.showLegend)&&S&&R.length){const $=typeof(o==null?void 0:o.legendBoxSize)=="number"?Math.max(6,o.legendBoxSize):10,ue=typeof(o==null?void 0:o.legendColGap)=="number"?Math.max(2,o.legendColGap):8,se=typeof(o==null?void 0:o.legendRowGap)=="number"?Math.max(2,o.legendRowGap):8,Le=typeof(o==null?void 0:o.legendFontSize)=="number"?Math.max(8,o.legendFontSize):11,re=Math.min(b-40,Math.max(120,(o==null?void 0:o.legendMaxWidth)||b-40));let K=40,je=46;R.forEach((X,Be)=>{const Ae=S[Be%S.length],Se=Math.min(160,Math.max(40,X.name.length*7));K+$+4+Se>re&&(K=40,je+=$+se),we+=`
  <rect x="${K}" y="${je}" width="${$}" height="${$}" fill="${Ae}" rx="2" />`,we+=`
  <text x="${K+$+6}" y="${je+$-1}" fill="${u}" font-size="${Le}">${X.name}</text>`,K+=$+6+Se+ue})}const Qe=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${b}" height="${h}" viewBox="0 0 ${b} ${h}">
  ${Ye}
  <rect x="0" y="0" width="${b}" height="${h}" fill="${g}"/>
  <text x="40" y="24" fill="${u}" font-size="14" font-weight="bold">${m}</text>
  ${we}
  <line x1="40" y1="${h-P}" x2="${b-40}" y2="${h-P}" stroke="${Je}" stroke-width="1"/>
  ${Ve}
  ${ye}
</svg>`;return`data:image/svg+xml;base64,${v(Qe)}`},M=["RA","RB","RC","RM","RU","RV","RW","RZ"].map(m=>({name:m,value:t.risk_results[m]||1e-12,active:!!t.selected_risk_components[m]})),N=t.risks_to_analyze.R1?"R1":t.risks_to_analyze.R3?"R3":t.risks_to_analyze.R4?"R4":"R1",z=t.risk_results[N]||0,D=[...M.map(m=>({name:m.name,value:m.value})),{name:"R Total",value:z}],H=Object.entries(t.frequency_results||{}).filter(([m])=>m!=="F").map(([m,R])=>({name:m,value:R||0})),ce=["#60A5FA","#A78BFA","#F472B6","#FB7185","#F59E0B","#34D399","#22D3EE","#93C5FD"],J="#CBD5E1",Y=t.risks_to_analyze.R1?1e-5:t.risks_to_analyze.R3||t.risks_to_analyze.R4?.001:1e-5,C=z<=Y?"#10B981":"#EF4444",Q=D.map((m,R)=>{var h;return m.name==="R Total"?C:((h=M[R])==null?void 0:h.active)?ce[R%ce.length]:J}),ee=["#F87171","#60A5FA","#A78BFA","#34D399","#F59E0B","#FB7185","#64748B"],me=E("Componentes de Risco — Global",D,720,300,{barColors:Q,labelAngle:-30,legendMaxWidth:420,toleranceLine:Y}),te=[...H,{name:"F Total",value:((q=t.frequency_results)==null?void 0:q.F)||0}],ae=(((ne=t.frequency_results)==null?void 0:ne.F)||0)<=T,oe="#CBD5E1",c=te.map((m,R)=>{if(m.name==="F Total")return ae?"#10B981":"#EF4444";const b=ee[R%ee.length];return(m.value||0)>0?b:oe}),_=E("Frequência de Danos — Global",te,720,280,{barColors:c,labelAngle:-40,legendFontSize:10,legendMaxWidth:500,toleranceLine:T});return`
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
  * *Resultado:* **Ad = ${(xe=i.ad)==null?void 0:xe.toFixed(2)} m²**
* **Área de Exposição Final (Adf):**
  * *Resultado:* **Adf = ${(he=i.adf)==null?void 0:he.toFixed(2)} m²** (Considerando protrusões)
* **Área de Exposição Próxima (Am):**
  * *Fórmula:* Am = 2×500×(L+W) + π×500²
  * *Cálculo:* Am = 2×500×(${t.l}+${t.w}) + π×500²
  * *Resultado:* **Am = ${(ge=i.am)==null?void 0:ge.toFixed(2)} m²**
* **Linha Elétrica (Al1, Ai1):** **Al1 = ${($e=i.al1)==null?void 0:$e.toFixed(2)} m²**, **Ai1 = ${(fe=i.ai1)==null?void 0:fe.toFixed(2)} m²**
* **Linha de Dados (Al2, Ai2):** **Al2 = ${(Pe=i.al2)==null?void 0:Pe.toFixed(2)} m²**, **Ai2 = ${(Re=i.ai2)==null?void 0:Re.toFixed(2)} m²**

### ${d.calculos}.2. Frequência Média Anual de Eventos Danosos (N)
* **Nd:** Nd = Ng × Adf × Cd × 10⁻⁶ → **${(be=i.nd)==null?void 0:be.toExponential(3)}** eventos/ano
* **Nm:** Nm = Ng × Am × 10⁻⁶ → **${(Fe=i.nm)==null?void 0:Fe.toExponential(3)}** eventos/ano
* **Nl/ Ni (Elétrica):** **Nl = ${(Ce=i.nl_electric)==null?void 0:Ce.toExponential(3)}**, **Ni = ${(_e=i.ni_electric)==null?void 0:_e.toExponential(3)}** eventos/ano
* **Nl/ Ni (Dados):** **Nl = ${(ve=i.nl_data)==null?void 0:ve.toExponential(3)}**, **Ni = ${(Ee=i.ni_data)==null?void 0:Ee.toExponential(3)}** eventos/ano

${p}

## ${d.resultados}. RESULTADOS E CONCLUSÕES

> As figuras são numeradas conforme ABNT: “Figura N — Título”. Escala logarítmica nos gráficos para melhor comparação entre ordens de grandeza.

${f}

### Figura 1 — Componentes de Risco — Global
![Componentes de Risco — Global](${me})


### ${d.resultados}.${Object.values(t.risks_to_analyze).filter(m=>m).length+1}. Frequência de Danos aos Sistemas (F)
* **Frequência Calculada (F):** **${(Me=F.F)==null?void 0:Me.toExponential(3)}** danos/ano
* **Frequência Tolerável (FT):** **${T.toFixed(1)}** danos/ano
* **Resultado:** ${l} A frequência F é **${s?"ACEITÁVEL":"NÃO ACEITÁVEL"}**.

### Figura 2 — Frequência de Danos — Global
![Frequência de Danos — Global](${_})

## ${d.parecer}. PARECER TÉCNICO
${n(t)}

---

## ✅ Responsabilidade Técnica e Conferência Final do Relatório
A **NBR 5419:2025** deve ser utilizada como **fonte principal** para validação dos dados e referência normativa do relatório.

Este aplicativo atua **exclusivamente como ferramenta de apoio** para cálculos e emissão de relatórios, **não isentando o usuário** de sua responsabilidade legal e técnica quanto à **veracidade**, **precisão** e **adequação** das informações fornecidas.

### 🤝 Informações de Contato
* **Autor do Aplicativo:** Engº Júlio César Certo
* **Contato (WhatsApp):** (35) 9 8811-3746
* **E-mail:** julio.certo@hotmail.com

> Ao utilizar este aplicativo, cite a fonte: **Engº Júlio César Certo — Ferramenta de Análise de Risco SPDA NBR 5419**.
`.trim()}const Ie=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),Oe={paragraphFontSizePt:11,paragraphLineHeight:1.35,paragraphMarginTopPx:8,paragraphMarginBottomPx:8,listItemMarginTopPx:4,listItemMarginBottomPx:4,listItemExtraMarginBottomPx:14,listMarginTopPx:8,listMarginBottomPx:12,listPaddingLeftPx:18,h2FontSizeRem:1.25,h2MarginTopPx:16,h2MarginBottomPx:10,h3FontSizeRem:1.1,h3MarginTopPx:12,h3MarginBottomPx:8,figureMarginTopPx:12,figureMarginBottomPx:12},qe=(t,i)=>{if(!t)return"";const F=t.replace(/\\n/g,`
`).split(`
`);let d="",p=!1;for(let n=0;n<F.length;n++){let f=F[n];const T=l=>{let v=Ie(l);return v=v.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),v=v.replace(/(^|[^*])\*(?!\*)([^*]+?)\*(?!\*)/g,(E,B,M)=>`${B}<em>${M}</em>`),v};if(f.trim()==="---"){p&&(d+=`</ul>
`,p=!1),d+=`<hr style="border:0;border-top:1px solid #cbd5e1;margin:12px 0"/>
`;continue}const s=f.trim().match(/^!\[(.*?)\]\((.*?)\)$/);if(s){const[,l,v]=s;p&&(d+=`</ul>
`,p=!1);const E=n+1<F.length?F[n+1].trim():"",B=n-1>=0?F[n-1].trim():"",M=/^(Figura|FIGURA)\s*([0-9]+(?:\.[0-9]+)*)[\.:\-]\s*(.*)$/;let N=null;const z=E.match(M),D=B.match(M);z?(N=`Figura ${z[2]} — ${z[3]}`.trim(),n+=1):D?N=`Figura ${D[2]} — ${D[3]}`.trim():l&&l.trim().length>0&&(N=l.trim());const H=N?`<figcaption>${T(N)}</figcaption>`:"";d+=`<figure style="margin:${i.figureMarginTopPx}px 0 ${i.figureMarginBottomPx}px"><img src="${Ie(v)}" alt="${Ie(l)}" style="max-width:100%;height:auto;border-radius:4px;border:none;display:inline-block;page-break-inside:avoid"/>${H}</figure>
`;continue}if(f.startsWith("> ")){p&&(d+=`</ul>
`,p=!1);const l=T(f.substring(2));d+=`<p style="margin:${i.paragraphMarginTopPx}px 0 ${i.paragraphMarginBottomPx}px;font-size:${i.paragraphFontSizePt}pt;line-height:${i.paragraphLineHeight}">${l}</p>
`;continue}if(f.startsWith("## ")){p&&(d+=`</ul>
`,p=!1),d+=`<h2 style="font-size:${i.h2FontSizeRem}rem;line-height:1.6;font-weight:700;margin:${i.h2MarginTopPx}px 0 ${i.h2MarginBottomPx}px;">${T(f.substring(3))}</h2>
`;continue}if(f.startsWith("### ")){p&&(d+=`</ul>
`,p=!1),d+=`<h3 style="font-size:${i.h3FontSizeRem}rem;line-height:1.5;font-weight:700;margin:${i.h3MarginTopPx}px 0 ${i.h3MarginBottomPx}px;">${T(f.substring(4))}</h3>
`;continue}if(f.trim().startsWith("* ")){p||(d+=`<ul style="margin:${i.listMarginTopPx}px 0 ${i.listMarginBottomPx}px;padding-left:${i.listPaddingLeftPx}px">
`,p=!0);let l=f.trim().substring(2);for(;n+1<F.length&&F[n+1].startsWith("  ");)l+=" "+F[n+1].trim(),n++;const v=l.replace(/\*/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),E=/\bresultado:\b/.test(v),B=/\bcalculo:\b/.test(v),M=E||B?`${Math.max(0,i.listItemMarginTopPx)}px 0 ${i.listItemExtraMarginBottomPx}px`:`${i.listItemMarginTopPx}px 0 ${i.listItemMarginBottomPx}px`;d+=`<li style="margin:${M};font-size:${i.paragraphFontSizePt}pt;line-height:${i.paragraphLineHeight}">${T(l)}</li>
`;continue}if(p&&(d+=`</ul>
`,p=!1),f.trim()){const l=n+1<F.length?F[n+1].trim():"";if(!(/^(Figura|FIGURA)\s*([0-9]+(?:\.[0-9]+)*)[\.:\-]\s*(.*)$/.test(f.trim())&&/^!\[(.*?)\]\((.*?)\)$/.test(l))){const E=f.replace(/\*/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),B=/\bresultado:\b/.test(E),M=/\bcalculo:\b/.test(E),N=B||M?`${i.paragraphMarginTopPx}px 0 ${i.listItemExtraMarginBottomPx}px`:`${i.paragraphMarginTopPx}px 0 ${i.paragraphMarginBottomPx}px`;d+=`<p style="margin:${N};font-size:${i.paragraphFontSizePt}pt;line-height:${i.paragraphLineHeight}">${T(f)}</p>
`}}}return p&&(d+=`</ul>
`),d};function At({data:t,onUpdate:i}){const[a,F]=L.useState(!1),[d,p]=L.useState(""),[n,f]=L.useState(!1),[T,s]=L.useState(22),[l,v]=L.useState(15),[E,B]=L.useState(22),[M,N]=L.useState(6),[z,D]=L.useState(22),[H,ce]=L.useState(6),J="report_format_prefs",Y=()=>{try{const c=localStorage.getItem(J);if(c){const _=JSON.parse(c);return{...Oe,..._}}}catch{}return Oe},[r,C]=L.useState(Y()),[Q,ee]=L.useState(!1),me=async()=>{F(!0),p("");try{const c=await vt(t);p(c)}finally{F(!1)}},te=async()=>{if(!d)return;const c=qe(d,r),_=d.replace(/\!\[[^\]]*\]\([^\)]*\)/g,"").replace(/^###\s+/gm,"").replace(/^##\s+/gm,"").replace(/\*\*(.*?)\*\*/g,"$1").replace(/^>\s+/gm,"").replace(/\n\n+/g,`

`);try{if(typeof window.ClipboardItem<"u"){const w=new window.ClipboardItem({"text/html":new Blob([c],{type:"text/html"}),"text/plain":new Blob([_],{type:"text/plain"})});await navigator.clipboard.write([w])}else await navigator.clipboard.writeText(_);f(!0),setTimeout(()=>f(!1),2e3)}catch{try{await navigator.clipboard.writeText(_)}catch{}f(!0),setTimeout(()=>f(!1),2e3)}},ae=L.useMemo(()=>xt(t),[t.h,t.l,t.w,t.hp,t.ng,t.cd,t.has_electric_line,t.line_sections_1,t.use_adj_structure_1,t.l_adj_1,t.w_adj_1,t.h_adj_1,t.hp_adj_1,t.cd_adj_1,t.has_data_line,t.line_sections_2,t.use_adj_structure_2,t.l_adj_2,t.w_adj_2,t.h_adj_2,t.hp_adj_2,t.cd_adj_2]);L.useMemo(()=>Ue(t.probability_data,t.analyze_data_line_probabilities,t.has_data_line),[t.probability_data,t.analyze_data_line_probabilities,t.has_data_line]);const oe=L.useMemo(()=>t.zones.map(c=>{const _=ht(c),w=Ue(c.probability_data||t.probability_data,t.analyze_data_line_probabilities,t.has_data_line),q=gt(w,c),ne=$t(ae,q,_,t.selected_risk_components);return{zone:c,lossCalculations:_,riskCalculations:ne}}),[t.zones,ae,t.selected_risk_components,t.analyze_data_line_probabilities,t.has_data_line,t.probability_data]);return L.useMemo(()=>ft(oe),[oe]),e.jsxs("div",{children:[e.jsxs(Ze,{children:[e.jsx(He,{className:"p-3",children:e.jsxs(Ge,{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(Xe,{className:"w-5 h-5 text-slate-100"}),"Relatório Técnico Detalhado"]}),d&&!a&&e.jsx(le,{variant:"outline",size:"icon",onClick:()=>p(""),className:"h-8 w-8 flex-shrink-0",children:e.jsx(Pt,{className:"w-4 h-4"})})]})}),d&&!a&&e.jsxs("div",{className:"flex justify-end gap-2 px-2 pb-0",children:[e.jsx(le,{variant:"secondary",size:"sm",onClick:()=>{const c=qe(d,r),_=window.open("","_blank");if(!_)return;const w=Math.max(4,M),q=Math.max(4,H);_.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title></title><style>
@page{margin:${T}mm ${l}mm;}
*{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu; background:#ffffff; color:#111827; margin:0; line-height:1.6;}
main{padding:${w}mm ${l}mm ${q}mm; overflow:visible;}
h2{font-size:${r.h2FontSizeRem}rem; line-height:1.6; color:#0f172a; font-weight:700; margin:${r.h2MarginTopPx}px 0 ${r.h2MarginBottomPx}px; break-inside:avoid; break-after:avoid-page;}
h3{font-size:${r.h3FontSizeRem}rem; line-height:1.5; color:#1f2937; font-weight:700; margin:${r.h3MarginTopPx}px 0 ${r.h3MarginBottomPx}px; break-inside:avoid; break-after:avoid-page;}
ul{margin:${r.listMarginTopPx}px 0 ${r.listMarginBottomPx}px; padding-left:${r.listPaddingLeftPx}px; break-inside:avoid;}
li{break-inside:avoid; font-size:${r.paragraphFontSizePt}pt; line-height:${r.paragraphLineHeight};}
p{margin:${r.paragraphMarginTopPx}px 0 ${r.paragraphMarginBottomPx}px; break-inside:avoid; font-size:${r.paragraphFontSizePt}pt; line-height:${r.paragraphLineHeight};}
img{max-width:100%; height:auto; display:block; page-break-inside:avoid; break-inside:avoid;}
blockquote{margin:8px 0; padding:10px 12px; border-left:3px solid #3b82f6; background:transparent; color:#0f172a; border-radius:6px; break-inside:avoid;}
hr{border:0; border-top:1px solid #cbd5e1; margin:12px 0; break-inside:avoid;}
</style></head><body><main>${c}</main>
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
<\/script></body></html>`),_.document.close(),_.focus(),setTimeout(()=>{try{_.print()}catch{}},300)},children:"Gerar PDF"}),e.jsxs(le,{variant:"secondary",size:"sm",onClick:te,children:[e.jsx(Rt,{className:"w-4 h-4 mr-2"}),n?"Texto copiado!":"Copiar para Word (formatado)"]})]}),e.jsx(Ke,{className:"text-center px-3 pt-0 pb-3",children:e.jsx(nt,{mode:"wait",children:a?e.jsxs(ke.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},className:"flex flex-col items-center justify-center min-h-[10rem]",children:[e.jsx(bt,{className:"w-6 h-6 animate-spin text-blue-400"}),e.jsx("p",{className:"mt-3 text-slate-300",children:"Gerando Relatório..."})]},"loading"):d?e.jsxs(ke.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},className:"text-left pt-4 relative",children:[e.jsxs("div",{className:"mb-3 flex items-center justify-between",children:[e.jsx(le,{variant:"outline",size:"sm",onClick:()=>ee(c=>!c),children:Q?"Ocultar Formatação":"Ajustar Formatação"}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(le,{size:"sm",onClick:()=>{try{localStorage.setItem(J,JSON.stringify(r))}catch{}},children:"Salvar Formatação (Local)"}),e.jsx(le,{variant:"outline",size:"sm",onClick:()=>C(Oe),children:"Restaurar Padrão"})]})]}),Q&&e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 p-3 rounded-md border border-slate-700 bg-slate-800/50",children:[e.jsxs("div",{children:[e.jsx("div",{className:"font-semibold text-sm mb-2",children:"Parágrafo"}),e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(O,{children:"Tamanho (pt)"}),e.jsx(y,{type:"number",step:"0.5",value:r.paragraphFontSizePt,onChange:c=>C({...r,paragraphFontSizePt:Number(c.target.value)})})]}),e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(O,{children:"Line-height"}),e.jsx(y,{type:"number",step:"0.05",value:r.paragraphLineHeight,onChange:c=>C({...r,paragraphLineHeight:Number(c.target.value)})})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(O,{children:"Margem inf. (px)"}),e.jsx(y,{type:"number",value:r.paragraphMarginBottomPx,onChange:c=>C({...r,paragraphMarginBottomPx:Number(c.target.value)})})]})]}),e.jsxs("div",{children:[e.jsx("div",{className:"font-semibold text-sm mb-2",children:"Lista"}),e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(O,{children:"Margem itens (top/bot px)"}),e.jsx(y,{type:"number",value:r.listItemMarginTopPx,onChange:c=>C({...r,listItemMarginTopPx:Number(c.target.value)})}),e.jsx(y,{type:"number",value:r.listItemMarginBottomPx,onChange:c=>C({...r,listItemMarginBottomPx:Number(c.target.value)})})]}),e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(O,{children:"Margem extra após Cálculo/Resultado (px)"}),e.jsx(y,{type:"number",value:r.listItemExtraMarginBottomPx,onChange:c=>C({...r,listItemExtraMarginBottomPx:Number(c.target.value)})})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(O,{children:"Padding esquerdo da lista (px)"}),e.jsx(y,{type:"number",value:r.listPaddingLeftPx,onChange:c=>C({...r,listPaddingLeftPx:Number(c.target.value)})})]})]}),e.jsxs("div",{children:[e.jsx("div",{className:"font-semibold text-sm mb-2",children:"Títulos"}),e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(O,{children:"H2 tamanho (rem)"}),e.jsx(y,{type:"number",step:"0.05",value:r.h2FontSizeRem,onChange:c=>C({...r,h2FontSizeRem:Number(c.target.value)})})]}),e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(O,{children:"H2 margens (top/bot px)"}),e.jsx(y,{type:"number",value:r.h2MarginTopPx,onChange:c=>C({...r,h2MarginTopPx:Number(c.target.value)})}),e.jsx(y,{type:"number",value:r.h2MarginBottomPx,onChange:c=>C({...r,h2MarginBottomPx:Number(c.target.value)})})]}),e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(O,{children:"H3 tamanho (rem)"}),e.jsx(y,{type:"number",step:"0.05",value:r.h3FontSizeRem,onChange:c=>C({...r,h3FontSizeRem:Number(c.target.value)})})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(O,{children:"H3 margens (top/bot px)"}),e.jsx(y,{type:"number",value:r.h3MarginTopPx,onChange:c=>C({...r,h3MarginTopPx:Number(c.target.value)})}),e.jsx(y,{type:"number",value:r.h3MarginBottomPx,onChange:c=>C({...r,h3MarginBottomPx:Number(c.target.value)})})]})]})]}),e.jsx("div",{className:"w-full h-[30rem] overflow-y-auto p-5 rounded-lg border border-slate-700/40 bg-slate-900/50 text-[17px] leading-loose tracking-[0.02em] text-slate-100 focus:outline-none prose-styles",dangerouslySetInnerHTML:{__html:qe(d,r)}})]},"report"):e.jsx(ke.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},children:e.jsxs(le,{onClick:me,disabled:a,className:"w-full max-w-sm mx-auto my-3",children:[e.jsx(Xe,{className:"w-4 h-4 mr-2"}),"Gerar Relatório Técnico da Análise de Risco"]})},"initial")})})]}),e.jsxs(Ze,{className:"mt-4 bg-slate-900/80 border-slate-600/60",children:[e.jsx(He,{className:"p-3",children:e.jsxs(Ge,{className:"flex items-start gap-2",children:[e.jsxs("span",{className:"flex items-start gap-2",children:[e.jsx(Ft,{className:"w-5 h-5 text-green-400 flex-shrink-0"}),e.jsx("span",{className:"text-slate-100 text-sm sm:text-base leading-relaxed text-justify",children:"Responsabilidade Técnica e Conferência Final do Relatório"})]}),e.jsx(Ct,{className:"w-5 h-5 text-yellow-400 flex-shrink-0"})]})}),e.jsxs(Ke,{className:"p-4 space-y-4 text-sm text-slate-200",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsxs("p",{children:["A ",e.jsx("strong",{children:"NBR 5419:2025"})," deve ser utilizada como ",e.jsx("strong",{children:"fonte principal"})," para validação dos dados e referência normativa do relatório."]}),e.jsxs("p",{children:["Este aplicativo atua ",e.jsx("strong",{children:"exclusivamente como uma ferramenta de apoio"})," para cálculos e emissão de relatórios, ",e.jsx("strong",{children:"não isentando o usuário"})," de sua responsabilidade legal e técnica quanto à ",e.jsx("strong",{children:"veracidade"}),", ",e.jsx("strong",{children:"precisão"})," e ",e.jsx("strong",{children:"adequação"})," das informações fornecidas."]})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsx("h3",{className:"font-semibold text-slate-100",children:"🤝 Informações de Contato para Negócios com Eng° Júlio Certo"}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-3",children:[e.jsxs("div",{className:"rounded-md border border-slate-700 p-3 bg-slate-800/60",children:[e.jsx("div",{className:"text-xs text-slate-400",children:"Autor do Aplicativo"}),e.jsx("div",{className:"font-medium",children:"Engº Júlio César Certo"})]}),e.jsxs("div",{className:"rounded-md border border-slate-700 p-3 bg-slate-800/60",children:[e.jsx("div",{className:"text-xs text-slate-400",children:"Contato (WhatsApp)"}),e.jsx("div",{className:"font-medium",children:"(35) 9 8811-3746"})]}),e.jsxs("div",{className:"rounded-md border border-slate-700 p-3 bg-slate-800/60",children:[e.jsx("div",{className:"text-xs text-slate-400",children:"E-mail"}),e.jsx("div",{className:"font-medium",children:"julio.certo@hotmail.com"})]})]}),e.jsx("p",{className:"text-sm text-slate-300",children:"Ao utilizar este aplicativo em estudos ou projetos, cite a fonte: Engº Júlio César Certo — Ferramenta de Análise de Risco SPDA NBR 5419."})]})]})]})]})}export{At as ReportStep};
