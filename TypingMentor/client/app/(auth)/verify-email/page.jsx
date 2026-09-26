"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../features/auth/hooks/AuthProvider.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { TextField } from "../../../components/ui/TextField.jsx";
import { Alert } from "../../../components/ui/Alert.jsx";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { verifyEmail, resendVerification } = useAuth();

  const [status, setStatus] = useState("idle"); // idle, verifying, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendStatus, setResendStatus] = useState("idle"); // idle, sending, sent, error
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("idle");
      return;
    }

    let isMounted = true;
    setStatus("verifying");

    verifyEmail(token)
      .then(() => {
        if (!isMounted) return;
        setStatus("success");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      })
      .catch((err) => {
        if (!isMounted) return;
        setStatus("error");
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "The verification link is invalid or has expired."
        );
      });

    return () => {
      isMounted = false;
    };
  }, [token, verifyEmail, router]);

  async function handleResend(e) {
    e.preventDefault();
    if (!resendEmail) return;

    setResendStatus("sending");
    try {
      const res = await resendVerification(resendEmail);
      setResendStatus("sent");
      setResendMessage(res?.message || "Verification email sent! Check your inbox.");
    } catch (err) {
      setResendStatus("error");
      setResendMessage(
        err instanceof Error ? err.message : "Failed to resend verification email."
      );
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-16">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-nb-text">
          Email Verification
        </h1>
        <p className="mt-1 text-sm text-nb-sub">
          Verify your email to activate your account.
        </p>
      </div>

      <div className="border-2 border-nb-border bg-nb-card p-6 shadow-nb">
        {status === "verifying" && (
          <div className="py-6 text-center space-y-3">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-nb-text border-t-transparent" />
            <p className="font-bold text-nb-text">Verifying your email address...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-nb-green border-2 border-nb-border text-nb-text font-black text-xl shadow-nb-sm">
              ✓
            </div>
            <h2 className="text-lg font-black uppercase text-nb-text">
              Email Verified!
            </h2>
            <p className="text-sm text-nb-sub">
              Your account has been activated. Redirecting to your dashboard...
            </p>
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <Alert variant="error">{errorMessage}</Alert>
            <p className="text-xs font-bold text-nb-sub">
              Need a new verification link? Enter your email address below:
            </p>
            <form onSubmit={handleResend} className="space-y-3">
              <TextField
                label="Email Address"
                type="email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
              {resendStatus === "sent" && (
                <Alert variant="success">{resendMessage}</Alert>
              )}
              {resendStatus === "error" && (
                <Alert variant="error">{resendMessage}</Alert>
              )}
              <Button
                type="submit"
                className="w-full"
                isLoading={resendStatus === "sending"}
              >
                Resend Verification Email
              </Button>
            </form>
          </div>
        )}

        {status === "idle" && (
          <div className="space-y-4">
            <div className="p-4 bg-nb-yellow/20 border-2 border-nb-border space-y-2">
              <p className="text-sm font-bold text-nb-text">
                Check your inbox!
              </p>
              <p className="text-xs text-nb-sub">
                We sent a verification link to your email. Click the link in that email to activate your account.
              </p>
            </div>

            <div className="pt-2 border-t-2 border-nb-border">
              <p className="text-xs font-bold uppercase text-nb-sub mb-3">
                Didn&apos;t receive the email?
              </p>
              <form onSubmit={handleResend} className="space-y-3">
                <TextField
                  label="Email Address"
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                />
                {resendStatus === "sent" && (
                  <Alert variant="success">{resendMessage}</Alert>
                )}
                {resendStatus === "error" && (
                  <Alert variant="error">{resendMessage}</Alert>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={resendStatus === "sending"}
                >
                  Resend Verification Email
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-sm text-nb-sub">
        Already verified?{" "}
        <Link href="/login" className="font-bold text-nb-text underline hover:text-nb-sub">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-6 py-16 text-center font-bold text-nb-sub">
          Loading verification...
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
