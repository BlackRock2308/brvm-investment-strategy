import React, { useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar,
  ResponsiveContainer,
} from "recharts";
import {
  Coins, Target, TrendingUp, Activity,
  Layers, BarChart3, PieChart as PieIcon,
  Calculator, Gauge,
} from "lucide-react";
import { T, FONT_SANS, FONT_MONO, R, alpha, chartTokens } from "../../theme";
import { STOCKS, SECTOR_COLORS, SECTOR_INDEX, PHASE_CONFIG, CURRENT_HOLDINGS, CURRENT_HOLDINGS_TOTAL } from "../../data/stocks";
import { fmtFCFA, fmtFCFAfull } from "../../utils/format";
import { projectDCA } from "../../utils/projections";
import useResponsive from "../../hooks/useResponsive";
import useTheme from "../../hooks/useTheme";
import usePrivacy from "../../hooks/usePrivacy";

import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import MetricCard from "../ui/MetricCard";
import Pill from "../ui/Pill";
import ChartTooltip from "../ui/ChartTooltip";
import MarketTicker from "../ui/MarketTicker";
import { BRVM_API_URL } from "../../data/config";

const phase1 = PHASE_CONFIG[0];

function computePortfolioMetrics() {
  const holdMap = Object.fromEntries(CURRENT_HOLDINGS.map(h => [h.ticker, h]));
  const stockMap = Object.fromEntries(STOCKS.map(s => [s.ticker, s]));

  let totalValue = 0;
  const entries = [];
  for (const ticker of phase1.tickers) {
    const h = holdMap[ticker] || { qty: 0, invested: 0 };
    const s = stockMap[ticker];
    const value = h.qty * s.price;
    totalValue += value;
    entries.push({ ticker, value, qty: h.qty, stock: s });
  }

  const pieData = [];
  const sectorMap = {};
  let yW = 0, pW = 0, rW = 0;

  for (const e of entries) {
    const pct = totalValue > 0 ? Math.round((e.value / totalValue) * 100) : 0;
    if (pct > 0) {
      pieData.push({ name: e.ticker, value: pct, sector: e.stock.sector });
    }
    sectorMap[e.stock.sector] = (sectorMap[e.stock.sector] || 0) + pct;
    yW += e.stock.yield * pct;
    pW += e.stock.pe * pct;
    rW += e.stock.risk * pct;
  }

  const totPct = pieData.reduce((s, d) => s + d.value, 0) || 1;
  const sectors = Object.entries(sectorMap).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }));

  return {
    totalValue,
    pieData,
    sectors,
    yield: (yW / totPct).toFixed(2),
    pe: (pW / totPct).toFixed(1),
    risk: (rW / totPct).toFixed(1),
    entries,
  };
}

const portfolio = computePortfolioMetrics();

const dcaProjection = projectDCA({ monthly: 75000, years: 7, annualRate: 9 });
const dcaFinal = dcaProjection[dcaProjection.length - 1];

const PRIVATE_MASK = "••••••";
const pctTooltipFormatter = (v) => `${v}%`;

export default function OverviewTab() {
  const { isMobile, isTablet, cols } = useResponsive();
  const { isDark } = useTheme();
  const { isPrivate } = usePrivacy();
  const ct = chartTokens(isDark);

  const prv = (formatted) => isPrivate ? PRIVATE_MASK : formatted;

  const openLines = CURRENT_HOLDINGS.filter(h => h.qty > 0).length;
  const linesPct = Math.round((openLines / phase1.maxLines) * 100);

  return (
    <div>
      <PageHeader
        eyebrow="Dashboard · septembre 2026"
        title="Votre patrimoine BRVM, piloté avec précision."
        description="Vue d'ensemble de votre portefeuille, allocation Phase 1, et projection DCA."
      />

      <MarketTicker endpoint={BRVM_API_URL} />

      {/* Premium hero — portfolio headline (always-dark navy surface) */}
      <div style={{
        position: "relative", overflow: "hidden",
        marginBottom: isMobile ? 16 : 24,
        borderRadius: R.hero,
        background: T.heroGrad,
        boxShadow: T.shadowElevated,
      }}>
        {/* atmospheric ochre glow */}
        <div style={{
          position: "absolute", top: -80, right: -60, width: 320, height: 320,
          background: `radial-gradient(circle, ${alpha(T.ochre, 0.20)}, transparent 62%)`,
          borderRadius: "50%", pointerEvents: "none",
        }} />
        <div style={{
          position: "relative", padding: isMobile ? 20 : 28,
          display: "flex", flexWrap: "wrap", gap: isMobile ? 18 : 28,
          alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between",
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "4px 11px", borderRadius: 999,
              background: alpha(T.ochre, 0.16), marginBottom: 14,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#D8A369" }} />
              <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: "#DFB78A", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Phase 1 · Construction du cœur
              </span>
            </div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: "#9C988C", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}>
              Capital direct investi
            </div>
            <div className="tnum" style={{
              fontFamily: FONT_SANS, fontSize: isMobile ? 34 : 46, fontWeight: 800,
              color: "#FAF8F4", letterSpacing: "-0.03em", lineHeight: 1,
            }}>
              {prv(fmtFCFAfull(portfolio.totalValue))} <span style={{ fontSize: isMobile ? 18 : 22, fontWeight: 600, color: "#C2BDB1" }}>F</span>
            </div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: "#9C988C", marginTop: 8 }}>
              {openLines} lignes ouvertes sur {phase1.maxLines} · DCA 75 000 F CFA/mois · Yield {portfolio.yield}%
            </div>
          </div>

          {/* progress ring-ish bar */}
          <div style={{ minWidth: isMobile ? "100%" : 220, flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <span style={{ fontFamily: FONT_SANS, fontSize: 12, color: "#C2BDB1", fontWeight: 500 }}>Progression Phase 1</span>
              <span className="tnum" style={{ fontFamily: FONT_MONO, fontSize: 14, color: "#D8A369", fontWeight: 700 }}>{linesPct}%</span>
            </div>
            <div style={{ height: 8, background: "rgba(250,248,244,0.12)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${linesPct}%`, borderRadius: 999,
                background: `linear-gradient(90deg, ${T.green400}, ${T.ochre})`,
                transition: "width 0.6s ease",
              }} />
            </div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: "#6E6A60", marginTop: 8 }}>
              Cœur : SNTS · ORAC · BOAB · CIEC
            </div>
          </div>
        </div>
      </div>

      {/* Top metrics */}
      <div style={{
        display: "grid",
        gridTemplateColumns: cols("1fr", "repeat(2, 1fr)", "repeat(4, 1fr)"),
        gap: isMobile ? 10 : 16, marginTop: isMobile ? 16 : 24, marginBottom: isMobile ? 20 : 28,
      }}>
        <MetricCard label="Capital direct" value={prv(fmtFCFA(portfolio.totalValue))} unit={isPrivate ? "" : "F"} deltaLabel={isPrivate ? undefined : `investi ${fmtFCFA(CURRENT_HOLDINGS_TOTAL)}`} icon={Activity} color={T.blue} />
        <MetricCard label="Yield pondéré" value={portfolio.yield} unit="%" icon={Coins} color={T.green} />
        <MetricCard label="P/E pondéré" value={portfolio.pe} icon={Calculator} color={T.chart3} />
        <MetricCard label="Risque moyen" value={portfolio.risk} unit="/10" icon={Gauge}
          color={parseFloat(portfolio.risk) > 5 ? T.red : parseFloat(portfolio.risk) > 4 ? T.amber : T.green}
        />
      </div>

      {/* Allocation donut + sector bar */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: 16, marginBottom: isMobile ? 20 : 28,
      }}>
        <Card title="Allocation Phase 1" subtitle="Répartition actuelle vs cibles" icon={PieIcon}>
          <ResponsiveContainer width="100%" height={isMobile ? 200 : 220}>
            <PieChart>
              <Pie data={portfolio.pieData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                isAnimationActive={false}
                innerRadius={isMobile ? 40 : 55} outerRadius={isMobile ? 70 : 90} paddingAngle={3}
                label={isMobile ? false : ({ name, value }) => `${name} ${value}%`}
                labelLine={false}
                style={{ fontFamily: FONT_MONO, fontSize: 10 }}
              >
                {portfolio.pieData.map((e, i) => (
                  <Cell key={i} fill={ct.categorical[SECTOR_INDEX[e.sector] ?? 0]} stroke={ct.surface} strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip formatter={pctTooltipFormatter} />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 8 }}>
            {portfolio.entries.map((e, i) => {
              const pct = portfolio.totalValue > 0 ? Math.round((e.value / portfolio.totalValue) * 100) : 0;
              const target = phase1.weights[e.ticker] || 0;
              const gap = pct - target;
              return (
                <div key={e.ticker} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 0",
                  borderBottom: i < portfolio.entries.length - 1 ? `1px solid ${T.borderSoft}` : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14 }}>{e.stock.flag}</span>
                    <span style={{ fontFamily: FONT_MONO, fontSize: 12, fontWeight: 600, color: T.ink }}>{e.ticker}</span>
                    {!isPrivate && <span style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted }}>{e.qty} act.</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: T.ink, fontWeight: 600 }}>
                      {pct > 0 ? `${pct}%` : "—"}
                    </span>
                    <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.inkDim }}>/ {target}%</span>
                    {pct > 0 ? (
                      <Pill
                        color={Math.abs(gap) > 5 ? T.amber : T.green}
                        bg={Math.abs(gap) > 5 ? T.amberSoft : T.greenSoft}
                      >{gap >= 0 ? "+" : ""}{gap}pp</Pill>
                    ) : (
                      <Pill color={T.amber} bg={T.amberSoft}>absent</Pill>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Allocation sectorielle" icon={BarChart3}>
          <ResponsiveContainer width="100%" height={isMobile ? 160 : 200}>
            <BarChart data={portfolio.sectors} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid stroke={ct.grid} horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" stroke={ct.grid} tick={{ fontSize: 10, fontFamily: FONT_MONO, fill: ct.textMuted }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="name" stroke={ct.grid} tick={{ fontSize: 11, fontFamily: FONT_SANS, fill: ct.text, fontWeight: 500 }} width={isMobile ? 70 : 95} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip formatter={pctTooltipFormatter} />} cursor={{ fill: ct.grid }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                {portfolio.sectors.map((e, i) => (
                  <Cell key={i} fill={ct.categorical[SECTOR_INDEX[e.name] ?? 0]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Compact DCA projection */}
      <Card title="Projection DCA 7 ans" subtitle="75 000 F CFA/mois · rendement 9%" icon={TrendingUp}
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <Pill color={T.ink} bg={T.bgSoft}>Investi {fmtFCFA(dcaFinal.invested)}</Pill>
            <Pill color={T.green} bg={T.greenSoft}>Valeur {fmtFCFA(dcaFinal.value)}</Pill>
            <Pill color={T.blue} bg={T.blueSoft}>{(dcaFinal.value / dcaFinal.invested).toFixed(1)}x</Pill>
          </div>
        }
      >
        <ResponsiveContainer width="100%" height={isMobile ? 200 : 260}>
          <AreaChart data={dcaProjection} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="gVal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ct.primary} stopOpacity={0.28} />
                <stop offset="100%" stopColor={ct.primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gInv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ct.muted} stopOpacity={0.18} />
                <stop offset="100%" stopColor={ct.muted} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={ct.grid} vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="year" stroke={ct.grid} tick={{ fontSize: 11, fontFamily: FONT_MONO, fill: ct.textMuted }} axisLine={false} tickLine={false} />
            <YAxis stroke={ct.grid} tick={{ fontSize: 11, fontFamily: FONT_MONO, fill: ct.textMuted }} tickFormatter={fmtFCFA} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="invested" stroke={ct.muted} strokeWidth={1.5} fill="url(#gInv)" name="Capital investi" isAnimationActive={false} />
            <Area type="monotone" dataKey="value" stroke={ct.primary} strokeWidth={2.5} fill="url(#gVal)" name="Valeur portefeuille" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
