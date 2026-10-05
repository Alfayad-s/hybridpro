import { markShopOrderPaid } from "@/lib/hybridAppApi";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { reference?: string; pineOrderId?: string };
  try {
    body = (await request.json()) as { reference?: string; pineOrderId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const reference = body.reference?.trim() || "";
  if (!reference.startsWith("shop-")) {
    return NextResponse.json({ error: "Order reference is required" }, { status: 400 });
  }
  try {
    await markShopOrderPaid({
      reference,
      pineOrderId: body.pineOrderId?.trim() || "",
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not confirm the order" },
      { status: 502 },
    );
  }
}
