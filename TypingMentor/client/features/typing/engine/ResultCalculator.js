/**
 * Backward-compatible adapter delegating to the unified ScoringEngine.
 */
import { calculateResult as calcResult } from "./ScoringEngine";

export function calculateResult(input) {
  return calcResult(input);
}
