import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  LineChart as LineIcon, Calculator, Coins, Target,
  TrendingUp, Activity, Zap, Globe2, Briefcase, BarChart3,
  Layers, Wallet, Building2,
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

const marketData = [
  { year: "21", index: 171 },
  { year: "22", index: 205 },
  { year: "23", index: 220 },
  { year: "24", index: 255 },
  { year: "25", index: 320 },
  { year: "26e", index: 402 },
];
const sparkGold = marketData.map(d => ({ v: d.index }));

const pillars = [
  { icon: LineIcon, title: "Stock Screening", subtitle: "Goldman Sachs", desc: "10 titres filtrés : qualité, liquidité, moat UEMOA, compatibilité FCP.", color: T.blue, bg: T.blueSoft },
  { icon: Calculator, title: "DCA discipliné", subtitle: "BlackRock · Buffett", desc: "Contributions mensuelles lissées, ordres à cours limité, rééquilibrage semestriel.", color: T.chart3, bg: "#EDE9FE" },
  { icon: Coins, title: "Dividend Compounding", subtitle: "Harvard Endowment", desc: "DRIP actif 7-12 ans, bascule revenus passifs phase 4.", color: T.green, bg: T.greenSoft },
  { icon: Target, title: "Value long terme", subtitle: "Rothschild · Buffett", desc: "Convictions à décote, thèse macro UEMOA 2030, horizon 15-20 ans.", color: T.amber, bg: T.amberSoft },
];

const contextCards = [
  { icon: Globe2, title: "Marché concentré, signatures solides", desc: "47 actions cotées, ~970M FCFA volume journalier, 5 blue chips concentrent la liquidité.", color: T.blue, bg: T.blueSoft },
  { icon: Zap, title: "Règlement T+2 depuis déc. 2025", desc: "Liquidité et rotation accélérées vs ancien T+3. Provisionner le compte dès l'ordre.", color: T.chart3, bg: "#EDE9FE" },
  { icon: Building2, title: "IPO Bridge Bank 2026", desc: "Banque PME ivoirienne soutenue par IFC et BAD. À suivre pour participation à l'OPV.", color: T.green, bg: T.greenSoft },
];

export default function OverviewTab() {
  const { isMobile, isTablet, cols } = useResponsive();

  return (
    <div>
      <PageHeader
        eyebrow="Tableau de bord · avril 2026"
        title="Votre patrimoine BRVM, piloté avec précision."
        description="4 stratégies imbriquées — DCA, dividendes compounding, value investing, glide path défensif — exécutées depuis une SGI diaspora pour un horizon 20 ans."
      />

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
            Phase 1 — Construction du cœur
          </div>
          <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted, marginTop: 2 }}>
            Capital cible &lt;5M FCFA · 5 lignes concentrées · SNTS, ORAC, BOAB, CIEC, SGBC
          </div>
        </div>
      </div>

      {/* Top metrics */}
      <div style={{
        display: "grid",
        gridTemplateColumns: cols("1fr", "repeat(2, 1fr)", "repeat(4, 1fr)"),
        gap: isMobile ? 10 : 16, marginBottom: isMobile ? 20 : 28,
      }}>
        <MetricCard label="BRVM Composite" value="402" unit="pts" delta={25.3} deltaLabel="YTD" icon={Activity} color={T.blue} sparklineData={sparkGold}/>
        <MetricCard label="Cible 10 ans" value="10,8M" unit="FCFA" delta={79.4} deltaLabel="vs capital" icon={Target} color={T.chart3} sparklineData={[{v:600},{v:1500},{v:2800},{v:4500},{v:6700},{v:8500},{v:10800}]}/>
        <MetricCard label="Cible 20 ans" value="90M" unit="FCFA" delta={142} deltaLabel="vs capital" icon={TrendingUp} color={T.green} sparklineData={[{v:600},{v:3000},{v:7200},{v:14500},{v:26000},{v:45000},{v:90000}]}/>
        <MetricCard label="Revenu passif 49 ans" value="600k" unit="FCFA/mo" delta={12.3} deltaLabel="vs SMIC" icon={Wallet} color={T.amber} sparklineData={[{v:50},{v:120},{v:210},{v:340},{v:470},{v:600}]}/>
      </div>

      {/* Market chart + top holdings */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1.6fr 1fr",
        gap: 16, marginBottom: isMobile ? 20 : 28,
      }}>
        <Card title="Indice BRVM Composite" subtitle="Performance 5 ans · +99,15% cumulé" icon={BarChart3}
          action={<Pill color={T.green} bg={T.greenSoft}>+25,3% 2025</Pill>}
        >
          <ResponsiveContainer width="100%" height={isMobile ? 200 : 280}>
            <AreaChart data={marketData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={T.blue} stopOpacity={0.18}/>
                  <stop offset="100%" stopColor={T.blue} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke={T.borderSoft} vertical={false} strokeDasharray="3 3"/>
              <XAxis dataKey="year" stroke={T.inkDim} tick={{ fontSize: 11, fontFamily: FONT_MONO, fill: T.inkMuted }} axisLine={false} tickLine={false}/>
              <YAxis stroke={T.inkDim} tick={{ fontSize: 11, fontFamily: FONT_MONO, fill: T.inkMuted }} axisLine={false} tickLine={false}/>
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="index" stroke={T.blue} strokeWidth={2.5} fill="url(#gBlue)" name="BRVM-C"/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Top holdings — Phase 1" subtitle="5 lignes cœur · pondérations cibles" icon={Briefcase}>
          <div>
            {STOCKS.filter(s => s.phaseEntry === 1).sort((a, b) => b.conviction - a.conviction).map((s, i) => (
              <div key={s.ticker} style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: 12, alignItems: "center",
                padding: "12px 0",
                borderBottom: i < 4 ? `1px solid ${T.borderSoft}` : "none",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: SECTOR_COLORS[s.sector] + "18",
                  display: "grid", placeItems: "center", fontSize: 16,
                }}>{s.flag}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: 600, color: T.ink, letterSpacing: "-0.01em" }}>
                    {s.ticker}
                    <span style={{ fontWeight: 400, color: T.inkMuted, marginLeft: 6 }}>{s.name}</span>
                  </div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.inkDim, marginTop: 2 }}>
                    {s.sector} · {fmtFCFAfull(s.price)} F
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: T.ink, fontWeight: 600 }}>{s.conviction}%</div>
                  <Pill color={s.change >= 0 ? T.green : T.red} bg={s.change >= 0 ? T.greenSoft : T.redSoft}>
                    {fmtPct(s.change)}
                  </Pill>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Strategy pillars */}
      <Card title="Les 4 piliers méthodologiques" subtitle="Écoles d'investissement combinées" icon={Layers}>
        <div style={{
          display: "grid",
          gridTemplateColumns: cols("1fr", "repeat(2, 1fr)", "repeat(4, 1fr)"),
          gap: 14,
        }}>
          {pillars.map((p, i) => (
            <div key={i} style={{
              padding: isMobile ? 16 : 20, background: T.bgSubtle,
              border: `1px solid ${T.borderSoft}`, borderRadius: 12,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: p.bg, display: "grid", placeItems: "center", marginBottom: 16,
              }}>
                <p.icon size={18} color={p.color} strokeWidth={2.2}/>
              </div>
              <div style={{
                fontFamily: FONT_MONO, fontSize: 10, color: p.color,
                fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4,
              }}>{p.subtitle}</div>
              <div style={{
                fontFamily: FONT_SANS, fontSize: isMobile ? 14 : 16, fontWeight: 600,
                color: T.ink, letterSpacing: "-0.01em", marginBottom: 8,
              }}>{p.title}</div>
              <div style={{
                fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted, lineHeight: 1.55,
              }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick context */}
      <div style={{
        display: "grid",
        gridTemplateColumns: cols("1fr", "1fr", "repeat(3, 1fr)"),
        gap: 16, marginTop: 16,
      }}>
        {contextCards.map((c, i) => (
          <Card key={i} padding={isMobile ? 14 : 18}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: c.bg, display: "grid", placeItems: "center", flexShrink: 0,
              }}>
                <c.icon size={16} color={c.color} strokeWidth={2.2}/>
              </div>
              <div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 4, letterSpacing: "-0.01em" }}>{c.title}</div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted, lineHeight: 1.5 }}>{c.desc}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
