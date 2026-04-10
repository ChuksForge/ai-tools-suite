export const runtime = "nodejs";
export const maxDuration = 60;

import { createClient } from "@ai-tools-suite/auth/server";
import { runResumeWorkflow } from "@ai-tools-suite/ai";
import { checkUsageLimit } from "@ai-tools-suite/billing";
import { createResume, updateResume } from "@ai-tools-suite/db/queries/career/resume";
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

    const { resumeText, jobDescription } = await req.json();

    const resume = await createResume(user.id, resumeText);

    const result = await runResumeWorkflow({ resumeText, jobDescription });
    const output = result.data as unknown as {
      score: number;
      optimized: string;
      improvements: string[];
      keywords: string[];
    };

    await updateResume(resume.id, output.optimized, output.score);

    return NextResponse.json({ resumeId: resume.id, output });
  } catch (err: any) {
    console.error("Resume error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}