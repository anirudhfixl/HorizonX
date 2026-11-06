/**
 * Unit & Integration Test Suite for HorizonX Phase 1: Public Data Ecosystem.
 * Validates Cross-Ecosystem Relationship Service, Bidirectional Navigation,
 * Partner Directory, and Entity Resolution without wallet dependencies.
 */

import { relationshipService } from '../api/services/relationships/relationship.service';
import { partnerService } from '../api/services/partners/partner.service';
import { projectService } from '../api/services/projects/project.service';
import { tokenService } from '../api/services/tokens/token.service';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

async function runTests() {
  console.log('\n======================================================');
  console.log('HORIZONX — CROSS-ECOSYSTEM RELATIONSHIPS & PUBLIC DATA');
  console.log('======================================================\n');

  // --- 1. Project Relationships Verification ---
  console.log('--- 1. Project Relationships (Project -> Token, Airdrop, Launchpad, Staking, Partner) ---');
  const prominersRel = await relationshipService.getProjectRelationships('prominers-dao');
  assert(prominersRel.success === true, 'Project relationship query succeeds for prominers-dao');
  assert(prominersRel.data !== null, 'Relationship data is not null');
  assert(prominersRel.data?.project.name === 'HorizonX Foundation', 'Project name is HorizonX Foundation');
  assert(prominersRel.data?.tokens.some((t) => t.id === 'prominers') === true, 'Project links to token prominers ($PMIN)');
  assert(prominersRel.data?.airdrops.some((a) => a.id === 'air-pmin-genesis') === true, 'Project links to airdrop air-pmin-genesis');
  assert(prominersRel.data?.stakingPools.some((s) => s.id === 'pool-pmin-single') === true, 'Project links to staking pool pool-pmin-single');
  assert(prominersRel.data?.partners.some((p) => p.id === 'coinmarketcap-data') === true, 'Project links to partner CoinMarketCap');

  const auroraRel = await relationshipService.getProjectRelationships('aurora-labs');
  assert(auroraRel.success === true, 'Project relationship query succeeds for aurora-labs');
  assert(auroraRel.data?.tokens.some((t) => t.id === 'aurora-ai') === true, 'Aurora project links to aurora-ai token');
  assert(auroraRel.data?.partners.some((p) => p.id === 'aurora-systems') === true, 'Aurora project links to partner aurora-systems');

  const zkRel = await relationshipService.getProjectRelationships('zk-privacy-labs');
  assert(zkRel.success === true, 'Project relationship query succeeds for zk-privacy-labs');
  assert(zkRel.data?.tokens.some((t) => t.id === 'zkpv') === true, 'zkPrivacy project links to zkpv token');
  assert(zkRel.data?.partners.some((p) => p.id === 'zk-shields') === true, 'zkPrivacy project links to partner zk-shields');

  // --- 2. Token Relationships Verification ---
  console.log('\n--- 2. Token Relationships (Token -> Project, Airdrop, Launchpad, Staking, Partner) ---');
  const pminRel = await relationshipService.getTokenRelationships('prominers');
  assert(pminRel.success === true, 'Token relationship query succeeds for prominers');
  assert(pminRel.data?.project?.id === 'prominers-dao', 'Token prominers links back to project prominers-dao');
  assert(pminRel.data?.isEcosystem === true, 'Token prominers is correctly identified as ecosystem token');
  assert(pminRel.data?.airdrops.some((a) => a.id === 'air-pmin-genesis') === true, 'Token prominers has linked airdrop');
  assert(pminRel.data?.stakingPools.some((s) => s.id === 'pool-pmin-single') === true, 'Token prominers has linked staking pool');

  // External / non-ecosystem token test (safe handling without fake airdrops or fake presales)
  const nonExistentRel = await relationshipService.getTokenRelationships('unknown-external-token');
  assert(nonExistentRel.success === true, 'Token relationship query handles unknown token safely');
  assert(nonExistentRel.data === null, 'Unknown external token safely returns null without exceptions');

  // Verify that an ecosystem token without airdrops does not invent fake airdrops
  // Token 'ccat' has no airdrop in catalog (only fair-launch)
  const ccatRel = await relationshipService.getTokenRelationships('ccat');
  assert(ccatRel.success === true, 'Token relationship query succeeds for ccat');
  assert(ccatRel.data?.project?.id === 'cybercat-dao', 'Token ccat links to project cybercat-dao');
  assert(ccatRel.data?.fairLaunches.some((f) => f.id === 'fl-meme-cat') === true, 'Token ccat links to fair launch fl-meme-cat');
  assert(ccatRel.data?.presales.length === 0, 'Token ccat has no presales (fair-launch only, does not fabricate presales)');

  // --- 3. Airdrop Relationships Verification ---
  console.log('\n--- 3. Airdrop Relationships (Airdrop -> Project, Token) ---');
  const airRel = await relationshipService.getAirdropRelationships('air-pmin-genesis');
  assert(airRel.success === true, 'Airdrop relationship query succeeds for air-pmin-genesis');
  assert(airRel.data?.project?.id === 'prominers-dao', 'Airdrop links to project prominers-dao');
  assert(airRel.data?.token?.id === 'prominers', 'Airdrop links to token prominers');

  // --- 4. Launchpad Relationships Verification ---
  console.log('\n--- 4. Launchpad Relationships (Offering -> Project, Token) ---');
  const presaleRel = await relationshipService.getLaunchpadRelationships('ps-quantum-net', 'presale');
  assert(presaleRel.success === true, 'Presale relationship query succeeds for ps-quantum-net');
  assert(presaleRel.data?.project?.id === 'quantum-net', 'Presale links to project quantum-net');
  assert(presaleRel.data?.token?.id === 'quantum', 'Presale links to token quantum');

  const launchRel = await relationshipService.getLaunchpadRelationships('fl-matrix-dao', 'fair-launch');
  assert(launchRel.success === true, 'Fair launch relationship query succeeds for fl-matrix-dao');
  assert(launchRel.data?.project?.id === 'matrix-governance', 'Fair launch links to project matrix-governance');
  assert(launchRel.data?.token?.id === 'mdao', 'Fair launch links to token mdao');

  // --- 5. Staking Relationships Verification ---
  console.log('\n--- 5. Staking Relationships (Pool -> Project, Token) ---');
  const poolRel = await relationshipService.getStakingRelationships('pool-pmin-single');
  assert(poolRel.success === true, 'Staking pool relationship query succeeds for pool-pmin-single');
  assert(poolRel.data?.project?.id === 'prominers-dao', 'Staking pool links to project prominers-dao');
  assert(poolRel.data?.token?.id === 'prominers', 'Staking pool links to token prominers');

  // --- 6. Partner Relationships Verification ---
  console.log('\n--- 6. Partner Relationships (Partner -> Project, Token) ---');
  const ptRel = await relationshipService.getPartnerRelationships('aurora-systems');
  assert(ptRel.success === true, 'Partner relationship query succeeds for aurora-systems');
  assert(ptRel.data?.projects.some((p) => p.id === 'aurora-labs') === true, 'Partner aurora-systems links to project aurora-labs');
  assert(ptRel.data?.tokens.some((t) => t.id === 'aurora-ai') === true, 'Partner aurora-systems links to token aurora-ai');

  const ptZkRel = await relationshipService.getPartnerRelationships('zk-shields');
  assert(ptZkRel.success === true, 'Partner relationship query succeeds for zk-shields');
  assert(ptZkRel.data?.projects.some((p) => p.id === 'zk-privacy-labs') === true, 'Partner zk-shields links to zk-privacy-labs');

  // --- 7. Partner Directory Provider & Filtering ---
  console.log('\n--- 7. Partner Directory Provider & Filtering ---');
  const allPartnersRes = await partnerService.getAll();
  assert(allPartnersRes.success === true, 'partnerService.getAll() returns success');
  assert((allPartnersRes.data?.items.length ?? 0) >= 7, 'partnerService lists at least 7 verified partners');

  const infraPartners = await partnerService.getAll({ category: ['Infrastructure'] });
  assert(infraPartners.data?.items.some((p) => p.id === 'aurora-systems') === true, 'Category filter returns Infrastructure partner');

  const strategicPartners = await partnerService.getAll({ tier: ['Strategic Partner'] });
  assert(strategicPartners.data?.items.some((p) => p.id === 'solargrid-energy') === true, 'Tier filter returns Strategic Partner');

  // --- 8. Unified Cross-Ecosystem Search ---
  console.log('\n--- 8. Unified Cross-Ecosystem Search ---');
  const searchAurora = await relationshipService.searchCrossEcosystem('aurora');
  assert(searchAurora.success === true, 'searchCrossEcosystem succeeds for query "aurora"');
  assert(searchAurora.data?.tokens.some((t) => t.id === 'aurora-ai') === true, 'Search finds token aurora-ai');
  assert(searchAurora.data?.projects.some((p) => p.id === 'aurora-labs') === true, 'Search finds project aurora-labs');
  assert(searchAurora.data?.airdrops.some((a) => a.id === 'air-aurora-gpu') === true, 'Search finds airdrop air-aurora-gpu');
  assert(searchAurora.data?.partners.some((p) => p.id === 'aurora-systems') === true, 'Search finds partner aurora-systems');

  console.log('\n======================================================');
  console.log('ALL CROSS-ECOSYSTEM RELATIONSHIP TESTS PASSED! (8/8)');
  console.log('======================================================\n');
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
