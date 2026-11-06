// Local data provider implementation consuming HorizonX catalog datasets

import {
  TOKENS as CATALOG_TOKENS,
  PROJECTS as CATALOG_PROJECTS,
  PRESALES as CATALOG_PRESALES,
  FAIR_LAUNCHES as CATALOG_FAIR_LAUNCHES,
  AIRDROPS as CATALOG_AIRDROPS,
  STAKING_POOLS as CATALOG_STAKING_POOLS,
  PARTNERS as CATALOG_PARTNERS,
} from '@/data/catalog';
import { FEATURED_TOKEN_IDS } from '@/data/platform';
import { readSessionPresales, readSessionFairLaunches, sessionPresaleToPresale, sessionFairLaunchToFairLaunch } from '@/lib/launch-storage';
import { readSessionAirdrops } from '@/lib/airdrop-storage';

import type {
  IDataProvider,
  ITokenProvider,
  IProjectProvider,
  IAirdropProvider,
  ILaunchpadProvider,
  IStakingProvider,
  IMarketProvider,
  IExchangeProvider,
  IPartnerProvider,
  INewsProvider,
} from './data-provider';

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

/**
 * Universal pagination helper
 */
function paginate<T>(items: T[], pagination?: PaginationParams): PaginatedResult<T> {
  const page = Math.max(1, pagination?.page || 1);
  const pageSize = Math.max(1, pagination?.pageSize || (items.length > 0 ? items.length : 10));
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  const pageItems = items.slice(startIndex, startIndex + pageSize);

  return {
    items: pageItems,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

/**
 * Normalizes tokens into complete Token contract
 */
function normalizeToken(raw: typeof CATALOG_TOKENS[number]): Token {
  return {
    ...raw,
    logo: raw.image || raw.logoUrl || '/images/horizonx-dataset-placeholder.svg',
    logoUrl: raw.image || raw.logoUrl || '/images/horizonx-dataset-placeholder.svg',
    blockchain: raw.network,
    price: raw.market.price,
    priceChange24h: raw.market.priceChange24h,
    marketCap: raw.market.marketCap,
    volume24h: raw.market.volume24h,
    circulatingSupply: raw.market.circulatingSupply || raw.totalSupply,
    maxSupply: raw.totalSupply,
  };
}

/**
 * Normalizes projects into complete Project contract
 */
function normalizeProject(raw: typeof CATALOG_PROJECTS[number]): Project {
  return {
    ...raw,
    slug: raw.id,
    logo: raw.image || raw.logoUrl || '/images/horizonx-dataset-placeholder.svg',
    logoUrl: raw.image || raw.logoUrl || '/images/horizonx-dataset-placeholder.svg',
    banner: raw.bannerImage || '/images/horizonx-dataset-placeholder.svg',
    blockchain: raw.ecosystem,
    website: raw.websiteUrl,
    tags: raw.category ? [raw.category] : [],
    origin: 'ecosystem',
    isEcosystem: true,
    isExternal: false,
    source: 'HorizonX Ecosystem (Simulated)',
  };
}

/**
 * Calculate progress percentage
 */
function calculateLaunchProgress(totalRaised?: string, cap?: string): number {
  if (!totalRaised || !cap) return 0;
  const raisedNum = parseFloat(totalRaised.replace(/[^0-9.]/g, ''));
  const capNum = parseFloat(cap.replace(/[^0-9.]/g, ''));
  if (isNaN(raisedNum) || isNaN(capNum) || capNum === 0) return 0;
  return Math.min(100, Math.max(0, (raisedNum / capNum) * 100));
}

// ─────────────────────────────────────────────────────────────────────────────

function normalizePartner(raw: typeof CATALOG_PARTNERS[number]): PartnerItem {
  const linkedProjects = CATALOG_PROJECTS.filter((p) => p.partnerIds?.includes(raw.id));
  const linkedProjectIds = linkedProjects.map((p) => p.id);
  const linkedTokenIds = Array.from(new Set(linkedProjects.flatMap((p) => p.tokenIds || [])));

  const tier =
    raw.id.includes('strategic') ||
    raw.id.startsWith('solargrid') ||
    raw.id.startsWith('aurora') ||
    raw.id.startsWith('coinmarketcap') ||
    raw.category === 'Research' ||
    raw.category === 'Infrastructure' ||
    raw.category === 'DePIN'
      ? 'Strategic Partner'
      : raw.id.startsWith('nexus') ||
        raw.id.startsWith('zk') ||
        raw.category === 'Security' ||
        raw.category === 'DeFi'
      ? 'Gold Partner'
      : 'Ecosystem Partner';

  return {
    id: raw.id,
    name: raw.name,
    logo: raw.image || '/images/horizonx-dataset-placeholder.svg',
    description: raw.description,
    category: raw.category,
    website: raw.websiteUrl,
    tier,
    projectIds: linkedProjectIds,
    tokenIds: linkedTokenIds,
    verifiedIntegrations: [`${raw.category} Protocol Integration`, 'Verified Partner Node'],
    commissionRate: tier === 'Strategic Partner' ? '40%' : tier === 'Gold Partner' ? '35%' : '25%',
    referredVolume: '$350,000',
    accruedRewards: '$4,200',
    isFeatured: tier === 'Strategic Partner',
    createdAt: raw.createdAt,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PRE-NORMALIZED STATIC DATASET CACHES (ZERO RE-ALLOCATION)
// ─────────────────────────────────────────────────────────────────────────────
const CACHED_TOKENS: Token[] = CATALOG_TOKENS.map(normalizeToken);
const TOKEN_BY_ID_MAP = new Map<string, Token>();
for (const t of CACHED_TOKENS) {
  TOKEN_BY_ID_MAP.set(t.id.toLowerCase(), t);
  if (t.contractAddress) {
    TOKEN_BY_ID_MAP.set(t.contractAddress.toLowerCase(), t);
  }
}

const CACHED_PROJECTS: Project[] = CATALOG_PROJECTS.map(normalizeProject);
const PROJECT_BY_ID_MAP = new Map<string, Project>();
for (const p of CACHED_PROJECTS) {
  PROJECT_BY_ID_MAP.set(p.id.toLowerCase(), p);
}

const CACHED_AIRDROPS: AirdropCampaign[] = CATALOG_AIRDROPS.map((a) => ({
  ...a,
  name: a.title,
  banner: a.bannerImage,
  reward: a.totalReward,
  startDate: a.startTime,
  endDate: a.endTime,
  origin: 'ecosystem' as const,
  isEcosystem: true,
  isExternal: false,
  source: 'HorizonX Ecosystem (Simulated)',
}));

const CACHED_PRESALES: Presale[] = CATALOG_PRESALES.map((p) => ({
  ...p,
  name: p.title,
  banner: p.bannerImage,
  token: p.tokenId,
  fundraisingGoal: p.hardCap,
  startDate: p.startTime,
  endDate: p.endTime,
  launchType: 'presale' as const,
  progress: calculateLaunchProgress(p.totalRaised, p.hardCap),
  origin: 'ecosystem' as const,
  isEcosystem: true,
  isExternal: false,
  source: 'HorizonX Ecosystem (Simulated)',
}));

const CACHED_FAIR_LAUNCHES: FairLaunch[] = CATALOG_FAIR_LAUNCHES.map((f) => ({
  ...f,
  name: f.title,
  banner: f.bannerImage,
  token: f.tokenId,
  fundraisingGoal: f.softCap,
  startDate: f.startTime,
  endDate: f.endTime,
  launchType: 'fair-launch' as const,
  progress: calculateLaunchProgress(f.totalRaised, f.softCap),
  origin: 'ecosystem' as const,
  isEcosystem: true,
  isExternal: false,
  source: 'HorizonX Ecosystem (Simulated)',
}));

const CACHED_STAKING_POOLS: StakingPool[] = CATALOG_STAKING_POOLS.map((p) => ({
  ...p,
  token: p.tokenId,
  rewardToken: p.tokenId,
  lockPeriod: p.lockPeriodDays ? `${p.lockPeriodDays} Days` : 'Flexible',
  apr: p.apy,
  tvl: p.totalStaked,
  origin: 'ecosystem' as const,
  isEcosystem: true,
  isExternal: false,
  source: 'HorizonX Ecosystem (Simulated)',
}));

const STAKING_POOL_BY_ID_MAP = new Map<string, StakingPool>();
for (const p of CACHED_STAKING_POOLS) {
  STAKING_POOL_BY_ID_MAP.set(p.id.toLowerCase(), p);
}

const CACHED_PARTNERS: PartnerItem[] = CATALOG_PARTNERS.map(normalizePartner);
const PARTNER_BY_ID_MAP = new Map<string, PartnerItem>();
for (const p of CACHED_PARTNERS) {
  PARTNER_BY_ID_MAP.set(p.id.toLowerCase(), p);
}

const CACHED_MARKET_PAIRS: MarketPair[] = CATALOG_TOKENS.map((token) => ({
  id: `pair-${token.id}-usd`,
  symbol: `${token.symbol}/USD`,
  name: `${token.name} / USD`,
  baseTokenId: token.id,
  quoteSymbol: 'USD',
  price: token.market.price || 0,
  priceChange24h: token.market.priceChange24h || 0,
  volume24h: token.market.volume24h || 0,
  liquidity: token.market.liquidity || 0,
  high24h: token.market.price ? Number((token.market.price * 1.08).toFixed(4)) : undefined,
  low24h: token.market.price ? Number((token.market.price * 0.93).toFixed(4)) : undefined,
  category: token.category,
  network: token.network,
}));

const PAIR_LOOKUP_MAP = new Map<string, MarketPair>();
for (const p of CACHED_MARKET_PAIRS) {
  PAIR_LOOKUP_MAP.set(p.symbol.toLowerCase().replace('/', ''), p);
  PAIR_LOOKUP_MAP.set(p.baseTokenId.toLowerCase(), p);
  PAIR_LOOKUP_MAP.set(p.id.toLowerCase(), p);
}

// TOKENS PROVIDER
// ─────────────────────────────────────────────────────────────────────────────
class LocalTokenProvider implements ITokenProvider {
  private getTokens(): Token[] {
    return CACHED_TOKENS;
  }

  async list(filters?: TokenFilters, pagination?: PaginationParams, sort?: TokenSortParams): Promise<PaginatedResult<Token>> {
    let items = this.getTokens();

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      items = items.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.symbol.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          (t.contractAddress && t.contractAddress.toLowerCase().includes(q))
      );
    }

    if (filters?.network && filters.network.length > 0) {
      items = items.filter((t) => filters.network!.includes(t.network));
    }

    if (filters?.status && filters.status.length > 0) {
      items = items.filter((t) => filters.status!.includes(t.status));
    }

    if (filters?.category && filters.category.length > 0) {
      items = items.filter((t) => t.category && filters.category!.includes(t.category));
    }

    if (filters?.verifiedOnly) {
      items = items.filter((t) => t.verificationStatus === 'audit_available' || t.verificationStatus === 'project_reviewed');
    }

    if (filters?.creatorAddress) {
      const addr = filters.creatorAddress.toLowerCase();
      items = items.filter((t) => t.creatorAddress && t.creatorAddress.toLowerCase() === addr);
    }

    // Sort
    if (sort?.sortBy) {
      const order = sort.sortOrder === 'desc' ? -1 : 1;
      items.sort((a, b) => {
        switch (sort.sortBy) {
          case 'name':
            return order * a.name.localeCompare(b.name);
          case 'symbol':
            return order * a.symbol.localeCompare(b.symbol);
          case 'price':
            return order * ((a.price || 0) - (b.price || 0));
          case 'priceChange24h':
            return order * ((a.priceChange24h || 0) - (b.priceChange24h || 0));
          case 'marketCap':
            return order * ((a.marketCap || 0) - (b.marketCap || 0));
          case 'volume24h':
            return order * ((a.volume24h || 0) - (b.volume24h || 0));
          case 'createdAt':
            return order * a.createdAt.localeCompare(b.createdAt);
          default:
            return 0;
        }
      });
    }

    return paginate(items, pagination);
  }

  async getById(id: string): Promise<Token | null> {
    return TOKEN_BY_ID_MAP.get(id.toLowerCase()) || null;
  }

  async search(query: string, limit = 10): Promise<Token[]> {
    const q = query.toLowerCase().trim();
    if (!q) return this.getTokens().slice(0, limit);
    return this.getTokens()
      .filter((t) => t.name.toLowerCase().includes(q) || t.symbol.toLowerCase().includes(q))
      .slice(0, limit);
  }

  async getFeatured(): Promise<Token[]> {
    const tokens = this.getTokens();
    const featured = tokens.filter((t) => (FEATURED_TOKEN_IDS as readonly string[]).includes(t.id));
    return featured.length > 0 ? featured : tokens.slice(0, 4);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS PROVIDER
// ─────────────────────────────────────────────────────────────────────────────
class LocalProjectProvider implements IProjectProvider {
  private getProjects(): Project[] {
    return CACHED_PROJECTS;
  }

  async list(filters?: ProjectFilters, pagination?: PaginationParams, sort?: ProjectSortParams): Promise<PaginatedResult<Project>> {
    let items = this.getProjects();

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          p.id.toLowerCase().includes(q)
      );
    }

    if (filters?.category) {
      const cats = Array.isArray(filters.category) ? filters.category : [filters.category];
      if (cats.length > 0) {
        items = items.filter((p) => p.category && cats.includes(p.category));
      }
    }

    if (filters?.ecosystem && filters.ecosystem.length > 0) {
      items = items.filter((p) => p.ecosystem && filters.ecosystem!.includes(p.ecosystem));
    }

    if (filters?.status && filters.status.length > 0) {
      items = items.filter((p) => filters.status!.includes(p.status));
    }

    if (filters?.hasToken !== undefined) {
      items = items.filter((p) => (filters.hasToken ? p.tokenIds.length > 0 : p.tokenIds.length === 0));
    }

    if (filters?.ownerAddress) {
      const addr = filters.ownerAddress.toLowerCase();
      items = items.filter((p) => p.ownerAddress.toLowerCase().includes(addr));
    }

    if (sort?.sortBy) {
      const order = sort.sortOrder === 'desc' ? -1 : 1;
      items.sort((a, b) => {
        switch (sort.sortBy) {
          case 'name':
            return order * a.name.localeCompare(b.name);
          case 'createdAt':
            return order * a.createdAt.localeCompare(b.createdAt);
          case 'updatedAt':
            return order * a.updatedAt.localeCompare(b.updatedAt);
          case 'tokensCount':
            return order * (a.tokenIds.length - b.tokenIds.length);
          default:
            return 0;
        }
      });
    }

    return paginate(items, pagination);
  }

  async getById(id: string): Promise<Project | null> {
    const projects = this.getProjects();
    const project = projects.find((p) => p.id.toLowerCase() === id.toLowerCase() || p.slug?.toLowerCase() === id.toLowerCase());
    return project || null;
  }

  async search(query: string, limit = 10): Promise<Project[]> {
    const q = query.toLowerCase().trim();
    if (!q) return this.getProjects().slice(0, limit);
    return this.getProjects()
      .filter((p) => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)))
      .slice(0, limit);
  }

  async getFeatured(): Promise<Project[]> {
    return this.getProjects().slice(0, 4);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AIRDROPS PROVIDER
// ─────────────────────────────────────────────────────────────────────────────
class LocalAirdropProvider implements IAirdropProvider {
  private getAirdrops(): AirdropCampaign[] {
    const catalog: AirdropCampaign[] = CATALOG_AIRDROPS.map((a) => ({
      ...a,
      name: a.title,
      banner: a.bannerImage,
      reward: a.totalReward,
      startDate: a.startTime,
      endDate: a.endTime,
      origin: 'ecosystem' as const,
      isEcosystem: true,
      isExternal: false,
      source: 'HorizonX Ecosystem (Simulated)',
    }));

    try {
      const stored = readSessionAirdrops();
      if (stored && Array.isArray(stored)) {
        for (const s of stored) {
          if (!catalog.some((c) => c.id === s.id)) {
            catalog.unshift({
              ...s,
              name: s.title,
              banner: (s as any).bannerImage || (s as any).banner || (s as any).image || '/images/horizonx-dataset-placeholder.svg',
              image: (s as any).image || '/images/horizonx-dataset-placeholder.svg',
              reward: s.totalReward,
              startDate: s.startTime,
              endDate: s.endTime,
            });
          }
        }
      }
    } catch {
      // Storage access safety
    }

    return catalog;
  }

  async list(filters?: AirdropFilters, pagination?: PaginationParams, sort?: AirdropSortParams): Promise<PaginatedResult<AirdropCampaign>> {
    let items = this.getAirdrops();

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      items = items.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.description && a.description.toLowerCase().includes(q)) ||
          a.tokenId.toLowerCase().includes(q)
      );
    }

    if (filters?.network && filters.network.length > 0) {
      items = items.filter((a) => filters.network!.includes(a.network));
    }

    if (filters?.status && filters.status.length > 0) {
      items = items.filter((a) => filters.status!.includes(a.status));
    }

    if (filters?.type && filters.type.length > 0) {
      items = items.filter((a) => filters.type!.includes(a.type));
    }

    if (filters?.tokenId) {
      items = items.filter((a) => a.tokenId.toLowerCase() === filters.tokenId!.toLowerCase());
    }

    if (filters?.projectId) {
      items = items.filter((a) => a.projectId && a.projectId.toLowerCase() === filters.projectId!.toLowerCase());
    }

    if (filters?.ownerAddress) {
      const addr = filters.ownerAddress.toLowerCase();
      items = items.filter((a) => a.ownerAddress.toLowerCase().includes(addr));
    }

    if (sort?.sortBy) {
      const order = sort.sortOrder === 'desc' ? -1 : 1;
      items.sort((a, b) => {
        switch (sort.sortBy) {
          case 'title':
            return order * a.title.localeCompare(b.title);
          case 'createdAt':
            return order * a.createdAt.localeCompare(b.createdAt);
          case 'startTime':
            return order * (a.startTime || '').localeCompare(b.startTime || '');
          case 'endTime':
            return order * (a.endTime || '').localeCompare(b.endTime || '');
          case 'recipientCount':
            return order * ((a.recipientCount || 0) - (b.recipientCount || 0));
          case 'claimedCount':
            return order * ((a.claimedCount || 0) - (b.claimedCount || 0));
          default:
            return 0;
        }
      });
    }

    return paginate(items, pagination);
  }

  async getById(id: string): Promise<AirdropCampaign | null> {
    const item = this.getAirdrops().find((a) => a.id.toLowerCase() === id.toLowerCase());
    return item || null;
  }

  async search(query: string, limit = 10): Promise<AirdropCampaign[]> {
    const q = query.toLowerCase().trim();
    if (!q) return this.getAirdrops().slice(0, limit);
    return this.getAirdrops()
      .filter((a) => a.title.toLowerCase().includes(q) || (a.description && a.description.toLowerCase().includes(q)))
      .slice(0, limit);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LAUNCHPAD PROVIDER
// ─────────────────────────────────────────────────────────────────────────────
class LocalLaunchpadProvider implements ILaunchpadProvider {
  private getPresales(): Presale[] {
    const items: Presale[] = CATALOG_PRESALES.map((p) => ({
      ...p,
      name: p.title,
      banner: p.bannerImage,
      token: p.tokenId,
      fundraisingGoal: p.hardCap,
      startDate: p.startTime,
      endDate: p.endTime,
      launchType: 'presale' as const,
      progress: calculateLaunchProgress(p.totalRaised, p.hardCap),
      origin: 'ecosystem' as const,
      isEcosystem: true,
      isExternal: false,
      source: 'HorizonX Ecosystem (Simulated)',
    }));

    try {
      const sessionPresales = readSessionPresales();
      for (const s of sessionPresales) {
        if (!items.some((item) => item.id === s.id)) {
          const converted = sessionPresaleToPresale(s);
          items.unshift({
            ...converted,
            name: converted.title,
            launchType: 'presale' as const,
            fundraisingGoal: converted.hardCap,
            startDate: converted.startTime,
            endDate: converted.endTime,
            progress: calculateLaunchProgress(converted.totalRaised, converted.hardCap),
          });
        }
      }
    } catch {
      // Storage access safety
    }

    return items;
  }

  private getFairLaunches(): FairLaunch[] {
    const items: FairLaunch[] = CATALOG_FAIR_LAUNCHES.map((f) => ({
      ...f,
      name: f.title,
      banner: f.bannerImage,
      token: f.tokenId,
      fundraisingGoal: f.softCap,
      startDate: f.startTime,
      endDate: f.endTime,
      launchType: 'fair-launch' as const,
      progress: calculateLaunchProgress(f.totalRaised, f.softCap),
      origin: 'ecosystem' as const,
      isEcosystem: true,
      isExternal: false,
      source: 'HorizonX Ecosystem (Simulated)',
    }));

    try {
      const sessionFair = readSessionFairLaunches();
      for (const s of sessionFair) {
        if (!items.some((item) => item.id === s.id)) {
          const converted = sessionFairLaunchToFairLaunch(s);
          items.unshift({
            ...converted,
            name: converted.title,
            launchType: 'fair-launch' as const,
            fundraisingGoal: converted.softCap,
            startDate: converted.startTime,
            endDate: converted.endTime,
            progress: calculateLaunchProgress(converted.totalRaised, converted.softCap),
          });
        }
      }
    } catch {
      // Storage access safety
    }

    return items;
  }

  async listPresales(filters?: LaunchpadFilters, pagination?: PaginationParams, sort?: LaunchpadSortParams): Promise<PaginatedResult<Presale>> {
    let items = this.getPresales();

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          p.tokenId.toLowerCase().includes(q)
      );
    }

    if (filters?.network && filters.network.length > 0) {
      items = items.filter((p) => filters.network!.includes(p.network));
    }

    if (filters?.status && filters.status.length > 0) {
      items = items.filter((p) => filters.status!.includes(p.status as any));
    }

    if (filters?.category) {
      const cats = Array.isArray(filters.category) ? filters.category : [filters.category];
      if (cats.length > 0) {
        items = items.filter((p) => p.category && cats.includes(p.category));
      }
    }

    if (filters?.tokenId) {
      items = items.filter((p) => p.tokenId.toLowerCase() === filters.tokenId!.toLowerCase());
    }

    if (filters?.projectId) {
      items = items.filter((p) => p.projectId && p.projectId.toLowerCase() === filters.projectId!.toLowerCase());
    }

    if (filters?.ownerAddress) {
      const addr = filters.ownerAddress.toLowerCase();
      items = items.filter((p) => p.ownerAddress.toLowerCase().includes(addr));
    }

    if (sort?.sortBy) {
      const order = sort.sortOrder === 'desc' ? -1 : 1;
      items.sort((a, b) => {
        switch (sort.sortBy) {
          case 'title':
          case 'name':
            return order * a.title.localeCompare(b.title);
          case 'createdAt':
            return order * a.createdAt.localeCompare(b.createdAt);
          case 'startTime':
            return order * (a.startTime || '').localeCompare(b.startTime || '');
          case 'endTime':
            return order * (a.endTime || '').localeCompare(b.endTime || '');
          case 'progress':
            return order * ((a.progress || 0) - (b.progress || 0));
          default:
            return 0;
        }
      });
    }

    return paginate(items, pagination);
  }

  async getPresaleById(id: string): Promise<Presale | null> {
    const item = this.getPresales().find((p) => p.id.toLowerCase() === id.toLowerCase());
    return item || null;
  }

  async listFairLaunches(filters?: LaunchpadFilters, pagination?: PaginationParams, sort?: LaunchpadSortParams): Promise<PaginatedResult<FairLaunch>> {
    let items = this.getFairLaunches();

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      items = items.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          (f.description && f.description.toLowerCase().includes(q)) ||
          f.tokenId.toLowerCase().includes(q)
      );
    }

    if (filters?.network && filters.network.length > 0) {
      items = items.filter((f) => filters.network!.includes(f.network));
    }

    if (filters?.status && filters.status.length > 0) {
      items = items.filter((f) => filters.status!.includes(f.status as any));
    }

    if (filters?.category && filters.category.length > 0) {
      items = items.filter((f) => f.category && filters.category!.includes(f.category));
    }

    if (filters?.tokenId) {
      items = items.filter((f) => f.tokenId.toLowerCase() === filters.tokenId!.toLowerCase());
    }

    if (filters?.projectId) {
      items = items.filter((f) => f.projectId && f.projectId.toLowerCase() === filters.projectId!.toLowerCase());
    }

    if (filters?.ownerAddress) {
      const addr = filters.ownerAddress.toLowerCase();
      items = items.filter((f) => f.ownerAddress.toLowerCase().includes(addr));
    }

    if (sort?.sortBy) {
      const order = sort.sortOrder === 'desc' ? -1 : 1;
      items.sort((a, b) => {
        switch (sort.sortBy) {
          case 'title':
          case 'name':
            return order * a.title.localeCompare(b.title);
          case 'createdAt':
            return order * a.createdAt.localeCompare(b.createdAt);
          case 'startTime':
            return order * (a.startTime || '').localeCompare(b.startTime || '');
          case 'endTime':
            return order * (a.endTime || '').localeCompare(b.endTime || '');
          case 'progress':
            return order * ((a.progress || 0) - (b.progress || 0));
          default:
            return 0;
        }
      });
    }

    return paginate(items, pagination);
  }

  async getFairLaunchById(id: string): Promise<FairLaunch | null> {
    const item = this.getFairLaunches().find((f) => f.id.toLowerCase() === id.toLowerCase());
    return item || null;
  }

  async listAll(filters?: LaunchpadFilters, pagination?: PaginationParams, sort?: LaunchpadSortParams): Promise<PaginatedResult<LaunchpadItem>> {
    let combined: LaunchpadItem[] = [];
    if (filters?.launchType === 'presale') {
      combined = this.getPresales();
    } else if (filters?.launchType === 'fair-launch') {
      combined = this.getFairLaunches();
    } else {
      combined = [...this.getPresales(), ...this.getFairLaunches()];
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      combined = combined.filter((i) => i.title.toLowerCase().includes(q) || i.tokenId.toLowerCase().includes(q));
    }

    if (filters?.network && filters.network.length > 0) {
      combined = combined.filter((i) => filters.network!.includes(i.network));
    }

    if (filters?.status && filters.status.length > 0) {
      combined = combined.filter((i) => filters.status!.includes(i.status as any));
    }

    if (sort?.sortBy) {
      const order = sort.sortOrder === 'desc' ? -1 : 1;
      combined.sort((a, b) => {
        switch (sort.sortBy) {
          case 'title':
            return order * a.title.localeCompare(b.title);
          case 'createdAt':
            return order * a.createdAt.localeCompare(b.createdAt);
          case 'progress':
            return order * ((a.progress || 0) - (b.progress || 0));
          default:
            return 0;
        }
      });
    }

    return paginate(combined, pagination);
  }

  async search(query: string, limit = 10): Promise<LaunchpadItem[]> {
    const q = query.toLowerCase().trim();
    const all = [...this.getPresales(), ...this.getFairLaunches()];
    if (!q) return all.slice(0, limit);
    return all.filter((i) => i.title.toLowerCase().includes(q) || i.tokenId.toLowerCase().includes(q)).slice(0, limit);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// STAKING PROVIDER
// ─────────────────────────────────────────────────────────────────────────────
class LocalStakingProvider implements IStakingProvider {
  private getPools(): StakingPool[] {
    return CACHED_STAKING_POOLS;
  }

  async listPools(filters?: StakingFilters, pagination?: PaginationParams, sort?: StakingSortParams): Promise<PaginatedResult<StakingPool>> {
    let items = this.getPools();

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tokenId.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (filters?.network && filters.network.length > 0) {
      items = items.filter((p) => filters.network!.includes(p.network));
    }

    if (filters?.status && filters.status.length > 0) {
      items = items.filter((p) => filters.status!.includes(p.status));
    }

    if (filters?.tokenId) {
      items = items.filter((p) => p.tokenId.toLowerCase() === filters.tokenId!.toLowerCase());
    }

    if (filters?.projectId) {
      items = items.filter((p) => p.projectId && p.projectId.toLowerCase() === filters.projectId!.toLowerCase());
    }

    if (filters?.minApy !== undefined) {
      items = items.filter((p) => (p.apyValue || 0) >= filters.minApy!);
    }

    if (sort?.sortBy) {
      const order = sort.sortOrder === 'desc' ? -1 : 1;
      items.sort((a, b) => {
        switch (sort.sortBy) {
          case 'name':
            return order * a.name.localeCompare(b.name);
          case 'apy':
            return order * ((a.apyValue || 0) - (b.apyValue || 0));
          case 'tvl':
            return order * ((a.tvlUsd || 0) - (b.tvlUsd || 0));
          case 'stakerCount':
            return order * ((a.stakerCount || 0) - (b.stakerCount || 0));
          case 'createdAt':
            return order * a.createdAt.localeCompare(b.createdAt);
          default:
            return 0;
        }
      });
    }

    return paginate(items, pagination);
  }

  async getPoolById(id: string): Promise<StakingPool | null> {
    return STAKING_POOL_BY_ID_MAP.get(id.toLowerCase()) || null;
  }

  async search(query: string, limit = 10): Promise<StakingPool[]> {
    const q = query.toLowerCase().trim();
    if (!q) return this.getPools().slice(0, limit);
    return this.getPools().filter((p) => p.name.toLowerCase().includes(q) || p.tokenId.toLowerCase().includes(q)).slice(0, limit);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MARKET & EXCHANGE PROVIDER
// ─────────────────────────────────────────────────────────────────────────────
class LocalMarketProvider implements IMarketProvider, IExchangeProvider {
  private getPairs(): MarketPair[] {
    return CACHED_MARKET_PAIRS;
  }

  async getOverview(): Promise<MarketOverview> {
    const tokens = CATALOG_TOKENS;
    const totalVolume = tokens.reduce((sum, t) => sum + (t.market.volume24h || 0), 0);
    const totalLiquidity = tokens.reduce((sum, t) => sum + (t.market.liquidity || 0), 0);

    let topGainer = tokens[0];
    for (const t of tokens) {
      if ((t.market.priceChange24h || 0) > (topGainer?.market.priceChange24h || 0)) {
        topGainer = t;
      }
    }

    return {
      volume24h: totalVolume,
      totalLiquidity,
      topGainer: {
        symbol: topGainer?.symbol || 'PMIN',
        changePercent: topGainer?.market.priceChange24h || 14.2,
        name: topGainer?.name || 'HorizonX Governance',
        tokenId: topGainer?.id,
      },
      activeMarketsCount: tokens.length,
      lastUpdated: new Date().toISOString(),
    };
  }

  async listPairs(filters?: MarketFilters, pagination?: PaginationParams, sort?: MarketSortParams): Promise<PaginatedResult<MarketPair>> {
    let items = this.getPairs();

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      items = items.filter((p) => p.symbol.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.baseTokenId.toLowerCase().includes(q));
    }

    if (filters?.category) {
      const cats = Array.isArray(filters.category) ? filters.category : [filters.category];
      if (cats.length > 0) {
        items = items.filter((p) => p.category && cats.includes(p.category));
      }
    }

    if (filters?.network && filters.network.length > 0) {
      items = items.filter((p) => p.network && filters.network!.includes(p.network));
    }

    if (sort?.sortBy) {
      const order = sort.sortOrder === 'desc' ? -1 : 1;
      items.sort((a, b) => {
        switch (sort.sortBy) {
          case 'symbol':
            return order * a.symbol.localeCompare(b.symbol);
          case 'price':
            return order * (a.price - b.price);
          case 'priceChange24h':
            return order * (a.priceChange24h - b.priceChange24h);
          case 'volume24h':
            return order * (a.volume24h - b.volume24h);
          case 'liquidity':
            return order * (a.liquidity - b.liquidity);
          default:
            return 0;
        }
      });
    }

    return paginate(items, pagination);
  }

  async listMarkets(filters?: MarketFilters, pagination?: PaginationParams, sort?: MarketSortParams): Promise<PaginatedResult<MarketPair>> {
    return this.listPairs(filters, pagination, sort);
  }

  async getPairBySymbol(symbol: string): Promise<MarketPair | null> {
    const s = symbol.toLowerCase().replace('/', '').trim();
    return PAIR_LOOKUP_MAP.get(s) || null;
  }

  async getMarketByTokenId(tokenId: string): Promise<MarketPair | null> {
    return PAIR_LOOKUP_MAP.get(tokenId.toLowerCase()) || null;
  }

  async getHistoricalData(tokenId: string, range = '24h'): Promise<MarketHistoryPoint[]> {
    const token = CATALOG_TOKENS.find((t) => t.id === tokenId);
    const basePrice = token?.market.price || 1.0;
    const count = range === '24h' ? 24 : range === '7d' ? 28 : range === '30d' ? 30 : 60;
    const now = Date.now();
    const interval = range === '24h' ? 3600 * 1000 : 24 * 3600 * 1000;

    const points: MarketHistoryPoint[] = [];
    let cur = basePrice * 0.9;
    for (let i = count - 1; i >= 0; i--) {
      const timestamp = now - i * interval;
      const noise = (Math.sin(i * 0.5) * 0.05 + 0.01);
      cur = Math.max(0.001, cur * (1 + noise));
      points.push({ timestamp, price: Number(cur.toFixed(4)), volume: token?.market.volume24h ? token.market.volume24h / count : 10000 });
    }
    // Anchor last point
    points[points.length - 1].price = basePrice;
    return points;
  }

  async getOrderBook(symbol: string): Promise<ExchangeOrderBook> {
    const pair = await this.getPairBySymbol(symbol);
    const price = pair?.price || 1.48;

    const bids = [
      { price: Number((price * 0.995).toFixed(4)), amount: 15400, total: Number((price * 0.995 * 15400).toFixed(2)) },
      { price: Number((price * 0.985).toFixed(4)), amount: 28900, total: Number((price * 0.985 * 28900).toFixed(2)) },
      { price: Number((price * 0.970).toFixed(4)), amount: 45000, total: Number((price * 0.970 * 45000).toFixed(2)) },
      { price: Number((price * 0.950).toFixed(4)), amount: 120000, total: Number((price * 0.950 * 120000).toFixed(2)) },
    ];

    const asks = [
      { price: Number((price * 1.005).toFixed(4)), amount: 12200, total: Number((price * 1.005 * 12200).toFixed(2)) },
      { price: Number((price * 1.015).toFixed(4)), amount: 24500, total: Number((price * 1.015 * 24500).toFixed(2)) },
      { price: Number((price * 1.030).toFixed(4)), amount: 52000, total: Number((price * 1.030 * 52000).toFixed(2)) },
      { price: Number((price * 1.050).toFixed(4)), amount: 98000, total: Number((price * 1.050 * 98000).toFixed(2)) },
    ];

    return {
      symbol: pair?.symbol || 'PMIN/USD',
      bids,
      asks,
      lastPrice: price,
      spread: Number((price * 0.01).toFixed(4)),
    };
  }

  async getRecentTrades(symbol: string, limit = 10): Promise<ExchangeTrade[]> {
    const pair = await this.getPairBySymbol(symbol);
    const price = pair?.price || 1.48;
    const trades: ExchangeTrade[] = [];
    const now = Date.now();

    for (let i = 0; i < limit; i++) {
      trades.push({
        id: `trade-${now}-${i}`,
        price: Number((price * (1 + (Math.sin(i) * 0.01))).toFixed(4)),
        amount: Math.round(500 + Math.abs(Math.sin(i * 1.5)) * 5000),
        side: i % 2 === 0 ? 'buy' : 'sell',
        time: new Date(now - i * 45000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });
    }

    return trades;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PARTNERS PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

class LocalPartnerProvider implements IPartnerProvider {
  private getPartners(): PartnerItem[] {
    return CACHED_PARTNERS;
  }

  async list(filters?: PartnerFilters, pagination?: PaginationParams, sort?: PartnerSortParams): Promise<PaginatedResult<PartnerItem>> {
    let items = this.getPartners();

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.tier && p.tier.toLowerCase().includes(q))
      );
    }

    if (filters?.category && filters.category.length > 0) {
      items = items.filter((p) => filters.category!.includes(p.category));
    }

    if (filters?.tier && filters.tier.length > 0) {
      items = items.filter((p) => p.tier && filters.tier!.includes(p.tier));
    }

    if (sort?.sortBy === 'name') {
      const order = sort.sortOrder === 'desc' ? -1 : 1;
      items.sort((a, b) => order * a.name.localeCompare(b.name));
    } else if (sort?.sortBy === 'tier') {
      const order = sort.sortOrder === 'desc' ? -1 : 1;
      items.sort((a, b) => order * (a.tier || '').localeCompare(b.tier || ''));
    }

    return paginate(items, pagination);
  }

  async getById(id: string): Promise<PartnerItem | null> {
    return PARTNER_BY_ID_MAP.get(id.toLowerCase()) || null;
  }

  async getProgramMetrics(): Promise<PartnerProgramMetrics> {
    return {
      commissionTier: 'Gold Partner',
      commissionRevShare: '35% RevShare',
      totalReferredVolume: '$1,420,000',
      referredVolumeChange: '+8.2%',
      accruedRewards: '$14,850',
      rewardsStatus: 'Claimable in USDT/ETH',
    };
  }

  async getBenefits(): Promise<PartnerBenefit[]> {
    return [
      {
        title: 'Launchpad Priority',
        description: 'Fast-tracked verification and audit review for all partner-referred initial presales.',
      },
      {
        title: 'Custom Commission Rates',
        description: 'Earn between 20% and 40% of all protocol deployment and swap fees generated by your community.',
      },
      {
        title: 'Dedicated Technical Support',
        description: 'Direct developer channels with core HorizonX engineers for smart contract customization.',
      },
    ];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// NEWS PROVIDER
// ─────────────────────────────────────────────────────────────────────────────
class LocalNewsProvider implements INewsProvider {
  private articles: NewsArticle[] = [
    {
      id: 'news-hybrid-launch',
      title: 'HorizonX Protocol Architecture Overview',
      slug: 'horizonx-protocol-architecture-overview',
      summary: 'Introducing the Web2 + Web3 unified frontend data layer for modular token launches and community campaigns.',
      category: 'Ecosystem',
      author: 'HorizonX Foundation',
      publishedAt: '2026-11-01T12:00:00Z',
      tags: ['Architecture', 'Web2', 'Web3', 'Launches'],
    },
    {
      id: 'news-sepolia-testnet',
      title: 'Ethereum Sepolia Testnet Deployment Complete',
      slug: 'sepolia-testnet-deployment-complete',
      summary: 'All core contracts and simulation registries are verified and active on the Sepolia execution environment.',
      category: 'Protocol',
      author: 'Core Engineering',
      publishedAt: '2026-10-25T10:00:00Z',
      tags: ['Sepolia', 'Smart Contracts', 'Milestone'],
    },
    {
      id: 'news-partner-portal',
      title: 'Partner Referral Program Now Open',
      slug: 'partner-referral-program-now-open',
      summary: 'Incubate projects, onboard creators, and earn protocol revenue share through the HorizonX Partner Portal.',
      category: 'Community',
      author: 'Ecosystem Growth',
      publishedAt: '2026-10-18T16:00:00Z',
      tags: ['Partners', 'Referrals', 'Growth'],
    },
  ];

  async list(filters?: NewsFilters, pagination?: PaginationParams, sort?: NewsSortParams): Promise<PaginatedResult<NewsArticle>> {
    let items = [...this.articles];

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      items = items.filter((a) => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q));
    }

    if (filters?.category && filters.category.length > 0) {
      items = items.filter((a) => filters.category!.includes(a.category));
    }

    return paginate(items, pagination);
  }

  async getById(id: string): Promise<NewsArticle | null> {
    const item = this.articles.find((a) => a.id.toLowerCase() === id.toLowerCase() || a.slug.toLowerCase() === id.toLowerCase());
    return item || null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CENTRAL LOCAL DATA PROVIDER
// ─────────────────────────────────────────────────────────────────────────────
export class LocalDataProvider implements IDataProvider {
  readonly id = 'local';
  readonly name = 'Local Catalog Provider';

  public tokens = new LocalTokenProvider();
  public projects = new LocalProjectProvider();
  public airdrops = new LocalAirdropProvider();
  public launchpad = new LocalLaunchpadProvider();
  public staking = new LocalStakingProvider();
  public market = new LocalMarketProvider();
  public exchange = new LocalMarketProvider();
  public partners = new LocalPartnerProvider();
  public news = new LocalNewsProvider();
}

export const localDataProvider = new LocalDataProvider();
