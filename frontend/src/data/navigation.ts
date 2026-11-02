// Centralized navigation for every currently implemented ProMiners route.
// Keep dashboard/section landing pages first in each dropdown so every module
// has a predictable entry point, followed by its related testing routes.
export interface NavItem {
  label: string;
  href?: string;
  description?: string;
  children?: NavItem[];
  requiresWallet?: boolean;
  badge?: string;
}

export const TOP_NAV_ITEMS: NavItem[] = [
  {
    label: "Explore",
    href: "/explore",
    description: "Discover the ProMiners ecosystem",
  },
  {
    label: "Projects",
    href: "/projects",
    description: "Project directory and management",
  },
  {
    label: "Tokens",
    href: "/tokens",
    description: "Token directory, creation and management",
  },
  {
    label: "Launchpad",
    href: "/launchpad",
    description: "Presales and fair launch management",
  },
  {
    label: "Airdrops",
    href: "/airdrops",
    description: "Airdrop campaigns and claims",
  },
  {
    label: "Staking",
    href: "/staking",
    description: "Staking pools and positions",
    children: [
      { label: "Staking Dashboard", href: "/staking", description: "Staking overview" },
      { label: "All Pools", href: "/staking/pools", description: "Browse staking pools" },
      { label: "Create Pool", href: "/staking/pools/create", description: "Create a staking pool" },
      { label: "My Positions", href: "/staking/my", description: "View your staking positions", requiresWallet: true },
    ],
  },
  {
    label: "Markets",
    href: "/exchange",
    description: "Exchange markets and watchlists",
    children: [
      { label: "Markets Dashboard", href: "/exchange", description: "Exchange overview" },
      { label: "Market Directory", href: "/exchange/markets", description: "Browse market data" },
      { label: "Watchlist", href: "/exchange/watchlist", description: "Your watched tokens" },
      { label: "Token Market Details", href: "/exchange/markets", description: "Open a market to view its token details" },
    ],
  },
  {
    label: "Partners",
    href: "/partners",
    description: "Partner and referral portal",
    children: [
      { label: "Partner Dashboard", href: "/partners", description: "Partner overview" },
      { label: "Referrals", href: "/partners/referrals", description: "Referral activity and tracking" },
    ],
  },
  {
    label: "Account",
    href: "/account",
    description: "Profile and account settings",
    children: [
      { label: "Account Dashboard", href: "/account", description: "Account overview" },
      { label: "Edit Profile", href: "/account/edit", description: "Update profile information" },
      { label: "Wallets", href: "/account/wallets", description: "Manage connected wallets" },
      { label: "Verification", href: "/account/verification", description: "Account verification" },
      { label: "Security", href: "/account/security", description: "Security settings" },
      { label: "Preferences", href: "/account/preferences", description: "Application preferences" },
    ],
  },
  {
    label: "Docs",
    href: "/docs",
    description: "Documentation and platform guides",
    children: [
      { label: "Documentation Home", href: "/docs", description: "Browse documentation" },
      { label: "Guides", href: "/docs/guides", description: "Platform guides and FAQs" },
      { label: "Risk Disclosure", href: "/docs/risk", description: "Understand platform risks" },
      { label: "Terms of Service", href: "/docs/terms", description: "Platform terms" },
      { label: "Privacy Policy", href: "/docs/privacy", description: "Privacy information" },
    ],
  },
];

export const CREATE_ITEMS: NavItem[] = [
  { label: "Create Token", href: "/tokens/create" },
  { label: "Create Presale", href: "/launchpad/presales/create" },
  { label: "Create Fair Launch", href: "/launchpad/launches/create" },
  { label: "Create Airdrop", href: "/airdrops/campaigns/create" },
  { label: "Create Staking Pool", href: "/staking/pools/create" },
];

export const USER_MENU_ITEMS: NavItem[] = [
  { label: "My Account", href: "/account" },
  { label: "My Projects", href: "/projects/my" },
  { label: "My Tokens", href: "/tokens/my" },
  { label: "My Launches", href: "/launchpad/my" },
  { label: "My Campaigns", href: "/airdrops/my" },
  { label: "My Positions", href: "/staking/my" },
  { label: "Partner Portal", href: "/partners" },
  { label: "Settings", href: "/account/preferences" },
];

export const FOOTER_NAV: Record<string, NavItem[]> = {
  Explore: [
    { label: "Explore", href: "/explore" },
    { label: "Projects", href: "/projects" },
    { label: "Tokens", href: "/tokens" },
    { label: "Launchpad", href: "/launchpad" },
    { label: "Airdrops", href: "/airdrops" },
    { label: "Staking", href: "/staking" },
    { label: "Markets", href: "/exchange" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Guides & FAQ", href: "/docs/guides" },
    { label: "Risk Disclosure", href: "/docs/risk" },
    { label: "Terms of Service", href: "/docs/terms" },
    { label: "Privacy Policy", href: "/docs/privacy" },
  ],
  Connect: [
    { label: "X / Twitter", href: "https://x.com/prominers" },
    { label: "Discord", href: "https://discord.gg/prominers" },
    { label: "GitHub", href: "https://github.com/prominers" },
    { label: "Contact", href: "mailto:hello@prominers.io" },
  ],
};
