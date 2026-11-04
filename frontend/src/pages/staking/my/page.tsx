import React from "react";
import { StakingWorkspaceHeader } from "@/components/staking/staking-section-nav";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { Layers, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

export default function MyStakingPositionsPage() {
  const { isConnected } = useWallet();
  const { openModal } = useModal();

  return (
    <main className="staking-page space-y-8">
      <StakingWorkspaceHeader items={[{ label: "Staking", to: "/staking" }, { label: "My positions" }]} />
      <PageHeader
        title="My Staking Positions"
        description="Monitor your active staked assets, accumulated rewards, and harvest history."
      />

      {!isConnected ? (
        <EmptyState
          icon={<Wallet className="h-7 w-7 text-primary" />}
          title="Connect Your Wallet"
          description="Connect your Web3 address to view active staked positions and claim accrued rewards."
          action={
            <Button
              size="sm"
              onClick={() => openModal("CONNECT_WALLET")}
              className="bg-primary text-primary-foreground text-xs font-semibold"
            >
              Connect Wallet
            </Button>
          }
        />
      ) : (
        <EmptyState
          icon={<Layers className="h-7 w-7 text-primary" />}
          title="No Active Staking Positions"
          description="You don't have any tokens deposited in staking pools right now."
          action={
            <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs font-semibold">
              <Link to="/staking/pools">Browse Staking Pools</Link>
            </Button>
          }
        />
      )}
    </main>
  );
}
