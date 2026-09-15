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
  const alreadyActivated = params.get("activated") === "1";
  const [state, setState] = useState<"loading" | "ok" | "error">(
    alreadyActivated ? "ok" : orderId ? "loading" : "error",
  );
  const [message, setMessage] = useState(
    alreadyActivated
      ? "Payment confirmed. Opening the Hybrid Pro app…"
      : "Confirming your Hybrid Pro plan and unlocking the app…",
  );
  const [planName, setPlanName] = useState<string | null>(null);
  const [unlockedEmail, setUnlockedEmail] = useState(email);

  useEffect(() => {
    if (alreadyActivated) {
      setState("ok");
      return;
    }
    if (!orderId) {
      setState("error");
      setMessage("We could not find a payment order on this page. Contact Akash if you were charged.");
      return;
    }

    let cancelled = false;
    const activate = async () => {
      let stored: {
        email?: string;
        planId?: string;
        userId?: string;
        merchantOrderReference?: string;
        orderId?: string;
      } | null = null;
      try {
        stored = JSON.parse(sessionStorage.getItem("hp_checkout") || "null") as typeof stored;
      } catch {
        stored = null;
      }
      const storedMatches = stored?.orderId && stored.orderId === orderId ? stored : null;

      try {
        const res = await fetch("/api/payments/activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            email: email || storedMatches?.email,
            planId: planId || storedMatches?.planId,
            userId: userId || storedMatches?.userId,
            merchantOrderReference:
              merchantOrderReference || storedMatches?.merchantOrderReference,
          }),
        });
        const data = (await res.json()) as {
          error?: string;
          planName?: string;
          email?: string;
        };
        if (!res.ok) {
          throw new Error(data.error || "Could not unlock app access");
        }
        if (cancelled) return;
        setPlanName(data.planName || null);
        if (data.email) setUnlockedEmail(data.email);
        setState("ok");
        setMessage(
          data.planName
            ? `${data.planName} is active for 30 days. Opening the Hybrid Pro app…`
            : "Payment confirmed. Opening the Hybrid Pro app…",
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
  }, [alreadyActivated, email, merchantOrderReference, orderId, planId, userId]);

  const appHomeUrl = `${GYM_APP_URL}/dashboard${
    state === "ok"
      ? `?welcome=1${unlockedEmail ? `&email=${encodeURIComponent(unlockedEmail)}` : ""}`
      : ""
  }`;

  useEffect(() => {
    if (state !== "ok") return;
    const timer = window.setTimeout(() => {
      window.location.assign(appHomeUrl);
    }, 1600);
    return () => window.clearTimeout(timer);
  }, [appHomeUrl, state]);

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
          href={appHomeUrl}
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
