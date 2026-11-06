import React, { useState, useEffect } from "react";
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
  Copy,
  Check,
  LogOut,
  ExternalLink,
  Send,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Coins,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { SUPPORTED_TESTNETS } from "@/web3/config/networks";
import { fetchEvmTransactionHistory } from "@/web3/services/transactions/evm-history";
import { fetchSolanaTransactionHistory } from "@/web3/services/transactions/solana-history";
import { fetchTonTransactionHistory } from "@/web3/services/transactions/ton-history";
import { fetchTronTransactionHistory } from "@/web3/services/transactions/tron-history";
import type { BlockchainEcosystem } from "@/web3/types/wallet.types";
import type { TransactionRecord } from "@/web3/types/transaction.types";

export function WalletDetailsModal() {
  const { isOpen, closeModal, openModal, modalProps } = useModal();
  const multiWallet = useMultiWallet();

  const initialEcosystem = (modalProps?.ecosystem as BlockchainEcosystem) || "evm";
  const [selectedEcosystem, setSelectedEcosystem] = useState<BlockchainEcosystem>(initialEcosystem);

  useEffect(() => {
    if (modalProps?.ecosystem) {
      setSelectedEcosystem(modalProps.ecosystem as BlockchainEcosystem);
    }
  }, [modalProps?.ecosystem]);

  const activeWallet = multiWallet[selectedEcosystem];
  const networkConfig = SUPPORTED_TESTNETS[selectedEcosystem];

  const [activeTab, setActiveTab] = useState<"overview" | "tokens" | "history">("overview");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<TransactionRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const open = isOpen("WALLET_DETAILS");

  // Load transaction history when history tab is selected or address changes
  useEffect(() => {
    if (!open || activeTab !== "history" || !activeWallet.address) return;

    let isCancelled = false;
    setIsLoadingHistory(true);

    async function loadHistory() {
      try {
        let records: TransactionRecord[] = [];
        if (selectedEcosystem === "evm") {
          records = await fetchEvmTransactionHistory(activeWallet.address!);
        } else if (selectedEcosystem === "solana") {
          records = await fetchSolanaTransactionHistory(activeWallet.address!);
        } else if (selectedEcosystem === "ton") {
          records = await fetchTonTransactionHistory(activeWallet.address!);
        } else if (selectedEcosystem === "tron") {
          records = await fetchTronTransactionHistory(activeWallet.address!);
        }
        if (!isCancelled) setHistory(records);
      } catch {
        if (!isCancelled) setHistory([]);
      } finally {
        if (!isCancelled) setIsLoadingHistory(false);
      }
    }

    loadHistory();
    return () => {
      isCancelled = true;
    };
  }, [open, activeTab, selectedEcosystem, activeWallet.address]);

  const handleCopy = () => {
    if (activeWallet.address) {
      navigator.clipboard.writeText(activeWallet.address);
      setCopied(true);
      toast.success("Address Copied", {
        description: `${networkConfig.shortName} address copied to clipboard`,
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDisconnect = async () => {
    await activeWallet.disconnect();
    toast.info("Wallet Disconnected", {
      description: `${networkConfig.shortName} connection has been disconnected.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && closeModal()}>
      <DialogContent className="sm:max-w-lg border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl p-6 text-foreground max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-1.5 pb-2 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  activeWallet.isUnsupportedNetwork
                    ? "bg-amber-500/10 text-amber-500"
                    : activeWallet.isConnected
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {activeWallet.isUnsupportedNetwork ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : activeWallet.isConnected ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Coins className="h-5 w-5" />
                )}
              </span>
              <div>
                <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
                  Multi-Chain Wallet
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {activeWallet.walletName} · {networkConfig.networkName}
                </DialogDescription>
              </div>
            </div>

            {/* Testnet Badge */}
            <span className="rounded-full bg-primary/10 border border-primary/30 px-2.5 py-0.5 text-xs font-medium text-primary">
              {networkConfig.shortName}
            </span>
          </div>
        </DialogHeader>

        {/* 4-Chain Ecosystem Selector Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-secondary/30 border border-border/40 text-xs">
          {(["evm", "solana", "ton", "tron"] as BlockchainEcosystem[]).map((eco) => {
            const isSelected = selectedEcosystem === eco;
            const w = multiWallet[eco];
            return (
              <button
                key={eco}
                type="button"
                onClick={() => setSelectedEcosystem(eco)}
                className={`py-1.5 px-2 rounded-lg font-semibold text-center transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="truncate uppercase font-bold">{eco}</div>
                <div className="text-[9px] opacity-80">{w.isConnected ? "● On" : "○ Off"}</div>
              </button>
            );
          })}
        </div>

        {/* View Sub-tabs: Overview, Tokens, History */}
        {activeWallet.isConnected && (
          <div className="flex border-b border-border/40 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`pb-2 px-3 border-b-2 transition-colors ${
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("tokens")}
              className={`pb-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === "tokens"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Tokens ({activeWallet.tokens.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`pb-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === "history"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clock className="h-3 w-3" /> History
            </button>
          </div>
        )}

        {!activeWallet.isConnected ? (
          <div className="space-y-4 py-8 text-center">
            <Coins className="h-10 w-10 mx-auto text-muted-foreground opacity-50" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {networkConfig.networkName} Not Connected
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                Connect {activeWallet.walletName} to manage your testnet balance, send and receive assets, and view transaction history.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => activeWallet.connect()}
              disabled={activeWallet.isConnecting}
              className="text-xs font-semibold px-4"
            >
              {activeWallet.isConnecting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
              ) : null}
              Connect {activeWallet.walletName}
            </Button>
          </div>
        ) : activeTab === "overview" ? (
          <div className="space-y-4">
            {/* Address Banner */}
            <div className="rounded-xl border border-border/60 bg-secondary/20 p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                  Connected Address
                </span>
                <p className="font-mono text-xs font-semibold text-foreground truncate mt-0.5" title={activeWallet.address || ""}>
                  {activeWallet.address}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleCopy}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  title="Copy address"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button
                  asChild
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  title="View on explorer"
                >
                  <a
                    href={networkConfig.explorerAddressUrl(activeWallet.address || "")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Native Balance Card */}
            <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-secondary/40 to-secondary/10 p-5 text-center space-y-1">
              <span className="text-xs text-muted-foreground font-medium">Testnet Balance</span>
              <div className="text-3xl font-extrabold tracking-tight text-foreground flex items-center justify-center gap-2">
                <span>{activeWallet.nativeBalance}</span>
                <span className="text-sm font-semibold text-primary">{activeWallet.nativeSymbol}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">{networkConfig.networkName}</p>
            </div>

            {/* Quick Actions: Send, Receive, Refresh */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => {
                  closeModal();
                  openModal("SEND_TRANSACTION", { ecosystem: selectedEcosystem });
                }}
                className="gap-2 text-xs font-semibold py-5"
              >
                <Send className="h-4 w-4" /> Send {activeWallet.nativeSymbol}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  closeModal();
                  openModal("RECEIVE_TRANSACTION", { ecosystem: selectedEcosystem });
                }}
                className="gap-2 text-xs font-semibold border-border/60 py-5"
              >
                <QrCode className="h-4 w-4" /> Receive {activeWallet.nativeSymbol}
              </Button>
            </div>

            {/* Disconnect and Refresh Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => activeWallet.refreshBalance()}
                className="text-xs text-muted-foreground gap-1.5 h-8"
              >
                <RotateCw className="h-3.5 w-3.5" /> Refresh Balance
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDisconnect}
                className="text-xs gap-1.5 h-8"
              >
                <LogOut className="h-3.5 w-3.5" /> Disconnect
              </Button>
            </div>
          </div>
        ) : activeTab === "tokens" ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Supported Testnet Tokens</span>
              <span>Balance</span>
            </div>
            {activeWallet.tokens.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">
                No supported token holdings registered for this testnet.
              </p>
            ) : (
              <div className="space-y-2">
                {activeWallet.tokens.map((token) => (
                  <div
                    key={token.address}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-secondary/20 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{token.name}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{token.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{token.balance}</p>
                      <p className="text-[10px] text-muted-foreground">{token.symbol}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Transaction History Tab */
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Recent Testnet Activity</span>
              <span>Explorer</span>
            </div>

            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-8 text-xs text-muted-foreground gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Querying testnet explorer...
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground space-y-1">
                <Clock className="h-6 w-6 mx-auto opacity-40 mb-1" />
                <p className="font-semibold">No recent transactions found</p>
                <p className="text-[11px]">Transactions submitted from HorizonX or indexed on {networkConfig.shortName} will appear here.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {history.map((tx) => (
                  <div
                    key={tx.hash}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-secondary/20 text-xs hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                          tx.direction === "outgoing"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-emerald-500/10 text-emerald-400"
                        }`}
                      >
                        {tx.direction === "outgoing" ? (
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowDownLeft className="h-3.5 w-3.5" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground capitalize">
                            {tx.direction} Transfer
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                              tx.status === "confirmed"
                                ? "bg-emerald-500/15 text-emerald-400"
                                : tx.status === "failed"
                                ? "bg-destructive/15 text-destructive"
                                : "bg-amber-500/15 text-amber-400"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </div>
                        <p className="font-mono text-[10px] text-muted-foreground truncate" title={tx.hash}>
                          {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-semibold text-foreground">
                        {tx.direction === "outgoing" ? "-" : "+"}
                        {tx.amount} {tx.assetSymbol}
                      </p>
                      <a
                        href={tx.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline mt-0.5"
                      >
                        Explorer <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
