import React from "react";
import type { Token, TokenMarketData, Project } from "@/types";
import { TokenDetailHeader } from "@/components/tokens/token-detail";
import type { TokenDetailTab } from "@/components/tokens/token-detail-tabs";
import type { TokenWithMarket } from "@/lib/tokens/model";

export type DetailTab = TokenDetailTab;

interface TokenDetailShellProps {
  token: Token & { market?: TokenMarketData };
  project?: Project;
  activeTab: DetailTab;
  children: React.ReactNode;
}

export function TokenDetailShell({ token, activeTab, children }: TokenDetailShellProps) {
  return (
    <div className="tk-page">
      <TokenDetailHeader token={token as TokenWithMarket} activeTab={activeTab} />
      <main className="min-w-0">{children}</main>
    </div>
  );
}
