import { FLUORO_GREEN } from "@/components/sections/Reveal";
import { pricingPlans, type PricingPlan } from "@/lib/pricingPlans";
import { IconCrownFilled } from "@tabler/icons-react";

const GOLD = "#e8c56a";
const GOLD_DEEP = "#8a6420";

function Check({ on, light, gold }: { on: boolean; light?: boolean; gold?: boolean }) {
  return (
    <span
      className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full"
      style={{
        background: on
          ? gold
            ? "linear-gradient(180deg, #f8e7a8 0%, #e0b44a 55%, #c4922a 100%)"
            : light
              ? "#fff"
              : FLUORO_GREEN
          : "transparent",
        border: on
          ? "none"
          : `1.5px solid ${light || gold ? "rgba(255,255,255,0.28)" : "rgba(17,17,17,0.18)"}`,
        opacity: on ? 1 : 0.55,
      }}
      aria-hidden
    >
      {on ? (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path
            d="M2.5 6.2L4.8 8.5L9.5 3.5"
            stroke={gold ? "#1a1208" : "#111"}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </span>
  );
}

function CrownBadge() {
  return (
    <span
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full shadow-[0_6px_16px_rgba(180,130,30,0.35)]"
      style={{
        background: "linear-gradient(180deg, #f8e7a8 0%, #e8c56a 42%, #c4922a 100%)",
      }}
      aria-hidden
    >
      <IconCrownFilled size={22} className="text-[#1a1208]" aria-hidden />
    </span>
  );
}

function HyroxMark() {
  return (
    <div className="flex flex-col items-end gap-1" aria-hidden>
      <svg width="52" height="28" viewBox="0 0 52 28">
        <g transform="skewX(-22)">
          <rect x="6" y="1" width="34" height="5" fill="var(--brand-green)" />
          <rect x="12" y="11" width="34" height="5" fill="var(--brand-green)" />
          <rect x="18" y="21" width="34" height="5" fill="var(--brand-green)" />
        </g>
      </svg>
      <span className="text-[10px] font-bold tracking-[0.32em] text-white">HYROX</span>
    </div>
  );
}

function PlanCard({
  plan,
  tone,
  recommended = false,
}: {
  plan: PricingPlan;
  tone: "dark" | "light" | "elite" | "hyrox";
  recommended?: boolean;
}) {
  const elite = tone === "elite";
  const hyrox = tone === "hyrox";
  const dark = tone === "dark" || elite || hyrox;
  const features = [
    ...plan.included.map((label) => ({ label, on: true })),
    ...plan.excluded.map((label) => ({ label, on: false })),
  ];

  return (
    <article
      className={`relative flex h-full min-w-0 flex-1 flex-col rounded-[1.7rem] p-6 sm:p-6 lg:p-7 ${
        elite
          ? "border-2 text-white shadow-[0_22px_50px_rgba(160,120,30,0.28)]"
          : hyrox
            ? "border-2 text-white shadow-[0_22px_50px_rgba(0,0,0,0.35)]"
            : recommended
              ? "border-2 border-[color:var(--brand-green)] text-white shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
              : dark
                ? "text-white shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
                : "text-[#111] dark:text-white"
      }`}
      style={
        elite
          ? {
              borderColor: GOLD,
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(232,197,106,0.16), transparent 46%), linear-gradient(180deg, #1c160f 0%, #100d0a 100%)",
            }
          : hyrox
            ? { borderColor: "var(--brand-green)", background: "#070707" }
            : dark
              ? {
                  background:
                    "radial-gradient(ellipse at 18% 0%, rgba(255,255,255,0.18), transparent 52%), radial-gradient(ellipse at 80% 110%, rgba(255,255,255,0.08), transparent 46%), #141414",
                }
              : undefined
      }
    >
      {hyrox ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.55rem]" aria-hidden>
          <img
            src="/pricing/hyrox-bg.jpg"
            alt=""
            className="absolute inset-y-0 right-0 h-full w-[58%] object-cover object-right"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, #070707 0%, #070707 52%, rgba(7,7,7,0.9) 68%, rgba(7,7,7,0.35) 100%)",
            }}
          />
          <svg className="absolute right-0 bottom-24 h-28 w-16" viewBox="0 0 64 110">
            <g transform="skewX(-18)">
              <rect x="18" y="8" width="54" height="10" fill="var(--brand-green)" />
              <rect x="28" y="36" width="54" height="10" fill="var(--brand-green)" />
              <rect x="38" y="64" width="54" height="10" fill="var(--brand-green)" />
            </g>
          </svg>
        </div>
      ) : null}
      {recommended ? (
        <span
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.16em] whitespace-nowrap text-[#111] uppercase"
          style={{ background: FLUORO_GREEN }}
        >
          Recommended
        </span>
      ) : null}
      <div className={`relative z-10 flex items-start justify-between gap-3 ${hyrox ? "" : ""}`}>
        <div>
          <h3
            className={`text-3xl font-bold tracking-tight sm:text-4xl ${
              elite ? "bg-clip-text text-transparent" : ""
            } ${hyrox ? "text-4xl tracking-[0.02em] text-white uppercase sm:text-5xl" : ""}`}
            style={
              elite
                ? {
                    backgroundImage: `linear-gradient(180deg, #fff6d2 0%, ${GOLD} 46%, ${GOLD_DEEP} 100%)`,
                  }
                : hyrox
                  ? { fontFamily: "var(--font-bebas), sans-serif" }
                  : undefined
            }
          >
            {hyrox ? "HYROX" : plan.shortName}
          </h3>
          {hyrox ? (
            <p className="mt-1 text-[10px] tracking-[0.28em] text-white/75 uppercase">
              Run / Lift / Repeat
            </p>
          ) : null}
        </div>
        {elite ? <CrownBadge /> : null}
        {hyrox ? <HyroxMark /> : null}
      </div>
      <ul className="relative z-10 mt-7 flex flex-1 flex-col gap-3.5">
        {features.map((feature) => (
          <li
            key={feature.label}
            className={`flex items-start gap-2.5 text-sm leading-snug ${
              feature.on ? (elite ? "text-white" : "") : dark ? "text-white/35" : "text-black/35"
            }`}
          >
            <Check on={feature.on} light={dark && !elite && !hyrox} gold={elite} />
            <span>{feature.label}</span>
          </li>
        ))}
      </ul>
      <a
        href={`/?plan=${plan.id}#contact`}
        className={`relative z-10 mt-8 inline-flex items-center justify-between rounded-full px-5 py-3.5 text-sm font-semibold ${
          elite
            ? "text-[#1a1208] shadow-[0_8px_20px_rgba(180,130,30,0.35)]"
            : hyrox
              ? "border-2 border-[color:var(--brand-green)] bg-black/40 text-white"
              : dark
                ? "bg-white/12 text-white hover:bg-white/18"
                : "bg-[#1a1a1a] text-white hover:bg-black"
        }`}
        style={
          elite
            ? {
                background: "linear-gradient(180deg, #f8e7a8 0%, #e8c56a 40%, #c9962e 100%)",
              }
            : undefined
        }
      >
        Get the price
        <span aria-hidden>↗</span>
      </a>
    </article>
  );
}

export default function PricingSection() {
  const foundation = pricingPlans.find((plan) => plan.id === "foundation") ?? pricingPlans[0];
  const performance = pricingPlans.find((plan) => plan.id === "performance") ?? pricingPlans[0];
  const elite = pricingPlans.find((plan) => plan.id === "elite") ?? pricingPlans[0];
  const hyrox = pricingPlans.find((plan) => plan.id === "hyrox");

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
            Coaching plans
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[color:var(--muted)]">
            Foundation, Performance, and Elite are monthly. Hyrox is 12 weeks.
            Meals are included on Performance and Elite. Train online now.
            In-person coaching follows when the Bengaluru studio opens.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 items-stretch gap-4 pt-3 sm:mt-14 md:grid-cols-2 xl:grid-cols-4">
          <div className="flex min-w-0 rounded-[1.6rem] bg-[#f3f3f4] dark:bg-white/6">
            <PlanCard plan={foundation} tone="light" />
          </div>
          <PlanCard plan={performance} tone="dark" recommended />
          <PlanCard plan={elite} tone="elite" />
          {hyrox ? <PlanCard plan={hyrox} tone="hyrox" recommended /> : null}
        </div>
      </div>
    </section>
  );
}
