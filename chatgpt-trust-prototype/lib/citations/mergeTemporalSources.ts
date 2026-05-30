import type { Citation } from "@/types/chat";
import {
  matchKnownSource,
  matchKnownSourceByHostname,
} from "./knownSources";
import { normalizeCitationDate } from "./normalizeCitationDate";

const MARKDOWN_LINK = /\[([^\]]+)\]\(([^)]+)\)/g;
const PLAIN_URL = /https?:\/\/[^\s<>")\]]+/g;
const CITATION_MARKER = /\[\d+\]/;

function normalizeKey(value: string): string {
  return value.trim().toLowerCase();
}

function sourceFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function hasTemporalContent(
  content: string,
  citations: Citation[] = [],
): boolean {
  if (citations.length > 0) return true;
  if (CITATION_MARKER.test(content)) return true;
  MARKDOWN_LINK.lastIndex = 0;
  if (MARKDOWN_LINK.test(content)) return true;
  PLAIN_URL.lastIndex = 0;
  if (PLAIN_URL.test(content)) return true;
  return false;
}

/** Merge API citations with markdown links / bare URLs found in assistant text. */
export function mergeTemporalSources(
  content: string,
  existing: Citation[] = [],
): Citation[] {
  const result: Citation[] = existing.map((c) => ({ ...c }));
  const urlKeys = new Set(
    result
      .map((c) => c.url)
      .filter((u): u is string => Boolean(u))
      .map(normalizeKey),
  );
  const sourceKeys = new Set(result.map((c) => normalizeKey(c.source)));

  let nextId =
    result.reduce((max, c) => Math.max(max, c.id), 0) + 1;

  const addCitation = (source: string, url: string, lastUpdated = "") => {
    const urlKey = normalizeKey(url);
    if (urlKeys.has(urlKey)) return;

    const labelKey = normalizeKey(source);
    const bySource = result.find((c) => normalizeKey(c.source) === labelKey);
    if (bySource) {
      if (!bySource.url) bySource.url = url;
      if (!bySource.lastUpdated && lastUpdated) {
        bySource.lastUpdated = lastUpdated;
      }
      urlKeys.add(urlKey);
      return;
    }

    result.push({
      id: nextId++,
      fact: "",
      source,
      url,
      lastUpdated,
    });
    sourceKeys.add(labelKey);
    urlKeys.add(urlKey);
  };

  MARKDOWN_LINK.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = MARKDOWN_LINK.exec(content)) !== null) {
    const label = match[1].trim();
    const url = match[2].trim();
    if (!url.startsWith("http")) continue;
    const known =
      matchKnownSource(label) ??
      (() => {
        try {
          return matchKnownSourceByHostname(new URL(url).hostname);
        } catch {
          return undefined;
        }
      })();
    const displaySource = known?.source ?? (label || sourceFromUrl(url));
    addCitation(displaySource, url, "");
  }

  PLAIN_URL.lastIndex = 0;
  while ((match = PLAIN_URL.exec(content)) !== null) {
    const url = match[0].replace(/[.,;:!?)]+$/, "");
    let known;
    try {
      known = matchKnownSourceByHostname(new URL(url).hostname);
    } catch {
      known = undefined;
    }
    addCitation(known?.source ?? sourceFromUrl(url), url, "");
  }

  return result
    .map((c) => ({
      ...c,
      lastUpdated: normalizeCitationDate(c.lastUpdated) || c.lastUpdated,
    }))
    .filter((c) => !/^Source\s+\d+$/i.test(c.source.trim()))
    .sort((a, b) => a.id - b.id);
}

export function resolveCitationForLink(
  href: string | undefined,
  label: string,
  citations: Citation[],
): Citation | undefined {
  if (!citations.length) return undefined;

  const normLabel = normalizeKey(label);
  if (href) {
    const normHref = normalizeKey(href);
    const byUrl = citations.find(
      (c) => c.url && normalizeKey(c.url) === normHref,
    );
    if (byUrl) return byUrl;
  }

  return citations.find((c) => normalizeKey(c.source) === normLabel);
}

export function resolveCitationById(
  id: number,
  citations: Citation[],
): Citation | undefined {
  return citations.find((c) => c.id === id);
}
