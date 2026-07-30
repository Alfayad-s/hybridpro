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
    <div className="relative h-[min(58dvh,420px)] w-[min(72vw,280px)] shrink-0 overflow-hidden rounded-2xl sm:h-[min(60dvh,460px)] sm:w-[300px] sm:rounded-3xl md:h-[min(62dvh,500px)] md:w-[340px]">
      <Compare
        firstImage={client.before}
        secondImage={client.after}
        firstImageClassName="object-contain object-center"
        secondImageClassname="object-contain object-center"
        className="h-full w-full rounded-2xl bg-white sm:rounded-3xl"
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
            Real client progress — hover to compare before and after. Hover the
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
