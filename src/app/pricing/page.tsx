import SiteNavbar from "@/components/SiteNavbar";
import FooterSection from "@/components/sections/FooterSection";
import PricingSection from "@/components/sections/PricingSection";
import ThemeGlassToggle from "@/components/ui/ThemeGlassToggle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing · Hybrid Pro",
  description:
    "Hybrid Pro coaching pricing for online and in-person training programs tailored to your goals.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <SiteNavbar />
      <ThemeGlassToggle />
      <PricingSection />
      <FooterSection />
    </main>
  );
}
