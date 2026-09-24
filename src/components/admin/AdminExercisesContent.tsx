"use client";

import AdminShell from "@/components/admin/AdminShell";
import { adminInputClass, adminTextareaClass } from "@/components/admin/adminUi";
import { FLUORO_GREEN } from "@/components/sections/Reveal";
import { FormEvent, useEffect, useMemo, useState } from "react";

type CatalogExercise = {
  uuid: string;
  id: string;
  slug: string;
  name: string;
  muscleGroup: string;
  target: string;
  secondary: string[];
  equipment: string;
  difficulty: string;
  imageUrl: string | null;
  videoUrl: string | null;
  instructions: string[];
  description: string | null;
};

const GROUPS = ["Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Glutes", "Full Body"];
const EQUIPMENT = [
  "Barbell",
  "Dumbbells",
  "Cable",
  "Machine",
  "Bodyweight",
  "Kettlebell",
  "Resistance Band",
  "Other",
];
const DIFFICULTY = ["beginner", "intermediate", "advanced"];

const emptyForm = {
  name: "",
  slug: "",
  muscleGroup: "Chest",
  target: "",
  secondary: "",
  equipment: "Barbell",
  difficulty: "beginner",
  imageUrl: "",
  videoUrl: "",
  instructions: "",
};

export default function AdminExercisesContent() {
  const [rows, setRows] = useState<CatalogExercise[]>([]);
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<CatalogExercise | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async (search = q) => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    const res = await fetch(`/api/admin/exercises?${params}`, { cache: "no-store" });
    if (res.status === 401) {
      window.location.href = "/admin";
      return;
    }
    const data = (await res.json()) as {
      exercises?: CatalogExercise[];
      error?: string;
      message?: string;
    };
    if (!res.ok) {
      setError(data.error || data.message || "Could not load exercises");
      setRows([]);
      setLoading(false);
      return;
    }
    setError(null);
    setRows(data.exercises || []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(
    () => (group ? rows.filter((row) => row.muscleGroup === group) : rows),
    [rows, group],
  );

  const onSearch = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await load();
  };

  const startCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setSaved(false);
    setError(null);
  };

  const startEdit = (row: CatalogExercise) => {
    setEditing(row);
    setForm({
      name: row.name,
      slug: row.slug,
      muscleGroup: row.muscleGroup,
      target: row.target,
      secondary: row.secondary.join(", "),
      equipment: row.equipment,
      difficulty: row.difficulty || "beginner",
      imageUrl: row.imageUrl || "",
      videoUrl: row.videoUrl || "",
      instructions: row.instructions.join("\n"),
    });
    setSaved(false);
    setError(null);
  };

  const onSave = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setSaved(false);
    setError(null);
    const payload = {
      name: form.name,
      slug: form.slug,
      muscleGroup: form.muscleGroup,
      target: form.target,
      secondary: form.secondary,
      equipment: form.equipment,
      difficulty: form.difficulty,
      imageUrl: form.imageUrl,
      videoUrl: form.videoUrl,
      instructions: form.instructions,
    };
    const res = await fetch(editing ? `/api/admin/exercises/${editing.uuid}` : "/api/admin/exercises", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { exercise?: CatalogExercise; error?: string; message?: string };
    setBusy(false);
    if (!res.ok) {
      setError(data.error || data.message || "Could not save exercise");
      return;
    }
    if (data.exercise) {
      setEditing(data.exercise);
      setForm((prev) => ({ ...prev, slug: data.exercise!.slug }));
    }
    setSaved(true);
    await load();
  };

  const onDelete = async () => {
    if (!editing) return;
    if (!window.confirm(`Delete ${editing.name}? Plans that use this slug will keep the name, but the library item will be gone.`)) {
      return;
    }
    setBusy(true);
    const res = await fetch(`/api/admin/exercises/${editing.uuid}`, { method: "DELETE" });
    const data = (await res.json()) as { error?: string; message?: string };
    setBusy(false);
    if (!res.ok) {
      setError(data.error || data.message || "Could not delete exercise");
      return;
    }
    startCreate();
    await load();
  };

  const field = (key: keyof typeof form, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && !editing) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  return (
    <AdminShell>
      <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
        <header className="hidden lg:block">
          <p className="text-[0.7rem] tracking-[0.35em] text-[color:var(--muted)] uppercase">
            Hybrid Pro
          </p>
          <h1
            className="mt-2 text-5xl leading-[0.95] tracking-[0.02em] uppercase"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            Exercises
          </h1>
          <p className="mt-3 text-sm text-[color:var(--muted)]">
            Shared library for the app, workout builder, and assigned plans. Add any movement you want.
          </p>
        </header>
        <p className="text-sm text-[color:var(--muted)] lg:hidden">
          Shared library for the app and assigned plans.
        </p>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {saved && <p className="text-sm text-[color:var(--muted)]">Saved. The app picks this up on next load.</p>}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
          <section className="space-y-4">
            <form onSubmit={onSearch} className="flex flex-col gap-3 sm:flex-row">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name, muscle, or equipment"
                className={`flex-1 ${adminInputClass} bg-[var(--card)]`}
              />
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className={`${adminInputClass} bg-[var(--card)] sm:w-40`}
              >
                <option value="">All groups</option>
                {GROUPS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <button type="submit" className="h-12 rounded-full border border-[color:var(--border)] px-5 text-sm">
                Filter
              </button>
            </form>

            <div className="flex items-center justify-between">
              <p className="text-sm text-[color:var(--muted)]">
                {loading ? "Loading…" : `${filtered.length} exercises`}
              </p>
              <button
                type="button"
                onClick={startCreate}
                className="h-10 rounded-full px-4 text-sm font-medium"
                style={{ background: FLUORO_GREEN, color: "#111" }}
              >
                New exercise
              </button>
            </div>

            <div className="divide-y divide-[color:var(--border)] overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[var(--card)]">
              {filtered.map((row) => {
                const active = editing?.uuid === row.uuid;
                return (
                  <button
                    key={row.uuid}
                    type="button"
                    onClick={() => startEdit(row)}
                    className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left"
                    style={active ? { background: "color-mix(in srgb, var(--brand-green) 12%, transparent)" } : undefined}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{row.name}</span>
                      <span className="mt-0.5 block truncate text-xs text-[color:var(--muted)]">
                        {row.muscleGroup} · {row.equipment} · {row.slug}
                      </span>
                    </span>
                    <span className="shrink-0 text-[0.7rem] capitalize text-[color:var(--muted)]">
                      {row.difficulty}
                    </span>
                  </button>
                );
              })}
              {!loading && filtered.length === 0 && (
                <p className="px-4 py-8 text-sm text-[color:var(--muted)]">No exercises match that filter.</p>
              )}
            </div>
          </section>

          <form
            onSubmit={onSave}
            className="space-y-3 rounded-2xl border border-[color:var(--border)] bg-[var(--card)] p-4 sm:p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-medium">{editing ? "Edit exercise" : "New exercise"}</h2>
              {editing && (
                <button
                  type="button"
                  onClick={() => void onDelete()}
                  disabled={busy}
                  className="text-sm text-red-500"
                >
                  Delete
                </button>
              )}
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs text-[color:var(--muted)]">Name</span>
              <input
                value={form.name}
                onChange={(e) => field("name", e.target.value)}
                required
                className={adminInputClass}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs text-[color:var(--muted)]">Slug (plan ID)</span>
              <input
                value={form.slug}
                onChange={(e) => field("slug", e.target.value)}
                className={adminInputClass}
                disabled={Boolean(editing)}
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-xs text-[color:var(--muted)]">Muscle group</span>
                <select
                  value={form.muscleGroup}
                  onChange={(e) => field("muscleGroup", e.target.value)}
                  className={adminInputClass}
                >
                  {GROUPS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs text-[color:var(--muted)]">Target</span>
                <input
                  value={form.target}
                  onChange={(e) => field("target", e.target.value)}
                  className={adminInputClass}
                />
              </label>
            </div>
            <label className="block space-y-1.5">
              <span className="text-xs text-[color:var(--muted)]">Secondary muscles</span>
              <input
                value={form.secondary}
                onChange={(e) => field("secondary", e.target.value)}
                placeholder="Front Delts, Triceps"
                className={adminInputClass}
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-xs text-[color:var(--muted)]">Equipment</span>
                <select
                  value={form.equipment}
                  onChange={(e) => field("equipment", e.target.value)}
                  className={adminInputClass}
                >
                  {!EQUIPMENT.includes(form.equipment) && form.equipment ? (
                    <option value={form.equipment}>{form.equipment}</option>
                  ) : null}
                  {EQUIPMENT.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs text-[color:var(--muted)]">Difficulty</span>
                <select
                  value={form.difficulty}
                  onChange={(e) => field("difficulty", e.target.value)}
                  className={adminInputClass}
                >
                  {DIFFICULTY.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block space-y-1.5">
              <span className="text-xs text-[color:var(--muted)]">Image URL</span>
              <input
                value={form.imageUrl}
                onChange={(e) => field("imageUrl", e.target.value)}
                className={adminInputClass}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs text-[color:var(--muted)]">Video URL</span>
              <input
                value={form.videoUrl}
                onChange={(e) => field("videoUrl", e.target.value)}
                className={adminInputClass}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs text-[color:var(--muted)]">Instructions (one per line)</span>
              <textarea
                value={form.instructions}
                onChange={(e) => field("instructions", e.target.value)}
                rows={5}
                className={`${adminTextareaClass} resize-y`}
              />
            </label>
            <button
              type="submit"
              disabled={busy || !form.name.trim()}
              className="h-12 w-full rounded-full text-sm font-medium disabled:opacity-50"
              style={{ background: FLUORO_GREEN, color: "#111" }}
            >
              {busy ? "Saving…" : editing ? "Save changes" : "Add exercise"}
            </button>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
