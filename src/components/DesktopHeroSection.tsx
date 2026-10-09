"use client";

import Image from "next/image";
import Link from "next/link";
import { trainerPortraits } from "@/lib/trainerMedia";
import { FLUORO_GREEN } from "@/components/sections/Reveal";

/** Large-screen hero: inset rounded card on a light grey canvas. No video. */
export default function DesktopHeroSection() {
  return (
    <section
      className="relative flex flex-col bg-[var(--background)] px-4 pt-3 pb-4 sm:px-6 sm:pb-5 md:px-10 md:pt-4 md:pb-6"
      style={{
        marginTop: "var(--site-nav-height, 4.75rem)",
        height: "calc(100dvh - var(--site-nav-height, 4.75rem))",
        maxHeight: "calc(100dvh - var(--site-nav-height, 4.75rem))",
      }}
      aria-label="Hybrid Pro, welcome"
    >
      <div className="relative isolate flex min-h-0 flex-1 flex-col justify-between overflow-hidden rounded-2xl bg-[#e6e6e8] px-5 py-7 sm:rounded-3xl sm:px-10 sm:py-10 md:px-12 md:py-12 lg:px-14">
        <div className="pointer-events-none absolute inset-y-0 right-8 z-0 flex h-full w-[min(46%,620px)] items-end justify-end">
          <Image
            src={trainerPortraits.light}
            alt="Akash, Hybrid Pro"
            width={769}
            height={1372}
            priority
            loading="eager"
            sizes="46vw"
            className="h-full w-auto max-w-none object-contain object-bottom"
          />
        </div>

        <div className="relative z-10 flex w-full max-w-xl flex-col items-start pt-8 text-left md:pt-10 lg:max-w-2xl">
          <p
            className="text-2xl leading-[0.92] tracking-[0.22em] text-[#111111]/75 uppercase lg:text-4xl"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            Welcome to
          </p>
          <h1
            className="mt-2 text-[clamp(4.5rem,9vw,9.5rem)] leading-[0.86] tracking-[0.04em] uppercase"
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              color: FLUORO_GREEN,
            }}
          >
            Hybrid Pro
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-[#111111]/70 sm:text-base md:text-lg">
            Where ordinary routines end, and real transformation begins.
          </p>
          <Link
            href="#about"
            className="mt-8 inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold text-black transition hover:-translate-y-0.5"
            style={{
              background: FLUORO_GREEN,
              boxShadow: "0 10px 28px rgba(var(--brand-green-rgb), 0.35)",
            }}
          >
            Explore Hybrid Pro
          </Link>
        </div>
      </div>
    </section>
  );
}
