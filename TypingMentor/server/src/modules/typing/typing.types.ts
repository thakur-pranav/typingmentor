export type Difficulty = "easy" | "medium" | "hard";

export interface Passage {
  id: string;
  text: string;
  difficulty: Difficulty;
}
