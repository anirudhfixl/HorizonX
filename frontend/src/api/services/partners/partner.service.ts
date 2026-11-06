// Partners domain service

import { getActiveProvider } from '../../config/data-config';
import { defaultApiClient } from '../../client/api-client';
import type {
  PartnerItem,
  PartnerProgramMetrics,
  PartnerBenefit,
  PartnerFilters,
  PartnerSortParams,
  PaginatedResult,
  PaginationParams,
  ApiResponse,
} from '../../types';

export class PartnerService {
  async getAll(
    filters?: PartnerFilters,
    pagination?: PaginationParams,
    sort?: PartnerSortParams
  ): Promise<ApiResponse<PaginatedResult<PartnerItem>>> {
    const key = `partners:list:${JSON.stringify({ filters, pagination, sort })}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.partners.list(filters, pagination, sort);
    });
  }

  async getById(id: string): Promise<ApiResponse<PartnerItem | null>> {
    const key = `partners:get:${id.toLowerCase()}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.partners.getById(id);
    });
  }

  async getProgramMetrics(): Promise<ApiResponse<PartnerProgramMetrics>> {
    const key = 'partners:metrics';
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.partners.getProgramMetrics();
    });
  }

  async getBenefits(): Promise<ApiResponse<PartnerBenefit[]>> {
    const key = 'partners:benefits';
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.partners.getBenefits();
    });
  }
}

export const partnerService = new PartnerService();

