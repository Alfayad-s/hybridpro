import type { Metadata, Viewport } from "next";
import { Great_Vibes, Outfit } from "next/font/google";
import SplashScreen from "@/components/SplashScreen";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-signature",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hybrid Pro",
  description: "Scroll-driven fitness coaching experience",
  applicationName: "Hybrid Pro",
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
  maximumScale: 1,
  userScalable: false,
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
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProvider>
          <SplashScreen />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
