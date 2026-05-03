import React, { useState, useMemo } from "react";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { TrendingUp, Calculator, Zap } from "lucide-react";
import { T, FONT_SANS, FONT_MONO } from "../../theme";
import { fmtFCFA, fmtFCFAfull, fmtEUR } from "../../utils/format";
import { projectDCA } from "../../utils/projections";
import useResponsive from "../../hooks/useResponsive";

import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import Slider from "../ui/Slider";
import Pill from "../ui/Pill";
import ChartTooltip from "../ui/ChartTooltip";

export default function DCATab() {
  const [monthly, setMonthly] = useState(75000);
  const [years, setYears] = useState(7);
  const [rate, setRate] = useState(9);
  const { isMobile, cols } = useResponsive();

  const data = useMemo(() => projectDCA({ monthly, years, annualRate: rate }), [monthly, years, rate]);
  const final = data[data.length - 1];

  const scenarios = useMemo(() => {
    const c = projectDCA({ monthly, years, annualRate: 8 });
    const m = projectDCA({ monthly, years, annualRate: 10 });
    const o = projectDCA({ monthly, years, annualRate: 12 });
    return c.map((d, i) => ({
      year: d.year,
      conservative: c[i].value,
      central: m[i].value,
      optimistic: o[i].value,
      invested: d.invested,
    }));
  }, [monthly, years]);

  return (
    <div>
      <PageHeader
        eyebrow="Simulateur · bloc 2"
        title="DCA sur 10 ans, projection en temps réel."
        description="Ajustez les trois variables du compounding. Les scénarios conservateur / central / optimiste se recalculent instantanément."
      />

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "360px 1fr",
        gap: 16, marginBottom: 16,
      }}>
        <Card title="Paramètres" icon={Calculator}>
          <Slider label="DCA mensuel" value={monthly} setValue={setMonthly} min={25000} max={250000} step={5000} suffix=" F" accent={T.blue}/>
          <Slider label="Durée" value={years} setValue={setYears} min={3} max={25} step={1} suffix=" ans" accent={T.chart3}/>
          <Slider label="Rendement annualisé" value={rate} setValue={setRate} min={4} max={15} step={0.5} suffix=" %" accent={T.green}/>

          <div style={{
            marginTop: 24, padding: isMobile ? 14 : 18,
            background: `linear-gradient(135deg, ${T.blue}08, ${T.chart3}08)`,
            border: `1px solid ${T.blue}30`, borderRadius: 12,
          }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.blue, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12 }}>Projection finale</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted, marginBottom: 2 }}>Capital investi</div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 16, color: T.inkSoft, fontWeight: 600 }}>{fmtFCFAfull(final.invested)}</div>
              </div>
              <div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted, marginBottom: 2 }}>Valeur finale</div>
                <div style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 18 : 22, color: T.blue, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1 }}>{fmtFCFA(final.value)}</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.inkMuted, marginTop: 2 }}>≈ {fmtEUR(final.value)} €</div>
              </div>
            </div>
            <div style={{ marginTop: 14, padding: "10px 12px", background: T.greenSoft, borderRadius: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkSoft, fontWeight: 500 }}>Plus-value</span>
                <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: T.green, fontWeight: 700 }}>+{fmtFCFAfull(final.gain)} F</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <span style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkSoft, fontWeight: 500 }}>Multiplicateur</span>
                <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: T.green, fontWeight: 700 }}>{(final.value / final.invested).toFixed(2)}×</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Projection du capital" subtitle="Effet de capitalisation composée" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height={isMobile ? 260 : 360}>
            <AreaChart data={data} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="aVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.blue} stopOpacity={0.25}/>
                  <stop offset="100%" stopColor={T.blue} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="aInv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.chart3} stopOpacity={0.15}/>
                  <stop offset="100%" stopColor={T.chart3} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke={T.borderSoft} vertical={false} strokeDasharray="3 3"/>
              <XAxis dataKey="year" stroke={T.inkDim} tick={{ fontSize: 11, fontFamily: FONT_MONO, fill: T.inkMuted }} axisLine={false} tickLine={false}/>
              <YAxis stroke={T.inkDim} tick={{ fontSize: 11, fontFamily: FONT_MONO, fill: T.inkMuted }} tickFormatter={fmtFCFA} axisLine={false} tickLine={false}/>
              <Tooltip content={<ChartTooltip />}/>
              <Legend wrapperStyle={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted, paddingTop: 10 }}/>
              <Area type="monotone" dataKey="invested" stroke={T.chart3} strokeWidth={1.5} fill="url(#aInv)" name="Capital investi"/>
              <Area type="monotone" dataKey="value" stroke={T.blue} strokeWidth={2.5} fill="url(#aVal)" name="Valeur portefeuille"/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Comparaison des 3 scénarios" subtitle={`DCA ${fmtFCFAfull(monthly)} F/mois · ${years} ans`} icon={Zap}>
        <ResponsiveContainer width="100%" height={isMobile ? 220 : 300}>
          <LineChart data={scenarios} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke={T.borderSoft} vertical={false} strokeDasharray="3 3"/>
            <XAxis dataKey="year" stroke={T.inkDim} tick={{ fontSize: 11, fontFamily: FONT_MONO, fill: T.inkMuted }} axisLine={false} tickLine={false}/>
            <YAxis stroke={T.inkDim} tick={{ fontSize: 11, fontFamily: FONT_MONO, fill: T.inkMuted }} tickFormatter={fmtFCFA} axisLine={false} tickLine={false}/>
            <Tooltip content={<ChartTooltip />}/>
            <Legend wrapperStyle={{ fontFamily: FONT_SANS, fontSize: 11, paddingTop: 10 }}/>
            <Line type="monotone" dataKey="invested" stroke={T.inkDim} strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Capital investi"/>
            <Line type="monotone" dataKey="conservative" stroke={T.amber} strokeWidth={2} dot={false} name="Conserv. 8%"/>
            <Line type="monotone" dataKey="central" stroke={T.blue} strokeWidth={2.5} dot={false} name="Central 10%"/>
            <Line type="monotone" dataKey="optimistic" stroke={T.green} strokeWidth={2} dot={false} name="Optimiste 12%"/>
          </LineChart>
        </ResponsiveContainer>

        <div style={{
          display: "grid",
          gridTemplateColumns: cols("1fr", "repeat(3, 1fr)", "repeat(3, 1fr)"),
          gap: isMobile ? 10 : 14, marginTop: isMobile ? 16 : 24,
        }}>
          {[
            { label: "Conservateur", rate: "8%", value: scenarios[scenarios.length-1]?.conservative, color: T.amber, bg: T.amberSoft },
            { label: "Central", rate: "10%", value: scenarios[scenarios.length-1]?.central, color: T.blue, bg: T.blueSoft, highlight: true },
            { label: "Optimiste", rate: "12%", value: scenarios[scenarios.length-1]?.optimistic, color: T.green, bg: T.greenSoft },
          ].map(s => (
            <div key={s.label} style={{
              padding: isMobile ? 14 : 18,
              background: s.highlight ? s.bg : T.bgSubtle,
              border: `1px solid ${s.highlight ? s.color : T.borderSoft}`,
              borderRadius: 12,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: s.color, fontWeight: 600 }}>{s.label}</div>
                <Pill color={s.color} bg={s.bg}>{s.rate}</Pill>
              </div>
              <div style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 20 : 26, color: T.ink, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1 }}>
                {fmtFCFA(s.value || 0)}
              </div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.inkMuted, marginTop: 4 }}>FCFA à {years} ans</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
