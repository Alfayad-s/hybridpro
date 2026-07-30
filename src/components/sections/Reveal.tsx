"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export const FLUORO_GREEN = "var(--brand-green)";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay, duration: 0.7, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      className="mb-5 text-[0.7rem] tracking-[0.4em] uppercase sm:text-xs sm:tracking-[0.45em]"
      style={{ color: FLUORO_GREEN }}
    >
      {children}
    </p>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2
      className="max-w-3xl text-4xl leading-[0.95] tracking-[0.02em] text-[var(--foreground)] uppercase sm:text-6xl md:text-7xl"
      style={{ fontFamily: "var(--font-bebas), sans-serif" }}
    >
      {children}
    </h2>
  );
}

export function SectionShell({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      data-scroll-hold
      className={`relative min-h-[100dvh] scroll-mt-24 overflow-hidden bg-[var(--background)] px-5 py-20 sm:px-6 sm:py-24 md:px-10 md:py-32 ${className}`}
    >
      <div className="mx-auto w-full max-w-5xl">{children}</div>
    </section>
  );
}
