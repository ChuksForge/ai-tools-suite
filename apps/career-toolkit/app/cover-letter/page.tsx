import { createClient } from "@ai-tools-suite/auth/server";
import { redirect } from "next/navigation";
import { checkUsageLimit } from "@ai-tools-suite/billing";
import CoverLetterClient from "./CoverLetterClient";

export default async function CoverLetterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const usage = await checkUsageLimit(user.id, "career");
  return <CoverLetterClient usage={usage} />;
}