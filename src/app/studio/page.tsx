import SiteNavbar from "@/components/SiteNavbar";
import FooterSection from "@/components/sections/FooterSection";
import ThemeGlassToggle from "@/components/ui/ThemeGlassToggle";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMeta({
  title: "Hybrid Pro Fitness Studio, Bengaluru",
  description:
    "Hybrid Pro Fitness Studio is opening in Bengaluru. Online coaching with Akash is available now for strength, fat loss, muscle, and Hyrox.",
  path: "/studio",
});

export default function StudioPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <SiteNavbar />
      <ThemeGlassToggle />
      <article className="mx-auto w-full max-w-3xl px-5 pt-32 pb-20 sm:px-6">
        <p className="text-xs tracking-[0.25em] text-[color:var(--muted)] uppercase">
          Bengaluru
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
          Hybrid Pro Fitness Studio is opening in Bengaluru.
        </h1>
        <p className="mt-6 text-base leading-relaxed text-[color:var(--muted)]">
          Online coaching is available now. Akash writes the plan, you train
          from the Hybrid Pro app, and check-ins stay weekly. The studio does
          not have a published address yet. This page will carry the street
          once the space is confirmed.
        </p>
        <p className="mt-5 text-base leading-relaxed text-[color:var(--muted)]">
          The in-person work will follow the same programs as online coaching:
          strength, fat loss, and muscle blocks of 8 to 12 weeks, plus the
          12-week Hyrox plan. Meals are part of Performance and Elite.
          Foundation and Hyrox do not include meal logging.
        </p>
        <ul className="mt-8 flex flex-col gap-3 text-base">
          <li>
            <Link href="/programs" className="underline">
              See the programs
            </Link>
          </li>
          <li>
            <Link href="/coaching" className="underline">
              How coaching works
            </Link>
          </li>
          <li>
            <Link href="/pricing" className="underline">
              Coaching plans from ₹3,500
            </Link>
          </li>
          <li>
            <Link href="/app" className="underline">
              Open the member app
            </Link>
          </li>
        </ul>
      </article>
      <FooterSection />
    </main>
  );
}
