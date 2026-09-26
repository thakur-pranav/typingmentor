"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/AuthProvider";

export function GoogleSignInButton({ onError }) {
  const { googleLogin } = useAuth();
  const router = useRouter();
  const googleBtnRef = useRef(null);
  const [clientId, setClientId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [missingConfig, setMissingConfig] = useState(false);

  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (id) {
      setClientId(id);
    } else {
      setMissingConfig(true);
    }
  }, []);

  useEffect(() => {
    if (!clientId) return;

    // Load Google GSI Script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.accounts?.id && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            setIsLoading(true);
            try {
              await googleLogin(response.credential);
              router.push("/dashboard");
            } catch (err) {
              if (onError) onError(err instanceof Error ? err.message : "Google sign-in failed");
            } finally {
              setIsLoading(false);
            }
          },
        });

        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "continue_with",
          shape: "rectangular",
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [clientId, googleLogin, router, onError]);

  function handleFallbackClick() {
    if (onError) {
      onError(
        "Google Sign-In requires NEXT_PUBLIC_GOOGLE_CLIENT_ID in client/.env.local and GOOGLE_CLIENT_ID in server/.env."
      );
    }
  }

  if (missingConfig) {
    return (
      <button
        type="button"
        onClick={handleFallbackClick}
        className="flex w-full items-center justify-center gap-3 border-2 border-nb-border bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-nb-text shadow-nb-sm transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.67v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.16z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.34 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.97 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>
    );
  }

  return (
    <div className="w-full">
      <div ref={googleBtnRef} className="flex justify-center" />
      {isLoading && <p className="mt-2 text-center text-xs font-bold text-nb-sub">Verifying with Google...</p>}
    </div>
  );
}
