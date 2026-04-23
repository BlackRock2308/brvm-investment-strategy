import React from "react";
import { T, FONT_SANS } from "../../theme";

export default function Card({ children, title, subtitle, icon: Icon, action, style, padding = 24 }) {
  return (
    <div style={{
      background: T.bgCard,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      padding,
      boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
      ...style,
    }}>
      {(title || Icon || action) && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 20, gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
            {Icon && (
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: T.blueSoft,
                display: "grid", placeItems: "center", flexShrink: 0,
              }}>
                <Icon size={16} color={T.blue} strokeWidth={2.2} />
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              {title && <div style={{
                fontFamily: FONT_SANS, fontSize: 15, fontWeight: 600,
                color: T.ink, letterSpacing: "-0.01em", lineHeight: 1.2,
              }}>{title}</div>}
              {subtitle && <div style={{
                fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted,
                marginTop: 2, letterSpacing: "-0.005em",
              }}>{subtitle}</div>}
            </div>
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
