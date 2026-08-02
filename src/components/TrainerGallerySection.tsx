"use client";

import {
  Carousel,
  GalleryCarouselCard,
} from "@/components/ui/apple-cards-carousel";
import { trainerGalleryCards } from "@/lib/trainerMedia";

const BRAND = "var(--brand-green)";

export default function TrainerGallerySection() {
  const cards = trainerGalleryCards.map((card, index) => (
    <GalleryCarouselCard key={card.src} card={card} index={index} />
  ));

  return (
    <section
      className="border-t border-[color:var(--border)] px-4 py-16 sm:px-6 sm:py-20 md:px-10"
      style={{ background: "var(--background)" }}
    >
      <div className="mx-auto max-w-6xl">
        <p
          className="text-[0.7rem] tracking-[0.4em] uppercase sm:text-xs"
          style={{ color: BRAND }}
        >
          Gallery
        </p>
        <h2
          className="mt-3 max-w-xl text-4xl leading-[0.95] tracking-[0.02em] uppercase sm:text-5xl md:text-6xl"
          style={{ fontFamily: "var(--font-bebas), sans-serif" }}
        >
          In action
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-[color:var(--muted)] sm:text-base">
          Real sessions on the floor, coaching, effort, and the mindset behind
          every result. Hover to pause.
        </p>

        <div className="mt-8 -mx-4 sm:-mx-6 md:mx-0 md:mt-10">
          <Carousel items={cards} duration={36} />
        </div>
      </div>
    </section>
  );
}
