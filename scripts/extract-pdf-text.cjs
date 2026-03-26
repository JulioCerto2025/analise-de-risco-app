// Simple PDF text extractor using pdf-parse
// Usage: node scripts/extract-pdf-text.cjs <inputPdfPath> [outputTxtPath]

const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

async function main() {
  const input = process.argv[2];
  const outputArg = process.argv[3];
  if (!input) {
    console.error('Erro: informe o caminho do PDF.');
    console.error('Exemplo: node scripts/extract-pdf-text.cjs data/nbr5419-2015-exemplo.pdf');
    process.exit(1);
  }
  const inPath = path.resolve(input);
  if (!fs.existsSync(inPath)) {
    console.error('Arquivo não encontrado:', inPath);
    process.exit(1);
  }
  const outPath = path.resolve(outputArg || inPath.replace(/\.pdf$/i, '.txt'));
  try {
    const buf = fs.readFileSync(inPath);
    const result = await pdfParse(buf);
    const text = String(result.text || '').trim();
    fs.writeFileSync(outPath, text, 'utf8');
    console.log('Extração concluída. Texto salvo em:', outPath);
    console.log('Diagnóstico: páginas =', result.numpages, 'info =', result.info && result.info.Title ? result.info.Title : '(sem título)', 'texto chars =', text.length);
  } catch (e) {
    console.error('Falha ao extrair texto do PDF:', e && e.message ? e.message : e);
    process.exit(2);
  }
}

main();