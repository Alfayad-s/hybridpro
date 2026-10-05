import { getShopBackendUrl } from "@/lib/hybridAppApi";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch(`${getShopBackendUrl()}/api/shop/maps-key`, {
      cache: "no-store",
    });
    if (!res.ok) return NextResponse.json({ apiKey: "" });
    const data = (await res.json()) as { apiKey?: unknown };
    const apiKey = typeof data.apiKey === "string" ? data.apiKey.trim() : "";
    return NextResponse.json({ apiKey });
  } catch {
    return NextResponse.json({ apiKey: "" });
  }
}
