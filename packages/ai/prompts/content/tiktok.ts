import { ContentInput } from "../../utils/validators";

export function buildTikTokPrompt(input: ContentInput): string {
  return `You are a viral TikTok content strategist who understands short-form video hooks.

Tone: ${input.tone}

ORIGINAL CONTENT:
${input.text}

TASK:
Repurpose this into 3 TikTok video script concepts. Each must have:
- A hook (first 3 seconds — must stop the scroll)
- A body (the core value/story, 30-45 seconds)
- A CTA (call to action at the end)
- Suggested on-screen text overlays
- Suggested background music vibe

Return as JSON:
{
  "scripts": [
    {
      "hook": "...",
      "body": "...",
      "cta": "...",
      "overlays": ["text1", "text2"],
      "musicVibe": "..."
    }
  ]
}

Return ONLY valid JSON. No preamble, no markdown fences.`;
}