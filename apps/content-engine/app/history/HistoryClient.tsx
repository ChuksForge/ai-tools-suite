"use client";

import { useState } from "react";
import { DashboardLayout } from "@ai-tools-suite/ui";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@ai-tools-suite/auth/client";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: "▪" },
  { label: "Generate", href: "/generate", icon: "✦" },
  { label: "History", href: "/history", icon: "◈" },
  { label: "Settings", href: "/settings", icon: "◎" },
];

const PLATFORM_COLORS: Record<string, string> = {
  twitter: "#1DA1F2", linkedin: "#0A66C2", newsletter: "#FF6B35",
  tiktok: "#FF0050", instagram: "#E1306C", blog: "#00FF88",
};

const ALL = "all";

export default function HistoryClient({ jobs }: any) {
  const pathname = usePathname();
  const router = useRouter();
  const [filter, setFilter] = useState(ALL);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const platforms = [...new Set(jobs.map((j: any) => j.platform))];
  const filtered = filter === ALL ? jobs : jobs.filter((j: any) => j.platform === filter);

  return (
    <DashboardLayout
      appName="Content Engine"
      navItems={NAV}
      currentPath={pathname}
      onSignOut={handleSignOut}
    >
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 className="font-display" style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.25rem" }}>History</h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>{jobs.length} total generations</p>
        </div>
        <a href="/generate" className="btn btn-primary">New generation</a>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {[ALL, ...platforms].map((p: any) => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            style={{
              padding: "0.375rem 0.75rem",
              border: `1px solid ${filter === p ? "#0066FF" : "var(--border)"}`,
              background: filter === p ? "#0066FF15" : "transparent",
              color: filter === p ? "#0066FF" : "var(--muted-foreground)",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.65rem",
              textTransform: "capitalize",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Job list */}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <p className="input-label">No generations found</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {filtered.map((job: any) => (
            <div key={job.id} className="card" style={{ padding: "1rem" }}>
              <div
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
                onClick={() => setExpanded(expanded === job.id ? null : job.id)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: PLATFORM_COLORS[job.platform] ?? "#888", display: "inline-block", flexShrink: 0 }} />
                  <div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <span className="input-label" style={{ textTransform: "capitalize", color: "var(--foreground)" }}>{job.platform}</span>
                      <span className={`badge badge-${job.status === "complete" ? "success" : job.status === "failed" ? "error" : "default"}`}>{job.status}</span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: "0.25rem" }}>
                      {job.input.slice(0, 80)}...
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span className="input-label">{new Date(job.createdAt).toLocaleDateString()}</span>
                  <span style={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}>{expanded === job.id ? "▲" : "▼"}</span>
                </div>
              </div>

              {expanded === job.id && (
                <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                  <div className="input-label" style={{ marginBottom: "0.5rem" }}>Input</div>
                  <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", marginBottom: "1rem" }}>{job.input}</p>
                  <div className="input-label" style={{ marginBottom: "0.5rem" }}>Output</div>
                  <pre style={{ fontSize: "0.8rem", color: "var(--foreground)", whiteSpace: "pre-wrap", fontFamily: "'DM Mono', monospace", background: "var(--muted)", padding: "1rem" }}>
                    {JSON.stringify(job.output, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}