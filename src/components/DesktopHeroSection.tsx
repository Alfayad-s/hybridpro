"use client";

import { programImages } from "@/lib/trainerMedia";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const headlines = [
  "Strength, fat loss, and habits that last.",
  "Coaching built around your life.",
  "Train with purpose. Stay consistent.",
  "Online or in person.",
];

function TypedHeadline() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [leaving, setLeaving] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const full = headlines[index];
    let delay = 42;
    let next: () => void;

    if (!leaving && text.length < full.length) {
      next = () => setText(full.slice(0, text.length + 1));
    } else if (!leaving) {
      delay = 1900;
      next = () => setLeaving(true);
    } else {
      delay = 460;
      next = () => {
        setText("");
        setLeaving(false);
        setIndex((current) => (current + 1) % headlines.length);
      };
    }

    const timer = window.setTimeout(next, delay);
    return () => window.clearTimeout(timer);
  }, [text, leaving, index, reduced]);

  const shown = reduced ? headlines[0] : text;

  return (
    <h1 className="mt-4 min-h-[3.35em] max-w-[14ch] text-[clamp(2.15rem,4.2vw,4.15rem)] leading-[1.08] font-semibold tracking-[-0.03em] text-[#111]">
      <span className="sr-only">{headlines[0]}</span>
      <span
        aria-hidden
        className={`inline ${leaving ? "translate-y-2 opacity-0 transition duration-500 ease-in" : ""}`}
      >
        {shown.split(" ").map((word, wordIndex, words) => (
          <span key={`${index}-${wordIndex}`} className="inline-block whitespace-nowrap">
            {word.split("").map((char, charIndex) => (
              <span
                key={`${index}-${wordIndex}-${charIndex}`}
                className={reduced ? undefined : "inline-block animate-[hero-char-in_240ms_ease-out]"}
              >
                {char}
              </span>
            ))}
            {wordIndex < words.length - 1 ? "\u00A0" : null}
          </span>
        ))}
        <span className="hero-caret ml-1 inline-block h-[0.82em] w-[3px] translate-y-[0.06em] bg-[#111] align-baseline" />
      </span>
    </h1>
  );
}

/** Home hero: centered headline on the left, training photo on the right. */
export default function DesktopHeroSection() {
  return (
    <section
      className="bg-[#fff] px-3 pb-3 sm:px-4 sm:pb-4"
      style={{
        paddingTop: "calc(var(--site-nav-height, 4.75rem) + 0.75rem)",
      }}
      aria-label="Hybrid Pro, welcome"
    >
      <div className="mx-auto flex min-h-[calc(100dvh-var(--site-nav-height,4.75rem)-1.5rem)] w-full max-w-[1440px] flex-col overflow-hidden rounded-[1.75rem] bg-white lg:h-[calc(100dvh-var(--site-nav-height,4.75rem)-1.5rem)] lg:flex-row lg:rounded-[2rem]">
        <div className="flex flex-1 flex-col px-5 py-8 sm:px-8 lg:px-10 lg:py-8">
          <div className="flex flex-1 flex-col items-center justify-center px-2 text-center">
            <p className="text-xs tracking-[0.08em] text-black/45 sm:text-sm">
              Hybrid Pro coaching
            </p>
            <TypedHeadline />
            <p className="mt-5 max-w-md text-sm leading-relaxed text-black/55 sm:text-base">
              Hybrid Pro is personal coaching from Akash. Train online now. Hybrid Pro Fitness Studio is opening in Bengaluru.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 lg:mt-0">
            <Link
              href="#contact"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#111] py-1.5 pr-5 pl-1.5 text-sm font-medium text-white transition hover:-translate-y-0.5"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15">
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </span>
              Contact us now
            </Link>
            <Link
              href="/programs"
              className="inline-flex items-center gap-3 text-right text-xs leading-tight text-black/55 transition hover:text-[#111]"
            >
              See the
              <br />
              programs
              <Image
                src={programImages.muscle}
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover"
              />
            </Link>
          </div>
        </div>

        <div className="p-3 sm:p-4 lg:w-[52%] lg:pl-0">
          <div className="relative min-h-[460px] overflow-hidden rounded-[1.5rem] lg:h-full lg:min-h-0">
            <Image
              src={programImages.strength}
              alt="Athlete performing a heavy deadlift in the gym"
              fill
              priority
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-cover object-center"
            />
            <Link
              href="/pricing"
              className="absolute right-4 bottom-4 inline-flex items-center gap-3 rounded-2xl bg-white/85 px-4 py-3 text-xs leading-tight text-[#111] shadow-sm backdrop-blur-md transition hover:bg-white sm:right-5 sm:bottom-5"
            >
              See
              <br />
              plans
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
