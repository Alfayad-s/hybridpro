"use client";

import AdminShell from "@/components/admin/AdminShell";
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
};

type Stats = {
  total: number;
  active: number;
  expired: number;
  byPlan: Record<string, number>;
};

const inputClass =
  "w-full rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[color:var(--brand-green)]";

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
  const [status, setStatus] = useState("");
  const [grantError, setGrantError] = useState<string | null>(null);
  const [grant, setGrant] = useState({ email: "", mobile: "", planId: "performance" });
  const [busy, setBusy] = useState(false);

  const loadDashboard = async () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
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
      <main className="min-h-dvh bg-[var(--background)] px-5 py-16 text-center text-[color:var(--muted)]">
        Loading admin…
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
        <div className="mx-auto flex min-h-dvh max-w-md items-center px-5">
          <form
            onSubmit={onLogin}
            className="w-full rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--card)] p-6 sm:p-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <BrandLogo className="h-8 w-auto text-[var(--foreground)]" title="" />
              <div>
                <p className="text-[0.7rem] tracking-[0.35em] text-[color:var(--muted)] uppercase">
                  Coach access
                </p>
                <p className="text-sm font-semibold">Hybrid Pro admin</p>
              </div>
            </div>
            <h1
              className="text-4xl leading-[0.95] tracking-[0.02em] uppercase"
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="mt-4 block text-sm">
              <span className="mb-1.5 block text-[color:var(--muted)]">Password</span>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
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
              className="mt-6 inline-flex w-full items-center justify-center rounded-full px-6 py-4 text-sm font-bold text-black disabled:opacity-50"
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
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <p className="text-[0.7rem] tracking-[0.35em] text-[color:var(--muted)] uppercase">
            Hybrid Pro
          </p>
          <h1
            className="mt-2 text-4xl leading-[0.95] tracking-[0.02em] uppercase sm:text-5xl"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            Clients
          </h1>
          <p className="mt-3 text-sm text-[color:var(--muted)]">
            Plans and 30-day access in one place.
          </p>
        </header>

          <section className="grid gap-3 sm:grid-cols-4">
            {[
              ["Active", stats?.active ?? 0],
              ["Foundation", stats?.byPlan?.foundation ?? 0],
              ["Performance", stats?.byPlan?.performance ?? 0],
              ["Elite", stats?.byPlan?.elite ?? 0],
            ].map(([label, value]) => (
              <div
                key={String(label)}
                className="rounded-2xl border border-[color:var(--border)] bg-[var(--card)] p-4"
              >
                <p className="text-[0.65rem] tracking-[0.2em] text-[color:var(--muted)] uppercase">
                  {label}
                </p>
                <p
                  className="mt-2 text-4xl tracking-[0.02em]"
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

          <section className="rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--card)] p-5 sm:p-6">
            <h2
              className="text-2xl uppercase tracking-[0.02em]"
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
                placeholder="Client email"
                value={grant.email}
                onChange={(e) => setGrant((s) => ({ ...s, email: e.target.value }))}
                className={inputClass}
              />
              <input
                placeholder="Mobile (optional)"
                value={grant.mobile}
                onChange={(e) => setGrant((s) => ({ ...s, mobile: e.target.value }))}
                className={inputClass}
              />
              <select
                value={grant.planId}
                onChange={(e) => setGrant((s) => ({ ...s, planId: e.target.value }))}
                className={`${inputClass} bg-[var(--background)]`}
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
                className="rounded-full px-5 py-3 text-sm font-bold text-black disabled:opacity-60"
                style={{ background: FLUORO_GREEN }}
              >
                {busy ? "Saving…" : "Grant 30 days"}
              </button>
            </form>
            {grantError && <p className="mt-3 text-sm text-red-500">{grantError}</p>}
          </section>

          <section className="space-y-4">
            <form onSubmit={onSearch} className="flex flex-wrap gap-3">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search email or mobile"
                className={`min-w-[220px] flex-1 ${inputClass} bg-[var(--card)]`}
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`${inputClass} w-auto bg-[var(--card)]`}
              >
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                type="submit"
                className="rounded-full border border-[color:var(--border)] px-4 py-2 text-sm"
              >
                Filter
              </button>
            </form>

            <div className="overflow-x-auto rounded-[1.75rem] border border-[color:var(--border)]">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-[var(--card)] text-[color:var(--muted)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Client</th>
                    <th className="px-4 py-3 font-medium">Plan</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Expires</th>
                    <th className="px-4 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-t border-[color:var(--border)]">
                      <td className="px-4 py-3">
                        <p>{client.email}</p>
                        {client.mobile && (
                          <p className="text-xs text-[color:var(--muted)]">{client.mobile}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">{client.planName}</td>
                      <td className="px-4 py-3 capitalize">{client.status}</td>
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
                        colSpan={5}
                        className="px-4 py-10 text-center text-[color:var(--muted)]"
                      >
                        No clients yet. Grant access or wait for a website checkout.
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
