export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  appName: string;
}

export function AuthLayout({ children, title, subtitle, appName }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      {/* Left panel */}
      <div className="auth-panel-left">
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#0066FF" }}>
          {appName}
        </div>
        <div>
          <div className="accent-line" />
          <p className="font-display" style={{ fontSize: "2.25rem", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.2 }}>
            Build faster.<br />Ship smarter.<br />
            <span style={{ color: "#0066FF" }}>Powered by AI.</span>
          </p>
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#4A4A4A" }}>
          © {new Date().getFullYear()} AI Tools Suite
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-panel-right">
        <div className="auth-form-container">
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#0066FF", marginBottom: "2rem" }}>
            {appName}
          </div>
          <h1 className="font-display" style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.25rem" }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", marginBottom: "2rem" }}>
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}