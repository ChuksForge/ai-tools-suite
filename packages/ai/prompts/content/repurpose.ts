import { ContentInput } from "../../utils/validators";

export function buildRepurposePrompt(input: ContentInput): string {
  const platformInstructions = {
    twitter: `Repurpose this content into 3 tweet variants. Each tweet must:
- Be under 280 characters
- Have a strong hook in the first line
- Use line breaks for readability
- Include 2-3 relevant hashtags at the end
Return as JSON: { "tweets": ["tweet1", "tweet2", "tweet3"] }`,

    linkedin: `Repurpose this content into a LinkedIn post that:
- Opens with a bold, scroll-stopping first line
- Uses short paragraphs (2-3 lines max)
- Tells a story or shares a lesson
- Ends with a question or call to action
- Is 150-300 words
Return as JSON: { "post": "the full linkedin post" }`,

    newsletter: `Repurpose this content into a newsletter section that:
- Has a compelling subject line
- Opens with an engaging hook
- Delivers clear value in 200-400 words
- Has a clear takeaway or action item
Return as JSON: { "subject": "subject line", "body": "newsletter body" }`,
  };

  return `You are an expert content strategist and copywriter.
Tone: ${input.tone}

ORIGINAL CONTENT:
${input.text}

TASK:
${platformInstructions[input.platform]}

Return ONLY valid JSON. No preamble, no explanation, no markdown fences.`;
}