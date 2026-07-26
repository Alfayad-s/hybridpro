"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const FLUORO_GREEN = "#39FF14";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 0.5], [40, 0]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-black"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #000 0%, #0a0a0a 50%, #000 100%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[100vh] min-h-[100dvh] max-w-5xl flex-col justify-center px-5 py-24 sm:px-6 md:px-10 md:py-36">
        <motion.div style={{ y: textY }} className="flex flex-col items-start">
          <motion.p
            className="mb-6 text-xs tracking-[0.45em] uppercase sm:text-sm"
            style={{ color: FLUORO_GREEN }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            About us
          </motion.p>

          <motion.h2
            className="max-w-4xl text-5xl leading-[0.92] tracking-[0.02em] text-white uppercase sm:text-7xl md:text-8xl"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
            initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            Hybrid Pro is built for athletes who refuse average.
          </motion.h2>

          <motion.div
            className="mt-8 h-px w-24"
            style={{ background: FLUORO_GREEN }}
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
          />

          <motion.p
            className="mt-8 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            We blend intelligent coaching, disciplined training, and real accountability
            into one hybrid system — so every session moves you closer to the strongest
            version of yourself.
          </motion.p>

          <motion.p
            className="mt-6 max-w-xl text-sm tracking-[0.2em] text-white/40 uppercase sm:text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.35, duration: 0.8 }}
          >
            Strength. Focus. Consistency.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
