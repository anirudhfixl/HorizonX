import { TokenWatchlist } from "@/components/tokens/token-watchlist";

/**
 * Markets watchlist (/exchange/watchlist). Shows the same followed-token list as
 * /tokens/watchlist, so a token starred anywhere appears everywhere.
 */
export default function WatchlistPage() {
  return <TokenWatchlist base="/exchange" />;
}
