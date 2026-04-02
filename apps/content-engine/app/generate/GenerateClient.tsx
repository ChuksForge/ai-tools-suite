"use client";

import { useState } from "react";
import { DashboardLayout, Button, Textarea, Input } from "@ai-tools-suite/ui";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@ai-tools-suite/auth/client";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: "▪" },
  { label: "Generate", href: "/generate", icon: "✦" },
  { label: "History", href: "/history", icon: "◈" },
  { label: "Settings", href: "/settings", icon: "◎" },
];

const PLATFORMS = [
  { id: "twitter", label: "Twitter / X", color: "#1DA1F2" },
  { id: "linkedin", label: "LinkedIn", color: "#0A66C2" },
  { id: "newsletter", label: "Newsletter", color: "#FF6B35" },
  { id: "tiktok", label: "TikTok", color: "#FF0050" },
  { id: "instagram", label: "Instagram", color: "#E1306C" },
  { id: "blog", label: "Blog", color: "#00FF88" },
];

const TONES = ["professional", "casual", "witty"];

export default function GenerateClient({ usage }: any) {
  const pathname = usePathname();
  const router = useRouter();

  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState("twitter");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const [streamText, setStreamText] = useState("");
  const [useStream, setUseStream] = useState(false);
  const [error, setError] = useState("");

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function handleScrape() {
    if (!url) return;
    setScraping(true);
    setError("");
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setText(data.text);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setScraping(false);
    }
  }

  async function handleGenerate() {
    if (!text || text.length < 50) {
      setError("Input must be at least 50 characters");
      return;
    }
    setLoading(true);
    setError("");
    setOutput(null);
    setStreamText("");

    try {
      if (useStream) {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, platform, tone, stream: true }),
        });

        if (!res.ok) throw new Error("Generation failed");

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          accumulated += chunk;
          setStreamText(accumulated);
        }
      } else {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, platform, tone, stream: false }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setOutput(data.output);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const limitReached = usage.limit !== -1 && usage.used >= usage.limit;

  return (
    <DashboardLayout
      appName="Content Engine"
      navItems={NAV}
      currentPath={pathname}
      onSignOut={handleSignOut}
    >
      <div style={{ maxWidth: "800px" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 className="font-display" style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.25rem" }}>
            Generate Content
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>
            Repurpose your content for any platform in seconds
          </p>
        </div>

        {limitReached && (
          <div className="error-box" style={{ marginBottom: "1.5rem", borderColor: "#FFB800", color: "#FFB800" }}>
            Monthly limit reached ({usage.used}/{usage.limit}).{" "}
            <a href="/settings" style={{ color: "#0066FF" }}>Upgrade to Pro</a> for unlimited generations.
          </div>
        )}

        {error && <div className="error-box" style={{ marginBottom: "1.5rem" }}>{error}</div>}

        {/* URL Import */}
        <div className="card" style={{ marginBottom: "1rem" }}>
          <div className="input-label" style={{ marginBottom: "0.75rem" }}>Import from URL (optional)</div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <div style={{ flex: 1 }}>
              <Input
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <Button
              variant="secondary"
              onClick={handleScrape}
              loading={scraping}
              disabled={!url}
            >
              Import
            </Button>
          </div>
        </div>

        {/* Content input */}
        <div className="card" style={{ marginBottom: "1rem" }}>
          <Textarea
            label="Your content"
            placeholder="Paste your blog post, article, script, or any content here (min. 50 characters)..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
          />
          <div className="input-hint" style={{ marginTop: "0.5rem" }}>
            {text.length} characters
          </div>
        </div>

        {/* Platform selector */}
        <div className="card" style={{ marginBottom: "1rem" }}>
          <div className="input-label" style={{ marginBottom: "0.75rem" }}>Target platform</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                style={{
                  padding: "0.625rem",
                  border: `1px solid ${platform === p.id ? p.color : "var(--border)"}`,
                  background: platform === p.id ? `${p.color}15` : "transparent",
                  color: platform === p.id ? p.color : "var(--muted-foreground)",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.65rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tone + Mode */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          <div className="card">
            <div className="input-label" style={{ marginBottom: "0.75rem" }}>Tone</div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    border: `1px solid ${tone === t ? "#0066FF" : "var(--border)"}`,
                    background: tone === t ? "#0066FF15" : "transparent",
                    color: tone === t ? "#0066FF" : "var(--muted-foreground)",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.65rem",
                    textTransform: "capitalize",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="input-label" style={{ marginBottom: "0.75rem" }}>Output mode</div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {[{ id: false, label: "Structured" }, { id: true, label: "Stream" }].map((m) => (
                <button
                  key={String(m.id)}
                  onClick={() => setUseStream(m.id)}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    border: `1px solid ${useStream === m.id ? "#0066FF" : "var(--border)"}`,
                    background: useStream === m.id ? "#0066FF15" : "transparent",
                    color: useStream === m.id ? "#0066FF" : "var(--muted-foreground)",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.65rem",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          loading={loading}
          disabled={limitReached || !text}
          fullWidth
          size="lg"
        >
          {loading ? "Generating..." : "Generate →"}
        </Button>

        {/* Output */}
        {(output || streamText) && (
          <div className="card" style={{ marginTop: "1.5rem" }}>
            <div className="card-header">
              <span className="card-title" style={{ fontSize: "0.875rem" }}>Output</span>
              <span className="badge badge-success">Complete</span>
            </div>
            {streamText ? (
              <pre style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", whiteSpace: "pre-wrap", color: "var(--foreground)" }}>
                {streamText}
              </pre>
            ) : (
              <pre style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", whiteSpace: "pre-wrap", color: "var(--foreground)" }}>
                {JSON.stringify(output, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}