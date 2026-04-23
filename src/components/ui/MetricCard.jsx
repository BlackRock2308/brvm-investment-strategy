import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { T, FONT_SANS, FONT_MONO } from "../../theme";
import { fmtPct } from "../../utils/format";

export default function MetricCard({ label, value, unit, delta, deltaLabel, icon: Icon, color = T.blue, sparklineData }) {
  const positive = delta !== undefined ? delta >= 0 : null;
  return (
    <div style={{
      background: T.bgCard,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      padding: 20,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{
          fontFamily: FONT_SANS, fontSize: 11, color: T.inkMuted,
          fontWeight: 500, letterSpacing: "0.02em", textTransform: "uppercase",
        }}>{label}</div>
        {Icon && <Icon size={14} color={T.inkDim} strokeWidth={2} />}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
        <div style={{
          fontFamily: FONT_SANS, fontSize: 28, fontWeight: 700,
          color: T.ink, letterSpacing: "-0.03em", lineHeight: 1,
        }}>{value}</div>
        {unit && <div style={{
          fontFamily: FONT_SANS, fontSize: 13, color: T.inkMuted, fontWeight: 500,
        }}>{unit}</div>}
      </div>
      {delta !== undefined && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "2px 8px", borderRadius: 999,
          background: positive ? T.greenSoft : T.redSoft,
          color: positive ? T.green : T.red,
          fontFamily: FONT_MONO, fontSize: 11, fontWeight: 600,
        }}>
          {positive ? <ArrowUpRight size={12} strokeWidth={2.5} /> : <ArrowDownRight size={12} strokeWidth={2.5} />}
          {fmtPct(delta)}
          {deltaLabel && <span style={{ color: T.inkMuted, fontWeight: 400, marginLeft: 2 }}>{deltaLabel}</span>}
        </div>
      )}
      {sparklineData && (
        <div style={{ marginTop: 12, height: 40, margin: "12px -4px -4px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor={color} stopOpacity={0.4}/>
                  <stop offset="100%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#spark-${label})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
