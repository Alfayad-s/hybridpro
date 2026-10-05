"use client";

import { FLUORO_GREEN } from "@/components/sections/Reveal";
import type { ShopPromo } from "@/components/shop/ShopCatalogProvider";
import type { ShopCategory } from "@/lib/shopCatalog";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const sensitivity = 72;
const autoplayMs = 3200;

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

export function ShopBannerStack({
  banners,
  onSelect,
}: {
  banners: ShopPromo[];
  onSelect: (category: ShopCategory) => void;
}) {
  if (banners.length === 0) return null;
  return (
    <BannerStack
      key={banners.map((item) => item.id).join("|")}
      banners={banners}
      onSelect={onSelect}
    />
  );
}

function BannerStack({
  banners,
  onSelect,
}: {
  banners: ShopPromo[];
  onSelect: (category: ShopCategory) => void;
}) {
  const [order, setOrder] = useState(() =>
    banners.map((_, index) => banners.length - 1 - index),
  );
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const dragRef = useRef(drag);
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const settling = useRef(false);
  const frame = useRef(0);
  const nextAt = useRef(0);
  const flingRef = useRef<(direction: { x: number; y: number }) => void>(() => {});

  if (!pointer.current && !settling.current) {
    dragRef.current = drag;
  }
  const front = order[order.length - 1] ?? 0;
  const promote = easeOutCubic(
    Math.min(1, Math.hypot(drag.x, drag.y) / sensitivity),
  );

  const pauseThenContinue = () => {
    nextAt.current = performance.now() + autoplayMs;
  };

  const sendToBack = () => {
    setOrder((current) => {
      const next = [...current];
      const top = next.pop();
      if (top === undefined) return current;
      next.unshift(top);
      return next;
    });
    dragRef.current = { x: 0, y: 0 };
    setDrag({ x: 0, y: 0 });
    settling.current = false;
    pauseThenContinue();
  };

  const animateTo = (target: { x: number; y: number }, done: () => void) => {
    settling.current = true;
    const begin = dragRef.current;
    const start = performance.now();
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(fallback);
      cancelAnimationFrame(frame.current);
      done();
    };
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 460);
      const eased = easeOutCubic(t);
      const next = {
        x: begin.x + (target.x - begin.x) * eased,
        y: begin.y + (target.y - begin.y) * eased,
      };
      dragRef.current = next;
      setDrag(next);
      if (t < 1) {
        frame.current = requestAnimationFrame(step);
      } else {
        finish();
      }
    };
    const fallback = window.setTimeout(finish, 520);
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(step);
  };

  const flingAway = (direction: { x: number; y: number }) => {
    const length = Math.hypot(direction.x, direction.y) || 1;
    animateTo(
      { x: (direction.x / length) * 520, y: (direction.y / length) * 520 },
      sendToBack,
    );
  };
  flingRef.current = flingAway;

  useEffect(() => {
    pauseThenContinue();
    const timer = window.setInterval(() => {
      if (pointer.current || settling.current) return;
      if (performance.now() < nextAt.current) return;
      flingRef.current({ x: 1, y: -0.12 });
    }, 200);
    return () => {
      window.clearInterval(timer);
      cancelAnimationFrame(frame.current);
    };
    // The interval reads the latest fling through a ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto w-full max-w-xl lg:max-w-4xl">
      <div className="relative h-[210px]">
        {order.map((slideIndex, stackIndex) => {
          const isTop = stackIndex === order.length - 1;
          const baseDepth = order.length - 1 - stackIndex;
          const depth = isTop ? 0 : Math.max(0, baseDepth - promote);
          const scale = 1 - depth * 0.055;
          const rotate = depth * 4;
          const lift = isTop ? 0 : promote * (baseDepth === 1 ? 4 : 2);
          const item = banners[slideIndex];
          if (!item) return null;
          const shown = depth <= 2;
          const opacity = !shown
            ? 0
            : isTop
              ? 1 - Math.min(0.35, Math.hypot(drag.x, drag.y) / 420)
              : 1;
          return (
            <div
              key={item.id}
              className="absolute top-4 left-1/2 h-[168px] w-[92%] max-w-[560px]"
                style={{
                transform: `translate(calc(-50% + ${isTop ? drag.x : 0}px), ${isTop ? drag.y - lift : -lift}px) rotate(${rotate}deg) scale(${scale})`,
                zIndex: stackIndex,
                opacity,
                touchAction: "pan-y",
              }}
            >
              <button
                type="button"
                aria-label={`Show ${item.label || item.alt}`}
                className="relative h-full w-full overflow-hidden rounded-[28px] shadow-[0_12px_28px_rgba(0,0,0,0.28)]"
                style={{ touchAction: "pan-y" }}
                onPointerDown={(event) => {
                  if (!isTop || settling.current) return;
                  pointer.current = {
                    id: event.pointerId,
                    x: event.clientX,
                    y: event.clientY,
                  };
                  try {
                    event.currentTarget.setPointerCapture(event.pointerId);
                  } catch {
                    /* synthetic pointers have nothing to capture */
                  }
                }}
                onPointerMove={(event) => {
                  const start = pointer.current;
                  if (!isTop || !start || start.id !== event.pointerId) return;
                  const next = {
                    x: event.clientX - start.x,
                    y: event.clientY - start.y,
                  };
                  dragRef.current = next;
                  setDrag(next);
                }}
                onPointerUp={(event) => {
                  const start = pointer.current;
                  if (!isTop || !start || start.id !== event.pointerId) return;
                  pointer.current = null;
                  const offset = dragRef.current;
                  const distance = Math.hypot(offset.x, offset.y);
                  if (distance < 8) {
                    if (item.category) onSelect(item.category);
                    pauseThenContinue();
                    return;
                  }
                  if (distance > sensitivity) {
                    flingAway(offset);
                  } else {
                    animateTo({ x: 0, y: 0 }, () => {
                      settling.current = false;
                      pauseThenContinue();
                    });
                  }
                }}
                onPointerCancel={(event) => {
                  if (!pointer.current || pointer.current.id !== event.pointerId) return;
                  pointer.current = null;
                  animateTo({ x: 0, y: 0 }, () => {
                    settling.current = false;
                    pauseThenContinue();
                  });
                }}
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  priority={slideIndex === 0}
                  sizes="(max-width: 768px) 92vw, 560px"
                  className="object-cover"
                  draggable={false}
                />
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex justify-center gap-1.5">
        {banners.map((item, index) => (
          <span
            key={item.id}
            className="h-1.5 rounded-full transition-all duration-200"
            style={{
              width: front === index ? 18 : 6,
              background: front === index ? FLUORO_GREEN : "rgba(128,128,128,0.35)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
