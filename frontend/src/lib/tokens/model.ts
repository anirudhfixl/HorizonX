/**
 * Token module data model.
 *
 * Layers (see also lib/data-provenance.ts):
 *  1. Static configuration   – config.ts (featured ids, ranges, verification tiers)
 *  2. Catalog records        – lib/mock-data.ts (Token + TokenMarketData)
 *  3. User-specific data     – holdings, watchlist (browser), session receipts
 *  4. Simulated datasets     – demo-data.ts (price paths, tokenomics, holders, trades)
 *  5. Derived metrics        – selectors.ts (rank, FDV, portfolio value, discovery lists)
 *  6. API / on-chain data    – none exists yet; nothing here may claim to be on-chain.
 */
import type { Token, TokenMarketData } from "@/types";
import type { DataProvenance } from "@/lib/data-provenance";

export type TokenWithMarket = Token & { market: TokenMarketData };

/** A browser-session deployment receipt (structurally matches SimulatedTokenReceipt). */
export interface SessionReceipt {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  category: string;
  network: string;
  contractAddress: string;
  transactionHash: string;
  creatorAddress: string;
  deployedAt: string;
}

export type ChartRange = "24H" | "7D" | "30D" | "90D";

export interface SeriesPoint {
  /** Unix ms. */
  t: number;
  /** Price in USD. */
  v: number;
  /** Traded volume in USD for the interval. */
  vol: number;
}

export interface Allocation {
  label: string;
  pct: number;
  vesting: string;
}

export interface HolderTier {
  label: string;
  holders: number;
  supplyShare: number;
}

export interface HolderProfile {
  holderCount: number;
  top10Share: number;
  tiers: HolderTier[];
}

export type TradeType = "Buy" | "Sell" | "Transfer";

export interface Trade {
  id: string;
  type: TradeType;
  /** Masked pseudonymous identifier. Never a real wallet. */
  wallet: string;
  amount: number;
  price: number;
  value: number;
  time: number;
  /** Illustrative hash. Never linked to an explorer. */
  hash: string;
}

/** Balance of one token held by the user. User-specific layer. */
export interface Holding {
  tokenId: string;
  balance: number;
}

export interface HoldingRow extends Holding {
  token: TokenWithMarket;
  value: number;
  /** Value change over 24h in USD, derived from the token's 24h percentage. */
  change24hValue: number;
}

export interface Portfolio {
  value: number;
  change24hValue: number;
  change24hPct: number;
  best?: TokenWithMarket;
}

export interface ActivityItem {
  id: string;
  time: number;
  text: string;
  detail?: string;
  href?: string;
  provenance: DataProvenance;
}

export type RelationKind = "presale" | "launch" | "airdrop" | "staking" | "project" | "exchange";

export interface Relation {
  id: string;
  kind: RelationKind;
  title: string;
  /** Plain-language state, e.g. "Live" or "Ended". */
  status: string;
  tone: "live" | "upcoming" | "ended" | "neutral";
  meta?: string;
  href: string;
  cta: string;
}
