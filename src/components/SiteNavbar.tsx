"use client";

import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import StaggeredMenu from "@/components/ui/StaggeredMenu";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTheme } from "@/components/ThemeProvider";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Home", link: "/" },
  { name: "About", link: "#about" },
  { name: "Programs", link: "#programs" },
  { name: "Shop", link: "#shop" },
  { name: "Coaching", link: "#coaching" },
  { name: "Nutrition", link: "#nutrition" },
  { name: "Pricing", link: "#pricing" },
];

const staggeredItems = [
  { label: "Home", ariaLabel: "Go to home page", link: "/" },
  { label: "Experience", ariaLabel: "Go to the scroll experience", link: "#top" },
  { label: "About", ariaLabel: "Learn about us", link: "#about" },
  { label: "Programs", ariaLabel: "See training programs", link: "#programs" },
  { label: "Shop", ariaLabel: "Upcoming digital shop", link: "#shop" },
  { label: "Coaching", ariaLabel: "How coaching works", link: "#coaching" },
  { label: "Nutrition", ariaLabel: "Nutrition and meal planning", link: "#nutrition" },
  { label: "Results", ariaLabel: "See client results", link: "#results" },
  { label: "Pricing", ariaLabel: "See coaching pricing", link: "#pricing" },
  { label: "FAQ", ariaLabel: "Frequently asked questions", link: "#faq" },
  { label: "Blog", ariaLabel: "Read the blog", link: "#blog" },
  { label: "Contact", ariaLabel: "Get in touch", link: "#contact" },
];

const socialItems = [
  { label: "Instagram", link: "https://instagram.com" },
  { label: "YouTube", link: "https://youtube.com" },
  { label: "X", link: "https://x.com" },
];

function resolveNavLink(link: string, onHome: boolean) {
  if (link.startsWith("#") && !onHome) {
    return `/${link}`;
  }
  return link;
}

export default function SiteNavbar() {
  const { isMobile, ready } = useIsMobile(1024);
  const { theme } = useTheme();
  const pathname = usePathname();
  const brandGreen = theme === "dark" ? "#A6FF00" : "#93E200";
  const onHome = pathname === "/";
  const onAboutPage = pathname === "/about";

  const desktopNavItems = navItems.map((item) => ({
    ...item,
    link: resolveNavLink(item.link, onHome),
  }));

  const mobileItems = staggeredItems.map((item) => ({
    ...item,
    link: resolveNavLink(item.link, onHome),
  }));

  if (!ready) {
    return (
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between px-4 sm:px-6"
        aria-hidden
      />
    );
  }

  if (isMobile) {
    return (
      <StaggeredMenu
        isFixed
        position="right"
        items={mobileItems}
        socialItems={socialItems}
        displaySocials
        displayItemNumbering
        logoUrl="/brand/logo.svg"
        menuButtonColor={brandGreen}
        openMenuButtonColor={theme === "dark" ? "#ededed" : "#111111"}
        changeMenuColorOnOpen
        colors={theme === "dark" ? ["#142000", "#A6FF00"] : ["#e8f5c8", "#93E200"]}
        accentColor={brandGreen}
      />
    );
  }

  return (
    <div className="relative w-full">
      <Navbar
        className="px-4 pt-3 xl:px-6"
        shrinkOnScroll={onAboutPage}
        shrinkScrollThreshold={48}
        shrinkOnSectionId={onAboutPage ? undefined : "about"}
        lightHero={onAboutPage}
      >
        <NavBody>
          <NavbarLogo />
          <NavItems items={desktopNavItems} />
          <div className="relative z-20 flex shrink-0 items-center">
            <NavbarButton
              href={resolveNavLink("#contact", onHome)}
              variant="primary"
              className="px-4 py-2"
            >
              Join now
            </NavbarButton>
          </div>
        </NavBody>
      </Navbar>
    </div>
  );
}
