export const runtime = "nodejs";

import { createClient } from "@ai-tools-suite/auth/server";
import { getResumesByUser } from "@ai-tools-suite/db/queries/career/resume";
import { getCoverLettersByUser } from "@ai-tools-suite/db/queries/career/cover-letter";
import { getJobMatchesByUser } from "@ai-tools-suite/db/queries/career/job-match";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [resumes, coverLetters, jobMatches] = await Promise.all([
    getResumesByUser(user.id),
    getCoverLettersByUser(user.id),
    getJobMatchesByUser(user.id),
  ]);

  return NextResponse.json({ resumes, coverLetters, jobMatches });
}