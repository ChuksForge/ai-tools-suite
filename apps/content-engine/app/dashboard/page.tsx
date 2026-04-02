import { createClient } from "@ai-tools-suite/auth/server";
import { redirect } from "next/navigation";
import { getContentJobsByUser } from "@ai-tools-suite/db/queries/content/jobs";
import { checkUsageLimit } from "@ai-tools-suite/billing";
import { upsertUser } from "@ai-tools-suite/db/queries/shared/user";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await upsertUser(user.id, user.email!);
  const [jobs, usage] = await Promise.all([
    getContentJobsByUser(user.id),
    checkUsageLimit(user.id),
  ]);

  return <DashboardClient user={user} jobs={jobs} usage={usage} />;
}