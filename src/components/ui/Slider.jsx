import React from "react";
import { T, FONT_SANS, FONT_MONO } from "../../theme";
import { fmtFCFAfull } from "../../utils/format";

export default function Slider({ label, value, setValue, min, max, step = 1, suffix, accent = T.blue, format }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <div style={{
          fontFamily: FONT_SANS, fontSize: 13, color: T.inkSoft, fontWeight: 500,
        }}>{label}</div>
        <div style={{
          fontFamily: FONT_MONO, fontSize: 14, fontWeight: 600, color: accent,
        }}>
          {format ? format(value) : (typeof value === "number" && value >= 1000 ? fmtFCFAfull(value) : value)}{suffix}
        </div>
      </div>
      <div style={{ position: "relative", height: 6 }}>
        <div style={{
          position: "absolute", inset: 0,
          background: T.bgSoft, borderRadius: 999,
        }} />
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${accent}, ${accent})`,
          borderRadius: 999,
        }} />
        <input
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={e => setValue(Number(e.target.value))}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            opacity: 0, cursor: "pointer",
          }}
        />
        <div style={{
          position: "absolute", left: `${pct}%`, top: "50%",
          transform: "translate(-50%, -50%)",
          width: 18, height: 18,
          background: "white",
          border: `2px solid ${accent}`,
          borderRadius: "50%",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          pointerEvents: "none",
        }} />
      </div>
      <div style={{
        display: "flex", justifyContent: "space-between", marginTop: 6,
        fontFamily: FONT_MONO, fontSize: 10, color: T.inkDim,
      }}>
        <span>{format ? format(min) : (typeof min === "number" && min >= 1000 ? fmtFCFAfull(min) : min)}{suffix}</span>
        <span>{format ? format(max) : (typeof max === "number" && max >= 1000 ? fmtFCFAfull(max) : max)}{suffix}</span>
      </div>
    </div>
  );
}
