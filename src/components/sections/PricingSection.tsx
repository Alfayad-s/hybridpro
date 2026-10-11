"use client";

import { FLUORO_GREEN } from "@/components/sections/Reveal";
import { pricingPlans, type PricingPlan } from "@/lib/pricingPlans";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function checkoutHref(
  planId: string,
  params: { get(name: string): string | null },
) {
  const next = new URLSearchParams();
  next.set("plan", planId);
  for (const key of ["email", "userId", "source"]) {
    const value = params.get(key);
    if (value) next.set(key, value);
  }
  return `/checkout?${next.toString()}`;
}

function Check({ on, light }: { on: boolean; light?: boolean }) {
  return (
    <span
      className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full"
      style={{
        background: on ? (light ? "#fff" : FLUORO_GREEN) : "transparent",
        border: on ? "none" : `1.5px solid ${light ? "rgba(255,255,255,0.28)" : "rgba(17,17,17,0.18)"}`,
        opacity: on ? 1 : 0.55,
      }}
      aria-hidden
    >
      {on ? (
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path
            d="M2.5 6.2L4.8 8.5L9.5 3.5"
            stroke={light ? "#111" : "#111"}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </span>
  );
}

function PlanCard({
  plan,
  href,
  tone,
}: {
  plan: PricingPlan;
  href: string;
  tone: "dark" | "light";
}) {
  const dark = tone === "dark";
  const features = [
    ...plan.included.map((label) => ({ label, on: true })),
    ...plan.excluded.map((label) => ({ label, on: false })),
  ];

  return (
    <article
      className={`flex h-full min-w-0 flex-1 flex-col rounded-[1.6rem] p-6 sm:p-7 ${
        dark
          ? "text-white shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
          : "text-[#111] dark:text-white"
      }`}
      style={
        dark
          ? {
              background:
                "radial-gradient(ellipse at 18% 0%, rgba(255,255,255,0.18), transparent 52%), radial-gradient(ellipse at 80% 110%, rgba(255,255,255,0.08), transparent 46%), #141414",
            }
          : undefined
      }
    >
      <h3 className="text-lg font-semibold tracking-tight">{plan.shortName}</h3>
      <div className="mt-6 flex flex-wrap items-end gap-x-2 gap-y-1">
        {plan.originalPrice !== plan.price ? (
          <span
            className={`text-3xl font-semibold tracking-tight line-through ${
              dark ? "text-white/35" : "text-black/25"
            }`}
          >
            {plan.originalPrice}
          </span>
        ) : null}
        <span className="text-4xl font-extrabold tracking-tight sm:text-[2.6rem]">
          {plan.price}
        </span>
        <span className={`mb-1 text-sm ${dark ? "text-white/55" : "text-black/45"}`}>
          {plan.cadence}
        </span>
      </div>
      <ul className="mt-7 flex flex-1 flex-col gap-3">
        {features.map((feature) => (
          <li
            key={feature.label}
            className={`flex items-start gap-2.5 text-sm leading-snug ${
              feature.on ? "" : dark ? "text-white/35" : "text-black/35"
            }`}
          >
            <Check on={feature.on} light={dark} />
            <span>{feature.label}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`mt-8 inline-flex items-center justify-between rounded-full px-4 py-3 text-sm font-semibold ${
          dark ? "bg-white/12 text-white hover:bg-white/18" : "bg-[#1a1a1a] text-white hover:bg-black"
        }`}
      >
        Get started
        <span aria-hidden>↗</span>
      </Link>
    </article>
  );
}

export default function PricingSection() {
  const params = useSearchParams();
  const favorite = pricingPlans.find((plan) => plan.id === "performance") ?? pricingPlans[0];
  const others = pricingPlans.filter((plan) => plan.id !== favorite.id);

  return (
    <section id="pricing" className="w-full bg-[var(--background)] px-4 pt-28 pb-16 text-[var(--foreground)] sm:px-6 sm:pt-32 lg:px-0 lg:pb-20">
      <div className="mx-auto w-full lg:w-[80%]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--muted)]">
            <span
              className="h-2 w-2 rounded-[2px]"
              style={{ background: FLUORO_GREEN }}
              aria-hidden
            />
            Pricing
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-balance text-[var(--foreground)] sm:text-6xl lg:text-7xl lg:leading-[0.95]">
            Flexible plans for
            <br />
            real coaching.
          </h1>
        </div>

        <div className="mt-12 flex flex-col gap-4 lg:hidden">
          {[favorite, ...others].map((plan) => (
            <div
              key={plan.id}
              className={
                plan.id === favorite.id ? "" : "rounded-[1.6rem] bg-[#f3f3f4] dark:bg-white/6"
              }
            >
              <PlanCard
                plan={plan}
                href={checkoutHref(plan.id, params)}
                tone={plan.id === favorite.id ? "dark" : "light"}
              />
            </div>
          ))}
        </div>

        <div className="mt-14 hidden items-stretch gap-4 lg:flex">
          <div className="w-1/4 shrink-0">
            <PlanCard plan={favorite} href={checkoutHref(favorite.id, params)} tone="dark" />
          </div>
          <div className="flex min-w-0 flex-1 rounded-[1.75rem] bg-[#f3f3f4] dark:bg-white/6">
            {others.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                href={checkoutHref(plan.id, params)}
                tone="light"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
