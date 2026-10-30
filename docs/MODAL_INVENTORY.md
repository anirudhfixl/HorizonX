# MODAL_INVENTORY.md

> **Baseline version:** 1.0 | **Architecture decisions:** 1.1 | **Last updated:** 2026-10-30  
> **Status key:** SPECIFIED | BUILT | TESTED | BLOCKED | PENDING SPEC

---

## Reconciliation note (Milestone 0 → Milestone 1-A)

18 modal candidates were identified in Milestone 0 from baseline Section 6.2 (Table 6). After cross-referencing:
- All 18 are retained — each has a clear baseline rationale.
- No additional modals added beyond baseline without approval.
- The global modal infrastructure (foundation) is built in Milestone 1-A.
- Individual feature modals are implemented in their respective module phases.

---

## Modal specification fields (required for each modal before implementation)

Every modal must document: ID, name, owning module, trigger, purpose, input fields, validation rules, primary/secondary/destructive actions, all UI states (initial, editing, submitting, success, partial success, failure, disabled), dismissal behavior, permissions, data effects, and accessibility/test checklist.

---

## Global / Shared Modals (required from Phase 1)

### M-01 — Connect Wallet

| Field | Value |
|---|---|
| **ID** | M-01 |
| **Name** | Connect Wallet |
| **Module** | Shared / Global |
| **Trigger** | "Connect Wallet" button in top nav; any wallet-gated action when disconnected |
| **Purpose** | Let user choose a wallet provider and establish a session connection |
| **Inputs** | Provider selection (list of supported providers — PENDING D-04) |
| **States** | Idle → Connecting → Connected → Error (rejected / unsupported network) |
| **Actions** | Select provider, Cancel |
| **Dismissal** | Escape key, backdrop click, Cancel button; no unsaved data |
| **Permissions** | Public (any visitor can attempt to connect) |
| **Data effects** | Establishes wallet session; does NOT store private keys or seed phrases |
| **Phase** | 1 (placeholder — no live wallet until D-04 resolved) |
| **Status** | SPECIFIED — awaiting D-04 for provider list |

---

### M-02 — Wallet Details

| Field | Value |
|---|---|
| **ID** | M-02 |
| **Name** | Wallet Details |
| **Module** | Shared / Global |
| **Trigger** | Click on connected wallet address/avatar in top nav |
| **Purpose** | Show connected address, network, session actions; never expose secrets |
| **Inputs** | None (read-only display) |
| **States** | Connected; Unsupported network warning |
| **Actions** | Copy address, View on explorer, Switch network (PENDING D-04), Disconnect |
| **Dismissal** | Escape key, backdrop click, clicking away |
| **Permissions** | Wallet-connected users only |
| **Data effects** | Disconnect clears session state only |
| **Phase** | 1 (placeholder) |
| **Status** | SPECIFIED |

---

### M-03 — Transaction Status

| Field | Value |
|---|---|
| **ID** | M-03 |
| **Name** | Transaction Status |
| **Module** | Shared / Global |
| **Trigger** | Any blockchain transaction submission |
| **Purpose** | Show transaction lifecycle: pending → confirmed / failed / replaced |
| **States** | Pending, Confirmed, Failed, Replaced, Unknown |
| **Actions** | View on explorer (conditional), Close (only after terminal state) |
| **Dismissal** | Only after terminal state; not dismissible while pending |
| **Permissions** | Wallet-connected users |
| **Data effects** | Read-only; reflects chain state |
| **Phase** | 3 (with first on-chain feature) |
| **Status** | SPECIFIED |

---

### M-04 — Delete / Cancel Confirmation

| Field | Value |
|---|---|
| **ID** | M-04 |
| **Name** | Delete / Cancel Confirmation |
| **Module** | Shared / Global |
| **Trigger** | Any destructive action (delete project, cancel presale, remove campaign) |
| **Purpose** | Confirm destructive actions; distinguish off-chain deletion from on-chain effects |
| **Inputs** | Optional confirmation text for high-risk actions |
| **States** | Idle, Confirming, Success, Error |
| **Actions** | Confirm (destructive), Cancel |
| **Dismissal** | Escape key, Cancel button; backdrop click cancels (does not confirm) |
| **Permissions** | Owner-level minimum |
| **Phase** | 1 (foundation — reusable) |
| **Status** | SPECIFIED |

---

### M-05 — Filter / Sort Drawer

| Field | Value |
|---|---|
| **ID** | M-05 |
| **Name** | Filter / Sort Drawer |
| **Module** | Shared / Global |
| **Trigger** | "Filters" button on any listing page (mobile and desktop) |
| **Purpose** | Mobile-friendly listing filter panel |
| **Inputs** | Filter groups specific to the hosting listing page |
| **States** | Idle, Applying |
| **Actions** | Apply, Clear All, Close |
| **Dismissal** | Close button, Escape, backdrop |
| **Permissions** | Public |
| **Phase** | 1 (foundation) |
| **Status** | SPECIFIED |

---

### M-06 — Risk Warning

| Field | Value |
|---|---|
| **ID** | M-06 |
| **Name** | Risk Warning |
| **Module** | Shared / Global |
| **Trigger** | Unverified contract, unusual permissions or risk signals detected; user attempts high-risk action |
| **Purpose** | Explain risk signals without claiming certainty; require explicit acknowledgement |
| **Inputs** | Checkbox: "I understand this project/token has not been verified" |
| **States** | Idle, Acknowledged |
| **Actions** | Acknowledge and continue, Cancel |
| **Dismissal** | Cancel only (not by Escape/backdrop to prevent accidental acknowledgement) |
| **Permissions** | Public (shown to any user before a risky action) |
| **Phase** | 3 |
| **Status** | SPECIFIED |

---

### M-07 — Notification / Activity Details

| Field | Value |
|---|---|
| **ID** | M-07 |
| **Name** | Notification / Activity Details |
| **Module** | Shared / Global |
| **Trigger** | Click on a notification or activity feed item |
| **Purpose** | Show selected event details and navigation destination |
| **Inputs** | None (read-only) |
| **States** | Loading, Loaded, Error |
| **Actions** | View detail page, Close |
| **Dismissal** | Escape, backdrop, Close button |
| **Permissions** | Wallet-connected users (for personalized notifications) |
| **Phase** | 8 |
| **Status** | PENDING SPEC |

---

## Token Module Modals (Phase 3)

### M-08 — Create Token Wizard

| Field | Value |
|---|---|
| **ID** | M-08 |
| **Name** | Create Token Wizard |
| **Module** | Tokens |
| **Trigger** | "Create Token" CTA in top nav Create dropdown or Token dashboard |
| **Purpose** | Collect token details and configuration; review before deployment |
| **Steps** | 1. Basic info (name, symbol, description, logo) → 2. Network & standard (PENDING D-04/D-05) → 3. Supply & decimals → 4. Optional features (PENDING D-05) → 5. Review |
| **States** | Each step: Idle, Validating, Error; overall: Submitting, Success, Failed |
| **Actions** | Next, Back, Submit (deploy), Cancel |
| **Dismissal** | Cancel button with unsaved-change warning; Escape triggers warning |
| **Permissions** | Wallet-connected |
| **Data effects** | Off-chain draft creation; on-chain deployment transaction (PENDING D-04/D-05) |
| **Phase** | 3 |
| **Status** | SPECIFIED — full implementation BLOCKED on D-04/D-05 |

---

### M-09 — Token Deployment Review

| Field | Value |
|---|---|
| **ID** | M-09 |
| **Name** | Token Deployment Review |
| **Module** | Tokens |
| **Trigger** | Final step of Create Token Wizard when deployment is enabled |
| **Purpose** | Show network, deployer, configuration and estimated costs; require explicit confirmation |
| **States** | Review, Confirming, Deploying, Success, Failed |
| **Actions** | Confirm Deploy, Back, Cancel |
| **Dismissal** | Back or Cancel; not dismissible while deploying |
| **Permissions** | Wallet-connected; owner only |
| **Phase** | 3 |
| **Status** | SPECIFIED — BLOCKED on D-04/D-05 |

---

## Launchpad Modals (Phase 4)

### M-10 — Create Presale Wizard

| Field | Value |
|---|---|
| **ID** | M-10 |
| **Name** | Create Presale Wizard |
| **Module** | Launchpad |
| **Trigger** | "Create Presale" CTA in Launchpad dashboard or Create dropdown |
| **Purpose** | Collect token, timing, limits, terms and rules; validate dependencies |
| **Steps** | 1. Token selection → 2. Schedule & limits → 3. Participation rules → 4. Review |
| **States** | Per-step validation; overall: Submitting, Success, Failed |
| **Actions** | Next, Back, Submit, Cancel |
| **Dismissal** | Cancel with unsaved-change warning |
| **Permissions** | Wallet-connected; project owner |
| **Phase** | 4 |
| **Status** | SPECIFIED — BLOCKED on D-04/D-05 |

---

### M-11 — Create Fair Launch Wizard

| Field | Value |
|---|---|
| **ID** | M-11 |
| **Name** | Create Fair Launch Wizard |
| **Module** | Launchpad |
| **Trigger** | "Create Fair Launch" CTA |
| **Purpose** | Collect launch model, eligibility and configuration; separate from presale |
| **Steps** | 1. Launch model & rules → 2. Eligibility → 3. Configuration → 4. Review |
| **States** | Per-step validation; overall: Submitting, Success, Failed |
| **Actions** | Next, Back, Submit, Cancel |
| **Permissions** | Wallet-connected; project owner |
| **Phase** | 4 |
| **Status** | PENDING SPEC — Fair Launch rules require separate documentation (baseline §9.2) |

---

### M-12 — Participation Confirmation

| Field | Value |
|---|---|
| **ID** | M-12 |
| **Name** | Participation Confirmation |
| **Module** | Launchpad / Shared |
| **Trigger** | "Participate" action on presale or fair launch detail page |
| **Purpose** | Explain campaign/launch conditions before authorization |
| **States** | Review, Confirming, Success, Failed |
| **Actions** | Confirm, Cancel |
| **Dismissal** | Cancel; not dismissible while confirming |
| **Permissions** | Wallet-connected |
| **Phase** | 4 |
| **Status** | PENDING SPEC |

---

## Airdrop Modals (Phase 5)

### M-13 — Create Airdrop Wizard

| Field | Value |
|---|---|
| **ID** | M-13 |
| **Name** | Create Airdrop Campaign Wizard |
| **Module** | Airdrops |
| **Trigger** | "Create Airdrop" CTA in Airdrops dashboard or Create dropdown |
| **Purpose** | Campaign type, eligibility, recipients/distribution, schedule and reward |
| **Steps** | 1. Campaign type → 2. Token & reward → 3. Eligibility → 4. Distribution → 5. Schedule → 6. Review |
| **States** | Per-step validation; overall: Submitting, Success, Failed |
| **Actions** | Next, Back, Submit, Cancel |
| **Permissions** | Wallet-connected; project owner |
| **Phase** | 5 |
| **Status** | PENDING SPEC — Merkle root generation must be specified |

---

### M-14 — Claim Confirmation

| Field | Value |
|---|---|
| **ID** | M-14 |
| **Name** | Claim Confirmation |
| **Module** | Airdrops |
| **Trigger** | "Claim" action on eligible airdrop |
| **Purpose** | Explain eligibility, reward, network and transaction before signing |
| **States** | Eligibility check, Review, Claiming, Success, Failed, Already Claimed |
| **Actions** | Confirm Claim, Cancel |
| **Dismissal** | Cancel; not dismissible while claiming |
| **Permissions** | Wallet-connected; eligible address |
| **Phase** | 5 |
| **Status** | PENDING SPEC |

---

## Staking Modals (Phase 6)

### M-15 — Create Staking Pool Wizard

| Field | Value |
|---|---|
| **ID** | M-15 |
| **Name** | Create Staking Pool Wizard |
| **Module** | Staking |
| **Trigger** | "Create Pool" CTA in Staking dashboard or Create dropdown |
| **Purpose** | Token, duration, reward rules, caps and pool settings |
| **Steps** | 1. Token & duration → 2. Reward rules → 3. Caps & limits → 4. Review |
| **States** | Per-step validation; overall: Submitting, Success, Failed |
| **Actions** | Next, Back, Submit, Cancel |
| **Permissions** | Wallet-connected; project owner |
| **Phase** | 6 |
| **Status** | PENDING SPEC — BLOCKED on D-05/D-06 |

---

## Account Modals (Phase 8)

### M-16 — Edit Profile

| Field | Value |
|---|---|
| **ID** | M-16 |
| **Name** | Edit Profile |
| **Module** | Account |
| **Trigger** | "Edit" button on account profile page |
| **Purpose** | Update profile and public visibility settings |
| **Inputs** | Display name, bio, avatar upload, social links, public visibility toggle |
| **States** | Idle, Editing, Saving, Success, Error |
| **Actions** | Save, Cancel |
| **Dismissal** | Cancel with unsaved-change warning; Escape triggers warning |
| **Permissions** | Wallet-connected; own account |
| **Phase** | 8 |
| **Status** | PENDING SPEC |

---

## Trust / Privacy Modals (Phase 9)

### M-17 — KYC / Identity Verification

| Field | Value |
|---|---|
| **ID** | M-17 |
| **Name** | KYC / Identity Verification |
| **Module** | Account / Trust |
| **Trigger** | "Verify Identity" CTA in account verification page |
| **Purpose** | Explain provider, purpose, data collected, retention and consent before redirect/upload |
| **States** | Information, Consent, Redirecting, Pending (provider async), Verified, Rejected |
| **Actions** | Consent and continue, Cancel |
| **Dismissal** | Cancel; explicit consent must not be accidental |
| **Permissions** | Wallet-connected |
| **Data effects** | Redirects to specialist KYC provider (PENDING D-09); never stores identity data directly |
| **Phase** | 9 |
| **Status** | BLOCKED — D-09 PENDING |

---

### M-18 — Report Project / Token

| Field | Value |
|---|---|
| **ID** | M-18 |
| **Name** | Report Project / Token |
| **Module** | Shared |
| **Trigger** | "Report" button on token or project detail pages |
| **Purpose** | Collect report category and evidence; confirm submission |
| **Inputs** | Category (dropdown), Description (text), Evidence URL (optional) |
| **States** | Idle, Submitting, Success, Error |
| **Actions** | Submit report, Cancel |
| **Dismissal** | Escape key, Cancel button, backdrop click |
| **Permissions** | Any user (anonymous or connected) |
| **Phase** | 8 |
| **Status** | PENDING SPEC |

---

## Summary

| Phase | Modals | Status |
|---|---|---|
| Phase 1 — Foundation (global infrastructure) | M-01, M-02, M-04, M-05 | SPECIFIED |
| Phase 3 — Tokens | M-03, M-06, M-08, M-09 | SPECIFIED (M-08/M-09 BLOCKED on D-04/D-05) |
| Phase 4 — Launchpad | M-10, M-11, M-12 | SPECIFIED (M-10 BLOCKED on D-04/D-05) |
| Phase 5 — Airdrops | M-13, M-14 | PENDING SPEC |
| Phase 6 — Staking | M-15 | PENDING SPEC (BLOCKED on D-05/D-06) |
| Phase 8 — Account / Trust | M-07, M-16, M-18 | PENDING SPEC |
| Phase 9 — KYC | M-17 | BLOCKED — D-09 |
| **Total** | **18** | |
