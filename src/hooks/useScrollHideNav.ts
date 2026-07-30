"use client";

import { useEffect, useState } from "react";

/**
 * Hides chrome when scrolling down; shows it again when scrolling up
 * or when near the top of the page.
 */
export function useScrollHideNav({
  topRevealPx = 48,
  deltaPx = 6,
  enabled = true,
}: {
  topRevealPx?: number;
  deltaPx?: number;
  enabled?: boolean;
} = {}) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setHidden(false);
      return;
    }

    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY;

      if (y <= topRevealPx) {
        setHidden(false);
      } else if (delta > deltaPx) {
        setHidden(true);
      } else if (delta < -deltaPx) {
        setHidden(false);
      }

      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [topRevealPx, deltaPx, enabled]);

  return hidden;
}
