// Centralized Cross-Ecosystem Relationship React Hooks
// Exposes bidirectional navigation and relationship queries with asynchronous state management.

import { useAsyncQuery } from './use-async-query';
import { relationshipService } from '../services/relationships/relationship.service';

export function useProjectRelationships(projectId: string | undefined) {
  const query = useAsyncQuery(
    async () => {
      if (!projectId) return null;
      const res = await relationshipService.getProjectRelationships(projectId);
      return res.data;
    },
    [projectId],
    { enabled: Boolean(projectId) }
  );

  return {
    relationships: query.data ?? null,
    data: query.data ?? null,
    tokens: query.data?.tokens ?? [],
    airdrops: query.data?.airdrops ?? [],
    presales: query.data?.presales ?? [],
    fairLaunches: query.data?.fairLaunches ?? [],
    stakingPools: query.data?.stakingPools ?? [],
    partners: query.data?.partners ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useTokenRelationships(tokenId: string | undefined) {
  const query = useAsyncQuery(
    async () => {
      if (!tokenId) return null;
      const res = await relationshipService.getTokenRelationships(tokenId);
      return res.data;
    },
    [tokenId],
    { enabled: Boolean(tokenId) }
  );

  return {
    relationships: query.data ?? null,
    data: query.data ?? null,
    project: query.data?.project ?? null,
    airdrops: query.data?.airdrops ?? [],
    presales: query.data?.presales ?? [],
    fairLaunches: query.data?.fairLaunches ?? [],
    stakingPools: query.data?.stakingPools ?? [],
    partners: query.data?.partners ?? [],
    isEcosystem: query.data?.isEcosystem ?? false,
    isExternal: query.data?.isExternal ?? true,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useAirdropRelationships(airdropId: string | undefined) {
  const query = useAsyncQuery(
    async () => {
      if (!airdropId) return null;
      const res = await relationshipService.getAirdropRelationships(airdropId);
      return res.data;
    },
    [airdropId],
    { enabled: Boolean(airdropId) }
  );

  return {
    relationships: query.data ?? null,
    data: query.data ?? null,
    project: query.data?.project ?? null,
    token: query.data?.token ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useLaunchpadRelationships(
  id: string | undefined,
  kind: 'presale' | 'fair-launch' = 'presale'
) {
  const query = useAsyncQuery(
    async () => {
      if (!id) return null;
      const res = await relationshipService.getLaunchpadRelationships(id, kind);
      return res.data;
    },
    [id, kind],
    { enabled: Boolean(id) }
  );

  return {
    relationships: query.data ?? null,
    data: query.data ?? null,
    project: query.data?.project ?? null,
    token: query.data?.token ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useStakingRelationships(poolId: string | undefined) {
  const query = useAsyncQuery(
    async () => {
      if (!poolId) return null;
      const res = await relationshipService.getStakingRelationships(poolId);
      return res.data;
    },
    [poolId],
    { enabled: Boolean(poolId) }
  );

  return {
    relationships: query.data ?? null,
    data: query.data ?? null,
    project: query.data?.project ?? null,
    token: query.data?.token ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function usePartnerRelationships(partnerId: string | undefined) {
  const query = useAsyncQuery(
    async () => {
      if (!partnerId) return null;
      const res = await relationshipService.getPartnerRelationships(partnerId);
      return res.data;
    },
    [partnerId],
    { enabled: Boolean(partnerId) }
  );

  return {
    relationships: query.data ?? null,
    data: query.data ?? null,
    projects: query.data?.projects ?? [],
    tokens: query.data?.tokens ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useCrossEcosystemSearch(queryStr: string) {
  const query = useAsyncQuery(
    async () => {
      const res = await relationshipService.searchCrossEcosystem(queryStr);
      return res.data;
    },
    [queryStr]
  );

  return {
    results: query.data ?? {
      tokens: [],
      projects: [],
      airdrops: [],
      presales: [],
      fairLaunches: [],
      stakingPools: [],
      partners: [],
    },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

