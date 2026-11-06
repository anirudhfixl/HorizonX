// Airdrops domain service

import { getActiveProvider } from '../../config/data-config';
import { defaultApiClient } from '../../client/api-client';
import type {
  AirdropCampaign,
  AirdropFilters,
  AirdropSortParams,
  PaginatedResult,
  PaginationParams,
  ApiResponse,
} from '../../types';

export class AirdropService {
  async getAll(
    filters?: AirdropFilters,
    pagination?: PaginationParams,
    sort?: AirdropSortParams
  ): Promise<ApiResponse<PaginatedResult<AirdropCampaign>>> {
    const key = `airdrops:list:${JSON.stringify({ filters, pagination, sort })}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.airdrops.list(filters, pagination, sort);
    });
  }

  async getById(id: string): Promise<ApiResponse<AirdropCampaign | null>> {
    const key = `airdrops:get:${id.toLowerCase()}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.airdrops.getById(id);
    });
  }

  async search(query: string, limit = 10): Promise<ApiResponse<AirdropCampaign[]>> {
    const key = `airdrops:search:${query.toLowerCase()}:${limit}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.airdrops.search(query, limit);
    });
  }
}

export const airdropService = new AirdropService();

