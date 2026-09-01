import { useState, useEffect } from 'react';

export function useCountdown(target) {
  const [t, setT] = useState(() => Math.max(0, target - new Date()));

  useEffect(() => {
    const id = setInterval(() => setT(Math.max(0, target - new Date())), 1000);
    return () => clearInterval(id);
  }, [target]);

  const s = Math.floor(t / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}
