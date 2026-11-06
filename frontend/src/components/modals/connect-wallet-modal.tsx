import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { useMultiWallet, openReownAppKit } from "@/web3";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  Sparkles,
  Loader2,
  AlertCircle,
  X,
  CheckCircle2,
  ArrowLeft,
  QrCode,
  Laptop,
  Smartphone,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Info,
} from "lucide-react";
import {
  MetaMaskLogo,
  PhantomLogo,
  GramWalletLogo,
  TronLinkLogo,
} from "@/components/shared/wallet-icons";
import { QrCodeSvg } from "@/web3/utils/qr-code";
import { TON_CONFIG } from "@/web3/config/ton.config";
import type { BlockchainEcosystem } from "@/web3/types/wallet.types";
import { toast } from "sonner";

interface EcosystemOption {
  id: BlockchainEcosystem;
  name: string;
  networkName: string;
  walletName: string;
  badge: string;
  iconBg: string;
  renderIcon: (props: { className?: string }) => React.JSX.Element;
}

const ECOSYSTEM_OPTIONS: EcosystemOption[] = [
  {
    id: "evm",
    name: "Ethereum Sepolia",
    networkName: "Sepolia Testnet (11155111)",
    walletName: "MetaMask",
    badge: "Preferred EVM",
    iconBg: "bg-[#e2761b]/10 border-[#e2761b]/25",
    renderIcon: (props) => <MetaMaskLogo {...props} />,
  },
  {
    id: "solana",
    name: "Solana Devnet",
    networkName: "Devnet Cluster",
    walletName: "Phantom",
    badge: "Preferred Solana",
    iconBg: "bg-[#534bb1]/10 border-[#534bb1]/25",
    renderIcon: (props) => <PhantomLogo {...props} />,
  },
  {
    id: "ton",
    name: "TON Testnet",
    networkName: "Testnet Workchain (-3)",
    walletName: "Gram Wallet",
    badge: "Preferred TON",
    iconBg: "bg-[#0098ea]/10 border-[#0098ea]/25",
    renderIcon: (props) => <GramWalletLogo {...props} />,
  },
  {
    id: "tron",
    name: "TRON Shasta",
    networkName: "Shasta Testnet (0x94a9059e)",
    walletName: "TronLink",
    badge: "Preferred TRON",
    iconBg: "bg-[#ff0613]/10 border-[#ff0613]/25",
    renderIcon: (props) => <TronLinkLogo {...props} />,
  },
];

export function ConnectWalletModal() {
  const { isDemoActive, connectDemo, disconnectDemo } = useWallet();
  const multiWallet = useMultiWallet();
  const { isOpen, closeModal, openModal } = useModal();

  // Navigation state: null = 4-ecosystem overview, or dedicated ecosystem connection view
  const [selectedEcoFlow, setSelectedEcoFlow] = useState<BlockchainEcosystem | null>(null);

  // Sub-tabs inside dedicated views
  const [solanaTab, setSolanaTab] = useState<"extension" | "qr">("extension");
  const [tonTab, setTonTab] = useState<"qr" | "wallets" | "manual">("qr");

  // Error and pending states
  const [connectError, setConnectError] = useState<string | null>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [manualTonAddr, setManualTonAddr] = useState("");

  // Unique session ID for genuine QR handshake sessions
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 10) + Date.now().toString(36));

  // Provider detection state
  const [detectedExtensions, setDetectedExtensions] = useState({
    phantom: false,
    gram: false,
    tronLink: false,
  });

  const checkExtensions = useCallback(() => {
    if (typeof window === "undefined") return;
    const anyWin = window as unknown as {
      phantom?: { solana?: { isPhantom?: boolean } };
      solana?: { isPhantom?: boolean };
      tonconnect?: { gramwallet?: unknown };
      gramwallet?: unknown;
      gramWallet?: unknown;
      tronWeb?: unknown;
      tronLink?: unknown;
    };

    setDetectedExtensions({
      phantom: Boolean(anyWin?.phantom?.solana?.isPhantom === true || anyWin?.solana?.isPhantom === true),
      gram: Boolean(anyWin?.tonconnect?.gramwallet || anyWin?.gramwallet || anyWin?.gramWallet),
      tronLink: Boolean(anyWin?.tronWeb || anyWin?.tronLink),
    });
  }, []);

  const open = isOpen("CONNECT_WALLET");

  // Reset navigation when modal closes or opens
  useEffect(() => {
    if (open) {
      checkExtensions();
      setConnectError(null);
    } else {
      setSelectedEcoFlow(null);
      setConnectError(null);
    }
  }, [open, checkExtensions]);

  useEffect(() => {
    if (!connectError) return;
    const timeoutId = window.setTimeout(() => setConnectError(null), 6000);
    return () => window.clearTimeout(timeoutId);
  }, [connectError]);

  // Genuine QR payloads
  const solanaQrPayload = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://localhost";
    const dappUrl = `${origin}/?cluster=devnet&connect=solana&session=${sessionId}`;
    return `https://phantom.app/ul/browse/${encodeURIComponent(dappUrl)}?ref=${encodeURIComponent(origin)}`;
  }, [sessionId]);

  const tonQrPayload = useMemo(() => {
    const requestPayload = {
      manifestUrl: TON_CONFIG.manifestUrl,
      items: [{ name: "ton_addr" }],
    };
    return `https://connect.gramwallet.io/ton-connect?v=2&id=${sessionId}&r=${encodeURIComponent(JSON.stringify(requestPayload))}`;
  }, [sessionId]);

  const handleCopyPayload = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedPayload(true);
      toast.success("Connection URI Copied", {
        description: `${label} payload copied to clipboard.`,
      });
      setTimeout(() => setCopiedPayload(false), 2000);
    }
  };

  const handleSelectEcosystem = async (eco: BlockchainEcosystem) => {
    setConnectError(null);
    if (eco === "evm") {
      // Reown AppKit is the EVM connection interface (QR, MetaMask, Mobile, Coinbase)
      closeModal();
      await openReownAppKit("Connect");
      return;
    }
    // Solana, TON, TRON open their dedicated wallet selection interface first
    setSelectedEcoFlow(eco);
  };

  const handleExecuteConnect = async (eco: BlockchainEcosystem) => {
    setConnectError(null);
    try {
      if (eco === "solana") {
        await multiWallet.solana.connect();
        closeModal();
      } else if (eco === "ton") {
        await multiWallet.ton.connect();
        closeModal();
      } else if (eco === "tron") {
        await multiWallet.tron.connect();
        closeModal();
      }
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
    }
  };

  const handleManualTonConnect = async () => {
    if (!manualTonAddr.trim()) return;
    const clean = manualTonAddr.trim();
    if (clean.startsWith("EQ") || clean.startsWith("UQ")) {
      setConnectError("Mainnet address detected (EQ/UQ). Only TON Testnet addresses (starting with 0Q or kQ) are permitted in HorizonX.");
      return;
    }
    if (!clean.startsWith("0Q") && !clean.startsWith("kQ") && !clean.startsWith("0:")) {
      setConnectError("Invalid TON Testnet address. Testnet addresses start with 0Q, kQ, or 0:.");
      return;
    }
    try {
      localStorage.setItem("horizonx_ton_connected", clean);
      window.location.reload();
    } catch {
      // ignore
    }
  };

  const handleDemoConnect = () => {
    connectDemo();
    closeModal();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && closeModal()}>
      <DialogContent
        showCloseButton={false}
        className="
          fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
          w-[calc(100%-1.5rem)] sm:max-w-[500px]
          max-h-[90vh] flex flex-col p-0 gap-0
          overflow-hidden rounded-2xl
          border border-border/80 bg-background/95 backdrop-blur-xl
          shadow-2xl text-foreground duration-200
        "
      >
        {/* ========================================================================= */}
        {/* SCENARIO 1: Dedicated Ecosystem Connection Flow (Solana / TON / TRON)     */}
        {/* ========================================================================= */}
        {selectedEcoFlow !== null ? (
          <>
            {/* Dedicated Flow Header with Back Navigation */}
            <DialogHeader className="px-5 pt-4 pb-3.5 border-b border-border/40 flex flex-row items-center justify-between space-y-0 text-left">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => setSelectedEcoFlow(null)}
                  aria-label="Back to ecosystems"
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-border/60 bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-colors text-xs font-semibold shrink-0"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </button>

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                  {selectedEcoFlow === "solana" ? (
                    <PhantomLogo className="h-4.5 w-4.5 object-contain" />
                  ) : selectedEcoFlow === "ton" ? (
                    <GramWalletLogo className="h-4.5 w-4.5 object-contain" />
                  ) : (
                    <TronLinkLogo className="h-4.5 w-4.5 object-contain" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-sm sm:text-base font-bold tracking-tight text-foreground truncate">
                    {selectedEcoFlow === "solana"
                      ? "Connect Solana"
                      : selectedEcoFlow === "ton"
                      ? "Connect TON"
                      : "Connect TRON"}
                  </DialogTitle>
                  <DialogDescription className="text-[11px] text-muted-foreground truncate">
                    {selectedEcoFlow === "solana"
                      ? "Solana Devnet Cluster"
                      : selectedEcoFlow === "ton"
                      ? "TON Testnet Workchain (-3)"
                      : "TRON Shasta Testnet (0x94a9059e)"}
                  </DialogDescription>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close modal"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors ml-2"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogHeader>

            {/* Dedicated Flow Body */}
            <div className="flex-1 overflow-y-auto px-5 pt-4 pb-5 space-y-4">
              {/* Error Message */}
              {connectError && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive animate-in fade-in-50"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">Connection failed</p>
                    <p className="mt-0.5 break-words text-[11px] opacity-90 leading-relaxed">
                      {connectError}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConnectError(null)}
                    aria-label="Dismiss error"
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* -------------------- SOLANA FLOW -------------------- */}
              {selectedEcoFlow === "solana" && (
                <div className="space-y-4">
                  {/* Solana Sub-tabs */}
                  <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-secondary/30 border border-border/40 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setSolanaTab("extension")}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg transition-all ${
                        solanaTab === "extension"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Laptop className="h-3.5 w-3.5" />
                      <span>Browser Extension</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSolanaTab("qr")}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg transition-all ${
                        solanaTab === "qr"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <QrCode className="h-3.5 w-3.5" />
                      <span>Mobile QR Code</span>
                    </button>
                  </div>

                  {solanaTab === "extension" ? (
                    <div className="space-y-3">
                      {/* Phantom Card (Preferred) */}
                      <div className="rounded-xl border border-border/70 bg-card/60 p-3.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-[#534bb1]/10 border-[#534bb1]/25">
                            <PhantomLogo className="h-5 w-5 object-contain" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs sm:text-sm font-bold text-foreground">Phantom</span>
                              <span className="rounded-full bg-secondary/80 border border-border/40 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                                Preferred
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                              {detectedExtensions.phantom ? (
                                <span className="text-emerald-400 font-medium">● Extension Detected</span>
                              ) : (
                                "Phantom browser extension"
                              )}
                            </p>
                          </div>
                        </div>

                        {detectedExtensions.phantom ? (
                          <Button
                            size="sm"
                            disabled={multiWallet.solana.isConnecting}
                            onClick={() => handleExecuteConnect("solana")}
                            className="h-8 text-xs font-semibold px-3.5 bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            {multiWallet.solana.isConnecting ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                            ) : null}
                            Connect
                          </Button>
                        ) : (
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs font-semibold px-3 border-border/70 hover:bg-secondary/70"
                          >
                            <a href="https://phantom.app/download" target="_blank" rel="noopener noreferrer">
                              Install <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        )}
                      </div>

                      {/* Solflare Card (Compatible) */}
                      <div className="rounded-xl border border-border/40 bg-card/30 p-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/40 bg-secondary/40 text-muted-foreground font-bold text-xs">
                            SOL
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-semibold text-foreground">Solflare</span>
                            <p className="text-[10px] text-muted-foreground">Compatible Solana Wallet</p>
                          </div>
                        </div>
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <a href="https://solflare.com/download" target="_blank" rel="noopener noreferrer">
                            Get Wallet <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      </div>

                      {/* Pending Connection Banner */}
                      {multiWallet.solana.isConnecting && (
                        <div className="rounded-xl border border-primary/30 bg-primary/10 p-3 flex items-center justify-between gap-2.5 text-xs text-primary animate-pulse">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                            <span>Waiting for Phantom approval... Check wallet popup.</span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => multiWallet.solana.clearError()}
                            className="h-6 text-[10px] px-2 text-primary hover:bg-primary/20"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Solana Mobile QR View */
                    <div className="space-y-3 text-center py-2">
                      <div className="inline-block mx-auto rounded-2xl p-2.5 bg-white shadow-xl">
                        <QrCodeSvg value={solanaQrPayload} size={190} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Scan with Phantom Mobile</p>
                        <p className="text-[11px] text-muted-foreground max-w-xs mx-auto mt-0.5">
                          Open your Phantom mobile camera to establish an instant connection on Solana Devnet.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyPayload(solanaQrPayload, "Solana connection")}
                        className="h-8 text-xs font-semibold gap-1.5 border-border/70 hover:bg-secondary/70"
                      >
                        {copiedPayload ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedPayload ? "Copied URI" : "Copy Connection Link"}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* -------------------- TON FLOW (NEXORA REFERENCE) -------------------- */}
              {selectedEcoFlow === "ton" && (
                <div className="space-y-4">
                  {/* TON Sub-tabs */}
                  <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-secondary/30 border border-border/40 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setTonTab("qr")}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg transition-all ${
                        tonTab === "qr"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <QrCode className="h-3.5 w-3.5" />
                      <span>QR Code</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTonTab("wallets")}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg transition-all ${
                        tonTab === "wallets"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Wallet className="h-3.5 w-3.5" />
                      <span>Wallets</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTonTab("manual")}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg transition-all ${
                        tonTab === "manual"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span>Address</span>
                    </button>
                  </div>

                  {tonTab === "qr" ? (
                    /* TON Connect Real QR Code View */
                    <div className="space-y-3 text-center py-2">
                      <div className="inline-block mx-auto rounded-2xl p-2.5 bg-white shadow-xl">
                        <QrCodeSvg value={tonQrPayload} size={190} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">TON Connect QR Code</p>
                        <p className="text-[11px] text-muted-foreground max-w-xs mx-auto mt-0.5">
                          Scan with Gram Wallet Mobile or any TON Connect wallet on TON Testnet (-3).
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyPayload(tonQrPayload, "TON Connect")}
                        className="h-8 text-xs font-semibold gap-1.5 border-border/70 hover:bg-secondary/70"
                      >
                        {copiedPayload ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedPayload ? "Copied URI" : "Copy Connection URI"}
                      </Button>
                    </div>
                  ) : tonTab === "wallets" ? (
                    /* Available TON Wallets */
                    <div className="space-y-2.5">
                      {/* Gram Wallet (Preferred) */}
                      <div className="rounded-xl border border-border/70 bg-card/60 p-3.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-[#0098ea]/10 border-[#0098ea]/25">
                            <GramWalletLogo className="h-5 w-5 object-contain" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs sm:text-sm font-bold text-foreground">Gram Wallet</span>
                              <span className="rounded-full bg-secondary/80 border border-border/40 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                                Preferred TON
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                              {detectedExtensions.gram ? (
                                <span className="text-emerald-400 font-medium">● JS Bridge Injected</span>
                              ) : (
                                "Official TON Connect Bridge"
                              )}
                            </p>
                          </div>
                        </div>

                        {detectedExtensions.gram ? (
                          <Button
                            size="sm"
                            disabled={multiWallet.ton.isConnecting}
                            onClick={() => handleExecuteConnect("ton")}
                            className="h-8 text-xs font-semibold px-3.5 bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            {multiWallet.ton.isConnecting ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                            ) : null}
                            Connect
                          </Button>
                        ) : (
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs font-semibold px-3 border-border/70 hover:bg-secondary/70"
                          >
                            <a href="https://gramwallet.io" target="_blank" rel="noopener noreferrer">
                              Install <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        )}
                      </div>

                      {/* Tonkeeper */}
                      <div className="rounded-xl border border-border/40 bg-card/30 p-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 font-bold text-xs">
                            TK
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-semibold text-foreground">Tonkeeper</span>
                            <p className="text-[10px] text-muted-foreground">TON Connect Compatible</p>
                          </div>
                        </div>
                        <Button asChild size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground">
                          <a href="https://tonkeeper.com" target="_blank" rel="noopener noreferrer">
                            Open <ExternalLink className="h-2.5 w-2.5 ml-1" />
                          </a>
                        </Button>
                      </div>

                      {/* MyTonWallet */}
                      <div className="rounded-xl border border-border/40 bg-card/30 p-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 font-bold text-xs">
                            MW
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-semibold text-foreground">MyTonWallet</span>
                            <p className="text-[10px] text-muted-foreground">TON Connect Compatible</p>
                          </div>
                        </div>
                        <Button asChild size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground">
                          <a href="https://mytonwallet.io" target="_blank" rel="noopener noreferrer">
                            Open <ExternalLink className="h-2.5 w-2.5 ml-1" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Manual Testnet Address Entry */
                    <div className="space-y-3 rounded-xl border border-border/60 bg-card/40 p-4">
                      <div>
                        <p className="text-xs font-bold text-foreground">Connect with Testnet Address</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Enter your TON Testnet address (must start with 0Q or kQ, or raw 0:... format).
                        </p>
                      </div>
                      <input
                        type="text"
                        placeholder="0QC7q-154_mD9Hn..."
                        value={manualTonAddr}
                        onChange={(e) => setManualTonAddr(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-border/80 bg-background/80 text-foreground font-mono focus:outline-none focus:border-primary"
                      />
                      <Button
                        size="sm"
                        onClick={handleManualTonConnect}
                        className="w-full h-8 text-xs font-semibold"
                      >
                        Connect Testnet Address
                      </Button>
                    </div>
                  )}

                  {/* Pending Connection Banner */}
                  {multiWallet.ton.isConnecting && (
                    <div className="rounded-xl border border-primary/30 bg-primary/10 p-3 flex items-center justify-between gap-2.5 text-xs text-primary animate-pulse">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                        <span>Connecting to TON Testnet... Please approve in Gram Wallet.</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => multiWallet.ton.clearError()}
                        className="h-6 text-[10px] px-2 text-primary hover:bg-primary/20"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* -------------------- TRON FLOW -------------------- */}
              {selectedEcoFlow === "tron" && (
                <div className="space-y-4">
                  {/* TronLink Card */}
                  <div className="rounded-xl border border-border/70 bg-card/60 p-3.5 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-[#ff0613]/10 border-[#ff0613]/25">
                          <TronLinkLogo className="h-5 w-5 object-contain" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-bold text-foreground">TronLink</span>
                            <span className="rounded-full bg-secondary/80 border border-border/40 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                              Preferred TRON
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                            {detectedExtensions.tronLink ? (
                              <span className="text-emerald-400 font-medium">● Extension Detected</span>
                            ) : (
                              "TRON Shasta Testnet"
                            )}
                          </p>
                        </div>
                      </div>

                      {detectedExtensions.tronLink && (
                        <Button
                          size="sm"
                          disabled={multiWallet.tron.isConnecting}
                          onClick={() => handleExecuteConnect("tron")}
                          className="h-8 text-xs font-semibold px-3.5 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
                        >
                          {multiWallet.tron.isConnecting ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                          ) : null}
                          Connect
                        </Button>
                      )}
                    </div>

                    {/* If TronLink is NOT detected: Detailed Installation Guidance */}
                    {!detectedExtensions.tronLink && (
                      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3.5 space-y-3 text-xs">
                        <div className="flex items-start gap-2.5">
                          <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-foreground">TronLink wallet not detected</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                              The TronLink browser extension is required to connect to TRON Shasta testnet.
                            </p>
                          </div>
                        </div>

                        {/* Step Instructions */}
                        <div className="rounded-lg bg-background/50 border border-border/40 p-2.5 space-y-1.5 text-[11px] text-muted-foreground">
                          <p className="font-semibold text-foreground text-xs">Installation steps:</p>
                          <ol className="list-decimal list-inside space-y-1">
                            <li>Install TronLink from the official Chrome Web Store.</li>
                            <li>In TronLink, switch your network node to <strong className="text-foreground">Shasta Testnet</strong>.</li>
                            <li>Return to HorizonX and click <strong className="text-foreground">Check Again</strong>.</li>
                          </ol>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-1">
                          <Button
                            asChild
                            size="sm"
                            className="flex-1 h-8 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            <a
                              href="https://chromewebstore.google.com/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Install TronLink <ExternalLink className="h-3 w-3 ml-1.5" />
                            </a>
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={checkExtensions}
                            className="h-8 text-xs font-semibold px-3 border-border/70 hover:bg-secondary/70 gap-1"
                          >
                            <RefreshCw className="h-3 w-3" />
                            <span>Check Again</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* QR Connection Status Notice */}
                  <div className="rounded-xl border border-border/40 bg-secondary/20 p-3 flex items-start gap-2.5 text-xs text-muted-foreground">
                    <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed">
                      <strong>Note on QR Connections:</strong> QR connection is not supported by TronLink on Shasta Testnet. Please connect using the TronLink browser extension.
                    </p>
                  </div>

                  {/* Pending Connection Banner */}
                  {multiWallet.tron.isConnecting && (
                    <div className="rounded-xl border border-primary/30 bg-primary/10 p-3 flex items-center justify-between gap-2.5 text-xs text-primary animate-pulse">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                        <span>Waiting for TronLink approval... Check wallet popup.</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => multiWallet.tron.clearError()}
                        className="h-6 text-[10px] px-2 text-primary hover:bg-primary/20"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          /* ========================================================================= */
          /* SCENARIO 2: 4-Ecosystem Overview & Selection                              */
          /* ========================================================================= */
          <>
            {/* Header */}
            <DialogHeader className="px-5 pt-5 pb-4 border-b border-border/40 flex flex-row items-center justify-between space-y-0 text-left">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary shadow-inner">
                  <Wallet className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                    Connect Wallet
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground truncate mt-0.5">
                    Independent Web3 Testnet Connections
                  </DialogDescription>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close modal"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors ml-2"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogHeader>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-5 pt-4 pb-5 space-y-4">
              {/* Error Alert */}
              {connectError && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive animate-in fade-in-50"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">Connection failed</p>
                    <p className="mt-0.5 break-words text-[11px] opacity-90 leading-relaxed">
                      {connectError}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConnectError(null)}
                    aria-label="Dismiss error"
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* 2. Sandbox Demo Mode Card */}
              <section className="flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3 sm:p-3.5">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-foreground">
                        Sandbox Demo Mode
                      </p>
                      {isDemoActive && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-amber-500/25 text-amber-400 border border-amber-500/40">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                      {isDemoActive
                        ? "Simulated session active (0x71C9...4e39)"
                        : "Simulate all 4 testnets without browser extensions"}
                    </p>
                  </div>
                </div>

                {isDemoActive ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={disconnectDemo}
                    className="h-8 shrink-0 text-xs font-semibold px-3 border-amber-500/40 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
                  >
                    Disconnect Demo Wallet
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDemoConnect}
                    className="h-8 shrink-0 text-xs font-semibold px-3 border-primary/30 text-primary hover:bg-primary/10"
                  >
                    Try Demo
                  </Button>
                )}
              </section>

              {/* 3. Connected Wallet Summary */}
              <div className="flex items-center justify-between px-0.5 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Independent Wallets
                </span>
                <div className="flex items-center gap-2">
                  {isDemoActive && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      Demo Mode Active
                    </span>
                  )}
                  {multiWallet.connectedCount > 0 ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {multiWallet.connectedCount} of 4 Connected
                    </span>
                  ) : (
                    <span className="rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      0 of 4 Connected
                    </span>
                  )}
                </div>
              </div>

              {/* 4. Wallet Connection Cards */}
              <div className="space-y-2.5">
                {ECOSYSTEM_OPTIONS.map((eco) => {
                  const state = multiWallet[eco.id];
                  const isConnected = state.isConnected;

                  return (
                    <div
                      key={eco.id}
                      className="
                        group flex items-center justify-between gap-3
                        rounded-xl border border-border/60 bg-card/50
                        p-3 sm:p-3.5 transition-all duration-150
                        hover:border-primary/40 hover:bg-card/90 hover:shadow-md
                      "
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Official Brand Logo */}
                        <div
                          className={`
                            flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border
                            ${eco.iconBg} shadow-sm transition-transform group-hover:scale-105
                          `}
                        >
                          {eco.renderIcon({ className: "h-5 w-5 sm:h-6 sm:w-6 object-contain" })}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-bold text-foreground">
                              {eco.walletName}
                            </span>
                            <span className="rounded-full bg-secondary/80 border border-border/40 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                              {eco.badge}
                            </span>
                            {isConnected && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-400">
                                <CheckCircle2 className="h-2.5 w-2.5" /> Connected
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                            {eco.networkName}
                            {isConnected && state.shortAddress ? ` · ${state.shortAddress}` : ""}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isConnected ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              closeModal();
                              openModal("WALLET_DETAILS", { ecosystem: eco.id });
                            }}
                            className="h-8 text-xs font-semibold border-border/70 hover:bg-secondary/80"
                          >
                            Manage
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleSelectEcosystem(eco.id)}
                            className="h-8 text-xs font-semibold px-3 bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
