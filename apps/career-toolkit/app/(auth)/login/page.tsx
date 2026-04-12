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
    <AuthLayout appName="Career Toolkit" title="Welcome back" subtitle="Sign in to your account to continue">
      <div className="space-y-4">
        {error && <div className="error-box">{error}</div>}
        <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={handleLogin} loading={loading} className="btn-full mt-2">Sign in</Button>
        <p className="auth-link-row">No account? <a href="/signup" className="auth-link">Sign up</a></p>
      </div>
    </AuthLayout>
  );
}