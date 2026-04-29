// Netlify Function — scrapes afx.kwayisi.org/brvm/ for live BRVM data
// Endpoint: GET /.netlify/functions/brvm-live

export default async (request) => {
  try {
    const response = await fetch("https://afx.kwayisi.org/brvm/", {
      headers: { "User-Agent": "OmaadCapital/1.0 (BRVM Dashboard)" },
    });

    if (!response.ok) throw new Error(`Source returned ${response.status}`);

    const html = await response.text();
    const data = parseHTML(html);

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

function parseHTML(html) {
  const result = {
    date: null,
    index: { value: 0, change: 0, changePct: 0, ytd: 0 },
    top5: [],
    flop5: [],
    marketCap: null,
  };

  const timeMatch = html.match(/<time[^>]+datetime="([^"]+)"/);
  if (timeMatch) result.date = timeMatch[1].split("T")[0];

  const indexBlock = html.match(/<table[^>]*>.*?BRVM-CI Index.*?<\/table>/s);
  if (indexBlock) {
    const cells = [...indexBlock[0].matchAll(/<td[^>]*>(.*?)<\/td>/gs)].map(m => m[1]);
    if (cells[0]) {
      const valMatch = cells[0].match(/([\d,.]+)\s*<span[^>]*>\(\+?([-\d,.]+)\)/);
      if (valMatch) {
        result.index.value = parseNum(valMatch[1]);
        result.index.change = parseNum(valMatch[2]);
      }
    }
    if (cells[1]) {
      const ytdMatch = cells[1].match(/([\d,.]+)%/);
      if (ytdMatch) result.index.ytd = parseNum(ytdMatch[1]);
      const chgPctMatch = cells[1].match(/\(([\d,.]+)%\)/);
      if (chgPctMatch) result.index.changePct = parseNum(chgPctMatch[1]);
    }
    if (cells[2]) {
      const capMatch = cells[2].match(/XOF\s+([\d,.]+\w+)/);
      if (capMatch) result.marketCap = capMatch[1];
    }
  }

  const statBlock = html.match(/<div data-stat[^>]*>(.*?)<\/div>/s);
  if (statBlock) {
    const tables = statBlock[1].split("</table>");
    if (tables[0]) result.top5 = parseMoversTable(tables[0]);
    if (tables[1]) result.flop5 = parseMoversTable(tables[1]);
  }

  return result;
}

function parseMoversTable(tableHtml) {
  const rows = [];
  const rowMatches = [...tableHtml.matchAll(/<tr><td><a[^>]+>(\w+)<\/a><td[^>]*>([\d,]+)<td[^>]*>([+-]?[\d,.]+%)/g)];
  for (const m of rowMatches.slice(0, 5)) {
    rows.push({
      ticker: m[1],
      price: parseNum(m[2]),
      changePct: parseFloat(m[3].replace(",", ".")),
    });
  }
  return rows;
}

function parseNum(str) {
  return parseFloat(str.replace(/,/g, ""));
}
