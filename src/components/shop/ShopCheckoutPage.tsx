"use client";

import SiteNavbar from "@/components/SiteNavbar";
import { FLUORO_GREEN } from "@/components/sections/Reveal";
import ThemeGlassToggle from "@/components/ui/ThemeGlassToggle";
import { formatInr } from "@/lib/shopCatalog";
import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { useCart } from "./CartProvider";

export function ShopCheckoutPage() {
  const cart = useCart();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/payments/shop-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          mobile,
          address: address.trim(),
          city: city.trim(),
          pincode,
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
              <span className="mb-1.5 block text-[color:var(--muted)]">First name</span>
              <input
                required
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="w-full rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-3 outline-none"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-[color:var(--muted)]">Last name</span>
              <input
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
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
                    Delivery address
                  </span>
                  <input
                    required
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    className="w-full rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-3 outline-none"
                  />
                </label>
                <label className="text-sm">
                  <span className="mb-1.5 block text-[color:var(--muted)]">City</span>
                  <input
                    required
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    className="w-full rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-3 outline-none"
                  />
                </label>
                <label className="text-sm">
                  <span className="mb-1.5 block text-[color:var(--muted)]">PIN code</span>
                  <input
                    required
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    value={pincode}
                    onChange={(event) =>
                      setPincode(event.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className="w-full rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-3 outline-none"
                  />
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
