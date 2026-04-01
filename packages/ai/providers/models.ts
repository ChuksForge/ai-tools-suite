export const MODELS = {
  // Fast, cheap — good for drafts, short outputs
  FAST: process.env.DEFAULT_FAST_MODEL ?? "openai/gpt-4o-mini",

  // Smart, capable — good for complex reasoning, long outputs
  SMART: process.env.DEFAULT_SMART_MODEL ?? "anthropic/claude-haiku-4.5",
} as const;

export type ModelTier = keyof typeof MODELS;