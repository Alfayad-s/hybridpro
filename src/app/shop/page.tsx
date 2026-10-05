import SiteNavbar from "@/components/SiteNavbar";
import FooterSection from "@/components/sections/FooterSection";
import ShopSection from "@/components/sections/ShopSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop · Hybrid Pro",
  description:
    "Hybrid Pro tees, training shorts, and digital guides. The same shop as the member app.",
};

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] pb-28">
      <style>{`
        html, body {
          scrollbar-width: none;
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
