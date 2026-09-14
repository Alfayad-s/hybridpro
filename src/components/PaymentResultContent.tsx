"use client";

import BrandLogo from "@/components/BrandLogo";
import SiteNavbar from "@/components/SiteNavbar";
import { FLUORO_GREEN } from "@/components/sections/Reveal";
import ThemeGlassToggle from "@/components/ui/ThemeGlassToggle";
import { GYM_APP_URL } from "@/lib/gymApp";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

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

function SuccessBody() {
  const params = useSearchParams();
  const orderId = params.get("order_id") || params.get("orderId");
  const email = params.get("email");
  const planId = params.get("plan");
  const userId = params.get("userId");
  const merchantOrderReference = params.get("ref");
  const [state, setState] = useState<"loading" | "ok" | "error">(
    orderId ? "loading" : "error",
  );
  const [message, setMessage] = useState(
    "Confirming your Hybrid Pro plan and unlocking the app…",
  );
  const [planName, setPlanName] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setState("error");
      setMessage("We could not find a payment order on this page. Contact Akash if you were charged.");
      return;
    }

    let cancelled = false;
    const activate = async () => {
      try {
        const res = await fetch("/api/payments/activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            email,
            planId,
            userId,
            merchantOrderReference,
          }),
        });
        const data = (await res.json()) as {
          error?: string;
          planName?: string;
        };
        if (!res.ok) {
          throw new Error(data.error || "Could not unlock app access");
        }
        if (cancelled) return;
        setPlanName(data.planName || null);
        setState("ok");
        setMessage(
          data.planName
            ? `${data.planName} is active for 30 days. Open the Hybrid Pro app and sign in with the same email to start training.`
            : "Payment confirmed. Open the Hybrid Pro app and sign in with the same email to start training.",
        );
      } catch (error) {
        if (cancelled) return;
        setState("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Payment succeeded, but app access is not unlocked yet. Contact Akash with your order id.",
        );
      }
    };

    void activate();
    return () => {
      cancelled = true;
    };
  }, [email, merchantOrderReference, orderId, planId, userId]);

  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-lg flex-col items-center justify-center px-5 py-28 text-center">
      <BrandLogo className="mb-8 h-12 w-auto text-[var(--foreground)]" title="" />
      {state === "ok" && (
        <div
          className="mb-5 grid h-16 w-16 place-items-center rounded-full text-2xl font-bold text-black"
          style={{ background: FLUORO_GREEN }}
          aria-hidden
        >
          ✓
        </div>
      )}
      <p
        className="text-[0.7rem] tracking-[0.35em] uppercase"
        style={{ color: state === "error" ? "var(--muted)" : FLUORO_GREEN }}
      >
        {state === "loading"
          ? "Activating access"
          : state === "ok"
            ? "Payment successful"
            : "Needs a follow-up"}
      </p>
      <h1
        className="mt-3 text-4xl uppercase tracking-[0.02em] sm:text-5xl"
        style={{ fontFamily: "var(--font-bebas), sans-serif" }}
      >
        {state === "ok" ? "Welcome to Hybrid Pro" : state === "loading" ? "One moment" : "Almost there"}
      </h1>
      <p className="mt-4 text-[color:var(--muted)]">{message}</p>
      {planName && state === "ok" && (
        <p className="mt-3 text-sm font-semibold">{planName}</p>
      )}
      {orderId && (
        <p className="mt-6 text-xs tracking-[0.12em] text-[color:var(--muted-soft)] uppercase">
          Order {orderId}
        </p>
      )}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <a
          href={`${GYM_APP_URL}/login?welcome=1${email ? `&email=${encodeURIComponent(email)}` : ""}`}
          className="inline-flex rounded-full px-6 py-3 text-sm font-bold text-black"
          style={{ background: FLUORO_GREEN }}
        >
          Open Hybrid Pro app
        </a>
        <Link
          href="/#contact"
          className="inline-flex rounded-full border border-[color:var(--border)] px-6 py-3 text-sm font-semibold"
        >
          Talk to Akash
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
        <SuccessBody />
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
