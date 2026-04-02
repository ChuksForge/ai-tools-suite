import { createClient } from "@ai-tools-suite/auth/server";
import { redirect } from "next/navigation";
import { getContentJobsByUser } from "@ai-tools-suite/db/queries/content/jobs";
import HistoryClient from "./HistoryClient";

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const jobs = await getContentJobsByUser(user.id);
  return <HistoryClient jobs={jobs} />;
}