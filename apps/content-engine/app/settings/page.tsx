import { createClient } from "@ai-tools-suite/auth/server";
import { redirect } from "next/navigation";
import { checkUsageLimit } from "@ai-tools-suite/billing";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const usage = await checkUsageLimit(user.id);
  return <SettingsClient user={user} usage={usage} />;
}