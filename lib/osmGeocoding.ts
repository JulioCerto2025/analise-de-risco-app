// Lightweight geocoding via OSM Nominatim (no Gemini)
// Returns city center lat/lon filtered by UF/state in Brazil.

type OSMResult = {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    region?: string;
    county?: string;
    country_code?: string;
  };
};

const UF_NAME_TO_CODE: { [normalizedName: string]: string } = {
  'acre': 'AC', 'alagoas': 'AL', 'amazonas': 'AM', 'amapa': 'AP', 'bahia': 'BA', 'ceara': 'CE', 'distritofederal': 'DF', 'espiritosanto': 'ES', 'goias': 'GO', 'maranhao': 'MA', 'minasgerais': 'MG', 'matogrossodosul': 'MS', 'matogrosso': 'MT', 'para': 'PA', 'paraiba': 'PB', 'pernambuco': 'PE', 'piaui': 'PI', 'parana': 'PR', 'riodejaneiro': 'RJ', 'riograndedonorte': 'RN', 'rondonia': 'RO', 'roraima': 'RR', 'riograndedosul': 'RS', 'santacatarina': 'SC', 'sergipe': 'SE', 'saopaulo': 'SP', 'tocantins': 'TO'
};
const normalize = (s: string) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').toLowerCase();

function toUfCodeFromStateName(name: string | undefined): string {
  if (!name) return '';
  const mapped = UF_NAME_TO_CODE[normalize(name)];
  return mapped || '';
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

    // Prefer results where address.country_code is br and UF matches
    const filtered = results.filter(r => (r.address?.country_code === 'br'));
    const prioritized = filtered.sort((a, b) => {
      const aUf = toUfCodeFromStateName(a.address?.state);
      const bUf = toUfCodeFromStateName(b.address?.state);
      const aScore = (aUf === targetUf ? 2 : 0) + (/\b(city|town|village)\b/i.test(a.display_name) ? 1 : 0);
      const bScore = (bUf === targetUf ? 2 : 0) + (/\b(city|town|village)\b/i.test(b.display_name) ? 1 : 0);
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