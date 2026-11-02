import { TokenDashboard } from "@/components/tokens/token-dashboard";
import { PageMeta } from "@/components/seo/page-meta";

/**
 * Tokens Dashboard (/tokens): the personal workspace.
 *
 * Holdings (simulated), created tokens, watchlist and recent activity for the connected
 * wallet, plus a market snapshot. Browsing and comparing every token lives at
 * /tokens/explore, and each token has its own page at /tokens/[id].
 *
 * Catalog helper functions that used to be exported from this file now live in
 * lib/tokens/dashboard-metrics.ts (a Next.js page may only export its component and config).
 */
export default function TokensDashboardPage() {
  return (
    <>
      <PageMeta title="Tokens" description="Your token holdings, the tokens you created and the ones you follow on HorizonX." />
      <TokenDashboard />
    </>
  );
}
