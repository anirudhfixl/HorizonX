import { TokenWatchlist } from "@/components/tokens/token-watchlist";
import { PageMeta } from "@/components/seo/page-meta";

export default function TokenWatchlistPage() {
  return (
    <>
      <PageMeta title="Token watchlist" description="The tokens you follow on HorizonX. Saved in this browser." />
      <TokenWatchlist />
    </>
  );
}
