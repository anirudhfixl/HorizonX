// Centralized Image and Media Resolver
// Resolves local artwork assets, remote URLs, and fallbacks with aspect ratio preservation.

export type MediaKind = 'token' | 'project' | 'airdrop' | 'launchpad' | 'staking' | 'partner' | 'avatar' | 'banner';

export interface ImageResolveOptions {
  kind?: MediaKind;
  id?: string;
  fallback?: string;
}

const DEFAULT_ARTWORK_FALLBACKS: Record<MediaKind, string> = {
  token: '/images/Tokens_new/Token1.avif',
  project: '/artwork/aether-frames-1.svg',
  airdrop: '/artwork/copper-signal-banner.svg',
  launchpad: '/artwork/glasswardens-banner.svg',
  staking: '/artwork/helix-garden-banner.svg',
  partner: '/artwork/lumen-relics-1.svg',
  avatar: '/artwork/drift-avatars-1.svg',
  banner: '/artwork/night-market-banner.svg',
};

/**
 * Resolves an image source safely.
 * Returns local asset paths, remote URLs, or domain-appropriate default artwork.
 */
export function resolveImageSource(src?: string | null, options: ImageResolveOptions = {}): string {
  const { kind = 'project', fallback } = options;

  if (src && typeof src === 'string' && src.trim().length > 0) {
    const trimmed = src.trim();
    // Valid remote URL or absolute path in public
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/') || trimmed.startsWith('data:')) {
      return trimmed;
    }
    // Relative path normalized to root-relative
    return `/${trimmed}`;
  }

  if (fallback) {
    return fallback;
  }

  return DEFAULT_ARTWORK_FALLBACKS[kind] || '/artwork/aether-frames-1.svg';
}

/**
 * Generates an accessible, branded SVG placeholder if an image fails to load entirely
 */
export function getInlineFallbackSvg(label = 'HorizonX', kind: MediaKind = 'project'): string {
  const colors: Record<MediaKind, [string, string]> = {
    token: ['#ec4899', '#8b5cf6'],
    project: ['#6366f1', '#3b82f6'],
    airdrop: ['#f87171', '#d946ef'],
    launchpad: ['#2dd4bf', '#6366f1'],
    staking: ['#10b981', '#06b6d4'],
    partner: ['#fbbf24', '#f97316'],
    avatar: ['#a855f7', '#6366f1'],
    banner: ['#1e1b4b', '#0f172a'],
  };

  const [c1, c2] = colors[kind] || colors.project;
  const escapedLabel = label.replace(/[<>&"]/g, '');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="${c2}" stop-opacity="0.1"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="#0a0a0f"/>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <circle cx="200" cy="140" r="50" fill="none" stroke="${c1}" stroke-width="2" stroke-opacity="0.4"/>
    <text x="200" y="145" text-anchor="middle" dominant-baseline="middle" fill="#f8fafc" font-family="system-ui, sans-serif" font-weight="600" font-size="14" letter-spacing="1.5">
      ${escapedLabel}
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

