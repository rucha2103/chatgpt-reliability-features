export const ARCHITECT_PROMPT = `ARCHITECT MODE is active.

Return ONLY valid JSON (no markdown fences) matching this exact shape:
{
  "solutions": [
    {
      "id": "A",
      "label": "Performance",
      "language": "java",
      "code": "full source code",
      "explanation": "detailed reasoning and logic behind the approach"
    },
    {
      "id": "B",
      "label": "Readability",
      "language": "java",
      "code": "full source code",
      "explanation": "detailed reasoning and logic behind the approach"
    },
    {
      "id": "C",
      "label": "Balanced",
      "language": "java",
      "code": "full source code",
      "explanation": "detailed reasoning and logic behind the approach"
    }
  ]
}

Rules:
- Provide exactly 3 distinct solutions with different trade-offs.
- Labels should read like "Performance", "Readability", "Balanced" in the label field (do NOT prefix with "Approach A:" — the UI adds that).
- Include complete, compilable code in each code field with proper indentation and formatting.
- In the explanation field, provide detailed reasoning and logic behind the approach, including:
  * Why this approach is appropriate for the given problem
  * Key design decisions and their rationale
  * Trade-offs and considerations
  * Performance implications (if relevant)
  * Any assumptions made
- Do not wrap the JSON in markdown.`;
