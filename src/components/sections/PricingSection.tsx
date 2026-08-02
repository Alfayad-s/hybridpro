"use client";

import {
  Eyebrow,
  FLUORO_GREEN,
  Reveal,
  SectionShell,
  SectionTitle,
} from "./Reveal";

const plans = [
  {
    name: "Self-guided",
    price: "$49",
    cadence: "per month",
    blurb: "Structured programming you run on your own schedule.",
    features: [
      "Full program library",
      "App-based tracking",
      "Monthly plan refresh",
    ],
    featured: false,
  },
  {
    name: "Hybrid Coaching",
    price: "$149",
    cadence: "per month",
    blurb: "The full system, personalised plan plus a coach in your corner.",
    features: [
      "Custom weekly programming",
      "Video form reviews",
      "Nutrition targets",
      "Direct message support",
    ],
    featured: true,
  },
  {
    name: "1-to-1 Elite",
    price: "$349",
    cadence: "per month",
    blurb: "Limited spots. Deep, high-touch coaching for serious goals.",
    features: [
      "Everything in Hybrid",
      "Weekly video call",
      "Competition prep",
      "24h response time",
    ],
    featured: false,
  },
];

export default function PricingSection() {
  return (
    <SectionShell id="pricing">
      <Reveal>
        <Eyebrow>Coaching pricing</Eyebrow>
        <SectionTitle>Live coaching. Cancel anytime.</SectionTitle>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[color:var(--muted)] sm:text-lg">
          Ongoing coaching with Akash, live guidance, accountability, and plans
          shaped around your goals.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:mt-16 sm:gap-5 md:grid-cols-3">
        {plans.map((plan, i) => (
          <Reveal key={plan.name} delay={0.08 * i}>
            <article
              className="flex h-full flex-col rounded-2xl border p-6 sm:p-7"
              style={{
                borderColor: plan.featured ? FLUORO_GREEN : "var(--border)",
                background: plan.featured
                  ? "rgba(var(--brand-green-rgb), 0.12)"
                  : "var(--card)",
              }}
            >
              {plan.featured && (
                <span
                  className="mb-4 self-start rounded-full px-3 py-1 text-[0.65rem] font-bold tracking-[0.2em] text-black uppercase"
                  style={{ background: FLUORO_GREEN }}
                >
                  Most popular
                </span>
              )}
              <h3
                className="text-3xl leading-none tracking-[0.04em] text-[var(--foreground)] uppercase sm:text-4xl"
                style={{ fontFamily: "var(--font-bebas), sans-serif" }}
              >
                {plan.name}
              </h3>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-semibold text-[var(--foreground)] sm:text-5xl">
                  {plan.price}
                </span>
                <span className="text-xs tracking-[0.2em] text-[color:var(--muted-soft)] uppercase">
                  {plan.cadence}
                </span>
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)]">
                {plan.blurb}
              </p>
              <ul className="mt-6 flex flex-col gap-2 border-t border-[color:var(--border)] pt-5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-[color:var(--muted)]"
                  >
                    <span
                      className="mt-[0.45rem] h-1 w-3 shrink-0 rounded-full"
                      style={{ background: FLUORO_GREEN }}
                      aria-hidden
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="mt-7 inline-block rounded-full px-5 py-3 text-center text-sm font-bold transition hover:-translate-y-0.5"
                style={
                  plan.featured
                    ? { background: FLUORO_GREEN, color: "#000" }
                    : {
                        border: "1px solid var(--border)",
                        color: "var(--foreground)",
                      }
                }
              >
                Start {plan.name}
              </a>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
