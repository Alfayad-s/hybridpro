"use client";

import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { Compare } from "@/components/ui/compare";
import { cn } from "@/lib/utils";
import { Eyebrow, FLUORO_GREEN, Reveal, SectionTitle } from "./Reveal";

import { resultImages } from "@/lib/trainerMedia";

const stats = [
  { value: "1,200+", label: "Athletes coached" },
  { value: "94%", label: "Stay past 6 months" },
  { value: "12 wks", label: "Avg. first transform" },
];

const transformations = [
  {
    name: "Client 01",
    program: "Fat Loss System · 12 weeks",
    before: resultImages.client1.before,
    after: resultImages.client1.after,
  },
  {
    name: "Client 02",
    program: "Strength & Performance · 10 weeks",
    before: resultImages.client2.before,
    after: resultImages.client2.after,
  },
];

function TransformationCard({
  client,
}: {
  client: (typeof transformations)[number];
}) {
  return (
    <article
      className="flex w-[min(78vw,300px)] shrink-0 flex-col sm:w-[320px] md:w-[360px]"
    >
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white p-3 sm:rounded-3xl sm:p-4">
        <div className="mb-3 flex items-center justify-between gap-2 text-[0.6rem] tracking-[0.28em] uppercase sm:text-[0.65rem]">
          <span className="text-black/40">Before</span>
          <span style={{ color: FLUORO_GREEN }}>Hover to compare</span>
          <span className="text-black/40">After</span>
        </div>

        <Compare
          firstImage={client.before}
          secondImage={client.after}
          firstImageClassName="object-cover object-center"
          secondImageClassname="object-cover object-center"
          className="h-[280px] w-full rounded-xl sm:h-[320px] sm:rounded-2xl md:h-[360px]"
          slideMode="hover"
          initialSliderPercentage={50}
          showHandlebar
        />

        <div className="mt-4 text-center">
          <p
            className="text-xl tracking-[0.03em] text-black uppercase sm:text-2xl"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            {client.name}
          </p>
          <p className="mt-1 text-[0.65rem] tracking-[0.2em] text-black/45 uppercase sm:text-xs">
            {client.program}
          </p>
        </div>
      </div>
    </article>
  );
}

function ResultsCarousel() {
  const [paused, setPaused] = useState(false);

  // Triple the set so the track feels full with only 2 unique clients
  const base = [...transformations, ...transformations, ...transformations];
  const loop = [...base, ...base];

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
    >
      <div
        className={cn(
          "gallery-marquee-track flex w-max flex-row items-center gap-5 sm:gap-6 md:gap-8",
          paused && "is-paused",
        )}
        style={{ animationDuration: "42s" }}
      >
        {loop.map((client, i) => (
          <div
            key={`${client.name}-${i}`}
            aria-hidden={i >= base.length ? true : undefined}
          >
            <TransformationCard client={client} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResultsSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      id="results"
      data-scroll-hold
      className="relative flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] scroll-mt-24 flex-col overflow-hidden px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10"
    >
      <div className="absolute inset-0 z-0">
        <BackgroundGradientAnimation
          interactive
          containerClassName="h-full w-full"
          gradientBackgroundStart={
            isDark ? "rgb(0, 0, 0)" : "rgb(232, 245, 200)"
          }
          gradientBackgroundEnd={
            isDark ? "rgb(10, 18, 4)" : "rgb(247, 247, 250)"
          }
          firstColor={isDark ? "166, 255, 0" : "147, 226, 0"}
          secondColor={isDark ? "80, 140, 20" : "120, 180, 40"}
          thirdColor={isDark ? "40, 80, 10" : "200, 230, 120"}
          fourthColor={isDark ? "30, 50, 8" : "180, 200, 100"}
          fifthColor={isDark ? "100, 160, 30" : "100, 150, 40"}
          pointerColor={isDark ? "166, 255, 0" : "147, 226, 0"}
          size="80%"
          blendingValue="hard-light"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: isDark
            ? "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.6) 100%)"
            : "linear-gradient(180deg, rgba(247,247,250,0.72) 0%, rgba(247,247,250,0.45) 50%, rgba(247,247,250,0.75) 100%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col">
        <Reveal>
          <Eyebrow>Results</Eyebrow>
          <SectionTitle>Proof, not promises.</SectionTitle>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[color:var(--muted)] sm:mt-4 sm:text-base">
            Real client progress — hover any card to reveal before and after.
            Hover the row to pause.
          </p>
        </Reveal>

        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 border-y border-[color:var(--border)] py-4 sm:mt-6 sm:gap-x-12 sm:py-5">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p
                className="text-3xl leading-none tracking-[0.02em] uppercase sm:text-4xl md:text-5xl"
                style={{
                  fontFamily: "var(--font-bebas), sans-serif",
                  color: FLUORO_GREEN,
                }}
              >
                {stat.value}
              </p>
              <p className="mt-1 text-[0.65rem] tracking-[0.25em] text-[color:var(--muted-soft)] uppercase sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-auto flex min-h-0 flex-1 items-center py-4 sm:py-6">
          <div className="w-full -mx-4 sm:-mx-6 md:mx-0">
            <ResultsCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}
