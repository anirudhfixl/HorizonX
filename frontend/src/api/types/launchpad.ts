import type { LifecycleStatus, FilterParams, SortParams } from './common';

export type PresaleStatus =
  | 'draft'
  | 'scheduled'
  | 'live'
  | 'ended'
  | 'finalized'
  | 'cancelled'
  | 'failed';

export interface Presale {
  id: string;
  projectId?: string;
  name?: string;
  title: string;
  description?: string;
  logo?: string;
  banner?: string;
  bannerImage?: string;
  image?: string;
  galleryImages?: string[];
  token?: string;
  tokenId: string;
  category?: string;
  ownerAddress: string;
  status: PresaleStatus;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  hardCap?: string;
  softCap?: string;
  fundraisingGoal?: string;
  salePrice?: string;
  allocation?: string;
  minContribution?: string;
  maxContribution?: string;
  totalRaised?: string;
  participantCount?: number;
  network: string;
  contractAddress?: string;
  progress?: number;
  launchType: 'presale';
  // External provider & provenance metadata
  providerId?: string;
  providerName?: string;
  isEcosystem?: boolean;
  isExternal?: boolean;
  origin?: 'ecosystem' | 'external' | 'session';
  source?: string;
  saleType?: string;
  launchpadName?: string;
  externalUrl?: string;
  lastUpdated?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FairLaunch {
  id: string;
  projectId?: string;
  name?: string;
  title: string;
  description?: string;
  logo?: string;
  banner?: string;
  bannerImage?: string;
  image?: string;
  galleryImages?: string[];
  token?: string;
  tokenId: string;
  category?: string;
  ownerAddress: string;
  status: PresaleStatus;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  totalSelling?: string;
  softCap?: string;
  fundraisingGoal?: string;
  salePrice?: string;
  allocation?: string;
  totalRaised?: string;
  participantCount?: number;
  minContribution?: string;
  maxContribution?: string;
  network: string;
  contractAddress?: string;
  progress?: number;
  launchType: 'fair-launch';
  // External provider & provenance metadata
  providerId?: string;
  providerName?: string;
  isEcosystem?: boolean;
  isExternal?: boolean;
  origin?: 'ecosystem' | 'external' | 'session';
  source?: string;
  saleType?: string;
  launchpadName?: string;
  externalUrl?: string;
  lastUpdated?: string;
  createdAt: string;
  updatedAt: string;
}

export type LaunchpadItem = Presale | FairLaunch;

export interface LaunchpadPlatformCategory {
  id: string;
  name: string;
  marketCap?: number | null;
  marketCapChange24h?: number | null;
  volume24h?: number | null;
  description?: string;
  topCoins?: string[];
  updatedAt?: string;
}

export interface LaunchpadFilters extends FilterParams {
  launchType?: 'all' | 'presale' | 'fair-launch';
  tokenId?: string;
  projectId?: string;
  ownerAddress?: string;
  origin?: 'all' | 'ecosystem' | 'external';
}

export type LaunchpadSortField =
  | 'title'
  | 'name'
  | 'createdAt'
  | 'startTime'
  | 'endTime'
  | 'totalRaised'
  | 'progress';

export type LaunchpadSortParams = SortParams<LaunchpadSortField>;

