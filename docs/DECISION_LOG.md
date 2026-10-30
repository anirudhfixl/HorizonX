# DECISION_LOG.md

> This log supplements `ProMiners_Master_Product_Baseline_v1.0.docx` and `ProMiners_Architecture_Decisions_v1.1.docx`.
> Every approved change or resolved decision must be recorded here. Do not silently override the baseline.

---

## Resolved Decisions

| ID | Decision | Approved direction | Date | Owner | Reason |
|---|---|---|---|---|---|
| D-01 | Product brand and visual direction | Premium dark-first design; light theme planned for later phase. Exact logo, name and colour palette to evolve. | 2026-10-30 | Product owner | Established in Architecture Decisions v1.1 |
| D-02 | Existing repo or greenfield build | **Greenfield confirmed.** No existing application code was found in workspace. Git initialized on `main`. | 2026-10-30 | Antigravity (inspection) | Milestone 0 inspection found only the baseline DOCX |
| D-03 | Frontend / backend / database stack | Frontend: Next.js (App Router) + React + TypeScript + Tailwind CSS + shadcn/ui + Radix UI. Backend (later): Node.js + TypeScript + Express.js. Database (later): MongoDB + Mongoose. | 2026-10-30 | Product owner | Approved in Architecture Decisions v1.1 |
| D-04 | Approve initial networks and testnets | **Ethereum Sepolia Testnet only (Chain ID: 11155111).** EVM wallet integration via Wagmi + Viem. Centralized network configuration (`src/config/chains.ts`) enables future network additions without redesigning wallet state. | 2026-10-30 | Product owner | Approved initial network scope for Milestone 1-B |

---

## Pending Decisions

| ID | Decision required | Why it matters | Status |
|---|---|---|---|
| D-05 | Approve token standards and configurable features | Token factory design and security review scope | PENDING |
| D-06 | Choose upgrade pattern and authority per contract family | Stable-address upgrade requirement | PENDING |
| D-07 | Exchange: market analytics only or actual trading | Major scope, security and integration difference | PENDING |
| D-08 | Select market-data sources and attribution policy | Credible price/chart data; no fabricated values | PENDING |
| D-09 | Define KYC requirements, jurisdictions and provider | Privacy, compliance, cost and UX | PENDING |
| D-10 | Define project review and anti-scam policy | Evidence-based trust labels | PENDING |
| D-11 | Define admin/reviewer roles and approvals | Moderation and privileged operations | PENDING |
| D-12 | Define fee/revenue model and launch economics | Contracts, disclosures and UI | PENDING |
| D-13 | Responsive web only or mobile app too | UX scope and release planning | PENDING |
| D-14 | Terms, privacy, risk disclosures and regional availability | Public launch readiness | PENDING |

---

## Change Record

| Date | Change | Reason | Author |
|---|---|---|---|
| 2026-10-30 | Milestone 1-A initiated; documentation scaffold created | Phase 0 exit criteria met | Antigravity |
| 2026-10-30 | Milestone 1-B: D-04 resolved (Sepolia Testnet only); Wagmi + Viem Web3 wallet integration completed | Approved network scope implementation | Antigravity |
