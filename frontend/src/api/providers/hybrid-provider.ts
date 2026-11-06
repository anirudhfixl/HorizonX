// Hybrid Data Provider for HorizonX
// Integrates live CoinMarketCap market data with local HorizonX ecosystem datasets.
// Keeps projects, airdrops, launchpad, staking, partners and news on local provider.
// Normalizes external responses into existing TypeScript models.
// Provides graceful fallback to local data if CoinMarketCap API key is missing or unconfigured.

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
import { localDataProvider } from './local-provider';
import { cmcClient } from '../client/cmc-client';
import { defillamaClient, type DefiLlamaAirdropEntry } from '../client/defillama-client';
import { cryptoRankClient } from '../client/cryptorank-client';
import { coinGeckoClient } from '../client/coingecko-client';
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

class HybridTokenProvider implements ITokenProvider {
  async list(filters?: TokenFilters, pagination?: PaginationParams, sort?: TokenSortParams): Promise<PaginatedResult<Token>> {
    try {
      // Attempt live CMC listings
      const cmcTokens = await cmcClient.getListings({
        limit: 100,
        sort: sort?.sortBy === 'volume24h' ? 'volume_24h' : sort?.sortBy === 'priceChange24h' ? 'percent_change_24h' : 'market_cap',
        sortDir: sort?.sortOrder || 'desc',
      });

      if (!cmcTokens || cmcTokens.length === 0) {
        return localDataProvider.tokens.list(filters, pagination, sort);
      }

      // Also get local ecosystem tokens so local projects remain accessible
      const localResult = await localDataProvider.tokens.list();
      const localTokens = localResult.items;

      // Tag local ecosystem tokens clearly so they are distinguishable from external market tokens
      const taggedLocalTokens: Token[] = localTokens.map((t) => ({
        ...t,
        isEcosystem: true,
        isExternal: false,
        origin: 'ecosystem',
        market: {
          ...t.market,
          source: 'HorizonX Ecosystem (Simulated)',
          isLive: false,
        },
      } as Token));

      // Tag external CoinMarketCap tokens clearly
      const taggedCmcTokens: Token[] = cmcTokens.map((t) => ({
        ...t,
        isEcosystem: false,
        isExternal: true,
        origin: 'external',
        market: {
          ...t.market,
          source: 'CoinMarketCap',
          isLive: true,
        },
      } as Token));

      // Merge: unique by symbol / id without replacing or dropping local tokens
      const seenSymbols = new Set<string>();
      const seenIds = new Set<string>();
      const combined: Token[] = [];

      // Add live CoinMarketCap external tokens
      for (const ct of taggedCmcTokens) {
        const sym = ct.symbol.toUpperCase();
        if (!seenSymbols.has(sym) && !seenIds.has(ct.id)) {
          seenSymbols.add(sym);
          seenIds.add(ct.id);
          combined.push(ct);
        }
      }

      // Add HorizonX ecosystem tokens (preserving all existing records)
      for (const lt of taggedLocalTokens) {
        const sym = lt.symbol.toUpperCase();
        if (!seenSymbols.has(sym) && !seenIds.has(lt.id)) {
          seenSymbols.add(sym);
          seenIds.add(lt.id);
          combined.push(lt);
        } else if (!seenIds.has(lt.id)) {
          // If a symbol collides, preserve local ecosystem token with unique id
          seenIds.add(lt.id);
          combined.push(lt);
        }
      }

      // Default sort by market cap descending if no sort specified
      if (!sort?.sortBy) {
        combined.sort((a, b) => ((b.market?.marketCap ?? b.marketCap ?? 0) - (a.market?.marketCap ?? a.marketCap ?? 0)));
      }

      // Apply filtering
      let filtered = combined;
      if (filters?.search) {
        const q = filters.search.toLowerCase().trim();
        filtered = filtered.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.symbol.toLowerCase().includes(q) ||
            t.id.toLowerCase().includes(q)
        );
      }

      if (filters?.category && filters.category.length > 0) {
        const cats = filters.category.map((c) => c.toLowerCase());
        filtered = filtered.filter((t) => t.category && cats.includes(t.category.toLowerCase()));
      }

      if (filters?.minPrice !== undefined) {
        filtered = filtered.filter((t) => (t.price ?? 0) >= filters.minPrice!);
      }
      if (filters?.maxPrice !== undefined) {
        filtered = filtered.filter((t) => (t.price ?? 0) <= filters.maxPrice!);
      }
      if (filters?.minMarketCap !== undefined) {
        filtered = filtered.filter((t) => (t.marketCap ?? 0) >= filters.minMarketCap!);
      }

      // Apply sorting
      if (sort?.sortBy) {
        const field = sort.sortBy;
        const dir = sort.sortOrder === 'asc' ? 1 : -1;
        filtered.sort((a, b) => {
          let aVal: any = (a as any)[field];
          let bVal: any = (b as any)[field];
          if (aVal === undefined && a.market) aVal = (a.market as any)[field];
          if (bVal === undefined && b.market) bVal = (b.market as any)[field];

          if (typeof aVal === 'string') {
            return dir * aVal.localeCompare(String(bVal || ''));
          }
          return dir * ((Number(aVal) || 0) - (Number(bVal) || 0));
        });
      }

      return paginate(filtered, pagination);
    } catch {
      // Graceful fallback to local catalog
      return localDataProvider.tokens.list(filters, pagination, sort);
    }
  }

  async getById(id: string): Promise<Token | null> {
    try {
      // Check local catalog first if it matches an ecosystem token
      const localToken = await localDataProvider.tokens.getById(id);
      if (localToken) return localToken;

      // Query CoinMarketCap proxy
      const cmcToken = await cmcClient.getTokenDetail(id);
      if (cmcToken) return cmcToken;

      return null;
    } catch {
      return localDataProvider.tokens.getById(id);
    }
  }

  async search(query: string, limit = 10): Promise<Token[]> {
    const list = await this.list({ search: query }, { page: 1, pageSize: limit });
    return list.items;
  }

  async getFeatured(): Promise<Token[]> {
    try {
      const localFeatured = await localDataProvider.tokens.getFeatured();
      const cmcListings = await cmcClient.getListings({ limit: 5 });
      const seen = new Set<string>(localFeatured.map((t) => t.id));
      const result = [...localFeatured];
      for (const ct of cmcListings) {
        if (!seen.has(ct.id)) {
          seen.add(ct.id);
          result.push(ct);
        }
      }
      return result.slice(0, 8);
    } catch {
      return localDataProvider.tokens.getFeatured();
    }
  }
}

class HybridMarketProvider implements IMarketProvider {
  async getOverview(): Promise<MarketOverview> {
    try {
      return await cmcClient.getOverview();
    } catch {
      return localDataProvider.market.getOverview();
    }
  }

  async listPairs(filters?: MarketFilters, pagination?: PaginationParams, sort?: MarketSortParams): Promise<PaginatedResult<MarketPair>> {
    try {
      const listings = await cmcClient.getListings({ limit: 40 });
      if (!listings || listings.length === 0) {
        return localDataProvider.market.listPairs(filters, pagination, sort);
      }

      const pairs: MarketPair[] = listings.map((token) => ({
        id: `${token.symbol}-USD`,
        symbol: `${token.symbol}/USD`,
        name: `${token.name} / US Dollar`,
        baseTokenId: token.id,
        quoteSymbol: 'USD',
        price: token.price ?? 0,
        priceChange24h: token.priceChange24h ?? 0,
        volume24h: token.volume24h ?? 0,
        liquidity: (token.marketCap ?? 0) * 0.05,
        high24h: (token.price ?? 0) * 1.05,
        low24h: (token.price ?? 0) * 0.95,
        category: token.category,
        network: token.network,
      }));

      // Append local pairs
      const localPairs = await localDataProvider.market.listPairs();
      for (const lp of localPairs.items) {
        if (!pairs.some((p) => p.symbol === lp.symbol)) {
          pairs.push(lp);
        }
      }

      let filtered = pairs;
      if (filters?.search) {
        const q = filters.search.toLowerCase().trim();
        filtered = filtered.filter((p) => p.symbol.toLowerCase().includes(q) || p.name.toLowerCase().includes(q));
      }
      if (filters?.quoteSymbol) {
        filtered = filtered.filter((p) => p.quoteSymbol.toUpperCase() === filters.quoteSymbol?.toUpperCase());
      }
      if (filters?.minVolume !== undefined) {
        filtered = filtered.filter((p) => p.volume24h >= filters.minVolume!);
      }
      if (filters?.minLiquidity !== undefined) {
        filtered = filtered.filter((p) => p.liquidity >= filters.minLiquidity!);
      }

      if (sort?.sortBy) {
        const field = sort.sortBy;
        const dir = sort.sortOrder === 'asc' ? 1 : -1;
        filtered.sort((a, b) => {
          const aVal = (a as any)[field] ?? 0;
          const bVal = (b as any)[field] ?? 0;
          return dir * (aVal - bVal);
        });
      }

      return paginate(filtered, pagination);
    } catch {
      return localDataProvider.market.listPairs(filters, pagination, sort);
    }
  }

  async getPairBySymbol(symbol: string): Promise<MarketPair | null> {
    try {
      const pairs = await this.listPairs();
      const normalized = symbol.toUpperCase().replace('-', '/');
      const found = pairs.items.find((p) => p.symbol.toUpperCase() === normalized || p.id.toUpperCase() === symbol.toUpperCase());
      if (found) return found;
      return localDataProvider.market.getPairBySymbol(symbol);
    } catch {
      return localDataProvider.market.getPairBySymbol(symbol);
    }
  }

  async getHistoricalData(tokenId: string, range?: '24h' | '7d' | '30d' | '90d'): Promise<MarketHistoryPoint[]> {
    return localDataProvider.market.getHistoricalData(tokenId, range);
  }
}

class HybridExchangeProvider implements IExchangeProvider {
  async getOverview(): Promise<MarketOverview> {
    try {
      return await cmcClient.getOverview();
    } catch {
      return localDataProvider.exchange.getOverview();
    }
  }

  async listMarkets(filters?: MarketFilters, pagination?: PaginationParams, sort?: MarketSortParams): Promise<PaginatedResult<MarketPair>> {
    const marketProvider = new HybridMarketProvider();
    return marketProvider.listPairs(filters, pagination, sort);
  }

  async getMarketByTokenId(tokenId: string): Promise<MarketPair | null> {
    const marketProvider = new HybridMarketProvider();
    const pairs = await marketProvider.listPairs();
    const found = pairs.items.find((p) => p.baseTokenId === tokenId || p.id.toLowerCase().includes(tokenId.toLowerCase()));
    if (found) return found;
    return localDataProvider.exchange.getMarketByTokenId(tokenId);
  }

  async getOrderBook(symbol: string): Promise<ExchangeOrderBook> {
    try {
      const marketProvider = new HybridMarketProvider();
      const pair = await marketProvider.getPairBySymbol(symbol);
      const basePrice = pair?.price || 100;

      const bids = Array.from({ length: 10 }, (_, i) => ({
        price: Number((basePrice * (1 - (i + 1) * 0.003)).toFixed(4)),
        amount: Number((Math.random() * 5 + 0.5).toFixed(2)),
        total: 0,
      }));
      let runningBidTotal = 0;
      bids.forEach((b) => {
        runningBidTotal += b.amount * b.price;
        b.total = Number(runningBidTotal.toFixed(2));
      });

      const asks = Array.from({ length: 10 }, (_, i) => ({
        price: Number((basePrice * (1 + (i + 1) * 0.003)).toFixed(4)),
        amount: Number((Math.random() * 5 + 0.5).toFixed(2)),
        total: 0,
      }));
      let runningAskTotal = 0;
      asks.forEach((a) => {
        runningAskTotal += a.amount * a.price;
        a.total = Number(runningAskTotal.toFixed(2));
      });

      return {
        symbol: pair?.symbol || 'BTC/USD',
        bids,
        asks,
        lastPrice: basePrice,
        spread: Number((asks[0].price - bids[0].price).toFixed(4)),
      };
    } catch {
      return localDataProvider.exchange.getOrderBook(symbol);
    }
  }

  async getRecentTrades(symbol: string, limit = 20): Promise<ExchangeTrade[]> {
    return localDataProvider.exchange.getRecentTrades(symbol, limit);
  }
}

function determinePoolCategory(projectSlug: string, symbol: string, exposure?: string): string {
  const p = (projectSlug || '').toLowerCase();
  const s = (symbol || '').toLowerCase();
  if (
    p.includes('lido') ||
    p.includes('rocket') ||
    p.includes('ether.fi') ||
    p.includes('jito') ||
    p.includes('marinade') ||
    p.includes('stake') ||
    p.includes('frax-ether') ||
    p.includes('binance-staked') ||
    p.includes('mantle-staked') ||
    p.includes('swell')
  ) {
    return 'Liquid Staking';
  }
  if (
    p.includes('aave') ||
    p.includes('compound') ||
    p.includes('spark') ||
    p.includes('sky') ||
    p.includes('morpho') ||
    p.includes('kamino-lend') ||
    p.includes('lend') ||
    p.includes('venus') ||
    p.includes('benqi')
  ) {
    return 'Lending Market';
  }
  if (
    exposure === 'multi' ||
    s.includes('-') ||
    s.includes('/') ||
    p.includes('uniswap') ||
    p.includes('curve') ||
    p.includes('raydium') ||
    p.includes('pancakeswap') ||
    p.includes('balancer') ||
    p.includes('aerodrome')
  ) {
    return 'Liquidity Pool';
  }
  return 'Yield Vault';
}

function formatTvlString(num?: number): string {
  if (!num || isNaN(num)) return '$0';
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}

class HybridProjectProvider implements IProjectProvider {
  async list(filters?: ProjectFilters, pagination?: PaginationParams, sort?: ProjectSortParams): Promise<PaginatedResult<Project>> {
    try {
      const [llamaProtocols, localRes] = await Promise.all([
        defillamaClient.getProtocols(80).catch(() => []),
        localDataProvider.projects.list().catch(() => ({
          items: [] as Project[],
          pagination: { total: 0, page: 1, pageSize: 10, totalPages: 1, hasNextPage: false, hasPrevPage: false },
        })),
      ]);

      const localProjects: Project[] = (localRes.items || []).map((p) => ({
        ...p,
        isEcosystem: true,
        isExternal: false,
        origin: 'ecosystem' as const,
        source: 'HorizonX Ecosystem (Simulated)',
      }));

      const externalProjects: Project[] = (llamaProtocols || []).map((p) => {
        const slug = (p as any).slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const id = `llama-${slug}`;
        const symbol = p.symbol ? p.symbol.toLowerCase() : '';
        return {
          id,
          name: p.name,
          slug,
          description: p.description || `${p.name} is a leading decentralized protocol in ${p.category || 'DeFi'} with genuine verified on-chain metrics tracked via DefiLlama.`,
          logo: p.logo,
          logoUrl: p.logo,
          banner: undefined,
          category: p.category || 'DeFi',
          blockchain: p.chain || (p.chains && p.chains[0]) || 'Ethereum',
          ecosystem: p.chain || (p.chains && p.chains[0]) || 'Ethereum',
          chains: p.chains && p.chains.length > 0 ? p.chains : (p.chain ? [p.chain] : ['Ethereum']),
          website: p.url,
          websiteUrl: p.url,
          documentation: p.audit_links && p.audit_links.length > 0 ? p.audit_links[0] : undefined,
          socialLinks: p.twitter ? { twitter: `https://twitter.com/${p.twitter.replace(/^@/, '')}` } : undefined,
          ownerAddress: p.address || '0x0000000000000000000000000000000000000000',
          status: 'active' as const,
          verificationStatus: 'audit_available' as const,
          tags: [p.category, ...(p.chains || [])].filter(Boolean) as string[],
          tokenIds: symbol ? [symbol] : [],
          tvl: p.tvl,
          mcap: p.mcap || undefined,
          change1d: p.change_1d || undefined,
          change7d: p.change_7d || undefined,
          isEcosystem: false,
          isExternal: true,
          origin: 'external' as const,
          source: 'DefiLlama Protocols',
          defillamaId: String(p.id),
          geckoId: p.gecko_id || undefined,
          cmcId: p.cmcId ? String(p.cmcId) : undefined,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: new Date().toISOString(),
        };
      });

      let combined: Project[] = [];
      if (filters?.origin === 'ecosystem') {
        combined = localProjects;
      } else if (filters?.origin === 'external') {
        combined = externalProjects;
      } else {
        combined = [...localProjects, ...externalProjects];
      }

      // Filtering
      let filtered = combined;
      if (filters?.search) {
        const q = filters.search.toLowerCase().trim();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.id.toLowerCase().includes(q) ||
            (p.slug && p.slug.toLowerCase().includes(q)) ||
            (p.category && p.category.toLowerCase().includes(q)) ||
            (p.description && p.description.toLowerCase().includes(q)) ||
            (p.chains && p.chains.some((c) => c.toLowerCase().includes(q)))
        );
      }

      if (filters?.category && filters.category.length > 0) {
        const cats = filters.category.map((c) => c.toLowerCase());
        filtered = filtered.filter((p) => p.category && cats.includes(p.category.toLowerCase()));
      }

      if (filters?.ecosystem && filters.ecosystem.length > 0) {
        const ecos = filters.ecosystem.map((e) => e.toLowerCase());
        filtered = filtered.filter(
          (p) =>
            (p.ecosystem && ecos.includes(p.ecosystem.toLowerCase())) ||
            (p.blockchain && ecos.includes(p.blockchain.toLowerCase())) ||
            (p.chains && p.chains.some((c) => ecos.includes(c.toLowerCase())))
        );
      }

      if (filters?.minTvl !== undefined) {
        filtered = filtered.filter((p) => (p.tvl ?? 0) >= filters.minTvl!);
      }

      if (filters?.hasToken !== undefined) {
        filtered = filtered.filter((p) => (filters.hasToken ? p.tokenIds.length > 0 : p.tokenIds.length === 0));
      }

      // Sorting
      if (sort?.sortBy) {
        const dir = sort.sortOrder === 'asc' ? 1 : -1;
        filtered.sort((a, b) => {
          switch (sort.sortBy) {
            case 'tvl':
              return dir * ((a.tvl ?? 0) - (b.tvl ?? 0));
            case 'mcap':
              return dir * ((a.mcap ?? 0) - (b.mcap ?? 0));
            case 'name':
              return dir * a.name.localeCompare(b.name);
            case 'createdAt':
              return dir * (a.createdAt || '').localeCompare(b.createdAt || '');
            case 'tokensCount':
              return dir * (a.tokenIds.length - b.tokenIds.length);
            default:
              return 0;
          }
        });
      } else {
        // Default sort: ecosystem first, then TVL descending
        filtered.sort((a, b) => {
          if (a.isEcosystem && !b.isEcosystem) return -1;
          if (!a.isEcosystem && b.isEcosystem) return 1;
          return (b.tvl ?? 0) - (a.tvl ?? 0);
        });
      }

      return paginate(filtered, pagination);
    } catch {
      return localDataProvider.projects.list(filters, pagination, sort);
    }
  }

  async getById(id: string): Promise<Project | null> {
    try {
      const cleanId = id.toLowerCase();
      // Check local catalog first
      const localP = await localDataProvider.projects.getById(cleanId);
      if (localP) {
        return {
          ...localP,
          isEcosystem: true,
          isExternal: false,
          origin: 'ecosystem',
          source: 'HorizonX Ecosystem (Simulated)',
        };
      }

      // If id is external or starts with llama-
      const slug = cleanId.replace(/^llama-/, '');
      const raw = await defillamaClient.getProtocolDetail(slug);
      if (raw) {
        let resolvedTvl: number | undefined = undefined;
        const rawTvlAny = raw.tvl as any;
        if (typeof raw.tvl === 'number') {
          resolvedTvl = raw.tvl;
        } else if (Array.isArray(rawTvlAny) && rawTvlAny.length > 0) {
          const last = rawTvlAny[rawTvlAny.length - 1];
          resolvedTvl = typeof last === 'number' ? last : (last?.totalLiquidityUSD ?? undefined);
        } else if ((raw as any).currentChainTvls) {
          resolvedTvl = Object.values((raw as any).currentChainTvls).reduce(
            (acc: number, v: any) => acc + (typeof v === 'number' ? v : 0),
            0
          );
        }

        const symbol = raw.symbol ? raw.symbol.toLowerCase() : '';
        return {
          id: `llama-${slug}`,
          name: raw.name,
          slug,
          description: raw.description || `${raw.name} is a leading decentralized protocol in ${raw.category || 'DeFi'} with genuine verified on-chain metrics tracked via DefiLlama.`,
          logo: raw.logo,
          logoUrl: raw.logo,
          banner: undefined,
          category: raw.category || 'DeFi',
          blockchain: raw.chain || (raw.chains && raw.chains[0]) || 'Ethereum',
          ecosystem: raw.chain || (raw.chains && raw.chains[0]) || 'Ethereum',
          chains: raw.chains && raw.chains.length > 0 ? raw.chains : (raw.chain ? [raw.chain] : ['Ethereum']),
          website: raw.url,
          websiteUrl: raw.url,
          documentation: raw.audit_links && raw.audit_links.length > 0 ? raw.audit_links[0] : undefined,
          socialLinks: raw.twitter ? { twitter: `https://twitter.com/${raw.twitter.replace(/^@/, '')}` } : undefined,
          ownerAddress: raw.address || '0x0000000000000000000000000000000000000000',
          status: 'active',
          verificationStatus: 'audit_available',
          tags: [raw.category, ...(raw.chains || [])].filter(Boolean) as string[],
          tokenIds: symbol ? [symbol] : [],
          tvl: resolvedTvl,
          mcap: raw.mcap || undefined,
          change1d: raw.change_1d || undefined,
          change7d: raw.change_7d || undefined,
          isEcosystem: false,
          isExternal: true,
          origin: 'external',
          source: 'DefiLlama Protocols',
          defillamaId: String(raw.id),
          geckoId: raw.gecko_id || undefined,
          cmcId: raw.cmcId ? String(raw.cmcId) : undefined,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: new Date().toISOString(),
        };
      }

      // Check protocol list fallback
      const protocols = await defillamaClient.getProtocols(150);
      const found = protocols.find(
        (p) =>
          p.id.toLowerCase() === slug ||
          (p as any).slug?.toLowerCase() === slug ||
          p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
      );
      if (found) {
        const symbol = found.symbol ? found.symbol.toLowerCase() : '';
        return {
          id: `llama-${slug}`,
          name: found.name,
          slug,
          description: found.description || `${found.name} is a leading decentralized protocol in ${found.category || 'DeFi'}.`,
          logo: found.logo,
          logoUrl: found.logo,
          category: found.category || 'DeFi',
          blockchain: found.chain || (found.chains && found.chains[0]) || 'Ethereum',
          ecosystem: found.chain || (found.chains && found.chains[0]) || 'Ethereum',
          chains: found.chains || (found.chain ? [found.chain] : ['Ethereum']),
          website: found.url,
          websiteUrl: found.url,
          documentation: found.audit_links && found.audit_links.length > 0 ? found.audit_links[0] : undefined,
          socialLinks: found.twitter ? { twitter: `https://twitter.com/${found.twitter.replace(/^@/, '')}` } : undefined,
          ownerAddress: found.address || '0x0000000000000000000000000000000000000000',
          status: 'active',
          verificationStatus: 'audit_available',
          tags: [found.category, ...(found.chains || [])].filter(Boolean) as string[],
          tokenIds: symbol ? [symbol] : [],
          tvl: found.tvl,
          mcap: found.mcap || undefined,
          isEcosystem: false,
          isExternal: true,
          origin: 'external',
          source: 'DefiLlama Protocols',
          defillamaId: String(found.id),
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: new Date().toISOString(),
        };
      }

      return null;
    } catch {
      return localDataProvider.projects.getById(id);
    }
  }

  async search(query: string, limit = 10): Promise<Project[]> {
    const list = await this.list({ search: query }, { page: 1, pageSize: limit });
    return list.items;
  }

  async getFeatured(): Promise<Project[]> {
    try {
      const localFeatured = await localDataProvider.projects.getFeatured();
      const topProtocols = await defillamaClient.getProtocols(6);
      const externalFeatured: Project[] = topProtocols.slice(0, 4).map((p) => {
        const slug = (p as any).slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return {
          id: `llama-${slug}`,
          name: p.name,
          slug,
          description: `${p.name} is a leading decentralized protocol in ${p.category || 'DeFi'} with ${formatTvlString(p.tvl)} TVL.`,
          logo: p.logo,
          logoUrl: p.logo,
          category: p.category || 'DeFi',
          blockchain: p.chain || 'Ethereum',
          ecosystem: p.chain || 'Ethereum',
          chains: p.chains || (p.chain ? [p.chain] : ['Ethereum']),
          website: p.url,
          websiteUrl: p.url,
          ownerAddress: p.address || '0x0000000000000000000000000000000000000000',
          status: 'active',
          verificationStatus: 'audit_available',
          tags: [p.category || 'DeFi'],
          tokenIds: p.symbol ? [p.symbol.toLowerCase()] : [],
          tvl: p.tvl,
          isEcosystem: false,
          isExternal: true,
          origin: 'external',
          source: 'DefiLlama Protocols',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: new Date().toISOString(),
        };
      });

      return [
        ...localFeatured.map((p) => ({
          ...p,
          isEcosystem: true,
          isExternal: false,
          origin: 'ecosystem' as const,
          source: 'HorizonX Ecosystem (Simulated)',
        })),
        ...externalFeatured,
      ];
    } catch {
      return localDataProvider.projects.getFeatured();
    }
  }
}

class HybridStakingProvider implements IStakingProvider {
  async listPools(filters?: StakingFilters, pagination?: PaginationParams, sort?: StakingSortParams): Promise<PaginatedResult<StakingPool>> {
    try {
      const [llamaPools, localRes] = await Promise.all([
        defillamaClient.getYieldPools(80).catch(() => []),
        localDataProvider.staking.listPools().catch(() => ({
          items: [] as StakingPool[],
          pagination: { total: 0, page: 1, pageSize: 10, totalPages: 1, hasNextPage: false, hasPrevPage: false },
        })),
      ]);

      const localPools: StakingPool[] = (localRes.items || []).map((p) => ({
        ...p,
        isEcosystem: true,
        isExternal: false,
        origin: 'ecosystem' as const,
        source: 'HorizonX Ecosystem (Simulated)',
        category: p.category || 'HorizonX Vault (Simulated)',
      }));

      const externalPools: StakingPool[] = (llamaPools || []).map((p) => {
        const category = determinePoolCategory(p.project, p.symbol, p.exposure);
        const symbolClean = p.symbol.toUpperCase();
        const tokensList = symbolClean.split(/[-/_]/).map((s) => s.trim()).filter(Boolean);
        const primarySymbol = tokensList[0] || symbolClean;
        const allUnderlying = p.underlyingTokens && p.underlyingTokens.length > 0 ? p.underlyingTokens : (tokensList.length > 1 ? tokensList : undefined);
        const projClean = p.project.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        const name = `${projClean} ${symbolClean}`;

        return {
          id: p.pool,
          name,
          token: symbolClean,
          tokenId: primarySymbol.toLowerCase(),
          network: p.chain,
          apr: `${(p.apy || 0).toFixed(2)}%`,
          apy: `${(p.apy || 0).toFixed(2)}%`,
          apyValue: p.apy,
          apyBase: p.apyBase ?? undefined,
          apyReward: p.apyReward ?? undefined,
          tvl: formatTvlString(p.tvlUsd),
          tvlUsd: p.tvlUsd,
          totalStaked: formatTvlString(p.tvlUsd),
          lockPeriod: p.poolMeta || 'Flexible',
          lockPeriodDays: p.poolMeta && p.poolMeta.includes('lock') ? parseInt(p.poolMeta, 10) || 0 : 0,
          status: 'active' as const,
          stakerCount: Math.min(25000, Math.floor(Math.sqrt(p.tvlUsd / 200)) + 45),
          description: `Verified on-chain ${category} strategy on ${p.chain} by ${projClean}. Live APY ${(p.apy || 0).toFixed(2)}% backed by DefiLlama yield tracking.`,
          category,
          ownerAddress: '0x0000000000000000000000000000000000000000',
          projectId: `llama-${p.project}`,
          protocolSlug: p.project,
          isEcosystem: false,
          isExternal: true,
          origin: 'external' as const,
          source: 'DefiLlama Yields',
          underlyingTokens: allUnderlying,
          poolMeta: p.poolMeta || undefined,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: new Date().toISOString(),
        };
      });

      let combined: StakingPool[] = [];
      if (filters?.origin === 'ecosystem') {
        combined = localPools;
      } else if (filters?.origin === 'external') {
        combined = externalPools;
      } else {
        combined = [...localPools, ...externalPools];
      }

      let filtered = combined;
      if (filters?.search) {
        const q = filters.search.toLowerCase().trim();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.token?.toLowerCase().includes(q) ||
            p.tokenId.toLowerCase().includes(q) ||
            p.network.toLowerCase().includes(q) ||
            (p.category && p.category.toLowerCase().includes(q)) ||
            (p.description && p.description.toLowerCase().includes(q))
        );
      }

      if (filters?.network && filters.network.length > 0) {
        const nets = filters.network.map((n) => n.toLowerCase());
        filtered = filtered.filter((p) => nets.includes(p.network.toLowerCase()));
      }

      if (filters?.tokenId) {
        const tid = filters.tokenId.toLowerCase();
        filtered = filtered.filter((p) => p.tokenId.toLowerCase() === tid || p.token?.toLowerCase() === tid);
      }

      if (filters?.projectId) {
        const pid = filters.projectId.toLowerCase();
        filtered = filtered.filter((p) => p.projectId && p.projectId.toLowerCase() === pid);
      }

      if (filters?.minApy !== undefined) {
        filtered = filtered.filter((p) => (p.apyValue ?? 0) >= filters.minApy!);
      }

      if (filters?.category && filters.category.length > 0) {
        const cats = filters.category.map((c) => c.toLowerCase());
        filtered = filtered.filter((p) => p.category && cats.includes(p.category.toLowerCase()));
      }

      if (sort?.sortBy) {
        const dir = sort.sortOrder === 'asc' ? 1 : -1;
        filtered.sort((a, b) => {
          switch (sort.sortBy) {
            case 'tvl':
              return dir * ((a.tvlUsd ?? 0) - (b.tvlUsd ?? 0));
            case 'apy':
              return dir * ((a.apyValue ?? 0) - (b.apyValue ?? 0));
            case 'name':
              return dir * a.name.localeCompare(b.name);
            case 'stakerCount':
              return dir * ((a.stakerCount ?? 0) - (b.stakerCount ?? 0));
            case 'createdAt':
              return dir * (a.createdAt || '').localeCompare(b.createdAt || '');
            default:
              return 0;
          }
        });
      } else {
        // Default sort: ecosystem vaults first, then highest TVL pools
        filtered.sort((a, b) => {
          if (a.isEcosystem && !b.isEcosystem) return -1;
          if (!a.isEcosystem && b.isEcosystem) return 1;
          return (b.tvlUsd ?? 0) - (a.tvlUsd ?? 0);
        });
      }

      return paginate(filtered, pagination);
    } catch {
      return localDataProvider.staking.listPools(filters, pagination, sort);
    }
  }

  async getPoolById(id: string): Promise<StakingPool | null> {
    try {
      const cleanId = id.toLowerCase();
      const localPool = await localDataProvider.staking.getPoolById(cleanId);
      if (localPool) {
        return {
          ...localPool,
          isEcosystem: true,
          isExternal: false,
          origin: 'ecosystem',
          source: 'HorizonX Ecosystem (Simulated)',
          category: localPool.category || 'HorizonX Vault (Simulated)',
        };
      }

      const raw = await defillamaClient.getYieldPoolById(cleanId);
      if (raw) {
        const category = determinePoolCategory(raw.project, raw.symbol, raw.exposure);
        const symbolClean = raw.symbol.toUpperCase();
        const tokensList = symbolClean.split(/[-/_]/).map((s) => s.trim()).filter(Boolean);
        const primarySymbol = tokensList[0] || symbolClean;
        const allUnderlying = raw.underlyingTokens && raw.underlyingTokens.length > 0 ? raw.underlyingTokens : (tokensList.length > 1 ? tokensList : undefined);
        const projClean = raw.project.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        const name = `${projClean} ${symbolClean}`;

        return {
          id: raw.pool,
          name,
          token: symbolClean,
          tokenId: primarySymbol.toLowerCase(),
          network: raw.chain,
          apr: `${(raw.apy || 0).toFixed(2)}%`,
          apy: `${(raw.apy || 0).toFixed(2)}%`,
          apyValue: raw.apy,
          apyBase: raw.apyBase ?? undefined,
          apyReward: raw.apyReward ?? undefined,
          tvl: formatTvlString(raw.tvlUsd),
          tvlUsd: raw.tvlUsd,
          totalStaked: formatTvlString(raw.tvlUsd),
          lockPeriod: raw.poolMeta || 'Flexible',
          lockPeriodDays: raw.poolMeta && raw.poolMeta.includes('lock') ? parseInt(raw.poolMeta, 10) || 0 : 0,
          status: 'active',
          stakerCount: Math.min(25000, Math.floor(Math.sqrt(raw.tvlUsd / 200)) + 45),
          description: `Verified on-chain ${category} strategy on ${raw.chain} by ${projClean}. Live APY ${(raw.apy || 0).toFixed(2)}% backed by DefiLlama yield tracking.`,
          category,
          ownerAddress: '0x0000000000000000000000000000000000000000',
          projectId: `llama-${raw.project}`,
          protocolSlug: raw.project,
          isEcosystem: false,
          isExternal: true,
          origin: 'external',
          source: 'DefiLlama Yields',
          underlyingTokens: allUnderlying,
          poolMeta: raw.poolMeta || undefined,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: new Date().toISOString(),
        };
      }

      return null;
    } catch {
      return localDataProvider.staking.getPoolById(id);
    }
  }

  async search(query: string, limit = 10): Promise<StakingPool[]> {
    const list = await this.listPools({ search: query }, { page: 1, pageSize: limit });
    return list.items;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HYBRID AIRDROP PROVIDER (DefiLlama Registry + Tokenless Protocols + CryptoRank + HorizonX Ecosystem)
// ─────────────────────────────────────────────────────────────────────────────
export class HybridAirdropProvider implements IAirdropProvider {
  async list(
    filters?: AirdropFilters,
    pagination?: PaginationParams,
    sort?: AirdropSortParams
  ): Promise<PaginatedResult<AirdropCampaign>> {
    const [localRes, airdropRegistry, tokenlessProtocols, cryptoRankRes] = await Promise.all([
      localDataProvider.airdrops.list(filters),
      defillamaClient.getAirdropRegistry().catch(() => ({} as Record<string, DefiLlamaAirdropEntry>)),
      defillamaClient.getTokenlessProtocols(60).catch(() => []),
      cryptoRankClient.getAirdrops({ limit: 50 }).catch(() => ({ configured: false, data: [] })),
    ]);

    const localAirdrops: AirdropCampaign[] = (localRes.items || []).map((a) => ({
      ...a,
      isEcosystem: true,
      isExternal: false,
      origin: (a.origin || 'ecosystem') as 'ecosystem' | 'session',
      source: a.source || 'HorizonX Ecosystem (Simulated)',
    }));

    // 1. DefiLlama Airdrop Registry (Verified snapshot distribution claims)
    const registryEntries = Object.entries(airdropRegistry || {}) as [string, DefiLlamaAirdropEntry][];
    const registryAirdrops: AirdropCampaign[] = registryEntries.map(([key, item]) => {
      const symbol = item.tokenSymbol ? item.tokenSymbol.toUpperCase() : key.toUpperCase();
      const title = item.name || symbol;
      const status: 'active' | 'ended' = item.isActive ? 'active' : 'ended';
      const endIso = item.endTime ? new Date(item.endTime * 1000).toISOString() : undefined;
      const startIso = item.endTime ? new Date(item.endTime * 1000 - 90 * 86400000).toISOString() : '2024-01-01T00:00:00.000Z';

      return {
        id: `llama-airdrop-${key}`,
        providerId: key,
        providerName: 'DefiLlama Airdrop Registry',
        title: `${title} Airdrop Distribution`,
        name: title,
        description: item.description || `Verified snapshot airdrop distribution for ${title} tracked via DefiLlama Airdrop Registry. Official verification and claim available on protocol claims portal.`,
        network: 'Multi-chain',
        category: 'Airdrop Registry',
        type: 'merkle' as const,
        tokenId: symbol.toLowerCase(),
        status,
        reward: `${symbol} Snapshot Allocation`,
        totalReward: item.haveAirdropData ? `${symbol} Verified Pool` : 'Verified Distribution',
        eligibility: 'Official Snapshot Participants',
        requirements: [
          'Historical on-chain interaction snapshot',
          'Non-sybil verified address',
          'Official claims portal submission',
        ],
        startDate: startIso,
        startTime: startIso,
        endDate: endIso,
        endTime: endIso,
        recipientCount: 15000,
        claimedCount: item.isActive ? 4500 : 15000,
        ownerAddress: '0x0000000000000000000000000000000000000000',
        officialUrl: item.page,
        externalUrl: item.page,
        image: '/artwork/aether-frames-1.svg',
        banner: '/artwork/aether-frames-banner.svg',
        isEcosystem: false,
        isExternal: true,
        origin: 'external' as const,
        source: 'DefiLlama Airdrop Registry',
        createdAt: startIso,
        updatedAt: endIso || new Date().toISOString(),
      };
    });

    // 2. DefiLlama Tokenless Protocols (Potential Retroactive Airdrops)
    const tokenlessAirdrops: AirdropCampaign[] = (tokenlessProtocols || []).map((p) => {
      const slug = (p as any).slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const primaryChain = (p.chains && p.chains[0]) || p.chain || 'Multi-chain';
      const tvlStr = formatTvlString(p.tvl);

      return {
        id: `llama-potential-${slug}`,
        providerId: String(p.id),
        providerName: 'DefiLlama Tokenless',
        title: `${p.name} (Tokenless Protocol)`,
        name: p.name,
        description: p.description || `${p.name} is a high-TVL decentralized protocol (${tvlStr} TVL) with no native token, tracked by DefiLlama as a potential retroactive airdrop candidate.`,
        network: primaryChain,
        category: 'Potential Airdrops',
        type: 'quest' as const,
        tokenId: slug,
        status: 'scheduled' as const,
        reward: 'Potential Retroactive Token / Points',
        totalReward: `TVL: ${tvlStr}`,
        eligibility: `Active user on ${p.chains && p.chains.length > 1 ? `${p.chains.length} chains` : primaryChain}`,
        requirements: [
          `Maintain active on-chain liquidity or volume on ${primaryChain}`,
          `Interact with ${p.name} smart contracts before snapshot`,
          'No native governance token launched yet',
        ],
        startDate: p.listedAt ? new Date(p.listedAt * 1000).toISOString() : '2024-01-01T00:00:00.000Z',
        startTime: p.listedAt ? new Date(p.listedAt * 1000).toISOString() : '2024-01-01T00:00:00.000Z',
        recipientCount: Math.min(50000, Math.floor(Math.sqrt((p.tvl || 100000) / 100)) + 500),
        claimedCount: 0,
        ownerAddress: p.address || '0x0000000000000000000000000000000000000000',
        officialUrl: p.url,
        externalUrl: p.url,
        image: p.logo || '/artwork/aether-frames-1.svg',
        banner: '/artwork/aether-frames-banner.svg',
        isEcosystem: false,
        isExternal: true,
        origin: 'external' as const,
        source: 'DefiLlama Tokenless Protocols',
        createdAt: p.listedAt ? new Date(p.listedAt * 1000).toISOString() : '2024-01-01T00:00:00.000Z',
        updatedAt: new Date().toISOString(),
      };
    });

    const cryptoRankAirdrops: AirdropCampaign[] = (cryptoRankRes.data || []).map((item) => {
      const rawStatus = (item.status || '').toLowerCase();
      let status: 'active' | 'scheduled' | 'ended' = 'active';
      if (rawStatus.includes('upcom') || rawStatus.includes('sched')) status = 'scheduled';
      else if (rawStatus.includes('end') || rawStatus.includes('past') || rawStatus.includes('conclud')) status = 'ended';

      const networkName = (item.networks && item.networks[0]?.name) || item.network || 'Multi-chain';
      const slug = item.slug || String(item.id);
      const symbol = item.symbol ? String(item.symbol).toUpperCase() : '';
      const tokenId = symbol ? symbol.toLowerCase() : slug;
      const title = item.title || item.name || slug;

      return {
        id: `rank-${item.id || slug}`,
        providerId: String(item.id),
        providerName: 'CryptoRank',
        title,
        name: title,
        description: item.description || `CryptoRank drophunting campaign for ${title}. Tasks and distribution strategy tracked live via CryptoRank v3.`,
        network: networkName,
        category: item.category || item.categoryName || 'Drophunting',
        type: 'quest' as const,
        tokenId,
        status,
        reward: item.reward || (item.totalReward ? `${item.totalReward}` : 'Reward Pool TBD'),
        totalReward: item.reward || 'TBD',
        eligibility: item.stage || 'Public Quest Participation',
        requirements: item.tasksCount ? [`Complete ${item.tasksCount} drophunting tasks`, 'Connect Web3 Wallet', 'Verified identity'] : ['Task verification', 'Active community member'],
        startDate: item.startDate,
        startTime: item.startDate,
        endDate: item.endDate,
        endTime: item.endDate,
        recipientCount: item.tasksCount ? item.tasksCount * 250 : 5000,
        claimedCount: 0,
        ownerAddress: '0x0000000000000000000000000000000000000000',
        officialUrl: item.links?.find((l: any) => l.type === 'web')?.value || (slug ? `https://cryptorank.io/drophunting/${slug}` : undefined),
        image: item.icon || item.logo || item.image || '/artwork/aether-frames-1.svg',
        banner: item.banner || item.bannerImage || '/artwork/aether-frames-banner.svg',
        isEcosystem: false,
        isExternal: true,
        origin: 'external' as const,
        source: 'CryptoRank Drophunting',
        createdAt: item.startDate || '2024-01-01T00:00:00.000Z',
        updatedAt: item.endDate || new Date().toISOString(),
      };
    });

    const externalAirdrops = [...registryAirdrops, ...tokenlessAirdrops, ...cryptoRankAirdrops];

    let combined: AirdropCampaign[] = [];
    if (filters?.origin === 'ecosystem') {
      combined = localAirdrops;
    } else if (filters?.origin === 'external') {
      combined = externalAirdrops;
    } else {
      combined = [...localAirdrops, ...externalAirdrops];
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      combined = combined.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.name && a.name.toLowerCase().includes(q)) ||
          (a.description && a.description.toLowerCase().includes(q)) ||
          a.tokenId.toLowerCase().includes(q) ||
          (a.category && a.category.toLowerCase().includes(q))
      );
    }

    if (filters?.category && filters.category.length > 0) {
      const cats = (Array.isArray(filters.category) ? filters.category : [filters.category]).map((c: string) => c.toLowerCase());
      combined = combined.filter((a) => a.category && cats.includes(a.category.toLowerCase()));
    }

    if (filters?.network && filters.network.length > 0) {
      combined = combined.filter((a) => filters.network!.some((n) => a.network.toLowerCase().includes(n.toLowerCase())));
    }

    if (filters?.status && filters.status.length > 0) {
      combined = combined.filter((a) => filters.status!.includes(a.status));
    }

    if (filters?.type && filters.type.length > 0) {
      combined = combined.filter((a) => filters.type!.includes(a.type));
    }

    if (filters?.tokenId) {
      combined = combined.filter((a) => a.tokenId.toLowerCase() === filters.tokenId!.toLowerCase());
    }

    if (filters?.projectId) {
      combined = combined.filter((a) => a.projectId && a.projectId.toLowerCase() === filters.projectId!.toLowerCase());
    }

    if (sort?.sortBy) {
      const order = sort.sortOrder === 'desc' ? -1 : 1;
      combined.sort((a, b) => {
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

    return paginate(combined, pagination);
  }

  async getById(id: string): Promise<AirdropCampaign | null> {
    const cleanId = id.trim();
    const local = await localDataProvider.airdrops.getById(cleanId);
    if (local) {
      return {
        ...local,
        isEcosystem: true,
        isExternal: false,
        origin: (local.origin || 'ecosystem') as 'ecosystem' | 'session',
        source: local.source || 'HorizonX Ecosystem (Simulated)',
      };
    }

    if (cleanId.startsWith('llama-airdrop-')) {
      const regKey = cleanId.replace(/^llama-airdrop-/, '');
      const registry: Record<string, DefiLlamaAirdropEntry> = await defillamaClient.getAirdropRegistry().catch(() => ({}));
      const item = registry[regKey];
      if (item) {
        const symbol = item.tokenSymbol ? item.tokenSymbol.toUpperCase() : regKey.toUpperCase();
        const title = item.name || symbol;
        const status: 'active' | 'ended' = item.isActive ? 'active' : 'ended';
        const endIso = item.endTime ? new Date(item.endTime * 1000).toISOString() : undefined;
        const startIso = item.endTime ? new Date(item.endTime * 1000 - 90 * 86400000).toISOString() : '2024-01-01T00:00:00.000Z';

        return {
          id: cleanId,
          providerId: regKey,
          providerName: 'DefiLlama Airdrop Registry',
          title: `${title} Airdrop Distribution`,
          name: title,
          description: item.description || `Verified snapshot airdrop distribution for ${title} tracked via DefiLlama Airdrop Registry.`,
          network: 'Multi-chain',
          category: 'Airdrop Registry',
          type: 'merkle',
          tokenId: symbol.toLowerCase(),
          status,
          reward: `${symbol} Snapshot Allocation`,
          totalReward: item.haveAirdropData ? `${symbol} Verified Pool` : 'Verified Distribution',
          eligibility: 'Official Snapshot Participants',
          requirements: [
            'Historical on-chain interaction snapshot',
            'Non-sybil verified address',
            'Official claims portal submission',
          ],
          startDate: startIso,
          startTime: startIso,
          endDate: endIso,
          endTime: endIso,
          recipientCount: 15000,
          claimedCount: item.isActive ? 4500 : 15000,
          ownerAddress: '0x0000000000000000000000000000000000000000',
          officialUrl: item.page,
          externalUrl: item.page,
          image: '/artwork/aether-frames-1.svg',
          banner: '/artwork/aether-frames-banner.svg',
          isEcosystem: false,
          isExternal: true,
          origin: 'external',
          source: 'DefiLlama Airdrop Registry',
          createdAt: startIso,
          updatedAt: endIso || new Date().toISOString(),
        };
      }
    }

    if (cleanId.startsWith('llama-potential-')) {
      const slug = cleanId.replace(/^llama-potential-/, '');
      const tokenless = await defillamaClient.getTokenlessProtocols(100).catch(() => []);
      const found = tokenless.find((p) => {
        const s = (p as any).slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return s === slug;
      });
      if (found) {
        const primaryChain = (found.chains && found.chains[0]) || found.chain || 'Multi-chain';
        const tvlStr = formatTvlString(found.tvl);
        return {
          id: cleanId,
          providerId: String(found.id),
          providerName: 'DefiLlama Tokenless',
          title: `${found.name} (Tokenless Protocol)`,
          name: found.name,
          description: found.description || `${found.name} is a high-TVL decentralized protocol (${tvlStr} TVL) with no native token, tracked by DefiLlama as a potential retroactive airdrop candidate.`,
          network: primaryChain,
          category: 'Potential Airdrops',
          type: 'quest',
          tokenId: slug,
          status: 'scheduled',
          reward: 'Potential Retroactive Token / Points',
          totalReward: `TVL: ${tvlStr}`,
          eligibility: `Active user on ${found.chains && found.chains.length > 1 ? `${found.chains.length} chains` : primaryChain}`,
          requirements: [
            `Maintain active on-chain liquidity or volume on ${primaryChain}`,
            `Interact with ${found.name} smart contracts before snapshot`,
            'No native governance token launched yet',
          ],
          startDate: found.listedAt ? new Date(found.listedAt * 1000).toISOString() : '2024-01-01T00:00:00.000Z',
          startTime: found.listedAt ? new Date(found.listedAt * 1000).toISOString() : '2024-01-01T00:00:00.000Z',
          recipientCount: Math.min(50000, Math.floor(Math.sqrt((found.tvl || 100000) / 100)) + 500),
          claimedCount: 0,
          ownerAddress: found.address || '0x0000000000000000000000000000000000000000',
          officialUrl: found.url,
          externalUrl: found.url,
          image: found.logo || '/artwork/aether-frames-1.svg',
          banner: '/artwork/aether-frames-banner.svg',
          isEcosystem: false,
          isExternal: true,
          origin: 'external',
          source: 'DefiLlama Tokenless Protocols',
          createdAt: found.listedAt ? new Date(found.listedAt * 1000).toISOString() : '2024-01-01T00:00:00.000Z',
          updatedAt: new Date().toISOString(),
        };
      }
    }

    const rankId = cleanId.replace(/^rank-/, '');
    const rankRes = await cryptoRankClient.getAirdropById(rankId).catch(() => null);
    if (rankRes?.data) {
      const item = rankRes.data;
      const rawStatus = (item.status || '').toLowerCase();
      let status: 'active' | 'scheduled' | 'ended' = 'active';
      if (rawStatus.includes('upcom') || rawStatus.includes('sched')) status = 'scheduled';
      else if (rawStatus.includes('end') || rawStatus.includes('past') || rawStatus.includes('conclud')) status = 'ended';

      const networkName = (item.networks && item.networks[0]?.name) || item.network || 'Multi-chain';
      const slug = item.slug || String(item.id);
      const symbol = item.symbol ? String(item.symbol).toUpperCase() : '';
      const tokenId = symbol ? symbol.toLowerCase() : slug;
      const title = item.title || item.name || slug;

      return {
        id: `rank-${item.id || slug}`,
        providerId: String(item.id),
        providerName: 'CryptoRank',
        title,
        name: title,
        description: item.description || `CryptoRank drophunting campaign for ${title}.`,
        network: networkName,
        category: item.category || item.categoryName || 'Drophunting',
        type: 'quest' as const,
        tokenId,
        status,
        reward: item.reward || (item.totalReward ? `${item.totalReward}` : 'Reward Pool TBD'),
        totalReward: item.reward || 'TBD',
        eligibility: item.stage || 'Public Quest Participation',
        requirements: item.tasksCount ? [`Complete ${item.tasksCount} drophunting tasks`, 'Connect Web3 Wallet', 'Verified identity'] : ['Task verification', 'Active community member'],
        startDate: item.startDate,
        startTime: item.startDate,
        endDate: item.endDate,
        endTime: item.endDate,
        recipientCount: item.tasksCount ? item.tasksCount * 250 : 5000,
        claimedCount: 0,
        ownerAddress: '0x0000000000000000000000000000000000000000',
        officialUrl: item.links?.find((l: any) => l.type === 'web')?.value || (slug ? `https://cryptorank.io/drophunting/${slug}` : undefined),
        image: item.icon || item.logo || item.image || '/artwork/aether-frames-1.svg',
        banner: item.banner || item.bannerImage || '/artwork/aether-frames-banner.svg',
        isEcosystem: false,
        isExternal: true,
        origin: 'external' as const,
        source: 'CryptoRank Drophunting',
        createdAt: item.startDate || '2024-01-01T00:00:00.000Z',
        updatedAt: item.endDate || new Date().toISOString(),
      };
    }

    return null;
  }

  async search(query: string, limit = 10): Promise<AirdropCampaign[]> {
    const list = await this.list({ search: query }, { page: 1, pageSize: limit });
    return list.items;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HYBRID LAUNCHPAD PROVIDER (CryptoRank Public Sales + HorizonX Ecosystem)
// ─────────────────────────────────────────────────────────────────────────────
export class HybridLaunchpadProvider implements ILaunchpadProvider {
  async listAll(
    filters?: LaunchpadFilters,
    pagination?: PaginationParams,
    sort?: LaunchpadSortParams
  ): Promise<PaginatedResult<LaunchpadItem>> {
    const [presalesRes, fairLaunchesRes] = await Promise.all([
      this.listPresales(filters),
      this.listFairLaunches(filters),
    ]);

    let items: LaunchpadItem[] = [];
    if (filters?.launchType === 'presale') {
      items = presalesRes.items;
    } else if (filters?.launchType === 'fair-launch') {
      items = fairLaunchesRes.items;
    } else {
      items = [...presalesRes.items, ...fairLaunchesRes.items];
    }

    return paginate(items, pagination);
  }

  async listPresales(
    filters?: LaunchpadFilters,
    pagination?: PaginationParams,
    sort?: LaunchpadSortParams
  ): Promise<PaginatedResult<Presale>> {
    const [localRes, coinGeckoTokens, cryptoRankRes] = await Promise.all([
      localDataProvider.launchpad.listPresales(filters),
      coinGeckoClient.getLaunchpadTokens(30).catch(() => []),
      cryptoRankClient.getPublicSales({ limit: 50 }).catch(() => ({ configured: false, data: [] })),
    ]);

    const localPresales: Presale[] = (localRes.items || []).map((p) => ({
      ...p,
      isEcosystem: true,
      isExternal: false,
      origin: (p.origin || 'ecosystem') as 'ecosystem' | 'session',
      source: p.source || 'HorizonX Ecosystem (Simulated)',
    }));

    // CoinGecko Launchpad Ecosystem Tokens (Circulating secondary market assets)
    const coinGeckoPresales: Presale[] = (coinGeckoTokens || []).map((token) => {
      const symbol = (token.symbol || 'TOKEN').toUpperCase();
      const name = token.name || symbol;
      const priceVal = token.current_price;
      const salePrice = typeof priceVal === 'number' ? `$${priceVal < 0.01 ? priceVal.toFixed(6) : priceVal.toFixed(2)}` : 'TBD';
      const mcap = token.market_cap || 0;
      const volume = token.total_volume || 0;
      const mcapStr = mcap > 0 ? `$${mcap.toLocaleString()}` : 'TBD';
      const volStr = volume > 0 ? `$${volume.toLocaleString()}` : '$0';

      return {
        id: `cg-launchpad-${token.id}`,
        providerId: token.id,
        providerName: 'CoinGecko Launchpad',
        title: `${name} (${symbol}) Launchpad Token`,
        name,
        token: symbol,
        tokenId: token.id || symbol.toLowerCase(),
        description: `${name} (${symbol}) is an ecosystem asset originated in the CoinGecko Launchpad category. Live market valuation ${mcapStr} with 24h trading volume ${volStr} tracked via CoinGecko. Note: This token is actively circulating on secondary markets and is not an active presale.`,
        logo: token.image,
        image: token.image || '/artwork/copper-signal-1.svg',
        banner: '/artwork/copper-signal-banner.svg',
        bannerImage: '/artwork/copper-signal-banner.svg',
        category: 'Launchpad Ecosystem',
        ownerAddress: '0x0000000000000000000000000000000000000000',
        status: 'finalized' as const,
        startDate: '2024-01-01T00:00:00.000Z',
        startTime: '2024-01-01T00:00:00.000Z',
        endDate: token.last_updated || new Date().toISOString(),
        endTime: token.last_updated || new Date().toISOString(),
        hardCap: mcapStr,
        softCap: mcap > 0 ? `$${Math.round(mcap * 0.2).toLocaleString()}` : undefined,
        fundraisingGoal: `Market Cap: ${mcapStr}`,
        salePrice,
        allocation: token.circulating_supply ? `${token.circulating_supply.toLocaleString()} ${symbol}` : 'Public Circulation',
        totalRaised: `24h Vol: ${volStr}`,
        participantCount: token.market_cap_rank ? Math.max(100, 5000 - token.market_cap_rank * 30) : 1000,
        network: 'Multi-chain',
        progress: 100,
        launchType: 'presale' as const,
        launchpadName: 'CoinGecko Launchpad Category',
        saleType: 'Launchpad Ecosystem Token',
        isEcosystem: false,
        isExternal: true,
        origin: 'external' as const,
        source: 'CoinGecko Launchpad Category',
        externalUrl: `https://www.coingecko.com/en/coins/${token.id}`,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: token.last_updated || new Date().toISOString(),
      };
    });

    const cryptoRankPresales: Presale[] = (cryptoRankRes.data || []).map((item) => {
      const rawStatus = (item.status || item.saleStatus || '').toLowerCase();
      let status: 'live' | 'scheduled' | 'ended' | 'finalized' = 'live';
      if (rawStatus.includes('upcom') || rawStatus.includes('sched')) status = 'scheduled';
      else if (rawStatus.includes('final')) status = 'finalized';
      else if (rawStatus.includes('end') || rawStatus.includes('past') || rawStatus.includes('conclud') || rawStatus.includes('closed')) status = 'ended';

      const slug = item.slug || String(item.id);
      const symbol = item.symbol ? String(item.symbol).toUpperCase() : 'TOKEN';
      const name = item.name || slug;
      const saleType = item.type || 'IDO';
      const title = `${name} (${symbol}) ${saleType}`;
      const network = item.network || item.blockchain || 'Ethereum';
      const launchpadName = item.launchpads?.[0]?.name || `${saleType} Offering`;

      const priceVal = typeof item.price === 'number' ? item.price : (item.price?.value ?? null);
      const salePrice = priceVal ? `$${priceVal < 0.01 ? priceVal.toFixed(4) : priceVal.toFixed(2)}` : 'TBD';

      const hardCapNum = typeof item.hardCap === 'number' ? item.hardCap : 0;
      const raisedNum = typeof item.raised === 'number' ? item.raised : (status === 'ended' || status === 'finalized' ? hardCapNum : 0);

      const hardCap = hardCapNum > 0 ? `$${hardCapNum.toLocaleString()}` : 'TBD';
      const totalRaised = raisedNum > 0 ? `$${raisedNum.toLocaleString()}` : '$0';
      const progress = hardCapNum > 0 ? Math.min(100, Math.round((raisedNum / hardCapNum) * 100)) : 0;

      return {
        id: `rank-${item.id || slug}`,
        providerId: String(item.id),
        providerName: 'CryptoRank',
        title,
        name,
        token: symbol,
        tokenId: symbol.toLowerCase(),
        description: item.description || `Public ${saleType} offering for ${name} (${symbol}) hosted on ${launchpadName}. Real-time public sale intelligence via CryptoRank v3.`,
        logo: item.icon || item.logo,
        image: item.icon || item.logo || '/artwork/copper-signal-1.svg',
        banner: '/artwork/copper-signal-banner.svg',
        bannerImage: '/artwork/copper-signal-banner.svg',
        category: item.category || `${saleType} Offering`,
        ownerAddress: '0x0000000000000000000000000000000000000000',
        status,
        startDate: item.startDate,
        startTime: item.startDate,
        endDate: item.endDate,
        endTime: item.endDate,
        hardCap,
        softCap: typeof item.softCap === 'number' && item.softCap > 0 ? `$${item.softCap.toLocaleString()}` : undefined,
        fundraisingGoal: hardCap,
        salePrice,
        allocation: symbol ? `1,000,000 ${symbol}` : 'Public Allocation',
        totalRaised,
        participantCount: 0,
        network,
        progress,
        launchType: 'presale' as const,
        launchpadName,
        saleType,
        isEcosystem: false,
        isExternal: true,
        origin: 'external' as const,
        source: 'CryptoRank Public Sales',
        createdAt: item.startDate || '2024-01-01T00:00:00.000Z',
        updatedAt: item.endDate || new Date().toISOString(),
      };
    });

    const externalPresales = [...coinGeckoPresales, ...cryptoRankPresales];

    let combined: Presale[] = [];
    if (filters?.origin === 'ecosystem') {
      combined = localPresales;
    } else if (filters?.origin === 'external') {
      combined = externalPresales;
    } else {
      combined = [...localPresales, ...externalPresales];
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      combined = combined.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          p.tokenId.toLowerCase().includes(q) ||
          (p.token && p.token.toLowerCase().includes(q))
      );
    }

    if (filters?.network && filters.network.length > 0) {
      combined = combined.filter((p) => filters.network!.some((n) => p.network.toLowerCase().includes(n.toLowerCase())));
    }

    if (filters?.status && filters.status.length > 0) {
      combined = combined.filter((p) => filters.status!.includes(p.status as any));
    }

    if (filters?.tokenId) {
      combined = combined.filter((p) => p.tokenId.toLowerCase() === filters.tokenId!.toLowerCase());
    }

    if (filters?.projectId) {
      combined = combined.filter((p) => p.projectId && p.projectId.toLowerCase() === filters.projectId!.toLowerCase());
    }

    return paginate(combined, pagination);
  }

  async getPresaleById(id: string): Promise<Presale | null> {
    const cleanId = id.trim();
    const local = await localDataProvider.launchpad.getPresaleById(cleanId);
    if (local) {
      return {
        ...local,
        isEcosystem: true,
        isExternal: false,
        origin: (local.origin || 'ecosystem') as 'ecosystem' | 'session',
        source: local.source || 'HorizonX Ecosystem (Simulated)',
      };
    }

    if (cleanId.startsWith('cg-launchpad-')) {
      const cgId = cleanId.replace(/^cg-launchpad-/, '');
      const tokens = await coinGeckoClient.getLaunchpadTokens(50).catch(() => []);
      const token = tokens.find((t) => t.id === cgId);
      if (token) {
        const symbol = (token.symbol || 'TOKEN').toUpperCase();
        const name = token.name || symbol;
        const priceVal = token.current_price;
        const salePrice = typeof priceVal === 'number' ? `$${priceVal < 0.01 ? priceVal.toFixed(6) : priceVal.toFixed(2)}` : 'TBD';
        const mcap = token.market_cap || 0;
        const volume = token.total_volume || 0;
        const mcapStr = mcap > 0 ? `$${mcap.toLocaleString()}` : 'TBD';
        const volStr = volume > 0 ? `$${volume.toLocaleString()}` : '$0';

        return {
          id: cleanId,
          providerId: token.id,
          providerName: 'CoinGecko Launchpad',
          title: `${name} (${symbol}) Launchpad Token`,
          name,
          token: symbol,
          tokenId: token.id || symbol.toLowerCase(),
          description: `${name} (${symbol}) is an ecosystem asset originated in the CoinGecko Launchpad category. Live market valuation ${mcapStr} with 24h trading volume ${volStr} tracked via CoinGecko. Note: This token is actively circulating on secondary markets and is not an active presale.`,
          logo: token.image,
          image: token.image || '/artwork/copper-signal-1.svg',
          banner: '/artwork/copper-signal-banner.svg',
          bannerImage: '/artwork/copper-signal-banner.svg',
          category: 'Launchpad Ecosystem',
          ownerAddress: '0x0000000000000000000000000000000000000000',
          status: 'finalized',
          startDate: '2024-01-01T00:00:00.000Z',
          startTime: '2024-01-01T00:00:00.000Z',
          endDate: token.last_updated || new Date().toISOString(),
          endTime: token.last_updated || new Date().toISOString(),
          hardCap: mcapStr,
          softCap: mcap > 0 ? `$${Math.round(mcap * 0.2).toLocaleString()}` : undefined,
          fundraisingGoal: `Market Cap: ${mcapStr}`,
          salePrice,
          allocation: token.circulating_supply ? `${token.circulating_supply.toLocaleString()} ${symbol}` : 'Public Circulation',
          totalRaised: `24h Vol: ${volStr}`,
          participantCount: token.market_cap_rank ? Math.max(100, 5000 - token.market_cap_rank * 30) : 1000,
          network: 'Multi-chain',
          progress: 100,
          launchType: 'presale',
          launchpadName: 'CoinGecko Launchpad Category',
          saleType: 'Launchpad Ecosystem Token',
          isEcosystem: false,
          isExternal: true,
          origin: 'external',
          source: 'CoinGecko Launchpad Category',
          externalUrl: `https://www.coingecko.com/en/coins/${token.id}`,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: token.last_updated || new Date().toISOString(),
        };
      }
    }

    const rankId = cleanId.replace(/^rank-/, '');
    const rankRes = await cryptoRankClient.getPublicSaleById(rankId).catch(() => null);
    if (rankRes?.data) {
      const item = rankRes.data;
      const rawStatus = (item.status || item.saleStatus || '').toLowerCase();
      let status: 'live' | 'scheduled' | 'ended' | 'finalized' = 'live';
      if (rawStatus.includes('upcom') || rawStatus.includes('sched')) status = 'scheduled';
      else if (rawStatus.includes('final')) status = 'finalized';
      else if (rawStatus.includes('end') || rawStatus.includes('past') || rawStatus.includes('conclud')) status = 'ended';

      const slug = item.slug || String(item.id);
      const symbol = item.symbol ? String(item.symbol).toUpperCase() : 'TOKEN';
      const name = item.name || slug;
      const saleType = item.type || 'IDO';
      const title = `${name} (${symbol}) ${saleType}`;
      const network = item.network || item.blockchain || 'Ethereum';
      const launchpadName = item.launchpads?.[0]?.name || `${saleType} Offering`;

      const priceVal = typeof item.price === 'number' ? item.price : (item.price?.value ?? null);
      const salePrice = priceVal ? `$${priceVal < 0.01 ? priceVal.toFixed(4) : priceVal.toFixed(2)}` : 'TBD';

      const hardCapNum = typeof item.hardCap === 'number' ? item.hardCap : 0;
      const raisedNum = typeof item.raised === 'number' ? item.raised : (status === 'ended' || status === 'finalized' ? hardCapNum : 0);

      const hardCap = hardCapNum > 0 ? `$${hardCapNum.toLocaleString()}` : 'TBD';
      const totalRaised = raisedNum > 0 ? `$${raisedNum.toLocaleString()}` : '$0';
      const progress = hardCapNum > 0 ? Math.min(100, Math.round((raisedNum / hardCapNum) * 100)) : 0;

      return {
        id: `rank-${item.id || slug}`,
        providerId: String(item.id),
        providerName: 'CryptoRank',
        title,
        name,
        token: symbol,
        tokenId: symbol.toLowerCase(),
        description: item.description || `Public ${saleType} offering for ${name} (${symbol}) hosted on ${launchpadName}.`,
        logo: item.icon || item.logo,
        image: item.icon || item.logo || '/artwork/copper-signal-1.svg',
        banner: '/artwork/copper-signal-banner.svg',
        bannerImage: '/artwork/copper-signal-banner.svg',
        category: item.category || `${saleType} Offering`,
        ownerAddress: '0x0000000000000000000000000000000000000000',
        status,
        startDate: item.startDate,
        startTime: item.startDate,
        endDate: item.endDate,
        endTime: item.endDate,
        hardCap,
        softCap: typeof item.softCap === 'number' && item.softCap > 0 ? `$${item.softCap.toLocaleString()}` : undefined,
        fundraisingGoal: hardCap,
        salePrice,
        allocation: symbol ? `1,000,000 ${symbol}` : 'Public Allocation',
        totalRaised,
        participantCount: 0,
        network,
        progress,
        launchType: 'presale' as const,
        launchpadName,
        saleType,
        isEcosystem: false,
        isExternal: true,
        origin: 'external' as const,
        source: 'CryptoRank Public Sales',
        createdAt: item.startDate || '2024-01-01T00:00:00.000Z',
        updatedAt: item.endDate || new Date().toISOString(),
      };
    }

    return null;
  }

  async listFairLaunches(
    filters?: LaunchpadFilters,
    pagination?: PaginationParams,
    sort?: LaunchpadSortParams
  ): Promise<PaginatedResult<FairLaunch>> {
    const localRes = await localDataProvider.launchpad.listFairLaunches(filters, pagination, sort);
    const mappedItems: FairLaunch[] = (localRes.items || []).map((f) => ({
      ...f,
      isEcosystem: true,
      isExternal: false,
      origin: (f.origin || 'ecosystem') as 'ecosystem' | 'session',
      source: f.source || 'HorizonX Ecosystem (Simulated)',
    }));

    return {
      items: mappedItems,
      pagination: localRes.pagination,
    };
  }

  async getFairLaunchById(id: string): Promise<FairLaunch | null> {
    const local = await localDataProvider.launchpad.getFairLaunchById(id);
    if (!local) return null;
    return {
      ...local,
      isEcosystem: true,
      isExternal: false,
      origin: (local.origin || 'ecosystem') as 'ecosystem' | 'session',
      source: local.source || 'HorizonX Ecosystem (Simulated)',
    };
  }

  async search(query: string, limit = 10): Promise<LaunchpadItem[]> {
    const list = await this.listAll({ search: query }, { page: 1, pageSize: limit });
    return list.items;
  }
}

export class HybridDataProvider implements IDataProvider {
  readonly id = 'hybrid';
  readonly name = 'Hybrid Provider (CoinMarketCap + DefiLlama + CryptoRank + HorizonX Ecosystem)';

  public tokens: ITokenProvider;
  public market: IMarketProvider;
  public exchange: IExchangeProvider;
  public projects: IProjectProvider;
  public staking: IStakingProvider;
  public airdrops: IAirdropProvider;
  public launchpad: ILaunchpadProvider;

  // Local ecosystem domains strictly preserved on local provider
  public partners: IPartnerProvider = localDataProvider.partners;
  public news: INewsProvider = localDataProvider.news;

  constructor() {
    this.tokens = new HybridTokenProvider();
    this.market = new HybridMarketProvider();
    this.exchange = new HybridExchangeProvider();
    this.projects = new HybridProjectProvider();
    this.staking = new HybridStakingProvider();
    this.airdrops = new HybridAirdropProvider();
    this.launchpad = new HybridLaunchpadProvider();
  }
}

export const hybridDataProvider = new HybridDataProvider();


