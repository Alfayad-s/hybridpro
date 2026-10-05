"use client";

import SiteNavbar from "@/components/SiteNavbar";
import { useCart } from "@/components/shop/CartProvider";
import { ShopBottomNav } from "@/components/shop/ShopBottomNav";
import { useWishlist } from "@/components/shop/WishlistProvider";
import { FLUORO_GREEN } from "@/components/sections/Reveal";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ShopProduct } from "@/lib/shopCatalog";

export function WishlistPage() {
  const wishlist = useWishlist();

  return (
    <main className="min-h-screen bg-[var(--background)] pb-28">
      <SiteNavbar />
      <section className="mx-auto w-full max-w-3xl px-4 pt-28 pb-8 sm:px-6">
        <p
          className="text-[0.7rem] tracking-[0.35em] uppercase"
          style={{ color: FLUORO_GREEN }}
        >
          Saved
        </p>
        <h1
          className="mt-2 text-5xl uppercase text-[var(--foreground)]"
          style={{ fontFamily: "var(--font-bebas), sans-serif" }}
        >
          Wishlist
        </h1>
        {!wishlist.ready ? null : wishlist.items.length === 0 ? (
          <div className="mt-10">
            <p className="text-[color:var(--muted)]">Nothing saved yet.</p>
            <Link
              href="/shop"
              className="mt-6 flex items-center gap-4 rounded-2xl border border-dashed border-[color:var(--border)] px-4 py-5"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[color:var(--border)] text-2xl leading-none">
                +
              </span>
              <span>
                <span className="block font-semibold">Add items</span>
                <span className="mt-0.5 block text-sm text-[color:var(--muted)]">
                  Go to the shop
                </span>
              </span>
            </Link>
          </div>
        ) : (
          <ul className="mt-8 flex flex-col gap-4">
            {wishlist.items.map((product) => (
              <WishlistRow key={product.slug} product={product} />
            ))}
          </ul>
        )}
      </section>
      <ShopBottomNav />
    </main>
  );
}

function WishlistRow({ product }: { product: ShopProduct }) {
  const cart = useCart();
  const wishlist = useWishlist();
  const [size, setSize] = useState(product.sizes?.[0] ?? "");
  const inCart = cart.lines.some(
    (line) => line.slug === product.slug && line.size === size,
  );

  return (
    <li className="flex gap-4 border-b border-[color:var(--border)] pb-4">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[var(--card)]">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="96px"
          className="object-contain p-2"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{product.title}</p>
        <p className="mt-1 text-sm">{product.priceLabel}</p>
        {product.sizes ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.sizes.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSize(option)}
                className="rounded-full px-2.5 py-1 text-[0.65rem] font-semibold"
                style={{
                  background: size === option ? FLUORO_GREEN : "transparent",
                  color: size === option ? "#111" : "var(--foreground)",
                  border: "1px solid var(--border)",
                }}
              >
                {option}
              </button>
            ))}
          </div>
        ) : null}
        <div className="mt-3 flex items-center gap-3">
          {inCart ? (
            <Link
              href="/shop/cart"
              className="inline-flex rounded-full px-4 py-2 text-xs font-semibold text-black"
              style={{ background: FLUORO_GREEN }}
            >
              Go to cart
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => cart.add(product.slug, size)}
              className="inline-flex rounded-full px-4 py-2 text-xs font-semibold text-black"
              style={{ background: FLUORO_GREEN }}
            >
              Add to cart
            </button>
          )}
          <button
            type="button"
            onClick={() => wishlist.remove(product.slug)}
            className="text-xs tracking-[0.12em] text-[color:var(--muted)] uppercase"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
