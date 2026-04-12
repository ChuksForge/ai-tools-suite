"use client";

import { DashboardLayout } from "@ai-tools-suite/ui";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@ai-tools-suite/auth/client";
import { NAV } from "../../lib/nav";

export default function DashboardClient({ user, usage, resumes, coverLetters, jobMatches }: any) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const latestResume = resumes[0];
  const totalActions = resumes.length + coverLetters.length + jobMatches.length;
  const avgScore = resumes.filter((r: any) => r.score).length > 0
    ? Math.round(resumes.filter((r: any) => r.score).reduce((a: number, r: any) => a + r.score, 0) / resumes.filter((r: any) => r.score).length)
    : null;

  return (
    <DashboardLayout
      appName="Career Toolkit"
      navItems={NAV}
      userEmail={user.email}
      currentPath={pathname}
      onSignOut={handleSignOut}
    >
      <div style={{ maxWidth: "960px", width: "100%" }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <div className="card">
          <div className="input-label" style={{ marginBottom: "0.5rem" }}>Resumes optimized</div>
          <div className="font-display" style={{ fontSize: "2rem", fontWeight: 800 }}>{resumes.length}</div>
        </div>
        <div className="card">
          <div className="input-label" style={{ marginBottom: "0.5rem" }}>Cover letters</div>
          <div className="font-display" style={{ fontSize: "2rem", fontWeight: 800 }}>{coverLetters.length}</div>
        </div>
        <div className="card">
          <div className="input-label" style={{ marginBottom: "0.5rem" }}>Avg resume score</div>
          <div className="font-display" style={{ fontSize: "2rem", fontWeight: 800 }}>
            {avgScore ?? "—"}
            {avgScore && <span style={{ fontSize: "1rem", fontWeight: 400, color: "var(--muted-foreground)" }}>/100</span>}
          </div>
        </div>
      </div>

      {/* Usage bar */}
      {usage.limit !== -1 && (
        <div className="card" style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span className="input-label">Monthly usage</span>
            <span className="input-label">{usage.used}/{usage.limit}</span>
          </div>
          <div style={{ height: "4px", background: "var(--border)" }}>
            <div style={{
              height: "100%",
              width: `${Math.min((usage.used / usage.limit) * 100, 100)}%`,
              background: usage.used >= usage.limit ? "#FF3333" : "#0066FF",
              transition: "width 0.3s",
            }} />
          </div>
          {usage.used >= usage.limit && (
            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="input-label" style={{ color: "#FF3333" }}>Limit reached</span>
              <a href="/settings" className="btn btn-primary" style={{ height: "2rem", padding: "0 1rem", fontSize: "0.65rem" }}>
                Upgrade to Pro
              </a>
            </div>
          )}
        </div>
      )}

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Optimize Resume", href: "/resume", desc: "Upload and score your resume" },
          { label: "Write Cover Letter", href: "/cover-letter", desc: "Generate a tailored letter" },
          { label: "Match a Job", href: "/job-match", desc: "See how well you fit a role" },
        ].map((action) => (
          <a key={action.href} href={action.href} className="card" style={{ textDecoration: "none", display: "block", cursor: "pointer" }}>
            <div className="input-label" style={{ color: "#0066FF", marginBottom: "0.5rem" }}>{action.label} →</div>
            <div style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>{action.desc}</div>
          </a>
        ))}
      </div>

      {/* Latest resume score */}
      {latestResume?.score && (
        <div className="card" style={{ marginBottom: "2rem" }}>
          <div className="card-header">
            <span className="card-title" style={{ fontSize: "0.875rem" }}>Latest resume score</span>
            <span className="badge badge-info">{latestResume.score}/100</span>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div style={{ flex: 1, height: "8px", background: "var(--border)" }}>
              <div style={{
                height: "100%",
                width: `${latestResume.score}%`,
                background: latestResume.score >= 80 ? "#00FF88" : latestResume.score >= 60 ? "#FFB800" : "#FF3333",
                transition: "width 0.5s",
              }} />
            </div>
            <span className="input-label">{latestResume.score >= 80 ? "Strong" : latestResume.score >= 60 ? "Moderate" : "Needs work"}</span>
          </div>
        </div>
      )}

      {/* Recent activity */}
      <div className="card">
        <div className="card-header">
          <span className="card-title" style={{ fontSize: "0.875rem" }}>Recent activity</span>
        </div>
        {totalActions === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p className="input-label" style={{ marginBottom: "1rem" }}>No activity yet</p>
            <a href="/resume" className="btn btn-primary">Optimize your first resume</a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              ...resumes.slice(0, 2).map((r: any) => ({ type: "Resume", date: r.createdAt, score: r.score })),
              ...coverLetters.slice(0, 2).map((c: any) => ({ type: "Cover Letter", date: c.createdAt, company: c.company, jobTitle: c.jobTitle })),
              ...jobMatches.slice(0, 2).map((m: any) => ({ type: "Job Match", date: m.createdAt, score: m.matchScore })),
            ]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((item: any, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", border: "1px solid var(--border)" }}>
                  <div>
                    <div className="input-label" style={{ color: "var(--foreground)" }}>{item.type}</div>
                    {item.company && <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>{item.jobTitle} at {item.company}</div>}
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    {item.score && <span className="badge badge-info">{item.score}/100</span>}
                    <span className="input-label">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      </div>
    </DashboardLayout>
  );
}