export function formatCurrency(val?: number): string {
  if (val === undefined || val === null || val === 0) return "$0.00";
  if (val >= 1000000000) return `$${(val / 1000000000).toFixed(2)}B`;
  if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(2)}K`;
  if (val < 0.01) return `$${val.toFixed(4)}`;
  return `$${val.toFixed(2)}`;
}

export function formatNumber(val?: number): string {
  if (val === undefined || val === null) return "0";
  return new Intl.NumberFormat("en-US").format(val);
}

