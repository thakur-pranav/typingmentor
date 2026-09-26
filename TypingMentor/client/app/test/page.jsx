"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../features/auth/hooks/AuthProvider.jsx";
import { getRandomPassage, getRandomCodePassage } from "../../features/typing/utils/randomPassage.js";
import { useTypingTest } from "../../features/typing/hooks/useTypingTest.js";
import { resultService } from "../../features/typing/services/resultService.js";
import { TestModeSelector } from "../../features/typing/components/TestModeSelector.jsx";
import { DurationSelector } from "../../features/typing/components/DurationSelector.jsx";
import { LanguageSelector } from "../../features/typing/components/LanguageSelector.jsx";
import { TypingArea } from "../../features/typing/components/TypingArea.jsx";
import { TestControls } from "../../features/typing/components/TestControls.jsx";
import { TestResult } from "../../features/typing/components/TestResult.jsx";

export default function TestPage() {
  const { isAuthenticated } = useAuth();
  const [mode, setMode] = useState("timed");
  const [duration, setDuration] = useState(30);
  const [language, setLanguage] = useState("javascript");
  const [passage, setPassage] = useState(() => getRandomPassage());
  const [codePassage, setCodePassage] = useState(() => getRandomCodePassage("javascript"));
  const [attempt, setAttempt] = useState(0);
  const [saveStatus, setSaveStatus] = useState("idle");

  // Build the target text based on current mode.
  const targetText =
    mode === "timed"   ? passage.text.repeat(4) :
    mode === "passage" ? passage.text :
    /* code */           codePassage.text;

  const isTimed = mode === "timed" || mode === "code";

  const {
    comparison,
    typed,
    isFinished,
    result,
    wpmHistory,
    handleInput,
    reset,
  } = useTypingTest({
    mode,
    targetText,
    timedDurationSeconds: isTimed ? duration : undefined,
  });

  const handleModeChange = useCallback((nextMode) => {
    setMode(nextMode);
    if (nextMode === "code") {
      setCodePassage(getRandomCodePassage(language));
    } else {
      setPassage(getRandomPassage());
    }
    setSaveStatus("idle");
    setAttempt((a) => a + 1);
  }, [language]);

  const handleDurationChange = useCallback((nextDuration) => {
    setDuration(nextDuration);
    setSaveStatus("idle");
    setAttempt((a) => a + 1);
  }, []);

  const handleLanguageChange = useCallback((nextLang) => {
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
  }, [isFinished, result, isAuthenticated, mode, saveStatus]);

  return (
    <div key={attempt} className="mx-auto flex flex-1 w-full max-w-6xl flex-col justify-center px-6 py-8">

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-start gap-2">
        <TestModeSelector mode={mode} onChange={handleModeChange} />

        {isTimed && (
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
        <div className="mb-4 flex justify-start">
          <div className="inline-flex items-center gap-2 border-2 border-nb-border bg-nb-cyan px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-nb-sm">
            <span>{codePassage.language}</span>
            <span className="text-nb-text/50">·</span>
            <span>{codePassage.label}</span>
          </div>
        </div>
      )}

      {/* Active test */}
      {!isFinished && comparison && (
        <div className="mx-auto w-full space-y-6">
          <TypingArea
            statuses={comparison.statuses}
            typed={typed}
            targetText={targetText}
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
