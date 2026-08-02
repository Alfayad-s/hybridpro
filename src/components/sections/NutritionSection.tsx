"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dumbbell,
  Flame,
  HeartPulse,
  StretchHorizontal,
  Weight,
  type LucideIcon,
} from "lucide-react";
import { Eyebrow, FLUORO_GREEN, Reveal, SectionTitle } from "./Reveal";
import { nutritionImages } from "@/lib/trainerMedia";

const trainingStyles: {
  id: "strength" | "bodybuilding" | "conditioning" | "mobility" | "fatloss";
  label: string;
  icon: LucideIcon;
  image: string;
  imageAlt: string;
}[] = [
  {
    id: "strength",
    label: "Strength",
    icon: Weight,
    image: nutritionImages.strength,
    imageAlt: "Athlete performing a heavy deadlift outdoors",
  },
  {
    id: "bodybuilding",
    label: "Bodybuilding",
    icon: Dumbbell,
    image: nutritionImages.bodybuilding,
    imageAlt: "Bodybuilder training with cables in the gym",
  },
  {
    id: "conditioning",
    label: "Conditioning",
    icon: HeartPulse,
    image: nutritionImages.conditioning,
    imageAlt: "Athlete performing explosive conditioning work",
  },
  {
    id: "mobility",
    label: "Mobility",
    icon: StretchHorizontal,
    image: nutritionImages.mobility,
    imageAlt: "Client working on mobility and movement in the gym",
  },
  {
    id: "fatloss",
    label: "Fat loss",
    icon: Flame,
    image: nutritionImages.fatLoss,
    imageAlt: "Training session focused on fat loss and conditioning",
  },
];

export default function NutritionSection() {
  const [activeStyle, setActiveStyle] =
    useState<(typeof trainingStyles)[number]["id"]>("bodybuilding");

  const active =
    trainingStyles.find((s) => s.id === activeStyle) ?? trainingStyles[1];

  return (
    <section
      id="nutrition"
      data-scroll-hold
      className="relative min-h-[100dvh] scroll-mt-24 overflow-hidden bg-[var(--background)] px-4 py-20 sm:px-6 sm:py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <Eyebrow>Nutrition &amp; planning</Eyebrow>
          <SectionTitle>Fuel that matches the work.</SectionTitle>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[color:var(--muted)] sm:text-lg">
            Training alone isn’t enough. Hybrid Pro pairs your sessions with
            practical meal structure, macros that fit your life, and check-ins
            that keep you consistent, so the plate and the program pull in the
            same direction.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-3 sm:mt-16 sm:gap-4 lg:grid-cols-2 lg:grid-rows-2 lg:gap-5">
          <Reveal className="lg:row-span-1">
            <article
              className="flex h-full min-h-[240px] flex-col justify-between rounded-[1.75rem] p-7 sm:min-h-[260px] sm:rounded-[2rem] sm:p-8 md:p-9"
              style={{ background: FLUORO_GREEN }}
            >
              <div>
                <h3
                  className="max-w-md text-3xl leading-[0.95] tracking-[0.02em] text-black uppercase sm:text-4xl md:text-5xl"
                  style={{ fontFamily: "var(--font-bebas), sans-serif" }}
                >
                  Check-ins that keep you going
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-black/75 sm:text-base">
                  Your coach reviews progress, adapts meals and training, and
                  keeps you moving, even when life gets busy.
                </p>
              </div>
              <a
                href="#contact"
                className="mt-8 inline-flex w-fit items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                Start with a free session
              </a>
            </article>
          </Reveal>

          <Reveal delay={0.08} className="lg:row-span-2">
            <article className="relative flex h-full min-h-[420px] overflow-hidden rounded-[1.75rem] sm:min-h-[480px] sm:rounded-[2rem] lg:min-h-full">
              <Image
                src={nutritionImages.hero}
                alt="Fresh meal planning ingredients and bowls"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority={false}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.82) 100%)",
                }}
                aria-hidden
              />
              <div className="relative z-10 mt-auto flex flex-col p-7 sm:p-8 md:p-10">
                <p className="text-[0.65rem] tracking-[0.35em] text-white/70 uppercase">
                  Meal planning
                </p>
                <h3
                  className="mt-3 max-w-md text-4xl leading-[0.95] tracking-[0.02em] text-white uppercase sm:text-5xl md:text-6xl"
                  style={{ fontFamily: "var(--font-bebas), sans-serif" }}
                >
                  Nutrition, simplified.
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
                  Personalised macros, meal frameworks, and follow-ups built
                  around your schedule, not crash diets. Eat for strength, fat
                  loss, or performance without overcomplicating every plate.
                </p>
                <a
                  href="#pricing"
                  className="mt-7 inline-flex w-fit items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5"
                  style={{ background: FLUORO_GREEN }}
                >
                  See coaching plans
                </a>
              </div>
            </article>
          </Reveal>

          {/* Training styles, image swaps on selection */}
          <Reveal delay={0.12}>
            <article className="relative flex h-full min-h-[280px] overflow-hidden rounded-[1.75rem] sm:min-h-[300px] sm:rounded-[2rem]">
              <AnimatePresence mode="sync" initial={false}>
                <motion.div
                  key={active.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={active.image}
                    alt={active.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-0 bg-black/50" aria-hidden />

              <div className="relative z-10 flex h-full w-full flex-col justify-between p-6 sm:p-7 md:p-8">
                <p className="max-w-[14rem] text-sm leading-snug text-white/90 sm:text-base">
                  Choose your personal training style
                </p>

                <div>
                  <motion.p
                    key={active.id}
                    className="mb-3 text-center text-base font-semibold tracking-wide text-white sm:text-lg"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {active.label}
                  </motion.p>
                  <div
                    className="flex items-center justify-between gap-2 sm:justify-center sm:gap-3"
                    role="tablist"
                    aria-label="Training styles"
                  >
                    {trainingStyles.map((style) => {
                      const isActive = style.id === activeStyle;
                      const Icon = style.icon;
                      return (
                        <button
                          key={style.id}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          aria-label={style.label}
                          onClick={() => setActiveStyle(style.id)}
                          className="flex h-11 w-11 items-center justify-center rounded-full transition sm:h-12 sm:w-12"
                          style={{
                            background: isActive
                              ? "rgba(255,255,255,0.95)"
                              : "rgba(255,255,255,0.18)",
                            color: isActive ? "#111" : "#fff",
                            boxShadow: isActive
                              ? "0 0 0 2px rgba(255,255,255,0.35)"
                              : undefined,
                            transform: isActive ? "scale(1.08)" : "scale(1)",
                          }}
                        >
                          <Icon className="h-5 w-5" strokeWidth={1.75} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <ul className="mt-10 grid gap-4 border-t border-[color:var(--border)] pt-8 sm:grid-cols-3 sm:gap-6">
            {[
              {
                title: "Macros that fit you",
                body: "Targets built around your goal, preferences, and how you actually eat.",
              },
              {
                title: "Real meal structure",
                body: "Simple frameworks you can cook, order, or adapt on travel weeks.",
              },
              {
                title: "Adjusted with you",
                body: "Weekly feedback so nutrition evolves with your training and progress.",
              },
            ].map((item) => (
              <li key={item.title}>
                <p
                  className="text-xl tracking-[0.03em] text-[var(--foreground)] uppercase sm:text-2xl"
                  style={{ fontFamily: "var(--font-bebas), sans-serif" }}
                >
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
