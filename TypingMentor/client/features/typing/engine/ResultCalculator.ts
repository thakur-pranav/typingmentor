import { TypingResult } from "../types";
import { calculateAccuracy } from "./AccuracyCalculator";
import { calculateNetWpm, calculateWpm } from "./WpmCalculator";

export interface ResultInput {
  totalCharacters: number;
  correctCharacters: number;
  incorrectCharacters: number;
  /** Raw keystrokes typed correctly (backspaced mistakes still counted). */
  rawCorrectKeystrokes: number;
  /** Total raw keystrokes (correct + incorrect, before any backspace). */
  rawTotalKeystrokes: number;
  durationSeconds: number;
}

export function calculateResult(input: ResultInput): TypingResult {
  const {
    totalCharacters,
    correctCharacters,
    incorrectCharacters,
    rawCorrectKeystrokes,
    rawTotalKeystrokes,
    durationSeconds,
  } = input;

  const wpm    = calculateWpm(totalCharacters, durationSeconds);
  const netWpm = calculateNetWpm(wpm, incorrectCharacters, durationSeconds);
  // Accuracy is based on raw keystrokes so backspaced mistakes are penalised.
  const accuracy = calculateAccuracy(rawCorrectKeystrokes, rawTotalKeystrokes);

  return {
    totalCharacters,
    correctCharacters,
    incorrectCharacters,
    accuracy,
    wpm:     Math.round(wpm    * 100) / 100,
    netWpm:  Math.round(netWpm * 100) / 100,
    duration: durationSeconds,
  };
}
