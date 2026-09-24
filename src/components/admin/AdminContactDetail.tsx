"use client";

import AdminShell from "@/components/admin/AdminShell";
import { AdminStatusBadge, adminInputClass } from "@/components/admin/adminUi";
import { FLUORO_GREEN } from "@/components/sections/Reveal";
import { pricingPlans } from "@/lib/pricingPlans";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  goal: string;
  status: string;
  createdAt: string;
};

export default function AdminContactDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [row, setRow] = useState<Submission | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [clientStatus, setClientStatus] = useState<string | null>(null);
  const [clientPlan, setClientPlan] = useState<string | null>(null);
  const [planId, setPlanId] = useState("performance");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/admin/contacts/${params.id}`, { cache: "no-store" });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = (await res.json()) as {
        submission?: Submission;
        clientId?: string | null;
        clientStatus?: string | null;
        clientPlan?: string | null;
        error?: string;
        message?: string;
      };
      if (!res.ok || !data.submission) {
        setError(data.error || data.message || "Not found");
        return;
      }
      setRow(data.submission);
      setClientId(data.clientId ?? null);
      setClientStatus(data.clientStatus ?? null);
      setClientPlan(data.clientPlan ?? null);
    };
    void load();
  }, [params.id, router]);

  const grantAccess = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/contacts/${params.id}/grant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = (await res.json()) as {
        submission?: Submission;
        subscription?: { id?: string } | null;
        error?: string;
        message?: string;
      };
      if (!res.ok) throw new Error(data.error || data.message || "Could not grant access");
      if (data.subscription?.id) {
        router.push(`/admin/clients/${data.subscription.id}`);
        return;
      }
      if (data.submission) setRow(data.submission);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not grant access");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminShell>
      <div className="mx-auto max-w-3xl space-y-5 sm:space-y-6">
        <Link
          href="/admin/contacts"
          className="inline-flex min-h-11 items-center text-sm text-[color:var(--muted)]"
        >
          ← All submissions
        </Link>
        {!row && !error && <p className="text-[color:var(--muted)]">Loading…</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {row && (
          <section className="space-y-4 rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--card)] p-4 sm:rounded-[1.75rem] sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[0.65rem] tracking-[0.28em] text-[color:var(--muted)] uppercase sm:text-[0.7rem] sm:tracking-[0.35em]">
                {row.status === "new"
                  ? "New enquiry"
                  : row.status === "converted"
                    ? "Converted"
                    : "Read"}
              </p>
              <AdminStatusBadge status={row.status} />
            </div>
            <h1
              className="break-words text-3xl leading-[0.95] tracking-[0.02em] uppercase sm:text-4xl"
              style={{ fontFamily: "var(--font-bebas), sans-serif" }}
            >
              {row.name}
            </h1>
            <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
              <a
                href={`mailto:${row.email}`}
                className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--border)] px-4 text-sm font-semibold"
                style={{ color: FLUORO_GREEN }}
              >
                {row.email}
              </a>
              {row.phone && (
                <a
                  href={`tel:${row.phone}`}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--border)] px-4 text-sm"
                >
                  {row.phone}
                </a>
              )}
            </div>
            <p className="text-sm text-[color:var(--muted)]">
              {new Date(row.createdAt).toLocaleString()}
            </p>
            <div className="border-t border-[color:var(--border)] pt-4">
              <p className="text-[0.65rem] tracking-[0.2em] text-[color:var(--muted)] uppercase">
                Goal
              </p>
              <p className="mt-2 whitespace-pre-wrap break-words">{row.goal}</p>
            </div>
          </section>
        )}

        {row && (
          <section className="space-y-4 rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--card)] p-4 sm:rounded-[1.75rem] sm:p-6">
            <h2
              className="text-xl uppercase tracking-[0.02em] sm:text-2xl"
              style={{ fontFamily: "var(--font-bebas), sans-serif" }}
            >
              Grant access
            </h2>
            {clientId ? (
              <div className="space-y-3">
                <p className="text-sm text-[color:var(--muted)]">
                  {clientPlan || "A plan"} is already on file
                  {clientStatus ? ` · ${clientStatus}` : ""}.
                </p>
                <Link
                  href={`/admin/clients/${clientId}`}
                  className="inline-flex h-12 items-center justify-center rounded-full px-5 text-sm font-bold text-black"
                  style={{ background: FLUORO_GREEN }}
                >
                  Open coaching desk
                </Link>
              </div>
            ) : (
              <form onSubmit={(event) => void grantAccess(event)} className="space-y-3">
                <p className="text-sm text-[color:var(--muted)]">
                  Start 30 days of app access for this enquiry without checkout.
                </p>
                <select
                  value={planId}
                  onChange={(e) => setPlanId(e.target.value)}
                  className={`${adminInputClass} bg-[var(--background)]`}
                >
                  {pricingPlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={busy}
                  className="h-12 w-full rounded-full px-5 text-sm font-bold text-black disabled:opacity-60 sm:w-auto"
                  style={{ background: FLUORO_GREEN }}
                >
                  {busy ? "Granting…" : "Grant 30 days"}
                </button>
              </form>
            )}
          </section>
        )}
      </div>
    </AdminShell>
  );
}
