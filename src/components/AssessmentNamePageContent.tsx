"use client";

import AssessmentResultView from "@/components/AssessmentResultView";
import BrandLogo from "@/components/BrandLogo";
import { FLUORO_GREEN } from "@/components/sections/Reveal";
import GaugeSlider from "@/components/ui/GaugeSlider";
import {
  ASSESSMENT_RESULT_KEY,
  ASSESSMENT_STORAGE_KEY,
  type AssessmentResult,
} from "@/lib/assessment";
import { trainer } from "@/lib/trainerContent";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = ASSESSMENT_STORAGE_KEY;
const MIN_LOADING_MS = 2800;

const generatingLines = [
  "Reviewing your metrics…",
  "Building your workout split…",
  "Writing daily meal recipes…",
  "Finding accurate exercise photos…",
  "Matching meal images…",
  "Almost ready…",
];

const fieldClass =
  "w-full border-0 border-b-2 border-black/30 bg-transparent px-0 py-6 text-center text-3xl font-bold uppercase tracking-[0.06em] text-black placeholder:font-bold placeholder:uppercase placeholder:tracking-[0.06em] placeholder:text-black/40 outline-none transition focus:border-black focus:ring-0 sm:py-8 sm:text-5xl md:text-6xl lg:text-7xl";

const ease = [0.22, 1, 0.36, 1] as const;

type Choice = { id: string; title: string; blurb: string };

const genders: Choice[] = [
  { id: "male", title: "Male", blurb: "Biological male profile." },
  { id: "female", title: "Female", blurb: "Biological female profile." },
  { id: "other", title: "Other / Prefer not", blurb: "We’ll keep coaching flexible." },
];

const activityLevels: Choice[] = [
  { id: "sedentary", title: "Sedentary", blurb: "Mostly desk / low movement." },
  { id: "light", title: "Light", blurb: "Walks or light activity some days." },
  { id: "active", title: "Active", blurb: "Train or move most days." },
  { id: "athlete", title: "Very active", blurb: "Hard training or physical job." },
];

const experienceLevels: Choice[] = [
  { id: "beginner", title: "Beginner", blurb: "New to structured training." },
  { id: "intermediate", title: "Intermediate", blurb: "1–3 years of training." },
  { id: "advanced", title: "Advanced", blurb: "Consistent, experienced lifter." },
];

const goals: Choice[] = [
  { id: "fat-loss", title: "Fat loss", blurb: "Drop body fat, keep strength." },
  { id: "muscle", title: "Build muscle", blurb: "Size and shape with purpose." },
  { id: "strength", title: "Get stronger", blurb: "Progressive strength focus." },
  { id: "recomp", title: "Recomp", blurb: "Lose fat and add muscle together." },
];

const bodyBuilds: Choice[] = [
  { id: "lean", title: "Lean", blurb: "Defined, lighter frame, visible cuts." },
  { id: "athletic", title: "Athletic", blurb: "Strong, capable, balanced." },
  { id: "muscular", title: "Muscular", blurb: "More size and hypertrophy." },
  { id: "power", title: "Power", blurb: "Dense muscle and max strength." },
];

type AssessmentData = {
  name: string;
  weight: number;
  height: number;
  age: number;
  gender: string;
  activity: string;
  experience: string;
  goal: string;
  bodyBuild: string;
  daysPerWeek: number;
};

const STEPS = [
  "name",
  "weight",
  "height",
  "age",
  "gender",
  "activity",
  "experience",
  "goal",
  "bodyBuild",
  "daysPerWeek",
] as const;

type StepId = (typeof STEPS)[number];

const GAUGE_STEPS = new Set<StepId>(["weight", "height", "age", "daysPerWeek"]);

const CHOICE_OPTIONS: Partial<Record<StepId, Choice[]>> = {
  gender: genders,
  activity: activityLevels,
  experience: experienceLevels,
  goal: goals,
  bodyBuild: bodyBuilds,
};

const stepCopy: Record<
  StepId,
  { title: string; subtitle?: string; placeholder?: string; unit?: string }
> = {
  name: { title: "What should we call you?", placeholder: "YOUR NAME" },
  weight: {
    title: "What’s your weight?",
    subtitle: "Slide to set your current body weight",
    unit: "KG",
  },
  height: {
    title: "What’s your height?",
    subtitle: "Slide to set your standing height",
    unit: "CM",
  },
  age: {
    title: "How old are you?",
    subtitle: "Slide to set your age",
    unit: "YRS",
  },
  gender: {
    title: "What’s your gender?",
    subtitle: "Helps us tailor targets",
  },
  activity: {
    title: "How active are you?",
    subtitle: "Outside of formal training",
  },
  experience: {
    title: "Training experience?",
    subtitle: "Be honest, we build from here",
  },
  goal: {
    title: "What’s your main goal?",
    subtitle: "Pick the primary focus",
  },
  bodyBuild: {
    title: "What build do you want?",
    subtitle: "The look you’re training toward",
  },
  daysPerWeek: {
    title: "Days you can train?",
    subtitle: "Sessions per week you can commit to",
    unit: "DAYS",
  },
};

const gaugeConfig: Record<
  "weight" | "height" | "age" | "daysPerWeek",
  { min: number; max: number; step: number; default: number }
> = {
  weight: { min: 35, max: 180, step: 1, default: 72 },
  height: { min: 140, max: 210, step: 1, default: 175 },
  age: { min: 14, max: 75, step: 1, default: 28 },
  daysPerWeek: { min: 2, max: 6, step: 1, default: 4 },
};

export default function AssessmentNamePageContent() {
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [data, setData] = useState<AssessmentData>({
    name: "",
    weight: gaugeConfig.weight.default,
    height: gaugeConfig.height.default,
    age: gaugeConfig.age.default,
    gender: "",
    activity: "",
    experience: "",
    goal: "",
    bodyBuild: "",
    daysPerWeek: gaugeConfig.daysPerWeek.default,
  });

  const step = STEPS[stepIndex];
  const copy = stepCopy[step];
  const total = STEPS.length;
  const progress = ((stepIndex + 1) / total) * 100;
  const choices = CHOICE_OPTIONS[step];

  const canContinue = useMemo(() => {
    if (step === "name") return data.name.trim().length > 0;
    if (GAUGE_STEPS.has(step)) return true;
    return Boolean(data[step as keyof AssessmentData]);
  }, [data, step]);

  useEffect(() => {
    if (!isGenerating) return;

    let cancelled = false;
    setGenerateError(null);
    setLineIndex(0);

    const lineTimer = window.setInterval(() => {
      setLineIndex((i) => (i + 1) % generatingLines.length);
    }, 900);

    const startedAt = Date.now();

    (async () => {
      try {
        const res = await fetch("/api/assessment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const payload = (await res.json().catch(() => ({}))) as {
          result?: AssessmentResult;
          error?: string;
        };

        if (!res.ok || !payload.result) {
          throw new Error(
            payload.error || "Could not create your assessment result",
          );
        }

        const wait = Math.max(0, MIN_LOADING_MS - (Date.now() - startedAt));
        if (wait > 0) {
          await new Promise((r) => window.setTimeout(r, wait));
        }

        if (cancelled) return;

        try {
          sessionStorage.setItem(
            ASSESSMENT_RESULT_KEY,
            JSON.stringify(payload.result),
          );
        } catch {
          // private mode
        }

        setResult(payload.result);
        setIsGenerating(false);
      } catch (err) {
        if (cancelled) return;
        setGenerateError(
          err instanceof Error
            ? err.message
            : "Could not create your assessment result",
        );
        setIsGenerating(false);
      }
    })();

    return () => {
      cancelled = true;
      window.clearInterval(lineTimer);
    };
  }, [isGenerating, data]);

  const persist = (next: AssessmentData) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // private mode
    }
  };

  const goNext = () => {
    if (!canContinue || isGenerating) return;
    persist(data);

    if (stepIndex >= total - 1) {
      setResult(null);
      setGenerateError(null);
      setIsGenerating(true);
      return;
    }

    setDirection(1);
    setStepIndex((i) => i + 1);
  };

  const goBack = () => {
    if (stepIndex <= 0 || isGenerating) return;
    setDirection(-1);
    setStepIndex((i) => i - 1);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    goNext();
  };

  const setChoice = (field: StepId, id: string) => {
    setData((prev) => ({ ...prev, [field]: id }));
  };

  const retake = () => {
    setResult(null);
    setGenerateError(null);
    setIsGenerating(false);
    setStepIndex(0);
    setDirection(-1);
  };

  if (result) {
    return (
      <AssessmentResultView
        input={data}
        result={result}
        onRetake={retake}
      />
    );
  }

  if (generateError) {
    return (
      <main
        className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-white px-5 py-16 sm:px-8"
      >
        <div className="relative z-10 flex w-full max-w-lg flex-col items-center text-center">
          <p className="mb-4 text-[0.7rem] tracking-[0.4em] text-black/45 uppercase">
            Body assessment
          </p>
          <h1
            className="text-4xl tracking-[0.02em] text-black uppercase sm:text-5xl"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            Couldn’t finish your result
          </h1>
          <p className="mt-4 text-sm text-black/55 sm:text-base">
            {generateError}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setGenerateError(null);
                setIsGenerating(true);
              }}
              className="inline-flex items-center justify-center rounded-full bg-black px-10 py-4 text-base font-semibold text-[color:var(--brand-green)]"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={retake}
              className="inline-flex items-center justify-center rounded-full border border-black/20 px-8 py-4 text-sm font-semibold text-black"
            >
              Back to questions
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (isGenerating) {
    return (
      <main
        className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 py-16 sm:px-8"
        style={{ background: FLUORO_GREEN }}
      >
        <div
          className="pointer-events-none absolute top-1/2 left-0 z-[1] -translate-x-1/2 -translate-y-1/2"
          aria-hidden
        >
          <BrandLogo
            className="h-[min(70vh,560px)] w-auto sm:h-[min(78vh,680px)]"
            style={{ color: "rgba(17, 17, 17, 0.12)" }}
            title=""
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
          className="relative z-10 flex w-full max-w-xl flex-col items-center px-2 text-center"
          role="status"
          aria-live="polite"
        >
          <div className="relative mb-10 flex h-24 w-24 items-center justify-center sm:mb-12 sm:h-28 sm:w-28">
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-black/15"
              animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0.15, 0.55] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              className="absolute inset-2 rounded-full border-2 border-black/25"
              animate={{ rotate: 360 }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
              style={{
                borderTopColor: "#111",
                borderRightColor: "transparent",
              }}
            />
            <BrandLogo
              className="relative z-[1] h-10 w-auto text-black sm:h-12"
              title=""
            />
          </div>

          <p className="mb-4 text-[0.7rem] tracking-[0.4em] text-black/55 uppercase sm:text-xs">
            Body assessment
          </p>
          <h1
            className="max-w-lg text-center text-4xl leading-[0.95] tracking-[0.02em] text-black uppercase sm:text-5xl md:text-6xl"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            {trainer.name} is creating your body assessment result
          </h1>
          <p className="mt-5 min-h-[1.5rem] text-sm text-black/55 sm:text-base">
            {generatingLines[lineIndex]}
          </p>

          <div className="mt-10 h-[3px] w-full max-w-xs overflow-hidden rounded-full bg-black/10">
            <motion.div
              className="h-full origin-left bg-black"
              initial={{ scaleX: 0.08 }}
              animate={{ scaleX: [0.08, 0.45, 0.72, 0.9] }}
              transition={{
                duration: 8,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 py-16 sm:px-8"
      style={{ background: FLUORO_GREEN }}
    >
      <div
        className="pointer-events-none absolute top-1/2 left-0 z-[1] -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      >
        <BrandLogo
          className="h-[min(70vh,560px)] w-auto sm:h-[min(78vh,680px)]"
          style={{ color: "rgba(17, 17, 17, 0.12)" }}
          title=""
        />
      </div>

      <div className="absolute top-6 right-5 left-5 z-20 flex items-center justify-between sm:top-8 sm:right-8 sm:left-8">
        <Link
          href="/"
          className="text-[0.65rem] tracking-[0.28em] text-black/50 uppercase transition hover:text-black"
        >
          ← Hybrid Pro
        </Link>
        <p className="text-[0.65rem] tracking-[0.28em] text-black/45 uppercase">
          {String(stepIndex + 1).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")}
        </p>
      </div>

      <div className="absolute top-[4.25rem] right-5 left-5 z-20 h-[2px] overflow-hidden rounded-full bg-black/10 sm:top-[4.75rem] sm:right-8 sm:left-8">
        <motion.div
          className="h-full bg-black"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.45, ease }}
        />
      </div>

      <form
        onSubmit={onSubmit}
        className="relative z-10 flex w-full max-w-3xl flex-col items-center pt-6"
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.4, ease }}
            className="flex w-full flex-col items-center"
          >
            <p className="mb-4 text-[0.7rem] tracking-[0.4em] text-black/55 uppercase sm:text-xs">
              Body assessment
            </p>
            <h1
              className="max-w-2xl text-center text-4xl leading-[0.92] tracking-[0.02em] text-black uppercase sm:text-5xl md:text-6xl"
              style={{ fontFamily: "var(--font-bebas), sans-serif" }}
            >
              {copy.title}
            </h1>
            {copy.subtitle && (
              <p className="mt-4 text-center text-sm text-black/60 sm:text-base">
                {copy.subtitle}
              </p>
            )}

            {step === "name" && (
              <div className="relative mt-14 w-full sm:mt-16">
                <label className="sr-only" htmlFor="assessment-name">
                  Your name
                </label>
                <input
                  id="assessment-name"
                  name="name"
                  type="text"
                  required
                  autoFocus
                  autoComplete="name"
                  placeholder={copy.placeholder}
                  value={data.name}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={fieldClass}
                />
              </div>
            )}

            {GAUGE_STEPS.has(step) && step !== "name" && (
              <div className="mt-12 w-full max-w-xl sm:mt-14">
                <GaugeSlider
                  value={data[step as "weight" | "height" | "age" | "daysPerWeek"]}
                  min={gaugeConfig[step as keyof typeof gaugeConfig].min}
                  max={gaugeConfig[step as keyof typeof gaugeConfig].max}
                  step={gaugeConfig[step as keyof typeof gaugeConfig].step}
                  unit={copy.unit}
                  onChange={(v) =>
                    setData((prev) => ({
                      ...prev,
                      [step]: v,
                    }))
                  }
                />
              </div>
            )}

            {choices && (
              <div className="mt-12 grid w-full gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-4">
                {choices.map((option) => {
                  const selected =
                    data[step as keyof AssessmentData] === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setChoice(step, option.id)}
                      className={`rounded-2xl border-2 px-5 py-5 text-left transition sm:px-6 sm:py-6 ${
                        selected
                          ? "border-black bg-black text-[color:var(--brand-green)]"
                          : "border-black/20 bg-transparent text-black hover:border-black/50"
                      }`}
                    >
                      <p
                        className="text-2xl tracking-[0.02em] uppercase sm:text-3xl"
                        style={{
                          fontFamily: "var(--font-bebas), sans-serif",
                        }}
                      >
                        {option.title}
                      </p>
                      <p
                        className={`mt-2 text-sm leading-relaxed ${
                          selected
                            ? "text-[color:var(--brand-green)]/75"
                            : "text-black/55"
                        }`}
                      >
                        {option.blurb}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex w-full max-w-md flex-col gap-3 sm:mt-14 sm:flex-row sm:justify-center">
          {stepIndex > 0 && (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center justify-center rounded-full border border-black/25 px-8 py-4 text-sm font-semibold text-black transition hover:-translate-y-0.5 sm:py-5"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={!canContinue}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-black px-10 py-4 text-base font-semibold text-[color:var(--brand-green)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40 sm:flex-none sm:py-5 sm:text-lg"
          >
            {stepIndex >= total - 1 ? "Finish" : "Continue"}
            <span aria-hidden className="ml-2">
              →
            </span>
          </button>
        </div>
      </form>
    </main>
  );
}
