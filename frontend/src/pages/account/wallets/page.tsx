import React from "react";
import { AccountSectionNav } from "@/components/account/account-section-nav";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useMultiWallet } from "@/web3";
import { useModal } from "@/contexts/modal-context";
import {
  Wallet,
  CheckCircle2,
  Plus,
  Send,
  QrCode,
  ExternalLink,
  ShieldCheck,
  Coins,
  LogOut,
} from "lucide-react";
import { SUPPORTED_TESTNETS } from "@/web3/config/networks";
import type { BlockchainEcosystem } from "@/web3/types/wallet.types";

interface EcosystemCardConfig {
  id: BlockchainEcosystem;
  title: string;
  badge: string;
  icon: string;
  colorClass: string;
}

const ECOSYSTEM_CARDS: EcosystemCardConfig[] = [
  {
    id: "evm",
    title: "Ethereum Sepolia",
    badge: "EVM Preferred",
    icon: "🦊",
    colorClass: "from-blue-500/10 to-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },
  {
    id: "solana",
    title: "Solana Devnet",
    badge: "Solana Preferred",
    icon: "👻",
    colorClass: "from-purple-500/10 to-violet-500/10 text-purple-400 border-purple-500/20",
  },
  {
    id: "ton",
    title: "TON Testnet",
    badge: "TON Preferred",
    icon: "💎",
    colorClass: "from-sky-500/10 to-cyan-500/10 text-sky-400 border-sky-500/20",
  },
  {
    id: "tron",
    title: "TRON Shasta",
    badge: "TRON Preferred",
    icon: "⚡",
    colorClass: "from-red-500/10 to-amber-500/10 text-red-400 border-red-500/20",
  },
];

export default function AccountWalletsPage() {
  const multiWallet = useMultiWallet();
  const { openModal } = useModal();

  return (
    <div className="mx-0 w-full max-w-none px-[clamp(1rem,2.25vw,2.5rem)] pt-0 pb-8 space-y-8">
      <AccountSectionNav />
      <PageHeader
        title="Multi-Chain Wallet Connections"
        description="Four independent Web3 testnet connections for Ethereum Sepolia, Solana Devnet, TON Testnet, and TRON Shasta."
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
            <Plus className="h-3.5 w-3.5" /> Connect Wallets
          </Button>
        }
      />

      {/* Network Isolation Banner */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Isolated Testnet Architecture ({multiWallet.connectedCount} of 4 Connected)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Each ecosystem uses dedicated providers without shared state or connection conflicts. Mainnet support is strictly prohibited.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Ecosystem Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ECOSYSTEM_CARDS.map((card) => {
          const walletState = multiWallet[card.id];
          const net = SUPPORTED_TESTNETS[card.id];
          const isConnected = walletState.isConnected;

          return (
            <div
              key={card.id}
              className={`rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md space-y-4 shadow-lg transition-all hover:border-border`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary border border-border/60 text-2xl shadow-inner">
                    {card.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-foreground">{card.title}</h4>
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {walletState.walletName}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{net.networkName}</p>
                  </div>
                </div>

                <div>
                  {isConnected ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" /> Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      Disconnected
                    </span>
                  )}
                </div>
              </div>

              {isConnected && walletState.address ? (
                <div className="space-y-3 pt-1">
                  <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                        Wallet Address
                      </span>
                      <code className="text-xs font-mono text-foreground truncate block" title={walletState.address}>
                        {walletState.address}
                      </code>
                    </div>
                    <a
                      href={net.explorerAddressUrl(walletState.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors shrink-0"
                      title="View on explorer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs text-muted-foreground">Testnet Balance:</span>
                    <span className="font-bold text-sm text-foreground">
                      {walletState.nativeBalance} <span className="text-primary text-xs">{walletState.nativeSymbol}</span>
                    </span>
                  </div>

                  {/* Actions for connected wallet */}
                  <div className="flex items-center gap-2 pt-1 border-t border-border/40">
                    <Button
                      size="sm"
                      onClick={() => openModal("SEND_TRANSACTION", { ecosystem: card.id })}
                      className="flex-1 text-xs gap-1.5 font-semibold h-8"
                    >
                      <Send className="h-3.5 w-3.5" /> Send
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openModal("RECEIVE_TRANSACTION", { ecosystem: card.id })}
                      className="flex-1 text-xs gap-1.5 font-semibold border-border/60 h-8"
                    >
                      <QrCode className="h-3.5 w-3.5" /> Receive
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => walletState.disconnect()}
                      className="text-xs text-destructive hover:bg-destructive/10 h-8 px-2.5"
                      title="Disconnect wallet"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-2 text-center border-t border-border/40">
                  <p className="text-xs text-muted-foreground">
                    Connect {walletState.walletName} to activate {net.shortName} functionality.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => walletState.connect()}
                    disabled={walletState.isConnecting}
                    className="w-full text-xs font-semibold h-8"
                  >
                    Connect {walletState.walletName}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
