// Centralized Cross-Ecosystem Relationship Service
// Connects Tokens, Projects, Airdrops, Launchpad Offerings, Staking Pools, and Partners
// Provides bidirectional query methods with caching and graceful fallbacks.

import { defaultApiClient } from '../../client/api-client';
import { tokenService } from '../tokens/token.service';
import { projectService } from '../projects/project.service';
import { airdropService } from '../airdrops/airdrop.service';
import { launchpadService } from '../launchpad/launchpad.service';
import { stakingService } from '../staking/staking.service';
import { partnerService } from '../partners/partner.service';
import type {
  ApiResponse,
  ProjectRelationships,
  TokenRelationships,
  AirdropRelationships,
  LaunchpadRelationships,
  StakingRelationships,
  PartnerRelationships,
  CrossEcosystemSearchResult,
} from '../../types';

// Canonical verified ecosystem mapping
const KNOWN_PROJECT_TOKEN_MAP: Record<string, string[]> = {
  'prominers-dao': ['prominers', 'pmin'],
  'cybercat-dao': ['cybercat', 'ccat'],
  'zk-privacy': ['zk-privacy', 'zkpv'],
  'hyper-defi': ['hyper-defi', 'hyper'],
  'quantum-network': ['quantum-network', 'qnet'],
  'aurora-labs': ['aurora-ai', 'aura'],
  'nexus-protocol': ['nexus-protocol', 'nexus'],
  'solaris-pay': ['solaris-pay', 'solar'],
  'apex-games': ['apex-games', 'apex'],
};

/**
 * Strict hierarchy matching:
 * 1. Verified explicit mapping
 * 2. Provider entity identifiers (cmcId, defillamaId)
 * 3. Contract address + network matching
 * 4. Canonical project identifiers
 * 5. Leave unverified unlinked
 */
function doesTokenMatchProject(token: any, project: any): boolean {
  if (!token || !project) return false;
  const tid = token.id?.toLowerCase();
  const tsym = token.symbol?.toLowerCase();
  const pid = project.id?.toLowerCase();

  // 1. Direct relational references from centralized dataset
  if (token.projectId && token.projectId.toLowerCase() === pid) return true;
  if (Array.isArray(project.tokenIds)) {
    const pTokens = project.tokenIds.map((x: string) => x.toLowerCase());
    if (pTokens.includes(tid) || (tsym && pTokens.includes(tsym))) return true;
  }

  // 2. Explicit verified mapping for known aliases
  if (KNOWN_PROJECT_TOKEN_MAP[pid]) {
    const list = KNOWN_PROJECT_TOKEN_MAP[pid];
    if (list.includes(tid) || (tsym && list.includes(tsym))) return true;
  }

  // 3. Normalized cohort ID mapping (e.g. project-id-cohort-2 <-> token-id-cohort-2)
  const cleanPid = pid.replace(/-cohort-\d+$/, '');
  const cleanTid = tid.replace(/-cohort-\d+$/, '');
  if (KNOWN_PROJECT_TOKEN_MAP[cleanPid]) {
    const list = KNOWN_PROJECT_TOKEN_MAP[cleanPid];
    if (list.includes(cleanTid) || (tsym && list.includes(tsym.replace(/-cohort-\d+$/, '')))) {
      const pCohort = pid.match(/-cohort-(\d+)$/)?.[1] || '1';
      const tCohort = tid.match(/-cohort-(\d+)$/)?.[1] || '1';
      if (pCohort === tCohort) return true;
    }
  }

  // 4. Contract address + network matching
  if (
    token.contractAddress &&
    project.contractAddress &&
    token.contractAddress.toLowerCase() === project.contractAddress.toLowerCase() &&
    (!token.network || !project.network || token.network.toLowerCase() === project.network.toLowerCase())
  ) {
    return true;
  }

  return false;
}

/**
 * Multi-asset safe staking pool matcher:
 * Preserves all underlying assets without loose substrings or crude splits.
 */
function doesPoolMatchToken(pool: any, token: any): boolean {
  if (!pool || !token) return false;
  const targetId = token.id?.toLowerCase();
  const targetSym = token.symbol?.toUpperCase();
  const poolTokenId = pool.tokenId?.toLowerCase();

  // Exact tokenId match
  if (poolTokenId && (poolTokenId === targetId || (token.symbol && poolTokenId === token.symbol.toLowerCase()))) {
    return true;
  }

  // Exact underlyingTokens match
  if (Array.isArray(pool.underlyingTokens) && pool.underlyingTokens.length > 0) {
    const hasUnderlying = pool.underlyingTokens.some((u: string) => {
      const uClean = u.trim().toUpperCase();
      return uClean === targetSym || u.toLowerCase() === targetId;
    });
    if (hasUnderlying) return true;
  }

  // Token pair exact asset match (e.g. WBTC-ETH -> ['WBTC', 'ETH'])
  if (pool.token) {
    const parts = pool.token.toUpperCase().split(/[-/_]/).map((s: string) => s.trim());
    if (targetSym && parts.includes(targetSym)) return true;
  }

  return false;
}

export class RelationshipService {
  /**
   * Retrieves all linked ecosystem entities for a given project.
   */
  async getProjectRelationships(projectId: string): Promise<ApiResponse<ProjectRelationships | null>> {
    const key = `relationships:project:${projectId.toLowerCase()}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const pRes = await projectService.getById(projectId);
      const project = pRes.data;
      if (!project) return null;

      // Parallel queries across domains
      const [tokensRes, airdropsRes, presalesRes, launchesRes, poolsRes, partnersRes] = await Promise.all([
        tokenService.getAll(),
        airdropService.getAll(),
        launchpadService.getPresales(),
        launchpadService.getFairLaunches(),
        stakingService.getAll(),
        partnerService.getAll(),
      ]);

      const allTokens = tokensRes.data?.items ?? [];
      const allAirdrops = airdropsRes.data?.items ?? [];
      const allPresales = presalesRes.data?.items ?? [];
      const allLaunches = launchesRes.data?.items ?? [];
      const allPools = poolsRes.data?.items ?? [];
      const allPartners = partnersRes.data?.items ?? [];

      // Link tokens via strict matching hierarchy
      const linkedTokens = allTokens.filter((t) => doesTokenMatchProject(t, project));

      // Link airdrops: match airdrop.projectId or any verified linked token
      const tokenIdsSet = new Set(linkedTokens.map((t) => t.id.toLowerCase()));
      const tokenSymbolsSet = new Set(linkedTokens.map((t) => (t.symbol || '').toLowerCase()).filter(Boolean));
      const linkedAirdrops = allAirdrops.filter(
        (a) =>
          (a.projectId && a.projectId.toLowerCase() === project.id.toLowerCase()) ||
          (a.tokenId && (tokenIdsSet.has(a.tokenId.toLowerCase()) || tokenSymbolsSet.has(a.tokenId.toLowerCase())))
      );

      // Link presales & launches
      const linkedPresales = allPresales.filter(
        (p) =>
          (p.projectId && p.projectId.toLowerCase() === project.id.toLowerCase()) ||
          (p.tokenId && (tokenIdsSet.has(p.tokenId.toLowerCase()) || tokenSymbolsSet.has(p.tokenId.toLowerCase())))
      );
      const linkedFairLaunches = allLaunches.filter(
        (l) =>
          (l.projectId && l.projectId.toLowerCase() === project.id.toLowerCase()) ||
          (l.tokenId && (tokenIdsSet.has(l.tokenId.toLowerCase()) || tokenSymbolsSet.has(l.tokenId.toLowerCase())))
      );

      // Link staking pools
      const linkedPools = allPools.filter(
        (s) =>
          (s.projectId && s.projectId.toLowerCase() === project.id.toLowerCase()) ||
          linkedTokens.some((t) => doesPoolMatchToken(s, t))
      );

      // Link partners: match partner.projectIds, partner.tokenIds, or project.partnerIds
      const linkedPartners = allPartners.filter(
        (pt) =>
          (pt.projectIds && pt.projectIds.includes(project.id)) ||
          (project.partnerIds && project.partnerIds.includes(pt.id)) ||
          (pt.tokenIds && pt.tokenIds.some((tid) => tokenIdsSet.has(tid.toLowerCase())))
      );

      return {
        project,
        tokens: linkedTokens,
        airdrops: linkedAirdrops,
        presales: linkedPresales,
        fairLaunches: linkedFairLaunches,
        stakingPools: linkedPools,
        partners: linkedPartners,
      };
    });
  }

  /**
   * Retrieves all linked ecosystem entities for a given token.
   */
  async getTokenRelationships(tokenId: string): Promise<ApiResponse<TokenRelationships | null>> {
    const key = `relationships:token:${tokenId.toLowerCase()}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const tRes = await tokenService.getById(tokenId);
      const token = tRes.data;
      if (!token) return null;

      const [projectsRes, airdropsRes, presalesRes, launchesRes, poolsRes, partnersRes] = await Promise.all([
        projectService.getAll(),
        airdropService.getAll(),
        launchpadService.getPresales(),
        launchpadService.getFairLaunches(),
        stakingService.getAll(),
        partnerService.getAll(),
      ]);

      const allProjects = projectsRes.data?.items ?? [];
      const allAirdrops = airdropsRes.data?.items ?? [];
      const allPresales = presalesRes.data?.items ?? [];
      const allLaunches = launchesRes.data?.items ?? [];
      const allPools = poolsRes.data?.items ?? [];
      const allPartners = partnersRes.data?.items ?? [];

      // Link project via strict hierarchy
      const project = allProjects.find((p) => doesTokenMatchProject(token, p)) || null;

      // Link airdrops for this token
      const sym = token.symbol?.toLowerCase();
      const targetId = token.id.toLowerCase();
      const linkedAirdrops = allAirdrops.filter(
        (a) =>
          (a.tokenId && (a.tokenId.toLowerCase() === targetId || (sym && a.tokenId.toLowerCase() === sym))) ||
          (project && a.projectId && a.projectId.toLowerCase() === project.id.toLowerCase())
      );

      // Link launchpad offerings for this token
      const linkedPresales = allPresales.filter(
        (p) =>
          (p.tokenId && (p.tokenId.toLowerCase() === targetId || (sym && p.tokenId.toLowerCase() === sym))) ||
          (project && p.projectId && p.projectId.toLowerCase() === project.id.toLowerCase())
      );
      const linkedFairLaunches = allLaunches.filter(
        (l) =>
          (l.tokenId && (l.tokenId.toLowerCase() === targetId || (sym && l.tokenId.toLowerCase() === sym))) ||
          (project && l.projectId && l.projectId.toLowerCase() === project.id.toLowerCase())
      );

      // Link staking pools for this token (multi-asset safe)
      const linkedPools = allPools.filter((s) => doesPoolMatchToken(s, token));

      // Link partners
      const linkedPartners = allPartners.filter(
        (pt) =>
          (pt.tokenIds && (pt.tokenIds.includes(token.id) || (sym && pt.tokenIds.includes(sym)))) ||
          (project && pt.projectIds && pt.projectIds.includes(project.id)) ||
          (project && project.partnerIds && project.partnerIds.includes(pt.id))
      );

      const isEcosystem = (token as any).isEcosystem === true || Boolean(project);
      const isExternal = (token as any).isExternal === true || !project;

      return {
        token,
        project,
        airdrops: linkedAirdrops,
        presales: linkedPresales,
        fairLaunches: linkedFairLaunches,
        stakingPools: linkedPools,
        partners: linkedPartners,
        isEcosystem,
        isExternal,
      };
    });
  }

  /**
   * Retrieves linked project and token for an airdrop campaign.
   */
  async getAirdropRelationships(airdropId: string): Promise<ApiResponse<AirdropRelationships | null>> {
    const key = `relationships:airdrop:${airdropId.toLowerCase()}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const aRes = await airdropService.getById(airdropId);
      const airdrop = aRes.data;
      if (!airdrop) return null;

      const [tokenRes, projectRes] = await Promise.all([
        airdrop.tokenId ? tokenService.getById(airdrop.tokenId) : Promise.resolve({ data: null }),
        airdrop.projectId ? projectService.getById(airdrop.projectId) : Promise.resolve({ data: null }),
      ]);

      let token = tokenRes.data;
      let project = projectRes.data;

      // If project not found directly, check token
      if (!project && token && (token as any).projectId) {
        const pRes = await projectService.getById((token as any).projectId);
        project = pRes.data;
      }

      return { airdrop, project, token };
    });
  }

  /**
   * Retrieves linked project and token for a presale or fair launch.
   */
  async getLaunchpadRelationships(
    id: string,
    kind: 'presale' | 'fair-launch'
  ): Promise<ApiResponse<LaunchpadRelationships | null>> {
    const key = `relationships:launchpad:${kind}:${id.toLowerCase()}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const itemRes =
        kind === 'presale'
          ? await launchpadService.getPresaleById(id)
          : await launchpadService.getFairLaunchById(id);
      const item = itemRes.data;
      if (!item) return null;

      const [tokenRes, projectRes] = await Promise.all([
        item.tokenId ? tokenService.getById(item.tokenId) : Promise.resolve({ data: null }),
        item.projectId ? projectService.getById(item.projectId) : Promise.resolve({ data: null }),
      ]);

      let token = tokenRes.data;
      let project = projectRes.data;

      if (!project && token && (token as any).projectId) {
        const pRes = await projectService.getById((token as any).projectId);
        project = pRes.data;
      }

      return { item, kind, project, token };
    });
  }

  /**
   * Retrieves linked project and token for a staking pool.
   */
  async getStakingRelationships(poolId: string): Promise<ApiResponse<StakingRelationships | null>> {
    const key = `relationships:staking:${poolId.toLowerCase()}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const pRes = await stakingService.getById(poolId);
      const pool = pRes.data;
      if (!pool) return null;

      const [tokenRes, projectRes] = await Promise.all([
        pool.tokenId ? tokenService.getById(pool.tokenId) : Promise.resolve({ data: null }),
        pool.projectId ? projectService.getById(pool.projectId) : Promise.resolve({ data: null }),
      ]);

      let token = tokenRes.data;
      let project = projectRes.data;

      if (!project && token && (token as any).projectId) {
        const pRes = await projectService.getById((token as any).projectId);
        project = pRes.data;
      }

      return { pool, project, token };
    });
  }

  /**
   * Retrieves linked projects and tokens for a partner.
   */
  async getPartnerRelationships(partnerId: string): Promise<ApiResponse<PartnerRelationships | null>> {
    const key = `relationships:partner:${partnerId.toLowerCase()}`;
    return defaultApiClient.cachedQuery(key, async () => {
      const ptRes = await partnerService.getById(partnerId);
      const partner = ptRes.data;
      if (!partner) return null;

      const [projectsRes, tokensRes] = await Promise.all([
        projectService.getAll(),
        tokenService.getAll(),
      ]);

      const allProjects = projectsRes.data?.items ?? [];
      const allTokens = tokensRes.data?.items ?? [];

      const linkedProjects = allProjects.filter(
        (p) =>
          (partner.projectIds && partner.projectIds.includes(p.id)) ||
          (p.partnerIds && p.partnerIds.includes(partner.id))
      );

      const projectTokenIds = new Set(linkedProjects.flatMap((p) => p.tokenIds || []));
      const linkedTokens = allTokens.filter(
        (t) => (partner.tokenIds && partner.tokenIds.includes(t.id)) || projectTokenIds.has(t.id)
      );

      return { partner, projects: linkedProjects, tokens: linkedTokens };
    });
  }

  /**
   * Performs unified cross-ecosystem search across all 6 sections.
   */
  async searchCrossEcosystem(query: string): Promise<ApiResponse<CrossEcosystemSearchResult>> {
    const q = query.toLowerCase().trim();
    const key = `relationships:search:${q}`;
    return defaultApiClient.cachedQuery(key, async () => {
      if (!q) {
        return {
          tokens: [],
          projects: [],
          airdrops: [],
          presales: [],
          fairLaunches: [],
          stakingPools: [],
          partners: [],
        };
      }

      const [tokensRes, projectsRes, airdropsRes, presalesRes, launchesRes, poolsRes, partnersRes] =
        await Promise.all([
          tokenService.search(q, 10),
          projectService.search(q, 10),
          airdropService.getAll({ search: q }),
          launchpadService.getPresales({ search: q }),
          launchpadService.getFairLaunches({ search: q }),
          stakingService.getAll({ search: q }),
          partnerService.getAll({ search: q }),
        ]);

      return {
        tokens: tokensRes.data ?? [],
        projects: projectsRes.data ?? [],
        airdrops: airdropsRes.data?.items ?? [],
        presales: presalesRes.data?.items ?? [],
        fairLaunches: launchesRes.data?.items ?? [],
        stakingPools: poolsRes.data?.items ?? [],
        partners: partnersRes.data?.items ?? [],
      };
    });
  }
}

export const relationshipService = new RelationshipService();

