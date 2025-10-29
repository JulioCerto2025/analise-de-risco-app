import React, { useState, useImperativeHandle, forwardRef, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface MapViewerHandles {
    zoomIn: () => void;
    zoomOut: () => void;
    reset: () => void;
    getImageBase64: () => Promise<string | null>;
    getImageDimensions: () => { width: number; height: number } | null;
    getAverageColorAtPoint: (point: { x: number; y: number }) => string | null;
}

interface MapClickData {
    clickPoint: { x: number; y: number };
}

interface MapViewerProps {
    imageUrl: string;
    onMapClick: (clickData: MapClickData) => void;
    markerPoint: { x: number; y: number } | null;
}


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

    useImperativeHandle(ref, () => ({
        zoomIn: () => handleZoom(1.25),
        zoomOut: () => handleZoom(0.8),
        reset: handleReset,
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