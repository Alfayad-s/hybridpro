const DEFAULT_BACKEND_URL = "http://localhost:3002";
const DEFAULT_APP_URL = "https://app.hybridpro.in";

export function getHybridBackendUrl() {
  return (
    process.env.HYBRID_BACKEND_URL?.trim().replace(/\/$/, "") ||
    process.env.HYBRID_APP_API_URL?.trim().replace(/\/$/, "") ||
    DEFAULT_BACKEND_URL
  );
}

export function getHybridAppUrl() {
  return (
    process.env.HYBRID_APP_PUBLIC_URL?.trim().replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_HYBRID_APP_URL?.trim().replace(/\/$/, "") ||
    DEFAULT_APP_URL
  );
}

export function getHybridAppLoginUrl(
  email?: string | null,
  options?: { checkoutPlan?: string | null; reauth?: boolean },
) {
  const url = new URL("/login", `${getHybridAppUrl()}/`);
  if (email) url.searchParams.set("email", email);
  if (options?.checkoutPlan) url.searchParams.set("checkout", options.checkoutPlan);
  if (options?.reauth) url.searchParams.set("reauth", "1");
  return url.toString();
}

function internalHeaders() {
  const secret = process.env.INTERNAL_API_SECRET?.trim();
  if (!secret) {
    throw new Error(
      "INTERNAL_API_SECRET is missing. Add the same secret to the website and Hybrid Pro Backend.",
    );
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${secret}`,
  };
}

export async function saveCheckoutIntent(payload: {
  pineOrderId?: string;
  merchantOrderReference: string;
  email: string;
  mobile?: string;
  planId: string;
  userId?: string;
}) {
  const res = await fetch(`${getHybridBackendUrl()}/api/subscriptions/intent`, {
    method: "POST",
    headers: internalHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) {
    throw new Error(data.error || `Checkout intent failed (${res.status})`);
  }
  return data;
}

export async function getCheckoutIntent(input: {
  pineOrderId?: string;
  merchantOrderReference?: string;
}) {
  const url = new URL("/api/subscriptions/intent", `${getHybridBackendUrl()}/`);
  if (input.pineOrderId) url.searchParams.set("pineOrderId", input.pineOrderId);
  if (input.merchantOrderReference) url.searchParams.set("ref", input.merchantOrderReference);
  const res = await fetch(url, {
    headers: internalHeaders(),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    subscription?: {
      email?: string;
      planId?: string;
      userId?: string | null;
      mobile?: string | null;
      merchantOrderReference?: string | null;
    } | null;
  };
  if (!res.ok) {
    throw new Error(data.error || `Checkout intent lookup failed (${res.status})`);
  }
  return data.subscription ?? null;
}

export async function confirmBackendPayment(payload: {
  orderId: string;
  email?: string | null;
  planId?: string | null;
  userId?: string | null;
  merchantOrderReference?: string | null;
  mobile?: string | null;
}) {
  const res = await fetch(`${getHybridBackendUrl()}/api/payments/confirm`, {
    method: "POST",
    headers: internalHeaders(),
    body: JSON.stringify({
      pineOrderId: payload.orderId,
      orderId: payload.orderId,
      email: payload.email,
      planId: payload.planId,
      userId: payload.userId,
      merchantOrderReference: payload.merchantOrderReference,
      mobile: payload.mobile,
    }),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    ok?: boolean;
    reason?: string;
    email?: string | null;
    planId?: string | null;
    planName?: string | null;
    alreadyProcessed?: boolean;
    subscription?: unknown;
  };
  if (!res.ok) {
    throw new Error(data.error || `Payment confirm failed (${res.status})`);
  }
  return data;
}

export async function getAppPlanStatus(input: { email?: string; userId?: string }) {
  const url = new URL("/api/subscriptions/plan", `${getHybridBackendUrl()}/`);
  if (input.email) url.searchParams.set("email", input.email);
  if (input.userId) url.searchParams.set("userId", input.userId);
  const res = await fetch(url, {
    headers: internalHeaders(),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    active?: boolean;
    planId?: string | null;
    planName?: string | null;
    subscription?: unknown;
  };
  if (!res.ok) {
    throw new Error(data.error || `App plan failed (${res.status})`);
  }
  return data;
}

export async function saveContactSubmission(input: {
  name: string;
  email: string;
  phone?: string;
  goal: string;
}) {
  const res = await fetch(`${getHybridBackendUrl()}/api/contact/submissions`, {
    method: "POST",
    headers: internalHeaders(),
    body: JSON.stringify(input),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    message?: string;
  };
  if (!res.ok) {
    throw new Error(data.error || data.message || `Contact save failed (${res.status})`);
  }
  return data;
}
