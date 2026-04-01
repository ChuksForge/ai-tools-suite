import { z } from "zod";

export const ContentInputSchema = z.object({
  text: z.string().min(50, "Input must be at least 50 characters"),
  platform: z.enum(["twitter", "linkedin", "newsletter"]),
  tone: z.enum(["professional", "casual", "witty"]).optional().default("professional"),
});

export const ResumeInputSchema = z.object({
  resumeText: z.string().min(100, "Resume must be at least 100 characters"),
  jobDescription: z.string().optional(),
});

export const CoverLetterInputSchema = z.object({
  resumeText: z.string().min(100),
  jobTitle: z.string().min(2),
  company: z.string().min(2),
  jobDescription: z.string().min(50),
});

export const JobMatchInputSchema = z.object({
  resumeText: z.string().min(100),
  jobPosting: z.string().min(50),
});

export type ContentInput = z.infer<typeof ContentInputSchema>;
export type ResumeInput = z.infer<typeof ResumeInputSchema>;
export type CoverLetterInput = z.infer<typeof CoverLetterInputSchema>;
export type JobMatchInput = z.infer<typeof JobMatchInputSchema>;