"use client";

import BrandLogo from "@/components/BrandLogo";
import { type FormEvent, useState } from "react";
import { FLUORO_GREEN, Reveal } from "./Reveal";

const fieldClass =
  "w-full border-0 border-b border-black/30 bg-transparent px-0 py-4 text-lg font-bold uppercase tracking-[0.04em] text-black placeholder:font-bold placeholder:uppercase placeholder:tracking-[0.04em] placeholder:text-black/45 outline-none transition focus:border-black focus:ring-0 sm:py-5 sm:text-xl md:text-2xl";

export default function ContactSection() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const goal = String(data.get("goal") || "").trim();

    const subject = encodeURIComponent(
      `Hybrid Pro enquiry, ${name || "New lead"}`,
    );
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nGoal:\n${goal}`,
    );
    window.location.href = `mailto:hello@hybridpro.fit?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section
      id="contact"
      data-scroll-hold
      className="relative flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] scroll-mt-24 flex-col justify-center overflow-hidden px-5 py-10 sm:px-6 sm:py-12 md:px-10 md:py-14"
      style={{ background: FLUORO_GREEN }}
    >
      {/* Half logo, left edge, vertically centered */}
      <div
        className="pointer-events-none absolute top-1/2 left-0 z-[1] -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      >
        <BrandLogo
          className="h-[min(72vh,580px)] w-auto sm:h-[min(78vh,680px)] md:h-[min(85vh,780px)]"
          style={{ color: "rgba(17, 17, 17, 0.14)" }}
          title=""
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
        <Reveal>
          <p className="mb-4 text-[0.7rem] tracking-[0.4em] text-black/55 uppercase sm:mb-5 sm:text-xs sm:tracking-[0.45em]">
            Contact
          </p>
          <h2
            className="max-w-xl text-4xl leading-[0.95] tracking-[0.02em] text-black uppercase sm:text-6xl md:text-7xl"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            Ready when you are.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-black/65 sm:mt-6 sm:text-lg">
            Tell us your goal and we&apos;ll come back with the plan that fits
            it. No sales call, no pressure.
          </p>
          <a
            href="mailto:hello@hybridpro.fit"
            className="mt-6 inline-block text-sm font-medium tracking-wide text-black/70 underline underline-offset-4 transition hover:text-black sm:mt-8"
          >
            hello@hybridpro.fit
          </a>
        </Reveal>

        <Reveal delay={0.08}>
          <form
            onSubmit={onSubmit}
            className="flex w-full flex-col gap-3 sm:gap-4"
          >
            <label className="sr-only" htmlFor="contact-name">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="YOUR NAME"
              className={fieldClass}
            />

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              <div>
                <label className="sr-only" htmlFor="contact-email">
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="EMAIL ADDRESS"
                  className={fieldClass}
                />
              </div>
              <div>
                <label className="sr-only" htmlFor="contact-phone">
                  Phone
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="PHONE NUMBER"
                  className={fieldClass}
                />
              </div>
            </div>

            <label className="sr-only" htmlFor="contact-goal">
              Goal
            </label>
            <textarea
              id="contact-goal"
              name="goal"
              required
              rows={4}
              placeholder="WHAT’S YOUR GOAL?"
              className={`${fieldClass} min-h-[6.5rem] resize-none sm:min-h-[7.5rem]`}
            />

            <button
              type="submit"
              className="mt-1 inline-flex items-center justify-center rounded-full bg-black px-8 py-4 text-base font-semibold text-[color:var(--brand-green)] transition hover:-translate-y-0.5 sm:py-5 sm:text-lg"
            >
              {sent ? "Opening mail…" : "Send message"}
              <span aria-hidden className="ml-2">
                →
              </span>
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
