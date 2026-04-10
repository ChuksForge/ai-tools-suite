import { createClient } from "@ai-tools-suite/auth/server";
import { redirect } from "next/navigation";
import { checkUsageLimit } from "@ai-tools-suite/billing";
import JobMatchClient from "./JobMatchClient";

export default async function JobMatchPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const usage = await checkUsageLimit(user.id, "career");
  return <JobMatchClient usage={usage} />;
}