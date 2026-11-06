import type { FilterParams, SortParams } from './common';

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content?: string;
  category: string;
  author: string;
  publishedAt: string;
  coverImage?: string;
  tags?: string[];
  sourceUrl?: string;
}

export interface NewsFilters extends FilterParams {
  category?: string[];
  tags?: string[];
}

export type NewsSortField = 'publishedAt' | 'title';
export type NewsSortParams = SortParams<NewsSortField>;

