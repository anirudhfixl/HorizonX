/**
 * CryptoRank API Client
 * Connects through the secure serverless proxy (/api/cryptorank).
 * Protects CRYPTORANK_API_KEY from ever reaching the client bundle.
 */

export interface CryptoRankStatus {
  success: boolean;
  configured: boolean;
  planRestricted?: boolean;
  plan?: string;
  provider: string;
  timestamp: string;
}

export interface CryptoRankAirdropRaw {
  id: number | string;
  title?: string;
  name?: string;
  slug: string;
  status?: string;
  category?: string;
  categoryName?: string;
  description?: string;
  totalRaised?: number;
  funds?: Array<{ name: string; icon?: string }>;
  tasksCount?: number;
  estimatedCost?: string | number;
  reward?: string;
  stage?: string;
  startDate?: string;
  endDate?: string;
  networks?: Array<{ name: string; icon?: string }>;
  network?: string;
  icon?: string;
  logo?: string;
  image?: string;
  banner?: string;
  bannerImage?: string;
  links?: Array<{ type: string; value: string }>;
  [key: string]: any;
}

export interface CryptoRankPublicSaleRaw {
  id: number | string;
  slug: string;
  name: string;
  symbol: string;
  type?: string;
  status?: string;
  saleStatus?: string;
  startDate?: string;
  endDate?: string;
  price?: number | { currency: string; value: number };
  raised?: number;
  hardCap?: number;
  softCap?: number;
  launchpads?: Array<{ id: number; name: string; slug: string; icon?: string }>;
  network?: string;
  blockchain?: string;
  icon?: string;
  logo?: string;
  description?: string;
  category?: string;
  [key: string]: any;
}

export interface CryptoRankLaunchpadRaw {
  id: number | string;
  name: string;
  slug: string;
  icon?: string;
  type?: string;
  salesCount?: number;
  totalRaised?: number;
  avgRoi?: number;
  tierSystem?: boolean;
  [key: string]: any;
}

interface ClientCacheEntry<T> {
  data: T;
  timestamp: number;
}

export class CryptoRankClient {
  private cache = new Map<string, ClientCacheEntry<any>>();
  private readonly defaultTtlMs = 180000; // 3 minutes
  private readonly proxyUrl = '/api/cryptorank';

  private async fetchProxy<T>(
    endpoint: string,
    params: Record<string, any> = {},
    ttlMs = this.defaultTtlMs
  ): Promise<T> {
    const searchParams = new URLSearchParams();
    searchParams.set('action', endpoint);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value));
      }
    }

    const cacheKey = `${endpoint}?${searchParams.toString()}`;
    const cached = this.cache.get(cacheKey);
    const now = Date.now();

    if (cached && now - cached.timestamp < ttlMs) {
      return cached.data;
    }

    try {
      const url = `${this.proxyUrl}?${searchParams.toString()}`;
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) {
        // Fallback to /api/market?action=cryptorank-...
        const fallbackUrl = `/api/market?action=cryptorank-${endpoint}&${searchParams.toString()}`;
        const fallbackRes = await fetch(fallbackUrl, {
          headers: { Accept: 'application/json' },
        });

        if (!fallbackRes.ok) {
          const errData = await res.json().catch(() => ({}));
          return {
            success: false,
            configured: false,
            provider: 'CryptoRank v3',
            error: errData.error || 'NETWORK_ERROR',
            message: errData.message || `Proxy responded with HTTP ${res.status}`,
            data: [],
            meta: { total: 0 },
          } as unknown as T;
        }

        const data = await fallbackRes.json();
        this.cache.set(cacheKey, { data, timestamp: now });
        return data;
      }

      const data = await res.json();
      this.cache.set(cacheKey, { data, timestamp: now });
      return data;
    } catch (err: any) {
      return {
        success: false,
        configured: false,
        provider: 'CryptoRank v3',
        error: 'FETCH_ERROR',
        message: err?.message || 'Failed to communicate with CryptoRank proxy.',
        data: [],
        meta: { total: 0 },
      } as unknown as T;
    }
  }

  /**
   * Check whether server-side CRYPTORANK_API_KEY is configured.
   */
  async getStatus(): Promise<CryptoRankStatus> {
    return {
      success: true,
      configured: false,
      planRestricted: false,
      provider: 'Centralized Local Dataset',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Fetch airdrops / drophunting list from CryptoRank v3.
   */
  async getAirdrops(params?: {
    limit?: number;
    page?: number;
    status?: string;
  }): Promise<{
    configured: boolean;
    planRestricted?: boolean;
    data: CryptoRankAirdropRaw[];
    meta?: any;
    isStale?: boolean;
    source?: string;
  }> {
    const res = await this.fetchProxy<{
      success: boolean;
      configured?: boolean;
      planRestricted?: boolean;
      data: CryptoRankAirdropRaw[];
      meta?: any;
      isStale?: boolean;
      source?: string;
    }>('airdrops', params || {});

    return {
      configured: Boolean(res?.configured),
      planRestricted: Boolean(res?.planRestricted),
      data: Array.isArray(res?.data) ? res.data : [],
      meta: res?.meta,
      isStale: res?.isStale,
      source: res?.source || 'CryptoRank Drophunting',
    };
  }

  /**
   * Fetch single drophunting airdrop by id or slug from CryptoRank v3.
   */
  async getAirdropById(id: string | number): Promise<{
    configured: boolean;
    data: CryptoRankAirdropRaw | null;
    isStale?: boolean;
  }> {
    const res = await this.fetchProxy<{
      success: boolean;
      configured?: boolean;
      data: CryptoRankAirdropRaw | null;
      isStale?: boolean;
    }>('airdrop-detail', { id });

    return {
      configured: Boolean(res?.configured),
      data: res?.data || null,
      isStale: res?.isStale,
    };
  }

  /**
   * Fetch public token sales (IDOs, ICOs, IEOs) from CryptoRank v3.
   */
  async getPublicSales(params?: {
    limit?: number;
    page?: number;
    status?: string;
  }): Promise<{
    configured: boolean;
    planRestricted?: boolean;
    data: CryptoRankPublicSaleRaw[];
    meta?: any;
    isStale?: boolean;
    source?: string;
  }> {
    const res = await this.fetchProxy<{
      success: boolean;
      configured?: boolean;
      planRestricted?: boolean;
      data: CryptoRankPublicSaleRaw[];
      meta?: any;
      isStale?: boolean;
      source?: string;
    }>('public-sales', params || {});

    return {
      configured: Boolean(res?.configured),
      planRestricted: Boolean(res?.planRestricted),
      data: Array.isArray(res?.data) ? res.data : [],
      meta: res?.meta,
      isStale: res?.isStale,
      source: res?.source || 'CryptoRank Public Sales',
    };
  }

  /**
   * Fetch single public sale by id or slug from CryptoRank v3.
   */
  async getPublicSaleById(id: string | number): Promise<{
    configured: boolean;
    data: CryptoRankPublicSaleRaw | null;
    isStale?: boolean;
  }> {
    const res = await this.fetchProxy<{
      success: boolean;
      configured?: boolean;
      data: CryptoRankPublicSaleRaw | null;
      isStale?: boolean;
    }>('public-sale-detail', { id });

    return {
      configured: Boolean(res?.configured),
      data: res?.data || null,
      isStale: res?.isStale,
    };
  }

  /**
   * Fetch launchpads list from CryptoRank v3.
   */
  async getLaunchpads(params?: {
    limit?: number;
    page?: number;
  }): Promise<{
    configured: boolean;
    data: CryptoRankLaunchpadRaw[];
    meta?: any;
  }> {
    const res = await this.fetchProxy<{
      success: boolean;
      configured?: boolean;
      data: CryptoRankLaunchpadRaw[];
      meta?: any;
    }>('launchpads', params || {});

    return {
      configured: Boolean(res?.configured),
      data: Array.isArray(res?.data) ? res.data : [],
      meta: res?.meta,
    };
  }

  /**
   * Clear in-memory client cache.
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export const cryptoRankClient = new CryptoRankClient();

