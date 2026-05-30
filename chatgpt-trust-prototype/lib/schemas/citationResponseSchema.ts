/** JSON Schema for Groq/OpenAI structured citation responses */
export const CITATION_RESPONSE_JSON_SCHEMA = {
  name: "citation_response",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["answer", "citations"],
    properties: {
      answer: {
        type: "string",
        description: "Markdown prose answer without code blocks or URLs",
      },
      citations: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["id", "fact", "source", "url", "last_updated"],
          properties: {
            id: { type: "integer" },
            fact: { type: "string" },
            source: { type: "string" },
            url: { type: "string" },
            last_updated: { type: "string" },
          },
        },
      },
    },
  },
} as const;
