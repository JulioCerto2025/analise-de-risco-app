import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Select, SelectTrigger, SelectContent, SelectItem, Label, Button, Input } from '../ui';
import { ZoomIn, ZoomOut, RefreshCw, X, Loader2, MapPin } from "lucide-react";
import { DecimalInput } from "../DecimalInput";
import { AnalysisData } from '../../types';
import { MapViewer, MapViewerHandles } from './MapViewer';
import { getNgFromAddress } from '../../lib/geminiService';

interface NgInputStepProps {
    data: AnalysisData;
    onUpdate: (newData: Partial<AnalysisData>) => void;
}

const mapUrls: { [key: string]: string } = {
    brasil: 'https://i.imgur.com/AQcWBhv.png',
    'centro-oeste': 'https://i.imgur.com/trcWfBP.jpeg',
    nordeste: 'https://i.imgur.com/psxFt3x.jpeg',
    norte: 'https://i.imgur.com/p2oCi0a.jpeg',
    sudeste: 'https://i.imgur.com/WMhsjys.jpeg',
    sul: 'https://i.imgur.com/ZCh2aYR.jpeg',
};

// Geographic bounds for each map image grid.
const mapBounds: { [key: string]: { lonMin: number; lonMax: number; latMin: number; latMax: number } } = {
    'centro-oeste': { lonMin: -61.0, lonMax: -46.0, latMin: -24.0, latMax: -7.0 },
    'nordeste':     { lonMin: -48.0, lonMax: -34.0, latMin: -18.0, latMax: -1.0 },
    'norte':        { lonMin: -74.0, lonMax: -46.0, latMin: -13.0, latMax: 5.5 },
    'sudeste':      { lonMin: -52.0, lonMax: -40.0, latMin: -25.0, latMax: -18.0 },
    'sul':          { lonMin: -58.0, lonMax: -48.0, latMin: -34.0, latMax: -22.0 },
};

// Defines the pixel coordinates of the active map area within each image file.
// This accounts for borders and legends in the image files, ensuring accurate mapping.
const mapPixelBounds: { [key: string]: { x1: number; y1: number; x2: number; y2: number } } = {
    'centro-oeste': { x1: 80, y1: 50, x2: 600, y2: 440 },
    'nordeste':     { x1: 80, y1: 50, x2: 600, y2: 440 },
    'norte':        { x1: 80, y1: 50, x2: 600, y2: 440 },
    'sudeste':      { x1: 80, y1: 50, x2: 600, y2: 440 },
    'sul':          { x1: 80, y1: 50, x2: 600, y2: 440 },
};

// Function to convert geo coordinates to pixel coordinates using precise bounds
const convertGeoToPixel = (
    lat: number,
    lon: number,
    geoBounds: { lonMin: number; lonMax: number; latMin: number; latMax: number },
    pixelBounds: { x1: number; y1: number; x2: number; y2: number }
): { x: number; y: number } | null => {
    if (!geoBounds || !pixelBounds) {
        return null;
    }

    const clampedLon = Math.max(geoBounds.lonMin, Math.min(geoBounds.lonMax, lon));
    const clampedLat = Math.max(geoBounds.latMin, Math.min(geoBounds.latMax, lat));
    
    const lonRatio = (clampedLon - geoBounds.lonMin) / (geoBounds.lonMax - geoBounds.lonMin);
    const latRatio = (geoBounds.latMax - clampedLat) / (geoBounds.latMax - geoBounds.latMin); // Inverted for Y-axis

    const pixelWidth = pixelBounds.x2 - pixelBounds.x1;
    const pixelHeight = pixelBounds.y2 - pixelBounds.y1;

    const x = pixelBounds.x1 + (lonRatio * pixelWidth);
    const y = pixelBounds.y1 + (latRatio * pixelHeight);

    return { x: Math.round(x), y: Math.round(y) };
};

const regionOptions = [
    { value: 'centro-oeste', label: 'Centro-Oeste' },
    { value: 'nordeste', label: 'Nordeste' },
    { value: 'norte', label: 'Norte' },
    { value: 'sudeste', label: 'Sudeste' },
    { value: 'sul', label: 'Sul' },
];

const NG_COLOR_BLOCKS = [
  '#fdeffc', '#ea85e8', '#d041da', '#9b00d2', '#5500cb', '#0000c8',
  '#006ac4', '#00a8c7', '#00c5a2', '#00b500', '#96d400', '#ffff00',
  '#fac300', '#fa6b00', '#eb0000', '#000000'
];

// Helper function to convert hex color to RGB
const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

// Calculate Euclidean distance between two colors
const colorDistance = (color1: {r: number, g: number, b: number}, color2: {r: number, g: number, b: number}) => {
    return Math.sqrt(Math.pow(color1.r - color2.r, 2) + Math.pow(color1.g - color2.g, 2) + Math.pow(color1.b - color2.b, 2));
};

const findClosestColorIndex = (targetHex: string | null): number => {
    if (!targetHex) return -1;
    const targetRgb = hexToRgb(targetHex);
    if (!targetRgb) return -1;

    let closestIndex = -1;
    let minDistance = Infinity;

    NG_COLOR_BLOCKS.forEach((blockHex, index) => {
        const blockRgb = hexToRgb(blockHex);
        if (blockRgb) {
            const distance = colorDistance(targetRgb, blockRgb);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        }
    });
    return closestIndex;
};


const getRegionFromState = (stateUF: string = ''): string => {
    const uf = stateUF.toUpperCase();
    if (['GO', 'MT', 'MS', 'DF'].includes(uf)) return 'centro-oeste';
    if (['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'].includes(uf)) return 'nordeste';
    if (['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'].includes(uf)) return 'norte';
    if (['ES', 'MG', 'RJ', 'SP'].includes(uf)) return 'sudeste';
    if (['PR', 'RS', 'SC'].includes(uf)) return 'sul';
    return 'sudeste'; // Default fallback
};

export function NgInputStep({ data, onUpdate }: NgInputStepProps) {
    const { mapRegion, clientAddress, location } = data;
    const [isLoading, setIsLoading] = useState(false);
    const [markerPoint, setMarkerPoint] = useState<{ x: number; y: number } | null>(null);
    const [selectedMapColor, setSelectedMapColor] = useState<string | null>(null);
    const [coordinates, setCoordinates] = useState<string>('');
    const mapViewerRef = useRef<MapViewerHandles>(null);
    
    useEffect(() => {
        // This effect triggers whenever the marker is set, either manually or automatically.
        if (!markerPoint || !mapViewerRef.current) return;
        
        // Use a small timeout to let the DOM update with the marker before reading the canvas
        const timer = setTimeout(() => {
            try {
                const avgColorHex = mapViewerRef.current?.getAverageColorAtPoint(markerPoint);
                if (avgColorHex) {
                    setSelectedMapColor(avgColorHex);
                    const closestIndex = findClosestColorIndex(avgColorHex);
                    if (closestIndex !== -1) {
                        const ngValue = (closestIndex * 2) + 2;
                        onUpdate({ ng: ngValue });
                    }
                }
            } catch (error) {
                console.error("Error processing map color:", error);
            } finally {
                setIsLoading(false);
            }
        }, 150);
    
        return () => clearTimeout(timer);
    
    }, [markerPoint, onUpdate]);

    const handleMapClick = useCallback((clickData: { clickPoint: { x: number, y: number } }) => {
        setCoordinates(''); // Clear geo-coordinates if clicking manually
        setMarkerPoint(clickData.clickPoint);
    }, []);

    const searchAndSetNg = useCallback(async (address: string) => {
        if (!address) return;
        setIsLoading(true);
        setMarkerPoint(null);
        setSelectedMapColor(null);
        setCoordinates('');
        try {
            const result = await getNgFromAddress(address);
            if (result) {
                const uf = result.location.split(' - ')[1];
                const newRegion = getRegionFromState(uf);
                
                const coordsDisplay = `Lat: ${result.latitude.toFixed(1).replace('.', ',')}, Lon: ${result.longitude.toFixed(1).replace('.', ',')}`;
                setCoordinates(coordsDisplay);
                
                onUpdate({
                    location: result.location,
                    ng: result.ng,
                    mapRegion: newRegion,
                });

                // Wait for map region to update and component to re-render
                setTimeout(() => {
                    const geoBounds = mapBounds[newRegion];
                    const pixelBounds = mapPixelBounds[newRegion];
                    
                    if (geoBounds && pixelBounds) {
                        const pixelCoords = convertGeoToPixel(result.latitude, result.longitude, geoBounds, pixelBounds);
                        if (pixelCoords) {
                            setMarkerPoint(pixelCoords);
                        } else {
                            setIsLoading(false); 
                        }
                    } else {
                         setIsLoading(false);
                    }
                }, 200); // Delay to allow MapViewer to load the new image
            } else {
                setIsLoading(false);
            }
        } catch (e) {
            console.error(e);
            setIsLoading(false);
        }
    }, [onUpdate]);

    const handleRegionChange = (value: string) => {
        onUpdate({ mapRegion: value });
        setMarkerPoint(null);
        setSelectedMapColor(null);
        setCoordinates('');
    };
    
    const closestLegendIndex = findClosestColorIndex(selectedMapColor);

    return (
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            {/* Left Panel: Inputs */}
            <div className="w-full lg:w-1/3 flex-shrink-0 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Descargas Atmosféricas (Ng)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <Label htmlFor="locationDisplay">Localização da Estrutura</Label>
                                <div id="locationDisplay" className="flex h-10 w-full items-center rounded-xl border border-slate-700 bg-slate-800/60 px-3 text-sm text-slate-100">
                                    <span className="truncate">{clientAddress || 'Endereço completo (da Etapa 1)'}</span>
                                </div>
                            </div>
                             <Button onClick={() => searchAndSetNg(clientAddress)} disabled={isLoading || !clientAddress} className="w-full">
                                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <MapPin className="w-4 h-4 mr-2" />}
                                Obter Coordenadas Geográficas
                            </Button>
                             <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    readOnly
                                    value={coordinates}
                                    placeholder="Coordenadas Geográficas"
                                    className="pl-9 bg-slate-800/60 border-slate-700"
                                />
                            </div>
                        </div>
                        
                        <div>
                           <Label>Região para Visualização no Mapa</Label>
                            <Select value={mapRegion} onValueChange={handleRegionChange} placeholder="Selecione uma região..." options={regionOptions}>
                                <SelectTrigger>
                                    <span className="truncate text-left text-slate-100">
                                        {regionOptions.find(o => o.value === mapRegion)?.label || 'Brasil (Padrão)'}
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    {regionOptions.map(opt => <SelectItem key={opt.value} value={String(opt.value)} label={opt.label} />)}
                                </SelectContent>
                            </Select>
                        </div>

                        <DecimalInput
                            id="ng"
                            label="(Ng) Densidade de descargas (raios/km²/ano)"
                            value={data.ng}
                            onUpdate={val => onUpdate({ ng: val })}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Legenda do Mapa (Ng)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-8 gap-x-1 gap-y-3">
                            {NG_COLOR_BLOCKS.map((color, index) => {
                                const ngValue = (index * 2) + 2;
                                const isHighlighted = index === closestLegendIndex;
                                return (
                                    <div key={index} className="text-center relative">
                                        <div
                                            className={`h-5 w-full rounded transition-all duration-200 ${isHighlighted ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900' : 'border border-slate-600/50'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                        <span className="text-xs font-medium text-slate-300 mt-1 block">{ngValue}</span>
                                        {isHighlighted && (
                                            <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2">
                                                <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-yellow-400 animate-pulse"></div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Panel: Map */}
            <div className="w-full lg:flex-1">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                         <div></div>
                        <div className="flex gap-2">
                             <Button variant="outline" className="p-2 h-auto" onClick={() => { setMarkerPoint(null); setSelectedMapColor(null); }} aria-label="Limpar Ponto">
                                <X className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" className="p-2 h-auto" onClick={() => mapViewerRef.current?.zoomIn()} aria-label="Aproximar">
                                <ZoomIn className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" className="p-2 h-auto" onClick={() => mapViewerRef.current?.zoomOut()} aria-label="Afastar">
                                <ZoomOut className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" className="p-2 h-auto" onClick={() => mapViewerRef.current?.reset()} aria-label="Centralizar">
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="relative">
                        {isLoading && (
                            <div className="absolute inset-0 bg-slate-900/70 z-10 flex flex-col items-center justify-center rounded-lg backdrop-blur-sm">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                                <p className="mt-4 text-slate-300 font-semibold">Analisando e Mapeando...</p>
                            </div>
                        )}
                        <MapViewer ref={mapViewerRef} imageUrl={mapUrls[mapRegion]} onMapClick={handleMapClick} markerPoint={markerPoint} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}