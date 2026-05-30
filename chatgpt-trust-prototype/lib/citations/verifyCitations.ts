import type { Citation } from "@/types/chat";
import {
  matchKnownSource,
  matchKnownSourceByHostname,
} from "./knownSources";
import { normalizeCitationDate } from "./normalizeCitationDate";

const VERIFY_TIMEOUT_MS = 5000;
const FETCH_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; ChatGPT-Trust-Prototype/1.0)",
  Accept: "text/html,application/xhtml+xml",
};

function normalizeUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

function isPlausibleDate(date: string): boolean {
  const parsed = Date.parse(date);
  if (Number.isNaN(parsed)) return false;
  const min = Date.parse("1990-01-01");
  return parsed >= min && parsed <= Date.now() + 24 * 60 * 60 * 1000;
}

function lastModifiedFromHeaders(headers: Headers): string {
  const raw =
    headers.get("last-modified") ?? headers.get("Last-Modified") ?? "";
  if (!raw) return "";
  const normalized = normalizeCitationDate(new Date(raw).toISOString());
  return normalized && isPlausibleDate(normalized) ? normalized : "";
}

async function fetchUrlMetadata(
  url: string,
): Promise<{ reachable: boolean; lastModified: string }> {
  const attempt = async (method: "HEAD" | "GET") => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);
    try {
      const init: RequestInit = {
        method,
        signal: controller.signal,
        redirect: "follow",
        headers: FETCH_HEADERS,
      };
      if (method === "GET") {
        init.headers = { ...FETCH_HEADERS, Range: "bytes=0-0" };
      }
      const res = await fetch(url, init);
      clearTimeout(timer);
      const reachable = res.ok || res.status === 403 || res.status === 405;
      const lastModified = lastModifiedFromHeaders(res.headers);
      return { reachable, lastModified };
    } catch {
      clearTimeout(timer);
      return { reachable: false, lastModified: "" };
    }
  };

  const head = await attempt("HEAD");
  if (head.reachable && head.lastModified) return head;
  if (head.reachable) return head;

  const get = await attempt("GET");
  return get;
}

function resolveLastUpdated(
  citation: Citation,
  headerDate: string,
): string {
  if (headerDate) return headerDate;

  const fromModel = normalizeCitationDate(citation.lastUpdated);
  if (fromModel && isPlausibleDate(fromModel)) return fromModel;

  return "";
}

function isPlaceholderSource(source: string): boolean {
  return /^Source\s+\d+$/i.test(source.trim());
}

/**
 * Verify URLs server-side; derive last_updated from HTTP headers when possible.
 */
export async function verifyAndNormalizeCitations(
  citations: Citation[],
): Promise<Citation[]> {
  const verified: Citation[] = [];

  for (const raw of citations) {
    if (isPlaceholderSource(raw.source)) continue;

    const knownByName = matchKnownSource(raw.source);
    let source = knownByName?.source ?? raw.source.trim();

    const modelUrl = raw.url ? normalizeUrl(raw.url) : null;
    let url: string | null = null;
    let headerDate = "";

    if (modelUrl) {
      try {
        const host = new URL(modelUrl).hostname;
        const knownByHost =
          matchKnownSourceByHostname(host) ?? knownByName;
        const meta = await fetchUrlMetadata(modelUrl);

        if (meta.reachable) {
          url = modelUrl;
          headerDate = meta.lastModified;
          if (knownByHost) source = knownByHost.source;
        } else if (knownByHost) {
          const fallbackMeta = await fetchUrlMetadata(knownByHost.url);
          if (fallbackMeta.reachable) {
            url = knownByHost.url;
            headerDate = fallbackMeta.lastModified;
            source = knownByHost.source;
          }
        }
      } catch {
        // fall through
      }
    }

    if (!url && knownByName) {
      const meta = await fetchUrlMetadata(knownByName.url);
      if (meta.reachable) {
        url = knownByName.url;
        headerDate = meta.lastModified;
        source = knownByName.source;
      }
    }

    if (!url) continue;

    const lastUpdated = resolveLastUpdated(raw, headerDate);

    verified.push({
      id: raw.id,
      fact: raw.fact,
      source,
      url,
      lastUpdated,
      verified: true,
    });
  }

  return verified.map((c, i) => ({ ...c, id: i + 1 }));
}
