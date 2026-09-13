import {
  buildContactNotifyEmail,
  buildContactThankYouEmail,
  type ContactPayload,
} from "@/lib/contactEmail";
import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

function getSiteUrl() {
  // Public marketing URL used in outbound emails (not localhost).
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (fromEnv && !/localhost|127\.0\.0\.1/.test(fromEnv)) {
    return fromEnv;
  }
  return "https://hybridpro.in";
}

function parsePayload(body: unknown): ContactPayload | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const phone = typeof data.phone === "string" ? data.phone.trim() : "";
  const goal = typeof data.goal === "string" ? data.goal.trim() : "";

  if (!name || !email || !goal) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  return { name, email, phone, goal };
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service is not configured" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const payload = parsePayload(body);
  if (!payload) {
    return NextResponse.json(
      { error: "Please provide a valid name, email, and goal" },
      { status: 400 },
    );
  }

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "Hybrid Pro <onboarding@resend.dev>";
  const notifyTo =
    process.env.CONTACT_NOTIFY_EMAIL?.trim() || "hello@hybridpro.fit";
  const siteUrl = getSiteUrl();

  const thankYou = buildContactThankYouEmail(payload, siteUrl);
  const notify = buildContactNotifyEmail(payload);

  let portrait: Buffer;
  try {
    portrait = await readFile(
      path.join(process.cwd(), "public/email/akash-avatar.png"),
    );
  } catch (err) {
    console.error("[contact] missing portrait asset", err);
    return NextResponse.json(
      { error: "Could not prepare confirmation email" },
      { status: 500 },
    );
  }

  const resend = new Resend(apiKey);

  try {
    const { error: userError } = await resend.emails.send({
      from,
      to: payload.email,
      replyTo: notifyTo,
      subject: thankYou.subject,
      html: thankYou.html,
      text: thankYou.text,
      attachments: [
        {
          filename: "akash.png",
          content: portrait,
          contentId: "akash-portrait",
        },
      ],
    });

    if (userError) {
      console.error("[contact] thank-you send failed", userError);
      return NextResponse.json(
        { error: userError.message || "Failed to send confirmation email" },
        { status: 502 },
      );
    }

    // Team notification — don't fail the user flow if this secondary send fails
    const { error: notifyError } = await resend.emails.send({
      from,
      to: notifyTo,
      replyTo: payload.email,
      subject: notify.subject,
      html: notify.html,
      text: notify.text,
    });

    if (notifyError) {
      console.error("[contact] notify send failed", notifyError);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to send confirmation email",
      },
      { status: 502 },
    );
  }
}
