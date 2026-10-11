import SiteNavbar from "@/components/SiteNavbar";
import FooterSection from "@/components/sections/FooterSection";
import CoachingSection from "@/components/sections/CoachingSection";
import ThemeGlassToggle from "@/components/ui/ThemeGlassToggle";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Online coaching with weekly check-ins",
  description:
    "Hybrid Pro coaching starts with an assessment, then a plan in the app, video form reviews, and weekly check-ins. Online now. A studio is opening in Bengaluru.",
  path: "/coaching",
});

export default function CoachingPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <SiteNavbar />
      <ThemeGlassToggle />
      <CoachingSection />
      <FooterSection />
    </main>
  );
}
