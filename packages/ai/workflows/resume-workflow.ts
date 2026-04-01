import { createOpenRouterClient, MODELS } from "../providers";
import { buildResumePrompt } from "../prompts/career/resume";
import { buildCoverLetterPrompt } from "../prompts/career/cover-letter";
import { buildJobMatchPrompt } from "../prompts/career/job-match";
import {
  ResumeInputSchema,
  CoverLetterInputSchema,
  JobMatchInputSchema,
  ResumeInput,
  CoverLetterInput,
  JobMatchInput,
} from "../utils/validators";
import { parseAIJson, truncateInput } from "../utils/formatter";
import { AIResponse } from "../types";

async function runAI(
  prompt: string,
  model: string,
  stream: boolean,
  client: ReturnType<typeof createOpenRouterClient>
): Promise<AIResponse> {
  if (stream) {
    const streamRes = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 2000,
      stream: true,
    });
    return {
      data: streamRes as unknown as string,
      model,
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
    };
  }

  const response = await client.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
    max_tokens: 2000,
    stream: false,
  });

  const raw = response.choices[0]?.message?.content ?? "";
  const parsed = parseAIJson(raw);

  return {
    data: parsed as unknown as string,
    model,
    usage: {
      promptTokens: response.usage?.prompt_tokens ?? 0,
      completionTokens: response.usage?.completion_tokens ?? 0,
      totalTokens: response.usage?.total_tokens ?? 0,
    },
  };
}

export async function runResumeWorkflow(
  rawInput: ResumeInput,
  options: { stream?: boolean; model?: string } = {}
): Promise<AIResponse> {
  const input = ResumeInputSchema.parse({
    ...rawInput,
    resumeText: truncateInput(rawInput.resumeText),
  });

  const client = createOpenRouterClient();
  const model = options.model ?? MODELS.SMART;
  const prompt = buildResumePrompt(input);

  return runAI(prompt, model, options.stream ?? false, client);
}

export async function runCoverLetterWorkflow(
  rawInput: CoverLetterInput,
  options: { stream?: boolean; model?: string } = {}
): Promise<AIResponse> {
  const input = CoverLetterInputSchema.parse({
    ...rawInput,
    resumeText: truncateInput(rawInput.resumeText),
  });

  const client = createOpenRouterClient();
  const model = options.model ?? MODELS.SMART;
  const prompt = buildCoverLetterPrompt(input);

  return runAI(prompt, model, options.stream ?? false, client);
}

export async function runJobMatchWorkflow(
  rawInput: JobMatchInput,
  options: { stream?: boolean; model?: string } = {}
): Promise<AIResponse> {
  const input = JobMatchInputSchema.parse({
    ...rawInput,
    resumeText: truncateInput(rawInput.resumeText),
    jobPosting: truncateInput(rawInput.jobPosting),
  });

  const client = createOpenRouterClient();
  const model = options.model ?? MODELS.SMART;
  const prompt = buildJobMatchPrompt(input);

  return runAI(prompt, model, options.stream ?? false, client);
}