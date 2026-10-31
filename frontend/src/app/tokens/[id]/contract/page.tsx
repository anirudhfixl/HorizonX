import React from "react";
import { notFound } from "next/navigation";
import { TokenContract } from "@/components/tokens/token-contract";
import { MOCK_TOKENS, MOCK_PROJECTS } from "@/lib/mock-data";

export function generateStaticParams() {
  return MOCK_TOKENS.map((token) => ({ id: token.id }));
}

export default async function TokenContractPage({
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

  return <TokenContract token={token} project={project} />;
}
