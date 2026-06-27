import React, { useState, useEffect, useCallback } from "react";
import { Clock, Compass, Gauge, Briefcase, Target, AlertCircle, Activity, Coins, CheckSquare, TrendingUp } from "lucide-react";
import { T, FONT_SANS, FONT_MONO } from "../../theme";
import { fmtFCFA, fmtFCFAfull, fmtEUR } from "../../utils/format";
import { CURRENT_HOLDINGS, STOCKS, PHASE_CONFIG, FCP_BENCHMARK } from "../../data/stocks";
import { computeDividendTargets } from "../../utils/projections";
import useResponsive from "../../hooks/useResponsive";

import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import Pill from "../ui/Pill";

const journal = [
  {
    date: "Avril 2026 (M1)",
    text: "Initiation portefeuille direct. Achat 1 SNTS à 29 000 F (1ère ligne cœur télécoms) + 7 CIEC à 3 400 F (initiation utility défensive). Total déployé : 52 800 F.",
    color: T.blue,
  },
  {
    date: "Mai 2026 (M2)",
    text: "Adaptation aux conditions de marché. BOAB a rallié de +36% vs référence rapport (5 965 → 8 500 F) avant détachement juin-juillet. Décision : prendre 3 BOAB malgré le rallye plutôt que skipper. CIEC est descendue à 3 210 F (−9% vs référence) — opportunité saisie avec 4 CIEC supplémentaires. ORAC initiée à 15 350 F après ajustement de l'ordre limit (initialement à 14 650 F, non exécuté car le marché s'est envolé).",
    color: T.chart3,
  },
  {
    date: "4 mai 2026",
    text: "Snapshot portefeuille complet. Direct : SNTS ×1, CIEC ×11, BOAB ×3, ORAC ×1 — total investi 105 347 F, valorisation 105 660 F (+0.3%). FCP BAM WURUS : 11 parts, investi 200 000 F, valorisation 202 545 F (+1.3%). Décision : geler le FCP (aucune contribution future) et l'utiliser uniquement comme benchmark pour mesurer la surperformance du stock picking direct.",
    color: T.chart5,
  },
  {
    date: "15 mai 2026",
    text: "Nouveau snapshot portefeuille. Direct : SNTS ×2 (CMP 29 122), CIEC ×17 (CMP 3 227), BOAB ×3 (CMP 8 625), ORAC ×1 (CMP 15 476) — total investi 154 459 F, valorisation 157 230 F (+2 771 F, +1.8%). FCP BAM WURUS : 11 parts, valorisation 202 606 F (+1.3%). Valorisation globale 359 836 F sur 354 459 F investis (+5 378 F, +1.5%). SNTS et CIEC renforcées depuis le 4 mai.",
    color: T.chart5,
  },
  {
    date: "22 mai 2026",
    text: "Premier dividende perçu — SNTS détache 1 740 F brut, soit 1 480 F net après IRVM 15%. Premier flux de revenus passifs. À réinvestir au prochain ordre.",
    color: T.green,
  },
  {
    date: "Juin 2026 (M3)",
    text: "Décision stratégique : passage du DCA de 50k à 75k FCFA/mois. Objectif : atteindre les cibles Phase 1 quasi parfaitement à fin décembre 2026 (clôture activité). Cette montée du DCA permet d'acheter 1 SNTS par mois (vs 1 tous les 3 mois), ce qui était le maillon faible du plan précédent. Aucune projection au-delà du 31/12/2026.",
    color: T.amber,
  },
  {
    date: "1 juin 2026 (M3 exécuté)",
    text: "Premier DRIP réel. Budget 80k FCFA dont 4 450 F de dividendes SNTS+BOAB réinvestis. Ordres passés : 1 SNTS à 28 450 F + 2 ORAC à 16 000 F + 4 CIEC à 4 140 F = 77 010 F hors frais (78 144 F avec frais courtier). CIEC réduit de 5 à 4 actions car cours en rallye (+28% vs CMP). Portefeuille direct : SNTS ×3, ORAC ×3, CIEC ×21, BOAB ×3 — total investi 231 464 F, valorisation 247 200 F (+6.8%). FCP BAM WURUS : 214 492 F (+7%).",
    color: T.green,
  },
  {
    date: "8 juin 2026",
    text: "Dividende Orange CI détaché : 704 F brut/action (4 actions). ORAC renforcée à 4 lignes (CMP 16 007 F) après un dernier achat à 16 700 F. Le coupon ORAC vient nourrir le prochain DRIP.",
    color: T.green,
  },
  {
    date: "27 juin 2026 (snapshot courtier)",
    text: "Relevé courtier complet. Direct : SNTS ×3 (clôture 29 000), CIEC ×21 (5 200), BOAB ×3 (9 025), ORAC ×4 (16 700) — investi 248 687 F, valorisation 290 075 F (+41 387 F, +16,6%). CIE tire la performance (+52% vs CMP). FCP BAM WURUS : 11 parts à 19 214 F, valorisation 226 998 F (+26 998 F, +13%). Patrimoine global 517 073 F (+68 386 F).",
    color: T.chart5,
  },
];

const BADGE_MAP = {
  SNTS: "✓ Renforcée (M1→M3)",
  CIEC: "✓ Renforcée (M1→M3)",
  BOAB: "✓ Initiée (M2)",
  ORAC: "✓ Renforcée (M2+M3)",
  SGBC: "À initier (M4)",
};
const NAME_MAP = { SNTS: "Sonatel", CIEC: "CIE", BOAB: "BOA Bénin", ORAC: "Orange CI", SGBC: "SGBCI" };
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

// Valorisations au cours de clôture (relevé courtier 27 juin 2026).
const directValues = {
  SNTS: 87000,
  CIEC: 109200,
  BOAB: 27075,
  ORAC: 66800,
};
const directValue = Object.values(directValues).reduce((a, b) => a + b, 0);
const directPnl = directValue - situationTotal;
const directPnlPct = ((directPnl / situationTotal) * 100).toFixed(1);

const STORAGE_KEY = "omaad-calendar-done";

const calendar = [
  { m: "M3",  month: "juin 26",  main: "SNTS", units: "1 × 28 450",  second: "ORAC", second2: "2 × 16 000", third: "CIEC", third2: "4 × 4 140",  total: 77010,  logic: "SNTS mensuel initié + ORAC renforcée + CIEC réduit de 5 à 4 (cours en rallye +28% vs CMP). BOAB reporté à juillet post-détachement. Premier DRIP : dividendes SNTS+BOAB réinvestis." },
  { m: "M4",  month: "juil. 26", main: "SGBC", units: "1 × 39 000",  second: "BOAB", second2: "4 × 9 025",  third: "—", third2: "",  total: 75100,  logic: "Initiation SGBC (5e ligne cœur enfin) + comblement BOAB, la ligne la plus sous-pondérée. Aucun achat CIE — déjà surpondérée (+20pp) après le rallye." },
  { m: "M5",  month: "août 26",  main: "BOAB", units: "5 × 9 025",   second: "ORAC", second2: "2 × 16 700", third: "—", third2: "",  total: 78525,  logic: "Rattrapage BOAB + renforcement ORAC. Convergence des deux lignes les plus en retard." },
  { m: "M6",  month: "sept. 26", main: "BOAB", units: "4 × 9 025",   second: "SNTS", second2: "1 × 29 000", third: "—", third2: "",  total: 65100,  logic: "Fin du rattrapage BOAB (cible 16 atteinte) + 1 SNTS mensuel." },
  { m: "M7",  month: "oct. 26",  main: "ORAC", units: "2 × 16 700",  second: "SNTS", second2: "1 × 29 000", third: "—", third2: "",  total: 62400,  logic: "Renforcement ORAC vers 22% + SNTS mensuel." },
  { m: "M8",  month: "nov. 26",  main: "ORAC", units: "2 × 16 700",  second: "SNTS", second2: "1 × 29 000", third: "—", third2: "",  total: 62400,  logic: "ORAC atteint sa cible (10 actions) + SNTS." },
  { m: "M9",  month: "déc. 26",  main: "SGBC", units: "1 × 39 000",  second: "SNTS", second2: "1 × 29 000", third: "—", third2: "",  total: 68000,  logic: "2e ligne SGBC + SNTS final. Bouclage 2026 : convergence Phase 1 à ±2pp. Solde non déployé → réserve cash tactique." },
];

// Composition cible fin 2026 (quantités du plan DCA reconstruit aux cours du 27/06/2026) — valorisée aux cours courants.
const projectedRaw = [
  { ticker: "SNTS", qty: 7,  invested: 203113, target: 28 },
  { ticker: "ORAC", qty: 10, invested: 164230, target: 22 },
  { ticker: "BOAB", qty: 16, invested: 143200, target: 20 },
  { ticker: "CIEC", qty: 21, invested: 71669,  target: 17 },
  { ticker: "SGBC", qty: 2,  invested: 78000,  target: 13 },
];
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

const caps = [
  { label: "Par ligne individuelle", value: "20%", desc: "Max d'une position dans le portefeuille direct.", color: T.blue },
  { label: "Par secteur direct", value: "35%", desc: "SF ≤ 30% car FCP BAM déjà à 43% SF.", color: T.chart3 },
  { label: "Côte d'Ivoire", value: "60%", desc: "Dominante autorisée, jamais monopole.", color: T.green },
  { label: "Zone AES combinée", value: "5%", desc: "Burkina + Mali + Niger — risque souverain.", color: T.red },
  { label: "Cash tactique", value: "5-10%", desc: "Pour saisir corrections de -15% à -25%.", color: T.amber },
];

function loadChecked() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

const MILESTONE_TARGET = 100_000;
const DCA_MONTHLY = 75_000;
const IRVM_RATE = 15;

function buildMilestoneData() {
  const phase1 = PHASE_CONFIG[0];
  const results = computeDividendTargets({
    targets: [MILESTONE_TARGET],
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

export default function StrategyTab() {
  const { isMobile, cols } = useResponsive();
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
        eyebrow="Playbook · bloc 2"
        title="Calendrier d'exécution & règles tactiques."
        description="Plan opérationnel DCA 75k FCFA/mois de juin à décembre 2026 (M3→M9), aligné sur le calendrier des détachements de dividendes BRVM. Clôture activité 31/12/2026."
      />

      {/* --- Milestone Tracker --- */}
      <div style={{
        marginBottom: 20, borderRadius: 16, overflow: "hidden",
        background: `linear-gradient(135deg, ${T.bgDark} 0%, #1a1f35 100%)`,
        border: `1px solid ${T.bgDark}`,
        position: "relative",
      }}>
        <div style={{
          position: "absolute", top: -60, right: -60,
          width: 240, height: 240,
          background: `radial-gradient(circle, ${T.green}25, transparent 65%)`,
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", bottom: -40, left: -40,
          width: 180, height: 180,
          background: `radial-gradient(circle, ${T.blue}20, transparent 65%)`,
          borderRadius: "50%",
        }} />

        <div style={{ position: "relative", padding: isMobile ? 20 : 28 }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${T.green}, ${T.neon})`,
              display: "grid", placeItems: "center",
              boxShadow: `0 4px 16px ${T.green}40`,
            }}>
              <Target size={18} color="white" strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 15, fontWeight: 700, color: T.inkInv, letterSpacing: "-0.01em" }}>
                Milestone #1
              </div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: "#9CA3AF", letterSpacing: "0.02em" }}>
                Premier objectif dividendes
              </div>
            </div>
          </div>

          {/* Target amount */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
              Objectif
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 32 : 40, fontWeight: 700, color: T.neon, letterSpacing: "-0.03em", lineHeight: 1 }}>
                {fmtFCFAfull(MILESTONE_TARGET)}
              </span>
              <span style={{ fontFamily: FONT_SANS, fontSize: 16, color: "#9CA3AF", fontWeight: 500 }}>
                F net/an
              </span>
            </div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: "#6B7280", marginTop: 4 }}>
              {fmtFCFAfull(Math.round(MILESTONE_TARGET / 12))} F/mois · ≈ {fmtEUR(MILESTONE_TARGET)} €/an
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <span style={{ fontFamily: FONT_SANS, fontSize: 12, color: "#9CA3AF", fontWeight: 500 }}>Progression vers le capital requis</span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: T.neon, fontWeight: 700 }}>
                {milestone.progressPct}%
              </span>
            </div>
            <div style={{ height: 12, background: "#1f2937", borderRadius: 999, overflow: "hidden", position: "relative" }}>
              <div style={{
                height: "100%", borderRadius: 999,
                width: `${milestone.progressPct}%`,
                background: `linear-gradient(90deg, ${T.blue}, ${T.green}, ${T.neon})`,
                transition: "width 0.6s ease",
                boxShadow: `0 0 12px ${T.green}60`,
              }} />
              {/* End-of-2026 projected marker */}
              {projectedEndPct < 100 && (
                <div style={{
                  position: "absolute", top: -4, bottom: -4,
                  left: `${projectedEndPct}%`, transform: "translateX(-50%)",
                  width: 3, background: T.amber, borderRadius: 999,
                  boxShadow: `0 0 8px ${T.amber}80`,
                }} />
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: "#6B7280" }}>
                Aujourd'hui : {fmtFCFA(milestone.currentValue)} F
              </span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: "#6B7280" }}>
                Cible : {fmtFCFA(milestone.requiredCapital)} F
              </span>
            </div>
            {projectedEndPct < 100 && projectedEndPct > milestone.progressPct && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                <div style={{ width: 8, height: 3, background: T.amber, borderRadius: 999 }} />
                <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.amber }}>
                  Fin 2026 projetée : {fmtFCFA(projectedEnd)} F ({projectedEndPct}%)
                </span>
              </div>
            )}
          </div>

          {/* Key metrics grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: cols("repeat(2, 1fr)", "repeat(4, 1fr)", "repeat(4, 1fr)"),
            gap: isMobile ? 10 : 14,
          }}>
            <div style={{ padding: "14px 16px", background: "rgba(255,255,255,0.05)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>Capital requis</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 18 : 22, fontWeight: 700, color: T.inkInv, letterSpacing: "-0.02em" }}>
                {fmtFCFA(milestone.requiredCapital)} F
              </div>
            </div>
            <div style={{ padding: "14px 16px", background: "rgba(255,255,255,0.05)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>Reste à investir</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 18 : 22, fontWeight: 700, color: T.amber, letterSpacing: "-0.02em" }}>
                +{fmtFCFA(milestone.additionalCapital)} F
              </div>
            </div>
            <div style={{ padding: "14px 16px", background: "rgba(255,255,255,0.05)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>Durée estimée</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 18 : 22, fontWeight: 700, color: T.inkInv, letterSpacing: "-0.02em" }}>
                {milestone.fullYears > 0 ? `${milestone.fullYears}a ` : ""}{milestone.remainingMonths}m
              </div>
            </div>
            <div style={{ padding: "14px 16px", background: "rgba(255,255,255,0.05)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>Div. nets actuels</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 18 : 22, fontWeight: 700, color: T.green, letterSpacing: "-0.02em" }}>
                {fmtFCFAfull(milestone.currentDivNet)} F/an
              </div>
            </div>
          </div>

          {/* Projected end-of-2026 dividends */}
          <div style={{
            marginTop: 16, padding: "12px 16px",
            background: "rgba(255,255,255,0.04)", borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
          }}>
            <Coins size={14} color={T.amber} style={{ flexShrink: 0 }} />
            <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: "#9CA3AF", lineHeight: 1.6 }}>
              <strong style={{ color: T.amber }}>Projection fin 2026</strong> — avec le calendrier M3→M9 exécuté, dividendes nets estimés :
              <strong style={{ color: T.green }}> {fmtFCFAfull(projectedEndDivNet)} F/an</strong>
              <span style={{ color: "#6B7280" }}> ({Math.round(projectedEndDivNet / MILESTONE_TARGET * 100)}% de l'objectif)</span>
            </div>
          </div>
        </div>
      </div>

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
      <Card title="Point de situation — 27 juin 2026" subtitle="État réel du portefeuille · relevé courtier" icon={Briefcase} style={{ marginBottom: 16 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: cols("1fr", "repeat(3, 1fr)", "repeat(5, 1fr)"),
          gap: 10, marginBottom: 16,
        }}>
          {situationLines.map(s => (
            <div key={s.ticker} style={{
              padding: isMobile ? 14 : 16, borderRadius: 12,
              background: T.bgSubtle,
              border: `1px solid ${s.held ? T.green : T.amber}30`,
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
                {s.qty > 0 ? `${s.qty} action${s.qty > 1 ? "s" : ""} · moy. ${fmtFCFAfull(s.avgPrice)} F` : "—"}
              </div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 700, color: T.ink, marginTop: 2 }}>
                {s.invested > 0 ? fmtFCFAfull(s.invested) + " F" : "0 F"}
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
            {fmtFCFAfull(situationTotal)} F
          </span>
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
              {fmtFCFAfull(fcpHolding.value)} F
            </span>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <span style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted }}>
              {fcpHolding.qty} parts · coût {fmtFCFAfull(fcpHolding.costPerShare)} F/part
            </span>
            <span style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted }}>
              Investi : {fmtFCFAfull(fcpHolding.invested)} F
            </span>
            <span style={{
              fontFamily: FONT_MONO, fontSize: 11, fontWeight: 600,
              color: fcpHolding.pnl >= 0 ? T.green : T.red,
            }}>
              {fcpHolding.pnl >= 0 ? "+" : ""}{fmtFCFAfull(fcpHolding.pnl)} F ({fcpHolding.pnlPct}%)
            </span>
          </div>
          <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkDim, marginTop: 6, fontStyle: "italic" }}>
            Position gelée — aucune contribution future. Performance utilisée comme benchmark vs portefeuille direct.
          </div>
        </div>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px", background: `linear-gradient(135deg, ${T.blue}12, ${T.indigo}12)`,
          borderRadius: 10, marginBottom: 10,
          border: `1px solid ${T.blue}25`,
        }}>
          <span style={{ fontFamily: FONT_SANS, fontSize: 13, color: T.inkSoft, fontWeight: 600 }}>Capital total portefeuille</span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 18, fontWeight: 700, color: T.blue }}>
            {fmtFCFAfull(situationTotal + fcpHolding.invested)} F
          </span>
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 16px", background: T.greenSoft, borderRadius: 10,
        }}>
          <Coins size={14} color={T.green} style={{ flexShrink: 0 }} />
          <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkSoft }}>
            <strong style={{ color: T.green }}>Premier dividende perçu</strong> — SNTS · 22/05/2026 · 1 740 F brut → <strong>1 480 F net</strong> (IRVM 15%)
          </div>
        </div>
      </Card>

      {/* --- Card 1b: Direct vs FCP performance comparison --- */}
      <Card title="Direct vs FCP BAM WURUS — Performance comparée" subtitle="Snapshot courtier · 27 juin 2026" icon={TrendingUp} style={{ marginBottom: 16 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 16,
        }}>
          {/* Direct portfolio */}
          <div style={{
            padding: 20, borderRadius: 12,
            background: T.bgSubtle, border: `1px solid ${T.blue}25`,
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
                <div style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 600, color: T.inkSoft }}>{fmtFCFAfull(situationTotal)} F</div>
              </div>
              <div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 10, color: T.inkDim, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>Valorisation</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 600, color: T.ink }}>{fmtFCFAfull(directValue)} F</div>
              </div>
              <div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 10, color: T.inkDim, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>+/- Value</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 700, color: directPnl >= 0 ? T.green : T.red }}>
                  {directPnl >= 0 ? "+" : ""}{fmtFCFAfull(directPnl)} F
                </div>
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
            background: T.bgSubtle, border: `1px solid ${T.inkMuted}25`,
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
                <div style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 600, color: T.inkSoft }}>{fmtFCFAfull(fcpHolding.invested)} F</div>
              </div>
              <div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 10, color: T.inkDim, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>Valorisation</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 600, color: T.ink }}>{fmtFCFAfull(fcpHolding.value)} F</div>
              </div>
              <div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 10, color: T.inkDim, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>+/- Value</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 700, color: fcpHolding.pnl >= 0 ? T.green : T.red }}>
                  {fcpHolding.pnl >= 0 ? "+" : ""}{fmtFCFAfull(fcpHolding.pnl)} F
                </div>
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
              {fcpHolding.qty} parts · position gelée depuis avril 2026
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

      {/* --- Card 2: Calendrier 12 mois --- */}
      <Card title="Calendrier Phase 1 — DCA 75k juin → décembre 2026" subtitle="Convergence vers cibles Phase 1 à clôture 2026" icon={Clock} style={{ marginBottom: 16 }}>
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
              {calendar.map((r, i) => {
                const done = checked.includes(r.m);
                return (
                  <tr key={i} style={{ opacity: done ? 0.55 : 1, transition: "opacity 0.15s" }}>
                    <td style={{ padding: "10px 6px", borderBottom: `1px solid ${T.borderSoft}`, textAlign: "center" }}>
                      <div
                        onClick={() => toggleMonth(r.m)}
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
                        <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: T.chart3, fontWeight: 700, background: "#EDE9FE", padding: "3px 8px", borderRadius: 6, whiteSpace: "nowrap" }}>{r.second}</span>
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
                      {fmtFCFAfull(r.total)} F
                    </td>
                    <td style={{ padding: "10px 10px", color: T.inkMuted, fontStyle: "italic", borderBottom: `1px solid ${T.borderSoft}`, minWidth: 200 }}>{r.logic}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
                    <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}` }}>{p.qty}</td>
                    <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}` }}>
                      {fmtFCFAfull(p.invested)} F
                    </td>
                    <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, fontWeight: 600, color: T.ink, borderBottom: `1px solid ${T.borderSoft}` }}>
                      ~{fmtFCFAfull(p.value)} F
                    </td>
                    <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, fontWeight: 700, color: T.ink, borderBottom: `1px solid ${T.borderSoft}` }}>{p.pct}%</td>
                    <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, color: T.inkMuted, borderBottom: `1px solid ${T.borderSoft}` }}>{p.target}%</td>
                    <td style={{ padding: "12px 12px", textAlign: "right", borderBottom: `1px solid ${T.borderSoft}` }}>
                      <Pill color={gapColor} bg={gapColor + "18"}>
                        {gap >= 0 ? "+" : ""}{gap} pp {absGap <= 2 ? "✓" : ""}
                      </Pill>
                    </td>
                  </tr>
                );
              })}
              <tr style={{ background: T.bgSubtle }}>
                <td style={{ padding: "12px 12px", fontFamily: FONT_SANS, fontWeight: 700, color: T.ink }}>Total direct</td>
                <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, fontWeight: 600, color: T.inkSoft }}>{projected.reduce((s, p) => s + p.qty, 0)}</td>
                <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, fontWeight: 600, color: T.inkSoft }}>
                  {fmtFCFAfull(projected.reduce((s, p) => s + p.invested, 0))} F
                </td>
                <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, fontWeight: 700, color: T.blue, fontSize: 14 }}>
                  ~{fmtFCFAfull(projectedTotal)} F
                </td>
                <td colSpan={3} />
              </tr>
              <tr style={{ background: T.blueSoft }}>
                <td colSpan={3} style={{ padding: "12px 12px", fontFamily: FONT_SANS, fontWeight: 700, color: T.blue }}>Capital total avec FCP BAM WURUS (gelé)</td>
                <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, fontWeight: 700, color: T.blue, fontSize: 14 }}>
                  ~{fmtFCFAfull(projectedTotal + fcpHolding.value)} F
                </td>
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
            Plan reconstruit aux cours du 27/06/2026 : DCA base 75k/mois + dividendes DRIP. Stratégie de reconvergence — <strong>aucun achat CIE</strong> (déjà surpondérée à 38% après le rallye), priorité au comblement de <strong>BOAB</strong> (+13 actions) et à l'initiation de <strong>SGBC</strong> (2 actions). Le poids de CIE se dilue naturellement vers ~16%. À fin décembre, les 5 lignes convergent à ±2pp des cibles Phase 1. Capital déployé ~411k sur 450k disponibles : le solde (~40k) + DRIP alimentent la réserve cash tactique (5-10% IPS). Aucune projection au-delà du 31/12/2026.
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

        <Card title="Plafonds de rééquilibrage" subtitle="Revue semestrielle · juin & décembre" icon={Gauge}>
          {caps.map((r, i, arr) => (
            <div key={r.label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              padding: "16px 0",
              borderBottom: i < arr.length - 1 ? `1px solid ${T.borderSoft}` : "none",
              gap: 12,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONT_SANS, fontSize: 13, color: T.ink, fontWeight: 600, marginBottom: 3 }}>{r.label}</div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted, lineHeight: 1.5 }}>{r.desc}</div>
              </div>
              <div style={{
                padding: "6px 14px",
                background: r.color + "18", color: r.color,
                fontFamily: FONT_SANS, fontSize: 16, fontWeight: 700,
                borderRadius: 8, flexShrink: 0,
              }}>{r.value}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
