export interface SubmitResultInput {
  mode: "timed" | "passage";
  duration: number;
  wpm: number;
  netWpm: number;
  accuracy: number;
  totalCharacters: number;
  correctCharacters: number;
  incorrectCharacters: number;
}

export interface PaginationInput {
  page: number;
  limit: number;
}
