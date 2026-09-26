"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../hooks/AuthProvider";
import { Button } from "../../../components/ui/Button";
import { TextField } from "../../../components/ui/TextField";
import { Alert } from "../../../components/ui/Alert";
import { GoogleSignInButton } from "./GoogleSignInButton";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnverified, setIsUnverified] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setIsUnverified(false);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg);
      if (msg.toLowerCase().includes("verify your email")) {
        setIsUnverified(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <GoogleSignInButton onError={(msg) => setError(msg)} />

      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-nb-border" />
        <span className="absolute bg-nb-card px-3 text-[11px] font-black uppercase tracking-widest text-nb-sub">
          or with email
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="space-y-2">
            <Alert variant="error">{error}</Alert>
            {isUnverified && (
              <div className="text-center pt-1">
                <Link
                  href="/verify-email"
                  className="text-xs font-bold text-nb-text underline hover:text-nb-sub"
                >
                  Need to resend verification email? Click here.
                </Link>
              </div>
            )}
          </div>
        )}
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Log in
        </Button>
      </form>
    </div>
  );
}
