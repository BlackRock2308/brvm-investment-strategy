export const fmtFCFA = (n) => {
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(2) + "Md";
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(0) + "k";
  return Math.round(n).toString();
};

export const fmtFCFAfull = (n) =>
  new Intl.NumberFormat("fr-FR").format(Math.round(n));

export const fmtEUR = (n) => (n / 655.957).toFixed(0);

export const fmtPct = (n) => (n >= 0 ? "+" : "") + n.toFixed(1) + "%";
