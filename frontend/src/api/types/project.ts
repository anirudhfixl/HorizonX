import type { LifecycleStatus, VerificationStatus, FilterParams, SortParams } from './common';

export interface Project {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  logo?: string;
  logoUrl?: string;
  banner?: string;
  bannerImage?: string;
  image?: string;
  galleryImages?: string[];
  category?: string;
  blockchain?: string;
  ecosystem?: string;
  website?: string;
  websiteUrl?: string;
  documentation?: string;
  socialLinks?: Record<string, string>;
  ownerAddress: string;
  status: LifecycleStatus;
  verificationStatus?: VerificationStatus;
  tags?: string[];
  tokenIds: string[];
  partnerIds?: string[];
  tvl?: number;
  mcap?: number;
  change1d?: number;
  change7d?: number;
  chains?: string[];
  isEcosystem?: boolean;
  isExternal?: boolean;
  origin?: 'ecosystem' | 'external' | 'session';
  source?: string;
  defillamaId?: string;
  geckoId?: string;
  cmcId?: number | string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFilters extends FilterParams {
  category?: string[];
  ecosystem?: string[];
  verificationStatus?: VerificationStatus[];
  hasToken?: boolean;
  ownerAddress?: string;
  origin?: 'all' | 'ecosystem' | 'external';
  minTvl?: number;
}

export type ProjectSortField =
  | 'name'
  | 'createdAt'
  | 'updatedAt'
  | 'tokensCount'
  | 'tvl'
  | 'mcap';

export type ProjectSortParams = SortParams<ProjectSortField>;

