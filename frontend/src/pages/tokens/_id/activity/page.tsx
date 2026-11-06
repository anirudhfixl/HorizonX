import NotFoundPage from "@/pages/not-found/page";
import React from "react";
import { TokenActivity } from "@/components/tokens/token-activity";
import {
  useToken,
  useProject,
  usePresales,
  useFairLaunches,
  useAirdrops,
  useStakingPools,
} from "@/api";
import { useParams } from "react-router-dom";

export default function TokenActivityPage() {
  const { id = "" } = useParams<{ id: string }>();
  const { data: token, isLoading } = useToken(id);
  const { data: project } = useProject(token?.projectId);
  const { data: allPresales = [] } = usePresales();
  const { data: allFairLaunches = [] } = useFairLaunches();
  const { data: allAirdrops = [] } = useAirdrops();
  const { data: allStakingPools = [] } = useStakingPools();

  if (!token) {
    if (isLoading) {
      return (
        <div className="py-20 text-center text-sm text-muted-foreground animate-pulse">
          Loading token activity...
        </div>
      );
    }
    return <NotFoundPage />;
  }

  // Resolve genuine ecosystem utilities
  const presales = allPresales.filter(
    (p) => p.tokenId === token.id || (token.projectId && p.projectId === token.projectId)
  );

  const fairLaunches = allFairLaunches.filter(
    (f) => f.tokenId === token.id || (token.projectId && f.projectId === token.projectId)
  );

  const airdrops = allAirdrops.filter(
    (a) => a.tokenId === token.id || (token.projectId && a.projectId === token.projectId)
  );

  const stakingPools = allStakingPools.filter(
    (s) => s.tokenId === token.id || (token.projectId && s.projectId === token.projectId)
  );

  return (
    <TokenActivity
      token={token as any}
      project={project as any}
      presales={presales as any}
      fairLaunches={fairLaunches as any}
      airdrops={airdrops as any}
      stakingPools={stakingPools as any}
    />
  );
}
