"use client";

import React from "react";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, ShieldCheck, ExternalLink } from "lucide-react";

interface WalletOption {
  id: string;
  name: string;
  description: string;
  badge?: string;
  icon: string;
}

const WALLET_OPTIONS: WalletOption[] = [
  {
    id: "metamask",
    name: "MetaMask",
    description: "Connect to your MetaMask desktop or mobile wallet",
    badge: "Popular",
    icon: "🦊",
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    description: "Self-custody crypto wallet by Coinbase",
    icon: "🔷",
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    description: "Scan with Rainbow, Trust Wallet, or 300+ other apps",
    icon: "🔗",
  },
  {
    id: "phantom",
    name: "Phantom",
    description: "Multichain Web3 wallet for Ethereum & Solana",
    icon: "👻",
  },
];

export function ConnectWalletModal() {
  const { connect } = useWallet();
  const { isOpen, closeModal, openModal } = useModal();
  const open = isOpen("CONNECT_WALLET");

  const handleSelectWallet = async (name: string) => {
    await connect(name);
    closeModal();
  };

  const handleDemoConnect = async () => {
    await connect("Demo Account (Tester)");
    closeModal();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && closeModal()}>
      <DialogContent className="sm:max-w-md border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl p-6">
        <DialogHeader className="space-y-1.5 pb-2 border-b border-border/40">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <DialogTitle className="text-xl font-semibold tracking-tight text-foreground">
              Connect a Wallet
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Select an approved Web3 provider to interact with tokens, presales, and staking.
          </DialogDescription>
        </DialogHeader>

        {/* Quick Demo Connect Banner */}
        <div className="my-3 rounded-lg border border-primary/30 bg-primary/5 p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-primary shrink-0" />
            <div className="text-xs">
              <p className="font-medium text-foreground">Instant Testing Sandbox</p>
              <p className="text-muted-foreground">No extension needed — connect instant mock wallet</p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleDemoConnect}
            className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold px-3 py-1.5"
          >
            Quick Connect
          </Button>
        </div>

        {/* Provider List */}
        <div className="space-y-2 py-2">
          {WALLET_OPTIONS.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleSelectWallet(wallet.name)}
              className="group flex w-full items-center justify-between rounded-xl border border-border/50 bg-secondary/30 p-3.5 text-left transition-all hover:border-primary/50 hover:bg-secondary/70 hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{wallet.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {wallet.name}
                    </span>
                    {wallet.badge && (
                      <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary">
                        {wallet.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {wallet.description}
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                Connect →
              </span>
            </button>
          ))}
        </div>

        {/* Footer info & Risk disclosure link */}
        <div className="pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>By connecting, you accept our terms.</span>
          <button
            onClick={() => {
              closeModal();
              openModal("RISK_WARNING");
            }}
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            Risk Warning <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
