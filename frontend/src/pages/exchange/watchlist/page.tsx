import { TokenWatchlist } from "@/components/tokens/token-watchlist";
import { MarketWorkspaceHeader } from "@/components/market/market-section-nav";

export default function WatchlistPage() {
  return (
    <main className="mk-page-shell">
      <MarketWorkspaceHeader items={[{ label: "Markets", to: "/exchange" }, { label: "Watchlist" }]} />
      <TokenWatchlist base="/exchange" />
    </main>
  );
}
