import { useAsyncQuery } from './use-async-query';
import { airdropService } from '../services/airdrops/airdrop.service';
import type {
  AirdropCampaign,
  AirdropFilters,
  AirdropSortParams,
  PaginationParams,
} from '../types';

export function useAirdrops(
  filters?: AirdropFilters,
  pagination?: PaginationParams,
  sort?: AirdropSortParams
) {
  const query = useAsyncQuery(
    async () => {
      const res = await airdropService.getAll(filters, pagination, sort);
      return res.data;
    },
    [JSON.stringify(filters), JSON.stringify(pagination), JSON.stringify(sort)]
  );

  return {
    airdrops: query.data?.items ?? [],
    data: query.data?.items ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isEmpty: query.isEmpty,
    refetch: query.refetch,
  };
}

export function useAirdrop(id: string | undefined) {
  const query = useAsyncQuery(
    async () => {
      if (!id) return null;
      const res = await airdropService.getById(id);
      return res.data;
    },
    [id],
    { enabled: Boolean(id) }
  );

  return {
    airdrop: query.data ?? null,
    data: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
