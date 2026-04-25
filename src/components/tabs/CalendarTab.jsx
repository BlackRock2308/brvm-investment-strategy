import React, { useState, useMemo } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, Legend, ZAxis,
} from "recharts";
import {
  Clock, AlertTriangle, Target, Compass, CalendarDays,
} from "lucide-react";
import { T, FONT_SANS, FONT_MONO } from "../../theme";
import { DIVIDEND_CALENDAR, QUALITY_META } from "../../data/dividendCalendar";
import { fmtFCFAfull } from "../../utils/format";
import useResponsive from "../../hooks/useResponsive";

import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import MetricCard from "../ui/MetricCard";
import Pill from "../ui/Pill";

const SECTOR_COLORS = {
  "Télécoms":        T.blue,
  "Banque":          T.chart3,
  "Banque pan-AF":   T.chart5,
  "Agro":            T.green,
  "Distribution":    T.amber,
  "Industrie":       T.chart6,
};

function parseDate(d) { return d ? new Date(d) : null; }

function fmtDateShort(d) {
  if (!d) return "À préciser";
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function buyWindow(dateStr) {
  if (!dateStr) return null;
  const dt = new Date(dateStr);
  const from = new Date(dt); from.setDate(from.getDate() - 60);
  const to   = new Date(dt); to.setDate(to.getDate() - 14);
  return { from, to };
}

function fmtWindow(dateStr) {
  const w = buyWindow(dateStr);
  if (!w) return "—";
  return `${fmtDateShort(w.from)} → ${fmtDateShort(w.to)}`;
}

function isPast(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) < today;
}

const UPCOMING = DIVIDEND_CALENDAR.filter(d => !isPast(d.date));
const coreCount = UPCOMING.filter(d => d.quality === "core").length;

const FILTER_OPTS = [
  { key: "all",       label: "Tous" },
  { key: "core",      label: "Core" },
  { key: "satellite", label: "Satellite" },
  { key: "avoid",     label: "À éviter" },
];

function ScatterTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  const meta = QUALITY_META[d.quality];
  return (
    <div style={{
      background: T.bgCard, border: `1px solid ${T.border}`,
      borderRadius: 10, padding: "12px 16px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      fontFamily: FONT_SANS, fontSize: 12, maxWidth: 260,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 16 }}>{d.flag}</span>
        <div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: meta.color, fontWeight: 700 }}>{d.ticker}</div>
          <div style={{ fontSize: 11, color: T.inkMuted }}>{d.name}</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 11 }}>
        <div><span style={{ color: T.inkMuted }}>Date :</span> <strong>{fmtDateShort(d.date)}</strong></div>
        <div><span style={{ color: T.inkMuted }}>Yield :</span> <strong style={{ color: T.green }}>{d.yield}%</strong></div>
        <div><span style={{ color: T.inkMuted }}>Montant :</span> <strong>{fmtFCFAfull(d.amount)} F</strong></div>
        <div><span style={{ color: T.inkMuted }}>Qualité :</span> <Pill color={meta.color} bg={meta.bg}>{meta.label}</Pill></div>
      </div>
      {d.date && (
        <div style={{ marginTop: 8, padding: "6px 10px", background: T.blueSoft, borderRadius: 6, fontSize: 11, color: T.blue }}>
          Fenêtre d'achat : <strong>{fmtWindow(d.date)}</strong>
        </div>
      )}
    </div>
  );
}

export default function CalendarTab() {
  const [filter, setFilter] = useState("all");
  const { isMobile, cols } = useResponsive();

  const filtered = useMemo(() => {
    let list = UPCOMING;
    if (filter === "avoid") list = list.filter(d => d.quality === "avoid" || d.quality === "yieldTrap");
    else if (filter !== "all") list = list.filter(d => d.quality === filter);
    return [...list].sort((a, b) => {
      if (a.date && b.date) return new Date(a.date) - new Date(b.date);
      if (a.date) return -1;
      if (b.date) return 1;
      return 0;
    });
  }, [filter]);

  const scatterData = useMemo(() => {
    const dated = UPCOMING.filter(d => d.date).map(d => ({
      ...d,
      x: new Date(d.date).getTime(),
      y: d.yield,
      z: Math.max(d.amount, 80),
    }));
    const undated = UPCOMING.filter(d => !d.date).map((d, i) => ({
      ...d,
      x: new Date("2026-07-15").getTime() + i * 86400000,
      y: d.yield,
      z: Math.max(d.amount, 80),
    }));
    return { dated, undated };
  }, []);

  const allScatter = [...scatterData.dated, ...scatterData.undated];

  return (
    <div>
      {/* 1. Header */}
      <PageHeader
        eyebrow="Optimisation · saisonnalité dividendes"
        title="Calendrier 2026 des détachements BRVM"
        description="18 sociétés cotées versent leurs dividendes entre avril et juillet 2026. Achetez 6 à 8 semaines avant chaque détachement pour maximiser votre yield d'entrée et capter le dividende complet dès le premier exercice."
      />

      {/* 2. Metrics */}
      <div style={{
        display: "grid",
        gridTemplateColumns: cols("1fr", "repeat(3, 1fr)", "repeat(3, 1fr)"),
        gap: isMobile ? 10 : 16, marginBottom: isMobile ? 20 : 28,
      }}>
        <MetricCard label="Fenêtre d'achat optimale" value="6-8 sem." unit="" deltaLabel="avant détachement" icon={Clock} color={T.blue} />
        <MetricCard label="Zone à éviter" value="±14 jours" unit="" deltaLabel="autour du détachement" icon={AlertTriangle} color={T.amber} />
        <MetricCard label="Détachements core ciblés" value={coreCount} unit="lignes prioritaires" icon={Target} color={T.green} />
      </div>

      {/* 3. Scatter timeline */}
      <Card
        title="Timeline des détachements 2026"
        subtitle="Taille = montant · Couleur = qualité · Hover pour détails"
        icon={CalendarDays}
        style={{ marginBottom: 16 }}
      >
        <ResponsiveContainer width="100%" height={isMobile ? 280 : 380}>
          <ScatterChart margin={{ top: 20, right: 20, left: -10, bottom: 10 }}>
            <CartesianGrid stroke={T.borderSoft} strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[new Date("2026-04-10").getTime(), new Date("2026-08-10").getTime()]}
              tickFormatter={(v) => {
                const d = new Date(v);
                return d.toLocaleDateString("fr-FR", { month: "short" });
              }}
              stroke={T.inkDim}
              tick={{ fontSize: 11, fontFamily: FONT_MONO, fill: T.inkMuted }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Yield"
              unit="%"
              domain={[2, 10]}
              stroke={T.inkDim}
              tick={{ fontSize: 11, fontFamily: FONT_MONO, fill: T.inkMuted }}
              axisLine={false} tickLine={false}
            />
            <ZAxis type="number" dataKey="z" range={[40, 400]} />
            <Tooltip content={<ScatterTooltip />} cursor={false} />
            <Legend
              wrapperStyle={{ fontFamily: FONT_SANS, fontSize: 11, paddingTop: 10 }}
              payload={[
                { value: "Core",      type: "circle", color: QUALITY_META.core.color },
                { value: "Satellite", type: "circle", color: QUALITY_META.satellite.color },
                { value: "À éviter",  type: "circle", color: QUALITY_META.avoid.color },
                { value: "Yield trap",type: "circle", color: QUALITY_META.yieldTrap.color },
              ]}
            />
            <Scatter data={allScatter} isAnimationActive={false}>
              {allScatter.map((entry, i) => (
                <Cell key={i} fill={QUALITY_META[entry.quality].color} fillOpacity={0.85} stroke={T.bgCard} strokeWidth={1.5} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div style={{
          marginTop: 8, padding: "8px 14px", background: T.bgSubtle,
          borderRadius: 8, fontFamily: FONT_MONO, fontSize: 10, color: T.inkMuted,
          textAlign: "center",
        }}>
          Avr — Mai — Juin — Jul : dates confirmées &nbsp;│&nbsp; Zone droite : dates à confirmer
        </div>
      </Card>

      {/* 4. Filterable table */}
      <Card
        title="Détachements 2026 — détail complet"
        subtitle={`${filtered.length} société${filtered.length > 1 ? "s" : ""} affichée${filtered.length > 1 ? "s" : ""}`}
        icon={CalendarDays}
        style={{ marginBottom: 16 }}
        action={
          <div style={{ display: "flex", gap: 4 }}>
            {FILTER_OPTS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 999,
                  border: "none",
                  fontFamily: FONT_SANS, fontSize: 12, fontWeight: 600,
                  cursor: "pointer",
                  background: filter === f.key ? T.blue : T.bgSoft,
                  color: filter === f.key ? "white" : T.inkMuted,
                  transition: "all 0.15s",
                }}
              >{f.label}</button>
            ))}
          </div>
        }
      >
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", minWidth: 820, borderCollapse: "collapse", fontFamily: FONT_SANS, fontSize: 12 }}>
            <thead>
              <tr>
                {["Date", "Ticker", "Société", "Pays", "Secteur", "Montant net", "Yield", "Fenêtre achat", "Action"].map(h => (
                  <th key={h} style={{
                    padding: "10px 10px", textAlign: "left",
                    fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted,
                    fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
                    borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => {
                const meta = QUALITY_META[d.quality];
                return (
                  <tr key={d.ticker} style={{ transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = T.bgSubtle}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "12px 10px", fontFamily: FONT_MONO, color: d.date ? T.ink : T.inkDim, fontWeight: 600, borderBottom: `1px solid ${T.borderSoft}`, whiteSpace: "nowrap" }}>
                      {fmtDateShort(d.date)}
                    </td>
                    <td style={{ padding: "12px 10px", borderBottom: `1px solid ${T.borderSoft}` }}>
                      <Pill color={meta.color} bg={meta.bg}>{d.ticker}</Pill>
                    </td>
                    <td style={{ padding: "12px 10px", color: T.ink, fontWeight: 500, borderBottom: `1px solid ${T.borderSoft}`, whiteSpace: "nowrap" }}>{d.name}</td>
                    <td style={{ padding: "12px 10px", color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}`, whiteSpace: "nowrap" }}>{d.flag} {d.country}</td>
                    <td style={{ padding: "12px 10px", borderBottom: `1px solid ${T.borderSoft}` }}>
                      <Pill color={SECTOR_COLORS[d.sector] || T.inkMuted} bg={(SECTOR_COLORS[d.sector] || T.inkMuted) + "18"}>{d.sector}</Pill>
                    </td>
                    <td style={{ padding: "12px 10px", fontFamily: FONT_MONO, color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}`, textAlign: "right", whiteSpace: "nowrap" }}>{fmtFCFAfull(d.amount)} F</td>
                    <td style={{ padding: "12px 10px", fontFamily: FONT_MONO, color: T.green, fontWeight: 700, borderBottom: `1px solid ${T.borderSoft}`, textAlign: "right" }}>{d.yield}%</td>
                    <td style={{ padding: "12px 10px", fontFamily: FONT_MONO, fontSize: 11, color: d.date ? T.inkSoft : T.inkDim, borderBottom: `1px solid ${T.borderSoft}`, whiteSpace: "nowrap" }}>{fmtWindow(d.date)}</td>
                    <td style={{ padding: "12px 10px", borderBottom: `1px solid ${T.borderSoft}` }}>
                      <Pill
                        color={meta.color}
                        bg={meta.bg}
                      >{meta.action}</Pill>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 5. Monthly workflow */}
      <Card title="Workflow mensuel — 15 minutes par mois" icon={Compass} style={{ marginBottom: 16 }}>
        {[
          { n: "01", title: "Lister les détachements à venir", desc: "Le 1er du mois, identifier les titres à 30-60 jours d'un détachement dans le calendrier." },
          { n: "02", title: "Vérifier la santé fondamentale", desc: "Confirmer la solidité de la signature avant d'acheter : pas de yield trap, pas de zone AES." },
          { n: "03", title: "Passer les ordres à cours limité", desc: "6-8 semaines avant détachement, sur les lignes core uniquement. Éviter la zone des ±14 jours." },
          { n: "04", title: "Réinvestir les dividendes", desc: "DRIP automatique : chaque coupon crédité finance le prochain achat dans la rotation." },
        ].map(r => (
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

      {/* 6. Traps to avoid */}
      <Card
        title="Pièges à éviter"
        icon={AlertTriangle}
        style={{ borderColor: T.red + "40" }}
      >
        {[
          {
            title: "Yield trap NEI-CEDA (8,89%)",
            desc: "Liquidité très faible, sortie difficile. Le yield élevé masque un titre quasi-illiquide.",
            color: T.amber,
          },
          {
            title: "Zone AES (BOABF, BOAM, ONTBF, CBIBF)",
            desc: "Risque souverain élevé malgré des yields attractifs. Plafond combiné 5% du portefeuille.",
            color: T.red,
          },
          {
            title: "Achat dans la zone des ±14 jours",
            desc: "Volatilité technique maximale autour du détachement. Risque d'acheter au pic ou de manquer le dividende.",
            color: T.chart5,
          },
        ].map((trap, i, arr) => (
          <div key={i} style={{
            display: "flex", gap: 14, alignItems: "flex-start",
            padding: "16px 0",
            borderBottom: i < arr.length - 1 ? `1px solid ${T.borderSoft}` : "none",
          }}>
            <div style={{
              width: 36, height: 36, flexShrink: 0, borderRadius: 10,
              background: trap.color + "18",
              display: "grid", placeItems: "center",
            }}>
              <AlertTriangle size={16} color={trap.color} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 14, color: T.ink, fontWeight: 600, marginBottom: 4 }}>{trap.title}</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted, lineHeight: 1.55 }}>{trap.desc}</div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
