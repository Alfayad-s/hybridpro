"use client";

import AdminAssignWorkout, { type AssignedPlan } from "@/components/admin/AdminAssignWorkout";
import AdminCoachDesk, { type CoachCheckin } from "@/components/admin/AdminCoachDesk";
import AdminShell from "@/components/admin/AdminShell";
import { AdminStatusBadge, adminInputClass, formatDaysRemaining, formatInrFromPaise } from "@/components/admin/adminUi";
import { FLUORO_GREEN } from "@/components/sections/Reveal";
import { pricingPlans } from "@/lib/pricingPlans";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Detail = {
  subscription: {
    id: string;
    email: string;
    mobile: string | null;
    planId?: string;
    planName: string;
    status: string;
    startsAt: string | null;
    expiresAt: string | null;
    daysRemaining?: number | null;
    nextPlanId: string | null;
    userId?: string | null;
    fullName?: string | null;
    avatarUrl?: string | null;
    appLinked?: boolean;
  };
  events?: {
    id: string;
    action: string;
    planId: string;
    planName: string;
    startsAt: string | null;
    expiresAt: string | null;
    amountPaise: number | null;
    createdAt: string;
  }[];
  payments: {
    id: string;
    planId: string;
    amountPaise: number;
    pineOrderId: string | null;
    status: string;
    paidAt: string;
  }[];
  notes?: string;
  notesUpdatedAt?: string | null;
  checkins?: CoachCheckin[];
  assignedPlans?: AssignedPlan[];
};

export default function AdminClientDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [detail, setDetail] = useState<Detail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [planId, setPlanId] = useState("performance");

  const load = async () => {
    const res = await fetch(`/api/admin/clients/${params.id}`, { cache: "no-store" });
    if (res.status === 401) {
      router.replace("/admin");
      return;
    }
    const data = (await res.json()) as Detail & { error?: string; message?: string };
    if (!res.ok) {
      setError(data.error || data.message || "Not found");
      return;
    }
    setDetail(data);
    if (data.subscription?.planId) setPlanId(data.subscription.planId);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const act = async (action: "extend" | "cancel" | "change_plan") => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/clients/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, days: 30, planId }),
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) throw new Error(data.error || data.message || "Update failed");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const sub = detail?.subscription;
  const totalPaidPaise =
    detail?.payments
      .filter((payment) => payment.status === "paid")
      .reduce((sum, payment) => sum + payment.amountPaise, 0) ?? 0;
  const paidCount = detail?.payments.filter((payment) => payment.status === "paid").length ?? 0;
  const grantedCount = detail?.payments.filter((payment) => payment.status === "granted").length ?? 0;
  const events = detail?.events ?? [];

  return (
    <AdminShell>
      <div className="mx-auto max-w-3xl space-y-5 sm:space-y-6">
        <Link href="/admin" className="inline-flex min-h-11 items-center text-sm text-[color:var(--muted)]">
          ← All clients
        </Link>

        {!detail && !error && (
          <p className="text-[color:var(--muted)]">Loading client…</p>
        )}

        {sub && (
          <section className="space-y-3 rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--card)] p-4 sm:rounded-[1.75rem] sm:p-6">
            <div className="flex flex-wrap items-start gap-4">
              {sub.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={sub.avatarUrl}
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[color:var(--border)] text-xl font-semibold">
                  {(sub.fullName || sub.email).slice(0, 1).toUpperCase()}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[0.65rem] tracking-[0.28em] text-[color:var(--muted)] uppercase sm:text-[0.7rem] sm:tracking-[0.35em]">
                    Hybrid Pro
                  </p>
                  <AdminStatusBadge status={sub.status} />
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[0.7rem] font-semibold ${
                      sub.appLinked
                        ? "bg-[color:var(--brand-green)]/15 text-[color:var(--foreground)]"
                        : "bg-[color:var(--border)]/60 text-[color:var(--muted)]"
                    }`}
                  >
                    {sub.appLinked ? "App account linked" : "Not signed in yet"}
                  </span>
                </div>
                <h1
                  className="mt-2 break-words text-2xl leading-[0.95] tracking-[0.02em] uppercase sm:text-4xl"
                  style={{ fontFamily: "var(--font-bebas), sans-serif" }}
                >
                  {sub.fullName || sub.email}
                </h1>
                {sub.fullName ? (
                  <p className="mt-2 break-all text-[color:var(--muted)]">{sub.email}</p>
                ) : null}
                <p className="text-[color:var(--muted)]">{sub.mobile || "No mobile on file"}</p>
              </div>
            </div>
            <p className="text-base sm:text-lg">{sub.planName}</p>
            <p className="text-lg font-semibold" style={{ color: FLUORO_GREEN }}>
              {paidCount > 0
                ? `${formatInrFromPaise(totalPaidPaise)} paid · ${paidCount} ${paidCount === 1 ? "order" : "orders"}`
                : grantedCount > 0
                  ? "Coach-granted access · no checkout collected"
                  : "No payment recorded"}
            </p>
            <p className="text-sm text-[color:var(--muted)]">
              {sub.startsAt
                ? `Started ${new Date(sub.startsAt).toLocaleDateString()}`
                : "Not started"}
              {" · "}
              {sub.expiresAt
                ? `Expires ${new Date(sub.expiresAt).toLocaleDateString()}`
                : "No expiry"}
              {formatDaysRemaining(sub.daysRemaining)
                ? ` · ${formatDaysRemaining(sub.daysRemaining)}`
                : ""}
            </p>
            {sub.nextPlanId && (
              <p className="text-sm text-[color:var(--muted)]">
                Next plan after this period: {sub.nextPlanId}
              </p>
            )}
            <div className="grid grid-cols-1 gap-3 pt-2 sm:flex sm:flex-wrap sm:items-center">
              <select
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                disabled={busy}
                className={`${adminInputClass} bg-[var(--background)] sm:max-w-[16rem]`}
              >
                {pricingPlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.shortName}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={busy || planId === sub.planId}
                onClick={() => void act("change_plan")}
                className="h-12 rounded-full border border-[color:var(--border)] px-5 text-sm disabled:opacity-60 sm:min-w-[10rem]"
              >
                Change plan
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void act("extend")}
                className="h-12 rounded-full px-5 text-sm font-bold text-black disabled:opacity-60 sm:min-w-[10rem]"
                style={{ background: FLUORO_GREEN }}
              >
                Extend 30 days
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void act("cancel")}
                className="h-12 rounded-full border border-[color:var(--border)] px-5 text-sm disabled:opacity-60 sm:min-w-[10rem]"
              >
                Cancel access
              </button>
            </div>
          </section>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        {detail?.subscription && (
          <AdminAssignWorkout
            clientId={detail.subscription.id}
            appLinked={Boolean(detail.subscription.appLinked || detail.subscription.userId)}
            plans={detail.assignedPlans ?? []}
            onAssigned={(plan) =>
              setDetail((current) =>
                current
                  ? {
                      ...current,
                      assignedPlans: [
                        plan,
                        ...(current.assignedPlans ?? []).map((item) => ({ ...item, isActive: false })),
                      ],
                    }
                  : current,
              )
            }
          />
        )}

        {detail?.subscription && (
          <AdminCoachDesk
            clientId={detail.subscription.id}
            notes={detail.notes ?? ""}
            notesUpdatedAt={detail.notesUpdatedAt ?? null}
            checkins={detail.checkins ?? []}
            onNotesSaved={(notes, notesUpdatedAt) =>
              setDetail((current) =>
                current ? { ...current, notes, notesUpdatedAt } : current,
              )
            }
            onCheckinSaved={(checkin) =>
              setDetail((current) =>
                current
                  ? {
                      ...current,
                      checkins: [
                        checkin,
                        ...(current.checkins ?? []).filter((item) => item.id !== checkin.id),
                      ],
                    }
                  : current,
              )
            }
          />
        )}

        {detail && (
        <section className="overflow-hidden rounded-[1.5rem] border border-[color:var(--border)] sm:rounded-[1.75rem]">
          <h2
            className="px-4 py-4 text-xl uppercase tracking-[0.02em] sm:px-5 sm:text-2xl"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            Subscription history
          </h2>
          <div className="space-y-3 px-4 pb-4">
            {events.map((event) => (
              <article
                key={event.id}
                className="rounded-2xl border border-[color:var(--border)] bg-[var(--card)] p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <AdminStatusBadge status={event.action} />
                  <p className="text-sm font-medium">{event.planName}</p>
                </div>
                <p className="mt-2 text-xs text-[color:var(--muted)]">
                  {new Date(event.createdAt).toLocaleString()}
                  {event.startsAt
                    ? ` · ${new Date(event.startsAt).toLocaleDateString()} – ${
                        event.expiresAt
                          ? new Date(event.expiresAt).toLocaleDateString()
                          : "open"
                      }`
                    : ""}
                </p>
                {event.amountPaise != null && event.amountPaise > 0 && (
                  <p className="mt-1 text-sm" style={{ color: FLUORO_GREEN }}>
                    {formatInrFromPaise(event.amountPaise)}
                  </p>
                )}
              </article>
            ))}
            {events.length === 0 && (
              <p className="pb-2 text-sm text-[color:var(--muted)]">
                No plan changes recorded yet. New checkouts, grants, extends, and cancels will show here.
              </p>
            )}
          </div>
        </section>
        )}

        <section className="overflow-hidden rounded-[1.5rem] border border-[color:var(--border)] sm:rounded-[1.75rem]">
          <h2
            className="px-4 py-4 text-xl uppercase tracking-[0.02em] sm:px-5 sm:text-2xl"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            Payments
          </h2>
          <div className="space-y-3 px-4 pb-4 md:hidden">
            {detail?.payments.map((payment) => (
              <article
                key={payment.id}
                className="rounded-2xl border border-[color:var(--border)] bg-[var(--card)] p-4"
              >
                <p className="text-sm font-medium">
                  {formatInrFromPaise(payment.amountPaise)}
                </p>
                <p className="mt-1 flex items-center gap-2 capitalize text-sm">
                  <span>{payment.planId}</span>
                  <AdminStatusBadge status={payment.status} />
                </p>
                <p className="mt-1 text-xs text-[color:var(--muted)]">
                  {new Date(payment.paidAt).toLocaleString()}
                </p>
                {payment.pineOrderId && (
                  <p className="mt-1 break-all text-xs text-[color:var(--muted)]">
                    {payment.pineOrderId}
                  </p>
                )}
              </article>
            ))}
            {detail && detail.payments.length === 0 && (
              <p className="pb-2 text-sm text-[color:var(--muted)]">No payments recorded.</p>
            )}
          </div>
          <table className="hidden w-full text-left text-sm md:table">
            <thead className="text-[color:var(--muted)]">
              <tr>
                <th className="px-5 py-2 font-medium">Date</th>
                <th className="px-5 py-2 font-medium">Plan</th>
                <th className="px-5 py-2 font-medium">Amount</th>
                <th className="px-5 py-2 font-medium">Status</th>
                <th className="px-5 py-2 font-medium">Ref</th>
              </tr>
            </thead>
            <tbody>
              {detail?.payments.map((payment) => (
                <tr key={payment.id} className="border-t border-[color:var(--border)]">
                  <td className="px-5 py-3">{new Date(payment.paidAt).toLocaleString()}</td>
                  <td className="px-5 py-3 capitalize">{payment.planId}</td>
                  <td className="px-5 py-3">
                    {formatInrFromPaise(payment.amountPaise)}
                  </td>
                  <td className="px-5 py-3">
                    <AdminStatusBadge status={payment.status} />
                  </td>
                  <td className="px-5 py-3 break-all text-[color:var(--muted)]">
                    {payment.pineOrderId}
                  </td>
                </tr>
              ))}
              {detail && detail.payments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-[color:var(--muted)]">
                    No payments recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </AdminShell>
  );
}
