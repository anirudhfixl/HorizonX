import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { MOCK_TOKENS } from "@/lib/mock-data";
import {
  Coins,
  ShieldCheck,
  ExternalLink,
  Copy,
  TrendingUp,
  BarChart2,
  Lock,
  ArrowRight,
} from "lucide-react";

export function generateStaticParams() {
  return MOCK_TOKENS.map((token) => ({ id: token.id }));
}

export default async function TokenDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = MOCK_TOKENS.find((t) => t.id === id) || MOCK_TOKENS[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title={token.name}
        description={token.description}
        breadcrumbs={[
          { label: "Tokens", href: "/tokens" },
          { label: token.symbol },
        ]}
        badge={<StatusBadge status={token.status} />}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs font-semibold">
              <Link href={`/exchange/tokens/${token.id}`}>Trade Token</Link>
            </Button>
            <a
              href={`https://etherscan.io/token/${token.contractAddress}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border/60 bg-secondary/30 px-3 text-xs text-muted-foreground hover:text-foreground hover:border-border"
            >
              <span>Explorer</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        }
      />

      {/* Contract & Price Bar */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-muted-foreground">Contract Address</span>
          <div className="flex items-center gap-2 mt-1">
            <code className="rounded bg-muted px-2.5 py-1 text-xs font-mono text-foreground">
              {token.contractAddress}
            </code>
            <span className="rounded bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-[10px] font-semibold flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Verified Source
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div>
            <span className="text-muted-foreground">Current Price</span>
            <p className="text-2xl font-bold font-mono text-foreground">
              ${token.market.price}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">24h Change</span>
            <p
              className={`text-base font-bold font-mono ${
                (token.market.priceChange24h || 0) >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {(token.market.priceChange24h || 0) >= 0 ? "+" : ""}{token.market.priceChange24h}%
            </p>
          </div>
        </div>
      </div>

      {/* Market Telemetry Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <MetricCard
          title="Market Capitalization"
          value={`$${((token.market.marketCap || 0) / 1000000).toFixed(2)}M`}
          change="Rank #184"
          trend="neutral"
        />
        <MetricCard
          title="24h Trading Volume"
          value={`$${((token.market.volume24h || 0) / 1000000).toFixed(2)}M`}
          change="+14.2%"
          trend="up"
        />
        <MetricCard
          title="DEX Liquidity"
          value={`$${((token.market.liquidity || 0) / 1000000).toFixed(2)}M`}
          change="Locked 98%"
          trend="up"
        />
        <MetricCard
          title="Total Supply"
          value={token.totalSupply || "100M"}
          subtitle={`${token.decimals} Decimals`}
        />
      </div>

      {/* Contract Specification Info */}
      <div className="rounded-2xl border border-border/60 bg-card/50 p-6 space-y-4">
        <h2 className="text-base font-bold text-foreground">Contract Specifications</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="rounded-xl border border-border/40 bg-secondary/20 p-3.5 space-y-1">
            <span className="text-muted-foreground">Standard</span>
            <p className="font-semibold text-foreground">{token.standard}</p>
          </div>
          <div className="rounded-xl border border-border/40 bg-secondary/20 p-3.5 space-y-1">
            <span className="text-muted-foreground">Deployment Network</span>
            <p className="font-semibold text-foreground">{token.network}</p>
          </div>
          <div className="rounded-xl border border-border/40 bg-secondary/20 p-3.5 space-y-1">
            <span className="text-muted-foreground">Compiler & Framework</span>
            <p className="font-semibold text-foreground">Solidity 0.8.24 / OZ v5</p>
          </div>
          <div className="rounded-xl border border-border/40 bg-secondary/20 p-3.5 space-y-1">
            <span className="text-muted-foreground">Audit Status</span>
            <p className="font-semibold text-emerald-400">Passed (Tier 1)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
