import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Select, SelectTrigger, SelectContent, SelectItem, Label, Button, AutocompleteInput } from '../ui';
import { ZoomIn, ZoomOut, RefreshCw, X, Loader2 } from "lucide-react";
import { DecimalInput } from "../DecimalInput";
import { AnalysisData } from '../../types';
import { MapViewer, MapViewerHandles } from './MapViewer';
import { getUfs, getCitiesByUf, getNgByCity, toUfCode, getUfSuggestions } from '../../data/ngByCity';
// Removido: geocodificação automática não é mais utilizada

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
    'centro-oeste': { lonMin: -61.0, lonMax: -46.0, latMin: -24.0, latMax: -7.0 },
    'nordeste':     { lonMin: -48.0, lonMax: -34.0, latMin: -18.0, latMax: -1.0 },
    'norte':        { lonMin: -74.0, lonMax: -46.0, latMin: -13.0, latMax: 5.5 },
    // Ajuste fino baseado na grade impressa do mapa Sudeste
    // (faixa mais ampla para casar com a figura):
    // Calibração fina da latitude para o mapa Sudeste (grade impressa)
    'sudeste':      { lonMin: -54.0, lonMax: -39.0, latMin: -26.0, latMax: -16.8 },
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

// Calibração por porcentagem da área da GRADE (retângulo com lat/long) dentro da imagem
// Esses valores foram estimados para as imagens atuais e evitam usar o contorno colorido irregular.
const mapPixelBoundsPercent: { [key: string]: { left: number; top: number; right: number; bottom: number } } = {
  // Sudeste (imagem atual WMhsjys.jpeg): margem esquerda/topo pequena, base com legenda
  // Ajuste fino: se necessário, podemos refinar após inspeção visual
  // Ajuste fino para alinhar ao retângulo da grade impresso
  // Novo ajuste: amplia a base da grade e reduz a margem superior
  'sudeste': { left: 0.072, top: 0.018, right: 0.948, bottom: 0.945 },
  // Sul (ZCh2aYR.jpeg): semelhante, com legenda inferior
  'sul': { left: 0.08, top: 0.04, right: 0.94, bottom: 0.86 },
};

// Viés percentual pós-conversão para correção fina por região
// Aplica deslocamento proporcional à altura/largura útil do retângulo da grade
const regionPixelBiasPercent: { [key: string]: { x?: number; y?: number } } = {
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

const regionOptions = [
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
    const { mapRegion = 'sul', clientAddress = '', location = '' } = data || {};
    const [markerPoint, setMarkerPoint] = useState<{ x: number; y: number } | null>(null);
    const mapViewerRef = useRef<MapViewerHandles>(null);
    const [coordinates, setCoordinates] = useState<string>('');
    const [legendHighlightIndex, setLegendHighlightIndex] = useState<number | null>(null);
    const [palette, setPalette] = useState<string[]>(DEFAULT_NG_COLOR_BLOCKS);
    const [isLoading, setIsLoading] = useState(false);
    const [imageDims, setImageDims] = useState<{ width: number; height: number } | null>(null);
    // Removido: suporte a mapa melhorado via upload/URL e opções de detecção/cor.
    const [availableUfs, setAvailableUfs] = useState<string[]>([]);
    const [availableCities, setAvailableCities] = useState<string[]>([]);
    const [selectedUf, setSelectedUf] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [ufInput, setUfInput] = useState<string>('');
    const [cityInput, setCityInput] = useState<string>('');
    const lastAutoCommitRef = useRef<string>('');
    const lastLocationAppliedRef = useRef<string>('');
    
    // Inicializar valores padrão se necessário
    useEffect(() => {
        if (!data.mapRegion) {
            onUpdate({ ...data, mapRegion: 'sul' });
        }
        (async () => {
            const ufs = await getUfs();
            setAvailableUfs(ufs);
            const match = (data.location || '').match(/^(.*)\s-\s([A-Z]{2})$/i);
            if (match) {
                const city = match[1].trim();
                const uf = match[2].toUpperCase();
                setSelectedUf(uf);
                setUfInput(uf);
                const cities = await getCitiesByUf(uf);
                setAvailableCities(cities);
                setSelectedCity(city);
                setCityInput(city);
                const ngPreset = await getNgByCity(uf, city);
                if (ngPreset !== undefined) {
                    onUpdate({ ng: ngPreset });
                }
                
                // Removido: não posicionar marcador automaticamente
            }
        })();
    }, []);

    // Aplica automaticamente a cidade/UF vindos da Etapa 1 quando "location" muda
    useEffect(() => {
        const applyFromLocation = async () => {
            try {
                const raw = (data.location || '').toString().trim();
                if (!raw) return;
                // aceita "Cidade - UF" e "Cidade/UF"
                const mHyphen = raw.match(/^(.*)\s-\s([A-Z]{2})$/i);
                const mSlash = raw.match(/^(.*)\s\/\s([A-Z]{2})$/i);
                const city = (mHyphen ? mHyphen[1] : mSlash ? mSlash[1] : '').trim();
                const uf = ((mHyphen ? mHyphen[2] : mSlash ? mSlash[2] : '') || '').toUpperCase();
                if (!city || !uf) return;

                const key = `${uf}|${city}`;
                if (lastLocationAppliedRef.current === key) return; // evita reaplicar
                lastLocationAppliedRef.current = key;

                setSelectedUf(uf);
                setUfInput(uf);
                const cities = await getCitiesByUf(uf);
                setAvailableCities(cities);
                setSelectedCity(city);
                setCityInput(city);

                const ngPreset = await getNgByCity(uf, city);
                const region = getRegionFromState(uf);
                onUpdate({ location: `${city} - ${uf}`, ng: ngPreset, mapRegion: region });

                // Removido: não posicionar marcador automaticamente
            } catch (_) {
                // silencioso: se falhar, o usuário pode selecionar manualmente
            }
        };
        applyFromLocation();
    }, [data.location]);

    // Fallback: se "location" não estiver preenchido, tenta extrair Cidade/UF do endereço da Etapa 1
    useEffect(() => {
        const applyFromAddress = async () => {
            try {
                const loc = (data.location || '').toString().trim();
                if (loc) return; // já aplicado via location
                const address = (data.clientAddress || '').toString().trim();
                if (!address) return;

                // Suporta: "Cidade/UF", "Cidade - UF", "Cidade, UF" e "Cidade UF" (UF no final)
                const mSlash = address.match(/^(.*)\s\/\s([A-Za-z]{2})$/i);
                const mHyphen = address.match(/^(.*)\s-\s([A-Za-z]{2})$/i);
                const mComma = address.match(/^(.*),\s*([A-Za-z]{2})$/i);
                const mSpace = address.match(/^(.*)\s([A-Za-z]{2})$/i);
                const city = (mSlash?.[1] || mHyphen?.[1] || mComma?.[1] || mSpace?.[1] || '').trim();
                const uf = ((mSlash?.[2] || mHyphen?.[2] || mComma?.[2] || mSpace?.[2] || '')).toUpperCase();
                if (!city || !uf) return;

                const key = `${uf}|${city}`;
                if (lastLocationAppliedRef.current === key) return;
                lastLocationAppliedRef.current = key;

                setSelectedUf(uf);
                setUfInput(uf);
                const cities = await getCitiesByUf(uf);
                setAvailableCities(cities);
                setSelectedCity(city);
                setCityInput(city);

                const ngPreset = await getNgByCity(uf, city);
                const region = getRegionFromState(uf);
                onUpdate({ location: `${city} - ${uf}`, ng: ngPreset, mapRegion: region });

                // Removido: não posicionar marcador automaticamente
            } catch (_) {
                // silencioso
            }
        };
        applyFromAddress();
    }, [data.clientAddress]);
    
    useEffect(() => {
        // Removido: não associar ponto do cursor à legenda ou valor Ng.
        // Cliques no mapa agora só posicionam o marcador visual.
    }, [markerPoint]);


    const handleMapClick = useCallback(async (clickData: { clickPoint: { x: number, y: number } }) => {
        setCoordinates(''); // Clear geo-coordinates if clicking manually
        setMarkerPoint(clickData.clickPoint);
        try {
            const ref = mapViewerRef.current;
            if (!ref) return;
            // Primeiro: média radial (7x7, raio 3)
            let idx = ref.getDominantPaletteIndexAtPoint(clickData.clickPoint, palette);
            // Fallback: pixel exato caso a média retorne nulo (gridline/tons neutros)
            if (idx === null) {
                idx = ref.getPaletteIndexAtPoint(clickData.clickPoint, palette);
            }
            setLegendHighlightIndex(typeof idx === 'number' && idx >= 0 ? idx : null);
            // Associação direta: ponto clicado define o Ng (2..32)
            if (typeof idx === 'number' && idx >= 0) {
                const ngDetected = (idx * 2) + 2;
                onUpdate({ ng: ngDetected });
            }
        } catch (_) {
            setLegendHighlightIndex(null);
        }
    }, []);

    // Atualiza dimensões da imagem sempre que a região do mapa muda
    useEffect(() => {
        const ref = mapViewerRef.current;
        if (!ref) return;
        // tentar imediatamente e com pequeno atraso para garantir que canvas foi desenhado
        const dimsNow = ref.getImageDimensions();
        if (dimsNow) setImageDims(dimsNow);
        const t = setTimeout(() => {
            const dimsLater = ref.getImageDimensions();
            if (dimsLater) setImageDims(dimsLater);
        }, 300);
        return () => clearTimeout(t);
    }, [mapRegion]);

    // Função auxiliar para obter bounds de pixels dinâmicos baseados na área útil detectada
    const getDynamicPixelBounds = useCallback((region: string): { x1: number; y1: number; x2: number; y2: number } | null => {
        const ref = mapViewerRef.current;
        const dims = imageDims || ref?.getImageDimensions() || null;
        // 1) Preferir calibração por porcentagem da área da GRADE (lat/long)
        const perc = mapPixelBoundsPercent[region];
        if (perc && dims) {
            const x1 = Math.round(dims.width * perc.left);
            const y1 = Math.round(dims.height * perc.top);
            const x2 = Math.round(dims.width * perc.right);
            const y2 = Math.round(dims.height * perc.bottom);
            if (!imageDims) setImageDims(dims);
            return { x1, y1, x2, y2 };
        }
        // 2) Se não houver porcentagem, tenta detecção automática de conteúdo
        const auto = ref?.getContentBounds();
        if (auto) return auto;
        // 3) Depois, bounds calibrados fixos por região
        const calibrated = mapPixelBounds[region];
        if (calibrated) return calibrated;
        // 4) Fallback: dimensões inteiras
        if (dims) {
            if (!imageDims) setImageDims(dims);
            return { x1: 0, y1: 0, x2: dims.width, y2: dims.height };
        }
        return null;
    }, [imageDims]);

    // Função removida - agora usamos apenas seleção manual no mapa

    const handleRegionChange = (value: string) => {
        onUpdate({ mapRegion: value });
        setMarkerPoint(null);
        setCoordinates('');
        // Removido: não reposicionar marcador automaticamente ao trocar de região
    };
    
    const commitUf = async (input: string) => {
        const code = toUfCode(input) || input.toUpperCase();
        if (!code) return;
        setSelectedUf(code);
        setUfInput(code);
        const cities = await getCitiesByUf(code);
        setAvailableCities(cities);
        setSelectedCity('');
        setCityInput('');
        const region = getRegionFromState(code);
        onUpdate({ mapRegion: region });
    };

    const handleUfInputUpdate = async (val: string) => {
        setUfInput(val);
        const maybeCode = toUfCode(val);
        // Se digitou nome completo ou já é sigla, comite automaticamente
        if (maybeCode && (val.length >= 3 || maybeCode === val.toUpperCase() || val.length === 2)) {
            await commitUf(maybeCode);
        }
    };

    const commitCity = async (input: string) => {
        const text = (input || '').trim();
        if (!text) return;
        // pick best match from availableCities
        const normalized = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const exact = availableCities.find(c => normalized(c) === normalized(text));
        const starts = availableCities.find(c => normalized(c).startsWith(normalized(text)));
        const city = exact || starts || text;
        setSelectedCity(city);
        setCityInput(city);
        if (selectedUf) {
            const ngPreset = await getNgByCity(selectedUf, city);
            const loc = `${city} - ${selectedUf}`;
            onUpdate({ location: loc, ng: ngPreset });
            
            // Removido: não posicionar marcador automaticamente
        }
    };

    // Ação manual: aplica Cidade/UF a partir do endereço digitado na Etapa 1
    const applyAddressFromStep1 = async () => {
        const textLoc = (data.location || '').toString().trim();
        const textAddr = (data.clientAddress || '').toString().trim();

        const extractCityUf = (raw: string): { city: string; uf: string } | null => {
            if (!raw) return null;
            // Padrões suportados: "Cidade/UF", "Cidade - UF", "Cidade, UF", "Cidade UF"
            const mSlash = raw.match(/^(.*)\s\/\s([A-Za-z]{2})$/i);
            const mHyphen = raw.match(/^(.*)\s-\s([A-Za-z]{2})$/i);
            const mComma = raw.match(/^(.*),\s*([A-Za-z]{2})$/i);
            const mSpace = raw.match(/^(.*)\s([A-Za-z]{2})$/i);
            let city = (mSlash?.[1] || mHyphen?.[1] || mComma?.[1] || mSpace?.[1] || '').trim();
            let uf = ((mSlash?.[2] || mHyphen?.[2] || mComma?.[2] || mSpace?.[2] || '')).toUpperCase();
            if (!city || !uf) return null;
            // Remove prefixos comuns como "Centro", "Bairro ...", etc.
            city = city.replace(/^(centro|bairro\s+\S+|distrito\s+\S+|zona\s+\S+)\s+/i, '').trim();
            // Normaliza UF para código
            uf = toUfCode(uf) || uf;
            return { city, uf };
        };

        const parsed = extractCityUf(textLoc) || extractCityUf(textAddr);
        if (!parsed) {
            console.log('Não foi possível extrair Cidade/UF do endereço.');
            return;
        }

        const { city, uf } = parsed;
        // Atualiza região de visualização conforme UF
        const region = getRegionFromState(uf);
        onUpdate({ mapRegion: region });

        // Primeiro comitar UF para carregar cidades, depois cidade
        await commitUf(uf);
        // pequeno atraso para garantir que a lista de cidades foi atualizada
        await new Promise(r => setTimeout(r, 150));
        await commitCity(city);
    };

    // Redundância segura: segundo auto-commit com normalização correta de acentos
    useEffect(() => {
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
    useEffect(() => {
        const norm = (s: string) => s.normalize('NFD').replace(/[ -\u036f]/g, '').toLowerCase();
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

    // Aplica automaticamente o endereço da Etapa 1 ao montar se houver dados
    useEffect(() => {
        const run = async () => {
            if (markerPoint) return;
            const hasLoc = (data.location || '').toString().trim().length > 0;
            const hasAddr = (data.clientAddress || '').toString().trim().length > 0;
            if (!hasLoc && !hasAddr) return;
            await applyAddressFromStep1();
        };
        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Removido: posicionamento automático baseado em cidade/UF

    return (
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            {/* Left Panel: Inputs */}
            <div className="w-full lg:w-1/3 flex-shrink-0 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Descargas Atmosféricas (Ng)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Controles de calibração removidos: a detecção agora é automática e robusta */}
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
                            {/* Aplicação automática do endereço da Etapa 1: botão removido */}
                        </div>

                        {/* Removido bloco de exibição de "Localização da Estrutura" conforme solicitação */}

                        <div className="grid grid-cols-[4.5rem,1fr] gap-3 items-end">
                           <div className="w-[4.5rem] justify-self-start">
                               <AutocompleteInput
                                    id="ufInput"
                                    label="Estado (UF)"
                                    value={ufInput}
                                    onUpdate={handleUfInputUpdate}
                                    suggestions={getUfSuggestions()}
                                    placeholder="AM"
                                    className="uppercase text-left w-16"
                                    maxLength={2}
                                    onBlur={() => commitUf(ufInput)}
                                    onCommit={(val) => commitUf(val)}
                                />
                           </div>
                           <div className="min-w-0">
                               <AutocompleteInput
                                   id="cityInput"
                                   label="Cidade"
                                   value={cityInput}
                                   onUpdate={(val) => setCityInput(val)}
                                   suggestions={availableCities}
                                   placeholder="Digite a cidade"
                                   onBlur={() => commitCity(cityInput)}
                                   onCommit={(val) => commitCity(val)}
                               />
                           </div>
                        </div>

                        <DecimalInput
                            id="ng"
                            label="(Ng) Densidade de descargas (raios/km²/ano)"
                            value={data.ng}
                            onUpdate={val => onUpdate({ ng: val })}
                            placeholder="Digite o valor Ng identificado no mapa"
                        />
                    </CardContent>
                </Card>

                <Card className="hidden sm:block">
                    <CardHeader>
                        <CardTitle>Legenda do Mapa (Ng)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {/* Linha superior (2..16) ocupando todo o card */}
                            <div className="grid grid-cols-8 gap-x-4 justify-items-center">
                                {palette.slice(0, 8).map((color, i) => {
                                    const index = i;
                                    const ngValue = (index * 2) + 2;
                                    const isHighlighted = legendHighlightIndex === index;
                                    return (
                                        <div key={index} className="text-center">
                                            <div
                                                className={`h-5 w-5 rounded ${isHighlighted ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900' : 'border border-slate-600/50'}`}
                                                style={{ backgroundColor: color }}
                                            />
                                            <span className="text-xs font-medium text-slate-300 mt-1 block">{ngValue}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* Linha inferior (18..32) ocupando todo o card */}
                            <div className="grid grid-cols-8 gap-x-4 justify-items-center">
                                {palette.slice(8, 16).map((color, i) => {
                                    const index = 8 + i;
                                    const ngValue = (index * 2) + 2;
                                    const isHighlighted = legendHighlightIndex === index;
                                    return (
                                        <div key={index} className="text-center">
                                            <div
                                                className={`h-5 w-5 rounded ${isHighlighted ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900' : 'border border-slate-600/50'}`}
                                                style={{ backgroundColor: color }}
                                            />
                                            <span className="text-xs font-medium text-slate-300 mt-1 block">{ngValue}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Panel: Map (oculto em mobile) */}
            <div className="w-full lg:flex-1 hidden sm:block">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
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