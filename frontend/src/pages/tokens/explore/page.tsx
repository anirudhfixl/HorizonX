import { TokenExplore } from "@/components/tokens/token-explore";
import { PageMeta } from "@/components/seo/page-meta";

/**
 * Token marketplace (/tokens/explore): discovery, ranking, filtering and comparison.
 * Filters are mirrored into the query string, so any view can be shared as a link.
 */
export default function ExploreTokensPage() {
  return (
    <>
      <PageMeta title="Explore tokens" description="Compare cryptocurrencies and HorizonX ecosystem tokens by live market cap, volume, and performance." />
      <TokenExplore />
    </>
  );
}
