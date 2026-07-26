"use client";

import {
  Eyebrow,
  FLUORO_GREEN,
  Reveal,
  SectionShell,
  SectionTitle,
} from "./Reveal";

const steps = [
  {
    title: "Assessment",
    body: "We map your training history, injuries, schedule and goal before a single rep is written.",
  },
  {
    title: "Your plan",
    body: "A fully personalised block lands in your app — sessions, loads, tempo and nutrition targets.",
  },
  {
    title: "Weekly check-ins",
    body: "Video form reviews and progress calls. Your coach adjusts the plan while you train.",
  },
  {
    title: "Progress that holds",
    body: "We build habits alongside performance, so results survive holidays, travel and busy weeks.",
  },
];

export default function CoachingSection() {
  return (
    <SectionShell id="coaching">
      <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-16">
        <Reveal>
          <Eyebrow>Coaching</Eyebrow>
          <SectionTitle>Real coaching, not a PDF.</SectionTitle>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
            You get a coach who knows your name, your lifts and your limits — and who
            answers when you message.
          </p>
        </Reveal>

        <ol className="flex flex-col">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={0.06 * i}>
              <li className="flex gap-5 border-t border-white/10 py-6 first:border-t-0 first:pt-0">
                <span
                  className="pt-1 font-mono text-xs tracking-widest"
                  style={{ color: FLUORO_GREEN }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3
                    className="text-2xl leading-none tracking-[0.04em] text-white uppercase sm:text-3xl"
                    style={{ fontFamily: "var(--font-bebas), sans-serif" }}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
                    {step.body}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </SectionShell>
  );
}
