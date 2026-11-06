import type { MarketPair, MarketOverview, MarketHistoryPoint } from './market';

export interface ExchangeOrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export interface ExchangeOrderBook {
  symbol: string;
  bids: ExchangeOrderBookEntry[];
  asks: ExchangeOrderBookEntry[];
  lastPrice: number;
  spread: number;
}

export interface ExchangeTrade {
  id: string;
  price: number;
  amount: number;
  side: 'buy' | 'sell';
  time: string;
  txHash?: string;
}

export interface ExchangeWatchlistItem {
  tokenId: string;
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  network: string;
  addedAt: string;
}

export type { MarketPair, MarketOverview, MarketHistoryPoint };

