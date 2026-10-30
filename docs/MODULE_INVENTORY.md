# MODULE_INVENTORY.md

> **Baseline version:** 1.0 | **Architecture decisions:** 1.1 | **Last updated:** 2026-10-30  
> **Status key:** NOT STARTED | SHELL | IN PROGRESS | COMPLETE | BLOCKED

---

## Reconciliation note (Milestone 0 → Milestone 1-A)

The Milestone 0 discovery report identified 54 candidate routes. After cross-referencing against the master baseline (Section 4, 5 and Table 4), the following reconciled inventory is used. Adjustments:

- Merged `/explore/*` sub-routes under the Explore module rather than treating each as an independent top-level module.
- Removed duplicate management routes that were represented both as `/tokens/:id/manage` and inside `/tokens/my`.
- Separated `Exchange/Markets` from `Explore` — they are distinct modules per baseline Table 4.
- `/account/verification` (KYC) is BLOCKED pending D-09.
- `/exchange` trading sub-routes are PENDING D-07.
- Partners portal is PENDING D-11 for permission model.

---

## Module 1 — Home

| Route | View | Auth | Phase | Status |
|---|---|---|---|---|
| `/` | Home / Ecosystem Dashboard | Public | 1 | SHELL |

**Required views:** Overview stats, recent activity feed, featured projects, quick-action shortcuts, network status banner.  
**Mock data file:** `src/services/mocks/home.mock.ts`

---

## Module 2 — Explore

| Route | View | Auth | Phase | Status |
|---|---|---|---|---|
| `/explore` | Discovery Hub landing | Public | 2 | COMPLETE |
| `/explore/tokens` | Token explorer (cross-module) | Public | 2 | COMPLETE |
| `/explore/projects` | Project directory | Public | 2 | COMPLETE |
| `/explore/presales` | Presales discovery | Public | 2 | COMPLETE |
| `/explore/launches` | Fair launches discovery | Public | 2 | COMPLETE |
| `/explore/airdrops` | Airdrop discovery | Public | 2 | COMPLETE |
| `/explore/staking` | Staking pool discovery | Public | 2 | COMPLETE |

**Note:** Explore is a discovery hub. Each sub-route links to the canonical detail route in its owning module. Search, filters, sort, pagination and empty/loading/error states required.

---

## Module 3 — Tokens

| Route | View | Auth | Phase | Status |
|---|---|---|---|---|
| `/tokens` | Token dashboard | Public | 3 | COMPLETE |
| `/tokens/explore` | Token explorer (canonical listing) | Public | 3 | COMPLETE |
| `/tokens/my` | My Tokens | Wallet-gated | 3 | SHELL |
| `/tokens/create` | Create Token wizard | Wallet-gated | 3 | SHELL |
| `/tokens/[id]` | Token detail hub | Public | 3 | COMPLETE |
| `/tokens/[id]/contract` | Contract & source tab (integrated in hub) | Public | 3 | COMPLETE |
| `/tokens/[id]/activity` | Token activity & holders tab (integrated in hub) | Public | 3 | COMPLETE |

**Standard page pattern:** Dashboard → Listing → Detail → Create/Edit → Management → History  
**Mock data file:** `src/services/mocks/tokens.mock.ts`  
**PENDING:** Token standards (D-05), network (D-04), market data source (D-08)

---

## Module 4 — Launchpad

| Route | View | Auth | Phase | Status |
|---|---|---|---|---|
| `/launchpad` | Launchpad dashboard | Public | 4 | SHELL |
| `/launchpad/presales` | All presales listing | Public | 4 | COMPLETE |
| `/launchpad/presales/create` | Create Presale wizard | Wallet-gated | 4 | SHELL |
| `/launchpad/presales/[id]` | Presale detail | Public | 4 | SHELL |
| `/launchpad/presales/[id]/manage` | Presale management (owner) | Owner | 4 | SHELL |
| `/launchpad/launches` | All fair launches listing | Public | 4 | COMPLETE |
| `/launchpad/launches/create` | Create Fair Launch wizard | Wallet-gated | 4 | SHELL |
| `/launchpad/launches/[id]` | Fair Launch detail | Public | 4 | SHELL |
| `/launchpad/launches/[id]/manage` | Fair Launch management (owner) | Owner | 4 | SHELL |

**Presale states:** Draft → Scheduled → Live → Ended → Finalized / Cancelled / Failed  
**Mock data file:** `src/services/mocks/launchpad.mock.ts`  
**PENDING:** Presale contract design (D-05), network (D-04)

---

## Module 5 — Airdrops

| Route | View | Auth | Phase | Status |
|---|---|---|---|---|
| `/airdrops` | Airdrop dashboard / hub | Public | 5 | SHELL |
| `/airdrops/campaigns` | All campaigns listing | Public | 5 | COMPLETE |
| `/airdrops/campaigns/create` | Create Airdrop Campaign wizard | Wallet-gated | 5 | SHELL |
| `/airdrops/campaigns/[id]` | Campaign detail | Public | 5 | SHELL |
| `/airdrops/campaigns/[id]/manage` | Campaign management (owner) | Owner | 5 | SHELL |
| `/airdrops/my` | My campaigns | Wallet-gated | 5 | SHELL |
| `/airdrops/claim` | Claim airdrop | Wallet-gated | 5 | SHELL |

**Campaign types:** Batch, Lottery, Referral, Quest, Governance, Recurring, Merkle distribution, Legacy  
**Mock data file:** `src/services/mocks/airdrops.mock.ts`

---

## Module 6 — Staking

| Route | View | Auth | Phase | Status |
|---|---|---|---|---|
| `/staking` | Staking dashboard | Public | 6 | SHELL |
| `/staking/pools` | Pool discovery listing | Public | 6 | COMPLETE |
| `/staking/pools/create` | Create Staking Pool wizard | Wallet-gated | 6 | SHELL |
| `/staking/pools/[id]` | Pool detail | Public | 6 | SHELL |
| `/staking/pools/[id]/manage` | Pool management (owner) | Owner | 6 | SHELL |
| `/staking/my` | My pools / positions | Wallet-gated | 6 | SHELL |

**Mock data file:** `src/services/mocks/staking.mock.ts`  
**PENDING:** Reward calculation rules, lock periods, contract design (D-05, D-06)

---

## Module 7 — Exchange / Markets

| Route | View | Auth | Phase | Status |
|---|---|---|---|---|
| `/exchange` | Market dashboard | Public | 7 | SHELL |
| `/exchange/markets` | Market overview | Public | 7 | SHELL |
| `/exchange/tokens/[id]` | Token market page | Public | 7 | SHELL |
| `/exchange/pairs/[id]` | Pair / pool detail | Public | 7 | SHELL |
| `/exchange/watchlist` | Watchlist | Wallet-gated | 7 | SHELL |

**PENDING:** D-07 (analytics-only vs live trading), D-08 (market data source)  
**Mock data file:** `src/services/mocks/markets.mock.ts`  
**Note:** No fabricated live prices. All chart/price data must be clearly marked as demo data.

---

## Module 8 — Projects

| Route | View | Auth | Phase | Status |
|---|---|---|---|---|
| `/projects` | Project owner dashboard | Wallet-gated | 8 | SHELL |
| `/projects/my` | My projects listing | Wallet-gated | 8 | SHELL |
| `/projects/[id]` | Project public detail | Public | 8 | SHELL |
| `/projects/[id]/settings` | Project settings | Owner | 8 | SHELL |

**Mock data file:** `src/services/mocks/projects.mock.ts`

---

## Module 9 — Partners

| Route | View | Auth | Phase | Status |
|---|---|---|---|---|
| `/partners` | Partner portal | Role-gated | 8 | SHELL |
| `/partners/referrals` | Referral links and attribution | Role-gated | 8 | SHELL |

**PENDING:** D-11 (partner role/permission matrix)

---

## Module 10 — Account

| Route | View | Auth | Phase | Status |
|---|---|---|---|---|
| `/account` | Profile / account overview | Wallet-gated | 8 | SHELL |
| `/account/edit` | Edit profile | Wallet-gated | 8 | SHELL |
| `/account/wallets` | Wallet connections | Wallet-gated | 8 | SHELL |
| `/account/verification` | Identity verification | Wallet-gated | 9 | BLOCKED — D-09 |
| `/account/preferences` | Preferences and notifications | Wallet-gated | 8 | SHELL |
| `/account/security` | Security settings | Wallet-gated | 8 | SHELL |

---

## Module 11 — Docs / Help

| Route | View | Auth | Phase | Status |
|---|---|---|---|---|
| `/docs` | Documentation home | Public | ongoing | SHELL |
| `/docs/[slug]` | Guide / FAQ / policy page | Public | ongoing | SHELL |

---

## Shared / System Routes

| Route | View | Phase | Status |
|---|---|---|---|
| `*` / not-found | 404 page | 1 | SHELL |
| `/error` | Global error page | 1 | SHELL |

---

## Route Reconciliation & Inventory Summary

| Category | Count | Description |
|---|---|---|
| **Documented Functional Routes** | 56 | Total functional route concepts across Modules 1–11 in this specification |
| **Deferred Sub-routes (Phases 3–8)** | -8 | Owner management / sub-tabs (`tokens/[id]/contract`, `tokens/[id]/activity`, `launchpad/presales/[id]/manage`, `launchpad/launches/[id]/manage`, `airdrops/campaigns/[id]/manage`, `staking/pools/[id]/manage`, `exchange/pairs/[id]`, `projects/[id]/settings`) |
| **Phase 1 Active Module File Routes** | 48 | Standalone `page.tsx` routes implemented in `frontend/src/app` |
| **Phase 1 System Route Handlers** | 2 | `not-found.tsx` (404) and `error.tsx` (client exception boundary) |
| **Total Physical File Route Definitions** | **50** | Exact count of file-based route handlers in `frontend/src/app` |
| **Prerendered Static HTML Pages** | **76** | Output pages compiled by Next.js Turbopack via `generateStaticParams()` |

*Note: The initial 51-route total cited in earlier drafts was an interim estimate before the creation of the dedicated error boundary and reconciliation of dynamic mock instances.*
