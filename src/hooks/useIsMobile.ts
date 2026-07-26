"use client";

import { useEffect, useState } from "react";

/**
 * True when the viewport matches a phone/tablet max width.
 * Starts as `false` on the server, then syncs after mount to avoid hydration mismatch.
 */
export function useIsMobile(breakpointPx = 1024) {
  const [isMobile, setIsMobile] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);

    const update = () => {
      const coarse =
        window.matchMedia("(hover: none) and (pointer: coarse)").matches;
      const narrow = media.matches;
      setIsMobile(narrow || (coarse && window.innerWidth < breakpointPx));
      setReady(true);
    };

    update();
    media.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, [breakpointPx]);

  return { isMobile, ready };
}
