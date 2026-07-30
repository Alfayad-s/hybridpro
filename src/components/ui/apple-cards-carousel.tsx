"use client";

import {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";

interface CarouselProps {
  items: ReactElement[];
  /** Seconds for one full loop (default 40) */
  duration?: number;
}

export type GalleryCard = {
  src: string;
  alt: string;
  category: string;
  title: string;
  quote: string;
  content?: ReactNode;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  setModalOpen: (open: boolean) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  setModalOpen: () => {},
  currentIndex: 0,
});

export const Carousel = ({ items, duration = 40 }: CarouselProps) => {
  const [hovered, setHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const paused = hovered || modalOpen;

  const handleCardClose = useCallback((index: number) => {
    setCurrentIndex(index);
    setModalOpen(false);
  }, []);

  // Duplicate once for seamless -50% translate loop (clone so each copy has its own state)
  const loopItems = [...items, ...items].map((item, index) =>
    cloneElement(item, {
      key: `gallery-loop-${index}`,
      index: index % items.length,
    }),
  );

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, setModalOpen, currentIndex }}
    >
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setHovered(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setHovered(false);
          }
        }}
      >
        <div
          className={cn(
            "gallery-marquee-track flex w-max flex-row gap-4 py-6 md:gap-5 md:py-10",
            paused && "is-paused",
          )}
          style={{ animationDuration: `${duration}s` }}
        >
          {loopItems.map((item, index) => (
            <div
              key={`gallery-wrap-${index}`}
              className="shrink-0 rounded-3xl"
              aria-hidden={index >= items.length ? true : undefined}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const GalleryCarouselCard = ({
  card,
  index,
}: {
  card: GalleryCard;
  index: number;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose, setModalOpen } = useContext(CarouselContext);

  const handleClose = () => {
    setOpen(false);
    setModalOpen(false);
    onCardClose(index);
  };

  const handleOpen = () => {
    setOpen(true);
    setModalOpen(true);
  };

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") handleClose();
    }

    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useOutsideClick(containerRef, () => {
    if (open) handleClose();
  });

  const modalContent = card.content ?? (
    <div className="space-y-8">
      <blockquote
        className="text-xl leading-relaxed text-[var(--foreground)] md:text-3xl"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        <span className="text-[color:var(--brand-green)]">&ldquo;</span>
        {card.quote}
        <span className="text-[color:var(--brand-green)]">&rdquo;</span>
      </blockquote>
      <div className="relative mx-auto flex max-h-[min(65vh,560px)] items-center justify-center overflow-hidden rounded-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.src}
          alt={card.alt}
          className="max-h-[min(65vh,560px)] w-full object-contain"
        />
      </div>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 h-screen overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-lg"
            />
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              ref={containerRef}
              className="relative z-[60] mx-auto my-8 h-fit max-w-3xl rounded-3xl border border-[color:var(--border)] bg-[var(--background)] p-5 font-sans md:my-12 md:p-10"
            >
              <button
                type="button"
                aria-label="Close"
                className="sticky top-0 z-10 ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-[var(--foreground)]"
                onClick={handleClose}
              >
                <IconX className="h-5 w-5 text-[var(--background)]" />
              </button>
              <p
                className="text-xs tracking-[0.35em] uppercase"
                style={{ color: "var(--brand-green)" }}
              >
                {card.category}
              </p>
              <p
                className="mt-3 text-3xl uppercase tracking-[0.02em] md:text-5xl"
                style={{ fontFamily: "var(--font-bebas), sans-serif" }}
              >
                {card.title}
              </p>
              <div className="py-8 md:py-10">{modalContent}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={handleOpen}
        className="relative z-10 flex h-[22rem] w-56 flex-col items-start justify-between overflow-hidden rounded-3xl md:h-[28rem] md:w-80"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/55 via-black/15 to-black/70"
          aria-hidden
        />
        <div className="relative z-40 p-6 md:p-8">
          <p className="text-left text-xs font-medium tracking-[0.3em] text-white/90 uppercase">
            {card.category}
          </p>
          <p
            className="mt-2 max-w-[14rem] text-left text-2xl leading-[0.95] text-white uppercase md:max-w-xs md:text-3xl"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            {card.title}
          </p>
        </div>
        <p
          className="relative z-40 px-6 pb-6 text-left text-sm leading-relaxed text-white/90 md:px-8 md:pb-8 md:text-base"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          &ldquo;{card.quote}&rdquo;
        </p>
        <GalleryImage
          src={card.src}
          alt={card.alt}
          className="absolute inset-0 z-10 object-cover"
        />
      </motion.button>
    </>
  );
};

function GalleryImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [isLoading, setLoading] = useState(true);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={cn(
        "h-full w-full transition duration-500",
        isLoading ? "blur-sm scale-105" : "blur-0 scale-100",
        className,
      )}
      onLoad={() => setLoading(false)}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
}
