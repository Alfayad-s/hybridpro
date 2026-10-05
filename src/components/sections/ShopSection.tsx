"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState, type RefObject } from "react";
import type { ShopProduct } from "@/lib/shopCatalog";
import {
  shopCategories,
  shopProducts,
  type ShopCategory,
} from "@/lib/shopCatalog";
import { ShopBannerStack } from "@/components/shop/ShopBannerStack";
import { useCart } from "@/components/shop/CartProvider";
import { HeartIcon, ShopBottomNav } from "@/components/shop/ShopBottomNav";
import { useWishlist } from "@/components/shop/WishlistProvider";
import { FLUORO_GREEN, Reveal } from "./Reveal";

export default function ShopSection() {
  const [category, setCategory] = useState<ShopCategory | "all">("all");

  const products = useMemo(
    () =>
      category === "all"
        ? shopProducts
        : shopProducts.filter((product) => product.category === category),
    [category],
  );

  return (
    <section
      id="shop"
      data-scroll-hold
      className="relative scroll-mt-24 bg-[var(--background)] px-4 pt-24 pb-8 sm:px-6 sm:pt-28 md:px-8 lg:px-10"
    >
      <div className="w-full">
        <ShopBannerStack onSelect={setCategory} />

        <div className="mt-6 grid w-full items-start gap-8 lg:mt-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
          <div className="sticky top-0 z-30 -mx-4 bg-[var(--background)] px-4 py-3 lg:hidden">
            <div
              role="tablist"
              aria-label="Shop categories"
              className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {shopCategories.map((item) => {
                const selected = category === item.slug;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setCategory(item.slug)}
                    className="flex-1 rounded-full px-3 py-2 text-center text-xs font-semibold tracking-[0.12em] whitespace-nowrap uppercase"
                    style={{
                      background: selected ? FLUORO_GREEN : "transparent",
                      color: selected ? "#111" : "var(--muted)",
                      border: selected
                        ? "1px solid transparent"
                        : "1px solid var(--border)",
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="hidden lg:sticky lg:top-24 lg:z-20 lg:block lg:self-start">
            <p className="text-[0.65rem] tracking-[0.35em] text-[color:var(--muted-soft)] uppercase">
              Categories
            </p>
            <nav className="mt-4 flex flex-col border-t border-[color:var(--border)]">
              {shopCategories.map((item) => {
                const selected = category === item.slug;
                const count =
                  item.slug === "all"
                    ? shopProducts.length
                    : shopProducts.filter(
                        (product) => product.category === item.slug,
                      ).length;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => setCategory(item.slug)}
                    aria-current={selected ? "true" : undefined}
                    className="flex items-center justify-between gap-3 border-b border-[color:var(--border)] py-3.5 text-left text-sm transition"
                    style={{
                      color: selected ? "var(--foreground)" : "var(--muted)",
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="h-4 w-0.5 shrink-0"
                        style={{
                          background: selected ? FLUORO_GREEN : "transparent",
                        }}
                        aria-hidden
                      />
                      <span className="font-semibold tracking-[0.12em] uppercase">
                        {item.label}
                      </span>
                    </span>
                    <span className="text-xs tabular-nums">{count}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="grid w-full grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {products.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
          </div>
        </div>
      </div>
      <ShopBottomNav />
    </section>
  );
}

function ProductCard({
  product,
  index,
}: {
  product: ShopProduct;
  index: number;
}) {
  const imageRef = useRef<HTMLDivElement>(null);

  return (
    <Reveal delay={Math.min(index, 6) * 0.04}>
      <article className="flex h-full flex-col">
        <div
          ref={imageRef}
          data-shop-image
          className="relative aspect-square overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[var(--card)] sm:rounded-[1.5rem]"
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="object-contain p-3 sm:p-6"
          />
          <SaveButton slug={product.slug} />
        </div>
        <div className="flex flex-1 flex-col pt-3 sm:pt-4">
          <p
            className="text-[0.6rem] tracking-[0.16em] uppercase sm:text-[0.65rem] sm:tracking-[0.22em]"
            style={{ color: FLUORO_GREEN }}
          >
            {product.subtitle}
          </p>
          <h3
            className="mt-1.5 text-2xl leading-none tracking-[0.02em] text-[var(--foreground)] uppercase sm:mt-2 sm:text-3xl"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            {product.title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[color:var(--muted)] sm:mt-3 sm:text-sm">
            {product.description}
          </p>
          {product.sizes ? (
            <p className="mt-2 text-[0.65rem] tracking-[0.08em] text-[color:var(--muted-soft)] uppercase sm:mt-3 sm:text-xs sm:tracking-[0.12em]">
              Sizes {product.sizes.join(" · ")}
            </p>
          ) : null}
          <ProductBuy product={product} imageRef={imageRef} />
        </div>
      </article>
    </Reveal>
  );
}

function SaveButton({ slug }: { slug: string }) {
  const wishlist = useWishlist();
  const saved = wishlist.has(slug);
  return (
    <button
      type="button"
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      onClick={() => wishlist.toggle(slug)}
      className="absolute top-2 right-2 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm"
      style={{ color: saved ? "#ff3b30" : "#111" }}
    >
      <HeartIcon filled={saved} />
    </button>
  );
}

function flyProductToCart(from: HTMLElement, src: string) {
  const fab = document.getElementById("shop-cart-fab");
  const start = from.getBoundingClientRect();
  if (!fab || start.width < 8) return;
  const end = fab.getBoundingClientRect();
  const dx = end.left + end.width / 2 - (start.left + start.width / 2);
  const dy = end.top + end.height / 2 - (start.top + start.height / 2);
  const scale = Math.min(end.width, 64) / start.width;
  const node = document.createElement("img");
  node.src = src;
  node.alt = "";
  node.setAttribute("data-shop-flyer", "");
  node.style.position = "fixed";
  node.style.zIndex = "70";
  node.style.left = `${start.left}px`;
  node.style.top = `${start.top}px`;
  node.style.width = `${start.width}px`;
  node.style.height = `${start.height}px`;
  node.style.objectFit = "contain";
  node.style.borderRadius = "1.25rem";
  node.style.pointerEvents = "none";
  node.style.background = "var(--card)";
  document.body.appendChild(node);
  const flight = node.animate(
    [
      { transform: "translate(0px, 0px) scale(1)", opacity: 1, borderRadius: "1.25rem" },
      {
        transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
        opacity: 0.35,
        borderRadius: "999px",
      },
    ],
    { duration: 700, easing: "cubic-bezier(.22,.8,.24,1)", fill: "forwards" },
  );
  flight.onfinish = () => {
    node.remove();
    document.getElementById("shop-cart-fab")?.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.16)" },
        { transform: "scale(1)" },
      ],
      { duration: 280 },
    );
  };
}

function ProductBuy({
  product,
  imageRef,
}: {
  product: ShopProduct;
  imageRef: RefObject<HTMLDivElement | null>;
}) {
  const cart = useCart();
  const [size, setSize] = useState(product.sizes?.[0] ?? "");
  const inCart = cart.lines.some(
    (line) => line.slug === product.slug && line.size === size,
  );

  return (
    <div className="mt-auto pt-4">
      <p
        className="text-2xl leading-none text-[var(--foreground)] sm:text-3xl"
        style={{ fontFamily: "var(--font-bebas), sans-serif" }}
      >
        {product.priceLabel}
      </p>
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
      {inCart ? (
        <Link
          href="/shop/cart"
          className="mt-3 inline-flex w-full items-center justify-center rounded-full px-3 py-2 text-[0.7rem] font-semibold text-black sm:py-2.5 sm:text-xs"
          style={{ background: FLUORO_GREEN }}
        >
          Go to cart
        </Link>
      ) : (
        <button
          type="button"
          onClick={(event) => {
            cart.add(product.slug, size);
            const from =
              imageRef.current ??
              event.currentTarget
                .closest("article")
                ?.querySelector<HTMLElement>("[data-shop-image]");
            if (from) flyProductToCart(from, product.image);
          }}
          className="mt-3 inline-flex w-full items-center justify-center rounded-full px-3 py-2 text-[0.7rem] font-semibold text-black sm:py-2.5 sm:text-xs"
          style={{ background: FLUORO_GREEN }}
        >
          Add to cart
        </button>
      )}
    </div>
  );
}
