"use client";

import AdminShell from "@/components/admin/AdminShell";
import {
  AdminStatusBadge,
  adminInputClass,
  formatInrFromPaise,
} from "@/components/admin/adminUi";
import { FLUORO_GREEN } from "@/components/sections/Reveal";
import { pricingPlans } from "@/lib/pricingPlans";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";

type PaymentRow = {
  id: string;
  subscriptionId: string | null;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  planId: string;
  planName: string;
  amountPaise: number;
  pineOrderId: string | null;
  status: string;
  paidAt: string;
};

type Totals = {
  collectedPaise: number;
  grantedPaise: number;
  orderCount: number;
  uniquePayers: number;
};

export default function AdminPaymentsContent() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center justify-center bg-[var(--background)] px-4 text-center text-[color:var(--muted)]">
          Loading payments…
        </main>
      }
    >
      <AdminPaymentsInner />
    </Suspense>
  );
}

function AdminPaymentsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<PaymentRow[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [q, setQ] = useState("");
  const [planId, setPlanId] = useState("");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async (next?: {
    q?: string;
    planId?: string;
    status?: string;
    from?: string;
    to?: string;
  }) => {
    const params = new URLSearchParams();
    const search = next?.q ?? q;
    const plan = next?.planId ?? planId;
    const st = next?.status ?? status;
    const start = next?.from ?? from;
    const end = next?.to ?? to;
    if (search) params.set("q", search);
    if (plan) params.set("planId", plan);
    if (st) params.set("status", st);
    if (start) params.set("from", start);
    if (end) params.set("to", end);

    const res = await fetch(`/api/admin/payments?${params}`, { cache: "no-store" });
    if (res.status === 401) {
      router.replace("/admin");
      return;
    }
    const data = (await res.json()) as {
      payments?: PaymentRow[];
      totals?: Totals;
      error?: string;
      message?: string;
    };
    if (!res.ok) {
      setError(data.error || data.message || "Could not load payments");
      setRows([]);
      setTotals(null);
      setLoading(false);
      return;
    }
    setError(null);
    setRows(data.payments || []);
    setTotals(data.totals || null);
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await load();
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
            Payments
          </h1>
          <p className="mt-3 text-sm text-[color:var(--muted)]">
            Checkout money vs coach-granted access, across every client.
          </p>
        </header>
        <p className="text-sm text-[color:var(--muted)] lg:hidden">
          Checkout money vs coach-granted access, across every client.
        </p>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ["Collected", formatInrFromPaise(totals?.collectedPaise ?? 0)],
            ["Granted value", formatInrFromPaise(totals?.grantedPaise ?? 0)],
            ["Paid orders", totals?.orderCount ?? 0],
            ["Unique payers", totals?.uniquePayers ?? 0],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="rounded-2xl border border-[color:var(--border)] bg-[var(--card)] p-3.5 sm:p-4"
            >
              <p className="text-[0.6rem] tracking-[0.16em] text-[color:var(--muted)] uppercase sm:text-[0.65rem] sm:tracking-[0.2em]">
                {label}
              </p>
              <p
                className="mt-1.5 text-3xl tracking-[0.02em] sm:mt-2 sm:text-4xl"
                style={{
                  color: FLUORO_GREEN,
                  fontFamily: "var(--font-bebas), sans-serif",
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </section>

        <form onSubmit={onSearch} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, or ref"
            className={`${adminInputClass} bg-[var(--card)] lg:col-span-2`}
          />
          <select
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            className={`${adminInputClass} bg-[var(--card)]`}
          >
            <option value="">All plans</option>
            {pricingPlans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.shortName || plan.name}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`${adminInputClass} bg-[var(--card)]`}
          >
            <option value="">All types</option>
            <option value="paid">Paid checkout</option>
            <option value="granted">Granted</option>
          </select>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={`${adminInputClass} bg-[var(--card)]`}
          />
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={`${adminInputClass} bg-[var(--card)]`}
          />
          <button
            type="submit"
            className="h-12 rounded-full border border-[color:var(--border)] px-5 text-sm lg:col-span-6"
          >
            Filter
          </button>
        </form>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {loading && !error && (
          <p className="text-sm text-[color:var(--muted)]">Loading payments…</p>
        )}

        <div className="space-y-3 md:hidden">
          {rows.map((payment) => (
            <article
              key={payment.id}
              className="rounded-2xl border border-[color:var(--border)] bg-[var(--card)] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {payment.subscriptionId ? (
                    <Link
                      href={`/admin/clients/${payment.subscriptionId}`}
                      className="truncate font-medium"
                    >
                      {payment.fullName || payment.email}
                    </Link>
                  ) : (
                    <p className="truncate font-medium">{payment.fullName || payment.email}</p>
                  )}
                  {payment.fullName ? (
                    <p className="mt-0.5 truncate text-xs text-[color:var(--muted)]">
                      {payment.email}
                    </p>
                  ) : null}
                </div>
                <AdminStatusBadge status={payment.status} />
              </div>
              <p className="mt-3 text-sm font-semibold" style={{ color: FLUORO_GREEN }}>
                {formatInrFromPaise(payment.amountPaise)}
              </p>
              <p className="mt-1 text-sm capitalize">{payment.planName}</p>
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
          {!loading && rows.length === 0 && (
            <p className="rounded-2xl border border-[color:var(--border)] px-4 py-10 text-center text-sm text-[color:var(--muted)]">
              No payments match these filters.
            </p>
          )}
        </div>

        <div className="hidden overflow-x-auto rounded-[1.75rem] border border-[color:var(--border)] md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--card)] text-[color:var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Ref</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((payment) => (
                <tr key={payment.id} className="border-t border-[color:var(--border)]">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(payment.paidAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {payment.subscriptionId ? (
                      <Link href={`/admin/clients/${payment.subscriptionId}`} className="block">
                        <p className="max-w-[16rem] truncate font-medium">
                          {payment.fullName || payment.email}
                        </p>
                        {payment.fullName ? (
                          <p className="truncate text-xs text-[color:var(--muted)]">
                            {payment.email}
                          </p>
                        ) : null}
                      </Link>
                    ) : (
                      <p className="max-w-[16rem] truncate">{payment.email}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">{payment.planName}</td>
                  <td className="px-4 py-3">{formatInrFromPaise(payment.amountPaise)}</td>
                  <td className="px-4 py-3">
                    <AdminStatusBadge status={payment.status} />
                  </td>
                  <td className="px-4 py-3 break-all text-[color:var(--muted)]">
                    {payment.pineOrderId || "—"}
                  </td>
                </tr>
              ))}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[color:var(--muted)]">
                    No payments match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
