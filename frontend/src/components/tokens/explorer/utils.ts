import type { TokenWithMarket, Filters, SortField } from "./types";
import { SESSION_TOKENS_STORAGE_KEY } from "@/lib/data-provenance";

export function formatCurrency(val?: number): string {
  if (val === undefined || val === null || val === 0) return "$0.00";
  if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(2)}B`;
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(2)}K`;
  if (val < 0.01) return `$${val.toFixed(4)}`;
  return `$${val.toFixed(2)}`;
}

export function formatPrice(val?: number): string {
  return val === undefined || val === null ? "—" : `$${val}`;
}

export function formatChange(val?: number): string {
  if (val === undefined || val === null) return "—";
  return `${val >= 0 ? "+" : ""}${val}%`;
}

export function isSepoliaNetwork(network: string): boolean {
  const n = (network || "").toLowerCase();
  return n.includes("sepolia") || n === "ethereum";
}

export function shortHex(addr?: string): string {
  if (!addr) return "—";
  return addr.length > 14 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
}

export function getExplorerBaseUrl(network: string): string {
  const n = (network || "").toLowerCase();
  if (n.includes("sepolia") || n === "ethereum") return "https://sepolia.etherscan.io";
  if (n.includes("arbitrum")) return "https://arbiscan.io";
  if (n.includes("base")) return "https://basescan.org";
  return "https://polygonscan.com";
}

export function getExplorerUrl(network: string, contractAddress?: string): string | null {
  if (!contractAddress) return null;
  return `${getExplorerBaseUrl(network)}/token/${contractAddress}`;
}

export const VERIFICATION_LABELS: Record<string, string> = {
  all: "All verification",
  audit_available: "Audit available",
  contract_source_verified: "Source verified",
  project_reviewed: "Project reviewed",
  not_reviewed: "Not reviewed",
};

export function verificationLabel(status?: string): string {
  if (!status) return "Not reviewed";
  return VERIFICATION_LABELS[status] ?? status.replace(/_/g, " ");
}

/**
 * Matching rule supporting name, symbol, contract address, network, category, status, and verification.
 */
export function tokenMatches(token: TokenWithMarket, f: Filters): boolean {
  const q = f.q.trim().toLowerCase();
  const matchesSearch =
    !q ||
    token.name.toLowerCase().includes(q) ||
    token.symbol.toLowerCase().includes(q) ||
    (Boolean(token.contractAddress) && token.contractAddress!.toLowerCase().includes(q));

  const matchesNetwork =
    f.network === "all"
      ? true
      : f.network === "sepolia"
      ? token.network.toLowerCase().includes("sepolia") || token.network.toLowerCase() === "ethereum"
      : token.network.toLowerCase() === f.network.toLowerCase();

  const matchesCategory =
    f.category === "all" ? true : (token.category || "").toLowerCase() === f.category.toLowerCase();

  const matchesStatus =
    f.status === "all" ? true : token.status.toLowerCase() === f.status.toLowerCase();

  const matchesVerification =
    f.verification === "all"
      ? true
      : (token.verificationStatus || "not_reviewed").toLowerCase() === f.verification.toLowerCase();

  return matchesSearch && matchesNetwork && matchesCategory && matchesStatus && matchesVerification;
}

export const TONES = [
  { tile: "border-primary/30 from-primary/25 to-primary/5", text: "text-primary" },
  { tile: "border-cyan-500/30 from-cyan-500/25 to-cyan-500/5", text: "text-cyan-400" },
  { tile: "border-violet-500/30 from-violet-500/25 to-violet-500/5", text: "text-violet-400" },
  { tile: "border-emerald-500/30 from-emerald-500/25 to-emerald-500/5", text: "text-emerald-400" },
  { tile: "border-rose-500/30 from-rose-500/25 to-rose-500/5", text: "text-rose-400" },
  { tile: "border-amber-500/30 from-amber-500/25 to-amber-500/5", text: "text-amber-400" },
];

export const NEUTRAL_TONE = { tile: "border-border/60 from-secondary to-secondary/30", text: "text-muted-foreground" };

export const SORT_LABELS: Record<SortField, string> = {
  marketCap: "Market Cap",
  volume24h: "24h Volume",
  priceChange24h: "24h Change",
  price: "Price",
  name: "Token Name",
};

export function subscribeNoop() {
  return () => {};
}

export function readSessionRaw(): string {
  try {
    return sessionStorage.getItem(SESSION_TOKENS_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

