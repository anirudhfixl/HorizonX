import { useAsyncQuery } from './use-async-query';
import { stakingService } from '../services/staking/staking.service';
import type {
  StakingPool,
  StakingFilters,
  StakingSortParams,
  PaginationParams,
} from '../types';

export function useStakingPools(
  filters?: StakingFilters,
  pagination?: PaginationParams,
  sort?: StakingSortParams
) {
  const query = useAsyncQuery(
    async () => {
      const res = await stakingService.getAll(filters, pagination, sort);
      return res.data;
    },
    [JSON.stringify(filters), JSON.stringify(pagination), JSON.stringify(sort)]
  );

  return {
    pools: query.data?.items ?? [],
    data: query.data?.items ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isEmpty: query.isEmpty,
    refetch: query.refetch,
  };
}

export function useStakingPool(id: string | undefined) {
  const query = useAsyncQuery(
    async () => {
      if (!id) return null;
      const res = await stakingService.getById(id);
      return res.data;
    },
    [id],
    { enabled: Boolean(id) }
  );

  return {
    pool: query.data ?? null,
    data: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
