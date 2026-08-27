import React from "react";
import { T, FONT_SANS, FONT_MONO } from "../../theme";
import { fmtFCFAfull } from "../../utils/format";

const defaultFormatter = (v) =>
  typeof v === "number" ? fmtFCFAfull(v) + " FCFA" : v;

export default function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  const fmt = formatter ?? defaultFormatter;
  return (
    <div style={{
      background: "rgba(20, 19, 15, 0.96)",
      border: "1px solid rgba(199, 123, 60, 0.25)",
      borderRadius: 12,
      padding: "10px 14px",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.28)",
      fontFamily: FONT_SANS, fontSize: 12,
      backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
    }}>
      <div style={{ color: "#FAF8F4", fontWeight: 700, marginBottom: 6, fontSize: 12, letterSpacing: "-0.01em" }}>
        {typeof label === "number" ? `Année ${label}` : label}
      </div>
      {payload.map((p, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 8,
          marginBottom: 2, color: "#C2BDB1", fontSize: 11,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color, flexShrink: 0 }} />
          <span>{p.name}:</span>
          <span className="tnum" style={{ color: "#FAF8F4", fontWeight: 600, fontFamily: FONT_MONO, marginLeft: "auto" }}>
            {fmt(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}
