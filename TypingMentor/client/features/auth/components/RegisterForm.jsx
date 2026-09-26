"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../hooks/AuthProvider";
import { Button } from "../../../components/ui/Button";
import { TextField } from "../../../components/ui/TextField";
import { Alert } from "../../../components/ui/Alert";
import { GoogleSignInButton } from "./GoogleSignInButton";

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await register({ username, email, password });
      if (res?.requireVerification) {
        setRegisteredEmail(email);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (registeredEmail) {
    return (
      <div className="space-y-4 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-nb-green border-2 border-nb-border text-nb-text font-black text-xl shadow-nb-sm">
          ✓
        </div>
        <h2 className="text-lg font-black uppercase text-nb-text">
          Check Your Email
        </h2>
        <p className="text-sm text-nb-text">
          We&apos;ve sent a verification link to <strong>{registeredEmail}</strong>.
        </p>
        <p className="text-xs text-nb-sub bg-nb-yellow/20 p-3 border-2 border-nb-border">
          Please click the link in your email to activate your account.
          <br />
          <span className="text-[11px] font-bold text-nb-text/70 mt-1 block">
            (In local development, check your server terminal for the verification link!)
          </span>
        </p>
        <div className="pt-2">
          <Link
            href="/login"
            className="inline-block border-2 border-nb-border bg-nb-yellow px-4 py-2 text-xs font-bold uppercase tracking-wider text-nb-text shadow-nb-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
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
        {error && <Alert variant="error">{error}</Alert>}
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={3}
          autoComplete="username"
        />
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
          minLength={6}
          autoComplete="new-password"
        />
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Create account
        </Button>
      </form>
    </div>
  );
}
