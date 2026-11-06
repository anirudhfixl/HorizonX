// Common types and API response wrappers

export type LifecycleStatus =
  | 'draft'
  | 'pending'
  | 'scheduled'
  | 'active'
  | 'live'
  | 'ended'
  | 'finalized'
  | 'failed'
  | 'cancelled'
  | 'unverified'
  | 'unknown';

export type VerificationStatus =
  | 'wallet_connected'
  | 'wallet_ownership_confirmed'
  | 'identity_kyc_passed'
  | 'project_reviewed'
  | 'contract_source_verified'
  | 'audit_available'
  | 'risk_flag'
  | 'not_reviewed';

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface SortParams<TField extends string = string> {
  sortBy?: TField;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  network?: string[];
  status?: LifecycleStatus[];
  category?: string[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
  pagination?: PaginationMeta;
}

export interface AsyncDataState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

