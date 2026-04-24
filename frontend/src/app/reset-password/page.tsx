"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
    }
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    
    setError("");
    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
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
          Set New Password
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Please enter your new password
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
            Your password has been successfully updated. Redirecting to login...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: "var(--text-secondary)",
                marginBottom: "0.5rem",
              }}
            >
              New Password
            </label>
            <input
              id="password"
              className="input-field"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={!token}
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

          <button type="submit" className="btn-primary" disabled={loading || !token}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
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
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
