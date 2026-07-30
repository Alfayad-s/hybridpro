"use client";

import Image from "next/image";
import { programImages } from "@/lib/trainerMedia";
import { Eyebrow, FLUORO_GREEN, Reveal, SectionTitle } from "./Reveal";

const programs = [
  {
    step: "01",
    name: "Strength & Performance",
    duration: "8–12 weeks",
    audience: "Lifters · athletes · busy professionals",
    image: programImages.strength,
    imageAlt: "Athlete performing a heavy deadlift in the gym",
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
    summary:
      "Build muscle with purpose — from first confident sessions to advanced hypertrophy — with form coaching and a plan shaped around your body and goals.",
    points: [
      "Hypertrophy-focused sessions",
      "Technique & form reviews",
      "Tailored for your starting point",
    ],
  },
] as const;

export default function ProgramsSection() {
  return (
    <section
      id="programs"
      data-scroll-hold
      className="relative scroll-mt-24 overflow-hidden bg-[var(--background)] px-4 py-20 sm:px-6 sm:py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <Eyebrow>Programs</Eyebrow>
          <SectionTitle>Built around your goal.</SectionTitle>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[color:var(--muted)] sm:text-lg">
            Three Hybrid Pro pathways — customised to your body, lifestyle, and
            schedule. Online and in person.
          </p>
        </Reveal>

        <div className="mt-14 flex flex-col gap-16 sm:mt-20 sm:gap-20 lg:gap-24">
          {programs.map((program, i) => {
            const imageLeft = i % 2 === 0;

            return (
              <Reveal key={program.name} delay={0.05 * i}>
                <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
                  {/* Image */}
                  <div
                    className={`relative aspect-[4/5] overflow-hidden rounded-[1.5rem] sm:aspect-[5/6] sm:rounded-[1.75rem] lg:aspect-[4/5] ${
                      imageLeft ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <Image
                      src={program.image}
                      alt={program.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition duration-700 hover:scale-[1.03]"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
                      aria-hidden
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 sm:p-6">
                      <span
                        className="font-mono text-xs tracking-[0.35em] text-white/90"
                        style={{ color: FLUORO_GREEN }}
                      >
                        {program.step}
                      </span>
                      <span className="text-[0.65rem] tracking-[0.28em] text-white/85 uppercase sm:text-xs">
                        {program.duration}
                      </span>
                    </div>
                  </div>

                  {/* Copy */}
                  <div
                    className={`flex flex-col ${
                      imageLeft ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <p
                      className="text-[0.65rem] tracking-[0.35em] uppercase sm:text-xs"
                      style={{ color: FLUORO_GREEN }}
                    >
                      Hybrid Pro program
                    </p>
                    <h3
                      className="mt-3 text-4xl leading-[0.92] tracking-[0.02em] text-[var(--foreground)] uppercase sm:text-5xl md:text-6xl"
                      style={{ fontFamily: "var(--font-bebas), sans-serif" }}
                    >
                      {program.name}
                    </h3>
                    <p className="mt-3 text-[0.7rem] tracking-[0.16em] text-[color:var(--muted-soft)] uppercase sm:text-xs">
                      {program.audience}
                    </p>
                    <p className="mt-5 max-w-md text-sm leading-relaxed text-[color:var(--muted)] sm:mt-6 sm:text-base md:text-lg">
                      {program.summary}
                    </p>

                    <ul className="mt-6 flex flex-col gap-3 border-t border-[color:var(--border)] pt-6">
                      {program.points.map((point, pointIndex) => (
                        <li
                          key={point}
                          className="flex items-start gap-3 text-sm text-[var(--foreground)] sm:text-base"
                        >
                          <span
                            className="mt-0.5 shrink-0 font-mono text-[0.65rem] tracking-widest"
                            style={{ color: FLUORO_GREEN }}
                          >
                            {String(pointIndex + 1).padStart(2, "0")}
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>

                    <a
                      href="#contact"
                      className="mt-8 inline-flex w-fit items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5"
                      style={{
                        background: FLUORO_GREEN,
                        boxShadow:
                          "0 10px 28px rgba(var(--brand-green-rgb), 0.3)",
                      }}
                    >
                      Start this program
                      <span aria-hidden>→</span>
                    </a>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
