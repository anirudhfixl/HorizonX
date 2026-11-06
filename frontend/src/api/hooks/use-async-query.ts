import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseAsyncQueryOptions<T> {
  enabled?: boolean;
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export interface UseAsyncQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isEmpty: boolean;
  refetch: () => Promise<void>;
}

export function useAsyncQuery<T>(
  queryFn: (signal: AbortSignal) => Promise<T>,
  deps: unknown[] = [],
  options: UseAsyncQueryOptions<T> = {}
): UseAsyncQueryResult<T> {
  const { enabled = true, initialData = null, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<Error | null>(null);

  const queryFnRef = useRef(queryFn);
  queryFnRef.current = queryFn;

  const activeControllerRef = useRef<AbortController | null>(null);
  const requestCountRef = useRef(0);

  const execute = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    if (activeControllerRef.current) {
      activeControllerRef.current.abort();
    }

    const controller = new AbortController();
    activeControllerRef.current = controller;
    const currentRequestId = ++requestCountRef.current;

    setIsLoading(true);
    setError(null);

    try {
      const result = await queryFnRef.current(controller.signal);

      // Guard against stale response or unmounted hook
      if (currentRequestId === requestCountRef.current && !controller.signal.aborted) {
        setData(result);
        setIsLoading(false);
        onSuccess?.(result);
      }
    } catch (err: unknown) {
      if (controller.signal.aborted) return;

      if (currentRequestId === requestCountRef.current) {
        const normalized = err instanceof Error ? err : new Error(String(err));
        setError(normalized);
        setIsLoading(false);
        onError?.(normalized);
      }
    }
  }, [enabled, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    execute();

    return () => {
      if (activeControllerRef.current) {
        activeControllerRef.current.abort();
      }
    };
  }, [execute]);

  const isEmpty = !isLoading && (
    data === null ||
    (Array.isArray(data) && data.length === 0) ||
    (typeof data === 'object' && data !== null && 'items' in data && Array.isArray((data as any).items) && (data as any).items.length === 0)
  );

  return {
    data,
    isLoading,
    isError: error !== null,
    error,
    isEmpty,
    refetch: execute,
  };
}

