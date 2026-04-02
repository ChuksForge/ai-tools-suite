import OpenAI from "openai";
import https from "https";

export function createOpenRouterClient() {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "X-Title": "AI Tools Suite",
    },
    httpAgent: new https.Agent({
      keepAlive: true,
      timeout: 55000,
    }),
    timeout: 55000,
    maxRetries: 1,
  });
}