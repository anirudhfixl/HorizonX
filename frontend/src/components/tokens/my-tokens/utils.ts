import type { TokenWithMarket, MyTokensMetrics } from "./types";
import type { SimulatedTokenReceipt } from "@/components/tokens/token-creation-wizard";
import { SESSION_TOKENS_STORAGE_KEY } from "@/lib/data-provenance";

function formatNumber(val?: number): string {
  if (val === undefined || val === null || isNaN(val)) return "0";
  if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(2)}B`;
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(2)}K`;
  return val.toLocaleString();
}

/**
 * Filter catalog tokens created by the given wallet address (case-insensitive).
 */
export function resolveCreatorTokens(
  tokens: TokenWithMarket[],
  address?: string | null
): TokenWithMarket[] {
  if (!address) return [];
  const normalized = address.toLowerCase();
  return tokens.filter(
    (t) => t.creatorAddress && t.creatorAddress.toLowerCase() === normalized
  );
}

/**
 * Filter temporary session-simulated receipts created by the given wallet address.
 */
export function resolveSessionTokens(
  sessionReceipts: SimulatedTokenReceipt[],
  address?: string | null
): SimulatedTokenReceipt[] {
  if (!address) return [];
  const normalized = address.toLowerCase();
  return sessionReceipts.filter(
    (r) => r.creatorAddress && r.creatorAddress.toLowerCase() === normalized
  );
}

/**
 * Calculate accurate creator telemetry metrics without floating-point errors.
 */
export function calculateMyTokensMetrics(
  catalogMatches: TokenWithMarket[],
  sessionMatches: SimulatedTokenReceipt[]
): MyTokensMetrics {
  let totalRaw = BigInt(0);

  for (const t of catalogMatches) {
    const clean = (t.totalSupply || "0").replace(/[^0-9]/g, "");
    if (clean) {
      try {
        totalRaw += BigInt(clean);
      } catch {
        // ignore
      }
    }
  }

  for (const s of sessionMatches) {
    const clean = (s.totalSupply || "0").replace(/[^0-9]/g, "");
    if (clean) {
      try {
        totalRaw += BigInt(clean);
      } catch {
        // ignore
      }
    }
  }

  const activeCatalog = catalogMatches.filter((t) => t.status === "active").length;

  return {
    managedTokens: catalogMatches.length + sessionMatches.length,
    aggregateSupplyRaw: totalRaw,
    aggregateSupplyFormatted: formatNumber(Number(totalRaw)),
    activeCatalogAssets: activeCatalog,
    simulatedCreatorAssets: sessionMatches.length,
  };
}

export function subscribeSessionStorage(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function readSessionStorageRaw(): string {
  if (typeof window === "undefined") return "";
  try {
    return sessionStorage.getItem(SESSION_TOKENS_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function isSepolia(network: string): boolean {
  const n = network.toLowerCase();
  return n.includes("sepolia") || n === "ethereum";
}

export function shortHex(addr?: string): string {
  if (!addr) return "—";
  return addr.length > 14 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
}

export function verificationInfo(status?: string): { label: string; text: string } {
  switch (status) {
    case "audit_available":
      return { label: "Audit available", text: "A smart-contract audit is recorded for this token (demonstration data)." };
    case "contract_source_verified":
      return { label: "Source verified", text: "The contract source is recorded as verified (demonstration data)." };
    case "project_reviewed":
      return { label: "Project reviewed", text: "The linked project is recorded as reviewed; the contract itself is not (demonstration data)." };
    case "not_reviewed":
    case undefined:
      return { label: "Not reviewed", text: "No review is recorded for this token." };
    default:
      return { label: status.replace(/_/g, " "), text: "Stored verification tier on this record." };
  }
}

