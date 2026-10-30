# PROJECT_PROGRESS.md

## Project status

- Baseline version: 1.0
- Architecture decisions: 1.1
- Current phase: 2 — Explore & Discovery
- Current module: Milestone 2-E (Fair Launch Discovery)
- Overall status: COMPLETE (Awaiting product owner review before starting Milestone 2-F)
- Last updated: 2026-10-30

## Completed in this task

1. **Global ProMiners Color Theme Update (Approved Palette & Centralized Design Tokens)**:
   - Established the official dark-first ProMiners color palette across the website:
     - Primary background: Warm black (`#0C0C0B`) replacing blue-black/purple-black.
     - Primary accent: Signature orange (`#E9762B`) applied consistently to primary CTAs, active navigation items, selected tabs, focus indicators (`--ring`), badges, and interactive elements.
     - Primary text: Warm off-white (`#E9E4DA`) ensuring readable high-contrast typography.
     - Primary foreground: Warm black (`#0C0C0B`) providing high contrast on orange CTA buttons.
   - Updated centralized design tokens in `frontend/src/app/globals.css`:
     - Semantic tokens: `--background`, `--foreground`, `--primary`, `--primary-foreground`, `--card`, `--card-foreground`, `--popover`, `--secondary`, `--muted`, `--muted-foreground`, `--accent`, `--border`, `--input`, `--ring`, and `--brand-from` / `--brand-to` (orange to amber gradient).
     - Standardized utility classes (`.glass-card`, `.glow-primary`, `.bg-grid-pattern`, `.demo-banner`) using modern `color-mix(in srgb, ...)` functions.
   - Replaced scattered legacy indigo/violet gradient overrides in `TopNav`, `AppShell`, `page.tsx`, `tokens/create/page.tsx`, `launchpad/presales/page.tsx`, `account/page.tsx`, and `docs/page.tsx`.
   - Updated active tab triggers in `src/components/ui/tabs.tsx` to highlight in primary orange.
   - Updated input focus rings to use `--ring: #E9762B`.

2. **Horizon X Halftone Footer Integration**:
   - Integrated the approved interactive halftone wordmark footer as a reusable component: `frontend/src/components/ui/halftone-wordmark-footer.tsx`.
   - Rendered the giant dotted `Horizon X` wordmark using high-performance 2D Canvas sampling with area-accurate dot radius mathematics (`hwfRadius`).
   - Integrated interactive spring-based pointer displacement (`hwfStep`) that displaces dots away from the cursor on hover.
   - Integrated dynamic dot warming (`hwfWarmth`), shifting dots from resting off-white (`#E9E4DA`) to signature orange (`#E9762B`) when perturbed.
   - Integrated click-triggered shockwave ripple animation propagating outward across the dot grid.
   - Integrated static 256x256 print grain texture overlay with `overlay` blend mode at 0.35 opacity.
   - Structured brand information on the left: "PROMINERS" brand heading and "© 2026 • BUILDING THE OPEN WEB" subtext.
   - Integrated three organized navigation columns (*Explore*, *Protocol*, *Connect*) sourced from `src/config/navigation.ts`.
   - Configured 100% verified production routes and external destinations: `/explore`, `/tokens`, `/launchpad`, `/airdrops`, `/staking`, `/docs`, `/docs/guides`, `/docs/risk`, `/docs/terms`, `/docs/privacy`, `https://x.com/prominers`, `https://discord.gg/prominers`, `https://github.com/prominers`, and `mailto:hello@prominers.io` — zero placeholder `#` links.
   - Implemented smooth back-to-top scrolling button (`hwf-up`).
   - Replaced old footer in `frontend/src/components/layout/footer.tsx`, seamlessly rendering exactly once via `frontend/src/components/layout/app-shell.tsx` across all website pages.
   - Verified responsive desktop (4-column grid) and mobile (2-column stacked grid) layouts without horizontal overflow.

3. **Milestone 1-A Frontend Foundation**:
   - Initialized Git repository, documentation suite, and Next.js 16 App Router application.
   - Built 50 physical file routes (48 module `page.tsx` routes + 2 system routes), OKLCH design system, 4 global modals, and centralized navigation/mock data.

4. **Milestone 1-A.1 Foundation Audit & Visual QA**:
   - Conducted comprehensive route reconciliation (56 functional specifications, 50 file route definitions, 76 prerendered static pages).
   - Added missing global error boundary `frontend/src/app/error.tsx` (BUG-H1).
   - Fixed dynamic parameter handling across all 8 dynamic routes to return 404 via `notFound()` for unknown IDs (BUG-H2).
   - Fixed `frontend/.gitignore` to properly track `frontend/.env.example` while ignoring `.env*.local` and `.env` (BUG-M1).
   - Audited and updated demo-state integrity: removed fake "All Systems Operational" badge and "Live Telemetry" labels; updated all creator and claim toast notifications to state "Simulated / Phase 1 Demonstration" (BUG-M2).
   - Capped compiler workers to 4 in `frontend/next.config.ts` (`experimental.cpus: 4`) ensuring stable build performance.
   - Performed build (`npm run build`), lint (`npm run lint`), TypeScript checks, and HTTP route verification with exit code 0.
   - Published comprehensive audit report in `docs/MILESTONE_1A_AUDIT.md`.

5. **Milestone 1-B Wallet Integration & Web3 State Management**:
   - Approved and documented Architecture Decision D-04: Ethereum Sepolia Testnet only (Chain ID: 11155111).
   - Built centralized network configuration (`src/config/chains.ts`) with typed extensible `NetworkConfig` registry, ready for future network additions without state redesign.
   - Integrated Wagmi v3 and Viem v2 with TanStack Query v5 in `src/config/wagmi.ts` and `src/components/providers/web3-provider.tsx`.
   - Configured real connectors: MetaMask, WalletConnect (with project ID environment variable), Coinbase Wallet, and Browser Injected (EIP-6963).
   - Refactored `src/contexts/wallet-context.tsx` with reactive hooks (`useAccount`, `useBalance`, `useConnect`, `useDisconnect`, `useSwitchChain`) exposing live address, native Sepolia balance, network status, and account change notifications.
   - Integrated network detection: unsupported chains trigger an amber warning badge with 1-click switch to Sepolia.
   - Updated `ConnectWalletModal` with real connector triggers, pending connection spinners, error alert banners, and a demo sandbox fallback.
   - Updated `WalletDetailsModal` with Sepolia Etherscan link, live native balance, and unsupported network switch alert.
   - Updated `TopNav` and `MobileNav` to display live Sepolia network indicator, short address, and live ETH balance.
   - Documented all required environment variables in `frontend/.env.example`.
   - Created automated test suite `src/tests/wallet-state.test.ts` (16/16 tests passing).

6. **Milestone 2-A Explore & Discovery Foundation**:
   - Rebuilt the central Explore landing page (`/explore` route) as the unified ecosystem discovery hub.
   - Built discovery ecosystem metric cards (16 Indexed Assets, Top Gainer PMIN +14.2%, 5 Launchpad Deals, 38.2% Max Staking APY).
   - Designed 6 specialized hero category cards for all 6 discovery pillars (Tokens, Projects, Presales, Fair Launches, Airdrops, Staking Pools) with badge counts, rich icon graphics, and direct navigation links.
   - Implemented real-time discovery search entry point with clear button, query highlight, and matching count indicator.
   - Built category navigation tabs with live asset counts and instant reactive filtering.
   - Added quick filter presets: `All Assets`, `Live / Active Only`, `Audited Only`, `Ethereum / Sepolia`.
   - Built dual presentation modes: unified matching results view when filtering, and a curated categorized showcase (Featured Tokens, Featured Protocols & Projects, Launchpad Spotlight, Rewards & Yield) when in default overview.
   - Built structured `EmptyState` fallback with a 1-click filter reset button when queries return 0 matches.
   - Integrated creator action callout banner with `useWallet` and `useModal` hooks for "Deploy Token" and "Connect Wallet".
   - Integrated explicit Phase 1 demonstration alert banner complying with BUG-M2.
   - Preserved existing wallet and web3 integration; strictly adhered to scope boundaries without modifying sub-listing pages.

7. **Milestone 2-B Token Explorer**:
   - Built a shared, reusable `TokenExplorer` component (`src/components/tokens/token-explorer.tsx`) powering both `/tokens/explore` (canonical listing) and `/explore/tokens` (discovery entry) with 0 duplicate logic.
   - Implemented a desktop table layout with token identity (avatar initials, name, symbol), category pill, network badge (with special Ethereum Sepolia D-04 highlight), simulated price, 24h percentage change (with trend icons and colors), 24h volume, market cap, lifecycle/audit status badges, and direct detail links.
   - Implemented responsive mobile/tablet card presentation with clean touch targets and clear data hierarchy.
   - Implemented client-side instant search for token names and symbols with clear button (`X`) and empty state trigger.
   - Implemented multi-criteria filters: Network (`All Networks`, `Ethereum Sepolia (11155111 — Active)` strictly restricted per Architecture Decision D-04; non-Sepolia tokens remain preserved in centralized mock catalog for cross-chain discovery without wallet claims), Category (`Governance`, `AI & Compute`, `DeFi`, `DePIN`, `Infrastructure`, `Security & Privacy`, `Meme & Community`), and Status (`active`, `pending`).
   - Implemented full sorting across all 5 dimensions (`name`, `price`, `marketCap`, `priceChange24h`, `volume24h`) with interactive table header click-to-sort and sort direction indicators (`asc` / `desc`).
   - Implemented configurable pagination (`5`, `10`, `20` per page), previous/next controls, page number pills, total result counts, and automatic page 1 reset on filter/search changes.
   - Implemented component-level `EmptyState` fallback with a 1-click "Clear All Filters" action.
   - Upgraded `MOCK_TOKENS` schema in `src/types/index.ts` and `src/lib/mock-data.ts` with typed categories and 5 corresponding ecosystem tokens (`quantum`, `nexus`, `zkpv`, `ccat`, `mdao`).
   - Embedded explicit demonstration data disclaimers: "Demonstration Data Notice: Token pricing, 24h percentage changes, market caps, and audit badges are simulated for demonstration. Per Architecture Decision D-04, Ethereum Sepolia Testnet (Chain ID: 11155111) is the only approved and supported EVM network. Non-Sepolia tokens are preserved for cross-chain catalog discovery and do not imply wallet or contract support."
   - Created automated unit test suite `src/tests/token-explorer.test.ts` verifying data integrity, search, Sepolia D-04 filter isolation, sorting, and pagination logic.

8. **Milestone 2-C Project Directory**:
   - Built a shared, reusable `ProjectDirectory` component (`src/components/projects/project-directory.tsx`) powering both `/projects` (canonical Project Directory) and `/explore/projects` (discovery entry) with 0 duplicate logic.
   - Designed a dual-presentation layout: responsive 3-column Grid View and high-density Table View with sticky headers, sortable columns, and responsive mobile card presentation.
   - Integrated initial-based avatar branding box with ProMiners gradient styling and external website links.
   - Built multi-criteria filter toolbar:
     - Search: instant client-side matching across project name, description, and symbols/names of linked tokens (e.g. searching "$PMIN" finds ProMiners Foundation).
     - Category filter: all unique categories (Governance, AI & Compute, DeFi, DePIN, Infrastructure, Security & Privacy, Meme & Community).
     - Ecosystem filter: strictly restricted per Architecture Decision D-04 to `All Ecosystems` and `Ethereum Sepolia (11155111 — Active)`; non-Sepolia tokens/projects preserved in centralized mock catalog without wallet claims.
     - Lifecycle status filter: `active`, `pending`.
     - Verification tier filter: `audit_available`, `contract_source_verified`, `project_reviewed`, `not_reviewed`.
   - Built full sorting across 3 dimensions (`name`, `createdAt` date, `tokenIds` count) with table header click-to-sort and sort direction indicators.
   - Implemented configurable pagination (`6`, `12`, `24` items per page) with page number pills, previous/next controls, and automatic reset to page 1 on filter or search changes.
   - Implemented component-level `EmptyState` fallback with a 1-click "Clear All Filters" action.
   - Enforced linked token relationship integrity: associated tokens are resolved dynamically from `MOCK_TOKENS` via `tokenIds` and link to `/tokens/${token.id}`; projects with zero tokens (`nexus-open-infra`) display "No tokens currently associated" without fabricating relationships.
   - Embedded explicit demonstration data disclaimers: "Demonstration Data Notice: Project listings, verification tiers, and ecosystem affiliations are simulated for demonstration. Per Architecture Decision D-04, Ethereum Sepolia Testnet (Chain ID: 11155111) is the only approved and supported EVM wallet network. Ecosystem metadata reflects protocol origins and does not imply wallet connectivity or transaction support for non-Sepolia networks."
   - Updated `src/app/projects/[id]/page.tsx` to dynamically resolve linked tokens from `MOCK_TOKENS` and render metadata without hardcoded slice or fake associations.
   - Created automated unit test suite `src/tests/project-directory.test.ts` verifying schema, search, filtering, Sepolia D-04 scope compliance, token relationship integrity, sorting, and pagination logic.

9. **Milestone 2-D Presales Discovery**:
   - Built a shared, reusable `PresaleDirectory` component (`src/components/launchpad/presale-directory.tsx`) powering both `/launchpad/presales` (canonical presale listing) and `/explore/presales` (discovery entry) with 0 duplicate logic.
   - Designed dual presentation: responsive 3-column Grid View and high-density Table View with sortable columns, progress bars, and mobile responsiveness.
   - Preserved existing presale detail (`/launchpad/presales/[id]`) and creation (`/launchpad/presales/create`) routes without modifying workflows.
   - Integrated dynamic fundraising progress calculation (`totalRaised / hardCap * 100`) and softcap status indicators.
   - Built multi-criteria filter toolbar:
     - Search: instant client-side matching across presale title, token symbol, token name, and description.
     - Status filter: `live`, `scheduled`, `ended`, `finalized`, `draft`.
     - Network filter: strictly restricted per Architecture Decision D-04 to `All Networks` and `Ethereum Sepolia (11155111 — Active)`; non-Sepolia presales preserved in centralized mock catalog without wallet claims.
     - Category filter: all categories derived from presales and linked tokens (`Infrastructure`, `DeFi`, `Security & Privacy`, `Governance`, `AI & Compute`, `DePIN`).
   - Built full sorting across 4 dimensions (presale title, start/creation date, fundraising progress, total raised).
   - Implemented configurable pagination (`4`, `6`, `12` items per page) with page number pills, previous/next controls, and automatic reset to page 1 on filter or search changes.
   - Implemented component-level `EmptyState` fallback with a 1-click "Clear All Filters" action.
   - Embedded explicit demonstration data disclaimers complying with D-04 and BUG-M2.
   - Created automated unit test suite `src/tests/presale-directory.test.ts` verifying schema, progress math, search, filtering, Sepolia D-04 scope compliance, sorting, pagination, and detail link integrity.

## Files created or modified

- `docs/PROJECT_PROGRESS.md`
- `docs/PROJECT_OVERVIEW.md`
- `docs/MODULE_INVENTORY.md`
- `docs/MODAL_INVENTORY.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/DATA_AND_INTEGRATIONS.md`
- `docs/CONTRACT_SPECIFICATION.md`
- `docs/DECISION_LOG.md`
- `docs/TESTING_CHECKLIST.md`
- `docs/KNOWN_ISSUES.md`
- `frontend/package.json`
- `frontend/components.json`
- `frontend/eslint.config.mjs`
- `frontend/src/app/globals.css`
- `frontend/src/app/layout.tsx`
- `frontend/src/app/not-found.tsx`
- `frontend/src/app/page.tsx`
- `frontend/src/app/explore/page.tsx`
- `frontend/src/app/explore/tokens/page.tsx`
- `frontend/src/app/explore/projects/page.tsx`
- `frontend/src/app/explore/presales/page.tsx`
- `frontend/src/app/explore/launches/page.tsx`
- `frontend/src/app/explore/airdrops/page.tsx`
- `frontend/src/app/explore/staking/page.tsx`
- `frontend/src/app/tokens/page.tsx`
- `frontend/src/app/tokens/explore/page.tsx`
- `frontend/src/app/tokens/create/page.tsx`
- `frontend/src/app/tokens/my/page.tsx`
- `frontend/src/app/tokens/[id]/page.tsx`
- `frontend/src/app/launchpad/page.tsx`
- `frontend/src/app/launchpad/presales/page.tsx`
- `frontend/src/app/launchpad/presales/create/page.tsx`
- `frontend/src/app/launchpad/presales/[id]/page.tsx`
- `frontend/src/app/launchpad/launches/page.tsx`
- `frontend/src/app/launchpad/launches/create/page.tsx`
- `frontend/src/app/launchpad/launches/[id]/page.tsx`
- `frontend/src/app/airdrops/page.tsx`
- `frontend/src/app/airdrops/campaigns/page.tsx`
- `frontend/src/app/airdrops/campaigns/create/page.tsx`
- `frontend/src/app/airdrops/campaigns/[id]/page.tsx`
- `frontend/src/app/airdrops/claim/page.tsx`
- `frontend/src/app/airdrops/my/page.tsx`
- `frontend/src/app/staking/page.tsx`
- `frontend/src/app/staking/pools/page.tsx`
- `frontend/src/app/staking/pools/create/page.tsx`
- `frontend/src/app/staking/pools/[id]/page.tsx`
- `frontend/src/app/staking/my/page.tsx`
- `frontend/src/app/exchange/page.tsx`
- `frontend/src/app/exchange/markets/page.tsx`
- `frontend/src/app/exchange/watchlist/page.tsx`
- `frontend/src/app/exchange/tokens/[id]/page.tsx`
- `frontend/src/app/projects/page.tsx`
- `frontend/src/app/projects/my/page.tsx`
- `frontend/src/app/projects/[id]/page.tsx`
- `frontend/src/app/partners/page.tsx`
- `frontend/src/app/partners/referrals/page.tsx`
- `frontend/src/app/account/page.tsx`
- `frontend/src/app/account/edit/page.tsx`
- `frontend/src/app/account/wallets/page.tsx`
- `frontend/src/app/account/verification/page.tsx`
- `frontend/src/app/account/preferences/page.tsx`
- `frontend/src/app/account/security/page.tsx`
- `frontend/src/app/docs/page.tsx`
- `frontend/src/app/docs/[slug]/page.tsx`
- `frontend/src/components/layout/top-nav.tsx`
- `frontend/src/components/layout/mobile-nav.tsx`
- `frontend/src/components/layout/footer.tsx`
- `frontend/src/components/layout/app-shell.tsx`
- `frontend/src/components/modals/modal-provider.tsx`
- `frontend/src/components/modals/connect-wallet-modal.tsx`
- `frontend/src/components/modals/wallet-details-modal.tsx`
- `frontend/src/components/modals/command-palette-modal.tsx`
- `frontend/src/components/modals/risk-warning-modal.tsx`
- `frontend/src/components/shared/page-header.tsx`
- `frontend/src/components/shared/metric-card.tsx`
- `frontend/src/components/shared/status-badge.tsx`
- `frontend/src/components/shared/empty-state.tsx`
- `frontend/src/components/ui/button.tsx`
- `frontend/src/components/ui/tabs.tsx`
- `frontend/src/components/ui/halftone-wordmark-footer.tsx`
- `frontend/src/contexts/wallet-context.tsx`
- `frontend/src/contexts/modal-context.tsx`
- `frontend/src/config/navigation.ts`
- `frontend/src/lib/mock-data.ts`
- `frontend/src/lib/utils.ts`
- `frontend/src/types/index.ts`
- `frontend/src/components/tokens/token-explorer.tsx`
- `frontend/src/tests/token-explorer.test.ts`
- `frontend/src/components/projects/project-directory.tsx`
- `frontend/src/tests/project-directory.test.ts`
10. **Milestone 2-E Fair Launch Discovery**:
    - Built a shared, reusable `FairLaunchDirectory` component (`frontend/src/components/launchpad/fair-launch-directory.tsx`) powering both `/launchpad/launches` (canonical fair launch directory) and `/explore/launches` (discovery entry) with 0 duplicate logic.
    - Designed dual presentation: responsive 3-column Grid View and high-density Table View with sortable columns, progress bars, and mobile responsiveness.
    - Preserved existing fair launch detail (`/launchpad/launches/[id]`) and creation (`/launchpad/launches/create`) routes without modifying workflows.
    - Integrated dynamic softcap progress calculation (`totalRaised / softCap * 100`) and contribution metrics.
    - Built multi-criteria filter toolbar:
      - Search: instant client-side matching across launch title, token symbol, token name, project name, and description.
      - Status filter: `live`, `scheduled`, `ended`, `finalized`, `draft`.
      - Network filter: strictly restricted per Architecture Decision D-04 to `All Networks` and `Ethereum Sepolia (11155111 — Active)`; non-Sepolia launches preserved in centralized mock catalog for cross-chain discovery without wallet claims.
      - Category filter: all categories derived from launches and linked tokens (`Governance`, `Meme & Community`, `Infrastructure`, `DeFi`, `Security & Privacy`, `AI & Compute`, `DePIN`).
    - Built full sorting across 4 dimensions (launch title, start/creation date, softcap progress, total raised).
    - Implemented configurable pagination (`4`, `6`, `12` items per page) with page number pills, previous/next controls, result count indicators, and automatic reset to page 1 on filter or search changes.
    - Implemented component-level `EmptyState` fallback with a 1-click "Reset All Filters" action.
    - Embedded explicit demonstration data disclaimers complying with D-04 and BUG-M2.
    - Expanded `FairLaunch` interface in `frontend/src/types/index.ts` with optional metadata (`description`, `category`, `totalSelling`, `softCap`, `totalRaised`, `participantCount`, `minContribution`, `maxContribution`).
    - Enriched typed mock dataset `MOCK_FAIR_LAUNCHES` in `frontend/src/lib/mock-data.ts` to 8 realistic fair launches (5 Ethereum Sepolia D-04 items, 3 cross-chain discovery items on Base, Arbitrum One, Polygon).
    - Cleaned unused imports in `frontend/src/app/launchpad/launches/[id]/page.tsx` for optimal lint hygiene.
    - Created automated unit test suite `frontend/src/tests/fair-launch-directory.test.ts` verifying schema, progress math, search, filtering, Sepolia D-04 scope compliance, sorting, pagination, and detail link integrity.

## Files created or modified

- `docs/PROJECT_PROGRESS.md`
- `docs/PROJECT_OVERVIEW.md`
- `docs/MODULE_INVENTORY.md`
- `docs/MODAL_INVENTORY.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/DATA_AND_INTEGRATIONS.md`
- `docs/CONTRACT_SPECIFICATION.md`
- `docs/DECISION_LOG.md`
- `docs/TESTING_CHECKLIST.md`
- `docs/KNOWN_ISSUES.md`
- `frontend/package.json`
- `frontend/src/app/globals.css`
- `frontend/src/app/page.tsx`
- `frontend/src/app/explore/page.tsx`
- `frontend/src/app/explore/tokens/page.tsx`
- `frontend/src/app/explore/projects/page.tsx`
- `frontend/src/app/explore/presales/page.tsx`
- `frontend/src/app/explore/launches/page.tsx`
- `frontend/src/app/tokens/page.tsx`
- `frontend/src/app/tokens/explore/page.tsx`
- `frontend/src/app/tokens/create/page.tsx`
- `frontend/src/app/tokens/[id]/page.tsx`
- `frontend/src/app/projects/page.tsx`
- `frontend/src/app/projects/[id]/page.tsx`
- `frontend/src/app/launchpad/page.tsx`
- `frontend/src/app/launchpad/launches/page.tsx`
- `frontend/src/app/launchpad/launches/[id]/page.tsx`
- `frontend/src/app/launchpad/launches/create/page.tsx`
- `frontend/src/app/launchpad/presales/page.tsx`
- `frontend/src/app/launchpad/presales/create/page.tsx`
- `frontend/src/app/account/page.tsx`
- `frontend/src/app/docs/page.tsx`
- `frontend/src/components/layout/app-shell.tsx`
- `frontend/src/components/layout/top-nav.tsx`
- `frontend/src/components/layout/footer.tsx`
- `frontend/src/components/ui/tabs.tsx`
- `frontend/src/components/ui/halftone-wordmark-footer.tsx`
- `frontend/src/components/wallet/wallet-modal.tsx`
- `frontend/src/components/wallet/network-switch-modal.tsx`
- `frontend/src/contexts/wallet-context.tsx`
- `frontend/src/contexts/modal-context.tsx`
- `frontend/src/config/navigation.ts`
- `frontend/src/lib/mock-data.ts`
- `frontend/src/lib/utils.ts`
- `frontend/src/types/index.ts`
- `frontend/src/components/tokens/token-explorer.tsx`
- `frontend/src/tests/token-explorer.test.ts`
- `frontend/src/components/projects/project-directory.tsx`
- `frontend/src/tests/project-directory.test.ts`
- `frontend/src/components/launchpad/presale-directory.tsx`
- `frontend/src/tests/presale-directory.test.ts`
- `frontend/src/components/launchpad/fair-launch-directory.tsx`
- `frontend/src/tests/fair-launch-directory.test.ts`

## Tests and verification

- Build: **PASSED** (`npm run build` completed successfully, 105/105 static routes prerendered with 0 errors)
- Type-check: **PASSED** (TypeScript 5.x passed with 0 errors)
- Lint: **PASSED** (`npm run lint` completed successfully with 0 errors, 64 warnings across legacy files; 0 errors/warnings in Fair Launch Discovery files)
- Automated tests: **PASSED** (`npm test` — all five test suites: `wallet-state.test.ts` (16/16), `token-explorer.test.ts`, `project-directory.test.ts`, `presale-directory.test.ts`, and `fair-launch-directory.test.ts` passed 100%)
- Local HTTP check: **PASSED** (`HTTP/1.1 200 OK` on `http://localhost:3000`)
- Theme verification: **PASSED** (Warm black `#0C0C0B`, warm off-white `#E9E4DA`, signature orange `#E9762B`, high-contrast button text verified)
- Halftone footer verification: **PASSED** (Giant dotted `Horizon X` wordmark, 2D canvas particle physics, pointer displacement, click shockwave ripple animation, print grain overlay, 3 navigation columns, brand info, and smooth back-to-top scroll verified)
- Layout stability: **PASSED** (Zero horizontal overflow; clean mobile breakpoints down to 320px/400px viewports)

## Known issues

- **KI-001 (Severity: INFO):** Real EVM Web3 wallet integration and native balance retrieval is live on Ethereum Sepolia Testnet. Smart contract actions and external market feeds remain mock-adapted for this phase. (Accepted for Phase 1.)
- **KI-002 (Severity: LOW):** 64 unused variable/import warnings reported by ESLint across legacy page and wizard files (Fair Launch Discovery, Presales Discovery, Project Directory, and Token Explorer files have 0 warnings/errors). Runtime is unaffected; planned resolution is a tree-shaking and import hygiene cleanup pass during future refactoring.
- **KI-003 (Severity: INFO):** Next.js 16 Turbopack logs a prefetch warning when accessing dynamic `await params` outside of `<Suspense>` during instant navigation. Static page generation succeeds with 0 errors; planned resolution is wrapping dynamic route parameter access inside `<Suspense>` during future refactoring.
- **KI-004 (Severity: INFO):** 8 owner-management sub-routes from `MODULE_INVENTORY.md` (`tokens/[id]/contract`, `tokens/[id]/activity`, `launchpad/presales/[id]/manage`, etc.) are currently accessible via tabbed views within parent detail pages rather than isolated sub-route URLs. Planned resolution is dedicated sub-route partitioning during Phase 3–8 module milestones.

## Decisions required

- D-07: Exchange module scope (analytics only vs embedded AMM router)
- D-08: Market data provider selection
- D-09: KYC provider and policy (blocks live identity verification on `/account/verification`)
- D-11: Partner role/permission matrix

## Next exact task

Milestone 2-F: Airdrop Discovery (`/explore/airdrops` discovery entry and `/airdrops/campaigns` canonical listing). Awaiting product owner review of Milestone 2-E before proceeding.

## Baseline compliance

- [x] Read the master product baseline
- [x] No unapproved scope/architecture change
- [x] Module inventory updated
- [x] Modal inventory updated
- [x] Known issues updated
- [x] Regression checks considered
