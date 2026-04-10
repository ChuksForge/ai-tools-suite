"use client";

import { useState } from "react";
import { DashboardLayout, Button, Textarea } from "@ai-tools-suite/ui";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@ai-tools-suite/auth/client";
import { NAV } from "../../lib/nav";

export default function ResumeClient({ usage, resumes }: any) {
  const pathname = usePathname();
  const router = useRouter();
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function handleOptimize() {
    if (resumeText.length < 100) { setError("Resume must be at least 100 characters"); return; }
    setLoading(true); setError(""); setOutput(null);
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
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

  return (
    <DashboardLayout appName="Career Toolkit" navItems={NAV} currentPath={pathname} onSignOut={handleSignOut}>
      <div style={{ maxWidth: "800px" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 className="font-display" style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.25rem" }}>Resume Optimizer</h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>Paste your resume and get an ATS-optimized version with a score</p>
        </div>

        {limitReached && (
          <div className="error-box" style={{ marginBottom: "1.5rem", borderColor: "#FFB800", color: "#FFB800" }}>
            Monthly limit reached. <a href="/settings" style={{ color: "#0066FF" }}>Upgrade to Pro</a>
          </div>
        )}
        {error && <div className="error-box" style={{ marginBottom: "1.5rem" }}>{error}</div>}

        <div className="card" style={{ marginBottom: "1rem" }}>
          <Textarea label="Your resume" placeholder="Paste your full resume here..." value={resumeText} onChange={(e) => setResumeText(e.target.value)} rows={10} />
        </div>

        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <Textarea label="Job description (optional)" placeholder="Paste the job description to tailor optimization..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={5} />
        </div>

        <Button onClick={handleOptimize} loading={loading} disabled={limitReached || !resumeText} fullWidth size="lg">
          {loading ? "Optimizing..." : "Optimize Resume →"}
        </Button>

        {output && (
          <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Score */}
            <div className="card">
              <div className="card-header">
                <span className="card-title" style={{ fontSize: "0.875rem" }}>Resume Score</span>
                <span className={`badge ${output.score >= 80 ? "badge-success" : output.score >= 60 ? "badge-warning" : "badge-error"}`}>
                  {output.score}/100
                </span>
              </div>
              <div style={{ height: "8px", background: "var(--border)", marginBottom: "1rem" }}>
                <div style={{ height: "100%", width: `${output.score}%`, background: output.score >= 80 ? "#00FF88" : output.score >= 60 ? "#FFB800" : "#FF3333", transition: "width 0.5s" }} />
              </div>
              <div className="input-label" style={{ marginBottom: "0.5rem" }}>Key improvements</div>
              <ul style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                {output.improvements?.map((imp: string, i: number) => (
                  <li key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.875rem" }}>
                    <span style={{ color: "#0066FF" }}>→</span>{imp}
                  </li>
                ))}
              </ul>
            </div>

            {/* Keywords */}
            {output.keywords?.length > 0 && (
              <div className="card">
                <div className="input-label" style={{ marginBottom: "0.75rem" }}>Suggested keywords</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {output.keywords.map((kw: string, i: number) => (
                    <span key={i} className="badge badge-info">{kw}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Optimized resume */}
            <div className="card">
              <div className="card-header">
                <span className="card-title" style={{ fontSize: "0.875rem" }}>Optimized Resume</span>
                <button
                  onClick={() => navigator.clipboard.writeText(output.optimized)}
                  className="input-label"
                  style={{ color: "#0066FF", background: "none", border: "none", cursor: "pointer" }}
                >
                  Copy →
                </button>
              </div>
              <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.875rem", fontFamily: "'DM Sans', sans-serif", color: "var(--foreground)" }}>
                {output.optimized}
              </pre>
            </div>
          </div>
        )}

        {/* Past resumes */}
        {resumes.length > 0 && (
          <div className="card" style={{ marginTop: "2rem" }}>
            <div className="card-header">
              <span className="card-title" style={{ fontSize: "0.875rem" }}>Past optimizations</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {resumes.map((r: any) => (
                <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", border: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                  {r.score && <span className={`badge ${r.score >= 80 ? "badge-success" : r.score >= 60 ? "badge-warning" : "badge-error"}`}>{r.score}/100</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}