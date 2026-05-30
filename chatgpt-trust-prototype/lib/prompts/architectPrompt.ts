export const ARCHITECT_PROMPT = `ARCHITECT MODE is active.

Return ONLY valid JSON (no markdown fences) matching this exact shape:
{
  "solutions": [
    {
      "id": "A",
      "label": "Performance",
      "language": "java",
      "code": "full source code",
      "explanation": "brief explanation"
    },
    {
      "id": "B",
      "label": "Readability",
      "language": "java",
      "code": "full source code",
      "explanation": "brief explanation"
    },
    {
      "id": "C",
      "label": "Balanced",
      "language": "java",
      "code": "full source code",
      "explanation": "brief explanation"
    }
  ]
}

Rules:
- Provide exactly 3 distinct solutions with different trade-offs.
- Labels should read like "Performance", "Readability", "Balanced" in the label field (do NOT prefix with "Approach A:" — the UI adds that).
- Include complete, compilable code in each code field.
- Do not wrap the JSON in markdown.`;
