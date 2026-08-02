import AboutSection from "@/components/AboutSection";
import HomeHero from "@/components/HomeHero";
import SiteNavbar from "@/components/SiteNavbar";
import ThemeGlassToggle from "@/components/ui/ThemeGlassToggle";
import BlogSection from "@/components/sections/BlogSection";
import CoachingSection from "@/components/sections/CoachingSection";
import ContactSection from "@/components/sections/ContactSection";
import FaqSection from "@/components/sections/FaqSection";
import FooterSection from "@/components/sections/FooterSection";
import PricingSection from "@/components/sections/PricingSection";
import ProgramsSection from "@/components/sections/ProgramsSection";
import ResultsSection from "@/components/sections/ResultsSection";
import NutritionSection from "@/components/sections/NutritionSection";

export default function Home() {
  return (
    <main id="top" className="min-h-screen bg-[var(--background)]">
      <SiteNavbar />
      <ThemeGlassToggle showAfterSelector="#about" />
      <HomeHero />
      <AboutSection />
      <ProgramsSection />
      <CoachingSection />
      <NutritionSection />
      <ResultsSection />
      <PricingSection />
      <FaqSection />
      <BlogSection />
      <ContactSection />
      <FooterSection />
    </main>
  );
}
