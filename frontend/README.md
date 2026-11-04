# HorizonX

**A Web3 ecosystem discovery and launch-management frontend.**

HorizonX brings token discovery, project directories, presale and fair-launch exploration, airdrop campaigns, staking-pool discovery, market views and wallet connectivity into one browser application.

> **Project status:** Frontend prototype / implementation baseline — not a production Web3 protocol.
>
> **Branding note:** The repository is referred to as **HorizonX**, while parts of the current application metadata, wallet connector metadata and sample catalog still use **ProMiners**. The canonical public brand has not yet been normalized in the source.

## What is in this repository?

The current codebase is a **React 19 + TypeScript + Vite single-page application** using React Router 7. It was migrated from an earlier Next.js App Router structure. The current runtime architecture is the Vite SPA described below; older documents in the repository that still describe Next.js should be treated as historical until reconciled.

### Main product areas

| Area | What it contains |
|---|---|
| Home | Ecosystem overview and entry points |
| Explore | Discovery across tokens, projects, presales, fair launches, airdrops and staking |
| Tokens | Dashboard, explorer, detail, contract/activity views, watchlist, My Tokens and creation flow |
| Launchpad | Presale and fair-launch directories, details, creation flows and My Launches |
| Airdrops | Campaign directory, campaign details, creation, claim and My Campaigns views |
| Staking | Pool discovery, details, creation and My views |
| Exchange / Markets | Market overview, token market pages and watchlist |
| Projects | Project directory, details and owner-facing views |
| Partners | Partner and referral views |
| Account | Profile, wallet, preferences, security and verification views |
| Docs / Help | Product guides and help pages |

### Web3 capabilities currently present

- EVM wallet connection through Wagmi using injected providers, MetaMask, WalletConnect and Coinbase Wallet connectors.
- Ethereum Sepolia is the only configured supported EVM network (Chain ID `11155111`).
- The connected wallet's native Sepolia ETH balance is read through the configured wallet/RPC integration.
- A clearly separate demo-wallet mode is available for UI exploration.

### Important implementation boundaries

This repository is **not yet a production protocol**:

- Token, project, presale, fair-launch, airdrop and staking records are primarily local catalog fixtures.
- Market prices, charts, volumes, liquidity, holder distributions and trade examples are illustrative/simulated.
- Token creation, presale/fair-launch creation and airdrop flows do not deploy or call production smart contracts.
- Session-created records are stored in browser `sessionStorage`; they are not durable server records.
- There is no application backend, database, server-side authentication, indexer, live market-data provider, KYC provider or production contract suite in this source archive.
- Wallet connection is not platform account authentication.
- Catalog entries may mention networks other than Sepolia; those entries do not imply that those networks are enabled for wallet transactions.

Do not use this prototype to make financial decisions or represent its sample values as live market data.

## Tech stack

| Layer | Technology |
|---|---|
| UI | React 19, TypeScript |
| Build tooling | Vite 7 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4 |
| UI primitives | Radix UI, shadcn-style project components |
| Wallet / EVM | Wagmi 3, Viem 2 |
| Query cache | TanStack Query 5 |
| Motion / visualization | Motion, D3, Three.js, React Three Fiber |
| Notifications | Sonner |
| Tests | TypeScript test files executed with `tsx` |

## Visual system

The current source uses a dark graphite palette with lavender and cyan accents:

| Token | Value |
|---|---|
| Page background | `#0B0806` |
| Primary surface | `#121518` |
| Elevated surface | `#191D21` |
| Primary text | `#E5E9F4` |
| Muted text | `#8793AD` |
| Primary accent / focus | `#A99AFF` |
| Gradient endpoint | `#6FDBE9` |

Typography is loaded in `frontend/index.html`: Outfit for interface text, Fraunces for display/heading use and IBM Plex Mono for monospaced content. The older `docs/DESIGN_SYSTEM.md` still describes a different warm-black/orange palette and should be reconciled before being treated as current.

## Repository structure

```text
.
├── docs/                       # Product, architecture, decisions and audit records
├── frontend/
│   ├── public/                 # Static assets and SPA redirect rule
│   ├── src/
│   │   ├── components/         # Layout, UI primitives and feature components
│   │   ├── config/             # Chain, wallet, navigation and theme configuration
│   │   ├── contexts/           # Wallet and modal state
│   │   ├── data/
│   │   │   └── catalog/        # Canonical local seed catalogs
│   │   ├── lib/                # Domain helpers, provenance and browser storage
│   │   ├── pages/              # Route-level page modules
│   │   ├── tests/              # TypeScript test files
│   │   ├── routes.tsx          # React Router route table
│   │   └── main.tsx            # React application entry
│   ├── .env.example            # Public frontend configuration template
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

The router currently defines **52 explicit application pages** (the home index route plus 51 named paths), with a wildcard not-found route. Feature pages are lazy-loaded through React Router.

## Getting started

### Requirements

- Node.js 20 or later recommended.
- npm.
- A modern browser.
- A Sepolia-compatible EVM wallet is optional; the demo wallet can be used to explore UI-only flows.

### 1. Install dependencies

Run commands from the `frontend` directory:

```bash
cd frontend
npm ci
```

### 2. Configure environment variables

Create a local environment file:

**macOS / Linux**
```bash
cp .env.example .env.local
```

**Windows PowerShell**
```powershell
Copy-Item .env.example .env.local
```

Available variables:

| Variable | Purpose |
|---|---|
| `VITE_APP_URL` | Public application URL used by frontend configuration |
| `VITE_APP_NAME` | Application display name |
| `VITE_DEMO_MODE` | Demo-mode configuration flag |
| `VITE_DEFAULT_CHAIN_ID` | Default chain ID; currently `11155111` |
| `VITE_WALLETCONNECT_PROJECT_ID` | Public WalletConnect/Reown project identifier |
| `VITE_SEPOLIA_RPC_URL` | Optional Sepolia RPC endpoint |
| `VITE_EXPLORER_URL` | Sepolia block explorer base URL |

All `VITE_` values are exposed to the browser bundle. **Never put private keys, seed phrases, database passwords, signing secrets or private API credentials in this file.**

The current Wagmi configuration also contains a fallback WalletConnect project ID. For a real deployment, configure a project ID owned by the deploying organization and review the fallback before release.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Available scripts

Run these from `frontend/`:

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server on port 3000 |
| `npm run build` | Create production assets in `dist/` |
| `npm run preview` | Preview the production build on port 3000 |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm run lint` | Run ESLint |
| `npm run test` | Run the 15 test files currently listed in the package script |

**Test coverage note:** 28 `*.test.ts` files are present under `src/tests`, but the current `npm run test` script explicitly invokes only 15. The remaining 13 files are not run by that command. Update the script/runner before treating `npm test` as the complete test suite.

## Network and data model

### Supported wallet network

| Network | Chain ID | Status |
|---|---:|---|
| Ethereum Sepolia | `11155111` | Configured testnet |

No mainnet transaction capability is established by this repository.

### Data provenance

The frontend distinguishes four data categories:

| Label | Meaning |
|---|---|
| `catalog` | Static seed data bundled with the frontend; not independently verified against a chain |
| `simulated` | Illustrative values or simulated outcomes |
| `session` | A record created and stored in the current browser session |
| `onchain` | Reserved for values actually read and verified from a blockchain; token-specific on-chain reads are not implemented in this baseline |

Catalog records currently include tokens, projects, presales, fair launches, airdrops and staking pools. Market figures remain simulated even when a fixture contains a field that might otherwise suggest a live value.

## Build and deployment

Create the production build:

```bash
cd frontend
npm run build
```

Deploy the generated `frontend/dist/` directory to a static hosting provider.

Because this is a React Router SPA, configure the host to rewrite unknown application paths to `index.html`. Without that fallback, opening or refreshing a nested route directly may return a hosting-level 404.

A Netlify-style fallback rule is included at `frontend/public/_redirects`. For other providers, configure the equivalent SPA rewrite in the hosting dashboard/configuration.

Environment variables are embedded at build time. Rebuild after changing frontend environment configuration.

## Quality checks

Before merging or deploying, run:

```bash
cd frontend
npm run typecheck
npm run lint
npm run test
npm run build
```

Review the test-script coverage gap noted above. The presence of test files does not prove they pass. The documentation package was prepared from static source inspection; these commands were **not executed as part of that documentation pass**.

## Documentation

The production-style handover documents are:

- [Product Requirements Document](docs/HorizonX_PRD_Production_v1.0.pdf)
- [Technical Design Document](docs/HorizonX_TDD_Production_v1.0.pdf)
- [Software Requirements Specification](docs/HorizonX_SRS_Production_v1.0.pdf)

Editable Word versions are provided alongside the PDFs. Existing audit and decision records in `docs/` remain useful historical context, but some were written for the previous Next.js architecture and must not override the current source code.

## Security and release limitations

Before any public production launch, the project still needs:

1. Canonical brand decision and consistent product metadata.
2. Backend/API and database architecture where persistent records and role enforcement are required.
3. Named market-data and indexing providers with provenance, attribution and freshness rules.
4. Approved token/launch/airdrop/staking contract specifications, tests and independent security audits.
5. Server-side authentication, authorization, audit logging and abuse controls for privileged operations.
6. Privacy, KYC/AML, jurisdiction, terms and risk-disclosure review where applicable.
7. CI checks, deployment controls, monitoring, incident response and backup/recovery planning.
8. End-to-end verification against real wallets, RPC behavior and supported hosting configuration.

A connected wallet, a catalog badge, a demo receipt or a successful UI toast is not evidence that a contract was deployed, a project was audited or a financial operation completed.

## Contributing

1. Create a focused branch for the change.
2. Keep catalog records in `frontend/src/data/catalog/` rather than duplicating them in page components.
3. Preserve provenance labels and never promote simulated data to `onchain` without a verified data source.
4. Keep wallet/network behavior centralized in `frontend/src/config/` and `frontend/src/contexts/`.
5. Add or update tests for changed domain behavior.
6. Run typecheck, lint, tests and production build; include actual results in the pull request.
7. Update the relevant records in `docs/` when product scope or architecture decisions change.

## License

No `LICENSE` file was present in the supplied source archive. Until a license is added, do not assume the repository grants permission to reuse, redistribute or commercially exploit its code.
