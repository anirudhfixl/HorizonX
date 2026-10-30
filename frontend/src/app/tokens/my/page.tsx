"use client";

import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { Coins, Plus, Wallet } from "lucide-react";

export default function MyTokensPage() {
  const { isConnected, shortAddress } = useWallet();
  const { openModal } = useModal();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="My Tokens"
        description="Tokens deployed and managed by your connected Web3 address."
        breadcrumbs={[
          { label: "Tokens", href: "/tokens" },
          { label: "My Tokens" },
        ]}
        actions={
          <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs gap-1.5 font-semibold">
            <Link href="/tokens/create">
              <Plus className="h-3.5 w-3.5" /> Deploy New Token
            </Link>
          </Button>
        }
      />

      {!isConnected ? (
        <EmptyState
          icon={<Wallet className="h-7 w-7 text-primary" />}
          title="Connect Your Wallet"
          description="Connect your Web3 wallet to inspect your deployed token contracts, manage permissions, and mint supplies."
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
        <div className="space-y-4">
          <div className="rounded-xl border border-border/60 bg-secondary/20 p-4 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Connected Wallet: <strong className="font-mono text-foreground">{shortAddress}</strong>
            </span>
            <span className="rounded bg-primary/10 px-2 py-0.5 font-medium text-primary">
              0 Deployed Contracts
            </span>
          </div>

          <EmptyState
            icon={<Coins className="h-7 w-7 text-primary" />}
            title="No Tokens Created Yet"
            description="You haven't deployed any tokens with this address yet. Launch your first ERC-20 token in under 60 seconds."
            action={
              <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs font-semibold">
                <Link href="/tokens/create">Deploy Your First Token</Link>
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
}
