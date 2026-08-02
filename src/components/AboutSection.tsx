"use client";

import BrandLogo from "@/components/BrandLogo";
import { useTheme } from "@/components/ThemeProvider";
import { trainer } from "@/lib/trainerContent";
import { trainerPortraits } from "@/lib/trainerMedia";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const BRAND = "var(--brand-green)";
const ease = [0.22, 1, 0.36, 1] as const;

/** Mobile / PWA About — stacked portrait + content, safe-area aware */
function AboutSectionMobile({
  isDark,
  trainerSrc,
  isPwa,
}: {
  isDark: boolean;
  trainerSrc: string;
  isPwa: boolean;
}) {
  return (
    <section
      id="about"
      data-scroll-hold
      className="relative isolate flex min-h-[100dvh] scroll-mt-16 flex-col overflow-x-clip bg-[var(--background)] px-4"
      style={{
        paddingTop: isPwa ? "max(4.5rem, env(safe-area-inset-top))" : "4.5rem",
        paddingBottom: isPwa
          ? "max(1.5rem, env(safe-area-inset-bottom))"
          : "1.5rem",
      }}
    >
      <div
        className="pointer-events-none absolute top-[18%] left-0 z-[1] -translate-x-[42%] opacity-90"
        aria-hidden
      >
        <BrandLogo
          className="h-[min(42vh,280px)] w-auto"
          style={{
            color: isDark
              ? "rgba(166, 255, 0, 0.14)"
              : "rgba(17, 17, 17, 0.08)",
          }}
          title=""
        />
      </div>

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease }}
      >
        <div
          className="relative flex flex-1 flex-col overflow-hidden rounded-[1.75rem]"
          style={{ background: isDark ? "#0a0a0a" : "#ececf2" }}
        >
          {/* Portrait band */}
          <div className="relative mx-auto h-[38dvh] min-h-[200px] w-full max-w-[280px] shrink-0">
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={trainerSrc}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease }}
              >
                <Image
                  src={trainerSrc}
                  alt={`${trainer.name}, Founder & CEO of Hybrid Pro`}
                  fill
                  sizes="280px"
                  className="object-contain object-bottom drop-shadow-[0_10px_22px_rgba(0,0,0,0.2)]"
                  priority={false}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col px-5 pb-6 pt-2">
            <p
              className="text-[0.65rem] tracking-[0.4em] uppercase"
              style={{ color: BRAND }}
            >
              About
            </p>
            <h2
              className="mt-2 text-[2.75rem] leading-[0.9] tracking-[0.02em] text-[var(--foreground)] uppercase"
              style={{ fontFamily: "var(--font-bebas), sans-serif" }}
            >
              {trainer.name}
            </h2>
            <p
              className="mt-2 text-xs tracking-[0.14em] uppercase"
              style={{ color: BRAND }}
            >
              {trainer.role}
            </p>
            <p className="mt-1 text-[0.7rem] tracking-[0.1em] text-[color:var(--muted)] uppercase">
              {trainer.credentials}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)]">
              {trainer.teaser}
            </p>
            <p className="mt-3 text-sm font-medium leading-relaxed text-[var(--foreground)]">
              {trainer.teaserLine}
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/about"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full px-6 text-sm font-semibold text-black transition active:scale-[0.98]"
                style={{
                  background: BRAND,
                  boxShadow: "0 10px 28px rgba(var(--brand-green-rgb), 0.35)",
                }}
              >
                More about Akash
              </Link>
              <a
                href="#contact"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[color:var(--border)] px-6 text-sm font-medium text-[var(--foreground)] transition active:scale-[0.98]"
              >
                Start training
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/** Desktop About — unchanged layout */
function AboutSectionDesktop({
  isDark,
  trainerSrc,
}: {
  isDark: boolean;
  trainerSrc: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 0.45], [28, 0]);
  const imageY = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const logoY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      id="about"
      ref={sectionRef}
      data-scroll-hold
      className="relative isolate flex h-[100vh] h-[100dvh] items-center justify-center overflow-x-clip bg-[var(--background)] px-3 sm:px-5 md:px-8"
    >
      <div
        className="pointer-events-none absolute top-1/2 left-0 z-[1] -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      >
        <motion.div
          style={{ y: logoY }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease }}
        >
          <BrandLogo
            className="h-[min(78vh,640px)] w-auto sm:h-[min(82vh,720px)] md:h-[min(88vh,820px)]"
            style={{
              color: isDark
                ? "rgba(166, 255, 0, 0.16)"
                : "rgba(17, 17, 17, 0.09)",
            }}
            title=""
          />
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center">
        <div className="relative w-full pt-14 sm:pt-16 md:pt-20">
          <motion.div
            className="relative flex min-h-[46dvh] w-full overflow-visible rounded-[2rem] sm:min-h-[50dvh] sm:rounded-[2.5rem] md:min-h-[54dvh] md:rounded-[2.75rem]"
            style={{
              background: isDark ? "#0a0a0a" : "#ececf2",
            }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease }}
          >
            <div
              className="pointer-events-none absolute inset-0 -z-0 overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[2.75rem]"
              aria-hidden
            />

            <motion.div
              style={{ y: imageY }}
              className="pointer-events-none absolute bottom-0 left-2 z-20 hidden h-[calc(100%+4.5rem)] w-[min(40%,420px)] lg:block"
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, ease }}
            >
              <AnimatePresence mode="sync" initial={false}>
                <motion.div
                  key={trainerSrc}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease }}
                >
                  <Image
                    src={trainerSrc}
                    alt={`${trainer.name}, Founder & CEO of Hybrid Pro`}
                    fill
                    sizes="38vw"
                    className="object-contain object-bottom drop-shadow-[0_12px_28px_rgba(0,0,0,0.22)]"
                    priority={false}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.div
              style={{ y: textY }}
              className="relative z-10 ml-auto flex w-full max-w-xl flex-col justify-center py-8 pr-6 pl-10 sm:max-w-2xl sm:py-10 sm:pr-10 md:pr-14 md:py-12 lg:w-[58%] lg:max-w-none lg:pr-14 xl:pr-16"
            >
              <motion.p
                className="mb-4 text-[0.7rem] tracking-[0.4em] uppercase sm:text-xs"
                style={{ color: BRAND }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, ease }}
              >
                About
              </motion.p>

              <motion.h2
                className="text-5xl leading-[0.9] tracking-[0.02em] text-[var(--foreground)] uppercase sm:text-6xl md:text-7xl lg:text-8xl"
                style={{ fontFamily: "var(--font-bebas), sans-serif" }}
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.85, ease }}
              >
                {trainer.name}
              </motion.h2>

              <motion.p
                className="mt-3 text-sm tracking-[0.18em] uppercase sm:text-base"
                style={{ color: BRAND }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.08, duration: 0.65, ease }}
              >
                {trainer.role}
              </motion.p>

              <motion.p
                className="mt-2 text-xs tracking-[0.12em] text-[color:var(--muted)] uppercase sm:text-sm"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.1, duration: 0.6, ease }}
              >
                {trainer.credentials}
              </motion.p>

              <motion.p
                className="mt-5 text-sm leading-relaxed text-[color:var(--muted)] sm:mt-6 sm:text-base md:text-lg"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ delay: 0.14, duration: 0.7, ease }}
              >
                {trainer.teaser}
              </motion.p>

              <motion.p
                className="mt-4 max-w-md text-sm font-medium leading-relaxed text-[var(--foreground)] sm:text-base"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ delay: 0.2, duration: 0.65, ease }}
              >
                {trainer.teaserLine}
              </motion.p>

              <motion.div
                className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10 sm:gap-4"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.28, duration: 0.65, ease }}
              >
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold text-black transition hover:-translate-y-0.5"
                  style={{
                    background: BRAND,
                    boxShadow: "0 10px 28px rgba(var(--brand-green-rgb), 0.35)",
                  }}
                >
                  More about Akash
                </Link>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] px-6 py-3.5 text-sm font-medium text-[var(--foreground)] transition hover:border-[color:var(--brand-green)]"
                >
                  Start training
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function AboutSection() {
  const { theme } = useTheme();
  const { isMobile, isPwa, ready } = useIsMobile(1024);
  const isDark = theme === "dark";
  const trainerSrc = isDark ? trainerPortraits.dark : trainerPortraits.light;

  // Avoid flash: wait for client detection before choosing layout
  if (!ready) {
    return (
      <section
        id="about"
        className="min-h-[100dvh] bg-[var(--background)]"
        aria-hidden
      />
    );
  }

  if (isMobile) {
    return (
      <AboutSectionMobile
        isDark={isDark}
        trainerSrc={trainerSrc}
        isPwa={isPwa}
      />
    );
  }

  return <AboutSectionDesktop isDark={isDark} trainerSrc={trainerSrc} />;
}
