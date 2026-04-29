import { T } from "../theme";

export const STOCKS = [
  { ticker: "SNTS",  name: "Sonatel",       sector: "Télécoms",      country: "Sénégal",     flag: "🇸🇳", price: 28500, pe: 7.0,  yield: 5.8, risk: 4, conviction: 25, moat: "Fort",   fcpOverlap: "Complém.", change: 9.1,   phaseEntry: 1 },
  { ticker: "ORAC",  name: "Orange CI",     sector: "Télécoms",      country: "Côte d'Iv.",  flag: "🇨🇮", price: 15245, pe: 9.5,  yield: 3.9, risk: 4, conviction: 20, moat: "Fort",   fcpOverlap: "Complém.", change: 9.1,   phaseEntry: 1 },
  { ticker: "CIEC",  name: "CIE",           sector: "Utilities",     country: "Côte d'Iv.",  flag: "🇨🇮", price: 3100,  pe: 11.0, yield: 7.7, risk: 3, conviction: 15, moat: "Fort",   fcpOverlap: "Complém.", change: -3.4,  phaseEntry: 1 },
  { ticker: "SDCC",  name: "SODECI",        sector: "Utilities",     country: "Côte d'Iv.",  flag: "🇨🇮", price: 7300,  pe: 10.0, yield: 6.6, risk: 3, conviction: 7,  moat: "Fort",   fcpOverlap: "Complém.", change: 1.4,   phaseEntry: 3 },
  { ticker: "BOAB",  name: "BOA Bénin",     sector: "Banque",        country: "Bénin",       flag: "🇧🇯", price: 8130,  pe: 5.0,  yield: 5.76,risk: 4, conviction: 18, moat: "Modéré", fcpOverlap: "Partiel",  change: 36.3,  phaseEntry: 1 },
  { ticker: "BOAS",  name: "BOA Sénégal",   sector: "Banque",        country: "Sénégal",     flag: "🇸🇳", price: 6850,  pe: 5.5,  yield: 9.5, risk: 5, conviction: 8,  moat: "Modéré", fcpOverlap: "Partiel",  change: 12.4,  phaseEntry: 2 },
  { ticker: "SGBC",  name: "SGBCI",         sector: "Banque",        country: "Côte d'Iv.",  flag: "🇨🇮", price: 34500, pe: 9.0,  yield: 6.3, risk: 4, conviction: 12, moat: "Modéré", fcpOverlap: "Partiel",  change: 11.3,  phaseEntry: 1 },
  { ticker: "ETIT",  name: "Ecobank ETI",   sector: "Banque pan-AF", country: "Togo",        flag: "🇹🇬", price: 29,    pe: 6.5,  yield: 0.6, risk: 6, conviction: 6,  moat: "Modéré", fcpOverlap: "Partiel",  change: 93.3,  phaseEntry: 4 },
  { ticker: "PALC",  name: "PALMCI",        sector: "Agro",          country: "Côte d'Iv.",  flag: "🇨🇮", price: 8100,  pe: 7.5,  yield: 5.1, risk: 6, conviction: 4,  moat: "Modéré", fcpOverlap: "Non",      change: -3.8,  phaseEntry: 4 },
  { ticker: "SPHC",  name: "SAPH",          sector: "Agro",          country: "Côte d'Iv.",  flag: "🇨🇮", price: 7300,  pe: 8.0,  yield: 6.0, risk: 6, conviction: 3,  moat: "Modéré", fcpOverlap: "Non",      change: 4.7,   phaseEntry: 4 },
];

export const PHASE_CONFIG = [
  {
    phase: 1, label: "Phase 1 — Construction du cœur", capitalRange: "< 5M FCFA", maxLines: 5,
    tickers: ["SNTS", "ORAC", "BOAB", "CIEC", "SGBC"],
    weights: { SNTS: 28, ORAC: 22, BOAB: 20, CIEC: 17, SGBC: 13 },
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

export const SECTOR_COLORS = {
  "Télécoms":        T.blue,
  "Utilities":       T.chart6,
  "Banque":          T.chart3,
  "Banque pan-AF":   T.chart5,
  "Agro":            T.green,
};
