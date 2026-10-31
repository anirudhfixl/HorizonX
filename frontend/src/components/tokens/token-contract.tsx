"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/projects/copy-button";
import { TokenDetailShell } from "./token-detail-shell";
import { getExplorerBaseUrl, isSepoliaNetwork } from "@/components/tokens/token-profile";
import { cn } from "@/lib/utils";
import type { Token, TokenMarketData, Project, VerificationStatus } from "@/types";
import {
  ArrowUpRight,
  Check,
  Copy,
  ExternalLink,
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
  return (
    <div className="grid grid-cols-1 gap-2 py-3.5 sm:grid-cols-[14rem_1fr_auto] sm:items-baseline sm:gap-6 text-sm">
      <dt className="text-xs text-muted-foreground">
        {row.label}
        {row.note ? <span className="block text-[11px] text-muted-foreground/70 mt-0.5">{row.note}</span> : null}
      </dt>
      <dd className={cn("min-w-0 text-foreground", row.mono && "font-mono text-xs sm:text-sm")}>
        {row.value ?? <span className="text-muted-foreground/60">Not recorded in catalog</span>}
      </dd>
      <div className="justify-self-start sm:justify-self-end">
        <SourceTag kind={row.source} />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TokenContract({ token, project }: TokenContractProps) {
  const [view, setView] = useState<"functions" | "events" | "json">("functions");
  const [abiCopied, setAbiCopied] = useState(false);

  const sepolia = isSepoliaNetwork(token.network);
  const explorerBase = getExplorerBaseUrl(token.network);
  const addr = token.contractAddress;
  const addrValid = isEvmAddress(addr);
  const raw = rawSupplyUnits(token.totalSupply, token.decimals);
  const erc20 = isErc20Standard(token.standard);
  const tier: VerificationStatus = token.verificationStatus ?? "not_reviewed";

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
          {sepolia ? <span className="ml-2 font-mono text-xs text-primary font-medium">Chain ID 11155111</span> : null}
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
      label: "Creator Address",
      value: token.creatorAddress ? (
        <span className="flex items-center gap-1.5">
          <code className="min-w-0 break-all">{token.creatorAddress}</code>
          <CopyButton value={token.creatorAddress} label="creator address" />
        </span>
      ) : undefined,
      source: token.creatorAddress ? "catalog" : "missing",
      note: "The address that registered the token in the catalog. Not confirmed as on-chain deployer or owner.",
      mono: true,
    },
    {
      label: "Linked project",
      value: project ? (
        <Link href={`/projects/${project.id}`} className="inline-flex items-center gap-1 text-primary hover:underline font-medium">
          {project.name}
        </Link>
      ) : undefined,
      source: project ? "catalog" : "missing",
    },
    {
      label: "Verification tier",
      value: VERIF_LABEL[tier],
      source: "catalog",
      note: "Stored on the record. Does not represent a bytecode match check by ProMiners.",
    },
    {
      label: "Declared features",
      value: token.features && token.features.length > 0 ? token.features.join(", ") : undefined,
      source: token.features && token.features.length > 0 ? "catalog" : "missing",
      note: "Extensions claimed in the catalog (e.g. burnable, pausable, permit).",
    },
  ];

  const unavailable = [
    { label: "Solidity compiler version", note: "Look up on block explorer code tab" },
    { label: "EVM target version", note: "Look up on block explorer code tab" },
    { label: "Compiler optimization runs", note: "Look up on block explorer code tab" },
    { label: "Constructor arguments", note: "Read from creation transaction input on explorer" },
    { label: "Contract bytecode hash", note: "Requires direct RPC eth_getCode lookup" },
  ];

  return (
    <TokenDetailShell token={token} project={project} activeTab="contract">
      <div className="space-y-12">
        {/* ─── 1. Contract Address & Explorer Bar ─────────────────────────── */}
        <section aria-labelledby="address-heading" className="rounded-2xl border border-border/40 bg-card/30 p-6 space-y-4">
          <Eyebrow>Contract Deployment Address</Eyebrow>
          <h2 id="address-heading" className="sr-only">Contract Address</h2>

          {addr ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-secondary/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                <code className="min-w-0 break-all font-mono text-sm font-semibold text-foreground sm:text-base" data-testid="contract-address">
                  {addr}
                </code>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyText(addr, () => {}, "Address copied")}
                    className="h-8 gap-1.5 border-border/60 text-xs"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </Button>
                  <Button asChild size="sm" className="h-8 gap-1.5 bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90">
                    <a href={`${explorerBase}/token/${addr}`} target="_blank" rel="noopener noreferrer">
                      <span>Token Explorer</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
                <a
                  href={`${explorerBase}/address/${addr}#code`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                >
                  Inspect source code on explorer <ArrowUpRight className="h-3 w-3" />
                </a>
                <span className="text-muted-foreground">
                  {addrValid ? "Format: valid 20-byte EVM hex address." : "Format: not a valid 20-byte hex address."}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-border/40 bg-secondary/20 p-5 text-sm text-muted-foreground">
              No contract address recorded for this token in the platform catalog.
            </div>
          )}
        </section>

        {/* ─── 2. Spec Sheet Ledger ───────────────────────────────────────── */}
        <section aria-labelledby="ledger-heading" className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/40 pb-4">
            <div>
              <Eyebrow>Contract Ledger</Eyebrow>
              <h2 id="ledger-heading" className="text-xl font-bold tracking-tight text-foreground sm:text-2xl mt-1">
                Technical Specifications &amp; Data Provenance
              </h2>
            </div>
            <ul className="flex flex-wrap items-center gap-2 text-xs" aria-label="Source legend">
              {(["catalog", "standard", "derived", "missing"] as SourceKind[]).map((k) => (
                <li key={k}><SourceTag kind={k} /></li>
              ))}
            </ul>
          </div>

          <dl className="divide-y divide-border/40 border-b border-border/40">
            {identityRows.map((r) => <LedgerRow key={r.label} row={r} />)}
          </dl>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">Data Provenance: </strong>
            Catalog values originate from stored ProMiners platform records. Raw units are mathematically derived from declared supply and decimals. Neither represents an active on-chain RPC state query.
          </p>
        </section>

        {/* ─── 3. Verification Transparency Notice ────────────────────────── */}
        <section aria-labelledby="verif-heading" className="rounded-2xl border border-border/40 bg-card/30 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Eyebrow>Verification Status</Eyebrow>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
              {VERIF_LABEL[tier] ?? tier}
            </span>
          </div>
          <h2 id="verif-heading" className="sr-only">Verification Status</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {VERIF_DETAIL[tier] ?? "This tier is stored on the catalog record."}
          </p>
          <div className="rounded-xl border border-border/30 bg-secondary/20 p-3.5 text-xs leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">Verification Boundary: </strong>
            ProMiners does not independently compile or re-verify smart contract bytecode on this page. To review compiler output and audit reports, visit the contract code tab on the block explorer.
          </div>
        </section>

        {/* ─── 4. EIP-20 Reference Interface & ABI ────────────────────────── */}
        <section aria-labelledby="iface-heading" className="space-y-4 border-t border-border/40 pt-8">
          <div>
            <Eyebrow>Interface Specification</Eyebrow>
            <h2 id="iface-heading" className="text-xl font-bold tracking-tight text-foreground sm:text-2xl mt-1">
              {erc20 ? "EIP-20 Reference Interface" : "Custom Interface"}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Standard ERC-20 functions and event signatures for this token standard. Deployed contracts may implement additional custom functions (burn, mint, permit, pause).
            </p>
          </div>

          {erc20 ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div role="group" aria-label="Interface view" className="flex items-center gap-1 rounded-xl border border-border/50 bg-secondary/30 p-1 text-xs">
                  {(["functions", "events", "json"] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      aria-pressed={view === k}
                      onClick={() => setView(k)}
                      className={cn(
                        "rounded-lg px-3 py-1.5 font-medium transition-colors",
                        view === k
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                      )}
                    >
                      {k === "functions" ? `Functions (${functions.length})` : k === "events" ? `Events (${events.length})` : "Raw ABI JSON"}
                    </button>
                  ))}
                </div>

                {view === "json" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 border-border/60 text-xs"
                    onClick={() => copyText(abiJson, () => { setAbiCopied(true); setTimeout(() => setAbiCopied(false), 2000); }, "ABI JSON Copied")}
                  >
                    {abiCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{abiCopied ? "Copied" : "Copy ABI JSON"}</span>
                  </Button>
                )}
              </div>

              {view === "json" ? (
                <pre className="max-h-[28rem] overflow-auto rounded-2xl border border-border/50 bg-black/60 p-4 font-mono text-xs leading-relaxed text-zinc-300">
                  <code>{abiJson}</code>
                </pre>
              ) : (
                <ul className="divide-y divide-border/40 border-y border-border/40">
                  {(view === "functions" ? functions : events).map((it) => (
                    <li key={it.name} className="grid gap-1 py-3 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6">
                      <code className="min-w-0 break-words font-mono text-[13px] text-foreground font-medium">
                        {abiSignature(it)}
                      </code>
                      <span className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        {it.outputs && it.outputs.length > 0 ? (
                          <span className="font-mono text-xs text-muted-foreground">returns {it.outputs.map((o) => o.type).join(", ")}</span>
                        ) : null}
                        {it.stateMutability ? (
                          <span className={cn("rounded-full px-2 py-0.5 font-medium", it.stateMutability === "view" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20")}>
                            {it.stateMutability === "view" ? "read" : "write"}
                          </span>
                        ) : (
                          <span className="rounded-full bg-secondary/60 px-2 py-0.5 font-medium border border-border/40">event</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              This token uses a custom standard ({token.standard || "Unspecified"}).
            </p>
          )}
        </section>

        {/* ─── 5. Unavailable Details Notice ──────────────────────────────── */}
        <section aria-labelledby="na-heading" className="space-y-4 border-t border-border/40 pt-8">
          <Eyebrow>Compiler Transparency</Eyebrow>
          <h2 id="na-heading" className="text-xl font-bold tracking-tight text-foreground sm:text-2xl mt-1">
            Build Artifacts Not Cached
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground max-w-2xl">
            ProMiners does not store raw compiler ASTs, bytecodes, or constructor proofs in platform databases. To inspect these exact build outputs, use the official Sepolia Etherscan explorer.
          </p>

          <ul className="grid gap-x-10 border-y border-border/40 sm:grid-cols-2 text-xs">
            {unavailable.map((u) => (
              <li key={u.label} className="flex items-baseline justify-between gap-4 border-b border-dashed border-border/40 py-2.5 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
                <span className="text-muted-foreground">{u.label}</span>
                <span className="text-right text-[11px] text-muted-foreground/80">{u.note}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ─── 6. D-04 Notice ─────────────────────────────────────────────── */}
        <p className="border-l-2 border-primary/40 pl-4 text-xs leading-relaxed text-muted-foreground">
          <strong className="font-semibold text-foreground">Architecture Decision D-04: </strong>
          Ethereum Sepolia (Chain ID 11155111) is the only network supported for Web3 wallet connectivity. No transactions or state mutations are executed on this inspector.
        </p>
      </div>
    </TokenDetailShell>
  );
}
