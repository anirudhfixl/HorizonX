"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { useModal } from "@/contexts/modal-context";
import {
  Token,
  TokenMarketData,
  Project,
  Presale,
  FairLaunch,
  AirdropCampaign,
  StakingPool,
  VerificationStatus,
} from "@/types";
import {
  Coins,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  TrendingUp,
  BarChart2,
  Wallet,
  FileCode2,
  Activity,
  Flame,
  Sparkles,
  Globe,
  AlertCircle,
  CheckCircle2,
  Info,
  Share2,
  ChevronRight,
  BookOpen,
} from "lucide-react";

export type TokenWithMarket = Token & { market: TokenMarketData };

interface TokenDetailHubProps {
  token: TokenWithMarket;
  project?: Project;
  presales: Presale[];
  fairLaunches: FairLaunch[];
  airdrops: AirdropCampaign[];
  stakingPools: StakingPool[];
  initialTab?: "overview" | "contract" | "activity";
}

// Format numbers as currency with K/M abbreviations
export function formatCurrency(val?: number): string {
  if (val === undefined || val === null || val === 0) return "$0.00";
  if (val >= 1000000000) return `$${(val / 1000000000).toFixed(2)}B`;
  if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(2)}K`;
  if (val < 0.01) return `$${val.toFixed(4)}`;
  return `$${val.toFixed(2)}`;
}

// Format integer values with commas
export function formatNumber(val?: number): string {
  if (val === undefined || val === null) return "0";
  return new Intl.NumberFormat("en-US").format(val);
}

export function TokenDetailHub({
  token,
  project,
  presales,
  fairLaunches,
  airdrops,
  stakingPools,
  initialTab = "overview",
}: TokenDetailHubProps) {
  const { isConnected, address: userAddress } = useWallet();
  const { openModal } = useModal();

  const activeTab = initialTab ?? "overview";
  const [contractSubtab, setContractSubtab] = useState<"source" | "abi" | "read">("source");
  const [activitySubtab, setActivitySubtab] = useState<"transfers" | "holders" | "events">("transfers");

  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [copiedAbi, setCopiedAbi] = useState(false);
  const [copiedTxHash, setCopiedTxHash] = useState<string | null>(null);

  const isSepolia =
    (token.network || "").toLowerCase().includes("sepolia") ||
    (token.network || "").toLowerCase() === "ethereum";

  const explorerBaseUrl = isSepolia
    ? "https://sepolia.etherscan.io"
    : token.network.toLowerCase().includes("arbitrum")
    ? "https://arbiscan.io"
    : token.network.toLowerCase().includes("base")
    ? "https://basescan.org"
    : "https://polygonscan.com";

  const handleCopy = (text: string, type: "address" | "source" | "abi" | "tx") => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === "address") {
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
      } else if (type === "source") {
        setCopiedSource(true);
        setTimeout(() => setCopiedSource(false), 2000);
      } else if (type === "abi") {
        setCopiedAbi(true);
        setTimeout(() => setCopiedAbi(false), 2000);
      } else if (type === "tx") {
        setCopiedTxHash(text);
        setTimeout(() => setCopiedTxHash(null), 2000);
      }
    }
  };

  // Reconciled verification badge
  const renderVerificationBadge = (status?: VerificationStatus) => {
    switch (status) {
      case "audit_available":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> Audit Available
          </span>
        );
      case "contract_source_verified":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
            <ShieldCheck className="h-3 w-3" /> Source Verified
          </span>
        );
      case "project_reviewed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-medium text-sky-400">
            <Info className="h-3 w-3" /> Project Reviewed
          </span>
        );
      case "not_reviewed":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-400">
            <AlertCircle className="h-3 w-3" /> Not Reviewed
          </span>
        );
    }
  };

  // Generate verified Solidity contract source
  const isSourceAvailable = token.verificationStatus !== "not_reviewed";
  const contractName = token.symbol.replace(/[^a-zA-Z0-9]/g, "") + "Token";
  const contractSourceCode = `// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ${token.name} (${token.symbol})
 * @dev Implementation of ${token.name} on ${token.network}.
 * Verified via ProMiners Protocol Registry.
 */
contract ${contractName} is ERC20, ERC20Burnable, ERC20Permit, Ownable {
    uint8 private immutable _customDecimals;

    event InitialSupplyMinted(address indexed recipient, uint256 amount);

    constructor(
        address initialOwner,
        uint256 initialSupply,
        uint8 tokenDecimals
    )
        ERC20("${token.name}", "${token.symbol}")
        ERC20Permit("${token.name}")
        Ownable(initialOwner)
    {
        _customDecimals = tokenDecimals;
        _mint(initialOwner, initialSupply * 10 ** tokenDecimals);
        emit InitialSupplyMinted(initialOwner, initialSupply);
    }

    function decimals() public view virtual override returns (uint8) {
        return _customDecimals;
    }
}`;

  // Standard ERC-20 ABI representation
  const standardAbi = [
    {
      type: "function",
      name: "name",
      inputs: [],
      outputs: [{ name: "", type: "string" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "symbol",
      inputs: [],
      outputs: [{ name: "", type: "string" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "decimals",
      inputs: [],
      outputs: [{ name: "", type: "uint8" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "totalSupply",
      inputs: [],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "balanceOf",
      inputs: [{ name: "account", type: "address" }],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "allowance",
      inputs: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
      ],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "transfer",
      inputs: [
        { name: "to", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      outputs: [{ name: "", type: "bool" }],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "approve",
      inputs: [
        { name: "spender", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      outputs: [{ name: "", type: "bool" }],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "transferFrom",
      inputs: [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      outputs: [{ name: "", type: "bool" }],
      stateMutability: "nonpayable",
    },
    {
      type: "event",
      name: "Transfer",
      inputs: [
        { name: "from", type: "address", indexed: true },
        { name: "to", type: "address", indexed: true },
        { name: "value", type: "uint256", indexed: false },
      ],
    },
    {
      type: "event",
      name: "Approval",
      inputs: [
        { name: "owner", type: "address", indexed: true },
        { name: "spender", type: "address", indexed: true },
        { name: "value", type: "uint256", indexed: false },
      ],
    },
  ];

  // Calculated Supply Metrics
  const rawSupply = parseInt((token.totalSupply || "100000000").replace(/[^0-9]/g, ""), 10) || 100000000;
  const circSupply = token.market?.circulatingSupply || rawSupply * 0.65;
  const circulatingPct = Math.min(100, Math.round((circSupply / rawSupply) * 100));
  const fdv = rawSupply * (token.market?.price || 0);

  // Holder Distribution Breakdown
  const holdersBreakdown = [
    {
      name: "Protocol Treasury & Governance",
      address: project?.ownerAddress || "0x18F4...9A21",
      percentage: 35,
      balance: `${formatNumber(Math.round(rawSupply * 0.35))} ${token.symbol}`,
      type: "Multi-Sig Treasury",
    },
    {
      name: "Staking & Liquidity Rewards",
      address: "0x772A...4D91",
      percentage: 25,
      balance: `${formatNumber(Math.round(rawSupply * 0.25))} ${token.symbol}`,
      type: "Reward Contract",
    },
    {
      name: "Public Sale & Fair Distribution",
      address: "0x42B1...1E03",
      percentage: 20,
      balance: `${formatNumber(Math.round(rawSupply * 0.20))} ${token.symbol}`,
      type: "Community Allocations",
    },
    {
      name: "Core Contributors & Ecosystem Reserve",
      address: token.creatorAddress || "0x892A...A7D1",
      percentage: 12,
      balance: `${formatNumber(Math.round(rawSupply * 0.12))} ${token.symbol}`,
      type: "Vested (24 Months)",
    },
    {
      name: "DEX AMM Liquidity Vault",
      address: "0x61E3...5B22",
      percentage: 8,
      balance: `${formatNumber(Math.round(rawSupply * 0.08))} ${token.symbol}`,
      type: "Liquidity Pool",
    },
  ];

  // Simulated Transfer History
  const mockTransfers = [
    {
      hash: "0x8a92b4c1d3e5f7a9b0c2d4e6f8a1b3c5d7e9f0a2",
      method: "Transfer",
      from: "0x18F4...9A21 (Treasury)",
      to: "0x772A...4D91 (Rewards Vault)",
      amount: `${formatNumber(Math.round(rawSupply * 0.005))} ${token.symbol}`,
      age: "18 mins ago",
      block: 6812490,
    },
    {
      hash: "0x4b7c9e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d",
      method: "Transfer",
      from: "0x61E3...5B22 (DEX Pool)",
      to: "0x3918...4920",
      amount: `${formatNumber(Math.round(rawSupply * 0.001))} ${token.symbol}`,
      age: "2 hours ago",
      block: 6811980,
    },
    {
      hash: "0x1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e",
      method: "Transfer",
      from: "0x892A...A7D1 (Deployer)",
      to: "0x61E3...5B22 (DEX Pool)",
      amount: `${formatNumber(Math.round(rawSupply * 0.02))} ${token.symbol}`,
      age: "1 day ago",
      block: 6808420,
    },
    {
      hash: "0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",
      method: "Transfer",
      from: "0x892A...A7D1 (Deployer)",
      to: "0x18F4...9A21 (Treasury)",
      amount: `${formatNumber(Math.round(rawSupply * 0.35))} ${token.symbol}`,
      age: "3 days ago",
      block: 6799400,
    },
    {
      hash: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f",
      method: "Initial Mint",
      from: "0x0000...0000 (Genesis)",
      to: "0x892A...A7D1 (Deployer)",
      amount: `${token.totalSupply || "100,000,000"} ${token.symbol}`,
      age: token.createdAt,
      block: 6701000,
    },
  ];

  const totalEcosystemItems =
    presales.length + fairLaunches.length + airdrops.length + stakingPools.length;

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Page Header */}
      <PageHeader
        title={`${token.name} (${token.symbol})`}
        description={token.description}
        breadcrumbs={[
          { label: "Tokens", href: "/tokens" },
          { label: "Explore", href: "/tokens/explore" },
          { label: token.symbol },
        ]}
        badge={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={token.status} />
            {renderVerificationBadge(token.verificationStatus)}
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-mono font-medium ${
                isSepolia
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "bg-muted text-muted-foreground border border-border/40"
              }`}
            >
              {isSepolia ? "Sepolia (D-04)" : token.network}
            </span>
          </div>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              asChild
              size="sm"
              className="bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
            >
              <Link href={`/exchange/tokens/${token.id}`}>Trade {token.symbol}</Link>
            </Button>

            {token.contractAddress ? (
              <a
                href={`${explorerBaseUrl}/token/${token.contractAddress}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border/60 bg-secondary/30 px-3 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              >
                <span>Explorer</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}

            {isConnected ? (
              <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 text-xs text-primary font-mono">
                <Wallet className="h-3.5 w-3.5" />
                <span>
                  {userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : "Connected"}
                </span>
              </span>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs border-border/60 text-muted-foreground hover:text-foreground"
                onClick={() => openModal("CONNECT_WALLET")}
              >
                <Wallet className="h-3.5 w-3.5 mr-1 text-primary" />
                Connect
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs border-border/60 text-muted-foreground hover:text-foreground"
              onClick={() => handleCopy(window?.location?.href || "", "tx")}
            >
              <Share2 className="h-3.5 w-3.5 mr-1" />
              Share
            </Button>
          </div>
        }
      />

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Current Price"
          value={`$${token.market?.price ?? "—"}`}
          change={
            token.market?.priceChange24h !== undefined
              ? `${token.market.priceChange24h >= 0 ? "+" : ""}${token.market.priceChange24h}% (24h)`
              : undefined
          }
          trend={
            (token.market?.priceChange24h || 0) >= 0 ? "up" : "down"
          }
          subtitle="Simulated spot exchange"
          icon={<TrendingUp className="h-4 w-4 text-emerald-400" />}
        />
        <MetricCard
          title="Market Capitalization"
          value={formatCurrency(token.market?.marketCap)}
          change="Simulated Market Feed"
          trend="neutral"
          subtitle={`FDV: ${formatCurrency(fdv)}`}
          icon={<BarChart2 className="h-4 w-4 text-primary" />}
        />
        <MetricCard
          title="24h Trading Volume"
          value={formatCurrency(token.market?.volume24h)}
          change="Simulated Volume"
          trend="neutral"
          subtitle="Aggregated DEX liquidity pools"
          icon={<Activity className="h-4 w-4 text-sky-400" />}
        />
        <MetricCard
          title="Total Supply"
          value={token.totalSupply || "100M"}
          subtitle={`${token.decimals ?? 18} Decimals • ${token.standard || "ERC-20"}`}
          change={`${circulatingPct}% Circulating`}
          trend="neutral"
          icon={<Coins className="h-4 w-4 text-amber-400" />}
        />
      </div>

      {/* 3. D-04 & Demonstration Disclaimer Banner */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <div className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Architecture Notice (D-04): </span>
              {isSepolia ? (
                <>
                  Ethereum Sepolia (Chain ID <code className="text-primary font-mono">11155111</code>) is the active transaction network. Market telemetry and on-chain contract actions are simulated demonstrations for this milestone.
                </>
              ) : (
                <>
                  This asset is cataloged on <span className="font-medium text-foreground">{token.network}</span> for cross-chain ecosystem discovery. Under D-04, wallet connectivity and Web3 interactions are supported exclusively on Ethereum Sepolia.
                </>
              )}
            </div>
          </div>
          <span className="shrink-0 rounded bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-primary">
            D-04 Verified
          </span>
        </div>
      </div>

      {/* 4. Tab Navigation Bar */}
      <div className="border-b border-border/40">
        <div className="flex items-center gap-2 overflow-x-auto">
          <Link
            href={`/tokens/${token.id}`}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-all ${
              activeTab === "overview"
                ? "border-primary text-primary bg-primary/10"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Overview & Utilities
          </Link>
          <Link
            href={`/tokens/${token.id}/contract`}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-all ${
              activeTab === "contract"
                ? "border-primary text-primary bg-primary/10"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <FileCode2 className="h-3.5 w-3.5" />
            Contract & Source
          </Link>
          <Link
            href={`/tokens/${token.id}/activity`}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-all ${
              activeTab === "activity"
                ? "border-primary text-primary bg-primary/10"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            Activity & Holders
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB A: OVERVIEW & UTILITIES                                               */}
      {/* ========================================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Token Details & Supply Breakdown */}
            <div className="lg:col-span-2 space-y-6">
              {/* Token Identity & Contract Address Card */}
              <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Coins className="h-4 w-4 text-primary" />
                    Asset Specifications
                  </h3>
                  <span className="text-xs font-mono text-muted-foreground">
                    Catalog ID: {token.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-border/40 bg-secondary/20 p-3 space-y-1">
                    <span className="text-muted-foreground">Standard</span>
                    <p className="font-semibold text-foreground">{token.standard || "ERC-20"}</p>
                  </div>
                  <div className="rounded-xl border border-border/40 bg-secondary/20 p-3 space-y-1">
                    <span className="text-muted-foreground">Host Network</span>
                    <p className="font-semibold text-foreground">{token.network}</p>
                  </div>
                  <div className="rounded-xl border border-border/40 bg-secondary/20 p-3 space-y-1">
                    <span className="text-muted-foreground">Decimals</span>
                    <p className="font-semibold font-mono text-foreground">{token.decimals ?? 18}</p>
                  </div>
                  <div className="rounded-xl border border-border/40 bg-secondary/20 p-3 space-y-1">
                    <span className="text-muted-foreground">Catalog Category</span>
                    <p className="font-semibold text-foreground">{token.category || "General"}</p>
                  </div>
                </div>

                {/* Contract Address Bar */}
                <div className="pt-2 border-t border-border/40">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono text-muted-foreground">Contract Address</span>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="rounded bg-muted px-2.5 py-1 text-xs font-mono text-foreground break-all">
                          {token.contractAddress || "Deployment Pending"}
                        </code>
                        {token.contractAddress && (
                          <button
                            onClick={() => handleCopy(token.contractAddress!, "address")}
                            className="inline-flex h-7 items-center gap-1 rounded bg-secondary px-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                            title="Copy contract address"
                          >
                            {copiedAddress ? (
                              <Check className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                            <span>{copiedAddress ? "Copied" : "Copy"}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {token.contractAddress && (
                      <div className="text-xs">
                        <a
                          href={`${explorerBaseUrl}/token/${token.contractAddress}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          <span>View on {isSepolia ? "Sepolia Etherscan" : "Explorer"}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Supply & Tokenomics Card */}
              <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <BarChart2 className="h-4 w-4 text-primary" />
                    Tokenomics & Circulating Supply
                  </h3>
                  <span className="text-xs font-mono text-muted-foreground">
                    {circulatingPct}% Unlocked
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Circulating Supply</span>
                    <span className="font-mono font-semibold text-foreground">
                      {formatNumber(circSupply)} {token.symbol}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${circulatingPct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Circulating: {formatNumber(circSupply)}</span>
                    <span>Total: {token.totalSupply || "100,000,000"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border/40 text-xs">
                  <div>
                    <span className="text-muted-foreground">Total Supply</span>
                    <p className="font-mono font-semibold text-foreground text-sm">
                      {token.totalSupply || "100M"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Simulated FDV</span>
                    <p className="font-mono font-semibold text-foreground text-sm">
                      {formatCurrency(fdv)}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">DEX Liquidity</span>
                    <p className="font-mono font-semibold text-foreground text-sm">
                      {formatCurrency(token.market?.liquidity)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Linked Project & Ecosystem Utilities */}
            <div className="space-y-6">
              {/* Linked Project Card */}
              <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    Ecosystem Project
                  </h3>
                  {project && <StatusBadge status={project.status} />}
                </div>

                {project ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary font-bold text-sm shrink-0">
                        {project.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/projects/${project.id}`}
                          className="font-semibold text-foreground text-sm hover:text-primary transition-colors block truncate"
                        >
                          {project.name}
                        </Link>
                        <span className="text-xs text-muted-foreground">
                          {project.category || "Ecosystem Protocol"}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {project.description || "Decentralized protocol within the ProMiners Web3 network."}
                    </p>

                    <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                      {project.websiteUrl && (
                        <a
                          href={project.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <span>Official Website</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-border/60 hover:border-primary/50"
                      >
                        <Link href={`/projects/${project.id}`}>Project Hub</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-border/40 bg-secondary/20 p-4 text-center space-y-1">
                    <p className="text-xs font-semibold text-foreground">Standalone Token</p>
                    <p className="text-[11px] text-muted-foreground">
                      This token is registered as an independent community asset without a parent project profile.
                    </p>
                  </div>
                )}
              </div>

              {/* Ecosystem Utilities & Campaigns Card */}
              <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Ecosystem Utilities
                  </h3>
                  <span className="text-xs font-mono text-muted-foreground">
                    {totalEcosystemItems} active
                  </span>
                </div>

                {totalEcosystemItems > 0 ? (
                  <div className="space-y-2.5">
                    {/* Presales */}
                    {presales.map((ps) => (
                      <Link
                        key={ps.id}
                        href={`/launchpad/presales/${ps.id}`}
                        className="rounded-xl border border-border/40 bg-secondary/20 p-3 block hover:border-primary/40 transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-foreground truncate mr-2">
                            Presale: {ps.title}
                          </span>
                          <StatusBadge status={ps.status} />
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>Target: {ps.hardCap}</span>
                          <span className="text-primary flex items-center gap-0.5">
                            View Deal <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </Link>
                    ))}

                    {/* Fair Launches */}
                    {fairLaunches.map((fl) => (
                      <Link
                        key={fl.id}
                        href={`/launchpad/launches/${fl.id}`}
                        className="rounded-xl border border-border/40 bg-secondary/20 p-3 block hover:border-primary/40 transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-foreground truncate mr-2">
                            Fair Launch: {fl.title}
                          </span>
                          <StatusBadge status={fl.status} />
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>Raised: {fl.totalRaised}</span>
                          <span className="text-primary flex items-center gap-0.5">
                            View Launch <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </Link>
                    ))}

                    {/* Airdrops */}
                    {airdrops.map((air) => (
                      <Link
                        key={air.id}
                        href={`/airdrops/campaigns/${air.id}`}
                        className="rounded-xl border border-border/40 bg-secondary/20 p-3 block hover:border-primary/40 transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-foreground truncate mr-2">
                            Airdrop: {air.title}
                          </span>
                          <StatusBadge status={air.status} />
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>Pool: {air.totalReward}</span>
                          <span className="text-primary flex items-center gap-0.5">
                            Claim Portal <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </Link>
                    ))}

                    {/* Staking Pools */}
                    {stakingPools.map((pool) => (
                      <Link
                        key={pool.id}
                        href={`/staking/pools/${pool.id}`}
                        className="rounded-xl border border-border/40 bg-secondary/20 p-3 block hover:border-primary/40 transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-foreground truncate mr-2">
                            Staking: {pool.name}
                          </span>
                          <span className="font-mono font-bold text-emerald-400">{pool.apy} APY</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>Lock: {pool.lockPeriodDays ? `${pool.lockPeriodDays} Days` : "Flexible"}</span>
                          <span className="text-primary flex items-center gap-0.5">
                            Stake Now <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-border/40 bg-secondary/20 p-4 text-center space-y-1">
                    <p className="text-xs font-semibold text-foreground">No Active Campaigns</p>
                    <p className="text-[11px] text-muted-foreground">
                      No live presales, airdrops, or staking pools are currently associated with {token.symbol}.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB B: CONTRACT & SOURCE                                                  */}
      {/* ========================================================================= */}
      {activeTab === "contract" && (
        <div className="space-y-6">
          {/* Contract Overview & Compiler Metadata */}
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <FileCode2 className="h-4 w-4 text-primary" />
                  Contract Registry & Architecture
                </h3>
                <p className="text-xs text-muted-foreground">
                  Compiler specification, source bytecode status, and verified interface definitions.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {renderVerificationBadge(token.verificationStatus)}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="rounded-xl border border-border/40 bg-secondary/20 p-3 space-y-1">
                <span className="text-muted-foreground text-[10px]">Compiler</span>
                <p className="font-mono font-semibold text-foreground text-xs">v0.8.24</p>
              </div>
              <div className="rounded-xl border border-border/40 bg-secondary/20 p-3 space-y-1">
                <span className="text-muted-foreground text-[10px]">Optimization</span>
                <p className="font-mono font-semibold text-foreground text-xs">200 runs</p>
              </div>
              <div className="rounded-xl border border-border/40 bg-secondary/20 p-3 space-y-1">
                <span className="text-muted-foreground text-[10px]">EVM Version</span>
                <p className="font-mono font-semibold text-foreground text-xs">Cancun</p>
              </div>
              <div className="rounded-xl border border-border/40 bg-secondary/20 p-3 space-y-1">
                <span className="text-muted-foreground text-[10px]">License</span>
                <p className="font-mono font-semibold text-foreground text-xs">MIT</p>
              </div>
              <div className="rounded-xl border border-border/40 bg-secondary/20 p-3 space-y-1">
                <span className="text-muted-foreground text-[10px]">Standard</span>
                <p className="font-mono font-semibold text-foreground text-xs">{token.standard || "ERC-20"}</p>
              </div>
              <div className="rounded-xl border border-border/40 bg-secondary/20 p-3 space-y-1">
                <span className="text-muted-foreground text-[10px]">Framework</span>
                <p className="font-mono font-semibold text-foreground text-xs">OZ v5.0.1</p>
              </div>
            </div>
          </div>

          {/* Contract Subtabs */}
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden">
            <div className="p-3 border-b border-border/40 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setContractSubtab("source")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    contractSubtab === "source"
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  Source Code
                </button>
                <button
                  onClick={() => setContractSubtab("abi")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    contractSubtab === "abi"
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  Contract ABI (JSON)
                </button>
                <button
                  onClick={() => setContractSubtab("read")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    contractSubtab === "read"
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  Read Contract State
                </button>
              </div>

              {contractSubtab === "source" && isSourceAvailable && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs border-border/60 text-muted-foreground hover:text-foreground"
                  onClick={() => handleCopy(contractSourceCode, "source")}
                >
                  {copiedSource ? (
                    <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 mr-1" />
                  )}
                  {copiedSource ? "Source Copied" : "Copy Code"}
                </Button>
              )}

              {contractSubtab === "abi" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs border-border/60 text-muted-foreground hover:text-foreground"
                  onClick={() => handleCopy(JSON.stringify(standardAbi, null, 2), "abi")}
                >
                  {copiedAbi ? (
                    <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 mr-1" />
                  )}
                  {copiedAbi ? "ABI Copied" : "Copy ABI JSON"}
                </Button>
              )}
            </div>

            {/* Subtab Content */}
            <div className="p-4">
              {contractSubtab === "source" && (
                <div>
                  {isSourceAvailable ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border/40">
                        <span className="font-mono">contracts/{contractName}.sol</span>
                        <span>Solidity 0.8.24</span>
                      </div>
                      <pre className="p-4 rounded-xl bg-black/60 border border-border/40 overflow-x-auto text-xs font-mono text-zinc-300 leading-relaxed max-h-[500px]">
                        <code>{contractSourceCode}</code>
                      </pre>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-center space-y-2">
                      <AlertCircle className="h-8 w-8 text-amber-400 mx-auto" />
                      <h4 className="text-sm font-semibold text-foreground">
                        Source Code Unverified / Unavailable
                      </h4>
                      <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                        This token was submitted under community review and has not yet completed bytecode verification or source publishing.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {contractSubtab === "abi" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border/40">
                    <span className="font-mono">{standardAbi.length} Standard ABI Definitions</span>
                    <span>EIP-20 Standard</span>
                  </div>
                  <pre className="p-4 rounded-xl bg-black/60 border border-border/40 overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed max-h-[500px]">
                    <code>{JSON.stringify(standardAbi, null, 2)}</code>
                  </pre>
                </div>
              )}

              {contractSubtab === "read" && (
                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground pb-2 border-b border-border/40 flex items-center justify-between">
                    <span>Public View Getters</span>
                    <span className="text-[10px] text-primary">Simulated RPC Call State</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-border/40 bg-secondary/20 p-3 space-y-1">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="font-mono">1. name()</span>
                        <span className="text-[10px]">string</span>
                      </div>
                      <p className="font-mono font-semibold text-foreground">{token.name}</p>
                    </div>

                    <div className="rounded-xl border border-border/40 bg-secondary/20 p-3 space-y-1">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="font-mono">2. symbol()</span>
                        <span className="text-[10px]">string</span>
                      </div>
                      <p className="font-mono font-semibold text-foreground">{token.symbol}</p>
                    </div>

                    <div className="rounded-xl border border-border/40 bg-secondary/20 p-3 space-y-1">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="font-mono">3. decimals()</span>
                        <span className="text-[10px]">uint8</span>
                      </div>
                      <p className="font-mono font-semibold text-foreground">{token.decimals ?? 18}</p>
                    </div>

                    <div className="rounded-xl border border-border/40 bg-secondary/20 p-3 space-y-1">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="font-mono">4. totalSupply()</span>
                        <span className="text-[10px]">uint256</span>
                      </div>
                      <p className="font-mono font-semibold text-foreground">
                        {token.totalSupply || "100000000000000000000000000"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-border/40 bg-secondary/20 p-3 space-y-1">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="font-mono">5. owner()</span>
                        <span className="text-[10px]">address</span>
                      </div>
                      <p className="font-mono font-semibold text-foreground break-all">
                        {project?.ownerAddress || token.creatorAddress || "0x892a43b2f671b2691e9b24ee945c35d5d8c9a7d1"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-border/40 bg-secondary/20 p-3 space-y-1">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="font-mono">6. paused()</span>
                        <span className="text-[10px]">bool</span>
                      </div>
                      <p className="font-mono font-semibold text-emerald-400">false</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB C: ACTIVITY & HOLDERS                                                 */}
      {/* ========================================================================= */}
      {activeTab === "activity" && (
        <div className="space-y-6">
          {/* Activity Subtabs */}
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden">
            <div className="p-3 border-b border-border/40 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActivitySubtab("transfers")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activitySubtab === "transfers"
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  Transfer History ({mockTransfers.length})
                </button>
                <button
                  onClick={() => setActivitySubtab("holders")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activitySubtab === "holders"
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  Top Holders ({holdersBreakdown.length})
                </button>
                <button
                  onClick={() => setActivitySubtab("events")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activitySubtab === "events"
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  Mint & Burn Logs
                </button>
              </div>

              <span className="text-[11px] font-mono text-muted-foreground">
                Simulated Event Indexer
              </span>
            </div>

            {/* Subtab Content */}
            <div className="p-4">
              {/* 1. Transfers */}
              {activitySubtab === "transfers" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border/40 text-[11px] text-muted-foreground">
                        <th className="py-2.5 px-3">Tx Hash</th>
                        <th className="py-2.5 px-3">Method</th>
                        <th className="py-2.5 px-3">From</th>
                        <th className="py-2.5 px-3">To</th>
                        <th className="py-2.5 px-3 text-right">Amount</th>
                        <th className="py-2.5 px-3 text-right">Age</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30 text-foreground">
                      {mockTransfers.map((tx) => (
                        <tr key={tx.hash} className="hover:bg-muted/30 transition-colors">
                          <td className="py-2.5 px-3 font-mono">
                            <div className="flex items-center gap-1.5">
                              {isSepolia ? (
                                <a
                                  href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {tx.hash.slice(0, 10)}...
                                </a>
                              ) : (
                                <span className="text-foreground">{tx.hash.slice(0, 10)}...</span>
                              )}
                              <button
                                onClick={() => handleCopy(tx.hash, "tx")}
                                className="text-muted-foreground hover:text-foreground"
                                title="Copy Tx Hash"
                              >
                                {copiedTxHash === tx.hash ? (
                                  <Check className="h-3 w-3 text-emerald-400" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="rounded bg-secondary/60 px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                              {tx.method}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-muted-foreground">
                            {tx.from}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-muted-foreground">
                            {tx.to}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-semibold text-foreground text-right">
                            {tx.amount}
                          </td>
                          <td className="py-2.5 px-3 text-right text-muted-foreground text-[11px]">
                            {tx.age}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 2. Holders */}
              {activitySubtab === "holders" && (
                <div className="space-y-4">
                  <div className="text-xs text-muted-foreground pb-2 border-b border-border/40 flex items-center justify-between">
                    <span>Category Allocation</span>
                    <span>% Total Supply</span>
                  </div>

                  <div className="space-y-3">
                    {holdersBreakdown.map((holder) => (
                      <div
                        key={holder.name}
                        className="rounded-xl border border-border/40 bg-secondary/20 p-3.5 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <span className="font-semibold text-foreground">{holder.name}</span>
                            <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                              ({holder.type})
                            </span>
                          </div>
                          <span className="font-mono font-bold text-primary">
                            {holder.percentage}%
                          </span>
                        </div>

                        <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${holder.percentage}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <code className="text-xs">{holder.address}</code>
                          <span className="font-mono font-medium text-foreground">
                            {holder.balance}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Mint & Burn Logs */}
              {activitySubtab === "events" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-border/40 bg-secondary/20 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-emerald-400" />
                        <h4 className="text-xs font-semibold text-foreground">Genesis Mint Event</h4>
                      </div>
                      <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono">
                        Confirmed (Block 6701000)
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Initial total supply of <span className="font-mono font-semibold text-foreground">{token.totalSupply || "100,000,000"} {token.symbol}</span> was minted to deployer address upon contract creation on {token.createdAt}.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/40 bg-secondary/20 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-amber-400" />
                        <h4 className="text-xs font-semibold text-foreground">Deflationary Burn Status</h4>
                      </div>
                      <span className="rounded bg-secondary text-muted-foreground border border-border/40 px-2 py-0.5 text-[10px] font-mono">
                        Non-Deflationary Supply
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Zero token burn transactions recorded for this asset. Total supply remains constant at catalog specifications.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
