import React from "react";
import { Clock, Compass, Gauge, Briefcase, Target, CheckCircle2, AlertCircle } from "lucide-react";
import { T, FONT_SANS, FONT_MONO } from "../../theme";
import { fmtFCFAfull } from "../../utils/format";
import useResponsive from "../../hooks/useResponsive";

import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import Pill from "../ui/Pill";

const startingLines = [
  { ticker: "SNTS", name: "Sonatel",     qty: 1,  value: 29000,  held: true },
  { ticker: "CIEC", name: "CIE",         qty: 7,  value: 23800,  held: true },
  { ticker: "ORAC", name: "Orange CI",   qty: 0,  value: 0,      held: false },
  { ticker: "BOAB", name: "BOA Bénin",   qty: 0,  value: 0,      held: false },
  { ticker: "SGBC", name: "SGBCI",       qty: 0,  value: 0,      held: false },
];

const calendar = [
  { m: "M2",  month: "mai 26",   main: "BOAB", units: "5 × 5 965",  second: "ORAC", second2: "1 × 15 000", total: 44825,  logic: "Initier BOA Bénin avant détachement juin-juillet + initier ORAC. SNTS détache déjà le 22/05 sur la position existante." },
  { m: "M3",  month: "juin 26",  main: "ORAC", units: "2 × 15 000", second: "BOAB", second2: "3 × 5 965",  total: 47895,  logic: "Renforcer ORAC très sous-pondérée + continuer BOAB pré-détachement." },
  { m: "M4",  month: "juil. 26", main: "BOAB", units: "5 × 5 965",  second: "CIEC", second2: "5 × 3 400",  total: 46825,  logic: "Post-détachement BOAB sur baisse mécanique du cours. Lisser CIEC." },
  { m: "M5",  month: "août 26",  main: "SGBC", units: "1 × 31 000", second: "ORAC", second2: "1 × 15 000", total: 46000,  logic: "Initier SGBC — 5e et dernière ligne cœur Phase 1 enfin ouverte." },
  { m: "M6",  month: "sept. 26", main: "ORAC", units: "3 × 15 000", second: "—",    second2: "—",          total: 45000,  logic: "Plein sur Orange CI — toujours la ligne la plus sous-pondérée vs cible 22%." },
  { m: "M7",  month: "oct. 26",  main: "BOAB", units: "7 × 5 965",  second: "—",    second2: "—",          total: 41755,  logic: "Renforcer BOAB pour converger vers 20% cible." },
  { m: "M8",  month: "nov. 26",  main: "ORAC", units: "3 × 15 000", second: "—",    second2: "—",          total: 45000,  logic: "Encore Orange CI — convergence cible structurelle longue." },
  { m: "M9",  month: "déc. 26",  main: "SNTS", units: "1 × 29 000", second: "CIEC", second2: "5 × 3 400",  total: 46000,  logic: "Renforcer Sonatel fin d'année + lisser CIEC." },
  { m: "M10", month: "janv. 27", main: "SGBC", units: "1 × 31 000", second: "ORAC", second2: "1 × 15 000", total: 46000,  logic: "Deuxième achat SGBC + ORAC continue convergence." },
  { m: "M11", month: "févr. 27", main: "BOAB", units: "7 × 5 965",  second: "—",    second2: "—",          total: 41755,  logic: "BOAB encore — compounder dividende, conviction maintenue." },
  { m: "M12", month: "mars 27",  main: "ORAC", units: "3 × 15 000", second: "—",    second2: "—",          total: 45000,  logic: "Plein ORAC pré-AGO entreprises ivoiriennes." },
  { m: "M13", month: "avr. 27",  main: "SNTS", units: "1 × 29 000", second: "CIEC", second2: "5 × 3 400",  total: 46000,  logic: "Boucler le cycle annuel — SNTS pré-détachement mai + lisser CIEC." },
];

const projected = [
  { ticker: "SNTS", qty: 3,  value: 87000,  pct: 14, target: 28 },
  { ticker: "ORAC", qty: 17, value: 255000, pct: 41, target: 22 },
  { ticker: "CIEC", qty: 22, value: 74800,  pct: 12, target: 17 },
  { ticker: "BOAB", qty: 27, value: 161055, pct: 26, target: 20 },
  { ticker: "SGBC", qty: 2,  value: 62000,  pct: 10, target: 13 },
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

export default function StrategyTab() {
  const { isMobile, cols } = useResponsive();

  return (
    <div>
      <PageHeader
        eyebrow="Playbook · bloc 2"
        title="Calendrier d'exécution & règles tactiques."
        description="Plan opérationnel pour DCA 50k FCFA/mois de mai 2026 à avril 2027, aligné sur le calendrier des détachements de dividendes BRVM."
      />

      {/* --- Card 1: Point de départ --- */}
      <Card title="Point de départ — fin avril 2026" subtitle="Portefeuille existant avant le cycle DCA" icon={Briefcase} style={{ marginBottom: 16 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: cols("1fr", "repeat(3, 1fr)", "repeat(5, 1fr)"),
          gap: 10, marginBottom: 16,
        }}>
          {startingLines.map(s => (
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
                  {s.held ? "Détenue" : "À initier"}
                </Pill>
              </div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted, marginBottom: 4 }}>{s.name}</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: T.inkSoft }}>
                {s.qty > 0 ? `${s.qty} action${s.qty > 1 ? "s" : ""}` : "—"}
              </div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 700, color: T.ink, marginTop: 2 }}>
                {s.value > 0 ? fmtFCFAfull(s.value) + " F" : "0 F"}
              </div>
            </div>
          ))}
        </div>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px", background: T.blueSoft, borderRadius: 10,
        }}>
          <span style={{ fontFamily: FONT_SANS, fontSize: 13, color: T.inkSoft, fontWeight: 500 }}>Capital total engagé</span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 18, fontWeight: 700, color: T.blue }}>
            {fmtFCFAfull(startingLines.reduce((s, l) => s + l.value, 0))} F
          </span>
        </div>
      </Card>

      {/* --- Card 2: Calendrier 12 mois --- */}
      <Card title="Calendrier Phase 1 — DCA 50k mai 2026 → avril 2027" subtitle="Convergence progressive vers les 5 cibles Phase 1" icon={Clock} style={{ marginBottom: 16 }}>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", minWidth: 780, borderCollapse: "collapse", fontFamily: FONT_SANS, fontSize: 12 }}>
            <thead>
              <tr>
                {["Mois", "Principal", "Qty × Prix", "Compl.", "Qty × Prix", "Total", "Logique"].map((h, i) => (
                  <th key={i} style={{
                    padding: "10px 10px", textAlign: "left",
                    fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted, fontWeight: 600,
                    letterSpacing: "0.02em", textTransform: "uppercase",
                    borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {calendar.map((r, i) => (
                <tr key={i}>
                  <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T.borderSoft}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: T.bgDark, color: T.inkInv,
                        display: "grid", placeItems: "center",
                        fontFamily: FONT_MONO, fontSize: 10, fontWeight: 700, flexShrink: 0,
                      }}>{r.m}</div>
                      <span style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted, fontWeight: 500, whiteSpace: "nowrap" }}>{r.month}</span>
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
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* --- Card 3: Composition cible projetée --- */}
      <Card title="Composition cible à fin avril 2027" subtitle="Projection 12 mois de DCA à 50k FCFA/mois" icon={Target} style={{ marginBottom: 16 }}>
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
            La convergence vers les pondérations cibles prend 18-24 mois à 50k/mois. C'est mécanique : SNTS (29k l'unité) et SGBC (31k l'unité) ne peuvent pas être achetées chaque mois. ORAC et BOAB sur-convergent temporairement parce que leurs prix unitaires permettent des achats plus fréquents.
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
