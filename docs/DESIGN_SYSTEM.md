# DESIGN_SYSTEM.md

> **Baseline version:** 1.0 | **Architecture decisions:** 1.1 | **Last updated:** 2026-10-30  
> **Stack:** Next.js + Tailwind CSS + shadcn/ui + Radix UI

---

## 1. Design Direction

- **Theme:** Dark-first (D-01 approved). Light theme planned for later phase.
- **Aesthetic:** Premium, coherent, modern. Not a copy of any reference product.
- **Brand name:** ProMiners (working name — D-01 final branding pending).
- **Motion:** Purposeful and restrained. No gratuitous animations.
- **Accessibility:** Keyboard navigation, visible focus rings, semantic labels, WCAG contrast targets, reduced-motion support.

---

## 2. Color System

Defined as CSS custom properties in `src/styles/globals.css` and mapped to Tailwind via `tailwind.config.ts`.

### Dark theme tokens (default)

| Token | CSS variable | Purpose |
|---|---|---|
| Background | `--background` | Page background |
| Foreground | `--foreground` | Primary text |
| Card | `--card` | Card/surface background |
| Card foreground | `--card-foreground` | Card text |
| Popover | `--popover` | Popover/dropdown background |
| Popover foreground | `--popover-foreground` | Popover text |
| Primary | `--primary` | Brand accent; CTAs |
| Primary foreground | `--primary-foreground` | Text on primary |
| Secondary | `--secondary` | Secondary surfaces |
| Secondary foreground | `--secondary-foreground` | Text on secondary |
| Muted | `--muted` | Subdued backgrounds |
| Muted foreground | `--muted-foreground` | Subdued text |
| Accent | `--accent` | Highlight, hover |
| Accent foreground | `--accent-foreground` | Text on accent |
| Destructive | `--destructive` | Errors, destructive actions |
| Destructive foreground | `--destructive-foreground` | Text on destructive |
| Border | `--border` | Dividers and borders |
| Input | `--input` | Input field borders |
| Ring | `--ring` | Focus ring |

### Semantic status colors

| Status | Token | Meaning |
|---|---|---|
| Active / Live | `--status-active` | A campaign, pool or token is live |
| Pending / Scheduled | `--status-pending` | Upcoming or awaiting action |
| Draft | `--status-draft` | Saved but not published |
| Ended / Complete | `--status-ended` | Lifecycle completed normally |
| Failed / Cancelled | `--status-failed` | Lifecycle ended abnormally |
| Unverified | `--status-unverified` | Not reviewed by the platform |
| Unknown | `--status-unknown` | State cannot be determined |

---

## 3. Typography

| Scale | Usage | Tailwind class |
|---|---|---|
| Display XL | Hero headings | `text-5xl font-bold tracking-tight` |
| Display L | Page titles | `text-4xl font-bold tracking-tight` |
| Heading 1 | Section headings | `text-3xl font-semibold` |
| Heading 2 | Card/panel headings | `text-2xl font-semibold` |
| Heading 3 | Sub-section headings | `text-xl font-semibold` |
| Body L | Lead paragraphs | `text-lg` |
| Body | Default body text | `text-base` |
| Body S | Secondary text | `text-sm` |
| Caption | Timestamps, labels | `text-xs` |
| Code | Addresses, hashes | `font-mono text-sm` |

**Font:** Inter (Google Fonts) — loaded via `next/font/google`.

---

## 4. Spacing

Tailwind default spacing scale. Key values:

| Token | Value | Usage |
|---|---|---|
| 1 | 4px | Tight spacing, icon padding |
| 2 | 8px | Compact padding |
| 3 | 12px | Default inner padding |
| 4 | 16px | Card padding, form fields |
| 6 | 24px | Section spacing |
| 8 | 32px | Large section gaps |
| 12 | 48px | Major layout sections |
| 16 | 64px | Hero sections |

---

## 5. Border Radius

| Token | CSS variable | Value | Usage |
|---|---|---|---|
| SM | `--radius-sm` | 4px | Badges, tags |
| Default | `--radius` | 8px | Cards, inputs, buttons |
| LG | `--radius-lg` | 12px | Modals, panels |
| XL | `--radius-xl` | 16px | Large cards |
| Full | — | 9999px | Pills, avatars |

---

## 6. Shadows

| Token | Usage |
|---|---|
| `shadow-sm` | Subtle card elevation |
| `shadow-md` | Dropdowns, popovers |
| `shadow-lg` | Modals |
| `shadow-xl` | Overlay panels |

---

## 7. Breakpoints

| Breakpoint | Width | Usage |
|---|---|---|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Wide desktop |
| `2xl` | 1536px | Ultra-wide |

**Mobile-first:** All base styles target mobile; breakpoints add desktop overrides.

---

## 8. Motion

- Transitions: 150ms ease for hover/focus; 200ms for open/close; 300ms for page transitions.
- No autoplay animations on load beyond a single fade-in.
- Respect `prefers-reduced-motion: reduce`.
- CSS custom property: `--transition-duration: 150ms`.

---

## 9. Component Inventory

> See `src/components/ui/` for implementations. Project-owned wrappers over shadcn/ui primitives.

| Component | Variants / notes | shadcn base |
|---|---|---|
| Button | `default`, `secondary`, `ghost`, `destructive`, `outline`, `link`; sizes `sm`, `default`, `lg`, `icon` | `button` |
| Input | Text, number, password, search; error/disabled states | `input` |
| Textarea | Resize control; character count | `textarea` |
| Select | Single, searchable | `select` |
| Checkbox | Group support | `checkbox` |
| Radio Group | — | `radio-group` |
| Switch / Toggle | — | `switch` |
| Form Field | Label, hint, error wrapper | `form` |
| Label | — | `label` |
| Card | Default, metric, interactive | `card` |
| Badge | Status variants: Draft/Pending/Active/Ended/Failed/Unverified/Unknown | `badge` |
| Separator | Horizontal and vertical | `separator` |
| Avatar | With fallback initials | `avatar` |
| Table | Sortable, loading/empty states | `table` |
| Tabs | Horizontal; scrollable mobile | `tabs` |
| Breadcrumb | — | `breadcrumb` |
| Dropdown Menu | Nested groups | `dropdown-menu` |
| Navigation Menu | Top nav dropdowns | `navigation-menu` |
| Dialog / Modal | SM/MD/LG/Full; header/body/footer slots | `dialog` |
| Drawer | Side panel; filter/mobile nav | `drawer` (vaul) |
| Sheet | Slide-in panel | `sheet` |
| Alert | Info/Warning/Error/Success | `alert` |
| Alert Dialog | Destructive confirm pattern | `alert-dialog` |
| Tooltip | — | `tooltip` |
| Popover | — | `popover` |
| Toast | Auto-dismiss; Info/Success/Warning/Error | `sonner` |
| Skeleton | Text/card/table row variants | `skeleton` |
| Spinner | SM/MD/LG loading indicator | Custom |
| Progress | Bar progress indicator | `progress` |
| ScrollArea | Custom scrollbars | `scroll-area` |
| Collapsible | Show/hide content | `collapsible` |
| Accordion | Expand/collapse groups | `accordion` |
| Command | Command palette / search | `command` |

**Feature-specific components (not in shared ui/):**

| Component | Module | Notes |
|---|---|---|
| MetricCard | Shared / home | Title, value, change %, sparkline slot |
| StatusBadge | Shared | Evidence-based status (Active/Draft/etc.) |
| NetworkBadge | Shared | Chain icon + name |
| AddressDisplay | Shared | Truncated address, copy, explorer link |
| TrustBadge | Shared | Wallet connected / KYC / Project reviewed |
| TransactionStatus | Shared | Pending/Confirmed/Failed + explorer link |
| WalletButton | Layout | Connect/address/disconnect |
| TopNav | Layout | Desktop + mobile responsive |
| PageHeader | Layout | Title, breadcrumb, actions slot |
| EmptyState | Shared | Icon, title, description, CTA |
| ErrorState | Shared | Same structure, retry action |
| DemoDataBanner | Shared | Clearly marks demo/mock data |
| Chart (line) | Exchange/Tokens | Library TBD; labeled axes, source, timestamp |
| Chart (bar) | Exchange/Home | Same |
| Stepper/Wizard | Shared | Step indicator for multi-step flows |
| LogoUploader | Tokens/Account | Drag-drop, preview, validation |
| FilterPanel | Shared | Collapsible filter groups, active chips |

---

## 10. Accessibility Standards

- All interactive elements have visible focus rings.
- Keyboard navigation must reach every action.
- Semantic HTML5 elements throughout.
- ARIA labels on icon-only buttons.
- Color is not the only differentiator for status.
- Modals trap focus; Escape closes them.
- Reduced-motion variant for all animated elements.
- WCAG AA contrast target minimum.
