// src/config/navigation.ts
// Centralized navigation configuration for ProMiners.
// All routes must match canonical routes in MODULE_INVENTORY.md.
// Do not scatter navigation items in components.

export interface NavItem {
  label: string;
  href?: string;
  description?: string;
  children?: NavItem[];
  requiresWallet?: boolean;
  badge?: string;
}

// ─── Top navigation items ──────────────────────────────────────────────────────

export const TOP_NAV_ITEMS: NavItem[] = [
  {
    label: 'Explore',
    description: 'Discover projects, tokens and campaigns',
    children: [
      { label: 'All', href: '/explore', description: 'Discovery hub' },
      { label: 'Tokens', href: '/tokens', description: 'Browse all tokens' },
      { label: 'Projects', href: '/explore/projects', description: 'Browse all projects' },
      { label: 'Presales', href: '/explore/presales', description: 'Upcoming and live presales' },
      { label: 'Fair Launches', href: '/explore/launches', description: 'Fair launch listings' },
      { label: 'Airdrops', href: '/explore/airdrops', description: 'Airdrop campaigns' },
      { label: 'Staking', href: '/explore/staking', description: 'Staking pool discovery' },
    ],
  },
  {
    label: 'Projects',
    href: '/explore/projects',
    description: 'Discover ecosystem projects',
  },
  {
    label: 'Tokens',
    href: '/tokens',
    children: [
      { label: 'Token Directory', href: '/tokens', description: 'Browse, search and filter all tokens' },
      { label: 'My Tokens', href: '/tokens/my', description: 'Your created and managed tokens', requiresWallet: true },
      { label: 'Create Token', href: '/tokens/create', description: 'Deploy and register a new token', requiresWallet: true },
    ],
  },
  {
    label: 'Launchpad',
    href: '/launchpad',
    children: [
      { label: 'Launchpad', href: '/launchpad', description: 'Presales and fair launches overview' },
      { label: 'Presales', href: '/launchpad/presales', description: 'All presale campaigns' },
      { label: 'Fair Launches', href: '/launchpad/launches', description: 'All fair launches' },
    ],
  },
  {
    label: 'Airdrops',
    href: '/airdrops',
    children: [
      { label: 'Airdrop Hub', href: '/airdrops', description: 'Airdrop dashboard and stats' },
      { label: 'All Campaigns', href: '/airdrops/campaigns', description: 'Browse all campaigns' },
      { label: 'My Campaigns', href: '/airdrops/my', description: 'Your campaigns', requiresWallet: true },
      { label: 'Claim Airdrop', href: '/airdrops/claim', description: 'Claim eligible airdrops', requiresWallet: true },
    ],
  },
  {
    label: 'Staking',
    href: '/staking',
    children: [
      { label: 'Staking Dashboard', href: '/staking', description: 'Overview and stats' },
      { label: 'All Pools', href: '/staking/pools', description: 'Browse staking pools' },
      { label: 'My Positions', href: '/staking/my', description: 'Your staking positions', requiresWallet: true },
    ],
  },
  {
    label: 'Markets',
    href: '/exchange',
    children: [
      { label: 'Market Overview', href: '/exchange/markets', description: 'Market data and analytics' },
      { label: 'Watchlist', href: '/exchange/watchlist', description: 'Your watched tokens', requiresWallet: true },
    ],
  },
];

// ─── Create dropdown items ─────────────────────────────────────────────────────
// These are shortcuts to canonical creation routes, not separate modules.

export const CREATE_ITEMS: NavItem[] = [
  { label: 'Create Token', href: '/tokens/create', requiresWallet: true },
  { label: 'Create Presale', href: '/launchpad/presales/create', requiresWallet: true },
  { label: 'Create Fair Launch', href: '/launchpad/launches/create', requiresWallet: true },
  { label: 'Create Airdrop', href: '/airdrops/campaigns/create', requiresWallet: true },
  { label: 'Create Staking Pool', href: '/staking/pools/create', requiresWallet: true },
];

// ─── User / profile dropdown items ───────────────────────────────────────────

export const USER_MENU_ITEMS: NavItem[] = [
  { label: 'My Account', href: '/account', requiresWallet: true },
  { label: 'My Projects', href: '/projects/my', requiresWallet: true },
  { label: 'My Tokens', href: '/tokens/my', requiresWallet: true },
  { label: 'My Campaigns', href: '/airdrops/my', requiresWallet: true },
  { label: 'Partner Portal', href: '/partners', requiresWallet: true },
  { label: 'Settings', href: '/account/preferences', requiresWallet: true },
];

// ─── Footer nav ────────────────────────────────────────────────────────────────

export const FOOTER_NAV: Record<string, NavItem[]> = {
  Explore: [
    { label: 'Ecosystem', href: '/explore' },
    { label: 'Tokens', href: '/tokens' },
    { label: 'Launchpad', href: '/launchpad' },
    { label: 'Airdrops', href: '/airdrops' },
    { label: 'Staking', href: '/staking' },
  ],
  Resources: [
    { label: 'Documentation', href: '/docs' },
    { label: 'Guides & FAQ', href: '/docs/guides' },
    { label: 'Risk Disclosure', href: '/docs/risk' },
    { label: 'Terms of Service', href: '/docs/terms' },
    { label: 'Privacy Policy', href: '/docs/privacy' },
  ],
  Connect: [
    { label: 'X / Twitter', href: 'https://x.com/prominers' },
    { label: 'Discord', href: 'https://discord.gg/prominers' },
    { label: 'GitHub', href: 'https://github.com/prominers' },
    { label: 'Contact', href: 'mailto:hello@prominers.io' },
  ],
};
