/**
 * DefiLlama Client for HorizonX.
 * Queries public DefiLlama REST endpoints for DeFi protocol statistics,
 * Total Value Locked (TVL), and live staking / yield pool APYs.
 * Includes in-memory caching, deduplication, and resilient fallback handling.
 */

import { globalCache } from './cache';
import { ApiError, normalizeError } from './request';

export interface DefiLlamaProtocolRaw {
  id: string;
  name: string;
  address?: string | null;
  symbol: string;
  url?: string;
  description?: string;
  chain?: string;
  logo?: string;
  audits?: string;
  gecko_id?: string | null;
  cmcId?: string | null;
  category?: string;
  chains?: string[];
  module?: string;
  twitter?: string | null;
  audit_links?: string[];
  tvl: number;
  mcap?: number | null;
  change_1d?: number | null;
  change_7d?: number | null;
  listedAt?: number;
  raises?: Array<{
    date: number;
    round?: string | null;
    amount: number;
    leadInvestors?: string[];
  }>;
}

export interface DefiLlamaYieldPoolRaw {
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apyBase?: number | null;
  apyReward?: number | null;
  apy: number;
  rewardTokens?: string[] | null;
  pool: string;
  apyPct1D?: number | null;
  apyPct7D?: number | null;
  apyPct30D?: number | null;
  stablecoin?: boolean;
  ilRisk?: string;
  exposure?: 'single' | 'multi';
  poolMeta?: string | null;
  underlyingTokens?: string[];
}

export interface DefiLlamaAirdropEntry {
  name: string;
  description: string;
  twitter?: string;
  discord?: string;
  page?: string;
  haveAirdropData?: boolean;
  tokenSymbol?: string;
  isActive?: boolean;
  endTime?: number;
}

export class DefiLlamaClient {
  private protocolsUrl = 'https://api.llama.fi/protocols';
  private protocolDetailBase = 'https://api.llama.fi/protocol';
  private yieldsUrl = 'https://yields.llama.fi/pools';
  private airdropRegistryUrl = 'https://raw.githubusercontent.com/DefiLlama/airdrop-checker/master/airdrop-config.json';

  /**
   * Fetches top protocols ordered by TVL descending.
   */
  async getProtocols(limit = 100): Promise<DefiLlamaProtocolRaw[]> {
    const cacheKey = `defillama:protocols:limit:${limit}`;
    return globalCache.dedupe(
      cacheKey,
      async () => {
        try {
          const res = await fetch(this.protocolsUrl, {
            headers: { Accept: 'application/json' },
          });
          if (!res.ok) {
            throw new ApiError(`DefiLlama returned HTTP ${res.status}`, res.status, 'DEFILLAMA_HTTP_ERROR');
          }
          const list: DefiLlamaProtocolRaw[] = await res.json();
          if (!Array.isArray(list)) return [];

          // Filter out CEXs and zero/negative TVL entries
          const valid = list
            .filter((p) => p.category !== 'CEX' && (p.tvl ?? 0) > 0)
            .sort((a, b) => (b.tvl ?? 0) - (a.tvl ?? 0))
            .slice(0, limit);

          return valid;
        } catch (err) {
          console.warn('[DefiLlamaClient] Could not fetch protocols:', (err as Error).message);
          return [];
        }
      },
      300000 // 5 minutes TTL
    );
  }

  /**
   * Fetches single protocol details including historical TVL and fundraising raises.
   */
  async getProtocolDetail(slugOrId: string): Promise<DefiLlamaProtocolRaw | null> {
    const clean = slugOrId.toLowerCase().replace(/^llama-/, '');
    const cacheKey = `defillama:protocol:${clean}`;
    return globalCache.dedupe(
      cacheKey,
      async () => {
        try {
          const res = await fetch(`${this.protocolDetailBase}/${clean}`, {
            headers: { Accept: 'application/json' },
          });
          if (res.status === 404) return null;
          if (!res.ok) {
            throw new ApiError(`DefiLlama returned HTTP ${res.status}`, res.status, 'DEFILLAMA_HTTP_ERROR');
          }
          const data: DefiLlamaProtocolRaw = await res.json();
          return data;
        } catch (err) {
          console.warn(`[DefiLlamaClient] Could not fetch protocol detail for ${clean}:`, (err as Error).message);
          return null;
        }
      },
      300000
    );
  }

  /**
   * Fetches real yield pools ordered by TVL descending.
   */
  async getYieldPools(limit = 100): Promise<DefiLlamaYieldPoolRaw[]> {
    const cacheKey = `defillama:yields:limit:${limit}`;
    return globalCache.dedupe(
      cacheKey,
      async () => {
        try {
          const res = await fetch(this.yieldsUrl, {
            headers: { Accept: 'application/json' },
          });
          if (!res.ok) {
            throw new ApiError(`DefiLlama returned HTTP ${res.status}`, res.status, 'DEFILLAMA_HTTP_ERROR');
          }
          const payload = await res.json();
          const list: DefiLlamaYieldPoolRaw[] = payload.data || [];
          if (!Array.isArray(list)) return [];

          // Filter out pools with TVL < $1M or APY <= 0
          const valid = list
            .filter((p) => (p.tvlUsd ?? 0) >= 1000000 && (p.apy ?? 0) > 0 && (p.apy ?? 0) < 500)
            .sort((a, b) => (b.tvlUsd ?? 0) - (a.tvlUsd ?? 0))
            .slice(0, limit);

          return valid;
        } catch (err) {
          console.warn('[DefiLlamaClient] Could not fetch yields:', (err as Error).message);
          return [];
        }
      },
      300000 // 5 minutes TTL
    );
  }

  /**
   * Finds a specific yield pool by its UUID.
   */
  async getYieldPoolById(poolId: string): Promise<DefiLlamaYieldPoolRaw | null> {
    const pools = await this.getYieldPools(500);
    const found = pools.find((p) => p.pool.toLowerCase() === poolId.toLowerCase());
    return found || null;
  }

  /**
   * Fetches the official DefiLlama airdrop registry of tracked snapshot airdrops.
   */
  async getAirdropRegistry(): Promise<Record<string, DefiLlamaAirdropEntry>> {
    const cacheKey = 'defillama:airdrop-registry';
    return globalCache.dedupe(
      cacheKey,
      async () => {
        try {
          const res = await fetch(this.airdropRegistryUrl, {
            headers: { Accept: 'application/json' },
          });
          if (!res.ok) {
            throw new ApiError(`DefiLlama airdrop registry HTTP ${res.status}`, res.status, 'DEFILLAMA_AIRDROP_ERROR');
          }
          const data: Record<string, DefiLlamaAirdropEntry> = await res.json();
          return data || {};
        } catch (err) {
          console.warn('[DefiLlamaClient] Could not fetch airdrop registry:', (err as Error).message);
          return {};
        }
      },
      300000 // 5 minutes TTL
    );
  }

  /**
   * Fetches tokenless protocols from DefiLlama that are candidates for retroactive airdrops.
   */
  async getTokenlessProtocols(limit = 60): Promise<DefiLlamaProtocolRaw[]> {
    const cacheKey = `defillama:tokenless:limit:${limit}`;
    return globalCache.dedupe(
      cacheKey,
      async () => {
        try {
          const res = await fetch(this.protocolsUrl, {
            headers: { Accept: 'application/json' },
          });
          if (!res.ok) {
            throw new ApiError(`DefiLlama returned HTTP ${res.status}`, res.status, 'DEFILLAMA_HTTP_ERROR');
          }
          const list: DefiLlamaProtocolRaw[] = await res.json();
          if (!Array.isArray(list)) return [];

          // Exclude CEXs and zero-TVL entries; filter for tokenless protocols (no symbol or symbol is '-')
          const tokenless = list
            .filter((p) => {
              if (p.category === 'CEX') return false;
              if ((p.tvl ?? 0) <= 0) return false;
              const hasNoSymbol = !p.symbol || p.symbol === '-' || p.symbol.trim() === '';
              return hasNoSymbol;
            })
            .sort((a, b) => (b.tvl ?? 0) - (a.tvl ?? 0))
            .slice(0, limit);

          return tokenless;
        } catch (err) {
          console.warn('[DefiLlamaClient] Could not fetch tokenless protocols:', (err as Error).message);
          return [];
        }
      },
      300000 // 5 minutes TTL
    );
  }
}

export const defillamaClient = new DefiLlamaClient();

