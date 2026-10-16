"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../auth/hooks/AuthProvider.jsx";
import { feedbackService } from "../services/feedbackService.js";

const COOLDOWN_STORAGE_KEY = "tm_feedback_cooldown_until";

const CATEGORIES = [
  {
    id: "suggestion",
    label: "Suggestion",
    icon: "💡",
    color: "bg-nb-yellow text-nb-text",
    borderActive: "border-nb-border bg-nb-yellow shadow-nb-sm",
  },
  {
    id: "bug",
    label: "Bug Report",
    icon: "🐛",
    color: "bg-nb-pink text-white",
    borderActive: "border-nb-border bg-nb-pink text-white shadow-nb-sm",
  },
  {
    id: "query",
    label: "Query / Help",
    icon: "💬",
    color: "bg-nb-cyan text-nb-text",
    borderActive: "border-nb-border bg-nb-cyan shadow-nb-sm",
  },
];

export function FeedbackForm() {
  const { isAuthenticated, user } = useAuth();

  const [category, setCategory] = useState("suggestion");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [showSpamModal, setShowSpamModal] = useState(false);

  // Close spam modal on Escape key press
  useEffect(() => {
    if (!showSpamModal) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setShowSpamModal(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSpamModal]);

  // Initialize name and email if logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (!name) setName(user.username || "");
      if (!email) setEmail(user.email || "");
    }
  }, [isAuthenticated, user]);

  // Check local storage and server for cooldown
  useEffect(() => {
    function calculateLocalCooldown() {
      const storedUntil = localStorage.getItem(COOLDOWN_STORAGE_KEY);
      if (storedUntil) {
        const remaining = Math.max(0, Math.ceil((parseInt(storedUntil, 10) - Date.now()) / 1000));
        return remaining;
      }
      return 0;
    }

    const localRemaining = calculateLocalCooldown();
    if (localRemaining > 0) {
      setCooldownSeconds(localRemaining);
    }

    // Query server cooldown status
    const queryEmail = email || user?.email || "";
    feedbackService
      .getCooldownStatus(queryEmail)
      .then((status) => {
        if (status && !status.canSubmit && status.remainingSeconds > 0) {
          const serverRemaining = status.remainingSeconds;
          setCooldownSeconds((prev) => Math.max(prev, serverRemaining));
          localStorage.setItem(COOLDOWN_STORAGE_KEY, String(Date.now() + serverRemaining * 1000));
        }
      })
      .catch(() => {
        // Silent fail on check, local timer still functions
      });
  }, [email, user]);

  // Tick down cooldown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;

    const timer = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          localStorage.removeItem(COOLDOWN_STORAGE_KEY);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs < 10 ? "0" : ""}${secs}s` : `${secs}s`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (cooldownSeconds > 0) {
      setShowSpamModal(true);
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      await feedbackService.submitFeedback({
        name,
        email,
        category,
        subject,
        message,
      });

      // 15-minute cooldown (900 seconds)
      const cooldownSecs = 15 * 60;
      setCooldownSeconds(cooldownSecs);
      localStorage.setItem(COOLDOWN_STORAGE_KEY, String(Date.now() + cooldownSecs * 1000));

      setSuccessMessage(
        "Thank you! Your feedback has been received and emailed to our support team (byteforgelabs.app@gmail.com). We will review it shortly!"
      );

      setSubject("");
      setMessage("");
      if (!isAuthenticated) {
        setName("");
        setEmail("");
      }
    } catch (err) {
      if (err.code === "FEEDBACK_COOLDOWN_ACTIVE" || err.status === 429) {
        if (err.remainingSeconds) {
          setCooldownSeconds(err.remainingSeconds);
          localStorage.setItem(
            COOLDOWN_STORAGE_KEY,
            String(Date.now() + err.remainingSeconds * 1000)
          );
        } else if (cooldownSeconds === 0) {
          setCooldownSeconds(15 * 60);
          localStorage.setItem(
            COOLDOWN_STORAGE_KEY,
            String(Date.now() + 15 * 60 * 1000)
          );
        }
        setShowSpamModal(true);
      } else {
        const msg = err.message || "Failed to submit feedback. Please try again.";
        setErrorMessage(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="border-2 border-nb-border bg-nb-card p-4 sm:p-8 shadow-nb">
      {/* Category Tabs */}
      <div className="mb-6">
        <label className="mb-2 block text-xs font-black uppercase tracking-wider text-nb-text">
          Select Category
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          {CATEGORIES.map((cat) => {
            const isActive = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex items-center justify-center gap-1.5 border-2 border-nb-border px-3 py-2.5 text-xs font-black uppercase tracking-wider transition-all sm:text-sm ${
                  isActive
                    ? cat.borderActive
                    : "bg-nb-bg text-nb-sub hover:bg-white hover:text-nb-text"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="mb-6 border-2 border-nb-border bg-nb-green p-4 font-bold text-nb-text shadow-nb-sm">
          <div className="flex items-start gap-2">
            <span className="text-xl">✅</span>
            <div className="text-xs sm:text-sm leading-relaxed">{successMessage}</div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 border-2 border-nb-border bg-nb-pink p-4 font-bold text-white shadow-nb-sm">
          <div className="flex items-start gap-2">
            <span className="text-xl">⚠️</span>
            <div className="text-xs sm:text-sm leading-relaxed">{errorMessage}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name and Email Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="feedback-name"
              className="mb-1 block text-xs font-black uppercase tracking-wider text-nb-text"
            >
              Your Name *
            </label>
            <input
              id="feedback-name"
              type="text"
              required
              minLength={2}
              maxLength={60}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Miller"
              className="w-full border-2 border-nb-border bg-white px-3 py-2 text-sm font-medium text-nb-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nb-yellow"
            />
          </div>

          <div>
            <label
              htmlFor="feedback-email"
              className="mb-1 block text-xs font-black uppercase tracking-wider text-nb-text"
            >
              Your Email *
            </label>
            <input
              id="feedback-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full border-2 border-nb-border bg-white px-3 py-2 text-sm font-medium text-nb-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nb-yellow"
            />
          </div>
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor="feedback-subject"
            className="mb-1 block text-xs font-black uppercase tracking-wider text-nb-text"
          >
            Subject *
          </label>
          <input
            id="feedback-subject"
            type="text"
            required
            minLength={3}
            maxLength={120}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief summary of your inquiry or feedback"
            className="w-full border-2 border-nb-border bg-white px-3 py-2 text-sm font-medium text-nb-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nb-yellow"
          />
        </div>

        {/* Message */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label
              htmlFor="feedback-message"
              className="text-xs font-black uppercase tracking-wider text-nb-text"
            >
              Message *
            </label>
            <span
              className={`text-[11px] font-bold ${
                message.length > 2900
                  ? "text-nb-pink"
                  : message.length >= 10
                  ? "text-nb-sub"
                  : "text-gray-400"
              }`}
            >
              {message.length} / 3000 chars {message.length < 10 && "(min 10)"}
            </span>
          </div>
          <textarea
            id="feedback-message"
            required
            rows={5}
            minLength={10}
            maxLength={3000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Provide as much detail as possible so we can look into it or give you an accurate answer..."
            className="w-full border-2 border-nb-border bg-white px-3 py-2 text-sm font-medium text-nb-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nb-yellow leading-relaxed"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full border-2 border-nb-border bg-nb-yellow py-3 text-sm font-black uppercase tracking-wider text-nb-text shadow-nb transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-nb-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none cursor-pointer"
          >
            {isSubmitting ? "Submitting..." : "Send Message →"}
          </button>
        </div>
      </form>

      {/* Anti-Spam Modal Popup */}
      {showSpamModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="anti-spam-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSpamModal(false);
          }}
        >
          <div className="relative w-full max-w-md border-2 border-nb-border bg-nb-card p-6 shadow-nb sm:p-7 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Close Button top-right */}
            <button
              type="button"
              onClick={() => setShowSpamModal(false)}
              aria-label="Close anti-spam alert"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center border-2 border-nb-border bg-nb-bg text-nb-text font-black hover:bg-nb-pink hover:text-white transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Shield Header */}
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center border-2 border-nb-border bg-nb-yellow text-2xl shadow-nb-sm">
                🛡️
              </span>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-nb-sub">
                  Protection Notice
                </div>
                <h3
                  id="anti-spam-title"
                  className="text-lg font-black uppercase tracking-tight text-nb-text"
                >
                  Anti-Spam Notice
                </h3>
              </div>
            </div>

            {/* Notice Statement */}
            <p className="text-xs sm:text-sm font-medium leading-relaxed text-nb-text border-l-4 border-nb-yellow bg-nb-bg p-3">
              To protect our inbox from automated abuse, submissions are limited to once every 15
              minutes per user / IP address.
            </p>

            {/* Cooldown Timer */}
            {cooldownSeconds > 0 && (
              <div className="flex items-center justify-between border-2 border-nb-border bg-nb-bg p-3 text-xs font-bold text-nb-text shadow-nb-sm">
                <span className="flex items-center gap-1.5 text-nb-sub">
                  <span>⏳</span>
                  <span>Please wait before resubmitting:</span>
                </span>
                <span className="bg-nb-text text-nb-yellow px-2 py-0.5 font-mono text-xs font-black">
                  {formatTime(cooldownSeconds)}
                </span>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowSpamModal(false)}
                className="w-full border-2 border-nb-border bg-nb-yellow py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider text-nb-text shadow-nb transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-nb-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
