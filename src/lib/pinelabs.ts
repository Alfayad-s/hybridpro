import { createHmac, randomUUID } from "crypto";

const UAT_BASE = "https://pluraluat.v2.pinepg.in";
const PROD_BASE = "https://api.pluralpay.in";
const LEGACY_PROD = "https://api.pluralonline.com";

function getPreferredBaseUrl() {
  if (process.env.PINELABS_BASE_URL?.trim()) {
    return process.env.PINELABS_BASE_URL.trim().replace(/\/$/, "");
  }
  return process.env.PINELABS_ENV === "production" ? PROD_BASE : UAT_BASE;
}

function getCandidateBaseUrls() {
  const preferred = getPreferredBaseUrl();
  const others = [UAT_BASE, PROD_BASE, LEGACY_PROD].filter(
    (u) => u !== preferred,
  );
  return [preferred, ...others];
}

function getAppUrl() {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

function requestHeaders(extra?: Record<string, string>) {
  return {
    accept: "application/json",
    "Content-Type": "application/json",
    "Request-ID": randomUUID(),
    "Request-Timestamp": new Date().toISOString(),
    ...extra,
  };
}

function readErrorMessage(data: Record<string, unknown>, status: number) {
  const nested =
    data.error && typeof data.error === "object"
      ? (data.error as Record<string, unknown>)
      : null;

  return (
    (typeof data.response_message === "string" && data.response_message) ||
    (typeof data.message === "string" && data.message) ||
    (typeof data.error_message === "string" && data.error_message) ||
    (typeof data.error === "string" && data.error) ||
    (typeof nested?.message === "string" && nested.message) ||
    (typeof nested?.description === "string" && nested.description) ||
    `Pine Labs request failed (${status})`
  );
}

export type PineLabsCustomer = {
  email: string;
  firstName: string;
  lastName?: string;
  mobile: string;
};

export type CreateCheckoutInput = {
  merchantOrderReference: string;
  amountPaise: number;
  notes: string;
  productCode: string;
  productName: string;
  customer: PineLabsCustomer;
};

type TokenResult = { token: string; baseUrl: string };

type AuthAttempt = {
  label: string;
  run: (
    baseUrl: string,
    clientId: string,
    clientSecret: string,
  ) => Promise<Response>;
};

const authAttempts: AuthAttempt[] = [
  {
    label: "json-body",
    run: (baseUrl, clientId, clientSecret) =>
      fetch(`${baseUrl}/api/auth/v1/token`, {
        method: "POST",
        headers: requestHeaders(),
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "client_credentials",
        }),
        cache: "no-store",
      }),
  },
  {
    label: "form-body",
    run: (baseUrl, clientId, clientSecret) =>
      fetch(`${baseUrl}/api/auth/v1/token`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          "Request-ID": randomUUID(),
          "Request-Timestamp": new Date().toISOString(),
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "client_credentials",
        }),
        cache: "no-store",
      }),
  },
  {
    label: "basic-auth",
    run: (baseUrl, clientId, clientSecret) => {
      const basic = Buffer.from(`${clientId}:${clientSecret}`).toString(
        "base64",
      );
      return fetch(`${baseUrl}/api/auth/v1/token`, {
        method: "POST",
        headers: requestHeaders({
          Authorization: `Basic ${basic}`,
        }),
        body: JSON.stringify({
          grant_type: "client_credentials",
        }),
        cache: "no-store",
      });
    },
  },
];

async function requestAccessToken(baseUrl: string): Promise<TokenResult> {
  const clientId = process.env.PINELABS_CLIENT_ID?.trim();
  const clientSecret = process.env.PINELABS_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    throw new Error(
      "Pine Labs is not configured. Set PINELABS_CLIENT_ID and PINELABS_CLIENT_SECRET in .env.local",
    );
  }

  const attemptErrors: string[] = [];

  for (const attempt of authAttempts) {
    try {
      const res = await attempt.run(baseUrl, clientId, clientSecret);
      const data = (await res.json().catch(() => ({}))) as Record<
        string,
        unknown
      >;

      if (!res.ok) {
        attemptErrors.push(
          `${attempt.label}: ${readErrorMessage(data, res.status)}`,
        );
        continue;
      }

      const token =
        (typeof data.access_token === "string" && data.access_token) ||
        (typeof data.token === "string" && data.token) ||
        "";

      if (!token) {
        attemptErrors.push(`${attempt.label}: no access_token in response`);
        continue;
      }

      return { token, baseUrl };
    } catch (err) {
      attemptErrors.push(
        `${attempt.label}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  throw new Error(attemptErrors.join(" | "));
}

export async function diagnosePineLabsAuth() {
  const clientId = process.env.PINELABS_CLIENT_ID?.trim() || "";
  const clientSecret = process.env.PINELABS_CLIENT_SECRET?.trim() || "";
  const bases = getCandidateBaseUrls();
  const results: {
    baseUrl: string;
    ok: boolean;
    detail: string;
  }[] = [];

  for (const base of bases) {
    try {
      const { token } = await requestAccessToken(base);
      results.push({
        baseUrl: base,
        ok: true,
        detail: `Token received (${token.slice(0, 12)}…)`,
      });
    } catch (err) {
      results.push({
        baseUrl: base,
        ok: false,
        detail: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return {
    configured: Boolean(clientId && clientSecret),
    clientIdPreview: clientId
      ? `${clientId.slice(0, 8)}…${clientId.slice(-4)}`
      : null,
    preferredEnv: process.env.PINELABS_ENV || "uat",
    preferredBaseUrl: getPreferredBaseUrl(),
    results,
    guidance: [
      "Open Pine Labs / Plural merchant dashboard → Settings → Credentials.",
      "Copy Client ID and Client Secret again (no spaces).",
      "Confirm the keys are for Online Payments / Plural, not POS/terminal.",
      "Match PINELABS_ENV to that dashboard (uat vs production).",
      "If Access Denied persists, ask Pine Labs to whitelist your server IP / enable API access.",
      "PINELABS_SECRET_KEY is for callback signature verification and is usually different from client_secret.",
    ],
  };
}

/**
 * Authenticate against preferred env first, then fall back to other hosts.
 */
export async function getPineLabsAccessToken(): Promise<TokenResult> {
  const bases = getCandidateBaseUrls();
  const errors: string[] = [];

  for (const base of bases) {
    try {
      const result = await requestAccessToken(base);
      if (base !== getPreferredBaseUrl()) {
        console.warn(
          `[pinelabs] Auth succeeded on ${base} (preferred was ${getPreferredBaseUrl()}). Set PINELABS_BASE_URL=${base}`,
        );
      }
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${base}: ${msg}`);
      console.warn(`[pinelabs] auth failed on ${base}:`, msg);
    }
  }

  throw new Error(
    [
      "Pine Labs rejected your Client ID / Client Secret on every API host.",
      "This is a credentials/account issue from Pine Labs, not a checkout UI bug.",
      "Fix: Plural dashboard → Settings → Credentials → copy fresh keys, ensure Online Payments API is enabled, and set PINELABS_ENV to match (uat/production).",
      ...errors.map((e) => `• ${e}`),
    ].join("\n"),
  );
}

export async function createPineLabsCheckout(input: CreateCheckoutInput) {
  const { token, baseUrl } = await getPineLabsAccessToken();
  const appUrl = getAppUrl();
  const fullName = [input.customer.firstName, input.customer.lastName]
    .filter(Boolean)
    .join(" ");

  const body = {
    merchant_order_reference: input.merchantOrderReference,
    order_amount: {
      value: input.amountPaise,
      currency: "INR",
    },
    integration_mode: "REDIRECT",
    pre_auth: false,
    allowed_payment_methods: ["CARD", "UPI", "NETBANKING", "WALLET"],
    notes: input.notes,
    callback_url: `${appUrl}/payment/success`,
    failure_callback_url: `${appUrl}/payment/failure`,
    purchase_details: {
      customer: {
        email_id: input.customer.email,
        first_name: input.customer.firstName,
        last_name: input.customer.lastName || ".",
        customer_id: input.customer.mobile,
        mobile_number: input.customer.mobile,
        country_code: "91",
      },
      product: [
        {
          product_code: input.productCode,
          product_amount: {
            value: input.amountPaise,
            currency: "INR",
          },
        },
      ],
      merchant_metadata: {
        plan_name: input.productName,
        customer_name: fullName,
      },
    },
  };

  const res = await fetch(`${baseUrl}/api/checkout/v1/orders`, {
    method: "POST",
    headers: requestHeaders({
      Authorization: `Bearer ${token}`,
    }),
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;

  if (!res.ok || typeof data.redirect_url !== "string" || !data.redirect_url) {
    throw new Error(`${readErrorMessage(data, res.status)} (host: ${baseUrl})`);
  }

  return {
    orderId: typeof data.order_id === "string" ? data.order_id : "",
    redirectUrl: data.redirect_url,
    token: typeof data.token === "string" ? data.token : "",
    baseUrl,
  };
}

export function verifyPineLabsSignature(
  params: Record<string, string>,
): boolean {
  const secret = process.env.PINELABS_SECRET_KEY?.trim();
  if (!secret) return true;

  const signature = params.signature;
  if (!signature) return false;

  const pairs = Object.entries(params)
    .filter(([k, v]) => k !== "signature" && v != null && v !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`);

  const payload = pairs.join("&");

  let key: Buffer;
  try {
    if (/^[0-9a-fA-F]+$/.test(secret) && secret.length % 2 === 0) {
      key = Buffer.from(secret, "hex");
    } else {
      key = Buffer.from(secret, "utf8");
    }
  } catch {
    key = Buffer.from(secret, "utf8");
  }

  const digest = createHmac("sha256", key)
    .update(payload, "utf8")
    .digest("hex")
    .toUpperCase();

  return digest === signature.toUpperCase();
}

export function isPineLabsConfigured() {
  return Boolean(
    process.env.PINELABS_CLIENT_ID?.trim() &&
      process.env.PINELABS_CLIENT_SECRET?.trim(),
  );
}
