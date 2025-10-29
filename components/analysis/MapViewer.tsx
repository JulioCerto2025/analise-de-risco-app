import React, { useState, useImperativeHandle, forwardRef, useRef, useEffect } from 'react';
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
    setDetectionConfig: (cfg: Partial<DetectionConfig>) => void;
}

interface MapClickData {
    clickPoint: { x: number; y: number };
}

interface MapViewerProps {
    imageUrl: string;
    onMapClick: (clickData: MapClickData) => void;
    markerPoint: { x: number; y: number } | null;
}


type DetectionConfig = {
    blackMaxRgb: number; // threshold for max(R,G,B) to consider black
    blackVThreshold: number; // HSV v threshold to consider black
    exactPixelMode: boolean; // if true, never ignore central pixel (no grid filter)
};

export const MapViewer = forwardRef<MapViewerHandles, MapViewerProps>(({ imageUrl, onMapClick, markerPoint }, ref) => {
    const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
    
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    
    const isPanning = useRef(false);
    const panStart = useRef({ x: 0, y: 0 });

    useEffect(() => {
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
            }
        };
        handleReset();
    }, [imageUrl]);

    const handleZoom = (zoomFactor: number, centerX?: number, centerY?: number) => {
        const container = containerRef.current;
        if (!container) return;
    
        const rect = container.getBoundingClientRect();
        const finalCenterX = centerX === undefined ? rect.left + rect.width / 2 : centerX;
        const finalCenterY = centerY === undefined ? rect.top + rect.height / 2 : centerY;
    
        setTransform(prev => {
            const newScale = Math.max(1, Math.min(prev.scale * zoomFactor, 5));
    
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

    const detectionCfgRef = useRef<DetectionConfig>({ blackMaxRgb: 65, blackVThreshold: 0.28, exactPixelMode: false });

    useImperativeHandle(ref, () => ({
        zoomIn: () => handleZoom(1.25),
        zoomOut: () => handleZoom(0.8),
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

            const imageData = context.getImageData(startX, startY, width, height);
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

            const imageData = context.getImageData(startX, startY, width, height);
            const data = imageData.data;

            // Precompute palette RGB
            const hexToRgb = (hex: string) => {
                const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
            };
            const palette = paletteHexColors
                .map(hexToRgb)
                .filter(Boolean) as { r: number; g: number; b: number }[];
            if (palette.length === 0) return null;

            // Use weighted counts giving more importance to the center
            const counts = new Array(palette.length).fill(0);
            // Identify black in palette (Ng 32)
            const blackIdx = palette.findIndex(p => p.r === 0 && p.g === 0 && p.b === 0);
            const BLACK_INDEX = blackIdx === -1 ? palette.length - 1 : blackIdx;
            const { blackMaxRgb, blackVThreshold, exactPixelMode } = detectionCfgRef.current;
            const hsvDist = (p: { r: number; g: number; b: number }, q: { r: number; g: number; b: number }) => {
                const ph = rgbToHsv(p.r, p.g, p.b);
                const qh = rgbToHsv(q.r, q.g, q.b);
                const dv = Math.abs(ph.v - qh.v);
                // If palette candidate is pure black, ignore hue/sat — use brightness only.
                if (q.r === 0 && q.g === 0 && q.b === 0) {
                    return (dv * dv); // prefer black for low v
                }
                const dh = Math.min(Math.abs(ph.h - qh.h), 1 - Math.abs(ph.h - qh.h));
                const ds = Math.abs(ph.s - qh.s);
                // Reduce hue influence for very dark or low-saturation tones
                const hueW = (ph.v < 0.25 || ph.s < 0.2) ? 0.5 : 16;
                return (dh * dh) * hueW + (ds * ds) * 2 + (dv * dv) * 0.25;
            };

            // Center of the sampled window
            const centerX = point.x;
            const centerY = point.y;

            // Helper to compute HSV saturation and value
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

            for (let py = 0; py < height; py++) {
                for (let px = 0; px < width; px++) {
                    const i = (py * width + px) * 4;
                    const pr = data[i], pg = data[i + 1], pb = data[i + 2];
                    const pixel = { r: pr, g: pg, b: pb };

                    // Weighted by distance to the actual click point
                    const dx = (startX + px) - centerX;
                    const dy = (startY + py) - centerY;
                    const d2 = dx * dx + dy * dy;
                    const weight = 1 / (1 + d2); // higher weight for center pixels

                    // Ignore near-grayscale or gridline pixels (low saturation or extreme brightness)
                const { s, v } = rgbToHsv(pr, pg, pb);
                // Explicit black detection: very dark (HSV) or low RGB => count as Ng 32
                const maxRgbSample = Math.max(pr, pg, pb);
                if (maxRgbSample < blackMaxRgb || v < blackVThreshold) { counts[BLACK_INDEX] += weight; continue; }
                // Ignore gridlines unless exactPixelMode
                if (!exactPixelMode && s < 0.2 && v > 0.2) continue;

                    let bestIndex = 0;
                    let bestScore = Infinity;
                    for (let k = 0; k < palette.length; k++) {
                        const score = hsvDist(pixel, palette[k]);
                        if (score < bestScore) { bestScore = score; bestIndex = k; }
                    }
                    counts[bestIndex] += weight;
                }
            }

            // Choose the palette index with highest count
            let maxIdx = 0;
            for (let k = 1; k < counts.length; k++) {
                if (counts[k] > counts[maxIdx]) maxIdx = k;
            }
            return maxIdx;
        },
        getPaletteIndexAtPoint: (point, paletteHexColors) => {
            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d', { willReadFrequently: true });
            if (!context || !paletteHexColors || paletteHexColors.length === 0) return null;

            // Read exactly the clicked pixel
            const x = Math.max(0, Math.min(point.x, (canvas?.width ?? 1) - 1));
            const y = Math.max(0, Math.min(point.y, (canvas?.height ?? 1) - 1));
            const imageData = context.getImageData(x, y, 1, 1);
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
            const BLACK_INDEX = blackIdx === -1 ? palette.length - 1 : blackIdx;

            const { blackMaxRgb, blackVThreshold, exactPixelMode } = detectionCfgRef.current;
            const { s, v } = rgbToHsv(pr, pg, pb);
            // Explicit black detection: treat very dark (HSV) or low RGB tones as Ng 32
            const maxRgbCenter = Math.max(pr, pg, pb);
            if (maxRgbCenter < blackMaxRgb || v < blackVThreshold) return BLACK_INDEX;
            // Ignore gridlines (low saturation AND not dark), but keep black; unless exactPixelMode
            if (!exactPixelMode && s < 0.2 && v > 0.2) return null;

            const hsvDist = (p: { r: number; g: number; b: number }, q: { r: number; g: number; b: number }) => {
                const ph = rgbToHsv(p.r, p.g, p.b);
                const qh = rgbToHsv(q.r, q.g, q.b);
                const dv = Math.abs(ph.v - qh.v);
                // If palette candidate is pure black, ignore hue/sat — use brightness only.
                if (q.r === 0 && q.g === 0 && q.b === 0) {
                    return (dv * dv);
                }
                const dh = Math.min(Math.abs(ph.h - qh.h), 1 - Math.abs(ph.h - qh.h));
                const ds = Math.abs(ph.s - qh.s);
                // Reduce hue influence for very dark or low-saturation tones
                const hueW = (ph.v < 0.25 || ph.s < 0.2) ? 0.5 : 16;
                return (dh * dh) * hueW + (ds * ds) * 2 + (dv * dv) * 0.25;
            };

            const pixel = { r: pr, g: pg, b: pb };
            let bestIndex = 0;
            let bestScore = Infinity;
            for (let k = 0; k < palette.length; k++) {
                const score = hsvDist(pixel, palette[k]);
                if (score < bestScore) { bestScore = score; bestIndex = k; }
            }

            // Adjacent pair disambiguation using pure hue:
            const ph = rgbToHsv(pixel.r, pixel.g, pixel.b);
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

        const image = imageRef.current;
        const canvas = canvasRef.current;
        if (!image || !canvas) return;

        const imageRect = image.getBoundingClientRect();
        const xOnImage = e.clientX - imageRect.left;
        const yOnImage = e.clientY - imageRect.top;

        const canvasX = Math.round(xOnImage * (canvas.width / imageRect.width));
        const canvasY = Math.round(yOnImage * (canvas.height / imageRect.height));
        
        if (canvasX < 0 || canvasX >= canvas.width || canvasY < 0 || canvasY >= canvas.height) {
            return;
        }

        onMapClick({
            clickPoint: { x: canvasX, y: canvasY },
        });
    };
    
    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        e.preventDefault();
        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
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
                        preserveAspectRatio="none"
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
                    </svg>
                )}

                {markerPoint && canvasRef.current && (
                    <div
                        className="absolute pointer-events-none"
                        style={{
                            top: `${(markerPoint.y / canvasRef.current.height) * 100}%`,
                            left: `${(markerPoint.x / canvasRef.current.width) * 100}%`,
                        }}
                    >
                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                transform: `translate(-50%, -50%) scale(${1 / transform.scale})`,
                            }}
                        >
                            <motion.div
                                className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-xl"
                                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>
                    </div>
                )}
            </motion.div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
});
MapViewer.displayName = "MapViewer";