import { useAsyncQuery } from './use-async-query';
import { marketService } from '../services/market/market.service';
import type {
  MarketOverview,
  MarketPair,
  MarketFilters,
  MarketSortParams,
  PaginationParams,
} from '../types';

export function useMarketOverview() {
  const query = useAsyncQuery(async () => {
    const res = await marketService.getOverview();
    return res.data;
  }, []);

  return {
    overview: query.data ?? null,
    data: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useMarketPairs(
  filters?: MarketFilters,
  pagination?: PaginationParams,
  sort?: MarketSortParams
) {
  const query = useAsyncQuery(
    async () => {
      const res = await marketService.getPairs(filters, pagination, sort);
      return res.data;
    },
    [JSON.stringify(filters), JSON.stringify(pagination), JSON.stringify(sort)]
  );

  return {
    pairs: query.data?.items ?? [],
    data: query.data?.items ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isEmpty: query.isEmpty,
    refetch: query.refetch,
  };
}

export function useMarketPair(symbol: string | undefined) {
  const query = useAsyncQuery(
    async () => {
      if (!symbol) return null;
      const res = await marketService.getPairBySymbol(symbol);
      return res.data;
    },
    [symbol],
    { enabled: Boolean(symbol) }
  );

  return {
    pair: query.data ?? null,
    data: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useHistoricalMarketData(
  tokenId: string | undefined,
  range: '24h' | '7d' | '30d' | '90d' = '24h'
) {
  const query = useAsyncQuery(
    async () => {
      if (!tokenId) return [];
      const res = await marketService.getHistoricalData(tokenId, range);
      return res.data;
    },
    [tokenId, range],
    { enabled: Boolean(tokenId) }
  );

  return {
    history: query.data ?? [],
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
