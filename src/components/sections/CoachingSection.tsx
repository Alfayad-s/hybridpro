"use client";

import Image from "next/image";
import { trainerPhotos } from "@/lib/trainerMedia";
import { FLUORO_GREEN, Reveal, SectionShell, SectionTitle } from "./Reveal";

const steps = [
  {
    title: "Assessment",
    body: "We map your training history, injuries, schedule and goal before a single rep is written.",
  },
  {
    title: "Your plan",
    body: "A fully personalised block lands in your app, sessions, loads, tempo and nutrition targets.",
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
      <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-12 lg:gap-16">
        <Reveal className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl">
          <Image
            src={trainerPhotos[3].src}
            alt={trainerPhotos[3].alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
            priority={false}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 38%, rgba(0,0,0,0) 62%)",
            }}
            aria-hidden
          />

          <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-8 md:p-9 lg:p-10">
            <p
              className="text-[0.7rem] tracking-[0.4em] uppercase sm:text-xs"
              style={{ color: FLUORO_GREEN }}
            >
              Coaching
            </p>
            <SectionTitle>
              <span className="text-white">Real coaching, not a PDF.</span>
            </SectionTitle>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/75 sm:mt-6 sm:text-lg">
              You get a coach who knows your name, your lifts and your limits,
              and who answers when you message.
            </p>
          </div>
        </Reveal>

        <ol className="flex flex-col justify-center">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={0.06 * i}>
              <li className="flex gap-5 border-t border-[color:var(--border)] py-6 first:border-t-0 first:pt-0">
                <span
                  className="pt-1 font-mono text-xs tracking-widest"
                  style={{ color: FLUORO_GREEN }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3
                    className="text-4xl leading-[0.92] tracking-[0.02em] text-[var(--foreground)] uppercase sm:text-5xl md:text-6xl"
                    style={{ fontFamily: "var(--font-bebas), sans-serif" }}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted)] sm:text-base">
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
