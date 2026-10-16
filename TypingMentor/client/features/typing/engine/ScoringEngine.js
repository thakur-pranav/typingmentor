/**
 * TypingMentor Scoring Engine — Pure, UI-independent typing test calculations.
 * 
 * Implements:
 * - Core WPM (correct words only) and Raw WPM (gross characters)
 * - CPM (Chars Per Minute) and KPH (Keystrokes Per Hour)
 * - 4-way character & word classification (correct, incorrect, extra, missed)
 * - Accuracy (correct / (correct + incorrect + extra) * 100)
 * - Net WPM (4 selectable methods: correct_words, subtract_errors, subtract_uncorrected, multiply_accuracy)
 * - Per-second raw samples and mathematical Consistency (0-100) via population stdDev and tanh
 * - Alternative standards: 10FastFingers, TypeRacer, Typing.com, Type to Learn, eSkill, Hiring Normalization
 * - Zero-division, NaN, and Infinity protections across all formulas
 */

export const CHARS_PER_WORD = 5;

export const NET_WPM_METHODS = {
  CORRECT_WORDS: "correct_words",           // Default: characters in correct words only
  SUBTRACT_ERRORS: "subtract_errors",       // gross - (errors / minutes)
  SUBTRACT_UNCORRECTED: "subtract_uncorrected", // gross - (uncorrected_errors / minutes)
  MULTIPLY_ACCURACY: "multiply_accuracy",   // gross * (accuracy / 100)
};

/**
 * Rounds a numeric value to a specified number of decimal places for display.
 * Internal calculations remain unrounded.
 */
export function roundForDisplay(value, decimals = 2) {
  if (typeof value !== "number" || isNaN(value) || !isFinite(value)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/* ─────────────────────────────────────────────────────────────────────────
 * 1. Character & Word Classification
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Classifies typed text against target text into character states and word validity.
 *
 * States per character:
 * - 'correct': character matches target.
 * - 'incorrect': typed character differs from target, or space closing a word with errors.
 * - 'extra': typed beyond the word's target boundary.
 * - 'missed': target characters skipped because space was pressed early.
 * - 'current': cursor position (first untyped character).
 * - 'untyped': character not yet reached by typist.
 *
 * @param {string} target - Target prompt text.
 * @param {string} typed - What the user has typed so far.
 * @param {Object} [options]
 * @param {boolean} [options.includePartialPrefix=false] - Whether to count a mid-word prefix at test end if 100% correct.
 */
export function classifyCharactersAndWords(target = "", typed = "", options = {}) {
  const { includePartialPrefix = false } = options;

  let correctCharacters = 0;
  let incorrectCharacters = 0;
  let extraCharacters = 0;
  let missedCharacters = 0;
  let correctWordCharacters = 0;

  const statuses = [];

  // Break target into word tokens (word characters + trailing delimiter like ' ' or '\n')
  const targetWords = [];
  let currentWordChars = [];

  for (let i = 0; i < target.length; i++) {
    const ch = target[i];
    currentWordChars.push({ char: ch, index: i });
    if (ch === " " || ch === "\n" || i === target.length - 1) {
      targetWords.push(currentWordChars);
      currentWordChars = [];
    }
  }

  // Break typed text into corresponding word tokens
  const typedWords = [];
  let currentTyped = [];

  for (let i = 0; i < typed.length; i++) {
    const ch = typed[i];
    currentTyped.push(ch);
    if (ch === " " || ch === "\n" || i === typed.length - 1) {
      typedWords.push(currentTyped.join(""));
      currentTyped = [];
    }
  }

  // Track each character's status and count errors
  for (let i = 0; i < target.length; i++) {
    if (i < typed.length) {
      const targetChar = target[i];
      const typedChar = typed[i];

      // Code mode accepts space or newline interchangeably for target newlines
      const isMatch =
        typedChar === targetChar ||
        (targetChar === "\n" && (typedChar === " " || typedChar === "\n"));

      if (isMatch) {
        // Special case: if this is a space closing a word that had preceding typos,
        // standard typing convention marks the delimiter space incorrect.
        // Look back at the word to see if there were typos.
        let spaceFollowsTypo = false;
        if (targetChar === " " || targetChar === "\n") {
          // Find start of current word
          let startOfWord = i - 1;
          while (startOfWord >= 0 && target[startOfWord] !== " " && target[startOfWord] !== "\n") {
            startOfWord--;
          }
          startOfWord++;
          for (let k = startOfWord; k < i; k++) {
            if (k < typed.length && typed[k] !== target[k]) {
              spaceFollowsTypo = true;
              break;
            }
          }
        }

        if (spaceFollowsTypo) {
          incorrectCharacters++;
          statuses.push({ char: targetChar, state: "incorrect" });
        } else {
          correctCharacters++;
          statuses.push({ char: targetChar, state: "correct" });
        }
      } else {
        incorrectCharacters++;
        statuses.push({ char: targetChar, state: "incorrect" });
      }
    } else if (i === typed.length) {
      statuses.push({ char: target[i], state: "current" });
    } else {
      statuses.push({ char: target[i], state: "untyped" });
    }
  }

  // Account for extra characters typed beyond target length
  if (typed.length > target.length) {
    extraCharacters += (typed.length - target.length);
  }

  // Evaluate word-level correctness for Core WPM
  // A word is correct only if every character in it matches with 0 errors, 0 extra, 0 missed.
  let targetCharIdx = 0;
  for (let w = 0; w < targetWords.length; w++) {
    const tWordObj = targetWords[w];
    const tWordStr = tWordObj.map((o) => o.char).join("");
    const tWordLen = tWordStr.length;
    const isLastTargetWord = w === targetWords.length - 1;

    // Has user typed into this word?
    if (targetCharIdx < typed.length) {
      const typedSlice = typed.slice(targetCharIdx, targetCharIdx + tWordLen);
      const isWordFullyTyped = typed.length >= targetCharIdx + tWordLen;

      if (isWordFullyTyped) {
        // Compare full word including delimiter
        let wordMatches = true;
        for (let c = 0; c < tWordLen; c++) {
          const tc = tWordStr[c];
          const yc = typedSlice[c];
          const match = yc === tc || (tc === "\n" && (yc === " " || yc === "\n"));
          if (!match) {
            wordMatches = false;
            break;
          }
        }

        if (wordMatches) {
          correctWordCharacters += tWordLen;
        }
      } else {
        // Mid-word: test ended before completing this word
        if (includePartialPrefix) {
          let prefixMatches = true;
          for (let c = 0; c < typedSlice.length; c++) {
            const tc = tWordStr[c];
            const yc = typedSlice[c];
            const match = yc === tc || (tc === "\n" && (yc === " " || yc === "\n"));
            if (!match) {
              prefixMatches = false;
              break;
            }
          }
          if (prefixMatches && typedSlice.length > 0) {
            correctWordCharacters += typedSlice.length;
          }
        }
      }
    }

    targetCharIdx += tWordLen;
  }

  return {
    correctCharacters,
    incorrectCharacters,
    extraCharacters,
    missedCharacters,
    correctWordCharacters,
    totalCharacters: typed.length,
    statuses,
  };
}

/* ─────────────────────────────────────────────────────────────────────────
 * 2. WPM, Raw WPM, CPM, KPH Calculations
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Calculates Core WPM: (characters in correctly typed words) / 5 / minutes.
 * A word with even one wrong character contributes 0 to WPM.
 *
 * @param {number} correctWordCharacters - Count of characters in 100% correct words.
 * @param {number} durationSeconds - Elapsed test time in seconds.
 * @returns {number} Unrounded WPM.
 */
export function calculateWpm(correctWordCharacters, durationSeconds) {
  if (!durationSeconds || durationSeconds <= 0) return 0;
  if (!correctWordCharacters || correctWordCharacters <= 0) return 0;
  const minutes = durationSeconds / 60;
  const words = correctWordCharacters / CHARS_PER_WORD;
  return words / minutes;
}

/**
 * Calculates Raw (Gross) WPM: (all typed characters / 5) / minutes.
 * Includes incorrect words.
 *
 * @param {number} totalTypedCharacters - Total typed characters including incorrect.
 * @param {number} durationSeconds - Elapsed test time in seconds.
 * @returns {number} Unrounded Raw WPM.
 */
export function calculateRawWpm(totalTypedCharacters, durationSeconds) {
  if (!durationSeconds || durationSeconds <= 0) return 0;
  if (!totalTypedCharacters || totalTypedCharacters <= 0) return 0;
  const minutes = durationSeconds / 60;
  const words = totalTypedCharacters / CHARS_PER_WORD;
  return words / minutes;
}

/**
 * Calculates CPM (Characters Per Minute): WPM * 5.
 */
export function calculateCpm(wpm) {
  if (!wpm || wpm <= 0) return 0;
  return wpm * CHARS_PER_WORD;
}

/**
 * Calculates KPH (Keystrokes Per Hour): WPM * 300.
 */
export function calculateKph(wpm) {
  if (!wpm || wpm <= 0) return 0;
  return wpm * 300;
}

/**
 * Calculates WPM from CPM: CPM / 5.
 */
export function cpmToWpm(cpm) {
  if (!cpm || cpm <= 0) return 0;
  return cpm / CHARS_PER_WORD;
}

/* ─────────────────────────────────────────────────────────────────────────
 * 3. Accuracy Calculation
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Calculates Accuracy percentage: correct / (correct + incorrect + extra) * 100.
 * Excludes missed characters from the denominator.
 * Supports flexible signatures for backward compatibility.
 *
 * @param {number|Object} correctOrInput - Correct characters or an object { correct, incorrect, extra }.
 * @param {number} [incorrectOrTotal] - Incorrect characters (or total characters in legacy calls).
 * @param {number} [extra=0] - Extra characters typed past word ends.
 * @returns {number} Unrounded accuracy percentage (0 - 100).
 */
export function calculateAccuracy(correctOrInput, totalOrIncorrect, extra = 0) {
  if (typeof correctOrInput === "object" && correctOrInput !== null) {
    const correct = Number(correctOrInput.correct ?? correctOrInput.correctCharacters ?? 0);
    const incorrect = Number(correctOrInput.incorrect ?? correctOrInput.incorrectCharacters ?? 0);
    const extraChars = Number(correctOrInput.extra ?? correctOrInput.extraCharacters ?? 0);
    const denominator = correct + incorrect + extraChars;
    if (denominator <= 0 || correct <= 0) return 0;
    return Math.min(100, Math.max(0, (correct / denominator) * 100));
  }

  const first = Number(correctOrInput) || 0;
  const second = Number(totalOrIncorrect) || 0;
  const third = Number(extra) || 0;

  if (first <= 0) return 0;

  // If 3 arguments provided (third > 0) or second < first (e.g. 300 correct, 5 errors):
  // second is treated as incorrect characters
  if (third > 0 || (second < first && second >= 0)) {
    const denominator = first + second + third;
    if (denominator <= 0) return 0;
    return Math.min(100, Math.max(0, (first / denominator) * 100));
  }

  // Otherwise second is total characters (e.g. 100 correct out of 100 total, 93 out of 100 total)
  if (second <= 0) return 0;
  return Math.min(100, Math.max(0, (first / second) * 100));
}

/* ─────────────────────────────────────────────────────────────────────────
 * 4. Net WPM Options
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Calculates Net WPM across 4 selectable methods.
 * Also supports legacy signature: calculateNetWpm(grossWpm, incorrectCharacters, durationSeconds)
 *
 * Method 1: "correct_words" -> Core WPM (correct words only).
 * Method 2: "subtract_errors" -> gross - (errors / minutes), clamped at 0.
 * Method 3: "subtract_uncorrected" -> gross - (uncorrectedErrors / minutes), clamped at 0.
 * Method 4: "multiply_accuracy" -> gross * (accuracy / 100).
 *
 * @param {number|Object} inputOrGross - Gross WPM or configuration object.
 * @param {number} [legacyErrors] - Incorrect characters (legacy).
 * @param {number} [legacyDurationSeconds] - Duration in seconds (legacy).
 * @returns {number} Unrounded Net WPM.
 */
export function calculateNetWpm(inputOrGross, legacyErrors, legacyDurationSeconds) {
  // Handle legacy signature: calculateNetWpm(wpm, incorrectCharacters, durationSeconds)
  if (typeof inputOrGross === "number" && arguments.length >= 2) {
    const gross = inputOrGross;
    const errors = Number(legacyErrors) || 0;
    const duration = Number(legacyDurationSeconds) || 0;
    if (duration <= 0) return 0;
    const minutes = duration / 60;
    return Math.max(0, gross - errors / minutes);
  }

  const config = typeof inputOrGross === "object" && inputOrGross !== null ? inputOrGross : {};
  const {
    grossWpm = 0,
    coreWpm = 0,
    errors = 0,
    uncorrectedErrors = 0,
    accuracy = 100,
    durationSeconds = 0,
    method = NET_WPM_METHODS.CORRECT_WORDS,
  } = config;

  if (durationSeconds <= 0 && method !== NET_WPM_METHODS.MULTIPLY_ACCURACY) return 0;
  const minutes = durationSeconds > 0 ? durationSeconds / 60 : 1;

  switch (method) {
    case NET_WPM_METHODS.CORRECT_WORDS:
      return Math.max(0, coreWpm);

    case NET_WPM_METHODS.SUBTRACT_ERRORS: {
      const penalty = errors / minutes;
      return Math.max(0, grossWpm - penalty);
    }

    case NET_WPM_METHODS.SUBTRACT_UNCORRECTED: {
      const penalty = uncorrectedErrors / minutes;
      return Math.max(0, grossWpm - penalty);
    }

    case NET_WPM_METHODS.MULTIPLY_ACCURACY: {
      const accFactor = accuracy <= 1 ? accuracy : accuracy / 100;
      return Math.max(0, grossWpm * accFactor);
    }

    default:
      return Math.max(0, coreWpm);
  }
}

/* ─────────────────────────────────────────────────────────────────────────
 * 5. Per-Second Raw Samples & Consistency
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Calculates raw WPM for a single 1-second burst:
 * (characters typed during that second) * 60 / 5 = characters * 12.
 *
 * @param {number} charactersInSecond - Characters typed during the 1-second window.
 * @returns {number} Raw WPM burst.
 */
export function calculatePerSecondRaw(charactersInSecond) {
  if (!charactersInSecond || charactersInSecond <= 0) return 0;
  return (charactersInSecond / CHARS_PER_WORD) * 60;
}

/**
 * Computes Consistency percentage (0-100) from an array of per-second raw WPM samples.
 *
 * Formula:
 * cov = populationStdDev(rawSamples) / mean(rawSamples) (divide by n)
 * z = cov + cov^3/3 + cov^5/5
 * consistency = 100 * (1 - tanh(z))
 *
 * - Constant samples give 100.
 * - If mean is 0 or array is empty, return 0.
 * - Clamped strictly to 0-100.
 *
 * @param {number[]} rawSamples - Array of per-second raw WPM values.
 * @returns {number} Unrounded consistency (0 - 100).
 */
export function calculateConsistency(rawSamples = []) {
  if (!Array.isArray(rawSamples) || rawSamples.length === 0) return 0;

  const n = rawSamples.length;
  const mean = rawSamples.reduce((sum, v) => sum + v, 0) / n;
  if (mean === 0) return 0;

  // Population variance (divide by n, not n - 1)
  const variance = rawSamples.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);

  // Coefficient of variation
  const cov = stdDev / mean;

  // Hyperbolic tangent polynomial expansion
  const cov3 = Math.pow(cov, 3);
  const cov5 = Math.pow(cov, 5);
  const z = cov + cov3 / 3 + cov5 / 5;

  const consistency = 100 * (1 - Math.tanh(z));
  return Math.min(100, Math.max(0, consistency));
}

/* ─────────────────────────────────────────────────────────────────────────
 * 6. Alternative Grading Standards
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * 10FastFingers standard:
 * - WPM = keystrokes of all correct words including spaces, per minute, / 5.
 * - Raw WPM = all words, right or wrong, same method.
 * - A lowercase letter is 1 keystroke and a capital is 2 (Shift + key).
 * - Ranking points = correct keystrokes x accuracy.
 */
export function count10FastFingersKeystrokes(text = "") {
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    // Uppercase requires Shift key (2 keystrokes)
    if (ch >= "A" && ch <= "Z") {
      count += 2;
    } else {
      count += 1;
    }
  }
  return count;
}

export function calculate10FastFingers({ correctKeystrokes = 0, allKeystrokes = 0, durationSeconds = 60, accuracy = 100 }) {
  if (durationSeconds <= 0) {
    return { wpm: 0, rawWpm: 0, rankingPoints: 0 };
  }
  const minutes = durationSeconds / 60;
  const wpm = (correctKeystrokes / CHARS_PER_WORD) / minutes;
  const rawWpm = (allKeystrokes / CHARS_PER_WORD) / minutes;
  const accFactor = accuracy <= 1 ? accuracy : accuracy / 100;
  const rankingPoints = correctKeystrokes * accFactor;
  return { wpm, rawWpm, rankingPoints };
}

/**
 * TypeRacer standard:
 * - Start WPM = 12000 / milliseconds from green light to first key (200 ms = 60 WPM).
 * - Character count: 5 per word.
 */
export function calculateTypeRacerStartWpm(msFromGreenLightToFirstKey) {
  if (!msFromGreenLightToFirstKey || msFromGreenLightToFirstKey <= 0) return 0;
  return 12000 / msFromGreenLightToFirstKey;
}

/**
 * Typing.com standard:
 * - Gross WPM = characters / 5 / minutes.
 * - Accuracy = correct entries / total entries x 100.
 */
export function calculateTypingCom({ totalEntries = 0, correctEntries = 0, durationSeconds = 60 }) {
  if (durationSeconds <= 0) return { grossWpm: 0, accuracy: 0 };
  const minutes = durationSeconds / 60;
  const grossWpm = (totalEntries / CHARS_PER_WORD) / minutes;
  const accuracy = totalEntries > 0 ? (correctEntries / totalEntries) * 100 : 0;
  return { grossWpm, accuracy };
}

/**
 * Type to Learn standard:
 * - words = total keys pressed / 5, excluding Shift, Backspace, function keys.
 * - WPM = floor(words / minutes).
 */
export function calculateTypeToLearn({ totalKeysPressed = 0, durationSeconds = 60 }) {
  if (durationSeconds <= 0) return { words: 0, wpm: 0 };
  const words = totalKeysPressed / CHARS_PER_WORD;
  const minutes = durationSeconds / 60;
  const wpm = Math.floor(words / minutes);
  return { words, wpm };
}

/**
 * eSkill-style standard:
 * - gross = totalWordsTyped / minutes.
 * - wordAccuracy = correctWordsTyped / totalWordsTyped.
 * - net = gross x wordAccuracy. Words never typed because time ran out are not errors.
 */
export function calculateESkill({ totalWordsTyped = 0, correctWordsTyped = 0, durationSeconds = 60 }) {
  if (durationSeconds <= 0 || totalWordsTyped <= 0) return { gross: 0, wordAccuracy: 0, net: 0 };
  const minutes = durationSeconds / 60;
  const gross = totalWordsTyped / minutes;
  const wordAccuracy = correctWordsTyped / totalWordsTyped;
  const net = gross * wordAccuracy;
  return { gross, wordAccuracy, net };
}

/**
 * Error function approximation (Abramowitz & Stegun 7.1.26) for Normal CDF calculation.
 */
function erf(x) {
  const sign = x >= 0 ? 1 : -1;
  const a = Math.abs(x);
  const p = 0.3275911;
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;

  const t = 1.0 / (1.0 + p * a);
  const y = 1.0 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-a * a);
  return sign * y;
}

/**
 * Hiring-test normalization:
 * Produces a percentile score (0-100) from Net WPM using Gaussian distribution.
 * Default mean = 38 WPM, standard deviation = 17 WPM (configurable).
 */
export function calculateHiringNorm(netWpm, mean = 38, stdDev = 17) {
  if (typeof netWpm !== "number" || isNaN(netWpm)) return 0;
  if (stdDev <= 0) return netWpm >= mean ? 100 : 0;

  const z = (netWpm - mean) / stdDev;
  // Cumulative distribution function of standard normal
  const cdf = 0.5 * (1 + erf(z / Math.SQRT2));
  return Math.min(100, Math.max(0, cdf * 100));
}

/* ─────────────────────────────────────────────────────────────────────────
 * 7. Unified Result Aggregator
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Computes full typing result object.
 * Preserves existing field names (wpm, netWpm, accuracy, duration, totalCharacters,
 * correctCharacters, incorrectCharacters) so callers and backend validation schemas
 * never break, while adding consistency, rawWpm, cpm, kph, and raw unrounded metrics.
 */
export function calculateResult(input = {}) {
  const {
    totalCharacters = 0,
    correctCharacters = 0,
    incorrectCharacters = 0,
    correctWordCharacters,
    extraCharacters = 0,
    missedCharacters = 0,
    rawCorrectKeystrokes,
    rawTotalKeystrokes,
    durationSeconds = 0,
    rawSamples = [],
    netWpmMethod = NET_WPM_METHODS.SUBTRACT_ERRORS,
    uncorrectedErrors,
  } = input;

  const duration = Math.max(0, durationSeconds);

  // If correctWordCharacters was not provided, fallback to correctCharacters
  const wordChars =
    correctWordCharacters !== undefined ? correctWordCharacters : correctCharacters;

  // Raw / Gross WPM: counts all keystrokes typed (Section 1: "raw WPM counts every keystroke")
  const totalKeystrokes =
    rawTotalKeystrokes !== undefined && rawTotalKeystrokes > 0
      ? rawTotalKeystrokes
      : (totalCharacters + extraCharacters);

  const rawWpm = calculateRawWpm(totalKeystrokes, duration);

  // Core WPM (characters in correct words only)
  const coreWpm = calculateWpm(wordChars, duration);

  // Accuracy
  const rawCorrect = rawCorrectKeystrokes !== undefined ? rawCorrectKeystrokes : correctCharacters;
  const rawTotal = rawTotalKeystrokes !== undefined ? rawTotalKeystrokes : (totalCharacters + extraCharacters);
  const accuracy = calculateAccuracy(rawCorrect, rawTotal);

  // Errors made during the test (including backspaced mistakes)
  const totalErrors =
    rawTotalKeystrokes !== undefined && rawCorrectKeystrokes !== undefined
      ? Math.max(0, rawTotalKeystrokes - rawCorrectKeystrokes)
      : incorrectCharacters;

  // Net WPM
  const netWpm = calculateNetWpm({
    grossWpm: rawWpm,
    coreWpm,
    errors: totalErrors,
    uncorrectedErrors: uncorrectedErrors !== undefined ? uncorrectedErrors : incorrectCharacters,
    accuracy,
    durationSeconds: duration,
    method: netWpmMethod,
  });

  // Consistency
  const consistency = calculateConsistency(rawSamples);

  // Speed Conversions
  const cpm = calculateCpm(coreWpm);
  const kph = calculateKph(coreWpm);

  return {
    wpm: roundForDisplay(coreWpm),
    rawWpm: roundForDisplay(rawWpm),
    netWpm: roundForDisplay(netWpm),
    accuracy: roundForDisplay(accuracy),
    consistency: roundForDisplay(consistency),
    cpm: roundForDisplay(cpm),
    kph: roundForDisplay(kph),
    totalCharacters,
    correctCharacters,
    incorrectCharacters,
    extraCharacters,
    missedCharacters,
    duration,
    // Raw unrounded values for internal computations
    raw: {
      wpm: coreWpm,
      rawWpm,
      netWpm,
      accuracy,
      consistency,
      cpm,
      kph,
    },
  };
}
