// Exchange domain service

import { getActiveProvider } from '../../config/data-config';
import { defaultApiClient } from '../../client/api-client';
import type {
  MarketOverview,
  MarketPair,
  MarketFilters,
  MarketSortParams,
  ExchangeOrderBook,
  ExchangeTrade,
  PaginatedResult,
  PaginationParams,
  ApiResponse,
} from '../../types';

export class ExchangeService {
  async getOverview(): Promise<ApiResponse<MarketOverview>> {
    const key = 'exchange:overview';
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.exchange.getOverview();
    });
  }

  async getMarkets(
    filters?: MarketFilters,
    pagination?: PaginationParams,
    sort?: MarketSortParams
  ): Promise<ApiResponse<PaginatedResult<MarketPair>>> {
    const key = `exchange:markets:${JSON.stringify({ filters, pagination, sort })}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.exchange.listMarkets(filters, pagination, sort);
    });
  }

  async getMarketByTokenId(tokenId: string): Promise<ApiResponse<MarketPair | null>> {
    const key = `exchange:market:${tokenId.toLowerCase()}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.exchange.getMarketByTokenId(tokenId);
    });
  }

  async getOrderBook(symbol: string): Promise<ApiResponse<ExchangeOrderBook>> {
    const key = `exchange:orderbook:${symbol.toLowerCase()}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.exchange.getOrderBook(symbol);
    });
  }

  async getRecentTrades(symbol: string, limit = 10): Promise<ApiResponse<ExchangeTrade[]>> {
    const key = `exchange:trades:${symbol.toLowerCase()}:${limit}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.exchange.getRecentTrades(symbol, limit);
    });
  }
}

export const exchangeService = new ExchangeService();

