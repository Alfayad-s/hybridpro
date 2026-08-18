import AboutSection from "@/components/AboutSection";
import HomeHero from "@/components/HomeHero";
import SiteNavbar from "@/components/SiteNavbar";
import ThemeGlassToggle from "@/components/ui/ThemeGlassToggle";
import ContactSection from "@/components/sections/ContactSection";
import FaqSection from "@/components/sections/FaqSection";
import FooterSection from "@/components/sections/FooterSection";
import ResultsSection from "@/components/sections/ResultsSection";
import NutritionSection from "@/components/sections/NutritionSection";

export default function Home() {
  return (
    <main id="top" className="min-h-screen bg-[var(--background)]">
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
