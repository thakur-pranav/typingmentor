"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/AuthProvider";
import { Button } from "../../../components/ui/Button";
import { TextField } from "../../../components/ui/TextField";
import { Alert } from "../../../components/ui/Alert";

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register({ username, email, password });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
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
  );
}
