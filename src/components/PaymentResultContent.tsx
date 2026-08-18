"use client";

import BrandLogo from "@/components/BrandLogo";
import SiteNavbar from "@/components/SiteNavbar";
import { FLUORO_GREEN } from "@/components/sections/Reveal";
import ThemeGlassToggle from "@/components/ui/ThemeGlassToggle";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResultBody({
  title,
  message,
  ok,
}: {
  title: string;
  message: string;
  ok: boolean;
}) {
  const params = useSearchParams();
  const orderId = params.get("order_id") || params.get("orderId");
  const status = params.get("status");

  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-lg flex-col items-center justify-center px-5 py-28 text-center">
      <BrandLogo className="mb-8 h-12 w-auto text-[var(--foreground)]" title="" />
      <p
        className="text-[0.7rem] tracking-[0.35em] uppercase"
        style={{ color: ok ? FLUORO_GREEN : "var(--muted)" }}
      >
        {ok ? "Payment successful" : "Payment incomplete"}
      </p>
      <h1
        className="mt-3 text-4xl uppercase tracking-[0.02em] sm:text-5xl"
        style={{ fontFamily: "var(--font-bebas), sans-serif" }}
      >
        {title}
      </h1>
      <p className="mt-4 text-[color:var(--muted)]">{message}</p>
      {(orderId || status) && (
        <p className="mt-6 text-xs tracking-[0.12em] text-[color:var(--muted-soft)] uppercase">
          {orderId ? `Order ${orderId}` : null}
          {orderId && status ? " · " : null}
          {status ? `Status ${status}` : null}
        </p>
      )}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/#contact"
          className="inline-flex rounded-full px-6 py-3 text-sm font-bold text-black"
          style={{ background: FLUORO_GREEN }}
        >
          Talk to Akash
        </Link>
        <Link
          href="/pricing"
          className="inline-flex rounded-full border border-[color:var(--border)] px-6 py-3 text-sm font-semibold"
        >
          Back to pricing
        </Link>
      </div>
    </div>
  );
}

export function PaymentSuccessContent() {
  return (
    <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <SiteNavbar />
      <ThemeGlassToggle />
      <Suspense fallback={null}>
        <ResultBody
          ok
          title="You’re in"
          message="Thanks for joining Hybrid Pro. We’ll confirm your plan and reach out with next steps shortly."
        />
      </Suspense>
    </main>
  );
}

export function PaymentFailureContent() {
  return (
    <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <SiteNavbar />
      <ThemeGlassToggle />
      <Suspense fallback={null}>
        <ResultBody
          ok={false}
          title="Payment not completed"
          message="No charge went through, or the payment was cancelled. You can try again anytime from pricing."
        />
      </Suspense>
    </main>
  );
}
