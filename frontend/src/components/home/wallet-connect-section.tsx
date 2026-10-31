"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  ShieldCheck,
  Wallet,
  ExternalLink,
} from "lucide-react";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { StatefulButton } from "@/components/ui/stateful-button";

export function WalletConnectSection() {
  const {
    isConnected,
    isConnecting,
    shortAddress,
    network,
    isDemoMode,
  } = useWallet();
  const { openModal } = useModal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Wallet state is intentionally read only after hydration to keep SSR markup stable.
  const connected = mounted && isConnected;

  const handleWalletAction = () => {
    openModal(connected ? "WALLET_DETAILS" : "CONNECT_WALLET");
  };

  return (
    <section
      aria-labelledby="wallet-connect-heading"
      className="relative isolate mx-auto w-full max-w-[1440px] overflow-hidden px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/2 -z-10 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-violet-500/[.09] blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-36 top-0 -z-10 h-[360px] w-[360px] rounded-full bg-indigo-500/[.07] blur-[130px]"
      />

      <div className="grid items-center gap-14 lg:grid-cols-[.82fr_1.18fr] lg:gap-20">
        <div className="relative mx-auto flex w-full max-w-[440px] flex-col items-center text-center lg:mx-0 lg:max-w-none">
          <div className="mb-8 flex items-center gap-3 self-start">
            <span className="h-px w-7 bg-violet-300/65" />
            <span className="text-[10px] font-semibold uppercase tracking-[.24em] text-violet-200/65">
              Wallet access
            </span>
          </div>

          <div className="relative mb-7 grid h-24 w-24 place-items-center text-violet-100">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-[30px] border border-violet-200/20 bg-[linear-gradient(145deg,rgba(196,181,253,.14),rgba(139,92,246,.025))] shadow-[0_0_65px_rgba(139,92,246,.13),inset_0_1px_0_rgba(255,255,255,.08)]"
            />
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-[38px] border border-violet-200/[.07]"
            />
            {connected ? (
              <Check className="relative h-10 w-10" strokeWidth={1.45} />
            ) : (
              <Wallet className="relative h-10 w-10" strokeWidth={1.35} />
            )}
            <span className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-xl border border-[#0b0913] bg-violet-200 text-[#100c1c] shadow-[0_4px_18px_rgba(167,139,250,.2)]">
              <ShieldCheck className="h-4 w-4" />
            </span>
          </div>

          {connected ? (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-emerald-300/80">
                Wallet connected
              </p>
              <p className="mt-3 font-mono text-xl font-medium tracking-tight text-white">
                {shortAddress ?? "Connected wallet"}
              </p>
              <p className="mt-2 text-[12px] leading-6 text-[#aaa6bd]">
                {isDemoMode
                  ? "Demo wallet session is active."
                  : `Connected to ${network?.name ?? "your selected network"}.`}
              </p>
            </>
          ) : (
            <>
              <h3 className="text-[25px] font-medium tracking-[-.045em] text-white sm:text-[28px]">
                Your wallet. Your choice.
              </h3>
              <p className="mt-3 max-w-[330px] text-[13px] leading-7 text-[#aaa6bd]">
                Connect when you are ready. Your wallet stays in your control,
                and every approval remains your decision.
              </p>
            </>
          )}

          <div className="mt-9 w-full max-w-[360px]">
            <StatefulButton
              onClick={handleWalletAction}
              disabled={!mounted || isConnecting}
              className="min-h-[58px] w-full justify-center gap-3 rounded-xl border border-violet-100/20 bg-[#e9e2ff] px-6 text-[13px] font-semibold tracking-[.01em] text-[#100c1c] shadow-[0_10px_34px_rgba(139,92,246,.14)] hover:border-violet-100/45 hover:bg-white hover:shadow-[0_14px_42px_rgba(139,92,246,.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#080711] disabled:cursor-wait disabled:opacity-60"
            >
              {isConnecting
                ? "Connecting wallet"
                : connected
                  ? "View connected wallet"
                  : "Connect wallet"}
            </StatefulButton>

            {connected && (
              <button
                type="button"
                onClick={() => openModal("WALLET_DETAILS")}
                className="mt-4 inline-flex min-h-10 items-center gap-2 text-[11px] font-medium text-violet-200/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200"
              >
                View wallet details
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[700px] flex-col items-center text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-7 bg-violet-300/65" />
            <p className="text-[10px] font-semibold uppercase tracking-[.25em] text-violet-200/70">
              Start with your wallet
            </p>
            <span className="h-px w-7 bg-violet-300/65" />
          </div>

          <h2
            id="wallet-connect-heading"
            className="max-w-[680px] text-balance text-[clamp(2.5rem,4.8vw,4.8rem)] font-medium leading-[1.03] tracking-[-.068em] text-white"
          >
            Connect your wallet.
            <span className="mt-1 block bg-gradient-to-r from-violet-100 via-violet-200 to-indigo-200 bg-clip-text text-transparent">
              Step into HorizonX.
            </span>
          </h2>

          <p className="mt-7 max-w-[570px] text-[14px] leading-[1.95] text-[#aaa6bd] sm:text-[15px]">
            Your wallet gives you access to the tools and experiences across
            HorizonX. Explore the platform first, then connect when you are
            ready to create, manage or participate.
          </p>

          <div className="mt-10 grid w-full max-w-[570px] gap-6 border-t border-white/[.09] pt-7 sm:grid-cols-2 sm:gap-8">
            <div className="flex flex-col items-center">
              <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl border border-violet-200/15 bg-violet-200/[.06] text-violet-100">
                <ShieldCheck className="h-[18px] w-[18px]" strokeWidth={1.6} />
              </span>
              <p className="text-[13px] font-semibold text-white">
                You stay in control
              </p>
              <p className="mt-1.5 max-w-[220px] text-[11px] leading-5 text-[#9691a8]">
                Review wallet requests carefully before approving them.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl border border-violet-200/15 bg-violet-200/[.06] text-violet-100">
                <Wallet className="h-[18px] w-[18px]" strokeWidth={1.6} />
              </span>
              <p className="text-[13px] font-semibold text-white">
                Browse at your pace
              </p>
              <p className="mt-1.5 max-w-[220px] text-[11px] leading-5 text-[#9691a8]">
                You can explore HorizonX without connecting a wallet.
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-3xl text-center text-[10px] leading-5 text-[#777187]">
        Always review transaction details and network information before
        approving wallet requests.
      </p>
    </section>
  );
}
