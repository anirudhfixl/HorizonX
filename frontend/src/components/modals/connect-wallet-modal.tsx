"use client";

import React, { useState } from "react";
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
import { Sparkles, ShieldCheck, ExternalLink, Loader2, AlertCircle } from "lucide-react";

interface WalletOption {
  id: string;
  name: string;
  connectorId: string;
  description: string;
  badge?: string;
  icon: string;
}

const WALLET_OPTIONS: WalletOption[] = [
  {
    id: "metamask",
    name: "MetaMask",
    connectorId: "metaMask",
    description: "Connect with your MetaMask extension or mobile app on Sepolia",
    badge: "Popular",
    icon: "🦊",
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    connectorId: "walletConnect",
    description: "Scan QR code with 300+ mobile wallets (Rainbow, Trust, etc.)",
    icon: "🔗",
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    connectorId: "coinbaseWallet",
    description: "Connect via Coinbase Wallet browser extension or mobile app",
    icon: "🔷",
  },
  {
    id: "injected",
    name: "Browser Injected",
    connectorId: "injected",
    description: "Connect with any EIP-6963 detected browser extension wallet",
    icon: "⚡",
  },
];

export function ConnectWalletModal() {
  const { connect, connectDemo, isConnecting } = useWallet();
  const { isOpen, closeModal, openModal } = useModal();
  const [pendingConnector, setPendingConnector] = useState<string | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);

  const open = isOpen("CONNECT_WALLET");

  const handleSelectWallet = async (option: WalletOption) => {
    setConnectError(null);
    setPendingConnector(option.connectorId);
    try {
      await connect(option.connectorId);
      closeModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Connection failed";
      // Only set error banner if not benign user cancellation
      if (!msg.includes("User rejected") && !msg.includes("cancelled")) {
        setConnectError(msg);
      }
    } finally {
      setPendingConnector(null);
    }
  };

  const handleDemoConnect = () => {
    connectDemo();
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
            Connect an approved Web3 provider on Ethereum Sepolia Testnet (Chain ID: 11155111) to interact with tokens, presales, and vaults.
          </DialogDescription>
        </DialogHeader>

        {/* Error banner if connection failed */}
        {connectError && (
          <div className="my-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 flex items-start gap-2 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Connection Error</p>
              <p className="text-[11px] opacity-90 line-clamp-2">{connectError}</p>
            </div>
          </div>
        )}

        {/* Quick Demo Connect Banner (for test environments without extension) */}
        <div className="my-2.5 rounded-lg border border-primary/30 bg-primary/5 p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-primary shrink-0" />
            <div className="text-xs">
              <p className="font-medium text-foreground">Testing Sandbox</p>
              <p className="text-muted-foreground text-[11px]">No extension installed? Connect simulated Sepolia account</p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleDemoConnect}
            className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold px-3 py-1.5"
          >
            Quick Sandbox
          </Button>
        </div>

        {/* Real Provider List */}
        <div className="space-y-2 py-1">
          {WALLET_OPTIONS.map((wallet) => {
            const isThisPending = isConnecting && pendingConnector === wallet.connectorId;

            return (
              <button
                key={wallet.id}
                disabled={isConnecting}
                onClick={() => handleSelectWallet(wallet)}
                className="group flex w-full items-center justify-between rounded-xl border border-border/50 bg-secondary/30 p-3.5 text-left transition-all hover:border-primary/50 hover:bg-secondary/70 hover:shadow-sm disabled:opacity-60 cursor-pointer"
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
                <div>
                  {isThisPending ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : (
                    <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      Connect →
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info & Risk disclosure link */}
        <div className="pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Sepolia Testnet only (Chain ID 11155111)</span>
          <button
            onClick={() => {
              closeModal();
              openModal("RISK_WARNING");
            }}
            className="inline-flex items-center gap-1 text-primary hover:underline cursor-pointer"
          >
            Risk Warning <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
