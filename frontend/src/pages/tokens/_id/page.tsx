import React from "react";
import { useParams } from "react-router-dom";
import { TokenDetail } from "@/components/tokens/token-detail";
import { PageMeta } from "@/components/seo/page-meta";
import NotFoundPage from "@/pages/not-found/page";
import { useToken } from "@/api";

/**
 * Token details (/tokens/:id): market data, tokenomics, holders and every HorizonX
 * presale, launch, airdrop, staking pool, project and market linked to the token.
 */
export default function TokenDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const { data: token, isLoading } = useToken(id);

  if (!token) {
    if (isLoading) {
      return (
        <div className="py-20 text-center text-sm text-muted-foreground animate-pulse">
          Loading token details...
        </div>
      );
    }
    return (
      <>
        <PageMeta title="Token not found" />
        <NotFoundPage />
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={`${token.name} (${token.symbol})`}
        description={`${token.name} on ${token.network}: simulated price, tokenomics, holders and linked HorizonX activity.`}
      />
      <TokenDetail token={token as any} />
    </>
  );
}
