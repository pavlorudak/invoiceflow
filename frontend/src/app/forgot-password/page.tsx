"use client";

import { useState } from "react";
import { forgotPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Could not connect to server.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden",
        background: "var(--bg-primary)",
      }}
    >
      {/* ── Card ── */}
      <div
        className="animate-fade-in glass"
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "420px",
          borderRadius: "1.25rem",
          padding: "2.5rem 2rem",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 className="gradient-text" style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.375rem" }}>
            Reset Password
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Enter your email to receive a reset link
          </p>
        </div>

        {success ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ 
              display: "inline-flex", padding: "1rem", borderRadius: "50%", 
              background: "rgba(16, 185, 129, 0.1)", color: "#10b981", marginBottom: "1rem" 
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              If an account exists with that email, we've sent instructions to reset your password.
            </p>
            <a href="/login" className="btn-primary" style={{ display: "block", textDecoration: "none" }}>
              Back to Sign In
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  marginBottom: "0.5rem",
                }}
              >
                Email address
              </label>
              <input
                id="email"
                className="input-field"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && (
              <div role="alert" style={{
                padding: "0.75rem", borderRadius: "0.5rem", background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5", fontSize: "0.875rem", marginBottom: "1rem"
              }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {!success && (
          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.8125rem" }}>
            <a href="/login" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
              ← Back to Sign In
            </a>
          </p>
        )}
      </div>
    </main>
  );
}
