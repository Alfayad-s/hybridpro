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
    process.env.HYBRID_APP_PUBLIC_URL?.trim().replace(/\/$/, "") || DEFAULT_APP_URL
  );
}

export function getHybridAppLoginUrl(email?: string | null) {
  const url = new URL("/login", `${getHybridAppUrl()}/`);
  if (email) url.searchParams.set("email", email);
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

export type ActivatePayload = {
  pineOrderId: string;
  merchantOrderReference: string;
  email: string;
  mobile?: string;
  planId: string;
  amountPaise: number;
  userId?: string;
};

export async function activateAppSubscription(payload: ActivatePayload) {
  const res = await fetch(`${getHybridBackendUrl()}/api/subscriptions/activate`, {
    method: "POST",
    headers: internalHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    alreadyProcessed?: boolean;
    subscription?: unknown;
  };

  if (!res.ok) {
    throw new Error(data.error || `App activate failed (${res.status})`);
  }

  return data;
}

export async function getAppSubscriptionStatus(email: string) {
  const url = new URL("/api/subscriptions/status", `${getHybridBackendUrl()}/`);
  url.searchParams.set("email", email);
  const res = await fetch(url, {
    headers: internalHeaders(),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    subscription?: unknown;
  };
  if (!res.ok) {
    throw new Error(data.error || `App status failed (${res.status})`);
  }
  return data;
}
