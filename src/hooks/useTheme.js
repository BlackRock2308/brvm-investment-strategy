import { useState, useEffect, useCallback } from "react";

// Dark/light theme controller. The `dark` class on <html> drives every
// CSS variable in index.css (and therefore every T.* token). The initial
// class is applied pre-paint by the inline script in index.html.
const STORAGE_KEY = "omaad-theme";

function currentIsDark() {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

// Module-level subscribers so every useTheme() consumer re-renders on toggle.
const listeners = new Set();
function notify() {
  listeners.forEach((fn) => fn());
}

export default function useTheme() {
  const [isDark, setIsDark] = useState(currentIsDark);

  useEffect(() => {
    const sync = () => setIsDark(currentIsDark());
    listeners.add(sync);
    return () => listeners.delete(sync);
  }, []);

  const toggle = useCallback(() => {
    const next = !currentIsDark();
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch (e) { /* ignore */ }
    // theme-color meta for mobile chrome
    const meta = document.querySelector('meta[name="theme-color"]:not([media])')
      || document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", next ? "#14130F" : "#FAF8F4");
    notify();
  }, []);

  return { isDark, toggle };
}
