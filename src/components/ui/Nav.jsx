import React from "react";
import {
  TrendingUp, Target, Coins, Briefcase, ShieldAlert,
  Sparkles, BookOpen, Gauge,
} from "lucide-react";
import { T, FONT_SANS, FONT_MONO } from "../../theme";
import useResponsive from "../../hooks/useResponsive";

const TABS = [
  { id: "overview",  label: "Aperçu",        icon: Gauge },
  { id: "dca",       label: "DCA",            icon: TrendingUp },
  { id: "target",    label: "Cible",          icon: Target },
  { id: "dividends", label: "Dividendes",     icon: Coins },
  { id: "portfolio", label: "Allocation",     icon: Briefcase },
  { id: "strategy",  label: "Playbook",       icon: BookOpen },
  { id: "risks",     label: "Risques",        icon: ShieldAlert },
];

export default function Nav({ tab, setTab }) {
  const { isMobile, isTablet } = useResponsive();
  const compact = isMobile || isTablet;

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(250, 250, 251, 0.85)",
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      borderBottom: `1px solid ${T.border}`,
    }}>
      <div style={{
        maxWidth: 1440, margin: "0 auto",
        padding: isMobile ? "10px 16px" : "14px 28px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        gap: isMobile ? 10 : 24,
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: isMobile ? 30 : 36, height: isMobile ? 30 : 36, borderRadius: 10,
            background: `linear-gradient(135deg, ${T.blue} 0%, ${T.indigo} 100%)`,
            display: "grid", placeItems: "center",
            boxShadow: `0 4px 12px rgba(37, 99, 235, 0.25)`,
          }}>
            <Sparkles size={isMobile ? 14 : 18} color="white" strokeWidth={2.2} />
          </div>
          <div>
            <div style={{
              fontFamily: FONT_SANS, fontSize: isMobile ? 14 : 17, fontWeight: 700,
              color: T.ink, letterSpacing: "-0.02em", lineHeight: 1,
            }}>Omaad Capital</div>
            {!isMobile && (
              <div style={{
                fontFamily: FONT_MONO, fontSize: 10, color: T.inkMuted,
                marginTop: 3, letterSpacing: "0.05em",
              }}>Omaad Intelligence · v2026.1</div>
            )}
          </div>
        </div>

        {!isMobile && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "6px 12px",
            background: T.greenSoft, borderRadius: 999,
            fontFamily: FONT_SANS, fontSize: 12, color: T.green, fontWeight: 600,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.green, boxShadow: `0 0 0 3px ${T.greenSoft}` }} />
            BRVM ouverte
          </div>
        )}
      </div>

      {/* Tabs bar — scrollable on mobile */}
      <div style={{
        maxWidth: 1440, margin: "0 auto",
        padding: isMobile ? "0 12px 10px" : "0 28px 10px",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
      }}>
        <div style={{
          display: "inline-flex", gap: 2,
          background: T.bgSoft, padding: 4, borderRadius: 10,
          border: `1px solid ${T.border}`,
          minWidth: compact ? "max-content" : undefined,
        }}>
          {TABS.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  display: "flex", alignItems: "center", gap: compact ? 5 : 7,
                  padding: compact ? "7px 10px" : "8px 14px",
                  border: "none", borderRadius: 8,
                  background: active ? T.bgCard : "transparent",
                  color: active ? T.ink : T.inkMuted,
                  fontFamily: FONT_SANS,
                  fontSize: compact ? 12 : 13,
                  fontWeight: active ? 600 : 500,
                  cursor: "pointer", transition: "all 0.15s",
                  boxShadow: active ? "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)" : "none",
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = T.ink; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = T.inkMuted; }}
              >
                <Icon size={compact ? 13 : 14} strokeWidth={2.2} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
