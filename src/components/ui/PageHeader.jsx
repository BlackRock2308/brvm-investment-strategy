import React from "react";
import { T, FONT_SANS, FONT_MONO } from "../../theme";
import useResponsive from "../../hooks/useResponsive";

export default function PageHeader({ eyebrow, title, description }) {
  const { isMobile } = useResponsive();
  return (
    <div style={{ marginBottom: isMobile ? 20 : 28 }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "4px 11px",
        background: T.ochreSoft, borderRadius: 999,
        fontFamily: FONT_MONO, fontSize: 10, color: T.ochreDark,
        fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
        marginBottom: isMobile ? 10 : 14,
      }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.ochre }} />
        {eyebrow}
      </div>
      <div style={{
        fontFamily: FONT_SANS,
        fontSize: isMobile ? 24 : 38,
        fontWeight: 800,
        color: T.ink, letterSpacing: "-0.03em", lineHeight: 1.08, maxWidth: 800,
      }}>{title}</div>
      {description && (
        <div style={{
          fontFamily: FONT_SANS,
          fontSize: isMobile ? 13 : 15,
          color: T.inkMuted,
          marginTop: isMobile ? 8 : 12, maxWidth: 720, lineHeight: 1.55, letterSpacing: "-0.005em",
        }}>{description}</div>
      )}
    </div>
  );
}
