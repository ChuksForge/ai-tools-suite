"use client";

import { useState } from "react";
import { DashboardLayout, Button, Input, Textarea } from "@ai-tools-suite/ui";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@ai-tools-suite/auth/client";
import { NAV } from "../../lib/nav";

export default function CoverLetterClient({ usage }: any) {
  const pathname = usePathname();
  const router = useRouter();
  const [form, setForm] = useState({ resumeText: "", jobTitle: "", company: "", jobDescription: "" });
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleGenerate() {
    setLoading(true); setError(""); setOutput(null);
    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOutput(data.output);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const limitReached = usage.limit !== -1 && usage.used >= usage.limit;
  const canGenerate = form.resumeText.length >= 100 && form.jobTitle && form.company && form.jobDescription.length >= 50;

  return (
    <DashboardLayout appName="Career Toolkit" navItems={NAV} currentPath={pathname} onSignOut={handleSignOut}>
      <div style={{ maxWidth: "800px" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 className="font-display" style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.25rem" }}>Cover Letter Generator</h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>Generate a tailored cover letter for any role</p>
        </div>

        {error && <div className="error-box" style={{ marginBottom: "1.5rem" }}>{error}</div>}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <div className="card">
            <Input label="Job title" placeholder="Senior Software Engineer" value={form.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} />
          </div>
          <div className="card">
            <Input label="Company" placeholder="Acme Corp" value={form.company} onChange={(e) => update("company", e.target.value)} />
          </div>
        </div>

        <div className="card" style={{ marginBottom: "1rem" }}>
          <Textarea label="Your resume" placeholder="Paste your resume here..." value={form.resumeText} onChange={(e) => update("resumeText", e.target.value)} rows={6} />
        </div>

        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <Textarea label="Job description" placeholder="Paste the full job description..." value={form.jobDescription} onChange={(e) => update("jobDescription", e.target.value)} rows={6} />
        </div>

        <Button onClick={handleGenerate} loading={loading} disabled={limitReached || !canGenerate} fullWidth size="lg">
          {loading ? "Generating..." : "Generate Cover Letter →"}
        </Button>

        {output && (
          <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="input-label" style={{ marginBottom: "0.25rem" }}>Email subject</div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>{output.subject}</div>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(output.letter)}
                  className="input-label"
                  style={{ color: "#0066FF", background: "none", border: "none", cursor: "pointer" }}
                >
                  Copy →
                </button>
              </div>
              <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.875rem", fontFamily: "'DM Sans', sans-serif", color: "var(--foreground)", lineHeight: 1.7 }}>
                {output.letter}
              </pre>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}