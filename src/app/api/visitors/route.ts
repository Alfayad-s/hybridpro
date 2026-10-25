import { saveSiteVisitor } from "@/lib/hybridAppApi";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name =
    body && typeof body === "object" && typeof (body as { name?: unknown }).name === "string"
      ? (body as { name: string }).name.trim()
      : "";

  if (!name) {
    return NextResponse.json({ error: "Please enter your name" }, { status: 400 });
  }

  try {
    await saveSiteVisitor(name);
  } catch (err) {
    console.error("[visitors] backend save failed", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Could not save your name. Please try again.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
