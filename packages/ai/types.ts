import { z } from "zod";

// Shared input/output types across all workflows

export const AIRequestSchema = z.object({
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional().default(0.7),
  maxTokens: z.number().optional().default(1000),
  stream: z.boolean().optional().default(false),
});

export type AIRequest = z.infer<typeof AIRequestSchema>;

export interface AIResponse<T = string> {
  data: T;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface StreamChunk {
  delta: string;
  done: boolean;
}