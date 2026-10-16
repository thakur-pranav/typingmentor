/**
 * Backward-compatible adapter delegating to the unified ScoringEngine.
 */
import {
  calculateWpm as calcWpm,
  calculateNetWpm as calcNetWpm,
  calculateRawWpm as calcRawWpm,
  calculateCpm as calcCpm,
  calculateKph as calcKph,
  CHARS_PER_WORD,
} from "./ScoringEngine";

export { CHARS_PER_WORD };

export function calculateWpm(totalCharacters, durationSeconds) {
  return calcWpm(totalCharacters, durationSeconds);
}

export function calculateRawWpm(totalCharacters, durationSeconds) {
  return calcRawWpm(totalCharacters, durationSeconds);
}

export function calculateNetWpm(wpm, incorrectCharacters, durationSeconds) {
  return calcNetWpm(wpm, incorrectCharacters, durationSeconds);
}

export function calculateCpm(wpm) {
  return calcCpm(wpm);
}

export function calculateKph(wpm) {
  return calcKph(wpm);
}
