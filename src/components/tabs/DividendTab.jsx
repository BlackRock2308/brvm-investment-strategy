import React, { useState, useMemo } from "react";
import {
  ComposedChart, Area, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Coins, TrendingUp, Briefcase, Target, ChevronDown, ChevronUp } from "lucide-react";
import { T, FONT_SANS, FONT_MONO } from "../../theme";
import { STOCKS, SECTOR_COLORS, PHASE_CONFIG, CURRENT_HOLDINGS } from "../../data/stocks";
import { fmtFCFA, fmtFCFAfull, fmtEUR } from "../../utils/format";
import { projectDRIP, computeDividendTargets } from "../../utils/projections";
import useResponsive from "../../hooks/useResponsive";

import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import MetricCard from "../ui/MetricCard";
import Slider from "../ui/Slider";
import Pill from "../ui/Pill";
import ChartTooltip from "../ui/ChartTooltip";

const DIVIDEND_TARGETS = [100_000, 200_000, 300_000, 500_000, 1_000_000];
const TARGET_COLORS = [T.blue, T.chart3, T.chart6, T.green, T.neon];

export default function DividendTab() {
  const [divInitial, setDivInitial] = useState(200000);
  const [divMonthly, setDivMonthly] = useState(75000);
  const [divYears, setDivYears] = useState(15);
  const [divYield, setDivYield] = useState(8);
  const [divGrowth, setDivGrowth] = useState(5);
  const [dripYears, setDripYears] = useState(10);
  const [taxRate, setTaxRate] = useState(25);

  const [objTaxRate, setObjTaxRate] = useState(15);
  const [objDca, setObjDca] = useState(75000);
  const [expandedTarget, setExpandedTarget] = useState(null);

  const { isMobile, cols } = useResponsive();

  const dripData = useMemo(() => projectDRIP({
    initial: divInitial, monthly: divMonthly, years: divYears,
    yieldPct: divYield, growthDiv: divGrowth, dripYears, taxRate,
  }), [divInitial, divMonthly, divYears, divYield, divGrowth, dripYears, taxRate]);

  const phase1 = PHASE_CONFIG[0];
  const milestones = useMemo(() => computeDividendTargets({
    targets: DIVIDEND_TARGETS,
    stocks: STOCKS,
    phaseWeights: phase1.weights,
    currentHoldings: CURRENT_HOLDINGS,
    taxRate: objTaxRate,
    dcaMonthly: objDca,
  }), [objTaxRate, objDca]);

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

      {/* ── Objectifs Dividendes ── */}
      <div style={{ marginTop: 32 }}>
        <PageHeader
          eyebrow="Objectifs · dividendes"
          title="Quel capital pour vos objectifs de revenus passifs ?"
          description="Simulation basée sur l'allocation Phase 1, les rendements actuels et votre portefeuille existant."
        />

        {/* Current position banner */}
        {milestones[0] && (
          <div style={{
            display: "grid",
            gridTemplateColumns: cols("1fr", "repeat(4, 1fr)", "repeat(4, 1fr)"),
            gap: isMobile ? 10 : 14,
            marginBottom: 20,
          }}>
            <div style={{
              background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12,
              padding: isMobile ? 14 : 18,
            }}>
              <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em", marginBottom: 6 }}>Position actuelle</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 20 : 24, fontWeight: 700, color: T.ink, letterSpacing: "-0.02em" }}>{fmtFCFAfull(milestones[0].currentValue)} F</div>
            </div>
            <div style={{
              background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12,
              padding: isMobile ? 14 : 18,
            }}>
              <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em", marginBottom: 6 }}>Dividendes bruts/an</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 20 : 24, fontWeight: 700, color: T.chart3, letterSpacing: "-0.02em" }}>{fmtFCFAfull(milestones[0].currentDivGross)} F</div>
            </div>
            <div style={{
              background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12,
              padding: isMobile ? 14 : 18,
            }}>
              <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em", marginBottom: 6 }}>Dividendes nets/an</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 20 : 24, fontWeight: 700, color: T.green, letterSpacing: "-0.02em" }}>{fmtFCFAfull(milestones[0].currentDivNet)} F</div>
            </div>
            <div style={{
              background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12,
              padding: isMobile ? 14 : 18,
            }}>
              <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em", marginBottom: 6 }}>Yield moyen net</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 20 : 24, fontWeight: 700, color: T.blue, letterSpacing: "-0.02em" }}>{milestones[0].weightedYieldNet}%</div>
            </div>
          </div>
        )}

        {/* Sliders row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 14, marginBottom: 24,
        }}>
          <Card title="Paramètres objectifs" icon={Target} padding={20}>
            <Slider label="Fiscalité IRVM" value={objTaxRate} setValue={setObjTaxRate} min={10} max={30} step={1} suffix=" %" accent={T.red}/>
            <Slider label="DCA mensuel" value={objDca} setValue={setObjDca} min={25000} max={500000} step={5000} suffix=" F" accent={T.blue}/>
          </Card>
        </div>

        {/* Milestone cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {milestones.map((m, i) => {
            const color = TARGET_COLORS[i];
            const isExpanded = expandedTarget === i;
            return (
              <Card key={m.target} style={{ borderLeft: `4px solid ${color}` }}>
                {/* Header row */}
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => setExpandedTarget(isExpanded ? null : i)}
                >
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "200px 1fr 1fr 1fr auto",
                    gap: isMobile ? 12 : 20,
                    alignItems: "center",
                  }}>
                    {/* Target */}
                    <div>
                      <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em", marginBottom: 4 }}>Objectif net/an</div>
                      <div style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 22 : 26, fontWeight: 700, color, letterSpacing: "-0.03em", lineHeight: 1 }}>
                        {fmtFCFAfull(m.target)} F
                      </div>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: T.inkMuted, marginTop: 4 }}>
                        {fmtFCFAfull(m.monthlyEquiv)} F/mois · ≈ {fmtEUR(m.target)} €/an
                      </div>
                    </div>

                    {/* Required capital */}
                    <div>
                      <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em", marginBottom: 4 }}>Capital requis</div>
                      <div style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 18 : 22, fontWeight: 700, color: T.ink, letterSpacing: "-0.02em" }}>
                        {fmtFCFA(m.requiredCapital)} F
                      </div>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: T.amber, marginTop: 4 }}>
                        +{fmtFCFAfull(m.additionalCapital)} F à investir
                      </div>
                    </div>

                    {/* Time estimate */}
                    <div>
                      <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em", marginBottom: 4 }}>Durée estimée</div>
                      <div style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 18 : 22, fontWeight: 700, color: T.ink, letterSpacing: "-0.02em" }}>
                        {m.fullYears > 0 ? `${m.fullYears} an${m.fullYears > 1 ? "s" : ""}` : ""}
                        {m.fullYears > 0 && m.remainingMonths > 0 ? " " : ""}
                        {m.remainingMonths > 0 ? `${m.remainingMonths} mois` : ""}
                        {m.fullYears === 0 && m.remainingMonths === 0 ? "< 1 mois" : ""}
                      </div>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: T.inkMuted, marginTop: 4 }}>
                        DCA {fmtFCFAfull(objDca)} F/mois
                      </div>
                    </div>

                    {/* Progress */}
                    <div>
                      <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em", marginBottom: 4 }}>Progression</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ flex: 1, height: 8, background: T.bgSoft, borderRadius: 999, overflow: "hidden" }}>
                          <div style={{
                            height: "100%", borderRadius: 999,
                            width: `${m.progressPct}%`,
                            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                            transition: "width 0.4s ease",
                          }} />
                        </div>
                        <div style={{ fontFamily: FONT_MONO, fontSize: 13, fontWeight: 600, color, minWidth: 40 }}>
                          {m.progressPct}%
                        </div>
                      </div>
                    </div>

                    {/* Expand toggle */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {isExpanded
                        ? <ChevronUp size={20} color={T.inkMuted} />
                        : <ChevronDown size={20} color={T.inkMuted} />}
                    </div>
                  </div>
                </div>

                {/* Expanded breakdown */}
                {isExpanded && (
                  <div style={{ marginTop: 20, borderTop: `1px solid ${T.borderSoft}`, paddingTop: 20 }}>
                    <div style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 12 }}>
                      Allocation cible détaillée
                    </div>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{
                        width: "100%", borderCollapse: "collapse",
                        fontFamily: FONT_SANS, fontSize: isMobile ? 12 : 13,
                      }}>
                        <thead>
                          <tr style={{ borderBottom: `2px solid ${T.border}` }}>
                            {["Ticker", "Poids", "Actions cible", "Détenues", "À acheter", "Capital", "Div. net/an"].map(h => (
                              <th key={h} style={{
                                padding: "10px 12px", textAlign: "left",
                                fontWeight: 600, color: T.inkMuted, fontSize: 11,
                                textTransform: "uppercase", letterSpacing: "0.03em",
                                whiteSpace: "nowrap",
                              }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {m.breakdown.map(b => (
                            <tr key={b.ticker} style={{ borderBottom: `1px solid ${T.borderSoft}` }}>
                              <td style={{ padding: "10px 12px" }}>
                                <span style={{ fontWeight: 600, color: T.ink }}>{b.ticker}</span>
                                <span style={{ color: T.inkMuted, marginLeft: 6, fontSize: 11 }}>{b.name}</span>
                              </td>
                              <td style={{ padding: "10px 12px" }}>
                                <Pill color={color} bg={`${color}18`}>{b.weight}%</Pill>
                              </td>
                              <td style={{ padding: "10px 12px", fontFamily: FONT_MONO, fontWeight: 600 }}>{b.sharesNeeded}</td>
                              <td style={{ padding: "10px 12px", fontFamily: FONT_MONO, color: b.sharesHeld > 0 ? T.green : T.inkDim }}>
                                {b.sharesHeld}
                              </td>
                              <td style={{ padding: "10px 12px", fontFamily: FONT_MONO, fontWeight: 600, color: b.toBuy > 0 ? T.amber : T.green }}>
                                {b.toBuy > 0 ? `+${b.toBuy}` : "✓"}
                              </td>
                              <td style={{ padding: "10px 12px", fontFamily: FONT_MONO, fontSize: 12 }}>
                                {fmtFCFAfull(b.capitalTarget)} F
                              </td>
                              <td style={{ padding: "10px 12px", fontFamily: FONT_MONO, fontSize: 12, color: T.green, fontWeight: 600 }}>
                                {fmtFCFAfull(b.annualDivNet)} F
                              </td>
                            </tr>
                          ))}
                          <tr style={{ background: T.bgSubtle }}>
                            <td style={{ padding: "10px 12px", fontWeight: 700 }} colSpan={2}>Total</td>
                            <td style={{ padding: "10px 12px", fontFamily: FONT_MONO, fontWeight: 700 }}>
                              {m.breakdown.reduce((s, b) => s + b.sharesNeeded, 0)}
                            </td>
                            <td style={{ padding: "10px 12px", fontFamily: FONT_MONO, fontWeight: 600, color: T.green }}>
                              {m.breakdown.reduce((s, b) => s + b.sharesHeld, 0)}
                            </td>
                            <td style={{ padding: "10px 12px", fontFamily: FONT_MONO, fontWeight: 700, color: T.amber }}>
                              +{m.breakdown.reduce((s, b) => s + b.toBuy, 0)}
                            </td>
                            <td style={{ padding: "10px 12px", fontFamily: FONT_MONO, fontWeight: 700 }}>
                              {fmtFCFAfull(m.requiredCapital)} F
                            </td>
                            <td style={{ padding: "10px 12px", fontFamily: FONT_MONO, fontWeight: 700, color: T.green }}>
                              {fmtFCFAfull(m.breakdown.reduce((s, b) => s + b.annualDivNet, 0))} F
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
