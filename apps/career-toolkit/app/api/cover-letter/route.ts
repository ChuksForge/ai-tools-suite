export const runtime = "nodejs";
export const maxDuration = 60;

import { createClient } from "@ai-tools-suite/auth/server";
import { runCoverLetterWorkflow } from "@ai-tools-suite/ai";
import { checkUsageLimit } from "@ai-tools-suite/billing";
import { createCoverLetter } from "@ai-tools-suite/db/queries/career/cover-letter";
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

    const { resumeText, jobTitle, company, jobDescription } = await req.json();

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