"use client";

import {
  formatInr,
  getShopProduct,
  shopPricePaise,
  type ShopProduct,
} from "@/lib/shopCatalog";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "hp_shop_cart";

export type CartLine = {
  slug: string;
  size: string;
  qty: number;
};

type CartItem = CartLine & {
  product: ShopProduct;
  linePaise: number;
};

type CartContextValue = {
  ready: boolean;
  lines: CartLine[];
  items: CartItem[];
  count: number;
  totalPaise: number;
  totalLabel: string;
  needsShipping: boolean;
  add: (slug: string, size?: string) => void;
  setQty: (slug: string, size: string, qty: number) => void;
  remove: (slug: string, size: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStored(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((line) => {
      if (!line || typeof line !== "object") return [];
      const slug = "slug" in line && typeof line.slug === "string" ? line.slug : "";
      const size = "size" in line && typeof line.size === "string" ? line.size : "";
      const qty = "qty" in line && typeof line.qty === "number" ? line.qty : 0;
      if (!getShopProduct(slug) || qty < 1) return [];
      return [{ slug, size, qty: Math.min(10, Math.floor(qty)) }];
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLines(readStored());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const add = useCallback((slug: string, size = "") => {
    if (!getShopProduct(slug)) return;
    setLines((current) => {
      const index = current.findIndex(
        (line) => line.slug === slug && line.size === size,
      );
      if (index === -1) return [...current, { slug, size, qty: 1 }];
      return current.map((line, i) =>
        i === index ? { ...line, qty: Math.min(10, line.qty + 1) } : line,
      );
    });
  }, []);

  const setQty = useCallback((slug: string, size: string, qty: number) => {
    setLines((current) =>
      current.flatMap((line) => {
        if (line.slug !== slug || line.size !== size) return [line];
        if (qty < 1) return [];
        return [{ ...line, qty: Math.min(10, Math.floor(qty)) }];
      }),
    );
  }, []);

  const remove = useCallback((slug: string, size: string) => {
    setLines((current) =>
      current.filter((line) => line.slug !== slug || line.size !== size),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const items = lines.flatMap((line) => {
      const product = getShopProduct(line.slug);
      if (!product) return [];
      const linePaise = shopPricePaise(product.priceLabel) * line.qty;
      return [{ ...line, product, linePaise }];
    });
    const totalPaise = items.reduce((sum, item) => sum + item.linePaise, 0);
    return {
      ready,
      lines,
      items,
      count: items.reduce((sum, item) => sum + item.qty, 0),
      totalPaise,
      totalLabel: formatInr(totalPaise),
      needsShipping: items.some((item) => item.product.category !== "ebooks"),
      add,
      setQty,
      remove,
      clear,
    };
  }, [add, clear, lines, ready, remove, setQty]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
