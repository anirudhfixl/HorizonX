# CONTRACT_SPECIFICATION.md

> **Baseline version:** 1.0 | **Architecture decisions:** 1.1 | **Last updated:** 2026-10-30  
> **Status:** PENDING — no production contracts may deploy until architecture, authority, upgrade procedure, tests and independent security review are approved.

---

## Contract families (planned)

| Contract family | Purpose | Status |
|---|---|---|
| Token factory | Deploy ERC-20 (or other standard) tokens with configurable features | PENDING D-04/D-05 |
| Presale | Manage fundraising lifecycle, participant contributions and finalization | PENDING D-04/D-05 |
| Fair launch | Separate launch model with defined eligibility rules | PENDING D-04/D-05 |
| Airdrop / distributor | Distribute tokens to eligible recipients; Merkle distribution if approved | PENDING D-04/D-05 |
| Staking pool | Lock tokens for rewards; manage lock periods and early exit | PENDING D-04/D-05/D-06 |

---

## Required decisions before any contract deployment

| Decision | ID | Status |
|---|---|---|
| Approved networks and testnets | D-04 | PENDING |
| Token standards and optional features (mint, burn, pause, fees) | D-05 | PENDING |
| Upgrade pattern (transparent proxy, UUPS, beacon, immutable) | D-06 | PENDING |
| Upgrade authority (owner, multisig, governance, timelock) | D-06 | PENDING |
| Fee / revenue model | D-12 | PENDING |

---

## Upgrade pattern requirements (baseline §8)

- No production contract deploys without choosing an upgrade pattern (if upgradeable) or confirming immutable.
- Proxy pattern must be designed from the beginning; it cannot be added later.
- Storage compatibility, initializer safety, upgrade authorization, emergency controls and monitoring are essential.
- Upgradeability adds governance/trust risk and must be disclosed to users.

---

## Security requirements

- Contract tests and independent security review required before mainnet.
- Static analysis (e.g. Slither) must be run and results reviewed.
- No production claim may be made based only on testnet deployment.
- Privileged roles (owner, admin, upgrader) must use least-privilege and consider multisig/timelock.
- Emergency pause functionality should be considered per contract family.

---

## Toolchain (approved, pending network decisions)

| Tool | Purpose |
|---|---|
| Solidity | Contract language |
| OpenZeppelin | Battle-tested base contracts |
| Hardhat | Development, testing and deployment |
| Viem / Wagmi | Frontend contract interaction |

---

## Network record template (fill in when D-04 resolved)

| Field | Value |
|---|---|
| Network name | |
| Chain ID | |
| Native currency | |
| Block explorer | |
| RPC provider | |
| Indexer/subgraph support | |
| Wallet compatibility | |
| Status | Testnet / Production |
