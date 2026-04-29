import React, { useState, useEffect, useRef } from "react";
import { TrendingUp, TrendingDown, BarChart3, RefreshCw } from "lucide-react";
import { T, FONT_SANS, FONT_MONO } from "../../theme";
import useResponsive from "../../hooks/useResponsive";

function isBrvmOpen() {
  const now = new Date();
  const day = now.getUTCDay();
  const t = now.getUTCHours() * 60 + now.getUTCMinutes();
  return day >= 1 && day <= 5 && t >= 540 && t <= 900;
}

export default function MarketTicker({ endpoint }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);
  const { isMobile, cols } = useResponsive();

  useEffect(() => {
    if (!endpoint) return;

    let mounted = true;

    async function fetchData() {
      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(res.status);
        const json = await res.json();
        if (mounted) { setData(json); setError(false); }
      } catch {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();
    const interval = isBrvmOpen() ? 5 * 60_000 : 30 * 60_000;
    timerRef.current = setInterval(fetchData, interval);
    return () => { mounted = false; clearInterval(timerRef.current); };
  }, [endpoint]);

  if (!endpoint) return null;
  if (loading) return (
    <div style={{
      padding: 20, marginBottom: 16, borderRadius: 12,
      background: T.bgCard, border: `1px solid ${T.border}`,
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <RefreshCw size={14} color={T.inkDim} style={{ animation: "spin 1s linear infinite" }} />
      <span style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted }}>Chargement des données BRVM...</span>
    </div>
  );
  if (error || !data) return (
    <div style={{
      padding: "12px 16px", marginBottom: 16, borderRadius: 10,
      background: T.bgSubtle, border: `1px solid ${T.borderSoft}`,
      fontFamily: FONT_SANS, fontSize: 12, color: T.inkDim,
    }}>
      Données BRVM indisponibles — la mise à jour sera tentée automatiquement.
    </div>
  );

  const { index, top5, flop5, date, marketCap } = data;

  return (
    <div style={{
      marginBottom: 16, borderRadius: 12,
      background: T.bgCard, border: `1px solid ${T.border}`,
      overflow: "hidden",
    }}>
      {/* Header bar with index info */}
      <div style={{
        padding: isMobile ? "10px 14px" : "10px 20px",
        background: T.bgDark, color: T.inkInv,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <BarChart3 size={14} color={T.blue} />
          <span style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: 700 }}>BRVM-CI</span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 700, color: T.inkInv }}>
            {index?.value?.toLocaleString("fr-FR")}
          </span>
          <span style={{
            fontFamily: FONT_MONO, fontSize: 12, fontWeight: 600,
            color: index?.change >= 0 ? T.green : T.red,
          }}>
            {index?.change >= 0 ? "+" : ""}{index?.change?.toFixed(2)} ({index?.changePct?.toFixed(2)}%)
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {marketCap && (
            <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.inkDim }}>
              Cap. {marketCap} XOF
            </span>
          )}
          {index?.ytd != null && (
            <span style={{
              fontFamily: FONT_MONO, fontSize: 10, padding: "2px 8px",
              background: index.ytd >= 0 ? T.green + "22" : T.red + "22",
              color: index.ytd >= 0 ? T.green : T.red,
              borderRadius: 6, fontWeight: 600,
            }}>
              YTD {index.ytd >= 0 ? "+" : ""}{index.ytd}%
            </span>
          )}
          {date && (
            <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.inkDim }}>
              {date}
            </span>
          )}
        </div>
      </div>

      {/* Top 5 / Flop 5 columns */}
      <div style={{
        display: "grid",
        gridTemplateColumns: cols("1fr", "1fr 1fr", "1fr 1fr"),
        gap: 0,
      }}>
        <MoversColumn
          title="Top 5 Hausses"
          icon={TrendingUp}
          items={top5}
          color={T.green}
          bgHeader={T.greenSoft}
          isMobile={isMobile}
        />
        <MoversColumn
          title="Top 5 Baisses"
          icon={TrendingDown}
          items={flop5}
          color={T.red}
          bgHeader={T.redSoft}
          isMobile={isMobile}
          borderLeft
        />
      </div>
    </div>
  );
}

function MoversColumn({ title, icon: Icon, items, color, bgHeader, isMobile, borderLeft }) {
  return (
    <div style={{
      borderLeft: borderLeft && !isMobile ? `1px solid ${T.borderSoft}` : "none",
      borderTop: borderLeft && isMobile ? `1px solid ${T.borderSoft}` : "none",
    }}>
      <div style={{
        padding: isMobile ? "8px 14px" : "8px 20px",
        background: bgHeader,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <Icon size={13} color={color} strokeWidth={2.4} />
        <span style={{
          fontFamily: FONT_SANS, fontSize: 11, fontWeight: 700,
          color, letterSpacing: "0.03em", textTransform: "uppercase",
        }}>{title}</span>
      </div>
      <div style={{ padding: isMobile ? "6px 14px" : "6px 20px" }}>
        {(!items || items.length === 0) ? (
          <div style={{ padding: "12px 0", fontFamily: FONT_SANS, fontSize: 12, color: T.inkDim }}>Aucune donnée</div>
        ) : items.map((item, i) => (
          <div key={item.ticker} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "7px 0",
            borderBottom: i < items.length - 1 ? `1px solid ${T.borderSoft}` : "none",
          }}>
            <span style={{
              fontFamily: FONT_MONO, fontSize: 12, fontWeight: 700,
              color: T.blue, minWidth: 48,
            }}>{item.ticker}</span>
            <span style={{
              fontFamily: FONT_MONO, fontSize: 12, color: T.inkSoft,
              flex: 1, textAlign: "right", marginRight: 12,
            }}>{item.price?.toLocaleString("fr-FR")}</span>
            <span style={{
              fontFamily: FONT_MONO, fontSize: 12, fontWeight: 700,
              color,
              padding: "2px 8px", borderRadius: 6,
              background: color + "14",
              minWidth: 60, textAlign: "right",
            }}>
              {item.changePct >= 0 ? "+" : ""}{item.changePct?.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
