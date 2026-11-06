import NotFoundPage from "@/pages/not-found/page";
import React from "react";
import { TokenContract } from "@/components/tokens/token-contract";
import { useToken, useProject } from "@/api";
import { useParams } from "react-router-dom";

export default function TokenContractPage() {
  const { id = "" } = useParams<{ id: string }>();
  const { data: token, isLoading } = useToken(id);
  const { data: project } = useProject(token?.projectId);

  if (!token) {
    if (isLoading) {
      return (
        <div className="py-20 text-center text-sm text-muted-foreground animate-pulse">
          Loading contract details...
        </div>
      );
    }
    return <NotFoundPage />;
  }

  return <TokenContract token={token as any} project={project as any} />;
}
