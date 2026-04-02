import { createClient } from "@ai-tools-suite/auth/server";
import { getContentJobsByUser } from "@ai-tools-suite/db/queries/content/jobs";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const jobs = await getContentJobsByUser(user.id);
  return NextResponse.json({ jobs });
}