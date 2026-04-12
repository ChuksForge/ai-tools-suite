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
import { logger } from "@ai-tools-suite/utils";

async function runAI(
  prompt: string,
  model: string,
  stream: boolean,
  client: ReturnType<typeof createOpenRouterClient>,
  workflowName: string
): Promise<AIResponse> {
  logger.info(`${workflowName} started`, { model });

  try {
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

    logger.info(`${workflowName} complete`, {
      model,
      tokens: response.usage?.total_tokens,
    });

    return {
      data: parsed as unknown as string,
      model,
      usage: {
        promptTokens: response.usage?.prompt_tokens ?? 0,
        completionTokens: response.usage?.completion_tokens ?? 0,
        totalTokens: response.usage?.total_tokens ?? 0,
      },
    };
  } catch (err: any) {
    logger.error(`${workflowName} failed`, { error: err.message });
    throw err;
  }
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
  return runAI(buildResumePrompt(input), model, options.stream ?? false, client, "ResumeWorkflow");
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
  return runAI(buildCoverLetterPrompt(input), model, options.stream ?? false, client, "CoverLetterWorkflow");
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
  return runAI(buildJobMatchPrompt(input), model, options.stream ?? false, client, "JobMatchWorkflow");
}