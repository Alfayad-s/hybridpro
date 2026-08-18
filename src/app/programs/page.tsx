import SiteNavbar from "@/components/SiteNavbar";
import FooterSection from "@/components/sections/FooterSection";
import ProgramsSection from "@/components/sections/ProgramsSection";
import ThemeGlassToggle from "@/components/ui/ThemeGlassToggle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programs · Hybrid Pro",
  description:
    "Hybrid Pro training programs for strength, fat loss, and muscle development. Online and in-person coaching built around your goals.",
};

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
