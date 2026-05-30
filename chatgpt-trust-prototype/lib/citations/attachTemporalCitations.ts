import type { Citation } from "@/types/chat";
import { mergeTemporalSources, hasTemporalContent } from "./mergeTemporalSources";

export function attachTemporalCitations(
  content: string,
  existing?: Citation[],
): {
  content: string;
  citations?: Citation[];
  responseType: "text" | "citations";
} {
  const merged = mergeTemporalSources(content, existing ?? []);
  if (!hasTemporalContent(content, merged)) {
    return { content, citations: undefined, responseType: "text" };
  }
  return {
    content,
    citations: merged,
    responseType: "citations",
  };
}
