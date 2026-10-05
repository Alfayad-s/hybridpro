"use client";

import type { ShopCategory, ShopProduct } from "@/lib/shopCatalog";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ShopCategoryItem = {
  slug: ShopCategory | "all";
  label: string;
  comingSoon?: boolean;
};

export type ShopPromo = {
  id: string;
  image: string;
  alt: string;
  label: string;
  category: string;
};

type ShopCatalogValue = {
  ready: boolean;
  error: string | null;
  products: ShopProduct[];
  categories: ShopCategoryItem[];
  banners: ShopPromo[];
  cardPromos: ShopPromo[];
  getProduct: (slug: string) => ShopProduct | null;
};

const ShopCatalogContext = createContext<ShopCatalogValue | null>(null);

export function ShopCatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [banners, setBanners] = useState<ShopPromo[]>([]);
  const [cardPromos, setCardPromos] = useState<ShopPromo[]>([]);
  const [categories, setCategories] = useState<ShopCategoryItem[]>([
    { slug: "all", label: "All" },
  ]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/shop", { cache: "no-store" })
      .then(async (res) => {
        const data = (await res.json()) as {
          error?: string;
          categories?: { slug: string; label: string; comingSoon?: boolean }[];
          products?: ShopProduct[];
          banners?: ShopPromo[];
          cardPromos?: ShopPromo[];
        };
        if (!res.ok) throw new Error(data.error || "Shop catalog is unavailable");
        if (cancelled) return;
        setProducts(data.products ?? []);
        setBanners(data.banners ?? []);
        setCardPromos(data.cardPromos ?? []);
        setCategories([
          { slug: "all", label: "All" },
          ...(data.categories ?? []).map((item) => ({
            slug: item.slug as ShopCategory,
            label: item.label,
            comingSoon: Boolean(item.comingSoon),
          })),
        ]);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Shop catalog is unavailable");
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<ShopCatalogValue>(() => {
    return {
      ready,
      error,
      products,
      categories,
      banners,
      cardPromos,
      getProduct: (slug: string) =>
        products.find((product) => product.slug === slug) ?? null,
    };
  }, [banners, cardPromos, categories, error, products, ready]);

  return (
    <ShopCatalogContext.Provider value={value}>
      {children}
    </ShopCatalogContext.Provider>
  );
}

export function useShopCatalog() {
  const value = useContext(ShopCatalogContext);
  if (!value) {
    throw new Error("useShopCatalog must be used inside ShopCatalogProvider");
  }
  return value;
}
