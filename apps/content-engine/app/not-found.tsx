export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)" }}>
      <div style={{ textAlign: "center" }}>
        <div className="font-display" style={{ fontSize: "6rem", fontWeight: 800, color: "var(--border)", lineHeight: 1 }}>404</div>
        <p className="input-label" style={{ marginBottom: "1.5rem" }}>Page not found</p>
        <a href="/dashboard" className="btn btn-primary">Go to dashboard</a>
      </div>
    </div>
  );
}