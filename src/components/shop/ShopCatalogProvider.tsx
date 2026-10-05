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

type ShopCategoryItem = { slug: ShopCategory | "all"; label: string };

type ShopCatalogValue = {
  ready: boolean;
  error: string | null;
  products: ShopProduct[];
  categories: ShopCategoryItem[];
  getProduct: (slug: string) => ShopProduct | null;
};

const ShopCatalogContext = createContext<ShopCatalogValue | null>(null);

export function ShopCatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<ShopProduct[]>([]);
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
          categories?: { slug: string; label: string }[];
          products?: ShopProduct[];
        };
        if (!res.ok) throw new Error(data.error || "Shop catalog is unavailable");
        if (cancelled) return;
        setProducts(data.products ?? []);
        setCategories([
          { slug: "all", label: "All" },
          ...(data.categories ?? []).map((item) => ({
            slug: item.slug as ShopCategory,
            label: item.label,
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
      getProduct: (slug: string) =>
        products.find((product) => product.slug === slug) ?? null,
    };
  }, [categories, error, products, ready]);

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
