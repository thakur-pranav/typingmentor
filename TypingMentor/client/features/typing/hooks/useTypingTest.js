"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TypingEngine } from "../engine/TypingEngine";

const EMPTY_STATS = { wpm: 0, netWpm: 0, accuracy: 0, errors: 0, elapsedSeconds: 0 };

/**
 * Bridges the framework-agnostic TypingEngine into React state. All typing
 * calculations happen inside the engine; this hook only re-renders on change.
 */
export function useTypingTest(options) {
  const engineRef = useRef(null);
  const [typed, setTyped] = useState("");
  const [comparison, setComparison] = useState(null);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [wpmHistory, setWpmHistory] = useState([]);

  useEffect(() => {
    const engine = new TypingEngine(options);
    engineRef.current = engine;

    const unsubscribe = engine.onChange((state) => {
      setTyped(state.typed);
      setComparison(state.comparison);
      setStats(state.stats);
      setIsFinished(state.isFinished);
      if (state.isFinished) {
        setResult(engine.getResult());
        setWpmHistory(engine.getWpmHistory());
      }
    });

    return () => {
      unsubscribe();
      engine.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.mode, options.targetText, options.timedDurationSeconds]);

  const handleInput = useCallback((value) => {
    engineRef.current?.handleInput(value);
  }, []);

  const reset = useCallback(() => {
    engineRef.current?.reset();
    setResult(null);
    setWpmHistory([]);
  }, []);

  const remainingSeconds = options.timedDurationSeconds
    ? Math.max(0, options.timedDurationSeconds - stats.elapsedSeconds)
    : 0;

  const progressPercent =
    options.targetText && options.targetText.length > 0
      ? Math.min(100, Math.round((typed.length / options.targetText.length) * 100))
      : 0;

  return useMemo(
    () => ({
      typed,
      comparison,
      stats,
      isFinished,
      result,
      wpmHistory,
      remainingSeconds,
      elapsedSeconds: stats.elapsedSeconds,
      currentWpm: stats.wpm,
      currentAccuracy: stats.accuracy,
      progressPercent,
      handleInput,
      reset,
    }),
    [
      typed,
      comparison,
      stats,
      isFinished,
      result,
      wpmHistory,
      remainingSeconds,
      progressPercent,
      handleInput,
      reset,
    ]
  );
}
