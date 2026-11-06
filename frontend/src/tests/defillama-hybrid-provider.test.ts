/**
 * Integration Test Suite for DefiLlama Provider Integration (Phase 1.1)
 * Validates HybridProjectProvider, HybridStakingProvider, provenance tags,
 * yield strategy categorization, and wallet-independent querying.
 */

import { hybridDataProvider } from '../api/providers/hybrid-provider';
import { projectService } from '../api/services/projects/project.service';
import { stakingService } from '../api/services/staking/staking.service';
import { relationshipService } from '../api/services/relationships/relationship.service';
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
    console.log('HORIZONX — DEFILLAMA HYBRID PROVIDER & PUBLIC DATA TEST');
    console.log('======================================================\n');

  // --- 1. HybridProjectProvider Testing ---
  console.log('--- 1. Hybrid Project Provider (DefiLlama Protocols + HorizonX Ecosystem) ---');
  const allProjectsRes = await projectService.getAll();
  assert(allProjectsRes.success === true, 'projectService.getAll() returns success');
  const allProjects = allProjectsRes.data?.items || [];
  assert(allProjects.length > 5, `Total projects returned is ${allProjects.length} (> 5)`);

  const ecosystemProjects = allProjects.filter((p) => p.origin === 'ecosystem');
  const externalProjects = allProjects.filter((p) => p.origin === 'external');
  assert(ecosystemProjects.length > 0, `Ecosystem projects preserved: ${ecosystemProjects.length}`);
  assert(externalProjects.length > 0, `External DefiLlama protocols integrated: ${externalProjects.length}`);

  // Check top DefiLlama protocols have real TVL figures
  const topExternal = externalProjects[0];
  assert(topExternal.tvl !== undefined && topExternal.tvl > 0, `Top protocol (${topExternal.name}) has valid TVL: $${topExternal.tvl}`);
  assert(topExternal.source === 'DefiLlama Protocols', `Top protocol has correct source tag: ${topExternal.source}`);
  assert(topExternal.origin === 'external', `Top protocol has origin 'external'`);

  // Check local ecosystem project properties
  const prominers = ecosystemProjects.find((p) => p.id === 'prominers-dao');
  assert(prominers !== undefined, 'Local project prominers-dao is found');
  assert(prominers?.origin === 'ecosystem', 'prominers-dao has origin: ecosystem');
  assert(prominers?.source === 'HorizonX Ecosystem (Simulated)', 'prominers-dao has source: HorizonX Ecosystem (Simulated)');

  // Test origin filtering
  const ecoOnly = await hybridDataProvider.projects.list({ origin: 'ecosystem' });
  assert(ecoOnly.items.every((p) => p.origin === 'ecosystem'), 'origin: ecosystem filter returns only ecosystem projects');

  const extOnly = await hybridDataProvider.projects.list({ origin: 'external' });
  assert(extOnly.items.every((p) => p.origin === 'external'), 'origin: external filter returns only external DefiLlama projects');

  // Test getById for ecosystem vs external
  const localGet = await projectService.getById('prominers-dao');
  assert(localGet.data !== null && localGet.data.id === 'prominers-dao', 'getById resolves local ecosystem project');

  const llamaGet = await projectService.getById(topExternal.id);
  assert(llamaGet.data !== null && llamaGet.data.id === topExternal.id, `getById resolves DefiLlama protocol: ${topExternal.id}`);

  // --- 2. HybridStakingProvider Testing ---
  console.log('\n--- 2. Hybrid Staking Provider (DefiLlama Yield Pools + HorizonX Ecosystem) ---');
  const allPoolsRes = await stakingService.getAll();
  assert(allPoolsRes.success === true, 'stakingService.getAll() returns success');
  const allPools = allPoolsRes.data?.items || [];
  assert(allPools.length > 5, `Total staking pools returned is ${allPools.length} (> 5)`);

  const ecosystemPools = allPools.filter((p) => p.origin === 'ecosystem');
  const externalPools = allPools.filter((p) => p.origin === 'external');
  assert(ecosystemPools.length > 0, `Ecosystem staking vaults preserved: ${ecosystemPools.length}`);
  assert(externalPools.length > 0, `External DefiLlama yield pools integrated: ${externalPools.length}`);

  // Check strategy categorization on external pools
  const topPool = externalPools[0];
  assert(topPool.tvlUsd !== undefined && topPool.tvlUsd > 0, `Top yield pool (${topPool.name}) has valid TVL: $${topPool.tvlUsd}`);
  assert(topPool.apyValue !== undefined && topPool.apyValue >= 0, `Top yield pool has valid APY: ${topPool.apy}`);
  assert(topPool.source === 'DefiLlama Yields', `Top pool has correct source tag: ${topPool.source}`);
  assert(
    ['Liquid Staking', 'Lending Market', 'Liquidity Pool', 'Yield Vault'].includes(topPool.category || ''),
    `Top pool strategy accurately categorized: ${topPool.category}`
  );

  // Check getPoolById for ecosystem vs external
  const localPoolGet = await stakingService.getById('pool-pmin-single');
  assert(localPoolGet.data !== null && localPoolGet.data.id === 'pool-pmin-single', 'getPoolById resolves local vault');

  const extPoolGet = await stakingService.getById(topPool.id);
  assert(extPoolGet.data !== null && extPoolGet.data.id === topPool.id, `getPoolById resolves DefiLlama yield pool: ${topPool.id}`);

  // --- 3. Relationship Integrity Check ---
  console.log('\n--- 3. Relationship Integrity & Cross-Ecosystem Linking ---');
  const relRes = await relationshipService.getProjectRelationships('prominers-dao');
  assert(relRes.success === true && relRes.data !== null, 'prominers-dao relationships successfully fetched');
  assert(relRes.data!.tokens.length > 0, `prominers-dao has ${relRes.data!.tokens.length} linked tokens`);
  assert(relRes.data!.stakingPools.length > 0, `prominers-dao has ${relRes.data!.stakingPools.length} linked staking pools`);

    console.log('\n======================================================');
    console.log('🎉 ALL DEFILLAMA HYBRID INTEGRATION TESTS PASSED!');
    console.log('======================================================\n');
  } finally {
    setActiveProvider('local');
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

