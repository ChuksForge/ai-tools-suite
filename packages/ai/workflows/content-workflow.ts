import { createOpenRouterClient, MODELS } from "../providers";
import { buildRepurposePrompt } from "../prompts/content/repurpose";
import { ContentInputSchema, ContentInput } from "../utils/validators";
import { parseAIJson, truncateInput, cleanAIText } from "../utils/formatter";
import { AIResponse } from "../types";

export async function runContentWorkflow(
  rawInput: ContentInput,
  options: { stream?: boolean; model?: string } = {}
): Promise<AIResponse> {
  // Validate input
  const input = ContentInputSchema.parse({
    ...rawInput,
    text: truncateInput(rawInput.text),
  });

  const client = createOpenRouterClient();
  const model = options.model ?? MODELS.FAST;
  const prompt = buildRepurposePrompt(input);

  if (options.stream) {
    // Return raw stream — caller handles chunks
    const stream = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    });

    return {
      data: stream as unknown as string, // caller casts and reads stream
      model,
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
    };
  }

  // Structured JSON response
  const response = await client.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1000,
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