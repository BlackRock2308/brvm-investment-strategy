import React from "react";
import { T, FONT_MONO } from "../../theme";

export default function Pill({ children, color = T.inkMuted, bg }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px",
      background: bg || T.bgSoft,
      color,
      borderRadius: 999,
      fontFamily: FONT_MONO, fontSize: 11, fontWeight: 600,
    }}>{children}</span>
  );
}
