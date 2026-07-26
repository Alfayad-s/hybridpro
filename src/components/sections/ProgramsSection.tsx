"use client";

import {
  Eyebrow,
  FLUORO_GREEN,
  Reveal,
  SectionShell,
  SectionTitle,
} from "./Reveal";

const programs = [
  {
    name: "Hybrid Strength",
    duration: "12 weeks",
    summary:
      "Build raw strength without losing your engine. Heavy compounds paired with intelligent conditioning.",
    points: ["4–5 sessions / week", "Progressive overload blocks", "Mobility built in"],
  },
  {
    name: "Lean Conditioning",
    duration: "8 weeks",
    summary:
      "Strip body fat while keeping hard-earned muscle. Metabolic work, structured cardio, real nutrition targets.",
    points: ["3–4 sessions / week", "Weekly nutrition targets", "Low equipment options"],
  },
  {
    name: "Athlete Prep",
    duration: "16 weeks",
    summary:
      "Sport-specific power, speed and durability for competitors who need to peak on a date.",
    points: ["Periodised to competition", "Speed & power focus", "Recovery protocols"],
  },
];

export default function ProgramsSection() {
  return (
    <SectionShell id="programs">
      <Reveal>
        <Eyebrow>Programs</Eyebrow>
        <SectionTitle>Pick the path that matches your goal.</SectionTitle>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
          Every program is written by a coach, adjusted weekly, and delivered straight
          to your phone.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:mt-16 sm:gap-5 md:grid-cols-3">
        {programs.map((program, i) => (
          <Reveal key={program.name} delay={0.08 * i}>
            <article className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors duration-300 hover:border-white/25 sm:p-7">
              <span
                className="text-xs tracking-[0.3em] uppercase"
                style={{ color: FLUORO_GREEN }}
              >
                {program.duration}
              </span>
              <h3
                className="mt-4 text-3xl leading-none tracking-[0.03em] text-white uppercase sm:text-4xl"
                style={{ fontFamily: "var(--font-bebas), sans-serif" }}
              >
                {program.name}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
                {program.summary}
              </p>
              <ul className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-5">
                {program.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-sm text-white/70"
                  >
                    <span
                      className="mt-[0.45rem] h-1 w-3 shrink-0 rounded-full"
                      style={{ background: FLUORO_GREEN }}
                      aria-hidden
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
