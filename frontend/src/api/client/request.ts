// Request handling abstractions, timeouts, and error normalization

export interface RequestOptions {
  timeoutMs?: number;
  signal?: AbortSignal;
  headers?: Record<string, string>;
  cacheTtlMs?: number;
  skipCache?: boolean;
}

export class ApiError extends Error {
  public status?: number;
  public code?: string;
  public details?: unknown;

  constructor(message: string, status?: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Creates an AbortSignal that aborts after timeoutMs or when an external signal fires.
 */
export function createTimeoutSignal(timeoutMs = 15000, externalSignal?: AbortSignal): {
  signal: AbortSignal;
  cleanup: () => void;
} {
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort(new ApiError(`Request timed out after ${timeoutMs}ms`, 408, 'TIMEOUT'));
  }, timeoutMs);

  const onExternalAbort = () => {
    clearTimeout(timer);
    controller.abort(externalSignal?.reason);
  };

  if (externalSignal) {
    if (externalSignal.aborted) {
      clearTimeout(timer);
      controller.abort(externalSignal.reason);
    } else {
      externalSignal.addEventListener('abort', onExternalAbort, { once: true });
    }
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timer);
      if (externalSignal) {
        externalSignal.removeEventListener('abort', onExternalAbort);
      }
    },
  };
}

/**
 * Normalizes any error into an ApiError.
 */
export function normalizeError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;
  if (err instanceof Error) {
    if (err.name === 'AbortError') {
      return new ApiError('Request aborted by caller', 499, 'ABORTED');
    }
    return new ApiError(err.message, 500, 'INTERNAL_ERROR', err);
  }
  return new ApiError(String(err || 'Unknown error occurred'), 500, 'UNKNOWN');
}

