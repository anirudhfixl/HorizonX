import type { LifecycleStatus, VerificationStatus, FilterParams, SortParams } from './common';

export type AirdropCampaignType =
  | 'batch'
  | 'lottery'
  | 'referral'
  | 'quest'
  | 'governance'
  | 'recurring'
  | 'merkle'
  | 'legacy';

export interface AirdropCampaign {
  id: string;
  projectId?: string;
  name?: string;
  title: string;
  description?: string;
  image?: string;
  banner?: string;
  bannerImage?: string;
  galleryImages?: string[];
  network: string;
  reward?: string;
  totalReward?: string;
  eligibility?: string;
  requirements?: string[];
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  status: LifecycleStatus;
  category?: string;
  officialUrl?: string;
  verificationStatus?: VerificationStatus;
  type: AirdropCampaignType;
  tokenId: string;
  ownerAddress: string;
  recipientCount?: number;
  claimedCount?: number;
  contractAddress?: string;
  merkleRoot?: string;
  // External provider & provenance metadata
  providerId?: string;
  providerName?: string;
  isEcosystem?: boolean;
  isExternal?: boolean;
  origin?: 'ecosystem' | 'external' | 'session';
  source?: string;
  externalUrl?: string;
  lastUpdated?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AirdropFilters extends FilterParams {
  type?: AirdropCampaignType[];
  tokenId?: string;
  projectId?: string;
  ownerAddress?: string;
  origin?: 'all' | 'ecosystem' | 'external';
}

export type AirdropSortField =
  | 'title'
  | 'createdAt'
  | 'startTime'
  | 'endTime'
  | 'recipientCount'
  | 'claimedCount';

export type AirdropSortParams = SortParams<AirdropSortField>;

