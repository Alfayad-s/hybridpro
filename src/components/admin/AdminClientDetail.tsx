"use client";

import AdminShell from "@/components/admin/AdminShell";
import { AdminStatusBadge } from "@/components/admin/adminUi";
import { FLUORO_GREEN } from "@/components/sections/Reveal";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Detail = {
  subscription: {
    id: string;
    email: string;
    mobile: string | null;
    planName: string;
    status: string;
    startsAt: string | null;
    expiresAt: string | null;
    nextPlanId: string | null;
  };
  payments: {
    id: string;
    planId: string;
    amountPaise: number;
    pineOrderId: string | null;
    status: string;
    paidAt: string;
  }[];
};

export default function AdminClientDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [detail, setDetail] = useState<Detail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const act = async (action: "extend" | "cancel") => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/clients/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, days: 30 }),
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
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[0.65rem] tracking-[0.28em] text-[color:var(--muted)] uppercase sm:text-[0.7rem] sm:tracking-[0.35em]">
                Hybrid Pro
              </p>
              <AdminStatusBadge status={sub.status} />
            </div>
            <h1
              className="break-all text-2xl leading-[0.95] tracking-[0.02em] uppercase sm:text-4xl"
              style={{ fontFamily: "var(--font-bebas), sans-serif" }}
            >
              {sub.email}
            </h1>
            <p className="text-[color:var(--muted)]">{sub.mobile || "No mobile on file"}</p>
            <p className="text-base sm:text-lg">{sub.planName}</p>
            <p className="text-sm text-[color:var(--muted)]">
              {sub.startsAt
                ? `Started ${new Date(sub.startsAt).toLocaleDateString()}`
                : "Not started"}
              {" · "}
              {sub.expiresAt
                ? `Expires ${new Date(sub.expiresAt).toLocaleDateString()}`
                : "No expiry"}
            </p>
            {sub.nextPlanId && (
              <p className="text-sm text-[color:var(--muted)]">
                Next plan after this period: {sub.nextPlanId}
              </p>
            )}
            <div className="grid grid-cols-1 gap-3 pt-2 sm:flex sm:flex-wrap">
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
                  ₹{(payment.amountPaise / 100).toLocaleString("en-IN")}
                </p>
                <p className="mt-1 capitalize text-sm">{payment.planId}</p>
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
                <th className="px-5 py-2 font-medium">Ref</th>
              </tr>
            </thead>
            <tbody>
              {detail?.payments.map((payment) => (
                <tr key={payment.id} className="border-t border-[color:var(--border)]">
                  <td className="px-5 py-3">{new Date(payment.paidAt).toLocaleString()}</td>
                  <td className="px-5 py-3 capitalize">{payment.planId}</td>
                  <td className="px-5 py-3">
                    ₹{(payment.amountPaise / 100).toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-3 break-all text-[color:var(--muted)]">
                    {payment.pineOrderId}
                  </td>
                </tr>
              ))}
              {detail && detail.payments.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-[color:var(--muted)]">
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
