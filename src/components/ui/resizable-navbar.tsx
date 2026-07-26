"use client";

import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
  /** Element id that triggers the shrink state when it reaches the top */
  shrinkOnSectionId?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
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
}: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Shrink only when the next page section enters the top — not during frame scrubbing.
  useEffect(() => {
    const update = () => {
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
  }, [shrinkOnSectionId]);

  return (
    <motion.div
      ref={ref}
      // Fixed so it stays over the scroll-frame experience
      className={cn("fixed inset-x-0 top-0 z-40 w-full", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible },
            )
          : child,
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      initial={false}
      animate={{
        backdropFilter: visible ? "blur(10px)" : "blur(0px)",
        backgroundColor: visible ? "rgba(0, 0, 0, 0.75)" : "rgba(0, 0, 0, 0)",
        boxShadow: "none",
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
        className,
      )}
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
        "relative z-10 flex min-w-0 flex-1 flex-row items-center justify-center gap-0.5 text-[13px] font-medium text-white/70 transition duration-200 hover:text-white xl:gap-1 xl:text-sm",
        className,
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative shrink-0 whitespace-nowrap px-2.5 py-2 text-white/70 xl:px-3.5"
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-full bg-white/10"
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
  return (
    <a
      href="#top"
      className="relative z-20 mr-1 flex shrink-0 items-center px-1 py-1 xl:mr-2 xl:px-2"
      aria-label="Hybrid Pro home"
    >
      <img
        src="/company-logo.svg"
        alt="Hybrid Pro"
        width={72}
        height={52}
        className="h-8 w-auto xl:h-9"
      />
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
      "bg-[#39FF14] text-black shadow-[0_0_18px_rgba(57,255,20,0.35)]",
    secondary: "bg-transparent shadow-none text-white/80",
    dark: "bg-white/10 text-white border border-white/15",
    gradient:
      "bg-gradient-to-b from-[#39FF14] to-[#1f9a0c] text-black shadow-[0px_2px_0px_0px_rgba(255,255,255,0.2)_inset]",
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
