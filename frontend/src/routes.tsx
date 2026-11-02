import type { ComponentType } from "react";
import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { AppShell } from "@/components/layout/app-shell";
import RouteError from "@/pages/error/page";
import NotFoundPage from "@/pages/not-found/page";

type PageModule = { default: ComponentType };

/** Code-split a page: the module is only fetched when its route is first visited. */
const page = (load: () => Promise<PageModule>): Pick<RouteObject, "lazy"> => ({
  lazy: async () => ({ Component: (await load()).default }),
});

function HydrateFallback() {
  return <div className="p-8 text-center text-xs text-muted-foreground">Loading...</div>;
}

export const routes: RouteObject[] = [
  {
    element: <AppShell />,
    errorElement: <RouteError />,
    HydrateFallback,
    children: [
      {
        // Pathless boundary: render errors show inside the shell, so navigation stays usable.
        errorElement: <RouteError />,
        children: [
          { index: true, ...page(() => import("@/pages/home/page")) },
          { path: "account", ...page(() => import("@/pages/account/page")) },
          { path: "account/edit", ...page(() => import("@/pages/account/edit/page")) },
          { path: "account/preferences", ...page(() => import("@/pages/account/preferences/page")) },
          { path: "account/security", ...page(() => import("@/pages/account/security/page")) },
          { path: "account/verification", ...page(() => import("@/pages/account/verification/page")) },
          { path: "account/wallets", ...page(() => import("@/pages/account/wallets/page")) },
          { path: "airdrops", ...page(() => import("@/pages/airdrops/page")) },
          { path: "airdrops/campaigns", ...page(() => import("@/pages/airdrops/campaigns/page")) },
          { path: "airdrops/campaigns/:id", ...page(() => import("@/pages/airdrops/campaigns/_id/page")) },
          { path: "airdrops/campaigns/create", ...page(() => import("@/pages/airdrops/campaigns/create/page")) },
          { path: "airdrops/claim", ...page(() => import("@/pages/airdrops/claim/page")) },
          { path: "airdrops/my", ...page(() => import("@/pages/airdrops/my/page")) },
          { path: "docs", ...page(() => import("@/pages/docs/page")) },
          { path: "docs/:slug", ...page(() => import("@/pages/docs/_slug/page")) },
          { path: "exchange", ...page(() => import("@/pages/exchange/page")) },
          { path: "exchange/markets", ...page(() => import("@/pages/exchange/markets/page")) },
          { path: "exchange/tokens/:id", ...page(() => import("@/pages/exchange/tokens/_id/page")) },
          { path: "exchange/watchlist", ...page(() => import("@/pages/exchange/watchlist/page")) },
          { path: "explore", ...page(() => import("@/pages/explore/page")) },
          { path: "explore/airdrops", ...page(() => import("@/pages/explore/airdrops/page")) },
          { path: "explore/launches", ...page(() => import("@/pages/explore/launches/page")) },
          { path: "explore/presales", ...page(() => import("@/pages/explore/presales/page")) },
          { path: "explore/projects", ...page(() => import("@/pages/explore/projects/page")) },
          { path: "explore/staking", ...page(() => import("@/pages/explore/staking/page")) },
          { path: "explore/tokens", ...page(() => import("@/pages/explore/tokens/page")) },
          { path: "launchpad", ...page(() => import("@/pages/launchpad/page")) },
          { path: "launchpad/launches", ...page(() => import("@/pages/launchpad/launches/page")) },
          { path: "launchpad/launches/:id", ...page(() => import("@/pages/launchpad/launches/_id/page")) },
          { path: "launchpad/launches/create", ...page(() => import("@/pages/launchpad/launches/create/page")) },
          { path: "launchpad/my", ...page(() => import("@/pages/launchpad/my/page")) },
          { path: "launchpad/presales", ...page(() => import("@/pages/launchpad/presales/page")) },
          { path: "launchpad/presales/:id", ...page(() => import("@/pages/launchpad/presales/_id/page")) },
          { path: "launchpad/presales/create", ...page(() => import("@/pages/launchpad/presales/create/page")) },
          { path: "partners", ...page(() => import("@/pages/partners/page")) },
          { path: "partners/referrals", ...page(() => import("@/pages/partners/referrals/page")) },
          { path: "projects", ...page(() => import("@/pages/projects/page")) },
          { path: "projects/:id", ...page(() => import("@/pages/projects/_id/page")) },
          { path: "projects/my", ...page(() => import("@/pages/projects/my/page")) },
          { path: "staking", ...page(() => import("@/pages/staking/page")) },
          { path: "staking/my", ...page(() => import("@/pages/staking/my/page")) },
          { path: "staking/pools", ...page(() => import("@/pages/staking/pools/page")) },
          { path: "staking/pools/:id", ...page(() => import("@/pages/staking/pools/_id/page")) },
          { path: "staking/pools/create", ...page(() => import("@/pages/staking/pools/create/page")) },
          { path: "tokens", ...page(() => import("@/pages/tokens/page")) },
          { path: "tokens/:id", ...page(() => import("@/pages/tokens/_id/page")) },
          { path: "tokens/:id/activity", ...page(() => import("@/pages/tokens/_id/activity/page")) },
          { path: "tokens/:id/contract", ...page(() => import("@/pages/tokens/_id/contract/page")) },
          { path: "tokens/create", ...page(() => import("@/pages/tokens/create/page")) },
          { path: "tokens/explore", ...page(() => import("@/pages/tokens/explore/page")) },
          { path: "tokens/my", ...page(() => import("@/pages/tokens/my/page")) },
          { path: "tokens/watchlist", ...page(() => import("@/pages/tokens/watchlist/page")) },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
