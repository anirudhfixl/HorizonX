"use client";

import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { Star, Wallet } from "lucide-react";

export default function WatchlistPage() {
  const { isConnected } = useWallet();
  const { openModal } = useModal();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Token Watchlist"
        description="Pin favorite tokens and liquidity pairs to monitor live price action and volume alerts."
        breadcrumbs={[
          { label: "Markets", href: "/exchange" },
          { label: "Watchlist" },
        ]}
      />

      {!isConnected ? (
        <EmptyState
          icon={<Wallet className="h-7 w-7 text-primary" />}
          title="Connect Your Wallet"
          description="Connect your Web3 address to save custom watched token pairs across devices."
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
          icon={<Star className="h-7 w-7 text-primary" />}
          title="Your Watchlist is Empty"
          description="Star any token from the Token Dashboard or Markets page to track it here."
          action={
            <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs font-semibold">
              <Link href="/exchange/markets">Browse Markets</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
