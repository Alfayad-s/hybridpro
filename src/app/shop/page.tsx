import SiteNavbar from "@/components/SiteNavbar";
import FooterSection from "@/components/sections/FooterSection";
import ShopSection from "@/components/sections/ShopSection";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Shop",
  description:
    "Hybrid Pro digital guides. The same shop as the member app. Coaching plans are separate and include check-ins.",
  path: "/shop",
});

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] pb-28">
      <style>{`
        html, body {
          scrollbar-width: none;
          overflow-x: clip;
        }
        html::-webkit-scrollbar,
        body::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <SiteNavbar />
      <ShopSection />
      <FooterSection />
    </main>
  );
}
