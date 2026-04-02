"use client";

import { useState } from "react";
import { DashboardLayout, Button } from "@ai-tools-suite/ui";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@ai-tools-suite/auth/client";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: "▪" },
  { label: "Generate", href: "/generate", icon: "✦" },
  { label: "History", href: "/history", icon: "◈" },
  { label: "Settings", href: "/settings", icon: "◎" },
];

export default function SettingsClient({ user, usage }: any) {
  const pathname = usePathname();
  const router = useRouter();
  const [upgrading, setUpgrading] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function handleUpgrade() {
    setUpgrading(true);
    try {
      const res = await fetch("/api/billing/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setUpgrading(false);
    }
  }

  const isPro = usage.plan === "pro";

  return (
    <DashboardLayout
      appName="Content Engine"
      navItems={NAV}
      currentPath={pathname}
      onSignOut={handleSignOut}
    >
      <div style={{ maxWidth: "600px" }}>
        <h1 className="font-display" style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "2rem" }}>Settings</h1>

        {/* Account */}
        <div className="card" style={{ marginBottom: "1rem" }}>
          <div className="card-header">
            <span className="card-title" style={{ fontSize: "0.875rem" }}>Account</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div>
              <div className="input-label" style={{ marginBottom: "0.25rem" }}>Email</div>
              <div style={{ fontSize: "0.875rem" }}>{user.email}</div>
            </div>
            <div>
              <div className="input-label" style={{ marginBottom: "0.25rem" }}>User ID</div>
              <div style={{ fontSize: "0.75rem", fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>{user.id}</div>
            </div>
          </div>
        </div>

        {/* Plan */}
        <div className="card" style={{ marginBottom: "1rem" }}>
          <div className="card-header">
            <span className="card-title" style={{ fontSize: "0.875rem" }}>Plan</span>
            <span className={`badge ${isPro ? "badge-success" : "badge-default"}`}>
              {isPro ? "Pro" : "Free"}
            </span>
          </div>

          {isPro ? (
            <div>
              <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
                You have unlimited generations. Thank you for being a Pro member.
              </p>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
                  {usage.used} of {usage.limit} generations used this month
                </span>
              </div>
              <div style={{ height: "4px", background: "var(--border)", marginBottom: "1.5rem" }}>
                <div style={{
                  height: "100%",
                  width: `${Math.min((usage.used / usage.limit) * 100, 100)}%`,
                  background: usage.used >= usage.limit ? "#FF3333" : "#0066FF",
                  transition: "width 0.3s",
                }} />
              </div>

              {/* Pro plan card */}
              <div style={{ border: "1px solid #0066FF", padding: "1.5rem", background: "#0066FF08" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div>
                    <div className="font-display" style={{ fontSize: "1.25rem", fontWeight: 800 }}>Pro</div>
                    <div className="input-label" style={{ marginTop: "0.25rem" }}>Everything you need to scale</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="font-display" style={{ fontSize: "1.5rem", fontWeight: 800 }}>$19</div>
                    <div className="input-label">/month</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
                  {["Unlimited generations", "All 6 platforms", "Streaming output", "Priority support"].map((f) => (
                    <div key={f} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <span style={{ color: "#00FF88", fontSize: "0.75rem" }}>✓</span>
                      <span style={{ fontSize: "0.875rem" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Button onClick={handleUpgrade} loading={upgrading} fullWidth>
                  Upgrade to Pro →
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}