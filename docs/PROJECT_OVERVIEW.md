# PROJECT_OVERVIEW.md

> **Baseline version:** 1.0 | **Architecture decisions:** 1.1 | **Last updated:** 2026-10-30

---

## Product Vision

ProMiners is a unified **Web2 + Web3 platform** through which project owners can create and manage blockchain-based projects and digital assets, while visitors and community members can discover projects, inspect public on-chain information, review campaigns and market data, and use eligible platform features.

The product supports a coherent lifecycle:
> Create an asset or project → configure its launch → make it discoverable → build community participation → distribute rewards → support staking or other utilities → monitor activity.

---

## What ProMiners Is

- A single consistent web application for project creation, discovery, management and public information.
- A platform with clear separation between off-chain application records and on-chain blockchain facts.
- A public-first discovery experience that does not require every visitor to connect a wallet.
- A wallet-gated action layer only when a feature needs ownership, authorization or transaction signing.
- A trust, privacy, security and verification layer built into the product from the start.

## What ProMiners Is Not

- Not merely a token generator — token creation is one capability within a larger ecosystem.
- Not automatically an exchange — trading requires a supported venue, liquidity and reliable market-data integration.
- Not a safety guarantee — no verification, audit or KYC claim makes a project safe.
- Not decentralized in operations controlled by the platform backend.

---

## User Groups

| User group | Typical needs | Access model |
|---|---|---|
| Public visitor | Explore projects, tokens, launches, campaigns, contract and market information | Public read; no wallet required |
| Wallet-connected user | View wallet-linked activity; use eligible claims and participation features | Wallet connection proves address control for the session |
| Project owner / creator | Create and manage tokens, launches, campaigns and pools | Wallet ownership + explicit platform authorization |
| Partner / affiliate | Manage referral links, attribution and eligible partner information | Role/permission controlled (pending D-11) |
| Administrator / reviewer | Review reports, manage configuration, moderate and oversee verification | Privileged role; strong authentication; least privilege; audit logging |

---

## Product Modules

| Module | Purpose |
|---|---|
| Home | Ecosystem overview, statistics, recent activity, featured projects, quick actions |
| Explore | Cross-module discovery hub for tokens, projects, presales, launches, airdrops and staking |
| Tokens | Token creation, discovery, detail, contract info, holders/activity, market data |
| Launchpad | Presales and fair launches — creation, listing, details, participation, management |
| Airdrops | Campaign creation, listings, eligibility, claims, distribution and activity |
| Staking | Pool creation, discovery, details, positions, rewards and activity |
| Exchange / Markets | Market overview, charts, pair/pool details, watchlists (trading scope PENDING D-07) |
| Projects | Project owner area — my projects, details, settings, related assets |
| Partners | Partner portal — referral links, attribution, eligible rewards |
| Account | Profile, wallet connections, verification, preferences, security, notifications |
| Docs / Help | Guides, FAQs, network information, risk disclosures and troubleshooting |

---

## Architecture Summary

| Layer | Approved choice | Status |
|---|---|---|
| Frontend | Next.js (App Router) + React + TypeScript | APPROVED — Milestone 1-A |
| Styling | Tailwind CSS + shadcn/ui + Radix UI | APPROVED — Milestone 1-A |
| Backend | Node.js + TypeScript + Express.js | LATER PHASE |
| Database | MongoDB + Mongoose | LATER PHASE |
| Wallet | Wagmi + Viem | LATER PHASE (D-04 PENDING) |
| Contracts | Solidity + OpenZeppelin + Hardhat | LATER PHASE (D-05, D-06 PENDING) |
| Deployment | Vercel (frontend) | LATER PHASE |

---

## Key Principles

1. **Understand before implementing** — Inventory pages, states, dialogs, roles, dependencies and expected outcomes before coding.
2. **Module-by-module delivery** — Complete one bounded module, test it, update progress and review before moving on.
3. **Placeholder-first shell** — Establish routes, page shells, navigation and consistent placeholders for full agreed scope before deep implementation.
4. **Dashboard-first IA** — Tokens, Airdrops, Presales and Staking each get an overview dashboard, then listings, details and management views.
5. **Modal inventory first** — Document each modal's trigger, purpose, fields, validation, actions, states, close behavior and data effects.
6. **Truthful trust indicators** — Separate wallet ownership, identity checks, project review, contract verification, audit status and risk signals.
7. **No fake functionality** — No dead buttons, fake success, fabricated chart data or placeholder controls presented as production features.
8. **Public-first discovery** — Public visitors can inspect public information without unnecessary wallet gating.
