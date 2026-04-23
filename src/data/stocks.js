import { T } from "../theme";

export const STOCKS = [
  { ticker: "SNTS",  name: "Sonatel",       sector: "Télécoms",      country: "Sénégal",     flag: "🇸🇳", price: 29000, pe: 7.0,  yield: 5.7, risk: 4, conviction: 18, moat: "Fort",   fcpOverlap: "Complém.", change: 11.03 },
  { ticker: "ORAC",  name: "Orange CI",     sector: "Télécoms",      country: "Côte d'Iv.",  flag: "🇨🇮", price: 15000, pe: 9.5,  yield: 4.0, risk: 4, conviction: 14, moat: "Fort",   fcpOverlap: "Complém.", change: 7.5  },
  { ticker: "CIEC",  name: "CIE",           sector: "Utilities",     country: "Côte d'Iv.",  flag: "🇨🇮", price: 3400,  pe: 11.0, yield: 7.0, risk: 3, conviction: 12, moat: "Fort",   fcpOverlap: "Complém.", change: 4.2  },
  { ticker: "SDCC",  name: "SODECI",        sector: "Utilities",     country: "Côte d'Iv.",  flag: "🇨🇮", price: 7400,  pe: 10.0, yield: 6.5, risk: 3, conviction: 8,  moat: "Fort",   fcpOverlap: "Complém.", change: 2.8  },
  { ticker: "BOAB",  name: "BOA Bénin",     sector: "Banque",        country: "Bénin",       flag: "🇧🇯", price: 5965,  pe: 5.0,  yield: 9.4, risk: 4, conviction: 9,  moat: "Modéré", fcpOverlap: "Partiel",  change: 61.9 },
  { ticker: "BOAS",  name: "BOA Sénégal",   sector: "Banque",        country: "Sénégal",     flag: "🇸🇳", price: 6850,  pe: 5.5,  yield: 9.5, risk: 5, conviction: 8,  moat: "Modéré", fcpOverlap: "Partiel",  change: 12.4 },
  { ticker: "SGBC",  name: "SGBCI",         sector: "Banque",        country: "Côte d'Iv.",  flag: "🇨🇮", price: 31000, pe: 9.0,  yield: 7.0, risk: 4, conviction: 7,  moat: "Modéré", fcpOverlap: "Partiel",  change: 55.7 },
  { ticker: "ETIT",  name: "Ecobank ETI",   sector: "Banque pan-AF", country: "Togo",        flag: "🇹🇬", price: 34,    pe: 6.5,  yield: 0.5, risk: 6, conviction: 6,  moat: "Modéré", fcpOverlap: "Partiel",  change: 128.6},
  { ticker: "PALC",  name: "PALMCI",        sector: "Agro",          country: "Côte d'Iv.",  flag: "🇨🇮", price: 8150,  pe: 7.5,  yield: 5.0, risk: 6, conviction: 4,  moat: "Modéré", fcpOverlap: "Non",      change: -3.2 },
  { ticker: "SPHC",  name: "SAPH",          sector: "Agro",          country: "Côte d'Iv.",  flag: "🇨🇮", price: 7300,  pe: 8.0,  yield: 6.0, risk: 6, conviction: 3,  moat: "Modéré", fcpOverlap: "Non",      change: 4.7  },
];

export const SECTOR_COLORS = {
  "Télécoms":        T.blue,
  "Utilities":       T.chart6,
  "Banque":          T.chart3,
  "Banque pan-AF":   T.chart5,
  "Agro":            T.green,
};
