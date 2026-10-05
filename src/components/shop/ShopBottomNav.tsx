"use client";

import { useCart } from "@/components/shop/CartProvider";
import {
  CartIcon,
  HeartIcon,
  HouseIcon,
  SearchIcon,
} from "@/components/shop/ShopNavIcons";
import { LayoutGroup, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

export const SAVED_ARRIVE_EVENT = "shop-saved-arrive";
export const CART_ARRIVE_EVENT = "shop-cart-arrive";

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
  const [housePlay, setHousePlay] = useState(0);
  const [searchPlay, setSearchPlay] = useState(0);
  const [heartPlay, setHeartPlay] = useState(0);
  const [cartPlay, setCartPlay] = useState(0);
  const flash = useRef(0);

  useEffect(() => {
    const onSaved = () => {
      const id = ++flash.current;
      setHeartRed(true);
      setHeartPlay((play) => play + 1);
      window.setTimeout(() => {
        if (flash.current === id) setHeartRed(false);
      }, 1200 + 3000);
    };
    const onCart = () => setCartPlay((play) => play + 1);
    window.addEventListener(SAVED_ARRIVE_EVENT, onSaved);
    window.addEventListener(CART_ARRIVE_EVENT, onCart);
    return () => {
      window.removeEventListener(SAVED_ARRIVE_EVENT, onSaved);
      window.removeEventListener(CART_ARRIVE_EVENT, onCart);
    };
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
              icon={<HouseIcon play={housePlay} />}
              href="/shop"
              onClick={() => {
                setHousePlay((play) => play + 1);
                if (onShop) window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
          <div className="flex justify-center">
            <IconButton
              label="Search"
              onClick={() => setSearchPlay((play) => play + 1)}
            >
              <SearchIcon play={searchPlay} />
            </IconButton>
          </div>
          <div className="flex justify-center">
            <NavItem
              active={onSaved}
              label="Saved"
              iconId="shop-saved-icon"
              icon={
                <HeartIcon
                  play={heartPlay}
                  color={heartRed ? "#ff3b30" : "currentColor"}
                  filled={heartRed}
                />
              }
              href="/shop/wishlist"
              onClick={() => setHeartPlay((play) => play + 1)}
            />
          </div>
        </div>
        <Link
          id="shop-cart-fab"
          href="/shop/cart"
          aria-label={`Open cart, ${cart.count} items`}
          aria-current={onCart ? "page" : undefined}
          onClick={() => setCartPlay((play) => play + 1)}
          className="relative flex h-16 min-w-16 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold text-black shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
          style={glass}
        >
          {onCart ? <LiquidPill /> : null}
          <span className="relative z-10 flex items-center">
            <span className="grid h-16 w-14 place-items-center">
              <CartIcon play={cartPlay} />
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
  onClick: () => void;
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
  if (active && href === "/shop") {
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
      onClick={onClick}
      className={className}
    >
      {body}
    </Link>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-11 w-11 place-items-center text-[#8e8e93]"
    >
      {children}
    </button>
  );
}
