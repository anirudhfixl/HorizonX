import type { Token, TokenMarketData } from "@/api/types";

export type TokenWithMarket = Token & { market: TokenMarketData };

export type SortField = "name" | "price" | "marketCap" | "priceChange24h" | "volume24h";
export type SortOrder = "asc" | "desc";

export interface TokenExplorerProps {
  mode?: "canonical" | "embedded";
  onSelectToken?: (token: TokenWithMarket) => void;
  selectedTokenId?: string;
  creatorAddress?: string;
}

export const VERIFICATION_LABELS: Record<string, string> = {
  audit_available: "Audited",
  contract_source_verified: "Source Verified",
  project_reviewed: "Project Reviewed",
  not_reviewed: "Unreviewed",
};

export interface Filters {
  q: string;
  network: string; // 'all' | chain id or network string
  category: string; // 'all' | specific category
  status: string;
  verification: string; // 'all' | 'audit_available' | ...
}

export const SORT_LABELS: Record<SortField, string> = {
  name: "Token Name",
  price: "Price",
  marketCap: "Market Cap",
  priceChange24h: "24h Change",
  volume24h: "24h Volume",
};

