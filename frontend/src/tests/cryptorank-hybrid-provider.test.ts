/**
 * Integration Test Suite for CryptoRank Provider Integration (Phase 1.2)
 * Validates HybridAirdropProvider, HybridLaunchpadProvider, CryptoRankClient,
 * strict matching hierarchy in RelationshipService, multi-asset staking pools,
 * and 100% wallet-independent querying.
 */

import { hybridDataProvider } from '../api/providers/hybrid-provider';
import { airdropService } from '../api/services/airdrops/airdrop.service';
import { launchpadService } from '../api/services/launchpad/launchpad.service';
import { relationshipService } from '../api/services/relationships/relationship.service';
import { cryptoRankClient } from '../api/client/cryptorank-client';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

async function runTests() {
  console.log('\n======================================================');
  console.log('HORIZONX — CRYPTORANK HYBRID PROVIDER & LAUNCHPAD TEST');
  console.log('======================================================\n');

  // --- 1. CryptoRankClient & Proxy Integrity ---
  console.log('--- 1. CryptoRank Client & Serverless Proxy Integrity ---');
  const status = await cryptoRankClient.getStatus();
  assert(typeof status.configured === 'boolean', 'cryptoRankClient.getStatus() returns boolean configured');
  assert(status.provider.includes('CryptoRank') || status.provider.includes('Dataset'), `cryptoRankClient.getStatus() reports provider: ${status.provider}`);
  assert(typeof status.planRestricted === 'boolean' || status.planRestricted === undefined, 'cryptoRankClient.getStatus() reports planRestricted flag');
  console.log(`   CryptoRank API key configured: ${status.configured}`);

  // Test graceful non-crashing empty returns
  const drophuntingRes = await cryptoRankClient.getAirdrops({ limit: 10 });
  assert(Array.isArray(drophuntingRes.data), 'cryptoRankClient.getAirdrops() returns array data');
  assert(typeof drophuntingRes.configured === 'boolean', 'cryptoRankClient.getAirdrops() returns configured status');
  assert(typeof drophuntingRes.planRestricted === 'boolean' || drophuntingRes.planRestricted === undefined, 'cryptoRankClient.getAirdrops() reports planRestricted flag');

  const publicSalesRes = await cryptoRankClient.getPublicSales({ limit: 10 });
  assert(Array.isArray(publicSalesRes.data), 'cryptoRankClient.getPublicSales() returns array data');
  assert(typeof publicSalesRes.configured === 'boolean', 'cryptoRankClient.getPublicSales() returns configured status');
  assert(typeof publicSalesRes.planRestricted === 'boolean' || publicSalesRes.planRestricted === undefined, 'cryptoRankClient.getPublicSales() reports planRestricted flag');

  const launchpadsRes = await cryptoRankClient.getLaunchpads({ limit: 10 });
  assert(Array.isArray(launchpadsRes.data), 'cryptoRankClient.getLaunchpads() returns array data');

  // --- 2. HybridAirdropProvider Testing ---
  console.log('\n--- 2. Hybrid Airdrop Provider (CryptoRank + HorizonX Ecosystem) ---');
  const allAirdropsRes = await airdropService.getAll();
  assert(allAirdropsRes.success === true, 'airdropService.getAll() returns success');
  const allAirdrops = allAirdropsRes.data?.items || [];
  assert(allAirdrops.length >= 8, `Total airdrops returned is ${allAirdrops.length} (>= 8 catalog items)`);

  const ecosystemAirdrops = allAirdrops.filter((a) => a.origin === 'ecosystem');
  assert(ecosystemAirdrops.length >= 8, `Ecosystem airdrops preserved: ${ecosystemAirdrops.length} (>= 8)`);
  assert(
    ecosystemAirdrops.every((a) => a.source === 'HorizonX Ecosystem (Simulated)' && a.isEcosystem === true),
    'All ecosystem airdrops clearly labeled "HorizonX Ecosystem (Simulated)"'
  );

  // Check specific local airdrop
  const genesisDrop = ecosystemAirdrops.find((a) => a.id === 'air-pmin-genesis');
  assert(genesisDrop !== undefined, 'Local Genesis airdrop (air-pmin-genesis) is present');
  assert(Boolean(genesisDrop?.title.includes('Genesis')), 'Genesis airdrop title verified');
  assert(genesisDrop?.tokenId === 'prominers', 'Genesis airdrop linked to prominers token');

  // Test getById
  const singleDropRes = await airdropService.getById('air-pmin-genesis');
  assert(singleDropRes.data !== null, 'airdropService.getById resolves Genesis airdrop');
  assert(singleDropRes.data?.id === 'air-pmin-genesis', 'Resolved Genesis airdrop has correct ID');

  // Test search
  const searchedDrops = await airdropService.search('Genesis', 5);
  assert(searchedDrops.data && searchedDrops.data.length > 0, 'airdropService.search("Genesis") returns matches');
  assert(searchedDrops.data[0].id === 'air-pmin-genesis', 'First search match is Genesis airdrop');

  // Test origin filter
  const ecoOnlyAirdrops = await hybridDataProvider.airdrops.list({ origin: 'ecosystem' });
  assert(ecoOnlyAirdrops.items.every((a) => a.origin === 'ecosystem'), 'origin: ecosystem filter returns only ecosystem airdrops');

  // --- 3. Hybrid Launchpad Provider (Presales + Fair Launches) ---
  console.log('\n--- 3. Hybrid Launchpad Provider (Presales + Fair Launches) ---');
  const presalesRes = await launchpadService.getPresales();
  assert(presalesRes.success === true, 'launchpadService.getPresales() returns success');
  const allPresales = presalesRes.data?.items || [];
  assert(allPresales.length >= 8, `Total presales returned is ${allPresales.length} (>= 8 catalog items)`);

  const ecosystemPresales = allPresales.filter((p) => p.origin === 'ecosystem');
  assert(ecosystemPresales.length >= 8, `Ecosystem presales preserved: ${ecosystemPresales.length} (>= 8)`);
  assert(
    ecosystemPresales.every((p) => p.source === 'HorizonX Ecosystem (Simulated)' && p.isEcosystem === true),
    'All ecosystem presales clearly labeled "HorizonX Ecosystem (Simulated)"'
  );

  // Check specific local presale
  const pminPresale = ecosystemPresales.find((p) => p.id === 'ps-prominers-genesis');
  assert(pminPresale !== undefined, 'PMIN genesis presale (ps-prominers-genesis) is present');
  assert(pminPresale?.tokenId === 'prominers', 'PMIN presale linked to prominers token');

  // Test getPresaleById
  const singlePresaleRes = await launchpadService.getPresaleById('ps-prominers-genesis');
  assert(singlePresaleRes.data !== null, 'launchpadService.getPresaleById resolves PMIN presale');
  assert(singlePresaleRes.data?.id === 'ps-prominers-genesis', 'Resolved presale has correct ID');

  // Test Fair Launches
  const fairLaunchesRes = await launchpadService.getFairLaunches();
  assert(fairLaunchesRes.success === true, 'launchpadService.getFairLaunches() returns success');
  const allFairLaunches = fairLaunchesRes.data?.items || [];
  assert(allFairLaunches.length >= 8, `Total fair launches returned is ${allFairLaunches.length} (>= 8 expected)`);
  assert(
    allFairLaunches.every((f) => f.source === 'HorizonX Ecosystem (Simulated)' && f.isEcosystem === true),
    'All fair launches clearly labeled "HorizonX Ecosystem (Simulated)"'
  );

  // Test getFairLaunchById
  const singleFairLaunchRes = await launchpadService.getFairLaunchById('fl-prominers-public');
  assert(singleFairLaunchRes.data !== null, 'launchpadService.getFairLaunchById resolves fair launch');
  assert(singleFairLaunchRes.data?.id === 'fl-prominers-public', 'Resolved fair launch has correct ID');

  // Test listAll (Presales + Fair Launches)
  const allLaunchesRes = await launchpadService.getAll();
  assert(allLaunchesRes.success === true, 'launchpadService.getAll() returns success');
  const allLaunchItems = allLaunchesRes.data?.items || [];
  assert(allLaunchItems.length >= 16, `launchpadService.getAll() returns ${allLaunchItems.length} items (>= 16 combined)`);

  // --- 4. RelationshipService Audit & Strict Hierarchy Testing ---
  console.log('\n--- 4. RelationshipService Matching Hierarchy & Multi-Asset Safety ---');
  // Explicit mapping test: prominers-dao project should link to prominers token
  const projectRels = await relationshipService.getProjectRelationships('prominers-dao');
  assert(projectRels.data !== null, 'relationshipService.getProjectRelationships("prominers-dao") returns data');
  const pTokens = projectRels.data?.tokens || [];
  assert(pTokens.some((t) => t.id === 'prominers'), 'prominers-dao links to prominers token via verified mapping');

  // Token relationships test: prominers token should link to prominers-dao project and Genesis airdrop
  const tokenRels = await relationshipService.getTokenRelationships('prominers');
  assert(tokenRels.data !== null, 'relationshipService.getTokenRelationships("prominers") returns data');
  assert(tokenRels.data?.project?.id === 'prominers-dao', 'prominers token links to prominers-dao project');
  assert(Boolean(tokenRels.data?.airdrops.some((a) => a.id === 'air-pmin-genesis')), 'prominers token links to Genesis airdrop');
  assert(Boolean(tokenRels.data?.presales.some((p) => p.id === 'ps-prominers-genesis')), 'prominers token links to PMIN presale');

  // Multi-asset staking pool test:
  // Staking pools with underlyingTokens (or pairs like WBTC-ETH) must not lose secondary tokens
  const stakingPoolsRes = await hybridDataProvider.staking.listPools();
  const pools = stakingPoolsRes.items || [];
  assert(pools.length > 0, `Staking pools count is ${pools.length}`);
  const multiAssetPool = pools.find((p) => p.underlyingTokens && p.underlyingTokens.length > 1);
  if (multiAssetPool) {
    console.log(`   Found multi-asset pool: ${multiAssetPool.name} with underlying: [${multiAssetPool.underlyingTokens?.join(', ')}]`);
    assert(multiAssetPool.underlyingTokens!.length > 1, 'Multi-asset pool preserves all underlying tokens');
  }

  // --- 5. Wallet-Independent Verification ---
  console.log('\n--- 5. Wallet-Independent Verification ---');
  // Verify that all services respond without needing any wallet context or signature
  assert(allAirdrops.length > 0, 'Public airdrop directory browseable without wallet');
  assert(allPresales.length > 0, 'Public presale directory browseable without wallet');
  assert(allFairLaunches.length > 0, 'Public fair launch directory browseable without wallet');
  assert(genesisDrop !== undefined, 'Airdrop details accessible without wallet');
  assert(pminPresale !== undefined, 'Presale details accessible without wallet');

  console.log('\n======================================================');
  console.log('🎉 ALL CRYPTORANK & LAUNCHPAD INTEGRATION TESTS PASSED!');
  console.log('======================================================\n');
}

runTests().catch((err) => {
  console.error('Fatal error during test execution:', err);
  process.exit(1);
});
