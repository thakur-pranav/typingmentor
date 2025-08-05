export interface TestResultSummary {
  id: string;
  mode: "timed" | "passage";
  wpm: number;
  netWpm: number;
  accuracy: number;
  duration: number;
  createdAt: string;
}

export interface UserStatistics {
  bestWpm: number;
  bestNetWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  totalTests: number;
  totalCharacters: number;
  recentTests: TestResultSummary[];
}
