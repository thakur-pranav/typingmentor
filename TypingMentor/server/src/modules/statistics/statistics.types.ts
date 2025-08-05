import { ResultDocument } from "../results/result.model";

export interface UserStatistics {
  bestWpm: number;
  bestNetWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  totalTests: number;
  totalCharacters: number;
  recentTests: ResultDocument[];
}
