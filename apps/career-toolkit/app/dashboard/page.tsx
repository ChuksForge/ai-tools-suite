import { createClient } from "@ai-tools-suite/auth/server";
import { redirect } from "next/navigation";
import { checkUsageLimit } from "@ai-tools-suite/billing";
import { upsertUser } from "@ai-tools-suite/db/queries/shared/user";
import { getResumesByUser } from "@ai-tools-suite/db/queries/career/resume";
import { getCoverLettersByUser } from "@ai-tools-suite/db/queries/career/cover-letter";
import { getJobMatchesByUser } from "@ai-tools-suite/db/queries/career/job-match";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await upsertUser(user.id, user.email!);

  const [usage, resumes, coverLetters, jobMatches] = await Promise.all([
    checkUsageLimit(user.id, "career"),
    getResumesByUser(user.id),
    getCoverLettersByUser(user.id),
    getJobMatchesByUser(user.id),
  ]);

  return (
    <DashboardClient
      user={user}
      usage={usage}
      resumes={resumes}
      coverLetters={coverLetters}
      jobMatches={jobMatches}
    />
  );
}