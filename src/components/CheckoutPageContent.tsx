"use client";

import BrandLogo from "@/components/BrandLogo";
import SiteNavbar from "@/components/SiteNavbar";
import ThemeGlassToggle from "@/components/ui/ThemeGlassToggle";
import { FLUORO_GREEN } from "@/components/sections/Reveal";
import { getPricingPlan, type PricingPlanId } from "@/lib/pricingPlans";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, Suspense, useMemo, useState } from "react";

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = (searchParams.get("plan") || "") as PricingPlanId;
  const plan = useMemo(() => getPricingPlan(planId), [planId]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!plan) {
    return (
      <div className="mx-auto max-w-lg px-5 py-28 text-center">
        <h1
          className="text-4xl uppercase tracking-[0.02em]"
          style={{ fontFamily: "var(--font-bebas), sans-serif" }}
        >
          Plan not found
        </h1>
        <p className="mt-4 text-[color:var(--muted)]">
          Choose a coaching plan from the pricing page.
        </p>
        <Link
          href="/pricing"
          className="mt-8 inline-flex rounded-full px-6 py-3 text-sm font-bold text-black"
          style={{ background: FLUORO_GREEN }}
        >
          View pricing
        </Link>
      </div>
    );
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
        }),
      });
      const data = (await res.json()) as {
        redirectUrl?: string;
        error?: string;
      };

      if (!res.ok || !data.redirectUrl) {
        throw new Error(data.error || "Could not start payment");
      }

      window.location.href = data.redirectUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment start failed");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-10 px-5 py-28 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
      <div>
        <p className="text-[0.7rem] tracking-[0.35em] text-[color:var(--muted)] uppercase">
          Checkout · Pine Labs
        </p>
        <h1
          className="mt-3 text-4xl leading-[0.95] tracking-[0.02em] uppercase sm:text-5xl"
          style={{ fontFamily: "var(--font-bebas), sans-serif" }}
        >
          {plan.name}
        </h1>
        <p className="mt-4 text-[color:var(--muted)]">{plan.blurb}</p>

        <div
          className="mt-8 rounded-3xl border border-[color:var(--border)] p-6"
          style={{ background: "var(--card)" }}
        >
          <p className="text-[0.65rem] tracking-[0.28em] text-[color:var(--muted)] uppercase">
            Amount due
          </p>
          <p
            className="mt-2 text-5xl tracking-[0.02em]"
            style={{
              color: FLUORO_GREEN,
              fontFamily: "var(--font-bebas), sans-serif",
            }}
          >
            {plan.price}
            <span className="ml-2 text-base tracking-[0.12em] text-[color:var(--muted)]">
              {plan.cadence}
            </span>
          </p>
          <ul className="mt-5 space-y-2 border-t border-[color:var(--border)] pt-5">
            {plan.included.slice(0, 4).map((item) => (
              <li key={item} className="text-sm text-[var(--foreground)]">
                · {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--card)] p-6 sm:p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <BrandLogo className="h-8 w-auto text-[var(--foreground)]" title="" />
          <div>
            <p className="text-sm font-semibold">Buyer details</p>
            <p className="text-xs text-[color:var(--muted)]">
              You’ll be redirected to Pine Labs secure checkout
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1.5 block text-[color:var(--muted)]">
              First name
            </span>
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[color:var(--brand-green)]"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-[color:var(--muted)]">
              Last name
            </span>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[color:var(--brand-green)]"
            />
          </label>
        </div>

        <label className="mt-4 block text-sm">
          <span className="mb-1.5 block text-[color:var(--muted)]">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[color:var(--brand-green)]"
          />
        </label>

        <label className="mt-4 block text-sm">
          <span className="mb-1.5 block text-[color:var(--muted)]">
            Mobile (India)
          </span>
          <input
            required
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength={10}
            placeholder="10-digit number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
            className="w-full rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[color:var(--brand-green)]"
          />
        </label>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-left text-sm text-red-600 dark:text-red-300">
            <p className="whitespace-pre-wrap">{error}</p>
            <p className="mt-3 text-xs opacity-80">
              Tip: open{" "}
              <a className="underline" href="/api/payments/pinelabs-status">
                /api/payments/pinelabs-status
              </a>{" "}
              to see which Pine Labs host accepts your keys.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full px-6 py-4 text-sm font-bold text-black transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
          style={{ background: FLUORO_GREEN }}
        >
          {loading ? "Redirecting to Pine Labs…" : `Pay ${plan.price}`}
        </button>

        <button
          type="button"
          onClick={() => router.push("/pricing")}
          className="mt-3 w-full py-2 text-sm text-[color:var(--muted)] transition hover:text-[var(--foreground)]"
        >
          ← Back to plans
        </button>
      </form>
    </div>
  );
}

export default function CheckoutPageContent() {
  return (
    <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <SiteNavbar />
      <ThemeGlassToggle />
      <Suspense
        fallback={
          <div className="px-5 py-28 text-center text-[color:var(--muted)]">
            Loading checkout…
          </div>
        }
      >
        <CheckoutForm />
      </Suspense>
    </main>
  );
}
