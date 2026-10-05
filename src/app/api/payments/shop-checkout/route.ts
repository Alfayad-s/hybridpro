import { getShopBackendUrl } from "@/lib/hybridAppApi";
import { createPineLabsCheckout, isPineLabsConfigured } from "@/lib/pinelabs";
import { shopImageSrc, shopPricePaise, type ShopProduct } from "@/lib/shopCatalog";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

type ItemBody = {
  slug?: string;
  size?: string;
  qty?: number;
};

type Body = {
  email?: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  address?: string;
  city?: string;
  pincode?: string;
  items?: ItemBody[];
};

async function loadShopProduct(slug: string): Promise<ShopProduct | null> {
  const res = await fetch(
    `${getShopBackendUrl()}/api/shop/products/${encodeURIComponent(slug)}`,
    { cache: "no-store" },
  );
  if (!res.ok) return null;
  const data = (await res.json()) as {
    product?: {
      slug: string;
      title: string;
      subtitle?: string;
      description?: string;
      category: string;
      priceLabel: string;
      image?: string | null;
      sizes?: string[];
    };
  };
  const product = data.product;
  if (!product?.slug) return null;
  return {
    slug: product.slug,
    title: product.title,
    subtitle: product.subtitle ?? "",
    description: product.description ?? "",
    category: product.category,
    priceLabel: product.priceLabel,
    image: shopImageSrc(product.image),
    sizes: product.sizes?.length ? product.sizes : undefined,
  };
}

export async function POST(request: Request) {
  if (!isPineLabsConfigured()) {
    return NextResponse.json(
      {
        error:
          "Pine Labs credentials missing. Add PINELABS_CLIENT_ID and PINELABS_CLIENT_SECRET to .env.local",
      },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = body.email?.trim() || "";
  const firstName = body.firstName?.trim() || "";
  const lastName = body.lastName?.trim() || undefined;
  const mobile = (body.mobile || "").replace(/\D/g, "");
  const address = body.address?.trim() || "";
  const city = body.city?.trim() || "";
  const pincode = (body.pincode || "").replace(/\D/g, "");

  if (!email.includes("@")) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  if (!firstName) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (mobile.length < 10) {
    return NextResponse.json(
      { error: "Valid 10-digit mobile number is required" },
      { status: 400 },
    );
  }

  const requested = Array.isArray(body.items) ? body.items : [];
  if (requested.length === 0) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  const lines: { title: string; size: string; qty: number; paise: number }[] = [];
  let needsShipping = false;
  for (const item of requested) {
    const product = await loadShopProduct(item.slug || "");
    const qty = Math.floor(Number(item.qty) || 0);
    const size = (item.size || "").trim();
    if (!product || qty < 1 || qty > 10) {
      return NextResponse.json({ error: "A cart item is not valid" }, { status: 400 });
    }
    if (product.sizes?.length && !product.sizes.includes(size)) {
      return NextResponse.json(
        { error: `Choose a size for ${product.title}` },
        { status: 400 },
      );
    }
    if (product.category !== "ebooks") needsShipping = true;
    lines.push({
      title: product.title,
      size,
      qty,
      paise: shopPricePaise(product.priceLabel) * qty,
    });
  }

  if (needsShipping && (!address || !city || pincode.length !== 6)) {
    return NextResponse.json(
      { error: "A delivery address and 6-digit PIN code are required" },
      { status: 400 },
    );
  }

  const amountPaise = lines.reduce((sum, line) => sum + line.paise, 0);
  if (amountPaise < 100) {
    return NextResponse.json({ error: "Order total is too small" }, { status: 400 });
  }

  const summary = lines
    .map((line) => `${line.title}${line.size ? ` ${line.size}` : ""} x${line.qty}`)
    .join(", ")
    .slice(0, 180);
  const merchantOrderReference = `shop-${Date.now()}-${randomUUID().slice(0, 8)}`;

  try {
    const checkout = await createPineLabsCheckout({
      merchantOrderReference,
      amountPaise,
      notes: `Hybrid Pro shop · ${summary}`,
      productCode: "shop",
      productName: summary,
      customer: {
        email,
        firstName,
        lastName,
        mobile: mobile.slice(-10),
      },
      metadata: {
        kind: "shop",
        items: summary,
        ...(needsShipping
          ? { ship_to: `${address}, ${city} ${pincode}`.slice(0, 180) }
          : {}),
      },
      successQuery: {
        plan: "shop",
        email,
        ref: merchantOrderReference,
      },
    });

    return NextResponse.json({
      redirectUrl: checkout.redirectUrl,
      orderId: checkout.orderId,
      merchantOrderReference,
    });
  } catch (err) {
    console.error("[shop-checkout]", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Could not start Pine Labs checkout",
      },
      { status: 502 },
    );
  }
}
