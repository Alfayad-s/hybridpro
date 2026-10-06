"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ParticleDeleteOptions = {
  duration?: number;
  particleSize?: number;
  spread?: number;
};

const COLORS = ["#c6f135", "#111111", "#ffffff", "#d4d4d8", "#a3a3a3"];

export function particleDelete(
  element: HTMLElement,
  options: ParticleDeleteOptions = {},
): Promise<void> {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return Promise.resolve();

  const rect = element.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return Promise.resolve();

  const duration = options.duration ?? 680;
  const size = options.particleSize ?? 7;
  const spread = options.spread ?? Math.max(120, rect.width * 0.35);
  const cols = Math.max(6, Math.round(rect.width / (size * 2.2)));
  const rows = Math.max(3, Math.round(rect.height / (size * 2.2)));
  const total = cols * rows;
  const step = Math.max(1, Math.ceil(total / 140));

  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText = [
    "position:fixed",
    `left:${rect.left}px`,
    `top:${rect.top}px`,
    `width:${rect.width}px`,
    `height:${rect.height}px`,
    "pointer-events:none",
    "z-index:70",
    "overflow:visible",
  ].join(";");

  const bits: HTMLSpanElement[] = [];
  let index = 0;
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      index += 1;
      if (index % step !== 0) continue;
      const bit = document.createElement("span");
      bit.style.cssText = [
        "position:absolute",
        `left:${(x + 0.5) * (rect.width / cols) - size / 2}px`,
        `top:${(y + 0.5) * (rect.height / rows) - size / 2}px`,
        `width:${size}px`,
        `height:${size}px`,
        `background:${COLORS[(x + y) % COLORS.length]}`,
        "border-radius:1px",
        "will-change:transform,opacity",
      ].join(";");
      host.appendChild(bit);
      bits.push(bit);
    }
  }

  element.style.visibility = "hidden";
  document.body.appendChild(host);

  const animations = bits.map((bit) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = spread * (0.35 + Math.random() * 0.75);
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance * 0.65 - spread * 0.15;
    const spin = (Math.random() - 0.5) * 220;
    return bit.animate(
      [
        { transform: "translate(0px, 0px) rotate(0deg) scale(1)", opacity: 1 },
        {
          transform: `translate(${dx}px, ${dy}px) rotate(${spin}deg) scale(0.15)`,
          opacity: 0,
        },
      ],
      { duration: duration * (0.75 + Math.random() * 0.4), easing: "cubic-bezier(0.16, 0.84, 0.32, 1)", fill: "forwards" },
    );
  });

  const done = Promise.all(
    animations.map((animation) => animation.finished.catch(() => undefined)),
  ).then(() => {
    host.remove();
  });

  window.setTimeout(() => host.remove(), duration + 400);
  return done;
}

export function useParticleDelete(options?: ParticleDeleteOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const busy = useRef(false);
  const mounted = useRef(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const triggerDelete = useCallback((element: HTMLElement, onDelete?: () => void) => {
    if (busy.current) return;
    busy.current = true;
    setIsDeleting(true);
    void particleDelete(element, optionsRef.current)
      .catch(() => undefined)
      .finally(() => {
        onDelete?.();
        busy.current = false;
        if (mounted.current) setIsDeleting(false);
      });
  }, []);

  return { isDeleting, triggerDelete };
}
