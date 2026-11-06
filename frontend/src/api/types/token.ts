import type { LifecycleStatus, VerificationStatus, FilterParams, SortParams } from './common';

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
  isLive: boolean;
}

export interface Token {
  id: string;
  name: string;
  symbol: string;
  description?: string;
  logo?: string;
  logoUrl?: string;
  image?: string;
  bannerImage?: string;
  coverImage?: string;
  galleryImages?: string[];
  blockchain?: string;
  network: string;
  category?: string;
  contractAddress?: string;
  standard?: string;
  totalSupply?: string;
  maxSupply?: string;
  circulatingSupply?: string | number;
  decimals?: number;
  price?: number;
  priceChange24h?: number;
  marketCap?: number;
  volume24h?: number;
  creatorAddress?: string;
  projectId?: string;
  status: LifecycleStatus;
  verificationStatus?: VerificationStatus;
  features?: string[];
  isEcosystem?: boolean;
  isExternal?: boolean;
  origin?: 'ecosystem' | 'external' | 'session';
  cmcId?: number;
  cmcRank?: number;
  market: TokenMarketData;
  createdAt: string;
  updatedAt: string;
}

export interface TokenFilters extends FilterParams {
  category?: string[];
  verifiedOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minMarketCap?: number;
  creatorAddress?: string;
}

export type TokenSortField =
  | 'name'
  | 'symbol'
  | 'price'
  | 'priceChange24h'
  | 'marketCap'
  | 'volume24h'
  | 'createdAt';

export type TokenSortParams = SortParams<TokenSortField>;

