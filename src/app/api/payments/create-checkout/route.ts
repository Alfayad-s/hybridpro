import { checkoutCookieHeader } from "@/lib/checkoutCookie";
import { saveCheckoutIntent } from "@/lib/hybridAppApi";
import { createPineLabsCheckout, isPineLabsConfigured } from "@/lib/pinelabs";
import { getPricingPlan } from "@/lib/pricingPlans";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  planId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  userId?: string;
};

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

  const plan = getPricingPlan(body.planId || "");
  if (!plan) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const email = body.email?.trim() || "";
  const firstName = body.firstName?.trim() || "";
  const mobile = (body.mobile || "").replace(/\D/g, "");
  const lastName = body.lastName?.trim() || undefined;
  const userId = body.userId?.trim() || undefined;

  if (!email || !email.includes("@")) {
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
  if (!userId) {
    return NextResponse.json(
      { error: "Sign in is required before checkout" },
      { status: 401 },
    );
  }

  const merchantOrderReference = `hp-${plan.id}-${Date.now()}-${randomUUID().slice(0, 8)}`;

  try {
    await saveCheckoutIntent({
      merchantOrderReference,
      email,
      mobile: mobile.slice(-10),
      planId: plan.id,
      userId,
    });

    const checkout = await createPineLabsCheckout({
      merchantOrderReference,
      amountPaise: plan.amountPaise,
      notes: `Hybrid Pro · ${plan.name}`,
      productCode: plan.id,
      productName: plan.name,
      customer: {
        email,
        firstName,
        lastName,
        mobile: mobile.slice(-10),
      },
      metadata: {
        plan_id: plan.id,
        email,
        mobile: mobile.slice(-10),
        ...(userId ? { user_id: userId } : {}),
      },
      successQuery: {
        plan: plan.id,
        email,
        ref: merchantOrderReference,
        ...(userId ? { userId } : {}),
      },
    });

    await saveCheckoutIntent({
      pineOrderId: checkout.orderId,
      merchantOrderReference,
      email,
      mobile: mobile.slice(-10),
      planId: plan.id,
      userId,
    });

    const response = NextResponse.json({
      redirectUrl: checkout.redirectUrl,
      orderId: checkout.orderId,
      merchantOrderReference,
      planId: plan.id,
      amount: plan.price,
    });
    response.headers.append(
      "Set-Cookie",
      checkoutCookieHeader({
        orderId: checkout.orderId,
        merchantOrderReference,
        email,
        mobile: mobile.slice(-10),
        planId: plan.id,
        userId,
      }),
    );
    return response;
  } catch (err) {
    console.error("[pinelabs]", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Could not start Pine Labs checkout",
      },
      { status: 502 },
    );
  }
}
