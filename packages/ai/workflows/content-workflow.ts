import { createOpenRouterClient, MODELS } from "../providers";
import { buildRepurposePrompt } from "../prompts/content/repurpose";
import { ContentInputSchema, ContentInput } from "../utils/validators";
import { parseAIJson, truncateInput } from "../utils/formatter";
import { AIResponse } from "../types";
import { logger } from "@ai-tools-suite/utils";

export async function runContentWorkflow(
  rawInput: ContentInput,
  options: { stream?: boolean; model?: string } = {}
): Promise<AIResponse> {
  const input = ContentInputSchema.parse({
    ...rawInput,
    text: truncateInput(rawInput.text),
  });

  const client = createOpenRouterClient();
  const model = options.model ?? MODELS.FAST;
  const prompt = buildRepurposePrompt(input);

  logger.info("Content workflow started", { platform: input.platform, model });

  try {
    if (options.stream) {
      const stream = await client.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
        stream: true,
      });

      return {
        data: stream as unknown as string,
        model,
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      };
    }

    const response = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
      stream: false,
    });

    const raw = response.choices[0]?.message?.content ?? "";
    const parsed = parseAIJson(raw);

    logger.info("Content workflow complete", {
      platform: input.platform,
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
    logger.error("Content workflow failed", { error: err.message });
    throw err;
  }
}