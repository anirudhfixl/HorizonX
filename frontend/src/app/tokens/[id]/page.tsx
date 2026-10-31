import React from "react";
import { notFound } from "next/navigation";
import { NexoraTokenDetail } from "@/components/tokens/nexora-token-pages";
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

  return <NexoraTokenDetail token={token} />;
}
