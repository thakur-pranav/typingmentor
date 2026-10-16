import { describe, it, expect } from "vitest";
import {
  CHARS_PER_WORD,
  NET_WPM_METHODS,
  calculateWpm,
  calculateRawWpm,
  calculateCpm,
  calculateKph,
  cpmToWpm,
  calculateAccuracy,
  calculateNetWpm,
  calculatePerSecondRaw,
  calculateConsistency,
  classifyCharactersAndWords,
  calculateResult,
  calculate10FastFingers,
  count10FastFingersKeystrokes,
  calculateTypeRacerStartWpm,
  calculateTypingCom,
  calculateTypeToLearn,
  calculateESkill,
  calculateHiringNorm,
  roundForDisplay,
} from "../ScoringEngine";

describe("Section 9 Worked Examples & Scoring Formulas", () => {
  // 1. 300 correct characters in 60 s = 60 WPM; 275 in 60 s = 55; 300 in 2 min = 30.
  it("computes core WPM for standard duration/character benchmarks", () => {
    expect(calculateWpm(300, 60)).toBeCloseTo(60);
    expect(calculateWpm(275, 60)).toBeCloseTo(55);
    expect(calculateWpm(300, 120)).toBeCloseTo(30);
  });

  // 2. "Hello world. It is a nice day." (30 characters): 60 s = 6 WPM; 30 s = 12 WPM.
  it("computes WPM for sentence benchmark (30 characters)", () => {
    const text = "Hello world. It is a nice day.";
    expect(text.length).toBe(30);
    expect(calculateWpm(text.length, 60)).toBeCloseTo(6);
    expect(calculateWpm(text.length, 30)).toBeCloseTo(12);
  });

  // 3. 300 characters, 5 errors, 60 s: raw 60, net (subtract per error) 55, accuracy 300/305 = about 98.4%.
  it("computes raw WPM, subtract-per-error Net WPM, and accuracy (300 chars, 5 errors, 60s)", () => {
    const raw = calculateRawWpm(300, 60);
    expect(raw).toBeCloseTo(60);

    const net = calculateNetWpm({
      grossWpm: raw,
      errors: 5,
      durationSeconds: 60,
      method: NET_WPM_METHODS.SUBTRACT_ERRORS,
    });
    expect(net).toBeCloseTo(55);

    const accuracy = calculateAccuracy(300, 5); // 300 correct, 5 errors => 300/305
    expect(roundForDisplay(accuracy, 1)).toBeCloseTo(98.4, 1);
  });

  // 4. 250 characters, 4 uncorrected errors, 60 s: gross 50, net 46, accuracy 98.4%.
  it("computes gross 50, net 46, accuracy 98.4% (250 chars, 4 uncorrected errors, 60s)", () => {
    const gross = calculateRawWpm(250, 60);
    expect(gross).toBeCloseTo(50);

    const net = calculateNetWpm({
      grossWpm: gross,
      uncorrectedErrors: 4,
      durationSeconds: 60,
      method: NET_WPM_METHODS.SUBTRACT_UNCORRECTED,
    });
    expect(net).toBeCloseTo(46);

    const accuracy = calculateAccuracy(250, 4); // 250/254
    expect(roundForDisplay(accuracy, 1)).toBeCloseTo(98.4, 1);
  });

  // 5. 250 words, 5 min, 2 errors: gross 50, net 49.6.
  it("computes gross 50, net 49.6 (250 words, 5 min, 2 errors)", () => {
    const totalChars = 250 * CHARS_PER_WORD; // 1250 chars
    const gross = calculateRawWpm(totalChars, 5 * 60);
    expect(gross).toBeCloseTo(50);

    const net = calculateNetWpm({
      grossWpm: gross,
      errors: 2,
      durationSeconds: 5 * 60,
      method: NET_WPM_METHODS.SUBTRACT_ERRORS,
    });
    expect(net).toBeCloseTo(49.6);
  });

  // 6. 600 characters in 3 min, 10 errors: gross 40, net about 36.67 (via words minus errors).
  it("computes gross 40, net ~36.67 (600 characters in 3 min, 10 errors)", () => {
    const gross = calculateRawWpm(600, 3 * 60);
    expect(gross).toBeCloseTo(40);

    const net = calculateNetWpm({
      grossWpm: gross,
      errors: 10,
      durationSeconds: 3 * 60,
      method: NET_WPM_METHODS.SUBTRACT_ERRORS,
    });
    expect(roundForDisplay(net, 2)).toBeCloseTo(36.67, 1);
  });

  // 7. 300 characters, 16 errors: accuracy 284/300 = 95%.
  it("computes accuracy 284/300 = 95% (300 total characters, 16 errors)", () => {
    const correct = 300 - 16; // 284
    const accuracy = calculateAccuracy(correct, 300); // legacy total format
    expect(roundForDisplay(accuracy, 0)).toBe(95);
  });

  // 8. gross 30, accuracy 90%: net (multiply method) = 27.
  it("computes net = 27 via multiply method (gross 30, accuracy 90%)", () => {
    const net = calculateNetWpm({
      grossWpm: 30,
      accuracy: 90,
      method: NET_WPM_METHODS.MULTIPLY_ACCURACY,
    });
    expect(net).toBeCloseTo(27);
  });

  // 9. TypeRacer start: 200 ms = 60 WPM.
  it("computes TypeRacer start WPM: 200 ms = 60 WPM", () => {
    expect(calculateTypeRacerStartWpm(200)).toBeCloseTo(60);
  });

  // 10. 200 keys in 1.5 min: 26 WPM (floor). 190 of 200 correct = 95%.
  it("computes Type to Learn: 200 keys in 1.5 min = 26 WPM (floor), 95% accuracy", () => {
    const ttl = calculateTypeToLearn({ totalKeysPressed: 200, durationSeconds: 1.5 * 60 });
    expect(ttl.wpm).toBe(26);

    const acc = calculateAccuracy(190, 200);
    expect(acc).toBe(95);
  });

  // 11. 60 WPM = 300 CPM = 18,000 KPH; 200 CPM = 40 WPM.
  it("converts between WPM, CPM, and KPH accurately", () => {
    expect(calculateCpm(60)).toBe(300);
    expect(calculateKph(60)).toBe(18000);
    expect(cpmToWpm(200)).toBe(40);
  });

  // 12. Word rule: a word with one typo adds 0 to WPM but its full length to raw WPM.
  // "helxx " vs "hello ": 3 correct, 3 incorrect. "hello\n" vs "hello\n": 6 correct.
  it("applies the word rule: a word with one typo adds 0 to WPM, full length to raw WPM", () => {
    const typoWord = classifyCharactersAndWords("hello ", "helxx ");
    expect(typoWord.correctCharacters).toBe(3);
    expect(typoWord.incorrectCharacters).toBe(3);
    expect(typoWord.correctWordCharacters).toBe(0); // Word has typo => 0 correct word chars
    expect(typoWord.totalCharacters).toBe(6);

    // Contributes 0 to core WPM, but full length to raw WPM
    expect(calculateWpm(typoWord.correctWordCharacters, 60)).toBe(0);
    expect(calculateRawWpm(typoWord.totalCharacters, 60)).toBeCloseTo(1.2);

    const newlineWord = classifyCharactersAndWords("hello\n", "hello\n");
    expect(newlineWord.correctCharacters).toBe(6);
    expect(newlineWord.incorrectCharacters).toBe(0);
    expect(newlineWord.correctWordCharacters).toBe(6);
    expect(calculateWpm(newlineWord.correctWordCharacters, 60)).toBeCloseTo(1.2);
  });

  // 13. Consistency: constant samples = 100; more variance = lower; mean 0 returns 0, never NaN; always within 0-100.
  it("computes consistency correctly across constant, variable, and zero samples", () => {
    // Constant samples => 100
    expect(calculateConsistency([50, 50, 50, 50])).toBeCloseTo(100);

    // Variance => lower than 100
    const highVar = calculateConsistency([20, 80, 10, 90]);
    const lowVar = calculateConsistency([48, 52, 49, 51]);
    expect(lowVar).toBeGreaterThan(highVar);
    expect(lowVar).toBeLessThanOrEqual(100);
    expect(highVar).toBeGreaterThanOrEqual(0);

    // Mean 0 or empty => returns 0, never NaN
    expect(calculateConsistency([])).toBe(0);
    expect(calculateConsistency([0, 0, 0])).toBe(0);
    expect(isNaN(calculateConsistency([0]))).toBe(false);
  });

  // 14. Elapsed 0 returns 0 for every metric.
  it("returns 0 for every metric when elapsed time is 0", () => {
    expect(calculateWpm(300, 0)).toBe(0);
    expect(calculateRawWpm(300, 0)).toBe(0);
    expect(calculateNetWpm({ grossWpm: 60, coreWpm: 60, durationSeconds: 0 })).toBe(0);
    expect(calculateCpm(0)).toBe(0);
    expect(calculateKph(0)).toBe(0);
  });
});

describe("Edge Cases & Alternative Standards", () => {
  it("handles mid-word test completion with includePartialPrefix flag", () => {
    const target = "hello world";
    const typed = "hello wor";

    // Default flag: includePartialPrefix = false
    const defaultRes = classifyCharactersAndWords(target, typed, { includePartialPrefix: false });
    expect(defaultRes.correctWordCharacters).toBe(6); // Only "hello " counts

    // Enabled flag: includePartialPrefix = true
    const prefixRes = classifyCharactersAndWords(target, typed, { includePartialPrefix: true });
    expect(prefixRes.correctWordCharacters).toBe(9); // "hello " (6) + "wor" (3)

    // If prefix had a typo, it does not count even when flag is true
    const badPrefix = classifyCharactersAndWords(target, "hello wox", { includePartialPrefix: true });
    expect(badPrefix.correctWordCharacters).toBe(6);
  });

  it("handles 10FastFingers uppercase keystroke counts and ranking points", () => {
    // "Hello" has 1 capital (2 strokes) + 4 lowercase (4 strokes) = 6 strokes
    expect(count10FastFingersKeystrokes("Hello")).toBe(6);
    expect(count10FastFingersKeystrokes("hello")).toBe(5);

    const ff = calculate10FastFingers({
      correctKeystrokes: 300,
      allKeystrokes: 320,
      durationSeconds: 60,
      accuracy: 95,
    });
    expect(ff.wpm).toBe(60);
    expect(ff.rawWpm).toBe(64);
    expect(ff.rankingPoints).toBeCloseTo(300 * 0.95);
  });

  it("handles Typing.com and eSkill calculators", () => {
    const tcom = calculateTypingCom({ totalEntries: 250, correctEntries: 240, durationSeconds: 60 });
    expect(tcom.grossWpm).toBe(50);
    expect(tcom.accuracy).toBe(96);

    const eskill = calculateESkill({ totalWordsTyped: 50, correctWordsTyped: 45, durationSeconds: 60 });
    expect(eskill.gross).toBe(50);
    expect(eskill.wordAccuracy).toBe(0.9);
    expect(eskill.net).toBe(45);
  });

  it("computes Hiring-test normalization z-score properly", () => {
    // Exactly at mean (38) => 50th percentile
    expect(calculateHiringNorm(38, 38, 17)).toBeCloseTo(50, 0);

    // Far above mean => high percentile
    expect(calculateHiringNorm(80, 38, 17)).toBeGreaterThan(99);

    // Far below mean => low percentile
    expect(calculateHiringNorm(10, 38, 17)).toBeLessThan(10);
  });

  it("prevents Net WPM from going negative when error penalty is extreme", () => {
    const net = calculateNetWpm({
      grossWpm: 20,
      errors: 100,
      durationSeconds: 60,
      method: NET_WPM_METHODS.SUBTRACT_ERRORS,
    });
    expect(net).toBe(0);
  });

  it("computes complete calculateResult with all metrics and raw unrounded values", () => {
    const res = calculateResult({
      totalCharacters: 250,
      correctCharacters: 240,
      incorrectCharacters: 10,
      correctWordCharacters: 230,
      durationSeconds: 60,
      rawSamples: [48, 50, 52, 50],
      netWpmMethod: NET_WPM_METHODS.CORRECT_WORDS,
    });

    expect(res.wpm).toBe(46); // 230 / 5
    expect(res.rawWpm).toBe(50); // 250 / 5
    expect(res.netWpm).toBe(46);
    expect(res.accuracy).toBe(96);
    expect(res.consistency).toBeGreaterThan(90);
    expect(res.cpm).toBe(230);
    expect(res.kph).toBe(13800);
    expect(res.raw).toBeDefined();
    expect(typeof res.raw.wpm).toBe("number");
  });

  it("calculates Raw WPM from all keystrokes typed even when typos are backspaced and corrected", () => {
    // Typist typed 151 total keystrokes in 30s (145 correct final chars + 6 backspaced typos)
    const res = calculateResult({
      totalCharacters: 145,
      correctCharacters: 145,
      incorrectCharacters: 0,
      correctWordCharacters: 145,
      rawCorrectKeystrokes: 145,
      rawTotalKeystrokes: 151,
      durationSeconds: 30,
      netWpmMethod: NET_WPM_METHODS.CORRECT_WORDS,
    });

    expect(res.wpm).toBe(58); // 145 / 5 / 0.5 = 58
    expect(res.netWpm).toBe(58); // clean words speed
    expect(res.rawWpm).toBe(60.4); // 151 / 5 / 0.5 = 60.4
    expect(res.accuracy).toBe(96.03); // 145 / 151 * 100
  });
});
