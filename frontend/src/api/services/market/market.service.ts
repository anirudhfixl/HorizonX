// Market overview and telemetry domain service

import { getActiveProvider } from '../../config/data-config';
import { defaultApiClient } from '../../client/api-client';
import type {
  MarketOverview,
  MarketPair,
  MarketFilters,
  MarketSortParams,
  MarketHistoryPoint,
  PaginatedResult,
  PaginationParams,
  ApiResponse,
} from '../../types';

export class MarketService {
  async getOverview(): Promise<ApiResponse<MarketOverview>> {
    const key = 'market:overview';
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.market.getOverview();
    });
  }

  async getPairs(
    filters?: MarketFilters,
    pagination?: PaginationParams,
    sort?: MarketSortParams
  ): Promise<ApiResponse<PaginatedResult<MarketPair>>> {
    const key = `market:pairs:${JSON.stringify({ filters, pagination, sort })}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.market.listPairs(filters, pagination, sort);
    });
  }

  async getPairBySymbol(symbol: string): Promise<ApiResponse<MarketPair | null>> {
    const key = `market:pair:${symbol.toLowerCase()}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.market.getPairBySymbol(symbol);
    });
  }

  async getHistoricalData(
    tokenId: string,
    range: '24h' | '7d' | '30d' | '90d' = '24h'
  ): Promise<ApiResponse<MarketHistoryPoint[]>> {
    const key = `market:history:${tokenId.toLowerCase()}:${range}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.market.getHistoricalData(tokenId, range);
    });
  }
}

export const marketService = new MarketService();

