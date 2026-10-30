import React from "react";
import { notFound } from "next/navigation";
import { TokenDetailHub } from "@/components/tokens/token-detail-hub";
import {
  MOCK_TOKENS,
  MOCK_PROJECTS,
  MOCK_PRESALES,
  MOCK_FAIR_LAUNCHES,
  MOCK_AIRDROPS,
  MOCK_STAKING_POOLS,
} from "@/lib/mock-data";

export function generateStaticParams() {
  return MOCK_TOKENS.map((token) => ({ id: token.id }));
}

export default async function TokenDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = MOCK_TOKENS.find((t) => t.id === id);

  if (!token) {
    notFound();
  }

  // Resolve linked ecosystem project
  const project = token.projectId
    ? MOCK_PROJECTS.find((p) => p.id === token.projectId)
    : undefined;

  // Resolve genuine ecosystem utilities
  const presales = MOCK_PRESALES.filter(
    (p) => p.tokenId === token.id || (token.projectId && p.projectId === token.projectId)
  );

  const fairLaunches = MOCK_FAIR_LAUNCHES.filter(
    (f) => f.tokenId === token.id || (token.projectId && f.projectId === token.projectId)
  );

  const airdrops = MOCK_AIRDROPS.filter(
    (a) => a.tokenId === token.id || (token.projectId && a.projectId === token.projectId)
  );

  const stakingPools = MOCK_STAKING_POOLS.filter(
    (s) => s.tokenId === token.id || (token.projectId && s.projectId === token.projectId)
  );

  return (
    <TokenDetailHub
      token={token}
      project={project}
      presales={presales}
      fairLaunches={fairLaunches}
      airdrops={airdrops}
      stakingPools={stakingPools}
      initialTab="overview"
    />
  );
}
