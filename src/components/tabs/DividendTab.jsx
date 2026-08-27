import React, { useState, useMemo } from "react";
import {
  ComposedChart, Area, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Coins, TrendingUp, Briefcase, Target, ChevronDown, ChevronUp } from "lucide-react";
import { T, FONT_SANS, FONT_MONO, alpha, chartTokens } from "../../theme";
import { STOCKS, PHASE_CONFIG, CURRENT_HOLDINGS } from "../../data/stocks";
import { fmtFCFA, fmtFCFAfull, fmtEUR } from "../../utils/format";
import { projectDRIP, computeDividendTargets } from "../../utils/projections";
import useResponsive from "../../hooks/useResponsive";
import useTheme from "../../hooks/useTheme";

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
  const { isDark } = useTheme();
  const ct = chartTokens(isDark);

  const dripData = useMemo(() => projectDRIP({
    initial: divInitial, monthly: divMonthly, years: divYears,
    yieldPct: divYield, growthDiv: divGrowth, dripYears, taxRate,
  }), [divInitial, divMonthly, divYears, divYield, divGrowth, dripYears, taxRate]);

  const phase1 = PHASE_CONFIG[0];

  const yieldBreakdown = useMemo(() => {
    const stockMap = Object.fromEntries(STOCKS.map(s => [s.ticker, s]));
    return phase1.tickers.map(ticker => {
      const s = stockMap[ticker];
      const weight = phase1.weights[ticker];
      const contribution = s ? (weight / 100) * s.yield : 0;
      return {
        ticker,
        name: s?.name || ticker,
        yieldGross: s?.yield || 0,
        weight,
        contribution: +contribution.toFixed(3),
      };
    });
  }, []);

  // Targets are monthly — multiply by 12 so the engine (annual-based) calculates the right capital
  const milestones = useMemo(() => computeDividendTargets({
    targets: DIVIDEND_TARGETS.map(t => t * 12),
    stocks: STOCKS,
    phaseWeights: phase1.weights,
    currentHoldings: CURRENT_HOLDINGS,
    taxRate: objTaxRate,
    dcaMonthly: objDca,
  }), [objTaxRate, objDca]);

  const finalDiv = dripData[dripData.length - 1];
  const passiveMonthly = finalDiv?.dividendsMonthly || 0;
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
          <Slider label="Capital initial" value={divInitial} setValue={setDivInitial} min={0} max={5_000_000} step={50000} suffix=" F CFA" accent={T.blue}
            hint="Montant déjà investi au départ. Si tu pars de zéro, laisse à 0. Si tu as un portefeuille existant, saisis sa valeur actuelle."/>
          <Slider label="DCA mensuel" value={divMonthly} setValue={setDivMonthly} min={25000} max={250000} step={5000} suffix=" F CFA" accent={T.blue}
            hint="Montant fixe versé chaque mois (Dollar-Cost Averaging). Plus il est élevé, plus ton capital croît vite indépendamment des dividendes."/>
          <Slider label="Horizon" value={divYears} setValue={setDivYears} min={5} max={25} step={1} suffix=" ans" accent={T.chart3}
            hint="Durée totale de la simulation. Le graphique affiche l'évolution de la valeur du portefeuille et des dividendes nets sur cette période."/>
          <Slider label="Yield initial moyen" value={divYield} setValue={setDivYield} min={4} max={12} step={0.5} suffix=" %" accent={T.green}
            hint="Rendement dividende brut annuel moyen (dividende versé ÷ prix). À la BRVM, les blue chips défensives se situent entre 4 % et 8 %."/>
          <Slider label="Croissance div./an" value={divGrowth} setValue={setDivGrowth} min={0} max={15} step={1} suffix=" %" accent={T.green}
            hint="Hausse annuelle du yield au fil du temps. 0 % = dividendes stables. 5 % = dividendes qui doublent en ~14 ans. Reflète la croissance des sociétés."/>
          <Slider label="Années DRIP actif" value={dripYears} setValue={setDripYears} min={0} max={divYears} step={1} suffix=" ans" accent={T.chart3}
            hint="Nombre d'années où les dividendes perçus sont réinvestis automatiquement (DRIP). Au-delà, ils deviennent un revenu passif conservé. Effet composé maximal quand DRIP = Horizon."/>
          <Slider label="Fiscalité totale" value={taxRate} setValue={setTaxRate} min={10} max={40} step={1} suffix=" %" accent={T.red}
            hint="Taux d'imposition sur les dividendes. À la BRVM, l'IRVM est de 15 %. Ajuste si tu anticipes d'autres charges fiscales dans ton pays de résidence."/>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: cols("1fr", "repeat(3, 1fr)", "repeat(3, 1fr)"),
            gap: isMobile ? 10 : 14,
          }}>
            <MetricCard label="Valeur portefeuille" value={fmtFCFA(finalDiv?.value || 0)} unit="F CFA" deltaLabel={`à ${divYears} ans`} icon={Briefcase} color={T.blue}/>
            <MetricCard label="Dividendes nets/an" value={fmtFCFA(finalDiv?.dividendsNet || 0)} unit="F CFA" deltaLabel={`fisc. ${taxRate}%`} icon={Coins} color={T.green}/>
            <div style={{
              background: T.bgDark,
              border: `1px solid ${T.bgDark}`,
              borderRadius: 16, padding: isMobile ? 16 : 20,
              color: "#FAF8F4", position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: -40, right: -40,
                width: 140, height: 140,
                background: `radial-gradient(circle, ${alpha(passiveMonthly > 50000 ? T.green : T.amber, 0.31)}, transparent 60%)`,
                borderRadius: "50%",
              }}/>
              <div style={{ position: "relative" }}>
                <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: "#9C988C", fontWeight: 500, letterSpacing: "0.02em", textTransform: "uppercase", marginBottom: 8 }}>Revenu mensuel passif</div>
                <div style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 22 : 28, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1, color: passiveMonthly > 50000 ? T.neon : T.amber }}>
                  {fmtFCFA(passiveMonthly)}
                </div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: "#9C988C", marginTop: 4 }}>
                  F CFA/mois · ≈ {fmtEUR(passiveMonthly * 12) / 12 | 0} €/mois
                </div>
              </div>
            </div>
          </div>

          <Card title="Valeur + dividendes nets annuels" subtitle="Évolution du portefeuille et des revenus" icon={TrendingUp}>
            <ResponsiveContainer width="100%" height={isMobile ? 240 : 300}>
              <ComposedChart data={dripData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="dG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ct.primary} stopOpacity={0.25}/>
                    <stop offset="100%" stopColor={ct.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={ct.grid} vertical={false} strokeDasharray="3 3"/>
                <XAxis dataKey="year" stroke={ct.grid} tick={{ fontSize: 11, fontFamily: FONT_MONO, fill: ct.textMuted }} axisLine={false} tickLine={false}/>
                <YAxis yAxisId="left" stroke={ct.grid} tick={{ fontSize: 11, fontFamily: FONT_MONO, fill: ct.textMuted }} tickFormatter={fmtFCFA} axisLine={false} tickLine={false}/>
                <YAxis yAxisId="right" orientation="right" stroke={ct.grid} tick={{ fontSize: 11, fontFamily: FONT_MONO, fill: ct.positive }} tickFormatter={fmtFCFA} axisLine={false} tickLine={false}/>
                <Tooltip content={<ChartTooltip />}/>
                <Legend wrapperStyle={{ fontFamily: FONT_SANS, fontSize: 11, paddingTop: 10, color: ct.textMuted }}/>
                <Area yAxisId="left" type="monotone" dataKey="value" stroke={ct.primary} strokeWidth={2.5} fill="url(#dG)" name="Valeur portefeuille" isAnimationActive={false}/>
                <Bar yAxisId="right" dataKey="dividendsNet" fill={ct.positive} name="Dividendes nets" radius={[4, 4, 0, 0]} opacity={0.9} isAnimationActive={false}/>
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      {/* ── Objectifs Dividendes ── */}
      <div style={{ marginTop: 32 }}>
        <PageHeader
          eyebrow="Objectifs · dividendes"
          title="Quel capital pour vos objectifs de revenus passifs ?"
          description="Simulation basée sur l'allocation Phase 1, les rendements actuels et votre portefeuille existant. Les objectifs sont exprimés en revenus nets par mois."
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
              <div style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 20 : 24, fontWeight: 700, color: T.ink, letterSpacing: "-0.02em" }}>{fmtFCFAfull(milestones[0].currentValue)} F CFA</div>
            </div>
            <div style={{
              background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12,
              padding: isMobile ? 14 : 18,
            }}>
              <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em", marginBottom: 6 }}>Dividendes bruts/mois</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 20 : 24, fontWeight: 700, color: T.chart3, letterSpacing: "-0.02em" }}>{fmtFCFAfull(Math.round(milestones[0].currentDivGross / 12))} F CFA</div>
            </div>
            <div style={{
              background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12,
              padding: isMobile ? 14 : 18,
            }}>
              <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em", marginBottom: 6 }}>Dividendes nets/mois</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 20 : 24, fontWeight: 700, color: T.green, letterSpacing: "-0.02em" }}>{fmtFCFAfull(Math.round(milestones[0].currentDivNet / 12))} F CFA</div>
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
            <Slider label="DCA mensuel" value={objDca} setValue={setObjDca} min={25000} max={500000} step={5000} suffix=" F CFA" accent={T.blue}/>
          </Card>
        </div>

        {/* ── Méthodologie ── */}
        {milestones[0] && (() => {
          const grossTotal = yieldBreakdown.reduce((s, r) => s + r.contribution, 0);
          const netTotal = milestones[0].weightedYieldNet;
          const exampleTarget = DIVIDEND_TARGETS[0]; // 100 000 F CFA/mois
          const exampleCapital = milestones[0].requiredCapital;
          return (
            <Card title="Méthodologie du calcul" icon={Target} style={{ marginBottom: 24 }}>
              {/* Formula */}
              <div style={{
                padding: "14px 16px", borderRadius: 10, marginBottom: 16,
                background: T.bgSubtle, border: `1px solid ${T.border}`,
              }}>
                <div style={{ fontFamily: FONT_SANS, fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 8 }}>
                  Formule
                </div>
                <div style={{
                  fontFamily: FONT_MONO, fontSize: isMobile ? 11 : 13, color: T.blue,
                  lineHeight: 1.8, letterSpacing: "0.01em",
                }}>
                  Capital requis = (Objectif mensuel × 12) ÷ Yield net pondéré Phase 1
                </div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: T.inkMuted, marginTop: 6 }}>
                  Exemple : ({fmtFCFAfull(exampleTarget)} F × 12) ÷ {netTotal}%
                  {" = "}<strong style={{ color: T.ink }}>{fmtFCFAfull(Math.round(exampleCapital))} F CFA</strong>
                </div>
              </div>

              {/* Yield breakdown table */}
              <div style={{ fontFamily: FONT_SANS, fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 10 }}>
                Yield pondéré — allocation Phase 1 (fiscalité IRVM {objTaxRate}%)
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_SANS, fontSize: 12 }}>
                  <thead>
                    <tr>
                      {["Ligne", "Société", "Yield brut", "Poids Phase 1", "Contribution brute"].map((h, i) => (
                        <th key={h} style={{
                          padding: "8px 12px",
                          textAlign: i >= 2 ? "right" : "left",
                          fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted,
                          fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
                          borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {yieldBreakdown.map(r => (
                      <tr key={r.ticker}>
                        <td style={{ padding: "9px 12px", borderBottom: `1px solid ${T.borderSoft}` }}>
                          <span style={{
                            fontFamily: FONT_MONO, fontSize: 12, fontWeight: 700, color: T.blue,
                            background: T.blueSoft, padding: "2px 7px", borderRadius: 5,
                          }}>{r.ticker}</span>
                        </td>
                        <td style={{ padding: "9px 12px", color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}` }}>{r.name}</td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: FONT_MONO, color: T.green, fontWeight: 600, borderBottom: `1px solid ${T.borderSoft}` }}>
                          {r.yieldGross.toString().replace(".", ",")}%
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: FONT_MONO, color: T.inkSoft, borderBottom: `1px solid ${T.borderSoft}` }}>
                          {r.weight}%
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: FONT_MONO, fontWeight: 600, color: T.ink, borderBottom: `1px solid ${T.borderSoft}` }}>
                          {(r.weight / 100 * r.yieldGross).toFixed(3).replace(".", ",")}%
                        </td>
                      </tr>
                    ))}
                    {/* Gross total */}
                    <tr style={{ background: T.bgSubtle }}>
                      <td colSpan={4} style={{ padding: "9px 12px", fontFamily: FONT_SANS, fontWeight: 700, color: T.ink }}>
                        Yield brut pondéré
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: FONT_MONO, fontWeight: 700, color: T.chart3 }}>
                        {grossTotal.toFixed(3).replace(".", ",")}%
                      </td>
                    </tr>
                    {/* Net total */}
                    <tr style={{ background: T.bgSubtle }}>
                      <td colSpan={4} style={{ padding: "9px 12px", fontFamily: FONT_SANS, fontWeight: 700, color: T.ink }}>
                        Yield net pondéré (après IRVM {objTaxRate}%)
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: FONT_MONO, fontWeight: 700, color: T.green, fontSize: 14 }}>
                        {netTotal.toString().replace(".", ",")}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Hypothèses */}
              <div style={{
                marginTop: 14, padding: "12px 16px", borderRadius: 10,
                background: T.bgSubtle, border: `1px solid ${T.borderSoft}`,
                fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted, lineHeight: 1.65,
              }}>
                <strong style={{ color: T.ink }}>Hypothèses :</strong>
                {" "}Les cours et yields utilisés sont ceux du snapshot courant dans{" "}
                <span style={{ fontFamily: FONT_MONO, fontSize: 10 }}>stocks.js</span>.
                Le capital requis suppose que le portefeuille est déjà composé à 100% selon les poids Phase 1.
                La progression réelle est calculée sur la valorisation actuelle de tes 4 lignes (SNTS, ORAC, BOAB, CIEC).
                Modifier la fiscalité IRVM via le slider met à jour tous les chiffres dynamiquement.
              </div>
            </Card>
          );
        })()}

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
                    gridTemplateColumns: isMobile ? "1fr" : "200px 1fr 1fr auto",
                    gap: isMobile ? 12 : 20,
                    alignItems: "center",
                  }}>
                    {/* Target */}
                    <div>
                      <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em", marginBottom: 4 }}>Objectif net/mois</div>
                      <div style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 22 : 26, fontWeight: 700, color, letterSpacing: "-0.03em", lineHeight: 1 }}>
                        {fmtFCFAfull(m.monthlyEquiv)} F CFA                      </div>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: T.inkMuted, marginTop: 4 }}>
                        {fmtFCFAfull(m.target)} F CFA/an · ≈ {fmtEUR(m.monthlyEquiv)} €/mois
                      </div>
                    </div>

                    {/* Required capital */}
                    <div>
                      <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em", marginBottom: 4 }}>Capital requis</div>
                      <div style={{ fontFamily: FONT_SANS, fontSize: isMobile ? 18 : 22, fontWeight: 700, color: T.ink, letterSpacing: "-0.02em" }}>
                        {fmtFCFA(m.requiredCapital)} F CFA                      </div>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: T.amber, marginTop: 4 }}>
                        +{fmtFCFAfull(m.additionalCapital)} F à investir
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
                            {["Ticker", "Poids", "Actions cible", "Détenues", "À acheter", "Capital", "Div. net/mois"].map(h => (
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
                                {fmtFCFAfull(b.capitalTarget)} F CFA                              </td>
                              <td style={{ padding: "10px 12px", fontFamily: FONT_MONO, fontSize: 12, color: T.green, fontWeight: 600 }}>
                                {fmtFCFAfull(Math.round(b.annualDivNet / 12))} F CFA                              </td>
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
                              {fmtFCFAfull(m.requiredCapital)} F CFA                            </td>
                            <td style={{ padding: "10px 12px", fontFamily: FONT_MONO, fontWeight: 700, color: T.green }}>
                              {fmtFCFAfull(Math.round(m.breakdown.reduce((s, b) => s + b.annualDivNet, 0) / 12))} F CFA                            </td>
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
