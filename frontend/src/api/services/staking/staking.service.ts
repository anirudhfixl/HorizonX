// Staking domain service

import { getActiveProvider } from '../../config/data-config';
import { defaultApiClient } from '../../client/api-client';
import type {
  StakingPool,
  StakingFilters,
  StakingSortParams,
  PaginatedResult,
  PaginationParams,
  ApiResponse,
} from '../../types';

export class StakingService {
  async getAll(
    filters?: StakingFilters,
    pagination?: PaginationParams,
    sort?: StakingSortParams
  ): Promise<ApiResponse<PaginatedResult<StakingPool>>> {
    const key = `staking:list:${JSON.stringify({ filters, pagination, sort })}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.staking.listPools(filters, pagination, sort);
    });
  }

  async getById(id: string): Promise<ApiResponse<StakingPool | null>> {
    const key = `staking:get:${id.toLowerCase()}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.staking.getPoolById(id);
    });
  }

  async search(query: string, limit = 10): Promise<ApiResponse<StakingPool[]>> {
    const key = `staking:search:${query.toLowerCase()}:${limit}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.staking.search(query, limit);
    });
  }
}

export const stakingService = new StakingService();

