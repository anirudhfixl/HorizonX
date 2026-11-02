import NotFoundPage from "@/pages/not-found/page";
import React from "react";
import { TokenActivity } from "@/components/tokens/token-activity";
import {
  TOKENS,
  PROJECTS,
  PRESALES,
  FAIR_LAUNCHES,
  AIRDROPS,
  STAKING_POOLS,
} from "@/data";
import { useParams } from "react-router-dom";

export default function TokenActivityPage() {
  const { id = "" } = useParams<{ id: string }>();
  const token = TOKENS.find((t) => t.id === id);

  if (!token) {
    return <NotFoundPage />;
  }

  // Resolve linked ecosystem project
  const project = token.projectId
    ? PROJECTS.find((p) => p.id === token.projectId)
    : undefined;

  // Resolve genuine ecosystem utilities
  const presales = PRESALES.filter(
    (p) => p.tokenId === token.id || (token.projectId && p.projectId === token.projectId)
  );

  const fairLaunches = FAIR_LAUNCHES.filter(
    (f) => f.tokenId === token.id || (token.projectId && f.projectId === token.projectId)
  );

  const airdrops = AIRDROPS.filter(
    (a) => a.tokenId === token.id || (token.projectId && a.projectId === token.projectId)
  );

  const stakingPools = STAKING_POOLS.filter(
    (s) => s.tokenId === token.id || (token.projectId && s.projectId === token.projectId)
  );

  return (
    <TokenActivity
      token={token}
      project={project}
      presales={presales}
      fairLaunches={fairLaunches}
      airdrops={airdrops}
      stakingPools={stakingPools}
    />
  );
}
