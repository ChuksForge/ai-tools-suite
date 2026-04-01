"use client";

import { createClient } from "@ai-tools-suite/auth/client";
import { AuthLayout, Button, Input } from "@ai-tools-suite/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <AuthLayout
      appName="Career Toolkit"
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <div className="space-y-4">
        {error && (
          <p className="font-mono text-xs text-[#FF3333] border border-[#FF3333] px-3 py-2">
            {error}
          </p>
        )}
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          onClick={handleLogin}
          loading={loading}
          className="w-full mt-2"
        >
          Sign in
        </Button>
        <p className="font-mono text-xs text-muted-foreground text-center pt-2">
          No account?{" "}
          <a href="/signup" className="text-[#0066FF] hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}