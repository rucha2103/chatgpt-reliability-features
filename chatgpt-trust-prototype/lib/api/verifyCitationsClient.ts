import type { Citation } from "@/types/chat";

export async function verifyCitationsClient(
  citations: Citation[],
): Promise<Citation[]> {
  if (!citations.length) return [];

  const response = await fetch("/api/citations/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ citations }),
  });

  if (!response.ok) {
    return citations;
  }

  const data = (await response.json()) as { citations?: Citation[] };
  return Array.isArray(data.citations) ? data.citations : citations;
}
