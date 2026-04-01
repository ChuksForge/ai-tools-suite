/**
 * Safely parse JSON from AI output.
 * AI models sometimes wrap JSON in markdown fences — this strips them.
 */
export function parseAIJson<T>(raw: string): T {
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleaned) as T;
}

/**
 * Trim and normalize whitespace in AI text output.
 */
export function cleanAIText(text: string): string {
  return text.trim().replace(/\n{3,}/g, "\n\n");
}

/**
 * Truncate input text to a max character length before sending to AI.
 * Prevents runaway token usage.
 */
export function truncateInput(text: string, maxChars = 8000): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "\n\n[Content truncated]";
}