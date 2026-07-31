"use client";

import { FLUORO_GREEN, Reveal, SectionTitle } from "./Reveal";

const planOptions = [
  {
    weeks: 4,
    weeksLabel: "04",
    name: "Starter Block",
    blurb:
      "Build the habit. Clear sessions, simple progressive structure — perfect if you’re just getting going.",
    includes: [
      "Full 4-week PDF program",
      "Warm-ups & mobility",
      "Progression notes",
    ],
    priceLabel: "₹1,999",
    bestValue: false,
  },
  {
    weeks: 8,
    weeksLabel: "08",
    name: "Transform Block",
    blurb:
      "Enough runway to change how you look and feel — strength, conditioning, and recovery in one system.",
    includes: [
      "Full 8-week PDF program",
      "Nutrition guidelines",
      "Deload week built in",
    ],
    priceLabel: "₹3,499",
    bestValue: false,
  },
  {
    weeks: 12,
    weeksLabel: "12",
    name: "Full System",
    blurb:
      "The complete Hybrid Pro self-guided system. Periodised training that compounds for lasting results.",
    includes: [
      "Full 12-week PDF program",
      "Nutrition + habit guide",
      "Best value per week",
    ],
    priceLabel: "₹4,999",
    bestValue: true,
  },
] as const;

const ebooks = [
  {
    title: "Nutrition Essentials",
    blurb:
      "Simple fueling rules that fit real life — no crash diets, no guesswork.",
  },
  {
    title: "Habit Playbook",
    blurb:
      "The routines behind consistency: sleep, steps, check-ins, and sticking with the plan.",
  },
] as const;

export default function ShopComingSoonSection() {
  return (
    <section
      id="shop"
      data-scroll-hold
      className="relative scroll-mt-24 overflow-hidden bg-[var(--background)] px-4 py-20 sm:px-6 sm:py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <p
              className="text-[0.7rem] tracking-[0.4em] uppercase sm:text-xs sm:tracking-[0.45em]"
              style={{ color: FLUORO_GREEN }}
            >
              Shop
            </p>
            <span
              className="rounded-full px-3 py-1 text-[0.65rem] font-bold tracking-[0.2em] text-black uppercase"
              style={{ background: FLUORO_GREEN }}
            >
              Coming soon
            </span>
          </div>
          <SectionTitle>Plans &amp; playbooks.</SectionTitle>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[color:var(--muted)] sm:text-lg">
            Self-guided PDFs you buy once and download instantly — separate from
            live coaching. We’re finishing the catalog and checkout. Leave your
            details in contact to get notified.
          </p>
        </Reveal>

        {/* Training plans — editorial rows */}
        <div className="mt-14 sm:mt-20">
          <Reveal>
            <p className="text-[0.65rem] tracking-[0.35em] text-[color:var(--muted-soft)] uppercase sm:text-xs">
              Training plans
            </p>
          </Reveal>

          <div className="mt-8 flex flex-col gap-16 sm:mt-10 sm:gap-20 lg:gap-24">
            {planOptions.map((plan, i) => {
              const panelLeft = i % 2 === 0;

              return (
                <Reveal key={plan.weeks} delay={0.05 * i}>
                  <article
                    className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16 ${
                      plan.bestValue ? "border-l-2 pl-5 sm:pl-6" : ""
                    }`}
                    style={
                      plan.bestValue
                        ? { borderColor: FLUORO_GREEN }
                        : undefined
                    }
                  >
                    {/* Weeks mark panel */}
                    <div
                      className={`relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[1.5rem] p-6 sm:aspect-[5/6] sm:rounded-[1.75rem] sm:p-8 lg:aspect-[4/5] ${
                        panelLeft ? "lg:order-1" : "lg:order-2"
                      }`}
                      style={{
                        background: plan.bestValue
                          ? "rgba(var(--brand-green-rgb), 0.14)"
                          : "var(--card)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <p
                        className="text-[0.65rem] tracking-[0.3em] uppercase"
                        style={{ color: FLUORO_GREEN }}
                      >
                        {plan.weeks}-week PDF
                      </p>
                      <div>
                        <p
                          className="text-[clamp(4.5rem,18vw,8rem)] leading-none tracking-[0.02em] text-[var(--foreground)]"
                          style={{
                            fontFamily: "var(--font-bebas), sans-serif",
                          }}
                        >
                          {plan.weeksLabel}
                        </p>
                        <p className="mt-2 text-xs tracking-[0.28em] text-[color:var(--muted-soft)] uppercase">
                          Weeks
                        </p>
                      </div>
                      {plan.bestValue && (
                        <span
                          className="absolute top-6 right-6 rounded-full px-3 py-1 text-[0.6rem] font-bold tracking-[0.2em] text-black uppercase sm:top-8 sm:right-8"
                          style={{ background: FLUORO_GREEN }}
                        >
                          Best value
                        </span>
                      )}
                    </div>

                    {/* Copy */}
                    <div
                      className={`flex flex-col ${
                        panelLeft ? "lg:order-2" : "lg:order-1"
                      }`}
                    >
                      <p
                        className="text-[0.65rem] tracking-[0.35em] uppercase sm:text-xs"
                        style={{ color: FLUORO_GREEN }}
                      >
                        Digital download
                      </p>
                      <h3
                        className="mt-3 text-4xl leading-[0.92] tracking-[0.02em] text-[var(--foreground)] uppercase sm:text-5xl md:text-6xl"
                        style={{
                          fontFamily: "var(--font-bebas), sans-serif",
                        }}
                      >
                        {plan.name}
                      </h3>
                      <p className="mt-3 text-[0.7rem] tracking-[0.16em] text-[color:var(--muted-soft)] uppercase sm:text-xs">
                        {plan.weeks}-week self-guided PDF
                      </p>
                      <p className="mt-5 max-w-md text-sm leading-relaxed text-[color:var(--muted)] sm:mt-6 sm:text-base md:text-lg">
                        {plan.blurb}
                      </p>

                      <ul className="mt-6 flex flex-col gap-3 border-t border-[color:var(--border)] pt-6">
                        {plan.includes.map((item, pointIndex) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 text-sm text-[var(--foreground)] sm:text-base"
                          >
                            <span
                              className="mt-0.5 shrink-0 font-mono text-[0.65rem] tracking-widest"
                              style={{ color: FLUORO_GREEN }}
                            >
                              {String(pointIndex + 1).padStart(2, "0")}
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-8 flex flex-wrap items-end gap-6">
                        <div>
                          <p className="text-[0.65rem] tracking-[0.25em] text-[color:var(--muted-soft)] uppercase">
                            From
                          </p>
                          <p
                            className="mt-1 text-4xl leading-none tracking-[0.02em] text-[var(--foreground)] sm:text-5xl"
                            style={{
                              fontFamily: "var(--font-bebas), sans-serif",
                            }}
                          >
                            {plan.priceLabel}
                          </p>
                          <p className="mt-1 text-xs text-[color:var(--muted-soft)]">
                            Placeholder price
                          </p>
                        </div>
                        <a
                          href="#contact"
                          className="inline-flex w-fit items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5"
                          style={{
                            background: FLUORO_GREEN,
                            boxShadow:
                              "0 10px 28px rgba(var(--brand-green-rgb), 0.3)",
                          }}
                        >
                          Notify me
                          <span aria-hidden>→</span>
                        </a>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Ebooks — open list */}
        <div className="mt-16 sm:mt-20">
          <Reveal>
            <p className="text-[0.65rem] tracking-[0.35em] text-[color:var(--muted-soft)] uppercase sm:text-xs">
              Ebooks
            </p>
          </Reveal>

          <ul className="mt-6 flex flex-col">
            {ebooks.map((book, i) => (
              <Reveal key={book.title} delay={0.05 * i}>
                <li className="flex flex-col gap-2 border-t border-[color:var(--border)] py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 sm:py-7">
                  <div className="min-w-0 max-w-xl">
                    <h3
                      className="text-3xl leading-none tracking-[0.02em] text-[var(--foreground)] uppercase sm:text-4xl"
                      style={{ fontFamily: "var(--font-bebas), sans-serif" }}
                    >
                      {book.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted)] sm:text-base">
                      {book.blurb}
                    </p>
                  </div>
                  <p
                    className="shrink-0 text-[0.65rem] tracking-[0.28em] uppercase sm:text-xs"
                    style={{ color: FLUORO_GREEN }}
                  >
                    Coming soon
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal delay={0.08}>
          <p className="mt-12 max-w-xl text-sm text-[color:var(--muted)]">
            Want live coaching instead? See{" "}
            <a
              href="#pricing"
              className="underline underline-offset-4 hover:text-[var(--foreground)]"
            >
              coaching pricing
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
