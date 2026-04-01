"use client";
import { cn } from "../utils";
import { useState } from "react";
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}
export interface DashboardLayoutProps {
  children: React.ReactNode;
  appName: string;
  navItems: NavItem[];
  userEmail?: string;
  currentPath?: string;
  onSignOut?: () => void;
}
export function DashboardLayout({
  children,
  appName,
  navItems,
  userEmail,
  currentPath,
  onSignOut,
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border flex flex-col transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* App name */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="font-mono text-xs uppercase tracking-widest text-[#0066FF] font-bold">
            {appName}
          </span>
        </div>
        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            const active = currentPath === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors duration-150 border border-transparent",
                  active
                    ? "text-[#0066FF] border-l-2 border-l-[#0066FF] bg-[#0066FF0D]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </a>
            );
          })}
        </nav>
        {/* User */}
        <div className="p-4 border-t border-border">
          {userEmail && (
            <p className="font-mono text-xs text-muted-foreground truncate mb-3">
              {userEmail}
            </p>
          )}
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="w-full font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-[#FF3333] transition-colors text-left"
            >
              Sign out →
            </button>
          )}
        </div>
      </aside>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 flex items-center px-6 border-b border-border bg-card sticky top-0 z-20">
          <button
            className="lg:hidden font-mono text-xs uppercase tracking-wider text-muted-foreground mr-4"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            ☰
          </button>
          <div className="flex-1" />
        </header>
        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}