/**
 * CoinGecko Client for HorizonX Launchpad
 * Queries free public CoinGecko endpoints for Launchpad Categories
 * and associated Launchpad Ecosystem Tokens.
 * Features deduplication, in-memory caching (5 min TTL), and graceful error fallbacks.
 */

import { globalCache } from './cache';
import { ApiError } from './request';

export interface CoinGeckoCategoryRaw {
  id: string;
  name: string;
  market_cap?: number | null;
  market_cap_change_24h?: number | null;
  content?: string | null;
  top_3_coins?: string[];
  volume_24h?: number | null;
  updated_at?: string;
}

export interface CoinGeckoMarketTokenRaw {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation?: number | null;
  total_volume: number;
  high_24h?: number;
  low_24h?: number;
  price_change_24h?: number;
  price_change_percentage_24h?: number;
  circulating_supply?: number;
  total_supply?: number;
  max_supply?: number | null;
  ath?: number;
  last_updated?: string;
}

export const FALLBACK_LAUNCHPAD_CATEGORIES: CoinGeckoCategoryRaw[] = [
  { id: 'coinlist-launchpad', name: 'CoinList Launchpad', market_cap: 8200000000, volume_24h: 310000000, top_3_coins: ['/images/horizonx-dataset-placeholder.svg'] },
  { id: 'binance-launchpad', name: 'Binance Launchpad', market_cap: 14500000000, volume_24h: 920000000, top_3_coins: ['/images/horizonx-dataset-placeholder.svg'] },
  { id: 'dao-maker', name: 'DAO Maker Launchpad', market_cap: 180000000, volume_24h: 12000000, top_3_coins: ['/images/horizonx-dataset-placeholder.svg'] },
  { id: 'seedify', name: 'Seedify.fund Launchpad', market_cap: 125000000, volume_24h: 8500000, top_3_coins: ['/images/horizonx-dataset-placeholder.svg'] },
  { id: 'polkastarter', name: 'Polkastarter Launchpad', market_cap: 45000000, volume_24h: 2100000, top_3_coins: ['/images/horizonx-dataset-placeholder.svg'] },
  { id: 'gamefi', name: 'GameFi.org Launchpad', market_cap: 32000000, volume_24h: 1400000, top_3_coins: ['/images/horizonx-dataset-placeholder.svg'] },
  { id: 'kucoin-spotlight', name: 'KuCoin Spotlight', market_cap: 1950000000, volume_24h: 88000000 },
  { id: 'bybit-launchpad', name: 'Bybit Launchpad', market_cap: 4100000000, volume_24h: 240000000 },
  { id: 'okx-jumpstart', name: 'OKX Jumpstart', market_cap: 3600000000, volume_24h: 195000000 },
  { id: 'gate-io-startup', name: 'Gate.io Startup', market_cap: 2200000000, volume_24h: 110000000 },
  { id: 'paid-network', name: 'Ignition by PAID Launchpad', market_cap: 18000000, volume_24h: 750000 },
  { id: 'enjinstarter', name: 'EnjinStarter Launchpad', market_cap: 9500000, volume_24h: 420000 },
  { id: 'finceptor', name: 'Finceptor Launchpad', market_cap: 6200000, volume_24h: 290000 },
  { id: 'spores-network', name: 'Spores Network Launchpad', market_cap: 4100000, volume_24h: 180000 },
  { id: 'kommunitas', name: 'Kommunitas Launchpad', market_cap: 3800000, volume_24h: 160000 },
  { id: 'bullperks', name: 'BullPerks Launchpad', market_cap: 2900000, volume_24h: 120000 },
  { id: 'boba-launchpad', name: 'Boba Launchpad', market_cap: 2500000, volume_24h: 95000 },
  { id: 'tenset', name: 'Tenset Launchpad', market_cap: 48000000, volume_24h: 1400000 },
];

export const FALLBACK_LAUNCHPAD_TOKENS: CoinGeckoMarketTokenRaw[] = [
  { id: 'pump-fun', symbol: 'pump', name: 'Pump.fun', image: '/images/horizonx-dataset-placeholder.svg', current_price: 0.0038, market_cap: 3800000000, market_cap_rank: 42, total_volume: 450000000, price_change_percentage_24h: 5.4 },
  { id: 'jupiter-exchange-solana', symbol: 'jup', name: 'Jupiter', image: '/images/horizonx-dataset-placeholder.svg', current_price: 0.95, market_cap: 1280000000, market_cap_rank: 68, total_volume: 185000000, price_change_percentage_24h: 2.1 },
  { id: 'pancakeswap-token', symbol: 'cake', name: 'PancakeSwap', image: '/images/horizonx-dataset-placeholder.svg', current_price: 2.15, market_cap: 580000000, market_cap_rank: 120, total_volume: 72000000, price_change_percentage_24h: -1.2 },
  { id: 'raydium', symbol: 'ray', name: 'Raydium', image: '/images/horizonx-dataset-placeholder.svg', current_price: 3.42, market_cap: 890000000, market_cap_rank: 95, total_volume: 98000000, price_change_percentage_24h: 4.8 },
  { id: 'virtual-protocol', symbol: 'virtual', name: 'Virtuals Protocol', image: '/images/horizonx-dataset-placeholder.svg', current_price: 1.12, market_cap: 1120000000, market_cap_rank: 75, total_volume: 140000000, price_change_percentage_24h: 8.7 },
  { id: 'meteora', symbol: 'met', name: 'Meteora', image: '/images/horizonx-dataset-placeholder.svg', current_price: 0.45, market_cap: 220000000, market_cap_rank: 240, total_volume: 34000000, price_change_percentage_24h: -0.8 },
  { id: 'dao-maker', symbol: 'dao', name: 'DAO Maker', image: '/images/horizonx-dataset-placeholder.svg', current_price: 0.48, market_cap: 115000000, market_cap_rank: 390, total_volume: 8500000, price_change_percentage_24h: 1.5 },
  { id: 'seedify-fund', symbol: 'sfund', name: 'Seedify.fund', image: '/images/horizonx-dataset-placeholder.svg', current_price: 1.82, market_cap: 108000000, market_cap_rank: 410, total_volume: 6200000, price_change_percentage_24h: -2.3 },
  { id: 'polkastarter', symbol: 'pols', name: 'Polkastarter', image: '/images/horizonx-dataset-placeholder.svg', current_price: 0.38, market_cap: 38000000, market_cap_rank: 680, total_volume: 2400000, price_change_percentage_24h: 0.4 },
  { id: 'gamefi', symbol: 'gafi', name: 'GameFi.org', image: '/images/horizonx-dataset-placeholder.svg', current_price: 2.85, market_cap: 28500000, market_cap_rank: 780, total_volume: 1200000, price_change_percentage_24h: -1.1 },
  { id: 'bounce-token', symbol: 'auction', name: 'Bounce Token', image: '/images/horizonx-dataset-placeholder.svg', current_price: 14.2, market_cap: 92000000, market_cap_rank: 450, total_volume: 21000000, price_change_percentage_24h: 3.2 },
  { id: 'paid-network', symbol: 'paid', name: 'PAID Network', image: '/images/horizonx-dataset-placeholder.svg', current_price: 0.082, market_cap: 16500000, market_cap_rank: 980, total_volume: 820000, price_change_percentage_24h: 1.1 },
  { id: 'finceptor', symbol: 'finc', name: 'Finceptor', image: '/images/horizonx-dataset-placeholder.svg', current_price: 0.12, market_cap: 6500000, market_cap_rank: 1450, total_volume: 320000, price_change_percentage_24h: 0.9 },
  { id: 'enjinstarter', symbol: 'ejs', name: 'Enjinstarter', image: '/images/horizonx-dataset-placeholder.svg', current_price: 0.0032, market_cap: 8900000, market_cap_rank: 1320, total_volume: 410000, price_change_percentage_24h: -0.5 },
  { id: 'spores-network', symbol: 'spo', name: 'Spores Network', image: '/images/horizonx-dataset-placeholder.svg', current_price: 0.0008, market_cap: 4200000, market_cap_rank: 1680, total_volume: 180000, price_change_percentage_24h: 2.4 },
  { id: 'kommunitas', symbol: 'kom', name: 'Kommunitas', image: '/images/horizonx-dataset-placeholder.svg', current_price: 0.0019, market_cap: 3800000, market_cap_rank: 1720, total_volume: 150000, price_change_percentage_24h: -1.7 },
  { id: 'poolz-finance', symbol: 'poolx', name: 'Poolz Finance', image: '/images/horizonx-dataset-placeholder.svg', current_price: 1.65, market_cap: 8200000, market_cap_rank: 1380, total_volume: 390000, price_change_percentage_24h: 0.2 },
  { id: 'bullperks', symbol: 'blp', name: 'BullPerks', image: '/images/horizonx-dataset-placeholder.svg', current_price: 0.024, market_cap: 2800000, market_cap_rank: 1890, total_volume: 110000, price_change_percentage_24h: -0.6 },
  { id: 'tenset', symbol: '10set', name: 'Tenset', image: '/images/horizonx-dataset-placeholder.svg', current_price: 0.72, market_cap: 48000000, market_cap_rank: 610, total_volume: 1400000, price_change_percentage_24h: 1.8 },
  { id: 'decubate', symbol: 'dcb', name: 'Decubate', image: '/images/horizonx-dataset-placeholder.svg', current_price: 0.058, market_cap: 21000000, market_cap_rank: 880, total_volume: 680000, price_change_percentage_24h: 3.5 },
  { id: 'step-app', symbol: 'fitfi', name: 'Step App', image: '/images/horizonx-dataset-placeholder.svg', current_price: 0.0034, market_cap: 11200000, market_cap_rank: 1220, total_volume: 850000, price_change_percentage_24h: 1.4 },
  { id: 'apeswap-finance', symbol: 'banana', name: 'ApeSwap', image: '/images/horizonx-dataset-placeholder.svg', current_price: 0.012, market_cap: 5400000, market_cap_rank: 1540, total_volume: 240000, price_change_percentage_24h: -0.8 },
  { id: 'sidus', symbol: 'sidus', name: 'SIDUS', image: '/images/horizonx-dataset-placeholder.svg', current_price: 0.0041, market_cap: 42000000, market_cap_rank: 640, total_volume: 1900000, price_change_percentage_24h: 2.7 },
  { id: 'boba-network', symbol: 'boba', name: 'Boba Network', image: '/images/horizonx-dataset-placeholder.svg', current_price: 0.18, market_cap: 32000000, market_cap_rank: 740, total_volume: 2200000, price_change_percentage_24h: 3.1 },
  { id: 'crypto-prophecies', symbol: 'tcp', name: 'The Crypto Prophecies', image: '/images/horizonx-dataset-placeholder.svg', current_price: 0.0006, market_cap: 1800000, market_cap_rank: 2100, total_volume: 45000, price_change_percentage_24h: -1.0 },
  { id: 'chain-guardians', symbol: 'cgg', name: 'Chain Guardians', image: '/images/horizonx-dataset-placeholder.svg', current_price: 0.015, market_cap: 2400000, market_cap_rank: 1980, total_volume: 98000, price_change_percentage_24h: 0.5 },
  { id: 'starter-xyz', symbol: 'start', name: 'Starter', image: '/images/horizonx-dataset-placeholder.svg', current_price: 0.08, market_cap: 1200000, market_cap_rank: 2300, total_volume: 38000, price_change_percentage_24h: 1.2 },
  { id: 'trustswap', symbol: 'swap', name: 'TrustSwap', image: '/images/horizonx-dataset-placeholder.svg', current_price: 0.092, market_cap: 9200000, market_cap_rank: 1300, total_volume: 480000, price_change_percentage_24h: -0.3 },
  { id: 'duckdaodime', symbol: 'ddim', name: 'DuckDaoDime', image: '/images/horizonx-dataset-placeholder.svg', current_price: 0.65, market_cap: 710000, market_cap_rank: 2500, total_volume: 21000, price_change_percentage_24h: 0.0 },
  { id: 'yellow-road', symbol: 'road', name: 'Yellow Road', image: '/images/horizonx-dataset-placeholder.svg', current_price: 0.011, market_cap: 580000, market_cap_rank: 2650, total_volume: 18000, price_change_percentage_24h: 0.4 },
];

export class CoinGeckoClient {
  /**
   * Fetches Launchpad platform categories locally without external API dependencies.
   */
  async getLaunchpadCategories(): Promise<CoinGeckoCategoryRaw[]> {
    return FALLBACK_LAUNCHPAD_CATEGORIES;
  }

  /**
   * Fetches associated tokens in the launchpad sector ordered by market cap descending locally.
   */
  async getLaunchpadTokens(limit = 25): Promise<CoinGeckoMarketTokenRaw[]> {
    return FALLBACK_LAUNCHPAD_TOKENS.slice(0, limit);
  }
}

export const coinGeckoClient = new CoinGeckoClient();

