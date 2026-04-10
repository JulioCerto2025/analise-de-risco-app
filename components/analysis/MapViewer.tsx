import * as React from 'react';
import { motion } from 'framer-motion';

export interface MapViewerHandles {
    zoomIn: () => void;
    zoomOut: () => void;
    reset: () => void;
    getImageBase64: () => Promise<string | null>;
    getImageDimensions: () => { width: number; height: number } | null;
    getAverageColorAtPoint: (point: { x: number; y: number }) => string | null;
    getDominantPaletteIndexAtPoint: (point: { x: number; y: number }, paletteHexColors: string[]) => number | null;
    getPaletteIndexAtPoint: (point: { x: number; y: number }, paletteHexColors: string[]) => number | null;
    getImageDataRect: (rect: { x1: number; y1: number; x2: number; y2: number }) => { width: number; height: number; data: Uint8ClampedArray } | null;
    setDetectionConfig: (cfg: Partial<DetectionConfig>) => void;
    getContentBounds: () => { x1: number; y1: number; x2: number; y2: number } | null;
    isContentPixel: (point: { x: number; y: number }) => boolean;
    findNearestContentPoint: (point: { x: number; y: number }, maxRadius?: number) => { x: number; y: number } | null;
}

interface MapClickData {
    clickPoint: { x: number; y: number };
}

interface MapViewerProps {
    imageUrl: string;
    onMapClick: (clickData: MapClickData) => void;
    markerPoint: { x: number; y: number } | null;
    initialTransform?: { scale: number; x: number; y: number };
    onTransformChange?: (t: { scale: number; x: number; y: number }) => void;
    onImageLoad?: (dims: { width: number; height: number }) => void;
}


type DetectionConfig = {
    blackMaxRgb: number; // threshold for max(R,G,B) to consider black
    blackVThreshold: number; // HSV v threshold to consider black
    exactPixelMode: boolean; // if true, never ignore central pixel (no grid filter)
    centerWeightExp: number; // exponent to strengthen center weighting in radial sampling
};

export const MapViewer = forwardRef<MapViewerHandles, MapViewerProps>(({ imageUrl, onMapClick, markerPoint, initialTransform, onTransformChange, onImageLoad }, ref) => {
    const [transform, setTransform] = React.useState(initialTransform || { scale: 1, x: 0, y: 0 });
    
    const lastTransformRef = React.useRef(transform);
    lastTransformRef.current = transform;

    React.useEffect(() => {
        if (!onTransformChange) return;
        const timer = setTimeout(() => {
            onTransformChange(transform);
        }, 300);
        return () => {
            clearTimeout(timer);
            // Salva imediatamente ao desmontar para garantir persistência na navegação rápida
            onTransformChange(lastTransformRef.current);
        };
    }, [transform, onTransformChange]);

    const containerRef = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const imageRef = React.useRef<HTMLImageElement>(null);
    
    const isPanning = React.useRef(false);
    const panStart = React.useRef({ x: 0, y: 0 });

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d', { willReadFrequently: true });
        if (!context) return;
        
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;
        img.onload = () => {
            if(canvas) {
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0);
                if (onImageLoad) onImageLoad({ width: img.width, height: img.height });
            }
        };
    }, [imageUrl]);

    const handleZoom = (zoomFactor: number, centerX?: number, centerY?: number) => {
        const container = containerRef.current;
        if (!container) return;
    
        const rect = container.getBoundingClientRect();
        const finalCenterX = centerX === undefined ? rect.left + rect.width / 2 : centerX;
        const finalCenterY = centerY === undefined ? rect.top + rect.height / 2 : centerY;
    
        setTransform(prev => {
            // Aumenta o zoom máximo para permitir aproximação adicional
            const newScale = Math.max(1, Math.min(prev.scale * zoomFactor, 10));

            if (newScale === 1) {
                return { scale: 1, x: 0, y: 0 };
            }
    
            const oldScale = prev.scale;
    
            const newX = prev.x + (finalCenterX - rect.left - prev.x) * (1 - newScale / oldScale);
            const newY = prev.y + (finalCenterY - rect.top - prev.y) * (1 - newScale / oldScale);
    
            return { scale: newScale, x: newX, y: newY };
        });
    };
    
    const handleReset = () => {
        setTransform({ scale: 1, x: 0, y: 0 });
    };

    const detectionCfgRef = React.useRef<DetectionConfig>({ blackMaxRgb: 50, blackVThreshold: 0.22, exactPixelMode: false, centerWeightExp: 2.5 });

    // Precise color matching utilities (sRGB → Lab → CIEDE2000)
    const srgbToLinear = (c: number) => {
        const cs = c / 255;
        return cs <= 0.04045 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
    };
    const rgbToXyz = (r: number, g: number, b: number) => {
        const R = srgbToLinear(r), G = srgbToLinear(g), B = srgbToLinear(b);
        const X = (R * 0.4124 + G * 0.3576 + B * 0.1805) * 100;
        const Y = (R * 0.2126 + G * 0.7152 + B * 0.0722) * 100;
        const Z = (R * 0.0193 + G * 0.1192 + B * 0.9505) * 100;
        return { X, Y, Z };
    };
    const xyzToLab = (X: number, Y: number, Z: number) => {
        const Xn = 95.047, Yn = 100.0, Zn = 108.883; // D65
        const f = (t: number) => (t > 0.008856 ? Math.pow(t, 1/3) : (7.787 * t) + (16/116));
        const fx = f(X / Xn), fy = f(Y / Yn), fz = f(Z / Zn);
        const L = (Y / Yn) > 0.008856 ? (116 * fy - 16) : (903.3 * (Y / Yn));
        const a = 500 * (fx - fy);
        const b = 200 * (fy - fz);
        return { L, a, b };
    };
    const rgbToLab = (r: number, g: number, b: number) => {
        const { X, Y, Z } = rgbToXyz(r, g, b);
        return xyzToLab(X, Y, Z);
    };
    const deltaE2000 = (lab1: {L:number,a:number,b:number}, lab2: {L:number,a:number,b:number}) => {
        const deg2rad = (d: number) => (Math.PI * d) / 180;
        const rad2deg = (r: number) => (180 * r) / Math.PI;
        const L1 = lab1.L, a1 = lab1.a, b1 = lab1.b;
        const L2 = lab2.L, a2 = lab2.a, b2 = lab2.b;
        const C1 = Math.sqrt(a1*a1 + b1*b1);
        const C2 = Math.sqrt(a2*a2 + b2*b2);
        const Cbar = (C1 + C2) / 2;
        const G = 0.5 * (1 - Math.sqrt(Math.pow(Cbar,7) / (Math.pow(Cbar,7) + Math.pow(25,7))));
        const a1p = (1 + G) * a1;
        const a2p = (1 + G) * a2;
        const C1p = Math.sqrt(a1p*a1p + b1*b1);
        const C2p = Math.sqrt(a2p*a2p + b2*b2);
        const h1p = Math.atan2(b1, a1p);
        const h2p = Math.atan2(b2, a2p);
        const h1pDeg = (h1p >= 0 ? rad2deg(h1p) : rad2deg(h1p) + 360);
        const h2pDeg = (h2p >= 0 ? rad2deg(h2p) : rad2deg(h2p) + 360);
        const dLp = L2 - L1;
        const dCp = C2p - C1p;
        let dhp = 0;
        if (C1p * C2p === 0) dhp = 0;
        else if (Math.abs(h2pDeg - h1pDeg) <= 180) dhp = h2pDeg - h1pDeg;
        else if (h2pDeg - h1pDeg > 180) dhp = h2pDeg - h1pDeg - 360;
        else dhp = h2pDeg - h1pDeg + 360;
        const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(deg2rad(dhp) / 2);
        const LpBar = (L1 + L2) / 2;
        const CpBar = (C1p + C2p) / 2;
        let hpBar = 0;
        if (C1p * C2p === 0) hpBar = h1pDeg + h2pDeg;
        else if (Math.abs(h1pDeg - h2pDeg) <= 180) hpBar = (h1pDeg + h2pDeg) / 2;
        else if (h1pDeg + h2pDeg < 360) hpBar = (h1pDeg + h2pDeg + 360) / 2;
        else hpBar = (h1pDeg + h2pDeg - 360) / 2;
        const T = 1 - 0.17 * Math.cos(deg2rad(hpBar - 30)) + 0.24 * Math.cos(deg2rad(2 * hpBar)) + 0.32 * Math.cos(deg2rad(3 * hpBar + 6)) - 0.20 * Math.cos(deg2rad(4 * hpBar - 63));
        const dTheta = 30 * Math.exp(-((hpBar - 275) / 25) * ((hpBar - 275) / 25));
        const Rc = 2 * Math.sqrt(Math.pow(CpBar,7) / (Math.pow(CpBar,7) + Math.pow(25,7)));
        const Sl = 1 + (0.015 * ((LpBar - 50) * (LpBar - 50))) / Math.sqrt(20 + ((LpBar - 50) * (LpBar - 50)));
        const Sc = 1 + 0.045 * CpBar;
        const Sh = 1 + 0.015 * CpBar * T;
        const Rt = -Math.sin(deg2rad(2 * dTheta)) * Rc;
        const dE = Math.sqrt(
            (dLp / Sl) * (dLp / Sl) +
            (dCp / Sc) * (dCp / Sc) +
            (dHp / Sh) * (dHp / Sh) +
            Rt * (dCp / Sc) * (dHp / Sh)
        );
        return dE;
    };

    React.useImperativeHandle(ref, () => ({
        zoomIn: () => handleZoom(1.3),
        zoomOut: () => handleZoom(0.85),
        reset: handleReset,
        setDetectionConfig: (cfg: Partial<DetectionConfig>) => {
            detectionCfgRef.current = { ...detectionCfgRef.current, ...cfg };
        },
        getImageBase64: async () => {
            const canvas = canvasRef.current;
            if (canvas) {
                 // Ensure the image is loaded and drawn
                if (!canvas.toDataURL().includes('data:image/png;base64,iVBORw0KGgo')) {
                    return canvas.toDataURL('image/jpeg').split(',')[1];
                }
                // If not drawn, wait a moment
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve(canvas.toDataURL('image/jpeg').split(',')[1]);
                    }, 200);
                });
            }
            return null;
        },
        getImageDimensions: () => {
            const canvas = canvasRef.current;
            return canvas ? { width: canvas.width, height: canvas.height } : null;
        },
        getImageDataRect: (rect) => {
            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d', { willReadFrequently: true });
            if (!context || !canvas) return null;
            const x1 = Math.max(0, Math.min(rect.x1, canvas.width - 1));
            const y1 = Math.max(0, Math.min(rect.y1, canvas.height - 1));
            const x2 = Math.max(0, Math.min(rect.x2, canvas.width - 1));
            const y2 = Math.max(0, Math.min(rect.y2, canvas.height - 1));
            const w = Math.max(1, x2 - x1 + 1);
            const h = Math.max(1, y2 - y1 + 1);
            try {
                const img = context.getImageData(x1, y1, w, h);
                return { width: w, height: h, data: img.data };
            } catch (err) {
                if (import.meta.env.DEV) {
                    console.error('MapViewer.getImageDataRect failed (likely CORS or timing):', err);
                }
                return null;
            }
        },
        // Detecta retângulo da área útil do mapa (exclui margens/legenda) de forma heurística
        getContentBounds: () => {
            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d', { willReadFrequently: true });
            if (!context || !canvas) return null;
            const { width, height } = canvas;
            let imageData: ImageData;
            try {
                imageData = context.getImageData(0, 0, width, height);
            } catch (err) {
                // Se o canvas estiver "tainted" por CORS, retorne área inteira
                if (import.meta.env.DEV) {
                    console.error('MapViewer.getContentBounds getImageData failed (CORS?):', err);
                }
                return { x1: 0, y1: 0, x2: width, y2: height };
            }
            const data = imageData.data;

            let minX = width, minY = height, maxX = 0, maxY = 0;
            const step = 3; // amostragem para performance

            const rgbToHsv = (r: number, g: number, b: number) => {
                r /= 255; g /= 255; b /= 255;
                const max = Math.max(r, g, b), min = Math.min(r, g, b);
                const v = max;
                const d = max - min;
                const s = max === 0 ? 0 : d / max;
                let h = 0;
                if (d !== 0) {
                    switch (max) {
                        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                        case g: h = (b - r) / d + 2; break;
                        case b: h = (r - g) / d + 4; break;
                    }
                    h /= 6;
                }
                return { h, s, v };
            };

            // Ignora base inferior (~15%) onde normalmente fica a legenda
            const ignoreBottom = Math.floor(height * 0.15);
            const yMaxScan = height - ignoreBottom;

            for (let y = 0; y < yMaxScan; y += step) {
                for (let x = 0; x < width; x += step) {
                    const i = (y * width + x) * 4;
                    const r = data[i], g = data[i + 1], b = data[i + 2];
                    const { s, v } = rgbToHsv(r, g, b);
                    // Considera conteúdo quando há saturação/valor suficientes (não branco/cinza leve)
                    if (v > 0.25 && s > 0.25) {
                        if (x < minX) minX = x;
                        if (y < minY) minY = y;
                        if (x > maxX) maxX = x;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            if (maxX <= minX || maxY <= minY) {
                // Fallback: se não conseguir detectar, retorna área inteira
                return { x1: 0, y1: 0, x2: width, y2: height };
            }

            // Pequena margem interna para evitar capturar pixels de grade
            const pad = 4;
            return { x1: Math.max(0, minX + pad), y1: Math.max(0, minY + pad), x2: Math.min(width, maxX - pad), y2: Math.min(height, maxY - pad) };
        },
        isContentPixel: (point: { x: number; y: number }) => {
            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d', { willReadFrequently: true });
            if (!context || !canvas) return false;
            const { width, height } = canvas;
            const ignoreBottom = Math.floor(height * 0.15);
            if (point.x < 0 || point.y < 0 || point.x >= width || point.y >= height - ignoreBottom) return false;
            let p: Uint8ClampedArray;
            try {
                p = context.getImageData(point.x, point.y, 1, 1).data;
            } catch (err) {
                if (import.meta.env.DEV) console.error('MapViewer.isContentPixel failed:', err);
                return false;
            }
            const r = p[0], g = p[1], b = p[2];
            // rápido teste de conteúdo colorido
            const maxRGB = Math.max(r, g, b), minRGB = Math.min(r, g, b);
            const saturationApprox = maxRGB === 0 ? 0 : (maxRGB - minRGB) / maxRGB;
            const valueApprox = maxRGB / 255;
            return valueApprox > 0.25 && saturationApprox > 0.25;
        },
        findNearestContentPoint: (point: { x: number; y: number }, maxRadius: number = 25) => {
            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d', { willReadFrequently: true });
            if (!context || !canvas) return null;
            if ((ref as any).isContentPixel(point)) return { x: Math.round(point.x), y: Math.round(point.y) };
            const { width, height } = canvas;
            const ignoreBottom = Math.floor(height * 0.15);
            
            // Otimização: Ler uma única vez a área de busca ao invés de milhares de requisições individuais
            const startX = Math.max(0, Math.round(point.x - maxRadius));
            const startY = Math.max(0, Math.round(point.y - maxRadius));
            const endX = Math.min(width - 1, Math.round(point.x + maxRadius));
            const endY = Math.min(height - ignoreBottom - 1, Math.round(point.y + maxRadius));
            const scanW = endX - startX + 1;
            const scanH = endY - startY + 1;
            if (scanW <= 0 || scanH <= 0) return null;

            let imageData: ImageData;
            try {
                imageData = context.getImageData(startX, startY, scanW, scanH);
            } catch { return null; }
            const data = imageData.data;

            const isPointValid = (lx: number, ly: number) => {
                const i = (ly * scanW + lx) * 4;
                const r = data[i], g = data[i + 1], b = data[i + 2];
                const max = Math.max(r, g, b), min = Math.min(r, g, b);
                const s = max === 0 ? 0 : (max - min) / max;
                const v = max / 255;
                return v > 0.25 && s > 0.1; // Limiar de saturação relaxado
            };

            for (let r = 1; r <= maxRadius; r++) {
                for (let a = 0; a < 360; a += 10) {
                    const rad = (a * Math.PI) / 180;
                    const rx = Math.round(point.x + Math.cos(rad) * r);
                    const ry = Math.round(point.y + Math.sin(rad) * r);
                    if (rx >= startX && rx <= endX && ry >= startY && ry <= endY) {
                        if (isPointValid(rx - startX, ry - startY)) return { x: rx, y: ry };
                    }
                }
            }
            return null;
        },
        getAverageColorAtPoint: (point) => {
            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d');
            if (!context) return null;

            // Sample a 3x3 area around the click point for a more stable color reading
            const radius = 1;
            const startX = Math.max(0, point.x - radius);
            const startY = Math.max(0, point.y - radius);
            const width = Math.min(canvas.width - startX, radius * 2 + 1);
            const height = Math.min(canvas.height - startY, radius * 2 + 1);
            
            if (width <= 0 || height <= 0) return null;

            let imageData: ImageData;
            try {
                imageData = context.getImageData(startX, startY, width, height);
            } catch (err) {
                if (import.meta.env.DEV) console.error('MapViewer.getAverageColorAtPoint failed:', err);
                return null;
            }
            const data = imageData.data;
            let r = 0, g = 0, b = 0;

            for (let i = 0; i < data.length; i += 4) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
            }

            const pixelCount = data.length / 4;
            const avgR = Math.round(r / pixelCount);
            const avgG = Math.round(g / pixelCount);
            const avgB = Math.round(b / pixelCount);

            const toHex = (c: number) => ('0' + c.toString(16)).slice(-2);
            return `#${toHex(avgR)}${toHex(avgG)}${toHex(avgB)}`;
        },
        getDominantPaletteIndexAtPoint: (point, paletteHexColors) => {
            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d', { willReadFrequently: true });
            if (!context || !paletteHexColors || paletteHexColors.length === 0) return null;

            // Sample a larger area and choose the most frequent palette index
            const radius = 3; // 7x7 area para reduzir mistura de vizinhos
            const startX = Math.max(0, point.x - radius);
            const startY = Math.max(0, point.y - radius);
            const width = Math.min(canvas.width - startX, radius * 2 + 1);
            const height = Math.min(canvas.height - startY, radius * 2 + 1);
            if (width <= 0 || height <= 0) return null;

            let imageData: ImageData;
            try {
                imageData = context.getImageData(startX, startY, width, height);
            } catch (err) {
                if (import.meta.env.DEV) console.error('MapViewer.getDominantPaletteIndexAtPoint failed:', err);
                return null;
            }
            const data = imageData.data;

            // Precompute palette LAB for precise color distance
            const hexToRgb = (hex: string) => {
                const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
            };
            const palette = paletteHexColors.map(hexToRgb).filter(Boolean) as { r: number; g: number; b: number }[];
            if (palette.length === 0) return null;
            const paletteLab = palette.map(p => rgbToLab(p.r, p.g, p.b));

            // Accumulate weighted DeltaE (lower is better)
            const scoreSum = new Array(palette.length).fill(0);
            // Identify black in palette (Ng 32). If not present, keep -1 and never force-map to another color.
            const blackIdx = palette.findIndex(p => p.r === 0 && p.g === 0 && p.b === 0);
            const BLACK_INDEX = blackIdx; // -1 if palette doesn't have pure black
            const { blackMaxRgb, blackVThreshold, exactPixelMode } = detectionCfgRef.current;

            // Center of the sampled window
            const centerX = point.x;
            const centerY = point.y;

            // Helper to compute HSV saturation and value (for filters only)
            const rgbToHsv = (r: number, g: number, b: number) => {
                r /= 255; g /= 255; b /= 255;
                const max = Math.max(r, g, b), min = Math.min(r, g, b);
                const v = max;
                const d = max - min;
                const s = max === 0 ? 0 : d / max;
                let h = 0;
                if (d !== 0) {
                    switch (max) {
                        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                        case g: h = (b - r) / d + 2; break;
                        case b: h = (r - g) / d + 4; break;
                    }
                    h /= 6;
                }
                return { h, s, v };
            };

            let blackCount = 0;
            let totalCount = 0;
            for (let py = 0; py < height; py++) {
                for (let px = 0; px < width; px++) {
                    const i = (py * width + px) * 4;
                    const pr = data[i], pg = data[i + 1], pb = data[i + 2];
                    const pixel = { r: pr, g: pg, b: pb };

                    // Weighted by distance to the actual click point
                    const dx = (startX + px) - centerX;
                    const dy = (startY + py) - centerY;
                    const d2 = dx * dx + dy * dy;
                    const { centerWeightExp } = detectionCfgRef.current;
                    const weight = 1 / Math.pow(1 + d2, Math.max(1, centerWeightExp)); // heavier center weighting

                    // Ignore near-grayscale or gridline pixels (low saturation or extreme brightness)
                const { s, v } = rgbToHsv(pr, pg, pb);
                // Explicit black detection
                const maxRgbSample = Math.max(pr, pg, pb);
                if (maxRgbSample < blackMaxRgb || v < blackVThreshold) { blackCount++; totalCount++; continue; }
                // Ignore gridlines unless exactPixelMode
                if (!exactPixelMode && s < 0.2 && v > 0.2) { totalCount++; continue; }

                    const labPix = rgbToLab(pr, pg, pb);
                    for (let k = 0; k < paletteLab.length; k++) {
                        const dE = deltaE2000(labPix, paletteLab[k]);
                        scoreSum[k] += weight * dE;
                    }
                    totalCount++;
                }
            }

            // Radial ring sampling at 2px distance to avoid grid/border bias
            // We sample 8 directions (N, NE, E, SE, S, SW, W, NW) with a stronger weight
            const ringR = 2;
            const ringWeight = 2.0; // emphasize ring samples
            const angles = [0, 45, 90, 135, 180, 225, 270, 315];
            for (const a of angles) {
                const rad = (Math.PI * a) / 180;
                const rx = Math.round((centerX - startX) + Math.cos(rad) * ringR);
                const ry = Math.round((centerY - startY) + Math.sin(rad) * ringR);
                if (rx < 0 || ry < 0 || rx >= width || ry >= height) continue;
                const ii = (ry * width + rx) * 4;
                const rr = data[ii], rg = data[ii + 1], rb = data[ii + 2];
                const { s, v } = rgbToHsv(rr, rg, rb);
                const maxRgbSample = Math.max(rr, rg, rb);
                if (maxRgbSample < blackMaxRgb || v < blackVThreshold) { blackCount++; totalCount++; continue; }
                if (!exactPixelMode && s < 0.2 && v > 0.2) { totalCount++; continue; }
                const labPix = rgbToLab(rr, rg, rb);
                for (let k = 0; k < paletteLab.length; k++) {
                    const dE = deltaE2000(labPix, paletteLab[k]);
                    scoreSum[k] += ringWeight * dE;
                }
                totalCount++;
            }

            // If center pixel is black or black dominates samples, return palette black when available
            let centerIsBlack = false;
            try {
                const centerData = context.getImageData(centerX, centerY, 1, 1).data;
                const cmax = Math.max(centerData[0], centerData[1], centerData[2]);
                const { v: cv } = rgbToHsv(centerData[0], centerData[1], centerData[2]);
                centerIsBlack = (cmax < blackMaxRgb || cv < blackVThreshold);
            } catch {}

            if ((centerIsBlack || (blackCount > 0 && blackCount / Math.max(1, totalCount) >= 0.4)) && BLACK_INDEX !== -1) {
                return BLACK_INDEX;
            }

            // Se nenhum pixel válido foi encontrado (área branca ou nula), retorna null ao invés de Ng 2
            if (totalCount === 0 || scoreSum.every(s => s === 0)) return null;

            // Choose palette with minimal accumulated DeltaE
            let bestIdx = 0;
            for (let k = 1; k < scoreSum.length; k++) {
                if (scoreSum[k] < scoreSum[bestIdx]) bestIdx = k;
            }
            return bestIdx;
        },
        getPaletteIndexAtPoint: (point, paletteHexColors) => {
            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d', { willReadFrequently: true });
            if (!context || !paletteHexColors || paletteHexColors.length === 0) return null;

            // Read exactly the clicked pixel
            const x = Math.max(0, Math.min(point.x, (canvas?.width ?? 1) - 1));
            const y = Math.max(0, Math.min(point.y, (canvas?.height ?? 1) - 1));
            let imageData: ImageData;
            try {
                imageData = context.getImageData(x, y, 1, 1);
            } catch (err) {
                if (import.meta.env.DEV) console.error('MapViewer.getPaletteIndexAtPoint failed:', err);
                return null;
            }
            const data = imageData.data;
            const pr = data[0], pg = data[1], pb = data[2];

            // Ignore gridline pixels: check saturation/brightness
            const rgbToHsv = (r: number, g: number, b: number) => {
                r /= 255; g /= 255; b /= 255;
                const max = Math.max(r, g, b), min = Math.min(r, g, b);
                const v = max;
                const d = max - min;
                const s = max === 0 ? 0 : d / max;
                let h = 0;
                if (d !== 0) {
                    switch (max) {
                        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                        case g: h = (b - r) / d + 2; break;
                        case b: h = (r - g) / d + 4; break;
                    }
                    h /= 6;
                }
                return { h, s, v };
            };
            // Precompute palette and black index before classification
            const hexToRgb = (hex: string) => {
                const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
            };
            const palette = paletteHexColors
                .map(hexToRgb)
                .filter(Boolean) as { r: number; g: number; b: number }[];
            if (palette.length === 0) return null;
            const blackIdx = palette.findIndex(p => p.r === 0 && p.g === 0 && p.b === 0);

            const { blackMaxRgb, blackVThreshold, exactPixelMode } = detectionCfgRef.current;
            const { s, v } = rgbToHsv(pr, pg, pb);
            // Explicit black detection: treat very dark (HSV) or low RGB tones as Ng 32
            const maxRgbCenter = Math.max(pr, pg, pb);
            if (maxRgbCenter < blackMaxRgb || v < blackVThreshold) return (blackIdx !== -1 ? blackIdx : null);
            // Ignore gridlines (low saturation AND not dark), but keep black; unless exactPixelMode
            if (!exactPixelMode && s < 0.2 && v > 0.2) return null;

            const paletteLab = palette.map(p => rgbToLab(p.r, p.g, p.b));
            const labPix = rgbToLab(pr, pg, pb);
            let bestIndex = 0;
            let bestScore = Infinity;
            for (let k = 0; k < paletteLab.length; k++) {
                const dE = deltaE2000(labPix, paletteLab[k]);
                if (dE < bestScore) { bestScore = dE; bestIndex = k; }
            }

            // Adjacent pair disambiguation using pure hue (use center pixel):
            const ph = rgbToHsv(pr, pg, pb);
            const hueDiff = (h1: number, h2: number) => Math.min(Math.abs(h1 - h2), 1 - Math.abs(h1 - h2));

            // Blue 14 (index 6) vs Cyan 16 (index 7)
            if (bestIndex === 6 || bestIndex === 7) {
                const h6 = rgbToHsv(palette[6].r, palette[6].g, palette[6].b).h;
                const h7 = rgbToHsv(palette[7].r, palette[7].g, palette[7].b).h;
                const d6 = hueDiff(ph.h, h6);
                const d7 = hueDiff(ph.h, h7);
                bestIndex = d6 <= d7 ? 6 : 7;
            }

            // Green 20 (index 9) vs Olive 22 (index 10)
            if (bestIndex === 9 || bestIndex === 10) {
                const h9 = rgbToHsv(palette[9].r, palette[9].g, palette[9].b).h;
                const h10 = rgbToHsv(palette[10].r, palette[10].g, palette[10].b).h;
                const d9 = hueDiff(ph.h, h9);
                const d10 = hueDiff(ph.h, h10);
                bestIndex = d9 <= d10 ? 9 : 10;
            }

            return bestIndex;
        }
    }));
    
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isPanning.current) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Normalização direta considerando o transform aplicado pelo framer-motion
        // Como o origin é 0,0 e o motion.div cobre o container, a destransformação é linear
        const untransformedX = (mouseX / transform.scale);
        const untransformedY = (mouseY / transform.scale);

        // Agora calculamos os offsets do object-contain 'virtual' dentro do div original
        const containerW = rect.width / transform.scale;
        const containerH = rect.height / transform.scale;
        const naturalW = canvas.width;
        const naturalH = canvas.height;
        
        const scale = Math.min(containerW / naturalW, containerH / naturalH);
        const displayedW = naturalW * scale;
        const displayedH = naturalH * scale;
        const offsetX = (containerW - displayedW) / 2;
        const offsetY = (containerH - displayedH) / 2;

        const xInContent = untransformedX - offsetX;
        const yInContent = untransformedY - offsetY;

        // Verifica se o clique caiu dentro da área real da imagem (ignorando letterbox)
        if (xInContent < 0 || xInContent > displayedW || yInContent < 0 || yInContent > displayedH) return;

        const canvasX = Math.round((xInContent / displayedW) * canvas.width);
        const canvasY = Math.round((yInContent / displayedH) * canvas.height);

        // Clamp final para garantir que o pixel está dentro do canvas
        const finalX = Math.max(0, Math.min(canvas.width - 1, canvasX));
        const finalY = Math.max(0, Math.min(canvas.height - 1, canvasY));

        onMapClick({ clickPoint: { x: finalX, y: finalY } });
    };
    
    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        e.preventDefault();
        const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
        handleZoom(zoomFactor, e.clientX, e.clientY);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button !== 1 && e.button !== 0) return; 
        
        if (e.button === 0) {
            const timer = setTimeout(() => {
                 startPan(e);
            }, 150);
            containerRef.current?.addEventListener('mouseup', () => clearTimeout(timer), { once: true });
        } else {
             startPan(e);
        }
    };
    
    const startPan = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        isPanning.current = true;
        panStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
        if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isPanning.current) return;
        e.preventDefault();
        setTransform(prev => ({
            ...prev,
            x: e.clientX - panStart.current.x,
            y: e.clientY - panStart.current.y
        }));
    };

    const handleMouseUpOrLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        setTimeout(() => { isPanning.current = false; }, 50);
        if (containerRef.current) containerRef.current.style.cursor = 'grab';
    };


    return (
        <div 
            ref={containerRef}
            className="relative h-[450px] w-full overflow-hidden rounded-lg bg-slate-800/40 border border-slate-700 select-none cursor-grab"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
        >
            <motion.div
                className="w-full h-full cursor-crosshair"
                style={{ scale: transform.scale, x: transform.x, y: transform.y, originX: 0, originY: 0 }}
                onClick={handleClick}
            >
                <img
                    ref={imageRef}
                    src={imageUrl}
                    alt="Mapa de densidade de descargas atmosféricas"
                    className="w-full h-full object-contain pointer-events-none mix-blend-screen"
                    draggable="false"
                />
                 {markerPoint && canvasRef.current && (
                    <svg
                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                        viewBox={`0 0 ${canvasRef.current.width} ${canvasRef.current.height}`}
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <line
                            x1={markerPoint.x} y1={0}
                            x2={markerPoint.x} y2={canvasRef.current.height}
                            stroke="rgba(239, 68, 68, 0.8)"
                            strokeWidth={2 / transform.scale}
                            strokeDasharray="4"
                        />
                        <line
                            x1={0} y1={markerPoint.y}
                            x2={canvasRef.current.width} y2={markerPoint.y}
                            stroke="rgba(239, 68, 68, 0.8)"
                            strokeWidth={2 / transform.scale}
                            strokeDasharray="4"
                        />
                        <g>
                            {/* Ponto estático maior para melhor visibilidade */}
                            <circle
                                cx={markerPoint.x}
                                cy={markerPoint.y}
                                r={6 / transform.scale}
                                fill="rgb(239,68,68)"
                                stroke="white"
                                strokeWidth={2 / transform.scale}
                            />
                            {/* Pulso animado via framer-motion (mais compatível) */}
                            <motion.circle
                                cx={markerPoint.x}
                                cy={markerPoint.y}
                                r={8 / transform.scale}
                                fill="rgba(239,68,68,0.35)"
                                stroke="none"
                                animate={{
                                    r: [8 / transform.scale, 14 / transform.scale, 8 / transform.scale],
                                    opacity: [0.6, 0, 0.6]
                                }}
                                transition={{ duration: 1.2, repeat: Infinity }}
                            />
                        </g>
                    </svg>
                )}

            </motion.div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
});
MapViewer.displayName = "MapViewer";