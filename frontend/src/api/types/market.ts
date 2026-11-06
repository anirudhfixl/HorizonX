import type { FilterParams, SortParams } from './common';

export interface MarketOverview {
  volume24h: number;
  totalLiquidity: number;
  topGainer: {
    symbol: string;
    changePercent: number;
    name: string;
    tokenId?: string;
  };
  activeMarketsCount: number;
  lastUpdated: string;
  totalMarketCap?: number;
  btcDominance?: number;
  ethDominance?: number;
}

export interface MarketPair {
  id: string;
  symbol: string;
  name: string;
  baseTokenId: string;
  quoteSymbol: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  high24h?: number;
  low24h?: number;
  category?: string;
  network?: string;
}

export interface MarketHistoryPoint {
  timestamp: number;
  price: number;
  volume?: number;
}

export interface MarketFilters extends FilterParams {
  quoteSymbol?: string;
  minVolume?: number;
  minLiquidity?: number;
}

export type MarketSortField =
  | 'volume24h'
  | 'liquidity'
  | 'price'
  | 'priceChange24h'
  | 'symbol';

export type MarketSortParams = SortParams<MarketSortField>;

