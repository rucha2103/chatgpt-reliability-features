import type { Citation } from "@/types/chat";
import { matchKnownSource } from "./knownSources";

/** Only return URLs that were verified or matched to a trusted outlet catalog. */
export function getCitationHref(citation: Citation): string | undefined {
  const url = citation.url?.trim();
  if (url && citation.verified && /^https?:\/\//i.test(url)) {
    return url;
  }

  const known = matchKnownSource(citation.source);
  if (known && citation.verified) {
    return known.url;
  }

  return undefined;
}
