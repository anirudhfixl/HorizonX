/**
 * Unit & Integration Test Suite for HorizonX Phase 1: Live Market Data Integration.
 * Validates CoinMarketCap proxy handler, CMC client, HybridDataProvider, and fallback logic.
 */

import { handleMarketRequest } from '../../api/market-handler';
import { cmcClient } from '../api/client/cmc-client';
import { hybridDataProvider } from '../api/providers/hybrid-provider';
import { localDataProvider } from '../api/providers/local-provider';
import { getActiveProvider, setActiveProvider, DATA_CONFIG } from '../api/config/data-config';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

async function runTests() {
  console.log('\n==========================================');
  console.log('HORIZONX — PHASE 1: COINMARKETCAP & HYBRID PROVIDER TESTS');
  console.log('==========================================\n');

  // --- 1. Serverless API Proxy Security & Status ---
  console.log('--- 1. Serverless API Proxy Security & Status ---');
  let mockStatusRes: any = {};
  const mockRes = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    setHeader(k: string, v: string) { this.headers[k] = v; },
    status(code: number) { this.statusCode = code; return this; },
    json(data: any) { mockStatusRes = data; return this; },
    end(data?: any) { if (data) mockStatusRes = JSON.parse(data); },
  };

  await handleMarketRequest({ method: 'GET', query: { action: 'status' } }, mockRes);
  assert(mockStatusRes.success === true, 'Proxy status endpoint returns success: true');
  assert(mockStatusRes.provider === 'CoinMarketCap', 'Proxy reports CoinMarketCap provider');
  assert(mockStatusRes.apiKey === undefined, 'Proxy never echoes API key in response');

  // Test unconfigured key fallback
  const origKey = process.env.COINMARKETCAP_API_KEY;
  delete process.env.COINMARKETCAP_API_KEY;

  let unconfiguredRes: any = {};
  const mockRes2 = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    setHeader(k: string, v: string) { this.headers[k] = v; },
    status(code: number) { this.statusCode = code; return this; },
    json(data: any) { unconfiguredRes = data; return this; },
    end(data?: any) { if (data) unconfiguredRes = JSON.parse(data); },
  };

  await handleMarketRequest({ method: 'GET', query: { action: 'overview' } }, mockRes2);
  assert(unconfiguredRes.success === false, 'Returns non-fatal failure when API key is unconfigured');
  assert(unconfiguredRes.error === 'COINMARKETCAP_API_KEY_NOT_CONFIGURED', 'Returns clean error code for unconfigured key');
  assert(unconfiguredRes.configured === false, 'Reports configured: false cleanly');

  // Restore env if was set
  if (origKey) process.env.COINMARKETCAP_API_KEY = origKey;

  // --- 2. HybridDataProvider Architecture & Domain Delegation ---
  console.log('\n--- 2. HybridDataProvider Architecture & Domain Delegation ---');
  assert(hybridDataProvider.id === 'hybrid', "HybridDataProvider id is 'hybrid'");
  assert(typeof hybridDataProvider.name === 'string', 'HybridDataProvider has descriptive name');

  // Projects provider preserves local ecosystem projects alongside external protocols
  const projects = await hybridDataProvider.projects.list();
  assert(projects.items.length > 0, `Projects list returns ${projects.items.length} projects`);
  assert(projects.items.some((p) => p.id === 'prominers-dao'), 'Projects preserves local ecosystem projects');

  // Airdrops provider preserves local ecosystem airdrops alongside external drops
  const airdrops = await hybridDataProvider.airdrops.list();
  assert(airdrops.items.length > 0, `Airdrops list returns ${airdrops.items.length} campaigns`);
  assert(airdrops.items.some((a) => a.id === 'air-pmin-genesis'), 'Airdrops preserves local ecosystem airdrops');

  // Launchpad provider preserves local ecosystem offerings alongside external sales
  const presales = await hybridDataProvider.launchpad.listPresales();
  assert(presales.items.length > 0, `Launchpad presales list returns ${presales.items.length} presales`);
  assert(presales.items.some((p) => p.id === 'ps-prominers-genesis'), 'Launchpad preserves local ecosystem presales');

  // Staking provider preserves local ecosystem vaults alongside external yield pools
  const pools = await hybridDataProvider.staking.listPools();
  assert(pools.items.length > 0, `Staking pools list returns ${pools.items.length} pools`);
  assert(pools.items.some((p) => p.id === 'pool-pmin-single'), 'Staking preserves local ecosystem vaults');

  // Partners strictly delegated to local provider
  assert(hybridDataProvider.partners === localDataProvider.partners, 'Partners provider is strictly delegated to localDataProvider.partners');
  const partners = await hybridDataProvider.partners.list();
  assert(partners.items.length > 0, `Partners list returns ${partners.items.length} partners`);

  // News strictly delegated to local provider
  assert(hybridDataProvider.news === localDataProvider.news, 'News provider is strictly delegated to localDataProvider.news');

  // --- 3. Token & Market Fallback Handling ---
  console.log('\n--- 3. Token & Market Fallback Handling ---');
  // With no live network in test runner, tokens fallback gracefully to local ecosystem tokens
  const tokensResult = await hybridDataProvider.tokens.list();
  assert(tokensResult.items.length > 0, `Hybrid token list returns ${tokensResult.items.length} tokens`);

  const pminToken = await hybridDataProvider.tokens.getById('prominers');
  assert(pminToken !== null, 'Ecosystem token prominers is resolved by HybridTokenProvider');
  assert(pminToken?.symbol === 'PMIN', 'Ecosystem token symbol is PMIN');

  const marketOverview = await hybridDataProvider.market.getOverview();
  assert(typeof marketOverview.volume24h === 'number', 'Market overview volume24h is a valid number');
  assert(typeof marketOverview.totalLiquidity === 'number', 'Market overview totalLiquidity is a valid number');
  assert(Boolean(marketOverview.topGainer.symbol), 'Market overview has topGainer symbol');

  // --- 4. Centralized Provider Registry & Configuration ---
  console.log('\n--- 4. Centralized Provider Registry & Configuration ---');
  assert(DATA_CONFIG.activeProvider === 'local', "Default active provider configuration is 'local'");
  const current = getActiveProvider();
  assert(current.id === 'local', "Active provider singleton is 'local'");

  setActiveProvider('hybrid');
  assert(getActiveProvider().id === 'hybrid', 'Can dynamically switch active provider to hybrid');

  setActiveProvider('local');
  assert(getActiveProvider().id === 'local', 'Can dynamically switch active provider back to local');

  console.log('\n==========================================');
  console.log('✅ ALL PHASE 1 COINMARKETCAP & HYBRID TESTS PASSED');
  console.log('==========================================\n');
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

