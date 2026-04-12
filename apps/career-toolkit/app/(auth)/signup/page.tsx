"use client";

import { createClient } from "@ai-tools-suite/auth/client";
import { AuthLayout, Button, Input } from "@ai-tools-suite/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <AuthLayout appName="Career Toolkit" title="Create your account" subtitle="Start optimizing your career today">
      <div className="space-y-4">
        {error && <div className="error-box">{error}</div>}
        <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={handleSignup} loading={loading} className="btn-full mt-2">Sign up</Button>
        <p className="auth-link-row">Have an account? <a href="/login" className="auth-link">Sign in</a></p>
      </div>
    </AuthLayout>
  );
}