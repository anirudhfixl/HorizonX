# ProMiners — Web3 Token & Launchpad Ecosystem

React 19 + Vite + React Router single-page app (migrated from Next.js App Router).

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
```

| Script              | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Vite dev server with HMR                       |
| `npm run build`     | Production build into `dist/`                  |
| `npm run preview`   | Serve the production build locally             |
| `npm run typecheck` | `tsc --noEmit`                                 |
| `npm run lint`      | ESLint                                         |
| `npm test`          | Data/logic test suite (`tsx src/tests/*.test.ts`) |

## Project layout

```
index.html              Vite entry (fonts, <title>, meta)
src/main.tsx            React root + <RouterProvider>
src/routes.tsx          Route table (lazy-loaded pages)
src/pages/**/page.tsx   One file per route (folder path == URL; _id / _slug are URL params)
src/components/         Shared UI (layout, ui, market, tokens, launchpad, ...)
src/styles/globals.css  Tailwind v4 + design tokens
src/config, contexts, data, lib, types, tests
```

Route params: `pages/tokens/_id/page.tsx` serves `/tokens/:id` and reads it with `useParams()`.
Per-page `<title>`/description: render `<PageMeta title="..." description="..." />`.

## Environment variables

Browser-exposed variables use the `VITE_` prefix and are read with `import.meta.env.VITE_*`
(see `.env.example`).

## Deployment

The build is static. Serve `dist/` with an SPA fallback so deep links like `/tokens/prominers`
resolve to `index.html` (Vercel: `vercel.json` rewrite; Netlify: `public/_redirects`; nginx: `try_files $uri /index.html`).
