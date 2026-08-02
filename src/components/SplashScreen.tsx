"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const BRAND = "var(--brand-green)";
const ease = [0.22, 1, 0.36, 1] as const;
const SPLASH_MS = 1800;

/**
 * Splash on every full page load: small green logo on white, then fade out.
 */
export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const duration = reduceMotion ? 400 : SPLASH_MS;

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease }}
          aria-label="Hybrid Pro loading"
          role="status"
        >
          <motion.div
            className="h-auto w-[72px] sm:w-[84px]"
            style={{ aspectRatio: "207 / 151" }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease }}
            aria-label="Hybrid Pro"
            role="img"
          >
            <div
              className="h-full w-full"
              style={{
                background: BRAND,
                WebkitMaskImage: "url(/brand/logo.svg)",
                maskImage: "url(/brand/logo.svg)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
