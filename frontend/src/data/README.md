# HorizonX Web2 demo dataset — v3

This handoff expands the prior 59-record dataset to **177 records (3×)**. It contains three coherent cohorts: the original catalog, Cohort II, and Cohort III. Each cohort has its own IDs and internally consistent project/token/partner references.

## Record counts

| Collection | Records |
|---|---:|
| Projects | 30 |
| Tokens | 27 |
| Presales | 24 |
| Fair Launches | 24 |
| Airdrops | 24 |
| Staking Pools | 24 |
| Partners | 24 |
| **Total** | **177** |

## Image loading

Every image, banner, cover, and gallery image field points to the single local asset `/images/horizonx-dataset-placeholder.svg`. The asset is included at `public/images/horizonx-dataset-placeholder.svg`. This intentionally makes image-loading behavior easy to verify; replace the fields later when final artwork is ready.

## Data and relationships

- Projects reference tokens through `tokenIds` and partners through `partnerIds`.
- Tokens reference projects through `projectId`.
- Presales, fair launches, airdrops, and staking pools reference both a project and token.
- Cohort II and Cohort III IDs are suffixed with `-cohort-2` and `-cohort-3`; their foreign keys are remapped to the corresponding cohort.
- No external Web2 API integration is required.

## Provenance

All entries, market-like values, APYs, campaign figures, descriptions, addresses, and metrics are illustrative demo data. They are not live feeds, endorsements, independently verified projects, or on-chain state. Token market objects remain marked `isLive: false`. Partner `.example` URLs are reserved placeholders.

## Integration

Merge the `data/` directory into the HorizonX source data directory and copy the included `public/` asset into the project public directory. Keep existing UI components unchanged during the initial data-source migration.
