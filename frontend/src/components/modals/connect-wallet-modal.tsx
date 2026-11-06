import React, { useEffect, useState } from "react";
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
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Loader2,
  AlertCircle,
  ArrowUpRight,
  X,
} from "lucide-react";

interface WalletOption {
  id: string;
  name: string;
  connectorId: string;
  badge?: string;
  icon: string;
}

const WALLET_OPTIONS: WalletOption[] = [
  {
    id: "metamask",
    name: "MetaMask",
    connectorId: "metaMask",
    badge: "Popular",
    icon: "🦊",
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    connectorId: "walletConnect",
    icon: "🔗",
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    connectorId: "coinbaseWallet",
    icon: "🔷",
  },
  {
    id: "injected",
    name: "Browser Injected",
    connectorId: "injected",
    icon: "⚡",
  },
];

export function ConnectWalletModal() {
  const { connect, connectDemo, isConnecting } = useWallet();
  const { isOpen, closeModal, openModal } = useModal();
  const [pendingConnector, setPendingConnector] = useState<string | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);

  const open = isOpen("CONNECT_WALLET");

  useEffect(() => {
    if (!connectError) return;
    const timeoutId = window.setTimeout(() => setConnectError(null), 4500);
    return () => window.clearTimeout(timeoutId);
  }, [connectError]);

  const handleSelectWallet = async (option: WalletOption) => {
    setConnectError(null);
    setPendingConnector(option.connectorId);
    try {
      await connect(option.connectorId);
      closeModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Connection failed";
      if (
        !msg.includes("User rejected") &&
        !msg.includes("cancelled") &&
        !msg.includes("User denied")
      ) {
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
              Connect a Wallet
            </DialogTitle>
          </div>
          <DialogDescription className="text-[11px] text-[#a7a5b8]">Sepolia Testnet · Chain ID 11155111</DialogDescription>
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
                {connectError.includes("Provider not found")
                  ? "Wallet provider unavailable. Check that the extension is installed and enabled."
                  : connectError}
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
          <p className="flex min-h-8 min-w-0 flex-1 items-center self-center text-[13px] font-semibold leading-none text-[#f0ecff]">
            Testing Sandbox
          </p>
          <Button
            size="sm"
            onClick={handleDemoConnect}
            disabled={isConnecting}
            className="h-8 shrink-0 rounded-full bg-[#b7a2ff] px-3 text-[11px] font-semibold text-[#171326] shadow-none hover:bg-[#c7b8ff]"
          >
            Quick Sandbox
          </Button>
        </section>

        <section aria-label="Available wallet providers" className="space-y-1.5">
          <div className="flex items-center justify-between px-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#85839a]">
              Wallets
            </p>
          </div>

          <div className="space-y-1.5">
            {WALLET_OPTIONS.map((wallet) => {
              const isThisPending =
                isConnecting && pendingConnector === wallet.connectorId;

              return (
                <button
                  key={wallet.id}
                  type="button"
                  disabled={isConnecting}
                  onClick={() => handleSelectWallet(wallet)}
                  className="
                    group flex min-h-[58px] w-full min-w-0 items-center gap-3
                    rounded-xl border border-white/[0.08] bg-white/[0.025]
                    px-3 py-2 text-left transition-colors duration-150
                    hover:border-[#b7a2ff]/35 hover:bg-[#b7a2ff]/[0.06]
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-[#b7a2ff]/60
                    disabled:cursor-not-allowed disabled:opacity-55
                  "
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-[#1b1d30] text-[21px]">
                    {wallet.icon}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="truncate text-[13px] font-semibold text-[#eeecf8] transition-colors group-hover:text-white">
                        {wallet.name}
                      </span>
                      {wallet.badge && (
                        <span className="rounded-full border border-[#b7a2ff]/20 bg-[#b7a2ff]/10 px-2 py-0.5 text-[9px] font-semibold text-[#c7b7ff]">
                          {wallet.badge}
                        </span>
                      )}
                    </span>
                  </span>

                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#77758a] transition-all group-hover:bg-[#b7a2ff]/10 group-hover:text-[#d5caff]">
                    {isThisPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 opacity-60 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="flex justify-end border-t border-white/[0.08] pt-2 text-[10px] text-[#858398]">
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
