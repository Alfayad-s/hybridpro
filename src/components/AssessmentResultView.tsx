"use client";

import BrandLogo from "@/components/BrandLogo";
import type {
  AssessmentInput,
  AssessmentResult,
  MealItem,
  WorkoutDay,
  WorkoutExercise,
} from "@/lib/assessment";
import { downloadAssessmentPdf } from "@/lib/downloadAssessmentPdf";
import { trainer } from "@/lib/trainerContent";
import { trainerPortraits } from "@/lib/trainerMedia";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type Props = {
  input: AssessmentInput;
  result: AssessmentResult;
  onRetake?: () => void;
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function AssessmentResultView({
  input,
  result,
  onRetake,
}: Props) {
  const pdfRootRef = useRef<HTMLDivElement>(null);
  const [activeSplit, setActiveSplit] = useState(0);
  const [openMeal, setOpenMeal] = useState<string | null>(null);
  const [pdfExporting, setPdfExporting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const pendingPdfRef = useRef(false);

  const splits = result.workoutSplits;
  const activeDay: WorkoutDay | undefined = splits[activeSplit];
  const mealDays = result.mealPlan;
  const daysForView = pdfExporting ? splits : activeDay ? [activeDay] : [];

  const handleDownloadPdf = useCallback(async () => {
    if (downloading) return;
    setDownloadError(null);
    setDownloading(true);
    pendingPdfRef.current = true;
    setPdfExporting(true);
  }, [downloading]);

  useEffect(() => {
    if (!pdfExporting || !pendingPdfRef.current) return;

    let cancelled = false;

    (async () => {
      // Wait for React to paint all workout days + expanded recipes
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );
      await new Promise((r) => window.setTimeout(r, 200));

      try {
        const el = pdfRootRef.current;
        if (!el) throw new Error("Assessment content not ready");
        await downloadAssessmentPdf(el, input.name);
      } catch (err) {
        if (!cancelled) {
          setDownloadError(
            err instanceof Error
              ? err.message
              : "Could not create PDF. Try again.",
          );
        }
      } finally {
        pendingPdfRef.current = false;
        if (!cancelled) {
          setPdfExporting(false);
          setDownloading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pdfExporting, input.name]);

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-white text-black">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[42vh] opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(147,226,0,0.35), transparent 70%)",
        }}
        aria-hidden
      />

      <div
        ref={pdfRootRef}
        data-assessment-pdf-root
        className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-24 pt-8 sm:px-8 sm:pt-10"
      >
        {/* Letterhead */}
        <div className="mb-10 flex items-center justify-between gap-4">
          <Link
            href="/"
            data-pdf-hide
            className="text-[0.65rem] tracking-[0.28em] text-black/45 uppercase transition hover:text-black"
          >
            ← Home
          </Link>
          <div className="flex items-center gap-2.5">
            <BrandLogo
              className="h-8 w-auto text-black sm:h-9"
              title="Hybrid Pro"
            />
            <span
              className="text-lg tracking-[0.12em] uppercase sm:text-xl"
              style={{ fontFamily: "var(--font-bebas), sans-serif" }}
            >
              Hybrid Pro
            </span>
          </div>
        </div>

        {/* Coach + brand intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
          className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3">
              <BrandLogo className="h-10 w-auto text-black" title="" />
              <div>
                <p
                  className="text-2xl tracking-[0.06em] uppercase leading-none"
                  style={{ fontFamily: "var(--font-bebas), sans-serif" }}
                >
                  Hybrid Pro
                </p>
                <p className="mt-1 text-[0.65rem] tracking-[0.28em] text-black/45 uppercase">
                  Body assessment report
                </p>
              </div>
            </div>
            <h1
              className="text-4xl leading-[0.95] tracking-[0.02em] text-black uppercase sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ fontFamily: "var(--font-bebas), sans-serif" }}
            >
              {result.headline}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-black/65 sm:text-lg">
              {result.summary}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-4 self-start sm:self-end">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-[3px] border-black sm:h-28 sm:w-28">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={trainerPortraits.footer}
                alt={trainer.name}
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div>
              <p className="text-[0.65rem] tracking-[0.28em] text-black/40 uppercase">
                Prepared by
              </p>
              <p
                className="mt-1 text-4xl leading-none text-black sm:text-5xl"
                style={{ fontFamily: "var(--font-signature), cursive" }}
              >
                {trainer.name}
              </p>
              <p className="mt-1 text-xs text-black/50">{trainer.role}</p>
            </div>
          </div>
        </motion.div>

        {/* Sticky actions */}
        <div
          data-pdf-hide
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3.5 text-sm font-semibold text-[color:var(--brand-green)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
          >
            {downloading ? "Preparing PDF…" : "Download PDF"}
          </button>
          {downloadError && (
            <p className="text-sm text-red-600">{downloadError}</p>
          )}
        </div>

        {/* Score + profile */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease }}
          className="mt-12 grid gap-4 sm:grid-cols-[auto_1fr]"
        >
          <div className="flex aspect-square w-full max-w-[160px] flex-col items-center justify-center rounded-full border border-black/10 bg-[color:var(--brand-green)] sm:max-w-none sm:w-40">
            <p
              className="text-5xl leading-none tracking-[0.02em] text-black"
              style={{ fontFamily: "var(--font-bebas), sans-serif" }}
            >
              {result.readinessScore}
            </p>
            <p className="mt-1 text-[0.65rem] font-bold tracking-[0.22em] text-black/55 uppercase">
              Ready
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Weight", value: `${input.weight} kg` },
              { label: "Height", value: `${input.height} cm` },
              { label: "Age", value: `${input.age}` },
              { label: "Train", value: `${input.daysPerWeek} days` },
            ].map((item) => (
              <div
                key={item.label}
                className="border-b border-black/10 pb-3 sm:border-0 sm:pb-0"
              >
                <p className="text-[0.65rem] tracking-[0.22em] text-black/40 uppercase">
                  {item.label}
                </p>
                <p
                  className="mt-1 text-2xl tracking-[0.02em] uppercase sm:text-3xl"
                  style={{ fontFamily: "var(--font-bebas), sans-serif" }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Body details */}
        <section className="mt-14">
          <SectionLabel>Body details</SectionLabel>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric
              label="BMI"
              value={String(result.bodyMetrics.bmi)}
              hint={result.bodyMetrics.bmiLabel}
            />
            <Metric
              label="Est. body fat"
              value={result.bodyMetrics.estimatedBodyFat}
            />
            <Metric
              label="Metabolic type"
              value={result.bodyMetrics.metabolicType}
            />
            <Metric
              label="Ideal weight"
              value={result.bodyMetrics.idealWeightRange}
            />
            <Metric
              label="Water"
              value={`${result.bodyMetrics.waterLiters.toFixed(1)} L`}
            />
            <Metric label="Sleep" value={result.bodyMetrics.sleepHours} />
            <Metric label="Goal build" value={input.bodyBuild} />
            <Metric label="Experience" value={input.experience} />
          </div>
        </section>

        {/* Targets */}
        <section className="mt-14">
          <SectionLabel>Daily targets</SectionLabel>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Metric
              label="Maintain"
              value={`${result.targets.caloriesMaintain}`}
              hint="kcal"
            />
            <Metric
              label="Goal calories"
              value={`${result.targets.caloriesGoal}`}
              hint="kcal"
              accent
            />
            <Metric label="Protein" value={`${result.targets.proteinG}g`} />
            <Metric label="Carbs" value={`${result.targets.carbsG}g`} />
            <Metric label="Fat" value={`${result.targets.fatG}g`} />
          </div>
        </section>

        {/* Training focus */}
        {result.trainingFocus.length > 0 && (
          <section className="mt-14">
            <SectionLabel>Training focus</SectionLabel>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {result.trainingFocus.map((item, i) => (
                <li
                  key={`${item}-${i}`}
                  className="flex gap-3 border-l-2 border-[color:var(--brand-green)] pl-4"
                >
                  <span className="text-sm leading-relaxed text-black/75">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Workout splits */}
        {splits.length > 0 && (
          <section className="mt-16">
            <SectionLabel>Weekly workout split</SectionLabel>
            <h2
              className="mt-3 text-3xl tracking-[0.02em] uppercase sm:text-4xl"
              style={{ fontFamily: "var(--font-bebas), sans-serif" }}
            >
              Your training week
            </h2>

            {!pdfExporting && (
              <div
                data-pdf-hide
                className="mt-6 flex gap-2 overflow-x-auto pb-2"
              >
                {splits.map((day, i) => {
                  const selected = i === activeSplit;
                  return (
                    <button
                      key={`${day.day}-${i}`}
                      type="button"
                      onClick={() => setActiveSplit(i)}
                      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                        selected
                          ? "bg-black text-[color:var(--brand-green)]"
                          : "bg-black/[0.05] text-black/70 hover:bg-black/10"
                      }`}
                    >
                      {day.day}
                    </button>
                  );
                })}
              </div>
            )}

            <div className={pdfExporting ? "mt-6 space-y-10" : "mt-6"}>
              {daysForView.map((day, di) => (
                <WorkoutDayBlock
                  key={`day-${day.day}-${di}`}
                  day={day}
                  className={pdfExporting && di > 0 ? "mt-0" : undefined}
                />
              ))}
            </div>
          </section>
        )}

        {/* Meals */}
        {mealDays.length > 0 && (
          <section className="mt-16">
            <SectionLabel>Daily meals & recipes</SectionLabel>
            <h2
              className="mt-3 text-3xl tracking-[0.02em] uppercase sm:text-4xl"
              style={{ fontFamily: "var(--font-bebas), sans-serif" }}
            >
              Eat for your targets
            </h2>

            {mealDays.map((day, di) => (
              <div key={`${day.label}-${di}`} className="mt-8">
                <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                  <p className="text-sm font-semibold tracking-[0.08em] text-black/60 uppercase">
                    {day.label}
                  </p>
                  <p className="text-sm text-black/45">
                    ~{day.totalCalories} kcal day
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {day.meals.map((meal, mi) => {
                    const id = `${di}-${mi}`;
                    const open = pdfExporting || openMeal === id;
                    return (
                      <MealCard
                        key={id}
                        meal={meal}
                        open={open}
                        forceOpen={pdfExporting}
                        onToggle={() =>
                          setOpenMeal((prev) => (prev === id ? null : id))
                        }
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        )}

        <div className="mt-14 grid gap-10 md:grid-cols-2">
          <TipBlock title="Nutrition" items={result.nutritionTips} />
          <TipBlock title="Lifestyle" items={result.lifestyleTips} />
        </div>

        <section className="mt-14">
          <SectionLabel>Next steps</SectionLabel>
          <ol className="mt-5 space-y-3">
            {result.nextSteps.map((step, i) => (
              <li key={`${step}-${i}`} className="flex gap-4">
                <span
                  className="text-2xl text-black/30"
                  style={{ fontFamily: "var(--font-bebas), sans-serif" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="pt-1 text-base text-black/80">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Signed coach seal */}
        <section className="mt-16 overflow-hidden rounded-3xl border border-black/10 bg-black/[0.03]">
          <div className="grid gap-0 md:grid-cols-[200px_1fr]">
            <div className="relative min-h-[220px] overflow-hidden bg-black md:min-h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={trainerPortraits.footer}
                alt={trainer.name}
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r" />
              <div className="absolute bottom-4 left-4 right-4 md:hidden">
                <BrandLogo className="h-7 w-auto text-[color:var(--brand-green)]" title="" />
              </div>
            </div>

            <div className="flex flex-col justify-between p-6 sm:p-8">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <BrandLogo className="hidden h-8 w-auto text-black md:block" title="" />
                  <p className="text-[0.7rem] tracking-[0.35em] text-black/40 uppercase">
                    Coach sign-off · Hybrid Pro
                  </p>
                </div>
                <p className="max-w-xl text-lg leading-relaxed text-black/80 sm:text-xl">
                  “{result.coachNote}”
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-black/10 pt-6">
                <div>
                  <p
                    className="text-5xl leading-none text-black sm:text-6xl"
                    style={{ fontFamily: "var(--font-signature), cursive" }}
                  >
                    {trainer.name}
                  </p>
                  <p className="mt-2 text-[0.65rem] tracking-[0.28em] text-black/45 uppercase">
                    {trainer.name} · Founder & CEO
                  </p>
                  <p className="mt-1 text-xs text-black/40">
                    {trainer.credentials}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[0.65rem] tracking-[0.22em] text-black/35 uppercase">
                    Prepared for
                  </p>
                  <p
                    className="mt-1 text-2xl tracking-[0.02em] uppercase"
                    style={{ fontFamily: "var(--font-bebas), sans-serif" }}
                  >
                    {input.name}
                  </p>
                  <p className="mt-1 text-xs text-black/40">
                    {new Date().toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div
          data-pdf-hide
          className="mt-14 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="inline-flex items-center justify-center rounded-full bg-black px-10 py-4 text-base font-semibold text-[color:var(--brand-green)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50 sm:py-5 sm:text-lg"
          >
            {downloading ? "Preparing PDF…" : "Download PDF"}
          </button>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center rounded-full border border-black/20 px-8 py-4 text-sm font-semibold text-black transition hover:-translate-y-0.5 sm:py-5"
          >
            Talk to {trainer.name}
            <span aria-hidden className="ml-2">
              →
            </span>
          </Link>
          {onRetake && (
            <button
              type="button"
              onClick={onRetake}
              className="inline-flex items-center justify-center rounded-full border border-black/20 px-8 py-4 text-sm font-semibold text-black transition hover:-translate-y-0.5 sm:py-5"
            >
              Retake assessment
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

function WorkoutDayBlock({
  day,
  className = "",
}: {
  day: WorkoutDay;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-3xl border border-black/10 bg-black/[0.02] ${className}`}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/5 sm:aspect-[21/9]">
        {day.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={day.coverImageUrl}
            alt={day.title}
            className="h-full w-full object-cover"
            loading="eager"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-black/10 to-[color:var(--brand-green)]/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute right-0 bottom-0 left-0 p-5 sm:p-7">
          <p className="text-[0.65rem] tracking-[0.28em] text-white/70 uppercase">
            {day.day} · {day.focus} · ~{day.durationMin} min
          </p>
          <p
            className="mt-1 text-3xl tracking-[0.02em] text-white uppercase sm:text-4xl"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            {day.title}
          </p>
        </div>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
        {day.exercises.map((ex: WorkoutExercise, i: number) => (
          <article
            key={`${ex.name}-${i}`}
            className="overflow-hidden rounded-2xl bg-white"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
              {ex.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ex.imageUrl}
                  alt={ex.name}
                  className="h-full w-full object-cover"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs tracking-[0.2em] text-black/30 uppercase">
                  Exercise
                </div>
              )}
            </div>
            <div className="p-4">
              <p
                className="text-xl tracking-[0.02em] uppercase"
                style={{ fontFamily: "var(--font-bebas), sans-serif" }}
              >
                {ex.name}
              </p>
              <p className="mt-1 text-sm font-semibold text-black/70">
                {ex.sets} sets · {ex.reps} reps · Rest {ex.rest}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-black/55">
                {ex.cue}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function MealCard({
  meal,
  open,
  onToggle,
  forceOpen = false,
}: {
  meal: MealItem;
  open: boolean;
  onToggle: () => void;
  forceOpen?: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-black/10 bg-white">
      <div className="relative aspect-[16/10] overflow-hidden bg-black/5">
        {meal.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={meal.imageUrl}
            alt={meal.name}
            className="h-full w-full object-cover"
            loading="eager"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs tracking-[0.2em] text-black/30 uppercase">
            Meal
          </div>
        )}
        <span className="absolute top-3 left-3 rounded-full bg-black/75 px-3 py-1 text-[0.65rem] font-bold tracking-[0.18em] text-[color:var(--brand-green)] uppercase">
          {meal.slot}
        </span>
      </div>

      <div className="p-5">
        <p
          className="text-2xl tracking-[0.02em] uppercase"
          style={{ fontFamily: "var(--font-bebas), sans-serif" }}
        >
          {meal.name}
        </p>
        <p className="mt-2 text-sm text-black/55">
          {meal.calories} kcal · P {meal.proteinG}g · C {meal.carbsG}g · F{" "}
          {meal.fatG}g · {meal.prepTimeMin} min
        </p>

        {!forceOpen && (
          <button
            type="button"
            data-pdf-hide
            onClick={onToggle}
            className="mt-4 text-sm font-semibold tracking-[0.08em] text-black uppercase underline-offset-4 hover:underline"
          >
            {open ? "Hide recipe" : "View recipe"}
          </button>
        )}

        {open && (
          <div
            className={`space-y-4 border-t border-black/10 pt-4 ${forceOpen ? "mt-4" : "mt-4"}`}
          >
            <div>
              <p className="text-[0.65rem] tracking-[0.22em] text-black/40 uppercase">
                Ingredients
              </p>
              <ul className="mt-2 space-y-1">
                {meal.ingredients.map((ing, i) => (
                  <li key={`${ing}-${i}`} className="text-sm text-black/70">
                    · {ing}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[0.65rem] tracking-[0.22em] text-black/40 uppercase">
                Steps
              </p>
              <ol className="mt-2 space-y-2">
                {meal.steps.map((step, i) => (
                  <li
                    key={`${step}-${i}`}
                    className="flex gap-3 text-sm text-black/70"
                  >
                    <span className="font-bold text-black/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.7rem] tracking-[0.35em] text-black/40 uppercase">
      {children}
    </p>
  );
}

function Metric({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl px-4 py-4 ${
        accent
          ? "bg-black text-[color:var(--brand-green)]"
          : "bg-black/[0.03] text-black"
      }`}
    >
      <p
        className={`text-[0.65rem] tracking-[0.22em] uppercase ${
          accent ? "text-[color:var(--brand-green)]/60" : "text-black/40"
        }`}
      >
        {label}
      </p>
      <p
        className="mt-2 text-3xl tracking-[0.02em] uppercase capitalize"
        style={{ fontFamily: "var(--font-bebas), sans-serif" }}
      >
        {value}
      </p>
      {hint && (
        <p
          className={`mt-1 text-xs ${
            accent ? "text-[color:var(--brand-green)]/55" : "text-black/45"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

function TipBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <SectionLabel>{title}</SectionLabel>
      <ul className="mt-4 space-y-3">
        {items.map((item, i) => (
          <li
            key={`${title}-${i}`}
            className="text-sm leading-relaxed text-black/70"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
