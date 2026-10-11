import AboutSection from "@/components/AboutSection";
import HomeHero from "@/components/HomeHero";
import JsonLd from "@/components/JsonLd";
import SiteNavbar from "@/components/SiteNavbar";
import ThemeGlassToggle from "@/components/ui/ThemeGlassToggle";
import ContactSection from "@/components/sections/ContactSection";
import FaqSection from "@/components/sections/FaqSection";
import FooterSection from "@/components/sections/FooterSection";
import ResultsSection from "@/components/sections/ResultsSection";
import NutritionSection from "@/components/sections/NutritionSection";
import { faqJsonLd, organizationJsonLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Hybrid Pro | Personal coaching online and in Bengaluru",
  description:
    "Hybrid Pro is personal coaching from Akash for strength, fat loss, and habits. Train online now. Hybrid Pro Fitness Studio is opening in Bengaluru.",
  path: "/",
});

export default function Home() {
  return (
    <main id="top" className="min-h-screen bg-[#fff]">
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={faqJsonLd} />
      <SiteNavbar />
      <ThemeGlassToggle showAfterSelector="#about" />
      <HomeHero />
      <AboutSection />
      <NutritionSection />
      <ResultsSection />
      <FaqSection />
      <ContactSection />
      <FooterSection />
    </main>
  );
}
