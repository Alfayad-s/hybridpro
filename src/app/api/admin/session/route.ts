import { getCoachTokenFromCookie } from "@/lib/adminSession";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token = getCoachTokenFromCookie(request.headers.get("cookie"));
  return NextResponse.json({ authenticated: Boolean(token) });
}
