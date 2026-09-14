import { getCoachTokenFromCookie } from "@/lib/adminSession";
import { getHybridBackendUrl } from "@/lib/hybridAppApi";
import { NextResponse } from "next/server";

export async function proxyCoachRequest(request: Request, nestPath: string) {
  const token = getCoachTokenFromCookie(request.headers.get("cookie"));
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const incoming = new URL(request.url);
  const target = new URL(nestPath, `${getHybridBackendUrl()}/`);
  incoming.searchParams.forEach((value, key) => {
    target.searchParams.set(key, value);
  });

  const init: RequestInit = {
    method: request.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  const res = await fetch(target, init);
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
