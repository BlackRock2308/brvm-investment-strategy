// Netlify Function — scrapes brvm.org for live BRVM data
// Endpoint: GET /api/brvm-live

import https from "https";

function fetchPage(url, timeout = 8000) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; OmaadCapital/1.0)",
        "Accept": "text/html",
      },
      timeout,
      rejectUnauthorized: false, // brvm.org has incomplete certificate chain
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchPage(res.headers.location, timeout).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      let body = "";
      res.on("data", (chunk) => { body += chunk; });
      res.on("end", () => resolve(body));
      res.on("error", reject);
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

export default async () => {
  try {
    const [homeHtml, resumeHtml] = await Promise.all([
      fetchPage("https://www.brvm.org/"),
      fetchPage("https://www.brvm.org/fr/resume").catch(() => null),
    ]);

    const data = parseHome(homeHtml);
    if (resumeHtml) parseResume(resumeHtml, data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch BRVM data", detail: err.message }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const config = { path: "/api/brvm-live" };

function parseHome(html) {
  const result = {
    date: null,
    index: null,
    top5: [],
    flop5: [],
    marketCap: null,
  };

  // Session date: <p class="header-seance">Mercredi, 29 avril, 2026 - 17:46</p>
  const dateMatch = html.match(/class="header-seance">([^<]+)/);
  if (dateMatch) result.date = dateMatch[1].trim();

  // All stocks: <div class="item"><span>TICKER</span>&nbsp;<span>PRICE</span>&nbsp;<span>CHANGE%</span>&nbsp;<span class="icone-seance good|bad|nul"></span></div>
  const items = [...html.matchAll(
    /<div class="item"><span>(\w+)<\/span>&nbsp;<span>([\d\s]+)<\/span>&nbsp;<span>([-\d,]+%)<\/span>/g
  )];

  const stocks = items.map(m => ({
    ticker: m[1],
    price: parseInt(m[2].replace(/\s/g, ""), 10),
    changePct: parseFloat(m[3].replace(",", ".")),
  }));

  const gainers = stocks.filter(s => s.changePct > 0).sort((a, b) => b.changePct - a.changePct);
  const losers = stocks.filter(s => s.changePct < 0).sort((a, b) => a.changePct - b.changePct);

  result.top5 = gainers.slice(0, 5);
  result.flop5 = losers.slice(0, 5);

  return result;
}

function parseResume(html, data) {
  // BRVM-CI: ||BRVM-C||403,38||0,00%
  const ciMatch = html.match(/BRVM-C(?:OMPOSITE)?[^>]*>([^<]*)<[^>]*>(\d[\d\s,.]*)<[^>]*>([\d,.]+)/s);
  if (!ciMatch) {
    const altMatch = html.match(/BRVM - COMPOSITE\|*([\d,.]+)\|*([\d,.]+)/);
    if (!altMatch) return;
  }

  // Better approach: look for the BRVM-C row in the table
  const rowMatch = html.match(/BRVM-C[^<]*<\/td>\s*<td[^>]*>([\d,.\s]+)<\/td>\s*<td[^>]*>([\d,.\s]+)<\/td>/s);
  if (rowMatch) {
    const value = parseFloat(rowMatch[1].replace(/\s/g, "").replace(",", "."));
    const prev = parseFloat(rowMatch[2].replace(/\s/g, "").replace(",", "."));
    if (value) {
      const change = Math.round((value - prev) * 100) / 100;
      const changePct = prev ? Math.round(((value - prev) / prev) * 10000) / 100 : 0;
      data.index = { value, change, changePct };
    }
  }
}
