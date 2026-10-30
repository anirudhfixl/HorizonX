"use client";

import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { Layers, Plus, Wallet } from "lucide-react";

export default function MyStakingPositionsPage() {
  const { isConnected } = useWallet();
  const { openModal } = useModal();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="My Staking Positions"
        description="Monitor your active staked assets, accumulated rewards, and harvest history."
        breadcrumbs={[
          { label: "Staking", href: "/staking" },
          { label: "My Positions" },
        ]}
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
              <Link href="/staking/pools">Browse Staking Pools</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
