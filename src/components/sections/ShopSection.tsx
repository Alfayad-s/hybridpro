"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import type { ShopProduct } from "@/lib/shopCatalog";
import { useShopCatalog, type ShopPromo } from "@/components/shop/ShopCatalogProvider";
import { ProductSheet } from "@/components/shop/ProductSheet";
import { ShopBannerStack } from "@/components/shop/ShopBannerStack";
import { useCart } from "@/components/shop/CartProvider";
import {
  CART_ARRIVE_EVENT,
  SAVED_ARRIVE_EVENT,
  ShopBottomNav,
} from "@/components/shop/ShopBottomNav";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import { useWishlist } from "@/components/shop/WishlistProvider";
import { FLUORO_GREEN, Reveal } from "./Reveal";

export default function ShopSection() {
  const catalog = useShopCatalog();
  const [category, setCategory] = useState("all");
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const comingSoonTab = catalog.categories.some(
    (item) => item.slug === category && item.comingSoon,
  );
  const comingSoonLabel =
    catalog.categories.find((item) => item.slug === category)?.label ?? "Coming soon";

  const products = useMemo(
    () =>
      category === "all"
        ? catalog.products
        : catalog.products.filter((product) => product.category === category),
    [catalog.products, category],
  );

  return (
    <section
      id="shop"
      data-scroll-hold
      className="relative scroll-mt-24 bg-[var(--background)] px-4 pt-24 pb-8 sm:px-6 sm:pt-28 md:px-8 lg:px-10"
    >
      <div className="w-full">
        <AnimatePresence mode="wait">
          {!catalog.ready && !catalog.error ? (
            <motion.div
              key="shop-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <ShopSkeleton />
            </motion.div>
          ) : (
            <motion.div
              key="shop-catalog"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
        <ShopBannerStack banners={catalog.banners} onSelect={setCategory} />

        <div className="mt-6 grid w-full items-start gap-8 lg:mt-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
          <div className="sticky top-[calc(3.6rem+env(safe-area-inset-top,0px))] z-30 -mx-4 bg-[var(--background)] px-4 py-3 lg:hidden">
            <div
              role="tablist"
              aria-label="Shop categories"
              className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {catalog.categories.map((item) => {
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
              {catalog.categories.map((item) => {
                const selected = category === item.slug;
                const count =
                  item.slug === "all"
                    ? catalog.products.length
                    : catalog.products.filter(
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

          {catalog.error ? (
            <p className="text-sm text-[color:var(--muted)]">{catalog.error}</p>
          ) : comingSoonTab ? (
            <ComingSoonPanel label={comingSoonLabel} />
          ) : products.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-[color:var(--border)] bg-[var(--card)] px-6 py-16 text-center">
              <h2
                className="text-5xl leading-none uppercase"
                style={{ fontFamily: "var(--font-bebas), sans-serif" }}
              >
                Nothing here yet
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[color:var(--muted)]">
                This collection is empty. Check back when new pieces are added.
              </p>
            </div>
          ) : (
            <ProductGrid
              products={products}
              offers={catalog.cardPromos}
              onOpen={setOpenSlug}
              onOffer={setCategory}
            />
          )}
        </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ShopBottomNav />
      <ProductSheet
        product={openSlug ? catalog.getProduct(openSlug) : null}
        onClose={() => setOpenSlug(null)}
      />
    </section>
  );
}

function ShopBone({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-[color-mix(in_srgb,var(--foreground)_7%,transparent)] ${className ?? ""}`}
    >
      <span
        aria-hidden
        className="shop-shimmer pointer-events-none absolute inset-y-0 left-0 w-1/2"
        style={{ animationDelay: `${delay}ms` }}
      />
    </div>
  );
}

function ShopSkeleton() {
  const cards = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <div aria-busy="true" aria-label="Loading the shop">
      <div className="mx-auto w-full max-w-xl lg:max-w-4xl">
        <div className="relative h-[210px]">
          <ShopBone
            className="absolute top-4 left-1/2 h-[168px] w-[92%] max-w-[560px] -translate-x-1/2 rounded-[28px]"
          />
        </div>
        <div className="mt-1 flex justify-center gap-1.5">
          <ShopBone delay={60} className="h-1.5 w-[18px] rounded-full" />
          <ShopBone delay={100} className="h-1.5 w-1.5 rounded-full" />
          <ShopBone delay={140} className="h-1.5 w-1.5 rounded-full" />
        </div>
      </div>

      <div className="mt-6 grid w-full items-start gap-8 lg:mt-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
        <div className="flex gap-2 lg:hidden">
          {[0, 1, 2, 3].map((index) => (
            <ShopBone
              key={index}
              delay={index * 70}
              className="h-9 w-24 shrink-0 rounded-full"
            />
          ))}
        </div>
        <div className="hidden lg:block">
          <ShopBone className="h-3 w-24 rounded-full" />
          <div className="mt-4 flex flex-col border-t border-[color:var(--border)]">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-[color:var(--border)] py-3.5"
              >
                <ShopBone delay={index * 80} className="h-3.5 w-28 rounded-full" />
                <ShopBone delay={index * 80 + 40} className="h-3 w-6 rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 items-stretch gap-4 sm:gap-5 lg:grid-cols-3">
          {cards.map((index) => (
            <div key={index} className="overflow-hidden rounded-2xl border border-[color:var(--border)]">
              <ShopBone
                delay={index * 90}
                className="aspect-square"
              />
              <ShopBone delay={index * 90 + 40} className="mt-3 h-2.5 w-16 rounded-full" />
              <ShopBone delay={index * 90 + 70} className="mt-2 h-6 w-3/4 rounded-md" />
              <ShopBone delay={index * 90 + 100} className="mt-2 h-3 w-full rounded-full" />
              <ShopBone delay={index * 90 + 130} className="mt-3 h-9 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type CatalogTile =
  | { kind: "product"; product: ShopProduct }
  | { kind: "offer"; id: string; src: string; alt: string; category: string };

function catalogTiles(products: ShopProduct[], offers: ShopPromo[]): CatalogTile[] {
  const tiles: CatalogTile[] = [];
  let offerIndex = 0;
  products.forEach((product, index) => {
    tiles.push({ kind: "product", product });
    if ((index + 1) % 6 === 0 && offerIndex < offers.length) {
      const offer = offers[offerIndex];
      offerIndex += 1;
      if (!offer) return;
      tiles.push({
        kind: "offer",
        id: offer.id,
        src: offer.image,
        alt: offer.alt,
        category: offer.category,
      });
    }
  });
  return tiles;
}

function ProductGrid({
  products,
  offers,
  onOpen,
  onOffer,
}: {
  products: ShopProduct[];
  offers: ShopPromo[];
  onOpen: (slug: string) => void;
  onOffer: (category: string) => void;
}) {
  const tiles = catalogTiles(products, offers);

  return (
    <div className="grid grid-cols-2 items-stretch gap-4 sm:gap-5 lg:grid-cols-3">
      {tiles.map((tile, index) =>
        tile.kind === "product" ? (
          <ProductCard
            key={tile.product.slug}
            product={tile.product}
            index={index}
            onOpen={() => onOpen(tile.product.slug)}
          />
        ) : (
          <OfferCard
            key={tile.id}
            src={tile.src}
            alt={tile.alt}
            onClick={() => {
              if (tile.category) onOffer(tile.category);
            }}
          />
        ),
      )}
    </div>
  );
}

function OfferCard({
  src,
  alt,
  onClick,
}: {
  src: string;
  alt: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={alt}
      className="relative col-span-full h-36 overflow-hidden rounded-2xl border border-[color:var(--border)] sm:h-44"
    >
      <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
    </button>
  );
}

function ComingSoonPanel({ label }: { label: string }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-[color:var(--border)] bg-[var(--card)] px-6 py-16 text-center">
      <p
        className="text-[0.7rem] tracking-[0.32em] uppercase"
        style={{ color: FLUORO_GREEN }}
      >
        {label}
      </p>
      <h2
        className="mt-3 text-6xl leading-none uppercase sm:text-7xl"
        style={{ fontFamily: "var(--font-bebas), sans-serif" }}
      >
        Coming soon
      </h2>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-[color:var(--muted)]">
        This collection is on the way. Check back soon.
      </p>
    </div>
  );
}

function ProductCard({
  product,
  index,
  onOpen,
}: {
  product: ShopProduct;
  index: number;
  onOpen: () => void;
}) {
  const imageRef = useRef<HTMLDivElement>(null);

  return (
    <Reveal delay={Math.min(index, 6) * 0.04} className="h-full">
      <article
        className="flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[var(--background)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
        onClick={onOpen}
      >
        <div
          ref={imageRef}
          data-shop-image
          className="relative aspect-square bg-[#f4f4f5]"
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            priority={index === 0}
            loading={index < 3 ? "eager" : "lazy"}
            sizes="(max-width: 1024px) 50vw, 28vw"
            className="object-contain p-6 sm:p-8"
          />
          <SaveButton slug={product.slug} imageRef={imageRef} />
          {product.comingSoon ? (
            <span className="absolute top-3 left-3 rounded-full bg-black/80 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.14em] text-white uppercase">
              Coming soon
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col px-4 py-4">
          {product.subtitle !== "Available sizes" ? (
            <p
              className="text-[0.62rem] tracking-[0.18em] uppercase"
              style={{ color: FLUORO_GREEN }}
            >
              {product.subtitle}
            </p>
          ) : null}
          <h3 className="mt-1 line-clamp-2 min-h-[2.6rem] text-base leading-snug font-semibold text-[var(--foreground)]">
            {product.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-[color:var(--muted)]">
            {product.description}
          </p>
          {product.sizes ? (
            <p className="mt-2 text-[0.65rem] tracking-[0.08em] text-[color:var(--muted-soft)] uppercase">
              {product.sizes.join(" · ")}
            </p>
          ) : null}
          <ProductBuy product={product} imageRef={imageRef} />
        </div>
      </article>
    </Reveal>
  );
}

function SaveButton({
  slug,
  imageRef,
}: {
  slug: string;
  imageRef: RefObject<HTMLDivElement | null>;
}) {
  const wishlist = useWishlist();
  const saved = wishlist.has(slug);
  return (
    <button
      type="button"
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      onClick={(event) => {
        event.stopPropagation();
        const adding = !wishlist.has(slug);
        wishlist.toggle(slug);
        if (!adding) return;
        const from = imageRef.current;
        const target = document.getElementById("shop-saved-icon");
        if (from && target) {
          flyProductImage(from, target, () => {
            window.dispatchEvent(new Event(SAVED_ARRIVE_EVENT));
          });
        }
      }}
      className="absolute top-2 right-2 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm"
    >
      <Heart
        size={18}
        strokeWidth={2}
        fill={saved ? "#ff3b30" : "none"}
        color={saved ? "#ff3b30" : "#111"}
      />
    </button>
  );
}

function flyProductImage(
  from: HTMLElement,
  target: HTMLElement,
  onArrive?: () => void,
) {
  const picture = from.querySelector("img");
  const start = (picture ?? from).getBoundingClientRect();
  const end = target.getBoundingClientRect();
  if (start.width < 8 || end.width < 8) return;
  const dx = end.left + end.width / 2 - (start.left + start.width / 2);
  const dy = end.top + end.height / 2 - (start.top + start.height / 2);
  const scale = Math.min(56, end.width) / start.width;
  const node = document.createElement("img");
  node.src = picture?.currentSrc || picture?.src || "";
  node.alt = "";
  node.setAttribute("data-shop-flyer", "");
  node.style.position = "fixed";
  node.style.zIndex = "70";
  node.style.left = `${start.left}px`;
  node.style.top = `${start.top}px`;
  node.style.width = `${start.width}px`;
  node.style.height = `${start.height}px`;
  node.style.objectFit = "contain";
  node.style.opacity = "1";
  node.style.borderRadius = "1.25rem";
  node.style.pointerEvents = "none";
  node.style.background = getComputedStyle(from).backgroundColor;
  document.body.appendChild(node);
  const flight = node.animate(
    [
      { transform: "translate(0px, 0px) scale(1)", opacity: 1 },
      {
        transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
        opacity: 1,
      },
    ],
    { duration: 700, easing: "cubic-bezier(.22,.8,.24,1)", fill: "forwards" },
  );
  flight.onfinish = () => {
    node.remove();
    onArrive?.();
  };
}

function flyProductToCart(from: HTMLElement) {
  const fab = document.getElementById("shop-cart-fab");
  if (!fab) return;
  flyProductImage(from, fab, () => {
    window.dispatchEvent(new Event(CART_ARRIVE_EVENT));
  });
}

function ProductBuy({
  product,
  imageRef,
}: {
  product: ShopProduct;
  imageRef: RefObject<HTMLDivElement | null>;
}) {
  const cart = useCart();
  const needsSize = Boolean(product.sizes?.length);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [size, setSize] = useState(product.sizes?.[0] ?? "");
  const inCart = cart.lines.some(
    (line) => line.slug === product.slug && line.size === (needsSize ? "" : size),
  );

  function addSelected() {
    cart.add(product.slug, needsSize ? size : "");
    const from = imageRef.current;
    if (from) flyProductToCart(from);
    setPickerOpen(false);
  }

  return (
    <div
      className="mt-auto flex items-center justify-between gap-3 pt-4"
      onClick={(event) => event.stopPropagation()}
    >
      <p className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
        {product.priceLabel}
      </p>
      {product.comingSoon ? (
        <p className="inline-flex shrink-0 items-center justify-center rounded-full border border-[color:var(--border)] px-3 py-2 text-[0.7rem] font-semibold tracking-[0.08em] text-[color:var(--muted)] uppercase">
          Soon
        </p>
      ) : !needsSize && inCart ? (
        <Link
          href="/shop/cart"
          className="inline-flex shrink-0 items-center justify-center rounded-full px-3.5 py-2 text-xs font-semibold text-black"
          style={{ background: FLUORO_GREEN }}
        >
          In cart
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => {
            if (needsSize) setPickerOpen(true);
            else addSelected();
          }}
          className="inline-flex shrink-0 items-center justify-center rounded-full px-3.5 py-2 text-xs font-semibold text-black"
          style={{ background: FLUORO_GREEN }}
        >
          Add
        </button>
      )}
      <SizePicker
        open={pickerOpen}
        product={product}
        size={size}
        onSize={setSize}
        onClose={() => setPickerOpen(false)}
        onAdd={addSelected}
      />
    </div>
  );
}

function SizePicker({
  open,
  product,
  size,
  onSize,
  onClose,
  onAdd,
}: {
  open: boolean;
  product: ShopProduct;
  size: string;
  onSize: (size: string) => void;
  onClose: () => void;
  onAdd: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center p-3 pb-24 sm:items-center sm:pb-3">
          <motion.button
            type="button"
            aria-label="Close size picker"
            className="absolute inset-0 bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Choose a size for ${product.title}`}
            className="relative w-full max-w-sm rounded-[28px] bg-[var(--background)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.28)]"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.65rem] tracking-[0.2em] text-[color:var(--muted)] uppercase">
                  Select size
                </p>
                <p
                  className="mt-1 text-3xl leading-none uppercase"
                  style={{ fontFamily: "var(--font-bebas), sans-serif" }}
                >
                  {product.title}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-full bg-[var(--card)]"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {product.sizes?.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onSize(option)}
                  className="rounded-full px-4 py-2 text-sm font-semibold"
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
            <button
              type="button"
              onClick={onAdd}
              className="mt-5 inline-flex w-full items-center justify-center rounded-full px-3 py-3 text-sm font-bold text-black"
              style={{ background: FLUORO_GREEN }}
            >
              Add {size} to cart
            </button>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
