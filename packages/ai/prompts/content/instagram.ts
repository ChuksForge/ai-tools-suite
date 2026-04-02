import { ContentInput } from "../../utils/validators";

export function buildInstagramPrompt(input: ContentInput): string {
  return `You are an Instagram growth expert and copywriter.

Tone: ${input.tone}

ORIGINAL CONTENT:
${input.text}

TASK:
Repurpose this into an Instagram content package containing:
- A carousel post (6-8 slides with title + body per slide)
- A caption (150-200 words with line breaks, ends with question)
- 15 hashtags (mix of niche, medium, and broad)
- A Reel concept (15-30 second video idea based on this content)

Return as JSON:
{
  "carousel": [
    { "slide": 1, "title": "...", "body": "..." }
  ],
  "caption": "...",
  "hashtags": ["#tag1", "#tag2"],
  "reelConcept": "..."
}

Return ONLY valid JSON. No preamble, no markdown fences.`;
}