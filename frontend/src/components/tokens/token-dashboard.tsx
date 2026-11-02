import { TokenBreadcrumb, TokenSectionNav } from "@/components/tokens/token-section-nav";
import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import { AssetIdentity } from "@/components/market/asset-identity";
import { DataTable, type Column } from "@/components/market/data-table";
import { DefinitionList } from "@/components/market/definition-list";
import { PriceChart } from "@/components/market/price-chart";
import { ProvenanceTag } from "@/components/market/provenance-tag";
import { EmptyState } from "@/components/market/state-views";
import { TabBar } from "@/components/market/tab-bar";
import { TrendingRail, type RailItem } from "@/components/market/trending-rail";
import { useModal } from "@/contexts/modal-context";
import { useWallet } from "@/contexts/wallet-context";
import { sparkValues } from "@/lib/tokens/demo-data";
import { compactNumber, formatDate, num, pct, shortAddress, usdCompact, usdPrice } from "@/lib/tokens/format";
import { useSessionReceipts, useTokenWatchlist } from "@/lib/tokens/hooks";
import type { HoldingRow, SessionReceipt, TokenWithMarket } from "@/lib/tokens/model";
import {
  createdBy,
  discoveryLists,
  getToken,
  holdingRows,
  holdingsFor,
  portfolioOf,
  portfolioSeries,
  sessionCreatedBy,
  summarizeMarket,
  workspaceActivity,
} from "@/lib/tokens/selectors";
import { Link } from "react-router-dom";

type CreatedRow = { key: string; kind: "catalog"; token: TokenWithMarket } | { key: string; kind: "session"; receipt: SessionReceipt };

const signedUsd = (v: number) => `${v >= 0 ? "+" : "−"}${usdCompact(Math.abs(v))}`;

function Status({ status }: { status: string }) {
  const live = status === "active";
  return (
    <span className="tk-status">
      <span className={`mx-dot mx-dot--${live ? "live" : "upcoming"}`} aria-hidden="true" />
      {status === "active" ? "Active" : status === "pending" ? "Pending" : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function TokenDashboard() {
  const { isConnected, isConnecting, address, shortAddress: short, connectDemo } = useWallet();
  const { openModal } = useModal();
  const watch = useTokenWatchlist();
  const receipts = useSessionReceipts();
  const [tab, setTab] = useState<"holdings" | "created">("holdings");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const ws = useMemo(() => {
    const addr = isConnected ? address : null;
    const created = createdBy(addr);
    const session = sessionCreatedBy(addr, receipts);
    const rows = holdingRows(holdingsFor(addr));
    return {
      created,
      session,
      rows,
      portfolio: portfolioOf(rows),
      series: portfolioSeries(rows),
      activity: workspaceActivity(created, session, rows),
    };
  }, [isConnected, address, receipts]);

  const market = useMemo(() => summarizeMarket(), []);
  const rail: RailItem[] = useMemo(
    () =>
      discoveryLists().trending.slice(0, 8).map((t) => ({
        id: t.id,
        href: `/tokens/${t.id}`,
        symbol: t.symbol,
        name: t.name,
        logoUrl: t.logoUrl,
        value: usdPrice(t.market.price),
        change: num(t.market.priceChange24h),
        changeLabel: pct(t.market.priceChange24h),
        series: sparkValues(t),
        meta: t.network,
      })),
    [],
  );

  const createdRows: CreatedRow[] = [
    ...ws.created.map((token) => ({ key: token.id, kind: "catalog" as const, token })),
    ...ws.session.map((receipt) => ({ key: receipt.transactionHash, kind: "session" as const, receipt })),
  ];
  const createdCount = createdRows.length;
  const watched = watch.ids.map(getToken).filter((t): t is TokenWithMarket => !!t);
  const activeTab = tab === "holdings" && !ws.rows.length && createdCount ? "created" : tab;
  const activeRows = activeTab === "holdings" ? ws.rows : createdRows;
  const totalPages = Math.max(1, Math.ceil(activeRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedRows = activeRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  const holdingCols: Column<HoldingRow>[] = [
    { key: "token", header: "Token", cell: (r) => <Link to={`/tokens/${r.token.id}`} className="mx-identity"><AssetIdentity symbol={r.token.symbol} name={r.token.name} logoUrl={r.token.logoUrl} meta={<span className="tk-narrow">{r.token.network}</span>} /></Link> },
    { key: "network", header: "Network", hideBelow: "md", cell: (r) => <span className="mx-muted">{r.token.network}</span> },
    { key: "balance", header: "Balance", align: "end", cell: (r) => compactNumber(r.balance) },
    { key: "price", header: "Price", align: "end", hideBelow: "sm", cell: (r) => usdPrice(r.token.market.price) },
    { key: "change", header: "24h", align: "end", hideBelow: "sm", cell: (r) => <span className={num(r.token.market.priceChange24h) >= 0 ? "is-up" : "is-down"}>{pct(r.token.market.priceChange24h)}</span> },
    { key: "value", header: "Value", align: "end", cell: (r) => <b>{usdCompact(r.value)}</b> },
    { key: "act", header: <span className="mx-sr">Actions</span>, align: "end", cell: (r) => <span className="tk-row-actions"><Link to={`/tokens/${r.token.id}`} className="mx-link">View</Link></span> },
  ];

  const createdCols: Column<CreatedRow>[] = [
    {
      key: "token",
      header: "Token",
      cell: (r) => {
        const sym = r.kind === "catalog" ? r.token.symbol : r.receipt.symbol;
        const name = r.kind === "catalog" ? r.token.name : r.receipt.name;
        const logo = r.kind === "catalog" ? r.token.logoUrl : undefined;
        const id = <AssetIdentity symbol={sym} name={name} logoUrl={logo} />;
        return r.kind === "catalog" ? <Link to={`/tokens/${r.token.id}`} className="mx-identity">{id}</Link> : id;
      },
    },
    { key: "network", header: "Network", hideBelow: "sm", cell: (r) => <span className="mx-muted">{r.kind === "catalog" ? r.token.network : r.receipt.network}</span> },
    { key: "supply", header: "Supply", align: "end", hideBelow: "md", cell: (r) => (r.kind === "catalog" ? r.token.totalSupply : r.receipt.totalSupply) ?? "—" },
    {
      key: "status",
      header: "Deployment",
      cell: (r) => (r.kind === "catalog" ? <Status status={r.token.status} /> : <ProvenanceTag kind="session" label="Session simulation" />),
    },
    { key: "date", header: "Created", hideBelow: "md", cell: (r) => <span className="mx-muted">{formatDate(r.kind === "catalog" ? r.token.createdAt : r.receipt.deployedAt)}</span> },
    {
      key: "act",
      header: <span className="mx-sr">Actions</span>,
      align: "end",
      cell: (r) => (
        <span className="tk-row-actions">
          {r.kind === "catalog" && <Link to={`/tokens/${r.token.id}`} className="mx-link hide-sm">View</Link>}
          <Link to="/tokens/my" className="mx-link">Manage</Link>
        </span>
      ),
    },
  ];

  const hasHoldings = ws.rows.length > 0;
  const p = ws.portfolio;

  return (
    <div className="tk-page">
      <TokenSectionNav />
      <TokenBreadcrumb current="Dashboard" />

      <header className="tk-head tk-head--dash">
        <div>
          <h1 className="tk-title">Tokens</h1>
          <p className="tk-lede">Your holdings, the tokens you created and the ones you follow.</p>
        </div>
        {isConnected && (
          <p className="tk-wallet" title={address ?? undefined}>
            <span className="mx-mono">{short ?? shortAddress(address)}</span>
          </p>
        )}
      </header>

      {/* Portfolio */}
      <section className="tk-portfolio" aria-label="Portfolio">
        {isConnected && hasHoldings ? (
          <>
            <div className="tk-portfolio__main">
              <p className="tk-portfolio__label">
                Portfolio value <ProvenanceTag kind="simulated" label="Simulated balances" />
              </p>
              <p className="tk-portfolio__value">{usdCompact(p.value)}</p>
              <p className={`tk-portfolio__change ${p.change24hValue >= 0 ? "is-up" : "is-down"}`}>
                {signedUsd(p.change24hValue)} ({pct(p.change24hPct)}) <span className="mx-muted">past 24 hours</span>
              </p>
              <PriceChart
                points={ws.series}
                height={170}
                showVolume={false}
                ariaLabel="Portfolio value over the past 30 days"
                formatValue={(v) => usdCompact(v)}
                formatTime={(t) => formatDate(t)}
              />
            </div>
            <DefinitionList
              className="tk-portfolio__facts"
              items={[
                { label: "Tokens held", value: ws.rows.length },
                { label: "Tokens created", value: createdCount },
                { label: "Following", value: watched.length },
                { label: "Best today", value: p.best ? <Link to={`/tokens/${p.best.id}`} className="mx-link">{p.best.symbol} {pct(p.best.market.priceChange24h, 1)}</Link> : "—" },
              ]}
            />
          </>
        ) : isConnected ? (
          <div className="tk-portfolio__empty">
            <p className="tk-portfolio__label">Portfolio value</p>
            <p className="tk-portfolio__value tk-portfolio__value--muted">—</p>
            <p className="tk-note">
              HorizonX does not read token balances from the blockchain yet, so holdings are not shown for this wallet.
              {createdCount ? " Tokens you created appear below." : " Tokens you create will appear below."}
            </p>
            <DefinitionList items={[{ label: "Tokens created", value: createdCount }, { label: "Following", value: watched.length }]} />
          </div>
        ) : (
          <EmptyState
            title={isConnecting ? "Connecting your wallet" : "Connect a wallet to see your tokens"}
            body="Your holdings and the tokens you created are tied to your wallet address. Your watchlist is saved in this browser and works without one."
            action={
              <>
                <button type="button" className="mx-btn mx-btn--primary" onClick={() => openModal("CONNECT_WALLET")}>Connect wallet</button>
                <button type="button" className="mx-btn" onClick={connectDemo}>Use the demo wallet</button>
              </>
            }
          />
        )}
      </section>

      <div className="tk-grid">
        <section className="tk-main" aria-label="My tokens">
          <TabBar
            idPrefix="mytokens"
            label="My tokens"
            active={activeTab}
            onChange={(id) => { setTab(id as "holdings" | "created"); setPage(1); }}
            tabs={[
              { id: "holdings", label: "Holdings", count: ws.rows.length },
              { id: "created", label: "Created", count: createdCount },
            ]}
          />
          <div role="tabpanel" id={`mytokens-panel-${activeTab}`} aria-labelledby={`mytokens-tab-${activeTab}`}>
            {activeTab === "holdings" ? (
              <DataTable
                caption="Tokens you hold"
                columns={holdingCols}
                rows={pagedRows as HoldingRow[]}
                rowKey={(r) => r.tokenId}
                empty={
                  <EmptyState
                    title="No holdings to show"
                    body={isConnected ? "Balances appear here once HorizonX can read them for your wallet." : "Connect a wallet to see the tokens it holds."}
                    action={<Link to="/tokens/explore" className="mx-btn">Explore tokens</Link>}
                  />
                }
              />
            ) : (
              <DataTable
                caption="Tokens you created"
                columns={createdCols}
                rows={pagedRows as CreatedRow[]}
                rowKey={(r) => r.key}
                empty={
                  <EmptyState
                    title="You have not created a token yet"
                    body="Deploy your first token in a few steps. You can add a presale, airdrop or staking pool afterwards."
                    action={<Link to="/tokens/create" className="mx-btn mx-btn--primary">Create a token</Link>}
                  />
                }
              />
            )}
          </div>
          {activeRows.length > 0 && (
            <nav className="tk-pagination" aria-label={`${activeTab === "holdings" ? "Holdings" : "Created tokens"} pagination`}>
              <span className="tk-pagination__meta">Page {safePage} / {totalPages} · Showing {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, activeRows.length)} of {activeRows.length}</span>
              <div className="tk-pagination__controls">
                <button type="button" className="tk-page-btn" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={safePage <= 1}>Previous</button>
                <button type="button" className="tk-page-btn" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={safePage >= totalPages}>Next</button>
              </div>
            </nav>
          )}
          <section id="watchlist" className="tk-block tk-watchlist-under-table" aria-labelledby="watch-h">
            <header className="tk-section__head">
              <h2 id="watch-h">Watchlist</h2>
              <span className="mx-muted tk-count">{watched.length}</span>
              <Link to="/tokens/watchlist" className="mx-link">View all</Link>
            </header>
            {watched.length ? (
              <ul className="tk-list">
                {watched.map((t) => (
                  <li key={t.id}>
                    <Link to={`/tokens/${t.id}`} className="mx-identity"><AssetIdentity symbol={t.symbol} name={t.name} logoUrl={t.logoUrl} size="sm" /></Link>
                    <span className="tk-list__fig">
                      <b>{usdPrice(t.market.price)}</b>
                      <small className={num(t.market.priceChange24h) >= 0 ? "is-up" : "is-down"}>{pct(t.market.priceChange24h)}</small>
                    </span>
                    <button type="button" className="mx-icon-btn" onClick={() => watch.remove(t.id)} aria-label={`Remove ${t.symbol} from watchlist`} title="Remove from watchlist">
                      <X />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="Nothing on your watchlist" body="Star a token in Explore and it will show up here with its price." action={<Link to="/tokens/explore" className="mx-btn">Find tokens</Link>} />
            )}
          </section>
        </section>

        <aside className="tk-side">
          <section className="tk-block" aria-labelledby="act-h">
            <header className="tk-section__head">
              <h2 id="act-h">Recent activity</h2>
            </header>
            {ws.activity.length ? (
              <ol className="tk-activity">
                {ws.activity.map((a) => (
                  <li key={a.id}>
                    <p>
                      {a.href ? <Link to={a.href} className="tk-activity__link">{a.text}</Link> : a.text}
                    </p>
                    <small>{a.detail}</small>
                    <small className="tk-activity__when">
                      {formatDate(a.time)} <ProvenanceTag kind={a.provenance} />
                    </small>
                  </li>
                ))}
              </ol>
            ) : (
              <EmptyState title="No activity yet" body={isConnected ? "Creating, deploying or receiving a token will be listed here." : "Connect a wallet to see activity for your tokens."} />
            )}
          </section>
        </aside>
      </div>

      <section className="tk-section" aria-labelledby="mkt-h">
        <header className="tk-section__head">
          <h2 id="mkt-h">Market today</h2>
          <span className="tk-inline-stats">
            <span>{usdCompact(market.marketCap)} market cap</span>
            <span className={market.weightedChange >= 0 ? "is-up" : "is-down"}>{pct(market.weightedChange)} weighted 24h</span>
            <ProvenanceTag kind="simulated" />
          </span>
          <Link to="/tokens/explore" className="mx-link">Explore all tokens</Link>
        </header>
        <TrendingRail items={rail} label="Trending tokens" />
      </section>
    </div>
  );
}
