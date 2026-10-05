"use client";

import { FLUORO_GREEN } from "@/components/sections/Reveal";
import { useCart } from "@/components/shop/CartProvider";
import { useWishlist } from "@/components/shop/WishlistProvider";
import {
  productImages,
  shopCategories,
  type ShopProduct,
} from "@/lib/shopCatalog";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const sheetSpring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 36,
  mass: 0.75,
};

export function ProductSheet({
  product,
  onClose,
}: {
  product: ShopProduct | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!product) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product ? (
        <div className="fixed inset-0 z-50">
          <motion.button
            type="button"
            aria-label="Close product details"
            className="absolute inset-0 bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={product.title}
            className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-[28px] bg-[var(--background)] shadow-[0_-16px_50px_rgba(0,0,0,0.28)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={sheetSpring}
          >
            <SheetBody product={product} onClose={onClose} />
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

function SheetBody({
  product,
  onClose,
}: {
  product: ShopProduct;
  onClose: () => void;
}) {
  const cart = useCart();
  const wishlist = useWishlist();
  const images = productImages(product);
  const [size, setSize] = useState(product.sizes?.[0] ?? "");
  const saved = wishlist.has(product.slug);
  const inCart = cart.lines.some(
    (line) => line.slug === product.slug && line.size === size,
  );
  const category =
    shopCategories.find((item) => item.slug === product.category)?.label ??
    product.category;
  const drag = useRef(0);

  return (
    <>
      <div
        className="flex shrink-0 cursor-grab touch-none justify-center pt-3 pb-1"
        onPointerDown={(event) => {
          drag.current = event.clientY;
        }}
        onPointerUp={(event) => {
          if (event.clientY - drag.current > 72) onClose();
        }}
      >
        <span className="h-1.5 w-10 rounded-full bg-[var(--border)]" />
      </div>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute top-3 right-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-[var(--card)]"
      >
        <X size={18} />
      </button>
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ImageCarousel images={images} title={product.title} />
        <div className="px-5 pt-5 pb-8">
          <p
            className="text-[0.65rem] tracking-[0.28em] uppercase"
            style={{ color: FLUORO_GREEN }}
          >
            {category}
            {product.category === "ebooks" ? " · Digital download" : ""}
          </p>
          <div className="mt-2 flex items-start justify-between gap-4">
            <h2
              className="text-4xl leading-none uppercase"
              style={{ fontFamily: "var(--font-bebas), sans-serif" }}
            >
              {product.title}
            </h2>
            <button
              type="button"
              aria-label={
                saved
                  ? `Remove from wishlist, ${wishlist.items.length} saved`
                  : `Save to wishlist, ${wishlist.items.length} saved`
              }
              onClick={() => wishlist.toggle(product.slug)}
              className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[color:var(--border)]"
            >
              <Heart
                size={20}
                strokeWidth={2}
                fill={saved ? "#ff3b30" : "none"}
                color={saved ? "#ff3b30" : "currentColor"}
              />
              {wishlist.items.length > 0 ? (
                <span className="absolute -top-1 -right-1 z-10 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#ff3b30] px-1 text-[10px] leading-none font-bold text-white">
                  {wishlist.items.length}
                </span>
              ) : null}
            </button>
          </div>
          <p
            className="mt-3 text-3xl leading-none"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            {product.priceLabel}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)]">
            {product.description}
          </p>
          {product.sizes ? (
            <div className="mt-5">
              <p className="text-[0.65rem] tracking-[0.16em] text-[color:var(--muted)] uppercase">
                Size
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSize(option)}
                    className="rounded-full px-3 py-1.5 text-xs font-semibold"
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
            </div>
          ) : (
            <p className="mt-5 text-sm text-[color:var(--muted)]">
              Instant download after payment. No shipping.
            </p>
          )}
          {inCart ? (
            <Link
              href="/shop/cart"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-bold text-black"
              style={{ background: FLUORO_GREEN }}
            >
              Go to cart
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => cart.add(product.slug, size)}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-bold text-black"
              style={{ background: FLUORO_GREEN }}
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  return (
    <div className="bg-[var(--card)]">
      <div
        ref={scroller}
        onScroll={() => {
          const el = scroller.current;
          if (!el || el.clientWidth < 1) return;
          setIndex(Math.round(el.scrollLeft / el.clientWidth));
        }}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, slide) => (
          <div
            key={src}
            className="relative aspect-square w-full shrink-0 snap-center"
          >
            <Image
              src={src}
              alt={images.length > 1 ? `${title} ${slide + 1}` : title}
              fill
              sizes="(max-width: 512px) 100vw, 512px"
              className="object-contain p-6"
              priority={slide === 0}
            />
          </div>
        ))}
      </div>
      {images.length > 1 ? (
        <div className="flex justify-center gap-1.5 pb-3">
          {images.map((src, slide) => (
            <button
              key={src}
              type="button"
              aria-label={`Photo ${slide + 1}`}
              onClick={() => {
                const el = scroller.current;
                if (!el) return;
                el.scrollTo({ left: slide * el.clientWidth, behavior: "smooth" });
              }}
              className="h-1.5 rounded-full"
              style={{
                width: index === slide ? 18 : 6,
                background: index === slide ? FLUORO_GREEN : "rgba(128,128,128,0.35)",
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
