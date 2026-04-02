"use client";

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
  twitter: "#1DA1F2",
  linkedin: "#0A66C2",
  newsletter: "#FF6B35",
  tiktok: "#FF0050",
  instagram: "#E1306C",
  blog: "#00FF88",
};

export default function DashboardClient({ user, jobs, usage }: any) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const recentJobs = jobs.slice(0, 5);
  const platformCounts = jobs.reduce((acc: any, job: any) => {
    acc[job.platform] = (acc[job.platform] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <DashboardLayout
      appName="Content Engine"
      navItems={NAV}
      userEmail={user.email}
      currentPath={pathname}
      onSignOut={handleSignOut}
    >
      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <div className="card">
          <div className="input-label" style={{ marginBottom: "0.5rem" }}>Generations used</div>
          <div className="font-display" style={{ fontSize: "2rem", fontWeight: 800 }}>
            {usage.used}
            {usage.limit !== -1 && (
              <span style={{ fontSize: "1rem", color: "var(--muted-foreground)", fontWeight: 400 }}>
                /{usage.limit}
              </span>
            )}
          </div>
        </div>
        <div className="card">
          <div className="input-label" style={{ marginBottom: "0.5rem" }}>Total jobs</div>
          <div className="font-display" style={{ fontSize: "2rem", fontWeight: 800 }}>{jobs.length}</div>
        </div>
        <div className="card">
          <div className="input-label" style={{ marginBottom: "0.5rem" }}>Current plan</div>
          <div className="font-display" style={{ fontSize: "2rem", fontWeight: 800, textTransform: "capitalize" }}>
            {usage.plan}
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
          <div style={{ height: "4px", background: "var(--border)", borderRadius: "2px" }}>
            <div style={{
              height: "100%",
              width: `${Math.min((usage.used / usage.limit) * 100, 100)}%`,
              background: usage.used >= usage.limit ? "#FF3333" : "#0066FF",
              borderRadius: "2px",
              transition: "width 0.3s ease",
            }} />
          </div>
          {usage.used >= usage.limit && (
            <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="input-label" style={{ color: "#FF3333" }}>Limit reached</span>
              <a href="/settings" className="btn btn-primary" style={{ height: "2rem", padding: "0 1rem", fontSize: "0.65rem" }}>
                Upgrade to Pro
              </a>
            </div>
          )}
        </div>
      )}

      {/* Platform breakdown */}
      {Object.keys(platformCounts).length > 0 && (
        <div className="card" style={{ marginBottom: "2rem" }}>
          <div className="card-header">
            <span className="card-title" style={{ fontSize: "0.875rem" }}>By platform</span>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {Object.entries(platformCounts).map(([platform, count]: any) => (
              <div key={platform} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: PLATFORM_COLORS[platform] ?? "#888", display: "inline-block" }} />
                <span className="input-label" style={{ textTransform: "capitalize" }}>{platform}</span>
                <span className="input-label" style={{ color: "var(--foreground)" }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent jobs */}
      <div className="card">
        <div className="card-header">
          <span className="card-title" style={{ fontSize: "0.875rem" }}>Recent generations</span>
          <a href="/history" className="input-label" style={{ color: "#0066FF", textDecoration: "none" }}>View all →</a>
        </div>
        {recentJobs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p className="input-label" style={{ marginBottom: "1rem" }}>No generations yet</p>
            <a href="/generate" className="btn btn-primary">Start generating</a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {recentJobs.map((job: any) => (
              <div key={job.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: PLATFORM_COLORS[job.platform] ?? "#888", display: "inline-block", flexShrink: 0 }} />
                  <div>
                    <div className="input-label" style={{ textTransform: "capitalize", color: "var(--foreground)" }}>{job.platform}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: "0.125rem" }}>
                      {job.input.slice(0, 60)}...
                    </div>
                  </div>
                </div>
                <span className={`badge badge-${job.status === "complete" ? "success" : job.status === "failed" ? "error" : "default"}`}>
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}