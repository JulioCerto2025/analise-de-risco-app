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
2. Criar o arquivo `.env.local` na raiz e definir:
   `VITE_GEMINI_API_KEY=SEU_TOKEN_AQUI`
   - Se a variável não estiver definida, o app continua funcionando e apenas as funções de IA ficam desativadas com mensagens amigáveis.
3. Rodar o app em desenvolvimento:
   `npm run dev`

## Build de Produção

1. Gerar build:
   `npm run build`
2. Pré-visualizar o build:
   `npm run preview`

O projeto usa Vite e React. As dependências são resolvidas via bundler; não há `importmap` externo em produção.
