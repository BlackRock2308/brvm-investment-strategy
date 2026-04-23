import React, { useState, useEffect } from "react";
import { T, FONT_SANS, FONT_MONO } from "./theme";
import useResponsive from "./hooks/useResponsive";

import Nav from "./components/ui/Nav";
import OverviewTab from "./components/tabs/OverviewTab";
import DCATab from "./components/tabs/DCATab";
import TargetTab from "./components/tabs/TargetTab";
import DividendTab from "./components/tabs/DividendTab";
import PortfolioTab from "./components/tabs/PortfolioTab";
import StrategyTab from "./components/tabs/StrategyTab";
import RisksTab from "./components/tabs/RisksTab";

const TAB_MAP = {
  overview:  OverviewTab,
  dca:       DCATab,
  target:    TargetTab,
  dividends: DividendTab,
  portfolio: PortfolioTab,
  strategy:  StrategyTab,
  risks:     RisksTab,
};

export default function App() {
  const [tab, setTab] = useState("overview");
  const { isMobile, isTablet } = useResponsive();

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const ActiveTab = TAB_MAP[tab] || OverviewTab;
  const px = isMobile ? 16 : isTablet ? 20 : 28;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        color: T.ink,
        fontFamily: FONT_SANS,
      }}
    >
      <Nav tab={tab} setTab={setTab} />
      <main style={{
        maxWidth: 1440, margin: "0 auto",
        padding: `${isMobile ? 20 : 40}px ${px}px 80px`,
      }}>
        <ActiveTab />
      </main>
      <footer style={{
        maxWidth: 1440, margin: "0 auto",
        padding: `24px ${px}px`,
        borderTop: `1px solid ${T.border}`,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isMobile ? "flex-start" : "center",
        gap: 12,
      }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted }}>
          <strong style={{ color: T.ink }}>Baobab Capital</strong> · BRVM Intelligence Platform
        </div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: T.inkDim }}>
          Sources : BOC BRVM · SikaFinance · FluxBourse · UMOA-Titres · avril 2026
        </div>
      </footer>
    </div>
  );
}
