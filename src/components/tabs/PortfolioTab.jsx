import React, { useState, useMemo, useEffect } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Briefcase, PieChart as PieIcon, Coins, Calculator,
  Gauge, BarChart3, Layers,
} from "lucide-react";
import { T, FONT_SANS, FONT_MONO } from "../../theme";
import { STOCKS, SECTOR_COLORS, PHASE_CONFIG } from "../../data/stocks";
import { fmtFCFAfull, fmtPct } from "../../utils/format";
import useResponsive from "../../hooks/useResponsive";

import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import MetricCard from "../ui/MetricCard";
import Pill from "../ui/Pill";
import ChartTooltip from "../ui/ChartTooltip";

const ACTUAL_WEIGHTS = { SNTS: 27, ORAC: 14, CIEC: 34, BOAB: 24, SGBC: 0, BOAS: 0, SDCC: 0, ETIT: 0, PALC: 0, SPHC: 0 };

function targetWeightsForPhase(p) {
  const cfg = PHASE_CONFIG[p - 1];
  const out = {};
  STOCKS.forEach(s => { out[s.ticker] = cfg.weights[s.ticker] || 0; });
  return out;
}

function actualWeightsInit() {
  const out = {};
  STOCKS.forEach(s => { out[s.ticker] = ACTUAL_WEIGHTS[s.ticker] || 0; });
  return out;
}

export default function PortfolioTab() {
  const [phase, setPhase] = useState(1);
  const [weights, setWeights] = useState(actualWeightsInit);
  const { isMobile, cols } = useResponsive();

  const phaseCfg = PHASE_CONFIG[phase - 1];
  const visibleStocks = useMemo(() => STOCKS.filter(s => s.phaseEntry <= phase), [phase]);

  useEffect(() => {
    if (phase === 1) {
      setWeights(actualWeightsInit());
    } else {
      setWeights(targetWeightsForPhase(phase));
    }
  }, [phase]);

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const updateWeight = (t, v) => setWeights(p => ({ ...p, [t]: v }));

  const stats = useMemo(() => {
    let yW = 0, pW = 0, rW = 0, tot = 0;
    const secMap = {};
    visibleStocks.forEach(s => {
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
  }, [weights, visibleStocks]);

  const pieData = visibleStocks.filter(s => weights[s.ticker] > 0).map(s => ({
    name: s.ticker, value: weights[s.ticker], sector: s.sector,
  }));
  const reset = () => setWeights(targetWeightsForPhase(phase));

  return (
    <div>
      <PageHeader
        eyebrow="Simulateur · bloc 4"
        title="Constructeur de portefeuille interactif."
        description={`Phase ${phase} — ${phaseCfg.maxLines} lignes · ${phaseCfg.capitalRange}. Ajustez les pondérations — les métriques se recalculent en temps réel.`}
      />

      {/* Phase selector */}
      <div style={{
        display: "flex", gap: 6, marginBottom: 20,
        background: T.bgSoft, padding: 5, borderRadius: 10,
        border: `1px solid ${T.border}`, width: "fit-content",
      }}>
        {PHASE_CONFIG.map(p => {
          const active = phase === p.phase;
          return (
            <button key={p.phase} onClick={() => setPhase(p.phase)} style={{
              padding: isMobile ? "7px 12px" : "8px 16px",
              border: "none", borderRadius: 8,
              background: active ? T.bgCard : "transparent",
              color: active ? T.ink : T.inkMuted,
              fontFamily: FONT_SANS, fontSize: 12, fontWeight: active ? 700 : 500,
              cursor: "pointer", transition: "all 0.15s",
              boxShadow: active ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
            }}>
              Phase {p.phase}
              <span style={{ fontFamily: FONT_MONO, fontSize: 10, marginLeft: 6, color: active ? T.blue : T.inkDim }}>
                {p.maxLines}L
              </span>
            </button>
          );
        })}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: cols("repeat(2, 1fr)", "repeat(2, 1fr)", "repeat(4, 1fr)"),
        gap: isMobile ? 10 : 14, marginBottom: 16,
      }}>
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

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1.3fr 1fr",
        gap: 16, marginBottom: 16,
      }}>
        <Card title={`Pondérations Phase ${phase}`} subtitle={`${visibleStocks.length} lignes actives`} icon={Briefcase}
          action={<button onClick={reset} style={{
            padding: "6px 12px", background: T.bgSoft,
            border: `1px solid ${T.border}`, borderRadius: 8,
            color: T.inkSoft, fontFamily: FONT_SANS, fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>Réinitialiser aux cibles Phase {phase}</button>}
        >
          {visibleStocks.map(s => (
            <div key={s.ticker} style={{ padding: "14px 0", borderBottom: `1px solid ${T.borderSoft}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    background: SECTOR_COLORS[s.sector] + "18",
                    display: "grid", placeItems: "center", fontSize: 14,
                  }}>{s.flag}</div>
                  <div style={{ minWidth: 0 }}>
                    <div>
                      <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: T.blue, fontWeight: 700 }}>{s.ticker}</span>
                      {!isMobile && <span style={{ fontFamily: FONT_SANS, fontSize: 13, color: T.ink, marginLeft: 8, fontWeight: 500 }}>{s.name}</span>}
                    </div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.inkDim, marginTop: 1 }}>{s.sector} · {s.yield}%</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  {!isMobile && (
                    <Pill color={s.change >= 0 ? T.green : T.red} bg={s.change >= 0 ? T.greenSoft : T.redSoft}>
                      {fmtPct(s.change)}
                    </Pill>
                  )}
                  <div style={{ fontFamily: FONT_MONO, fontSize: 14, color: T.ink, fontWeight: 700, minWidth: 40, textAlign: "right" }}>{weights[s.ticker]}%</div>
                </div>
              </div>
              <div style={{ position: "relative", height: 4, marginTop: 4 }}>
                <div style={{ position: "absolute", inset: 0, background: T.bgSoft, borderRadius: 999 }}/>
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0,
                  width: `${Math.min((weights[s.ticker] / 50) * 100, 100)}%`,
                  background: SECTOR_COLORS[s.sector] || T.blue, borderRadius: 999,
                }}/>
                <input type="range" min={0} max={50} step={1}
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
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                  innerRadius={isMobile ? 40 : 55} outerRadius={isMobile ? 70 : 90} paddingAngle={3}
                  label={isMobile ? false : ({ name, value }) => `${name} ${value}%`}
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
                <YAxis type="category" dataKey="name" stroke={T.inkDim} tick={{ fontSize: 11, fontFamily: FONT_SANS, fill: T.inkSoft, fontWeight: 500 }} width={isMobile ? 70 : 95} axisLine={false} tickLine={false}/>
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

      <Card title="Univers BRVM" subtitle="Screening complet · 10 titres" icon={Layers}>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", minWidth: 860, borderCollapse: "collapse", fontFamily: FONT_SANS, fontSize: 12 }}>
            <thead>
              <tr>
                {["Ticker", "Société", "Phase", "Pays", "Secteur", "Cours", "P/E", "Yield", "Change", "Risque", "Moat", "FCP"].map(h => (
                  <th key={h} style={{
                    padding: "10px 10px",
                    textAlign: h === "Société" || h === "Pays" || h === "Secteur" ? "left" : "right",
                    fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted,
                    fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
                    borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STOCKS.map(s => {
                const inPhase = s.phaseEntry <= phase;
                return (
                  <tr key={s.ticker} style={{ opacity: inPhase ? 1 : 0.4 }}>
                    <td style={{ padding: "10px 10px", color: T.blue, fontFamily: FONT_MONO, fontWeight: 700, borderBottom: `1px solid ${T.borderSoft}` }}>{s.ticker}</td>
                    <td style={{ padding: "10px 10px", color: T.ink, fontWeight: 500, borderBottom: `1px solid ${T.borderSoft}`, whiteSpace: "nowrap" }}>{s.name}</td>
                    <td style={{ padding: "10px 10px", textAlign: "right", borderBottom: `1px solid ${T.borderSoft}` }}>
                      <Pill
                        color={s.phaseEntry === 1 ? T.blue : s.phaseEntry === 2 ? T.chart3 : s.phaseEntry === 3 ? T.green : T.amber}
                        bg={(s.phaseEntry === 1 ? T.blue : s.phaseEntry === 2 ? T.chart3 : s.phaseEntry === 3 ? T.green : T.amber) + "18"}
                      >P{s.phaseEntry}</Pill>
                    </td>
                    <td style={{ padding: "10px 10px", color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}`, whiteSpace: "nowrap" }}>{s.flag} {s.country}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T.borderSoft}` }}>
                      <Pill color={SECTOR_COLORS[s.sector]} bg={SECTOR_COLORS[s.sector] + "18"}>{s.sector}</Pill>
                    </td>
                    <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: FONT_MONO, color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}` }}>{fmtFCFAfull(s.price)}</td>
                    <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: FONT_MONO, color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}` }}>{s.pe}</td>
                    <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: FONT_MONO, color: T.green, fontWeight: 700, borderBottom: `1px solid ${T.borderSoft}` }}>{s.yield}%</td>
                    <td style={{ padding: "10px 10px", textAlign: "right", borderBottom: `1px solid ${T.borderSoft}` }}>
                      <Pill color={s.change >= 0 ? T.green : T.red} bg={s.change >= 0 ? T.greenSoft : T.redSoft}>{fmtPct(s.change)}</Pill>
                    </td>
                    <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: FONT_MONO, color: s.risk > 5 ? T.red : s.risk > 3 ? T.amber : T.green, fontWeight: 600, borderBottom: `1px solid ${T.borderSoft}` }}>{s.risk}/10</td>
                    <td style={{ padding: "10px 10px", textAlign: "right", color: s.moat === "Fort" ? T.green : T.inkSoft, fontWeight: 500, borderBottom: `1px solid ${T.borderSoft}` }}>{s.moat}</td>
                    <td style={{ padding: "10px 10px", textAlign: "right", borderBottom: `1px solid ${T.borderSoft}` }}>
                      <Pill color={s.fcpOverlap === "Non" ? T.green : s.fcpOverlap === "Complém." ? T.blue : T.amber}
                        bg={s.fcpOverlap === "Non" ? T.greenSoft : s.fcpOverlap === "Complém." ? T.blueSoft : T.amberSoft}>
                        {s.fcpOverlap}
                      </Pill>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
