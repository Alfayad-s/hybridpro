"use client";

import AdminShell from "@/components/admin/AdminShell";
import { FLUORO_GREEN } from "@/components/sections/Reveal";
import Link from "next/link";
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

const inputClass =
  "w-full rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[color:var(--brand-green)]";

export default function AdminContactsContent() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    const res = await fetch(`/api/admin/contacts?${params}`, { cache: "no-store" });
    const data = (await res.json()) as {
      submissions?: Submission[];
      error?: string;
      message?: string;
    };
    if (res.status === 401) {
      window.location.href = "/admin";
      return;
    }
    if (!res.ok) {
      setError(data.error || data.message || "Could not load submissions");
      setRows([]);
      return;
    }
    setError(null);
    setRows(data.submissions || []);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = async (event: FormEvent) => {
    event.preventDefault();
    await load();
  };

  return (
    <AdminShell>
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <p className="text-[0.7rem] tracking-[0.35em] text-[color:var(--muted)] uppercase">
            Hybrid Pro
          </p>
          <h1
            className="mt-2 text-4xl leading-[0.95] tracking-[0.02em] uppercase sm:text-5xl"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            Contact submissions
          </h1>
          <p className="mt-3 text-sm text-[color:var(--muted)]">
            Messages from the website contact form.
          </p>
        </header>

        <form onSubmit={onSearch} className="flex flex-wrap gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, or goal"
            className={`min-w-[220px] flex-1 ${inputClass} bg-[var(--card)]`}
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`${inputClass} w-auto bg-[var(--card)]`}
          >
            <option value="">All</option>
            <option value="new">New</option>
            <option value="read">Read</option>
          </select>
          <button
            type="submit"
            className="rounded-full border border-[color:var(--border)] px-4 py-2 text-sm"
          >
            Filter
          </button>
        </form>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="overflow-x-auto rounded-[1.75rem] border border-[color:var(--border)]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-[var(--card)] text-[color:var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Goal</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-[color:var(--border)]">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(row.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-medium">{row.name}</td>
                  <td className="px-4 py-3">
                    <p>{row.email}</p>
                    {row.phone && (
                      <p className="text-xs text-[color:var(--muted)]">{row.phone}</p>
                    )}
                  </td>
                  <td className="max-w-[280px] truncate px-4 py-3">{row.goal}</td>
                  <td className="px-4 py-3 capitalize">{row.status}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/contacts/${row.id}`}
                      className="font-semibold"
                      style={{ color: FLUORO_GREEN }}
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[color:var(--muted)]">
                    No contact submissions yet.
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
