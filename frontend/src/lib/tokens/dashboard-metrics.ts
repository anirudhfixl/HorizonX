/**
 * Catalog dashboard helpers.
 *
 * These lived in app/tokens/page.tsx. A Next.js page may only export its default component
 * and route config, so they moved here; behavior is unchanged. Existing tests and any
 * cross-module analytics import them from this module.
 */
import { FEATURED_TOKEN_IDS } from "@/data";
import { formatCurrency } from "@/components/tokens/token-explorer";
import { SESSION_TOKENS_STORAGE_KEY } from "@/lib/data-provenance";
import type { TokenWithMarket } from "./model";

export type { TokenWithMarket };
export { formatCurrency };

export interface TokensDashboardMetrics {
  totalTokens: number;
  activeTokens: number;
  pendingTokens: number;
  sepoliaTokens: number;
  catalogCrossChainTokens: number;
  totalMarketCap: number;
  totalVolume24h: number;
  totalLiquidity: number;
  topGainer?: TokenWithMarket;
  topMarketCapToken?: TokenWithMarket;
  categoryBreakdown: Record<string, number>;
  verificationBreakdown: Record<string, number>;
}

/**
 * Shared storage key reference preserved for backward compatibility and test validation.
 */
export const SESSION_KEY = SESSION_TOKENS_STORAGE_KEY; // "prominers_session_tokens"

/**
 * Compute catalog telemetry metrics directly from the centralized token catalog.
 * Preserved for test assertions and cross-module analytics.
 */
export function calculateTokensDashboardMetrics(
  tokens: TokenWithMarket[]
): TokensDashboardMetrics {
  const totalTokens = tokens.length;
  let activeTokens = 0;
  let pendingTokens = 0;
  let sepoliaTokens = 0;
  let catalogCrossChainTokens = 0;
  let totalMarketCap = 0;
  let totalVolume24h = 0;
  let totalLiquidity = 0;

  let topGainer: TokenWithMarket | undefined;
  let highestChange = -Infinity;

  let topMarketCapToken: TokenWithMarket | undefined;
  let highestCap = -Infinity;

  const categoryBreakdown: Record<string, number> = {};
  const verificationBreakdown: Record<string, number> = {};

  for (const t of tokens) {
    if (t.status === "active") activeTokens++;
    if (t.status === "pending") pendingTokens++;

    const isSepolia =
      t.network.toLowerCase().includes("sepolia") ||
      t.network.toLowerCase() === "ethereum";
    if (isSepolia) {
      sepoliaTokens++;
    } else {
      catalogCrossChainTokens++;
    }

    const cap = t.market?.marketCap || 0;
    const vol = t.market?.volume24h || 0;
    const liq = t.market?.liquidity || 0;
    const change = t.market?.priceChange24h || 0;

    totalMarketCap += cap;
    totalVolume24h += vol;
    totalLiquidity += liq;

    if (change > highestChange) {
      highestChange = change;
      topGainer = t;
    }

    if (cap > highestCap) {
      highestCap = cap;
      topMarketCapToken = t;
    }

    const cat = t.category || "Uncategorized";
    categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;

    const ver = t.verificationStatus || "not_reviewed";
    verificationBreakdown[ver] = (verificationBreakdown[ver] || 0) + 1;
  }

  return {
    totalTokens,
    activeTokens,
    pendingTokens,
    sepoliaTokens,
    catalogCrossChainTokens,
    totalMarketCap,
    totalVolume24h,
    totalLiquidity,
    topGainer,
    topMarketCapToken,
    categoryBreakdown,
    verificationBreakdown,
  };
}

/**
 * Return the N most recently created tokens sorted by createdAt descending.
 */
export function getRecentlyAddedTokens(
  tokens: TokenWithMarket[],
  limit = 4
): TokenWithMarket[] {
  return [...tokens]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

/**
 * Return curated featured tokens.
 */
export function getFeaturedTokens(tokens: TokenWithMarket[]): TokenWithMarket[] {
  const featuredIds: readonly string[] = FEATURED_TOKEN_IDS;
  const found = tokens.filter((t) => featuredIds.includes(t.id));
  return found.length >= 3 ? found : tokens.slice(0, 4);
}

