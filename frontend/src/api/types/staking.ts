import type { LifecycleStatus, FilterParams, SortParams } from './common';

export interface StakingPool {
  id: string;
  projectId?: string;
  name: string;
  token?: string;
  tokenId: string;
  network: string;
  apr?: string;
  apy?: string;
  apyValue?: number;
  tvl?: string;
  tvlUsd?: number;
  totalStaked?: string;
  lockPeriod?: string;
  lockPeriodDays?: number;
  rewardToken?: string;
  minStake?: string;
  maxStake?: string;
  status: LifecycleStatus;
  stakerCount?: number;
  description?: string;
  category?: string;
  ownerAddress: string;
  contractAddress?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  image?: string;
  bannerImage?: string;
  galleryImages?: string[];
  isEcosystem?: boolean;
  isExternal?: boolean;
  origin?: 'ecosystem' | 'external' | 'session';
  source?: string;
  apyBase?: number;
  apyReward?: number;
  underlyingTokens?: string[];
  poolMeta?: string;
  protocolSlug?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StakingFilters extends FilterParams {
  tokenId?: string;
  projectId?: string;
  ownerAddress?: string;
  minApy?: number;
  origin?: 'all' | 'ecosystem' | 'external';
  network?: string[];
  category?: string[];
}

export type StakingSortField =
  | 'name'
  | 'apy'
  | 'tvl'
  | 'stakerCount'
  | 'createdAt'
  | 'lockPeriod';

export type StakingSortParams = SortParams<StakingSortField>;

