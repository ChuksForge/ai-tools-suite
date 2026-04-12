export const runtime = "nodejs";
export const maxDuration = 60;

import { createClient } from "@ai-tools-suite/auth/server";
import { runJobMatchWorkflow } from "@ai-tools-suite/ai";
import { checkUsageLimit } from "@ai-tools-suite/billing";
import { createJobMatch } from "@ai-tools-suite/db/queries/career/job-match";
import { createResume } from "@ai-tools-suite/db/queries/career/resume";
import { upsertUser } from "@ai-tools-suite/db/queries/shared/user";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "../../../lib/rate-limit";
import { z } from "zod";

const JobMatchSchema = z.object({
  resumeText: z.string().min(100).max(15000),
  jobPosting: z.string().min(50).max(10000),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await upsertUser(user.id, user.email!);

    const rateCheck = checkRateLimit(`job-match:${user.id}`, 20, 60_000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
    }

    const usage = await checkUsageLimit(user.id, "career");
    if (!usage.allowed) {
      return NextResponse.json({ error: "Monthly limit reached", usage }, { status: 429 });
    }

    const body = await req.json();
    const parsed = JobMatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    const { resumeText, jobPosting } = parsed.data;

    const result = await runJobMatchWorkflow({ resumeText, jobPosting });
    const output = result.data as unknown as {
      matchScore: number;
      strengths: string[];
      gaps: string[];
      missingKeywords: string[];
      recommendation: string;
    };

    // Save resume snapshot for the match record
    const resume = await createResume(user.id, resumeText);
    await createJobMatch(user.id, resume.id, jobPosting, output.matchScore, {
      gaps: output.gaps,
      missingKeywords: output.missingKeywords,
    });

    return NextResponse.json({ output });
  } catch (err: any) {
    console.error("Job match error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}