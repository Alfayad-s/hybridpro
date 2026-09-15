import { CHECKOUT_COOKIE, parseCheckoutCookie } from "@/lib/checkoutCookie";
import { confirmPaidOrderAndActivate } from "@/lib/confirmPaidOrder";
import { isPineLabsConfigured } from "@/lib/pinelabs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  orderId?: string;
  email?: string;
  planId?: string;
  userId?: string;
  merchantOrderReference?: string;
  mobile?: string;
};

export async function POST(request: Request) {
  if (!isPineLabsConfigured()) {
    return NextResponse.json(
      { error: "Pine Labs is not configured" },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const orderId = body.orderId?.trim();
  if (!orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }

  const jar = await cookies();
  const checkout = parseCheckoutCookie(jar.get(CHECKOUT_COOKIE)?.value);
  const fromCheckout = checkout?.orderId === orderId ? checkout : null;

  try {
    const result = await confirmPaidOrderAndActivate({
      orderId,
      email: body.email || fromCheckout?.email,
      planId: body.planId || fromCheckout?.planId,
      userId: body.userId || fromCheckout?.userId,
      merchantOrderReference:
        body.merchantOrderReference || fromCheckout?.merchantOrderReference,
      mobile: body.mobile || fromCheckout?.mobile,
    });

    return NextResponse.json({
      ok: true,
      alreadyProcessed: result.alreadyProcessed ?? false,
      subscription: result.subscription ?? null,
      planId: result.planId,
      planName: result.planName,
      email: result.email,
    });
  } catch (error) {
    console.error("[payments/activate]", error);
    const message =
      error instanceof Error ? error.message : "Could not activate Hybrid Pro access";
    const pending = message.toLowerCase().includes("not confirmed");
    return NextResponse.json(
      { error: message },
      { status: pending ? 409 : 502 },
    );
  }
}
