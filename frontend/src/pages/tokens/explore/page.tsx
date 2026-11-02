import { TokenExplore } from "@/components/tokens/token-explore";
import { PageMeta } from "@/components/seo/page-meta";

/**
 * Token marketplace (/tokens/explore): discovery, ranking, filtering and comparison.
 * Filters are mirrored into the query string, so any view can be shared as a link.
 */
export default function ExploreTokensPage() {
  return (
    <>
      <PageMeta title="Explore tokens" description="Compare every token on HorizonX by price, volume and liquidity. Market figures are simulated." />
      <TokenExplore />
    </>
  );
}
