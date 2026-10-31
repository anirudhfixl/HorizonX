"use client";

import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/projects/copy-button";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import { getExplorerBaseUrl, isSepoliaNetwork, toneFor } from "@/components/tokens/token-profile";
import { cn } from "@/lib/utils";
import type { Token, TokenMarketData, Project, VerificationStatus } from "@/types";
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  FileCode2,
  Share2,
  Wallet,
} from "lucide-react";

type ContractToken = Token & { market?: TokenMarketData };

interface TokenContractProps {
  token: ContractToken;
  project?: Project;
}

// ─── EIP-20 reference interface ───────────────────────────────────────────────
// This is the public ERC-20 standard interface (EIP-20). It is NOT the ABI of the
// deployed contract: a real contract may add functions (burn, permit, owner, pause…).

export interface AbiParam {
  name: string;
  type: string;
  indexed?: boolean;
}
export interface AbiItem {
  type: "function" | "event";
  name: string;
  inputs: AbiParam[];
  outputs?: AbiParam[];
  stateMutability?: "view" | "nonpayable";
}

export const EIP20_INTERFACE: AbiItem[] = [
  { type: "function", name: "name", inputs: [], outputs: [{ name: "", type: "string" }], stateMutability: "view" },
  { type: "function", name: "symbol", inputs: [], outputs: [{ name: "", type: "string" }], stateMutability: "view" },
  { type: "function", name: "decimals", inputs: [], outputs: [{ name: "", type: "uint8" }], stateMutability: "view" },
  { type: "function", name: "totalSupply", inputs: [], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "balanceOf", inputs: [{ name: "account", type: "address" }], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "allowance", inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "transfer", inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable" },
  { type: "function", name: "approve", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable" },
  { type: "function", name: "transferFrom", inputs: [{ name: "from", type: "address" }, { name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable" },
  { type: "event", name: "Transfer", inputs: [{ name: "from", type: "address", indexed: true }, { name: "to", type: "address", indexed: true }, { name: "value", type: "uint256" }] },
  { type: "event", name: "Approval", inputs: [{ name: "owner", type: "address", indexed: true }, { name: "spender", type: "address", indexed: true }, { name: "value", type: "uint256" }] },
];

/** Human-readable signature, e.g. `transfer(address to, uint256 amount)`. */
export function abiSignature(item: AbiItem): string {
  const args = item.inputs
    .map((i) => `${i.type}${i.indexed ? " indexed" : ""}${i.name ? ` ${i.name}` : ""}`)
    .join(", ");
  return `${item.name}(${args})`;
}

export function isErc20Standard(standard?: string): boolean {
  return (standard || "").replace(/[^a-z0-9]/gi, "").toLowerCase() === "erc20";
}

/**
 * Supply in base units, derived as total supply × 10^decimals using string math.
 * Returns undefined unless the catalog supply is a plain whole number and decimals is known.
 */
export function rawSupplyUnits(totalSupply?: string, decimals?: number): string | undefined {
  if (!totalSupply || decimals === undefined || !Number.isInteger(decimals) || decimals < 0 || decimals > 36) return undefined;
  if (!/^[0-9][0-9,]*$/.test(totalSupply.trim())) return undefined;
  const digits = totalSupply.replace(/,/g, "").replace(/^0+(?=\d)/, "");
  return digits === "0" ? "0" : digits + "0".repeat(decimals);
}

export function isEvmAddress(value?: string): boolean {
  return !!value && /^0x[0-9a-fA-F]{40}$/.test(value);
}

const VERIF_LABEL: Partial<Record<VerificationStatus, string>> = {
  not_reviewed: "Not reviewed",
  project_reviewed: "Project reviewed",
  contract_source_verified: "Source verified",
  audit_available: "Audit available",
};
const VERIF_DETAIL: Partial<Record<VerificationStatus, string>> = {
  not_reviewed: "No review is recorded for this token in the catalog.",
  project_reviewed: "The project behind this token has a catalog review. This is not a contract audit or source verification.",
  contract_source_verified: "The catalog records that the contract source was verified. The source itself is not stored by ProMiners; open the explorer to read it.",
  audit_available: "The catalog records that an audit exists. The report is not stored or shown here.",
};

type SourceKind = "catalog" | "standard" | "derived" | "missing";
const SOURCE_STYLE: Record<SourceKind, { label: string; cls: string }> = {
  catalog: { label: "Catalog", cls: "bg-sky-500/10 text-sky-400" },
  standard: { label: "Standard", cls: "bg-violet-500/10 text-violet-400" },
  derived: { label: "Derived", cls: "bg-amber-500/10 text-amber-400" },
  missing: { label: "Not recorded", cls: "bg-secondary/60 text-muted-foreground" },
};

function SourceTag({ kind }: { kind: SourceKind }) {
  const s = SOURCE_STYLE[kind];
  return <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", s.cls)}>{s.label}</span>;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{children}</p>;
}

type Row = {
  label: string;
  value?: React.ReactNode;
  source: SourceKind;
  note?: string;
  mono?: boolean;
};

function LedgerRow({ row }: { row: Row }) {
  const missing = row.source === "missing";
  return (
    <div className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-[11rem_1fr_auto] sm:items-baseline sm:gap-6">
      <dt className="text-xs text-muted-foreground">{row.label}</dt>
      <dd className="min-w-0">
        <div className={cn("text-sm", missing ? "italic text-muted-foreground" : "text-foreground", row.mono && !missing && "font-mono text-[13px]")}>
          {row.value ?? "Not recorded"}
        </div>
        {row.note ? <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{row.note}</p> : null}
      </dd>
      <div className="sm:text-right">
        <SourceTag kind={row.source} />
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TokenContract({ token, project }: TokenContractProps) {
  const { isConnected, address: userAddress } = useWallet();
  const { openModal } = useModal();

  const [view, setView] = React.useState<"functions" | "events" | "json">("functions");
  const [abiCopied, setAbiCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);

  const sepolia = isSepoliaNetwork(token.network);
  const explorerBase = getExplorerBaseUrl(token.network);
  const tone = toneFor(token.category);
  const addr = token.contractAddress;
  const addrValid = isEvmAddress(addr);
  const erc20 = isErc20Standard(token.standard);
  const tier: VerificationStatus = token.verificationStatus ?? "not_reviewed";
  const raw = rawSupplyUnits(token.totalSupply, token.decimals);

  const copyText = async (text: string, ok: () => void, okMsg: string) => {
    try {
      await navigator.clipboard.writeText(text);
      ok();
      toast.success(okMsg);
    } catch {
      toast.error("Copy failed", { description: "Clipboard access was denied by the browser." });
    }
  };

  const abiJson = JSON.stringify(EIP20_INTERFACE, null, 2);
  const functions = EIP20_INTERFACE.filter((i) => i.type === "function");
  const events = EIP20_INTERFACE.filter((i) => i.type === "event");

  const identityRows: Row[] = [
    {
      label: "Network",
      value: (
        <>
          {sepolia ? "Ethereum Sepolia" : token.network}
          {sepolia ? <span className="ml-2 font-mono text-xs text-muted-foreground">Chain ID 11155111</span> : null}
        </>
      ),
      source: "catalog",
    },
    { label: "Standard", value: token.standard, source: token.standard ? "catalog" : "missing" },
    { label: "Name", value: token.name, source: "catalog" },
    { label: "Symbol", value: token.symbol, source: "catalog", mono: true },
    { label: "Decimals", value: token.decimals, source: token.decimals !== undefined ? "catalog" : "missing", mono: true },
    {
      label: "Total supply",
      value: token.totalSupply ? `${token.totalSupply} ${token.symbol}` : undefined,
      source: token.totalSupply ? "catalog" : "missing",
      note: "Recorded in the catalog, not read from the contract.",
      mono: true,
    },
    {
      label: "Supply in base units",
      value: raw,
      source: raw ? "derived" : "missing",
      note: raw ? "Total supply × 10^decimals, calculated here. Compare with totalSupply() on the explorer." : "Needs a whole-number supply and known decimals.",
      mono: true,
    },
    {
      label: "Creator",
      value: token.creatorAddress ? (
        <span className="flex items-center gap-1">
          <code className="min-w-0 break-all">{token.creatorAddress}</code>
          <CopyButton value={token.creatorAddress} label="creator address" />
        </span>
      ) : undefined,
      source: token.creatorAddress ? "catalog" : "missing",
      note: "The address that registered the token in the catalog. Not confirmed as the on-chain deployer or owner.",
      mono: true,
    },
    {
      label: "Linked project",
      value: project ? (
        <Link href={`/projects/${project.id}`} className="inline-flex items-center gap-1 text-primary hover:underline">
          {project.name} <ChevronRight className="h-3 w-3" />
        </Link>
      ) : undefined,
      source: project ? "catalog" : "missing",
    },
    {
      label: "Feature tags",
      value:
        token.features && token.features.length > 0 ? (
          <span className="flex flex-wrap gap-1.5">
            {token.features.map((f) => (
              <span key={f} className="rounded-full bg-secondary/60 px-2.5 py-0.5 font-sans text-xs text-muted-foreground">{f}</span>
            ))}
          </span>
        ) : undefined,
      source: token.features && token.features.length > 0 ? "catalog" : "missing",
      note: token.features?.some((f) => /illustrative/i.test(f)) ? "Tags marked Illustrative are catalog labels, not confirmed contract capabilities." : undefined,
    },
    { label: "Catalog record", value: `${token.id} · created ${token.createdAt} · updated ${token.updatedAt}`, source: "catalog", mono: true },
  ];

  const unavailable: { label: string; note: string }[] = [
    { label: "Contract source code", note: "ProMiners does not store source files." },
    { label: "Compiler version", note: "Not stored." },
    { label: "Optimizer settings", note: "Not stored." },
    { label: "EVM version", note: "Not stored." },
    { label: "License", note: "Not stored." },
    { label: "Constructor arguments", note: "Not stored." },
    { label: "Deployment transaction and block", note: "No indexer is connected." },
    { label: "Live reads (owner, paused, balances)", note: "No RPC connection is configured for this page." },
  ];

  const nav = [
    { href: `/tokens/${token.id}`, label: "Overview", icon: BookOpen, current: false },
    { href: `/tokens/${token.id}/contract`, label: "Contract & source", icon: FileCode2, current: true },
    { href: `/tokens/${token.id}/activity`, label: "Activity", icon: Activity, current: false },
  ];

  const anchors = [
    { id: "address", label: "Address" },
    { id: "ledger", label: "Spec sheet" },
    { id: "verification", label: "Verification" },
    { id: "interface", label: "Interface" },
    { id: "unavailable", label: "Not available" },
  ];

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/tokens" className="hover:text-foreground">Tokens</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/tokens/${token.id}`} className="hover:text-foreground">{token.symbol}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Contract</span>
      </nav>

      <header className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span aria-hidden className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br font-mono text-sm font-bold", tone.tile)}>
            {token.symbol.slice(0, 4)}
          </span>
          <div className="min-w-0">
            <Eyebrow>Contract inspector</Eyebrow>
            <h1 className="truncate text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {token.name} <span className="text-muted-foreground">({token.symbol})</span>
            </h1>
          </div>
        </div>
        <nav aria-label="Token record views" className="flex items-center gap-1 overflow-x-auto text-sm">
          {nav.map((n) =>
            n.current ? (
              <span key={n.href} aria-current="page" className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-primary/15 px-4 py-1.5 font-medium text-primary">
                <n.icon className="h-3.5 w-3.5" /> {n.label}
              </span>
            ) : (
              <Link key={n.href} href={n.href} className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground">
                <n.icon className="h-3.5 w-3.5" /> {n.label}
              </Link>
            )
          )}
        </nav>
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusBadge status={token.status} />
        <Button asChild size="sm" className="h-8 bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90">
          <Link href={`/exchange/tokens/${token.id}`}>Trade {token.symbol}</Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-border/60 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => copyText(window.location.href, () => { setShared(true); setTimeout(() => setShared(false), 1800); }, "Link copied")}
        >
          {shared ? <Check className="mr-1 h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="mr-1 h-3.5 w-3.5" />}
          {shared ? "Copied" : "Share"}
        </Button>
        {isConnected ? (
          <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary/10 px-3 font-mono text-xs text-primary">
            <Wallet className="h-3.5 w-3.5" />
            {userAddress ? `${userAddress.slice(0, 6)}…${userAddress.slice(-4)}` : "Connected"}
          </span>
        ) : (
          <Button variant="outline" size="sm" className="h-8 border-border/60 text-xs text-muted-foreground hover:text-foreground" onClick={() => openModal("CONNECT_WALLET")}>
            <Wallet className="mr-1 h-3.5 w-3.5 text-primary" /> Connect
          </Button>
        )}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[13rem_1fr] lg:gap-14">
        {/* Section index */}
        <aside className="hidden lg:block">
          <nav aria-label="Sections" className="sticky top-24 space-y-1 border-l border-border/50 text-sm">
            {anchors.map((a) => (
              <a key={a.id} href={`#${a.id}`} className="-ml-px block border-l border-transparent py-1 pl-4 text-muted-foreground transition-colors hover:border-primary hover:text-foreground">
                {a.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 space-y-14">
          {/* Address */}
          <section id="address" aria-labelledby="address-heading" className="scroll-mt-24">
            <Eyebrow>Contract address</Eyebrow>
            <h2 id="address-heading" className="sr-only">Contract address</h2>
            {addr ? (
              <>
                <div className="mt-3 flex flex-col gap-3 rounded-2xl bg-black/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <code className="min-w-0 break-all font-mono text-sm text-foreground sm:text-base" data-testid="contract-address">{addr}</code>
                  <span className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyText(addr, () => {}, "Address copied")}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-secondary/60 px-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </button>
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
                  <a href={`${explorerBase}/token/${addr}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                    Token page on {sepolia ? "Sepolia Etherscan" : "block explorer"} <ExternalLink className="h-3 w-3" />
                  </a>
                  <a href={`${explorerBase}/address/${addr}#code`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                    Contract code on explorer <ArrowUpRight className="h-3 w-3" />
                  </a>
                  <span className="text-muted-foreground">
                    {addrValid ? "Format: valid 20-byte hex address." : "Format: this value is not a valid 20-byte hex address. Check the catalog record."}
                  </span>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                  The address is the value stored in the ProMiners catalog. ProMiners does not confirm here that code exists at this address.
                </p>
              </>
            ) : (
              <div className="mt-3 rounded-2xl bg-secondary/30 px-5 py-6">
                <p className="text-sm font-medium text-foreground">No contract address recorded</p>
                <p className="mt-1 text-xs text-muted-foreground">This token has no deployed contract address in the catalog, so there is nothing to inspect on an explorer.</p>
              </div>
            )}
            {!sepolia ? (
              <p className="mt-3 text-xs text-muted-foreground">
                Cataloged on {token.network} for discovery. Under D-04, wallet connectivity is supported only on Ethereum Sepolia.
              </p>
            ) : null}
          </section>

          {/* Ledger */}
          <section id="ledger" aria-labelledby="ledger-heading" className="scroll-mt-24">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <Eyebrow>Spec sheet</Eyebrow>
                <h2 id="ledger-heading" className="mt-2 text-2xl font-semibold tracking-tight text-foreground">What is recorded, and where it comes from</h2>
              </div>
              <ul className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground" aria-label="Source legend">
                {(["catalog", "standard", "derived", "missing"] as SourceKind[]).map((k) => (
                  <li key={k}><SourceTag kind={k} /></li>
                ))}
              </ul>
            </div>
            <dl className="mt-4 divide-y divide-border/40 border-y border-border/40">
              {identityRows.map((r) => <LedgerRow key={r.label} row={r} />)}
            </dl>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              <strong className="font-semibold text-foreground">Catalog</strong> values come from the ProMiners record and have not been read from the chain.
              Market figures are on the Overview page and are simulated.
            </p>
          </section>

          {/* Verification */}
          <section id="verification" aria-labelledby="verif-heading" className="scroll-mt-24 grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
            <div>
              <Eyebrow>Verification</Eyebrow>
              <h2 id="verif-heading" className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{VERIF_LABEL[tier] ?? tier.replace(/_/g, " ")}</h2>
              <p className="mt-1 text-xs text-muted-foreground">Stored tier on the catalog record</p>
            </div>
            <div>
              <p className="text-sm leading-relaxed text-muted-foreground">{VERIF_DETAIL[tier] ?? "This tier is stored on the catalog record. ProMiners does not describe it further on this page."}</p>
              <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                ProMiners does not run a bytecode comparison or read the explorer&apos;s verification flag on this page, so this tier is
                a catalog claim and not proof. To confirm source verification, open the contract code on the explorer.
              </p>
            </div>
          </section>

          {/* Interface */}
          <section id="interface" aria-labelledby="iface-heading" className="scroll-mt-24">
            <Eyebrow>Interface</Eyebrow>
            <h2 id="iface-heading" className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              {erc20 ? "EIP-20 reference interface" : "Interface not available"}
            </h2>
            {erc20 ? (
              <>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  The standard ERC-20 functions and events. This is the public specification, <strong className="font-semibold text-foreground">not the verified ABI of this contract</strong>.
                  The deployed contract can include more functions, such as burn, permit, owner or pause.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div role="group" aria-label="Interface view" className="flex items-center gap-1 text-sm">
                    {([["functions", `Functions ${functions.length}`], ["events", `Events ${events.length}`], ["json", "JSON"]] as const).map(([k, label]) => (
                      <button
                        key={k}
                        type="button"
                        aria-pressed={view === k}
                        onClick={() => setView(k)}
                        className={cn("rounded-full px-4 py-1.5 transition-colors", view === k ? "bg-primary/15 font-medium text-primary" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground")}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {view === "json" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 border-border/60 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => copyText(abiJson, () => { setAbiCopied(true); setTimeout(() => setAbiCopied(false), 2000); }, "Standard interface JSON copied")}
                    >
                      {abiCopied ? <Check className="mr-1 h-3.5 w-3.5 text-emerald-400" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
                      {abiCopied ? "Copied" : "Copy standard ABI JSON"}
                    </Button>
                  ) : null}
                </div>

                {view === "json" ? (
                  <pre className="mt-4 max-h-[28rem] overflow-auto rounded-2xl bg-black/60 p-4 font-mono text-xs leading-relaxed text-zinc-300">
                    <code>{abiJson}</code>
                  </pre>
                ) : (
                  <ul className="mt-4 divide-y divide-border/40 border-y border-border/40">
                    {(view === "functions" ? functions : events).map((it) => (
                      <li key={it.name} className="grid gap-1 py-3 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6">
                        <code className="min-w-0 break-words font-mono text-[13px] text-foreground">{abiSignature(it)}</code>
                        <span className="flex items-center gap-3 text-[11px] text-muted-foreground">
                          {it.outputs && it.outputs.length > 0 ? <span className="font-mono">returns {it.outputs.map((o) => o.type).join(", ")}</span> : null}
                          {it.stateMutability ? (
                            <span className={cn("rounded-full px-2 py-0.5 font-medium", it.stateMutability === "view" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400")}>
                              {it.stateMutability === "view" ? "read" : "write"}
                            </span>
                          ) : (
                            <span className="rounded-full bg-secondary/60 px-2 py-0.5 font-medium">event</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                The catalog lists this token as {token.standard || "an unspecified standard"}, and ProMiners has no interface definition for it.
              </p>
            )}
          </section>

          {/* Unavailable */}
          <section id="unavailable" aria-labelledby="na-heading" className="scroll-mt-24">
            <Eyebrow>Not available here</Eyebrow>
            <h2 id="na-heading" className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Details ProMiners cannot show</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              These are not stored by ProMiners and no explorer or RPC source is connected to this page. Earlier versions showed generated values here; they were removed because they were not real.
            </p>
            <ul className="mt-4 grid gap-x-10 border-y border-border/40 sm:grid-cols-2">
              {unavailable.map((u) => (
                <li key={u.label} className="flex items-baseline justify-between gap-4 border-b border-dashed border-border/40 py-3 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
                  <span className="text-sm text-muted-foreground">{u.label}</span>
                  <span className="text-right text-[11px] text-muted-foreground/80">{u.note}</span>
                </li>
              ))}
            </ul>
            {addr ? (
              <a href={`${explorerBase}/address/${addr}#code`} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                Look these up on the explorer <ArrowUpRight className="h-3 w-3" />
              </a>
            ) : null}
          </section>

          <p className="border-l-2 border-primary/40 pl-4 text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">D-04: </span>
            Ethereum Sepolia (Chain ID 11155111) is the only network with wallet connectivity in this milestone. Nothing on this page sends a transaction.
          </p>
        </div>
      </div>
    </div>
  );
}
