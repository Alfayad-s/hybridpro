"use client";

import { useTheme } from "@/components/ThemeProvider";
import { pricingPlans } from "@/lib/pricingPlans";
import Link from "next/link";
import {
  Eyebrow,
  FLUORO_GREEN,
  Reveal,
  SectionShell,
  SectionTitle,
} from "./Reveal";

function CheckIcon() {
  return (
    <span
      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
      style={{ background: FLUORO_GREEN }}
      aria-hidden
    >
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        <path
          d="M2.5 6.2L4.8 8.5L9.5 3.5"
          stroke="#111"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function CrossIcon({ color }: { color: string }) {
  return (
    <span
      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center"
      aria-hidden
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M3 3L9 9M9 3L3 9"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export default function PricingSection() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const accent = FLUORO_GREEN;
  const cardBg = isLight ? "#FFFFFF" : "#2A2A2A";
  const titleColor = isLight ? "#111111" : "#FFFFFF";
  const bodyColor = isLight ? "rgba(17,17,17,0.72)" : "rgba(255,255,255,0.85)";
  const includedColor = isLight ? "#111111" : "#FFFFFF";
  const excludedColor = isLight ? "#9A9A9A" : "#8A8A8A";
  const strikeColor = isLight ? "#B0B0B0" : "#6B6B6B";
  const dividerColor = isLight
    ? "rgba(17,17,17,0.18)"
    : "rgba(255,255,255,0.25)";
  const borderFill = isLight
    ? "rgba(var(--brand-green-rgb), 0.35)"
    : "rgba(var(--brand-green-rgb), 0.22)";
  const ctaBg = isLight ? "#111111" : "#FFFFFF";
  const ctaColor = isLight ? FLUORO_GREEN : "#111111";
  const ctaHover = isLight ? "#222222" : "#f3f3f3";

  return (
    <SectionShell id="pricing">
      <Reveal>
        <Eyebrow>Coaching pricing</Eyebrow>
        <SectionTitle>Live coaching. Cancel anytime.</SectionTitle>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[color:var(--muted)] sm:text-lg">
          Ongoing coaching with Akash, live guidance, accountability, and plans
          shaped around your goals. Secure checkout powered by Pine Labs.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:mt-16 md:grid-cols-3 md:gap-5 lg:gap-6">
        {pricingPlans.map((plan, i) => (
          <Reveal key={plan.id} delay={0.08 * i}>
            <article
              className="relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-[3px]"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  -45deg,
                  ${accent} 0 2px,
                  transparent 2px 5px
                )`,
                backgroundColor: borderFill,
                boxShadow: plan.featured
                  ? `0 18px 50px rgba(var(--brand-green-rgb), ${isLight ? 0.2 : 0.22})`
                  : isLight
                    ? "0 16px 40px rgba(0,0,0,0.08)"
                    : "0 16px 40px rgba(0,0,0,0.18)",
              }}
            >
              <div
                className="relative flex h-full flex-col rounded-[1.6rem] px-6 py-7 sm:px-7 sm:py-8"
                style={{
                  background: cardBg,
                  border: isLight ? "1px solid rgba(0,0,0,0.04)" : undefined,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3
                    className="text-xl font-semibold tracking-tight sm:text-2xl"
                    style={{ color: titleColor }}
                  >
                    {plan.name}
                  </h3>
                  {plan.saveLabel && (
                    <span
                      className="relative -mt-1 -mr-1 shrink-0 rounded-full px-3 py-1.5 text-xs font-bold text-black"
                      style={{ background: accent }}
                    >
                      <span
                        className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-black/80"
                        aria-hidden
                      />
                      {plan.saveLabel}
                    </span>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap items-end gap-x-3 gap-y-1">
                  <span
                    className="text-3xl font-medium line-through decoration-2"
                    style={{
                      color: strikeColor,
                      fontFamily: "var(--font-bebas), sans-serif",
                    }}
                  >
                    {plan.originalPrice}
                  </span>
                  <span
                    className="text-5xl leading-none tracking-[0.02em] sm:text-6xl"
                    style={{
                      color: accent,
                      fontFamily: "var(--font-bebas), sans-serif",
                    }}
                  >
                    {plan.price}
                  </span>
                  <span
                    className="mb-1 text-sm font-medium"
                    style={{ color: accent }}
                  >
                    {plan.cadence}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium" style={{ color: accent }}>
                  {plan.billingNote}
                </p>

                <p
                  className="mt-5 text-sm leading-relaxed"
                  style={{ color: bodyColor }}
                >
                  {plan.blurb}
                </p>

                <div
                  className="mt-6 border-t border-dashed"
                  style={{ borderColor: dividerColor }}
                  aria-hidden
                />

                <ul className="mt-6 flex flex-1 flex-col gap-3.5">
                  {plan.included.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                      style={{ color: includedColor }}
                    >
                      <CheckIcon />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.excluded.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                      style={{ color: excludedColor }}
                    >
                      <CrossIcon color={excludedColor} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/checkout?plan=${plan.id}`}
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3.5 text-center text-sm font-bold transition hover:-translate-y-0.5"
                  style={{ background: ctaBg, color: ctaColor }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = ctaHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = ctaBg;
                  }}
                >
                  {plan.cta}
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
