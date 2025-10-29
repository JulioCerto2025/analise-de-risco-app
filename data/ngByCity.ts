export type NgCityDatabase = { [uf: string]: { [city: string]: number } };

let cache: NgCityDatabase | null = null;

// Opcional: Cole aqui seu link da planilha Google
const GOOGLE_SHEET_LINK = 'https://docs.google.com/spreadsheets/d/1eRFd39--q-XYUluLX5MV9rvb6TWpMBDY/edit?usp=sharing&ouid=106286283207433424093&rtpof=true&sd=true';

function extractSheetIdFromUrl(url: string): string | null {
  const m = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return m ? m[1] : null;
}

function parseNumberFlexible(value: string): number | undefined {
  const cleaned = value.replace(/\s+/g, '').replace(',', '.');
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : undefined;
}

function detectDelimiter(line: string): string {
  if (line.includes('\t')) return '\t';
  if (line.includes(';')) return ';';
  if (line.includes('|')) return '|';
  if (line.includes(',')) return ',';
  return ';';
}

function parseTxtToDb(txt: string): NgCityDatabase {
  const lines = txt.split(/\r?\n/);
  const firstNonEmpty = lines.find(l => l.trim().length > 0) || '';
  const delim = detectDelimiter(firstNonEmpty);
  const db: NgCityDatabase = {};
  // Descobrir índices de colunas com base no cabeçalho ou inferência
  const headerParts = firstNonEmpty.split(delim).map(p => p.trim().toLowerCase());
  const findIdx = (keys: string[]) => headerParts.findIndex(h => keys.some(k => h.includes(k)));
  let ufIdx = findIdx(['uf', 'estado', 'state']);
  let cityIdx = findIdx(['cidade', 'município', 'municipio', 'city']);
  let ngIdx = findIdx(['ng', 'descargas', 'raios', 'densidade']);

  if (ufIdx < 0 || cityIdx < 0 || ngIdx < 0) {
    // Inferir a partir da primeira linha de dados que não é cabeçalho
    for (const raw of lines) {
      const line = raw.trim();
      if (!line) continue;
      const parts = line.split(delim).map(p => p.trim());
      if (parts.length < 3) continue;
      const lower = parts.join('').toLowerCase();
      if (lower.includes('uf') || lower.includes('estado') || lower.includes('cidade') || lower.includes('ng')) {
        continue; // provável cabeçalho
      }
      let ufCandidate = -1;
      let ngCandidate = -1;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        const ngNum = parseNumberFlexible(p);
        if (ngNum !== undefined && ngCandidate === -1) ngCandidate = i;
        if (/^[a-zA-Z]{2}$/.test(p) && ufCandidate === -1) ufCandidate = i;
        if (/^[A-Z]{2}$/.test(p.toUpperCase()) && ufCandidate === -1) ufCandidate = i;
      }
      if (ufCandidate !== -1 && ngCandidate !== -1) {
        ufIdx = ufIdx >= 0 ? ufIdx : ufCandidate;
        ngIdx = ngIdx >= 0 ? ngIdx : ngCandidate;
        // cidade é o restante
        for (let i = 0; i < parts.length; i++) {
          if (i !== ufIdx && i !== ngIdx) { cityIdx = i; break; }
        }
      }
      break;
    }
    // fallback conservador se ainda não definido
    if (ufIdx < 0) ufIdx = 0;
    if (cityIdx < 0) cityIdx = 1;
    if (ngIdx < 0) ngIdx = 2;
  }

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const parts = line.split(delim).map(p => p.trim());
    if (parts.length < 3) continue;
    const possibleHeader = parts.map(p => p.toLowerCase()).join('');
    if (possibleHeader.includes('uf') || possibleHeader.includes('estado') || possibleHeader.includes('cidade') || possibleHeader.includes('ng')) {
      continue; // pula cabeçalho
    }
    const ufRaw = parts[ufIdx] || '';
    const cityRaw = parts[cityIdx] || '';
    const ngRaw = parts[ngIdx] || '';
    const uf = ufRaw.toUpperCase();
    const city = cityRaw;
    const ng = parseNumberFlexible(ngRaw);
    if (ng === undefined || !uf || !city) continue;
    if (!db[uf]) db[uf] = {};
    db[uf][city] = ng;
  }
  return db;
}

const UF_CODES = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'] as const;
const UF_NAME_TO_CODE: { [normalizedName: string]: string } = {
  'acre': 'AC', 'alagoas': 'AL', 'amazonas': 'AM', 'amapa': 'AP', 'bahia': 'BA', 'ceara': 'CE', 'distritofederal': 'DF', 'espiritosanto': 'ES', 'goias': 'GO', 'maranhao': 'MA', 'minasgerais': 'MG', 'matogrossodosul': 'MS', 'matogrosso': 'MT', 'para': 'PA', 'paraiba': 'PB', 'pernambuco': 'PE', 'piaui': 'PI', 'parana': 'PR', 'riodejaneiro': 'RJ', 'riograndedonorte': 'RN', 'rondonia': 'RO', 'roraima': 'RR', 'riograndedosul': 'RS', 'santacatarina': 'SC', 'sergipe': 'SE', 'saopaulo': 'SP', 'tocantins': 'TO'
};
const normalize = (s: string) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').toLowerCase();

export function toUfCode(input: string): string {
  const val = (input || '').trim();
  if (val.length === 2) {
    const code = val.toUpperCase();
    if (UF_CODES.includes(code as any)) return code;
  }
  const norm = normalize(val);
  const mapped = UF_NAME_TO_CODE[norm];
  return mapped || '';
}

export function getUfSuggestions(): string[] {
  // Retornar apenas siglas (UF) para não exibir nomes completos nas sugestões
  return [...UF_CODES];
}

async function loadFromGoogleSheet(): Promise<NgCityDatabase | null> {
  try {
    const id = extractSheetIdFromUrl(GOOGLE_SHEET_LINK) || GOOGLE_SHEET_LINK;
    const exportCsvUrl = `https://docs.google.com/spreadsheets/d/${id}/export?format=csv`;
    const gvizCsvUrl = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv`;

    // Tenta export CSV direto
    let resp = await fetch(exportCsvUrl, { mode: 'cors' });
    if (!resp.ok) {
      // Tenta gviz CSV
      resp = await fetch(gvizCsvUrl, { mode: 'cors' });
    }
    if (!resp.ok) return null;

    const txt = await resp.text();
    const parsed = parseTxtToDb(txt);
    if (Object.keys(parsed).length > 0) {
      return parsed;
    }
    return null;
  } catch (_) {
    return null;
  }
}

export async function loadNgDatabase(): Promise<NgCityDatabase> {
  if (cache) return cache;
  // Tenta carregar da Planilha Google pelo link fornecido
  const remote = await loadFromGoogleSheet();
  if (remote && Object.keys(remote).length > 0) {
    cache = remote;
    return cache;
  }
  // Fallback: TXT (Bloco de Notas), depois JSON
  try {
    const txtMod = await import('./ng-by-city.txt?raw');
    const txt = (txtMod as any).default as string;
    const parsed = parseTxtToDb(txt || '');
    if (Object.keys(parsed).length > 0) {
      cache = parsed;
      return cache;
    }
  } catch (_) {
    // ignore if txt not present
  }
  try {
    const jsonMod = await import('./ng-by-city.json');
    cache = ((jsonMod as any).default || (jsonMod as any)) as NgCityDatabase;
    return cache;
  } catch (e) {
    cache = {};
    return cache;
  }
}

export async function getUfs(): Promise<string[]> {
  const db = await loadNgDatabase();
  return Object.keys(db).sort();
}

export async function getCitiesByUf(uf: string): Promise<string[]> {
  const db = await loadNgDatabase();
  const entry = db[uf];
  return entry ? Object.keys(entry).sort() : [];
}

export async function getNgByCity(uf: string, city: string): Promise<number | undefined> {
  const db = await loadNgDatabase();
  const entry = db[uf];
  return entry ? entry[city] : undefined;
}