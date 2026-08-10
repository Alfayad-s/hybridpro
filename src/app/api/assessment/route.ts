import {
  isAssessmentInput,
  type AssessmentInput,
} from "@/lib/assessment";
import { generateAssessmentResult } from "@/lib/generateAssessment";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isAssessmentInput(body)) {
    return NextResponse.json(
      { error: "Missing or invalid assessment fields" },
      { status: 400 },
    );
  }

  const input = body as AssessmentInput;

  if (!input.name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    const result = await generateAssessmentResult(input);
    return NextResponse.json({ result });
  } catch (err) {
    console.error("[assessment]", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to generate assessment result",
      },
      { status: 502 },
    );
  }
}
