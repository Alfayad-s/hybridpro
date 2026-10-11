import JsonLd from "@/components/JsonLd";
import SiteNavbar from "@/components/SiteNavbar";
import FooterSection from "@/components/sections/FooterSection";
import PricingSection from "@/components/sections/PricingSection";
import ThemeGlassToggle from "@/components/ui/ThemeGlassToggle";
import { offersJsonLd, pageMeta } from "@/lib/seo";
import { Suspense } from "react";

export const metadata = pageMeta({
  title: "Coaching plans from ₹3,500",
  description:
    "Foundation, Performance, Elite, and Hyrox. Online coaching in rupees, cancel anytime. In-person coaching follows when Hybrid Pro Fitness Studio opens in Bengaluru.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <JsonLd data={offersJsonLd} />
      <SiteNavbar />
      <ThemeGlassToggle />
      <Suspense>
        <PricingSection />
      </Suspense>
      <FooterSection />
    </main>
  );
}
