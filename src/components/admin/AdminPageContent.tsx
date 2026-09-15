"use client";

import AdminShell from "@/components/admin/AdminShell";
import { AdminStatusBadge, adminInputClass, formatInrFromPaise } from "@/components/admin/adminUi";
import BrandLogo from "@/components/BrandLogo";
import { FLUORO_GREEN } from "@/components/sections/Reveal";
import { pricingPlans } from "@/lib/pricingPlans";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type ClientRow = {
  id: string;
  email: string;
  mobile: string | null;
  planId: string;
  planName: string;
  status: string;
  expiresAt: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  appLinked?: boolean;
  paymentCount?: number;
  totalPaidPaise?: number;
  lastAmountPaise?: number;
  lastPaidAt?: string | null;
};

type Stats = {
  total: number;
  active: number;
  expired: number;
  byPlan: Record<string, number>;
  paidOrders?: number;
  paidClients?: number;
  revenuePaise?: number;
};

export default function AdminPageContent() {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginBusy, setLoginBusy] = useState(false);

  const [clients, setClients] = useState<ClientRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("active");
  const [grantError, setGrantError] = useState<string | null>(null);
  const [grant, setGrant] = useState({ email: "", mobile: "", planId: "performance" });
  const [busy, setBusy] = useState(false);

  const loadDashboard = async (next?: { q?: string; status?: string }) => {
    const search = next?.q ?? q;
    const st = next?.status ?? status;
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (st) params.set("status", st);
    const [clientsRes, statsRes] = await Promise.all([
      fetch(`/api/admin/clients?${params}`, { cache: "no-store" }),
      fetch("/api/admin/stats", { cache: "no-store" }),
    ]);
    if (clientsRes.status === 401 || statsRes.status === 401) {
      setAuthenticated(false);
      return false;
    }
    const clientsData = (await clientsRes.json()) as {
      clients?: ClientRow[];
      error?: string;
      message?: string;
    };
    const statsData = (await statsRes.json()) as Stats & { error?: string; message?: string };
    if (!clientsRes.ok || !statsRes.ok) {
      setGrantError(
        statsData.error ||
          statsData.message ||
          clientsData.error ||
          clientsData.message ||
          "Could not load clients",
      );
      setClients([]);
      setStats(null);
      setAuthenticated(true);
      return false;
    }
    setGrantError(null);
    setClients(clientsData.clients || []);
    setStats(statsData);
    setAuthenticated(true);
    return true;
  };

  useEffect(() => {
    const boot = async () => {
      const session = await fetch("/api/admin/session", { cache: "no-store" });
      const data = (await session.json()) as { authenticated?: boolean };
      if (data.authenticated) {
        await loadDashboard();
      } else {
        setAuthenticated(false);
      }
      setReady(true);
    };
    void boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoginBusy(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Login failed");
      await loadDashboard();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoginBusy(false);
    }
  };

  const onSearch = async (event: FormEvent) => {
    event.preventDefault();
    await loadDashboard();
  };

  const onGrant = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setGrantError(null);
    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(grant),
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) throw new Error(data.error || data.message || "Could not grant access");
      setGrant({ email: "", mobile: "", planId: "performance" });
      await loadDashboard();
    } catch (err) {
      setGrantError(err instanceof Error ? err.message : "Grant failed");
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setClients([]);
    setStats(null);
    setPassword("");
  };

  if (!ready) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[var(--background)] px-4 text-center text-[color:var(--muted)]">
        Loading admin…
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
        <div className="mx-auto flex min-h-dvh max-w-md items-center px-4 py-8 sm:px-5">
          <form
            onSubmit={onLogin}
            className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--card)] p-5 sm:rounded-[1.75rem] sm:p-8"
          >
            <div className="mb-5 flex items-center gap-3 sm:mb-6">
              <BrandLogo className="h-8 w-auto shrink-0 text-[var(--foreground)]" title="" />
              <div className="min-w-0">
                <p className="text-[0.65rem] tracking-[0.28em] text-[color:var(--muted)] uppercase sm:text-[0.7rem] sm:tracking-[0.35em]">
                  Coach access
                </p>
                <p className="text-sm font-semibold">Hybrid Pro admin</p>
              </div>
            </div>
            <h1
              className="text-3xl leading-[0.95] tracking-[0.02em] uppercase sm:text-4xl"
              style={{ fontFamily: "var(--font-bebas), sans-serif" }}
            >
              Sign in
            </h1>
            <p className="mt-3 text-sm text-[color:var(--muted)]">
              Enter your coach credentials to manage clients and 30-day access.
            </p>
            <label className="mt-6 block text-sm">
              <span className="mb-1.5 block text-[color:var(--muted)]">Email</span>
              <input
                required
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={adminInputClass}
              />
            </label>
            <label className="mt-4 block text-sm">
              <span className="mb-1.5 block text-[color:var(--muted)]">Password</span>
              <input
                required
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={adminInputClass}
              />
            </label>
            {loginError && (
              <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
                {loginError}
              </p>
            )}
            <button
              type="submit"
              disabled={loginBusy}
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full px-6 text-sm font-bold text-black disabled:opacity-50"
              style={{ background: FLUORO_GREEN }}
            >
              {loginBusy ? "Signing in…" : "Enter admin"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <AdminShell onLogout={logout}>
      <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
        <header className="hidden lg:block">
          <p className="text-[0.7rem] tracking-[0.35em] text-[color:var(--muted)] uppercase">
            Hybrid Pro
          </p>
          <h1
            className="mt-2 text-5xl leading-[0.95] tracking-[0.02em] uppercase"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            Clients
          </h1>
          <p className="mt-3 text-sm text-[color:var(--muted)]">
            Plans and 30-day access in one place.
          </p>
        </header>
        <p className="text-sm text-[color:var(--muted)] lg:hidden">
          Plans and 30-day access in one place.
        </p>

          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              ["Active clients", stats?.active ?? 0],
              ["Paid clients", stats?.paidClients ?? 0],
              ["Collected", formatInrFromPaise(stats?.revenuePaise ?? 0)],
              ["Paid orders", stats?.paidOrders ?? 0],
              ["Foundation", stats?.byPlan?.foundation ?? 0],
              ["Performance", stats?.byPlan?.performance ?? 0],
              ["Elite", stats?.byPlan?.elite ?? 0],
              ["Expired", stats?.expired ?? 0],
            ].map(([label, value]) => (
              <button
                key={String(label)}
                type="button"
                onClick={() => {
                  let next = status;
                  if (label === "Active clients") next = "active";
                  else if (label === "Expired") next = "expired";
                  else if (label === "Paid clients" || label === "Paid orders" || label === "Collected") {
                    next = "";
                  } else {
                    return;
                  }
                  setStatus(next);
                  void loadDashboard({ status: next });
                }}
                className="rounded-2xl border border-[color:var(--border)] bg-[var(--card)] p-3.5 text-left sm:p-4"
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
              </button>
            ))}
          </section>

          <section className="rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--card)] p-4 sm:rounded-[1.75rem] sm:p-6">
            <h2
              className="text-xl uppercase tracking-[0.02em] sm:text-2xl"
              style={{ fontFamily: "var(--font-bebas), sans-serif" }}
            >
              Grant access
            </h2>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              Use this when someone paid offline, or you want to start a client without checkout.
            </p>
            <form
              onSubmit={onGrant}
              className="mt-4 grid gap-3 md:grid-cols-[1.3fr_1fr_1fr_auto]"
            >
              <input
                required
                type="email"
                inputMode="email"
                placeholder="Client email"
                value={grant.email}
                onChange={(e) => setGrant((s) => ({ ...s, email: e.target.value }))}
                className={adminInputClass}
              />
              <input
                type="tel"
                inputMode="tel"
                placeholder="Mobile (optional)"
                value={grant.mobile}
                onChange={(e) => setGrant((s) => ({ ...s, mobile: e.target.value }))}
                className={adminInputClass}
              />
              <select
                value={grant.planId}
                onChange={(e) => setGrant((s) => ({ ...s, planId: e.target.value }))}
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
                className="h-12 rounded-full px-5 text-sm font-bold text-black disabled:opacity-60 md:min-w-[9.5rem]"
                style={{ background: FLUORO_GREEN }}
              >
                {busy ? "Saving…" : "Grant 30 days"}
              </button>
            </form>
            {grantError && <p className="mt-3 text-sm text-red-500">{grantError}</p>}
          </section>

          <section className="space-y-4">
            <div>
              <h2
                className="text-xl uppercase tracking-[0.02em] sm:text-2xl"
                style={{ fontFamily: "var(--font-bebas), sans-serif" }}
              >
                {status === "active"
                  ? "Active clients"
                  : status === "expired"
                    ? "Expired clients"
                    : status === "cancelled"
                      ? "Cancelled clients"
                      : "All clients"}
              </h2>
              <p className="mt-1 text-sm text-[color:var(--muted)]">
                Paid amount, last payment, and whether they have signed into the app.
              </p>
            </div>
            <form onSubmit={onSearch} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name, email, or mobile"
                className={`flex-1 ${adminInputClass} bg-[var(--card)]`}
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`${adminInputClass} bg-[var(--card)] sm:w-44`}
              >
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                type="submit"
                className="h-12 rounded-full border border-[color:var(--border)] px-5 text-sm sm:w-auto"
              >
                Filter
              </button>
            </form>

            <div className="space-y-3 md:hidden">
              {clients.map((client) => (
                <Link
                  key={client.id}
                  href={`/admin/clients/${client.id}`}
                  className="block rounded-2xl border border-[color:var(--border)] bg-[var(--card)] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {client.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={client.avatarUrl}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[color:var(--border)] text-sm font-semibold">
                          {(client.fullName || client.email).slice(0, 1).toUpperCase()}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-medium">{client.fullName || client.email}</p>
                        {client.fullName ? (
                          <p className="mt-0.5 truncate text-xs text-[color:var(--muted)]">
                            {client.email}
                          </p>
                        ) : client.mobile ? (
                          <p className="mt-0.5 text-xs text-[color:var(--muted)]">{client.mobile}</p>
                        ) : null}
                        <p className="mt-0.5 text-[0.65rem] text-[color:var(--muted)]">
                          {client.appLinked ? "App account linked" : "Has not signed into the app"}
                        </p>
                      </div>
                    </div>
                    <AdminStatusBadge status={client.status} />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                    <span className="truncate">{client.planName}</span>
                    <span className="shrink-0 font-semibold" style={{ color: FLUORO_GREEN }}>
                      {(client.paymentCount ?? 0) > 0
                        ? formatInrFromPaise(client.totalPaidPaise ?? 0)
                        : client.paymentCount == null
                          ? "—"
                          : "Unpaid"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[color:var(--muted)]">
                    {client.lastPaidAt
                      ? `Last paid ${new Date(client.lastPaidAt).toLocaleDateString()}`
                      : "No payment recorded"}
                    {" · "}
                    {client.expiresAt
                      ? `Expires ${new Date(client.expiresAt).toLocaleDateString()}`
                      : "No expiry"}
                  </p>
                </Link>
              ))}
              {clients.length === 0 && (
                <p className="rounded-2xl border border-[color:var(--border)] px-4 py-10 text-center text-sm text-[color:var(--muted)]">
                  No {status === "active" ? "active " : ""}clients yet. Grant access or wait for a website checkout.
                </p>
              )}
            </div>

            <div className="hidden overflow-x-auto rounded-[1.75rem] border border-[color:var(--border)] md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--card)] text-[color:var(--muted)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Client</th>
                    <th className="px-4 py-3 font-medium">Plan</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Paid</th>
                    <th className="px-4 py-3 font-medium">Last payment</th>
                    <th className="px-4 py-3 font-medium">Expires</th>
                    <th className="px-4 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-t border-[color:var(--border)]">
                      <td className="px-4 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          {client.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={client.avatarUrl}
                              alt=""
                              className="h-9 w-9 shrink-0 rounded-full object-cover"
                            />
                          ) : (
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[color:var(--border)] text-xs font-semibold">
                              {(client.fullName || client.email).slice(0, 1).toUpperCase()}
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="max-w-[18rem] truncate font-medium">
                              {client.fullName || client.email}
                            </p>
                            {client.fullName ? (
                              <p className="truncate text-xs text-[color:var(--muted)]">
                                {client.email}
                              </p>
                            ) : client.mobile ? (
                              <p className="text-xs text-[color:var(--muted)]">{client.mobile}</p>
                            ) : null}
                            <p className="text-[0.65rem] text-[color:var(--muted)]">
                              {client.appLinked ? "App account linked" : "Has not signed into the app"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{client.planName}</td>
                      <td className="px-4 py-3">
                        <AdminStatusBadge status={client.status} />
                      </td>
                      <td className="px-4 py-3">
                        {(client.paymentCount ?? 0) > 0 ? (
                          <div>
                            <p>{formatInrFromPaise(client.totalPaidPaise ?? 0)}</p>
                            <p className="text-xs text-[color:var(--muted)]">
                              {client.paymentCount}{" "}
                              {client.paymentCount === 1 ? "order" : "orders"}
                            </p>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {client.lastPaidAt
                          ? new Date(client.lastPaidAt).toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {client.expiresAt
                          ? new Date(client.expiresAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/clients/${client.id}`}
                          className="font-semibold"
                          style={{ color: FLUORO_GREEN }}
                        >
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {clients.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-10 text-center text-[color:var(--muted)]"
                      >
                        No {status === "active" ? "active " : ""}clients yet. Grant access or wait for a website checkout.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
    </AdminShell>
  );
}
