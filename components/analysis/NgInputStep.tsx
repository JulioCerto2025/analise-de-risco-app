import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Label, Button, AutocompleteInput } from '../ui';
import { ZoomIn, ZoomOut, RefreshCw, X, Loader2, MapPin, Zap } from "lucide-react";
import { DecimalInput } from "../DecimalInput";
import { AnalysisData } from '../../types';
import { MapViewerHandles } from './MapViewer';
const MapViewerLazy = React.lazy(() => import('./MapViewer').then(m => ({ default: m.MapViewer })));
import { getUfs, getCitiesByUf, getNgByCity, toUfCode, getUfSuggestions } from '../../data/ngByCity';
import { geocodeCityWithOSM } from '../../lib/osmGeocoding';
import { extractCityAndUf, normalizeCityName } from '../../utils/addressParser';
import { getRegionFromState } from '../../utils/geoUtils';

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

// Coordenadas manuais para corrigir cidades com grande chance de erro de geocodificação
const CITY_COORDS_OVERRIDES: { [uf: string]: { [city: string]: { lat: number; lon: number } } } = {
  MG: {
    // Extrema (MG) – coordenadas aproximadas do centro urbano
    Extrema: { lat: -22.854, lon: -46.321 }
  },
  SP: {
    'Embu-Guaçu': { lat: -23.832, lon: -46.811 },
    'Mogi-Guaçu': { lat: -22.370, lon: -46.942 }
  },
  SC: {
    // Joinville (SC) – para garantir posicionamento dentro do contorno em validações
    Joinville: { lat: -26.304, lon: -48.848 }
  }
};

// Overrides determinísticos de posição em pixels (percentuais dentro do retângulo da grade)
// Útil para casos em que o mapa impresso não está perfeitamente alinhado ao retângulo detectado.
const CITY_PIXEL_OVERRIDES: { [region: string]: { [uf: string]: { [city: string]: { xp: number; yp: number } } } } = {
  'sudeste': {
    'MG': {
      // Extrema (MG): posição calibrada visualmente próxima à divisa SP/MG
      // xp: percentual da largura útil, yp: percentual da altura útil
      Extrema: { xp: 0.53, yp: 0.86 }
    },
    'SP': {
      // Itapeva (SP): sudoeste de SP, próximo à faixa amarela/verde
      Itapeva: { xp: 0.47, yp: 0.88 },
      'Joanópolis': { xp: 0.52, yp: 0.90 },
      'Bragança Paulista': { xp: 0.51, yp: 0.88 }
      // Atibaia (SP): sudeste de Bragança, próximo à transição verde/amarelo
      , Atibaia: { xp: 0.515, yp: 0.893 }
    }
  }
};

// Geographic bounds for each map image grid.
const mapBounds: { [key: string]: { lonMin: number; lonMax: number; latMin: number; latMax: number } } = {
    // Brasil inteiro (conforme grade do mapa nacional)
    // Longitude: ~ -76 a -32; Latitude: ~ -32 a +6
    'brasil':       { lonMin: -76.0, lonMax: -32.0, latMin: -34.0, latMax: 8.0 },
    'centro-oeste': { lonMin: -61.0, lonMax: -46.0, latMin: -24.0, latMax: -7.0 },
    'nordeste':     { lonMin: -48.0, lonMax: -34.0, latMin: -18.0, latMax: -1.0 },
    'norte':        { lonMin: -74.0, lonMax: -46.0, latMin: -13.0, latMax: 5.5 },
    // Ajuste fino baseado na grade impressa do mapa Sudeste
    // (faixa mais ampla para casar com a figura):
    // Calibração fina da latitude para o mapa Sudeste (grade impressa)
    'sudeste':      { lonMin: -54.0, lonMax: -39.0, latMin: -26.0, latMax: -16.8 },
    'sul':          { lonMin: -59.0, lonMax: -47.0, latMin: -35.0, latMax: -22.0 },
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

// Calibração por porcentagem da área da GRADE (retângulo com lat/long) dentro da imagem
// Esses valores foram estimados para as imagens atuais e evitam usar o contorno colorido irregular.
const mapPixelBoundsPercent: { [key: string]: { left: number; top: number; right: number; bottom: number } } = {
  // Brasil (AQcWBhv.png): recorte da área da grade cartográfica, exclui margens e legenda
  // Ajuste fino: amplia margens laterais para não cortar o litoral (Nordeste/Norte)
  'brasil': { left: 0.110, top: 0.050, right: 0.965, bottom: 0.920 },
  // Sudeste (imagem atual WMhsjys.jpeg): margem esquerda/topo pequena, base com legenda
  // Ajuste fino: se necessário, podemos refinar após inspeção visual
  // Ajuste fino para alinhar ao retângulo da grade impresso
  // Novo ajuste: amplia a base da grade e reduz a margem superior
  'sudeste': { left: 0.072, top: 0.018, right: 0.948, bottom: 0.945 },
  // Sul (ZCh2aYR.jpeg): Grid expanded to match -59 to -47 and -35 to -22
  'sul': { left: 0.065, top: 0.045, right: 0.955, bottom: 0.88 },
};

// Viés percentual pós-conversão para correção fina por região
// Aplica deslocamento proporcional à altura/largura útil do retângulo da grade
const regionPixelBiasPercent: { [key: string]: { x?: number; y?: number } } = {
  // Pequenos deslocamentos para compensar margens na imagem do Brasil
  brasil: { x: -0.012, y: -0.010 },
  sudeste: { x: 0, y: 0.050 },
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

    // Ensure coordinates are within bounds
    const clampedLon = Math.max(geoBounds.lonMin, Math.min(geoBounds.lonMax, lon));
    const clampedLat = Math.max(geoBounds.latMin, Math.min(geoBounds.latMax, lat));
    
    // Calculate the ratio of the coordinates within the geographic bounds
    // Note: For latitude, we invert the ratio because map coordinates have origin at top-left
    const lonRatio = (clampedLon - geoBounds.lonMin) / (geoBounds.lonMax - geoBounds.lonMin);
    const latRatio = (clampedLat - geoBounds.latMin) / (geoBounds.latMax - geoBounds.latMin);
    
    // Calculate pixel dimensions
    const pixelWidth = pixelBounds.x2 - pixelBounds.x1;
    const pixelHeight = pixelBounds.y2 - pixelBounds.y1;

    // Convert to pixel coordinates
    // For y-coordinate, we invert the ratio (1-latRatio) because geographic coordinates 
    // increase from bottom to top, but pixel coordinates increase from top to bottom
    const x = pixelBounds.x1 + (lonRatio * pixelWidth);
    const y = pixelBounds.y1 + ((1 - latRatio) * pixelHeight);

    return { x: Math.round(x), y: Math.round(y) };
};
// Converte posição em pixels (clique) para coordenadas geográficas (lat/lon) usando os limites precisos
const convertPixelToGeo = (
    x: number,
    y: number,
    geoBounds: { lonMin: number; lonMax: number; latMin: number; latMax: number },
    pixelBounds: { x1: number; y1: number; x2: number; y2: number }
): { lat: number; lon: number } | null => {
    if (!geoBounds || !pixelBounds) return null;
    const pixelWidth = pixelBounds.x2 - pixelBounds.x1;
    const pixelHeight = pixelBounds.y2 - pixelBounds.y1;
    if (pixelWidth <= 0 || pixelHeight <= 0) return null;
    const clampedX = Math.max(pixelBounds.x1, Math.min(pixelBounds.x2, x));
    const clampedY = Math.max(pixelBounds.y1, Math.min(pixelBounds.y2, y));
    const xRatio = (clampedX - pixelBounds.x1) / pixelWidth;
    const yRatio = (clampedY - pixelBounds.y1) / pixelHeight;
    const lon = geoBounds.lonMin + xRatio * (geoBounds.lonMax - geoBounds.lonMin);
    // Inverte a latitude: topo da figura corresponde ao maior valor de latitude
    const lat = geoBounds.latMax - yRatio * (geoBounds.latMax - geoBounds.latMin);
    return { lat, lon };
};

const regionOptions = [
    { value: 'brasil', label: 'Brasil' },
    { value: 'centro-oeste', label: 'Centro-Oeste' },
    { value: 'nordeste', label: 'Nordeste' },
    { value: 'norte', label: 'Norte' },
    { value: 'sudeste', label: 'Sudeste' },
    { value: 'sul', label: 'Sul' },
];

// Paleta alinhada à legenda original do mapa (Ng: raios/km²/ano)
// Ordem: rosa → magenta → roxo → azul → ciano → verde → amarelo → laranja → vermelho → preto
const DEFAULT_NG_COLOR_BLOCKS = [
  '#ffc2f0', // 2  - rosa claro
  '#ff00ff', // 4  - magenta
  '#a000ff', // 6  - roxo vivo
  '#3f00ff', // 8  - violeta/indigo
  '#0000ff', // 10 - azul escuro
  '#5ea4ff', // 12 - azul médio
  '#2fd5ff', // 14 - ciano
  '#00ffff', // 16 - ciano claro
  '#00ff00', // 18 - verde neon
  '#aaff00', // 20 - amarelo‑verde
  '#fff600', // 22 - amarelo vivo
  '#ffd300', // 24 - amarelo quente
  '#ffa500', // 26 - laranja
  '#ff0000', // 28 - vermelho
  '#8b0000', // 30 - vermelho escuro
  '#000000'  // 32 - preto
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

    DEFAULT_NG_COLOR_BLOCKS.forEach((blockHex, index) => {
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


// getRegionFromState moved to utils/geoUtils.ts

export function NgInputStep({ data, onUpdate }: NgInputStepProps) {
    const { mapRegion = 'brasil', clientAddress = '', location = '' } = data || {};
    const [markerPoint, setMarkerPoint] = React.useState<{ x: number; y: number } | null>(null);
    const mapViewerRef = React.useRef<MapViewerHandles>(null);
    // Removido: estado de coordenadas e calibração OCR
    const [legendHighlightIndex, setLegendHighlightIndex] = React.useState<number | null>(null);
    const [palette, setPalette] = React.useState<string[]>(DEFAULT_NG_COLOR_BLOCKS);
    const [isLoading, setIsLoading] = React.useState(false);
    const [imageDims, setImageDims] = React.useState<{ width: number; height: number } | null>(null);
    // Removido: suporte a mapa melhorado via upload/URL e opções de detecção/cor.
    const [availableUfs, setAvailableUfs] = React.useState<string[]>([]);
    const [availableCities, setAvailableCities] = React.useState<string[]>([]);
    const [selectedUf, setSelectedUf] = React.useState<string>('');
    const [selectedCity, setSelectedCity] = React.useState<string>('');
    const [ufInput, setUfInput] = React.useState<string>('');
    const [cityInput, setCityInput] = React.useState<string>('');
    const [ufError, setUfError] = React.useState<string | null>(null);
    const lastAutoCommitRef = React.useRef<string>('');
    const lastLocationAppliedRef = React.useRef<string>('');
    const lastProcessedAddressRef = React.useRef<string>('');
    // Coordenadas da cidade (lat/lon). Tenta override local e, se não houver, geocodifica via OSM.
    const [coordsForCity, setCoordsForCity] = React.useState<{ lat: number; lon: number } | null>(null);

    // Função auxiliar para obter bounds de pixels dinâmicos baseados na área útil detectada
    const getDynamicPixelBounds = React.useCallback((region: string): { x1: number; y1: number; x2: number; y2: number } | null => {
        const ref = mapViewerRef.current;
        const dims = imageDims || ref?.getImageDimensions() || null;
        const perc = mapPixelBoundsPercent[region];
        if (perc && dims) {
            const x1 = Math.round(dims.width * perc.left);
            const y1 = Math.round(dims.height * perc.top);
            const x2 = Math.round(dims.width * perc.right);
            const y2 = Math.round(dims.height * perc.bottom);
            return { x1, y1, x2, y2 };
        }
        const auto = ref?.getContentBounds();
        if (auto) return auto;
        const calibrated = mapPixelBounds[region];
        if (calibrated) return calibrated;
        if (dims) {
            return { x1: 0, y1: 0, x2: dims.width, y2: dims.height };
        }
        return null;
    }, [imageDims]);

    // Efeito para posicionar o marcador inicial se houver coordenadas salvas
    React.useEffect(() => {
        const region = mapRegion || 'brasil';
        const geoBounds = mapBounds[region];
        const pixelBounds = getDynamicPixelBounds(region);

        if (data.lat && data.lon && geoBounds && pixelBounds) {
            const px = convertGeoToPixel(data.lat, data.lon, geoBounds, pixelBounds);
            if (px) {
                const bias = regionPixelBiasPercent[region] || {};
                const width = (pixelBounds.x2 - pixelBounds.x1);
                const height = (pixelBounds.y2 - pixelBounds.y1);
                const bx = Math.round((bias.x || 0) * width);
                const by = Math.round((bias.y || 0) * height);
                const biased = { x: px.x + bx, y: px.y + by };

                const ref = mapViewerRef.current;
                const finalPoint = ref?.findNearestContentPoint(biased, 14) || biased;

                if (!markerPoint || Math.abs(finalPoint.x - markerPoint.x) > 1 || Math.abs(finalPoint.y - markerPoint.y) > 1) {
                     setMarkerPoint(finalPoint);
                }
            }
        }
    }, [data.lat, data.lon, mapRegion, getDynamicPixelBounds, imageDims, markerPoint]);

    // Efeito unificado para busca de coordenadas (reativo a drafts e seleções oficiais)
    // Com debounce de 600ms para evitar rate-limit no OSM
    React.useEffect(() => {
        const run = async () => {
            try {
                const uf = (selectedUf || ufInput || '').trim().toUpperCase();
                const city = (selectedCity || cityInput || '').trim();

                if (!uf || !city || uf.length < 2) { 
                    setCoordsForCity(null); 
                    return; 
                }
                
                const ufCode = (toUfCode(uf) || uf).toUpperCase();
                const byUf = CITY_COORDS_OVERRIDES[ufCode];
                let override = null;
                if (byUf) {
                    const cityName = city.trim();
                    const foundKey = Object.keys(byUf).find(k => k.toLowerCase() === cityName.toLowerCase());
                    if (foundKey) override = byUf[foundKey];
                }
                
                const coords = override || await geocodeCityWithOSM(city, ufCode);
                if (coords) {
                    setCoordsForCity(coords);
                    // Persiste as coordenadas no estado global para estabilidade
                    if (coords.lat !== data.lat || coords.lon !== data.lon) {
                        onUpdate({ lat: coords.lat, lon: coords.lon });
                    }
                }
            } catch (_) {
                setCoordsForCity(null);
            }
        };
        const t = setTimeout(run, 600);
        return () => clearTimeout(t);
    }, [selectedUf, selectedCity, ufInput, cityInput]);

    // Determina a cor do card NG com base no valor atual (2..32)
    const ngPaletteIndex = React.useMemo(() => {
        const ng = typeof data.ng === 'number' ? data.ng : null;
        if (ng && ng >= 2 && ng <= 32) {
            const idx = Math.round((ng - 2) / 2);
            return Math.max(0, Math.min(palette.length - 1, idx));
        }
        return legendHighlightIndex ?? null;
    }, [data.ng, legendHighlightIndex, palette.length]);

    const ngColorHex = React.useMemo(() => {
        return typeof ngPaletteIndex === 'number' && ngPaletteIndex >= 0 ? palette[ngPaletteIndex] : '#ff0000';
    }, [ngPaletteIndex, palette]);

    const ngBgRgba = React.useMemo(() => {
        const rgb = hexToRgb(ngColorHex);
        // Retornando à cor dinâmica da legenda para consistência visual solicitada
        return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)` : 'rgba(15, 23, 42, 0.2)'; 
    }, [ngColorHex]);
    
    // Inicialização: carrega UFs (preserva região se já existir)
    React.useEffect(() => {
        if (!mapRegion) onUpdate({ mapRegion: 'brasil' });
        (async () => {
            const ufs = await getUfs();
            setAvailableUfs(ufs);
        })();
    }, []);

    // Sync robusto: monitora a localização global (Step 1) e atualiza os campos da Step 2
    // Prioriza o rascunho apenas se a localização estiver vazia ou for igual à anterior
    React.useEffect(() => {
        const loc = (data.location || '').toString().trim();
        if (!loc || loc === lastLocationAppliedRef.current) return;
        
        lastLocationAppliedRef.current = loc;

        // Formatos aceitos: "Cidade - UF", "Cidade / UF", etc.
        const parsed = extractCityAndUf(loc);
        if (!parsed) return;

        const { city, uf } = parsed;

        if (!city || !uf) return;

        (async () => {
            // Commit silencioso para sincronizar os inputs locais com a localização global
            const ufs = await getUfs();
            if (ufs.includes(uf)) {
                setUfInput(uf);
                setSelectedUf(uf);
                setUfError(null);
                const cities = await getCitiesByUf(uf);
                setAvailableCities(cities);
                
                // Normalização robusta para encontrar a cidade na lista oficial
                const rawNorm = normalizeCityName(city);
                const matchedCity = cities.find(c => normalizeCityName(c) === rawNorm) || city;
                
                setCityInput(matchedCity);
                setSelectedCity(matchedCity);
                
                const region = getRegionFromState(uf) || 'brasil';
                if (data.mapRegion !== region) {
                    onUpdate({ mapRegion: region });
                }

                // Força atualização automática do Ng (se disponível) para evitar valores residuais (ex: 20)
                const presetNg = await getNgByCity(uf, matchedCity);
                if (typeof presetNg === 'number' && presetNg > 0) {
                    onUpdate({ ng: presetNg });
                }
            }
        })();
    }, [data.location]);

    // Reidratação de rascunhos: se houver ufDraft/cityDraft salvos, restaura nos inputs sem comitar
    React.useEffect(() => {
        const ufDraftRaw = ((data.ufDraft || '') as any).toString().trim().toUpperCase();
        const cityDraftRaw = ((data.cityDraft || '') as any).toString().trim();
        // Restaura UF digitada se não houver UF selecionada
        if (ufDraftRaw && !ufInput && !selectedUf) {
            setUfInput(ufDraftRaw);
            // Carrega sugestões de cidades para facilitar autocompletar, sem comitar UF
            (async () => {
                const code = toUfCode(ufDraftRaw) || ufDraftRaw;
                const validUfs = getUfSuggestions();
                if (code && validUfs.includes(code) && availableCities.length === 0) {
                    try {
                        const cities = await getCitiesByUf(code);
                        setAvailableCities(cities);
                    } catch (_) { /* ignora erro */ }
                }
            })();
        }
        // Restaura cidade digitada se não houver cidade selecionada
        if (cityDraftRaw && !cityInput && !selectedCity) {
            setCityInput(cityDraftRaw);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.ufDraft, data.cityDraft]);
    
    React.useEffect(() => {
        // Removido: não associar ponto do cursor à legenda ou valor Ng.
        // Cliques no mapa agora só posicionam o marcador visual.
    }, [markerPoint]);


    const handleMapClick = React.useCallback(async (clickData: { clickPoint: { x: number, y: number } }) => {
        setMarkerPoint(clickData.clickPoint);
        try {
            const ref = mapViewerRef.current;
            if (!ref) return;

            const region = mapRegion || 'brasil';
            const geoBounds = mapBounds[region];
            const pixelBounds = getDynamicPixelBounds(region);

            // Primeiro: média radial (7x7, raio 3)
            let idx = ref.getDominantPaletteIndexAtPoint(clickData.clickPoint, palette);
            // Fallback: pixel exato caso a média retorne nulo (gridline/tons neutros)
            if (idx === null) {
                idx = ref.getPaletteIndexAtPoint(clickData.clickPoint, palette);
            }
            setLegendHighlightIndex(typeof idx === 'number' && idx >= 0 ? idx : null);
            
            // Novos dados para atualização
            const updates: any = {};

            // 1. Atualização do Ng (2..32)
            if (typeof idx === 'number' && idx >= 0) {
                updates.ng = (idx * 2) + 2;
            }

            // 2. IMPORTANTE: Atualização de Coordenadas (evita snap-back)
            if (geoBounds && pixelBounds) {
                const geo = convertPixelToGeo(clickData.clickPoint.x, clickData.clickPoint.y, geoBounds, pixelBounds);
                if (geo) {
                    updates.lat = geo.lat;
                    updates.lon = geo.lon;
                }
            }

            if (Object.keys(updates).length > 0) {
                onUpdate(updates);
            }
        } catch (_) {
            setLegendHighlightIndex(null);
        }
    }, [mapRegion, getDynamicPixelBounds, palette]);

    // Removido: handler com geocodificação reversa e coordenadas

    
    

    // Atualiza dimensões da imagem sempre que a região do mapa muda
    // (Opcional, pois onImageLoad já trata o carregamento inicial e trocas)
    React.useEffect(() => {
        const ref = mapViewerRef.current;
        if (!ref) return;
        const dimsNow = ref.getImageDimensions();
        if (dimsNow) setImageDims(dimsNow);
    }, [mapRegion]);

    // Função auxiliar para obter bounds de pixels dinâmicos baseados na área útil detectada



    // Removido: calibração OCR e conversões geo↔pixel

    // Manipulador que usa calibração OCR dos eixos para converter pixel→geo fiel ao desenho
    // Removido: handler de clique com OCR/geocodificação

    // Redundância de coordenadas unificada no efeito superior


    // Removido: posicionamento quando a imagem fica pronta

    // Função removida - agora usamos apenas seleção manual no mapa

    const handleRegionChange = (value: string) => {
        onUpdate({ mapRegion: value });
        setMarkerPoint(null);
        // Removido: limpeza de coordenadas
    };

    // Removido: colagem de coordenadas do Google Maps
    
    const commitUf = async (input: string) => {
        const raw = (input || '').toUpperCase().trim();
        const code = toUfCode(raw) || raw;
        const validUfs = getUfSuggestions();
        if (!code || !validUfs.includes(code)) {
            // Bloqueia commits inválidos e informa o usuário
            setUfError('UF inválida. Use códigos como PB, SP, RJ, etc.');
            setSelectedUf('');
            setUfInput(raw);
            setAvailableCities([]);
            setSelectedCity('');
            setCityInput('');
            return;
        }
        setUfError(null);
        setSelectedUf(code);
        setUfInput(code);
        const cities = await getCitiesByUf(code);
        setAvailableCities(cities);
        setSelectedCity('');
        setCityInput('');
        const region = getRegionFromState(code) || 'brasil';
        onUpdate({ mapRegion: region });
    };

    const handleUfInputUpdate = async (val: string) => {
        // Sem commit automático; aguarda blur ou confirmação.
        setUfInput(val);
        // Persistir rascunho no estado global para manter ao navegar
        try {
            onUpdate({ ufDraft: val.toUpperCase() } as any);
        } catch (_) { /* silencioso */ }
    };

    const commitCity = async (input: string) => {
        const text = (input || '').trim();
        if (!text) return;
        
        const rawNorm = normalizeCityName(text);
        const exact = availableCities.find(c => normalizeCityName(c) === rawNorm);
        const city = exact || text;
        
        setSelectedCity(city);
        setCityInput(city);
        try { onUpdate({ cityDraft: city } as any); } catch (_) { /* silencioso */ }

        const ufToUse = selectedUf || (toUfCode((ufInput || '').toUpperCase()) || (ufInput || '').toUpperCase());
        const validUfs = getUfSuggestions();

        if (ufToUse && validUfs.includes(ufToUse)) {
            if (!selectedUf) await commitUf(ufToUse);
            
            const ngPreset = await getNgByCity(ufToUse, city);
            const loc = `${city} - ${ufToUse}`;
            
            // Tenta override de coordenadas
            const byUf = CITY_COORDS_OVERRIDES[ufToUse.toUpperCase()] || {};
            const foundKey = Object.keys(byUf).find(k => normalizeCityName(k) === normalizeCityName(city));
            const override = foundKey ? byUf[foundKey] : null;

            const updates: any = { 
                location: loc, 
                cityDraft: city, 
                ufDraft: ufToUse,
            };
            if (typeof ngPreset === 'number' && ngPreset > 0) {
                updates.ng = ngPreset;
            }
            if (override) {
                updates.lat = override.lat;
                updates.lon = override.lon;
            }
            
            onUpdate(updates);
        }
    };

    // Ação manual: aplica Cidade/UF a partir do endereço digitado na Etapa 1
    const applyAddressFromStep1 = async () => {
        const textLoc = (data.location || '').toString().trim();
        const textAddr = (data.clientAddress || '').toString().trim();

        const parsed = extractCityAndUf(textLoc) || extractCityAndUf(textAddr);
        if (!parsed) {
            console.log('Não foi possível extrair Cidade/UF do endereço.');
            return;
        }

        const { city, uf } = parsed;

        // Primeiro comitar UF para carregar cidades, depois cidade
        await commitUf(uf);
        // pequeno atraso para garantir que a lista de cidades foi atualizada
        await new Promise(r => setTimeout(r, 150));
        await commitCity(city);
        // Removido: não tentar posicionar explicitamente
    };

// Redundância segura: segundo auto-commit com normalização correta de acentos
    React.useEffect(() => {
        // Auto-commit desativado
        return;
        const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const city = (cityInput || '').trim();
        if (!selectedUf || !city) return;
        const match = availableCities.find(c => norm(c) === norm(city));
        const key = `${selectedUf}|${city}`;
        if (match && lastAutoCommitRef.current !== key) {
            lastAutoCommitRef.current = key;
            const t = setTimeout(() => { commitCity(city); }, 250);
            return () => clearTimeout(t);
        }
    }, [cityInput, selectedUf, availableCities]);

// Auto-commit: quando a digitação coincidir com uma cidade conhecida, posiciona automaticamente
    React.useEffect(() => {
        // Auto-commit desativado
        return;
        const norm = (s: string) => s.normalize('NFD').replace(/[ -\u036f]/g, '').toLowerCase();
        const city = (cityInput || '').trim();
        if (!selectedUf || !city) return;
        const match = availableCities.find(c => norm(c) === norm(city));
        const key = `${selectedUf}|${city}`;
        if (match && lastAutoCommitRef.current !== key) {
            lastAutoCommitRef.current = key;
            // Debounce curto para evitar múltiplas chamadas durante digitação
            const t = setTimeout(() => { commitCity(city); }, 250);
            return () => clearTimeout(t);
        }
    }, [cityInput, selectedUf, availableCities]);

    // Removido: função de posicionamento automático do marcador por cidade/UF
    
    // Removido: não destacar por cor do ponto clicado.

    // Removido: aplicação automática do endereço da Etapa 1 ao montar

    // Removido: posicionamento automático baseado em cidade/UF

    return (
        <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            {/* Left Panel: Inputs */}
            <div className="w-full lg:w-1/3 flex-shrink-0 space-y-4">
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle>Descargas Atmosféricas (Ng)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2.5 p-4">
                        {/* Controles de calibração removidos: a detecção agora é automática e robusta */}
                        <div className="space-y-1">
                           <Label className="pl-0.5">Visualização - Região Mapa</Label>
                            <Select value={mapRegion} onValueChange={handleRegionChange} placeholder="Selecione uma região..." options={regionOptions}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {regionOptions.map(opt => <SelectItem key={opt.value} value={String(opt.value)} label={opt.label} />)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-[4.5rem,1fr] gap-2 items-end">
                           <div className="w-[4.5rem] justify-self-start">
                                <AutocompleteInput
                                    id="ufInput"
                                    label="Estado (UF)"
                                    value={ufInput}
                                    onUpdate={handleUfInputUpdate}
                                    suggestions={getUfSuggestions()}
                                    placeholder="PB"
                                    className="uppercase text-left w-16"
                                    maxLength={2}
                                    autoComplete="off"
                                    onBlur={() => commitUf(ufInput)}
                                    onCommit={(val) => commitUf(val)}
                                />
                                {ufError && (
                                    <p className="text-red-400 text-[10px] mt-1">{ufError}</p>
                                )}
                           </div>
                           <div className="min-w-0">
                               <AutocompleteInput
                                   id="cityInput"
                                   label="Cidade"
                                   value={cityInput}
                                   onUpdate={(val) => { setCityInput(val); try { onUpdate({ cityDraft: val } as any); } catch (_) {} }}
                                   suggestions={availableCities}
                                   placeholder="Digite a cidade"
                                   autoComplete="off"
                                   onBlur={() => commitCity(cityInput)}
                                   onCommit={(val) => commitCity(val)}
                               />
                           </div>
                        </div>

                        <div className="mx-auto w-fit space-y-2">
                            {/* Coordenadas (w-full para igualar largura) */}
                            <div
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border-2 border-slate-700 text-slate-100 text-base md:text-lg font-bold shadow-sm"
                                aria-label="Coordenadas da cidade selecionada"
                            >
                                <div className="grid grid-cols-[auto_1fr] gap-x-3">
                                    <div className="row-span-2 flex items-center justify-center">
                                        <MapPin className="h-6 w-6 text-slate-300" aria-hidden="true" />
                                    </div>
                                    <div className="flex items-baseline justify-between">
                                        <span className="font-mono whitespace-pre tracking-wide text-xs opacity-70">Lat.  Y:</span>
                                        <span className="font-mono tabular-nums text-right text-lg md:text-xl">{coordsForCity ? coordsForCity.lat.toFixed(2) : '--'}</span>
                                    </div>
                                    <div className="flex items-baseline justify-between">
                                        <span className="font-mono whitespace-pre tracking-wide text-xs opacity-70">Long. X:</span>
                                        <span className="font-mono tabular-nums text-right text-lg md:text-xl">{coordsForCity ? coordsForCity.lon.toFixed(2) : '--'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* NG (w-full para igualar largura) */}
                            <div
                                className={`w-full px-4 py-2.5 rounded-xl text-white border-2 transition-all backdrop-blur-md ${data.is_ng_manual ? 'ring-2 ring-yellow-400/50 ring-offset-2 ring-offset-slate-950' : ''}`}
                                style={{ backgroundColor: ngBgRgba, borderColor: ngColorHex }}
                                aria-label="Valor NG atual"
                            >
                                <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 items-center">
                                    <div className="flex items-center justify-center">
                                        <Zap className={`h-8 w-8 ${data.is_ng_manual ? 'text-yellow-400' : 'text-white'}`} aria-hidden="true" />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="tracking-wide text-2xl md:text-3xl font-extrabold">NG</span>
                                            <DecimalInput
                                                value={data.ng}
                                                onUpdate={(val) => onUpdate({ ng: val, is_ng_manual: true })}
                                                className="bg-transparent border-none text-white font-mono tabular-nums w-24 text-center focus:outline-none focus:ring-0 text-2xl md:text-3xl font-extrabold p-0 h-auto"
                                                noWrapper
                                            />
                                        </div>
                                    </div>
                                    {data.is_ng_manual && (
                                        <button 
                                            onClick={async () => {
                                                const ngAuto = await getNgByCity(selectedUf, selectedCity);
                                                onUpdate({ ng: ngAuto || 0, is_ng_manual: false });
                                            }}
                                            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                                            title="Restaurar valor automático da norma"
                                        >
                                            <RefreshCw className="h-4 w-4 text-white/70" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <Label className="block w-full whitespace-nowrap text-center text-[10px] md:text-[11px] text-slate-300 font-bold tracking-wider uppercase opacity-80">
                                {data.is_ng_manual ? 'Dens. Desc. (Definida pelo Usuário)' : '(Ng) Dens. Desc. (raios/km²/ano)'}
                            </Label>
                        </div>

                        {/* Campo redundante de NG removido para priorizar captura por clique */}
                    </CardContent>
                </Card>

                <Card className="block">
                    <CardHeader className="py-3 px-4">
                        <CardTitle>Legenda do Mapa (Ng)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-2">
                            {/* Linha superior (2..16) ocupando todo o card */}
                            <div className="grid grid-cols-8 gap-x-2 justify-items-center">
                                {palette.slice(0, 8).map((color, i) => {
                                    const index = i;
                                    const ngValue = (index * 2) + 2;
                                    const isHighlighted = legendHighlightIndex === index;
                                    return (
                                        <div key={index} className="text-center">
                                            <div
                                                className={`h-4 w-4 rounded ${isHighlighted ? 'ring-1 ring-yellow-400 ring-offset-1 ring-offset-slate-900' : 'border border-slate-600/50'}`}
                                                style={{ backgroundColor: color }}
                                            />
                                            <span className="text-xs font-medium text-slate-300 mt-0.5 block">{ngValue}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* Linha inferior (18..32) ocupando todo o card */}
                            <div className="grid grid-cols-8 gap-x-2 justify-items-center">
                                {palette.slice(8, 16).map((color, i) => {
                                    const index = 8 + i;
                                    const ngValue = (index * 2) + 2;
                                    const isHighlighted = legendHighlightIndex === index;
                                    return (
                                        <div key={index} className="text-center">
                                            <div
                                                className={`h-4 w-4 rounded ${isHighlighted ? 'ring-1 ring-yellow-400 ring-offset-1 ring-offset-slate-900' : 'border border-slate-600/50'}`}
                                                style={{ backgroundColor: color }}
                                            />
                                            <span className="text-xs font-medium text-slate-300 mt-0.5 block">{ngValue}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Panel: Map (visível também em mobile para capturar NG por clique) */}
            <div className="w-full lg:flex-1 block">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                         <div className="flex items-center gap-4">
                            {/* Controles removidos para simplificar a UI */}
                         </div>
                         <div className="flex gap-2">
                            <Button variant="outline" className="p-2 h-auto" onClick={() => { setMarkerPoint(null); setLegendHighlightIndex(null); }} aria-label="Limpar Ponto">
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
                    <CardContent className="relative p-4">
                        {isLoading && (
                            <div className="absolute inset-0 bg-slate-900/70 z-10 flex flex-col items-center justify-center rounded-lg backdrop-blur-sm">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                                <p className="mt-4 text-slate-300 font-semibold">Analisando e Mapeando...</p>
                            </div>
                        )}
                        <React.Suspense fallback={<div className="h-[450px] w-full flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-400" /></div>}>
                            <MapViewerLazy
                                key={mapRegion}
                                ref={mapViewerRef}
                                imageUrl={mapUrls[mapRegion] || mapUrls['brasil']}
                                onMapClick={handleMapClick}
                                markerPoint={markerPoint}
                                onImageLoad={(dims) => setImageDims(dims)}
                            />
                        </React.Suspense>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}