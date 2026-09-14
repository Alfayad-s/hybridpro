import { COACH_COOKIE } from "@/lib/adminSession";
import { getHybridBackendUrl } from "@/lib/hybridAppApi";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const res = await fetch(`${getHybridBackendUrl()}/api/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: body.email, password: body.password }),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as {
    token?: string;
    email?: string;
    message?: string;
    error?: string;
  };

  if (!res.ok || !data.token) {
    return NextResponse.json(
      { error: data.message || data.error || "Invalid coach login" },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true, email: data.email });
  response.cookies.set(COACH_COOKIE, data.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
