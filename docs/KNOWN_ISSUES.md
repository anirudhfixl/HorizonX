# KNOWN_ISSUES.md

> **Last updated:** 2026-10-30  
> **Severity levels:** CRITICAL | HIGH | MEDIUM | LOW | INFO

---

## Active Issues

| ID | Severity | Module | Route | Description | Workaround | Status |
|---|---|---|---|---|---|---|
| KI-001 | INFO | All | All | Real EVM Web3 wallet integration and native balance retrieval is live on Ethereum Sepolia Testnet. Smart contract actions and external market feeds remain mock-adapted for this phase. | By design — mock data adapters and demo sandbox indicators are clearly marked. | ACCEPTED for Phase 1 |
| KI-002 | LOW | Code Hygiene | Multiple | 83 unused variable/import warnings reported by ESLint across page and wizard files (Token Explorer components and pages have 0 warnings/errors). | Harmless to runtime; schedule tree-shaking cleanup in future refactor. | LOGGED |
| KI-003 | INFO | Dynamic Routing | `/[id]` routes | Next.js 16 Turbopack logs prefetch warning when accessing `await params` outside of `<Suspense>` during instant navigation. | Static generation via `generateStaticParams()` works with 0 errors; wrap with Suspense in future refactor. | LOGGED |
| KI-004 | INFO | Sub-routes | Tokens, Launchpad, Staking, Projects | 8 owner-management sub-routes from `MODULE_INVENTORY.md` are currently accessible via tabbed views on parent `[id]` detail pages rather than isolated URL sub-routes. | Feature-complete for Phase 1; partition into dedicated sub-routes during Phase 3–8 module milestones. | LOGGED |

---

## Resolved Issues & Decisions

| ID | Severity | Module | Description | Resolution | Date |
|---|---|---|---|---|---|
| D-04 | CRITICAL | Web3 / Architecture | Approve initial networks and testnets. | Approved Ethereum Sepolia Testnet only (Chain ID: 11155111); integrated via Wagmi + Viem. | 2026-10-30 |
| BUG-H1 | HIGH | System | Missing global error boundary (`error.tsx`) in App Router. | Created `frontend/src/app/error.tsx` with error recovery trigger. | 2026-10-30 |
| BUG-H2 | HIGH | Routing | Unknown dynamic parameters (`[id]`, `[slug]`) fell back to first mock item rather than returning 404. | Added `if (!item) notFound();` to all 8 dynamic page handlers. | 2026-10-30 |
| BUG-M1 | MEDIUM | Config | `frontend/.env.example` ignored by Git due to overly broad `.env*` pattern in `frontend/.gitignore`. | Updated `frontend/.gitignore` to explicitly unignore `!.env.example` while keeping `.env*.local` and `.env` untracked. | 2026-10-30 |
| BUG-M2 | MEDIUM | Compliance | Ambiguous "Live Telemetry" labels and fake successful deployment/claim toast notifications. | Replaced with explicit demonstration and sandbox notices across all components and toast handlers. | 2026-10-30 |

---

## Pending Decisions that Block Features

| ID | Decision | Impact | Status |
|---|---|---|---|
| D-07 | Trading vs analytics only | Exchange module scope | PENDING |
| D-08 | Market data provider | Price/chart data | PENDING |
| D-09 | KYC provider and policy | Identity verification route | BLOCKED |
| D-11 | Partner role/permission matrix | Partner portal access control | PENDING |
