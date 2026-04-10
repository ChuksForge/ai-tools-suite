export const runtime = "nodejs";
export const maxDuration = 60;

import { createClient } from "@ai-tools-suite/auth/server";
import { runJobMatchWorkflow } from "@ai-tools-suite/ai";
import { checkUsageLimit } from "@ai-tools-suite/billing";
import { createJobMatch } from "@ai-tools-suite/db/queries/career/job-match";
import { createResume } from "@ai-tools-suite/db/queries/career/resume";
import { upsertUser } from "@ai-tools-suite/db/queries/shared/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await upsertUser(user.id, user.email!);

    const usage = await checkUsageLimit(user.id, "career");
    if (!usage.allowed) {
      return NextResponse.json({ error: "Monthly limit reached", usage }, { status: 429 });
    }

    const { resumeText, jobPosting } = await req.json();

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