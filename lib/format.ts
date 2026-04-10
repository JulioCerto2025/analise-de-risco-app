export function formatSmartNumber(value: number, options?: { maxDecimals?: number; useScientificBelow?: number; scientificPrecision?: number }) {
  const maxDecimals = options?.maxDecimals ?? 3;
  const threshold = options?.useScientificBelow ?? 0.001;
  const sciPrecision = options?.scientificPrecision ?? 2;
  if (value === null || value === undefined) return '';
  if (!isFinite(value)) return String(value);
  if (value === 0) return '0';
  const abs = Math.abs(value);
  if (abs < threshold) {
    // Notação científica com vírgula no mantissa
    return value.toExponential(sciPrecision).replace('.', ',');
  }
  // Formata usando locale pt-BR para aplicar ponto nos milhares e vírgula nos decimais
  // Máximo de casas decimais é respeitado sem adicionar zeros desnecessários
  return value.toLocaleString('pt-BR', { maximumFractionDigits: maxDecimals });
}

export function formatScientificNode(value: number, precision: number = 2) {
  if (value === 0 || !isFinite(value)) return '0';
  let [mantissa, exponent] = value.toExponential(precision).split('e');
  const cleanExponent = parseInt(exponent, 10);
  return `${mantissa.replace('.', ',')} × 10^${cleanExponent}`;
}