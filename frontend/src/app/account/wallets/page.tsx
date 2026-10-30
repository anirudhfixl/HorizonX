"use client";

import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { Wallet, CheckCircle2, Plus } from "lucide-react";

export default function AccountWalletsPage() {
  const { isConnected, address, shortAddress, network, walletProvider } = useWallet();
  const { openModal } = useModal();

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Wallet Connections"
        description="Active Web3 addresses associated with your ProMiners account."
        breadcrumbs={[
          { label: "Account", href: "/account" },
          { label: "Wallets" },
        ]}
        actions={
          <Button
            size="sm"
            onClick={() => openModal("CONNECT_WALLET")}
            className="bg-primary text-primary-foreground text-xs gap-1.5 font-semibold"
          >
            <Plus className="h-3.5 w-3.5" /> Connect Another Wallet
          </Button>
        }
      />

      {isConnected ? (
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">{walletProvider}</span>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                    Primary
                  </span>
                </div>
                <code className="text-xs font-mono text-muted-foreground">{address}</code>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openModal("WALLET_DETAILS")}
              className="text-xs border-border/60"
            >
              Manage
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/80 bg-secondary/15 p-12 text-center space-y-4">
          <p className="text-sm text-muted-foreground">No active wallet connected.</p>
          <Button
            size="sm"
            onClick={() => openModal("CONNECT_WALLET")}
            className="bg-primary text-primary-foreground text-xs font-semibold"
          >
            Connect Wallet
          </Button>
        </div>
      )}
    </div>
  );
}
