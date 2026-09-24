"use client";

import { adminInputClass, adminTextareaClass } from "@/components/admin/adminUi";
import { FLUORO_GREEN } from "@/components/sections/Reveal";
import { FormEvent, useEffect, useMemo, useState } from "react";

export type AssignedPlan = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  assignedByCoach: boolean;
  createdAt: string;
  updatedAt: string;
  days: {
    dayOfWeek: number;
    name: string;
    muscleFocus: string;
    isRestDay: boolean;
    exercises: { name: string; targetSets: number; targetReps: number }[];
  }[];
};

type CatalogExercise = {
  id: string;
  name: string;
  muscleGroup: string;
  target: string;
  equipment: string;
};

type DraftExercise = {
  exerciseId: string;
  name: string;
  targetSets: number;
  targetReps: number;
  restSeconds: number;
};

const WEEKDAYS = [
  { day: 1, label: "Mon" },
  { day: 2, label: "Tue" },
  { day: 3, label: "Wed" },
  { day: 4, label: "Thu" },
  { day: 5, label: "Fri" },
  { day: 6, label: "Sat" },
  { day: 7, label: "Sun" },
];

export default function AdminAssignWorkout({
  clientId,
  appLinked,
  plans,
  onAssigned,
}: {
  clientId: string;
  appLinked: boolean;
  plans: AssignedPlan[];
  onAssigned: (plan: AssignedPlan) => void;
}) {
  const [catalog, setCatalog] = useState<CatalogExercise[]>([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("Coach plan");
  const [muscleFocus, setMuscleFocus] = useState("Full body");
  const [description, setDescription] = useState("");
  const [weekdays, setWeekdays] = useState<number[]>([1, 3, 5]);
  const [exercises, setExercises] = useState<DraftExercise[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/admin/exercises", { cache: "no-store" });
      const data = (await res.json()) as { exercises?: CatalogExercise[] };
      if (res.ok) setCatalog(data.exercises ?? []);
    };
    void load();
  }, []);

  const matches = useMemo(() => {
    const q = search.trim().toLowerCase();
    const picked = new Set(exercises.map((item) => item.exerciseId));
    return catalog
      .filter((item) => !picked.has(item.id))
      .filter((item) => {
        if (!q) return true;
        return (
          item.name.toLowerCase().includes(q) ||
          item.muscleGroup.toLowerCase().includes(q) ||
          item.equipment.toLowerCase().includes(q)
        );
      })
      .slice(0, 8);
  }, [catalog, exercises, search]);

  const toggleDay = (day: number) => {
    setWeekdays((current) =>
      current.includes(day) ? current.filter((item) => item !== day) : [...current, day].sort((a, b) => a - b),
    );
  };

  const addExercise = (item: CatalogExercise) => {
    setExercises((current) => [
      ...current,
      { exerciseId: item.id, name: item.name, targetSets: 3, targetReps: 10, restSeconds: 90 },
    ]);
    setSearch("");
  };

  const updateExercise = (exerciseId: string, fields: Partial<DraftExercise>) => {
    setExercises((current) =>
      current.map((item) => (item.exerciseId === exerciseId ? { ...item, ...fields } : item)),
    );
  };

  const removeExercise = (exerciseId: string) => {
    setExercises((current) => current.filter((item) => item.exerciseId !== exerciseId));
  };

  const assign = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/clients/${clientId}/workout-plans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          muscleFocus,
          weekdays,
          exercises,
        }),
      });
      const data = (await res.json()) as {
        plan?: AssignedPlan;
        error?: string;
        message?: string;
      };
      if (!res.ok || !data.plan) {
        throw new Error(data.error || data.message || "Could not assign workout");
      }
      onAssigned(data.plan);
      setSaved(true);
      setExercises([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not assign workout");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--card)] p-4 sm:rounded-[1.75rem] sm:p-6">
      <h2
        className="text-xl uppercase tracking-[0.02em] sm:text-2xl"
        style={{ fontFamily: "var(--font-bebas), sans-serif" }}
      >
        Assign workout
      </h2>
      <p className="mt-1 text-sm text-[color:var(--muted)]">
        Builds a weekly plan in their app and sets it active. Home will show today&apos;s session.
      </p>

      {!appLinked ? (
        <p className="mt-4 rounded-2xl border border-[color:var(--border)] px-4 py-3 text-sm text-[color:var(--muted)]">
          This client has not signed into the app yet. They need an app account before you can assign a workout.
        </p>
      ) : (
        <form onSubmit={(event) => void assign(event)} className="mt-4 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1.5 block text-[color:var(--muted)]">Plan name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={adminInputClass}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-[color:var(--muted)]">Muscle focus</span>
              <input
                required
                value={muscleFocus}
                onChange={(e) => setMuscleFocus(e.target.value)}
                placeholder="Push · Legs · Full body"
                className={adminInputClass}
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-1.5 block text-[color:var(--muted)]">Note for them (optional)</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Keep rest at 90s. Stop a set shy of failure."
              className={`${adminTextareaClass} resize-y`}
            />
          </label>

          <div>
            <p className="mb-2 text-sm text-[color:var(--muted)]">Training days</p>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map((item) => {
                const on = weekdays.includes(item.day);
                return (
                  <button
                    key={item.day}
                    type="button"
                    onClick={() => toggleDay(item.day)}
                    className={`h-10 min-w-12 rounded-full px-3 text-sm font-semibold ${
                      on
                        ? "text-black"
                        : "border border-[color:var(--border)] text-[color:var(--muted)]"
                    }`}
                    style={on ? { background: FLUORO_GREEN } : undefined}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm text-[color:var(--muted)]">Exercises</p>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bench, squat, pull-up…"
              className={`${adminInputClass} bg-[var(--background)]`}
            />
            {search.trim() && (
              <div className="mt-2 overflow-hidden rounded-2xl border border-[color:var(--border)]">
                {matches.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => addExercise(item)}
                    className="flex w-full items-center justify-between gap-3 border-b border-[color:var(--border)] px-4 py-3 text-left last:border-b-0"
                  >
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-xs text-[color:var(--muted)]">
                      {item.muscleGroup} · {item.equipment}
                    </span>
                  </button>
                ))}
                {matches.length === 0 && (
                  <p className="px-4 py-3 text-sm text-[color:var(--muted)]">No matching exercises</p>
                )}
              </div>
            )}

            <div className="mt-3 space-y-2">
              {exercises.map((item, index) => (
                <div
                  key={item.exerciseId}
                  className="grid grid-cols-[1fr_auto] gap-2 rounded-2xl border border-[color:var(--border)] p-3 sm:grid-cols-[1.4fr_repeat(3,5.5rem)_auto] sm:items-end"
                >
                  <p className="text-sm font-medium sm:col-span-1">
                    {index + 1}. {item.name}
                  </p>
                  <label className="text-xs text-[color:var(--muted)]">
                    Sets
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={item.targetSets}
                      onChange={(e) =>
                        updateExercise(item.exerciseId, { targetSets: Number(e.target.value) })
                      }
                      className={`${adminInputClass} mt-1 h-10`}
                    />
                  </label>
                  <label className="text-xs text-[color:var(--muted)]">
                    Reps
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={item.targetReps}
                      onChange={(e) =>
                        updateExercise(item.exerciseId, { targetReps: Number(e.target.value) })
                      }
                      className={`${adminInputClass} mt-1 h-10`}
                    />
                  </label>
                  <label className="text-xs text-[color:var(--muted)]">
                    Rest (s)
                    <input
                      type="number"
                      min={0}
                      max={600}
                      value={item.restSeconds}
                      onChange={(e) =>
                        updateExercise(item.exerciseId, { restSeconds: Number(e.target.value) })
                      }
                      className={`${adminInputClass} mt-1 h-10`}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeExercise(item.exerciseId)}
                    className="h-10 rounded-full border border-[color:var(--border)] px-3 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {exercises.length === 0 && (
                <p className="text-sm text-[color:var(--muted)]">Search and add exercises to this workout.</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={busy || exercises.length === 0 || weekdays.length === 0}
            className="h-12 rounded-full px-5 text-sm font-bold text-black disabled:opacity-60 sm:w-fit"
            style={{ background: FLUORO_GREEN }}
          >
            {busy ? "Assigning…" : saved ? "Assigned — send another" : "Assign and activate"}
          </button>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>
      )}

      {plans.length > 0 && (
        <div className="mt-6 space-y-3 border-t border-[color:var(--border)] pt-5">
          <h3 className="text-[0.65rem] tracking-[0.2em] text-[color:var(--muted)] uppercase">
            Assigned plans
          </h3>
          {plans.map((plan) => (
            <article key={plan.id} className="rounded-2xl border border-[color:var(--border)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold">{plan.name}</p>
                {plan.isActive ? (
                  <span className="text-xs font-semibold" style={{ color: FLUORO_GREEN }}>
                    Active in app
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-xs text-[color:var(--muted)]">
                {plan.days
                  .filter((day) => !day.isRestDay)
                  .map((day) => day.name.slice(0, 3))
                  .join(" · ") || "No training days"}
              </p>
              {plan.days
                .filter((day) => !day.isRestDay)
                .slice(0, 1)
                .map((day) => (
                  <p key={day.dayOfWeek} className="mt-2 text-sm">
                    {day.exercises.map((item) => `${item.name} ${item.targetSets}×${item.targetReps}`).join(" · ")}
                  </p>
                ))}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
