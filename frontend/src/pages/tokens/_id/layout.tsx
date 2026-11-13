import React from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { useToken } from "@/api";
import { TokenDetailShell } from "@/components/tokens/token-detail-shell";
import type { DetailTab } from "@/components/tokens/token-detail-shell";
import NotFoundPage from "@/pages/not-found/page";

/**
 * Shared token-detail layout. It stays mounted while the index, contract and
 * activity child routes change, preserving the header and inner navigation.
 */
export default function TokenDetailLayoutPage() {
  const { id = "" } = useParams<{ id: string }>();
  const { pathname } = useLocation();
  const { data: token, isLoading } = useToken(id);

  const activeTab: DetailTab = pathname.endsWith("/contract")
    ? "contract"
    : pathname.endsWith("/activity")
      ? "activity"
      : "overview";

  if (!token) {
    if (isLoading) {
      return <div className="py-20 text-center text-sm text-muted-foreground animate-pulse">Loading token details...</div>;
    }
    return <NotFoundPage />;
  }

  return (
    <TokenDetailShell token={token as any} activeTab={activeTab}>
      <Outlet />
    </TokenDetailShell>
  );
}
