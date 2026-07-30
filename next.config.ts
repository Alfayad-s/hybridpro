import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  reloadOnOnline: true,
  cacheOnFrontEndNav: true,
  // Keep default Workbox rules; append our frame/audio CacheFirst entries.
  extendDefaultRuntimeCaching: true,
  // Do not precache the full frame pack into the install SW payload.
  // Frames are cached at runtime (CacheFirst) on first visit instead.
  publicExcludes: ["!frames/**/*"],
  workboxOptions: {
    disableDevLogs: true,
    skipWaiting: true,
    runtimeCaching: [
      {
        urlPattern: /\/frames\/.*\.(?:webp|png|jpe?g)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "hybrid-pro-frames-sw-v1",
          expiration: {
            // Full pack is ~1500 frames; keep headroom for swaps.
            maxEntries: 2000,
            maxAgeSeconds: 60 * 60 * 24 * 365,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /\/audio\/gym-cinematic\.mp3$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "hybrid-pro-audio-v1",
          expiration: {
            maxEntries: 2,
            maxAgeSeconds: 60 * 60 * 24 * 365,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  // Required for Next.js 16 when a webpack plugin (next-pwa) is present.
  turbopack: {},
  async headers() {
    return [
      {
        // Immutable frame pack — browsers + SW can keep forever until URL/version changes.
        source: "/frames/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/audio/gym-cinematic.mp3",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default withPWA(nextConfig);
