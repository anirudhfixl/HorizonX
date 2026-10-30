# DATA_AND_INTEGRATIONS.md

> **Baseline version:** 1.0 | **Architecture decisions:** 1.1 | **Last updated:** 2026-10-30

---

## Data category responsibilities

| Data category | Examples | Source | Phase |
|---|---|---|---|
| Application / account | Profile, drafts, watchlists, preferences, project descriptions | Application backend / database (MongoDB) | LATER |
| Wallet session | Connected address, selected network, session state | Wallet provider / session; never store secrets | Phase 3+ |
| On-chain facts | Contract, transaction, block, public events, balances, contract state | Blockchain RPC/node or trusted provider (PENDING D-04) | Phase 3+ |
| Indexed data | Searchable token list, campaign history, participant counts, analytics | Indexer/subgraph/event processor, reconciled against chain | Phase 3+ |
| Market data | Price, volume, liquidity, pair history | Named market-data provider (PENDING D-08) | Phase 7 |
| Verification | KYC status, project review, audit references | Specialist provider and controlled platform records | Phase 9 |

---

## Service / adapter pattern

All data access uses typed service interfaces in `src/services/`.

```
src/services/
  contracts/            # Typed interfaces (ITokenService, IAirdropService, etc.)
  mocks/                # Mock implementations returning typed fixture data
  api/                  # Real API implementations (added in later phases)
```

Mock adapters return typed data from `src/services/mocks/*.mock.ts` fixture files.  
Real API implementations replace mock adapters without changing consumer components.

---

## Mock data rules

- All mock data lives in typed fixture files, never scattered in components.
- Demo data must be clearly marked with a `DemoDataBanner` component.
- No fabricated live prices, chart data, volumes or market statistics.
- Fixture IDs are stable strings (`token-001`, `presale-001`), not array indices.

---

## Integrations inventory

| Integration | Library | Status | PENDING |
|---|---|---|---|
| Wallet connection | Wagmi + Viem | NOT STARTED | D-04 |
| Blockchain RPC reads | Viem / provider | NOT STARTED | D-04 |
| Subgraph / indexer | TBD | NOT STARTED | D-04 |
| Market data API | TBD | NOT STARTED | D-08 |
| KYC provider | TBD | NOT STARTED | D-09 |
| Application backend API | Express.js REST | NOT STARTED | Phase 2+ backend |
| Authentication | TBD (wallet-based or JWT) | NOT STARTED | D-11 |

---

## Environment variables (planned)

See `.env.example` for variable names and safe placeholder values.

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Public | Public application URL for metadata/OG |
| `NEXT_PUBLIC_CHAIN_ID` | Public | Default network chain ID (PENDING D-04) |
| `API_BASE_URL` | Server only | Backend API base URL |
| `DATABASE_URL` | Server only | MongoDB connection string (LATER) |

**Rule:** Never expose API secrets, private keys, database passwords or signing credentials via `NEXT_PUBLIC_` variables.
