import AboutSection from "@/components/AboutSection";
import ScrollFrameAnimation from "@/components/ScrollFrameAnimation";
import SiteNavbar from "@/components/SiteNavbar";
import BlogSection from "@/components/sections/BlogSection";
import CoachingSection from "@/components/sections/CoachingSection";
import ContactSection from "@/components/sections/ContactSection";
import FaqSection from "@/components/sections/FaqSection";
import PricingSection from "@/components/sections/PricingSection";
import ProgramsSection from "@/components/sections/ProgramsSection";
import ResultsSection from "@/components/sections/ResultsSection";

export default function Home() {
  return (
    <main id="top" className="min-h-screen bg-black">
      <SiteNavbar />
      <ScrollFrameAnimation
        frameCount={1523}
        folderPath="/frames"
        imageExtension="webp"
        scrollLength={28000}
      />
      <AboutSection />
      <ProgramsSection />
      <CoachingSection />
      <ResultsSection />
      <PricingSection />
      <FaqSection />
      <BlogSection />
      <ContactSection />
    </main>
  );
}
