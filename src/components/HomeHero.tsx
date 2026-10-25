"use client";

import ScrollFrameAnimation from "@/components/ScrollFrameAnimation";

/** Scroll-scrubbed frame hero on phone and desktop. */
export default function HomeHero() {
  return (
    <ScrollFrameAnimation
      frameCount={1523}
      folderPath="/frames"
      imageExtension="webp"
      scrollLength={28000}
    />
  );
}
