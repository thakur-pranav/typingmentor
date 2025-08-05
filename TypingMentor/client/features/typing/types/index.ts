export type TestMode = "timed" | "passage" | "code";
export type Difficulty = "easy" | "medium" | "hard";
export type CodeLanguage = "cpp" | "java" | "javascript" | "python" | "rust";

export interface Passage {
  id: string;
  text: string;
  difficulty: Difficulty;
}

export interface CodePassage {
  id: string;
  language: CodeLanguage;
  label: string;   // human-readable snippet title
  text: string;
}

export type CharacterState = "correct" | "incorrect" | "current" | "untyped";

export interface CharacterStatus {
  char: string;
  state: CharacterState;
}

export interface TypingResult {
  totalCharacters: number;
  correctCharacters: number;
  incorrectCharacters: number;
  accuracy: number;
  wpm: number;
  netWpm: number;
  duration: number;
}

export interface LiveTypingStats {
  wpm: number;
  netWpm: number;
  accuracy: number;
  errors: number;
  elapsedSeconds: number;
}
