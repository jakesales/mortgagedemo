# ABC Mortgage Broker — Property Dashboard

UK-focused single-property mortgage web app. **Design-first phase**: layout, typography, and mock data — ready for real APIs and logic later.

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Live demo (GitHub Pages)

After pushing to `main`, GitHub Actions deploys automatically to:

**https://jakesales.github.io/mortgagedemo/**

First-time setup: repo **Settings → Pages → Build and deployment → Source**: **GitHub Actions**.

## Dashboard (landing page)

- **Address & map** — property header with OpenStreetMap embed
- **Metrics** — current value (with last-quarter change), mortgage balance, rate, type, term remaining, equity, LTV
- **Alerts** — actionable items (rate expiry, valuation updates, LTV thresholds)

Mock data lives in `src/data/mockProperty.ts`.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Lucide icons

## Next steps (functionality)

- Wire valuation and mortgage data from your APIs
- Replace map embed with Mapbox/Google if needed
- Add auth, document upload, remortgage calculator pages
