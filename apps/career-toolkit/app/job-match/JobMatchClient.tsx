"use client";

import { useState } from "react";
import { DashboardLayout, Button, Textarea } from "@ai-tools-suite/ui";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@ai-tools-suite/auth/client";
import { NAV } from "../../lib/nav";

export default function JobMatchClient({ usage }: any) {
  const pathname = usePathname();
  const router = useRouter();
  const [resumeText, setResumeText] = useState("");
  const [jobPosting, setJobPosting] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function handleMatch() {
    setLoading(true); setError(""); setOutput(null);
    try {
      const res = await fetch("/api/job-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobPosting }),
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
          <h1 className="font-display" style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.25rem" }}>Job Match Analyzer</h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>See how well your resume matches a job posting</p>
        </div>

        {error && <div className="error-box" style={{ marginBottom: "1.5rem" }}>{error}</div>}

        <div className="card" style={{ marginBottom: "1rem" }}>
          <Textarea label="Your resume" placeholder="Paste your resume here..." value={resumeText} onChange={(e) => setResumeText(e.target.value)} rows={8} />
        </div>

        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <Textarea label="Job posting" placeholder="Paste the full job posting here..." value={jobPosting} onChange={(e) => setJobPosting(e.target.value)} rows={8} />
        </div>

        <Button onClick={handleMatch} loading={loading} disabled={limitReached || resumeText.length < 100 || jobPosting.length < 50} fullWidth size="lg">
          {loading ? "Analyzing..." : "Analyze Match →"}
        </Button>

        {output && (
          <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Score */}
            <div className="card">
              <div className="card-header">
                <span className="card-title" style={{ fontSize: "0.875rem" }}>Match Score</span>
                <span className={`badge ${output.matchScore >= 80 ? "badge-success" : output.matchScore >= 60 ? "badge-warning" : "badge-error"}`}>
                  {output.matchScore}/100
                </span>
              </div>
              <div style={{ height: "8px", background: "var(--border)", marginBottom: "1rem" }}>
                <div style={{ height: "100%", width: `${output.matchScore}%`, background: output.matchScore >= 80 ? "#00FF88" : output.matchScore >= 60 ? "#FFB800" : "#FF3333", transition: "width 0.5s" }} />
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>{output.recommendation}</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {/* Strengths */}
              <div className="card">
                <div className="input-label" style={{ marginBottom: "0.75rem", color: "#00FF88" }}>Strengths</div>
                <ul style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  {output.strengths?.map((s: string, i: number) => (
                    <li key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.875rem" }}>
                      <span style={{ color: "#00FF88" }}>✓</span>{s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Gaps */}
              <div className="card">
                <div className="input-label" style={{ marginBottom: "0.75rem", color: "#FF3333" }}>Gaps</div>
                <ul style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  {output.gaps?.map((g: string, i: number) => (
                    <li key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.875rem" }}>
                      <span style={{ color: "#FF3333" }}>→</span>{g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Missing keywords */}
            {output.missingKeywords?.length > 0 && (
              <div className="card">
                <div className="input-label" style={{ marginBottom: "0.75rem" }}>Missing keywords</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {output.missingKeywords.map((kw: string, i: number) => (
                    <span key={i} className="badge badge-error">{kw}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}