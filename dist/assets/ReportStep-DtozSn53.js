import{r as S,j as i,A as et,m as je}from"./motion-CZTIYVKD.js";import{P as tt,t as Ie,w as ve,K as at,v as ot,I as nt,R as it,J as st,M as lt,N as rt,O as ct,Q as mt,r as Oe,E as pt,s as dt,G as ut,V as xt,C as qe,a as Ve,b as We,B as Ae,e as Ue}from"./index-CEXXxz2z.js";import{F as He,X as gt,o as ht,L as $t,m as Pt,T as ft}from"./icons-BogGJxPw.js";import"./react-Bzgz95E1.js";import"./charts-CPftjIMm.js";function A(e,t){const a=e.find(P=>String(P.value)===String(t));return a?a.label:`Valor ${t}`}function Rt(e){var I,v,T,F,E,y,j,z,D,x,w,H,k,V,R,C,N,J,oe,Se,le,re,ce,me,pe,de,ue,xe,ge,he,$e,Pe,fe,Re,_e,be,r,_,b;const{calculations:t,probability_calculations:a,loss_calculations:P,risk_results:c,frequency_results:m,probability_data:o,zones:d,selected_risk_components:M}=e,s=((I=d[0])==null?void 0:I.loss_data)||{};let l="";l+=`### Etapa — Probabilidade (P)

`,l+=`> Resumo: PC_total = 1 − (1−PC) × (1−PCT); PM_total = 1 − (1−PM) × (1−PMT). Probabilidades nas linhas utilizam PTU/PV/PW/PZ combinadas com PEB/CLD/PLD conforme NBR 5419.

`,l+=`**PA - Danos a seres vivos por choque (Descarga na Estrutura)**
* *Fórmula:* PA = PTA × PB
* *Variáveis:*
    * PTA: **${o.PTA}** (${A(tt,o.PTA)})
    * PB: **${o.PB}** (${A(Ie,o.PB)})
* *Cálculo:* PA = ${o.PTA} × ${o.PB}
* *Resultado:* **PA = ${(v=a.PA)==null?void 0:v.toExponential(3)}**

`,l+=`**PB - Danos físicos (Descarga na Estrutura)**
* *Fórmula:* PB = PB
* *Variáveis:*
    * PB (Nível do SPDA): **${o.PB}** (${A(Ie,o.PB)})
* *Resultado:* **PB = ${(T=a.PB)==null?void 0:T.toExponential(3)}**

`,e.has_electric_line&&(l+=`**PC - Falha de sistemas (Descarga na Estrutura, Linha Elétrica)**
* *Fórmula:* PC = PSPDₑ × CLDₑ
* *Variáveis:*
    * PSPDₑ: **${o.PSPD_electric}** (${A(ve,o.PSPD_electric)})
    * CLDₑ_int: **${o.CLD_electric_int}**
    * CLDₑ_ext: **${o.CLD_electric_ext}**
* *Cálculo:* PC = ${o.PSPD_electric} × (CLDₑ conforme configuração)
* *Resultado:* **PC = ${(F=a.PC)==null?void 0:F.toExponential(3)}**

`),e.has_data_line&&(l+=`**PCT - Falha de sistemas (Descarga na Estrutura, Linha de Dados)**
* *Fórmula:* PCT = PSPDₐ × CLDₐ
* *Variáveis:*
    * PSPDₐ: **${o.PSPD_data}** (${A(ve,o.PSPD_data)})
    * CLDₐ_int: **${o.CLD_data_int}**
    * CLDₐ_ext: **${o.CLD_data_ext}**
* *Cálculo:* PCT = ${o.PSPD_data} × (CLDₐ conforme configuração)
* *Resultado:* **PCT = ${(E=a.PCT)==null?void 0:E.toExponential(3)}**

`),e.has_electric_line&&(l+=`**PM - Falha de sistemas (Descarga Próxima, Linha Elétrica)**
* *Fórmula:* PM = PSPDₑ × (Ks1 × Ks2 × Ks3ₑ × Ks4ₑ)²
* *Variáveis:*
    * PSPDₑ: **${o.PSPD_electric}** (${A(ve,o.PSPD_electric)})
    * Ks1 (Malha wm1=${o.wm1}m): **${(y=a.Ks1)==null?void 0:y.toFixed(3)}**
    * Ks2 (Malha wm2=${o.wm2}m): **${(j=a.Ks2)==null?void 0:j.toFixed(3)}**
    * Ks3ₑ: **${o.Ks3_electric_int}** (${A(at,o.Ks3_electric_int)})
    * Ks4ₑ (Uw=${o.Uw_electric_int}kV): **${(z=a.Ks4_electric)==null?void 0:z.toFixed(3)}**
* *Cálculo:* PM = ${o.PSPD_electric} × (${(D=a.Ks1)==null?void 0:D.toFixed(3)} × ${(x=a.Ks2)==null?void 0:x.toFixed(3)} × ${o.Ks3_electric_int} × ${(w=a.Ks4_electric)==null?void 0:w.toFixed(3)})²
* *Resultado:* **PM = ${(H=a.PM)==null?void 0:H.toExponential(3)}**

`),e.has_electric_line&&(l+=`**PU - Danos a seres vivos por choque (Descarga na Linha Elétrica)**
* *Fórmula:* PU = PTU × PEB × PLD × CLD
* *Variáveis:*
    * PTU: **${o.PTU_electric}** (${A(ot,o.PTU_electric)})
    * PEB: **${o.PEB_electric}** (${A(ve,o.PEB_electric)})
    * PLD (ext): **${(k=o.PLD_electric_ext)==null?void 0:k.toFixed(2)}**
    * CLD (ext): **${o.CLD_electric_ext}**
* *Cálculo:* PU = ${o.PTU_electric} × ${o.PEB_electric} × ${(V=o.PLD_electric_ext)==null?void 0:V.toFixed(2)} × ${o.CLD_electric_ext}
* *Resultado:* **PU = ${(R=a.PU)==null?void 0:R.toExponential(3)}**

`),l+=`### Etapa — Perdas Consequentes (L) — ${(C=d[0])==null?void 0:C.name}

`,l+=`> Resumo: LA (choque), LB (incêndio/pânico) e LC (falha de sistemas) usam fatores normativos (rt, rp, rf, hz, LO) e a fração de tempo/pessoas na zona (tz, nz/nt). Demais perdas usam equivalências LU=LA, LV=LB, LM=LW=LZ=LC.

`,l+=`**LA - Perda por choque elétrico**
* *Fórmula:* LA = rt × 0.01 × (nz / nt) × (tz / 8760) × rs
* *Variáveis:*
    * rt (Resist. Piso): **${s.rt}** (${A(nt,s.rt)})
    * nz (Pessoas na Zona): **${s.nz}**
    * nt (Pessoas Total): **${s.nt}**
    * tz (Tempo na Zona): **${s.tz}** h/ano
    * rs (Tipo Estrutura): **${s.rs}** (${s.rs===1?"Robusta":"Simples"})
* *Cálculo:* LA = ${s.rt} × 0.01 × (${s.nz} / ${s.nt}) × (${s.tz} / 8760) × ${s.rs}
* *Resultado:* **LA = ${(N=P.LA)==null?void 0:N.toExponential(3)}**

`,l+=`**LB - Perda por danos físicos (incêndio)**
* *Fórmula:* LB = rs × rp × rf × hz × LF × (nz / nt) × (tz / 8760)
* *Variáveis:*
    * rs (Tipo Estrutura): **${s.rs}** (${s.rs===1?"Robusta":"Simples"})
    * rp (Prot. Incêndio): **${s.rp}** (${A(it,s.rp)})
    * rf (Risco Incêndio): **${s.rf}** (${A(st,s.rf)})
    * hz (Pânico): **${s.hz}** (${A(lt,s.hz)})
    * LF (Tipo Dano): **${s.LF}** (${A(rt,s.LF)})
    * nz, nt, tz: **${s.nz}**, **${s.nt}**, **${s.tz}**
* *Cálculo:* LB = ${s.rs} × ${s.rp} × ${s.rf} × ${s.hz} × ${s.LF} × (${s.nz} / ${s.nt}) × (${s.tz} / 8760)
* *Resultado:* **LB = ${(J=P.LB)==null?void 0:J.toExponential(3)}**

`,l+=`**LC - Perda por falha de sistemas**
* *Fórmula:* LC = LO × (nz / nt) × (tz / 8760) × rs
* *Variáveis:*
    * LO (Tipo Falha): **${s.LO}** (${A(ct,s.LO)})
    * nz, nt, tz, rs: **${s.nz}**, **${s.nt}**, **${s.tz}**, **${s.rs}**
* *Cálculo:* LC = ${s.LO} × (${s.nz} / ${s.nt}) × (${s.tz} / 8760) × ${s.rs}
* *Resultado:* **LC = ${(oe=P.LC)==null?void 0:oe.toExponential(3)}**

`,l+=`**Demais Perdas:** LU=LA, LV=LB, LM=LW=LZ=LC.

`,l+=`### Etapa — Componentes de Risco (R)

`;const L=Object.entries(M).filter(([,g])=>g).map(([g])=>{const n={RA:"RA = Nd × PA × LA",RB:"RB = Nd × PB × LB",RC:"RC = Nd × PC × LC",RM:"RM = Nm × PM × LM",RU:"RU = Nl × PU × LU",RV:"RV = Nl × PV × LV",RW:"RW = Nl × PW × LW",RZ:"RZ = Ni × PZ × LZ"},W=c[g];return`* **${g}:** ${n[g]||"N/A"} -> Resultado: **${W==null?void 0:W.toExponential(3)}**`}).join(`
`);l+=L+`

`,l+=`### Etapa — Frequência de Danos a Sistemas (F)

`,l+=`> Resumo: F = FB + FC + FM + FV + FW + FZ (quando aplicável), com combinação de sistemas internos via PC_total e PM_total.

`,m.FB&&e.frequency_config.has_equipment_in_ZPR0A&&(l+=`**FB - Danos por descarga na estrutura (Equip. ZPR0A)**
* *Fórmula:* FB = Nd × PB
* *Cálculo:* FB = ${(Se=t.nd)==null?void 0:Se.toExponential(3)} × ${a.PB}
* *Resultado:* **FB = ${(le=m.FB)==null?void 0:le.toExponential(3)}**

`),m.FC&&(l+=`**FC - Danos por descarga na estrutura (Sistemas Internos)**
* *Fórmula:* FC = Nd × PC_total
* *Cálculo:* FC = ${(re=t.nd)==null?void 0:re.toExponential(3)} × ${(1-(1-(a.PC||0))*(1-(a.PCT||0))).toFixed(3)}
* *Resultado:* **FC = ${(ce=m.FC)==null?void 0:ce.toExponential(3)}**

`),m.FM&&(l+=`**FM - Danos por descarga próxima (Sistemas Internos)**
* *Fórmula:* FM = Nm × PM_total
* *Cálculo:* FM = ${(me=t.nm)==null?void 0:me.toExponential(3)} × ${(1-(1-(a.PM||0))*(1-(a.PMT||0))).toFixed(3)}
* *Resultado:* **FM = ${(pe=m.FM)==null?void 0:pe.toExponential(3)}**

`),m.FV&&(l+=`**FV - Danos por descarga na linha**
* *Fórmula:* FV = Nlₑ × PEBₑ + Nlₐ × PEBₐ
* *Cálculo:* FV = (${(de=t.nl_electric)==null?void 0:de.toExponential(3)} × ${a.PEB_electric}) + (${(ue=t.nl_data)==null?void 0:ue.toExponential(3)} × ${a.PEB_data})
* *Resultado:* **FV = ${(xe=m.FV)==null?void 0:xe.toExponential(3)}**

`),m.FW&&(l+=`**FW - Danos por surto na linha**
* *Fórmula:* FW = Nlₑ × PW + Nlₐ × PWT
* *Cálculo:* FW = (${(ge=t.nl_electric)==null?void 0:ge.toExponential(3)} × ${(he=a.PW)==null?void 0:he.toExponential(3)}) + (${($e=t.nl_data)==null?void 0:$e.toExponential(3)} × ${(Pe=a.PWT)==null?void 0:Pe.toExponential(3)})
* *Resultado:* **FW = ${(fe=m.FW)==null?void 0:fe.toExponential(3)}**

`),m.FZ&&(l+=`**FZ - Danos por surto induzido na linha**
* *Fórmula:* FZ = Niₑ × PZ + Niₐ × PZT
* *Cálculo:* FZ = (${(Re=t.ni_electric)==null?void 0:Re.toExponential(3)} × ${(_e=a.PZ)==null?void 0:_e.toExponential(3)}) + (${(be=t.ni_data)==null?void 0:be.toExponential(3)} × ${(r=a.PZT)==null?void 0:r.toExponential(3)})
* *Resultado:* **FZ = ${(_=m.FZ)==null?void 0:_.toExponential(3)}**

`);const B=[];return e.frequency_config.has_equipment_in_ZPR0A&&B.push("FB"),B.push("FC","FM","FV","FW","FZ"),l+=`**F - Frequência Total de Danos**
* *Fórmula:* F = ${B.join(" + ")}
* *Cálculo:* F = ${B.map(g=>{var n;return((n=m[g])==null?void 0:n.toExponential(3))||0}).join(" + ")}
* *Resultado:* **F = ${(b=m.F)==null?void 0:b.toExponential(3)}**

`,l}async function _t(e){var le,re,ce,me,pe,de,ue,xe,ge,he,$e,Pe,fe,Re,_e,be;const{calculations:t,risk_results:a,frequency_results:P}=e,c={dados:1,parametros:2,calculos:3,resultados:4,parecer:5},m=Rt(e),o=r=>{var ee,Y;const _=Object.entries(r.risks_to_analyze).filter(([,u])=>u).map(([u])=>u),b={R1:1e-5,R3:.001,R4:.001},g=[];_.forEach(u=>{const O=r.risk_results[u]||0,q=b[u];O>q&&g.push(u)});const n=r.frequency_config.is_critical_system?.1:1,W=(((ee=r.frequency_results)==null?void 0:ee.F)||0)>n,U=["RA","RB","RC","RM","RU","RV","RW","RZ"].map(u=>({k:u,v:r.risk_results[u]||0})).sort((u,O)=>O.v-u.v).slice(0,2).map(u=>{var O;return`${String(u.k)} (${(O=u.v)==null?void 0:O.toExponential(2)})`}).join(", "),Z=`Este parecer foi elaborado com base na NBR 5419, considerando os riscos selecionados (${_.join(", ")||"nenhum"}) e a frequência de danos aos sistemas.`,Fe=`Frequência de Danos (F): **${(((Y=r.frequency_results)==null?void 0:Y.F)||0).toExponential(3)}**; Limite (FT): **${n.toFixed(1)}** → ${W?"**NÃO ACEITÁVEL**":"**ACEITÁVEL**"}.`,G=_.length?`Riscos totais: ${_.map(u=>`**${u}=${(r.risk_results[u]||0).toExponential(3)}** (RT=${b[u].toExponential(1)})`).join("; ")}.`:"Nenhum risco foi selecionado para análise próxima.",K=`Componentes dominantes observados: ${U}.`,ie=`Recomendações prioritárias:
* Adequar o nível do SPDA (captores, descidas, aterramento) para reduzir PA/PB e efeitos de descargas na estrutura.
* Coordenar DPS (classes I/II/III) em entradas e quadros, nas linhas elétrica e de dados, para reduzir PC/PM e perdas associadas (RC, RM, FC, FM).
* Reforçar malhas de aterramento e equipotencialização, interligando elementos metálicos e melhorando conexões, reduzindo tensões de passo/toque (impacto em LA/LC).
* Otimizar blindagens/roteamento de cabos e separação física, diminuindo acoplamentos (RW/RZ).
* Revisar parâmetros de ocupação e medidas internas (rf, hz, LO) e rotinas operacionais em zonas críticas.`,X=g.length||W?`Conclusão: Há itens **NÃO ACEITÁVEIS** (${[...g,W?"F":null].filter(Boolean).join(", ")}). Recomenda-se implementar as medidas acima e reprocessar a análise para verificar a redução dos componentes dominantes e a conformidade com os limites.`:"Conclusão: Todos os itens analisados estão **ACEITÁVEIS** frente aos limites. Recomenda-se manter as medidas propostas, documentação e manutenção periódica do sistema.";return[Z,Fe,G,K,ie,X].join(`

`)},d=Object.entries(e.risks_to_analyze).filter(([,r])=>r).map(([r],_)=>{var G,K,ie,X,ee,Y,u,O,q;const b=a[r]||0,g={R1:1e-5,R3:.001,R4:.001}[r]||0,n=b<=g,W={R1:"Perda de Vidas Humanas",R3:"Perda de Patrimônio Cultural",R4:"Perda de Valor Econômico"}[r],ne=n?"🟢 ✅":"🔴 ❌",f=e.selected_risk_components;let U="",Z="";if(r==="R1"){const h=[],p=[];f.RA&&(h.push("RA"),p.push(`${(G=a.RA)==null?void 0:G.toExponential(3)}`)),f.RB&&(h.push("RB"),p.push(`${(K=a.RB)==null?void 0:K.toExponential(3)}`)),f.RC&&(h.push("RC"),p.push(`${(ie=a.RC)==null?void 0:ie.toExponential(3)}`)),f.RM&&(h.push("RM"),p.push(`${(X=a.RM)==null?void 0:X.toExponential(3)}`)),f.RU&&(h.push("RU"),p.push(`${((a.RU||0)+(a.RUT||0)).toExponential(3)}`)),f.RV&&(h.push("RV"),p.push(`${((a.RV||0)+(a.RVT||0)).toExponential(3)}`)),f.RW&&(h.push("RW"),p.push(`${((a.RW||0)+(a.RWT||0)).toExponential(3)}`)),f.RZ&&(h.push("RZ"),p.push(`${((a.RZ||0)+(a.RZT||0)).toExponential(3)}`)),U=h.join(" + "),Z=`${p.join(" + ")} = ${b.toExponential(3)}`}else if(r==="R3"){const h=[],p=[];f.RB&&(h.push("RB3"),p.push(`${(ee=a.RB3)==null?void 0:ee.toExponential(3)}`)),f.RV&&(h.push("RV3"),p.push(`${((a.RV3||0)+(a.RVT3||0)).toExponential(3)}`)),U=h.join(" + "),Z=`${p.join(" + ")} = ${b.toExponential(3)}`}else if(r==="R4"){const h=[],p=[];f.RA&&(h.push("RA4"),p.push(`${(Y=a.RA4)==null?void 0:Y.toExponential(3)}`)),f.RB&&(h.push("RB4"),p.push(`${(u=a.RB4)==null?void 0:u.toExponential(3)}`)),f.RC&&(h.push("RC4"),p.push(`${(O=a.RC4)==null?void 0:O.toExponential(3)}`)),f.RM&&(h.push("RM4"),p.push(`${(q=a.RM4)==null?void 0:q.toExponential(3)}`)),f.RU&&(h.push("RU4"),p.push(`${((a.RU4||0)+(a.RUT4||0)).toExponential(3)}`)),f.RV&&(h.push("RV4"),p.push(`${((a.RV4||0)+(a.RVT4||0)).toExponential(3)}`)),f.RW&&(h.push("RW4"),p.push(`${((a.RW4||0)+(a.RWT4||0)).toExponential(3)}`)),f.RZ&&(h.push("RZ4"),p.push(`${((a.RZ4||0)+(a.RZT4||0)).toExponential(3)}`)),U=h.join(" + "),Z=`${p.join(" + ")} = ${b.toExponential(3)}`}const Fe=U?`
* *Composição (${r}):* ${U}
* *Cálculo:* ${Z}`:"";return`### ${c.resultados}.${_+1}. Risco ${r} - ${W}
* **Risco Total Calculado (${r}):** **${b.toExponential(3)}**
* **Risco Tolerável (RT):** **${g.toExponential(1)}**
* **Resultado:** ${ne} O risco ${r} é **${n?"ACEITÁVEL":"NÃO ACEITÁVEL"}**.${Fe}`}).join(`

`),M=e.frequency_config.is_critical_system?.1:1,s=(P.F||0)<=M,l=s?"🟢 ✅":"🔴 ❌",L=r=>{try{return btoa(unescape(encodeURIComponent(r)))}catch{return""}},B=(r,_,b=720,g=300,n)=>{const ne=n!=null&&n.showLegend?72:48,f=44,U=8,Z=_.length,Fe=b-80,G=g-ne-f,K=Math.max(10,Math.floor((Fe-(Z-1)*U)/Z)),ie=typeof(n==null?void 0:n.toleranceLine)=="number"?Math.max(n.toleranceLine,0):0,X=$=>Math.log10(Math.max($,1e-12)),ee=[..._.map($=>$.value),ie].filter($=>$>0),Y=Math.max(...ee.map($=>X($))),u=Math.min(..._.map($=>X($.value))),O=(n==null?void 0:n.barColor)||"#60A5FA",q=n==null?void 0:n.barColors,h=(n==null?void 0:n.bg)||"#FFFFFF",p="#111827",Ge="#475569",ze=typeof(n==null?void 0:n.labelAngle)=="number"?n.labelAngle:-35,Ke="";let Me="";_.forEach(($,se)=>{const te=40+se*(K+U),Ce=(X($.value)-u)/Math.max(Y-u,1e-6),ae=Math.max(2,Math.floor(Ce*G)),Q=ne+(G-ae),Ee=$.value.toExponential(2),Te=q?q[se%q.length]:O,ye=g-f+18,Be=te+K/2,Le=$.name==="R Total"||$.name==="F Total",Je=0,Ye=Le?12:10,Qe=Le?"700":"400";Me+=`
  <rect x="${te}" y="${Q}" width="${K}" height="${ae}" fill="${Te}" rx="${Je}" />`,Me+=`
  <text x="${Be}" y="${ye}" fill="${p}" font-size="11" text-anchor="${ze<0?"end":ze>0?"start":"middle"}" transform="rotate(${ze} ${Be} ${ye})">${$.name}</text>`,Me+=`
  <text x="${te+K/2}" y="${Q-6}" fill="${p}" font-size="${Ye}" font-weight="${Qe}" text-anchor="middle">${Ee}</text>`});let ke="";if(typeof(n==null?void 0:n.toleranceLine)=="number"){const $=Math.max(n.toleranceLine,1e-12),se=(X($)-u)/Math.max(Y-u,1e-6),te=Math.min(1,Math.max(0,se)),Ce=Math.max(2,Math.floor(te*G)),ae=ne+(G-Ce);ke=`
  <line x1="40" y1="${ae}" x2="${b-40}" y2="${ae}" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 3" />`}let Ne="";if(!!(n!=null&&n.showLegend)&&q&&_.length){const $=typeof(n==null?void 0:n.legendBoxSize)=="number"?Math.max(6,n.legendBoxSize):10,se=typeof(n==null?void 0:n.legendColGap)=="number"?Math.max(2,n.legendColGap):8,te=typeof(n==null?void 0:n.legendRowGap)=="number"?Math.max(2,n.legendRowGap):8,Ce=typeof(n==null?void 0:n.legendFontSize)=="number"?Math.max(8,n.legendFontSize):11,ae=Math.min(b-40,Math.max(120,(n==null?void 0:n.legendMaxWidth)||b-40));let Q=40,Ee=46;_.forEach((Te,ye)=>{const Be=q[ye%q.length],Le=Math.min(160,Math.max(40,Te.name.length*7));Q+$+4+Le>ae&&(Q=40,Ee+=$+te),Ne+=`
  <rect x="${Q}" y="${Ee}" width="${$}" height="${$}" fill="${Be}" rx="2" />`,Ne+=`
  <text x="${Q+$+6}" y="${Ee+$-1}" fill="${p}" font-size="${Ce}">${Te.name}</text>`,Q+=$+6+Le+se})}const Xe=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${b}" height="${g}" viewBox="0 0 ${b} ${g}">
  ${Ke}
  <rect x="0" y="0" width="${b}" height="${g}" fill="${h}"/>
  <text x="40" y="24" fill="${p}" font-size="14" font-weight="bold">${r}</text>
  ${Ne}
  <line x1="40" y1="${g-f}" x2="${b-40}" y2="${g-f}" stroke="${Ge}" stroke-width="1"/>
  ${ke}
  ${Me}
</svg>`;return`data:image/svg+xml;base64,${L(Xe)}`},v=["RA","RB","RC","RM","RU","RV","RW","RZ"].map(r=>({name:r,value:e.risk_results[r]||1e-12,active:!!e.selected_risk_components[r]})),T=e.risks_to_analyze.R1?"R1":e.risks_to_analyze.R3?"R3":e.risks_to_analyze.R4?"R4":"R1",F=e.risk_results[T]||0,E=[...v.map(r=>({name:r.name,value:r.value})),{name:"R Total",value:F}],y=Object.entries(e.frequency_results||{}).filter(([r])=>r!=="F").map(([r,_])=>({name:r,value:_||0})),j=["#60A5FA","#A78BFA","#F472B6","#FB7185","#F59E0B","#34D399","#22D3EE","#93C5FD"],z="#CBD5E1",D=e.risks_to_analyze.R1?1e-5:e.risks_to_analyze.R3||e.risks_to_analyze.R4?.001:1e-5,w=F<=D?"#10B981":"#EF4444",H=E.map((r,_)=>{var g;return r.name==="R Total"?w:((g=v[_])==null?void 0:g.active)?j[_%j.length]:z}),k=["#F87171","#60A5FA","#A78BFA","#34D399","#F59E0B","#FB7185","#64748B"],V=B("Componentes de Risco — Global",E,720,300,{barColors:H,labelAngle:-30,legendMaxWidth:420,toleranceLine:D}),R=[...y,{name:"F Total",value:((le=e.frequency_results)==null?void 0:le.F)||0}],C=(((re=e.frequency_results)==null?void 0:re.F)||0)<=M,N="#CBD5E1",J=R.map((r,_)=>{if(r.name==="F Total")return C?"#10B981":"#EF4444";const b=k[_%k.length];return(r.value||0)>0?b:N}),oe=B("Frequência de Danos — Global",R,720,280,{barColors:J,labelAngle:-40,legendFontSize:10,legendMaxWidth:500,toleranceLine:M});return`
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
  * *Resultado:* **Ad = ${(ce=t.ad)==null?void 0:ce.toFixed(2)} m²**
* **Área de Exposição Final (Adf):**
  * *Resultado:* **Adf = ${(me=t.adf)==null?void 0:me.toFixed(2)} m²** (Considerando protrusões)
* **Área de Exposição Próxima (Am):**
  * *Fórmula:* Am = 2×500×(L+W) + π×500²
  * *Cálculo:* Am = 2×500×(${e.l}+${e.w}) + π×500²
  * *Resultado:* **Am = ${(pe=t.am)==null?void 0:pe.toFixed(2)} m²**
* **Linha Elétrica (Al1, Ai1):** **Al1 = ${(de=t.al1)==null?void 0:de.toFixed(2)} m²**, **Ai1 = ${(ue=t.ai1)==null?void 0:ue.toFixed(2)} m²**
* **Linha de Dados (Al2, Ai2):** **Al2 = ${(xe=t.al2)==null?void 0:xe.toFixed(2)} m²**, **Ai2 = ${(ge=t.ai2)==null?void 0:ge.toFixed(2)} m²**

### ${c.calculos}.2. Frequência Média Anual de Eventos Danosos (N)
* **Nd:** Nd = Ng × Adf × Cd × 10⁻⁶ → **${(he=t.nd)==null?void 0:he.toExponential(3)}** eventos/ano
* **Nm:** Nm = Ng × Am × 10⁻⁶ → **${($e=t.nm)==null?void 0:$e.toExponential(3)}** eventos/ano
* **Nl/ Ni (Elétrica):** **Nl = ${(Pe=t.nl_electric)==null?void 0:Pe.toExponential(3)}**, **Ni = ${(fe=t.ni_electric)==null?void 0:fe.toExponential(3)}** eventos/ano
* **Nl/ Ni (Dados):** **Nl = ${(Re=t.nl_data)==null?void 0:Re.toExponential(3)}**, **Ni = ${(_e=t.ni_data)==null?void 0:_e.toExponential(3)}** eventos/ano

${m}

## ${c.resultados}. RESULTADOS E CONCLUSÕES

> Obs.: Neste relatório final são exibidos somente os gráficos globais, independentemente do número de zonas.

${d}

### Figura 1 — Componentes de Risco — Global
![Componentes de Risco — Global](${V})


### ${c.resultados}.${Object.values(e.risks_to_analyze).filter(r=>r).length+1}. Frequência de Danos aos Sistemas (F)
* **Frequência Calculada (F):** **${(be=P.F)==null?void 0:be.toExponential(3)}** danos/ano
* **Frequência Tolerável (FT):** **${M.toFixed(1)}** danos/ano
* **Resultado:** ${l} A frequência F é **${s?"ACEITÁVEL":"NÃO ACEITÁVEL"}**.

### Figura 2 — Frequência de Danos — Global
![Frequência de Danos — Global](${oe})

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
`.trim()}const De=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),Ze={paragraphFontSizePt:11,paragraphLineHeight:1.35,paragraphMarginTopPx:6,paragraphMarginBottomPx:8,listItemMarginTopPx:4,listItemMarginBottomPx:4,listItemExtraMarginBottomPx:10,blockMarginBetweenItemsPx:20,listMarginTopPx:8,listMarginBottomPx:12,listPaddingLeftPx:18,h2FontSizeRem:1.25,h2MarginTopPx:14,h2MarginBottomPx:10,h3FontSizeRem:1.1,h3MarginTopPx:10,h3MarginBottomPx:8,figureMarginTopPx:10,figureMarginBottomPx:10,emptyLineHeightPx:20},we=(e,t)=>{if(!e)return"";const P=e.replace(/\\n/g,`
`).split(`
`);let c="",m=!1;for(let o=0;o<P.length;o++){let d=P[o];if(d.trim()===""){m?c+=`<li style="list-style:none;margin:${t.listItemMarginTopPx}px 0 ${t.listItemMarginBottomPx}px"><span style="display:inline-block;height:${t.emptyLineHeightPx}px"></span></li>
`:c+=`<p style="margin:${t.emptyLineHeightPx}px 0 ${t.emptyLineHeightPx}px;font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">&nbsp;</p>
`;continue}if(/^\s*\*+\s*$/.test(d))continue;const M=l=>{let L=De(l);return L=L.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),L=L.replace(/(^|[^*])\*(?!\*)([^*]+?)\*(?!\*)/g,(B,I,v)=>`${I}<em>${v}</em>`),L=L.replace(/\*/g,""),L};if(d.trim()==="---"){m&&(c+=`</ul>
`,m=!1),c+=`<hr style="border:0;border-top:1px solid #cbd5e1;margin:12px 0"/>
`;continue}const s=d.trim().match(/^!\[(.*?)\]\((.*?)\)$/);if(s){const[,l,L]=s;m&&(c+=`</ul>
`,m=!1);const B=o+1<P.length?P[o+1].trim():"",I=o-1>=0?P[o-1].trim():"",v=/^(Figura|FIGURA)\s*([0-9]+(?:\.[0-9]+)*)[\.:\-]\s*(.*)$/;let T=null;const F=B.match(v),E=I.match(v);F?(T=`Figura ${F[2]} — ${F[3]}`.trim(),o+=1):E?T=`Figura ${E[2]} — ${E[3]}`.trim():l&&l.trim().length>0&&(T=l.trim());const y=T?`<figcaption>${M(T)}</figcaption>`:"";c+=`<figure style="margin:${t.figureMarginTopPx}px 0 ${t.figureMarginBottomPx}px"><img src="${De(L)}" alt="${De(l)}" style="max-width:100%;height:auto;border-radius:4px;border:none;display:inline-block;page-break-inside:avoid"/>${y}</figure>
`;continue}if(d.startsWith("> ")){m&&(c+=`</ul>
`,m=!1);const l=M(d.substring(2));c+=`<p style="margin:${t.paragraphMarginTopPx}px 0 ${t.paragraphMarginBottomPx}px;font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${l}</p>
`;continue}if(d.startsWith("## ")){m&&(c+=`</ul>
`,m=!1),c+=`<h2 style="font-size:${t.h2FontSizeRem}rem;line-height:1.6;font-weight:700;margin:${t.h2MarginTopPx}px 0 ${t.h2MarginBottomPx}px;">${M(d.substring(3))}</h2>
`;continue}if(d.startsWith("### ")){m&&(c+=`</ul>
`,m=!1),c+=`<h3 style="font-size:${t.h3FontSizeRem}rem;line-height:1.5;font-weight:700;margin:${t.h3MarginTopPx}px 0 ${t.h3MarginBottomPx}px;">${M(d.substring(4))}</h3>
`;continue}if(d.trim().startsWith("* ")){m||(c+=`<ul style="margin:${t.listMarginTopPx}px 0 ${t.listMarginBottomPx}px;padding-left:${t.listPaddingLeftPx}px">
`,m=!0);let l=d.trim().substring(2);for(;o+1<P.length&&P[o+1].startsWith("  ");)l+=" "+P[o+1].trim(),o++;const L=l.replace(/\*/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),B=/\bresultado:\b/.test(L),I=/\bcalculo:\b/.test(L),v=/\bformula:\b/.test(L),T=/^\*\*[^*]+?\*\*:/.test(l.trim()),F=T?t.blockMarginBetweenItemsPx:Math.max(0,t.listItemMarginTopPx),E=T||B||I||v?t.blockMarginBetweenItemsPx:t.listItemMarginBottomPx,y=`${F}px 0 ${E}px`,j=/(F[óo]rmula:|C[áa]lculo:|Resultado:)/gi,z="§§",x=l.replace(j,z+"$1").split(z).filter(w=>w.trim().length>0);if(x.length>1||/:\s*$/.test(l.trim())){let w="";for(const H of x){const k=H.replace(/\*/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),V=/\bresultado:\b/.test(k),R=/\bcalculo:\b/.test(k),C=/\bformula:\b/.test(k),N=V||R||C?`${t.paragraphMarginTopPx}px 0 ${t.listItemExtraMarginBottomPx}px`:`${t.paragraphMarginTopPx}px 0 ${t.paragraphMarginBottomPx}px`;w+=`<p style="margin:${N};font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${M(H)}</p>`,V&&(w+=`<p style="margin:0;height:${t.emptyLineHeightPx}px;line-height:0">&nbsp;</p>`)}c+=`<li style="margin:${y};font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${w}</li>
`}else c+=`<li style="margin:${y};font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${M(l)}</li>
`;continue}if(m&&(c+=`</ul>
`,m=!1),d.trim()){const l=o+1<P.length?P[o+1].trim():"";if(!(/^(Figura|FIGURA)\s*([0-9]+(?:\.[0-9]+)*)[\.:\-]\s*(.*)$/.test(d.trim())&&/^!\[(.*?)\]\((.*?)\)$/.test(l))){const B=/(F[óo]rmula:|C[áa]lculo:|Resultado:)/gi,T=d.replace(B,"§§$1").split("§§").filter(F=>F.trim().length>0);if(T.length>1)for(const F of T){const E=F.replace(/\*/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),y=/\bresultado:\b/.test(E),j=/\bcalculo:\b/.test(E),z=/\bformula:\b/.test(E),D=y||j||z?`${t.paragraphMarginTopPx}px 0 ${t.listItemExtraMarginBottomPx}px`:`${t.paragraphMarginTopPx}px 0 ${t.paragraphMarginBottomPx}px`;c+=`<p style="margin:${D};font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${M(F)}</p>
`,y&&(c+=`<p style="margin:0;height:${t.emptyLineHeightPx}px;line-height:0">&nbsp;</p>
`)}else{const F=d.replace(/\*/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),E=/\bresultado:\b/.test(F),y=/\bcalculo:\b/.test(F),j=/\bformula:\b/.test(F),z=E||y||j?`${t.paragraphMarginTopPx}px 0 ${t.listItemExtraMarginBottomPx}px`:`${t.paragraphMarginTopPx}px 0 ${t.paragraphMarginBottomPx}px`;c+=`<p style="margin:${z};font-size:${t.paragraphFontSizePt}pt;line-height:${t.paragraphLineHeight}">${M(d)}</p>
`,E&&(c+=`<p style="margin:0;height:${t.emptyLineHeightPx}px;line-height:0">&nbsp;</p>
`);const D=o+1<P.length&&P[o+1].trim().startsWith("* ");!E&&D&&(c+=`<p style="margin:0;height:${t.emptyLineHeightPx}px;line-height:0">&nbsp;</p>
`)}}}}return m&&(c+=`</ul>
`),c};function Tt({data:e,onUpdate:t}){const[a,P]=S.useState(!1),[c,m]=S.useState(""),[o,d]=S.useState(!1),[M,s]=S.useState(22),[l,L]=S.useState(15),[B,I]=S.useState(22),[v,T]=S.useState(6),[F,E]=S.useState(22),[y,j]=S.useState(6),z="report_format_prefs",D=()=>{try{const R=localStorage.getItem(z);if(R){const C=JSON.parse(R);return{...Ze,...C}}}catch{}return Ze},[x]=S.useState(D()),w=async()=>{P(!0),m("");try{const R=await _t(e);m(R)}finally{P(!1)}},H=async()=>{if(!c)return;const R=we(c,x),C=c.replace(/\!\[[^\]]*\]\([^\)]*\)/g,"").replace(/^###\s+/gm,"").replace(/^##\s+/gm,"").replace(/\*\*(.*?)\*\*/g,"$1").replace(/^>\s+/gm,"").replace(/\n\n+/g,`

`);try{if(typeof window.ClipboardItem<"u"){const N=new window.ClipboardItem({"text/html":new Blob([R],{type:"text/html"}),"text/plain":new Blob([C],{type:"text/plain"})});await navigator.clipboard.write([N])}else await navigator.clipboard.writeText(C);d(!0),setTimeout(()=>d(!1),2e3)}catch{try{await navigator.clipboard.writeText(C)}catch{}d(!0),setTimeout(()=>d(!1),2e3)}},k=S.useMemo(()=>mt(e),[e.h,e.l,e.w,e.hp,e.ng,e.cd,e.has_electric_line,e.line_sections_1,e.use_adj_structure_1,e.l_adj_1,e.w_adj_1,e.h_adj_1,e.hp_adj_1,e.cd_adj_1,e.has_data_line,e.line_sections_2,e.use_adj_structure_2,e.l_adj_2,e.w_adj_2,e.h_adj_2,e.hp_adj_2,e.cd_adj_2]);S.useMemo(()=>Oe(e.probability_data,e.analyze_data_line_probabilities,e.has_data_line,e.analyze_electric_line_probabilities),[e.probability_data,e.analyze_data_line_probabilities,e.has_data_line,e.analyze_electric_line_probabilities]);const V=S.useMemo(()=>e.zones.map(R=>{const C=pt(R),N=Oe(R.probability_data||e.probability_data,R.analyze_data_line_probabilities??e.analyze_data_line_probabilities,e.has_data_line,R.analyze_electric_line_probabilities??e.analyze_electric_line_probabilities),J=dt(N,R),oe=ut(k,J,C,e.selected_risk_components);return{zone:R,lossCalculations:C,riskCalculations:oe}}),[e.zones,k,e.selected_risk_components,e.has_data_line,e.probability_data]);return S.useMemo(()=>xt(V),[V]),i.jsxs("div",{children:[i.jsxs(qe,{children:[i.jsx(Ve,{className:"p-3",children:i.jsxs(We,{className:"flex items-center justify-between",children:[i.jsxs("div",{className:"flex items-center gap-2",children:[i.jsx(He,{className:"w-5 h-5 text-slate-100"}),"Relatório Técnico Detalhado"]}),c&&!a&&i.jsx(Ae,{variant:"outline",size:"icon",onClick:()=>m(""),className:"h-8 w-8 flex-shrink-0",children:i.jsx(gt,{className:"w-4 h-4"})})]})}),c&&!a&&i.jsxs("div",{className:"flex justify-end gap-2 px-2 pb-0",children:[i.jsx(Ae,{variant:"secondary",size:"sm",onClick:()=>{const R=we(c,x),C=window.open("","_blank");if(!C)return;const N=Math.max(4,v),J=Math.max(4,y);C.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title></title><style>
@page{margin:${M}mm ${l}mm;}
*{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu; background:#ffffff; color:#111827; margin:0; line-height:1.6;}
main{padding:${N}mm ${l}mm ${J}mm; overflow:visible;}
h2{font-size:${x.h2FontSizeRem}rem; line-height:1.6; color:#0f172a; font-weight:700; margin:${x.h2MarginTopPx}px 0 ${x.h2MarginBottomPx}px; break-inside:avoid; break-after:avoid-page;}
h3{font-size:${x.h3FontSizeRem}rem; line-height:1.5; color:#1f2937; font-weight:700; margin:${x.h3MarginTopPx}px 0 ${x.h3MarginBottomPx}px; break-inside:avoid; break-after:avoid-page;}
ul{margin:${x.listMarginTopPx}px 0 ${x.listMarginBottomPx}px; padding-left:${x.listPaddingLeftPx}px; break-inside:avoid;}
li{break-inside:avoid; font-size:${x.paragraphFontSizePt}pt; line-height:${x.paragraphLineHeight};}
p{margin:${x.paragraphMarginTopPx}px 0 ${x.paragraphMarginBottomPx}px; break-inside:avoid; font-size:${x.paragraphFontSizePt}pt; line-height:${x.paragraphLineHeight};}
img{max-width:100%; height:auto; display:block; page-break-inside:avoid; break-inside:avoid;}
blockquote{margin:8px 0; padding:10px 12px; border-left:3px solid #3b82f6; background:transparent; color:#0f172a; border-radius:6px; break-inside:avoid;}
hr{border:0; border-top:1px solid #cbd5e1; margin:12px 0; break-inside:avoid;}
</style></head><body><main>${R}</main>
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
<\/script></body></html>`),C.document.close(),C.focus(),setTimeout(()=>{try{C.print()}catch{}},300)},children:"Gerar PDF"}),i.jsxs(Ae,{variant:"secondary",size:"sm",onClick:H,children:[i.jsx(ht,{className:"w-4 h-4 mr-2"}),o?"Texto copiado!":"Copiar para Word (formatado)"]})]}),i.jsx(Ue,{className:"text-center px-3 pt-0 pb-3",children:i.jsx(et,{mode:"wait",children:a?i.jsxs(je.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},className:"flex flex-col items-center justify-center min-h-[10rem]",children:[i.jsx($t,{className:"w-6 h-6 animate-spin text-blue-400"}),i.jsx("p",{className:"mt-3 text-slate-300",children:"Gerando Relatório..."})]},"loading"):c?i.jsx(je.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},className:"text-left pt-4 relative",children:i.jsx("div",{className:"w-full h-[30rem] overflow-y-auto p-5 rounded-lg border border-slate-700/40 bg-slate-900/50 text-[17px] leading-loose tracking-[0.02em] text-slate-100 focus:outline-none prose-styles",dangerouslySetInnerHTML:{__html:we(c,x)}})},"report"):i.jsx(je.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},children:i.jsxs(Ae,{onClick:w,disabled:a,className:"w-full max-w-sm mx-auto my-3",children:[i.jsx(He,{className:"w-4 h-4 mr-2"}),"Gerar Relatório Técnico da Análise de Risco"]})},"initial")})})]}),i.jsxs(qe,{className:"mt-4 bg-slate-900/80 border-slate-600/60",children:[i.jsx(Ve,{className:"p-3",children:i.jsxs(We,{className:"flex items-start gap-2",children:[i.jsxs("span",{className:"flex items-start gap-2",children:[i.jsx(Pt,{className:"w-5 h-5 text-green-400 flex-shrink-0"}),i.jsx("span",{className:"text-slate-100 text-sm sm:text-base leading-relaxed text-justify",children:"Responsabilidade Técnica e Conferência Final do Relatório"})]}),i.jsx(ft,{className:"w-5 h-5 text-yellow-400 flex-shrink-0"})]})}),i.jsxs(Ue,{className:"p-4 space-y-4 text-sm text-slate-200",children:[i.jsxs("div",{className:"space-y-2",children:[i.jsxs("p",{children:["A ",i.jsx("strong",{children:"NBR 5419:2025"})," deve ser utilizada como ",i.jsx("strong",{children:"fonte principal"})," para validação dos dados e referência normativa do relatório."]}),i.jsxs("p",{children:["Este aplicativo atua ",i.jsx("strong",{children:"exclusivamente como uma ferramenta de apoio"})," para cálculos e emissão de relatórios, ",i.jsx("strong",{children:"não isentando o usuário"})," de sua responsabilidade legal e técnica quanto à ",i.jsx("strong",{children:"veracidade"}),", ",i.jsx("strong",{children:"precisão"})," e ",i.jsx("strong",{children:"adequação"})," das informações fornecidas."]})]}),i.jsxs("div",{className:"space-y-3",children:[i.jsx("h3",{className:"font-semibold text-slate-100",children:"🤝 Informações de Contato para Negócios com Eng° Júlio Certo"}),i.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-3",children:[i.jsxs("div",{className:"rounded-md border border-slate-700 p-3 bg-slate-800/60",children:[i.jsx("div",{className:"text-xs text-slate-400",children:"Autor do Aplicativo"}),i.jsx("div",{className:"font-medium",children:"Engº Júlio César Certo"})]}),i.jsxs("div",{className:"rounded-md border border-slate-700 p-3 bg-slate-800/60",children:[i.jsx("div",{className:"text-xs text-slate-400",children:"Contato (WhatsApp)"}),i.jsx("div",{className:"font-medium",children:"(35) 9 8811-3746"})]}),i.jsxs("div",{className:"rounded-md border border-slate-700 p-3 bg-slate-800/60",children:[i.jsx("div",{className:"text-xs text-slate-400",children:"E-mail"}),i.jsx("div",{className:"font-medium",children:"julio.certo@hotmail.com"})]})]}),i.jsx("p",{className:"text-sm text-slate-300",children:"Ao utilizar este aplicativo em estudos ou projetos, cite a fonte: Engº Júlio César Certo — Ferramenta de Análise de Risco SPDA NBR 5419."})]})]})]})]})}export{Tt as ReportStep};
