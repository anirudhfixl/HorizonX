import type { VerificationStatus } from "@/types";
import type { ChartRange } from "./model";

export const CHART_RANGES: { key: ChartRange; label: string; points: number; days: number }[] = [
  { key: "24H", label: "24h", points: 48, days: 1 },
  { key: "7D", label: "7d", points: 56, days: 7 },
  { key: "30D", label: "30d", points: 60, days: 30 },
  { key: "90D", label: "90d", points: 90, days: 90 },
];

/** Verification tiers recorded in the catalog, strongest first. */
export const VERIFICATION_TIERS: { value: VerificationStatus; label: string }[] = [
  { value: "audit_available", label: "Audit available" },
  { value: "contract_source_verified", label: "Source verified" },
  { value: "project_reviewed", label: "Project reviewed" },
  { value: "not_reviewed", label: "Not reviewed" },
];

export const REVIEWED_STATUSES: VerificationStatus[] = [
  "audit_available",
  "contract_source_verified",
  "project_reviewed",
];

export const MARKET_CAP_BANDS: { value: string; label: string; min: number; max: number }[] = [
  { value: "any", label: "Any market cap", min: 0, max: Infinity },
  { value: "micro", label: "Under $1M", min: 0, max: 1e6 },
  { value: "small", label: "$1M to $10M", min: 1e6, max: 1e7 },
  { value: "mid", label: "$10M to $100M", min: 1e7, max: 1e8 },
  { value: "large", label: "Over $100M", min: 1e8, max: Infinity },
];

/** Same key the previous token pages used, so existing watchlists carry over. */
export const WATCHLIST_STORAGE_KEY = "prominers_nexora_token_watchlist";

/**
 * User-specific demo balances. Token balances are not read from a blockchain
 * yet, so only the built-in demo wallet has holdings, and they are simulated.
 */
export const DEMO_WALLET_ADDRESS = "0x71c9561e873f324a3b4323e56d3935a8286c4e39";

export const DEMO_HOLDINGS: Record<string, { tokenId: string; balance: number }[]> = {
  [DEMO_WALLET_ADDRESS]: [
    { tokenId: "prominers", balance: 12_500_000 },
    { tokenId: "hyper-liquidity", balance: 640_000 },
    { tokenId: "aurora-ai", balance: 92_400 },
    { tokenId: "quantum", balance: 18_250 },
    { tokenId: "zkpv", balance: 4_800 },
  ],
};
