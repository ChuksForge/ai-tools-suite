import { createClient } from "@ai-tools-suite/auth/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Content Engine Dashboard</h1>
      <p className="text-gray-500 mt-2">Logged in as {user.email}</p>
    </div>
  );
}