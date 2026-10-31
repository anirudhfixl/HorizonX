// src/types/index.ts
// Shared TypeScript types for ProMiners

// ─── Status types ─────────────────────────────────────────────────────────────

export type LifecycleStatus =
  | 'draft'
  | 'pending'
  | 'active'
  | 'ended'
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

// ─── User / Account ───────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  walletAddress?: string;
  isPublic: boolean;
  createdAt: string;
}

// ─── Token ────────────────────────────────────────────────────────────────────

export interface Token {
  id: string;
  name: string;
  symbol: string;
  description?: string;
  logoUrl?: string;
  network: string;
  category?: string;
  contractAddress?: string;
  standard?: string;
  totalSupply?: string;
  decimals?: number;
  creatorAddress?: string;
  projectId?: string;
  status: LifecycleStatus;
  verificationStatus?: VerificationStatus;
  createdAt: string;
  updatedAt: string;
  features?: string[];
}

export interface TokenMarketData {
  tokenId: string;
  price?: number;
  priceChange24h?: number;
  volume24h?: number;
  liquidity?: number;
  marketCap?: number;
  circulatingSupply?: number;
  source?: string;
  lastUpdated?: string;
  /**
   * True only when the figures come from a live market feed. The application
   * has no live feed yet, so catalog records must set this to false.
   */
  isLive: boolean;
}

// ─── Project ──────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  socialLinks?: Record<string, string>;
  ownerAddress: string;
  status: LifecycleStatus;
  verificationStatus?: VerificationStatus;
  category?: string;
  ecosystem?: string;
  tokenIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Presale ──────────────────────────────────────────────────────────────────

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
  title: string;
  description?: string;
  tokenId: string;
  projectId?: string;
  category?: string;
  ownerAddress: string;
  status: PresaleStatus;
  startTime?: string;
  endTime?: string;
  hardCap?: string;
  softCap?: string;
  minContribution?: string;
  maxContribution?: string;
  totalRaised?: string;
  participantCount?: number;
  network: string;
  contractAddress?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Fair Launch ──────────────────────────────────────────────────────────────

export interface FairLaunch {
  id: string;
  title: string;
  description?: string;
  category?: string;
  tokenId: string;
  projectId?: string;
  ownerAddress: string;
  status: PresaleStatus;
  startTime?: string;
  endTime?: string;
  totalSelling?: string;
  softCap?: string;
  totalRaised?: string;
  participantCount?: number;
  minContribution?: string;
  maxContribution?: string;
  network: string;
  contractAddress?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Airdrop Campaign ─────────────────────────────────────────────────────────

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
  title: string;
  description?: string;
  category?: string;
  type: AirdropCampaignType;
  tokenId: string;
  projectId?: string;
  ownerAddress: string;
  status: LifecycleStatus;
  totalReward?: string;
  recipientCount?: number;
  claimedCount?: number;
  startTime?: string;
  endTime?: string;
  network: string;
  contractAddress?: string;
  merkleRoot?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Staking Pool ─────────────────────────────────────────────────────────────

export interface StakingPool {
  id: string;
  name: string;
  tokenId: string;
  projectId?: string;
  ownerAddress: string;
  status: LifecycleStatus;
  apy?: string;
  totalStaked?: string;
  stakerCount?: number;
  lockPeriodDays?: number;
  minStake?: string;
  maxStake?: string;
  network: string;
  contractAddress?: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
  requiresWallet?: boolean;
  badge?: string;
  icon?: string;
}

// ─── API response wrapper ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// ─── Filter / sort ────────────────────────────────────────────────────────────

export interface ListingFilters {
  search?: string;
  status?: LifecycleStatus[];
  network?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}
