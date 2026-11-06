// Centralized Data Provider abstraction interface for HorizonX

import type {
  Token,
  TokenFilters,
  TokenSortParams,
  Project,
  ProjectFilters,
  ProjectSortParams,
  AirdropCampaign,
  AirdropFilters,
  AirdropSortParams,
  Presale,
  FairLaunch,
  LaunchpadItem,
  LaunchpadFilters,
  LaunchpadSortParams,
  StakingPool,
  StakingFilters,
  StakingSortParams,
  MarketOverview,
  MarketPair,
  MarketFilters,
  MarketSortParams,
  MarketHistoryPoint,
  ExchangeOrderBook,
  ExchangeTrade,
  PartnerItem,
  PartnerProgramMetrics,
  PartnerBenefit,
  PartnerFilters,
  PartnerSortParams,
  NewsArticle,
  NewsFilters,
  NewsSortParams,
  PaginatedResult,
  PaginationParams,
} from '../types';

export interface ITokenProvider {
  list(filters?: TokenFilters, pagination?: PaginationParams, sort?: TokenSortParams): Promise<PaginatedResult<Token>>;
  getById(id: string): Promise<Token | null>;
  search(query: string, limit?: number): Promise<Token[]>;
  getFeatured(): Promise<Token[]>;
}

export interface IProjectProvider {
  list(filters?: ProjectFilters, pagination?: PaginationParams, sort?: ProjectSortParams): Promise<PaginatedResult<Project>>;
  getById(id: string): Promise<Project | null>;
  search(query: string, limit?: number): Promise<Project[]>;
  getFeatured(): Promise<Project[]>;
}

export interface IAirdropProvider {
  list(filters?: AirdropFilters, pagination?: PaginationParams, sort?: AirdropSortParams): Promise<PaginatedResult<AirdropCampaign>>;
  getById(id: string): Promise<AirdropCampaign | null>;
  search(query: string, limit?: number): Promise<AirdropCampaign[]>;
}

export interface ILaunchpadProvider {
  listAll(filters?: LaunchpadFilters, pagination?: PaginationParams, sort?: LaunchpadSortParams): Promise<PaginatedResult<LaunchpadItem>>;
  listPresales(filters?: LaunchpadFilters, pagination?: PaginationParams, sort?: LaunchpadSortParams): Promise<PaginatedResult<Presale>>;
  getPresaleById(id: string): Promise<Presale | null>;
  listFairLaunches(filters?: LaunchpadFilters, pagination?: PaginationParams, sort?: LaunchpadSortParams): Promise<PaginatedResult<FairLaunch>>;
  getFairLaunchById(id: string): Promise<FairLaunch | null>;
  search(query: string, limit?: number): Promise<LaunchpadItem[]>;
}

export interface IStakingProvider {
  listPools(filters?: StakingFilters, pagination?: PaginationParams, sort?: StakingSortParams): Promise<PaginatedResult<StakingPool>>;
  getPoolById(id: string): Promise<StakingPool | null>;
  search(query: string, limit?: number): Promise<StakingPool[]>;
}

export interface IMarketProvider {
  getOverview(): Promise<MarketOverview>;
  listPairs(filters?: MarketFilters, pagination?: PaginationParams, sort?: MarketSortParams): Promise<PaginatedResult<MarketPair>>;
  getPairBySymbol(symbol: string): Promise<MarketPair | null>;
  getHistoricalData(tokenId: string, range?: '24h' | '7d' | '30d' | '90d'): Promise<MarketHistoryPoint[]>;
}

export interface IExchangeProvider {
  getOverview(): Promise<MarketOverview>;
  listMarkets(filters?: MarketFilters, pagination?: PaginationParams, sort?: MarketSortParams): Promise<PaginatedResult<MarketPair>>;
  getMarketByTokenId(tokenId: string): Promise<MarketPair | null>;
  getOrderBook(symbol: string): Promise<ExchangeOrderBook>;
  getRecentTrades(symbol: string, limit?: number): Promise<ExchangeTrade[]>;
}

export interface IPartnerProvider {
  list(filters?: PartnerFilters, pagination?: PaginationParams, sort?: PartnerSortParams): Promise<PaginatedResult<PartnerItem>>;
  getById(id: string): Promise<PartnerItem | null>;
  getProgramMetrics(): Promise<PartnerProgramMetrics>;
  getBenefits(): Promise<PartnerBenefit[]>;
}

export interface INewsProvider {
  list(filters?: NewsFilters, pagination?: PaginationParams, sort?: NewsSortParams): Promise<PaginatedResult<NewsArticle>>;
  getById(id: string): Promise<NewsArticle | null>;
}

export interface IDataProvider {
  readonly id: string;
  readonly name: string;
  tokens: ITokenProvider;
  projects: IProjectProvider;
  airdrops: IAirdropProvider;
  launchpad: ILaunchpadProvider;
  staking: IStakingProvider;
  market: IMarketProvider;
  exchange: IExchangeProvider;
  partners: IPartnerProvider;
  news: INewsProvider;
}

