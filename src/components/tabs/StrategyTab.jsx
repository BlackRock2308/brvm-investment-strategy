import React, { useState, useEffect, useCallback } from "react";
import { Clock, Compass, Gauge, Briefcase, Target, AlertCircle, Activity, Coins, CheckSquare, TrendingUp, Layers, Ban, Eye } from "lucide-react";
import { T, FONT_SANS, FONT_MONO, alpha } from "../../theme";
import { fmtFCFA, fmtFCFAfull, fmtEUR } from "../../utils/format";
import {
  CURRENT_HOLDINGS, STOCKS, PHASE_CONFIG, FCP_BENCHMARK,
  CORE_TARGETS, WATCHLIST, SATELLITE_BETS, SATELLITE_RULES,
  ETHICAL_EXCLUSIONS, MILESTONE_LADDER,
} from "../../data/stocks";
import { computeDividendTargets } from "../../utils/projections";
import useResponsive from "../../hooks/useResponsive";
import usePrivacy from "../../hooks/usePrivacy";

import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import Pill from "../ui/Pill";

const journal = [
  {
    date: "Avril 2026 (M1)",
    text: "Initiation portefeuille direct. Achat 1 SNTS à 29 000 F CFA (1ère ligne cœur télécoms) + 7 CIEC à 3 400 F CFA (initiation utility défensive). Total déployé : 52 800 F CFA.",
    color: T.blue,
  },
  {
    date: "Mai 2026 (M2)",
    text: "Adaptation aux conditions de marché. BOAB a rallié de +36% vs référence rapport (5 965 → 8 500 F CFA) avant détachement juin-juillet. Décision : prendre 3 BOAB malgré le rallye plutôt que skipper. CIEC est descendue à 3 210 F CFA (−9% vs référence) — opportunité saisie avec 4 CIEC supplémentaires. ORAC initiée à 15 350 F CFA après ajustement de l'ordre limit (initialement à 14 650 F CFA, non exécuté car le marché s'est envolé).",
    color: T.chart3,
  },
  {
    date: "4 mai 2026",
    text: "Snapshot portefeuille complet. Direct : SNTS ×1, CIEC ×11, BOAB ×3, ORAC ×1 — total investi 105 347 F CFA, valorisation 105 660 F CFA (+0.3%). FCP BAM WURUS : 11 parts, investi 200 000 F CFA, valorisation 202 545 F CFA (+1.3%). Décision : geler le FCP (aucune contribution future) et l'utiliser uniquement comme benchmark pour mesurer la surperformance du stock picking direct.",
    color: T.chart5,
  },
  {
    date: "15 mai 2026",
    text: "Nouveau snapshot portefeuille. Direct : SNTS ×2 (CMP 29 122), CIEC ×17 (CMP 3 227), BOAB ×3 (CMP 8 625), ORAC ×1 (CMP 15 476) — total investi 154 459 F CFA, valorisation 157 230 F CFA (+2 771 F CFA, +1.8%). FCP BAM WURUS : 11 parts, valorisation 202 606 F CFA (+1.3%). Valorisation globale 359 836 F CFA sur 354 459 F CFA investis (+5 378 F CFA, +1.5%). SNTS et CIEC renforcées depuis le 4 mai.",
    color: T.chart5,
  },
  {
    date: "22 mai 2026",
    text: "Premier dividende perçu — SNTS détache 1 740 F CFA brut, soit 1 480 F CFA net après IRVM 15%. Premier flux de revenus passifs. À réinvestir au prochain ordre.",
    color: T.green,
  },
  {
    date: "Juin 2026 (M3)",
    text: "Décision stratégique : passage du DCA de 50k à 75k FCFA/mois. Objectif : atteindre les cibles Phase 1 quasi parfaitement à fin décembre 2026 (clôture activité). Cette montée du DCA permet d'acheter 1 SNTS par mois (vs 1 tous les 3 mois), ce qui était le maillon faible du plan précédent. Aucune projection au-delà du 31/12/2026.",
    color: T.amber,
  },
  {
    date: "1 juin 2026 (M3 exécuté)",
    text: "Premier DRIP réel. Budget 80k FCFA dont 4 450 F CFA de dividendes SNTS+BOAB réinvestis. Ordres passés : 1 SNTS à 28 450 F CFA + 2 ORAC à 16 000 F CFA + 4 CIEC à 4 140 F CFA = 77 010 F CFA hors frais (78 144 F CFA avec frais courtier). CIEC réduit de 5 à 4 actions car cours en rallye (+28% vs CMP). Portefeuille direct : SNTS ×3, ORAC ×3, CIEC ×21, BOAB ×3 — total investi 231 464 F CFA, valorisation 247 200 F CFA (+6.8%). FCP BAM WURUS : 214 492 F CFA (+7%).",
    color: T.green,
  },
  {
    date: "8 juin 2026",
    text: "Dividende Orange CI détaché : 704 F CFA brut/action (4 actions). ORAC renforcée à 4 lignes (CMP 16 007 F CFA) après un dernier achat à 16 700 F CFA. Le coupon ORAC vient nourrir le prochain DRIP.",
    color: T.green,
  },
  {
    date: "27 juin 2026 (snapshot courtier)",
    text: "Relevé courtier complet. Direct : SNTS ×3 (clôture 29 000), CIEC ×21 (5 200), BOAB ×3 (9 025), ORAC ×4 (16 700) — investi 248 687 F CFA, valorisation 290 075 F CFA (+41 387 F CFA, +16,6%). CIE tire la performance (+52% vs CMP). FCP BAM WURUS : 11 parts à 19 214 F CFA, valorisation 226 998 F CFA (+26 998 F CFA, +13%). Patrimoine global 517 073 F CFA (+68 386 F CFA).",
    color: T.chart5,
  },
  {
    date: "2-3 juillet 2026 (M4 exécuté)",
    text: "Écart au plan assumé : SGBC écartée (jugée trop chère à 39 000 F CFA, potentiel d'appréciation jugé limité). À la place, renforcement de 3 lignes de conviction — 3 BOAB à 9 025 F CFA (02/07), puis 1 ORAC à 16 750 F CFA et 1 SNTS à 29 495 F CFA (03/07). Total déployé 73 320 F CFA. Portefeuille direct : SNTS ×4, ORAC ×5, BOAB ×6, CIEC ×21.",
    color: T.green,
  },
  {
    date: "6 juillet 2026 (snapshot courtier)",
    text: "Valorisation globale 603 726 F CFA. Direct : SNTS ×4 (29 500), CIE ×21 (5 300), BOAB ×6 (9 100), ORAC ×5 (16 900) — valorisation 368 400 F CFA (+44 532 F CFA, +13,8%). CIE toujours en tête (+55% vs CMP). FCP BAM WURUS 230 738 F CFA (+30 738, +15,4%). Espèces réduites à 4 588 F CFA après les achats de juillet.",
    color: T.chart5,
  },
  {
    date: "20 juillet 2026 (snapshot courtier)",
    text: "Snapshot relevé courtier. Direct : SNTS ×4 (32 000 F CFA, +9%), CIEC ×21 (5 195 F CFA, +52%), ORAC ×5 (16 160 F CFA, -0%), BOAB ×6 (8 700 F CFA, -2%) — investi 323 089 F CFA, valorisation 370 095 F CFA (+47 006 F CFA, +14,5%). FCP BAM WURUS : 11,81 parts, NAV 20 145 F CFA, valorisation 238 005 F CFA (+38 005, +19%). Patrimoine global 608 100 F CFA.",
    color: T.chart5,
  },
  {
    date: "28 juillet 2026",
    text: "Dividende CIE détaché : 205,92 F CFA brut/action × 21 = 4 324 F CFA brut → 3 676 F CFA net après IRVM 15%. Coupon réinvesti dans le DCA d'août.",
    color: T.green,
  },
  {
    date: "Août 2026 (M5 exécuté)",
    text: "Rattrapage BOAB accéléré vs plan (5 actions au lieu de 3 prévues, CMP d'achat ~9 066 F CFA) + 2 ORAC à ~16 997 F CFA. Aucun achat CIE (surpondérée) ni SNTS ce mois. Total déployé 79 323 F CFA (DCA 75k + reliquat / coupon CIE). Portefeuille direct : SNTS ×4, ORAC ×7, BOAB ×11, CIEC ×21.",
    color: T.green,
  },
  {
    date: "27 août 2026 (snapshot courtier)",
    text: "Relevé titres. Direct : SNTS ×4 (34 600 F CFA, +18%), CIEC ×21 (6 970 F CFA, +104%), ORAC ×7 (20 795 F CFA, +26%), BOAB ×11 (10 350 F CFA, +15%) — investi 402 412 F CFA, valorisation 544 185 F CFA (+141 773 F CFA, +35,2%). FCP BAM WURUS : NAV 21 895 F CFA, valorisation 258 680 F CFA (+58 680, +29,3%). Patrimoine global 802 865 F CFA (+200 453 F CFA, +33,3%). Le direct bat le FCP (+35,2% vs +29,3%). CIE reste le moteur (+104% vs CMP) ; ORAC a rattrapé son retard de juillet.",
    color: T.chart5,
  },
  {
    date: "28 août 2026",
    text: "Décision stratégique — plan 2027 arrêté. DCA porté de 75k à 100k FCFA/mois à partir de janvier 2027. Initiation SDCC (5e ligne cœur, utility défensive) dès M10 avec front-load H1 — les satellites restent conditionnés au franchissement des 5M (Phase 2), le déclencheur est le capital, pas le calendrier. CIEC réintègre le DCA en H2 2027 (diluée sous sa cible) avec garde-fou valorisation. FCP BAM WURUS maintenu gelé : il reste le benchmark du stock picking direct.",
    color: T.amber,
  },
  {
    date: "Septembre 2026 (M6 exécuté)",
    text: "Budget exceptionnel déployé : 107 965 F CFA frais inclus (vs ~99 480 F planifiés). SNTS ×2 (~37 539 F/action frais inclus, CMP porté à 32 020 F) + BOAB ×2 (~10 147 F/action) conformes au plan, plus un écart assumé : 2 CIEC (~6 297 F/action) saisies sur repli du cours. Portefeuille direct : SNTS ×6, ORAC ×7, BOAB ×13, CIEC ×23.",
    color: T.green,
  },
  {
    date: "17 septembre 2026",
    text: "Sonatel annonce un projet de fractionnement de son action par 10 (nominal 500 → 50 F CFA). AGE convoquée le 8 octobre 2026, effet prévu le 26 octobre 2026 : chaque action SNTS deviendra 10 actions à ~1/10e du cours (6 actions → 60, CMP 32 020 → 3 202 F CFA). Aucun impact sur la valeur du portefeuille, mais la granularité du DCA est transformée — SNTS devient achetable finement chaque mois. Attention : le titre rallye depuis l'annonce (spéculation pré-split, franchissement des 42 000 F) → pas d'achat SNTS avant le 26/10, risque de correction technique post-fractionnement.",
    color: T.amber,
  },
  {
    date: "28 septembre 2026 (snapshot courtier)",
    text: "Relevé titres. Direct : SNTS ×6 (41 950 F CFA, +31%), CIEC ×23 (6 440 F CFA, +76%), ORAC ×7 (21 295 F CFA, +30%), BOAB ×13 (9 000 F CFA, −2%) — investi 510 377 F CFA, valorisation 665 885 F CFA (+155 508 F CFA, +30,5%). FCP BAM WURUS : NAV 22 284 F CFA, valorisation 263 273 F CFA (+63 273, +31,6%). Patrimoine global 929 158 F CFA (+218 781 F CFA, +30,8%). SNTS accélère (+21% sur le mois à 41 950 F) tandis que BOAB repasse sous son CMP après les achats de septembre — le FCP repasse très légèrement devant le direct (+31,6% vs +30,5%).",
    color: T.chart5,
  },
  {
    date: "25 septembre 2026",
    text: "Décision — révision du plan M7–M9 suite au rallye pré-split SNTS. Le rallye (+31% vs CMP) a fait le rattrapage de poids à la place du DCA : SNTS gelée à 6 actions (37,8% du direct > cap ligne 35%, télécoms au cap 60%). Octobre (M7) : 100% BOAB ×8 (~73 080 F avec frais) — ligne la plus en retard, cours sous CMP, yield brut 6,5%, et seul achat qui ramène les deux caps dans les clous par dilution. ORAC reprend en novembre. AGL (SDSC) ajoutée à la watchlist (déclencheur ≈ 2 300–2 400 F). Re-pricing du calendrier 2027 avancé de juin 2027 à novembre 2026 (post-split). Marché volatil fin septembre (−3,66% le 23/09, rebond ensuite) : ordres limite recommandés.",
    color: T.amber,
  },
];

const BADGE_MAP = {
  SNTS: "✓ Renforcée (M1→M6)",
  CIEC: "✓ Renforcée (M1→M6)",
  BOAB: "✓ Renforcée (M2→M6)",
  ORAC: "✓ Renforcée (M2→M5)",
};
const NAME_MAP = { SNTS: "Sonatel", CIEC: "CIE", BOAB: "BOA Bénin", ORAC: "Orange CI" };
const situationLines = CURRENT_HOLDINGS.map(h => ({
  ...h, name: NAME_MAP[h.ticker] || h.ticker,
  invested: h.invested, badge: BADGE_MAP[h.ticker] || "",
  held: h.qty > 0,
}));
const situationTotal = CURRENT_HOLDINGS.reduce((s, h) => s + h.invested, 0);

const fcpHolding = {
  name: FCP_BENCHMARK.name,
  qty: FCP_BENCHMARK.shares,
  invested: FCP_BENCHMARK.invested,
  navPerShare: FCP_BENCHMARK.navPerShare,
  value: FCP_BENCHMARK.value,
  costPerShare: FCP_BENCHMARK.costPerShare,
  get pnl() { return this.value - this.invested; },
  get pnlPct() { return ((this.value - this.invested) / this.invested * 100).toFixed(1); },
};

// Valorisation directe au cours de clôture courant — dérivée des positions
// (qty × prix STOCKS) pour rester synchronisée avec le relevé courtier.
const directValue = CURRENT_HOLDINGS.reduce((s, h) => {
  const st = STOCKS.find(x => x.ticker === h.ticker);
  return s + (st ? h.qty * st.price : 0);
}, 0);
const directPnl = directValue - situationTotal;
const directPnlPct = ((directPnl / situationTotal) * 100).toFixed(1);

const STORAGE_KEY = "omaad-calendar-done";

const marketPrice = (ticker) => STOCKS.find(s => s.ticker === ticker)?.price ?? 0;
const qtyPx = (qty, ticker) => (qty && ticker && ticker !== "—")
  ? `${qty} × ${fmtFCFAfull(marketPrice(ticker))}`
  : "—";

function planMonth({ m, month, legs, logic }) {
  const [a, b, c = { ticker: "—", qty: 0 }] = legs;
  return {
    m, month, logic,
    main: a.ticker, units: qtyPx(a.qty, a.ticker),
    second: b?.ticker || "—", second2: b?.qty ? qtyPx(b.qty, b.ticker) : "",
    third: c.qty ? c.ticker : "—", third2: c.qty ? qtyPx(c.qty, c.ticker) : "",
    total: legs.reduce((s, l) => s + l.qty * marketPrice(l.ticker), 0),
  };
}

const calendar = [
  { m: "M3",  month: "juin 26",  main: "SNTS", units: "1 × 28 450",  second: "ORAC", second2: "2 × 16 000", third: "CIEC", third2: "4 × 4 140",  total: 77010,  logic: "SNTS mensuel initié + ORAC renforcée + CIEC réduit de 5 à 4 (cours en rallye +28% vs CMP). BOAB reporté à juillet post-détachement. Premier DRIP : dividendes SNTS+BOAB réinvestis." },
  { m: "M4",  month: "juil. 26", main: "BOAB", units: "3 × 9 025",   second: "ORAC", second2: "1 × 16 750", third: "SNTS", third2: "1 × 29 495",  total: 73320,  logic: "Exécuté. SGBC écartée (jugée trop chère, potentiel limité) → renforcement de 3 lignes de conviction : BOAB (comblement), ORAC et SNTS. Aucun achat CIE (surpondérée)." },
  { m: "M5",  month: "août 26",  main: "BOAB", units: "5 × 9 066",   second: "ORAC", second2: "2 × 16 997", third: "—", third2: "",  total: 79323,  logic: "Exécuté. Rattrapage BOAB accéléré (5 vs 3 prévues) + 2 ORAC. Aucun achat CIE (surpondérée, +104% vs CMP). Déployé 79 323 F CFA." },
  { m: "M6",  month: "sept. 26", main: "SNTS", units: "2 × 37 539",  second: "BOAB", second2: "2 × 10 147", third: "CIEC", third2: "2 × 6 297",  total: 107965,  logic: "Exécuté. SNTS ×2 + BOAB ×2 conformes au plan, plus un écart assumé : 2 CIEC saisies sur repli. Déployé 107 965 F CFA frais inclus (vs ~99 480 F planifiés) — le reliquat prévu pour octobre est consommé." },
  planMonth({ m: "M7", month: "oct. 26",  legs: [{ ticker: "BOAB", qty: 8 }], logic: "Révision post-rallye SNTS (25/09) : 100% BOAB. Triple convergence — ligne la plus en retard (17,6% vs cible 23%), cours sous le CMP (9 000 vs 9 151, yield brut 6,5%), et seul achat qui ramène SNTS (~34%) sous le cap ligne 35% et les télécoms (~54%) sous le cap 60% par dilution. Aucun SNTS avant le split du 26/10 (rallye spéculatif), aucun ORAC (cap télécoms), aucun CIE (sur cible). Ordre limite 9 000–9 100 F, ~73 080 F avec frais sur budget 75k." }),
  planMonth({ m: "M8", month: "nov. 26",  legs: [{ ticker: "ORAC", qty: 2 }, { ticker: "BOAB", qty: 2 }], logic: "Tour d'ORAC (en retard ~20% vs cible 25%) une fois les télécoms diluées sous le cap par le M7. SNTS reste gelée à 6 actions (60 post-split) tant qu'elle est au-dessus de sa cible. Revue post-split fin octobre : si correction technique ramène SNTS sous ~32%, possible retour en petites quantités post-split (granularité ~4 200 F/action) à la place d'un ORAC." }),
  planMonth({ m: "M9", month: "déc. 26",  legs: [{ ticker: "ORAC", qty: 1 }, { ticker: "BOAB", qty: 2 }], logic: "Bouclage 2026 : SNTS ×6 (×60 post-split), ORAC ×10, BOAB ×25, CIEC ×23. SNTS stoppée à 6 (le rallye pré-split a fait le rattrapage de poids à sa place). BOAB au-dessus de sa cible 23% — mécanique tant que SNTS gelée domine. Solde non déployé → réserve cash tactique." }),
];

// ── Calendrier 2027 (M10→M21) — DCA 100k FCFA/mois, cours de
// planification du 27/08/2026. Re-pricing AVANCÉ à novembre 2026 :
// le split Sonatel 1:10 (effet 26/10/2026) rend obsolètes les tailles
// d'ordres SNTS (10 actions/mois au lieu d'1). Second re-pricing à la
// revue de juin 2027 comme prévu.
// Grille cible = CORE_TARGETS normalisée à 100% (Phase 1, zéro satellite) :
// SNTS 26,7 · ORAC 20 · CIEC 18,7 · BOAB 18,7 · SDCC 16.
// Achats 2027 : SNTS +7, ORAC +9, CIEC +33, BOAB +17, SDCC +25
// ≈ 1 133k hors frais (~1 150k avec frais ~1,5%) sur 1,2M de budget.
const calendar2027 = [
  planMonth({ m: "M10", month: "janv. 27", legs: [{ ticker: "SDCC", qty: 5 }, { ticker: "BOAB", qty: 2 }], logic: "Initiation SDCC — 5e ligne cœur (utility défensive, yield 3,9%, PE 10). Front-load H1 pour bâtir la ligne vers ~15% fin 2027. Réduit la concentration télécoms au lieu de l'aggraver. Reliquat reporté." }),
  planMonth({ m: "M11", month: "févr. 27", legs: [{ ticker: "SDCC", qty: 5 }, { ticker: "ORAC", qty: 2 }], logic: "SDCC ×5 + ORAC ×2 (convergence vers 20%, cible grille 5 lignes). Léger dépassement couvert par le reliquat de janvier." }),
  planMonth({ m: "M12", month: "mars 27", legs: [{ ticker: "SDCC", qty: 5 }, { ticker: "SNTS", qty: 1 }], logic: "SDCC ×5 (ligne à 15 titres) + SNTS entretenue vers sa cible normalisée 26,7%." }),
  planMonth({ m: "M13", month: "avr. 27", legs: [{ ticker: "SDCC", qty: 5 }, { ticker: "ORAC", qty: 2 }], logic: "Dernier gros bloc SDCC (ligne à 20 titres, ~80% de la cible). ORAC ×2." }),
  planMonth({ m: "M14", month: "mai 27", legs: [{ ticker: "SNTS", qty: 2 }, { ticker: "BOAB", qty: 3 }], logic: "Fenêtre règle 01 : SNTS et BOAB détachent fin mai — acheter avant détachement si pas de dérive de cours > +5% vs moyenne 3 mois." }),
  planMonth({ m: "M15", month: "juin 27", legs: [{ ticker: "ORAC", qty: 2 }, { ticker: "SDCC", qty: 3 }], logic: "Fenêtre ORAC (détachement ~début juin). Revue semestrielle : re-pricer tout le plan H2 aux cours de juin 2027." }),
  planMonth({ m: "M16", month: "juil. 27", legs: [{ ticker: "CIEC", qty: 8 }, { ticker: "SDCC", qty: 2 }], logic: "Retour de CIEC dans le DCA : diluée très en dessous de sa cible (~11% vs 18,7%) + fenêtre détachement fin juillet (règle 01). Garde-fou : si le cours a encore dérivé (yield < 3%), basculer l'enveloppe vers BOAB/SDCC (règle 03) et laisser CIEC sous cible." }),
  planMonth({ m: "M17", month: "août 27", legs: [{ ticker: "CIEC", qty: 9 }, { ticker: "BOAB", qty: 3 }], logic: "Reconvergence H2 : CIEC ×9 + BOAB ×3. Même garde-fou valorisation CIEC qu'en juillet." }),
  planMonth({ m: "M18", month: "sept. 27", legs: [{ ticker: "CIEC", qty: 8 }, { ticker: "SNTS", qty: 1 }], logic: "CIEC ×8 + SNTS ×1 — maintien des poids télécoms pendant la reconvergence utilities." }),
  planMonth({ m: "M19", month: "oct. 27", legs: [{ ticker: "CIEC", qty: 8 }, { ticker: "BOAB", qty: 4 }], logic: "CIEC ×8 + BOAB ×4 — les deux lignes reviennent vers ~19% chacune." }),
  planMonth({ m: "M20", month: "nov. 27", legs: [{ ticker: "SNTS", qty: 2 }, { ticker: "ORAC", qty: 2 }], logic: "Les télécoms complètent leur cible (SNTS 26,7%, ORAC 20%). Dépassement du mois couvert par les reliquats accumulés depuis janvier." }),
  planMonth({ m: "M21", month: "déc. 27", legs: [{ ticker: "SNTS", qty: 1 }, { ticker: "ORAC", qty: 1 }, { ticker: "BOAB", qty: 5 }], logic: "Bouclage 2027 : SNTS ×15, ORAC ×19, CIEC ×54, BOAB ×36, SDCC ×25 — grille 5 lignes à ±1pp. Solde + coupons DRIP → réserve tactique (~90k) pour les fenêtres 2028." }),
];

// Achats restants M7→M9 — valorisés aux cours marché courants.
const END_2026_ADDS = { SNTS: 0, ORAC: 3, BOAB: 12, CIEC: 0 };
const projectedRaw = ["SNTS", "ORAC", "BOAB", "CIEC"].map(ticker => {
  const h = CURRENT_HOLDINGS.find(x => x.ticker === ticker);
  const add = END_2026_ADDS[ticker] || 0;
  return {
    ticker,
    qty: (h?.qty || 0) + add,
    invested: (h?.invested || 0) + add * marketPrice(ticker),
    target: PHASE_CONFIG[0].weights[ticker],
  };
});
const projectedValueTotal = projectedRaw.reduce((s, p) => {
  const st = STOCKS.find(x => x.ticker === p.ticker);
  return s + (st ? p.qty * st.price : 0);
}, 0);
const projected = projectedRaw.map(p => {
  const st = STOCKS.find(x => x.ticker === p.ticker);
  const value = st ? p.qty * st.price : 0;
  return {
    ...p,
    value,
    pct: projectedValueTotal > 0 ? Math.round((value / projectedValueTotal) * 100) : 0,
  };
});
const projectedTotal = projected.reduce((s, p) => s + p.value, 0);

const rules = [
  { n: "01", title: "Fenêtre dividende imminente", desc: "Si un titre cœur est à ≤ 30 jours d'un détachement et que son cours n'a pas dérivé de +5% vs moyenne 3 mois, le prioriser." },
  { n: "02", title: "Décote technique", desc: "Si un titre cœur recule de -8% vs moyenne 3 mois sans dégradation fondamentale, renforcer pour moyenner à la baisse." },
  { n: "03", title: "Équilibrage sectoriel", desc: "Aucun secteur > 35% du portefeuille direct. Si dépassement, basculer vers un autre secteur." },
  { n: "04", title: "Rotation par défaut", desc: "SNTS → ORAC → Utility → Banque hors CI → Satellite. Ordonner selon le calendrier annuel." },
];

// ── Stratégie v2 — données dérivées pour les cartes core/satellite ──
const coreRows = Object.entries(CORE_TARGETS).map(([ticker, weight]) => {
  const s = STOCKS.find(x => x.ticker === ticker);
  return { ticker, weight, name: s?.name || ticker, sector: s?.sector || "—", yield: s?.yield || 0 };
});
const coreTotal = coreRows.reduce((s, r) => s + r.weight, 0);

function loadChecked() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

const MILESTONE_TARGET = 100_000; // F CFA/mois
const DCA_MONTHLY = 75_000;
const IRVM_RATE = 15;

function buildMilestoneData() {
  const phase1 = PHASE_CONFIG[0];
  // Target is monthly — multiply by 12 so the engine (annual-based) calculates the right capital
  const results = computeDividendTargets({
    targets: [MILESTONE_TARGET * 12],
    stocks: STOCKS,
    phaseWeights: phase1.weights,
    currentHoldings: CURRENT_HOLDINGS,
    taxRate: IRVM_RATE,
    dcaMonthly: DCA_MONTHLY,
  });
  return results[0];
}

const milestone = buildMilestoneData();

const projectedMonths = calendar.length;
const projectedEnd = projected.reduce((s, p) => s + p.value, 0);
const projectedEndDivGross = projected.reduce((sum, p) => {
  const s = STOCKS.find(st => st.ticker === p.ticker);
  return sum + (s ? p.qty * s.price * (s.yield / 100) : 0);
}, 0);
const projectedEndDivNet = Math.round(projectedEndDivGross * (1 - IRVM_RATE / 100));
const projectedEndPct = milestone.requiredCapital > 0
  ? Math.min(100, Math.round((projectedEnd / milestone.requiredCapital) * 100))
  : 0;

const PRIVATE_MASK = "••••••";

function CalendarTable({ rows, checked, onToggle }) {
  return (
    <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      <table style={{ width: "100%", minWidth: 1020, borderCollapse: "collapse", fontFamily: FONT_SANS, fontSize: 12 }}>
        <thead>
          <tr>
            {["✓", "Mois", "Principal", "Qty × Prix", "Compl.", "Qty × Prix", "Compl. 2", "Qty × Prix", "Total", "Logique"].map((h, i) => (
              <th key={i} style={{
                padding: "10px 10px", textAlign: i === 0 ? "center" : "left",
                fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted, fontWeight: 600,
                letterSpacing: "0.02em", textTransform: "uppercase",
                borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap",
                width: i === 0 ? 36 : undefined,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const done = checked.includes(r.m);
            return (
              <tr key={i} style={{ opacity: done ? 0.55 : 1, transition: "opacity 0.15s" }}>
                <td style={{ padding: "10px 6px", borderBottom: `1px solid ${T.borderSoft}`, textAlign: "center" }}>
                  <div
                    onClick={() => onToggle(r.m)}
                    style={{
                      width: 22, height: 22, borderRadius: 6, cursor: "pointer",
                      display: "grid", placeItems: "center", margin: "0 auto",
                      background: done ? T.green : T.bgSoft,
                      border: `1.5px solid ${done ? T.green : T.border}`,
                      transition: "all 0.15s",
                    }}
                  >
                    {done && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </td>
                <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T.borderSoft}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: done ? T.green : T.bgDark, color: T.inkInv,
                      display: "grid", placeItems: "center",
                      fontFamily: FONT_MONO, fontSize: 10, fontWeight: 700, flexShrink: 0,
                      transition: "background 0.15s",
                    }}>{r.m}</div>
                    <span style={{
                      fontFamily: FONT_SANS, fontSize: 12, fontWeight: 500, whiteSpace: "nowrap",
                      color: done ? T.green : T.inkMuted,
                      textDecoration: done ? "line-through" : "none",
                    }}>{r.month}</span>
                  </div>
                </td>
                <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T.borderSoft}` }}>
                  <span style={{
                    fontFamily: FONT_MONO, fontSize: 12, color: T.blue, fontWeight: 700,
                    background: T.blueSoft, padding: "3px 8px", borderRadius: 6, whiteSpace: "nowrap",
                  }}>{r.main}</span>
                </td>
                <td style={{ padding: "10px 10px", fontFamily: FONT_MONO, fontSize: 11, color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}`, whiteSpace: "nowrap" }}>{r.units}</td>
                <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T.borderSoft}` }}>
                  {r.second === "—" ? (
                    <span style={{ color: T.inkDim }}>—</span>
                  ) : (
                    <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: T.blue, fontWeight: 700, background: alpha(T.blue, 0.08), padding: "3px 8px", borderRadius: 6, whiteSpace: "nowrap" }}>{r.second}</span>
                  )}
                </td>
                <td style={{ padding: "10px 10px", fontFamily: FONT_MONO, fontSize: 11, color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}`, whiteSpace: "nowrap" }}>{r.second2}</td>
                <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T.borderSoft}` }}>
                  {!r.third || r.third === "—" ? (
                    <span style={{ color: T.inkDim }}>—</span>
                  ) : (
                    <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: T.green, fontWeight: 700, background: T.greenSoft, padding: "3px 8px", borderRadius: 6, whiteSpace: "nowrap" }}>{r.third}</span>
                  )}
                </td>
                <td style={{ padding: "10px 10px", fontFamily: FONT_MONO, fontSize: 11, color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}`, whiteSpace: "nowrap" }}>{r.third2 || "—"}</td>
                <td style={{ padding: "10px 10px", fontFamily: FONT_MONO, fontSize: 12, fontWeight: 600, color: T.ink, borderBottom: `1px solid ${T.borderSoft}`, whiteSpace: "nowrap" }}>
                  {fmtFCFAfull(r.total)} F CFA                </td>
                <td style={{ padding: "10px 10px", color: T.inkMuted, fontStyle: "italic", borderBottom: `1px solid ${T.borderSoft}`, minWidth: 200 }}>{r.logic}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function StrategyTab() {
  const { isMobile, cols } = useResponsive();
  const { isPrivate } = usePrivacy();
  const prv = (formatted) => isPrivate ? PRIVATE_MASK : formatted;
  const [checked, setChecked] = useState(loadChecked);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  const toggleMonth = useCallback((m) => {
    setChecked(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Playbook · stratégie v2 core/satellite"
        title="Architecture, calendrier d'exécution & règles tactiques."
        description="Stratégie v2 (juillet 2026) : cœur 5 lignes défensives (75% en croisière), SGBC en watchlist à déclencheur prix, pool satellite filtré éthiquement (ni tabac, ni alcool). Plan opérationnel DCA 75k FCFA/mois de juin à décembre 2026 (M3→M9), puis 100k/mois en 2027 (M10→M21, initiation SDCC), aligné sur le calendrier des détachements BRVM."
      />

      {/* --- Milestone Tracker --- */}
      <div style={{
        marginBottom: 20, borderRadius: 16,
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        boxShadow: T.shadowElevated,
        overflow: "hidden",
      }}>
        {/* Top accent bar */}
        <div style={{ height: 4, background: T.green, borderRadius: "16px 16px 0 0" }} />

        <div style={{ padding: isMobile ? 20 : 28 }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: T.greenSoft,
                display: "grid", placeItems: "center",
                border: `1px solid ${alpha(T.green, 0.25)}`,
              }}>
                <Target size={18} color={T.green} strokeWidth={2.2} />
              </div>
              <div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 15, fontWeight: 700, color: T.ink, letterSpacing: "-0.01em" }}>
                  Milestone #1
                </div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: T.inkMuted, letterSpacing: "0.02em" }}>
                  Premier objectif dividendes
                </div>
              </div>
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "5px 12px", borderRadius: 999,
              background: T.greenSoft, border: `1px solid ${alpha(T.green, 0.25)}`,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green }} />
              <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: T.green, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                En cours · Phase 1
              </span>
            </div>
          </div>

          {/* Target + progress — two column layout */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? 20 : 32,
            marginBottom: 24,
          }}>
            {/* Target amount */}
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: T.inkMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                Objectif
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 32 : 40, fontWeight: 800, color: T.green, letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {fmtFCFAfull(MILESTONE_TARGET)}
                </span>
                <span style={{ fontFamily: FONT_SANS, fontSize: 16, color: T.inkMuted, fontWeight: 500 }}>
                  F CFA net/mois
                </span>
              </div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: T.inkDim, marginTop: 6 }}>
                {fmtFCFAfull(MILESTONE_TARGET * 12)} F CFA/an · ≈ {fmtEUR(MILESTONE_TARGET)} €/mois
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <span style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted, fontWeight: 500 }}>Progression vers le capital requis</span>
                <span style={{ fontFamily: FONT_MONO, fontSize: 14, color: T.green, fontWeight: 700 }}>
                  {milestone.progressPct}%
                </span>
              </div>
              <div style={{ height: 10, background: T.bgSoft, borderRadius: 999, overflow: "hidden", position: "relative", border: `1px solid ${T.borderSoft}` }}>
                <div style={{
                  height: "100%", borderRadius: 999,
                  width: `${milestone.progressPct}%`,
                  background: T.green,
                  transition: "width 0.6s ease",
                }} />
                {projectedEndPct < 100 && (
                  <div style={{
                    position: "absolute", top: 0, bottom: 0,
                    left: `${projectedEndPct}%`, transform: "translateX(-50%)",
                    width: 2, background: T.amber, borderRadius: 999,
                  }} />
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7 }}>
                <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.inkDim }}>
                  Aujourd'hui : {prv(fmtFCFA(milestone.currentValue))} F CFA                </span>
                <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.inkDim }}>
                  Cible : {prv(fmtFCFA(milestone.requiredCapital))} F CFA                </span>
              </div>
              {projectedEndPct < 100 && projectedEndPct > milestone.progressPct && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                  <div style={{ width: 8, height: 2, background: T.amber, borderRadius: 999 }} />
                  <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.amber }}>
                    Fin 2026 projetée : {prv(fmtFCFA(projectedEnd))} F CFA ({projectedEndPct}%)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Key metrics grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: cols("repeat(2, 1fr)", "repeat(4, 1fr)", "repeat(4, 1fr)"),
            gap: isMobile ? 10 : 14,
            marginBottom: 16,
          }}>
            {[
              { label: "Capital requis",    value: prv(fmtFCFA(milestone.requiredCapital))  + " F CFA",              color: T.ink },
              { label: "Reste à investir",  value: "+" + prv(fmtFCFA(milestone.additionalCapital))  + " F CFA",     color: T.amber },
              { label: "Durée estimée",     value: (milestone.fullYears > 0 ? `${milestone.fullYears}a ` : "") + milestone.remainingMonths + "m", color: T.ink },
              { label: "Div. nets/mois",    value: prv(fmtFCFAfull(Math.round(milestone.currentDivNet / 12)))  + " F CFA", color: T.green },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                padding: "14px 16px", borderRadius: 12,
                background: T.bgSubtle, border: `1px solid ${T.borderSoft}`,
              }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.inkDim, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>{label}</div>
                <div style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 17 : 20, fontWeight: 700, color, letterSpacing: "-0.02em" }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Projected end-of-2026 */}
          <div style={{
            padding: "12px 16px", borderRadius: 10,
            background: T.bgSubtle, border: `1px solid ${T.borderSoft}`,
            display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
            marginBottom: 16,
          }}>
            <Coins size={14} color={T.amber} style={{ flexShrink: 0 }} />
            <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted, lineHeight: 1.6 }}>
              <strong style={{ color: T.amber }}>Projection fin 2026</strong> — avec le calendrier M3→M9 exécuté, dividendes nets estimés :
              <strong style={{ color: T.green }}> {prv(fmtFCFAfull(Math.round(projectedEndDivNet / 12)))} F CFA/mois</strong>
              <span style={{ color: T.inkDim }}> ({Math.round((projectedEndDivNet / 12) / MILESTONE_TARGET * 100)}% de l'objectif)</span>
            </div>
          </div>

          {/* Milestone ladder */}
          <div style={{
            borderTop: `1px solid ${T.borderSoft}`,
            paddingTop: 16,
            display: "grid",
            gridTemplateColumns: cols("1fr", "repeat(2, 1fr)", "repeat(4, 1fr)"),
            gap: 10,
          }}>
            {MILESTONE_LADDER.map((m, i) => {
              // m.target is monthly — capital = annual target / yield%
              const capital = milestone.weightedYieldNet > 0
                ? Math.round((m.target * 12) / (milestone.weightedYieldNet / 100))
                : 0;
              const current = i === 0;
              return (
                <div key={m.target} style={{
                  padding: "12px 14px", borderRadius: 10,
                  background: current ? T.greenSoft : T.bgSubtle,
                  border: `1px solid ${current ? alpha(T.green, 0.3) : T.borderSoft}`,
                }}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: current ? T.green : T.inkDim, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>
                    {m.label}{current ? " · en cours" : ""}
                  </div>
                  <div style={{ fontFamily: FONT_SANS, fontSize: 15, fontWeight: 700, color: current ? T.green : T.ink, letterSpacing: "-0.02em" }}>
                    {fmtFCFAfull(m.target)} F CFA/mois
                  </div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.inkDim, marginTop: 4 }}>
                    ≈ {prv(fmtFCFA(capital))} F CFA de capital · {m.note}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- Card A: Architecture v2 core/satellite --- */}
      <Card
        title="Architecture v2 — Core / Satellite"
        subtitle="Le cœur porte le rendement, les satellites saisissent les fenêtres · juillet 2026"
        icon={Layers}
        style={{ marginBottom: 16 }}
      >
        {/* Core croisière */}
        <div style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: 700, color: T.ink, marginBottom: 10 }}>
          Le cœur ({coreTotal}% en croisière) — jamais vendu, rééquilibrage par dilution uniquement
        </div>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", marginBottom: 18 }}>
          <table style={{ width: "100%", minWidth: 560, borderCollapse: "collapse", fontFamily: FONT_SANS, fontSize: 12 }}>
            <thead>
              <tr>
                {["Ligne", "Société", "Secteur", "Yield", "Poids croisière"].map((h, i) => (
                  <th key={h} style={{
                    padding: "8px 10px", textAlign: i >= 3 ? "right" : "left",
                    fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted, fontWeight: 600,
                    letterSpacing: "0.02em", textTransform: "uppercase",
                    borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coreRows.map(r => (
                <tr key={r.ticker}>
                  <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T.borderSoft}` }}>
                    <span style={{
                      fontFamily: FONT_MONO, fontSize: 12, fontWeight: 700, color: T.blue,
                      background: T.blueSoft, padding: "3px 8px", borderRadius: 6,
                    }}>{r.ticker}</span>
                  </td>
                  <td style={{ padding: "10px 10px", color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}` }}>{r.name}</td>
                  <td style={{ padding: "10px 10px", color: T.inkMuted, borderBottom: `1px solid ${T.borderSoft}` }}>{r.sector}</td>
                  <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: FONT_MONO, color: T.green, fontWeight: 600, borderBottom: `1px solid ${T.borderSoft}` }}>
                    {r.yield.toString().replace(".", ",")}%
                  </td>
                  <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: FONT_MONO, fontWeight: 700, color: T.ink, borderBottom: `1px solid ${T.borderSoft}` }}>{r.weight}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Watchlist — entrées conditionnelles prix */}
        {WATCHLIST.map(w => (
          <div key={w.ticker} style={{
            padding: "14px 16px", borderRadius: 10, marginBottom: 14,
            background: T.bgSubtle, border: `1px solid ${alpha(T.blue, 0.18)}`,
            display: "flex", alignItems: "flex-start", gap: 12,
          }}>
            <Eye size={15} color={T.blue} style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted, lineHeight: 1.6 }}>
              <strong style={{ color: T.ink }}>Watchlist — {w.ticker} ({w.name}), {w.targetWeight > 0 ? `${w.targetWeight}% si déclenchée` : "candidate satellite (Phase 2)"}.</strong>{" "}
              Déclencheur : <strong style={{ color: T.blue }}>{w.trigger}</strong> ({w.triggerPrice}).{" "}
              {w.note} Le prix vient à toi, pas l'inverse.
            </div>
          </div>
        ))}

        {/* Satellite bets */}
        <div style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: 700, color: T.ink, marginBottom: 10 }}>
          Le pool satellite (jusqu'à 25% en croisière) — 6 candidats, 3 paris réels
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: cols("1fr", "1fr", "repeat(3, 1fr)"),
          gap: 10, marginBottom: 14,
        }}>
          {SATELLITE_BETS.map(bet => (
            <div key={bet.id} style={{
              padding: "14px 16px", borderRadius: 12,
              background: T.bgSubtle, border: `1px solid ${T.borderSoft}`,
            }}>
              <div style={{ fontFamily: FONT_SANS, fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 8 }}>{bet.label}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                {bet.candidates.map(c => (
                  <span key={c.ticker} style={{
                    fontFamily: FONT_MONO, fontSize: 11, fontWeight: 700, color: T.chart3,
                    background: alpha(T.chart3, 0.10), padding: "3px 8px", borderRadius: 6,
                    whiteSpace: "nowrap",
                  }}>{c.ticker} · {c.yield.toString().replace(".", ",")}%</span>
                ))}
              </div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted, lineHeight: 1.5 }}>{bet.note}</div>
            </div>
          ))}
        </div>

        {/* Satellite rules */}
        <div style={{
          padding: "14px 16px", borderRadius: 10, marginBottom: 14,
          background: T.bgSubtle, border: `1px solid ${T.borderSoft}`,
        }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 8 }}>
            Règles satellites — max {SATELLITE_RULES.maxPerLine}% par ligne · {SATELLITE_RULES.maxSimultaneous} simultanés max · aucun avant la Phase 2 (&gt; 5M)
          </div>
          <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted, lineHeight: 1.6, marginBottom: 8 }}>
            <strong style={{ color: T.green }}>Entrée</strong> — {SATELLITE_RULES.entry}
          </div>
          <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted, lineHeight: 1.6 }}>
            <strong style={{ color: T.red }}>Sortie</strong> (critère écrit avant l'achat) — {SATELLITE_RULES.exit.join(" · ")}.
          </div>
        </div>

        {/* Ethical exclusions */}
        <div style={{
          padding: "12px 16px", borderRadius: 10,
          background: alpha(T.red, 0.06), border: `1px solid ${alpha(T.red, 0.18)}`,
          display: "flex", alignItems: "flex-start", gap: 12,
        }}>
          <Ban size={15} color={T.red} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted, lineHeight: 1.6 }}>
            <strong style={{ color: T.red }}>Exclusions éthiques — jamais achetables, quel que soit le rendement :</strong>{" "}
            {ETHICAL_EXCLUSIONS.map(e => `${e.name} (${e.reason}, ${e.yield.toString().replace(".", ",")}%)`).join(" · ")}.
            {" "}Coût assumé du filtre : les deux plus gros yields du pool initial. Également hors plan : ETIT (yield 2,4%, gouvernance) et BOAS (doublon bancaire de BOAB).
          </div>
        </div>
      </Card>

      {/* --- Card 2: Calendrier Phase 1 DCA (moved up for video flow) --- */}
      <Card title="Calendrier Phase 1 — DCA 75k juin → décembre 2026" subtitle={`M3–M6 : cours d'exécution · M7–M9 : cours marché ${fmtFCFAfull(marketPrice("ORAC"))} / ${fmtFCFAfull(marketPrice("BOAB"))} F (ORAC · BOAB) · 28 septembre 2026 · révisé le 25/09 (split SNTS)`} icon={Clock} style={{ marginBottom: 16 }}>
        <CalendarTable rows={calendar} checked={checked} onToggle={toggleMonth} />
      </Card>

      {/* --- Card 2b: Calendrier 2027 --- */}
      <Card title="Calendrier Phase 1 — DCA 100k janvier → décembre 2027" subtitle="M10–M21 : cours de planification du 27/08/2026 · frais courtier ~1,5% par ordre · re-pricing à la revue semestrielle de juin 2027" icon={Clock} style={{ marginBottom: 16 }}>
        <CalendarTable rows={calendar2027} checked={checked} onToggle={toggleMonth} />
        <div style={{
          marginTop: 16, padding: "14px 16px",
          background: T.bgSubtle, borderRadius: 10,
          border: `1px solid ${T.borderSoft}`,
          display: "flex", alignItems: "flex-start", gap: 10,
        }}>
          <AlertCircle size={14} color={T.blue} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted, lineHeight: 1.6 }}>
            <strong>Année de la 5e ligne cœur, toujours zéro satellite</strong> — le déclencheur satellite reste le capital (Phase 2, &gt; 5M), pas le calendrier. Grille cible = grille de croisière normalisée à 100% : SNTS 26,7 · ORAC 20 · CIEC 18,7 · BOAB 18,7 · <strong>SDCC 16</strong>. H1 : front-load SDCC (20 titres avant mai) + fenêtres de détachement SNTS/BOAB (mai) et ORAC (juin). H2 : reconvergence CIEC (diluée sous sa cible) autour de sa fenêtre de juillet, avec garde-fou valorisation (yield &lt; 3% → basculer vers BOAB/SDCC). Budget 1,2M (100k/mois) : ~1 133k hors frais ≈ <strong>1 150k avec frais (~17k de courtage)</strong>, reliquats roulés de mois en mois. Fin 2027 projetée aux cours du 27/08/2026 : ~1,96M en direct, 5 lignes à ±1pp des cibles, <strong>télécoms ramenées de ~58% à ~47%</strong>. <strong>FCP BAM WURUS : maintenu gelé</strong> — c'est le benchmark ; y contribuer polluerait la mesure de surperformance du direct (+35,2% vs +29,3% au 27/08) et ferait payer des frais de gestion sur des lignes déjà détenues en direct.
          </div>
        </div>
      </Card>

      {/* --- Card 0: Journal de bord --- */}
      <Card title="Journal de bord — Décisions clés" subtitle="Historique chronologique des ordres exécutés" icon={Activity} style={{ marginBottom: 16 }}>
        <div style={{ position: "relative", paddingLeft: 28 }}>
          <div style={{
            position: "absolute", left: 10, top: 8, bottom: 8, width: 2,
            background: T.borderSoft, borderRadius: 999,
          }} />
          {journal.map((j, i) => (
            <div key={i} style={{
              position: "relative",
              paddingBottom: i < journal.length - 1 ? 24 : 0,
            }}>
              <div style={{
                position: "absolute", left: -23, top: 6,
                width: 12, height: 12, borderRadius: "50%",
                background: j.color, border: `2px solid ${T.bgCard}`,
                boxShadow: `0 0 0 3px ${j.color}30`,
              }} />
              <div style={{
                fontFamily: FONT_MONO, fontSize: 11, fontWeight: 700,
                color: j.color, marginBottom: 6, letterSpacing: "0.01em",
              }}>{j.date}</div>
              <div style={{
                fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted,
                lineHeight: 1.65, paddingRight: isMobile ? 0 : 20,
              }}>{j.text}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* --- Card 1: Point de situation --- */}
      <Card title="Point de situation — 28 septembre 2026" subtitle="État réel du portefeuille · relevé courtier" icon={Briefcase} style={{ marginBottom: 16 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: cols("1fr", "repeat(3, 1fr)", "repeat(5, 1fr)"),
          gap: 10, marginBottom: 16,
        }}>
          {situationLines.map(s => (
            <div key={s.ticker} style={{
              padding: isMobile ? 14 : 16, borderRadius: 12,
              background: T.bgSubtle,
              border: `1px solid ${alpha(s.held ? T.green : T.amber, 0.19)}`,
              position: "relative",
            }}>
              <div style={{
                position: "absolute", top: -1, left: 16, right: 16, height: 3,
                background: s.held ? T.green : T.amber, borderRadius: "0 0 3px 3px",
              }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontFamily: FONT_MONO, fontSize: 13, fontWeight: 700, color: T.blue }}>{s.ticker}</span>
                <Pill
                  color={s.held ? T.green : T.amber}
                  bg={s.held ? T.greenSoft : T.amberSoft}
                >
                  {s.badge}
                </Pill>
              </div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted, marginBottom: 4 }}>{s.name}</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: T.inkSoft }}>
                {s.qty > 0 ? `${isPrivate ? PRIVATE_MASK : `${s.qty} action${s.qty > 1 ? "s" : ""}`} · moy. ${prv(fmtFCFAfull(s.avgPrice))} F` : "—"}
              </div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 700, color: T.ink, marginTop: 2 }}>
                {s.invested > 0 ? prv(fmtFCFAfull(s.invested))  + " F CFA" : "0 F CFA"}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px", background: T.blueSoft, borderRadius: 10, marginBottom: 10,
        }}>
          <span style={{ fontFamily: FONT_SANS, fontSize: 13, color: T.inkSoft, fontWeight: 500 }}>Capital investi en direct (actions)</span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 18, fontWeight: 700, color: T.blue }}>
            {prv(fmtFCFAfull(situationTotal))} F CFA          </span>
        </div>

        {/* FCP BAM WURUS — legacy / benchmark */}
        <div style={{
          padding: "14px 16px", background: T.bgSubtle, borderRadius: 10, marginBottom: 10,
          border: `1px solid ${T.border}`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 13, fontWeight: 700, color: T.inkSoft }}>FCP BAM WURUS</span>
              <Pill color={T.inkMuted} bg={T.bgSoft}>Gelé · benchmark</Pill>
            </div>
            <span style={{ fontFamily: FONT_MONO, fontSize: 16, fontWeight: 700, color: T.ink }}>
              {prv(fmtFCFAfull(fcpHolding.value))} F CFA            </span>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <span style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted }}>
              {isPrivate ? PRIVATE_MASK : fcpHolding.qty} parts · coût {prv(fmtFCFAfull(fcpHolding.costPerShare))} F CFA/part
            </span>
            <span style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted }}>
              Investi : {prv(fmtFCFAfull(fcpHolding.invested))} F CFA            </span>
            <span style={{
              fontFamily: FONT_MONO, fontSize: 11, fontWeight: 600,
              color: fcpHolding.pnl >= 0 ? T.green : T.red,
            }}>
              {fcpHolding.pnl >= 0 ? "+" : ""}{prv(fmtFCFAfull(fcpHolding.pnl))} F CFA ({fcpHolding.pnlPct}%)
            </span>
          </div>
          <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkDim, marginTop: 6, fontStyle: "italic" }}>
            Position gelée — aucune contribution future. Performance utilisée comme benchmark vs portefeuille direct.
          </div>
        </div>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px", background: `linear-gradient(135deg, ${alpha(T.blue, 0.07)}, ${alpha(T.indigo, 0.07)})`,
          borderRadius: 10, marginBottom: 10,
          border: `1px solid ${alpha(T.blue, 0.15)}`,
        }}>
          <span style={{ fontFamily: FONT_SANS, fontSize: 13, color: T.inkSoft, fontWeight: 600 }}>Valorisation totale (actions + FCP)</span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 18, fontWeight: 700, color: T.blue }}>
            {prv(fmtFCFAfull(directValue + fcpHolding.value))} F CFA          </span>
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 16px", background: T.greenSoft, borderRadius: 10,
        }}>
          <Coins size={14} color={T.green} style={{ flexShrink: 0 }} />
          <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkSoft }}>
            <strong style={{ color: T.green }}>Dernier coupon perçu</strong> — CIEC · 28/07/2026 · 205,92 F × 21 = 4 324 F CFA brut → <strong>3 676 F CFA net</strong> (IRVM 15%) · réinvesti en août
          </div>
        </div>
      </Card>

      {/* --- Card 1b: Direct vs FCP performance comparison --- */}
      <Card title="Direct vs FCP BAM WURUS — Performance comparée" subtitle="Snapshot courtier · 28 septembre 2026" icon={TrendingUp} style={{ marginBottom: 16 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 16,
        }}>
          {/* Direct portfolio */}
          <div style={{
            padding: 20, borderRadius: 12,
            background: T.bgSubtle, border: `1px solid ${alpha(T.blue, 0.15)}`,
            position: "relative",
          }}>
            <div style={{
              position: "absolute", top: -1, left: 16, right: 16, height: 3,
              background: T.blue, borderRadius: "0 0 3px 3px",
            }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontFamily: FONT_SANS, fontSize: 14, fontWeight: 700, color: T.ink }}>Portefeuille direct</span>
              <Pill color={T.blue} bg={T.blueSoft}>Actif · DCA</Pill>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 10, color: T.inkDim, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>Investi</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 600, color: T.inkSoft }}>{prv(fmtFCFAfull(situationTotal))} F CFA</div>
              </div>
              <div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 10, color: T.inkDim, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>Valorisation</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 600, color: T.ink }}>{prv(fmtFCFAfull(directValue))} F CFA</div>
              </div>
              <div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 10, color: T.inkDim, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>+/- Value</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 700, color: directPnl >= 0 ? T.green : T.red }}>
                  {directPnl >= 0 ? "+" : ""}{prv(fmtFCFAfull(directPnl))} F CFA                </div>
              </div>
              <div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 10, color: T.inkDim, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>Performance</div>
                <div style={{
                  fontFamily: FONT_MONO, fontSize: 20, fontWeight: 700,
                  color: directPnl >= 0 ? T.green : T.red,
                }}>
                  {directPnl >= 0 ? "+" : ""}{directPnlPct}%
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12, fontFamily: FONT_SANS, fontSize: 10, color: T.inkDim }}>
              4 lignes · SNTS, ORAC, CIEC, BOAB
            </div>
          </div>

          {/* FCP BAM WURUS */}
          <div style={{
            padding: 20, borderRadius: 12,
            background: T.bgSubtle, border: `1px solid ${alpha(T.inkMuted, 0.15)}`,
            position: "relative",
          }}>
            <div style={{
              position: "absolute", top: -1, left: 16, right: 16, height: 3,
              background: T.inkMuted, borderRadius: "0 0 3px 3px",
            }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontFamily: FONT_SANS, fontSize: 14, fontWeight: 700, color: T.ink }}>FCP BAM WURUS</span>
              <Pill color={T.inkMuted} bg={T.bgSoft}>Gelé · benchmark</Pill>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 10, color: T.inkDim, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>Investi</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 600, color: T.inkSoft }}>{prv(fmtFCFAfull(fcpHolding.invested))} F CFA</div>
              </div>
              <div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 10, color: T.inkDim, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>Valorisation</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 600, color: T.ink }}>{prv(fmtFCFAfull(fcpHolding.value))} F CFA</div>
              </div>
              <div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 10, color: T.inkDim, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>+/- Value</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 700, color: fcpHolding.pnl >= 0 ? T.green : T.red }}>
                  {fcpHolding.pnl >= 0 ? "+" : ""}{prv(fmtFCFAfull(fcpHolding.pnl))} F CFA                </div>
              </div>
              <div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 10, color: T.inkDim, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>Performance</div>
                <div style={{
                  fontFamily: FONT_MONO, fontSize: 20, fontWeight: 700,
                  color: fcpHolding.pnl >= 0 ? T.green : T.red,
                }}>
                  {fcpHolding.pnl >= 0 ? "+" : ""}{fcpHolding.pnlPct}%
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12, fontFamily: FONT_SANS, fontSize: 10, color: T.inkDim }}>
              {isPrivate ? PRIVATE_MASK : fcpHolding.qty} parts · position gelée depuis avril 2026
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 16, padding: "12px 16px",
          background: T.bgSubtle, borderRadius: 10,
          border: `1px solid ${T.borderSoft}`,
          display: "flex", alignItems: "flex-start", gap: 10,
        }}>
          <AlertCircle size={14} color={T.blue} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted, lineHeight: 1.6 }}>
            Comparaison brute à la date du snapshot. Le portefeuille direct est en phase d'accumulation (DCA actif) tandis que le FCP est gelé. La comparaison deviendra significative à mesure que l'historique s'allonge — objectif : surperformer le FCP sur 12+ mois avec le stock picking direct.
          </div>
        </div>
      </Card>

      {/* --- Card 3: Composition cible projetée --- */}
      <Card title="Composition projetée au 31 décembre 2026" subtitle="DCA 75k FCFA/mois · 7 mois (juin → décembre 2026)" icon={Target} style={{ marginBottom: 16 }}>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", minWidth: 720, borderCollapse: "collapse", fontFamily: FONT_SANS, fontSize: 12 }}>
            <thead>
              <tr>
                {["Ticker", "Actions", "Investi", "Valeur", "Poids", "Cible", "Écart"].map(h => (
                  <th key={h} style={{
                    padding: "10px 12px",
                    textAlign: h === "Ticker" ? "left" : "right",
                    fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted, fontWeight: 600,
                    letterSpacing: "0.02em", textTransform: "uppercase",
                    borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projected.map(p => {
                const gap = p.pct - p.target;
                const absGap = Math.abs(gap);
                const gapColor = absGap > 5 ? T.red : absGap > 2 ? T.amber : T.green;
                return (
                  <tr key={p.ticker}>
                    <td style={{ padding: "12px 12px", borderBottom: `1px solid ${T.borderSoft}` }}>
                      <span style={{
                        fontFamily: FONT_MONO, fontSize: 12, fontWeight: 700, color: T.blue,
                        background: T.blueSoft, padding: "3px 8px", borderRadius: 6,
                      }}>{p.ticker}</span>
                    </td>
                    <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}` }}>{isPrivate ? PRIVATE_MASK : p.qty}</td>
                    <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}` }}>
                      {prv(fmtFCFAfull(p.invested))} F CFA                    </td>
                    <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, fontWeight: 600, color: T.ink, borderBottom: `1px solid ${T.borderSoft}` }}>
                      ~{prv(fmtFCFAfull(p.value))} F CFA                    </td>
                    <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, fontWeight: 700, color: T.ink, borderBottom: `1px solid ${T.borderSoft}` }}>{p.pct}%</td>
                    <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, color: T.inkMuted, borderBottom: `1px solid ${T.borderSoft}` }}>{p.target}%</td>
                    <td style={{ padding: "12px 12px", textAlign: "right", borderBottom: `1px solid ${T.borderSoft}` }}>
                      <Pill color={gapColor} bg={alpha(gapColor, 0.09)}>
                        {gap >= 0 ? "+" : ""}{gap} pp {absGap <= 2 ? "✓" : ""}
                      </Pill>
                    </td>
                  </tr>
                );
              })}
              <tr style={{ background: T.bgSubtle }}>
                <td style={{ padding: "12px 12px", fontFamily: FONT_SANS, fontWeight: 700, color: T.ink }}>Total direct</td>
                <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, fontWeight: 600, color: T.inkSoft }}>{isPrivate ? PRIVATE_MASK : projected.reduce((s, p) => s + p.qty, 0)}</td>
                <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, fontWeight: 600, color: T.inkSoft }}>
                  {prv(fmtFCFAfull(projected.reduce((s, p) => s + p.invested, 0)))} F CFA                </td>
                <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, fontWeight: 700, color: T.blue, fontSize: 14 }}>
                  ~{prv(fmtFCFAfull(projectedTotal))} F CFA                </td>
                <td colSpan={3} />
              </tr>
              <tr style={{ background: T.blueSoft }}>
                <td colSpan={3} style={{ padding: "12px 12px", fontFamily: FONT_SANS, fontWeight: 700, color: T.blue }}>Capital total avec FCP BAM WURUS (gelé)</td>
                <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, fontWeight: 700, color: T.blue, fontSize: 14 }}>
                  ~{prv(fmtFCFAfull(projectedTotal + fcpHolding.value))} F CFA                </td>
                <td colSpan={3} />
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{
          marginTop: 16, padding: "14px 16px",
          background: T.bgSubtle, borderRadius: 10,
          border: `1px solid ${T.borderSoft}`,
          display: "flex", alignItems: "flex-start", gap: 10,
        }}>
          <AlertCircle size={14} color={T.blue} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted, lineHeight: 1.6 }}>
            Plan révisé le 25/09/2026 (rallye pré-split SNTS) — <strong>portefeuille 4 lignes (SGBC écartée)</strong>. DCA base 75k/mois + dividendes DRIP, <strong>frais de courtage ~1,5% intégrés à chaque ordre</strong>. Le rallye SNTS (+31% vs CMP) a fait le rattrapage de poids à la place du DCA : <strong>SNTS gelée à 6 actions</strong> (37,8% du direct, au-dessus du cap ligne 35%) et <strong>télécoms au cap 60%</strong> → octobre 100% BOAB (retard 17,6% vs 23%, cours sous CMP, yield brut 6,5%), ORAC reprend en novembre-décembre, <strong>aucun achat CIE</strong> (sur cible). À fin décembre (cours du 28/09) : SNTS ~30%, ORAC ~25%, BOAB ~27%, CIE ~18%. Restant à déployer ~172k hors frais (~174k avec frais) sur ~225k de budget oct.–déc. ; le solde s'accumule en réserve cash. Événements : AGE split Sonatel le 8/10, effet le 26/10 (6 SNTS → 60, re-pricing du plan 2027 en novembre). Le plan 2027 (M10→M21, DCA 100k + initiation SDCC) prend le relais en janvier.
          </div>
        </div>
      </Card>

      {/* --- Cards 4 & 5: Règles + Plafonds --- */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: 16,
      }}>
        <Card title="Règles de priorisation mensuelle" subtitle="Ordre de décision" icon={Compass}>
          {rules.map(r => (
            <div key={r.n} style={{
              padding: "16px 0",
              borderBottom: `1px solid ${T.borderSoft}`,
              display: "flex", gap: 14,
            }}>
              <div style={{
                width: 38, height: 38, flexShrink: 0, borderRadius: 10,
                background: `linear-gradient(135deg, ${T.blue}, ${T.indigo})`,
                color: T.inkInv,
                fontFamily: FONT_MONO, fontSize: 14, fontWeight: 700,
                display: "grid", placeItems: "center",
              }}>{r.n}</div>
              <div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 14, color: T.ink, fontWeight: 600, marginBottom: 4 }}>{r.title}</div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted, lineHeight: 1.55 }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </Card>

        <Card title="Plafonds indexés par phase" subtitle="Les caps se resserrent à mesure que le capital grandit" icon={Gauge}>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", minWidth: 480, borderCollapse: "collapse", fontFamily: FONT_SANS, fontSize: 12 }}>
              <thead>
                <tr>
                  {["Phase", "Core / Sat", "Par ligne", "Télécoms", "CI", "AES"].map((h, i) => (
                    <th key={h} style={{
                      padding: "8px 10px", textAlign: i === 0 ? "left" : "right",
                      fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted, fontWeight: 600,
                      letterSpacing: "0.02em", textTransform: "uppercase",
                      borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PHASE_CONFIG.map(ph => (
                  <tr key={ph.phase}>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T.borderSoft}`, whiteSpace: "nowrap" }}>
                      <span style={{ fontFamily: FONT_MONO, fontSize: 12, fontWeight: 700, color: T.blue }}>P{ph.phase}</span>
                      <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.inkDim, marginLeft: 6 }}>{ph.capitalRange}</span>
                    </td>
                    <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: FONT_MONO, fontWeight: 600, color: T.chart3, borderBottom: `1px solid ${T.borderSoft}`, whiteSpace: "nowrap" }}>
                      {ph.coreRatio} / {ph.satelliteRatio}
                    </td>
                    <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: FONT_MONO, color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}` }}>{ph.caps.line}%</td>
                    <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: FONT_MONO, color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}` }}>{ph.caps.telecom}%</td>
                    <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: FONT_MONO, color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}` }}>{ph.caps.ci}%</td>
                    <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: FONT_MONO, color: ph.caps.aes === 0 ? T.red : T.inkSoft, borderBottom: `1px solid ${T.borderSoft}` }}>{ph.caps.aes}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{
            marginTop: 12, padding: "10px 14px",
            background: T.bgSubtle, borderRadius: 8,
            fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted, lineHeight: 1.6,
          }}>
            La Phase 1 tolère des poids concentrés (SNTS 32%, télécoms 57%) — c'est l'exception documentée d'un portefeuille en construction. Les caps convergent vers le régime de croisière (20% / 35%) à partir de la Phase 3. Le cash tactique n'est pas un objectif : c'est le reliquat mécanique du DCA mensuel, déployable via les règles 01/02. Revue semestrielle : juin &amp; décembre.
          </div>
        </Card>
      </div>
    </div>
  );
}
