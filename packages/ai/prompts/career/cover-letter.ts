import { CoverLetterInput } from "../../utils/validators";

export function buildCoverLetterPrompt(input: CoverLetterInput): string {
  return `You are an expert career coach who writes compelling, personalized cover letters.

CANDIDATE RESUME:
${input.resumeText}

TARGET ROLE: ${input.jobTitle} at ${input.company}

JOB DESCRIPTION:
${input.jobDescription}

TASK:
Write a tailored cover letter that:
1. Opens with a compelling, specific hook (not "I am applying for...")
2. Connects the candidate's experience directly to the role requirements
3. Shows genuine knowledge of the company
4. Is confident but not arrogant
5. Is 3-4 paragraphs, under 400 words
6. Ends with a clear call to action

Return as JSON:
{
  "subject": "<email subject line>",
  "letter": "<the full cover letter>"
}

Return ONLY valid JSON. No preamble, no explanation, no markdown fences.`;
}