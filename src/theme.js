// ═══════════════════════════════════════════════════════════════════
// OMAAD CAPITAL — Design tokens (Midnight Navy + Savanna Ochre)
// ───────────────────────────────────────────────────────────────────
// Palette + geometry mirror the Omaad Wealth product DNA.
// Colors resolve to CSS custom properties (defined in index.css for
// :root [light] and :root.dark [dark]) so the whole app themes by
// toggling one class — components read T.* and never change.
// Charts can't resolve var() inside SVG attributes, so they use the
// raw-hex chartTokens(isDark) helper below instead.
// ═══════════════════════════════════════════════════════════════════

const v = (name) => `var(--${name})`;

// Alpha helper — CSS vars can't be hex-concatenated, so mix toward
// transparent. `a` is 0..1. Works with var()-based tokens.
export const alpha = (color, a) =>
  `color-mix(in srgb, ${color} ${Math.round(a * 100)}%, transparent)`;

export const T = {
  // Surfaces
  bg:        v("bg"),        // warm paper canvas
  bgSoft:    v("bg-soft"),
  bgCard:    v("bg-card"),
  bgSubtle:  v("bg-subtle"),
  bgDark:    v("bg-dark"),   // deep navy (footers, dark chips)

  // Ink (text)
  ink:       v("ink"),
  inkSoft:   v("ink-soft"),
  inkMuted:  v("ink-muted"),
  inkDim:    v("ink-dim"),
  inkInv:    v("ink-inv"),

  // Brand — Midnight Navy (primary). `blue*` keys kept for API compat.
  blue:      v("brand"),      // brand-700 #1A2740
  blueDark:  v("brand-800"),
  blueSoft:  v("brand-50"),
  indigo:    v("brand-500"),  // gradient partner
  brand50:   v("brand-50"),
  brand100:  v("brand-100"),
  brand300:  v("brand-300"),
  brand400:  v("brand-400"),
  brand500:  v("brand-500"),
  brand700:  v("brand"),
  brand800:  v("brand-800"),
  brand900:  v("brand-900"),
  brand950:  v("brand-950"),

  // Accent — Savanna Ochre (premium moments only)
  ochre:     v("ochre"),      // ochre-500 #C77B3C
  ochreSoft: v("ochre-50"),
  ochreDark: v("ochre-600"),
  ochre300:  v("ochre-300"),
  ochre400:  v("ochre-400"),

  // Semantic data colors
  green:     v("positive"),
  greenSoft: v("positive-50"),
  green400:  v("positive-400"),
  green600:  v("positive-600"),
  neon:      v("ochre"),       // legacy alias → accent
  amber:     v("warning"),
  amberSoft: v("warning-50"),
  red:       v("negative"),
  redSoft:   v("negative-50"),
  red600:    v("negative-600"),

  // Chart series (var form for any DOM usage; charts prefer chartTokens())
  chart1:    v("chart-1"),
  chart2:    v("chart-2"),
  chart3:    v("chart-3"),
  chart4:    v("chart-4"),
  chart5:    v("chart-5"),
  chart6:    v("chart-6"),

  // Lines
  border:    v("border"),
  borderSoft:v("border-soft"),

  // Elevation (warm-tinted; denser in dark)
  shadowRest:     v("shadow-rest"),
  shadowHover:    v("shadow-hover"),
  shadowElevated: v("shadow-elevated"),

  // Gradients (premium moments)
  heroGrad: v("hero-grad"),
  heroGlow: v("hero-glow"),
};

// Geometry — standardized (Omaad): 12 inputs · 16 cards · 20 hero · pill
export const R = {
  input: 12,
  card:  16,
  hero:  20,
  pill:  9999,
};

// Named motion curves — transitions feel intentional & consistent
export const EASE = {
  standard:   "cubic-bezier(0.4, 0, 0.2, 1)",
  emphasized: "cubic-bezier(0.2, 0, 0, 1)",
  decelerate: "cubic-bezier(0, 0, 0.2, 1)",
};

export const FONT_SANS = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
// Numbers/eyebrows stay in Inter with tabular-nums; kept as its own const
// so numeric/eyebrow call-sites remain explicit.
export const FONT_MONO = "'Inter', -apple-system, sans-serif";

// ───────────────────────────────────────────────────────────────────
// Chart tokens — raw hex (var() can't be used in SVG presentation
// attributes). Mirrors Omaad's core/theme/chart-theme.ts.
// ───────────────────────────────────────────────────────────────────
const CHART_LIGHT = {
  text: "#14130F",
  textMuted: "#6E6A60",
  grid: "rgba(20, 19, 15, 0.06)",
  surface: "#FFFFFF",
  primary: "#1A2740",
  primarySoft: "rgba(26, 39, 64, 0.12)",
  accent: "#C77B3C",
  accentSoft: "rgba(199, 123, 60, 0.15)",
  positive: "#2F8F6E",
  negative: "#B0463E",
  warning: "#C68A2E",
  muted: "#C2BDB1",
  categorical: ["#1A2740", "#C77B3C", "#4D5F80", "#D8A369", "#3D3B35", "#6E6A60", "#9C988C", "#C2BDB1"],
  tooltip: { background: "rgba(20, 19, 15, 0.95)", title: "#FAF8F4", body: "#DEDAD0", border: "rgba(199, 123, 60, 0.25)" },
};

const CHART_DARK = {
  text: "#FAF8F4",
  textMuted: "#9C988C",
  grid: "rgba(250, 248, 244, 0.07)",
  surface: "#201E19",
  primary: "#8A98AE",
  primarySoft: "rgba(138, 152, 174, 0.18)",
  accent: "#D8A369",
  accentSoft: "rgba(216, 163, 105, 0.18)",
  positive: "#3FA886",
  negative: "#C2554D",
  warning: "#D49E45",
  muted: "#52504A",
  categorical: ["#8A98AE", "#D8A369", "#B6BFCD", "#EBD0B0", "#C2BDB1", "#9C988C", "#6E6A60", "#52504A"],
  tooltip: { background: "rgba(20, 19, 15, 0.95)", title: "#FAF8F4", body: "#DEDAD0", border: "rgba(216, 163, 105, 0.30)" },
};

export const chartTokens = (isDark = false) => (isDark ? CHART_DARK : CHART_LIGHT);
