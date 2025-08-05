import { TestMode } from "./typing";

export interface TestResult {
  id: string;
  userId: string;
  mode: TestMode;
  duration: number;
  wpm: number;
  netWpm: number;
  accuracy: number;
  totalCharacters: number;
  correctCharacters: number;
  incorrectCharacters: number;
  createdAt: string;
}

export interface SubmitResultPayload {
  mode: TestMode;
  duration: number;
  wpm: number;
  netWpm: number;
  accuracy: number;
  totalCharacters: number;
  correctCharacters: number;
  incorrectCharacters: number;
}

export interface PaginatedResults {
  results: TestResult[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserStatistics {
  bestWpm: number;
  bestNetWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  totalTests: number;
  totalCharacters: number;
  recentTests: TestResult[];
}
