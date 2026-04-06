import { toUfCode, getUfSuggestions } from '../data/ngByCity';

/**
 * Robustly extracts city and state (UF) from a given address string.
 * Supports various formats like "City-UF", "City / UF", "Street, Num, neighborhood, City, UF", etc.
 */
export function extractCityAndUf(address: string): { city: string; uf: string } | null {
  if (!address || typeof address !== 'string') return null;

  // 1. Clean the address and split by common separators
  // We include '/', '-', ',', and ';' as separators. 
  // We keep spaces for multi-word city names but normalize multiple spaces.
  const cleanAddress = address.trim();
  const segments = cleanAddress.split(/[,/;]|-/).map(s => s.trim()).filter(Boolean);

  if (segments.length < 1) return null;

  // 2. Identify UF (looking from the end)
  const ufList = getUfSuggestions(); // ['AC', 'AL', ...]
  let uf = '';
  let cityCandidate = '';
  let ufIndex = -1;

  // Try to find a valid UF in the last segment
  const lastSegment = segments[segments.length - 1];
  
  // Case A: Last segment IS the UF (e.g. "São Paulo - SP")
  const potentialUf = toUfCode(lastSegment);
  if (potentialUf && ufList.includes(potentialUf)) {
    uf = potentialUf;
    ufIndex = segments.length - 1;
  } 
  // Case B: UF is PART of the last segment (e.g. "São Paulo SP" or "São Paulo/SP" if not split correctly)
  else {
    const spaceSplit = lastSegment.split(/\s+/).filter(Boolean);
    if (spaceSplit.length >= 2) {
      const lastWord = spaceSplit[spaceSplit.length - 1];
      const code = toUfCode(lastWord);
      if (code && ufList.includes(code)) {
        uf = code;
        cityCandidate = spaceSplit.slice(0, spaceSplit.length - 1).join(' ');
        ufIndex = segments.length - 1;
      }
    }
  }

  // 3. If UF found at the very end, the city is likely the segment before it
  // unless we already found a city candidate in Case B.
  if (uf) {
    if (!cityCandidate && ufIndex > 0) {
      cityCandidate = segments[ufIndex - 1];
    }
    
    if (cityCandidate) {
      // Validate that city is not accidentally another UF (e.g. "MG - PI")
      const cityAsUf = toUfCode(cityCandidate);
      if (cityAsUf && ufList.includes(cityAsUf)) {
          // If the candidate is a UF, try one segment further back
          if (ufIndex > 1) {
              cityCandidate = segments[ufIndex - 2];
          }
      }

      // Clean city candidate from common prefixes/noise
      let city = cityCandidate
        .replace(/\b(rua|av\.?|avenida|rodovia|estrada|logradouro|praça|praca|alameda|quadra|qd\.|lote|lt\.|bairro|setor|centro|cep\s*[0-9-]*|cidade|municipio|município)\b/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
      
      // If city is empty or just a UF code after cleaning, fallback
      if (!city || (city.length === 2 && ufList.includes(city.toUpperCase()))) city = cityCandidate.trim();

      return { city, uf };
    }
  }

  // Fallback: search for any UF listed in the string from right to left
  for (let i = segments.length - 1; i >= 0; i--) {
    const seg = segments[i];
    const words = seg.split(/\s+/);
    for (let j = words.length - 1; j >= 0; j--) {
      const code = toUfCode(words[j]);
      if (code && ufList.includes(code)) {
        uf = code;
        // City is either words before UF in the SAME segment or the PREVIOUS segment.
        let rawCity = words.slice(0, j).join(' ') || (i > 0 ? segments[i-1] : '');
        
        // Final validation: city shouldn't be just a UF
        if (rawCity && toUfCode(rawCity) && ufList.includes(toUfCode(rawCity))) {
            rawCity = (i > 1 ? segments[i-2] : '');
        }

        if (rawCity && uf) {
             return { 
                 city: rawCity.replace(/\b(cep\s*[0-9-]*|bairro|cidade|município)\b/gi, '').trim(), 
                 uf 
             };
        }
      }
    }
  }

  return null;
}
