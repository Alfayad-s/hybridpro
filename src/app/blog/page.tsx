import SiteNavbar from "@/components/SiteNavbar";
import FooterSection from "@/components/sections/FooterSection";
import BlogSection from "@/components/sections/BlogSection";
import ThemeGlassToggle from "@/components/ui/ThemeGlassToggle";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Training notes from Akash",
  description:
    "How Hybrid Pro writes a training week, fuels Performance and Elite, and manages recovery. Notes from Akash, not generic fitness lists.",
  path: "/blog",
});

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
