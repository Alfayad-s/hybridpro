"use client";

import { FLUORO_GREEN } from "@/components/sections/Reveal";
import { type FormEvent, useEffect, useId, useState } from "react";

const NAME_KEY = "hybridpro-visitor-name";
const SPLASH_KEY = "hybridpro-splash-seen";

function readStoredName() {
  try {
    const fromLocal = window.localStorage.getItem(NAME_KEY)?.trim();
    if (fromLocal) return fromLocal;
  } catch {
    // storage can be blocked
  }
  try {
    const fromSession = window.sessionStorage.getItem(NAME_KEY)?.trim();
    if (fromSession) return fromSession;
  } catch {
    // session storage can be blocked
  }
  const match = document.cookie.match(
    /(?:^|;\s*)hybridpro-visitor-name=([^;]*)/,
  );
  const fromCookie = match?.[1] ? decodeURIComponent(match[1]).trim() : "";
  return fromCookie;
}

function rememberName(name: string) {
  try {
    window.localStorage.setItem(NAME_KEY, name);
  } catch {
    // keep going with the other stores
  }
  try {
    window.sessionStorage.setItem(NAME_KEY, name);
  } catch {
    // keep going with the cookie
  }
  const cookie = [
    `${NAME_KEY}=${encodeURIComponent(name)}`,
    "Max-Age=31536000",
    "Path=/",
    "SameSite=Lax",
  ];
  if (window.location.hostname.endsWith("hybridpro.in")) {
    cookie.push("Domain=.hybridpro.in");
  }
  document.cookie = cookie.join("; ");
}

export default function VisitorNameModal() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (readStoredName()) return;

    let splashSeen = false;
    try {
      splashSeen = window.localStorage.getItem(SPLASH_KEY) === "1";
    } catch {
      splashSeen = true;
    }

    const timer = window.setTimeout(() => {
      if (readStoredName()) return;
      setOpen(true);
    }, splashSeen ? 0 : 2100);

    return () => window.clearTimeout(timer);
  }, []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || saving) return;
    setSaving(true);
    rememberName(trimmed);
    setOpen(false);
    void fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    }).catch(() => {
      // name is already remembered on this device
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md rounded-[1.6rem] bg-[var(--background)] px-6 py-7 text-[var(--foreground)] shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:px-8 sm:py-8"
      >
        <p className="text-[0.7rem] font-medium tracking-[0.28em] text-[color:var(--muted)] uppercase">
          Hybrid Pro
        </p>
        <h2 id={titleId} className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          What is your name?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
          Tell us once so we know who is visiting.
        </p>
        <form onSubmit={onSubmit} className="mt-6">
          <label className="sr-only" htmlFor="visitor-name">
            Your name
          </label>
          <input
            id="visitor-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            disabled={saving}
            className="w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3.5 text-base outline-none focus:border-black disabled:opacity-60 dark:border-white/15 dark:focus:border-white"
          />
          <button
            type="submit"
            disabled={saving}
            className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-bold text-[#111] disabled:opacity-60"
            style={{ background: FLUORO_GREEN }}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
