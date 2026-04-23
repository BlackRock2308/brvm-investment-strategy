import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { ShieldAlert, Gauge, BookOpen, CheckCircle2 } from "lucide-react";
import { T, FONT_SANS, FONT_MONO } from "../../theme";
import useResponsive from "../../hooks/useResponsive";

import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import Pill from "../ui/Pill";
import ChartTooltip from "../ui/ChartTooltip";

const risks = [
  { title: "Sahel / AES", severity: "Élevé", sevColor: T.red, desc: "AES hors CEDEAO depuis 2024, instabilité persistante.", mit: "Plafond 5% combiné BOA Burkina+Mali+Niger, éviter ONATEL Burkina, ORGT." },
  { title: "Réforme ECO / FCFA flottant", severity: "Modéré", sevColor: T.amber, desc: "Projet relancé depuis 2019, dévaluation possible -15 à -25%.", mit: "Hedge naturel PALC + SPHC (ventes USD). Obligations ECO double-cotées Lux." },
  { title: "Fiscalité France", severity: "Modéré", sevColor: T.amber, desc: "PFU 30% stable mais contesté politiquement.", mit: "Suivi LF annuel. Anticiper retour résidence Sénégal phase 4." },
  { title: "Faillite SGI / Cyber", severity: "Faible", sevColor: T.blue, desc: "FGI agréée CREPMF, mais portefeuille 50-100M mérite diligence.", mit: "Titres nominatif pur au DC/BR. Diversifier 2 SGI dès 30M FCFA." },
  { title: "Choc systémique global", severity: "Élevé", sevColor: T.red, desc: "BRVM -30% en mars 2020. Un choc similaire probable sur 20 ans.", mit: "Cash tactique 5-10% pour renforcer sur -15% à -25%." },
  { title: "Risque vie personnelle", severity: "Certain", sevColor: T.inkMuted, desc: "Mariage, enfants, immobilier modifient l'équation financière.", mit: "Cloisonner : BRVM ≠ épargne précaution ≠ projet immo. 6-12 mois charges liquides." },
];

const ipsRules = [
  { n: "01", title: "Automatiser le DCA", desc: "Virement auto mensuel vers FGI dès salaire (J+1). Ratio fixe 15-20% du net.", color: T.blue },
  { n: "02", title: "Revaloriser annuellement", desc: "Chaque 1er janvier, revoir le DCA à la hausse. +10 à +20%/an les 10 premières années.", color: T.chart3 },
  { n: "03", title: "Concentrer avec l'âge", desc: "10-12 lignes phase 1-2 → 6-8 lignes phase 3-4. Simplifier progressivement.", color: T.green },
  { n: "04", title: "DRIP jusqu'à 41-44 ans", desc: "Ne pas prélever de dividendes avant. Le compounding fait la différence 50M vs 90M.", color: T.amber },
  { n: "05", title: "Anti-fragilité comportementale", desc: "Ne jamais liquider pour motif émotionnel. Préserver la discipline du cycle long.", color: T.red },
  { n: "06", title: "Revue triennale", desc: "À 32, 35, 38, 41, 44, 47 ans. Ajuster la tactique, jamais la stratégie fondamentale.", color: T.chart5 },
  { n: "07", title: "Documenter les ordres", desc: "Journal d'investissement : date, ticker, units, prix, thèse 3 phrases. Actif stratégique sur 20 ans.", color: T.chart6 },
];

const glidePath = [
  { phase: "P1 — 29→34", actions: 95, obligations: 0, cash: 5 },
  { phase: "P2 — 34→39", actions: 90, obligations: 5, cash: 5 },
  { phase: "P3 — 39→44", actions: 80, obligations: 15, cash: 5 },
  { phase: "P4 — 44→49", actions: 65, obligations: 25, cash: 10 },
];

export default function RisksTab() {
  const { isMobile, cols } = useResponsive();

  return (
    <div>
      <PageHeader
        eyebrow="Gouvernance · bloc 5"
        title="Risques & Investment Policy Statement."
        description="L'IPS codifie votre discipline sur 20 ans. C'est ce qui fait la différence entre atteindre 50M et 100M."
      />

      <Card title="Glide path 20 ans" subtitle="Allocation par phase de carrière" icon={Gauge} style={{ marginBottom: 16 }}>
        <ResponsiveContainer width="100%" height={isMobile ? 220 : 280}>
          <BarChart data={glidePath} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke={T.borderSoft} vertical={false} strokeDasharray="3 3"/>
            <XAxis dataKey="phase" stroke={T.inkDim} tick={{ fontSize: isMobile ? 10 : 12, fontFamily: FONT_SANS, fill: T.inkSoft, fontWeight: 500 }} axisLine={false} tickLine={false}/>
            <YAxis stroke={T.inkDim} tick={{ fontSize: 11, fontFamily: FONT_MONO, fill: T.inkMuted }} axisLine={false} tickLine={false}/>
            <Tooltip content={<ChartTooltip />}/>
            <Legend wrapperStyle={{ fontFamily: FONT_SANS, fontSize: 11, paddingTop: 10 }}/>
            <Bar dataKey="actions"     stackId="a" fill={T.blue}  name="Actions BRVM"/>
            <Bar dataKey="obligations" stackId="a" fill={T.chart3} name="Obligations UMOA"/>
            <Bar dataKey="cash"        stackId="a" fill={T.inkDim} name="Cash tactique" radius={[6, 6, 0, 0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Cartographie des risques" subtitle="Identification & mitigation" icon={ShieldAlert} style={{ marginBottom: 16 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: cols("1fr", "repeat(2, 1fr)", "repeat(3, 1fr)"),
          gap: 14,
        }}>
          {risks.map((r, i) => (
            <div key={i} style={{
              padding: isMobile ? 14 : 18, background: T.bgSubtle,
              border: `1px solid ${T.borderSoft}`, borderRadius: 12,
              borderTop: `3px solid ${r.sevColor}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 8 }}>
                <div style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 13 : 15, color: T.ink, fontWeight: 600 }}>{r.title}</div>
                <Pill color={r.sevColor} bg={r.sevColor + "18"}>{r.severity}</Pill>
              </div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted, lineHeight: 1.5, marginBottom: 12 }}>{r.desc}</div>
              <div style={{
                padding: "10px 12px", background: T.greenSoft, borderRadius: 8,
                display: "flex", gap: 8, alignItems: "flex-start",
              }}>
                <CheckCircle2 size={14} color={T.green} style={{ flexShrink: 0, marginTop: 2 }}/>
                <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkSoft, lineHeight: 1.5 }}>{r.mit}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="IPS — Les 7 règles à graver" subtitle="Document d'ancrage 20 ans" icon={BookOpen}>
        <div style={{
          display: "grid",
          gridTemplateColumns: cols("1fr", "1fr", "repeat(2, 1fr)"),
          gap: 14,
        }}>
          {ipsRules.map(r => (
            <div key={r.n} style={{
              display: "flex", gap: 14, alignItems: "flex-start",
              padding: isMobile ? 14 : 18, background: T.bgSubtle,
              border: `1px solid ${T.borderSoft}`, borderRadius: 12,
              transition: "all 0.15s", cursor: "default",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = r.color; e.currentTarget.style.background = T.bgCard; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.borderSoft; e.currentTarget.style.background = T.bgSubtle; }}
            >
              <div style={{
                width: 40, height: 40, flexShrink: 0, borderRadius: 10,
                background: r.color + "18", color: r.color,
                fontFamily: FONT_MONO, fontSize: 14, fontWeight: 700,
                display: "grid", placeItems: "center",
              }}>{r.n}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 13 : 14, color: T.ink, fontWeight: 600, marginBottom: 4 }}>{r.title}</div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted, lineHeight: 1.55 }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 24, padding: isMobile ? 20 : 28,
          background: T.bgDark, borderRadius: 12,
          color: T.inkInv, position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -60, right: -60,
            width: 200, height: 200,
            background: `radial-gradient(circle, ${T.blue}40, transparent 65%)`,
            borderRadius: "50%",
          }}/>
          <div style={{
            position: "absolute", bottom: -60, left: -60,
            width: 200, height: 200,
            background: `radial-gradient(circle, ${T.chart3}40, transparent 65%)`,
            borderRadius: "50%",
          }}/>
          <div style={{ position: "relative", textAlign: "center" }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: "#93C5FD", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Principe fondateur</div>
            <div style={{
              fontFamily: FONT_SANS,
              fontSize: isMobile ? 18 : 24,
              fontWeight: 500,
              lineHeight: 1.4, letterSpacing: "-0.02em",
              maxWidth: 760, margin: "0 auto", fontStyle: "italic",
            }}>
              « Votre meilleur atout à 29 ans n'est pas le stock picking.<br/>C'est le <span style={{ background: `linear-gradient(90deg, ${T.blue}, ${T.neon})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>temps</span>. »
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
