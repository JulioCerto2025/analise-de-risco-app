import { createWorker, Worker } from 'tesseract.js';

let worker: Worker | null = null;
let initPromise: Promise<void> | null = null;

const getWorker = async (): Promise<Worker> => {
  try {
    if (!worker) {
      worker = createWorker({ logger: () => {} });
    }
    if (!initPromise) {
      initPromise = (async () => {
        await worker!.loadLanguage('eng');
        await worker!.initialize('eng');
      })();
    }
    await initPromise;
    return worker!;
  } catch (e) {
    // If initialization fails, reset so future attempts can try again
    worker = null;
    initPromise = null;
    throw e;
  }
};

export type OCRBox = { text: string; x: number; y: number; w: number; h: number; conf: number };

// Run OCR on a canvas element (or data URL) and return word boxes
export async function ocrWordsFromSource(source: HTMLCanvasElement | string): Promise<OCRBox[]> {
  try {
    const worker = await getWorker();
    const { data } = await worker.recognize(source);
    const boxes: OCRBox[] = [];
    for (const w of data.words || []) {
      boxes.push({ text: (w.text || '').trim(), x: w.bbox.x0, y: w.bbox.y0, w: w.bbox.x1 - w.bbox.x0, h: w.bbox.y1 - w.bbox.y0, conf: w.conf || 0 });
    }
    return boxes;
  } catch (_) {
    return [];
  }
}

export function parseDegrees(value: string): number | null {
  // Accept formats like "-26.5°", "-48.0", "26.5", etc.
  const m = value.match(/-?\d+(?:\.\d+)?/);
  if (!m) return null;
  return parseFloat(m[0]);
}