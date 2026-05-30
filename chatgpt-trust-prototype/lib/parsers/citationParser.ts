import type { Citation } from "@/types/chat";
import { normalizeCitationDate } from "@/lib/citations/normalizeCitationDate";
import { isCodingQuestion } from "@/lib/chat/isCodingQuestion";

export interface CitationParseResult {
  ok: true;
  answer: string;
  citations: Citation[];
}

export interface CitationParseError {
  ok: false;
  raw: string;
  error: string;
}

export type ParseCitationResult = CitationParseResult | CitationParseError;

const FACTUAL_KEYWORDS =
  /\b(what|why|when|who|how|how many|how much|explain|fact|history|research|source|compare|describe|define|update|updates|latest|current|news|invention|inventions|greatest|important|famous|list|top|best|worst|overview|status|brief|report|information|happening|today|recent|tell me about|happened|between|war|crisis|geopolit|iran|usa|u\.s\.|united states|human|world|country|countries|science|technology|discover)\b/i;

function extractJsonPayload(raw: string): string {
  const trimmed = raw.trim();
  const fenced = /^```(?:json)?\s*([\s\S]*?)```\s*$/im.exec(trimmed);
  if (fenced) return fenced[1].trim();

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return trimmed.slice(start, end + 1);
  }

  return trimmed;
}

function titleCaseKey(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
}

/** Turn wrong-shape JSON (e.g. { inventions: [...] }) into readable markdown. */
export function formatUnknownJsonAsAnswer(obj: Record<string, unknown>): string {
  if (typeof obj.answer === "string" && obj.answer.trim()) return obj.answer.trim();
  if (typeof obj.response === "string" && obj.response.trim()) return obj.response.trim();
  if (typeof obj.content === "string" && obj.content.trim()) return obj.content.trim();
  if (typeof obj.text === "string" && obj.text.trim()) return obj.text.trim();

  const parts: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (key === "citations" || key === "sources") continue;

    if (typeof value === "string" && value.trim()) {
      parts.push(value.trim());
      continue;
    }

    if (Array.isArray(value) && value.length > 0) {
      const heading = titleCaseKey(key);
      parts.push(`## ${heading}\n`);

      for (const item of value) {
        if (typeof item === "string") {
          parts.push(`- ${item}`);
          continue;
        }
        if (!item || typeof item !== "object") continue;

        const record = item as Record<string, unknown>;
        const title =
          formatValue(record.name) ||
          formatValue(record.title) ||
          formatValue(record.label) ||
          heading;

        parts.push(`### ${title}`);

        for (const [field, fieldValue] of Object.entries(record)) {
          if (field === "name" || field === "title" || field === "label") continue;
          const formatted = formatValue(fieldValue);
          if (formatted) {
            parts.push(`**${titleCaseKey(field)}:** ${formatted}`);
          }
        }
        parts.push("");
      }
    }
  }

  return parts.join("\n").trim();
}

function normalizeCitation(raw: unknown, index: number): Citation | null {
  if (!raw || typeof raw !== "object") return null;
  const c = raw as Record<string, unknown>;
  const idRaw = typeof c.id === "number" ? c.id : Number(c.id);
  const id = Number.isFinite(idRaw) ? idRaw : index + 1;
  const fact = typeof c.fact === "string" ? c.fact : "";
  const source = typeof c.source === "string" ? c.source : "";
  const url = typeof c.url === "string" ? c.url : "";
  const lastUpdatedRaw =
    typeof c.last_updated === "string"
      ? c.last_updated
      : typeof c.lastUpdated === "string"
        ? c.lastUpdated
        : typeof c.date === "string"
          ? c.date
          : typeof c.updated === "string"
            ? c.updated
            : "";

  if (!source.trim()) return null;

  const lastUpdated = normalizeCitationDate(lastUpdatedRaw);

  return { id, fact, source, lastUpdated, url: url || undefined };
}

function assignCitationIds(citations: Citation[]): Citation[] {
  return citations.map((c, i) => ({
    ...c,
    id: Number.isFinite(c.id) && c.id > 0 ? c.id : i + 1,
  }));
}

function parseCitationPayload(parsed: Record<string, unknown>): ParseCitationResult {
  const answer =
    typeof parsed.answer === "string"
      ? parsed.answer.trim()
      : formatUnknownJsonAsAnswer(parsed);

  const rawCitations = Array.isArray(parsed.citations)
    ? parsed.citations
    : Array.isArray(parsed.sources)
      ? parsed.sources
      : [];

  const citations = assignCitationIds(
    rawCitations
      .map((item, i) => normalizeCitation(item, i))
      .filter((c): c is Citation => c !== null),
  );

  if (!answer.trim()) {
    return { ok: false, raw: JSON.stringify(parsed), error: "Missing answer text" };
  }

  return { ok: true, answer, citations };
}

export function parseCitationResponse(raw: string): ParseCitationResult {
  try {
    const parsed = JSON.parse(extractJsonPayload(raw)) as Record<string, unknown>;
    return parseCitationPayload(parsed);
  } catch {
    return { ok: false, raw, error: "Invalid JSON" };
  }
}

/** Recover prose + citations when the model uses the wrong JSON keys. */
export function salvageCitationResponse(raw: string): ParseCitationResult {
  const strict = parseCitationResponse(raw);
  if (strict.ok) return strict;

  try {
    const parsed = JSON.parse(extractJsonPayload(raw)) as Record<string, unknown>;
    const answer = formatUnknownJsonAsAnswer(parsed);
    if (!answer.trim()) {
      return { ok: false, raw, error: "Could not salvage answer" };
    }

    const rawCitations = Array.isArray(parsed.citations)
      ? parsed.citations
      : Array.isArray(parsed.sources)
        ? parsed.sources
        : [];

    const citations = assignCitationIds(
      rawCitations
        .map((item, i) => normalizeCitation(item, i))
        .filter((c): c is Citation => c !== null),
    );

    return { ok: true, answer, citations };
  } catch {
    return { ok: false, raw, error: "Invalid JSON" };
  }
}

export function isCitationStyleQuestion(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (isCodingQuestion(trimmed)) return false;
  if (FACTUAL_KEYWORDS.test(trimmed)) return true;
  if (trimmed.endsWith("?") && trimmed.length > 8) return true;
  if (trimmed.length > 20 && !isCodingQuestion(trimmed)) return true;
  return false;
}

export function looksLikeJsonPayload(text: string): boolean {
  const t = text.trim();
  return t.startsWith("{") || t.startsWith("```json");
}
