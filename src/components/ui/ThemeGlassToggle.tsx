"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeGlassToggle({
  className = "",
  /** Hide until this element approaches the viewport (e.g. homepage hero) */
  showAfterSelector,
}: {
  className?: string;
  showAfterSelector?: string;
}) {
  const { theme, ready, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [visible, setVisible] = useState(!showAfterSelector);

  useEffect(() => {
    if (!showAfterSelector) {
      setVisible(true);
      return;
    }

    const update = () => {
      const el = document.querySelector(showAfterSelector);
      if (!el) {
        setVisible(true);
        return;
      }
      // Show once the target is near / past the upper half of the screen
      setVisible(el.getBoundingClientRect().top < window.innerHeight * 0.75);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [showAfterSelector]);

  return (
    <div
      className="pointer-events-none fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 sm:bottom-8"
      style={{
        marginBottom: "max(0px, env(safe-area-inset-bottom, 0px))",
      }}
    >
      <motion.button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        aria-hidden={!visible}
        tabIndex={visible ? 0 : -1}
        className={`theme-glass-btn pointer-events-auto group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full ${className}`}
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          y: visible ? 0 : 16,
          scale: visible ? 1 : 0.92,
          pointerEvents: visible ? "auto" : "none",
        }}
        whileHover={visible ? { scale: 1.06 } : undefined}
        whileTap={visible ? { scale: 0.94 } : undefined}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="theme-glass-btn__fluid" aria-hidden />
        <span className="theme-glass-btn__shine" aria-hidden />

        <AnimatePresence mode="wait" initial={false}>
          {ready && (
            <motion.span
              key={theme}
              className="relative z-10 text-[var(--foreground)]"
              initial={{
                opacity: 0,
                rotate: -40,
                scale: 0.7,
                filter: "blur(6px)",
              }}
              animate={{ opacity: 1, rotate: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, rotate: 40, scale: 0.7, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {isDark ? (
                <IconSun size={22} stroke={1.75} />
              ) : (
                <IconMoon size={22} stroke={1.75} />
              )}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
