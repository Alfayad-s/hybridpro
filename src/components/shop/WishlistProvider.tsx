"use client";

import { useShopCatalog } from "@/components/shop/ShopCatalogProvider";
import type { ShopProduct } from "@/lib/shopCatalog";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "hp_shop_wishlist";

type WishlistContextValue = {
  ready: boolean;
  slugs: string[];
  items: ShopProduct[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

function readStored(known: (slug: string) => boolean): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((slug) =>
      typeof slug === "string" && known(slug) ? [slug] : [],
    );
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const catalog = useShopCatalog();
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!catalog.ready || catalog.error) return;
    const known = new Set(catalog.products.map((product) => product.slug));
    setSlugs(readStored((slug) => known.has(slug)));
    setReady(true);
  }, [catalog.error, catalog.products, catalog.ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  }, [ready, slugs]);

  const toggle = useCallback((slug: string) => {
    if (!catalog.getProduct(slug)) return;
    setSlugs((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug],
    );
  }, [catalog]);

  const remove = useCallback((slug: string) => {
    setSlugs((current) => current.filter((item) => item !== slug));
  }, []);

  const value = useMemo<WishlistContextValue>(() => {
    const items = slugs.flatMap((slug) => {
      const product = catalog.getProduct(slug);
      return product ? [product] : [];
    });
    return {
      ready,
      slugs,
      items,
      has: (slug: string) => slugs.includes(slug),
      toggle,
      remove,
    };
  }, [catalog, ready, remove, slugs, toggle]);

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const value = useContext(WishlistContext);
  if (!value) throw new Error("useWishlist must be used inside WishlistProvider");
  return value;
}
