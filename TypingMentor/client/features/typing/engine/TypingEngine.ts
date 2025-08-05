import { LiveTypingStats, TestMode, TypingResult } from "../types";
import { analyzeCharacters, CharacterComparison } from "./CharacterAnalyzer";
import { calculateResult } from "./ResultCalculator";
import { calculateAccuracy } from "./AccuracyCalculator";
import { calculateNetWpm, calculateWpm } from "./WpmCalculator";
import { Timer } from "./Timer";

export interface TypingEngineOptions {
  mode: TestMode;
  targetText: string;
  /** Required for timed mode; ignored for passage mode. */
  timedDurationSeconds?: number;
}

type StateListener = (state: {
  typed: string;
  comparison: CharacterComparison;
  stats: LiveTypingStats;
  isFinished: boolean;
}) => void;

/**
 * Pure, React-independent typing test engine. Owns the timer, the typed
 * input, and derives live statistics + the final TypingResult.
 */
export class TypingEngine {
  private readonly mode: TestMode;
  private readonly targetText: string;
  private readonly timedDurationSeconds?: number;
  private readonly timer: Timer;

  private typed = "";
  private started = false;
  private finished = false;
  private listeners: StateListener[] = [];
  private finalResult: TypingResult | null = null;
  // One WPM sample recorded every whole second the timer ticks.
  private wpmHistory: number[] = [];
  private lastRecordedSecond = 0;
  // Raw keystroke counters — never decremented on backspace.
  // This is what accuracy is calculated from.
  private rawCorrectKeystrokes = 0;
  private rawIncorrectKeystrokes = 0;

  constructor(options: TypingEngineOptions) {
    this.mode = options.mode;
    this.targetText = options.targetText;
    this.timedDurationSeconds = options.timedDurationSeconds;
    this.timer = new Timer(this.mode === "timed" ? options.timedDurationSeconds ?? null : null);
  }

  onChange(listener: StateListener): () => void {
    this.listeners.push(listener);
    // Immediately notify the new listener of the current state so that
    // React state initialises with a real comparison rather than null.
    const comparison = analyzeCharacters(this.targetText, this.typed);
    const elapsed = this.started ? this.timer.getElapsedSeconds() : 0;
    const stats = this.computeLiveStats(comparison, elapsed);
    listener({ typed: this.typed, comparison, stats, isFinished: this.finished });
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private emit(): void {
    const comparison = analyzeCharacters(this.targetText, this.typed);
    const elapsed = this.started ? this.timer.getElapsedSeconds() : 0;
    const stats = this.computeLiveStats(comparison, elapsed);

    // Record one WPM snapshot per whole elapsed second.
    const wholeSecond = Math.floor(elapsed);
    if (this.started && wholeSecond > this.lastRecordedSecond) {
      for (let s = this.lastRecordedSecond + 1; s <= wholeSecond; s++) {
        this.wpmHistory.push(stats.wpm);
      }
      this.lastRecordedSecond = wholeSecond;
    }

    this.listeners.forEach((listener) =>
      listener({ typed: this.typed, comparison, stats, isFinished: this.finished })
    );
  }

  private computeLiveStats(comparison: CharacterComparison, elapsedSeconds: number): LiveTypingStats {
    const totalTyped = comparison.correctCharacters + comparison.incorrectCharacters;
    const wpm = calculateWpm(totalTyped, elapsedSeconds);
    const netWpm = calculateNetWpm(wpm, comparison.incorrectCharacters, elapsedSeconds);
    // Accuracy uses raw keystroke counts so backspaced mistakes still count.
    const rawTotal = this.rawCorrectKeystrokes + this.rawIncorrectKeystrokes;
    const accuracy = calculateAccuracy(this.rawCorrectKeystrokes, rawTotal);

    return {
      wpm: Math.round(wpm),
      netWpm: Math.round(netWpm),
      accuracy,
      errors: comparison.incorrectCharacters,
      elapsedSeconds: Math.round(elapsedSeconds),
    };
  }

  /** Call on every keystroke/input change from the UI. */
  handleInput(value: string): void {
    if (this.finished) return;

    // Never allow typing past the end of the target text.
    const clamped = value.slice(0, this.targetText.length);

    if (!this.started && clamped.length > 0) {
      this.started = true;
      this.timer.start(
        () => this.emit(),
        () => this.finish()
      );
    }

    // Count raw keystrokes for each newly added character.
    // Deletions (backspace) do NOT decrement the counters — the mistake is permanent.
    if (clamped.length > this.typed.length) {
      for (let i = this.typed.length; i < clamped.length; i++) {
        if (clamped[i] === this.targetText[i]) {
          this.rawCorrectKeystrokes++;
        } else {
          this.rawIncorrectKeystrokes++;
        }
      }
    }

    this.typed = clamped;

    if ((this.mode === "passage" || this.mode === "code") && this.typed.length === this.targetText.length) {
      this.finish();
      return;
    }

    this.emit();
  }

  private finish(): void {
    if (this.finished) return;
    this.finished = true;
    this.timer.stop();

    const comparison = analyzeCharacters(this.targetText, this.typed);
    const totalCharacters = comparison.correctCharacters + comparison.incorrectCharacters;
    const duration =
      this.mode === "timed" ? this.timedDurationSeconds ?? 0 : this.timer.getElapsedSeconds();

    // Use raw keystroke counts for final accuracy.
    const rawTotal = this.rawCorrectKeystrokes + this.rawIncorrectKeystrokes;

    this.finalResult = calculateResult({
      totalCharacters,
      correctCharacters: comparison.correctCharacters,
      incorrectCharacters: comparison.incorrectCharacters,
      rawCorrectKeystrokes: this.rawCorrectKeystrokes,
      rawTotalKeystrokes: rawTotal,
      durationSeconds: duration,
    });

    this.emit();
  }

  getResult(): TypingResult | null {
    return this.finalResult;
  }

  getWpmHistory(): number[] {
    return [...this.wpmHistory];
  }

  isFinished(): boolean {
    return this.finished;
  }

  reset(): void {
    this.timer.reset();
    this.typed = "";
    this.started = false;
    this.finished = false;
    this.finalResult = null;
    this.wpmHistory = [];
    this.lastRecordedSecond = 0;
    this.rawCorrectKeystrokes = 0;
    this.rawIncorrectKeystrokes = 0;
    this.emit();
  }

  destroy(): void {
    this.timer.stop();
    this.listeners = [];
  }
}
