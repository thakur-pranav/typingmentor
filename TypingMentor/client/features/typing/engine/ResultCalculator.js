import { calculateAccuracy } from "./AccuracyCalculator";
import { calculateNetWpm, calculateWpm } from "./WpmCalculator";

export function calculateResult(input) {
  const {
    totalCharacters,
    correctCharacters,
    incorrectCharacters,
    rawCorrectKeystrokes,
    rawTotalKeystrokes,
    durationSeconds,
  } = input;

  const wpm = calculateWpm(totalCharacters, durationSeconds);
  const netWpm = calculateNetWpm(wpm, incorrectCharacters, durationSeconds);

  // Fall back to correct/total characters if raw keystrokes are omitted
  const rawTotal = rawTotalKeystrokes !== undefined ? rawTotalKeystrokes : totalCharacters;
  const rawCorrect = rawCorrectKeystrokes !== undefined ? rawCorrectKeystrokes : correctCharacters;
  const accuracy = calculateAccuracy(rawCorrect, rawTotal);

  return {
    totalCharacters,
    correctCharacters,
    incorrectCharacters,
    accuracy,
    wpm: Math.round(wpm * 100) / 100,
    netWpm: Math.round(netWpm * 100) / 100,
    duration: durationSeconds,
  };
}
