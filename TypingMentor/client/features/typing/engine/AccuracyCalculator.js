export function calculateAccuracy(correctCharacters, totalCharacters) {
  if (!totalCharacters || totalCharacters <= 0) return 0;
  if (!correctCharacters || correctCharacters <= 0) return 0;
  const accuracy = (correctCharacters / totalCharacters) * 100;
  return Math.round(accuracy * 100) / 100;
}
