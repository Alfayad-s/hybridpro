"use client";

import Image from "next/image";
import Link from "next/link";
import { trainerPortraits } from "@/lib/trainerMedia";
import { FLUORO_GREEN, Reveal } from "./Reveal";

function HybridProMark({ className }: { className?: string }) {
  return (
    <p
      className={className}
      style={{ fontFamily: "var(--font-bebas), sans-serif" }}
      aria-label="Hybrid Pro"
    >
      {"HYBRIDPRO".split("").map((letter, i) => (
        <span
          key={`${letter}-${i}`}
          className="cursor-default transition-colors duration-200 hover:text-[color:var(--brand-green)]"
        >
          {letter}
        </span>
      ))}
    </p>
  );
}

export default function FooterSection() {
  return (
    <footer
      className="relative flex min-h-[100dvh] flex-col bg-[var(--background)] px-4 pt-4 sm:px-6 sm:pt-5 md:h-[100dvh] md:max-h-[100dvh] md:px-10 md:py-6"
      style={{
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
    >
      <Reveal className="relative isolate flex min-h-[min(88dvh,720px)] flex-1 flex-col justify-between overflow-hidden rounded-2xl bg-[#ded8d7] px-5 py-7 sm:rounded-3xl sm:px-10 sm:py-10 md:min-h-0 md:px-12 md:py-12 lg:px-14">
        {/* Mobile: full-width HYBRIDPRO behind the portrait, at head height */}
        <HybridProMark className="pointer-events-none absolute inset-x-3 top-[46%] z-[1] flex w-[calc(100%-1.5rem)] justify-between text-[clamp(3.25rem,17vw,5.5rem)] leading-[0.7] tracking-[-0.04em] text-[#111111] uppercase select-none md:hidden" />

        {/* Portrait — in front of brand text on mobile; right rail on desktop */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex h-[58%] items-end justify-center sm:h-[60%] md:inset-y-0 md:right-8 md:left-auto md:z-0 md:h-full md:w-[min(48%,640px)] md:justify-end">
          <Image
            src={trainerPortraits.footer}
            alt="Akash, Hybrid Pro"
            width={1023}
            height={1537}
            sizes="(max-width: 768px) 90vw, 48vw"
            className="h-full w-auto max-w-[min(100%,440px)] object-contain object-bottom md:max-w-none"
            priority={false}
          />
        </div>

        {/* Soft fade under top copy only */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-[36%] md:hidden"
          style={{
            background:
              "linear-gradient(to bottom, #ded8d7 55%, rgba(222,216,215,0) 100%)",
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center pt-10 text-center sm:pt-12 md:mx-0 md:items-start md:pt-10 md:text-left">
          <h2
            className="text-[clamp(2.4rem,9vw,5.5rem)] leading-[0.92] tracking-[0.02em] text-[#111111] uppercase"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            Real coaching.
            <br />
            Real progress.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#111111]/70 sm:mt-5 sm:text-base md:text-lg">
            Book a personal coaching session and start training with a plan
            built around your life, online or in person.
          </p>
          {/* Desktop CTA under copy */}
          <Link
            href="#contact"
            className="mt-8 hidden items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold text-black transition hover:-translate-y-0.5 md:inline-flex"
            style={{
              background: FLUORO_GREEN,
              boxShadow: "0 10px 28px rgba(var(--brand-green-rgb), 0.35)",
            }}
          >
            Start your fitness journey
          </Link>
        </div>

        {/* Mobile CTA — bottom center of canvas */}
        <div className="absolute inset-x-0 bottom-5 z-20 flex justify-center px-5 md:hidden">
          <Link
            href="#contact"
            className="inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold text-black transition hover:-translate-y-0.5"
            style={{
              background: FLUORO_GREEN,
              boxShadow: "0 10px 28px rgba(var(--brand-green-rgb), 0.35)",
            }}
          >
            Start your fitness journey
          </Link>
        </div>

        {/* Desktop brand mark — left bottom, clear of portrait */}
        <HybridProMark className="relative z-10 mt-auto hidden w-[min(58%,64rem)] flex-nowrap items-end overflow-hidden pt-4 text-left text-[clamp(8rem,17vw,20rem)] leading-[0.72] tracking-[-0.03em] text-[#111111] uppercase select-none md:flex lg:text-[clamp(9rem,16vw,22rem)]" />
      </Reveal>

      <div className="mx-auto flex w-full max-w-6xl shrink-0 flex-col items-center gap-2 px-1 pt-4 text-center text-[0.65rem] tracking-[0.18em] text-[color:var(--muted-soft)] uppercase md:flex-row md:items-center md:justify-between md:gap-3 md:text-left md:tracking-[0.22em]">
        <span>© {new Date().getFullYear()} Hybrid Pro</span>
        <a
          href="mailto:hello@hybridpro.fit"
          className="transition hover:text-[var(--foreground)]"
        >
          hello@hybridpro.fit
        </a>
      </div>
    </footer>
  );
}
