"use client";

import { Eyebrow, FLUORO_GREEN, Reveal, SectionShell, SectionTitle } from "./Reveal";

export default function ContactSection() {
  return (
    <SectionShell id="contact" className="pb-24 sm:pb-28 md:pb-36">
      <Reveal>
        <Eyebrow>Contact</Eyebrow>
        <SectionTitle>Ready when you are.</SectionTitle>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-[color:var(--muted)] sm:text-lg">
          Tell us your goal and we&apos;ll come back with the plan that fits it. No sales
          call, no pressure.
        </p>
      </Reveal>

      <Reveal delay={0.12}>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href="mailto:hello@hybridpro.fit"
            className="rounded-full px-6 py-3.5 text-center text-sm font-bold text-black transition hover:-translate-y-0.5"
            style={{ background: FLUORO_GREEN }}
          >
            hello@hybridpro.fit
          </a>
          <a
            href="#pricing"
            className="rounded-full border border-[color:var(--border)] px-6 py-3.5 text-center text-sm font-bold text-[var(--foreground)] transition hover:-translate-y-0.5 hover:border-[color:var(--border)]"
          >
            See plans
          </a>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="mt-14 text-xs tracking-[0.3em] text-[color:var(--muted-soft)] uppercase">
          Hybrid Pro — Strength. Focus. Consistency.
        </p>
      </Reveal>
    </SectionShell>
  );
}
