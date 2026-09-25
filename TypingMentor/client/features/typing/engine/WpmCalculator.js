/**
 * Standard convention: 5 characters = 1 word.
 */
const CHARS_PER_WORD = 5;

export function calculateWpm(totalCharacters, durationSeconds) {
  if (durationSeconds <= 0) return 0;
  const durationMinutes = durationSeconds / 60;
  const words = totalCharacters / CHARS_PER_WORD;
  return words / durationMinutes;
}

export function calculateNetWpm(wpm, incorrectCharacters, durationSeconds) {
  if (durationSeconds <= 0) return 0;
  const durationMinutes = durationSeconds / 60;
  const penalty = incorrectCharacters / durationMinutes;
  return Math.max(0, wpm - penalty);
}
