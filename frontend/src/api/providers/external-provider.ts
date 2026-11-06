// External Data Provider placeholder and integration contract
// Defines typed specifications for future CoinGecko, CoinMarketCap, and Alchemy providers
// without making unauthorized external requests or inventing fake endpoints.

import type { IDataProvider } from './data-provider';
import { ApiError } from '../client/request';

export interface ExternalApiConfig {
  coinGeckoApiKey?: string;
  coinGeckoApiUrl?: string;
  coinMarketCapApiKey?: string;
  alchemyApiKey?: string;
  alchemyRpcUrl?: string;
  enabled: boolean;
}

export class ExternalDataProvider implements IDataProvider {
  readonly id = 'external';
  readonly name = 'External Web2/Web3 API Provider';
  private config: ExternalApiConfig;

  constructor(config: Partial<ExternalApiConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? false,
      coinGeckoApiKey: config.coinGeckoApiKey,
      coinGeckoApiUrl: config.coinGeckoApiUrl,
      coinMarketCapApiKey: config.coinMarketCapApiKey,
      alchemyApiKey: config.alchemyApiKey,
      alchemyRpcUrl: config.alchemyRpcUrl,
    };
  }

  private notImplemented(service: string): never {
    throw new ApiError(
      `External provider for '${service}' is not configured yet. Set activeProvider to 'local' in data-config.ts or configure API keys for Phase 2 integration.`,
      501,
      'EXTERNAL_PROVIDER_NOT_IMPLEMENTED'
    );
  }

  get tokens() {
    return {
      list: async () => this.notImplemented('tokens.list'),
      getById: async () => this.notImplemented('tokens.getById'),
      search: async () => this.notImplemented('tokens.search'),
      getFeatured: async () => this.notImplemented('tokens.getFeatured'),
    };
  }

  get projects() {
    return {
      list: async () => this.notImplemented('projects.list'),
      getById: async () => this.notImplemented('projects.getById'),
      search: async () => this.notImplemented('projects.search'),
      getFeatured: async () => this.notImplemented('projects.getFeatured'),
    };
  }

  get airdrops() {
    return {
      list: async () => this.notImplemented('airdrops.list'),
      getById: async () => this.notImplemented('airdrops.getById'),
      search: async () => this.notImplemented('airdrops.search'),
    };
  }

  get launchpad() {
    return {
      listAll: async () => this.notImplemented('launchpad.listAll'),
      listPresales: async () => this.notImplemented('launchpad.listPresales'),
      getPresaleById: async () => this.notImplemented('launchpad.getPresaleById'),
      listFairLaunches: async () => this.notImplemented('launchpad.listFairLaunches'),
      getFairLaunchById: async () => this.notImplemented('launchpad.getFairLaunchById'),
      search: async () => this.notImplemented('launchpad.search'),
    };
  }

  get staking() {
    return {
      listPools: async () => this.notImplemented('staking.listPools'),
      getPoolById: async () => this.notImplemented('staking.getPoolById'),
      search: async () => this.notImplemented('staking.search'),
    };
  }

  get market() {
    return {
      getOverview: async () => this.notImplemented('market.getOverview'),
      listPairs: async () => this.notImplemented('market.listPairs'),
      getPairBySymbol: async () => this.notImplemented('market.getPairBySymbol'),
      getHistoricalData: async () => this.notImplemented('market.getHistoricalData'),
    };
  }

  get exchange() {
    return {
      getOverview: async () => this.notImplemented('exchange.getOverview'),
      listMarkets: async () => this.notImplemented('exchange.listMarkets'),
      getMarketByTokenId: async () => this.notImplemented('exchange.getMarketByTokenId'),
      getOrderBook: async () => this.notImplemented('exchange.getOrderBook'),
      getRecentTrades: async () => this.notImplemented('exchange.getRecentTrades'),
    };
  }

  get partners() {
    return {
      list: async () => this.notImplemented('partners.list'),
      getById: async () => this.notImplemented('partners.getById'),
      getProgramMetrics: async () => this.notImplemented('partners.getProgramMetrics'),
      getBenefits: async () => this.notImplemented('partners.getBenefits'),
    };
  }

  get news() {
    return {
      list: async () => this.notImplemented('news.list'),
      getById: async () => this.notImplemented('news.getById'),
    };
  }
}

export const externalDataProvider = new ExternalDataProvider();

