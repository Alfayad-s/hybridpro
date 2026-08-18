import { diagnosePineLabsAuth } from "@/lib/pinelabs";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Dev/ops helper: checks Pine Labs auth without exposing secrets. */
export async function GET() {
  const report = await diagnosePineLabsAuth();
  const ok = report.results.some((r) => r.ok);
  return NextResponse.json(report, { status: ok ? 200 : 401 });
}
