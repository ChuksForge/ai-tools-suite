import { ContentInput } from "../../utils/validators";

export function buildBlogPrompt(input: ContentInput): string {
  return `You are an expert content writer and SEO strategist.

Tone: ${input.tone}

ORIGINAL CONTENT:
${input.text}

TASK:
Expand this into a full blog post that:
- Has an SEO-optimized title and meta description
- Opens with a compelling hook
- Is structured with H2/H3 subheadings
- Is 600-900 words
- Includes a conclusion with a clear CTA
- Has natural keyword usage (not stuffed)

Return as JSON:
{
  "title": "...",
  "metaDescription": "...",
  "slug": "url-friendly-slug",
  "body": "full markdown blog post here",
  "estimatedReadTime": "X min read",
  "suggestedTags": ["tag1", "tag2"]
}

Return ONLY valid JSON. No preamble, no markdown fences.`;
}