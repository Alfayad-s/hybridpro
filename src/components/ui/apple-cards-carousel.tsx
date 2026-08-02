"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { IconChevronLeft, IconChevronRight, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  animate,
  type PanInfo,
} from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";

interface CarouselProps {
  items: ReactElement[];
  /** Kept for API compat — autoplay seconds unused in drag mode */
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

const SPRING = { type: "spring" as const, stiffness: 320, damping: 36, mass: 0.85 };

export const Carousel = ({ items }: CarouselProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [active, setActive] = useState(0);
  const [step, setStep] = useState(288);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const maxIndex = Math.max(0, items.length - 1);

  const handleCardClose = useCallback((index: number) => {
    setCurrentIndex(index);
    setModalOpen(false);
  }, []);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length === 0) return;
    if (track.children.length < 2) {
      const first = track.children[0] as HTMLElement;
      setStep(first.offsetWidth);
      return;
    }
    const a = track.children[0] as HTMLElement;
    const b = track.children[1] as HTMLElement;
    setStep(b.offsetLeft - a.offsetLeft);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, items.length]);

  useEffect(() => {
    void animate(x, -active * step, { duration: 0 });
    // Re-align when card width changes (resize), not on every swipe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(maxIndex, next));
      setActive(clamped);
      void animate(x, -clamped * step, SPRING);
    },
    [maxIndex, step, x],
  );

  const onDragEnd = (_: unknown, info: PanInfo) => {
    measure();
    const cardStep = step || 288;
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    let delta = 0;
    if (velocity < -450 || offset < -cardStep * 0.22) delta = 1;
    else if (velocity > 450 || offset > cardStep * 0.22) delta = -1;

    goTo(active + delta);
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, setModalOpen, currentIndex }}
    >
      <div className="relative w-full">
        <div
          className="cursor-grab overflow-hidden active:cursor-grabbing touch-pan-y"
          style={{ touchAction: "pan-y" }}
        >
          <motion.div
            ref={trackRef}
            className="flex w-max flex-row gap-4 py-6 pl-1 pr-8 md:gap-5 md:py-10 md:pr-10"
            style={{ x }}
            drag={modalOpen ? false : "x"}
            dragDirectionLock
            dragConstraints={{
              left: -maxIndex * step - 24,
              right: 24,
            }}
            dragElastic={0.14}
            dragTransition={{ bounceStiffness: 320, bounceDamping: 36 }}
            onDragEnd={onDragEnd}
          >
            {items.map((item, index) => (
              <div
                key={`gallery-wrap-${index}`}
                className="shrink-0 rounded-3xl"
              >
                {item}
              </div>
            ))}
          </motion.div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3 px-1">
          <p className="text-[0.65rem] tracking-[0.28em] text-[color:var(--muted-soft)] uppercase">
            Swipe cards
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous card"
              disabled={active <= 0}
              onClick={() => goTo(active - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] text-[var(--foreground)] transition enabled:hover:border-[color:var(--brand-green)] disabled:opacity-30"
            >
              <IconChevronLeft className="h-4 w-4" stroke={1.75} />
            </button>
            <button
              type="button"
              aria-label="Next card"
              disabled={active >= maxIndex}
              onClick={() => goTo(active + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] text-[var(--foreground)] transition enabled:hover:border-[color:var(--brand-green)] disabled:opacity-30"
            >
              <IconChevronRight className="h-4 w-4" stroke={1.75} />
            </button>
          </div>
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
  const dragStart = useRef({ x: 0, y: 0 });

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
                className="mt-3 text-3xl tracking-[0.02em] uppercase md:text-5xl"
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
        onPointerDown={(e) => {
          dragStart.current = { x: e.clientX, y: e.clientY };
        }}
        onClick={(e) => {
          // Ignore taps that were actually horizontal swipes
          const dx = Math.abs(e.clientX - dragStart.current.x);
          const dy = Math.abs(e.clientY - dragStart.current.y);
          if (dx > 10 || dy > 10) return;
          handleOpen();
        }}
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
        isLoading ? "scale-105 blur-sm" : "scale-100 blur-0",
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
