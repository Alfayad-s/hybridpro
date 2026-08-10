"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type GaugeSliderProps = {
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  className?: string;
};

/** Large drag gauge for assessment number steps. */
export default function GaugeSlider({
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
  className = "",
}: GaugeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [active, setActive] = useState(false);

  const clampToStep = useCallback(
    (raw: number) => {
      const snapped = Math.round(raw / step) * step;
      return Math.min(max, Math.max(min, snapped));
    },
    [min, max, step],
  );

  const valueFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return value;
      const rect = el.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      return clampToStep(min + ratio * (max - min));
    },
    [clampToStep, max, min, value],
  );

  const setFromEvent = useCallback(
    (clientX: number) => {
      onChange(valueFromClientX(clientX));
    },
    [onChange, valueFromClientX],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      setFromEvent(e.clientX);
    };
    const onUp = () => {
      dragging.current = false;
      setActive(false);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [setFromEvent]);

  const pct = ((value - min) / (max - min)) * 100;
  const ticks = 12;

  return (
    <div className={`w-full select-none ${className}`}>
      <div className="flex flex-col items-center">
        <p
          className="text-[clamp(4rem,18vw,7.5rem)] leading-none tracking-[0.02em] text-black tabular-nums"
          style={{ fontFamily: "var(--font-bebas), sans-serif" }}
        >
          {value}
          {unit ? (
            <span className="ml-2 text-[0.28em] tracking-[0.28em] text-black/40">
              {unit}
            </span>
          ) : null}
        </p>
      </div>

      <div
        ref={trackRef}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        tabIndex={0}
        className="relative mt-10 touch-none px-1 sm:mt-12"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture?.(e.pointerId);
          dragging.current = true;
          setActive(true);
          setFromEvent(e.clientX);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            e.preventDefault();
            onChange(clampToStep(value + step));
          } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            e.preventDefault();
            onChange(clampToStep(value - step));
          }
        }}
      >
        {/* Tick marks */}
        <div className="mb-3 flex h-8 items-end justify-between px-[2%]">
          {Array.from({ length: ticks + 1 }, (_, i) => {
            const major = i % 3 === 0;
            return (
              <span
                key={i}
                className={`w-px ${major ? "h-7 bg-black/45" : "h-3.5 bg-black/20"}`}
              />
            );
          })}
        </div>

        {/* Track */}
        <div className="relative h-2 rounded-full bg-black/15">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-black transition-[width] duration-75"
            style={{ width: `${pct}%` }}
          />
          <div
            className={`absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-black bg-[color:var(--brand-green)] shadow-[0_6px_18px_rgba(0,0,0,0.25)] transition-transform ${
              active ? "scale-110" : "scale-100"
            }`}
            style={{ left: `${pct}%` }}
          />
        </div>

        <div className="mt-3 flex justify-between text-[0.65rem] font-bold tracking-[0.22em] text-black/35 uppercase">
          <span>
            {min}
            {unit ? ` ${unit}` : ""}
          </span>
          <span>
            {max}
            {unit ? ` ${unit}` : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
