"use client";

import { useEffect, useState } from "react";
import { cn } from "../utils";

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored === "dark" || (!stored && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        "font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 border border-border hover:border-foreground",
        className
      )}
    >
      {dark ? "Light" : "Dark"}
    </button>
  );
}