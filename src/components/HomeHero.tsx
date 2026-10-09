"use client";

import DesktopHeroSection from "@/components/DesktopHeroSection";
import MobileHeroSection from "@/components/MobileHeroSection";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * Desktop: inset rounded card on a light grey canvas.
 * Mobile: static full-bleed hero.
 */
export default function HomeHero() {
  const { isMobile, isPwa, ready } = useIsMobile(1024);

  // Match mobile hero base (black) so phones never flash a blank white screen
  // while viewport detection runs.
  if (!ready) {
    return <section className="min-h-[100dvh] w-full bg-black" aria-hidden />;
  }

  if (isMobile) {
    return <MobileHeroSection isPwa={isPwa} />;
  }

  return <DesktopHeroSection />;
}
