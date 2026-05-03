# BRVM Live Data — Architecture & How It Works

## Overview

This feature displays real-time Top 5 Gainers and Top 5 Losers from the BRVM stock exchange directly on the Omaad Capital dashboard. Since the BRVM has no public API, the data is obtained by scraping the official website.

## Architecture

```
brvm.org (official website)
    |
    |  HTML pages fetched server-side
    v
┌──────────────────────────────────┐
│  Netlify Function                │
│  netlify/functions/brvm-live.js  │
│                                  │
│  - Fetches 2 pages from brvm.org │
│  - Parses HTML with regex        │
│  - Returns structured JSON       │
│  - Cached 5 min (CDN)            │
└──────────────┬───────────────────┘
               |
               |  GET /api/brvm-live → JSON response
               v
┌──────────────────────────────────┐
│  React Component                 │
│  src/components/ui/MarketTicker  │
│                                  │
│  - Fetches JSON from endpoint    │
│  - Auto-refreshes (5 or 30 min)  │
│  - Displays Top 5 / Flop 5      │
└──────────────┬───────────────────┘
               |
               |  Rendered inside
               v
┌──────────────────────────────────┐
│  OverviewTab (Aperçu)            │
│  Dashboard home page             │
└──────────────────────────────────┘
```

## Step-by-Step Flow

### Step 1 — User opens the dashboard

When you open the app and land on the "Aperçu" tab, React renders `OverviewTab.jsx`. Inside it, the `<MarketTicker>` component is mounted with the API endpoint URL from `src/data/config.js`.

**File:** `src/components/tabs/OverviewTab.jsx`
```jsx
import MarketTicker from "../ui/MarketTicker";
import { BRVM_API_URL } from "../../data/config";

// Inside the component:
<MarketTicker endpoint={BRVM_API_URL} />
```

### Step 2 — MarketTicker fetches the data

On mount, `MarketTicker.jsx` calls `fetch(endpoint)` to request the JSON data. It shows a loading spinner while waiting.

**File:** `src/components/ui/MarketTicker.jsx`
```jsx
useEffect(() => {
  async function fetchData() {
    const res = await fetch(endpoint);
    const json = await res.json();
    setData(json);
  }
  fetchData();
  // Re-fetch every 5 min if BRVM is open, 30 min if closed
  const interval = isBrvmOpen() ? 5 * 60_000 : 30 * 60_000;
  setInterval(fetchData, interval);
}, [endpoint]);
```

The `isBrvmOpen()` function checks the current UTC time against BRVM trading hours (Monday–Friday, 09:00–15:00 UTC).

### Step 3 — Netlify Function scrapes brvm.org

When the browser hits `/api/brvm-live`, Netlify routes it to the serverless function. The function:

1. **Fetches two pages in parallel** from brvm.org:
   - Home page (`/`) — contains all stock tickers with their prices and daily change %
   - Resume page (`/fr/resume`) — contains the BRVM-CI composite index value

2. **Parses the home page HTML** using regex to extract every stock:
   ```html
   <!-- What brvm.org returns for each stock: -->
   <div class="item">
     <span>SNTS</span>&nbsp;
     <span>28 400</span>&nbsp;
     <span>1,06%</span>&nbsp;
     <span class="icone-seance good"></span>
   </div>
   ```
   The function extracts: ticker (`SNTS`), price (`28400`), change (`1.06%`).

3. **Sorts all stocks by change %** to find the Top 5 Gainers and Top 5 Losers.

4. **Parses the resume page** to extract the BRVM-CI index value and its daily change.

5. **Returns a JSON response:**
   ```json
   {
     "date": "Mercredi, 29 avril, 2026 - 17:56",
     "index": { "value": 403.38, "change": 0, "changePct": 0 },
     "top5": [
       { "ticker": "NTLC", "price": 12360, "changePct": 7.48 },
       { "ticker": "SDCC", "price": 8325, "changePct": 7.45 },
       ...
     ],
     "flop5": [
       { "ticker": "ABJC", "price": 3240, "changePct": -7.43 },
       { "ticker": "SAFC", "price": 3900, "changePct": -6.47 },
       ...
     ],
     "marketCap": null
   }
   ```

### Step 4 — MarketTicker renders the data

The component displays a card with:
- **Dark header bar**: BRVM-CI index value, daily change, date
- **Left column (green)**: Top 5 Hausses — stocks with highest positive variation
- **Right column (red)**: Top 5 Baisses — stocks with highest negative variation

Each row shows: ticker name, price in FCFA, and change percentage with a colored badge.

### Step 5 — Auto-refresh

The component keeps refreshing automatically:
- **Every 5 minutes** during BRVM trading hours (Mon–Fri 09:00–15:00 UTC)
- **Every 30 minutes** outside trading hours

If a refresh fails, the last successfully loaded data stays visible.

## File Map

| File | Role |
|------|------|
| `netlify/functions/brvm-live.js` | Serverless function that scrapes brvm.org and returns JSON |
| `src/components/ui/MarketTicker.jsx` | React component that fetches and displays the data |
| `src/components/tabs/OverviewTab.jsx` | Dashboard tab where MarketTicker is rendered |
| `src/data/config.js` | Stores the API endpoint URL (`BRVM_API_URL`) |
| `netlify.toml` | Routes `/api/*` to Netlify Functions |
| `src/index.css` | Contains the `@keyframes spin` animation for the loading spinner |

## Configuration

### Endpoint URL (`src/data/config.js`)

```js
// For production (same-origin on Netlify):
export const BRVM_API_URL = "/api/brvm-live";

// For local development (cross-origin to live Netlify):
export const BRVM_API_URL = "https://brvm-investment-strategy.netlify.app/api/brvm-live";

// To disable the ticker entirely:
export const BRVM_API_URL = "";
```

### Netlify routing (`netlify.toml`)

```toml
[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

This redirect maps the clean URL `/api/brvm-live` to the internal Netlify Functions path `/.netlify/functions/brvm-live`.

## Why scraping instead of an API?

The BRVM does not provide a public REST API. The official website (brvm.org) renders stock data server-side in its HTML, which makes it possible to extract with simple regex parsing. The function acts as a proxy that:

1. Avoids CORS issues (browsers can't fetch brvm.org directly from JavaScript)
2. Transforms raw HTML into clean JSON
3. Caches responses at the CDN level (5 minutes) to minimize requests to brvm.org

## Error Handling

| Scenario | Behavior |
|----------|----------|
| `BRVM_API_URL` is empty | MarketTicker renders nothing (hidden) |
| API returns error | Shows "Données BRVM indisponibles" message |
| brvm.org is down | Function returns HTTP 502, component shows fallback |
| Network timeout | Function fails after 8 seconds, retries on next cycle |
| BRVM closed (weekend) | Last session data is displayed, refreshes every 30 min |

## Testing

Test the endpoint directly:
```bash
curl -s "https://brvm-investment-strategy.netlify.app/api/brvm-live" | python3 -m json.tool
```
