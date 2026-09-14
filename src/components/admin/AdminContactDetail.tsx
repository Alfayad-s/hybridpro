"use client";

import AdminShell from "@/components/admin/AdminShell";
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
      <div className="mx-auto max-w-3xl space-y-6">
        <Link href="/admin/contacts" className="text-sm text-[color:var(--muted)]">
          ← All submissions
        </Link>
        {!row && !error && <p className="text-[color:var(--muted)]">Loading…</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {row && (
          <section className="space-y-4 rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--card)] p-6">
            <p className="text-[0.7rem] tracking-[0.35em] text-[color:var(--muted)] uppercase">
              {row.status === "new" ? "New enquiry" : "Read"}
            </p>
            <h1
              className="text-4xl leading-[0.95] tracking-[0.02em] uppercase"
              style={{ fontFamily: "var(--font-bebas), sans-serif" }}
            >
              {row.name}
            </h1>
            <p>
              <a href={`mailto:${row.email}`} style={{ color: FLUORO_GREEN }}>
                {row.email}
              </a>
            </p>
            {row.phone && (
              <p>
                <a href={`tel:${row.phone}`}>{row.phone}</a>
              </p>
            )}
            <p className="text-sm text-[color:var(--muted)]">
              {new Date(row.createdAt).toLocaleString()}
            </p>
            <div className="border-t border-[color:var(--border)] pt-4">
              <p className="text-[0.65rem] tracking-[0.2em] text-[color:var(--muted)] uppercase">
                Goal
              </p>
              <p className="mt-2 whitespace-pre-wrap">{row.goal}</p>
            </div>
          </section>
        )}
      </div>
    </AdminShell>
  );
}
