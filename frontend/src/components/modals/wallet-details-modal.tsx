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
import {
  Copy,
  Check,
  LogOut,
  ExternalLink,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export function WalletDetailsModal() {
  const {
    address,
    shortAddress,
    balance,
    network,
    chainId,
    isUnsupportedNetwork,
    isDemoMode,
    walletProvider,
    disconnect,
    switchNetwork,
  } = useWallet();

  const { isOpen, closeModal } = useModal();
  const [copied, setCopied] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

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

  const handleSwitchToSepolia = async () => {
    setIsSwitching(true);
    try {
      await switchNetwork(11155111);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && closeModal()}>
      <DialogContent className="sm:max-w-md border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl p-6">
        <DialogHeader className="space-y-1.5 pb-2 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  isUnsupportedNetwork
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-emerald-500/10 text-emerald-500"
                }`}
              >
                {isUnsupportedNetwork ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : (
                  <CheckCircle2 className="h-5 w-5" />
                )}
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

            {/* Network / Session Badge */}
            {isDemoMode ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Demo Sandbox
              </span>
            ) : isUnsupportedNetwork ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                Wrong Network
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Sepolia Active
              </span>
            )}
          </div>
        </DialogHeader>

        {/* Unsupported Network Warning Alert */}
        {isUnsupportedNetwork && (
          <div className="my-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Unsupported Network Detected ({chainId || "Unknown Chain"})</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              HorizonX Milestone 1-B exclusively operates on the Ethereum Sepolia Testnet (Chain ID: 11155111). Please switch networks to proceed.
            </p>
            <Button
              size="sm"
              disabled={isSwitching}
              onClick={handleSwitchToSepolia}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs h-8 gap-1.5"
            >
              {isSwitching ? (
                <RotateCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <span>Switch to Sepolia (11155111)</span>
              )}
            </Button>
          </div>
        )}

        {/* Balance Card */}
        <div className="my-2.5 rounded-xl border border-border/60 bg-secondary/30 p-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {isDemoMode ? "Simulated Balance" : "Sepolia Native Balance"}
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground font-mono">
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
              className="h-7 px-2.5 text-xs gap-1 border-border/60 cursor-pointer"
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
              href={`${network.explorerUrl}/address/${address}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-7 items-center justify-center rounded-md border border-border/60 bg-background px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              title="View on Sepolia Etherscan"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Network Information Section */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Active Protocol Network</p>
          <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 font-medium text-foreground">
              <span>{network.icon}</span>
              <span>{network.name}</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                (ID: {network.chainId})
              </span>
            </span>
            <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
              Standard D-04
            </span>
          </div>
        </div>

        {/* Quick Links & Disconnect Action */}
        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between gap-2">
          <Link
            to="/account"
            onClick={closeModal}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <Wallet className="h-3.5 w-3.5" /> Go to Account
          </Link>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleDisconnect}
            className="text-xs gap-1.5 h-8 bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" /> Disconnect
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
