export const runtime = "nodejs";
export const maxDuration = 60;

import { createClient } from "@ai-tools-suite/auth/server";
import { runCoverLetterWorkflow } from "@ai-tools-suite/ai";
import { checkUsageLimit } from "@ai-tools-suite/billing";
import { createCoverLetter } from "@ai-tools-suite/db/queries/career/cover-letter";
import { upsertUser } from "@ai-tools-suite/db/queries/shared/user";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "../../../lib/rate-limit";
import { z } from "zod";

const CoverLetterSchema = z.object({
  resumeText: z.string().min(100).max(15000),
  jobTitle: z.string().min(2),
  company: z.string().min(2),
  jobDescription: z.string().min(50).max(10000),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await upsertUser(user.id, user.email!);

    const rateCheck = checkRateLimit(`cover-letter:${user.id}`, 20, 60_000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
    }

    const usage = await checkUsageLimit(user.id, "career");
    if (!usage.allowed) {
      return NextResponse.json({ error: "Monthly limit reached", usage }, { status: 429 });
    } 

    const body = await req.json();
    const parsed = CoverLetterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    const { resumeText, jobTitle, company, jobDescription } = parsed.data;

    const result = await runCoverLetterWorkflow({
      resumeText,
      jobTitle,
      company,
      jobDescription,
    });

    const output = result.data as unknown as {
      subject: string;
      letter: string;
    };

    await createCoverLetter(user.id, jobTitle, company, output.letter);

    return NextResponse.json({ output });
  } catch (err: any) {
    console.error("Cover letter error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}