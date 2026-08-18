import SiteNavbar from "@/components/SiteNavbar";
import FooterSection from "@/components/sections/FooterSection";
import BlogSection from "@/components/sections/BlogSection";
import ThemeGlassToggle from "@/components/ui/ThemeGlassToggle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog · Hybrid Pro",
  description:
    "Training tips, nutrition guidance, and Hybrid Pro insights from Akash.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <SiteNavbar />
      <ThemeGlassToggle />
      <BlogSection />
      <FooterSection />
    </main>
  );
}
