import { useAsyncQuery } from './use-async-query';
import { projectService } from '../services/projects/project.service';
import type {
  Project,
  ProjectFilters,
  ProjectSortParams,
  PaginationParams,
} from '../types';

export function useProjects(
  filters?: ProjectFilters,
  pagination?: PaginationParams,
  sort?: ProjectSortParams
) {
  const query = useAsyncQuery(
    async () => {
      const res = await projectService.getAll(filters, pagination, sort);
      return res.data;
    },
    [JSON.stringify(filters), JSON.stringify(pagination), JSON.stringify(sort)]
  );

  return {
    projects: query.data?.items ?? [],
    data: query.data?.items ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isEmpty: query.isEmpty,
    refetch: query.refetch,
  };
}

export function useProject(id: string | undefined) {
  const query = useAsyncQuery(
    async () => {
      if (!id) return null;
      const res = await projectService.getById(id);
      return res.data;
    },
    [id],
    { enabled: Boolean(id) }
  );

  return {
    project: query.data ?? null,
    data: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useFeaturedProjects() {
  const query = useAsyncQuery(async () => {
    const res = await projectService.getFeatured();
    return res.data;
  }, []);

  return {
    projects: query.data ?? [],
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
