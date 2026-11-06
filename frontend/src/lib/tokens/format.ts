const UTC = "UTC";

export const num = (v?: number | null): number => (typeof v === "number" && Number.isFinite(v) ? v : 0);

/** Compact USD for large figures ($1.48B), exact for small ones. */
export function usdCompact(v?: number | null): string {
  if (v == null || !Number.isFinite(v)) return "—";
  const a = Math.abs(v);
  if (a >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
  if (a >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (a >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
  if (a >= 1e4) return `$${(v / 1e3).toFixed(1)}K`;
  return usdPrice(v);
}

/** Unit price: more decimals as the price gets smaller. */
export function usdPrice(v?: number | null): string {
  if (v == null || !Number.isFinite(v)) return "—";
  const a = Math.abs(v);
  const digits = a >= 1 ? 2 : a >= 0.01 ? 4 : a >= 0.0001 ? 6 : 8;
  return `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: digits })}`;
}

export function pct(v?: number | null, digits = 2): string {
  const n = num(v);
  return `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(digits)}%`;
}

export function compactNumber(v?: number | null): string {
  if (v == null || !Number.isFinite(v)) return "—";
  const a = Math.abs(v);
  if (a >= 1e12) return `${(v / 1e12).toFixed(2)}T`;
  if (a >= 1e9) return `${(v / 1e9).toFixed(2)}B`;
  if (a >= 1e6) return `${(v / 1e6).toFixed(2)}M`;
  if (a >= 1e4) return `${(v / 1e3).toFixed(1)}K`;
  return v.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function shortAddress(addr?: string | null, head = 6, tail = 4): string {
  if (!addr) return "—";
  return addr.length > head + tail + 1 ? `${addr.slice(0, head)}…${addr.slice(-tail)}` : addr;
}

/** "Oct 30, 2026". Fixed to UTC so server and client render the same text. */
export function formatDate(input: string | number): string {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: UTC });
}

export function formatDateTime(input: number): string {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "—";
  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: UTC });
  const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: UTC });
  return `${date}, ${time} UTC`;
}

export function parseSupply(value?: string): number {
  const n = Number((value ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function explorerBase(network: string): string {
  const n = network.toLowerCase();
  if (n.includes("sepolia") || n === "ethereum") return "https://sepolia.etherscan.io";
  if (n.includes("base")) return "https://basescan.org";
  if (n.includes("arbitrum")) return "https://arbiscan.io";
  if (n.includes("polygon")) return "https://polygonscan.com";
  return "https://etherscan.io";
}

export function explorerTokenUrl(network: string, address: string): string {
  return `${explorerBase(network)}/token/${address}`;
}

export const verificationLabel = (status?: string): string => {
  switch (status) {
    case "audit_available": return "Audit available";
    case "contract_source_verified": return "Source verified";
    case "project_reviewed": return "Project reviewed";
    case "risk_flag": return "Risk flagged";
    default: return "Not reviewed";
  }
};

export const titleCase = (s: string): string => s.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
