/**
 * Compares typed input against the target text, character by character.
 * The current cursor position is typed.length; everything after it is
 * marked "current" (first untyped char) or "untyped".
 */
export function analyzeCharacters(target, typed) {
  let correctCharacters = 0;
  let incorrectCharacters = 0;
  const statuses = [];

  for (let i = 0; i < target.length; i++) {
    if (i < typed.length) {
      const isCorrect = typed[i] === target[i];
      if (isCorrect) correctCharacters++;
      else incorrectCharacters++;
      statuses.push({ char: target[i], state: isCorrect ? "correct" : "incorrect" });
    } else if (i === typed.length) {
      statuses.push({ char: target[i], state: "current" });
    } else {
      statuses.push({ char: target[i], state: "untyped" });
    }
  }

  return { correctCharacters, incorrectCharacters, statuses };
}
