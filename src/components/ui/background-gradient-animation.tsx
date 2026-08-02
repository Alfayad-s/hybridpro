"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, type ReactNode } from "react";

export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(108, 0, 162)",
  gradientBackgroundEnd = "rgb(0, 17, 82)",
  firstColor = "18, 113, 255",
  secondColor = "221, 74, 255",
  thirdColor = "100, 220, 255",
  fourthColor = "200, 50, 50",
  fifthColor = "180, 180, 50",
  pointerColor = "140, 100, 255",
  size = "80%",
  blendingValue = "hard-light",
  children,
  className,
  interactive = true,
  containerClassName,
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const interactiveRef = useRef<HTMLDivElement>(null);
  const curRef = useRef({ x: 0, y: 0 });
  const tgRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.style.setProperty(
      "--gradient-background-start",
      gradientBackgroundStart,
    );
    el.style.setProperty("--gradient-background-end", gradientBackgroundEnd);
    el.style.setProperty("--first-color", firstColor);
    el.style.setProperty("--second-color", secondColor);
    el.style.setProperty("--third-color", thirdColor);
    el.style.setProperty("--fourth-color", fourthColor);
    el.style.setProperty("--fifth-color", fifthColor);
    el.style.setProperty("--pointer-color", pointerColor);
    el.style.setProperty("--size", size);
    el.style.setProperty("--blending-value", blendingValue);
  }, [
    gradientBackgroundStart,
    gradientBackgroundEnd,
    firstColor,
    secondColor,
    thirdColor,
    fourthColor,
    fifthColor,
    pointerColor,
    size,
    blendingValue,
  ]);

  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (!interactive) return;

    const tick = () => {
      const node = interactiveRef.current;
      if (!node) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      curRef.current.x += (tgRef.current.x - curRef.current.x) / 20;
      curRef.current.y += (tgRef.current.y - curRef.current.y) / 20;
      node.style.transform = `translate(${Math.round(curRef.current.x)}px, ${Math.round(curRef.current.y)}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [interactive]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveRef.current) return;
    const rect = interactiveRef.current.getBoundingClientRect();
    tgRef.current.x = event.clientX - rect.left;
    tgRef.current.y = event.clientY - rect.top;
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full w-full overflow-hidden bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
        containerClassName,
      )}
      onMouseMove={interactive ? handleMouseMove : undefined}
    >
      <svg className="hidden" aria-hidden>
        <defs>
          <filter id="results-gradient-blur">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div
        className={cn(
          "gradients-container pointer-events-none absolute inset-0 z-0 h-full w-full blur-lg",
          isSafari
            ? "blur-2xl"
            : "[filter:url(#results-gradient-blur)_blur(40px)]",
        )}
        aria-hidden
      >
        <div
          className={cn(
            "absolute opacity-100",
            "[background:radial-gradient(circle_at_center,_rgba(var(--first-color),_0.85)_0,_rgba(var(--first-color),_0)_50%)_no-repeat]",
            "[mix-blend-mode:var(--blending-value)] h-[var(--size)] w-[var(--size)]",
            "top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]",
            "[transform-origin:center_center] animate-first",
          )}
        />
        <div
          className={cn(
            "absolute opacity-100",
            "[background:radial-gradient(circle_at_center,_rgba(var(--second-color),_0.8)_0,_rgba(var(--second-color),_0)_50%)_no-repeat]",
            "[mix-blend-mode:var(--blending-value)] h-[var(--size)] w-[var(--size)]",
            "top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]",
            "[transform-origin:calc(50%-400px)] animate-second",
          )}
        />
        <div
          className={cn(
            "absolute opacity-100",
            "[background:radial-gradient(circle_at_center,_rgba(var(--third-color),_0.8)_0,_rgba(var(--third-color),_0)_50%)_no-repeat]",
            "[mix-blend-mode:var(--blending-value)] h-[var(--size)] w-[var(--size)]",
            "top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]",
            "[transform-origin:calc(50%+400px)] animate-third",
          )}
        />
        <div
          className={cn(
            "absolute opacity-70",
            "[background:radial-gradient(circle_at_center,_rgba(var(--fourth-color),_0.8)_0,_rgba(var(--fourth-color),_0)_50%)_no-repeat]",
            "[mix-blend-mode:var(--blending-value)] h-[var(--size)] w-[var(--size)]",
            "top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]",
            "[transform-origin:calc(50%-200px)] animate-fourth",
          )}
        />
        <div
          className={cn(
            "absolute opacity-100",
            "[background:radial-gradient(circle_at_center,_rgba(var(--fifth-color),_0.8)_0,_rgba(var(--fifth-color),_0)_50%)_no-repeat]",
            "[mix-blend-mode:var(--blending-value)] h-[var(--size)] w-[var(--size)]",
            "top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]",
            "[transform-origin:calc(50%-800px)_calc(50%+800px)] animate-fifth",
          )}
        />

        {interactive && (
          <div
            ref={interactiveRef}
            className={cn(
              "absolute -top-1/2 -left-1/2 h-full w-full opacity-70",
              "[background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.8)_0,_rgba(var(--pointer-color),_0)_50%)_no-repeat]",
              "[mix-blend-mode:var(--blending-value)]",
            )}
          />
        )}
      </div>

      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
