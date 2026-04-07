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
    // For Case A, city is almost certainly the segment immediately before
    cityCandidate = segments[segments.length - 2] || '';
  } 
  // Case B: UF is PART of the last segment (e.g. "São Paulo MG" or "São Paulo/MG")
  else {
    // Try splitting by space but look for UF list membership
    const spaceSplit = lastSegment.split(/\s+/).filter(Boolean);
    if (spaceSplit.length >= 2) {
      for (let i = spaceSplit.length - 1; i >= 0; i--) {
        const code = toUfCode(spaceSplit[i]);
        if (code && ufList.includes(code)) {
          uf = code;
          cityCandidate = spaceSplit.slice(0, i).join(' ');
          ufIndex = segments.length - 1;
          break;
        }
      }
    }
  }

  // 3. Process City Candidate if UF was found in the end
  if (uf) {
    if (!cityCandidate && ufIndex > 0) {
      cityCandidate = segments[ufIndex - 1];
    }
    
    if (cityCandidate) {
      // Clean city candidate
      let city = cityCandidate
        .replace(/\b(rua|av\.?|avenida|travessa|tv\.?|al\.?|alameda|pç\.?|praça|praca|estrada|rodovia|bairro|centro|conjunto|quadra|qd\.?|lote|lt\.?|bloco|bl\.?|setor|cep\s*[0-9-]*|cidade|municipio|município)\b/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
      
      // Validation: if it's just a number or too short, maybe look one more segment back
      if ((!city || city.length < 2) && ufIndex > 1) {
        city = (segments[ufIndex - 2] || '').trim();
      }

      if (city) return { city, uf };
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
        let rawCity = words.slice(0, j).join(' ') || (i > 0 ? segments[i-1] : '');
        
        // Final cleaning
        let city = rawCity.replace(/\b(cep\s*[0-9-]*|bairro|cidade|município|rua|av|avenida)\b/gi, '').trim();
        if (city && city.length >= 2) return { city, uf };
      }
    }
  }

  return null;
}
