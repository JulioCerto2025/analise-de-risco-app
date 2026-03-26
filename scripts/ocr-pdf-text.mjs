import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas } from '@napi-rs/canvas';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPdf = process.argv[2];
const outTxt = process.argv[3] ? path.resolve(process.argv[3]) : path.join(process.cwd(), 'ocr-output.txt');

if (!inputPdf) {
  console.error('Uso: node scripts/ocr-pdf-text.mjs <caminho-pdf> [saida.txt]');
  process.exit(1);
}

async function ocrPdfToText() {
  if (!fs.existsSync(inputPdf)) {
    console.error('PDF não encontrado:', inputPdf);
    process.exit(1);
  }

  const data = new Uint8Array(fs.readFileSync(inputPdf));
  const doc = await pdfjsLib.getDocument({ data, isEvalSupported: false }).promise;
  console.log(`PDF carregado: ${doc.numPages} páginas`);

  const worker = await createWorker({ logger: null });
  await worker.loadLanguage('eng');
  await worker.initialize('eng');

  let fullText = '';

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const scale = 2.0;
    const viewport = page.getViewport({ scale });
    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    const ctx = canvas.getContext('2d');
    const renderContext = { canvasContext: ctx, viewport };
    await page.render(renderContext).promise;

    const dataUrl = canvas.toDataURL('image/png');
    const { data: ocr } = await worker.recognize(dataUrl);
    console.log(`Página ${pageNum}: ${ocr.text.length} caracteres extraídos`);
    fullText += `\n\n=== Página ${pageNum} ===\n` + ocr.text + '\n';
  }

  await worker.terminate();
  fs.writeFileSync(outTxt, fullText, 'utf8');
  console.log('Texto OCR salvo em:', outTxt);
}

ocrPdfToText().catch(err => {
  console.error('Erro no OCR:', err);
  process.exit(1);
});