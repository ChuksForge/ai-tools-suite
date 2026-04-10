import { createClient } from "@ai-tools-suite/auth/server";
import { redirect } from "next/navigation";
import { checkUsageLimit } from "@ai-tools-suite/billing";
import { getResumesByUser } from "@ai-tools-suite/db/queries/career/resume";
import ResumeClient from "./ResumeClient";

export default async function ResumePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [usage, resumes] = await Promise.all([
    checkUsageLimit(user.id, "career"),
    getResumesByUser(user.id),
  ]);

  return <ResumeClient usage={usage} resumes={resumes} />;
}