import { getPricingPlan } from "@/lib/pricingPlans";

export const CHECKOUT_COOKIE = "hp_checkout";

export type CheckoutCookie = {
  orderId: string;
  merchantOrderReference: string;
  email: string;
  planId: string;
  userId?: string;
  mobile?: string;
};

export function parseCheckoutCookie(raw: string | undefined | null): CheckoutCookie | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<CheckoutCookie>;
    const email = data.email?.trim().toLowerCase() || "";
    const orderId = data.orderId?.trim() || "";
    const merchantOrderReference = data.merchantOrderReference?.trim() || "";
    const planId = data.planId?.trim() || "";
    if (!email.includes("@") || !orderId || !merchantOrderReference || !getPricingPlan(planId)) {
      return null;
    }
    return {
      orderId,
      merchantOrderReference,
      email,
      planId,
      userId: data.userId?.trim() || undefined,
      mobile: data.mobile?.trim() || undefined,
    };
  } catch {
    return null;
  }
}

export function checkoutCookieHeader(value: CheckoutCookie) {
  const payload = encodeURIComponent(JSON.stringify(value));
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${CHECKOUT_COOKIE}=${payload}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 6}${secure}`;
}
