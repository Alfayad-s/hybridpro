import { getShopBackendUrl } from "@/lib/hybridAppApi";
import { shopImageSrc, type ShopProduct } from "@/lib/shopCatalog";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ShopApiProduct = {
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  category: string;
  priceLabel: string;
  pricePaise?: number | null;
  image?: string | null;
  sizes?: string[];
  comingSoon?: boolean;
};

type ShopApiPromo = {
  id: string;
  image?: string | null;
  alt?: string;
  label?: string;
  category?: string;
};

function toShopPromo(promo: ShopApiPromo) {
  return {
    id: promo.id,
    image: shopImageSrc(promo.image),
    alt: promo.alt ?? "",
    label: promo.label ?? "",
    category: promo.category ?? "",
  };
}

function toShopProduct(product: ShopApiProduct): ShopProduct {
  return {
    slug: product.slug,
    title: product.title,
    subtitle: product.subtitle ?? "",
    description: product.description ?? "",
    category: product.category as ShopProduct["category"],
    priceLabel: product.priceLabel,
    image: shopImageSrc(product.image),
    sizes: product.sizes?.length ? product.sizes : undefined,
    comingSoon: Boolean(product.comingSoon),
  };
}

export async function GET() {
  try {
    const res = await fetch(`${getShopBackendUrl()}/api/shop`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Shop catalog is unavailable" },
        { status: 502 },
      );
    }
    const data = (await res.json()) as {
      categories?: { slug: string; label: string; comingSoon?: boolean }[];
      products?: ShopApiProduct[];
      banners?: ShopApiPromo[];
      cardPromos?: ShopApiPromo[];
    };
    return NextResponse.json({
      categories: (data.categories ?? []).map((item) => ({
        slug: item.slug,
        label: item.label,
        comingSoon: Boolean(item.comingSoon),
      })),
      products: (data.products ?? []).map(toShopProduct),
      banners: (data.banners ?? []).map(toShopPromo),
      cardPromos: (data.cardPromos ?? []).map(toShopPromo),
    });
  } catch {
    return NextResponse.json(
      { error: "Shop catalog is unavailable" },
      { status: 502 },
    );
  }
}
