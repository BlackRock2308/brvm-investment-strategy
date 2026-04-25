import React from "react";
import { Clock, Compass, Gauge, Layers, ShieldCheck } from "lucide-react";
import { T, FONT_SANS, FONT_MONO } from "../../theme";
import useResponsive from "../../hooks/useResponsive";

import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";

const calendar = [
  { m: "M1",  month: "mai",   main: "SNTS", units: "1 × 29 000", second: "CIEC",  second2: "6 × 3 400", logic: "Initier cœur télécoms + utility" },
  { m: "M2",  month: "juin",  main: "ORAC", units: "3 × 15 000", second: "—",     second2: "—",          logic: "Renforcer #1 capitalisation marché" },
  { m: "M3",  month: "juil.", main: "BOAB", units: "8 × 5 965",  second: "—",     second2: "—",          logic: "BOA Bénin post-détachement (yield 9,4%)" },
  { m: "M4",  month: "août",  main: "CIEC", units: "9 × 3 400",  second: "SGBC",  second2: "1 × 31 000", logic: "Doubler sur utilities + initier SGBC" },
  { m: "M5",  month: "sept.", main: "SNTS", units: "1 × 29 000", second: "CIEC",  second2: "5 × 3 400",  logic: "Renforcer cœur sur consolidation" },
  { m: "M6",  month: "oct.",  main: "SGBC", units: "1 × 31 000", second: "BOAB",  second2: "3 × 5 965",  logic: "Banques — profiter de la saisonnalité Q4" },
  { m: "M7",  month: "nov.",  main: "ORAC", units: "3 × 15 000", second: "—",     second2: "—",          logic: "Renforcer Orange CI avant résultats" },
  { m: "M8",  month: "déc.",  main: "CIEC", units: "14 × 3 400", second: "—",     second2: "—",          logic: "CIE — plein sur utility défensive fin d'année" },
  { m: "M9",  month: "janv.", main: "SNTS", units: "1 × 29 000", second: "BOAB",  second2: "3 × 5 965",  logic: "Nouvelle année — signatures de rendement" },
  { m: "M10", month: "févr.", main: "ORAC", units: "3 × 15 000", second: "—",     second2: "—",          logic: "Renforcer télécoms avant résultats T1" },
  { m: "M11", month: "mars",  main: "SGBC", units: "1 × 31 000", second: "CIEC",  second2: "5 × 3 400",  logic: "SGBC + utility — pré-AGO" },
  { m: "M12", month: "avr.",  main: "ORAC", units: "3 × 15 000", second: "—",     second2: "—",          logic: "Fin cycle — renforcer leader" },
];

const concentrationRules = [
  { n: "01", title: "Démarrer concentré", desc: "Phase 1 : uniquement 5 titres à forte conviction. Chaque ordre mensuel renforce une ligne existante plutôt que d'en ouvrir une nouvelle.", color: T.blue },
  { n: "02", title: "Vérifier la corrélation", desc: "Avant d'ajouter une 6e ligne (Phase 2), s'assurer que la corrélation avec le portefeuille existant est < 0.50 pour réduire le risque global.", color: T.green },
  { n: "03", title: "Plafonner à 8 lignes", desc: "Au-delà de 8 lignes, la taille moyenne par position est trop faible pour générer un impact significatif. Le suivi devient aussi plus coûteux en temps.", color: T.amber },
];

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
  const { isMobile } = useResponsive();

  return (
    <div>
      <PageHeader
        eyebrow="Playbook · bloc 2"
        title="Calendrier d'exécution & règles tactiques."
        description="Plan opérationnel pour DCA 50k FCFA/mois la première année, aligné sur le calendrier des détachements de dividendes BRVM."
      />

      <Card title="Règle de concentration progressive" subtitle="Méthodologie avant d'ajouter des lignes" icon={Layers} style={{ marginBottom: 16 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: 14,
        }}>
          {concentrationRules.map(r => (
            <div key={r.n} style={{
              display: "flex", gap: 14, alignItems: "flex-start",
              padding: isMobile ? 14 : 18,
              background: T.bgSubtle, border: `1px solid ${T.borderSoft}`,
              borderRadius: 12,
            }}>
              <div style={{
                width: 40, height: 40, flexShrink: 0, borderRadius: 10,
                background: r.color + "18", color: r.color,
                fontFamily: FONT_MONO, fontSize: 14, fontWeight: 700,
                display: "grid", placeItems: "center",
              }}>{r.n}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: FONT_SANS, fontSize: 14, color: T.ink, fontWeight: 600, marginBottom: 4 }}>{r.title}</div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted, lineHeight: 1.55 }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Calendrier Phase 1 — Concentration cœur" subtitle="DCA 50k FCFA · SNTS, ORAC, CIEC, BOAB, SGBC uniquement" icon={Clock} style={{ marginBottom: 16 }}>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", minWidth: 700, borderCollapse: "collapse", fontFamily: FONT_SANS, fontSize: 12 }}>
            <thead>
              <tr>
                {["Mois", "Principal", "Units × Prix", "Compl.", "Units × Prix", "Logique"].map((h, i) => (
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
                        fontFamily: FONT_MONO, fontSize: 11, fontWeight: 700, flexShrink: 0,
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
                  <td style={{ padding: "10px 10px", color: T.inkMuted, fontStyle: "italic", borderBottom: `1px solid ${T.borderSoft}`, minWidth: 180 }}>{r.logic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

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
