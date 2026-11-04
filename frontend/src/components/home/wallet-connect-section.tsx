import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  ExternalLink,
  Fingerprint,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { StatefulButton } from "@/components/ui/stateful-button";

export function WalletConnectSection() {
  const {
    isConnected,
    isConnecting,
    shortAddress,
    address,
    balance,
    network,
    chainId,
    isDemoMode,
    isUnsupportedNetwork,
    walletProvider,
  } = useWallet();
  const { openModal } = useModal();
  const [mounted, setMounted] = useState(false);
  const walletCardRef = useRef<HTMLDivElement>(null);

  const handleWalletCardPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    // Keep touch interaction native; the 3D effect is intended for a mouse/trackpad.
    if (event.pointerType !== "mouse") return;

    const card = walletCardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 18;
    const rotateX = (0.5 - (y / rect.height)) * 18;

    card.style.transition = "transform 80ms ease-out";
    card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
  };

  const resetWalletCardTransform = () => {
    const card = walletCardRef.current;
    if (!card) return;

    card.style.transition = "transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1)";
    card.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Delay wallet-specific markup until hydration to avoid server/client mismatch.
  const connected = mounted && isConnected;
  const walletAction = () => {
    openModal(connected ? "WALLET_DETAILS" : "CONNECT_WALLET");
  };

  return (
    <section
      aria-labelledby="wallet-connect-heading"
      className="relative isolate mx-0 w-full max-w-none overflow-hidden rounded-none border-0 bg-transparent px-5 py-20 shadow-none sm:px-8 sm:py-24 lg:px-12 lg:py-28"
    >
      {/* Soft ambient lighting stays inside this section; the page theme is unchanged. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/2 -z-10 h-[440px] w-[440px] -translate-y-1/2 rounded-full bg-violet-500/[.10] blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-0 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-500/[.08] blur-[140px]"
      />

      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-8 lg:grid-cols-[minmax(0,470px)_minmax(0,1fr)] lg:gap-14 xl:gap-20">
        {/* Wallet session panel */}
        <div className="relative mx-auto w-full max-w-[470px] lg:mx-0">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-5 rounded-[2.2rem] bg-[radial-gradient(ellipse_at_50%_45%,rgba(139,92,246,.13),transparent_72%)] blur-2xl"
          />
          <div
            ref={walletCardRef}
            onPointerMove={handleWalletCardPointerMove}
            onPointerLeave={resetWalletCardTransform}
            className="relative overflow-hidden rounded-[14px] border border-white/[.10] bg-[linear-gradient(145deg,rgba(19,17,35,.96),rgba(8,9,20,.98)_62%)] p-4 shadow-[0_24px_80px_rgba(0,0,0,.28),inset_0_1px_0_rgba(255,255,255,.045)] [transform-style:preserve-3d] will-change-transform sm:p-5"
          >
            <div className="flex items-center justify-between border-b border-white/[.07] pb-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    connected
                      ? isUnsupportedNetwork
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                      : "bg-violet-300"
                  }`}
                />
                <span className="text-[9px] font-semibold uppercase tracking-[.22em] text-white/50">
                  {connected ? "Active session" : "Wallet access"}
                </span>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold ${
                  connected
                    ? isUnsupportedNetwork
                      ? "border-amber-400/20 bg-amber-400/[.08] text-amber-300"
                      : "border-emerald-400/20 bg-emerald-400/[.08] text-emerald-300"
                    : "border-violet-300/20 bg-violet-300/[.07] text-violet-200/80"
                }`}
              >
                {connected ? (
                  isUnsupportedNetwork ? (
                    <AlertTriangle className="h-3 w-3" />
                  ) : (
                    <Check className="h-3 w-3" />
                  )
                ) : (
                  <ShieldCheck className="h-3 w-3" />
                )}
                {connected
                  ? isUnsupportedNetwork
                    ? "Check network"
                    : "Verified session"
                  : "Self-custody"}
              </span>
            </div>

            <div className="flex min-h-[180px] flex-col items-center justify-center py-4 text-center sm:min-h-[190px]">
              <div className="relative mb-4 grid h-[72px] w-[72px] place-items-center rounded-[22px] border border-violet-200/[.20] bg-[linear-gradient(145deg,rgba(196,181,253,.13),rgba(139,92,246,.035))] text-violet-100 shadow-[0_0_55px_rgba(139,92,246,.12),inset_0_1px_0_rgba(255,255,255,.08)]">
                {connected ? (
                  <Check className="h-9 w-9" strokeWidth={1.5} />
                ) : (
                  <Wallet className="h-9 w-9" strokeWidth={1.35} />
                )}
                <span className="absolute -bottom-2 -right-2 grid h-7 w-7 place-items-center rounded-lg border border-[#100d1b] bg-[#e7ddff] text-[#171126] shadow-[0_5px_18px_rgba(167,139,250,.22)]">
                  {connected ? (
                    <ShieldCheck className="h-3.5 w-3.5" />
                  ) : (
                    <Fingerprint className="h-3.5 w-3.5" />
                  )}
                </span>
              </div>

              {!connected && (
                <p className="text-[11px] font-semibold uppercase tracking-[.16em] text-white/75">
                  {isConnecting ? "Waiting for wallet" : "Your wallet is not connected"}
                </p>
              )}

              {connected ? (
                <>
                  <p className="mt-1 font-mono text-[15px] font-medium tracking-tight text-white sm:text-base">
                    {shortAddress ?? "Connected wallet"}
                  </p>
                  <p className="mt-1 text-[10px] text-[#aaa6bd]">
                    {isDemoMode
                      ? "Demo wallet session is active."
                      : `${walletProvider ?? "Web3 wallet"} · ${network?.name ?? "Network detected"}`}
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-2 max-w-[290px] text-[12px] leading-5 text-[#aaa6bd]">
                    Connect a wallet to manage your assets and interact with HorizonX.
                  </p>
                  <p className="mt-1.5 text-[9px] text-white/35">
                    Your private keys never leave your wallet.
                  </p>
                </>
              )}
            </div>

            {connected && (
              <div className="mb-4 grid grid-cols-2 gap-3 border-y border-white/[.07] py-3.5">
                <div className="min-w-0">
                  <p className="text-[8px] font-semibold uppercase tracking-[.2em] text-white/40">
                    Native balance
                  </p>
                  <p className="mt-1.5 truncate font-mono text-[17px] font-semibold tracking-tight text-white">
                    {balance}
                    <span className="ml-1.5 text-[10px] font-medium text-violet-200/70">
                      {network?.symbol ?? "ETH"}
                    </span>
                  </p>
                </div>
                <div className="min-w-0 text-right">
                  <p className="text-[8px] font-semibold uppercase tracking-[.2em] text-white/40">
                    Network
                  </p>
                  <p className="mt-1.5 truncate text-[11px] font-medium text-white">
                    {network?.name ?? "Unknown network"}
                  </p>
                  <p className="mt-1 font-mono text-[9px] text-white/40">
                    Chain ID: {chainId ?? "—"}
                  </p>
                </div>
              </div>
            )}

            <StatefulButton
              onClick={walletAction}
              disabled={!mounted || isConnecting}
              className="min-h-[46px] w-full justify-center gap-2.5 rounded-xl border border-violet-100/20 bg-[#e9e2ff] px-5 text-[12px] font-semibold text-[#100c1c] shadow-[0_10px_32px_rgba(139,92,246,.13)] transition-all hover:-translate-y-0.5 hover:border-violet-100/45 hover:bg-white hover:shadow-[0_14px_38px_rgba(139,92,246,.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#080711] disabled:cursor-wait disabled:opacity-60"
            >
              <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                {isConnecting
                  ? "Connecting wallet..."
                  : connected
                    ? "Manage connected wallet"
                    : "Connect wallet"}
                <ArrowUpRight className="h-4 w-4 shrink-0" />
              </span>
            </StatefulButton>

            {connected && address && network?.explorerUrl ? (
              <div className="mt-2.5 flex items-center justify-between gap-3 text-[9px]">
                <a
                  href={`${network.explorerUrl}/address/${address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-8 items-center gap-1.5 text-white/45 transition-colors hover:text-violet-200"
                >
                  View on block explorer
                  <ExternalLink className="h-3 w-3" />
                </a>
                <button
                  type="button"
                  onClick={() => openModal("WALLET_DETAILS")}
                  className="min-h-8 text-white/45 transition-colors hover:text-white"
                >
                  Wallet details
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Context and trust information */}
        <div className="mx-auto flex w-full max-w-[760px] flex-col items-start text-left lg:mx-0">
          <div className="mb-4 flex w-full items-center justify-start gap-3 text-left">
            <span className="h-px w-7 bg-violet-300/70" />
            <p className="text-[10px] font-semibold uppercase tracking-[.25em] text-violet-200/75">
              {connected ? "Web3 authentication" : "Start with your wallet"}
            </p>
            <span className="h-px w-7 bg-violet-300/70" />
          </div>

          <h2
            id="wallet-connect-heading"
            className="flex w-full max-w-[760px] flex-col items-start text-left text-[clamp(2.15rem,3.8vw,3.8rem)] font-medium leading-[1.04] tracking-[-.067em] text-white"
          >
            {connected ? (
              <>
                <span className="block w-full text-left">Wallet connected.</span>
                <span className="mt-1 block w-full text-left bg-gradient-to-r from-violet-100 via-violet-200 to-indigo-200 bg-clip-text text-transparent">
                  Your portal to HorizonX.
                </span>
              </>
            ) : (
              <>
                <span className="block w-full text-left">Connect your wallet.</span>
                <span className="mt-1 block w-full text-left bg-gradient-to-r from-violet-100 via-violet-200 to-indigo-200 bg-clip-text text-transparent">
                  Step into HorizonX.
                </span>
              </>
            )}
          </h2>

          <p className="!ml-0 !pl-0 mt-4 block w-full max-w-[650px] self-start text-left text-[13px] leading-[1.65] text-[#aaa6bd] sm:text-[14px]">
            {connected
              ? "Seamlessly interact with HorizonX tools and on-chain experiences. Your wallet remains in your control, and every transaction requires your approval."
              : "Your wallet gives you access to the tools and experiences across HorizonX. Explore the platform first, then connect when you are ready to create, manage or participate."}
          </p>

          <div className="mt-4 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
            <article className="group flex min-h-[104px] items-center gap-3 rounded-lg border border-white/[.08] bg-white/[.025] px-3 py-3 transition-colors duration-300 hover:border-violet-200/20 hover:bg-white/[.04]">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-emerald-300/15 bg-emerald-300/[.06] text-emerald-200">
                <ShieldCheck className="h-[18px] w-[18px]" strokeWidth={1.6} />
              </span>
              <div className="min-w-0 flex-1 text-left">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-[10px] font-semibold leading-[1.3] text-white">
                    {connected ? "You stay in control" : "Your keys stay yours"}
                  </h3>
                  <span className="shrink-0 font-mono text-[8px] leading-3 text-emerald-300/70">
                    {connected ? "Approval required" : "Self-custody"}
                  </span>
                </div>
                <p className="mt-1 text-[9px] leading-[1.4] text-left text-[#9691a8]">
                  Review every transaction in your wallet. HorizonX cannot move funds or approve requests on your behalf.
                </p>
              </div>
            </article>

            <article className="group flex min-h-[104px] items-center gap-3 rounded-lg border border-white/[.08] bg-white/[.025] px-3 py-3 transition-colors duration-300 hover:border-violet-200/20 hover:bg-white/[.04]">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-violet-200/15 bg-violet-200/[.06] text-violet-100">
                {connected ? (
                  <Zap className="h-[18px] w-[18px]" strokeWidth={1.6} />
                ) : (
                  <Wallet className="h-[18px] w-[18px]" strokeWidth={1.6} />
                )}
              </span>
              <div className="min-w-0 flex-1 text-left">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-[10px] font-semibold leading-[1.3] text-white">
                    {connected ? "Explore the HorizonX ecosystem" : "Browse before connecting"}
                  </h3>
                  <span className="shrink-0 font-mono text-[8px] leading-3 text-violet-200/65">
                    {connected ? "Access enabled" : "No wallet needed"}
                  </span>
                </div>
                <p className="mt-1 text-[9px] leading-[1.4] text-left text-[#9691a8]">
                  {connected
                    ? "Move between projects, tokens and launch experiences while keeping transaction approvals in your hands."
                    : "Explore projects, tokens and launch opportunities without connecting a wallet. Connect only when an action requires it."}
                </p>
              </div>
            </article>

            {connected && (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/[.06] bg-black/10 px-4 py-3 font-mono text-[9px] text-white/45">
                <span className="inline-flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${isUnsupportedNetwork ? "bg-amber-400" : "bg-emerald-400"}`} />
                  {isUnsupportedNetwork ? "Network check required" : "Wallet session active"}
                </span>
                <span>Chain ID: {chainId ?? "—"}</span>
              </div>
            )}
          </div>

          <p className="mt-4 w-full text-left text-[10px] leading-5 text-[#858096]">
            Always verify the network, destination address and transaction details before approving a wallet request.
          </p>
        </div>
      </div>
    </section>
  );
}
