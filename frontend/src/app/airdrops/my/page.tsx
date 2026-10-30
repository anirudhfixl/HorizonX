"use client";

import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { Gift, Plus, Wallet } from "lucide-react";

export default function MyAirdropsPage() {
  const { isConnected } = useWallet();
  const { openModal } = useModal();

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="My Airdrop Campaigns"
        description="Airdrop campaigns deployed and managed by your connected Web3 address."
        breadcrumbs={[
          { label: "Airdrops", href: "/airdrops" },
          { label: "My Campaigns" },
        ]}
        actions={
          <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs gap-1.5 font-semibold">
            <Link href="/airdrops/campaigns/create">
              <Plus className="h-3.5 w-3.5" /> Launch Campaign
            </Link>
          </Button>
        }
      />

      {!isConnected ? (
        <EmptyState
          icon={<Wallet className="h-7 w-7 text-primary" />}
          title="Connect Your Wallet"
          description="Connect your Web3 address to view campaigns you created and monitor claimant activity."
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
          icon={<Gift className="h-7 w-7 text-primary" />}
          title="No Campaigns Created"
          description="You haven't launched any airdrop distributions with this address yet."
          action={
            <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs font-semibold">
              <Link href="/airdrops/campaigns/create">Launch Your First Airdrop</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
