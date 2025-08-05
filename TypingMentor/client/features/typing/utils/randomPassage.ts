import { PASSAGES } from "../constants/passages";
import { CODE_PASSAGES } from "../constants/codePassages";
import { CodeLanguage, CodePassage, Difficulty, Passage } from "../types";

export function getRandomPassage(difficulty?: Difficulty): Passage {
  const pool = difficulty ? PASSAGES.filter((p) => p.difficulty === difficulty) : PASSAGES;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getRandomCodePassage(language?: CodeLanguage): CodePassage {
  const pool = language ? CODE_PASSAGES.filter((p) => p.language === language) : CODE_PASSAGES;
  return pool[Math.floor(Math.random() * pool.length)];
}
