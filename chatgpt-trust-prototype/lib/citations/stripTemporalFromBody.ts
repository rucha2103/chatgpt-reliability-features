/** Prepare answer body: no citations, links, or code blocks (sources render in footer). */
export function stripTemporalFromBody(content: string): string {
  let text = content;
  text = text.replace(/```[\s\S]*?```/g, "");
  text = text.replace(/\s*\[\d+\]\s*/g, " ");
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  text = text.replace(/https?:\/\/\S+/g, "");
  text = text.replace(/[ \t]+\n/g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.replace(/  +/g, " ");
  return text.trim();
}
