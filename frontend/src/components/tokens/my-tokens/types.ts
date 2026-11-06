import type { Token, TokenMarketData } from "@/api/types";
import type { SimulatedTokenReceipt } from "@/components/tokens/token-creation-wizard";

export type TokenWithMarket = Token & { market: TokenMarketData };

export interface MyTokensMetrics {
  managedTokens: number;
  aggregateSupplyRaw: bigint;
  aggregateSupplyFormatted: string;
  activeCatalogAssets: number;
  simulatedCreatorAssets: number;
}

export interface ManagedItem {
  key: string;
  stateKey: string;
  kind: "catalog" | "session";
  name: string;
  symbol: string;
  category?: string;
  network: string;
  decimals: number;
  contractAddress: string;
  token?: TokenWithMarket;
  receipt?: SimulatedTokenReceipt;
}

