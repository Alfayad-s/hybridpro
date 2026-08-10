"use client";

import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  IconBrandAndroid,
  IconBrandApple,
  IconExternalLink,
  IconShare2,
} from "@tabler/icons-react";
import SiteNavbar from "@/components/SiteNavbar";
import ThemeGlassToggle from "@/components/ui/ThemeGlassToggle";
import { GYM_APP_NAME, GYM_APP_TAGLINE, GYM_APP_URL } from "@/lib/gymApp";
import { FLUORO_GREEN, Reveal } from "@/components/sections/Reveal";

const iosSteps = [
  "Scan the QR or tap Open GymTrack below.",
  "In Safari, tap the Share button.",
  "Scroll and tap Add to Home Screen.",
  "Tap Add, GymTrack appears like a native app.",
];

const androidSteps = [
  "Scan the QR or tap Open GymTrack below.",
  "In Chrome, tap the menu (⋮) or the Install banner.",
  "Choose Install app / Add to Home screen.",
  "Confirm Install, open GymTrack from your home screen.",
];

export default function AppInstallPageContent() {
  return (
    <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <SiteNavbar />
      <ThemeGlassToggle />

      <section className="relative overflow-hidden px-4 pt-28 pb-16 sm:px-6 sm:pt-32 sm:pb-20 md:px-10">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 10%, rgba(var(--brand-green-rgb), 0.18), transparent 42%),
              radial-gradient(circle at 80% 80%, rgba(var(--brand-green-rgb), 0.08), transparent 45%)
            `,
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto grid w-full max-w-6xl items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16">
          <Reveal>
            <p
              className="text-[0.7rem] tracking-[0.4em] uppercase sm:text-xs"
              style={{ color: FLUORO_GREEN }}
            >
              Install {GYM_APP_NAME}
            </p>
            <h1
              className="mt-4 text-5xl leading-[0.92] tracking-[0.02em] uppercase sm:text-6xl md:text-7xl"
              style={{ fontFamily: "var(--font-bebas), sans-serif" }}
            >
              Put Hybrid Pro
              <br />
              on your phone.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-[color:var(--muted)] sm:text-lg">
              {GYM_APP_TAGLINE} Scanning opens the web app. From there, add it
              to your home screen so it launches full-screen like a native app.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={GYM_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-black transition hover:-translate-y-0.5"
                style={{
                  background: FLUORO_GREEN,
                  boxShadow: "0 10px 28px rgba(var(--brand-green-rgb), 0.35)",
                }}
              >
                Open {GYM_APP_NAME}
                <IconExternalLink className="h-4 w-4" stroke={1.75} />
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] px-6 py-3.5 text-sm font-semibold transition hover:border-[color:var(--brand-green)]"
              >
                Back to Hybrid Pro
              </Link>
            </div>

            <div className="mt-12 max-w-xs rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--card)] p-6 sm:p-7">
              <div className="mx-auto w-fit rounded-2xl bg-white p-3">
                <QRCodeSVG
                  value={GYM_APP_URL}
                  size={180}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#111111"
                  marginSize={1}
                  title={`QR code for ${GYM_APP_NAME}`}
                />
              </div>
              <p className="mt-4 text-center text-xs tracking-[0.22em] text-[color:var(--muted-soft)] uppercase">
                Scan with your camera
              </p>
              <p className="mt-1 text-center text-sm font-medium text-[var(--foreground)]">
                {GYM_APP_URL.replace("https://", "")}
              </p>
            </div>
          </Reveal>

          <div className="flex flex-col gap-6">
            <Reveal delay={0.06}>
              <article className="rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--card)] p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ background: FLUORO_GREEN }}
                  >
                    <IconBrandApple className="h-5 w-5 text-black" stroke={1.75} />
                  </span>
                  <div>
                    <h2
                      className="text-2xl tracking-[0.02em] uppercase sm:text-3xl"
                      style={{ fontFamily: "var(--font-bebas), sans-serif" }}
                    >
                      iPhone / iPad
                    </h2>
                    <p className="text-xs tracking-[0.2em] text-[color:var(--muted-soft)] uppercase">
                      Safari
                    </p>
                  </div>
                </div>
                <ol className="mt-6 flex flex-col gap-4">
                  {iosSteps.map((step, i) => (
                    <li key={step} className="flex gap-3 text-sm leading-relaxed text-[color:var(--muted)] sm:text-base">
                      <span
                        className="mt-0.5 shrink-0 font-mono text-[0.65rem] tracking-widest"
                        style={{ color: FLUORO_GREEN }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>
                        {i === 1 ? (
                          <>
                            In Safari, tap the{" "}
                            <IconShare2
                              className="inline h-4 w-4 align-text-bottom"
                              stroke={1.75}
                            />{" "}
                            Share button.
                          </>
                        ) : (
                          step
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
              </article>
            </Reveal>

            <Reveal delay={0.1}>
              <article className="rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--card)] p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ background: FLUORO_GREEN }}
                  >
                    <IconBrandAndroid
                      className="h-5 w-5 text-black"
                      stroke={1.75}
                    />
                  </span>
                  <div>
                    <h2
                      className="text-2xl tracking-[0.02em] uppercase sm:text-3xl"
                      style={{ fontFamily: "var(--font-bebas), sans-serif" }}
                    >
                      Android
                    </h2>
                    <p className="text-xs tracking-[0.2em] text-[color:var(--muted-soft)] uppercase">
                      Chrome
                    </p>
                  </div>
                </div>
                <ol className="mt-6 flex flex-col gap-4">
                  {androidSteps.map((step, i) => (
                    <li
                      key={step}
                      className="flex gap-3 text-sm leading-relaxed text-[color:var(--muted)] sm:text-base"
                    >
                      <span
                        className="mt-0.5 shrink-0 font-mono text-[0.65rem] tracking-widest"
                        style={{ color: FLUORO_GREEN }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </article>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="text-sm leading-relaxed text-[color:var(--muted)]">
                Note: a QR code opens the site first. Your phone will not
                silently install the app, that install step is required by
                iOS and Android.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
