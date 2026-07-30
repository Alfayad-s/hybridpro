"use client";

import { useState } from "react";
import {
  Eyebrow,
  FLUORO_GREEN,
  Reveal,
  SectionShell,
  SectionTitle,
} from "./Reveal";

const planOptions = [
  {
    weeks: 4,
    name: "Starter Block",
    blurb: "Build the habit. Clear sessions, simple progressive structure — perfect if you’re just getting going.",
    includes: ["Full 4-week PDF program", "Warm-ups & mobility", "Progression notes"],
    priceLabel: "₹1,999",
  },
  {
    weeks: 8,
    name: "Transform Block",
    blurb: "Enough runway to change how you look and feel — strength, conditioning, and recovery in one system.",
    includes: ["Full 8-week PDF program", "Nutrition guidelines", "Deload week built in"],
    priceLabel: "₹3,499",
  },
  {
    weeks: 12,
    name: "Full System",
    blurb: "The complete Hybrid Pro self-guided system. Periodised training that compounds for lasting results.",
    includes: ["Full 12-week PDF program", "Nutrition + habit guide", "Best value per week"],
    priceLabel: "₹4,999",
    bestValue: true,
  },
] as const;

const ebooks = [
  {
    title: "Nutrition Essentials",
    blurb: "Simple fueling rules that fit real life — no crash diets, no guesswork.",
  },
  {
    title: "Habit Playbook",
    blurb: "The routines behind consistency: sleep, steps, check-ins, and sticking with the plan.",
  },
];

function formatInr(label: string) {
  return label;
}

export default function ShopComingSoonSection() {
  const [weeks, setWeeks] = useState<(typeof planOptions)[number]["weeks"]>(12);
  const selected = planOptions.find((p) => p.weeks === weeks) ?? planOptions[2];
  const isBestValue = selected.weeks === 12;

  return (
    <SectionShell id="shop">
      <Reveal>
        <div className="flex flex-wrap items-center gap-3">
          <Eyebrow>Shop</Eyebrow>
          <span
            className="mb-5 rounded-full px-3 py-1 text-[0.65rem] font-bold tracking-[0.2em] text-black uppercase"
            style={{ background: FLUORO_GREEN }}
          >
            Coming soon
          </span>
        </div>
        <SectionTitle>Training plans &amp; ebooks.</SectionTitle>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[color:var(--muted)] sm:text-lg">
          Self-guided PDFs you buy once and download instantly — separate from live coaching.
          We’re finishing the catalog and checkout. Leave your details in contact to get notified.
        </p>
      </Reveal>

      {/* Training plans — duration switcher */}
      <Reveal delay={0.08}>
        <div className="mt-12 sm:mt-16">
          <p className="text-xs tracking-[0.3em] text-[color:var(--muted-soft)] uppercase">
            Training plans
          </p>

          <div
            className="mt-4 inline-flex rounded-full border border-[color:var(--border)] p-1"
            role="tablist"
            aria-label="Plan duration"
          >
            {planOptions.map((plan) => {
              const active = plan.weeks === weeks;
              return (
                <button
                  key={plan.weeks}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setWeeks(plan.weeks)}
                  className="rounded-full px-4 py-2 text-sm font-medium transition sm:px-5"
                  style={
                    active
                      ? { background: FLUORO_GREEN, color: "#000" }
                      : { color: "var(--muted)" }
                  }
                >
                  {plan.weeks} weeks
                </button>
              );
            })}
          </div>

          <article
            className="mt-6 flex flex-col rounded-2xl border p-6 sm:p-8 md:flex-row md:items-stretch md:gap-10"
            style={{
              borderColor: isBestValue ? FLUORO_GREEN : "var(--border)",
              background: isBestValue
                ? "rgba(var(--brand-green-rgb), 0.1)"
                : "var(--card)",
            }}
          >
            <div className="flex-1">
              {isBestValue && (
                <span
                  className="mb-3 inline-block rounded-full px-3 py-1 text-[0.65rem] font-bold tracking-[0.2em] text-black uppercase"
                  style={{ background: FLUORO_GREEN }}
                >
                  Best value
                </span>
              )}
              <h3
                className="text-3xl leading-none tracking-[0.03em] text-[var(--foreground)] uppercase sm:text-4xl md:text-5xl"
                style={{ fontFamily: "var(--font-bebas), sans-serif" }}
              >
                {selected.name}
              </h3>
              <p className="mt-2 text-xs tracking-[0.25em] uppercase" style={{ color: FLUORO_GREEN }}>
                {selected.weeks}-week PDF · Instant download
              </p>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-[color:var(--muted)] sm:text-base">
                {selected.blurb}
              </p>
              <ul className="mt-6 flex flex-col gap-2">
                {selected.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-[color:var(--muted)]"
                  >
                    <span
                      className="mt-[0.45rem] h-1 w-3 shrink-0 rounded-full"
                      style={{ background: FLUORO_GREEN }}
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-col justify-between border-t border-[color:var(--border)] pt-6 md:mt-0 md:w-52 md:border-t-0 md:border-l md:pt-0 md:pl-10">
              <div>
                <p className="text-xs tracking-[0.2em] text-[color:var(--muted-soft)] uppercase">
                  From
                </p>
                <p className="mt-1 text-4xl font-semibold text-[var(--foreground)] sm:text-5xl">
                  {formatInr(selected.priceLabel)}
                </p>
                <p className="mt-1 text-xs text-[color:var(--muted-soft)]">Placeholder price</p>
              </div>
              <a
                href="#contact"
                className="mt-6 inline-flex items-center justify-center rounded-full px-5 py-3 text-center text-sm font-bold text-black transition hover:-translate-y-0.5"
                style={{ background: FLUORO_GREEN }}
              >
                Notify me
              </a>
            </div>
          </article>
        </div>
      </Reveal>

      {/* Ebooks */}
      <div className="mt-14 sm:mt-16">
        <Reveal>
          <p className="text-xs tracking-[0.3em] text-[color:var(--muted-soft)] uppercase">
            Ebooks
          </p>
        </Reveal>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:gap-5">
          {ebooks.map((book, i) => (
            <Reveal key={book.title} delay={0.06 * i}>
              <article className="flex h-full gap-5 rounded-2xl border border-[color:var(--border)] bg-[var(--card)] p-5 sm:p-6">
                <div
                  className="flex h-28 w-20 shrink-0 flex-col justify-end rounded-lg p-2 sm:h-32 sm:w-24"
                  style={{
                    background: `linear-gradient(160deg, rgba(var(--brand-green-rgb), 0.35), var(--card) 70%)`,
                    border: "1px solid var(--border)",
                  }}
                  aria-hidden
                >
                  <span
                    className="text-[0.55rem] leading-tight tracking-[0.12em] text-[var(--foreground)] uppercase"
                    style={{ fontFamily: "var(--font-bebas), sans-serif" }}
                  >
                    Hybrid Pro
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <h3
                    className="text-2xl leading-none tracking-[0.03em] text-[var(--foreground)] uppercase sm:text-3xl"
                    style={{ fontFamily: "var(--font-bebas), sans-serif" }}
                  >
                    {book.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted)]">
                    {book.blurb}
                  </p>
                  <p
                    className="mt-auto pt-4 text-xs tracking-[0.2em] uppercase"
                    style={{ color: FLUORO_GREEN }}
                  >
                    Coming soon
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal delay={0.1}>
        <p className="mt-10 max-w-xl text-sm text-[color:var(--muted)]">
          Want live coaching instead? See{" "}
          <a href="#pricing" className="underline underline-offset-4 hover:text-[var(--foreground)]">
            coaching pricing
          </a>
          .
        </p>
      </Reveal>
    </SectionShell>
  );
}
