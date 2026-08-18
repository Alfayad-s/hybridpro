import SiteNavbar from "@/components/SiteNavbar";
import FooterSection from "@/components/sections/FooterSection";
import CoachingSection from "@/components/sections/CoachingSection";
import ThemeGlassToggle from "@/components/ui/ThemeGlassToggle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coaching · Hybrid Pro",
  description:
    "How Hybrid Pro coaching works, structured training, accountability, and guidance built around your life.",
};

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
