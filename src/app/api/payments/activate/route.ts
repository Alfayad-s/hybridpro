import { activateAppSubscription } from "@/lib/hybridAppApi";
import { getPricingPlan } from "@/lib/pricingPlans";
import {
  getPineLabsOrder,
  isPineLabsConfigured,
  isPineLabsOrderPaid,
  readPineLabsMetadata,
} from "@/lib/pinelabs";
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

  try {
    const order = await getPineLabsOrder(orderId);
    if (!isPineLabsOrderPaid(order)) {
      return NextResponse.json(
        { error: "Payment is not confirmed yet. Try again in a moment." },
        { status: 409 },
      );
    }

    const meta = readPineLabsMetadata(order);
    const email = (body.email || meta.email || "").trim().toLowerCase();
    const planId = (body.planId || meta.planId || "").trim();
    const plan = getPricingPlan(planId);
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Could not resolve the buyer email from this order" },
        { status: 400 },
      );
    }
    if (!plan) {
      return NextResponse.json({ error: "Unknown plan on this order" }, { status: 400 });
    }

    const result = await activateAppSubscription({
      pineOrderId: orderId,
      merchantOrderReference:
        body.merchantOrderReference || meta.merchantOrderReference || `hp-${orderId}`,
      email,
      mobile: body.mobile || meta.mobile,
      planId: plan.id,
      amountPaise: plan.amountPaise,
      userId: body.userId || meta.userId || undefined,
    });

    return NextResponse.json({
      ok: true,
      alreadyProcessed: result.alreadyProcessed ?? false,
      subscription: result.subscription ?? null,
      planId: plan.id,
      planName: plan.name,
      email,
    });
  } catch (error) {
    console.error("[payments/activate]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not activate Hybrid Pro access",
      },
      { status: 502 },
    );
  }
}
