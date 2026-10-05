"use client";

import { useCart } from "@/components/shop/CartProvider";
import { LayoutGroup, motion } from "framer-motion";
import { Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

export const SAVED_ARRIVE_EVENT = "shop-saved-arrive";

const liquid = {
  type: "spring" as const,
  stiffness: 340,
  damping: 30,
  mass: 0.7,
};

const glass = {
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(255,255,255,0.95)",
  backdropFilter: "blur(18px)",
};

export function ShopBottomNav() {
  const cart = useCart();
  const pathname = usePathname();
  const onShop = pathname === "/shop";
  const onSaved = pathname.startsWith("/shop/wishlist");
  const onCart = pathname.startsWith("/shop/cart");
  const [heartRed, setHeartRed] = useState(false);
  const flash = useRef(0);

  useEffect(() => {
    const onArrive = () => {
      const id = ++flash.current;
      setHeartRed(true);
      const animation = document.getElementById("shop-saved-icon")?.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.45)" },
          { transform: "scale(0.82)" },
          { transform: "scale(1.22)" },
          { transform: "scale(1)" },
        ],
        { duration: 480, easing: "ease-out" },
      );
      const fadeRed = () => {
        window.setTimeout(() => {
          if (flash.current === id) setHeartRed(false);
        }, 3000);
      };
      if (animation) animation.finished.then(fadeRed).catch(fadeRed);
      else window.setTimeout(fadeRed, 480);
    };
    window.addEventListener(SAVED_ARRIVE_EVENT, onArrive);
    return () => window.removeEventListener(SAVED_ARRIVE_EVENT, onArrive);
  }, []);

  return (
    <LayoutGroup>
      <nav
        aria-label="Shop"
        className="fixed left-1/2 z-40 flex w-full max-w-[430px] -translate-x-1/2 items-center gap-3 px-3"
        style={{ bottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        <div
          className="grid h-16 min-w-0 flex-1 grid-cols-3 items-center rounded-full px-1 shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
          style={glass}
        >
          <div className="flex justify-center">
            <NavItem
              active={onShop}
              label="Home"
              icon={<HomeIcon />}
              href="/shop"
              onClick={
                onShop
                  ? () => window.scrollTo({ top: 0, behavior: "smooth" })
                  : undefined
              }
            />
          </div>
          <div className="flex justify-center">
            <IconButton label="Search">
              <SearchIcon />
            </IconButton>
          </div>
          <div className="flex justify-center">
            <NavItem
              active={onSaved}
              label="Saved"
              iconId="shop-saved-icon"
              icon={
                <Heart
                  size={22}
                  strokeWidth={2}
                  fill={heartRed ? "#ff3b30" : "none"}
                  style={{ color: heartRed ? "#ff3b30" : "currentColor" }}
                />
              }
              href="/shop/wishlist"
            />
          </div>
        </div>
        <Link
          id="shop-cart-fab"
          href="/shop/cart"
          aria-label={`Open cart, ${cart.count} items`}
          aria-current={onCart ? "page" : undefined}
          className="relative flex h-16 min-w-16 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold text-black shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
          style={glass}
        >
          {onCart ? <LiquidPill /> : null}
          <span className="relative z-10 flex items-center">
            <span className="grid h-16 w-14 place-items-center">
              <CartIcon />
            </span>
            <motion.span
              initial={false}
              animate={{ width: onCart ? "auto" : 0, opacity: onCart ? 1 : 0 }}
              transition={liquid}
              className="block overflow-hidden whitespace-nowrap"
            >
              <span className="pr-4">Cart</span>
            </motion.span>
          </span>
          {cart.count > 0 ? (
            <span className="absolute top-2.5 right-2.5 z-10 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#ff3b30] px-1 text-[10px] leading-none font-bold text-white">
              {cart.count}
            </span>
          ) : null}
        </Link>
      </nav>
    </LayoutGroup>
  );
}

function LiquidPill() {
  return (
    <motion.span
      layoutId="shop-nav-liquid"
      className="absolute inset-0 rounded-full bg-[#f2f2f2]"
      transition={liquid}
    />
  );
}

function NavItem({
  active,
  label,
  icon,
  iconId,
  href,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: ReactNode;
  iconId?: string;
  href: string;
  onClick?: () => void;
}) {
  const className = `relative flex h-11 items-center rounded-full text-[15px] font-semibold ${
    active ? "text-black" : "text-[#8e8e93]"
  }`;
  const body = (
    <>
      {active ? <LiquidPill /> : null}
      <span
        id={iconId}
        className="relative z-10 grid h-11 w-11 shrink-0 place-items-center"
      >
        {icon}
      </span>
      <motion.span
        initial={false}
        animate={{ width: active ? "auto" : 0, opacity: active ? 1 : 0 }}
        transition={liquid}
        className="relative z-10 block overflow-hidden whitespace-nowrap"
      >
        <span className="pr-3">{label}</span>
      </motion.span>
    </>
  );
  if (onClick) {
    return (
      <button type="button" aria-current="page" onClick={onClick} className={className}>
        {body}
      </button>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={className}
    >
      {body}
    </Link>
  );
}

function IconButton({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid h-11 w-11 place-items-center text-[#8e8e93]"
    >
      {children}
    </button>
  );
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12.4 3.3a1.2 1.2 0 0 0-1.5 0l-7.2 6.1A1.2 1.2 0 0 0 4.4 11H6v8.2c0 .7.5 1.3 1.2 1.3h3.2v-5.2h3.2V20.5h3.2c.7 0 1.2-.6 1.2-1.3V11h1.6a1.2 1.2 0 0 0 .8-2.1l-7.2-5.6Z"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="10.5" cy="10.5" r="6" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M15.2 15.2 20 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.2 7.2h13.2l-1.3 8.2H8L6.2 7.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M6.2 7.2 5.2 4.8H3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="9.2" cy="18.6" r="1.2" fill="currentColor" />
      <circle cx="16.4" cy="18.6" r="1.2" fill="currentColor" />
    </svg>
  );
}
