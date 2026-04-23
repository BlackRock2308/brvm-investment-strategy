import React from "react";
import { T, FONT_SANS, FONT_MONO } from "../../theme";
import { fmtFCFAfull } from "../../utils/format";

export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: T.bgCard,
      border: `1px solid ${T.border}`,
      borderRadius: 10,
      padding: "10px 14px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      fontFamily: FONT_SANS, fontSize: 12,
    }}>
      <div style={{ color: T.ink, fontWeight: 600, marginBottom: 6, fontSize: 12 }}>
        {typeof label === "number" ? `Année ${label}` : label}
      </div>
      {payload.map((p, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 8,
          marginBottom: 2, color: T.inkMuted, fontSize: 11,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color, flexShrink: 0 }} />
          <span>{p.name}:</span>
          <span style={{ color: T.ink, fontWeight: 600, fontFamily: FONT_MONO, marginLeft: "auto" }}>
            {typeof p.value === "number" ? fmtFCFAfull(p.value) + " FCFA" : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}
