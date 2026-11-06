import { useAsyncQuery } from './use-async-query';
import { newsService } from '../services/news/news.service';
import type {
  NewsArticle,
  NewsFilters,
  NewsSortParams,
  PaginationParams,
} from '../types';

export function useNews(
  filters?: NewsFilters,
  pagination?: PaginationParams,
  sort?: NewsSortParams
) {
  const query = useAsyncQuery(
    async () => {
      const res = await newsService.getAll(filters, pagination, sort);
      return res.data;
    },
    [JSON.stringify(filters), JSON.stringify(pagination), JSON.stringify(sort)]
  );

  return {
    articles: query.data?.items ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isEmpty: query.isEmpty,
    refetch: query.refetch,
  };
}

export function useNewsArticle(id: string | undefined) {
  const query = useAsyncQuery(
    async () => {
      if (!id) return null;
      const res = await newsService.getById(id);
      return res.data;
    },
    [id],
    { enabled: Boolean(id) }
  );

  return {
    article: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

