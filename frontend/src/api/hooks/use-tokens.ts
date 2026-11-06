import { useAsyncQuery } from './use-async-query';
import { tokenService } from '../services/tokens/token.service';
import type {
  Token,
  TokenFilters,
  TokenSortParams,
  PaginationParams,
} from '../types';

export function useTokens(
  filters?: TokenFilters,
  pagination?: PaginationParams,
  sort?: TokenSortParams
) {
  const query = useAsyncQuery(
    async () => {
      const res = await tokenService.getAll(filters, pagination, sort);
      return res.data;
    },
    [JSON.stringify(filters), JSON.stringify(pagination), JSON.stringify(sort)]
  );

  return {
    tokens: query.data?.items ?? [],
    data: query.data?.items ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isEmpty: query.isEmpty,
    refetch: query.refetch,
  };
}

export function useToken(id: string | undefined) {
  const query = useAsyncQuery(
    async () => {
      if (!id) return null;
      const res = await tokenService.getById(id);
      return res.data;
    },
    [id],
    { enabled: Boolean(id) }
  );

  return {
    token: query.data ?? null,
    data: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useFeaturedTokens() {
  const query = useAsyncQuery(async () => {
    const res = await tokenService.getFeatured();
    return res.data;
  }, []);

  return {
    tokens: query.data ?? [],
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
