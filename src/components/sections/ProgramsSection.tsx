"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { programImages } from "@/lib/trainerMedia";
import {
  Eyebrow,
  FLUORO_GREEN,
  Reveal,
  SectionTitle,
} from "./Reveal";

const programs = [
  {
    step: "01",
    name: "Strength & Performance",
    duration: "8–12 weeks",
    audience: "Lifters · athletes · busy professionals",
    image: programImages.strength,
    imageAlt: "Athlete performing a heavy deadlift in the gym",
    imagePosition: "top" as const,
    summary:
      "Progressive strength training built around your schedule — heavy compounds, smart recovery, and mobility so you get stronger without breaking down.",
    points: [
      "Progressive overload programming",
      "Mobility & injury prevention",
      "Online or in-person coaching",
    ],
  },
  {
    step: "02",
    name: "Fat Loss System",
    duration: "8–12 weeks",
    audience: "Weight-loss · lifestyle change",
    image: programImages.fatLoss,
    imageAlt: "Client training for sustainable fat loss",
    imagePosition: "bottom" as const,
    summary:
      "Sustainable fat loss without crash diets. Training, nutrition coaching, and habit building that fit real life — so results actually stick.",
    points: [
      "Personalised nutrition targets",
      "Habit architecture that lasts",
      "Weekly check-ins & plan adjustments",
    ],
  },
  {
    step: "03",
    name: "Muscle Development",
    duration: "8–12 weeks",
    audience: "Beginners · physique · postpartum rebuild",
    image: programImages.muscle,
    imageAlt: "Focused muscle-building training session",
    imagePosition: "top" as const,
    summary:
      "Build muscle with purpose — from first confident sessions to advanced hypertrophy — with form coaching and a plan shaped around your body and goals.",
    points: [
      "Hypertrophy-focused sessions",
      "Technique & form reviews",
      "Tailored for your starting point",
    ],
  },
];

function ProgramImage({
  program,
}: {
  program: (typeof programs)[number];
}) {
  return (
    <div className="relative h-full min-h-[200px] w-full overflow-hidden rounded-md sm:min-h-[220px] lg:min-h-[240px]">
      <Image
        src={program.image}
        alt={program.imageAlt}
        fill
        sizes="(max-width: 1024px) 100vw, 480px"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
        aria-hidden
      />
      <span className="absolute bottom-3 left-4 text-[0.65rem] tracking-[0.32em] uppercase text-white/90">
        {program.duration}
      </span>
    </div>
  );
}

export default function ProgramsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.75", "end 0.25"],
  });

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="programs"
      ref={sectionRef}
      data-scroll-hold
      className="relative scroll-mt-24 overflow-visible bg-[var(--background)] px-4 py-20 sm:px-6 sm:py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <Eyebrow>Programs</Eyebrow>
          <SectionTitle>Built around your goal.</SectionTitle>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[color:var(--muted)] sm:text-lg">
            Every Hybrid Pro program is customised to your body, lifestyle, and schedule —
            progressive strength, sustainable fat loss, muscle development, nutrition, and
            habits that last. Online and in person.
          </p>
        </Reveal>

        <div className="relative mt-14 sm:mt-20">
          {/* Scroll tracking line */}
          <div
            className="pointer-events-none absolute top-0 bottom-0 left-0 w-8 sm:w-10 md:w-10 lg:w-14"
            aria-hidden
          >
            <div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-[color:var(--border)]" />
            <motion.div
              className="absolute top-0 left-1/2 w-[2px] -translate-x-1/2 origin-top"
              style={{
                scaleY: lineScale,
                height: "100%",
                background: FLUORO_GREEN,
                boxShadow: "0 0 12px rgba(var(--brand-green-rgb), 0.55)",
              }}
            />
          </div>

          <div className="space-y-12 pl-10 sm:pl-12 md:pl-14 lg:pl-20 lg:space-y-16">
            {programs.map((program, i) => {
              const imageTop = program.imagePosition === "top";

              return (
                <Reveal key={program.name} delay={0.06 * i}>
                  <div className="relative flex gap-4 md:gap-6">
                    {/* Step node on the tracking line */}
                    <div
                      className="absolute -left-10 top-8 flex w-8 items-center justify-center sm:-left-12 sm:w-10 md:-left-14 lg:-left-20 lg:w-14"
                    >
                      <motion.span
                        className="relative z-10 flex h-9 w-9 items-center justify-center rounded-md border text-[0.65rem] font-mono tracking-widest lg:h-10 lg:w-10"
                        style={{
                          borderColor: "var(--border)",
                          background: "var(--background)",
                          color: FLUORO_GREEN,
                        }}
                        initial={false}
                      >
                        {program.step}
                      </motion.span>
                    </div>

                    <article
                      className="group relative flex w-full flex-col overflow-visible bg-transparent lg:flex-row lg:items-stretch"
                    >
                      {imageTop ? (
                        <>
                          {/* Image overflows top — rectangle */}
                          <div
                            className="relative z-20 -mt-4 overflow-visible lg:order-1 lg:-mt-5 lg:w-[42%] lg:shrink-0 lg:-translate-y-6 lg:pl-0"
                          >
                            <div className="shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                              <ProgramImage program={program} />
                            </div>
                          </div>
                          <div className="relative z-10 flex flex-1 flex-col px-0 pt-8 sm:pt-9 lg:order-2 lg:py-4 lg:pr-8 lg:pl-6">
                            <CardBody program={program} />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="relative z-10 flex flex-1 flex-col px-0 pb-8 sm:pb-9 lg:order-1 lg:py-4 lg:pl-8 lg:pr-6">
                            <CardBody program={program} />
                          </div>
                          {/* Image overflows bottom */}
                          <div
                            className="relative z-20 -mb-4 overflow-visible lg:order-2 lg:-mb-5 lg:w-[42%] lg:shrink-0 lg:translate-y-6 lg:pr-0"
                          >
                            <div className="shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                              <ProgramImage program={program} />
                            </div>
                          </div>
                        </>
                      )}
                    </article>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function CardBody({ program }: { program: (typeof programs)[number] }) {
  return (
    <>
      <p
        className="text-[0.65rem] tracking-[0.35em] uppercase sm:text-xs"
        style={{ color: FLUORO_GREEN }}
      >
        Hybrid Pro program
      </p>
      <h3
        className="mt-2 text-3xl leading-none tracking-[0.03em] text-[var(--foreground)] uppercase sm:text-4xl lg:text-[2.75rem]"
        style={{ fontFamily: "var(--font-bebas), sans-serif" }}
      >
        {program.name}
      </h3>
      <p className="mt-2 text-[0.7rem] tracking-[0.14em] text-[color:var(--muted-soft)] uppercase sm:text-xs">
        {program.audience}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)] sm:text-base">
        {program.summary}
      </p>
      <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {program.points.map((point) => (
          <li
            key={point}
            className="flex items-start gap-2.5 text-sm text-[color:var(--muted)]"
          >
            <span
              className="mt-2 h-1 w-3 shrink-0 rounded-sm"
              style={{ background: FLUORO_GREEN }}
              aria-hidden
            />
            {point}
          </li>
        ))}
      </ul>
      <a
        href="#contact"
        className="mt-6 inline-flex w-fit items-center gap-2 rounded-md border border-[color:var(--border)] px-5 py-2.5 text-sm font-semibold transition hover:border-[color:var(--brand-green)] hover:bg-[rgba(var(--brand-green-rgb),0.08)]"
        style={{ color: FLUORO_GREEN }}
      >
        Enquire now
        <span aria-hidden>→</span>
      </a>
    </>
  );
}
