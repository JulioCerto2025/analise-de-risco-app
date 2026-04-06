import{r as E,j as s,A as tt,m as ze}from"./motion-CZTIYVKD.js";import{P as at,t as Oe,w as Be,K as ot,v as nt,I as st,R as it,J as lt,M as rt,N as ct,O as dt,Q as mt,r as Ve,E as ut,s as pt,G as xt,V as ht,C as Ie,a as We,b as Ue,B as je,e as Ze}from"./index-DF2A9hgL.js";import{F as Ge,X as $t,n as ft,L as gt,l as Rt,T as Pt}from"./icons-ggQqh8om.js";import"./react-Bzgz95E1.js";import"./charts-wPg4HxFZ.js";function F(e,d){const t=e.find(m=>String(m.value)===String(d));return t?t.label:`Valor ${d}`}function _t(e){var W,b,D,N,q,J,Y,Q,U,ee,Z,C,P,L,M,te,Ee,ve,Le,De,se,ie,le,re,ce,de,me,ue,pe,xe,he,$e,fe,ge,Re,Pe,i,g,R;const{calculations:d,probability_calculations:t,loss_calculations:m,risk_results:l,frequency_results:r,probability_data:n,zones:_,selected_risk_components:v}=e,a=((W=_[0])==null?void 0:W.loss_data)||{};let c="";c+=`### Etapa — Probabilidade (P)

`,c+=`> Resumo: PC_total = 1 − (1−PC) × (1−PCT); PM_total = 1 − (1−PM) × (1−PMT). Probabilidades nas linhas utilizam PTU/PV/PW/PZ combinadas com PEB/CLD/PLD conforme NBR 5419.

`,c+=`**PA - Danos a seres vivos por choque (Descarga na Estrutura)**
* *Fórmula:* PA = PTA × PB
* *Variáveis:*
    * PTA: **${n.PTA}** (${F(at,n.PTA)})
    * PB: **${n.PB}** (${F(Oe,n.PB)})
* *Cálculo:* PA = ${n.PTA} × ${n.PB}
* *Resultado:* **PA = ${(b=t.PA)==null?void 0:b.toExponential(3)}**

`,c+=`**PB - Danos físicos (Descarga na Estrutura)**
* *Fórmula:* PB = PB
* *Variáveis:*
    * PB (Nível do SPDA): **${n.PB}** (${F(Oe,n.PB)})
* *Resultado:* **PB = ${(D=t.PB)==null?void 0:D.toExponential(3)}**

`,e.has_electric_line&&(c+=`**PC - Falha de sistemas (Descarga na Estrutura, Linha Elétrica)**
* *Fórmula:* PC = PSPDₑ × CLDₑ
* *Variáveis:*
    * PSPDₑ: **${n.PSPD_electric}** (${F(Be,n.PSPD_electric)})
    * CLDₑ_int: **${n.CLD_electric_int}**
    * CLDₑ_ext: **${n.CLD_electric_ext}**
* *Cálculo:* PC = ${n.PSPD_electric} × (CLDₑ conforme configuração)
* *Resultado:* **PC = ${(N=t.PC)==null?void 0:N.toExponential(3)}**

`),e.has_data_line&&(c+=`**PCT - Falha de sistemas (Descarga na Estrutura, Linha de Dados)**
* *Fórmula:* PCT = PSPDₐ × CLDₐ
* *Variáveis:*
    * PSPDₐ: **${n.PSPD_data}** (${F(Be,n.PSPD_data)})
    * CLDₐ_int: **${n.CLD_data_int}**
    * CLDₐ_ext: **${n.CLD_data_ext}**
* *Cálculo:* PCT = ${n.PSPD_data} × (CLDₐ conforme configuração)
* *Resultado:* **PCT = ${(q=t.PCT)==null?void 0:q.toExponential(3)}**

`),e.has_electric_line&&(c+=`**PM - Falha de sistemas (Descarga Próxima, Linha Elétrica)**
* *Fórmula:* PM = PSPDₑ × (Ks1 × Ks2 × Ks3ₑ × Ks4ₑ)²
* *Variáveis:*
    * PSPDₑ: **${n.PSPD_electric}** (${F(Be,n.PSPD_electric)})
    * Ks1 (Malha wm1=${n.wm1}m): **${(J=t.Ks1)==null?void 0:J.toFixed(3)}**
    * Ks2 (Malha wm2=${n.wm2}m): **${(Y=t.Ks2)==null?void 0:Y.toFixed(3)}**
    * Ks3ₑ: **${n.Ks3_electric_int}** (${F(ot,n.Ks3_electric_int)})
    * Ks4ₑ (Uw=${n.Uw_electric_int}kV): **${(Q=t.Ks4_electric)==null?void 0:Q.toFixed(3)}**
* *Cálculo:* PM = ${n.PSPD_electric} × (${(U=t.Ks1)==null?void 0:U.toFixed(3)} × ${(ee=t.Ks2)==null?void 0:ee.toFixed(3)} × ${n.Ks3_electric_int} × ${(Z=t.Ks4_electric)==null?void 0:Z.toFixed(3)})²
* *Resultado:* **PM = ${(C=t.PM)==null?void 0:C.toExponential(3)}**

`),e.has_electric_line&&(c+=`**PU - Danos a seres vivos por choque (Descarga na Linha Elétrica)**
* *Fórmula:* PU = PTU × PEB × PLD × CLD
* *Variáveis:*
    * PTU: **${n.PTU_electric}** (${F(nt,n.PTU_electric)})
    * PEB: **${n.PEB_electric}** (${F(Be,n.PEB_electric)})
    * PLD (ext): **${(P=n.PLD_electric_ext)==null?void 0:P.toFixed(2)}**
    * CLD (ext): **${n.CLD_electric_ext}**
* *Cálculo:* PU = ${n.PTU_electric} × ${n.PEB_electric} × ${(L=n.PLD_electric_ext)==null?void 0:L.toFixed(2)} × ${n.CLD_electric_ext}
* *Resultado:* **PU = ${(M=t.PU)==null?void 0:M.toExponential(3)}**

`),c+=`### Etapa — Perdas Consequentes (L) — ${(te=_[0])==null?void 0:te.name}

`,c+=`> Resumo: LA (choque), LB (incêndio/pânico) e LC (falha de sistemas) usam fatores normativos (rt, rp, rf, hz, LO) e a fração de tempo/pessoas na zona (tz, nz/nt). Demais perdas usam equivalências LU=LA, LV=LB, LM=LW=LZ=LC.

`,c+=`**LA - Perda por choque elétrico**
* *Fórmula:* LA = rt × 0.01 × (nz / nt) × (tz / 8760) × rs
* *Variáveis:*
    * rt (Resist. Piso): **${a.rt}** (${F(st,a.rt)})
    * nz (Pessoas na Zona): **${a.nz}**
    * nt (Pessoas Total): **${a.nt}**
    * tz (Tempo na Zona): **${a.tz}** h/ano
    * rs (Tipo Estrutura): **${a.rs}** (${a.rs===1?"Robusta":"Simples"})
* *Cálculo:* LA = ${a.rt} × 0.01 × (${a.nz} / ${a.nt}) × (${a.tz} / 8760) × ${a.rs}
* *Resultado:* **LA = ${(Ee=m.LA)==null?void 0:Ee.toExponential(3)}**

`,c+=`**LB - Perda por danos físicos (incêndio)**
* *Fórmula:* LB = rs × rp × rf × hz × LF × (nz / nt) × (tz / 8760)
* *Variáveis:*
    * rs (Tipo Estrutura): **${a.rs}** (${a.rs===1?"Robusta":"Simples"})
    * rp (Prot. Incêndio): **${a.rp}** (${F(it,a.rp)})
    * rf (Risco Incêndio): **${a.rf}** (${F(lt,a.rf)})
    * hz (Pânico): **${a.hz}** (${F(rt,a.hz)})
    * LF (Tipo Dano): **${a.LF}** (${F(ct,a.LF)})
    * nz, nt, tz: **${a.nz}**, **${a.nt}**, **${a.tz}**
* *Cálculo:* LB = ${a.rs} × ${a.rp} × ${a.rf} × ${a.hz} × ${a.LF} × (${a.nz} / ${a.nt}) × (${a.tz} / 8760)
* *Resultado:* **LB = ${(ve=m.LB)==null?void 0:ve.toExponential(3)}**

`,c+=`**LC - Perda por falha de sistemas**
* *Fórmula:* LC = LO × (nz / nt) × (tz / 8760) × rs
* *Variáveis:*
    * LO (Tipo Falha): **${a.LO}** (${F(dt,a.LO)})
    * nz, nt, tz, rs: **${a.nz}**, **${a.nt}**, **${a.tz}**, **${a.rs}**
* *Cálculo:* LC = ${a.LO} × (${a.nz} / ${a.nt}) × (${a.tz} / 8760) × ${a.rs}
* *Resultado:* **LC = ${(Le=m.LC)==null?void 0:Le.toExponential(3)}**

`,c+=`**Demais Perdas:** LU=LA, LV=LB, LM=LW=LZ=LC.

`,c+=`### Etapa — Componentes de Risco (R)

`;const K=Object.entries(v).filter(([,x])=>x).map(([x])=>{const o={RA:"RA = Nd × PA × LA",RB:"RB = Nd × PB × LB",RC:"RC = Nd × PC × LC",RM:"RM = Nm × PM × LM",RU:"RU = Nl × PU × LU",RV:"RV = Nl × PV × LV",RW:"RW = Nl × PW × LW",RZ:"RZ = Ni × PZ × LZ"},B=l[x];return`* **${x}:** ${o[x]||"N/A"} -> Resultado: **${B==null?void 0:B.toExponential(3)}**`}).join(`
`);c+=K+`

`,c+=`### Etapa — Frequência de Danos a Sistemas (F)

`,c+=`> Resumo: F = FB + FC + FM + FV + FW + FZ (quando aplicável), com combinação de sistemas internos via PC_total e PM_total.

`,r.FB&&e.frequency_config.has_equipment_in_ZPR0A&&(c+=`**FB - Danos por descarga na estrutura (Equip. ZPR0A)**
* *Fórmula:* FB = Nd × PB
* *Cálculo:* FB = ${(De=d.nd)==null?void 0:De.toExponential(3)} × ${t.PB}
* *Resultado:* **FB = ${(se=r.FB)==null?void 0:se.toExponential(3)}**

`),r.FC&&(c+=`**FC - Danos por descarga na estrutura (Sistemas Internos)**
* *Fórmula:* FC = Nd × PC_total
* *Cálculo:* FC = ${(ie=d.nd)==null?void 0:ie.toExponential(3)} × ${(1-(1-(t.PC||0))*(1-(t.PCT||0))).toFixed(3)}
* *Resultado:* **FC = ${(le=r.FC)==null?void 0:le.toExponential(3)}**

`),r.FM&&(c+=`**FM - Danos por descarga próxima (Sistemas Internos)**
* *Fórmula:* FM = Nm × PM_total
* *Cálculo:* FM = ${(re=d.nm)==null?void 0:re.toExponential(3)} × ${(1-(1-(t.PM||0))*(1-(t.PMT||0))).toFixed(3)}
* *Resultado:* **FM = ${(ce=r.FM)==null?void 0:ce.toExponential(3)}**

`),r.FV&&(c+=`**FV - Danos por descarga na linha**
* *Fórmula:* FV = Nlₑ × PEBₑ + Nlₐ × PEBₐ
* *Cálculo:* FV = (${(de=d.nl_electric)==null?void 0:de.toExponential(3)} × ${t.PEB_electric}) + (${(me=d.nl_data)==null?void 0:me.toExponential(3)} × ${t.PEB_data})
* *Resultado:* **FV = ${(ue=r.FV)==null?void 0:ue.toExponential(3)}**

`),r.FW&&(c+=`**FW - Danos por surto na linha**
* *Fórmula:* FW = Nlₑ × PW + Nlₐ × PWT
* *Cálculo:* FW = (${(pe=d.nl_electric)==null?void 0:pe.toExponential(3)} × ${(xe=t.PW)==null?void 0:xe.toExponential(3)}) + (${(he=d.nl_data)==null?void 0:he.toExponential(3)} × ${($e=t.PWT)==null?void 0:$e.toExponential(3)})
* *Resultado:* **FW = ${(fe=r.FW)==null?void 0:fe.toExponential(3)}**

`),r.FZ&&(c+=`**FZ - Danos por surto induzido na linha**
* *Fórmula:* FZ = Niₑ × PZ + Niₐ × PZT
* *Cálculo:* FZ = (${(ge=d.ni_electric)==null?void 0:ge.toExponential(3)} × ${(Re=t.PZ)==null?void 0:Re.toExponential(3)}) + (${(Pe=d.ni_data)==null?void 0:Pe.toExponential(3)} × ${(i=t.PZT)==null?void 0:i.toExponential(3)})
* *Resultado:* **FZ = ${(g=r.FZ)==null?void 0:g.toExponential(3)}**

`);const y=[];return e.frequency_config.has_equipment_in_ZPR0A&&y.push("FB"),y.push("FC","FM","FV","FW","FZ"),c+=`**F - Frequência Total de Danos**
* *Fórmula:* F = ${y.join(" + ")}
* *Cálculo:* F = ${y.map(x=>{var o;return((o=r[x])==null?void 0:o.toExponential(3))||0}).join(" + ")}
* *Resultado:* **F = ${(R=r.F)==null?void 0:R.toExponential(3)}**

`,c}async function Ct(e){var se,ie,le,re,ce,de,me,ue,pe,xe,he,$e,fe,ge,Re,Pe;const{calculations:d,risk_results:t,frequency_results:m}=e,l={dados:1,parametros:2,calculos:3,resultados:4,parecer:5},r=_t(e),n=i=>{var G,O;const g=Object.entries(i.risks_to_analyze).filter(([,p])=>p).map(([p])=>p),R={R1:1e-5,R3:.001,R4:.001},x=[];g.forEach(p=>{const A=i.risk_results[p]||0,T=R[p];A>T&&x.push(p)});const o=i.frequency_config.is_critical_system?.1:1,B=(((G=i.frequency_results)==null?void 0:G.F)||0)>o,j=["RA","RB","RC","RM","RU","RV","RW","RZ"].map(p=>({k:p,v:i.risk_results[p]||0})).sort((p,A)=>A.v-p.v).slice(0,2).map(p=>{var A;return`${String(p.k)} (${(A=p.v)==null?void 0:A.toExponential(2)})`}).join(", "),S=`Este parecer foi elaborado com base na NBR 5419, considerando os riscos selecionados (${g.join(", ")||"nenhum"}) e a frequência de danos aos sistemas.`,_e=`Frequência de Danos (F): **${(((O=i.frequency_results)==null?void 0:O.F)||0).toExponential(3)}**; Limite (FT): **${o.toFixed(1)}** → ${B?"**NÃO ACEITÁVEL**":"**ACEITÁVEL**"}.`,z=g.length?`Riscos totais: ${g.map(p=>`**${p}=${(i.risk_results[p]||0).toExponential(3)}** (RT=${R[p].toExponential(1)})`).join("; ")}.`:"Nenhum risco foi selecionado para análise próxima.",w=`Componentes dominantes observados: ${j}.`,oe=`Recomendações prioritárias:
* Adequar o nível do SPDA (captores, descidas, aterramento) para reduzir PA/PB e efeitos de descargas na estrutura.
* Coordenar DPS (classes I/II/III) em entradas e quadros, nas linhas elétrica e de dados, para reduzir PC/PM e perdas associadas (RC, RM, FC, FM).
* Reforçar malhas de aterramento e equipotencialização, interligando elementos metálicos e melhorando conexões, reduzindo tensões de passo/toque (impacto em LA/LC).
* Otimizar blindagens/roteamento de cabos e separação física, diminuindo acoplamentos (RW/RZ).
* Revisar parâmetros de ocupação e medidas internas (rf, hz, LO) e rotinas operacionais em zonas críticas.`,k=x.length||B?`Conclusão: Há itens **NÃO ACEITÁVEIS** (${[...x,B?"F":null].filter(Boolean).join(", ")}). Recomenda-se implementar as medidas acima e reprocessar a análise para verificar a redução dos componentes dominantes e a conformidade com os limites.`:"Conclusão: Todos os itens analisados estão **ACEITÁVEIS** frente aos limites. Recomenda-se manter as medidas propostas, documentação e manutenção periódica do sistema.";return[S,_e,z,w,oe,k].join(`

`)},_=Object.entries(e.risks_to_analyze).filter(([,i])=>i).map(([i],g)=>{var z,w,oe,k,G,O,p,A,T;const R=t[i]||0,x={R1:1e-5,R3:.001,R4:.001}[i]||0,o=R<=x,B={R1:"Perda de Vidas Humanas",R3:"Perda de Patrimônio Cultural",R4:"Perda de Valor Econômico"}[i],ae=o?"🟢 ✅":"🔴 ❌",f=e.selected_risk_components;let j="",S="";if(i==="R1"){const h=[],u=[];f.RA&&(h.push("RA"),u.push(`${(z=t.RA)==null?void 0:z.toExponential(3)}`)),f.RB&&(h.push("RB"),u.push(`${(w=t.RB)==null?void 0:w.toExponential(3)}`)),f.RC&&(h.push("RC"),u.push(`${(oe=t.RC)==null?void 0:oe.toExponential(3)}`)),f.RM&&(h.push("RM"),u.push(`${(k=t.RM)==null?void 0:k.toExponential(3)}`)),f.RU&&(h.push("RU"),u.push(`${((t.RU||0)+(t.RUT||0)).toExponential(3)}`)),f.RV&&(h.push("RV"),u.push(`${((t.RV||0)+(t.RVT||0)).toExponential(3)}`)),f.RW&&(h.push("RW"),u.push(`${((t.RW||0)+(t.RWT||0)).toExponential(3)}`)),f.RZ&&(h.push("RZ"),u.push(`${((t.RZ||0)+(t.RZT||0)).toExponential(3)}`)),j=h.join(" + "),S=`${u.join(" + ")} = ${R.toExponential(3)}`}else if(i==="R3"){const h=[],u=[];f.RB&&(h.push("RB3"),u.push(`${(G=t.RB3)==null?void 0:G.toExponential(3)}`)),f.RV&&(h.push("RV3"),u.push(`${((t.RV3||0)+(t.RVT3||0)).toExponential(3)}`)),j=h.join(" + "),S=`${u.join(" + ")} = ${R.toExponential(3)}`}else if(i==="R4"){const h=[],u=[];f.RA&&(h.push("RA4"),u.push(`${(O=t.RA4)==null?void 0:O.toExponential(3)}`)),f.RB&&(h.push("RB4"),u.push(`${(p=t.RB4)==null?void 0:p.toExponential(3)}`)),f.RC&&(h.push("RC4"),u.push(`${(A=t.RC4)==null?void 0:A.toExponential(3)}`)),f.RM&&(h.push("RM4"),u.push(`${(T=t.RM4)==null?void 0:T.toExponential(3)}`)),f.RU&&(h.push("RU4"),u.push(`${((t.RU4||0)+(t.RUT4||0)).toExponential(3)}`)),f.RV&&(h.push("RV4"),u.push(`${((t.RV4||0)+(t.RVT4||0)).toExponential(3)}`)),f.RW&&(h.push("RW4"),u.push(`${((t.RW4||0)+(t.RWT4||0)).toExponential(3)}`)),f.RZ&&(h.push("RZ4"),u.push(`${((t.RZ4||0)+(t.RZT4||0)).toExponential(3)}`)),j=h.join(" + "),S=`${u.join(" + ")} = ${R.toExponential(3)}`}const _e=j?`
* *Composição (${i}):* ${j}
* *Cálculo:* ${S}`:"";return`### ${l.resultados}.${g+1}. Risco ${i} - ${B}
* **Risco Total Calculado (${i}):** **${R.toExponential(3)}**
* **Risco Tolerável (RT):** **${x.toExponential(1)}**
* **Resultado:** ${ae} O risco ${i} é **${o?"ACEITÁVEL":"NÃO ACEITÁVEL"}**.${_e}`}).join(`

`),v=e.frequency_config.is_critical_system?.1:1,a=(m.F||0)<=v,c=a?"🟢 ✅":"🔴 ❌",K=i=>{try{return btoa(unescape(encodeURIComponent(i)))}catch{return""}},y=(i,g,R=720,x=300,o)=>{const ae=o!=null&&o.showLegend?72:48,f=44,j=8,S=g.length,_e=R-80,z=x-ae-f,w=Math.max(10,Math.floor((_e-(S-1)*j)/S)),oe=typeof(o==null?void 0:o.toleranceLine)=="number"?Math.max(o.toleranceLine,0):0,k=$=>Math.log10(Math.max($,1e-12)),G=[...g.map($=>$.value),oe].filter($=>$>0),O=Math.max(...G.map($=>k($))),p=Math.min(...g.map($=>k($.value))),A=(o==null?void 0:o.barColor)||"#60A5FA",T=o==null?void 0:o.barColors,h=(o==null?void 0:o.bg)||"#FFFFFF",u="#111827",He="#475569",Me=typeof(o==null?void 0:o.labelAngle)=="number"?o.labelAngle:-35,Xe=`
  <defs>
    <filter id="glowGreen" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="3.2" flood-color="#10B981" flood-opacity="0.45"/>
    </filter>
    <filter id="glowRed" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="3.2" flood-color="#EF4444" flood-opacity="0.45"/>
    </filter>
  </defs>`;let Ae="";g.forEach(($,ne)=>{const H=40+ne*(w+j),Ce=(k($.value)-p)/Math.max(O-p,1e-6),X=Math.max(2,Math.floor(Ce*z)),V=ae+(z-X),Fe=$.value.toExponential(2),I=T?T[ne%T.length]:A,Te=x-f+18,ye=H+w/2,Ne=I==="#CBD5E1",be=$.name==="R Total"||$.name==="F Total",Je=Ne?' stroke="#94a3b8" stroke-width="1" stroke-dasharray="2 2" fill-opacity="0.25"':be?` stroke="${I==="#10B981"?"#065f46":I==="#EF4444"?"#7f1d1d":"#334155"}" stroke-width="3"`:"",Ye=be?5:3,Qe=be?12:10,et=be?"700":"400";Ae+=`
  <rect x="${H}" y="${V}" width="${w}" height="${X}" fill="${I}" rx="${Ye}"${Je}${be?I==="#10B981"?' filter="url(#glowGreen)"':' filter="url(#glowRed)"':""} />`,Ae+=`
  <text x="${ye}" y="${Te}" fill="${u}" font-size="11" text-anchor="${Me<0?"end":Me>0?"start":"middle"}" transform="rotate(${Me} ${ye} ${Te})">${$.name}</text>`,Ae+=`
  <text x="${H+w/2}" y="${V-6}" fill="${u}" font-size="${Qe}" font-weight="${et}" text-anchor="middle">${Fe}</text>`});let qe="";if(typeof(o==null?void 0:o.toleranceLine)=="number"){const $=Math.max(o.toleranceLine,1e-12),ne=(k($)-p)/Math.max(O-p,1e-6),H=Math.min(1,Math.max(0,ne)),Ce=Math.max(2,Math.floor(H*z)),X=ae+(z-Ce);qe=`
  <line x1="40" y1="${X}" x2="${R-40}" y2="${X}" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 3" />`}let Se="";if(!!(o!=null&&o.showLegend)&&T&&g.length){const $=typeof(o==null?void 0:o.legendBoxSize)=="number"?Math.max(6,o.legendBoxSize):10,ne=typeof(o==null?void 0:o.legendColGap)=="number"?Math.max(2,o.legendColGap):8,H=typeof(o==null?void 0:o.legendRowGap)=="number"?Math.max(2,o.legendRowGap):8,Ce=typeof(o==null?void 0:o.legendFontSize)=="number"?Math.max(8,o.legendFontSize):11,X=Math.min(R-40,Math.max(120,(o==null?void 0:o.legendMaxWidth)||R-40));let V=40,Fe=46;g.forEach((I,Te)=>{const ye=T[Te%T.length],Ne=Math.min(160,Math.max(40,I.name.length*7));V+$+4+Ne>X&&(V=40,Fe+=$+H),Se+=`
  <rect x="${V}" y="${Fe}" width="${$}" height="${$}" fill="${ye}" rx="2" />`,Se+=`
  <text x="${V+$+6}" y="${Fe+$-1}" fill="${u}" font-size="${Ce}">${I.name}</text>`,V+=$+6+Ne+ne})}const Ke=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${R}" height="${x}" viewBox="0 0 ${R} ${x}">
  ${Xe}
  <rect x="0" y="0" width="${R}" height="${x}" fill="${h}"/>
  <text x="40" y="24" fill="${u}" font-size="14" font-weight="bold">${i}</text>
  ${Se}
  <line x1="40" y1="${x-f}" x2="${R-40}" y2="${x-f}" stroke="${He}" stroke-width="1"/>
  ${qe}
  ${Ae}
</svg>`;return`data:image/svg+xml;base64,${K(Ke)}`},b=["RA","RB","RC","RM","RU","RV","RW","RZ"].map(i=>({name:i,value:e.risk_results[i]||1e-12,active:!!e.selected_risk_components[i]})),D=e.risks_to_analyze.R1?"R1":e.risks_to_analyze.R3?"R3":e.risks_to_analyze.R4?"R4":"R1",N=e.risk_results[D]||0,q=[...b.map(i=>({name:i.name,value:i.value})),{name:"R Total",value:N}],J=Object.entries(e.frequency_results||{}).filter(([i])=>i!=="F").map(([i,g])=>({name:i,value:g||0})),Y=["#60A5FA","#A78BFA","#F472B6","#FB7185","#F59E0B","#34D399","#22D3EE","#93C5FD"],Q="#CBD5E1",U=e.risks_to_analyze.R1?1e-5:e.risks_to_analyze.R3||e.risks_to_analyze.R4?.001:1e-5,Z=N<=U?"#10B981":"#EF4444",C=q.map((i,g)=>{var x;return i.name==="R Total"?Z:((x=b[g])==null?void 0:x.active)?Y[g%Y.length]:Q}),P=["#F87171","#60A5FA","#A78BFA","#34D399","#F59E0B","#FB7185","#64748B"],L=y("Componentes de Risco — Global",q,720,300,{barColors:C,labelAngle:-30,legendMaxWidth:420,toleranceLine:U}),M=[...J,{name:"F Total",value:((se=e.frequency_results)==null?void 0:se.F)||0}],te=(((ie=e.frequency_results)==null?void 0:ie.F)||0)<=v,Ee="#CBD5E1",ve=M.map((i,g)=>{if(i.name==="F Total")return te?"#10B981":"#EF4444";const R=P[g%P.length];return(i.value||0)>0?R:Ee}),Le=y("Frequência de Danos — Global",M,720,280,{barColors:ve,labelAngle:-40,legendFontSize:10,legendMaxWidth:500,toleranceLine:v});return`
**ASSUNTO:** Memorial de Cálculo — Análise de Risco (NBR 5419)

---

## ${l.dados}. DADOS DO PROJETO
* **Projeto/Cliente:** ${e.clientName}
* **Endereço:** ${e.clientAddress}
* **Descrição:** ${e.projectName}
* **Data:** ${e.projectDate}
* **Responsável Técnico:** ${e.technicalManagerName} (${e.licenseNumber})

## ${l.parametros}. PARÂMETROS GERAIS DA ANÁLISE
* **Localização (Cidade/UF):** ${e.location}
* **Densidade de Descargas (Ng):** **${e.ng}** descargas/km²/ano
* **Geometria da Estrutura:** **${e.l}**m (C) × **${e.w}**m (L) × **${e.h}**m (A)
* **Fator de Localização (Cd):** **${e.cd}**

## ${l.calculos}. CÁLCULOS DETALHADOS

### ${l.calculos}.1. Áreas de Exposição Equivalentes
* **Área de Exposição (Ad):**
  * *Fórmula:* Ad = L×W + 2×(3H)×(L+W) + π×(3H)²
  * *Cálculo:* Ad = ${e.l}×${e.w} + 2×(3×${e.h})×(${e.l}+${e.w}) + π×(3×${e.h})²
  * *Resultado:* **Ad = ${(le=d.ad)==null?void 0:le.toFixed(2)} m²**
* **Área de Exposição Final (Adf):**
  * *Resultado:* **Adf = ${(re=d.adf)==null?void 0:re.toFixed(2)} m²** (Considerando protrusões)
* **Área de Exposição Próxima (Am):**
  * *Fórmula:* Am = 2×500×(L+W) + π×500²
  * *Cálculo:* Am = 2×500×(${e.l}+${e.w}) + π×500²
  * *Resultado:* **Am = ${(ce=d.am)==null?void 0:ce.toFixed(2)} m²**
* **Linha Elétrica (Al1, Ai1):** **Al1 = ${(de=d.al1)==null?void 0:de.toFixed(2)} m²**, **Ai1 = ${(me=d.ai1)==null?void 0:me.toFixed(2)} m²**
* **Linha de Dados (Al2, Ai2):** **Al2 = ${(ue=d.al2)==null?void 0:ue.toFixed(2)} m²**, **Ai2 = ${(pe=d.ai2)==null?void 0:pe.toFixed(2)} m²**

### ${l.calculos}.2. Frequência Média Anual de Eventos Danosos (N)
* **Nd:** Nd = Ng × Adf × Cd × 10⁻⁶ → **${(xe=d.nd)==null?void 0:xe.toExponential(3)}** eventos/ano
* **Nm:** Nm = Ng × Am × 10⁻⁶ → **${(he=d.nm)==null?void 0:he.toExponential(3)}** eventos/ano
* **Nl/ Ni (Elétrica):** **Nl = ${($e=d.nl_electric)==null?void 0:$e.toExponential(3)}**, **Ni = ${(fe=d.ni_electric)==null?void 0:fe.toExponential(3)}** eventos/ano
* **Nl/ Ni (Dados):** **Nl = ${(ge=d.nl_data)==null?void 0:ge.toExponential(3)}**, **Ni = ${(Re=d.ni_data)==null?void 0:Re.toExponential(3)}** eventos/ano

${r}

## ${l.resultados}. RESULTADOS E CONCLUSÕES

> As figuras são numeradas conforme ABNT: “Figura N — Título”. Escala logarítmica nos gráficos para melhor comparação entre ordens de grandeza.

${_}

### Figura 1 — Componentes de Risco — Global
![Componentes de Risco — Global](${L})


### ${l.resultados}.${Object.values(e.risks_to_analyze).filter(i=>i).length+1}. Frequência de Danos aos Sistemas (F)
* **Frequência Calculada (F):** **${(Pe=m.F)==null?void 0:Pe.toExponential(3)}** danos/ano
* **Frequência Tolerável (FT):** **${v.toFixed(1)}** danos/ano
* **Resultado:** ${c} A frequência F é **${a?"ACEITÁVEL":"NÃO ACEITÁVEL"}**.

### Figura 2 — Frequência de Danos — Global
![Frequência de Danos — Global](${Le})

## ${l.parecer}. PARECER TÉCNICO
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
`.trim()}const we=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),ke=e=>{if(!e)return"";const t=e.replace(/\\n/g,`
`).split(`
`);let m="",l=!1;for(let r=0;r<t.length;r++){let n=t[r];const _=a=>we(a).replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>");if(n.trim()==="---"){l&&(m+=`</ul>
`,l=!1),m+=`<hr style="border:0;border-top:1px solid #cbd5e1;margin:12px 0"/>
`;continue}const v=n.trim().match(/^!\[(.*?)\]\((.*?)\)$/);if(v){const[,a,c]=v;l&&(m+=`</ul>
`,l=!1);const K=r+1<t.length?t[r+1].trim():"",y=r-1>=0?t[r-1].trim():"",W=/^(Figura|FIGURA)\s*([0-9]+(?:\.[0-9]+)*)[\.:\-]\s*(.*)$/;let b=null;const D=K.match(W),N=y.match(W);D?(b=`Figura ${D[2]} — ${D[3]}`.trim(),r+=1):N?b=`Figura ${N[2]} — ${N[3]}`.trim():a&&a.trim().length>0&&(b=a.trim());const q=b?`<figcaption>${_(b)}</figcaption>`:"";m+=`<figure><img src="${we(c)}" alt="${we(a)}" style="max-width:100%;height:auto;border-radius:4px;border:none;display:inline-block;page-break-inside:avoid"/>${q}</figure>
`;continue}if(n.startsWith("> ")){l&&(m+=`</ul>
`,l=!1);const a=_(n.substring(2));m+=`<p>${a}</p>
`;continue}if(n.startsWith("## ")){l&&(m+=`</ul>
`,l=!1),m+=`<h2 style="font-size:1.25rem;line-height:1.6;font-weight:700;">${_(n.substring(3))}</h2>
`;continue}if(n.startsWith("### ")){l&&(m+=`</ul>
`,l=!1),m+=`<h3 style="font-size:1.1rem;line-height:1.5;font-weight:700;">${_(n.substring(4))}</h3>
`;continue}if(n.trim().startsWith("* ")){l||(m+=`<ul>
`,l=!0);let a=n.trim().substring(2);for(;r+1<t.length&&t[r+1].startsWith("  ");)a+=" "+t[r+1].trim(),r++;m+=`<li>${_(a)}</li>
`;continue}if(l&&(m+=`</ul>
`,l=!1),n.trim()){const a=r+1<t.length?t[r+1].trim():"";/^(Figura|FIGURA)\s*([0-9]+(?:\.[0-9]+)*)[\.:\-]\s*(.*)$/.test(n.trim())&&/^!\[(.*?)\]\((.*?)\)$/.test(a)||(m+=`<p>${_(n)}</p>
`)}}return l&&(m+=`</ul>
`),m};function Nt({data:e,onUpdate:d}){const[t,m]=E.useState(!1),[l,r]=E.useState(""),[n,_]=E.useState(!1),[v,a]=E.useState(22),[c,K]=E.useState(15),[y,W]=E.useState(22),[b,D]=E.useState(6),[N,q]=E.useState(22),[J,Y]=E.useState(6),Q=async()=>{m(!0),r("");try{const C=await Ct(e);r(C)}finally{m(!1)}},U=async()=>{if(!l)return;const C=ke(l),P=l.replace(/\!\[[^\]]*\]\([^\)]*\)/g,"").replace(/^###\s+/gm,"").replace(/^##\s+/gm,"").replace(/\*\*(.*?)\*\*/g,"$1").replace(/^>\s+/gm,"").replace(/\n\n+/g,`

`);try{if(typeof window.ClipboardItem<"u"){const L=new window.ClipboardItem({"text/html":new Blob([C],{type:"text/html"}),"text/plain":new Blob([P],{type:"text/plain"})});await navigator.clipboard.write([L])}else await navigator.clipboard.writeText(P);_(!0),setTimeout(()=>_(!1),2e3)}catch{try{await navigator.clipboard.writeText(P)}catch{}_(!0),setTimeout(()=>_(!1),2e3)}},ee=E.useMemo(()=>mt(e),[e.h,e.l,e.w,e.hp,e.ng,e.cd,e.has_electric_line,e.line_sections_1,e.use_adj_structure_1,e.l_adj_1,e.w_adj_1,e.h_adj_1,e.hp_adj_1,e.cd_adj_1,e.has_data_line,e.line_sections_2,e.use_adj_structure_2,e.l_adj_2,e.w_adj_2,e.h_adj_2,e.hp_adj_2,e.cd_adj_2]);E.useMemo(()=>Ve(e.probability_data,e.analyze_data_line_probabilities,e.has_data_line),[e.probability_data,e.analyze_data_line_probabilities,e.has_data_line]);const Z=E.useMemo(()=>e.zones.map(C=>{const P=ut(C),L=Ve(C.probability_data||e.probability_data,e.analyze_data_line_probabilities,e.has_data_line),M=pt(L,C),te=xt(ee,M,P,e.selected_risk_components);return{zone:C,lossCalculations:P,riskCalculations:te}}),[e.zones,ee,e.selected_risk_components,e.analyze_data_line_probabilities,e.has_data_line,e.probability_data]);return E.useMemo(()=>ht(Z),[Z]),s.jsxs("div",{children:[s.jsxs(Ie,{children:[s.jsx(We,{className:"p-3",children:s.jsxs(Ue,{className:"flex items-center justify-between",children:[s.jsxs("div",{className:"flex items-center gap-2",children:[s.jsx(Ge,{className:"w-5 h-5 text-slate-100"}),"Relatório Técnico Detalhado"]}),l&&!t&&s.jsx(je,{variant:"outline",size:"icon",onClick:()=>r(""),className:"h-8 w-8 flex-shrink-0",children:s.jsx($t,{className:"w-4 h-4"})})]})}),l&&!t&&s.jsxs("div",{className:"flex justify-end gap-2 px-2 pb-0",children:[s.jsx(je,{variant:"secondary",size:"sm",onClick:()=>{const C=ke(l),P=window.open("","_blank");if(!P)return;const L=Math.max(4,b),M=Math.max(4,J);P.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title></title><style>
@page{margin:${v}mm ${c}mm;}
*{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu; background:#ffffff; color:#111827; margin:0; line-height:1.6;}
main{padding:${L}mm ${c}mm ${M}mm; overflow:visible;}
h2{font-size:20px; line-height:1.6; color:#0f172a; font-weight:700; margin:16px 0 10px; break-inside:avoid; break-after:avoid-page;}
h3{font-size:18px; line-height:1.5; color:#1f2937; font-weight:700; margin:12px 0 8px; break-inside:avoid; break-after:avoid-page;}
ul{margin:8px 0 12px; padding-left:18px; break-inside:avoid;}
li{break-inside:avoid;}
p{margin:8px 0; break-inside:avoid;}
img{max-width:100%; height:auto; display:block; page-break-inside:avoid; break-inside:avoid;}
blockquote{margin:8px 0; padding:10px 12px; border-left:3px solid #3b82f6; background:transparent; color:#0f172a; border-radius:6px; break-inside:avoid;}
hr{border:0; border-top:1px solid #cbd5e1; margin:12px 0; break-inside:avoid;}
</style></head><body><main>${C}</main>
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
<\/script></body></html>`),P.document.close(),P.focus(),setTimeout(()=>{try{P.print()}catch{}},300)},children:"Gerar PDF"}),s.jsxs(je,{variant:"secondary",size:"sm",onClick:U,children:[s.jsx(ft,{className:"w-4 h-4 mr-2"}),n?"Texto copiado!":"Copiar para Word (formatado)"]})]}),s.jsx(Ze,{className:"text-center px-3 pt-0 pb-3",children:s.jsx(tt,{mode:"wait",children:t?s.jsxs(ze.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},className:"flex flex-col items-center justify-center min-h-[10rem]",children:[s.jsx(gt,{className:"w-6 h-6 animate-spin text-blue-400"}),s.jsx("p",{className:"mt-3 text-slate-300",children:"Gerando Relatório..."})]},"loading"):l?s.jsx(ze.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},className:"text-left pt-4 relative",children:s.jsx("div",{className:"w-full h-[30rem] overflow-y-auto p-5 rounded-lg border border-slate-700/40 bg-slate-900/50 text-[17px] leading-loose tracking-[0.02em] text-slate-100 focus:outline-none prose-styles",dangerouslySetInnerHTML:{__html:ke(l)}})},"report"):s.jsx(ze.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},children:s.jsxs(je,{onClick:Q,disabled:t,className:"w-full max-w-sm mx-auto my-3",children:[s.jsx(Ge,{className:"w-4 h-4 mr-2"}),"Gerar Relatório Técnico da Análise de Risco"]})},"initial")})})]}),s.jsxs(Ie,{className:"mt-4 bg-slate-900/80 border-slate-600/60",children:[s.jsx(We,{className:"p-3",children:s.jsxs(Ue,{className:"flex items-start gap-2",children:[s.jsxs("span",{className:"flex items-start gap-2",children:[s.jsx(Rt,{className:"w-5 h-5 text-green-400 flex-shrink-0"}),s.jsx("span",{className:"text-slate-100 text-sm sm:text-base leading-relaxed text-justify",children:"Responsabilidade Técnica e Conferência Final do Relatório"})]}),s.jsx(Pt,{className:"w-5 h-5 text-yellow-400 flex-shrink-0"})]})}),s.jsxs(Ze,{className:"p-4 space-y-4 text-sm text-slate-200",children:[s.jsxs("div",{className:"space-y-2",children:[s.jsxs("p",{children:["A ",s.jsx("strong",{children:"NBR 5419:2025"})," deve ser utilizada como ",s.jsx("strong",{children:"fonte principal"})," para validação dos dados e referência normativa do relatório."]}),s.jsxs("p",{children:["Este aplicativo atua ",s.jsx("strong",{children:"exclusivamente como uma ferramenta de apoio"})," para cálculos e emissão de relatórios, ",s.jsx("strong",{children:"não isentando o usuário"})," de sua responsabilidade legal e técnica quanto à ",s.jsx("strong",{children:"veracidade"}),", ",s.jsx("strong",{children:"precisão"})," e ",s.jsx("strong",{children:"adequação"})," das informações fornecidas."]})]}),s.jsxs("div",{className:"space-y-3",children:[s.jsx("h3",{className:"font-semibold text-slate-100",children:"🤝 Informações de Contato para Negócios com Eng° Júlio Certo"}),s.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-3",children:[s.jsxs("div",{className:"rounded-md border border-slate-700 p-3 bg-slate-800/60",children:[s.jsx("div",{className:"text-xs text-slate-400",children:"Autor do Aplicativo"}),s.jsx("div",{className:"font-medium",children:"Engº Júlio César Certo"})]}),s.jsxs("div",{className:"rounded-md border border-slate-700 p-3 bg-slate-800/60",children:[s.jsx("div",{className:"text-xs text-slate-400",children:"Contato (WhatsApp)"}),s.jsx("div",{className:"font-medium",children:"(35) 9 8811-3746"})]}),s.jsxs("div",{className:"rounded-md border border-slate-700 p-3 bg-slate-800/60",children:[s.jsx("div",{className:"text-xs text-slate-400",children:"E-mail"}),s.jsx("div",{className:"font-medium",children:"julio.certo@hotmail.com"})]})]}),s.jsx("p",{className:"text-sm text-slate-300",children:"Ao utilizar este aplicativo em estudos ou projetos, cite a fonte: Engº Júlio César Certo — Ferramenta de Análise de Risco SPDA NBR 5419."})]})]})]})]})}export{Nt as ReportStep};
