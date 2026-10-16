/**
 * Backward-compatible adapter delegating to the unified ScoringEngine.
 */
import { calculateAccuracy as calcAccuracy, roundForDisplay } from "./ScoringEngine";

export function calculateAccuracy(correctCharacters, totalCharacters, extra = 0) {
  const unrounded = calcAccuracy(correctCharacters, totalCharacters, extra);
  return roundForDisplay(unrounded, 2);
}
