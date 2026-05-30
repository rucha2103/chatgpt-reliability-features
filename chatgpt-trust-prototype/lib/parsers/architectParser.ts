import type { ArchitectSolution } from "@/types/chat";

export interface ArchitectParseResult {
  ok: true;
  solutions: ArchitectSolution[];
}

export interface ArchitectParseError {
  ok: false;
  raw: string;
  error: string;
}

export type ParseArchitectResult = ArchitectParseResult | ArchitectParseError;

const VALID_IDS = ["A", "B", "C"] as const;

function normalizeSolution(raw: unknown, index: number): ArchitectSolution | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Record<string, unknown>;
  const id = (s.id as string) ?? VALID_IDS[index] ?? "A";
  const label = typeof s.label === "string" ? s.label : `Approach ${id}`;
  const language = typeof s.language === "string" ? s.language : "text";
  const code = typeof s.code === "string" ? s.code : "";
  const explanation = typeof s.explanation === "string" ? s.explanation : "";

  if (!code.trim()) return null;

  return {
    id: VALID_IDS.includes(id as (typeof VALID_IDS)[number])
      ? (id as ArchitectSolution["id"])
      : VALID_IDS[index] ?? "A",
    label,
    language,
    code,
    explanation,
  };
}

export function parseArchitectResponse(raw: string): ParseArchitectResult {
  try {
    const parsed = JSON.parse(raw) as { solutions?: unknown[] };
    if (!Array.isArray(parsed.solutions)) {
      return { ok: false, raw, error: "Missing solutions array" };
    }

    const solutions = parsed.solutions
      .map((item, i) => normalizeSolution(item, i))
      .filter((s): s is ArchitectSolution => s !== null);

    if (solutions.length === 0) {
      return { ok: false, raw, error: "No valid solutions parsed" };
    }

    return { ok: true, solutions };
  } catch {
    return { ok: false, raw, error: "Invalid JSON" };
  }
}
