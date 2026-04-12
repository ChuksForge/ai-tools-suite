"use client";

import { cn } from "../utils";
import { useState } from "react";
import type { ReactNode } from "react";

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export interface DashboardLayoutProps {
  children: ReactNode;
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
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar" style={{ transform: mobileOpen ? "translateX(0)" : undefined }}>
        <div className="sidebar-brand">{appName}</div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn("nav-item", currentPath === item.href && "active")}
            >
              {item.icon && (
                <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>
                  {item.icon}
                </span>
              )}
              {item.label}
            </a>
          ))}
        </nav>


        <div className="sidebar-footer">
          {userEmail && (
            <div
              className="sidebar-email"
              title={userEmail}
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "100%",
                marginBottom: "0.625rem",
              }}
            >
              {userEmail}
            </div>
          )}
          {onSignOut && (
            <button className="signout-btn" onClick={onSignOut}>
              Sign out →
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="dashboard-main">
        <header className="dashboard-header">
          <button
            style={{ display: "none" }}
            className="signout-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            ☰
          </button>
        </header>
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}