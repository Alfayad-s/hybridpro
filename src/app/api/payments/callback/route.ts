import { confirmBackendPayment, getHybridAppUrl } from "@/lib/hybridAppApi";
import { getPublicSiteUrl } from "@/lib/pinelabs";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

function readValue(
  source: URLSearchParams | Record<string, unknown>,
  keys: string[],
) {
  for (const key of keys) {
    const raw =
      source instanceof URLSearchParams ? source.get(key) : source[key];
    if (typeof raw === "string" && raw.trim()) return raw.trim();
    if (typeof raw === "number") return String(raw);
  }
  return "";
}

function collectParams(source: URLSearchParams | Record<string, unknown>) {
  return {
    order_id: readValue(source, [
      "order_id",
      "orderId",
      "plural_order_id",
      "txn_id",
      "transaction_id",
    ]),
    email: readValue(source, ["email", "email_id"]),
    plan: readValue(source, ["plan", "planId", "plan_id"]),
    userId: readValue(source, ["userId", "user_id"]),
    source: readValue(source, ["source"]),
    ref: readValue(source, [
      "ref",
      "merchant_order_reference",
      "merchantOrderReference",
    ]),
    status: readValue(source, ["status", "payment_status"]),
  };
}

function appWelcomeUrl(email?: string) {
  const url = new URL("/dashboard", `${getHybridAppUrl()}/`);
  url.searchParams.set("welcome", "1");
  if (email) url.searchParams.set("email", email);
  return url;
}

function websiteUrl(
  path: string,
  params: ReturnType<typeof collectParams> & { source?: string },
) {
  const url = new URL(path, `${getPublicSiteUrl()}/`);
  if (params.order_id) url.searchParams.set("order_id", params.order_id);
  if (params.email) url.searchParams.set("email", params.email);
  if (params.plan) url.searchParams.set("plan", params.plan);
  if (params.userId) url.searchParams.set("userId", params.userId);
  if (params.ref) url.searchParams.set("ref", params.ref);
  if (params.source) url.searchParams.set("source", params.source);
  return url;
}

async function handle(request: NextRequest, extra?: Record<string, unknown>) {
  const merged: Record<string, unknown> = { ...extra };
  request.nextUrl.searchParams.forEach((value, key) => {
    merged[key] = value;
  });
  const params = collectParams(merged);
  const fromApp =
    params.source === "flutter" ||
    params.source === "app" ||
    // Pine Labs sometimes drops query params; Flutter checkouts use hp- refs.
    params.ref.startsWith("hp-");
  const failed =
    params.status.toLowerCase() === "failed" ||
    params.status.toLowerCase() === "failure" ||
    params.status.toLowerCase() === "cancelled";

  if (failed) {
    return NextResponse.redirect(websiteUrl("/payment/failure", params), 303);
  }

  if (params.order_id) {
    try {
      const result = await confirmBackendPayment({
        orderId: params.order_id,
        email: params.email,
        planId: params.plan,
        userId: params.userId,
        merchantOrderReference: params.ref,
      });
      if (result.ok !== false) {
        if (fromApp) {
          const url = websiteUrl("/payment/success", {
            ...params,
            source: "flutter",
          });
          url.searchParams.set("activated", "1");
          url.searchParams.set("source", "flutter");
          return NextResponse.redirect(url, 303);
        }
        return NextResponse.redirect(appWelcomeUrl(result.email || params.email), 303);
      }
      return NextResponse.redirect(websiteUrl("/payment/failure", params), 303);
    } catch (error) {
      console.error("[payments/callback] activate", error);
      const url = websiteUrl("/payment/success", {
        ...params,
        ...(fromApp ? { source: "flutter" } : {}),
      });
      url.searchParams.set(
        "activate_error",
        error instanceof Error ? error.message : "Could not unlock app access",
      );
      return NextResponse.redirect(url, 303);
    }
  }

  return NextResponse.redirect(
    websiteUrl("/payment/success", {
      ...params,
      ...(fromApp ? { source: "flutter" } : {}),
    }),
    303,
  );
}

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";
  let extra: Record<string, unknown> = {};

  try {
    if (contentType.includes("application/json")) {
      extra = (await request.json()) as Record<string, unknown>;
    } else {
      const form = await request.formData();
      form.forEach((value, key) => {
        if (typeof value === "string") extra[key] = value;
      });
    }
  } catch {
    extra = {};
  }

  return handle(request, extra);
}
