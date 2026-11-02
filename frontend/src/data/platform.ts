/**
 * Platform-wide content and curated selections.
 * Keep IDs here rather than scattering catalog-specific choices across pages.
 */
export const FEATURED_TOKEN_IDS = ["prominers", "quantum", "zkpv", "ccat"] as const;

export const TOKEN_CATEGORIES: string[] = [
  "Governance",
  "DeFi",
  "Infrastructure",
  "AI & Compute",
  "Security & Privacy",
  "DePIN",
  "Meme & Community",
];

export const HOME_PRINCIPLES = [
  {
    icon: "blocks",
    eyebrow: "THE FOUNDATION",
    title: "One path from idea to launch",
    description: "Bring token setup, launch planning and community activity into a connected workflow instead of juggling disconnected tools.",
  },
  {
    icon: "wallet",
    eyebrow: "YOUR ASSETS",
    title: "Your wallet stays yours",
    description: "Connect when you choose and use your wallet to access the parts of the ecosystem relevant to your project.",
  },
  {
    icon: "shield-check",
    eyebrow: "CLEAR DECISIONS",
    title: "Clarity at every step",
    description: "See the key details behind project actions and participation flows before you decide what to do next.",
  },
] as const;

// Homepage capability cards. Icon keys are resolved by the component.
export const HOME_CAPABILITIES = [
  {
    number: "01",
    eyebrow: "TOKEN STUDIO",
    icon: "coins",
    title: "Bring your token to life.",
    description:
      "Set up the essentials, review the details and move from an idea to a deployed token through a guided flow.",
    href: "/tokens/create",
    action: "Create a token",
    surface: "bg-[#21151d]",
    glow: "rgba(236, 72, 153, 0.18)",
    colors: [[236, 72, 153], [168, 85, 247]],
  },
  {
    number: "02",
    eyebrow: "LAUNCHPAD",
    icon: "rocket",
    title: "Take your project to market.",
    description:
      "Shape a launch, configure a presale and give supporters a clear way to discover your project.",
    href: "/launchpad",
    action: "Explore launches",
    surface: "bg-[#171a25]",
    glow: "rgba(99, 102, 241, 0.2)",
    colors: [[99, 102, 241], [59, 130, 246]],
  },
  {
    number: "03",
    eyebrow: "COMMUNITY CAMPAIGNS",
    icon: "gift",
    title: "Turn attention into participation.",
    description:
      "Create airdrop campaigns, define participation requirements and bring your community into the journey.",
    href: "/airdrops",
    action: "View campaigns",
    surface: "bg-[#241316]",
    glow: "rgba(248, 113, 113, 0.18)",
    colors: [[248, 113, 113], [217, 70, 239]],
  },
  {
    number: "04",
    eyebrow: "STAKING",
    icon: "layers3",
    title: "Give holders a reason to stay.",
    description:
      "Explore staking pools and participation options that help keep your ecosystem active beyond launch.",
    href: "/staking",
    action: "Explore staking",
    surface: "bg-[#171b20]",
    glow: "rgba(45, 212, 191, 0.16)",
    colors: [[45, 212, 191], [99, 102, 241]],
  },
  {
    number: "05",
    eyebrow: "WALLET & ASSETS",
    icon: "wallet",
    title: "Keep your assets in view.",
    description:
      "Connect your wallet and review supported assets and balances from one dedicated workspace.",
    href: "/account/wallets",
    action: "Open wallet",
    surface: "bg-[#1c1727]",
    glow: "rgba(167, 139, 250, 0.2)",
    colors: [[167, 139, 250], [96, 165, 250]],
  },
  {
    number: "06",
    eyebrow: "MARKET DISCOVERY",
    icon: "blocks",
    title: "Find what is moving.",
    description:
      "Browse tokens and market activity to discover projects and keep up with the wider ecosystem.",
    href: "/exchange",
    action: "Explore markets",
    surface: "bg-[#1b1b1a]",
    glow: "rgba(251, 191, 36, 0.15)",
    colors: [[251, 191, 36], [249, 115, 22]],
  },
] as const;

/** Illustrative tokenomics allocation model. Values are not on-chain holder data. */
export const TOKENOMICS_ALLOCATION_TEMPLATES = [
  { label: "Ecosystem Rewards & Incentives", pct: 35, color: "bg-sky-400" },
  { label: "Public Sale & Liquidity Seed", pct: 25, color: "bg-emerald-400" },
  { label: "Protocol Staking Vaults", pct: 20, color: "bg-violet-400" },
  { label: "Core Contributors & Advisors", pct: 12, color: "bg-amber-400" },
  { label: "Community Treasury", pct: 8, color: "bg-pink-400" },
] as const;

/** Illustrative holder distribution; addresses are display placeholders, not verified holders. */
export const TOKEN_HOLDER_ALLOCATION_TEMPLATES = [
  { name: "Protocol Treasury & Governance", addressFallback: "0x18F4...9A21", percentage: 35, type: "Multi-Sig Treasury", addressSource: "project-owner" },
  { name: "Staking & Liquidity Rewards", addressFallback: "0x772A...4D91", percentage: 25, type: "Reward Contract" },
  { name: "Public Sale & Fair Distribution", addressFallback: "0x42B1...1E03", percentage: 20, type: "Community Allocations" },
  { name: "Core Contributors & Ecosystem Reserve", addressFallback: "0x892A...A7D1", percentage: 12, type: "Vested (24 Months)", addressSource: "token-creator" },
  { name: "DEX AMM Liquidity Vault", addressFallback: "0x61E3...5B22", percentage: 8, type: "Liquidity Pool" },
] as const;

/** Fake transfer rows used only to demonstrate the token-detail table UI. */
export const SIMULATED_TRANSFER_TEMPLATES = [
  { hash: "0x8a92b4c1d3e5f7a9b0c2d4e6f8a1b3c5d7e9f0a2", method: "Transfer", from: "0x18F4...9A21 (Treasury)", to: "0x772A...4D91 (Rewards Vault)", amountRatio: 0.005, age: "18 mins ago", block: 6812490 },
  { hash: "0x4b7c9e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d", method: "Transfer", from: "0x61E3...5B22 (DEX Pool)", to: "0x3918...4920", amountRatio: 0.001, age: "2 hours ago", block: 6811980 },
  { hash: "0x1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e", method: "Transfer", from: "0x892A...A7D1 (Deployer)", to: "0x61E3...5B22 (DEX Pool)", amountRatio: 0.02, age: "1 day ago", block: 6808420 },
  { hash: "0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d", method: "Transfer", from: "0x892A...A7D1 (Deployer)", to: "0x18F4...9A21 (Treasury)", amountRatio: 0.35, age: "3 days ago", block: 6799400 },
  { hash: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f", method: "Initial Mint", from: "0x0000...0000 (Genesis)", to: "0x892A...A7D1 (Deployer)", amountRatio: 1, ageSource: "created-at", block: 6701000 },
] as const;
