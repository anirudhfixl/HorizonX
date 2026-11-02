import NotFoundPage from "@/pages/not-found/page";
import React from "react";
import { TokenContract } from "@/components/tokens/token-contract";
import { TOKENS, PROJECTS } from "@/data";
import { useParams } from "react-router-dom";

export default function TokenContractPage() {
  const { id = "" } = useParams<{ id: string }>();
  const token = TOKENS.find((t) => t.id === id);

  if (!token) {
    return <NotFoundPage />;
  }

  // Resolve linked ecosystem project
  const project = token.projectId
    ? PROJECTS.find((p) => p.id === token.projectId)
    : undefined;

  return <TokenContract token={token} project={project} />;
}
