"use client";

import SiteNavbar from "@/components/SiteNavbar";
import { FLUORO_GREEN } from "@/components/sections/Reveal";
import ThemeGlassToggle from "@/components/ui/ThemeGlassToggle";
import { formatInr } from "@/lib/shopCatalog";
import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { DeliveryPinMap, type DeliveryPin } from "./DeliveryPinMap";
import TearTicket from "./TearTicket";

export function ShopCheckoutPage() {
  const cart = useCart();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [floor, setFloor] = useState("");
  const [pin, setPin] = useState<DeliveryPin | null>(null);
  const [loading, setLoading] = useState(false);
  const [torn, setTorn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detailsReady =
    fullName.trim().length > 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    mobile.length === 10 &&
    floor.trim().length > 0 &&
    Boolean(pin?.address) &&
    pin?.pincode.length === 6;
  const canPay = detailsReady && !loading && !torn;
  const started = useRef(false);

  const startPayment = async () => {
    if (started.current) return;
    setError(null);
    if (!detailsReady) {
      setTorn(false);
      setError(
        "Add your name, email, 10-digit mobile, floor, and a pinned address with a 6-digit PIN code.",
      );
      return;
    }
    started.current = true;
    setTorn(true);
    setLoading(true);
    try {
      const res = await fetch("/api/payments/shop-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          mobile,
          floor: floor.trim(),
          mapAddress: pin?.address ?? "",
          city: pin?.city ?? "",
          pincode: pin?.pincode ?? "",
          items: cart.lines.map((line) => ({
            slug: line.slug,
            size: line.size,
            qty: line.qty,
          })),
        }),
      });
      const data = (await res.json()) as { redirectUrl?: string; error?: string };
      if (!res.ok || !data.redirectUrl) {
        throw new Error(data.error || "Could not start payment");
      }
      window.location.href = data.redirectUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment start failed");
      started.current = false;
      setLoading(false);
      setTorn(false);
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <style>{`
        html, body {
          scrollbar-width: none;
        }
        html::-webkit-scrollbar,
        body::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <SiteNavbar />
      <ThemeGlassToggle />
      <section className="mx-auto flex w-full max-w-xl flex-col gap-10 px-4 pt-28 pb-20 sm:px-6 lg:h-dvh lg:max-w-6xl lg:gap-6 lg:overflow-hidden lg:px-10 lg:pt-[calc(var(--site-nav-height,4.75rem)+1.25rem)] lg:pb-6">
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-8">
          <div>
            <p
              className="text-[0.7rem] tracking-[0.35em] uppercase"
              style={{ color: FLUORO_GREEN }}
            >
              Checkout
            </p>
            <h1
              className="mt-2 text-5xl uppercase lg:mt-1 lg:text-6xl"
              style={{ fontFamily: "var(--font-bebas), sans-serif" }}
            >
              Pay with Pine Labs
            </h1>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)] lg:mt-0 lg:max-w-xs lg:text-right">
            Cards, UPI, and netbanking. The amount is the cart total. Coaching
            plans stay on the pricing page.
          </p>
        </div>

        {!cart.ready ? null : cart.items.length === 0 ? (
          <div>
            <p className="text-[color:var(--muted)]">Your cart is empty.</p>
            <Link href="/shop" className="mt-4 inline-flex underline">
              Back to shop
            </Link>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-4 lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-2 lg:items-stretch lg:gap-8"
          >
            <div className="flex flex-col gap-4 lg:min-h-0">
            <DeliveryPinMap onChange={setPin} className="lg:min-h-0 lg:flex-1" />
            <label className="text-sm">
              <span className="mb-1.5 block text-[color:var(--muted)]">Map address</span>
              <input
                required
                readOnly
                value={pin?.address ?? ""}
                placeholder="Pin the map to fill this address"
                className="w-full rounded-xl border border-[color:var(--border)] bg-[var(--card)] px-4 py-3 outline-none lg:py-2.5"
              />
              {pin && pin.pincode.length !== 6 ? (
                <span className="mt-1.5 block text-red-600">
                  Move the pin onto a location with a 6-digit PIN code.
                </span>
              ) : null}
            </label>
            </div>
            <div className="flex flex-col gap-4 lg:min-h-0 lg:justify-center">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1.5 block text-[color:var(--muted)]">Full name</span>
              <input
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-3 outline-none lg:py-2.5"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-[color:var(--muted)]">Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-3 outline-none lg:py-2.5"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-[color:var(--muted)]">Mobile</span>
              <input
                required
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                value={mobile}
                onChange={(event) =>
                  setMobile(event.target.value.replace(/\D/g, "").slice(0, 10))
                }
                className="w-full rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-3 outline-none lg:py-2.5"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-[color:var(--muted)]">
                Floor, flat, or building
              </span>
              <input
                required
                value={floor}
                onChange={(event) => setFloor(event.target.value)}
                placeholder="Floor 3, Tower B"
                className="w-full rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-3 outline-none lg:py-2.5"
              />
            </label>
            </div>
            {error ? (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            ) : null}
            <TearTicket
              torn={torn}
              onTear={() => {
                void startPayment();
              }}
              disabled={!canPay}
              tilt={false}
              rotate={0}
              recenter={false}
              width={520}
              height={328}
              stubSize={118}
              background="var(--card)"
              color="var(--foreground)"
              stubBackground="#111111"
              borderColor="color-mix(in srgb, var(--foreground) 16%, transparent)"
              ariaLabel={loading ? "Opening payment" : `Tear the stub to pay ${cart.totalLabel}`}
              className="mt-2 w-full"
              stub={
                <div className="flex h-full flex-col items-center justify-center px-3 text-center text-white">
                  <span className="text-[10px] tracking-[0.28em] uppercase">
                    {loading ? "Opening" : "Tear"}
                  </span>
                  <span
                    className="mt-1 text-[2rem] leading-none"
                    style={{ fontFamily: "var(--font-bebas), sans-serif", color: FLUORO_GREEN }}
                  >
                    {cart.totalLabel}
                  </span>
                  <span className="mt-1 text-[10px] tracking-[0.16em] text-white/70 uppercase">
                    {loading ? "Pine Labs" : "to pay"}
                  </span>
                </div>
              }
            >
              <div className="flex h-full flex-col px-4 pt-3 pb-5">
                <div className="flex h-14 items-end">
                  {cart.items.slice(0, 4).map((item, index) => (
                    <div
                      key={`${item.slug}-${item.size}-stack`}
                      className="relative h-14 w-11 overflow-hidden rounded-md border-2 border-white bg-white shadow-md"
                      style={{ marginLeft: index === 0 ? 0 : -18, zIndex: 8 - index }}
                    >
                      <Image
                        src={item.product.image}
                        alt=""
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {cart.items.length > 4 ? (
                    <span className="mb-1 ml-2 text-[11px] text-[color:var(--muted)]">
                      +{cart.items.length - 4}
                    </span>
                  ) : null}
                </div>
                <dl className="mt-2.5 grid grid-cols-[4.25rem_minmax(0,1fr)] items-baseline gap-x-3 gap-y-1 text-[11px] leading-4">
                  {(
                    [
                      ["Name", fullName.trim()],
                      ["Email", email.trim()],
                      ["Mobile", mobile],
                      ["Floor", floor.trim()],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label} className="contents">
                      <dt className="text-[9px] tracking-[0.16em] text-[color:var(--muted)] uppercase">
                        {label}
                      </dt>
                      <dd className={`truncate ${value ? "" : "text-[color:var(--muted)]"}`}>
                        {value || "—"}
                      </dd>
                    </div>
                  ))}
                  <dt className="text-[9px] tracking-[0.16em] text-[color:var(--muted)] uppercase">
                    Address
                  </dt>
                  <dd
                    className={`line-clamp-2 leading-4 ${pin?.address ? "" : "text-[color:var(--muted)]"}`}
                  >
                    {pin?.address
                      ? [pin.address, pin.city, pin.pincode].filter(Boolean).join(", ")
                      : "—"}
                  </dd>
                </dl>
                <ul className="mt-auto flex flex-col gap-1 border-t border-[color:var(--border)] pt-2">
                  {cart.items.slice(0, 3).map((item) => (
                    <li
                      key={`${item.slug}-${item.size}`}
                      className="grid grid-cols-[minmax(0,1fr)_2.25rem_4.75rem] items-baseline gap-2 text-[12px] leading-4"
                    >
                      <span className="truncate">
                        {item.product.title}
                        {item.size ? (
                          <span className="text-[color:var(--muted)]"> · {item.size}</span>
                        ) : null}
                      </span>
                      <span className="text-right text-[color:var(--muted)] tabular-nums">
                        ×{item.qty}
                      </span>
                      <span className="text-right font-semibold tabular-nums">
                        {formatInr(item.linePaise)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </TearTicket>
            <p className="text-center text-xs text-[color:var(--muted)]">
              {canPay
                ? "Drag the stub until it tears. Payment starts once."
                : "Complete the details above, then tear the stub to pay."}
            </p>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
