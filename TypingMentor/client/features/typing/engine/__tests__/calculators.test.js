import { describe, it, expect } from "vitest";
import { calculateWpm, calculateNetWpm } from "../WpmCalculator";
import { calculateAccuracy } from "../AccuracyCalculator";
import { analyzeCharacters } from "../CharacterAnalyzer";
import { calculateResult } from "../ResultCalculator";

describe("calculateWpm", () => {
  it("returns 0 for zero characters", () => {
    expect(calculateWpm(0, 60)).toBe(0);
  });

  it("returns 0 for zero duration", () => {
    expect(calculateWpm(500, 0)).toBe(0);
  });

  it("calculates wpm using 5 chars per word", () => {
    // 250 chars in 60s = 50 words / 1 minute = 50 wpm
    expect(calculateWpm(250, 60)).toBeCloseTo(50);
  });
});

describe("calculateNetWpm", () => {
  it("subtracts an error penalty from wpm", () => {
    // wpm=50, 10 incorrect chars over 1 minute => penalty 10
    expect(calculateNetWpm(50, 10, 60)).toBeCloseTo(40);
  });

  it("never goes negative", () => {
    expect(calculateNetWpm(5, 1000, 60)).toBe(0);
  });

  it("returns 0 for zero duration", () => {
    expect(calculateNetWpm(50, 10, 0)).toBe(0);
  });
});

describe("calculateAccuracy", () => {
  it("handles zero total characters safely", () => {
    expect(calculateAccuracy(0, 0)).toBe(0);
  });

  it("returns 100 for all-correct input", () => {
    expect(calculateAccuracy(100, 100)).toBe(100);
  });

  it("computes partial accuracy rounded to 2 decimals", () => {
    expect(calculateAccuracy(93, 100)).toBe(93);
    expect(calculateAccuracy(1, 3)).toBe(33.33);
  });
});

describe("analyzeCharacters", () => {
  it("marks all-correct characters correctly", () => {
    const result = analyzeCharacters("cat", "cat");
    expect(result.correctCharacters).toBe(3);
    expect(result.incorrectCharacters).toBe(0);
  });

  it("marks incorrect characters", () => {
    const result = analyzeCharacters("cat", "cot");
    expect(result.correctCharacters).toBe(2);
    expect(result.incorrectCharacters).toBe(1);
  });

  it("marks untyped and current characters", () => {
    const result = analyzeCharacters("cats", "ca");
    expect(result.statuses[2].state).toBe("current");
    expect(result.statuses[3].state).toBe("untyped");
  });

  it("accepts space or newline for target newlines in code mode", () => {
    const withSpace = analyzeCharacters("a\nb", "a b");
    expect(withSpace.correctCharacters).toBe(3);
    expect(withSpace.incorrectCharacters).toBe(0);

    const withNewline = analyzeCharacters("a\nb", "a\nb");
    expect(withNewline.correctCharacters).toBe(3);
    expect(withNewline.incorrectCharacters).toBe(0);
  });
});

describe("calculateResult", () => {
  it("handles a zero-character zero-duration test", () => {
    const result = calculateResult({
      totalCharacters: 0,
      correctCharacters: 0,
      incorrectCharacters: 0,
      durationSeconds: 0,
    });
    expect(result.wpm).toBe(0);
    expect(result.netWpm).toBe(0);
    expect(result.accuracy).toBe(0);
  });

  it("computes a full result for a low-accuracy test", () => {
    const result = calculateResult({
      totalCharacters: 100,
      correctCharacters: 60,
      incorrectCharacters: 40,
      durationSeconds: 60,
    });
    expect(result.accuracy).toBe(60);
    expect(result.wpm).toBeCloseTo(20);
    expect(result.netWpm).toBeGreaterThanOrEqual(0);
  });

  it("prevents negative net wpm on a very high error rate", () => {
    const result = calculateResult({
      totalCharacters: 50,
      correctCharacters: 5,
      incorrectCharacters: 45,
      durationSeconds: 10,
    });
    expect(result.netWpm).toBe(0);
  });
});
