import { useAsyncQuery } from './use-async-query';
import { launchpadService } from '../services/launchpad/launchpad.service';
import { coinGeckoClient, CoinGeckoCategoryRaw } from '../client/coingecko-client';
import { geckoTerminalClient, FormattedDEXPool } from '../client/geckoterminal-client';
import type {
  Presale,
  FairLaunch,
  LaunchpadItem,
  LaunchpadFilters,
  LaunchpadSortParams,
  PaginationParams,
} from '../types';

export function useLaunchpad(
  filters?: LaunchpadFilters,
  pagination?: PaginationParams,
  sort?: LaunchpadSortParams
) {
  const query = useAsyncQuery(
    async () => {
      const res = await launchpadService.getAll(filters, pagination, sort);
      return res.data;
    },
    [JSON.stringify(filters), JSON.stringify(pagination), JSON.stringify(sort)]
  );

  return {
    items: query.data?.items ?? [],
    data: query.data?.items ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isEmpty: query.isEmpty,
    refetch: query.refetch,
  };
}

export function usePresales(
  filters?: LaunchpadFilters,
  pagination?: PaginationParams,
  sort?: LaunchpadSortParams
) {
  const query = useAsyncQuery(
    async () => {
      const res = await launchpadService.getPresales(filters, pagination, sort);
      return res.data;
    },
    [JSON.stringify(filters), JSON.stringify(pagination), JSON.stringify(sort)]
  );

  return {
    presales: query.data?.items ?? [],
    data: query.data?.items ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isEmpty: query.isEmpty,
    refetch: query.refetch,
  };
}

export function usePresale(id: string | undefined) {
  const query = useAsyncQuery(
    async () => {
      if (!id) return null;
      const res = await launchpadService.getPresaleById(id);
      return res.data;
    },
    [id],
    { enabled: Boolean(id) }
  );

  return {
    presale: query.data ?? null,
    data: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useFairLaunches(
  filters?: LaunchpadFilters,
  pagination?: PaginationParams,
  sort?: LaunchpadSortParams
) {
  const query = useAsyncQuery(
    async () => {
      const res = await launchpadService.getFairLaunches(filters, pagination, sort);
      return res.data;
    },
    [JSON.stringify(filters), JSON.stringify(pagination), JSON.stringify(sort)]
  );

  return {
    fairLaunches: query.data?.items ?? [],
    data: query.data?.items ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isEmpty: query.isEmpty,
    refetch: query.refetch,
  };
}

export function useFairLaunch(id: string | undefined) {
  const query = useAsyncQuery(
    async () => {
      if (!id) return null;
      const res = await launchpadService.getFairLaunchById(id);
      return res.data;
    },
    [id],
    { enabled: Boolean(id) }
  );

  return {
    fairLaunch: query.data ?? null,
    data: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useLaunchpadCategories() {
  const query = useAsyncQuery(
    async () => {
      const cats = await coinGeckoClient.getLaunchpadCategories();
      return cats;
    },
    []
  );

  return {
    categories: query.data ?? [],
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useNewPools(page = 1) {
  const query = useAsyncQuery(
    async () => {
      const pools = await geckoTerminalClient.getNewPools(page);
      return pools;
    },
    [page]
  );

  return {
    pools: query.data ?? [],
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

