import SiteNavbar from "@/components/SiteNavbar";
import FooterSection from "@/components/sections/FooterSection";
import ProgramsSection from "@/components/sections/ProgramsSection";
import ThemeGlassToggle from "@/components/ui/ThemeGlassToggle";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Strength, fat loss, and muscle programs",
  description:
    "Hybrid Pro programs for strength, fat loss, and muscle, 8 to 12 weeks. Train online now, or in person when the Bengaluru studio opens.",
  path: "/programs",
});

export default function ProgramsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <SiteNavbar />
      <ThemeGlassToggle />
      <ProgramsSection />
      <FooterSection />
    </main>
  );
}
