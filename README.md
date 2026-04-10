<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Executar e Publicar o App de Análise de Risco

This contains everything you need to run your app locally.

Visualize seu app no AI Studio: https://ai.studio/apps/drive/1X-_lr1QRtCgsmPyp6_TxlDGoGe-7HuDg

## Rodar Localmente

**Pré-requisitos:** Node.js LTS

1. Instalar dependências:
   `npm install`
2. Não são necessárias chaves de API externas (100% Local-First).
3. Rodar o app em desenvolvimento:
   `npm run dev`

## Build de Produção

1. Gerar build:
   `npm run build`
2. Pré-visualizar o build:
   `npm run preview`

O projeto usa Vite e React. As dependências são resolvidas via bundler; não há `importmap` externo em produção.

## Mudanças recentes (Versão de Estabilização 2026)

- **Remoção Total de Dependências Gemini/IA**: O arquivo `lib/geminiService.ts` foi deletado.
- **Geração de Relatórios Local**: A função `generateFullReportText` agora é 100% local (via `lib/reportBuilder.ts`), eliminando riscos de queda de rede ou erros de API no fechamento do projeto.
- **Heurísticas Locais**: Sugestões de população e risco de incêndio agora usam lógica determinística local, garantindo performance e confiabilidade audital.
- **Estabilização do Build**: Removidos imports órfãos e corrigidas referências circulares para garantir deploy via Vercel sem travamentos.

Esta versão é focada em **estabilidade profissional** e está pronta para auditoria NBR 5419:2026 sem dependências externas de processamento inteligente.

**Engº Júlio César Certo — Especialista em PDA**
