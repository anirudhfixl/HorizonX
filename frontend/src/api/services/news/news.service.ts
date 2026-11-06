// News & Announcements domain service

import { getActiveProvider } from '../../config/data-config';
import { defaultApiClient } from '../../client/api-client';
import type {
  NewsArticle,
  NewsFilters,
  NewsSortParams,
  PaginatedResult,
  PaginationParams,
  ApiResponse,
} from '../../types';

export class NewsService {
  async getAll(
    filters?: NewsFilters,
    pagination?: PaginationParams,
    sort?: NewsSortParams
  ): Promise<ApiResponse<PaginatedResult<NewsArticle>>> {
    const key = `news:list:${JSON.stringify({ filters, pagination, sort })}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.news.list(filters, pagination, sort);
    });
  }

  async getById(id: string): Promise<ApiResponse<NewsArticle | null>> {
    const key = `news:get:${id.toLowerCase()}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.news.getById(id);
    });
  }
}

export const newsService = new NewsService();

