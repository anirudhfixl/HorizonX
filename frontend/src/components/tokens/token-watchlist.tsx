import { TokenBreadcrumb, TokenSectionNav } from "@/components/tokens/token-section-nav";
import React, { useMemo } from "react";
import { AssetIdentity } from "@/components/market/asset-identity";
import { DataTable, type Column } from "@/components/market/data-table";
import { ProvenanceTag } from "@/components/market/provenance-tag";
import { Sparkline } from "@/components/market/sparkline";
import { EmptyState } from "@/components/market/state-views";
import { WatchButton } from "@/components/market/watch-button";
import { sparkValues } from "@/lib/tokens/demo-data";
import { num, pct, usdCompact, usdPrice } from "@/lib/tokens/format";
import { useTokenWatchlist } from "@/lib/tokens/hooks";
import type { TokenWithMarket } from "@/lib/tokens/model";
import { discoveryLists, getToken, TOKEN_CATALOG, trendingScore } from "@/lib/tokens/selectors";
import { useTokens } from "@/api";
import { Link } from "react-router-dom";

/**
 * Followed tokens. The list lives in this browser (see useTokenWatchlist), so it works
 * without a wallet and is shared across Dashboard, Explore, Details and watchlist views.
 */
export function TokenWatchlist({ base = "/tokens" }: { base?: "/tokens" | "/exchange" }) {
  const watch = useTokenWatchlist();
  const { data: apiTokens = [] } = useTokens();

  const allTokens = useMemo<TokenWithMarket[]>(() => {
    if (apiTokens && apiTokens.length > 0) {
      return apiTokens as unknown as TokenWithMarket[];
    }
    return TOKEN_CATALOG;
  }, [apiTokens]);

  const tokenMap = useMemo(() => new Map(allTokens.map((t) => [t.id, t])), [allTokens]);

  const watched = useMemo(
    () => watch.ids.map((id) => tokenMap.get(id) || getToken(id)).filter((t): t is TokenWithMarket => !!t),
    [watch.ids, tokenMap]
  );

  const suggestions = useMemo(() => {
    const list = allTokens.length > 0 ? allTokens : discoveryLists().trending;
    const sorted = [...list].sort((a, b) => trendingScore(b) - trendingScore(a));
    return sorted.filter((t) => !watch.has(t.id)).slice(0, 5);
  }, [allTokens, watch]);

  const ranked = [...watched].sort((a, b) => num(b.market.priceChange24h) - num(a.market.priceChange24h));
  const best = ranked[0];
  const worst = ranked.length > 1 ? ranked[ranked.length - 1] : undefined;

  const isLiveFeed = watched.some((t) => t.market?.isLive || (t as any).isExternal);

  const columns: Column<TokenWithMarket>[] = [
    {
      key: "token",
      header: "Token",
      cell: (t) => (
        <Link to={`/tokens/${t.id}`} className="mx-identity">
          <AssetIdentity
            symbol={t.symbol}
            name={t.name}
            logoUrl={t.logoUrl || (t as any).logo || (t as any).image}
          />
        </Link>
      ),
    },
    { key: "price", header: "Price", align: "end", cell: (t) => usdPrice(t.market.price) },
    { key: "change", header: "24h", align: "end", cell: (t) => <span className={num(t.market.priceChange24h) >= 0 ? "is-up" : "is-down"}>{pct(t.market.priceChange24h)}</span> },
    { key: "cap", header: "Market cap", align: "end", hideBelow: "sm", cell: (t) => usdCompact(t.market.marketCap) },
    { key: "volume", header: "Volume 24h", align: "end", hideBelow: "md", cell: (t) => usdCompact(t.market.volume24h) },
    {
      key: "trend",
      header: "Last 7 days",
      hideBelow: "lg",
      cell: (t) => (
        <span className={num(t.market.priceChange24h) >= 0 ? "is-up" : "is-down"}>
          <Sparkline values={sparkValues(t)} up={num(t.market.priceChange24h) >= 0} />
        </span>
      ),
    },
    {
      key: "actions",
      header: <span className="mx-sr">Actions</span>,
      align: "end",
      cell: (t) => (
        <span className="tk-row-actions">
          {t.status === "active" && <Link to={`/tokens/${t.id}#trade`} className="mx-link hide-md">Trade</Link>}
          <WatchButton name={t.symbol} watched onToggle={() => watch.remove(t.id)} />
        </span>
      ),
    },
  ];

  return (
    <div className="tk-page">
      {base === "/tokens" && <TokenSectionNav />}
      {base === "/tokens" && <TokenBreadcrumb current="Watchlist" />}
      <header className="tk-head">
        <div>
          <h1 className="tk-title">Watchlist</h1>
          <p className="tk-lede">The tokens you follow, with their latest price and movement.</p>
        </div>
        {watched.length > 0 && (
          <dl className="tk-summary" aria-label="Watchlist summary">
            <div><dt>Following</dt><dd>{watched.length}</dd></div>
            {best && (
              <div>
                <dt>Best 24h</dt>
                <dd><Link to={`/tokens/${best.id}`} className="mx-link">{best.symbol}</Link> <span className={num(best.market.priceChange24h) >= 0 ? "is-up" : "is-down"}>{pct(best.market.priceChange24h, 1)}</span></dd>
              </div>
            )}
            {worst && (
              <div>
                <dt>Weakest 24h</dt>
                <dd><Link to={`/tokens/${worst.id}`} className="mx-link">{worst.symbol}</Link> <span className={num(worst.market.priceChange24h) >= 0 ? "is-up" : "is-down"}>{pct(worst.market.priceChange24h, 1)}</span></dd>
              </div>
            )}
          </dl>
        )}
      </header>

      <p className="tk-watch-meta">
        <ProvenanceTag
          kind={isLiveFeed ? "onchain" : "simulated"}
          label={isLiveFeed ? "Live CoinMarketCap feed" : "Simulated market data"}
        />
        <span>
          {isLiveFeed
            ? "Saved in this browser, not tied to a wallet. Followed asset prices reflect real-time market data."
            : "Saved in this browser, not tied to a wallet. Prices are illustrative until a live feed is connected."}
        </span>
      </p>

      <section className="tk-section" style={{ marginTop: "1.5rem" }} aria-label="Followed tokens">
        <DataTable
          caption="Followed tokens"
          columns={columns}
          rows={watched}
          rowKey={(t) => t.id}
          empty={
            <EmptyState
              title="You are not following any tokens yet"
              body="Use the star on any token in Explore or on its page and it will appear here."
              action={<Link to="/tokens/explore" className="mx-btn mx-btn--primary">Explore tokens</Link>}
            />
          }
        />
      </section>

      {suggestions.length > 0 && (
        <section className="tk-section tk-suggest" aria-labelledby="suggest-h">
          <header className="tk-section__head">
            <h2 id="suggest-h">{watched.length ? "More to follow" : "Trending to start with"}</h2>
            <Link to="/tokens/explore?view=trending" className="mx-link">See trending</Link>
          </header>
          <ul className="tk-list">
            {suggestions.map((t) => (
              <li key={t.id}>
                <Link to={`/tokens/${t.id}`} className="mx-identity">
                  <AssetIdentity
                    symbol={t.symbol}
                    name={t.name}
                    logoUrl={t.logoUrl || (t as any).logo || (t as any).image}
                    size="sm"
                  />
                </Link>
                <span className="tk-list__fig">
                  <b>{usdPrice(t.market.price)}</b>
                  <small className={num(t.market.priceChange24h) >= 0 ? "is-up" : "is-down"}>{pct(t.market.priceChange24h)}</small>
                </span>
                <WatchButton name={t.symbol} watched={false} onToggle={() => watch.toggle(t.id)} />
              </li>
            ))}
          </ul>
        </section>
      )}
      {base === "/exchange" && (
        <p className="tk-note">
          Looking for markets? <Link to="/tokens/explore" className="mx-link">Browse all tokens</Link>.
        </p>
      )}
    </div>
  );
}
