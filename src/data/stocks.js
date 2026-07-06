export const STOCKS = [
  { ticker: "SNTS",  name: "Sonatel",       sector: "Télécoms",      country: "Sénégal",     flag: "🇸🇳", price: 29500, pe: 7.0,  yield: 5.9, risk: 4, conviction: 25, moat: "Fort",   fcpOverlap: "Complém.", change: -1.7,  phaseEntry: 1 },
  { ticker: "ORAC",  name: "Orange CI",     sector: "Télécoms",      country: "Côte d'Iv.",  flag: "🇨🇮", price: 16900, pe: 9.5,  yield: 4.2, risk: 4, conviction: 20, moat: "Fort",   fcpOverlap: "Complém.", change: 6.7,   phaseEntry: 1 },
  { ticker: "CIEC",  name: "CIE",           sector: "Utilities",     country: "Côte d'Iv.",  flag: "🇨🇮", price: 5300,  pe: 11.0, yield: 3.9, risk: 3, conviction: 15, moat: "Fort",   fcpOverlap: "Complém.", change: 25.8,  phaseEntry: 1 },
  { ticker: "SDCC",  name: "SODECI",        sector: "Utilities",     country: "Côte d'Iv.",  flag: "🇨🇮", price: 11900, pe: 10.0, yield: 3.88, risk: 3, conviction: 7,  moat: "Fort",   fcpOverlap: "Complém.", change: 1.4,   phaseEntry: 3 },
  { ticker: "BOAB",  name: "BOA Bénin",     sector: "Banque",        country: "Bénin",       flag: "🇧🇯", price: 9100,  pe: 5.0,  yield: 6.43,risk: 4, conviction: 18, moat: "Modéré", fcpOverlap: "Partiel",  change: -5.4,  phaseEntry: 1 },
  { ticker: "BOAS",  name: "BOA Sénégal",   sector: "Banque",        country: "Sénégal",     flag: "🇸🇳", price: 7290,  pe: 5.5,  yield: 6.17, risk: 5, conviction: 8,  moat: "Modéré", fcpOverlap: "Partiel",  change: 12.4,  phaseEntry: 2 },
  { ticker: "SGBC",  name: "SGBCI",         sector: "Banque",        country: "Côte d'Iv.",  flag: "🇨🇮", price: 39000, pe: 9.0,  yield: 5.88, risk: 4, conviction: 12, moat: "Modéré", fcpOverlap: "Partiel",  change: 11.3,  phaseEntry: 2 },
  { ticker: "ETIT",  name: "Ecobank ETI",   sector: "Banque pan-AF", country: "Togo",        flag: "🇹🇬", price: 37,    pe: 6.5,  yield: 2.43, risk: 6, conviction: 6,  moat: "Modéré", fcpOverlap: "Partiel",  change: 93.3,  phaseEntry: 4 },
  { ticker: "PALC",  name: "PALMCI",        sector: "Agro",          country: "Côte d'Iv.",  flag: "🇨🇮", price: 8800,  pe: 7.5,  yield: 5.02, risk: 6, conviction: 4,  moat: "Modéré", fcpOverlap: "Non",      change: -3.8,  phaseEntry: 4 },
  { ticker: "SPHC",  name: "SAPH",          sector: "Agro",          country: "Côte d'Iv.",  flag: "🇨🇮", price: 7670,  pe: 8.0,  yield: 5.61, risk: 6, conviction: 3,  moat: "Modéré", fcpOverlap: "Non",      change: 4.7,   phaseEntry: 4 },
];

export const PHASE_CONFIG = [
  {
    phase: 1, label: "Phase 1 — Construction du cœur", capitalRange: "< 5M FCFA", maxLines: 4,
    tickers: ["SNTS", "ORAC", "BOAB", "CIEC"],
    weights: { SNTS: 32, ORAC: 25, BOAB: 23, CIEC: 20 },
  },
  {
    phase: 2, label: "Phase 2 — Renforcement yield", capitalRange: "5 – 15M FCFA", maxLines: 6,
    tickers: ["SNTS", "ORAC", "BOAB", "CIEC", "SGBC", "BOAS"],
    weights: { SNTS: 24, ORAC: 19, BOAB: 17, CIEC: 15, SGBC: 12, BOAS: 13 },
  },
  {
    phase: 3, label: "Phase 3 — Diversification défensive", capitalRange: "15 – 30M FCFA", maxLines: 7,
    tickers: ["SNTS", "ORAC", "BOAB", "CIEC", "SGBC", "BOAS", "SDCC"],
    weights: { SNTS: 22, ORAC: 17, BOAB: 15, CIEC: 13, SGBC: 11, BOAS: 12, SDCC: 10 },
  },
  {
    phase: 4, label: "Phase 4 — Allocation complète", capitalRange: "> 30M FCFA", maxLines: 8,
    tickers: ["SNTS", "ORAC", "BOAB", "CIEC", "SGBC", "BOAS", "SDCC", "ETIT"],
    weights: { SNTS: 20, ORAC: 16, BOAB: 14, CIEC: 12, SGBC: 10, BOAS: 10, SDCC: 8, ETIT: 10 },
  },
];

export const CURRENT_HOLDINGS = [
  { ticker: "SNTS", qty: 4,  invested: 117277, avgPrice: 29319 },
  { ticker: "CIEC", qty: 21, invested: 71669,  avgPrice: 3412  },
  { ticker: "BOAB", qty: 6,  invested: 53350,  avgPrice: 8891  },
  { ticker: "ORAC", qty: 5,  invested: 81572,  avgPrice: 16314 },
];

export const CURRENT_HOLDINGS_TOTAL = CURRENT_HOLDINGS.reduce((s, h) => s + h.invested, 0);

// Espèces disponibles sur le compte titres (snapshot relevé courtier).
export const CASH = 4588;

// Stable order of sectors → index into the Omaad chart categorical palette
// (see chartTokens().categorical). Charts read this so donut/bar slices
// adapt to light/dark; SECTOR_COLORS below is the light-hex fallback.
export const SECTOR_INDEX = {
  "Télécoms":      0,
  "Utilities":     1,
  "Banque":        2,
  "Banque pan-AF": 3,
  "Agro":          4,
  "Industrie":     5,
};

// Raw hex (Omaad categorical, light) — safe for SVG fills and DOM alike.
export const SECTOR_COLORS = {
  "Télécoms":        "#1A2740",
  "Utilities":       "#C77B3C",
  "Banque":          "#4D5F80",
  "Banque pan-AF":   "#D8A369",
  "Agro":            "#3D3B35",
};

export const FCP_BENCHMARK = {
  name: "FCP BAM WURUS",
  type: "OPCVM",
  manager: "BAM (Banque Atlantique Asset Management)",
  shares: 11.81,
  costPerShare: 16928,
  invested: 200000,
  navPerShare: 19530,
  value: 230738,
  snapshotDate: "2026-07-06",
  frozen: true,
};
