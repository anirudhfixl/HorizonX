import "@/components/shared/entity-detail.css";
import NotFoundPage from "@/pages/not-found/page";
import React from "react";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useToken, useProject } from "@/api";
import { ArrowDownUp, ExternalLink, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { MarketWorkspaceHeader } from "@/components/market/market-section-nav";

export default function TokenExchangePage() {
  const { id = "" } = useParams<{ id: string }>();
  const { data: token, isLoading: tokenLoading } = useToken(id);
  const { data: project } = useProject(token?.projectId);

  if (!token) {
    if (tokenLoading) {
      return (
        <main className="entity-detail-page w-full max-w-none space-y-7 px-4 py-6 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="py-20 text-center text-sm text-muted-foreground">Loading market details...</div>
        </main>
      );
    }
    return <NotFoundPage />;
  }

  const change = token.market?.priceChange24h || 0;
  const positive = change >= 0;
  const mark = token.symbol.slice(0, 4).toUpperCase();

  return (
    <main className="entity-detail-page w-full max-w-none space-y-7 px-4 py-6 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <MarketWorkspaceHeader items={[{ label: "Markets", to: "/exchange" }, { label: "All markets", to: "/exchange/markets" }, { label: token.symbol }]} />

      <header className="entity-detail-header entity-detail-market-header">
        <div className="entity-detail-identity">
          <div aria-hidden="true" className="entity-detail-mark">{mark}</div>
          <div className="min-w-0 flex-1">
            <div className="entity-detail-badges">
              <span className="entity-detail-type">Market asset</span>
              <StatusBadge status={token.status} />
              <span className="entity-detail-meta-pill">{token.network}</span>
              {token.standard && <span className="entity-detail-meta-pill">{token.standard}</span>}
            </div>
            <h1>{token.name} <span className="entity-detail-symbol">{token.symbol}</span></h1>
            <p className="entity-detail-description">{token.description || `Market overview and exchange interface for ${token.symbol} on ${token.network}.`}</p>
            <div className="entity-detail-relations">
              {project && <span>Project <Link to={`/projects/${project.id}`}>{project.name}</Link></span>}
              {token.contractAddress && <span>Contract <code title={token.contractAddress}>{token.contractAddress}</code></span>}
            </div>
          </div>
        </div>
        <div className="entity-detail-market-price">
          <span>Market price</span>
          <strong>${token.market?.price ?? "—"}</strong>
          <em className={positive ? "is-positive" : "is-negative"}>{positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}{positive ? "+" : ""}{change}% <small>24h</small></em>
        </div>
      </header>

      <div className="entity-detail-toolbar">
        <div className="entity-detail-toolbar-links">
          <Link to={`/tokens/${token.id}`}>Token overview <ExternalLink className="h-3 w-3" /></Link>
          {project && <Link to={`/projects/${project.id}`}>View project <ExternalLink className="h-3 w-3" /></Link>}
        </div>
        <span className="entity-detail-data-note"><span aria-hidden="true" />{token.market?.isLive ? "Live market data" : "Simulated market data"}</span>
      </div>

      <div className="grid grid-cols-1 gap-x-10 gap-y-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="entity-detail-section min-w-0 space-y-5">
          <div className="entity-detail-section-heading"><div><span className="entity-detail-eyebrow">Market activity</span><h2>Price performance</h2></div><span className="text-xs text-muted-foreground">{token.market?.lastUpdated ? `Updated ${token.market.lastUpdated}` : "Market feed status shown above"}</span></div>
          <div className="entity-detail-market-summary">
            <div><span>24h change</span><strong className={positive ? "is-positive" : "is-negative"}>{positive ? "+" : ""}{change}%</strong></div>
            <div><span>24h volume</span><strong>{token.market?.volume24h ? `$${token.market.volume24h.toLocaleString()}` : "—"}</strong></div>
            <div><span>Liquidity</span><strong>{token.market?.liquidity ? `$${token.market.liquidity.toLocaleString()}` : "—"}</strong></div>
            <div><span>Market cap</span><strong>{token.market?.marketCap ? `$${token.market.marketCap.toLocaleString()}` : "—"}</strong></div>
          </div>
          <div className="entity-detail-chart-placeholder"><BarChart3 className="h-5 w-5" /><span>TradingView market chart</span><small>Phase 1 mock · pending D-08 data provider</small></div>
        </section>

        <aside className="entity-detail-aside">
          <section className="entity-detail-aside-panel space-y-5">
            <div><span className="entity-detail-eyebrow">Trade</span><h2>Instant swap</h2><p className="mt-1 text-xs text-muted-foreground">Exchange ETH for {token.symbol}.</p></div>
            <div className="space-y-3">
              <div className="entity-detail-swap-field"><label htmlFor="swap-pay">You pay</label><div><input id="swap-pay" type="number" placeholder="0.0" /><span>ETH</span></div></div>
              <div className="flex justify-center -my-1"><button type="button" aria-label="Switch swap direction" className="entity-detail-swap-switch"><ArrowDownUp className="h-3.5 w-3.5" /></button></div>
              <div className="entity-detail-swap-field"><label htmlFor="swap-receive">You receive</label><div><input id="swap-receive" type="number" placeholder="0.0" /><span>{token.symbol}</span></div></div>
            </div>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Swap {token.symbol}</Button>
            <p className="border-t border-border/50 pt-3 text-[11px] leading-relaxed text-muted-foreground">Review the network, token contract and quoted exchange rate before approving any transaction. Swap execution is not connected in this demo.</p>
          </section>
        </aside>
      </div>
    </main>
  );
}
