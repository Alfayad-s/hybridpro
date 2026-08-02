"use client";

import SiteNavbar from "@/components/SiteNavbar";
import TrainerGallerySection from "@/components/TrainerGallerySection";
import { useTheme } from "@/components/ThemeProvider";
import ThemeGlassToggle from "@/components/ui/ThemeGlassToggle";
import { trainer } from "@/lib/trainerContent";
import {
  trainerPhotos,
  trainerPortraits,
  trainerVideo,
} from "@/lib/trainerMedia";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const BRAND = "var(--brand-green)";
const ease = [0.22, 1, 0.36, 1] as const;

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay, duration: 0.75, ease }}
    >
      {children}
    </motion.div>
  );
}

function PhilosophyVideo({
  src,
  poster,
  title,
}: {
  src: string;
  poster: string;
  title: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting && entry.intersectionRatio >= 0.35;
        setActive(inView);
        if (inView) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.35, 0.6], rootMargin: "0px" },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video || !active) return;
    video.play().catch(() => {});
  }, [active]);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-label={title}
      disablePictureInPicture
      disableRemotePlayback
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

export default function AboutPageContent() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const trainerSrc = isDark ? trainerPortraits.dark : trainerPortraits.light;

  return (
    <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <SiteNavbar />
      <ThemeGlassToggle />

      {/* Futuristic name hero, giant type behind portrait */}
      <section className="relative isolate flex h-[100svh] min-h-[560px] flex-col overflow-hidden bg-[var(--background)]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: isDark
              ? "radial-gradient(ellipse 70% 55% at 50% 40%, rgba(166,255,0,0.06), transparent 60%), linear-gradient(180deg, transparent 45%, var(--background) 100%)"
              : "radial-gradient(ellipse 70% 55% at 50% 40%, rgba(147,226,0,0.1), transparent 60%), linear-gradient(180deg, #ececf2 0%, #f7f7fa 55%, #ffffff 85%, var(--background) 100%)",
          }}
          aria-hidden
        />

        {/* Massive background wordmark, behind portrait */}
        <motion.h1
          className="pointer-events-none absolute inset-x-0 top-[36%] z-0 flex -translate-y-1/2 items-center justify-center px-2 select-none sm:top-[40%] md:top-[42%]"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease }}
          aria-label={trainer.name}
        >
          <span
            className="relative block w-full text-center font-black uppercase leading-[0.82] text-[var(--foreground)]"
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "clamp(7.5rem, 38vw, 32rem)",
              letterSpacing: "0.08em",
              textShadow: isDark ? "0 0 80px rgba(166,255,0,0.08)" : "none",
            }}
          >
            <span className="relative inline-block">
              {trainer.name}
              <sup
                className="absolute top-[0.08em] right-0 translate-x-[55%] text-[0.09em] font-normal tracking-normal not-italic opacity-80"
                style={{
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  color: BRAND,
                }}
              >
                ®
              </sup>
            </span>
          </span>
        </motion.h1>

        {/* Portrait, anchored from bottom with soft fade into page */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-10 flex h-[72%] max-h-[820px] items-end justify-center sm:h-[76%] md:h-[80%]"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 1, ease }}
        >
          <div className="relative h-full w-[min(100%,560px)]">
            <Image
              src={trainerSrc}
              alt={`${trainer.name}, Hybrid Pro coach`}
              fill
              priority
              sizes="(max-width: 768px) 90vw, 560px"
              className="object-contain object-bottom drop-shadow-[0_24px_60px_rgba(0,0,0,0.28)]"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] sm:h-[38%]"
              style={{
                background: isDark
                  ? "linear-gradient(to top, var(--background) 0%, rgba(0,0,0,0.75) 35%, transparent 100%)"
                  : "linear-gradient(to top, #f7f7fa 0%, rgba(247,247,250,0.92) 30%, rgba(255,255,255,0.55) 55%, transparent 100%)",
              }}
              aria-hidden
            />
          </div>
        </motion.div>

        {/* Bottom meta strip */}
        <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/90 to-transparent px-4 pb-8 pt-24 sm:px-6 sm:pb-10 md:px-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7, ease }}
            >
              <p
                className="text-[0.65rem] tracking-[0.42em] uppercase sm:text-xs"
                style={{ color: BRAND }}
              >
                Founder &amp; CEO
              </p>
              <p className="mt-1.5 max-w-sm text-sm text-[color:var(--muted)] sm:text-base">
                Hybrid Pro Training Program · {trainer.credentials}
              </p>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7, ease }}
            >
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5"
                style={{
                  background: BRAND,
                  boxShadow: "0 10px 28px rgba(var(--brand-green-rgb), 0.35)",
                }}
              >
                Start training
                <span aria-hidden className="text-base leading-none">
                  ↗
                </span>
              </Link>
              <Link
                href="/#about"
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] px-5 py-3 text-sm font-medium transition hover:border-[color:var(--brand-green)]"
              >
                Back to home
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Intro, image flush left, narrower column; copy takes remaining space */}
      <section className="relative isolate overflow-hidden border-t border-[color:var(--border)]">
        <div className="grid items-center lg:grid-cols-[minmax(240px,36%)_minmax(0,1fr)]">
          <Reveal className="relative mx-auto aspect-[3/4] w-full max-w-[320px] overflow-hidden rounded-[1.75rem] sm:max-w-[360px] lg:mx-0 lg:aspect-auto lg:max-w-none lg:min-h-[min(70vh,560px)] lg:rounded-none">
            <Image
              src={trainerPhotos[2].src}
              alt="Akash training, lat pulldown"
              fill
              sizes="(max-width: 1024px) 90vw, 36vw"
              className="object-cover object-center"
            />
          </Reveal>

          <div className="min-w-0 px-4 py-12 text-left sm:px-6 sm:py-16 md:px-10 md:py-20 lg:max-w-2xl lg:pl-10 xl:pl-14">
            <Reveal>
              <p
                className="text-[0.7rem] tracking-[0.4em] uppercase sm:text-xs"
                style={{ color: BRAND }}
              >
                Introduction
              </p>
              <h2
                className="mt-3 text-4xl leading-[0.92] tracking-[0.02em] text-[var(--foreground)] uppercase sm:text-5xl md:text-6xl"
                style={{ fontFamily: "var(--font-bebas), sans-serif" }}
              >
                Train with purpose.
              </h2>
            </Reveal>

            <Reveal delay={0.06}>
              <p
                className="mt-6 text-base leading-[1.7] text-[color:var(--muted)] sm:mt-7 sm:text-lg sm:leading-[1.75] md:text-[1.25rem] md:leading-[1.7]"
                style={{
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                }}
              >
                {trainer.heroLead}
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <p
                className="mt-7 border-l-2 pl-4 text-base font-medium leading-[1.55] text-[var(--foreground)] sm:mt-8 sm:pl-5 sm:text-lg sm:leading-[1.5] md:text-[1.35rem]"
                style={{
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  borderColor: "var(--brand-green)",
                }}
              >
                {trainer.philosophy}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <p
                className="mt-7 text-sm leading-[1.7] tracking-[0.01em] text-[color:var(--muted)] sm:mt-8 sm:text-base sm:leading-[1.75]"
                style={{
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                }}
              >
                {trainer.closing}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-[color:var(--border)] px-4 py-20 sm:px-6 sm:py-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p
              className="text-[0.7rem] tracking-[0.4em] uppercase sm:text-xs"
              style={{ color: BRAND }}
            >
              The brand
            </p>
            <h2
              className="mt-4 max-w-2xl text-4xl leading-[0.95] tracking-[0.02em] uppercase sm:text-5xl md:text-6xl"
              style={{ fontFamily: "var(--font-bebas), sans-serif" }}
            >
              {trainer.whyTitle}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-[color:var(--muted)] sm:text-lg">
              {trainer.whyBody}
            </p>
            <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-[var(--foreground)] sm:text-lg">
              {trainer.whyCta}
            </p>
          </Reveal>
        </div>
      </section>

      <section
        className="px-4 py-20 sm:px-6 sm:py-24 md:px-10"
        style={{ background: isDark ? "#0a0a0a" : "#ececf2" }}
      >
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-stretch lg:gap-14">
          <Reveal className="relative min-h-[420px] lg:min-h-0 lg:h-full">
            <div
              className="absolute inset-0 overflow-hidden rounded-2xl border border-[color:var(--border)]"
              style={{ background: isDark ? "#111" : "#f7f7fa" }}
            >
              <PhilosophyVideo
                src={trainerVideo.src}
                poster={trainerPhotos[0].src}
                title={trainerVideo.title}
              />
            </div>
          </Reveal>

          <div className="flex flex-col">
            <Reveal>
              <p
                className="text-[0.7rem] tracking-[0.4em] uppercase sm:text-xs"
                style={{ color: BRAND }}
              >
                Approach
              </p>
              <h2
                className="mt-4 text-4xl leading-[0.95] tracking-[0.02em] uppercase sm:text-5xl md:text-6xl"
                style={{ fontFamily: "var(--font-bebas), sans-serif" }}
              >
                {trainer.approachTitle}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-[color:var(--muted)] sm:text-lg">
                {trainer.approachLead}
              </p>
            </Reveal>

            <ul className="mt-8 flex flex-col">
              {trainer.approachFocus.map((item, i) => (
                <Reveal key={item} delay={0.04 * i}>
                  <li className="flex gap-4 border-t border-[color:var(--border)] py-4 first:border-t-0 first:pt-0 sm:py-5">
                    <span
                      className="shrink-0 pt-1 font-mono text-xs tracking-widest"
                      style={{ color: BRAND }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm leading-snug text-[var(--foreground)] sm:text-base">
                      {item}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-[color:var(--border)] px-4 py-20 sm:px-6 sm:py-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p
              className="text-[0.7rem] tracking-[0.4em] uppercase sm:text-xs"
              style={{ color: BRAND }}
            >
              Experience
            </p>
            <h2
              className="mt-4 max-w-2xl text-4xl leading-[0.95] tracking-[0.02em] uppercase sm:text-5xl md:text-6xl"
              style={{ fontFamily: "var(--font-bebas), sans-serif" }}
            >
              {trainer.experienceTitle}
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[color:var(--muted)] sm:text-lg">
              {trainer.experienceLead}
            </p>
          </Reveal>

          <ul className="mt-12 grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {trainer.experienceClients.map((item, i) => (
              <Reveal key={item} delay={0.04 * i}>
                <li className="flex gap-3 text-sm leading-relaxed text-[var(--foreground)] sm:text-base">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: BRAND }}
                    aria-hidden
                  />
                  {item}
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.2}>
            <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-[color:var(--border)] pt-10">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold text-black transition hover:-translate-y-0.5"
                style={{
                  background: BRAND,
                  boxShadow: "0 10px 28px rgba(var(--brand-green-rgb), 0.35)",
                }}
              >
                Work with Akash
              </Link>
              <p className="text-sm text-[color:var(--muted)]">
                Personalized coaching · Online &amp; in person
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <TrainerGallerySection />
    </main>
  );
}
