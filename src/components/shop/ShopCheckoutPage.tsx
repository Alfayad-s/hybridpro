"use client";

import SiteNavbar from "@/components/SiteNavbar";
import { FLUORO_GREEN } from "@/components/sections/Reveal";
import ThemeGlassToggle from "@/components/ui/ThemeGlassToggle";
import { formatInr } from "@/lib/shopCatalog";
import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { useCart } from "./CartProvider";
import { DeliveryPinMap, type DeliveryPin } from "./DeliveryPinMap";

export function ShopCheckoutPage() {
  const cart = useCart();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [floor, setFloor] = useState("");
  const [pin, setPin] = useState<DeliveryPin | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (cart.needsShipping && (!floor.trim() || !pin?.address || pin.pincode.length !== 6)) {
      setError(
        "Pin a delivery location that includes a 6-digit PIN code, and add the floor or building.",
      );
      return;
    }
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
      setLoading(false);
    }
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
      <section className="mx-auto flex w-full max-w-xl flex-col gap-10 px-4 pt-28 pb-20 sm:px-6">
        <div>
          <p
            className="text-[0.7rem] tracking-[0.35em] uppercase"
            style={{ color: FLUORO_GREEN }}
          >
            Checkout
          </p>
          <h1
            className="mt-2 text-5xl uppercase"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            Pay with Pine Labs
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)]">
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
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <label className="text-sm">
              <span className="mb-1.5 block text-[color:var(--muted)]">Full name</span>
              <input
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-3 outline-none"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-[color:var(--muted)]">Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-3 outline-none"
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
                className="w-full rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-3 outline-none"
              />
            </label>
            {cart.needsShipping ? (
              <>
                <label className="text-sm">
                  <span className="mb-1.5 block text-[color:var(--muted)]">
                    Floor, flat, or building
                  </span>
                  <input
                    required
                    value={floor}
                    onChange={(event) => setFloor(event.target.value)}
                    placeholder="Floor 3, Tower B"
                    className="w-full rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-3 outline-none"
                  />
                </label>
                <DeliveryPinMap onChange={setPin} />
                <label className="text-sm">
                  <span className="mb-1.5 block text-[color:var(--muted)]">
                    Map address
                  </span>
                  <input
                    required
                    readOnly
                    value={pin?.address ?? ""}
                    placeholder="Pin the map to fill this address"
                    className="w-full rounded-xl border border-[color:var(--border)] bg-[var(--card)] px-4 py-3 outline-none"
                  />
                  {pin && pin.pincode.length !== 6 ? (
                    <span className="mt-1.5 block text-red-600">
                      Move the pin onto a location with a 6-digit PIN code.
                    </span>
                  ) : null}
                </label>
              </>
            ) : null}
            {error ? (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full px-6 py-4 text-sm font-bold text-black disabled:opacity-50"
              style={{ background: FLUORO_GREEN }}
            >
              {loading ? "Opening Pine Labs…" : `Pay ${cart.totalLabel}`}
            </button>
          </form>
        )}

        {cart.ready && cart.items.length > 0 ? (
          <div>
            <p className="text-[0.7rem] tracking-[0.35em] text-[color:var(--muted)] uppercase">
              Your items
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {cart.items.map((item) => (
                <li
                  key={`${item.slug}-${item.size}`}
                  className="flex gap-4 rounded-2xl border border-[color:var(--border)] bg-[var(--card)] p-3"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[var(--background)]">
                    <Image
                      src={item.product.image}
                      alt={item.product.title}
                      fill
                      sizes="80px"
                      className="object-contain p-1.5"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <p className="font-semibold">{item.product.title}</p>
                    <p className="mt-0.5 text-sm text-[color:var(--muted)]">
                      {item.size ? `Size ${item.size} · ` : ""}Qty {item.qty}
                    </p>
                  </div>
                  <p className="self-center text-sm font-semibold">
                    {formatInr(item.linePaise)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-end justify-between px-1">
              <p className="text-sm tracking-[0.16em] text-[color:var(--muted)] uppercase">
                Total
              </p>
              <p
                className="text-4xl leading-none"
                style={{ fontFamily: "var(--font-bebas), sans-serif" }}
              >
                {cart.totalLabel}
              </p>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
