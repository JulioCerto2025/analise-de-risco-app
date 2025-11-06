import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Label, Input } from '../ui';
import { ocrWordsFromSource } from '../../lib/ocr';

function reconstructTextFromBoxes(boxes: { text: string; x: number; y: number; w: number; h: number; conf: number }[]): string {
  // Group words into lines by y proximity, then sort by x
  const lines: { y: number; words: { x: number; text: string }[] }[] = [];
  const yTolerance = 6; // pixels
  for (const b of boxes) {
    if (!b.text) continue;
    let line = lines.find(l => Math.abs(l.y - b.y) <= yTolerance);
    if (!line) {
      line = { y: b.y, words: [] };
      lines.push(line);
    }
    line.words.push({ x: b.x, text: b.text });
  }
  // Sort lines by y, then words by x, join
  lines.sort((a, b) => a.y - b.y);
  return lines.map(l => l.words.sort((a, b) => a.x - b.x).map(w => w.text).join(' ')).join('\n');
}

export const PdfOcrViewer: React.FC = () => {
  const [status, setStatus] = useState<'idle'|'loading'|'done'|'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [scale, setScale] = useState(2);
  const [sourceType, setSourceType] = useState<'upload'|'url'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const objectUrlRef = useRef<string | null>(null);

  const resolvedSrc = (() => {
    if (sourceType === 'upload' && file) {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = URL.createObjectURL(file);
      return objectUrlRef.current;
    }
    if (sourceType === 'url' && url.trim()) return url.trim();
    return null;
  })();

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        if (!resolvedSrc) { setStatus('idle'); setError(null); setText(''); return; }
        setStatus('loading');
        setError(null);
        const pdfjsLib: any = await import('pdfjs-dist/legacy/build/pdf.mjs');
        // Use CDN worker to avoid bundling issues
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.js';
        const loadingTask = pdfjsLib.getDocument(resolvedSrc);
        const pdf = await loadingTask.promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale });
          // Create canvas
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d', { willReadFrequently: true })!;
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const renderTask = page.render({ canvasContext: context, viewport });
          await renderTask.promise;
          const boxes = await ocrWordsFromSource(canvas);
          const pageText = reconstructTextFromBoxes(boxes);
          fullText += (fullText ? '\n\n' : '') + pageText;
        }
        if (!cancelled) {
          setText(fullText);
          setStatus('done');
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(String(e?.message || e));
          setStatus('error');
        }
      }
    }
    run();
    return () => { cancelled = true; };
  }, [resolvedSrc, scale]);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>OCR de PDF</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <Label>Fonte</Label>
          <Button variant={sourceType==='upload' ? 'secondary' : 'outline'} size="sm" onClick={() => setSourceType('upload')}>Arquivo</Button>
          <Button variant={sourceType==='url' ? 'secondary' : 'outline'} size="sm" onClick={() => setSourceType('url')}>URL</Button>
        </div>
        {sourceType === 'upload' ? (
          <div className="flex items-center gap-3">
            <Input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full" />
            <Button onClick={() => setScale(s => s)} disabled={!file}>Processar</Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Input type="text" placeholder="https://…/arquivo.pdf" value={url} onChange={e => setUrl(e.target.value)} className="w-full" />
            <Button onClick={() => setScale(s => s)} disabled={!url.trim()}>Processar</Button>
          </div>
        )}
        <div className="flex items-center gap-3">
          <Label>Escala</Label>
          <Input type="number" value={scale} onChange={e => setScale(Number(e.target.value) || 2)} className="w-24" />
          <Button onClick={() => setScale(s => s)} disabled={!resolvedSrc}>Reprocessar</Button>
        </div>
        {status === 'idle' && <div className="text-slate-300">Selecione um PDF ou informe uma URL para iniciar.</div>}
        {status === 'loading' && <div className="text-slate-300">Processando páginas com OCR…</div>}
        {status === 'error' && <div className="text-red-400">Erro: {error}</div>}
        {status === 'done' && (
          <div>
            <textarea className="w-full h-80 p-3 rounded-md bg-slate-900/70 text-slate-200 border border-slate-700" value={text} onChange={() => {}} />
            <div className="mt-2 flex gap-2">
              <Button onClick={() => navigator.clipboard.writeText(text)}>Copiar texto</Button>
              {resolvedSrc && <a href={resolvedSrc} target="_blank" rel="noreferrer" className="text-blue-300 underline">Abrir PDF</a>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PdfOcrViewer;