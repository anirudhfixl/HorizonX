/**
 * Safe conversion from BigInt base units to human-readable decimal strings.
 * Avoids JavaScript floating-point imprecision.
 */
export function formatUnits(amount: bigint, decimals: number, maxDisplayDecimals = 4): string {
  if (amount === 0n) return `0.${'0'.repeat(maxDisplayDecimals)}`;
  const base = 10n ** BigInt(decimals);
  const integerPart = (amount / base).toString();
  const remainder = amount % base;

  if (remainder === 0n) {
    return `${integerPart}.${'0'.repeat(maxDisplayDecimals)}`;
  }

  const fractionString = remainder.toString().padStart(decimals, '0');
  const displayFraction = fractionString.slice(0, maxDisplayDecimals).padEnd(maxDisplayDecimals, '0');

  return `${integerPart}.${displayFraction}`;
}

/**
 * Safe conversion from human-readable decimal string to BigInt base units.
 */
export function parseUnits(amountStr: string, decimals: number): bigint {
  const trimmed = amountStr.trim();
  if (!trimmed || trimmed === '.') return 0n;

  const parts = trimmed.split('.');
  const integerPart = parts[0] || '0';
  const fractionPart = parts[1] || '';

  const cleanInteger = BigInt(integerPart);
  const paddedFraction = fractionPart.slice(0, decimals).padEnd(decimals, '0');
  const cleanFraction = BigInt(paddedFraction);

  return cleanInteger * (10n ** BigInt(decimals)) + cleanFraction;
}
