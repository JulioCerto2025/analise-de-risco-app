// Lightweight geocoding via OSM Nominatim (no Gemini)
// Returns city center lat/lon filtered by UF/state in Brazil.

type OSMAddress = {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  hamlet?: string;
  suburb?: string;
  county?: string;
  city_district?: string;
  state?: string;
  region?: string;
  country_code?: string;
  // ISO 3166-2 (ex: "BR-PB") - presente em alguns resultados do Nominatim
  'ISO3166-2-lvl4'?: string;
};

type OSMResult = {
  lat: string;
  lon: string;
  display_name: string;
  address?: OSMAddress;
};

const UF_NAME_TO_CODE: { [normalizedName: string]: string } = {
  'acre': 'AC', 'alagoas': 'AL', 'amazonas': 'AM', 'amapa': 'AP', 'bahia': 'BA',
  'ceara': 'CE', 'distritofederal': 'DF', 'espiritosanto': 'ES', 'goias': 'GO',
  'maranhao': 'MA', 'minasgerais': 'MG', 'matogrossodosul': 'MS', 'matogrosso': 'MT',
  'para': 'PA', 'paraiba': 'PB', 'pernambuco': 'PE', 'piaui': 'PI', 'parana': 'PR',
  'riodejaneiro': 'RJ', 'riograndedonorte': 'RN', 'rondonia': 'RO', 'roraima': 'RR',
  'riograndedosul': 'RS', 'santacatarina': 'SC', 'sergipe': 'SE', 'saopaulo': 'SP',
  'tocantins': 'TO'
};

const VALID_UF_CODES = new Set(Object.values(UF_NAME_TO_CODE));

const normalize = (s: string) =>
  (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').toLowerCase();

function toUfCodeFromStateName(name: string | undefined): string {
  if (!name) return '';
  return UF_NAME_TO_CODE[normalize(name)] || '';
}

/**
 * Extrai código UF do campo ISO 3166-2 retornado pelo Nominatim (ex: "BR-PB" → "PB").
 */
function extractUfFromISO(addr: OSMAddress): string {
  const iso = (addr['ISO3166-2-lvl4'] || '');
  if (iso.startsWith('BR-') && iso.length === 5) {
    const code = iso.slice(3).toUpperCase();
    if (VALID_UF_CODES.has(code)) return code;
  }
  return '';
}

/**
 * Extrai o nome do município de um objeto address do Nominatim.
 * O Nominatim pode retornar o município em diferentes campos dependendo do tipo
 * de localidade (área urbana, rural, distrito, etc.).
 * Prioridade: city > town > municipality > village > hamlet > suburb > city_district > county
 */
function extractCityFromAddress(addr: OSMAddress): string {
  return (
    addr.city ||
    addr.town ||
    addr.municipality ||
    addr.village ||
    addr.hamlet ||
    addr.suburb ||
    addr.city_district ||
    addr.county ||
    ''
  );
}

/**
 * Tenta extrair o nome do município do campo display_name como último recurso.
 * Ex: "Campina Grande, Campina Grande, Paraíba, Brasil" → "Campina Grande"
 */
function extractCityFromDisplayName(displayName: string): string {
  if (!displayName) return '';
  const parts = displayName.split(',').map(p => p.trim());
  for (const part of parts.slice(0, 4)) {
    // Ignora partes muito curtas, numéricas, "Brasil" ou nomes de estado conhecidos
    if (
      part.length > 2 &&
      !/^\d/.test(part) &&
      !normalize(part).includes('brasil') &&
      !UF_NAME_TO_CODE[normalize(part)]
    ) {
      return part;
    }
  }
  return '';
}

export async function geocodeCityWithOSM(city: string, uf: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const q = encodeURIComponent(`${city}, ${uf}, Brasil`);
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=3&addressdetails=1&countrycodes=br&q=${q}`;
    const resp = await fetch(url, { headers: { 'Accept-Language': 'pt-BR,pt;q=0.9' } });
    if (!resp.ok) return null;
    const results: OSMResult[] = await resp.json();
    if (!Array.isArray(results) || results.length === 0) return null;

    const targetUf = (uf || '').toUpperCase();
    const normCity = normalize(city);

    const filtered = results.filter(r => (r.address?.country_code === 'br'));
    const prioritized = filtered.sort((a, b) => {
      const aUf = toUfCodeFromStateName(a.address?.state);
      const bUf = toUfCodeFromStateName(b.address?.state);
      const aCityName = extractCityFromAddress(a.address || {});
      const bCityName = extractCityFromAddress(b.address || {});
      const aCityMatch = normalize(aCityName) === normCity ? 1 : 0;
      const bCityMatch = normalize(bCityName) === normCity ? 1 : 0;
      const aScore = (aUf === targetUf ? 5 : 0) + aCityMatch + (/\b(city|town|village)\b/i.test(a.display_name) ? 1 : 0);
      const bScore = (bUf === targetUf ? 5 : 0) + bCityMatch + (/\b(city|town|village)\b/i.test(b.display_name) ? 1 : 0);
      return bScore - aScore;
    });

    const best = prioritized[0] || results[0];
    const lat = Number(best.lat);
    const lon = Number(best.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
    return { lat, lon };
  } catch (_) {
    return null;
  }
}

/**
 * Reverse geocoding via OSM Nominatim.
 * Dado lat/lon, retorna o município e o código UF mais próximos no Brasil.
 *
 * Estratégia multi-camada:
 * 1. Tenta zoom=12 (nível de município)
 * 2. Tenta zoom=10 (nível de cidade/região)
 * 3. Tenta zoom=8  (nível de estado — garante ao menos o UF)
 * Em cada nível, tenta extrair city de todos os campos possíveis.
 * Se necessário, extrai UF do campo ISO3166-2-lvl4 ("BR-XX").
 * Como último recurso, tenta extrair cidade do display_name.
 */
export async function reverseGeocodeLatLonOSM(
  lat: number,
  lon: number
): Promise<{ city: string; uf: string } | null> {
  const zoomLevels = [12, 10, 8];

  for (const zoom of zoomLevels) {
    try {
      const url =
        `https://nominatim.openstreetmap.org/reverse` +
        `?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1&zoom=${zoom}`;

      const resp = await fetch(url, {
        headers: { 'Accept-Language': 'pt-BR,pt;q=0.9' },
      });

      if (!resp.ok) {
        console.warn(`[reverseGeocode] HTTP ${resp.status} para zoom=${zoom}`);
        continue;
      }

      const result: { address?: OSMAddress; display_name?: string; error?: string } =
        await resp.json();

      // Nominatim retorna { "error": "Unable to geocode" } para oceano/área sem dados
      if (result.error) {
        console.debug(`[reverseGeocode] zoom=${zoom} → error: ${result.error}`);
        continue;
      }

      const addr = result.address || {};

      // Verifica se é Brasil
      if (addr.country_code && addr.country_code !== 'br') {
        console.debug(`[reverseGeocode] zoom=${zoom} → fora do Brasil: ${addr.country_code}`);
        continue;
      }

      // Extrai UF: tenta nome por extenso, depois ISO 3166-2
      const uf = toUfCodeFromStateName(addr.state) || extractUfFromISO(addr);

      // Extrai cidade: tenta todos os campos, depois display_name
      let city = extractCityFromAddress(addr);
      if (!city && result.display_name) {
        city = extractCityFromDisplayName(result.display_name);
      }

      console.debug(`[reverseGeocode] zoom=${zoom}`, { addr, city, uf, display_name: result.display_name });

      if (city && uf) {
        return { city, uf };
      }

      // Se tem UF mas não tem cidade (ex: zoom muito alto retornou só estado)
      // continua para o próximo zoom level
    } catch (err) {
      console.error(`[reverseGeocode] zoom=${zoom} erro:`, err);
    }
  }

  console.warn(`[reverseGeocode] Falhou para lat=${lat}, lon=${lon}`);
  return null;
}