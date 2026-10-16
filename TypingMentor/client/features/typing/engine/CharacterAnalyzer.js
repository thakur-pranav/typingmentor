/**
 * Backward-compatible adapter delegating to the unified ScoringEngine.
 */
import { classifyCharactersAndWords } from "./ScoringEngine";

export function analyzeCharacters(target, typed, options = {}) {
  const result = classifyCharactersAndWords(target, typed, options);
  return {
    correctCharacters: result.correctCharacters,
    incorrectCharacters: result.incorrectCharacters,
    extraCharacters: result.extraCharacters,
    missedCharacters: result.missedCharacters,
    correctWordCharacters: result.correctWordCharacters,
    totalCharacters: result.totalCharacters,
    statuses: result.statuses,
  };
}
