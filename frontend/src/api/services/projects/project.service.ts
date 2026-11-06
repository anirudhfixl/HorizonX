// Projects domain service

import { getActiveProvider } from '../../config/data-config';
import { defaultApiClient } from '../../client/api-client';
import type {
  Project,
  ProjectFilters,
  ProjectSortParams,
  PaginatedResult,
  PaginationParams,
  ApiResponse,
} from '../../types';

export class ProjectService {
  async getAll(
    filters?: ProjectFilters,
    pagination?: PaginationParams,
    sort?: ProjectSortParams
  ): Promise<ApiResponse<PaginatedResult<Project>>> {
    const key = `projects:list:${JSON.stringify({ filters, pagination, sort })}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.projects.list(filters, pagination, sort);
    });
  }

  async getById(id: string): Promise<ApiResponse<Project | null>> {
    const key = `projects:get:${id.toLowerCase()}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.projects.getById(id);
    });
  }

  async search(query: string, limit = 10): Promise<ApiResponse<Project[]>> {
    const key = `projects:search:${query.toLowerCase()}:${limit}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.projects.search(query, limit);
    });
  }

  async getFeatured(): Promise<ApiResponse<Project[]>> {
    const key = 'projects:featured';
    return defaultApiClient.cachedQuery(key, async () => {
      const provider = getActiveProvider();
      return provider.projects.getFeatured();
    });
  }
}

export const projectService = new ProjectService();

