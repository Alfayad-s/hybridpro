"use client";

import { useEffect, useState } from "react";

function isStandaloneDisplay() {
  if (typeof window === "undefined") return false;
  const mq = window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone =
    "standalone" in window.navigator &&
    Boolean(
      (window.navigator as Navigator & { standalone?: boolean }).standalone,
    );
  return mq || iosStandalone;
}

/**
 * True when the viewport matches a phone/tablet max width.
 * Also flags installed PWA / standalone display for mobile chrome.
 * Starts as `false` on the server, then syncs after mount to avoid hydration mismatch.
 */
export function useIsMobile(breakpointPx = 1024) {
  const [isMobile, setIsMobile] = useState(false);
  const [isPwa, setIsPwa] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    const displayMode = window.matchMedia("(display-mode: standalone)");

    const update = () => {
      const coarse = window.matchMedia(
        "(hover: none) and (pointer: coarse)",
      ).matches;
      const narrow = media.matches;
      const standalone = isStandaloneDisplay();
      setIsPwa(standalone);
      // Phones, coarse pointers, or installed PWA on a compact screen
      setIsMobile(
        narrow ||
          (coarse && window.innerWidth < breakpointPx) ||
          (standalone && window.innerWidth < breakpointPx),
      );
      setReady(true);
    };

    update();
    media.addEventListener("change", update);
    displayMode.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      media.removeEventListener("change", update);
      displayMode.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, [breakpointPx]);

  return { isMobile, isPwa, ready };
}
