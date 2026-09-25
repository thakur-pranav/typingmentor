import { PASSAGES } from "../constants/passages";
import { CODE_PASSAGES } from "../constants/codePassages";

export function getRandomPassage(difficulty) {
  const pool = difficulty ? PASSAGES.filter((p) => p.difficulty === difficulty) : PASSAGES;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getRandomCodePassage(language) {
  const pool = language ? CODE_PASSAGES.filter((p) => p.language === language) : CODE_PASSAGES;
  return pool[Math.floor(Math.random() * pool.length)];
}
