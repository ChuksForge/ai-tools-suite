"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)" }}>
      <div style={{ maxWidth: "400px", textAlign: "center" }}>
        <div className="input-label" style={{ color: "#FF3333", marginBottom: "0.5rem" }}>Error</div>
        <h1 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem" }}>
          Something went wrong
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", marginBottom: "2rem" }}>
          {error.message ?? "An unexpected error occurred."}
        </p>
        <button onClick={reset} className="btn btn-primary">
          Try again
        </button>
      </div>
    </div>
  );
}