import { COACH_COOKIE } from "@/lib/adminSession";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COACH_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
