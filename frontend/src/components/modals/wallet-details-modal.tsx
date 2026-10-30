"use client";

import React, { useState } from "react";
import { useWallet, SUPPORTED_NETWORKS } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check, LogOut, ExternalLink, Wallet, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function WalletDetailsModal() {
  const { address, shortAddress, balance, network, walletProvider, disconnect, switchNetwork } =
    useWallet();
  const { isOpen, closeModal } = useModal();
  const [copied, setCopied] = useState(false);

  const open = isOpen("WALLET_DETAILS");

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Address Copied", {
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    closeModal();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && closeModal()}>
      <DialogContent className="sm:max-w-md border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl p-6">
        <DialogHeader className="space-y-1.5 pb-2 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
                  Connected Wallet
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {walletProvider || "Web3 Provider"}
                </DialogDescription>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Demo Sandbox
            </span>
          </div>
        </DialogHeader>

        {/* Balance Card */}
        <div className="my-3 rounded-xl border border-border/60 bg-secondary/30 p-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Total Balance (Simulated)
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            {balance} <span className="text-lg font-semibold text-primary">{network.symbol}</span>
          </p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <code className="rounded-md bg-muted px-2.5 py-1 text-xs font-mono text-foreground">
              {shortAddress}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="h-7 px-2.5 text-xs gap-1 border-border/60"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy
                </>
              )}
            </Button>
            <a
              href={`https://etherscan.io/address/${address}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-7 items-center justify-center rounded-md border border-border/60 bg-background px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Network Switcher Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Switch Active Network</p>
            <span className="text-[10px] text-muted-foreground italic">(Simulated switch)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SUPPORTED_NETWORKS.map((n) => {
              const isCurrent = n.id === network.id;
              return (
                <button
                  key={n.id}
                  onClick={() => switchNetwork(n.id)}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                    isCurrent
                      ? "border-primary bg-primary/10 font-semibold text-primary"
                      : "border-border/50 bg-secondary/20 hover:border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{n.icon}</span>
                    <span>{n.name}</span>
                  </span>
                  {isCurrent && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Links & Disconnect Action */}
        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between gap-2">
          <Link
            href="/account"
            onClick={closeModal}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <Wallet className="h-3.5 w-3.5" /> Go to Account
          </Link>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleDisconnect}
            className="text-xs gap-1.5 h-8 bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="h-3.5 w-3.5" /> Disconnect
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
