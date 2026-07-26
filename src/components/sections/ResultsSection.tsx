"use client";

import {
  Eyebrow,
  FLUORO_GREEN,
  Reveal,
  SectionShell,
  SectionTitle,
} from "./Reveal";

const stats = [
  { value: "1,200+", label: "Athletes coached" },
  { value: "94%", label: "Stay past 6 months" },
  { value: "12 wks", label: "Average first transformation" },
];

const testimonials = [
  {
    quote:
      "I added 40kg to my squat and still cut 8kg. First time training has actually felt sustainable.",
    name: "Marcus D.",
    detail: "Hybrid Strength, 16 weeks",
  },
  {
    quote:
      "The weekly check-ins are the difference. I stopped guessing and started progressing.",
    name: "Priya S.",
    detail: "Lean Conditioning, 8 weeks",
  },
];

export default function ResultsSection() {
  return (
    <SectionShell id="results">
      <Reveal>
        <Eyebrow>Results</Eyebrow>
        <SectionTitle>Proof, not promises.</SectionTitle>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-6 border-y border-white/10 py-8 sm:grid-cols-3 sm:gap-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={0.07 * i}>
            <div>
              <p
                className="text-5xl leading-none tracking-[0.02em] uppercase sm:text-6xl"
                style={{
                  fontFamily: "var(--font-bebas), sans-serif",
                  color: FLUORO_GREEN,
                }}
              >
                {stat.value}
              </p>
              <p className="mt-2 text-xs tracking-[0.25em] text-white/45 uppercase">
                {stat.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:gap-5 md:grid-cols-2">
        {testimonials.map((testimonial, i) => (
          <Reveal key={testimonial.name} delay={0.08 * i}>
            <figure className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-7">
              <blockquote className="text-lg leading-relaxed text-white/80 sm:text-xl">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-6 text-xs tracking-[0.25em] text-white/40 uppercase">
                {testimonial.name} — {testimonial.detail}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
