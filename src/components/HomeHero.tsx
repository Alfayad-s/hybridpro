"use client";

import MobileHeroSection from "@/components/MobileHeroSection";
import ScrollFrameAnimation from "@/components/ScrollFrameAnimation";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * Desktop: scroll-scrubbed frame hero.
 * Mobile: static full-bleed hero (no frame preload / pin).
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

  return (
    <ScrollFrameAnimation
      frameCount={1523}
      folderPath="/frames"
      imageExtension="webp"
      scrollLength={28000}
    />
  );
}
