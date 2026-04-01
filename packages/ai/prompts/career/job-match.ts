import { JobMatchInputSchema } from "../../utils/validators";
import { z } from "zod";

type JobMatchInput = z.infer<typeof JobMatchInputSchema>;

export function buildJobMatchPrompt(input: JobMatchInput): string {
  return `You are an expert ATS system and career advisor.

CANDIDATE RESUME:
${input.resumeText}

JOB POSTING:
${input.jobPosting}

TASK:
Analyze how well this candidate matches the job posting.

Return as JSON:
{
  "matchScore": <number 0-100>,
  "strengths": ["strength1", "strength2", "strength3"],
  "gaps": ["gap1", "gap2", "gap3"],
  "missingKeywords": ["keyword1", "keyword2"],
  "recommendation": "<2-3 sentence overall recommendation>"
}

Return ONLY valid JSON. No preamble, no explanation, no markdown fences.`;
}