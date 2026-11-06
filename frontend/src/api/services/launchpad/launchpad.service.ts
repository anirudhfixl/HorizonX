// Launchpad domain service (Presales & Fair Launches)

import { getActiveProvider } from '../../config/data-config';
import { defaultApiClient } from '../../client/api-client';
import type {
  Presale,
  FairLaunch,
  LaunchpadItem,
  LaunchpadFilters,
  LaunchpadSortParams,
  PaginatedResult,
  PaginationParams,
  ApiResponse,
} from '../../types';

export class LaunchpadService {
  async getAll(
    filters?: LaunchpadFilters,
    pagination?: PaginationParams,
    sort?: LaunchpadSortParams
  ): Promise<ApiResponse<PaginatedResult<LaunchpadItem>>> {
    const key = `launchpad:all:${JSON.stringify({ filters, pagination, sort })}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.launchpad.listAll(filters, pagination, sort);
    });
  }

  async getPresales(
    filters?: LaunchpadFilters,
    pagination?: PaginationParams,
    sort?: LaunchpadSortParams
  ): Promise<ApiResponse<PaginatedResult<Presale>>> {
    const key = `launchpad:presales:${JSON.stringify({ filters, pagination, sort })}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.launchpad.listPresales(filters, pagination, sort);
    });
  }

  async getPresaleById(id: string): Promise<ApiResponse<Presale | null>> {
    const key = `launchpad:presale:${id.toLowerCase()}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.launchpad.getPresaleById(id);
    });
  }

  async getFairLaunches(
    filters?: LaunchpadFilters,
    pagination?: PaginationParams,
    sort?: LaunchpadSortParams
  ): Promise<ApiResponse<PaginatedResult<FairLaunch>>> {
    const key = `launchpad:fairlaunches:${JSON.stringify({ filters, pagination, sort })}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.launchpad.listFairLaunches(filters, pagination, sort);
    });
  }

  async getFairLaunchById(id: string): Promise<ApiResponse<FairLaunch | null>> {
    const key = `launchpad:fairlaunch:${id.toLowerCase()}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.launchpad.getFairLaunchById(id);
    });
  }

  async search(query: string, limit = 10): Promise<ApiResponse<LaunchpadItem[]>> {
    const key = `launchpad:search:${query.toLowerCase()}:${limit}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.launchpad.search(query, limit);
    });
  }
}

export const launchpadService = new LaunchpadService();

