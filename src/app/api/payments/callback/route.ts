import { getPublicSiteUrl } from "@/lib/pinelabs";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

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
    ref: readValue(source, [
      "ref",
      "merchant_order_reference",
      "merchantOrderReference",
    ]),
    status: readValue(source, ["status", "payment_status"]),
  };
}

function destination(params: ReturnType<typeof collectParams>) {
  const failed =
    params.status.toLowerCase() === "failed" ||
    params.status.toLowerCase() === "failure" ||
    params.status.toLowerCase() === "cancelled";
  const url = new URL(
    failed ? "/payment/failure" : "/payment/success",
    `${getPublicSiteUrl()}/`,
  );
  if (params.order_id) url.searchParams.set("order_id", params.order_id);
  if (params.email) url.searchParams.set("email", params.email);
  if (params.plan) url.searchParams.set("plan", params.plan);
  if (params.userId) url.searchParams.set("userId", params.userId);
  if (params.ref) url.searchParams.set("ref", params.ref);
  if (!failed) url.searchParams.set("welcome", "1");
  return url;
}

async function handle(request: NextRequest, extra?: Record<string, unknown>) {
  const merged: Record<string, unknown> = { ...extra };
  request.nextUrl.searchParams.forEach((value, key) => {
    merged[key] = value;
  });
  return NextResponse.redirect(destination(collectParams(merged)), 303);
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
