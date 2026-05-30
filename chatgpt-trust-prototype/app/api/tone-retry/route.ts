import { NextResponse } from "next/server";
import { getGroqClient, getGroqModel, getApiKeyErrorMessage } from "@/lib/groq";
import { encodeStreamEvent } from "@/lib/api/chatProtocol";
import type { Tone } from "@/types/chat";

export const runtime = "nodejs";

const TONE_LABELS: Record<Tone, string> = {
  polite: "Polite",
  professional: "Professional",
  friendly: "Friendly",
  concise: "Concise",
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  if (!body || typeof body !== "object") {
    return jsonError("Invalid request body", 400);
  }

  const raw = body as Record<string, unknown>;
  const originalText =
    typeof raw.originalText === "string" ? raw.originalText.trim() : "";
  const tone = raw.tone as Tone;

  if (!originalText) {
    return jsonError("originalText is required", 400);
  }

  if (!TONE_LABELS[tone]) {
    return jsonError("Invalid tone", 400);
  }

  const apiKeyError = getApiKeyErrorMessage();
  if (apiKeyError) {
    return jsonError(apiKeyError, 401);
  }

  const instruction = `Rewrite the following text to strictly adhere to a ${TONE_LABELS[tone]} style. Do not add new information.\n\n${originalText}`;

  try {
    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      model: getGroqModel(),
      messages: [{ role: "user", content: instruction }],
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) {
              controller.enqueue(
                encodeStreamEvent({ type: "chunk", content: delta }),
              );
            }
          }
          controller.enqueue(
            encodeStreamEvent({
              type: "done",
              tokenCount: 0,
              tokenLimit: 0,
            }),
          );
          controller.close();
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Tone retry failed";
          controller.enqueue(
            encodeStreamEvent({ type: "error", message }),
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Groq request failed";
    return jsonError(message, 502);
  }
}
