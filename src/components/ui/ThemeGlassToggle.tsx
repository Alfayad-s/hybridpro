"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeGlassToggle({ className = "" }: { className?: string }) {
  const { theme, ready, toggleTheme } = useTheme();
  const isDark = theme === "dark";

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
        className={`theme-glass-btn pointer-events-auto group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full ${className}`}
        initial={{ opacity: 0, y: 16, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="theme-glass-btn__fluid" aria-hidden />
        <span className="theme-glass-btn__shine" aria-hidden />

        <AnimatePresence mode="wait" initial={false}>
          {ready && (
            <motion.span
              key={theme}
              className="relative z-10 text-[var(--foreground)]"
              initial={{ opacity: 0, rotate: -40, scale: 0.7, filter: "blur(6px)" }}
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
