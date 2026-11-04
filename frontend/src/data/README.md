# HorizonX data layer

`src/data/index.ts` is the public entry point for application-owned data.

## Ownership

- `catalog/`: seed catalog records for tokens, projects, presales, fair launches, airdrops and staking pools. These records are illustrative/local catalog data, not live market or blockchain feeds.
- `navigation.ts`: primary navigation, create shortcuts, account menu and footer destinations.
- `platform.ts`: platform-wide curated selections and shared option lists, including homepage principles and token categories.

## Rules for future changes

1. Add or edit business records in the relevant `catalog/` module; do not duplicate them in pages or components.
2. Put reusable curated lists and platform-wide selections in `platform.ts` or a clearly named domain module.
3. Keep page-specific rendering, formatting and derived calculations in the UI/domain logic. Do not store computed totals or filtered lists as duplicate source data.
4. Treat wallet/session-created records as runtime state and persist them through the existing storage utilities. Do not copy session data into the seed catalog.
5. Preserve provenance: catalog, simulated, session and on-chain values must not be conflated. Current market figures and transfer examples remain illustrative unless a real provider/indexer is connected.
6. When a backend is introduced, implement a repository/provider that satisfies the same domain types and replace the catalog source at the data boundary. UI components should not need to know whether records came from local seed data or an API.

`src/lib/mock-data.ts` and `src/config/navigation.ts` remain as deprecated re-export shims so older imports and tests do not break. New code should import from `@/data`.


## Local image fields

Catalog records now include local, same-origin image paths:

- `image`: primary card/list thumbnail.
- `bannerImage`: wide project/campaign visual.
- `galleryImages`: four unique detail-page artwork variants.
- Token records additionally include `coverImage`; their `image` uses a distinct bundled token artwork.

Homepage capability records in `platform.ts` include `image` and `galleryImages` too. These paths resolve from the app's `public/` directory (for example, `/artwork/aether-frames.svg`). Keep the accompanying image bundle's `public/` directory at the project root. The assets are locally bundled SVG/AVIF/JPG/PNG demo artwork and do not require third-party image hosts. All market, holder, launch and reward figures remain illustrative seed data, not live chain data.
