import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "omaad-privacy";

const listeners = new Set();
function notify() {
  listeners.forEach((fn) => fn());
}

let _private = false;
try {
  _private = localStorage.getItem(STORAGE_KEY) === "true";
} catch (e) { /* ignore */ }

export default function usePrivacy() {
  const [isPrivate, setIsPrivate] = useState(_private);

  useEffect(() => {
    const sync = () => setIsPrivate(_private);
    listeners.add(sync);
    return () => listeners.delete(sync);
  }, []);

  const toggle = useCallback(() => {
    _private = !_private;
    try {
      localStorage.setItem(STORAGE_KEY, String(_private));
    } catch (e) { /* ignore */ }
    notify();
  }, []);

  return { isPrivate, toggle };
}
