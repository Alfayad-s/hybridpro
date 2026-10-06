"use client";

import SiteNavbar from "@/components/SiteNavbar";
import { ShopBottomNav } from "@/components/shop/ShopBottomNav";
import { FLUORO_GREEN } from "@/components/sections/Reveal";
import { formatInr, type ShopProduct } from "@/lib/shopCatalog";
import Image from "next/image";
import Link from "next/link";
import { ParticleDeleteContainer } from "@/components/shop/ParticleDeleteContainer";
import { useCart } from "./CartProvider";

export function CartPage() {
  const cart = useCart();

  return (
    <main className="min-h-screen bg-[var(--background)] pb-28">
      <SiteNavbar />
      <section className="mx-auto w-full max-w-3xl px-4 pt-28 pb-8 sm:px-6">
        <p
          className="text-[0.7rem] tracking-[0.35em] uppercase"
          style={{ color: FLUORO_GREEN }}
        >
          Cart
        </p>
        <h1
          className="mt-2 text-5xl uppercase text-[var(--foreground)]"
          style={{ fontFamily: "var(--font-bebas), sans-serif" }}
        >
          Your bag
        </h1>

        {!cart.ready ? null : cart.items.length === 0 ? (
          <p className="mt-10 text-[color:var(--muted)]">Your cart is empty.</p>
        ) : (
          <>
            <div className="mt-8 flex flex-col gap-4">
              {cart.items.map((item) => (
                <CartRow key={`${item.slug}-${item.size}`} item={item} />
              ))}
            </div>
            <AddMoreItems />
            <div className="mt-8 flex items-end justify-between">
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
            <Link
              href="/shop/checkout"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-bold text-black"
              style={{ background: FLUORO_GREEN }}
            >
              Checkout
            </Link>
          </>
        )}
        {cart.ready && cart.items.length === 0 ? <AddMoreItems /> : null}
      </section>
      <ShopBottomNav />
    </main>
  );
}

function CartRow({
  item,
}: {
  item: {
    slug: string;
    size: string;
    qty: number;
    linePaise: number;
    product: ShopProduct;
  };
}) {
  const cart = useCart();

  return (
    <ParticleDeleteContainer
      onDelete={() => cart.remove(item.slug, item.size)}
      className="flex gap-4 border-b border-[color:var(--border)] pb-4"
    >
      {({ isDeleting, handleDelete }) => (
        <>
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[var(--card)]">
            <Image
              src={item.product.image}
              alt={item.product.title}
              fill
              sizes="96px"
              className="object-contain p-2"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{item.product.title}</p>
            {item.size ? (
              <p className="text-sm text-[color:var(--muted)]">Size {item.size}</p>
            ) : null}
            <p className="mt-1 text-sm">{formatInr(item.linePaise)}</p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                aria-label={`Decrease ${item.product.title}`}
                disabled={isDeleting}
                onClick={() => {
                  if (item.qty <= 1) handleDelete();
                  else cart.setQty(item.slug, item.size, item.qty - 1);
                }}
                className="h-8 w-8 rounded-full border border-[color:var(--border)] disabled:opacity-60"
              >
                −
              </button>
              <span className="w-6 text-center text-sm">{item.qty}</span>
              <button
                type="button"
                aria-label={`Increase ${item.product.title}`}
                disabled={isDeleting}
                onClick={() => cart.setQty(item.slug, item.size, item.qty + 1)}
                className="h-8 w-8 rounded-full border border-[color:var(--border)] disabled:opacity-60"
              >
                +
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="ml-auto text-xs tracking-[0.12em] text-[color:var(--muted)] uppercase disabled:opacity-60"
              >
                Remove
              </button>
            </div>
          </div>
        </>
      )}
    </ParticleDeleteContainer>
  );
}

function AddMoreItems() {
  return (
    <Link
      href="/shop"
      className="mt-6 flex items-center gap-4 rounded-2xl border border-dashed border-[color:var(--border)] px-4 py-5"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[color:var(--border)] text-2xl leading-none">
        +
      </span>
      <span>
        <span className="block font-semibold">Add more items</span>
        <span className="mt-0.5 block text-sm text-[color:var(--muted)]">
          Go to the shop
        </span>
      </span>
    </Link>
  );
}
