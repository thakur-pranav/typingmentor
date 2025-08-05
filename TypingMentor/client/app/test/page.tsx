"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../features/auth/hooks/AuthProvider";
import { CodeLanguage, TestMode } from "../../features/typing/types";
import { TimedDuration } from "../../features/typing/constants/durations";
import { getRandomPassage, getRandomCodePassage } from "../../features/typing/utils/randomPassage";
import { useTypingTest } from "../../features/typing/hooks/useTypingTest";
import { resultService } from "../../features/typing/services/resultService";
import { TestModeSelector } from "../../features/typing/components/TestModeSelector";
import { DurationSelector } from "../../features/typing/components/DurationSelector";
import { LanguageSelector } from "../../features/typing/components/LanguageSelector";
import { TypingArea } from "../../features/typing/components/TypingArea";
import { TestControls } from "../../features/typing/components/TestControls";
import { TestResult } from "../../features/typing/components/TestResult";

type SaveStatus = "idle" | "saving" | "saved" | "error" | "skipped";

export default function TestPage() {
  const { isAuthenticated } = useAuth();
  const [mode, setMode] = useState<TestMode>("timed");
  const [duration, setDuration] = useState<TimedDuration>(30);
  const [language, setLanguage] = useState<CodeLanguage>("javascript");
  const [passage, setPassage] = useState(() => getRandomPassage());
  const [codePassage, setCodePassage] = useState(() => getRandomCodePassage("javascript"));
  const [attempt, setAttempt] = useState(0);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  // Build the target text based on current mode.
  const targetText =
    mode === "timed"   ? passage.text.repeat(4) :
    mode === "passage" ? passage.text :
    /* code */           codePassage.text;

  const { comparison, typed, isFinished, result, wpmHistory, handleInput, reset } = useTypingTest({
    mode,
    targetText,
    timedDurationSeconds: mode === "timed" ? duration : undefined,
  });

  const handleModeChange = useCallback((nextMode: TestMode) => {
    setMode(nextMode);
    if (nextMode === "code") {
      setCodePassage(getRandomCodePassage(language));
    } else {
      setPassage(getRandomPassage());
    }
    setSaveStatus("idle");
    setAttempt((a) => a + 1);
  }, [language]);

  const handleDurationChange = useCallback((nextDuration: TimedDuration) => {
    setDuration(nextDuration);
    setSaveStatus("idle");
    setAttempt((a) => a + 1);
  }, []);

  const handleLanguageChange = useCallback((nextLang: CodeLanguage) => {
    setLanguage(nextLang);
    setCodePassage(getRandomCodePassage(nextLang));
    setSaveStatus("idle");
    setAttempt((a) => a + 1);
  }, []);

  const restart = useCallback(() => {
    if (mode === "code") {
      setCodePassage(getRandomCodePassage(language));
    } else {
      setPassage(getRandomPassage());
    }
    setSaveStatus("idle");
    reset();
    setAttempt((a) => a + 1);
  }, [mode, language, reset]);

  useEffect(() => {
    if (isFinished && result && saveStatus === "idle") {
      if (!isAuthenticated) {
        setSaveStatus("skipped");
        return;
      }
      setSaveStatus("saving");
      resultService
        .submit(mode, result)
        .then(() => setSaveStatus("saved"))
        .catch(() => setSaveStatus("error"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished, result]);

  return (
    <div key={attempt} className="mx-auto w-full max-w-6xl px-6 py-16">

      {/* Toolbar */}
      <div className="mb-12 flex flex-wrap items-center gap-2">
        <TestModeSelector mode={mode} onChange={handleModeChange} />

        {mode === "timed" && (
          <>
            <span className="mx-1 font-bold text-nb-sub">·</span>
            <DurationSelector duration={duration} onChange={handleDurationChange} />
          </>
        )}

        {mode === "code" && (
          <>
            <span className="mx-1 font-bold text-nb-sub">·</span>
            <LanguageSelector language={language} onChange={handleLanguageChange} />
          </>
        )}
      </div>

      {/* Code snippet label (shown only in code mode) */}
      {mode === "code" && !isFinished && (
        <div className="mb-4 inline-flex items-center gap-2 border-2 border-nb-border bg-nb-cyan px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-nb-sm">
          <span>{codePassage.language}</span>
          <span className="text-nb-text/50">·</span>
          <span>{codePassage.label}</span>
        </div>
      )}

      {/* Active test */}
      {!isFinished && comparison && (
        <div className="space-y-6">
          <TypingArea
            statuses={comparison.statuses}
            typed={typed}
            onInput={handleInput}
            disabled={isFinished}
          />
          <TestControls onRestart={restart} />
        </div>
      )}

      {/* Result screen */}
      {isFinished && result && (
        <TestResult
          result={result}
          wpmHistory={wpmHistory}
          onRestart={restart}
          isAuthenticated={isAuthenticated}
          saveStatus={saveStatus}
        />
      )}
    </div>
  );
}
