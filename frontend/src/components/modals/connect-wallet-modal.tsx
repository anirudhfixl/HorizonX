import React, { useEffect, useState } from "react";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { useMultiWallet } from "@/web3";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Loader2,
  AlertCircle,
  X,
  CheckCircle2,
} from "lucide-react";
import type { BlockchainEcosystem } from "@/web3/types/wallet.types";

interface EcosystemOption {
  id: BlockchainEcosystem;
  name: string;
  networkName: string;
  walletName: string;
  icon: string;
  badge?: string;
}

const ECOSYSTEM_OPTIONS: EcosystemOption[] = [
  {
    id: "evm",
    name: "Ethereum Sepolia",
    networkName: "Sepolia Testnet (11155111)",
    walletName: "MetaMask",
    badge: "Preferred EVM",
    icon: "🦊",
  },
  {
    id: "solana",
    name: "Solana Devnet",
    networkName: "Devnet Cluster",
    walletName: "Phantom",
    badge: "Preferred Solana",
    icon: "👻",
  },
  {
    id: "ton",
    name: "TON Testnet",
    networkName: "Testnet Workchain (-3)",
    walletName: "Tonkeeper",
    badge: "Preferred TON",
    icon: "💎",
  },
  {
    id: "tron",
    name: "TRON Shasta",
    networkName: "Shasta Testnet",
    walletName: "TronLink",
    badge: "Preferred TRON",
    icon: "⚡",
  },
];

export function ConnectWalletModal() {
  const { connectDemo } = useWallet();
  const multiWallet = useMultiWallet();
  const { isOpen, closeModal, openModal } = useModal();
  const [pendingEcosystem, setPendingEcosystem] = useState<BlockchainEcosystem | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);

  const open = isOpen("CONNECT_WALLET");

  useEffect(() => {
    if (!connectError) return;
    const timeoutId = window.setTimeout(() => setConnectError(null), 4500);
    return () => window.clearTimeout(timeoutId);
  }, [connectError]);

  const handleConnectEcosystem = async (eco: BlockchainEcosystem) => {
    setConnectError(null);
    setPendingEcosystem(eco);
    try {
      if (eco === "evm") {
        await multiWallet.evm.connect();
      } else if (eco === "solana") {
        await multiWallet.solana.connect();
      } else if (eco === "ton") {
        await multiWallet.ton.connect();
      } else if (eco === "tron") {
        await multiWallet.tron.connect();
      }
      closeModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Connection failed";
      if (
        !msg.includes("User rejected") &&
        !msg.includes("cancelled") &&
        !msg.includes("User denied") &&
        !msg.includes("declined")
      ) {
        setConnectError(msg);
      }
    } finally {
      setPendingEcosystem(null);
    }
  };

  const handleDemoConnect = () => {
    connectDemo();
    closeModal();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && closeModal()}>
      <DialogContent
        className="
          fixed top-[calc(50%+28px)] left-1/2 -translate-x-1/2 -translate-y-1/2
          flex w-[calc(100vw-24px)] sm:max-w-[520px]
          max-h-[calc(100dvh-104px)] min-h-0 flex-col overflow-x-hidden overflow-y-auto overscroll-contain
          gap-3 rounded-2xl border border-white/10
          bg-[#111322]/[0.98] p-3.5 text-[#f2f0ff]
          shadow-[0_24px_80px_rgba(0,0,0,0.58)]
          sm:p-4
        "
      >
        <DialogHeader className="space-y-1.5 border-b border-white/[0.08] pb-3 pr-8">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#b7a2ff]/20 bg-[#b7a2ff]/10 text-[#c8b8ff]">
              <ShieldCheck className="h-[18px] w-[18px]" />
            </span>
            <DialogTitle className="text-lg font-semibold tracking-tight text-[#f4f1ff] sm:text-xl">
              Connect Multi-Chain Wallets
            </DialogTitle>
          </div>
          <DialogDescription className="text-[11px] text-[#a7a5b8]">
            Four Independent Testnet Connections · Strict Testnet Isolation
          </DialogDescription>
        </DialogHeader>

        {connectError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-400/25 bg-red-400/[0.07] px-3 py-2 text-xs text-red-200"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Connection failed</p>
              <p className="mt-0.5 break-words text-[11px] leading-4 text-red-200/80">
                {connectError}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setConnectError(null)}
              aria-label="Dismiss connection warning"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-red-200/70 transition-colors hover:bg-red-200/10 hover:text-red-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <section className="flex min-h-[48px] items-center gap-3 rounded-xl border border-[#a995ff]/25 bg-[#a995ff]/[0.07] px-3 py-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center self-center rounded-lg bg-[#b7a2ff]/12 text-[#c7b7ff]">
            <Sparkles className="h-4 w-4" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold leading-none text-[#f0ecff]">
              Sandbox Demo Mode
            </p>
            <p className="text-[11px] text-[#a7a5b8] mt-1">
              Explore HorizonX without browser wallet extensions
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleDemoConnect}
            className="h-8 shrink-0 rounded-full bg-[#b7a2ff] px-3 text-[11px] font-semibold text-[#171326] shadow-none hover:bg-[#c7b8ff]"
          >
            Quick Sandbox
          </Button>
        </section>

        <section aria-label="Available blockchain ecosystems" className="space-y-1.5">
          <div className="flex items-center justify-between px-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#85839a]">
              Independent Testnet Wallets ({multiWallet.connectedCount}/4 Connected)
            </p>
          </div>

          <div className="space-y-2">
            {ECOSYSTEM_OPTIONS.map((eco) => {
              const state = multiWallet[eco.id];
              const isThisPending = pendingEcosystem === eco.id || state.isConnecting;
              const isConnected = state.isConnected;

              return (
                <div
                  key={eco.id}
                  className="
                    group flex min-h-[62px] w-full min-w-0 items-center justify-between gap-3
                    rounded-xl border border-white/[0.08] bg-white/[0.025]
                    px-3 py-2.5 text-left transition-colors duration-150
                    hover:border-[#b7a2ff]/35 hover:bg-[#b7a2ff]/[0.06]
                  "
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-[#1b1d30] text-[21px]">
                      {eco.icon}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="truncate text-[13px] font-semibold text-[#eeecf8]">
                          {eco.walletName}
                        </span>
                        {eco.badge && (
                          <span className="rounded-full border border-[#b7a2ff]/20 bg-[#b7a2ff]/10 px-2 py-0.5 text-[9px] font-semibold text-[#c7b7ff]">
                            {eco.badge}
                          </span>
                        )}
                        {isConnected && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-400">
                            <CheckCircle2 className="h-2.5 w-2.5" /> Connected
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#8e8ca0] truncate mt-0.5">
                        {eco.networkName}
                        {isConnected && state.shortAddress ? ` · ${state.shortAddress}` : ""}
                      </p>
                    </div>
                  </div>

                  <div>
                    {isConnected ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          closeModal();
                          openModal("WALLET_DETAILS", { ecosystem: eco.id });
                        }}
                        className="h-8 rounded-lg border-white/20 bg-white/5 text-[11px] font-semibold text-[#eeecf8] hover:bg-white/10"
                      >
                        Manage
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        disabled={isThisPending}
                        onClick={() => handleConnectEcosystem(eco.id)}
                        className="h-8 rounded-lg bg-[#b7a2ff] px-3 text-[11px] font-semibold text-[#171326] shadow-none hover:bg-[#c7b8ff]"
                      >
                        {isThisPending ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          "Connect"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="flex items-center justify-between border-t border-white/[0.08] pt-2 text-[10px] text-[#858398]">
          <span>Testnet Only · Mainnet Prohibited</span>
          <button
            type="button"
            onClick={() => {
              closeModal();
              openModal("RISK_WARNING");
            }}
            className="inline-flex items-center gap-1.5 font-medium text-[#c4b4ff] transition-colors hover:text-white"
          >
            Risk Warning
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
