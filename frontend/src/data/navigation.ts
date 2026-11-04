// Centralized navigation for every currently implemented HorizonX route.
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
    description: "Discover the HorizonX ecosystem",
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
  },
  {
    label: "Markets",
    href: "/exchange",
    description: "Exchange markets and watchlists",
  },
  {
    label: "Partners",
    href: "/partners",
    description: "Partner and referral portal",
  },
  {
    label: "Account",
    href: "/account",
    description: "Profile and account settings",
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
