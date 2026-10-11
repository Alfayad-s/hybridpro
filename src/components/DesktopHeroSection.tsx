"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Dumbbell, Flame, LineChart, Users } from "lucide-react";
import { FLUORO_GREEN } from "@/components/sections/Reveal";

const features = [
  { icon: Dumbbell, label: "Personalized Workouts" },
  { icon: LineChart, label: "Track Your Progress" },
  { icon: Users, label: "Expert Coaching" },
];

/** Large-screen home hero matching the Hybrid Pro landing layout. */
export default function DesktopHeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-[#f4f5f7]"
      style={{
        marginTop: "var(--site-nav-height, 4.75rem)",
        height: "calc(100dvh - var(--site-nav-height, 4.75rem))",
        maxHeight: "calc(100dvh - var(--site-nav-height, 4.75rem))",
      }}
      aria-label="Hybrid Pro, welcome"
    >
      <div
        className="pointer-events-none absolute top-[8%] right-[4%] h-[78%] w-[36%] rounded-[3.5rem] bg-[#dff3b4]"
        style={{ transform: "rotate(18deg)" }}
        aria-hidden
      />

      <div className="relative z-10 flex h-full items-center px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="w-[min(48%,640px)] pb-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#3a3a3a] shadow-sm">
            <LineChart size={14} color={FLUORO_GREEN} aria-hidden />
            Smarter Training. Better Results.
          </p>

          <h1 className="mt-5 text-[clamp(4.2rem,7.4vw,7.4rem)] leading-[0.86] font-extrabold tracking-[-0.045em] text-[#111111]">
            HYBRID
            <br />
            <span style={{ color: FLUORO_GREEN }}>PRO</span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-[#3d3d3d] md:text-lg">
            Personalized training, expert coaching, and real progress — anytime,
            anywhere.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5"
              style={{
                background: FLUORO_GREEN,
                boxShadow: "0 10px 28px rgba(var(--brand-green-rgb), 0.35)",
              }}
            >
              Start Your Journey
              <ArrowRight size={16} aria-hidden />
            </Link>
            <Link
              href="/programs"
              className="inline-flex items-center rounded-full border border-[#d5d5d8] bg-white px-5 py-3 text-sm font-semibold text-[#111111] transition hover:-translate-y-0.5"
            >
              Explore Programs
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2" aria-hidden>
              {["#111111", "#6b7280", "#c5c7cb"].map((color) => (
                <span
                  key={color}
                  className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#f4f5f7]"
                  style={{ background: color }}
                >
                  <Users size={16} color="#fff" />
                </span>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111111]">Join 10K+ members</p>
              <p className="text-xs text-[#6b7280]">Real people. Real results.</p>
            </div>
          </div>

          <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium text-[#3a3a3a]">
            {features.map((item, index) => (
              <li key={item.label} className="flex items-center gap-5">
                {index > 0 ? (
                  <span className="h-5 w-px bg-[#d5d5d8]" aria-hidden />
                ) : null}
                <span className="inline-flex items-center gap-2">
                  <item.icon size={16} aria-hidden />
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Image
        src="/hero/man.png"
        alt=""
        width={1262}
        height={1246}
        priority
        loading="eager"
        className="pointer-events-none absolute right-[1%] bottom-0 z-[1] h-[96%] w-auto max-w-[52%] object-contain object-bottom"
      />

      <div className="absolute top-[14%] right-[4%] z-[2] w-[210px] rounded-2xl bg-white p-4 shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between text-xs font-medium text-[#6b7280]">
          <span className="inline-flex items-center gap-1.5">
            <LineChart size={14} aria-hidden />
            Weekly Progress
          </span>
          <ArrowUpRight size={14} aria-hidden />
        </div>
        <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#111111]">
          +60%
        </p>
        <p className="text-xs text-[#6b7280]">Strength increase</p>
        <div className="mt-3 flex h-10 items-end gap-1.5" aria-hidden>
          {[28, 40, 34, 52, 70].map((height) => (
            <span
              key={height}
              className="w-3 rounded-sm"
              style={{
                height,
                background: height > 50 ? FLUORO_GREEN : "#d9f5a6",
              }}
            />
          ))}
        </div>
      </div>

      <div className="absolute top-[46%] right-[34%] z-[2] w-[168px] rounded-2xl bg-white p-4 shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6b7280]">
          <Flame size={14} color="#f97316" aria-hidden />
          Calories Burned
        </p>
        <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#111111]">
          480
          <span className="ml-1 text-sm font-semibold text-[#6b7280]">kcal</span>
        </p>
        <svg viewBox="0 0 120 28" className="mt-2 h-7 w-full" aria-hidden>
          <path
            d="M2 20 C 18 20, 22 8, 36 12 S 54 24, 68 14 S 92 4, 118 10"
            fill="none"
            stroke={FLUORO_GREEN}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <p
        className="pointer-events-none absolute right-[3%] bottom-[18%] z-[2] text-right text-[1.65rem] leading-tight text-[#111111]"
        style={{ fontFamily: "var(--font-signature), cursive" }}
      >
        Stronger
        <br />
        Healthier
        <br />
        Happier You
      </p>
    </section>
  );
}
