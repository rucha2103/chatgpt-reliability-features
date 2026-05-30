import { NextResponse } from "next/server";
import type { Citation } from "@/types/chat";
import { verifyAndNormalizeCitations } from "@/lib/citations/verifyCitations";

export const runtime = "nodejs";

function isCitation(value: unknown): value is Citation {
  if (!value || typeof value !== "object") return false;
  const c = value as Record<string, unknown>;
  return typeof c.source === "string" && c.source.trim().length > 0;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const raw = body as { citations?: unknown };
  if (!Array.isArray(raw.citations)) {
    return NextResponse.json(
      { error: "Request must include citations array" },
      { status: 400 },
    );
  }

  const citations = raw.citations.filter(isCitation) as Citation[];

  try {
    const verified = await verifyAndNormalizeCitations(citations);
    return NextResponse.json({ citations: verified });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Citation verification failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
