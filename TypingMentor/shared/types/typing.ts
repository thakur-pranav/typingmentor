export type TestMode = "timed" | "passage";

export type Difficulty = "easy" | "medium" | "hard";

export interface Passage {
  id: string;
  text: string;
  difficulty: Difficulty;
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
