"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import type { ShopProduct } from "@/lib/shopCatalog";
import { useShopCatalog } from "@/components/shop/ShopCatalogProvider";
import { ProductSheet } from "@/components/shop/ProductSheet";
import { ShopBannerStack } from "@/components/shop/ShopBannerStack";
import { useCart } from "@/components/shop/CartProvider";
import { SAVED_ARRIVE_EVENT, ShopBottomNav } from "@/components/shop/ShopBottomNav";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import { useWishlist } from "@/components/shop/WishlistProvider";
import { FLUORO_GREEN, Reveal } from "./Reveal";

export default function ShopSection() {
  const catalog = useShopCatalog();
  const [category, setCategory] = useState("all");
  const [openSlug, setOpenSlug] = useState<string | null>(null);

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
        <ShopBannerStack onSelect={setCategory} />

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
          ) : catalog.ready ? (
            <ProductMasonry
              products={products}
              onOpen={setOpenSlug}
              onOffer={setCategory}
            />
          ) : (
            <p className="text-sm text-[color:var(--muted)]">Loading the shop…</p>
          )}
        </div>
      </div>
      <ShopBottomNav />
      <ProductSheet
        product={openSlug ? catalog.getProduct(openSlug) : null}
        onClose={() => setOpenSlug(null)}
      />
    </section>
  );
}

const imageAspects = [
  "aspect-square",
  "aspect-[3/4]",
  "aspect-[4/5]",
  "aspect-[5/4]",
];

function columnCount(width: number) {
  if (width >= 1536) return 5;
  if (width >= 1280) return 4;
  if (width >= 1024) return 3;
  return 2;
}

const offerCards: {
  src: string;
  alt: string;
  category: string;
}[] = [
  {
    src: "/shop/masonry-guides-offer.jpg",
    alt: "E-Books from ₹599",
    category: "ebooks",
  },
];

type MasonryTile =
  | { kind: "product"; product: ShopProduct }
  | { kind: "offer"; src: string; alt: string; category: string };

function masonryTiles(products: ShopProduct[]): MasonryTile[] {
  const tiles: MasonryTile[] = [];
  let offerIndex = 0;
  products.forEach((product, index) => {
    tiles.push({ kind: "product", product });
    if ((index + 1) % 4 === 0 && offerIndex < offerCards.length) {
      const offer = offerCards[offerIndex];
      offerIndex += 1;
      tiles.push({ kind: "offer", ...offer });
    }
  });
  return tiles;
}

function ProductMasonry({
  products,
  onOpen,
  onOffer,
}: {
  products: ShopProduct[];
  onOpen: (slug: string) => void;
  onOffer: (category: string) => void;
}) {
  const [columns, setColumns] = useState(2);

  useEffect(() => {
    const update = () => setColumns(columnCount(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const tiles = masonryTiles(products);
  const lanes = Array.from({ length: columns }, () => [] as MasonryTile[]);
  tiles.forEach((tile, index) => {
    lanes[index % columns].push(tile);
  });

  return (
    <div className="flex w-full items-start gap-3 sm:gap-5">
      {lanes.map((lane, laneIndex) => (
        <div
          key={laneIndex}
          className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-5"
        >
          {lane.map((tile) =>
            tile.kind === "product" ? (
              <ProductCard
                key={tile.product.slug}
                product={tile.product}
                index={products.indexOf(tile.product)}
                onOpen={() => onOpen(tile.product.slug)}
              />
            ) : (
              <OfferCard
                key={tile.src}
                src={tile.src}
                alt={tile.alt}
                onClick={() => onOffer(tile.category)}
              />
            ),
          )}
        </div>
      ))}
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
      className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[color:var(--border)] sm:rounded-[1.5rem]"
    >
      <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
    </button>
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
    <Reveal delay={Math.min(index, 6) * 0.04}>
      <article className="flex cursor-pointer flex-col" onClick={onOpen}>
        <div
          ref={imageRef}
          data-shop-image
          className={`relative overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[var(--card)] sm:rounded-[1.5rem] ${imageAspects[index % imageAspects.length]}`}
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="object-contain p-3 sm:p-6"
          />
          <SaveButton slug={product.slug} imageRef={imageRef} />
        </div>
        <div className="flex flex-1 flex-col pt-3 sm:pt-4">
          {product.subtitle !== "Available sizes" ? (
            <p
              className="text-[0.6rem] tracking-[0.16em] uppercase sm:text-[0.65rem] sm:tracking-[0.22em]"
              style={{ color: FLUORO_GREEN }}
            >
              {product.subtitle}
            </p>
          ) : null}
          <h3
            className="text-2xl leading-none tracking-[0.02em] text-[var(--foreground)] uppercase sm:text-3xl"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            {product.title}
          </h3>
          <p className="mt-1.5 line-clamp-1 text-xs text-[color:var(--muted)] sm:text-sm">
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
    document.getElementById("shop-cart-fab")?.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.16)" },
        { transform: "scale(1)" },
      ],
      { duration: 280 },
    );
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
    <div className="mt-auto pt-3" onClick={(event) => event.stopPropagation()}>
      <p
        className="text-2xl leading-none text-[var(--foreground)] sm:text-3xl"
        style={{ fontFamily: "var(--font-bebas), sans-serif" }}
      >
        {product.priceLabel}
      </p>
      {!needsSize && inCart ? (
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
          onClick={() => {
            if (needsSize) setPickerOpen(true);
            else addSelected();
          }}
          className="mt-3 inline-flex w-full items-center justify-center rounded-full px-3 py-2 text-[0.7rem] font-semibold text-black sm:py-2.5 sm:text-xs"
          style={{ background: FLUORO_GREEN }}
        >
          Add to cart
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
