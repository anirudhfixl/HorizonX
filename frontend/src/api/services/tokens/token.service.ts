// Tokens domain service

import { getActiveProvider } from '../../config/data-config';
import { defaultApiClient } from '../../client/api-client';
import type {
  Token,
  TokenFilters,
  TokenSortParams,
  PaginatedResult,
  PaginationParams,
  ApiResponse,
} from '../../types';

export class TokenService {
  async getAll(
    filters?: TokenFilters,
    pagination?: PaginationParams,
    sort?: TokenSortParams
  ): Promise<ApiResponse<PaginatedResult<Token>>> {
    const key = `tokens:list:${JSON.stringify({ filters, pagination, sort })}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.tokens.list(filters, pagination, sort);
    });
  }

  async getById(id: string): Promise<ApiResponse<Token | null>> {
    const key = `tokens:get:${id.toLowerCase()}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.tokens.getById(id);
    });
  }

  async search(query: string, limit = 10): Promise<ApiResponse<Token[]>> {
    const key = `tokens:search:${query.toLowerCase()}:${limit}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.tokens.search(query, limit);
    });
  }

  async getFeatured(): Promise<ApiResponse<Token[]>> {
    const key = 'tokens:featured';
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.tokens.getFeatured();
    });
  }
}

export const tokenService = new TokenService();

