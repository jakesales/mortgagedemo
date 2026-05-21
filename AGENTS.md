# Cursor agent guide — ABC Mortgage Broker property dashboard

This document is for AI agents (and developers) working on this codebase. Read it before making changes.

## Product summary

Single-property **UK mortgage broker dashboard** (design/demo phase). Brand: **ABC Mortgage Broker**, styled after CMME broker aesthetics (Nunito Sans, coral accent, slate toggles). All property/mortgage/market data is **mock** in `src/data/mockProperty.ts` unless wired to APIs later.

**Live site (GitHub Pages):** https://jakesales.github.io/mortgagedemo/  
**GitHub repo:** https://github.com/jakesales/mortgagedemo  
**n8n webhook:** POST `https://pricehubble.app.n8n.cloud/webhook/c1abf944-35e0-4a2d-96b5-1ddb35d346b0`

---

## Stack

| Layer | Choice |
|--------|--------|
| UI | React 19 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 (`src/index.css` `@theme` tokens) |
| Icons | `lucide-react` |
| Map | OpenStreetMap iframe embed + mock SVG value heatmap overlay |

**Commands:**

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # output: dist/
npm run preview  # preview production build locally
```

**Note:** Project may live under Google Drive. If `npm` is missing on PATH, a local Node tarball has been used at `.tools/node-v22.14.0-darwin-arm64/bin` (prepend to PATH on that machine).

---

## GitHub Pages / Vite `base`

`vite.config.ts` sets `base: '/mortgagedemo/'` for GitHub Pages asset paths. **Do not remove** unless hosting changes.

Deploy: `.github/workflows/deploy.yml` runs on push to `main` → GitHub Actions → Pages.  
Repo **Settings → Pages → Source** must be **GitHub Actions**.

Local dev uses Vite dev server (base still applies to built assets; dev server handles it). For production-like local test: `npm run build && npm run preview`.

---

## App structure

```
src/
  App.tsx                 # Page state, providers, Header, routing between pages
  main.tsx
  index.css               # Theme tokens (accent, brand-slate, positive, etc.)
  data/mockProperty.ts    # Single source of mock truth
  pages/
    OverviewPage.tsx      # Main dashboard sections
    LocalAreaPage.tsx     # Charts + comparables + selling CTA
    MyPropertyPage.tsx    # Property details + EPC
  components/             # Presentational sections (see map below)
  context/
    UserSettingsContext.tsx    # Settings modal + localStorage contact details
    WebhookFeedbackContext.tsx # Webhook buttons, thank-you modal
  lib/
    webhook.ts            # n8n POST + WebhookAction constants
    userSettings.ts       # localStorage load/save, contact params for webhook
    mortgage.ts           # Repayment math, formatTerm, formatDurationMonths
    format.ts             # formatGBP, formatPercent, formatSignedGBP
    scrollToAlerts.ts     # Scroll to #alerts-section
```

### Navigation (no React Router)

`AppPage` type in `src/components/AppTabs.tsx`: `'overview' | 'local-area' | 'my-property'`.

- State in `App.tsx`: `page` + `setPage` passed as `activePage` / `onNavigate`.
- **Tabs** appear inside `MapPageShell` on each page (embedded `AppTabs`).
- Header **notifications** button: if not on overview, switches to overview then scrolls to `#alerts-section`.

---

## Page content map

### Overview (`OverviewPage.tsx`)

1. `MapPageShell` → `PropertyAddressBar` (address + small map)
2. `PropertyValueSection` — estimated value, quarterly change, chart, link to local area tab
3. `EquitySection` — equity amount + broker CTA
4. `MortgageSection` — two-column current mortgage vs broker offer
5. `AlertsPanel` — alerts with “Find out more” webhook buttons

### Local area (`LocalAreaPage.tsx`)

1. `MapPageShell` → large `PropertyMap`
2. `LocalAreaSection` — average price line chart + sales volume bar chart
3. `SellingAdviceCta` — selling message + Contact me
4. `ComparableSalesSection` — 4 cards (photo, address, sold price, completion date)

### My property (`MyPropertyPage.tsx`)

1. `MapPageShell` → `PropertyAddressBar`
2. `PropertyDetailsSection` — floor area, beds, baths + `EpcRatingDisplay` + green mortgage CTA

---

## Mock data (`mockProperty.ts`)

Edit here for demo values. Key fields:

- `address`, `coordinates`, `propertyValue`, `valueHistory`, `valueChangeQuarter`
- `mortgageBalance`, `mortgageRate`, `mortgageType`, `dealRemainingMonths` (e.g. 4)
- `termRemainingYears` / `termRemainingMonths`, `offer` object, `equity`, `ltv`
- `propertyDetails`: `livingAreaSqm`, `bedrooms`, `bathrooms`, `epcRating` (`'C'`), `epcAssessmentDate` (ISO `YYYY-MM-DD` in data; EPC UI formats for display)
- `localArea.averagePriceHistory`, `salesVolume`, `comparableSales[]` (Unsplash `imageUrl`s — verify URLs return HTTP 200)
- `alerts[]` — keep fixed-rate alert months aligned with `dealRemainingMonths` if both mention time left

**Chart data:** Series are intentionally volatile (up/down) but trend up overall. Last property value point must match `propertyValue` (685_000). Quarterly change badge uses last two history points.

---

## Mortgage section behaviour (`MortgageSection.tsx`)

- **Left column:** distributed metric rows (`MortgageMetricRow` with `distributed` prop fills card height).
- **Right column:** broker offer; toggle `keepSamePayments`:
  - `false` (default): show monthly savings, toggle label “Shorten your mortgage term”, Claim offer → `claim_offer_reduce_payment`
  - `true`: show term “sooner” savings, toggle “Lower your monthly repayments”, Claim offer → `claim_offer_reduce_term`
- Calculations in `lib/mortgage.ts` (`monthlyPayment`, `termMonthsFromPayment`, etc.).

---

## Webhooks & user settings

### User settings (cog in header)

- `SettingsModal` + `UserSettingsContext`
- Stored in `localStorage` key `abc-mortgage-user-settings`: `firstName`, `email`, `countryCode` (default `+44`), `mobileNumber`
- Combined mobile sent as `mobile` (country code + number, spaces stripped) via `getContactWebhookParams()`

### Webhook payload

Every CTA POST includes:

```json
{
  "action": "<WebhookAction>",
  "firstName": "...",
  "email": "...",
  "mobile": "+44...",
  "alertId": "1",
  "triggeredAt": "ISO-8601"
}
```

(`firstName` / `email` / `mobile` omitted if empty; `alertId` only for find-out-more.)

### Webhook actions (`lib/webhook.ts` → `WebhookAction`)

| Constant | When fired |
|----------|------------|
| `claim_offer_reduce_payment` | Claim offer, payment-saving mode |
| `claim_offer_reduce_term` | Claim offer, term-shortening mode |
| `contact_broker_equity` | Equity “Contact your broker” |
| `contact_me_selling` | Local area selling CTA |
| `book_epc_assessment` | My property EPC button |
| `find_out_more_alert` | Alerts; extra `alertId` |

### UI feedback

Use **`WebhookActionButton`** from `WebhookFeedbackContext.tsx` for all webhook CTAs (not raw `onClick` + `fetch`). It shows “Sending…”, press scale, then thank-you modal: “We've received your request and will be in contact shortly.”

**CORS:** n8n must allow the site origin (localhost + `https://jakesales.github.io`) or browser requests fail.

**Security:** Webhook URL is hardcoded in `webhook.ts`. Repo may be public — consider env var + GitHub Actions secret for production later.

---

## UK copy conventions (approved terminology)

Prefer UK broker/language already applied in UI:

- Estimated property value (not “current property value”)
- Property address (not “registered address”)
- Interest rate, Product type, Fixed-rate period remaining, Remaining mortgage term
- Current monthly repayment, Capital and interest
- Sold price, Completion date (comparables)
- Energy Performance Certificate (EPC), Certificate dated …
- Term format: `18 years 4 months` via `formatTerm()` / `formatDurationMonths()` in `mortgage.ts` (not `yr` / `mo`)
- Illustrative example — not a formal offer (broker panel subtitle)

When changing labels, keep tone professional and FCA-aware (illustrations ≠ offers).

---

## Design tokens (`src/index.css`)

- `--color-accent` — coral primary CTA
- `--color-brand-slate` — toggle active state (not red/white)
- `--color-positive` — savings / EPC green accents
- Fonts: Nunito Sans (UI), Playfair optional for display (mostly unused in components)

Match existing patterns: `rounded-lg border border-border bg-surface`, section headers `text-xs font-medium uppercase tracking-wider text-ink-faint`.

---

## Maps & comparables photos

- `PropertyMap.tsx`: OSM iframe + mock heatmap SVG + legend (L/H or Low/High).
- Comparable images: Unsplash URLs in `mockProperty.ts` — prefer UK terrace/brick London exteriors; test URLs with `curl -I` if images break.

---

## Agent workflow preferences

1. **Minimize scope** — only change what the user asked for; match existing file style.
2. **No git commits** unless the user explicitly asks.
3. **Do not update global `git config`.**
4. **Mock-first** — new metrics/sections usually need `mockProperty.ts` + a section component + page wiring.
5. **New webhook button** — add `WebhookAction` constant, use `WebhookActionButton`, document action string for n8n.
6. **New tab/page** — extend `AppPage` in `AppTabs.tsx`, add page component, wire in `App.tsx`, add tab label.
7. **Run `npm run build`** after substantive TS/UI changes to verify compile.

---

## Common tasks (quick pointers)

| Task | Where to look |
|------|----------------|
| Change mock address / values | `src/data/mockProperty.ts` |
| Add alert | `mockProperty.alerts` + `AlertsPanel.tsx` |
| Change broker name in copy | Search “Jason”; `EquitySection` had `brokerName` removed — grep before assuming prop exists |
| Tweak offer toggle logic | `MortgageSection.tsx` + `lib/mortgage.ts` |
| Change thank-you / settings copy | `WebhookFeedbackContext.tsx`, `SettingsModal.tsx` |
| Change deploy URL / base path | `vite.config.ts` + GitHub repo name must match |
| Replace webhook URL | `src/lib/webhook.ts` (consider env later) |
| Chart volatility / labels | `mockProperty.ts` + `PropertyValueChart.tsx` / `LocalAreaCharts.tsx` |

---

## Files intentionally removed / not used

Older experiments (`Dashboard.tsx`, `LtvGauge.tsx`, `MortgageBlock.tsx`, etc.) were removed. Do not recreate unless asked.

---

## Related docs

- `README.md` — short human readme (run locally, stack, next steps)
- `.github/workflows/deploy.yml` — CI deploy to GitHub Pages

---

## Owner context

- **User:** Jake Sales (PriceHubble UK Solutions demo)
- **Purpose:** Sales/demo dashboard for mortgage broker storytelling, n8n lead capture via webhooks
- **Hosting target:** GitHub Pages at `/mortgagedemo/` on `jakesales` account

When unsure about business rules (e.g. mortgage math, regulatory copy), ask the user rather than inventing compliance text.
