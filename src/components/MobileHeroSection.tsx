"use client";

import { brand, trainerPhotos } from "@/lib/trainerMedia";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const BRAND = "var(--brand-green)";
const ease = [0.22, 1, 0.36, 1] as const;

/** Full-bleed static hero for phones, no frame scrub. */
export default function MobileHeroSection({
  isPwa = false,
}: {
  isPwa?: boolean;
}) {
  return (
    <section
      className="relative isolate flex min-h-[100dvh] w-full flex-col overflow-hidden bg-black"
      aria-label="Hybrid Pro, welcome"
      style={{
        paddingBottom: isPwa
          ? "max(2rem, env(safe-area-inset-bottom))"
          : "2rem",
      }}
    >
      <Image
        src={trainerPhotos[2].src}
        alt={trainerPhotos[2].alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_20%]"
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 32%, rgba(0,0,0,0.35) 58%, rgba(0,0,0,0.88) 100%)",
        }}
        aria-hidden
      />

      {/* Heading — top middle */}
      <motion.div
        className="relative z-10 flex w-full flex-col items-center px-5 text-center"
        style={{
          paddingTop: isPwa
            ? "max(5.5rem, calc(env(safe-area-inset-top) + 4rem))"
            : "5.5rem",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease }}
      >
        <motion.img
          src={brand.logoGreyBorder}
          alt="Hybrid Pro"
          draggable={false}
          className="mb-5 h-auto w-[min(36vw,120px)] select-none"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1, ease }}
        />

        <h1
          className="text-[clamp(3.25rem,14vw,4.75rem)] leading-[0.88] tracking-[0.02em] text-white uppercase"
          style={{ fontFamily: "var(--font-bebas), sans-serif" }}
        >
          Train with
          <br />
          <span style={{ color: BRAND }}>purpose.</span>
        </h1>
      </motion.div>

      {/* Supporting copy + CTAs — bottom */}
      <motion.div
        className="relative z-10 mt-auto flex w-full flex-col items-center px-5 text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.15, ease }}
      >
        <p className="max-w-sm text-sm leading-relaxed text-white/70 sm:text-base">
          Strength, fat loss, and habits that last, coaching built around your
          life, not a template.
        </p>

        <div className="mt-7 flex w-full max-w-sm flex-col gap-3">
          <Link
            href="#about"
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-black transition hover:-translate-y-0.5"
            style={{
              background: BRAND,
              boxShadow: "0 10px 28px rgba(var(--brand-green-rgb), 0.35)",
            }}
          >
            Explore Hybrid Pro
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="#contact"
            className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3.5 text-sm font-medium text-white/90 transition hover:border-[color:var(--brand-green)] hover:text-white"
          >
            Take Body Assessment
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
