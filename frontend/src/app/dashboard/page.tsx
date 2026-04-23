"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, removeToken } from "@/lib/api";

// ── Nav items ──────────────────────────
const NAV = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    id: "companies",
    label: "Companies",
    href: "/dashboard/companies",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
      </svg>
    ),
  },
  {
    id: "clients",
    label: "Clients",
    href: "/dashboard/clients",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    id: "invoices",
    label: "Invoices",
    href: "/dashboard/invoices",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    href: "/dashboard/settings",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
];

// ── Stats ──────────────────────────────
const STATS = [
  { label: "Total Revenue", value: "$0.00", sub: "this month", color: "#6366f1" },
  { label: "Invoices Sent", value: "0", sub: "total", color: "#10b981" },
  { label: "Active Clients", value: "0", sub: "registered", color: "#f59e0b" },
  { label: "Pending Payments", value: "0", sub: "awaiting", color: "#ef4444" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) router.replace("/login");
  }, [router]);

  function handleLogout() {
    removeToken();
    router.push("/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            zIndex: 10, display: "block",
          }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        style={{
          position: "fixed",
          top: 0, left: 0, bottom: 0,
          width: "240px",
          background: "var(--bg-sidebar)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          zIndex: 20,
          transform: sidebarOpen ? "translateX(0)" : undefined,
          transition: "transform 0.25s ease",
        }}
        className="sidebar"
      >
        {/* Logo */}
        <div style={{ padding: "1.5rem 1.25rem 1rem", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "36px", height: "36px", borderRadius: "9px",
                background: "linear-gradient(135deg, #6366f1, #4f52e8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div>
              <div className="gradient-text" style={{ fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.02em" }}>
                InvoiceFlow
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "1px" }}>Workspace</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "2px" }}>
          {NAV.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => { setActive(item.id); setSidebarOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.625rem 0.875rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  background: isActive ? "rgba(99,102,241,0.12)" : "transparent",
                  color: isActive ? "#818cf8" : "var(--text-secondary)",
                  fontFamily: "inherit", fontSize: "0.875rem", fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  textAlign: "left", width: "100%",
                  transition: "background 0.15s, color 0.15s",
                  position: "relative",
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.color = "var(--text-primary)";
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }
                }}
              >
                {isActive && (
                  <div style={{
                    position: "absolute", left: 0, top: "20%", bottom: "20%",
                    width: "3px", borderRadius: "0 3px 3px 0",
                    background: "#6366f1",
                  }} />
                )}
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: "0.75rem", borderTop: "1px solid var(--border)" }}>
          <button
            id="logout-btn"
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.625rem 0.875rem",
              borderRadius: "0.5rem",
              border: "none",
              background: "transparent",
              color: "var(--text-muted)",
              fontFamily: "inherit", fontSize: "0.875rem", fontWeight: 400,
              cursor: "pointer",
              width: "100%", textAlign: "left",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(239,68,68,0.08)";
              e.currentTarget.style.color = "#fca5a5";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div style={{ flex: 1, marginLeft: "240px", display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <header
          style={{
            height: "64px",
            borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 2rem",
            background: "rgba(10,10,15,0.8)",
            backdropFilter: "blur(12px)",
            position: "sticky", top: 0, zIndex: 5,
          }}
        >
          {/* Mobile menu btn */}
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              display: "none", background: "none", border: "none",
              color: "var(--text-secondary)", cursor: "pointer", padding: "4px",
            }}
            className="mobile-menu-btn"
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          <div>
            <h1 style={{ fontSize: "1.0625rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
              {NAV.find(n => n.id === active)?.label ?? "Dashboard"}
            </h1>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
              Welcome back to InvoiceFlow
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {/* New invoice button */}
            <button
              id="new-invoice-btn"
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.5rem 1rem",
                background: "linear-gradient(135deg, #6366f1, #4f52e8)",
                border: "none", borderRadius: "0.5rem",
                color: "white", fontFamily: "inherit",
                fontSize: "0.8125rem", fontWeight: 600,
                cursor: "pointer",
                transition: "opacity 0.2s, transform 0.15s",
                boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = "0.9";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Invoice
            </button>

            {/* Avatar */}
            <div
              style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1, #a78bfa)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.75rem", fontWeight: 700, color: "white",
                cursor: "pointer", flexShrink: 0,
              }}
            >
              IF
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "2rem" }} className="animate-fade-in">
          {/* Stats grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="glass"
                style={{
                  borderRadius: "0.875rem",
                  padding: "1.25rem 1.5rem",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px rgba(0,0,0,0.3)`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500, marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: stat.color, letterSpacing: "-0.03em", marginBottom: "0.25rem" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          <div
            className="glass"
            style={{
              borderRadius: "0.875rem",
              padding: "4rem 2rem",
              textAlign: "center",
              border: "1px dashed var(--border-hover)",
            }}
          >
            <div
              className="animate-float"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: "64px", height: "64px", borderRadius: "16px",
                background: "rgba(99,102,241,0.12)",
                marginBottom: "1.5rem",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
              No invoices yet
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "340px", margin: "0 auto 1.5rem" }}>
              Create your first invoice and start billing your clients professionally.
            </p>
            <button
              id="create-first-invoice"
              style={{
                padding: "0.625rem 1.5rem",
                background: "linear-gradient(135deg, #6366f1, #4f52e8)",
                border: "none", borderRadius: "0.5rem",
                color: "white", fontFamily: "inherit",
                fontSize: "0.875rem", fontWeight: 600,
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Create First Invoice
            </button>
          </div>
        </main>
      </div>

      {/* Responsive sidebar styles */}
      <style>{`
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); }
          [style*="marginLeft: 240px"] { margin-left: 0 !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
