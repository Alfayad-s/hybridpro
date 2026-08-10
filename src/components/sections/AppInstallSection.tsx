"use client";

import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  IconBrandApple,
  IconBrandAndroid,
  IconDeviceMobile,
  IconExternalLink,
} from "@tabler/icons-react";
import { GYM_APP_NAME, GYM_APP_TAGLINE, GYM_APP_URL } from "@/lib/gymApp";
import {
  Eyebrow,
  FLUORO_GREEN,
  Reveal,
  SectionShell,
  SectionTitle,
} from "./Reveal";

export default function AppInstallSection() {
  return (
    <SectionShell id="app">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <Reveal>
          <Eyebrow>GymTrack app</Eyebrow>
          <SectionTitle>Install the training app.</SectionTitle>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[color:var(--muted)] sm:text-lg">
            {GYM_APP_TAGLINE} Scan the QR on your phone, open the site, then add
            it to your home screen, it works like an app.
          </p>

          <ul className="mt-8 flex flex-col gap-3 text-sm text-[var(--foreground)] sm:text-base">
            {[
              "Log sessions and progressive overload",
              "Works offline after install (PWA)",
              "Add to Home Screen on iPhone & Android",
            ].map((line) => (
              <li key={line} className="flex items-start gap-3">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: FLUORO_GREEN }}
                  aria-hidden
                />
                {line}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/app"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-black transition hover:-translate-y-0.5"
              style={{
                background: FLUORO_GREEN,
                boxShadow: "0 10px 28px rgba(var(--brand-green-rgb), 0.3)",
              }}
            >
              <IconDeviceMobile className="h-4 w-4" stroke={1.75} />
              Install guide
            </Link>
            <a
              href={GYM_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--border)] px-6 py-3.5 text-sm font-semibold text-[var(--foreground)] transition hover:-translate-y-0.5 hover:border-[color:var(--brand-green)]"
            >
              Open {GYM_APP_NAME}
              <IconExternalLink className="h-4 w-4" stroke={1.75} />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mx-auto flex w-full max-w-sm flex-col items-center rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--card)] p-8 sm:p-10">
            <div className="rounded-2xl bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
              <QRCodeSVG
                value={GYM_APP_URL}
                size={200}
                level="M"
                bgColor="#ffffff"
                fgColor="#111111"
                marginSize={1}
                title={`QR code for ${GYM_APP_NAME}`}
              />
            </div>
            <p
              className="mt-6 text-center text-2xl tracking-[0.02em] text-[var(--foreground)] uppercase"
              style={{ fontFamily: "var(--font-bebas), sans-serif" }}
            >
              Scan to open
            </p>
            <p className="mt-2 text-center text-xs tracking-[0.2em] text-[color:var(--muted-soft)] uppercase">
              {GYM_APP_URL.replace("https://", "")}
            </p>

            <div className="mt-8 flex w-full items-center justify-center gap-6 text-[color:var(--muted)]">
              <span className="inline-flex items-center gap-1.5 text-xs tracking-[0.18em] uppercase">
                <IconBrandApple className="h-4 w-4" stroke={1.75} />
                iPhone
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs tracking-[0.18em] uppercase">
                <IconBrandAndroid className="h-4 w-4" stroke={1.75} />
                Android
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
