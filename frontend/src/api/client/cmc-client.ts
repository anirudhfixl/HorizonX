/**
 * CoinMarketCap Client for HorizonX.
 * Communicates strictly with the secure serverless proxy (/api/market).
 * Never holds or exposes any API secret keys in the browser bundle.
 */

import { globalCache } from './cache';
import { ApiError, normalizeError } from './request';
import type { Token } from '../types/token';
import type { MarketOverview, MarketPair } from '../types/market';

export interface CmcClientOptions {
  proxyBaseUrl?: string;
  defaultTtlMs?: number;
}

export class CoinMarketCapClient {
  private proxyBaseUrl: string;
  private defaultTtlMs: number;

  constructor(options: CmcClientOptions = {}) {
    this.proxyBaseUrl = options.proxyBaseUrl || '';
    this.defaultTtlMs = options.defaultTtlMs || 30000;
  }

  private async fetchProxy<T>(action: string, params: Record<string, string | number | undefined> = {}, ttlMs = this.defaultTtlMs): Promise<T> {
    const searchParams = new URLSearchParams();
    searchParams.set('action', action);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value));
      }
    }

    const endpoint = `${this.proxyBaseUrl}/api/market?${searchParams.toString()}`;
    const cacheKey = `cmc:client:${action}:${searchParams.toString()}`;

    return globalCache.dedupe(
      cacheKey,
      async () => {
        try {
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
          });

          if (!response.ok && response.status !== 200) {
            const errJson = await response.json().catch(() => ({}));
            throw new ApiError(
              errJson.message || `Proxy returned HTTP ${response.status}`,
              response.status,
              errJson.error || 'CMC_PROXY_ERROR',
              errJson
            );
          }

          const payload = await response.json();
          if (payload.success === false) {
            throw new ApiError(
              payload.message || 'Error from market proxy',
              response.status,
              payload.error || 'CMC_PROXY_ERROR',
              payload
            );
          }

          return payload.data as T;
        } catch (err) {
          throw normalizeError(err);
        }
      },
      ttlMs
    );
  }

  /**
   * Check if CoinMarketCap API is configured on server
   */
  async getStatus(): Promise<{ configured: boolean; provider: string }> {
    try {
      const response = await fetch(`${this.proxyBaseUrl}/api/market?action=status`);
      if (!response.ok) return { configured: false, provider: 'CoinMarketCap' };
      const payload = await response.json();
      return { configured: Boolean(payload.configured), provider: payload.provider || 'CoinMarketCap' };
    } catch {
      return { configured: false, provider: 'CoinMarketCap' };
    }
  }

  /**
   * Fetch live global market metrics overview
   */
  async getOverview(): Promise<MarketOverview> {
    return this.fetchProxy<MarketOverview>('overview', {}, 60000);
  }

  /**
   * Fetch live cryptocurrency listings
   */
  async getListings(options: { start?: number; limit?: number; sort?: string; sortDir?: string } = {}): Promise<Token[]> {
    return this.fetchProxy<Token[]>('listings', options, 30000);
  }

  /**
   * Fetch token detail with quotes and metadata
   */
  async getTokenDetail(idOrSymbol: string): Promise<Token | null> {
    try {
      return await this.fetchProxy<Token>('detail', { id: idOrSymbol }, 30000);
    } catch (err: any) {
      if (err?.status === 404) return null;
      throw err;
    }
  }

  /**
   * Fetch raw metadata (logos, websites, descriptions)
   */
  async getMetadata(symbolsOrIds: string[]): Promise<Record<string, any>> {
    if (symbolsOrIds.length === 0) return {};
    return this.fetchProxy<Record<string, any>>('metadata', { symbols: symbolsOrIds.join(',') }, 86400000);
  }

  /**
   * Fetch specific quotes
   */
  async getQuotes(symbolsOrIds: string[]): Promise<Record<string, any>> {
    if (symbolsOrIds.length === 0) return {};
    return this.fetchProxy<Record<string, any>>('quotes', { symbols: symbolsOrIds.join(',') }, 30000);
  }
}

export const cmcClient = new CoinMarketCapClient();

