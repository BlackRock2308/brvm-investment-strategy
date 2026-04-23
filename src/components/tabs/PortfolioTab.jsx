import React, { useState, useMemo } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Briefcase, PieChart as PieIcon, Coins, Calculator,
  Gauge, BarChart3, Layers,
} from "lucide-react";
import { T, FONT_SANS, FONT_MONO } from "../../theme";
import { STOCKS, SECTOR_COLORS } from "../../data/stocks";
import { fmtFCFAfull, fmtPct } from "../../utils/format";

import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import MetricCard from "../ui/MetricCard";
import Pill from "../ui/Pill";
import ChartTooltip from "../ui/ChartTooltip";

export default function PortfolioTab() {
  const [weights, setWeights] = useState(
    STOCKS.reduce((acc, s) => ({ ...acc, [s.ticker]: s.conviction }), {})
  );
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const updateWeight = (t, v) => setWeights(p => ({ ...p, [t]: v }));

  const stats = useMemo(() => {
    let yW = 0, pW = 0, rW = 0, tot = 0;
    const secMap = {};
    STOCKS.forEach(s => {
      const w = weights[s.ticker] || 0;
      tot += w; yW += s.yield * w; pW += s.pe * w; rW += s.risk * w;
      secMap[s.sector] = (secMap[s.sector] || 0) + w;
    });
    return {
      yield: tot > 0 ? (yW / tot).toFixed(2) : 0,
      pe: tot > 0 ? (pW / tot).toFixed(1) : 0,
      risk: tot > 0 ? (rW / tot).toFixed(1) : 0,
      sectors: Object.entries(secMap).map(([name, value]) => ({ name, value })).filter(s => s.value > 0),
    };
  }, [weights]);

  const pieData = STOCKS.filter(s => weights[s.ticker] > 0).map(s => ({
    name: s.ticker, value: weights[s.ticker], sector: s.sector,
  }));
  const reset = () => setWeights(STOCKS.reduce((a, s) => ({ ...a, [s.ticker]: s.conviction }), {}));

  return (
    <div>
      <PageHeader
        eyebrow="Simulateur · bloc 4"
        title="Constructeur de portefeuille interactif."
        description="Ajustez les pondérations avec les curseurs. Les métriques — yield pondéré, P/E moyen, risque global, répartition sectorielle — se recalculent en temps réel. Cible : 100% total."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 16 }}>
        <MetricCard label="Pondération totale" value={totalWeight} unit="%"
          deltaLabel={totalWeight === 100 ? "✓ équilibré" : totalWeight < 100 ? `${100 - totalWeight}% à allouer` : `${totalWeight - 100}% en excès`}
          icon={PieIcon}
          color={totalWeight === 100 ? T.green : totalWeight > 100 ? T.red : T.amber}
        />
        <MetricCard label="Yield pondéré" value={stats.yield} unit="%" icon={Coins} color={T.green}/>
        <MetricCard label="P/E pondéré" value={stats.pe} icon={Calculator} color={T.blue}/>
        <MetricCard label="Risque moyen" value={stats.risk} unit="/10" icon={Gauge}
          color={parseFloat(stats.risk) > 5 ? T.red : parseFloat(stats.risk) > 4 ? T.amber : T.green}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card title="Pondérations par titre" subtitle="Glissez pour ajuster" icon={Briefcase}
          action={<button onClick={reset} style={{
            padding: "6px 12px", background: T.bgSoft,
            border: `1px solid ${T.border}`, borderRadius: 8,
            color: T.inkSoft, fontFamily: FONT_SANS, fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>Réinitialiser</button>}
        >
          {STOCKS.map(s => (
            <div key={s.ticker} style={{ padding: "14px 0", borderBottom: `1px solid ${T.borderSoft}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: SECTOR_COLORS[s.sector] + "18",
                    display: "grid", placeItems: "center", fontSize: 14,
                  }}>{s.flag}</div>
                  <div>
                    <div>
                      <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: T.blue, fontWeight: 700, letterSpacing: "0.02em" }}>{s.ticker}</span>
                      <span style={{ fontFamily: FONT_SANS, fontSize: 13, color: T.ink, marginLeft: 8, fontWeight: 500 }}>{s.name}</span>
                    </div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.inkDim, marginTop: 1 }}>{s.sector} · {s.country} · {s.yield}%</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Pill color={s.change >= 0 ? T.green : T.red} bg={s.change >= 0 ? T.greenSoft : T.redSoft}>
                    {fmtPct(s.change)}
                  </Pill>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 14, color: T.ink, fontWeight: 700, minWidth: 40, textAlign: "right" }}>{weights[s.ticker]}%</div>
                </div>
              </div>
              <div style={{ position: "relative", height: 4, marginTop: 4 }}>
                <div style={{ position: "absolute", inset: 0, background: T.bgSoft, borderRadius: 999 }}/>
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0,
                  width: `${(weights[s.ticker] / 30) * 100}%`,
                  background: SECTOR_COLORS[s.sector] || T.blue, borderRadius: 999,
                }}/>
                <input type="range" min={0} max={30} step={1}
                  value={weights[s.ticker]}
                  onChange={e => updateWeight(s.ticker, Number(e.target.value))}
                  style={{
                    position: "absolute", inset: 0,
                    width: "100%", height: "100%",
                    opacity: 0, cursor: "pointer",
                  }}
                />
              </div>
            </div>
          ))}
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card title="Répartition par titre" icon={PieIcon}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                  innerRadius={55} outerRadius={90} paddingAngle={3}
                  label={({ name, value }) => `${name} ${value}%`}
                  labelLine={false}
                  style={{ fontFamily: FONT_MONO, fontSize: 10 }}
                >
                  {pieData.map((e, i) => (
                    <Cell key={i} fill={SECTOR_COLORS[e.sector] || T.blue} stroke={T.bgCard} strokeWidth={2}/>
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />}/>
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Allocation sectorielle" icon={BarChart3}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.sectors} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid stroke={T.borderSoft} horizontal={false} strokeDasharray="3 3"/>
                <XAxis type="number" stroke={T.inkDim} tick={{ fontSize: 10, fontFamily: FONT_MONO, fill: T.inkMuted }} axisLine={false} tickLine={false}/>
                <YAxis type="category" dataKey="name" stroke={T.inkDim} tick={{ fontSize: 11, fontFamily: FONT_SANS, fill: T.inkSoft, fontWeight: 500 }} width={95} axisLine={false} tickLine={false}/>
                <Tooltip content={<ChartTooltip />}/>
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {stats.sectors.map((e, i) => (
                    <Cell key={i} fill={SECTOR_COLORS[e.name] || T.blue}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      <Card title="Univers BRVM" subtitle="Screening complet · 10 titres sélectionnés" icon={Layers}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_SANS, fontSize: 12 }}>
            <thead>
              <tr>
                {["Ticker", "Société", "Pays", "Secteur", "Cours", "P/E", "Yield", "Change", "Risque", "Moat", "FCP"].map(h => (
                  <th key={h} style={{
                    padding: "10px 12px",
                    textAlign: h === "Société" || h === "Pays" || h === "Secteur" ? "left" : "right",
                    fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted,
                    fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
                    borderBottom: `1px solid ${T.border}`,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STOCKS.map(s => (
                <tr key={s.ticker} style={{ transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = T.bgSubtle}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "12px 12px", color: T.blue, fontFamily: FONT_MONO, fontWeight: 700, letterSpacing: "0.02em", borderBottom: `1px solid ${T.borderSoft}` }}>{s.ticker}</td>
                  <td style={{ padding: "12px 12px", color: T.ink, fontWeight: 500, borderBottom: `1px solid ${T.borderSoft}` }}>{s.name}</td>
                  <td style={{ padding: "12px 12px", color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}` }}>{s.flag} {s.country}</td>
                  <td style={{ padding: "12px 12px", borderBottom: `1px solid ${T.borderSoft}` }}>
                    <Pill color={SECTOR_COLORS[s.sector]} bg={SECTOR_COLORS[s.sector] + "18"}>{s.sector}</Pill>
                  </td>
                  <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}` }}>{fmtFCFAfull(s.price)}</td>
                  <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}` }}>{s.pe}</td>
                  <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, color: T.green, fontWeight: 700, borderBottom: `1px solid ${T.borderSoft}` }}>{s.yield}%</td>
                  <td style={{ padding: "12px 12px", textAlign: "right", borderBottom: `1px solid ${T.borderSoft}` }}>
                    <Pill color={s.change >= 0 ? T.green : T.red} bg={s.change >= 0 ? T.greenSoft : T.redSoft}>{fmtPct(s.change)}</Pill>
                  </td>
                  <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: FONT_MONO, color: s.risk > 5 ? T.red : s.risk > 3 ? T.amber : T.green, fontWeight: 600, borderBottom: `1px solid ${T.borderSoft}` }}>{s.risk}/10</td>
                  <td style={{ padding: "12px 12px", textAlign: "right", color: s.moat === "Fort" ? T.green : T.inkSoft, fontWeight: 500, borderBottom: `1px solid ${T.borderSoft}` }}>{s.moat}</td>
                  <td style={{ padding: "12px 12px", textAlign: "right", borderBottom: `1px solid ${T.borderSoft}` }}>
                    <Pill color={s.fcpOverlap === "Non" ? T.green : s.fcpOverlap === "Complém." ? T.blue : T.amber}
                      bg={s.fcpOverlap === "Non" ? T.greenSoft : s.fcpOverlap === "Complém." ? T.blueSoft : T.amberSoft}>
                      {s.fcpOverlap}
                    </Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
