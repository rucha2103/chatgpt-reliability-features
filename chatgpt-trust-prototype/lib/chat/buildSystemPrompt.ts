import { BASE_SYSTEM_PROMPT } from "@/lib/prompts/baseSystemPrompt";
import { DEMO_PRIMING_PROMPT } from "@/lib/prompts/demoPrimingPrompt";
import { ARCHITECT_PROMPT } from "@/lib/prompts/architectPrompt";
import { CITATION_PROMPT } from "@/lib/prompts/citationPrompt";
import { FACTUAL_RESPONSE_PROMPT } from "@/lib/prompts/factualResponsePrompt";

export interface SystemPromptOptions {
  architectMode?: boolean;
  citationsMode?: boolean;
  /** Java / LeetCode demo priming — only for explicit coding questions */
  includeCodingPriming?: boolean;
}

export function buildSystemPrompt(options: SystemPromptOptions = {}): string {
  const parts = [BASE_SYSTEM_PROMPT];

  if (options.architectMode) {
    parts.push(ARCHITECT_PROMPT);
    return parts.join("\n\n");
  }

  if (options.citationsMode) {
    parts.push(FACTUAL_RESPONSE_PROMPT);
    parts.push(CITATION_PROMPT);
    return parts.join("\n\n");
  }

  if (options.includeCodingPriming) {
    parts.push(DEMO_PRIMING_PROMPT);
  }

  return parts.join("\n\n");
}
