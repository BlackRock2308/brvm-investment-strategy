import React, { useState, useEffect, useCallback } from "react";
import { Clock, Compass, Gauge, Briefcase, Target, AlertCircle, Activity, Coins, CheckSquare } from "lucide-react";
import { T, FONT_SANS, FONT_MONO } from "../../theme";
import { fmtFCFAfull } from "../../utils/format";
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
    date: "22 mai 2026",
    text: "Premier dividende perçu — SNTS détache 1 740 F brut, soit 1 480 F net après IRVM 15%. Premier flux de revenus passifs. À réinvestir au prochain ordre.",
    color: T.green,
  },
];

const situationLines = [
  { ticker: "SNTS", name: "Sonatel",   qty: 1,  invested: 29000,  avgPrice: 29000,  badge: "✓ Détenue (M1)",      held: true },
  { ticker: "CIEC", name: "CIE",       qty: 11, invested: 36640,  avgPrice: 3331,   badge: "✓ Renforcée (M1+M2)", held: true },
  { ticker: "BOAB", name: "BOA Bénin", qty: 3,  invested: 25500,  avgPrice: 8500,   badge: "✓ Initiée (M2)",      held: true },
  { ticker: "ORAC", name: "Orange CI", qty: 1,  invested: 15350,  avgPrice: 15350,  badge: "✓ Initiée (M2)",      held: true },
  { ticker: "SGBC", name: "SGBCI",     qty: 0,  invested: 0,      avgPrice: 0,      badge: "À initier (M3 ou M4)",held: false },
];
const situationTotal = 106490;

const STORAGE_KEY = "omaad-calendar-done";

const calendar = [
  { m: "M1",  month: "avr. 26",  main: "SNTS", units: "1 × 29 000",  second: "CIEC", second2: "7 × 3 400",  total: 52800,  logic: "Initiation portefeuille direct — 1ère ligne cœur télécoms + utility défensive." },
  { m: "M2",  month: "mai 26",   main: "BOAB", units: "3 × 8 500",   second: "CIEC", second2: "4 × 3 210",  total: 53690,  logic: "Initier BOAB pré-détachement + ORAC 1 × 15 350 F + renforcer CIEC sur baisse à 3 210 F." },
  { m: "M3",  month: "juin 26",  main: "ORAC", units: "2 × 15 245",  second: "SGBC", second2: "1 × 34 500", total: 64990,  logic: "Renforcer ORAC très sous-pondérée (14% actuel vs 22% cible) + initier SGBC (5e ligne cœur). DCA exceptionnellement supérieur à 50k pour intégrer la 5e ligne." },
  { m: "M4",  month: "juil. 26", main: "BOAB", units: "4 × 7 800",   second: "CIEC", second2: "5 × 3 100",  total: 46700,  logic: "Renforcer BOAB sur baisse mécanique post-détachement juin-juillet + lisser CIEC." },
  { m: "M5",  month: "août 26",  main: "ORAC", units: "3 × 15 245",  second: "—",    second2: "—",          total: 45735,  logic: "Plein sur Orange CI — convergence vers cible 22%." },
  { m: "M6",  month: "sept. 26", main: "SGBC", units: "1 × 34 500",  second: "CIEC", second2: "4 × 3 100",  total: 46900,  logic: "SGBC 2e achat + CIEC pré-détachement utility automne." },
  { m: "M7",  month: "oct. 26",  main: "BOAB", units: "5 × 7 800",   second: "CIEC", second2: "3 × 3 100",  total: 48300,  logic: "Renforcer BOAB pour atteindre cible 20% + CIEC pré-détachement nov." },
  { m: "M8",  month: "nov. 26",  main: "ORAC", units: "3 × 15 245",  second: "—",    second2: "—",          total: 45735,  logic: "ORAC reste la ligne la plus sous-cible structurellement." },
  { m: "M9",  month: "déc. 26",  main: "SNTS", units: "1 × 28 500",  second: "CIEC", second2: "5 × 3 100",  total: 44000,  logic: "Renforcer SNTS fin d'année + lisser CIEC post-détachement." },
  { m: "M10", month: "janv. 27", main: "SGBC", units: "1 × 34 500",  second: "ORAC", second2: "1 × 15 245", total: 49745,  logic: "SGBC 3e achat + ORAC continue convergence." },
  { m: "M11", month: "févr. 27", main: "BOAB", units: "6 × 7 800",   second: "—",    second2: "—",          total: 46800,  logic: "BOAB renforcement — compounder dividende." },
  { m: "M12", month: "mars 27",  main: "ORAC", units: "3 × 15 245",  second: "—",    second2: "—",          total: 45735,  logic: "Plein ORAC pré-AGO entreprises ivoiriennes." },
  { m: "M13", month: "avr. 27",  main: "SNTS", units: "1 × 28 500",  second: "BOAB", second2: "2 × 7 800",  total: 44100,  logic: "SNTS pré-détachement mai + BOAB lissage." },
  { m: "M14", month: "mai 27",   main: "SNTS", units: "1 × 28 500",  second: "CIEC", second2: "5 × 3 100",  total: 44000,  logic: "Boucler le cycle annuel — SNTS post-détachement année 2 + CIEC." },
];

const projected = [
  { ticker: "SNTS", qty: 4,  value: 114000,  pct: 13, target: 28 },
  { ticker: "ORAC", qty: 14, value: 213430,  pct: 24, target: 22 },
  { ticker: "CIEC", qty: 33, value: 102300,  pct: 12, target: 17 },
  { ticker: "BOAB", qty: 20, value: 156000,  pct: 18, target: 20 },
  { ticker: "SGBC", qty: 3,  value: 103500,  pct: 12, target: 13 },
];
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
    return raw ? JSON.parse(raw) : ["M1", "M2"];
  } catch { return ["M1", "M2"]; }
}

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
        description="Plan opérationnel pour DCA ~50k FCFA/mois de juin 2026 à mai 2027 (M3→M14), aligné sur le calendrier des détachements de dividendes BRVM."
      />

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
      <Card title="Point de situation — fin mai 2026 (M1 + M2 exécutés)" subtitle="État réel du portefeuille après 2 mois de DCA" icon={Briefcase} style={{ marginBottom: 16 }}>
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
          <span style={{ fontFamily: FONT_SANS, fontSize: 13, color: T.inkSoft, fontWeight: 500 }}>Capital total investi en direct</span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 18, fontWeight: 700, color: T.blue }}>
            {fmtFCFAfull(situationTotal)} F
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

      {/* --- Card 2: Calendrier 12 mois --- */}
      <Card title="Calendrier Phase 1 — DCA avril 2026 → mai 2027 (M1 à M14)" subtitle="Cochez chaque mois une fois l'ordre exécuté" icon={Clock} style={{ marginBottom: 16 }}>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", minWidth: 820, borderCollapse: "collapse", fontFamily: FONT_SANS, fontSize: 12 }}>
            <thead>
              <tr>
                {["✓", "Mois", "Principal", "Qty × Prix", "Compl.", "Qty × Prix", "Total", "Logique"].map((h, i) => (
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
      <Card title="Composition cible à fin mai 2027" subtitle="Projection 12 mois de DCA à ~50k FCFA/mois" icon={Target} style={{ marginBottom: 16 }}>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", minWidth: 620, borderCollapse: "collapse", fontFamily: FONT_SANS, fontSize: 12 }}>
            <thead>
              <tr>
                {["Ticker", "Actions", "Valeur", "Poids", "Cible", "Écart"].map(h => (
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
                const gapColor = absGap > 5 ? T.amber : T.green;
                return (
                  <tr key={p.ticker}>
                    <td style={{ padding: "12px 12px", borderBottom: `1px solid ${T.borderSoft}` }}>
                      <span style={{
                        fontFamily: FONT_MONO, fontSize: 12, fontWeight: 700, color: T.blue,
                        background: T.blueSoft, padding: "3px 8px", borderRadius: 6,
                      }}>{p.ticker}</span>
                    </td>
                    <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}` }}>{p.qty}</td>
                    <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, fontWeight: 600, color: T.ink, borderBottom: `1px solid ${T.borderSoft}` }}>
                      ~{fmtFCFAfull(p.value)} F
                    </td>
                    <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, fontWeight: 700, color: T.ink, borderBottom: `1px solid ${T.borderSoft}` }}>{p.pct}%</td>
                    <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, color: T.inkMuted, borderBottom: `1px solid ${T.borderSoft}` }}>{p.target}%</td>
                    <td style={{ padding: "12px 12px", textAlign: "right", borderBottom: `1px solid ${T.borderSoft}` }}>
                      <Pill color={gapColor} bg={gapColor + "18"}>
                        {gap >= 0 ? "+" : ""}{gap} pp
                      </Pill>
                    </td>
                  </tr>
                );
              })}
              <tr style={{ background: T.bgSubtle }}>
                <td style={{ padding: "12px 12px", fontFamily: FONT_SANS, fontWeight: 700, color: T.ink }}>Total</td>
                <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, fontWeight: 600, color: T.inkSoft }}>{projected.reduce((s, p) => s + p.qty, 0)}</td>
                <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, fontWeight: 700, color: T.blue, fontSize: 14 }}>
                  ~{fmtFCFAfull(projectedTotal)} F
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
            À 50k FCFA/mois, la convergence vers les pondérations cibles atteint un bon équilibre à 24 mois. SNTS reste sous-cible (prix unitaire 28-29k F absorbe trop d'un seul DCA mensuel). ORAC, BOAB, CIEC, SGBC convergent correctement. Pour accélérer SNTS, envisager des achats opportunistes lors de fenêtres de baisse.
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
