import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { MOCK_TOKENS } from "@/lib/mock-data";
import { Coins, Plus, Sparkles, Shield, ArrowRight } from "lucide-react";

export default function TokensDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Token Dashboard"
        description="Launch customizable smart contracts, inspect verified tokenomics, and manage your deployed digital assets."
        breadcrumbs={[{ label: "Tokens" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="text-xs border-border/60">
              <Link href="/tokens/my">My Tokens</Link>
            </Button>
            <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs gap-1.5 font-semibold">
              <Link href="/tokens/create">
                <Plus className="h-3.5 w-3.5" /> Create Token
              </Link>
            </Button>
          </div>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title="Tokens Deployed"
          value="182"
          change="+12 this week"
          trend="up"
          subtitle="Across 6 EVM networks"
          icon={<Coins className="h-4 w-4" />}
        />
        <MetricCard
          title="Combined Market Cap"
          value="$318,400,000"
          change="+6.2%"
          trend="up"
          subtitle="All indexed token contracts"
          icon={<Sparkles className="h-4 w-4" />}
        />
        <MetricCard
          title="Audited Contracts"
          value="94.5%"
          change="OpenZeppelin v5"
          trend="neutral"
          subtitle="Standard compliance verified"
          icon={<Shield className="h-4 w-4" />}
        />
      </div>

      {/* Token List Table */}
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur-md">
        <div className="p-4 border-b border-border/40 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">All Indexed Tokens</h2>
          <span className="text-xs text-muted-foreground">{MOCK_TOKENS.length} tokens active</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/50 bg-secondary/30 text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Token</th>
                <th className="px-4 py-3">Network</th>
                <th className="px-4 py-3">Standard</th>
                <th className="px-4 py-3">Total Supply</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">24h Change</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {MOCK_TOKENS.map((token) => (
                <tr key={token.id} className="hover:bg-secondary/40 transition-colors">
                  <td className="px-4 py-3.5 font-medium">
                    <Link href={`/tokens/${token.id}`} className="flex items-center gap-2.5 hover:text-primary transition-colors">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary font-bold text-foreground">
                        {token.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{token.name}</div>
                        <span className="font-mono text-[10px] text-muted-foreground">{token.symbol}</span>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">{token.network}</td>
                  <td className="px-4 py-3.5">
                    <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono">{token.standard}</span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-muted-foreground">{token.totalSupply}</td>
                  <td className="px-4 py-3.5 font-mono font-semibold text-foreground">${token.market.price}</td>
                  <td className="px-4 py-3.5">
                    <span className={`font-mono text-[11px] font-semibold ${(token.market.priceChange24h || 0) >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {(token.market.priceChange24h || 0) >= 0 ? "+" : ""}{token.market.priceChange24h}%
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Button asChild size="sm" variant="outline" className="h-7 text-xs border-border/60">
                      <Link href={`/tokens/${token.id}`}>View</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
