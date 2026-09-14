"use client";

import AdminShell from "@/components/admin/AdminShell";
import { AdminStatusBadge } from "@/components/admin/adminUi";
import { FLUORO_GREEN } from "@/components/sections/Reveal";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/admin/contacts/${params.id}`, { cache: "no-store" });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = (await res.json()) as {
        submission?: Submission;
        error?: string;
        message?: string;
      };
      if (!res.ok || !data.submission) {
        setError(data.error || data.message || "Not found");
        return;
      }
      setRow(data.submission);
    };
    void load();
  }, [params.id, router]);

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
                {row.status === "new" ? "New enquiry" : "Read"}
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
      </div>
    </AdminShell>
  );
}
