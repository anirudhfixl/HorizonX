import { useAsyncQuery } from './use-async-query';
import { exchangeService } from '../services/exchange/exchange.service';
import type {
  MarketPair,
  MarketFilters,
  MarketSortParams,
  PaginationParams,
} from '../types';

export function useExchangeOverview() {
  const query = useAsyncQuery(async () => {
    const res = await exchangeService.getOverview();
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

export function useExchangeMarkets(
  filters?: MarketFilters,
  pagination?: PaginationParams,
  sort?: MarketSortParams
) {
  const query = useAsyncQuery(
    async () => {
      const res = await exchangeService.getMarkets(filters, pagination, sort);
      return res.data;
    },
    [JSON.stringify(filters), JSON.stringify(pagination), JSON.stringify(sort)]
  );

  return {
    markets: query.data?.items ?? [],
    data: query.data?.items ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isEmpty: query.isEmpty,
    refetch: query.refetch,
  };
}

export function useMarketDetail(tokenId: string | undefined) {
  const query = useAsyncQuery(
    async () => {
      if (!tokenId) return null;
      const res = await exchangeService.getMarketByTokenId(tokenId);
      return res.data;
    },
    [tokenId],
    { enabled: Boolean(tokenId) }
  );

  return {
    market: query.data ?? null,
    data: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useOrderBook(symbol: string | undefined) {
  const query = useAsyncQuery(
    async () => {
      if (!symbol) return null;
      const res = await exchangeService.getOrderBook(symbol);
      return res.data;
    },
    [symbol],
    { enabled: Boolean(symbol) }
  );

  return {
    orderBook: query.data ?? null,
    data: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useRecentTrades(symbol: string | undefined, limit = 10) {
  const query = useAsyncQuery(
    async () => {
      if (!symbol) return [];
      const res = await exchangeService.getRecentTrades(symbol, limit);
      return res.data;
    },
    [symbol, limit],
    { enabled: Boolean(symbol) }
  );

  return {
    trades: query.data ?? [],
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
