import React, { useState, useMemo } from "react";
import {
  ComposedChart, Area, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Target, Clock, TrendingUp, Layers, Info } from "lucide-react";
import { T, FONT_SANS, FONT_MONO } from "../../theme";
import { fmtFCFA, fmtFCFAfull, fmtEUR } from "../../utils/format";
import { projectDCA, projectEscalated, requiredMonthly } from "../../utils/projections";

import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import Slider from "../ui/Slider";
import Pill from "../ui/Pill";
import ChartTooltip from "../ui/ChartTooltip";

export default function TargetTab() {
  const [target, setTarget] = useState(75_000_000);
  const [targetYears, setTargetYears] = useState(20);
  const [targetRate, setTargetRate] = useState(10);

  const required = useMemo(() =>
    requiredMonthly({ target, years: targetYears, annualRate: targetRate }),
  [target, targetYears, targetRate]);

  const phases = [
    { label: "Phase 1 — 29→34", monthly: 70000,  duration: 5 },
    { label: "Phase 2 — 34→39", monthly: 120000, duration: 5 },
    { label: "Phase 3 — 39→44", monthly: 180000, duration: 5 },
    { label: "Phase 4 — 44→49", monthly: 250000, duration: 5 },
  ];
  const escalatedData = useMemo(() => projectEscalated({ phases, annualRate: targetRate }), [targetRate]);
  const flatData = useMemo(() => projectDCA({ monthly: 100000, years: 20, annualRate: targetRate }), [targetRate]);

  const combined = useMemo(() => escalatedData.map((d, i) => ({
    year: d.year,
    escalated: d.value,
    escalatedInvested: d.invested,
    flat: flatData[i]?.value || 0,
  })), [escalatedData, flatData]);

  const final = escalatedData[escalatedData.length - 1];
  const flatFinal = flatData[flatData.length - 1];

  return (
    <div>
      <PageHeader
        eyebrow="Simulateur · bloc 6"
        title="Cible patrimoniale 50-100M FCFA."
        description="Deux leviers : (1) calculateur inverse — combien épargner pour atteindre X FCFA. (2) DCA escalé par phases de carrière — la mécanique qui surperforme mécaniquement un DCA constant à même total investi."
      />

      <Card title="Calculateur inverse" subtitle="De la cible au DCA requis" icon={Target} style={{ marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.3fr", gap: 20, alignItems: "end" }}>
          <Slider label="Capital cible" value={target} setValue={setTarget} min={25_000_000} max={200_000_000} step={5_000_000} suffix=" F" accent={T.chart3}/>
          <Slider label="Horizon" value={targetYears} setValue={setTargetYears} min={10} max={30} step={1} suffix=" ans" accent={T.chart3}/>
          <Slider label="Rendement" value={targetRate} setValue={setTargetRate} min={5} max={14} step={0.5} suffix=" %" accent={T.chart3}/>
          <div style={{
            padding: 20, background: T.bgDark, borderRadius: 12,
            color: T.inkInv, position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -50, right: -50,
              width: 150, height: 150,
              background: `radial-gradient(circle, ${T.chart3}60, transparent 60%)`,
              borderRadius: "50%",
            }}/>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: "#A5B4FC", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>DCA mensuel requis</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 32, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1 }}>
                {fmtFCFAfull(Math.round(required))} F
              </div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: "#A5B4FC", marginTop: 6 }}>
                ≈ {fmtEUR(required)} €/mois
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 16, marginBottom: 16 }}>
        <Card title="DCA escalé" subtitle="4 phases de carrière, 29→49 ans" icon={Clock}>
          {phases.map((p, i) => (
            <div key={i} style={{
              padding: "14px 0",
              borderBottom: i < phases.length - 1 ? `1px solid ${T.borderSoft}` : "none",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 13, color: T.ink, fontWeight: 600 }}>{p.label}</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.inkDim, marginTop: 2, letterSpacing: "0.02em" }}>{p.duration} ans · compounding actif</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 14, color: T.blue, fontWeight: 700 }}>{fmtFCFAfull(p.monthly)}</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.inkDim }}>FCFA/mois</div>
              </div>
            </div>
          ))}

          <div style={{
            marginTop: 18, padding: 18, background: T.bgDark,
            borderRadius: 12, color: T.inkInv, position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -40, right: -40,
              width: 120, height: 120,
              background: `radial-gradient(circle, ${T.green}50, transparent 70%)`,
              borderRadius: "50%",
            }}/>
            <div style={{ position: "relative" }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: "#86EFAC", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>À 49 ans, capital total</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 36, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, color: T.neon }}>
                {fmtFCFA(final?.value || 0)}
              </div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: "#86EFAC", marginTop: 4 }}>FCFA · ≈ {fmtEUR(final?.value || 0)} €</div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.inkMuted}40`, fontFamily: FONT_SANS, fontSize: 12, color: "#D1D5DB" }}>
                Investi : {fmtFCFA(final?.invested || 0)} F<br/>
                <span style={{ color: T.neon, fontWeight: 600 }}>+{fmtFCFA(final?.gain || 0)} F</span> de plus-value
              </div>
            </div>
          </div>
        </Card>

        <Card title="Trajectoire 20 ans" subtitle="Escalé vs Constant à 100k — la différence" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={combined} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="escG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.green} stopOpacity={0.25}/>
                  <stop offset="100%" stopColor={T.green} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke={T.borderSoft} vertical={false} strokeDasharray="3 3"/>
              <XAxis dataKey="year" stroke={T.inkDim} tick={{ fontSize: 11, fontFamily: FONT_MONO, fill: T.inkMuted }} axisLine={false} tickLine={false}/>
              <YAxis stroke={T.inkDim} tick={{ fontSize: 11, fontFamily: FONT_MONO, fill: T.inkMuted }} tickFormatter={fmtFCFA} axisLine={false} tickLine={false}/>
              <Tooltip content={<ChartTooltip />}/>
              <Legend wrapperStyle={{ fontFamily: FONT_SANS, fontSize: 12, paddingTop: 10 }}/>
              <Area type="monotone" dataKey="escalated" stroke={T.green} strokeWidth={2.5} fill="url(#escG)" name="DCA escalé (objectif)"/>
              <Line type="monotone" dataKey="flat" stroke={T.blue} strokeWidth={2} dot={false} name="DCA constant 100k"/>
              <Line type="monotone" dataKey="escalatedInvested" stroke={T.inkDim} strokeWidth={1.2} strokeDasharray="3 3" dot={false} name="Capital investi"/>
            </ComposedChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 8, padding: "10px 14px", background: T.blueSoft, borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <Info size={14} color={T.blue}/>
            <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkSoft }}>
              À 20 ans, le DCA escalé atteint <strong style={{ color: T.green }}>{fmtFCFA(final?.value || 0)}</strong> vs <strong style={{ color: T.blue }}>{fmtFCFA(flatFinal?.value || 0)}</strong> pour le DCA constant.
            </div>
          </div>
        </Card>
      </div>

      <Card title="Matrice de faisabilité" subtitle="DCA constant requis par combinaison" icon={Layers}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_SANS, fontSize: 13 }}>
            <thead>
              <tr>
                {["Horizon × Rendement", "Pour 50M", "Pour 75M", "Pour 100M", "Verdict"].map(h => (
                  <th key={h} style={{
                    textAlign: h === "Verdict" ? "left" : (h === "Horizon × Rendement" ? "left" : "right"),
                    padding: "10px 14px",
                    fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted,
                    fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
                    borderBottom: `1px solid ${T.border}`,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { h: 15, r: 8,  v: "50M accessible · 100M exigeant", c: T.amber },
                { h: 15, r: 10, v: "Cœur réaliste", c: T.blue },
                { h: 15, r: 12, v: "Confortable dès 100k/mois", c: T.green },
                { h: 20, r: 8,  v: "50M avec DCA modéré", c: T.blue },
                { h: 20, r: 10, v: "Zone idéale DCA escalé", c: T.green, highlight: true },
                { h: 20, r: 12, v: "100M dès 100k constant", c: T.green },
              ].map((row, i) => {
                const m50  = Math.round(requiredMonthly({ target: 50_000_000,  years: row.h, annualRate: row.r }));
                const m75  = Math.round(requiredMonthly({ target: 75_000_000,  years: row.h, annualRate: row.r }));
                const m100 = Math.round(requiredMonthly({ target: 100_000_000, years: row.h, annualRate: row.r }));
                return (
                  <tr key={i} style={{
                    background: row.highlight ? T.greenSoft : "transparent",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { if (!row.highlight) e.currentTarget.style.background = T.bgSubtle; }}
                  onMouseLeave={e => { if (!row.highlight) e.currentTarget.style.background = "transparent"; }}
                  >
                    <td style={{ padding: "14px 14px", color: T.ink, fontWeight: 600, borderBottom: `1px solid ${T.borderSoft}` }}>
                      <Pill color={T.inkSoft} bg={T.bgSoft}>{row.h} ans</Pill>
                      <span style={{ marginLeft: 8, fontFamily: FONT_MONO, color: T.inkMuted }}>{row.r}%</span>
                    </td>
                    <td style={{ padding: "14px 14px", textAlign: "right", fontFamily: FONT_MONO, color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}` }}>{fmtFCFAfull(m50)}</td>
                    <td style={{ padding: "14px 14px", textAlign: "right", fontFamily: FONT_MONO, color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}` }}>{fmtFCFAfull(m75)}</td>
                    <td style={{ padding: "14px 14px", textAlign: "right", fontFamily: FONT_MONO, color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}` }}>{fmtFCFAfull(m100)}</td>
                    <td style={{ padding: "14px 14px", borderBottom: `1px solid ${T.borderSoft}` }}>
                      <Pill color={row.c} bg={row.c + "18"}>{row.v}</Pill>
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
