"use client";

import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { Compare } from "@/components/ui/compare";
import { cn } from "@/lib/utils";
import { Eyebrow, Reveal, SectionTitle } from "./Reveal";
import { resultImages } from "@/lib/trainerMedia";

const transformations = [
  {
    id: "client-1",
    before: resultImages.client1.before,
    after: resultImages.client1.after,
  },
  {
    id: "client-2",
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
    <div className="relative h-[380px] w-[260px] shrink-0 overflow-hidden rounded-2xl sm:h-[420px] sm:w-[280px] sm:rounded-3xl md:h-[460px] md:w-[300px]">
      <Compare
        firstImage={client.before}
        secondImage={client.after}
        firstImageClassName="object-cover object-center"
        secondImageClassname="object-cover object-center"
        className="h-full w-full rounded-2xl bg-transparent sm:rounded-3xl"
        slideMode="hover"
        initialSliderPercentage={50}
        showHandlebar
      />
    </div>
  );
}

function ResultsCarousel() {
  const [paused, setPaused] = useState(false);

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
            key={`${client.id}-${i}`}
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
            isDark ? "rgb(4, 18, 0)" : "rgb(210, 255, 140)"
          }
          gradientBackgroundEnd={isDark ? "rgb(8, 28, 2)" : "rgb(180, 255, 90)"}
          firstColor="166, 255, 0"
          secondColor="57, 255, 20"
          thirdColor="204, 255, 0"
          fourthColor="147, 226, 0"
          fifthColor="120, 255, 80"
          pointerColor="166, 255, 0"
          size="90%"
          blendingValue="hard-light"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: isDark
            ? "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.45) 100%)"
            : "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.32) 100%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col">
        <Reveal>
          <Eyebrow>Results</Eyebrow>
          <SectionTitle>Proof, not promises.</SectionTitle>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[color:var(--muted)] sm:mt-4 sm:text-base">
            Real client progress, hover to compare before and after. Hover the
            row to pause.
          </p>
        </Reveal>

        <div className="mt-auto flex min-h-0 flex-1 items-center py-6 sm:py-8">
          <div className="w-full -mx-4 sm:-mx-6 md:mx-0">
            <ResultsCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}
