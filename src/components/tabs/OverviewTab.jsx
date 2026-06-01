import React, { useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar,
  ResponsiveContainer,
} from "recharts";
import {
  Coins, Target, TrendingUp, Activity,
  Layers, Wallet, BarChart3, PieChart as PieIcon,
  Calculator, Gauge,
} from "lucide-react";
import { T, FONT_SANS, FONT_MONO } from "../../theme";
import { STOCKS, SECTOR_COLORS, PHASE_CONFIG, CURRENT_HOLDINGS, CURRENT_HOLDINGS_TOTAL } from "../../data/stocks";
import { fmtFCFA, fmtFCFAfull } from "../../utils/format";
import { projectDCA } from "../../utils/projections";
import useResponsive from "../../hooks/useResponsive";

import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import MetricCard from "../ui/MetricCard";
import Pill from "../ui/Pill";
import ChartTooltip from "../ui/ChartTooltip";
import MarketTicker from "../ui/MarketTicker";
import { BRVM_API_URL } from "../../data/config";

const phase1 = PHASE_CONFIG[0];
const phase1Stocks = STOCKS.filter(s => s.phaseEntry === 1);

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

export default function OverviewTab() {
  const { isMobile, isTablet, cols } = useResponsive();

  return (
    <div>
      <PageHeader
        eyebrow="Dashboard · juin 2026"
        title="Votre patrimoine BRVM, piloté avec précision."
        description="Vue d'ensemble de votre portefeuille, allocation Phase 1, et projection DCA."
      />

      <MarketTicker endpoint={BRVM_API_URL} />

      {/* Phase 1 banner */}
      <div style={{
        padding: isMobile ? 14 : 18, marginBottom: isMobile ? 16 : 24,
        background: T.bgCard, border: `1px solid ${T.border}`,
        borderLeft: `4px solid ${T.blue}`, borderRadius: 10,
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: T.blueSoft, display: "grid", placeItems: "center", flexShrink: 0,
        }}>
          <Layers size={16} color={T.blue} strokeWidth={2.2} />
        </div>
        <div>
          <div style={{ fontFamily: FONT_SANS, fontSize: 14, fontWeight: 700, color: T.ink }}>
            Phase 1 — Construction en cours
          </div>
          <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted, marginTop: 2 }}>
            {CURRENT_HOLDINGS.filter(h => h.qty > 0).length} lignes ouvertes sur 5 · DCA 75k · Capital direct {fmtFCFAfull(portfolio.totalValue)} F
          </div>
        </div>
      </div>

      {/* Top metrics */}
      <div style={{
        display: "grid",
        gridTemplateColumns: cols("1fr", "repeat(2, 1fr)", "repeat(4, 1fr)"),
        gap: isMobile ? 10 : 16, marginBottom: isMobile ? 20 : 28,
      }}>
        <MetricCard label="Capital direct" value={fmtFCFA(portfolio.totalValue)} unit="F" deltaLabel={`investi ${fmtFCFA(CURRENT_HOLDINGS_TOTAL)}`} icon={Activity} color={T.blue} />
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
                innerRadius={isMobile ? 40 : 55} outerRadius={isMobile ? 70 : 90} paddingAngle={3}
                label={isMobile ? false : ({ name, value }) => `${name} ${value}%`}
                labelLine={false}
                style={{ fontFamily: FONT_MONO, fontSize: 10 }}
              >
                {portfolio.pieData.map((e, i) => (
                  <Cell key={i} fill={SECTOR_COLORS[e.sector] || T.blue} stroke={T.bgCard} strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
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
                    <span style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted }}>{e.qty} act.</span>
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
              <CartesianGrid stroke={T.borderSoft} horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" stroke={T.inkDim} tick={{ fontSize: 10, fontFamily: FONT_MONO, fill: T.inkMuted }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" stroke={T.inkDim} tick={{ fontSize: 11, fontFamily: FONT_SANS, fill: T.inkSoft, fontWeight: 500 }} width={isMobile ? 70 : 95} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {portfolio.sectors.map((e, i) => (
                  <Cell key={i} fill={SECTOR_COLORS[e.name] || T.blue} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Compact DCA projection */}
      <Card title="Projection DCA 7 ans" subtitle="75 000 F/mois · rendement 9%" icon={TrendingUp}
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
                <stop offset="0%" stopColor={T.blue} stopOpacity={0.25} />
                <stop offset="100%" stopColor={T.blue} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gInv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={T.chart3} stopOpacity={0.15} />
                <stop offset="100%" stopColor={T.chart3} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={T.borderSoft} vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="year" stroke={T.inkDim} tick={{ fontSize: 11, fontFamily: FONT_MONO, fill: T.inkMuted }} axisLine={false} tickLine={false} />
            <YAxis stroke={T.inkDim} tick={{ fontSize: 11, fontFamily: FONT_MONO, fill: T.inkMuted }} tickFormatter={fmtFCFA} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="invested" stroke={T.chart3} strokeWidth={1.5} fill="url(#gInv)" name="Capital investi" />
            <Area type="monotone" dataKey="value" stroke={T.blue} strokeWidth={2.5} fill="url(#gVal)" name="Valeur portefeuille" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
