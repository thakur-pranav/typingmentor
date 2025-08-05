export function calculateAccuracy(correctCharacters: number, totalCharacters: number): number {
  if (totalCharacters <= 0) return 0;
  const accuracy = (correctCharacters / totalCharacters) * 100;
  return Math.round(accuracy * 100) / 100;
}
