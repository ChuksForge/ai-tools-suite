import { ResumeInput } from "../../utils/validators";

export function buildResumePrompt(input: ResumeInput): string {
  const jobContext = input.jobDescription
    ? `TARGET JOB DESCRIPTION:\n${input.jobDescription}\n\n`
    : "";

  return `You are an expert resume writer and career coach with 15 years of experience helping candidates land roles at top companies.

${jobContext}RESUME TO OPTIMIZE:
${input.resumeText}

TASK:
Analyze and rewrite this resume to be more impactful. You must:
1. Strengthen bullet points using the STAR method (Situation, Task, Action, Result)
2. Quantify achievements wherever possible
3. Use strong action verbs
4. Optimize for ATS (Applicant Tracking Systems)
5. ${input.jobDescription ? "Tailor language to match the target job description" : "Use industry-standard keywords"}

Return as JSON:
{
  "score": <number 0-100 rating the original resume>,
  "optimized": "<the full rewritten resume as plain text>",
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "keywords": ["keyword1", "keyword2"]
}

Return ONLY valid JSON. No preamble, no explanation, no markdown fences.`;
}