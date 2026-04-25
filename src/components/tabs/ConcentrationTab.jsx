import React from "react";
import { Layers, Target, AlertTriangle, CheckCircle2 } from "lucide-react";
import { T, FONT_SANS, FONT_MONO } from "../../theme";
import { STOCKS, PHASE_CONFIG } from "../../data/stocks";
import useResponsive from "../../hooks/useResponsive";

import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import Pill from "../ui/Pill";

const COMPARE = [
  { label: "Concentré 5", lines: 5, sizePerLine: "600k", orders: "1-2", friction: "0.8%", complexity: "Faible", color: T.green, highlight: true },
  { label: "Équilibré 7", lines: 7, sizePerLine: "430k", orders: "2-3", friction: "1.2%", complexity: "Modéré", color: T.blue },
  { label: "Dilué 10",    lines: 10, sizePerLine: "300k", orders: "3-5", friction: "1.8%", complexity: "Élevé", color: T.red },
];

const PHASE_TABLE = [
  { phase: "Phase 1", capital: "< 5M", lines: 5, tickers: "SNTS, ORAC, BOAB, CIEC, SGBC", reason: "Construire un cœur concentré de qualité avec moat fort" },
  { phase: "Phase 2", capital: "5 – 15M", lines: 6, tickers: "+ BOAS", reason: "Yield diaspora Sénégal, corrélation modérée avec BOAB" },
  { phase: "Phase 3", capital: "15 – 30M", lines: 7, tickers: "+ SDCC", reason: "Utility eau défensive, faible corrélation avec le cœur" },
  { phase: "Phase 4", capital: "> 30M", lines: 8, tickers: "+ ETIT ou PALC/SPHC", reason: "Turnaround pan-AF ou hedge commodity, max 1 satellite" },
];

const CORR_TICKERS = ["SNTS", "ORAC", "BOAB", "CIEC", "SGBC"];
const CORR_DATA = {
  "SNTS-SNTS": 1, "SNTS-ORAC": 0.55, "SNTS-BOAB": 0.25, "SNTS-CIEC": 0.30, "SNTS-SGBC": 0.28,
  "ORAC-ORAC": 1, "ORAC-BOAB": 0.22, "ORAC-CIEC": 0.35, "ORAC-SGBC": 0.30,
  "BOAB-BOAB": 1, "BOAB-CIEC": 0.20, "BOAB-SGBC": 0.62,
  "CIEC-CIEC": 1, "CIEC-SGBC": 0.25,
  "SGBC-SGBC": 1,
};

function getCorr(a, b) {
  return CORR_DATA[`${a}-${b}`] ?? CORR_DATA[`${b}-${a}`] ?? 0.25;
}

function corrColor(v) {
  if (v >= 1) return { bg: T.bgSoft, text: T.inkDim };
  if (v > 0.6) return { bg: T.redSoft, text: T.red };
  if (v >= 0.4) return { bg: T.amberSoft, text: T.amber };
  return { bg: T.greenSoft, text: T.green };
}

const TRIGGERS = [
  { n: "01", title: "Seuil de capital atteint", desc: "Le portefeuille franchit le palier de la phase suivante (5M, 15M, 30M FCFA).", color: T.blue },
  { n: "02", title: "Ligne existante au plafond de 20%", desc: "Une position atteint la pondération maximale autorisée — il faut déployer vers une nouvelle ligne plutôt que surconcentrer.", color: T.chart3 },
  { n: "03", title: "Nouvelle thèse macro identifiée", desc: "Un catalyseur structurel justifie l'ouverture d'une nouvelle position (IPO, réforme, privatisation).", color: T.green },
  { n: "04", title: "Corrélation < 0.5 avec le portefeuille", desc: "La nouvelle ligne réduit le risque global — éviter d'empiler des banques UEMOA corrélées à >0.6.", color: T.amber },
];

export default function ConcentrationTab() {
  const { isMobile, cols } = useResponsive();

  return (
    <div>
      <PageHeader
        eyebrow="Méthodologie · concentration progressive"
        title="Moins de lignes, plus de conviction."
        description="« Wide diversification is only required when investors do not understand what they are doing. » — Warren Buffett. Sur petit capital, 5 paris de qualité battent systématiquement 10 paris dilués."
      />

      {/* Comparative 3 approaches */}
      <Card title="Concentré vs Dilué — sur un capital de 3M FCFA" subtitle="Impact sur taille par ligne, friction et complexité" icon={Layers} style={{ marginBottom: 16 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: cols("1fr", "repeat(3, 1fr)", "repeat(3, 1fr)"),
          gap: 14,
        }}>
          {COMPARE.map(c => (
            <div key={c.label} style={{
              padding: isMobile ? 16 : 22,
              background: c.highlight ? T.bgCard : T.bgSubtle,
              border: `1px solid ${c.highlight ? c.color : T.borderSoft}`,
              borderRadius: 12,
              position: "relative",
            }}>
              {c.highlight && (
                <div style={{
                  position: "absolute", top: -1, left: 20, right: 20, height: 3,
                  background: c.color, borderRadius: "0 0 3px 3px",
                }} />
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontFamily: FONT_SANS, fontSize: 16, fontWeight: 700, color: T.ink }}>{c.label}</div>
                <Pill color={c.color} bg={c.color + "18"}>{c.lines} lignes</Pill>
              </div>
              {[
                { label: "Taille / ligne", value: c.sizePerLine + " F" },
                { label: "Ordres / mois", value: c.orders },
                { label: "Friction courtage", value: c.friction },
                { label: "Complexité suivi", value: c.complexity },
              ].map(row => (
                <div key={row.label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 0",
                  borderBottom: `1px solid ${T.borderSoft}`,
                }}>
                  <span style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted }}>{row.label}</span>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: T.ink, fontWeight: 600 }}>{row.value}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>

      {/* Phase evolution table */}
      <Card title="Évolution recommandée par phase" subtitle="De la construction du cœur à l'allocation complète" icon={Target} style={{ marginBottom: 16 }}>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", minWidth: 650, borderCollapse: "collapse", fontFamily: FONT_SANS, fontSize: 12 }}>
            <thead>
              <tr>
                {["Phase", "Capital", "Lignes", "Titres", "Raison de l'expansion"].map(h => (
                  <th key={h} style={{
                    padding: "10px 12px", textAlign: "left",
                    fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted,
                    fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
                    borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PHASE_TABLE.map((p, i) => (
                <tr key={p.phase} style={{
                  background: i === 0 ? T.blueSoft : "transparent",
                }}>
                  <td style={{ padding: "14px 12px", fontWeight: 700, color: T.ink, borderBottom: `1px solid ${T.borderSoft}`, whiteSpace: "nowrap" }}>
                    <Pill color={i === 0 ? T.blue : T.inkSoft} bg={i === 0 ? T.blueSoft : T.bgSoft}>{p.phase}</Pill>
                  </td>
                  <td style={{ padding: "14px 12px", fontFamily: FONT_MONO, color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}`, whiteSpace: "nowrap" }}>{p.capital}</td>
                  <td style={{ padding: "14px 12px", fontFamily: FONT_MONO, color: T.blue, fontWeight: 700, borderBottom: `1px solid ${T.borderSoft}` }}>{p.lines}</td>
                  <td style={{ padding: "14px 12px", fontFamily: FONT_MONO, fontSize: 11, color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}` }}>{p.tickers}</td>
                  <td style={{ padding: "14px 12px", color: T.inkMuted, fontStyle: "italic", borderBottom: `1px solid ${T.borderSoft}`, minWidth: 200 }}>{p.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Correlation heatmap */}
      <Card title="Matrice de corrélation 5 ans — Cœur Phase 1" subtitle="Vert < 0.4 · Ambre 0.4-0.6 · Rouge > 0.6 · Cluster bancaire en exergue" icon={Layers} style={{ marginBottom: 16 }}>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ borderCollapse: "collapse", fontFamily: FONT_MONO, fontSize: 12, margin: "0 auto" }}>
            <thead>
              <tr>
                <th style={{ padding: 8, width: 60 }} />
                {CORR_TICKERS.map(t => (
                  <th key={t} style={{
                    padding: "8px 10px", textAlign: "center",
                    fontFamily: FONT_MONO, fontSize: 11, color: T.blue, fontWeight: 700,
                    borderBottom: `1px solid ${T.border}`,
                  }}>{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CORR_TICKERS.map(row => (
                <tr key={row}>
                  <td style={{
                    padding: "8px 10px", fontFamily: FONT_MONO, fontSize: 11,
                    color: T.blue, fontWeight: 700, borderRight: `1px solid ${T.border}`,
                  }}>{row}</td>
                  {CORR_TICKERS.map(col => {
                    const v = getCorr(row, col);
                    const c = corrColor(v);
                    const isBankCluster = ["BOAB", "SGBC"].includes(row) && ["BOAB", "SGBC"].includes(col) && row !== col;
                    return (
                      <td key={col} style={{
                        padding: "10px 14px", textAlign: "center",
                        background: c.bg, color: c.text, fontWeight: 700,
                        border: isBankCluster ? `2px solid ${T.red}` : `1px solid ${T.bgCard}`,
                        borderRadius: 4, fontSize: 12,
                      }}>
                        {v === 1 ? "—" : v.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{
          marginTop: 14, padding: "10px 14px", background: T.redSoft,
          borderRadius: 8, display: "flex", alignItems: "flex-start", gap: 8,
        }}>
          <AlertTriangle size={14} color={T.red} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkSoft, lineHeight: 1.5 }}>
            <strong style={{ color: T.red }}>Cluster bancaire BOAB-SGBC (0.62)</strong> — ces deux lignes montent et descendent ensemble. En Phase 1, c'est un risque acceptable car compensé par les télécoms (corrélation faible ~0.25). Surveiller si BOAS (Phase 2) ajoute une troisième exposition bancaire corrélée.
          </div>
        </div>
      </Card>

      {/* When to add a line */}
      <Card title="Quand ajouter une nouvelle ligne ?" subtitle="4 critères déclencheurs — tous doivent être validés" icon={CheckCircle2}>
        <div style={{
          display: "grid",
          gridTemplateColumns: cols("1fr", "repeat(2, 1fr)", "repeat(2, 1fr)"),
          gap: 14,
        }}>
          {TRIGGERS.map(t => (
            <div key={t.n} style={{
              display: "flex", gap: 14, alignItems: "flex-start",
              padding: isMobile ? 14 : 18,
              background: T.bgSubtle,
              border: `1px solid ${T.borderSoft}`,
              borderRadius: 12,
            }}>
              <div style={{
                width: 40, height: 40, flexShrink: 0, borderRadius: 10,
                background: t.color + "18", color: t.color,
                fontFamily: FONT_MONO, fontSize: 14, fontWeight: 700,
                display: "grid", placeItems: "center",
              }}>{t.n}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: FONT_SANS, fontSize: 14, color: T.ink, fontWeight: 600, marginBottom: 4 }}>{t.title}</div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted, lineHeight: 1.55 }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
