import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { CartProvider } from "@/components/shop/CartProvider";
import { ShopCatalogProvider } from "@/components/shop/ShopCatalogProvider";
import { WishlistProvider } from "@/components/shop/WishlistProvider";
import SplashScreen from "@/components/SplashScreen";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const outfit = localFont({
  src: "../fonts/Outfit-Variable.woff2",
  variable: "--font-outfit",
  display: "swap",
  weight: "100 900",
});

const greatVibes = localFont({
  src: "../fonts/GreatVibes-Regular.woff2",
  variable: "--font-signature",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hybridpro.in"),
  title: "Hybrid Pro | Personal coaching online and in Bengaluru",
  description:
    "Hybrid Pro is personal coaching from Akash for strength, fat loss, and habits. Train online now. Hybrid Pro Fitness Studio is opening in Bengaluru.",
  applicationName: "Hybrid Pro",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Hybrid Pro",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "Hybrid Pro" }],
  },
  twitter: {
    card: "summary",
    images: ["/icon-512.png"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hybrid Pro",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7fa" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const themeInitScript = `
(() => {
 try {
 const key = 'hybridpro-theme';
 const stored = localStorage.getItem(key);
 // Default is always light/white; only honor an explicit user choice.
 const theme = stored === 'light' || stored === 'dark' ? stored : 'light';
 const root = document.documentElement;
 root.classList.toggle('dark', theme === 'dark');
 root.dataset.theme = theme;
 root.style.colorScheme = theme;
 } catch (_) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${outfit.className} ${greatVibes.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
        <Script id="hybridpro-theme" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <ThemeProvider>
          <ShopCatalogProvider>
            <CartProvider>
              <WishlistProvider>
                <SplashScreen />
                {children}
              </WishlistProvider>
            </CartProvider>
          </ShopCatalogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
