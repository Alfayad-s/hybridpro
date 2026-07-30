"use client";

import { cn } from "@/lib/utils";
import BrandLogo from "@/components/BrandLogo";
import { useScrollHideNav } from "@/hooks/useScrollHideNav";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
  /** Element id that triggers the shrink state when it reaches the top */
  shrinkOnSectionId?: string;
  /** Shrink pill when scrollY passes threshold (e.g. standalone pages) */
  shrinkOnScroll?: boolean;
  shrinkScrollThreshold?: number;
  /** Light hero behind nav — use dark link color before pill appears */
  lightHero?: boolean;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
  lightHero?: boolean;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
  }[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Navbar = ({
  children,
  className,
  shrinkOnSectionId = "about",
  shrinkOnScroll = false,
  shrinkScrollThreshold = 64,
  lightHero = false,
}: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const hidden = useScrollHideNav();

  useEffect(() => {
    const update = () => {
      if (shrinkOnScroll) {
        setVisible(window.scrollY > shrinkScrollThreshold);
        return;
      }

      const section = document.getElementById(shrinkOnSectionId);
      if (!section) {
        setVisible(false);
        return;
      }

      const top = section.getBoundingClientRect().top;
      setVisible(top <= 120);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [shrinkOnSectionId, shrinkOnScroll, shrinkScrollThreshold]);

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={{
        y: hidden ? "-110%" : 0,
        opacity: hidden ? 0 : 1,
      }}
      transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ pointerEvents: hidden ? "none" : "auto" }}
      className={cn("fixed inset-x-0 top-0 z-40 w-full", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{
                visible?: boolean;
                lightHero?: boolean;
              }>,
              { visible, lightHero },
            )
          : child,
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible, lightHero }: NavBodyProps) => {
  return (
    <motion.div
      initial={false}
      animate={{
        backdropFilter: visible ? "blur(12px)" : "blur(0px)",
        backgroundColor: visible ? "var(--nav-pill)" : "rgba(247, 247, 250, 0)",
        boxShadow: visible
          ? "0 8px 32px rgba(0, 0, 0, 0.08)"
          : "none",
        maxWidth: visible ? 1080 : 1280,
        y: visible ? 16 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 24,
        mass: 0.85,
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full flex-row items-center justify-between gap-3 self-start rounded-full bg-transparent px-3 py-2 lg:flex xl:gap-4 xl:px-4",
        visible && "border border-[color:var(--border)]",
        className,
      )}
      data-nav-scrolled={visible || undefined}
      data-nav-light={lightHero && !visible ? true : undefined}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "relative z-10 flex min-w-0 flex-1 flex-row items-center justify-center gap-0.5 text-[13px] font-medium transition duration-200 xl:gap-1 xl:text-sm",
        "text-white/75 hover:text-white",
        "[[data-nav-light]_&]:text-black/55 [[data-nav-light]_&]:hover:text-black",
        "dark:[[data-nav-light]_&]:text-white/75 dark:[[data-nav-light]_&]:hover:text-white",
        "[[data-nav-scrolled]_&]:text-black/55 [[data-nav-scrolled]_&]:hover:text-black",
        "dark:[[data-nav-scrolled]_&]:text-white/70 dark:[[data-nav-scrolled]_&]:hover:text-white",
        className,
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative shrink-0 whitespace-nowrap px-2.5 py-2 xl:px-3.5"
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-full bg-white/10 [[data-nav-scrolled]_&]:bg-black/5 dark:[[data-nav-scrolled]_&]:bg-white/10"
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: "none",
        width: visible ? "90%" : "100%",
        paddingRight: visible ? "12px" : "0px",
        paddingLeft: visible ? "12px" : "0px",
        borderRadius: visible ? "12px" : "2rem",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-2 lg:hidden",
        visible && "bg-black/80",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-neutral-950 px-4 py-8",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return isOpen ? (
    <IconX className="cursor-pointer text-white" onClick={onClick} />
  ) : (
    <IconMenu2 className="cursor-pointer text-white" onClick={onClick} />
  );
};

export const NavbarLogo = () => {
  const pathname = usePathname();
  const href = pathname === "/" ? "#top" : "/";

  return (
    <a
      href={href}
      className="relative z-20 mr-1 flex shrink-0 items-center px-1 py-1 text-[var(--brand-green)] xl:mr-2 xl:px-2"
      aria-label="Hybrid Pro home"
    >
      <BrandLogo className="h-8 w-auto xl:h-9" />
    </a>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
  | React.ComponentPropsWithoutRef<"a">
  | React.ComponentPropsWithoutRef<"button">
)) => {
  const baseStyles =
    "px-4 py-2 rounded-full text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center";

  const variantStyles = {
    primary:
      "bg-[var(--brand-green)] text-black shadow-[0_0_18px_rgba(var(--brand-green-rgb),0.35)]",
    secondary: "bg-transparent shadow-none text-[color:var(--muted)]",
    dark: "bg-[var(--card)] text-[var(--foreground)] border border-[color:var(--border)]",
    gradient:
      "bg-gradient-to-b from-[var(--brand-green)] to-[#6bb300] text-black shadow-[0px_2px_0px_0px_rgba(255,255,255,0.2)_inset]",
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};
