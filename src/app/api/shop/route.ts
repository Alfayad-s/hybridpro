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
};

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
      categories?: { slug: string; label: string }[];
      products?: ShopApiProduct[];
    };
    return NextResponse.json({
      categories: data.categories ?? [],
      products: (data.products ?? []).map(toShopProduct),
    });
  } catch {
    return NextResponse.json(
      { error: "Shop catalog is unavailable" },
      { status: 502 },
    );
  }
}
