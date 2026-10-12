"use client";

import SiteNavbar from "@/components/SiteNavbar";
import FooterSection from "@/components/sections/FooterSection";
import ThemeGlassToggle from "@/components/ui/ThemeGlassToggle";
import { PLAY_STORE_URL, GYM_APP_NAME } from "@/lib/gymApp";
import { resultImages, trainerGalleryCards, trainerPortraits } from "@/lib/trainerMedia";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "iphone-16-max": React.HTMLAttributes<HTMLElement> & {
        mode?: "light" | "dark";
      };
    }
  }
}
import {
  Bell,
  Camera,
  ChevronLeft,
  ChevronRight,
  Coins,
  Droplets,
  Dumbbell,
  Flame,
  History,
  LineChart,
  MapPin,
  MessageCircle,
  PersonStanding,
  ShoppingBag,
  Target,
  Trophy,
  UserRound,
  Utensils,
} from "lucide-react";

const washes = ["#F6E7A2", "#E4D4FB", "#F8D4C4"];

const features: { title: string; body: string; icon: ReactNode }[] = [
  {
    title: "Today’s plan",
    body: "See the day’s workout, rest days, and the week ahead from Home.",
    icon: <Target className="h-6 w-6" strokeWidth={1.75} />,
  },
  {
    title: "Live workouts",
    body: "Log sets, run the rest timer, or start a custom session.",
    icon: <Dumbbell className="h-6 w-6" strokeWidth={1.75} />,
  },
  {
    title: "Coach chat",
    body: "Message your coach from the logo in the center of the bar.",
    icon: <MessageCircle className="h-6 w-6" strokeWidth={1.75} />,
  },
  {
    title: "Store",
    body: "Open the Hybrid Pro shop inside the app.",
    icon: <ShoppingBag className="h-6 w-6" strokeWidth={1.75} />,
  },
  {
    title: "Progress",
    body: "Steps, workouts, meals, calories, heart rate, and regularity.",
    icon: <LineChart className="h-6 w-6" strokeWidth={1.75} />,
  },
  {
    title: "Meals",
    body: "Log meals, calories, and water. Coach meal plans on Performance and Elite.",
    icon: <Utensils className="h-6 w-6" strokeWidth={1.75} />,
  },
  {
    title: "History",
    body: "Past sessions with minutes, volume, and streak. On Foundation and Hyrox.",
    icon: <History className="h-6 w-6" strokeWidth={1.75} />,
  },
  {
    title: "Daily targets",
    body: "Water, calories, and body weight against the day’s goal.",
    icon: <Droplets className="h-6 w-6" strokeWidth={1.75} />,
  },
  {
    title: "Streaks",
    body: "Keep a training streak and see how long it has run.",
    icon: <Flame className="h-6 w-6" strokeWidth={1.75} />,
  },
  {
    title: "Challenges",
    body: "Daily, weekly, and monthly tasks that earn coins.",
    icon: <Trophy className="h-6 w-6" strokeWidth={1.75} />,
  },
  {
    title: "Coins and rewards",
    body: "Spend coins and open the rewards gallery.",
    icon: <Coins className="h-6 w-6" strokeWidth={1.75} />,
  },
  {
    title: "Progress photos",
    body: "Capture and keep photos next to your stats.",
    icon: <Camera className="h-6 w-6" strokeWidth={1.75} />,
  },
  {
    title: "Body map",
    body: "See which muscles are ready, recovering, or fatigued.",
    icon: <PersonStanding className="h-6 w-6" strokeWidth={1.75} />,
  },
  {
    title: "Gym check-in",
    body: "Check in when you arrive and start from Home.",
    icon: <MapPin className="h-6 w-6" strokeWidth={1.75} />,
  },
  {
    title: "Notifications",
    body: "Reminders for workouts, meals, water, sleep, and your streak.",
    icon: <Bell className="h-6 w-6" strokeWidth={1.75} />,
  },
  {
    title: "Profile",
    body: "Name, height, current weight, and goal weight.",
    icon: <UserRound className="h-6 w-6" strokeWidth={1.75} />,
  },
];

function StoreBadge({
  kicker,
  label,
  glyph,
  href = PLAY_STORE_URL,
}: {
  kicker: string;
  label: string;
  glyph: ReactNode;
  href?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 rounded-full bg-[#111] px-4 py-2 text-white transition hover:-translate-y-0.5"
    >
      {glyph}
      <span className="text-left leading-none">
        <span className="block text-[10px] text-white/70">{kicker}</span>
        <span className="mt-0.5 block text-sm font-semibold">{label}</span>
      </span>
    </a>
  );
}

const shots = [
  { src: "/app-screenshots/1.png", alt: "Home screen with today’s workout" },
  { src: "/app-screenshots/2.png", alt: "Meals screen with today’s calories" },
  { src: "/app-screenshots/3.png", alt: "Profile screen with streak and coins" },
];

function PhoneMock() {
  const plugins = useMemo(
    () => [Autoplay({ delay: 3200, stopOnInteraction: false })],
    [],
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, plugins);
  const [selected, setSelected] = useState(0);
  const [frameReady, setFrameReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void import("@sneas/telephone/iphone-16-max.js").then(() => {
      if (!cancelled) setFrameReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="relative mx-auto w-fit max-w-full">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[min(70vw,420px)] w-[min(92vw,560px)] -translate-x-1/2 -translate-y-1/2 bg-[#d5d5d5] opacity-40"
        style={{
          WebkitMaskImage: "url(/brand/logo.svg)",
          maskImage: "url(/brand/logo.svg)",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
      {frameReady ? (
      <iphone-16-max mode="dark" className="relative block w-[min(72vw,280px)]">
        <div ref={emblaRef} className="h-full w-full overflow-hidden">
          <div className="flex h-full">
            {shots.map((shot) => (
              <div key={shot.src} className="h-full min-w-0 flex-[0_0_100%]">
                <img
                  src={shot.src}
                  alt={shot.alt}
                  className="h-full w-full object-cover object-top"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </iphone-16-max>
      ) : (
        <div className="aspect-[415/843] w-[min(72vw,280px)]" aria-hidden />
      )}
      <div className="mt-4 flex justify-center gap-2">
        {shots.map((shot, index) => (
          <button
            key={shot.src}
            type="button"
            aria-label={`Show screenshot ${index + 1}`}
            className={`h-1.5 rounded-full transition ${index === selected ? "w-5 bg-[#111]" : "w-1.5 bg-black/25"}`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}

function FeatureCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  return (
    <div className="mt-10">
      <div className="mb-4 flex justify-end gap-2">
        <button
          type="button"
          aria-label="Previous features"
          className="grid h-10 w-10 place-items-center rounded-full bg-[#111] text-white"
          onClick={() => emblaApi?.scrollPrev()}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Next features"
          className="grid h-10 w-10 place-items-center rounded-full bg-[#111] text-white"
          onClick={() => emblaApi?.scrollNext()}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="min-w-0 flex-[0_0_100%] pr-4 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
            >
              <article
                className="flex min-h-[280px] flex-col rounded-3xl p-6"
                style={{ background: washes[index % washes.length] }}
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white/70 text-[#111]">
                  {feature.icon}
                </span>
                <h3 className="mt-8 text-xl font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-black/70">{feature.body}</p>
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex w-fit rounded-full bg-[#111] px-4 py-2 text-sm font-semibold text-white"
                >
                  Open app
                </a>
              </article>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const clientFaces = [
  resultImages.client1.after,
  resultImages.client2.after,
  resultImages.client3.after,
];

function TestimonialCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  return (
    <section className="bg-white py-16">
      <div className="mx-auto w-[92%] rounded-[2rem] bg-[#f3f3f1] px-4 py-12 sm:w-[90%] sm:px-6 sm:py-14 lg:w-[80%] lg:rounded-[3rem]">
      <h2 className="text-center text-2xl font-bold tracking-tight text-balance sm:text-3xl lg:text-4xl">
        Inspiring client experiences
      </h2>
      <p className="mt-3 text-center text-sm text-black/45">
        Real progress from Hybrid Pro coaching.
      </p>

      <div className="mx-auto mt-10 flex w-full max-w-5xl flex-col items-stretch gap-4 lg:mt-12 lg:flex-row lg:items-center">
        <article className="flex min-h-[280px] w-full shrink-0 flex-col justify-between rounded-[2rem] bg-[var(--brand-green)] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.08)] sm:min-h-[340px] lg:w-[280px]">
          <div>
            <p className="text-sm tracking-[0.18em]" aria-hidden>
              ★ ★ ★ ★ ★
            </p>
            <p className="mt-4 text-3xl font-bold tracking-tight">Client results</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {clientFaces.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="h-10 w-10 rounded-full border-2 border-[var(--brand-green)] object-cover object-top"
                />
              ))}
            </div>
            <p className="text-sm leading-tight">
              <span className="block text-lg font-bold">Real</span>
              progress
            </p>
          </div>
        </article>
        <div ref={emblaRef} className="min-w-0 flex-1 overflow-hidden">
          <div className="flex">
            {trainerGalleryCards.map((card) => (
              <div
                key={card.title}
                className="min-w-0 flex-[0_0_100%] pr-3 sm:flex-[0_0_48%] sm:pr-4 lg:flex-[0_0_50%]"
              >
                <article className="flex min-h-[320px] flex-col rounded-[2rem] bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                  <span className="text-4xl leading-none font-serif text-[var(--brand-green)]" aria-hidden>
                    “
                  </span>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-black/70">{card.quote}</p>
                  <div className="mt-6 flex items-center gap-3">
                    <img
                      src={trainerPortraits.light}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover object-top"
                    />
                    <p className="text-sm leading-tight">
                      <span className="block font-semibold">Akash</span>
                      <span className="text-black/45">Hybrid Pro</span>
                    </p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <button
          type="button"
          aria-label="Previous testimonials"
          className="grid h-11 w-11 place-items-center rounded-full bg-white text-black/70 shadow-sm"
          onClick={() => emblaApi?.scrollPrev()}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Next testimonials"
          className="grid h-11 w-11 place-items-center rounded-full bg-white text-black/70 shadow-sm"
          onClick={() => emblaApi?.scrollNext()}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      </div>
    </section>
  );
}

export default function AppInstallPageContent() {
  return (
    <main className="min-h-dvh bg-white text-[#111]">
      <SiteNavbar />
      <ThemeGlassToggle />

      <section className="overflow-x-clip px-4 pt-28 pb-16 sm:px-6 sm:pt-32 lg:px-8">
        <div className="mx-auto w-full max-w-6xl lg:w-[80%]">
          <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="text-center lg:text-left">
              <h1 className="text-[2.15rem] font-extrabold tracking-tight text-balance sm:text-5xl sm:leading-[0.95] lg:text-6xl">
                Train from your pocket with {GYM_APP_NAME}.
              </h1>
              <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-black/55 lg:mx-0">
                Workouts, progress, and coaching live on your phone. Open the app, then add it to your home screen.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                <StoreBadge
                  kicker="Now on"
                  label="App Store"
                  glyph={
                    <img
                      src="/app-store.svg?v=1"
                      alt=""
                      width={22}
                      height={22}
                      className="h-[22px] w-[22px]"
                    />
                  }
                />
                <StoreBadge
                  kicker="Now on"
                  label="Play Store"
                  href="https://play.google.com/store/apps/details?id=in.hybridpro.hybrid_pro_app"
                  glyph={
                    <img
                      src="/play-store.svg?v=2"
                      alt=""
                      width={22}
                      height={22}
                      className="h-[22px] w-[22px]"
                    />
                  }
                />
              </div>
            </div>
            <PhoneMock />
          </div>

          <div className="mt-16 grid gap-6 rounded-2xl bg-[#f3f3f4] px-6 py-8 sm:grid-cols-3 sm:px-8">
            {[
              ["Plans", "Workouts built for your week"],
              ["Progress", "Loads, sessions, and check-ins"],
              ["Coaching", "Messages and meals in the app"],
            ].map(([title, line]) => (
              <div key={title} className="text-center">
                <p className="text-sm tracking-[0.2em] text-[#111]" aria-hidden>
                  ★ ★ ★ ★ ★
                </p>
                <p className="mt-2 text-sm font-semibold">{title}</p>
                <p className="mt-1 text-sm text-black/50">{line}</p>
              </div>
            ))}
          </div>

          <h2 className="mx-auto mt-20 max-w-3xl text-center text-3xl font-extrabold tracking-tight text-balance sm:text-5xl sm:leading-[1.05]">
            Everything in the member app.
          </h2>

          <FeatureCarousel />
        </div>
      </section>
      <TestimonialCarousel />
      <FooterSection />
    </main>
  );
}
