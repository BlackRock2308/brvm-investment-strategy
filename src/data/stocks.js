// role : "core" (jamais vendu, dilution only) · "watchlist" (entrée conditionnelle prix)
//        "satellite" (pool opportuniste, critère de sortie écrit) · "horsPlan" (écartée de la v2)
export const STOCKS = [
  { ticker: "SNTS",  name: "Sonatel",       sector: "Télécoms",      country: "Sénégal",     flag: "🇸🇳", price: 29500, pe: 7.0,  yield: 5.9, risk: 4, conviction: 25, moat: "Fort",   fcpOverlap: "Complém.", change: -1.7,  phaseEntry: 1, role: "core" },
  { ticker: "ORAC",  name: "Orange CI",     sector: "Télécoms",      country: "Côte d'Iv.",  flag: "🇨🇮", price: 16300, pe: 9.5,  yield: 4.2, risk: 4, conviction: 20, moat: "Fort",   fcpOverlap: "Complém.", change: 6.7,   phaseEntry: 1, role: "core" },
  { ticker: "CIEC",  name: "CIE",           sector: "Utilities",     country: "Côte d'Iv.",  flag: "🇨🇮", price: 5485,  pe: 11.0, yield: 3.9, risk: 3, conviction: 15, moat: "Fort",   fcpOverlap: "Complém.", change: 25.8,  phaseEntry: 1, role: "core" },
  { ticker: "SDCC",  name: "SODECI",        sector: "Utilities",     country: "Côte d'Iv.",  flag: "🇨🇮", price: 11900, pe: 10.0, yield: 3.88, risk: 3, conviction: 7,  moat: "Fort",   fcpOverlap: "Complém.", change: 1.4,   phaseEntry: 2, role: "core" },
  { ticker: "BOAB",  name: "BOA Bénin",     sector: "Banque",        country: "Bénin",       flag: "🇧🇯", price: 9050,  pe: 5.0,  yield: 6.43,risk: 4, conviction: 18, moat: "Modéré", fcpOverlap: "Partiel",  change: -5.4,  phaseEntry: 1, role: "core" },
  { ticker: "BOAS",  name: "BOA Sénégal",   sector: "Banque",        country: "Sénégal",     flag: "🇸🇳", price: 7290,  pe: 5.5,  yield: 6.17, risk: 5, conviction: 8,  moat: "Modéré", fcpOverlap: "Partiel",  change: 12.4,  phaseEntry: 2, role: "horsPlan", roleNote: "Hors plan v2 — le pilier bancaire du cœur est BOAB ; doublonner une BOA n'apporte pas de diversification réelle." },
  { ticker: "SGBC",  name: "SGBCI",         sector: "Banque",        country: "Côte d'Iv.",  flag: "🇨🇮", price: 39000, pe: 9.0,  yield: 5.88, risk: 4, conviction: 12, moat: "Modéré", fcpOverlap: "Partiel",  change: 11.3,  phaseEntry: 2, role: "watchlist", roleNote: "Écartée en juillet 2026 à 39 000 F (trop chère). Entrée uniquement si PE ≤ 8 ou yield ≥ 6,5%." },
  { ticker: "ETIT",  name: "Ecobank ETI",   sector: "Banque pan-AF", country: "Togo",        flag: "🇹🇬", price: 37,    pe: 6.5,  yield: 2.43, risk: 6, conviction: 6,  moat: "Modéré", fcpOverlap: "Partiel",  change: 93.3,  phaseEntry: 4, role: "horsPlan", roleNote: "Écartée de la v2 — yield 2,4%, +93% déjà fait, gouvernance fragile : ne sert ni le rendement ni la qualité." },
  { ticker: "PALC",  name: "PALMCI",        sector: "Agro",          country: "Côte d'Iv.",  flag: "🇨🇮", price: 8800,  pe: 7.5,  yield: 5.02, risk: 6, conviction: 4,  moat: "Modéré", fcpOverlap: "Non",      change: -3.8,  phaseEntry: 2, role: "satellite" },
  { ticker: "SPHC",  name: "SAPH",          sector: "Agro",          country: "Côte d'Iv.",  flag: "🇨🇮", price: 7670,  pe: 8.0,  yield: 5.61, risk: 6, conviction: 3,  moat: "Modéré", fcpOverlap: "Non",      change: 4.7,   phaseEntry: 2, role: "satellite" },
];

// ═══════════════════════════════════════════════════════════════════
// Stratégie v2 (juillet 2026) — architecture core/satellite.
// Le core/satellite est la structure première ; les phases ne font que
// doser le ratio entre les deux. SGBC sortie du plan de base (watchlist
// à déclencheur prix), ETIT et BOAS écartées, exclusions éthiques
// tabac + alcool.
// ═══════════════════════════════════════════════════════════════════

// Cœur de croisière (75% en Phase 4) — jamais vendu, rééquilibrage par
// dilution uniquement (zéro frottement fiscal, zéro frais de courtage).
export const CORE_TARGETS = { SNTS: 20, ORAC: 15, CIEC: 14, BOAB: 14, SDCC: 12 };

// Watchlist — entrée conditionnelle au prix, jamais dans le plan de base.
// Le prix vient à toi, pas l'inverse.
export const WATCHLIST = [
  {
    ticker: "SGBC", name: "SGBCI", targetWeight: 8,
    trigger: "PE ≤ 8 ou yield ≥ 6,5%",
    triggerPrice: "≈ 30 000 – 33 000 F (vs 39 000 F en juillet 2026)",
    note: "Si le déclencheur se produit, SGBC prend 8% en rognant CIEC / BOAB / SDCC de 2-3pp chacun (retour à la grille SNTS 20 · ORAC 15 · CIEC 12 · BOAB 12 · SGBC 8 · SDCC 8). S'il ne se produit jamais, le portefeuille est complet sans elle.",
  },
];

// Exclusions éthiques — jamais achetables, quel que soit le rendement.
export const ETHICAL_EXCLUSIONS = [
  { ticker: "STBC", name: "SITAB",   reason: "Tabac",              yield: 7.12 },
  { ticker: "SLBC", name: "SOLIBRA", reason: "Alcool (brasserie)", yield: 4.88 },
];

// Pool satellite — 6 candidats qui se lisent comme 3 paris indépendants.
// Critères d'éligibilité : yield ≥ 4,5%, payout < 80%, PE < 12, hors zone
// AES, hors tabac/alcool, liquidité suffisante pour sortir en < 5 séances.
export const SATELLITE_BETS = [
  {
    id: "services", label: "Services aéroportuaires",
    note: "Décorrélé du reste de la cote.",
    candidates: [
      { ticker: "SVAC", name: "Servair Abidjan", yield: 6.16 },
    ],
  },
  {
    id: "agro", label: "Cycle agro — un seul à la fois",
    note: "Caoutchouc / huile de palme : acheter en bas de cycle des matières premières, jamais après un rallye.",
    candidates: [
      { ticker: "SOGC", name: "SOGB",   yield: 5.97 },
      { ticker: "SPHC", name: "SAPH",   yield: 5.61 },
      { ticker: "PALC", name: "PALMCI", yield: 5.02 },
    ],
  },
  {
    id: "petrole", label: "Distribution pétrolière — un seul à la fois",
    note: "Les deux Total sont très corrélés : un seul représentant.",
    candidates: [
      { ticker: "TTLS", name: "Total Sénégal", yield: 5.05 },
      { ticker: "TTLC", name: "Total CI",      yield: 4.90 },
    ],
  },
];

export const SATELLITE_RULES = {
  maxPerLine: 8,      // % max par ligne satellite
  maxSimultaneous: 3, // un représentant par pari, jamais deux du même pari
  minCapital: 5_000_000, // FCFA — aucun satellite avant la Phase 2
  entry: "Uniquement sur fenêtre : détachement ≤ 30 jours sans dérive de cours (règle 01) ou décote de −8% sans dégradation fondamentale (règle 02).",
  exit: [
    "Dividende coupé ou réduit deux exercices de suite",
    "Payout > 100% (dividende non couvert par les bénéfices)",
    "+40% de plus-value avec yield-on-cost tombé sous 3,5% → recycler vers le cœur",
  ],
};

// Phases = dosage core/satellite. `weights` (le cœur) somme à coreRatio,
// pas à 100 — le complément est l'enveloppe satellite. Seule la Phase 1
// (100% core) est consommée par computeDividendTargets aujourd'hui.
export const PHASE_CONFIG = [
  {
    phase: 1, label: "Phase 1 — Construction du cœur", capitalRange: "< 5M FCFA", maxLines: 4,
    coreRatio: 100, satelliteRatio: 0, satelliteSlots: 0,
    tickers: ["SNTS", "ORAC", "BOAB", "CIEC"],
    weights: { SNTS: 32, ORAC: 25, BOAB: 23, CIEC: 20 },
    caps: { line: 35, telecom: 60, ci: 60, aes: 0 },
  },
  {
    phase: 2, label: "Phase 2 — Cœur complet + 1er satellite", capitalRange: "5 – 15M FCFA", maxLines: 6,
    coreRatio: 85, satelliteRatio: 15, satelliteSlots: 1,
    tickers: ["SNTS", "ORAC", "CIEC", "BOAB", "SDCC"],
    weights: { SNTS: 23, ORAC: 17, CIEC: 16, BOAB: 16, SDCC: 13 },
    caps: { line: 25, telecom: 45, ci: 60, aes: 5 },
  },
  {
    phase: 3, label: "Phase 3 — Diversification satellite", capitalRange: "15 – 30M FCFA", maxLines: 7,
    coreRatio: 80, satelliteRatio: 20, satelliteSlots: 2,
    tickers: ["SNTS", "ORAC", "CIEC", "BOAB", "SDCC"],
    weights: { SNTS: 21, ORAC: 16, CIEC: 15, BOAB: 15, SDCC: 13 },
    caps: { line: 20, telecom: 35, ci: 60, aes: 5 },
  },
  {
    phase: 4, label: "Phase 4 — Régime de croisière", capitalRange: "> 30M FCFA", maxLines: 8,
    coreRatio: 75, satelliteRatio: 25, satelliteSlots: 3,
    tickers: ["SNTS", "ORAC", "CIEC", "BOAB", "SDCC"],
    weights: { ...CORE_TARGETS },
    caps: { line: 20, telecom: 35, ci: 60, aes: 5 },
  },
];

// Échelle de milestones dividendes (nets d'IRVM 15%). Capital requis
// calculé au yield net du cœur (~4,4%) — recalculé dynamiquement dans
// l'app via computeDividendTargets.
export const MILESTONE_LADDER = [
  { target: 100_000,   label: "Milestone #1", note: "Le premier vrai revenu passif" },
  { target: 300_000,   label: "Milestone #2", note: "Les dividendes paient un mois de DCA" },
  { target: 600_000,   label: "Milestone #3", note: "Le DRIP devient un 13e mois complet" },
  { target: 1_200_000, label: "Milestone #4", note: "100k F/mois — revenu passif significatif" },
];

export const CURRENT_HOLDINGS = [
  { ticker: "SNTS", qty: 4,  invested: 117042, avgPrice: 29260 },
  { ticker: "CIEC", qty: 21, invested: 71669,  avgPrice: 3412  },
  { ticker: "BOAB", qty: 6,  invested: 53350,  avgPrice: 8891  },
  { ticker: "ORAC", qty: 5,  invested: 81028,  avgPrice: 16205 },
];

export const CURRENT_HOLDINGS_TOTAL = CURRENT_HOLDINGS.reduce((s, h) => s + h.invested, 0);

// Espèces disponibles sur le compte titres (snapshot relevé courtier).
export const CASH = 4479;

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
  navPerShare: 19669,
  value: 232375,
  snapshotDate: "2026-07-07",
  frozen: true,
};
