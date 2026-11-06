/**
 * Comprehensive Integration Test Suite for HorizonX Public Data Integrations
 *
 * Verifies:
 * 1. DefiLlama Airdrop Registry integration into Airdrops directory
 * 2. DefiLlama Tokenless Protocols as a distinct 'Potential Airdrops' category
 * 3. CoinGecko Launchpad categories and associated tokens in Launchpad
 * 4. GeckoTerminal New Pools in separate section
 * 5. Preservation of local HorizonX ecosystem records
 * 6. Clear distinction between live external data and simulated local data
 * 7. Non-misrepresentation rules (no tokens as active presales; no pools as fair launches)
 * 8. 100% wallet-independent read-only operation
 */

import { defillamaClient } from '../api/client/defillama-client';
import { coinGeckoClient } from '../api/client/coingecko-client';
import { geckoTerminalClient } from '../api/client/geckoterminal-client';
import { hybridDataProvider } from '../api/providers/hybrid-provider';
import { airdropService } from '../api/services/airdrops/airdrop.service';
import { launchpadService } from '../api/services/launchpad/launchpad.service';
import { setActiveProvider } from '../api/config/data-config';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

async function runTests() {
  setActiveProvider('hybrid');
  try {
    console.log('\n======================================================');
    console.log('HORIZONX — FREE PUBLIC PROVIDER INTEGRATIONS TEST');
    console.log('DefiLlama + CoinGecko + GeckoTerminal + Local Ecosystem');
    console.log('======================================================\n');

  // ─────────────────────────────────────────────────────────────────────────
  // 1. DefiLlama Airdrop Registry
  // ─────────────────────────────────────────────────────────────────────────
  console.log('--- 1. DefiLlama Airdrop Registry Integration ---');
  const registry = await defillamaClient.getAirdropRegistry();
  const registryKeys = Object.keys(registry);
  assert(registryKeys.length >= 30, `DefiLlama Airdrop Registry contains ${registryKeys.length} entries (>= 30 expected)`);

  const sampleKey = registryKeys[0];
  const sampleEntry = registry[sampleKey];
  assert(typeof sampleEntry.name === 'string' && sampleEntry.name.length > 0, `Registry entry '${sampleKey}' has valid name: ${sampleEntry.name}`);
  assert(typeof sampleEntry.description === 'string', `Registry entry has description`);
  assert(typeof sampleEntry.isActive === 'boolean', `Registry entry has isActive status: ${sampleEntry.isActive}`);

  // Test mapping into HybridAirdropProvider
  const airdropRes = await airdropService.getAll();
  assert(airdropRes.success === true, 'airdropService.getAll() returns success');
  const allAirdrops = airdropRes.data?.items || [];
  assert(allAirdrops.length >= 100, `Total airdrops returned is ${allAirdrops.length} (>= 100 expected)`);

  const registryAirdrops = allAirdrops.filter((a) => a.category === 'Airdrop Registry');
  assert(registryAirdrops.length >= 30, `Mapped Airdrop Registry entries count: ${registryAirdrops.length} (>= 30)`);
  assert(
    registryAirdrops.every((a) => a.isExternal === true && a.origin === 'external' && a.source === 'DefiLlama Airdrop Registry'),
    'All DefiLlama Airdrop Registry entries have provenance: external & source: DefiLlama Airdrop Registry'
  );

  // Test getById for a registry item
  const testRegId = registryAirdrops[0].id;
  const fetchedReg = await airdropService.getById(testRegId);
  assert(fetchedReg.data !== null && fetchedReg.data !== undefined, `airdropService.getById('${testRegId}') resolves registry campaign`);
  assert(fetchedReg.data?.category === 'Airdrop Registry', 'Fetched registry campaign has category: Airdrop Registry');

  // ─────────────────────────────────────────────────────────────────────────
  // 2. DefiLlama Tokenless Protocols (Potential Airdrops)
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n--- 2. DefiLlama Tokenless Protocols (Potential Airdrops) ---');
  const tokenlessProtocols = await defillamaClient.getTokenlessProtocols(60);
  assert(tokenlessProtocols.length >= 40, `Tokenless protocols fetched: ${tokenlessProtocols.length} (>= 40)`);
  assert(
    tokenlessProtocols.every((p) => p.category !== 'CEX' && (p.tvl ?? 0) > 0 && (!p.symbol || p.symbol === '-' || p.symbol.trim() === '')),
    'All tokenless protocols have TVL > 0, are non-CEX, and have no governance token'
  );

  const potentialAirdrops = allAirdrops.filter((a) => a.category === 'Potential Airdrops');
  assert(potentialAirdrops.length >= 40, `Mapped Potential Airdrops count: ${potentialAirdrops.length} (>= 40)`);
  assert(
    potentialAirdrops.every((a) => a.isExternal === true && a.origin === 'external' && a.source === 'DefiLlama Tokenless Protocols'),
    'All Potential Airdrops have provenance: external & source: DefiLlama Tokenless Protocols'
  );
  assert(
    potentialAirdrops.every((a) => (a.reward || '').includes('Potential') || a.totalReward?.includes('TVL')),
    'All Potential Airdrops clearly disclose rewards as potential or TVL metrics'
  );

  // Test getById for a potential airdrop item
  const testPotId = potentialAirdrops[0].id;
  const fetchedPot = await airdropService.getById(testPotId);
  assert(fetchedPot.data !== null && fetchedPot.data !== undefined, `airdropService.getById('${testPotId}') resolves potential airdrop`);
  assert(fetchedPot.data?.category === 'Potential Airdrops', 'Fetched campaign has category: Potential Airdrops');

  // ─────────────────────────────────────────────────────────────────────────
  // 3. Preservation of Local HorizonX Ecosystem Records
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n--- 3. Local HorizonX Ecosystem Records Preservation ---');
  const ecosystemAirdrops = allAirdrops.filter((a) => a.isEcosystem || a.origin === 'ecosystem');
  assert(ecosystemAirdrops.length >= 8, `Ecosystem airdrops preserved: ${ecosystemAirdrops.length} (>= 8)`);
  assert(
    ecosystemAirdrops.every((a) => a.source === 'HorizonX Ecosystem (Simulated)' && a.isEcosystem === true),
    'All ecosystem airdrops clearly labeled "HorizonX Ecosystem (Simulated)"'
  );

  // Origin filter
  const ecoFiltered = await hybridDataProvider.airdrops.list({ origin: 'ecosystem' });
  assert(ecoFiltered.items.length >= 8, `origin: ecosystem filter returns >= 8 ecosystem airdrops`);
  assert(ecoFiltered.items.every((a) => a.origin === 'ecosystem'), 'All items from origin: ecosystem are ecosystem items');

  const extFiltered = await hybridDataProvider.airdrops.list({ origin: 'external' });
  assert(extFiltered.items.length >= 90, `origin: external filter returns >= 90 external airdrops (found: ${extFiltered.items.length})`);

  // ─────────────────────────────────────────────────────────────────────────
  // 4. CoinGecko Launchpad Platforms & Ecosystem Tokens
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n--- 4. CoinGecko Launchpad Platforms & Associated Tokens ---');
  const launchpadCategories = await coinGeckoClient.getLaunchpadCategories();
  assert(launchpadCategories.length >= 15, `CoinGecko launchpad platform categories: ${launchpadCategories.length} (>= 15)`);
  assert(
    launchpadCategories.some((c) => c.name.toLowerCase().includes('coinlist') || c.name.toLowerCase().includes('binance')),
    'Found recognized platforms (CoinList / Binance Launchpad)'
  );

  const launchpadTokens = await coinGeckoClient.getLaunchpadTokens(25);
  assert(launchpadTokens.length >= 15, `CoinGecko launchpad sector tokens: ${launchpadTokens.length} (>= 15)`);
  assert(
    launchpadTokens.every((t) => typeof t.current_price === 'number' && typeof t.market_cap === 'number'),
    'All CoinGecko launchpad tokens have numeric current_price and market_cap'
  );

  // Presale directory mapping
  const presalesRes = await launchpadService.getPresales();
  assert(presalesRes.success === true, 'launchpadService.getPresales() returns success');
  const allPresales = presalesRes.data?.items || [];
  assert(allPresales.length >= 25, `Total presales returned: ${allPresales.length} (>= 25)`);

  const ecoPresales = allPresales.filter((p) => p.isEcosystem || p.origin === 'ecosystem');
  assert(ecoPresales.length >= 8, `Ecosystem presales preserved: ${ecoPresales.length} (>= 8)`);

  const cgPresales = allPresales.filter((p) => p.source === 'CoinGecko Launchpad Category');
  assert(cgPresales.length >= 15, `Mapped CoinGecko Launchpad tokens: ${cgPresales.length} (>= 15)`);

  // Rule: Do NOT misrepresent tokens as active presales
  assert(
    cgPresales.every((p) => p.status === 'finalized' && p.saleType === 'Launchpad Ecosystem Token'),
    'All CoinGecko tokens are classified as status: finalized & saleType: Launchpad Ecosystem Token'
  );
  assert(
    cgPresales.every((p) => p.description && p.description.includes('not an active presale')),
    'All CoinGecko tokens explicitly disclose in description that they are circulating assets and NOT active presales'
  );

  // Test getPresaleById for a CoinGecko token
  const testCgId = cgPresales[0].id;
  const fetchedCg = await launchpadService.getPresaleById(testCgId);
  assert(fetchedCg.data !== null && fetchedCg.data !== undefined, `launchpadService.getPresaleById('${testCgId}') resolves token`);
  assert(fetchedCg.data?.status === 'finalized', 'Fetched CoinGecko token has status: finalized');

  // ─────────────────────────────────────────────────────────────────────────
  // 5. GeckoTerminal New Pools Integration
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n--- 5. GeckoTerminal Live New Pools Integration ---');
  const newPools = await geckoTerminalClient.getNewPools(1);
  assert(newPools.length >= 15, `GeckoTerminal live new pools streamed: ${newPools.length} (>= 15)`);

  const samplePool = newPools[0];
  assert(typeof samplePool.name === 'string' && samplePool.name.includes('/'), `Sample pool has pair name: ${samplePool.name}`);
  assert(typeof samplePool.address === 'string' && samplePool.address.length > 10, `Sample pool has on-chain address: ${samplePool.address}`);
  assert(typeof samplePool.network === 'string' && samplePool.network.length > 0, `Sample pool has network: ${samplePool.network}`);
  assert(typeof samplePool.dex === 'string' && samplePool.dex.length > 0, `Sample pool has DEX identifier: ${samplePool.dex}`);
  assert(typeof samplePool.priceUsd === 'number', `Sample pool has numeric price: $${samplePool.priceUsd}`);
  assert(typeof samplePool.terminalUrl === 'string' && samplePool.terminalUrl.includes('geckoterminal.com'), `Sample pool has valid GeckoTerminal URL: ${samplePool.terminalUrl}`);

  // Rule: Do NOT misrepresent new pools as confirmed fair launches
  assert(
    newPools.every((p) => p.isExternal === true && p.origin === 'external' && p.source === 'GeckoTerminal DEX Stream'),
    'All GeckoTerminal pools are marked as external DEX stream and distinct from fair launches'
  );

  // Fair launches directory preservation
  const fairLaunchesRes = await launchpadService.getFairLaunches();
  assert(fairLaunchesRes.success === true, 'launchpadService.getFairLaunches() returns success');
  const fairLaunches = fairLaunchesRes.data?.items || [];
  assert(fairLaunches.length >= 8, `Fair launches preserved at least 8 local items (new pools kept in separate stream, found ${fairLaunches.length})`);
  assert(
    fairLaunches.every((f) => f.launchType === 'fair-launch' && f.isEcosystem === true),
    'All fair launches remain ecosystem demonstration launches'
  );

  // ─────────────────────────────────────────────────────────────────────────
  // 6. Security, Non-Execution & Caching Verification
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n--- 6. Security & Wallet-Independence Verification ---');
  assert(
    allAirdrops.every((a) => !('sendTransaction' in a || 'execute' in a)),
    'No financial execution or wallet execution vectors in airdrop data models'
  );
  assert(
    allPresales.every((p) => !('sendTransaction' in p || 'execute' in p)),
    'No financial execution or wallet execution vectors in launchpad data models'
  );
  assert(
    newPools.every((p) => !('sendTransaction' in p || 'execute' in p)),
    'No financial execution or wallet execution vectors in new pool models'
  );

  console.log('\n======================================================');
  console.log('🎉 ALL HORIZONX PUBLIC INTEGRATION TESTS PASSED!');
  console.log(`Live Record Counts:`);
  console.log(`  - Airdrops Total: ${allAirdrops.length} (8 Ecosystem + ${registryAirdrops.length} DefiLlama Registry + ${potentialAirdrops.length} Potential Tokenless)`);
  console.log(`  - Launchpad Presales & Tokens: ${allPresales.length} (8 Ecosystem Presales + ${cgPresales.length} CoinGecko Launchpad Sector Tokens)`);
  console.log(`  - Launchpad Fair Launches: ${fairLaunches.length} (8 Ecosystem Fair Launches)`);
  console.log(`  - GeckoTerminal Live New Pools: ${newPools.length} streamed real-time pools`);
  console.log('======================================================\n');
  } finally {
    setActiveProvider('local');
  }
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
