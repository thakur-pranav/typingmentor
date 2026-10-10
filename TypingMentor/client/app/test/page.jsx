"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../features/auth/hooks/AuthProvider.jsx";
import { getRandomPassage, getRandomCodePassage } from "../../features/typing/utils/randomPassage.js";
import { useTypingTest } from "../../features/typing/hooks/useTypingTest.js";
import { resultService } from "../../features/typing/services/resultService.js";
import { TestModeSelector } from "../../features/typing/components/TestModeSelector.jsx";
import { DurationSelector } from "../../features/typing/components/DurationSelector.jsx";
import { LanguageSelector } from "../../features/typing/components/LanguageSelector.jsx";
import { CustomTextModal } from "../../features/typing/components/CustomTextModal.jsx";
import { SoundSelector } from "../../features/typing/components/SoundSelector.jsx";
import { soundEngine } from "../../features/typing/utils/soundEngine.js";
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
  const [customText, setCustomText] = useState(
    "The quick brown fox jumps over the lazy dog."
  );
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [saveStatus, setSaveStatus] = useState("idle");

  // Build the target text based on current mode.
  const targetText =
    mode === "timed"   ? Array(8).fill(passage.text.trim()).join(" ") :
    mode === "passage" ? passage.text.trim() :
    mode === "custom"  ? customText.trim() :
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
    } else if (nextMode === "custom") {
      setIsCustomModalOpen(true);
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
    } else if (mode === "timed" || mode === "passage") {
      setPassage(getRandomPassage());
    }
    setSaveStatus("idle");
    reset();
    setAttempt((a) => a + 1);
  }, [mode, language, reset]);

  const handleSaveCustomText = useCallback((newText) => {
    setCustomText(newText);
    setSaveStatus("idle");
    setAttempt((a) => a + 1);
  }, []);

  useEffect(() => {
    if (isFinished && result) {
      soundEngine.playCompletion();
      if (saveStatus === "idle") {
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

        {mode === "custom" && (
          <>
            <span className="mx-1 font-bold text-nb-sub">·</span>
            <button
              type="button"
              onClick={() => setIsCustomModalOpen(true)}
              className="border-2 border-nb-border bg-nb-yellow px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-nb-text shadow-nb-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
            >
              Edit Text
            </button>
          </>
        )}

        <span className="mx-1 font-bold text-nb-sub">·</span>
        <SoundSelector />
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

      {/* Custom text label (shown only in custom mode) */}
      {mode === "custom" && !isFinished && (
        <div className="mb-4 flex justify-start">
          <div className="inline-flex items-center gap-2 border-2 border-nb-border bg-nb-yellow px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-nb-sm">
            <span>Custom Text</span>
            <span className="text-nb-text/50">·</span>
            <span>{customText.trim().split(/\s+/).filter(Boolean).length} Words</span>
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

      {/* Custom text modal */}
      <CustomTextModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSave={handleSaveCustomText}
        currentText={customText}
      />
    </div>
  );
}
