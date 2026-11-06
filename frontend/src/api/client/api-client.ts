// Core API Client wrapper supporting normalized responses, interceptors, and caching

import { MemoryCache, globalCache } from './cache';
import { ApiError, normalizeError, createTimeoutSignal, type RequestOptions } from './request';
import type { ApiResponse, PaginationMeta } from '../types/common';

export interface ApiClientConfig {
  baseUrl?: string;
  defaultTimeoutMs?: number;
  cache?: MemoryCache;
}

export class ApiClient {
  private baseUrl: string;
  private defaultTimeoutMs: number;
  private cache: MemoryCache;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl || '';
    this.defaultTimeoutMs = config.defaultTimeoutMs || 10000;
    this.cache = config.cache || globalCache;
  }

  /**
   * Helper to format a standard successful ApiResponse
   */
  wrapResponse<T>(data: T, pagination?: PaginationMeta, message?: string): ApiResponse<T> {
    return {
      data,
      success: true,
      message,
      timestamp: new Date().toISOString(),
      pagination,
    };
  }

  /**
   * Cache-aware query runner
   */
  async cachedQuery<T>(
    cacheKey: string,
    queryFn: (signal: AbortSignal) => Promise<T>,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { timeoutMs = this.defaultTimeoutMs, signal: extSignal, cacheTtlMs, skipCache } = options;
    const { signal, cleanup } = createTimeoutSignal(timeoutMs, extSignal);

    try {
      if (skipCache) {
        const result = await queryFn(signal);
        return this.wrapResponse(result);
      }

      const result = await this.cache.dedupe(
        cacheKey,
        async () => {
          if (signal.aborted) throw new ApiError('Request aborted', 499, 'ABORTED');
          return queryFn(signal);
        },
        cacheTtlMs
      );

      return this.wrapResponse(result);
    } catch (err) {
      throw normalizeError(err);
    } finally {
      cleanup();
    }
  }

  /**
   * Invalidate a cache key or entire cache
   */
  invalidateCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

export const defaultApiClient = new ApiClient();

