import React, { useState, useMemo } from "react";
import {
  ComposedChart, Area, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Coins, TrendingUp, Briefcase } from "lucide-react";
import { T, FONT_SANS, FONT_MONO } from "../../theme";
import { STOCKS, SECTOR_COLORS } from "../../data/stocks";
import { fmtFCFA, fmtEUR } from "../../utils/format";
import { projectDRIP } from "../../utils/projections";
import useResponsive from "../../hooks/useResponsive";

import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import MetricCard from "../ui/MetricCard";
import Slider from "../ui/Slider";
import Pill from "../ui/Pill";
import ChartTooltip from "../ui/ChartTooltip";

export default function DividendTab() {
  const [divInitial, setDivInitial] = useState(200000);
  const [divMonthly, setDivMonthly] = useState(75000);
  const [divYears, setDivYears] = useState(15);
  const [divYield, setDivYield] = useState(8);
  const [divGrowth, setDivGrowth] = useState(5);
  const [dripYears, setDripYears] = useState(10);
  const [taxRate, setTaxRate] = useState(25);
  const { isMobile, cols } = useResponsive();

  const dripData = useMemo(() => projectDRIP({
    initial: divInitial, monthly: divMonthly, years: divYears,
    yieldPct: divYield, growthDiv: divGrowth, dripYears, taxRate,
  }), [divInitial, divMonthly, divYears, divYield, divGrowth, dripYears, taxRate]);

  const finalDiv = dripData[dripData.length - 1];
  const passiveMonthly = finalDiv?.dividendsMonthly || 0;
  const topDiv = [...STOCKS].sort((a, b) => b.yield - a.yield).slice(0, 6);

  return (
    <div>
      <PageHeader
        eyebrow="Simulateur · bloc 3"
        title="Dividendes & revenus passifs progressifs."
        description="Le DRIP réinvestit automatiquement chaque coupon les premières années. Les dividendes génèrent des dividendes."
      />

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "360px 1fr",
        gap: 16, marginBottom: 16,
      }}>
        <Card title="Paramètres" icon={Coins}>
          <Slider label="Capital initial" value={divInitial} setValue={setDivInitial} min={0} max={5_000_000} step={50000} suffix=" F" accent={T.blue}/>
          <Slider label="DCA mensuel" value={divMonthly} setValue={setDivMonthly} min={25000} max={250000} step={5000} suffix=" F" accent={T.blue}/>
          <Slider label="Horizon" value={divYears} setValue={setDivYears} min={5} max={25} step={1} suffix=" ans" accent={T.chart3}/>
          <Slider label="Yield initial moyen" value={divYield} setValue={setDivYield} min={4} max={12} step={0.5} suffix=" %" accent={T.green}/>
          <Slider label="Croissance div./an" value={divGrowth} setValue={setDivGrowth} min={0} max={15} step={1} suffix=" %" accent={T.green}/>
          <Slider label="Années DRIP actif" value={dripYears} setValue={setDripYears} min={0} max={divYears} step={1} suffix=" ans" accent={T.chart3}/>
          <Slider label="Fiscalité totale" value={taxRate} setValue={setTaxRate} min={10} max={40} step={1} suffix=" %" accent={T.red}/>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: cols("1fr", "repeat(3, 1fr)", "repeat(3, 1fr)"),
            gap: isMobile ? 10 : 14,
          }}>
            <MetricCard label="Valeur portefeuille" value={fmtFCFA(finalDiv?.value || 0)} unit="F" deltaLabel={`à ${divYears} ans`} icon={Briefcase} color={T.blue}/>
            <MetricCard label="Dividendes nets/an" value={fmtFCFA(finalDiv?.dividendsNet || 0)} unit="F" deltaLabel={`fisc. ${taxRate}%`} icon={Coins} color={T.green}/>
            <div style={{
              background: T.bgDark,
              border: `1px solid ${T.bgDark}`,
              borderRadius: 12, padding: isMobile ? 16 : 20,
              color: T.inkInv, position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: -40, right: -40,
                width: 140, height: 140,
                background: `radial-gradient(circle, ${passiveMonthly > 50000 ? T.green : T.amber}50, transparent 60%)`,
                borderRadius: "50%",
              }}/>
              <div style={{ position: "relative" }}>
                <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: "#9CA3AF", fontWeight: 500, letterSpacing: "0.02em", textTransform: "uppercase", marginBottom: 8 }}>Revenu mensuel passif</div>
                <div style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 22 : 28, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1, color: passiveMonthly > 50000 ? T.neon : T.amber }}>
                  {fmtFCFA(passiveMonthly)}
                </div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>
                  F/mois · ≈ {fmtEUR(passiveMonthly * 12) / 12 | 0} €/mois
                </div>
              </div>
            </div>
          </div>

          <Card title="Valeur + dividendes nets annuels" subtitle="Évolution du portefeuille et des revenus" icon={TrendingUp}>
            <ResponsiveContainer width="100%" height={isMobile ? 240 : 300}>
              <ComposedChart data={dripData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="dG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.blue} stopOpacity={0.25}/>
                    <stop offset="100%" stopColor={T.blue} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={T.borderSoft} vertical={false} strokeDasharray="3 3"/>
                <XAxis dataKey="year" stroke={T.inkDim} tick={{ fontSize: 11, fontFamily: FONT_MONO, fill: T.inkMuted }} axisLine={false} tickLine={false}/>
                <YAxis yAxisId="left" stroke={T.inkDim} tick={{ fontSize: 11, fontFamily: FONT_MONO, fill: T.inkMuted }} tickFormatter={fmtFCFA} axisLine={false} tickLine={false}/>
                <YAxis yAxisId="right" orientation="right" stroke={T.green} tick={{ fontSize: 11, fontFamily: FONT_MONO, fill: T.green }} tickFormatter={fmtFCFA} axisLine={false} tickLine={false}/>
                <Tooltip content={<ChartTooltip />}/>
                <Legend wrapperStyle={{ fontFamily: FONT_SANS, fontSize: 11, paddingTop: 10 }}/>
                <Area yAxisId="left" type="monotone" dataKey="value" stroke={T.blue} strokeWidth={2.5} fill="url(#dG)" name="Valeur portefeuille"/>
                <Bar yAxisId="right" dataKey="dividendsNet" fill={T.green} name="Dividendes nets" radius={[4, 4, 0, 0]} opacity={0.9}/>
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      <Card title="Top 6 signatures dividende BRVM" subtitle="Tri par yield · avril 2026" icon={Coins}>
        <div style={{
          display: "grid",
          gridTemplateColumns: cols("1fr", "repeat(2, 1fr)", "repeat(3, 1fr)"),
          gap: 14,
        }}>
          {topDiv.map(s => (
            <div key={s.ticker} style={{
              padding: isMobile ? 16 : 20, background: T.bgSubtle,
              border: `1px solid ${T.borderSoft}`, borderRadius: 12,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 16, right: 16,
                padding: "3px 10px",
                background: `${SECTOR_COLORS[s.sector]}18`,
                borderRadius: 999,
                fontFamily: FONT_MONO, fontSize: 10, color: SECTOR_COLORS[s.sector], fontWeight: 600,
              }}>{s.sector}</div>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{s.flag}</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 13, color: T.inkMuted, fontWeight: 500, marginBottom: 2 }}>{s.ticker}</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 16 : 18, color: T.ink, fontWeight: 700, letterSpacing: "-0.015em", marginBottom: 14 }}>{s.name}</div>
              <div style={{
                display: "flex", alignItems: "baseline", gap: 4,
                padding: "10px 12px", background: T.bgCard, borderRadius: 8, marginBottom: 10,
              }}>
                <div style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 22 : 28, fontWeight: 700, color: T.green, letterSpacing: "-0.025em", lineHeight: 1 }}>{s.yield}</div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 13, color: T.inkMuted }}>% yield</div>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Pill color={T.inkSoft} bg={T.bgSoft}>P/E {s.pe}</Pill>
                <Pill color={s.moat === "Fort" ? T.green : T.blue} bg={s.moat === "Fort" ? T.greenSoft : T.blueSoft}>{s.moat}</Pill>
                <Pill color={s.risk > 5 ? T.red : s.risk > 3 ? T.amber : T.green} bg={s.risk > 5 ? T.redSoft : s.risk > 3 ? T.amberSoft : T.greenSoft}>
                  Risque {s.risk}
                </Pill>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
