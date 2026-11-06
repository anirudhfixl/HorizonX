import type { FilterParams, SortParams } from './common';

export interface PartnerItem {
  id: string;
  name: string;
  logo?: string;
  description: string;
  category: string;
  website?: string;
  socialLinks?: Record<string, string>;
  tier?: string;
  commissionRate?: string;
  referredVolume?: string;
  accruedRewards?: string;
  isFeatured?: boolean;
  createdAt?: string;
  projectIds?: string[];
  tokenIds?: string[];
  verifiedIntegrations?: string[];
}

export interface PartnerProgramMetrics {
  commissionTier: string;
  commissionRevShare: string;
  totalReferredVolume: string;
  referredVolumeChange: string;
  accruedRewards: string;
  rewardsStatus: string;
}

export interface PartnerBenefit {
  title: string;
  description: string;
  badge?: string;
}

export interface PartnerFilters extends FilterParams {
  category?: string[];
  tier?: string[];
}

export type PartnerSortField = 'name' | 'tier' | 'referredVolume';
export type PartnerSortParams = SortParams<PartnerSortField>;

