"use client";

import { adminInputClass, adminTextareaClass } from "@/components/admin/adminUi";
import { FLUORO_GREEN } from "@/components/sections/Reveal";
import { FormEvent, useEffect, useState } from "react";

export type CoachCheckin = {
  id: string;
  checkinDate: string;
  weight: string | null;
  adherence: string | null;
  clientUpdate: string | null;
  coachReply: string | null;
  createdAt: string;
};

const ADHERENCE = ["On track", "Mixed week", "Missed sessions", "Injured", "Travel"];

function todayKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function CheckinReplyForm({
  clientId,
  item,
  onSaved,
}: {
  clientId: string;
  item: CoachCheckin;
  onSaved: (checkin: CoachCheckin) => void;
}) {
  const [reply, setReply] = useState(item.coachReply ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setReply(item.coachReply ?? "");
  }, [item.coachReply]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/clients/${clientId}/checkins/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coachReply: reply }),
      });
      const data = (await res.json()) as {
        checkin?: CoachCheckin;
        error?: string;
        message?: string;
      };
      if (!res.ok || !data.checkin) {
        throw new Error(data.error || data.message || "Could not save reply");
      }
      onSaved(data.checkin);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save reply");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={(event) => void save(event)} className="mt-3 space-y-2">
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        rows={3}
        placeholder="Drop volume this week. Keep protein at 160g. Walk 8k steps."
        className={`${adminTextareaClass} resize-y`}
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="h-11 rounded-full px-5 text-sm font-bold text-black disabled:opacity-60"
          style={{ background: FLUORO_GREEN }}
        >
          {busy ? "Saving…" : item.coachReply ? "Update reply" : "Send reply"}
        </button>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </form>
  );
}

export default function AdminCoachDesk({
  clientId,
  notes,
  notesUpdatedAt,
  checkins,
  onNotesSaved,
  onCheckinSaved,
}: {
  clientId: string;
  notes: string;
  notesUpdatedAt: string | null;
  checkins: CoachCheckin[];
  onNotesSaved: (notes: string, notesUpdatedAt: string | null) => void;
  onCheckinSaved: (checkin: CoachCheckin) => void;
}) {
  const [noteBody, setNoteBody] = useState(notes);
  const [noteBusy, setNoteBusy] = useState(false);
  const [noteError, setNoteError] = useState<string | null>(null);

  const [checkinDate, setCheckinDate] = useState(todayKey);
  const [weight, setWeight] = useState("");
  const [adherence, setAdherence] = useState("On track");
  const [clientUpdate, setClientUpdate] = useState("");
  const [coachReply, setCoachReply] = useState("");
  const [checkinBusy, setCheckinBusy] = useState(false);
  const [checkinError, setCheckinError] = useState<string | null>(null);

  useEffect(() => {
    setNoteBody(notes);
  }, [notes]);

  const saveNotes = async (event: FormEvent) => {
    event.preventDefault();
    setNoteBusy(true);
    setNoteError(null);
    try {
      const res = await fetch(`/api/admin/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_notes", notes: noteBody }),
      });
      const data = (await res.json()) as {
        notes?: string;
        notesUpdatedAt?: string | null;
        error?: string;
        message?: string;
      };
      if (!res.ok) throw new Error(data.error || data.message || "Could not save notes");
      onNotesSaved(data.notes ?? noteBody, data.notesUpdatedAt ?? new Date().toISOString());
    } catch (err) {
      setNoteError(err instanceof Error ? err.message : "Could not save notes");
    } finally {
      setNoteBusy(false);
    }
  };

  const saveCheckin = async (event: FormEvent) => {
    event.preventDefault();
    setCheckinBusy(true);
    setCheckinError(null);
    try {
      const res = await fetch(`/api/admin/clients/${clientId}/checkins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkinDate,
          weight,
          adherence,
          clientUpdate,
          coachReply,
        }),
      });
      const data = (await res.json()) as {
        checkin?: CoachCheckin;
        error?: string;
        message?: string;
      };
      if (!res.ok || !data.checkin) {
        throw new Error(data.error || data.message || "Could not save check-in");
      }
      onCheckinSaved(data.checkin);
      setWeight("");
      setClientUpdate("");
      setCoachReply("");
      setAdherence("On track");
      setCheckinDate(todayKey());
    } catch (err) {
      setCheckinError(err instanceof Error ? err.message : "Could not save check-in");
    } finally {
      setCheckinBusy(false);
    }
  };

  const waiting = checkins.filter((item) => !item.coachReply).length;

  return (
    <div className="space-y-5">
      <section className="rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--card)] p-4 sm:rounded-[1.75rem] sm:p-6">
        <h2
          className="text-xl uppercase tracking-[0.02em] sm:text-2xl"
          style={{ fontFamily: "var(--font-bebas), sans-serif" }}
        >
          Coach notes
        </h2>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          Private to you. The client never sees this.
        </p>
        <form onSubmit={(event) => void saveNotes(event)} className="mt-4 space-y-3">
          <textarea
            value={noteBody}
            onChange={(e) => setNoteBody(e.target.value)}
            rows={5}
            placeholder="Knee niggle on lunges. Push hypertrophy next week. Sleep is the limiter."
            className={`${adminTextareaClass} resize-y`}
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-[color:var(--muted)]">
              {notesUpdatedAt
                ? `Saved ${new Date(notesUpdatedAt).toLocaleString()}`
                : "Not saved yet"}
            </p>
            <button
              type="submit"
              disabled={noteBusy}
              className="h-12 rounded-full px-5 text-sm font-bold text-black disabled:opacity-60"
              style={{ background: FLUORO_GREEN }}
            >
              {noteBusy ? "Saving…" : "Save notes"}
            </button>
          </div>
          {noteError && <p className="text-sm text-red-500">{noteError}</p>}
        </form>
      </section>

      <section className="rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--card)] p-4 sm:rounded-[1.75rem] sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2
              className="text-xl uppercase tracking-[0.02em] sm:text-2xl"
              style={{ fontFamily: "var(--font-bebas), sans-serif" }}
            >
              Weekly check-in
            </h2>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              Clients submit from the app. Reply on the same check-in — they see it there.
            </p>
          </div>
          {waiting > 0 ? (
            <span className="inline-flex rounded-full bg-[color:var(--brand-green)]/15 px-2.5 py-1 text-[0.7rem] font-semibold">
              Needs reply
            </span>
          ) : null}
        </div>
        {waiting > 0 ? (
          <p className="mt-2 text-sm font-semibold" style={{ color: FLUORO_GREEN }}>
            {waiting} waiting for your reply
          </p>
        ) : null}

        <div className="mt-6 space-y-3">
          <h3 className="text-[0.65rem] tracking-[0.2em] text-[color:var(--muted)] uppercase">
            From the app
          </h3>
          {checkins.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-[color:var(--border)] p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold">
                  {new Date(`${item.checkinDate}T00:00:00`).toLocaleDateString()}
                </p>
                <p className="text-xs text-[color:var(--muted)]">
                  {[item.adherence, item.weight].filter(Boolean).join(" · ") || "Logged"}
                  {item.coachReply ? " · Replied" : " · Needs reply"}
                </p>
              </div>
              {item.clientUpdate && (
                <p className="mt-2 whitespace-pre-wrap text-sm">{item.clientUpdate}</p>
              )}
              <CheckinReplyForm clientId={clientId} item={item} onSaved={onCheckinSaved} />
            </article>
          ))}
          {checkins.length === 0 && (
            <p className="text-sm text-[color:var(--muted)]">
              No check-ins yet. They will appear here when the client submits from the app.
            </p>
          )}
        </div>

        <form onSubmit={(event) => void saveCheckin(event)} className="mt-8 grid gap-3 border-t border-[color:var(--border)] pt-6">
          <div>
            <h3 className="text-[0.65rem] tracking-[0.2em] text-[color:var(--muted)] uppercase">
              Log for them
            </h3>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              Use this only if they checked in over WhatsApp or in person.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="text-sm">
              <span className="mb-1.5 block text-[color:var(--muted)]">Date</span>
              <input
                type="date"
                required
                value={checkinDate}
                onChange={(e) => setCheckinDate(e.target.value)}
                className={adminInputClass}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-[color:var(--muted)]">Weight</span>
              <input
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="74.2 kg"
                className={adminInputClass}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-[color:var(--muted)]">Adherence</span>
              <select
                value={adherence}
                onChange={(e) => setAdherence(e.target.value)}
                className={`${adminInputClass} bg-[var(--background)]`}
              >
                {ADHERENCE.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="text-sm">
            <span className="mb-1.5 block text-[color:var(--muted)]">What they said</span>
            <textarea
              value={clientUpdate}
              onChange={(e) => setClientUpdate(e.target.value)}
              rows={3}
              placeholder="Worked out 4 days. Travel on Friday. Energy was low."
              className={`${adminTextareaClass} resize-y`}
            />
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block text-[color:var(--muted)]">Your reply</span>
            <textarea
              value={coachReply}
              onChange={(e) => setCoachReply(e.target.value)}
              rows={3}
              placeholder="Drop volume this week. Keep protein at 160g. Walk 8k steps."
              className={`${adminTextareaClass} resize-y`}
            />
          </label>
          <button
            type="submit"
            disabled={checkinBusy}
            className="h-12 rounded-full px-5 text-sm font-bold text-black disabled:opacity-60 sm:w-fit"
            style={{ background: FLUORO_GREEN }}
          >
            {checkinBusy ? "Saving…" : "Save check-in"}
          </button>
          {checkinError && <p className="text-sm text-red-500">{checkinError}</p>}
        </form>
      </section>
    </div>
  );
}
