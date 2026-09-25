import { analyzeCharacters } from "./CharacterAnalyzer";
import { calculateResult } from "./ResultCalculator";
import { calculateAccuracy } from "./AccuracyCalculator";
import { calculateNetWpm, calculateWpm } from "./WpmCalculator";
import { Timer } from "./Timer";

/**
 * Pure, React-independent typing test engine. Owns the timer, the typed
 * input, and derives live statistics + the final TypingResult.
 */
export class TypingEngine {
  constructor(options) {
    this.mode = options.mode;
    this.targetText = options.targetText;
    this.timedDurationSeconds = options.timedDurationSeconds;
    this.timer = new Timer(this.mode === "timed" ? options.timedDurationSeconds ?? null : null);

    this.typed = "";
    this.started = false;
    this.finished = false;
    this.listeners = [];
    this.finalResult = null;
    this.wpmHistory = [];
    this.lastRecordedSecond = 0;
    this.rawCorrectKeystrokes = 0;
    this.rawIncorrectKeystrokes = 0;
  }

  onChange(listener) {
    this.listeners.push(listener);
    const comparison = analyzeCharacters(this.targetText, this.typed);
    const elapsed = this.started ? this.timer.getElapsedSeconds() : 0;
    const stats = this.computeLiveStats(comparison, elapsed);
    listener({ typed: this.typed, comparison, stats, isFinished: this.finished });
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  emit() {
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

  computeLiveStats(comparison, elapsedSeconds) {
    const totalTyped = comparison.correctCharacters + comparison.incorrectCharacters;
    const wpm = calculateWpm(totalTyped, elapsedSeconds);
    const netWpm = calculateNetWpm(wpm, comparison.incorrectCharacters, elapsedSeconds);
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

  handleInput(value) {
    if (this.finished) return;

    const clamped = value.slice(0, this.targetText.length);

    if (!this.started && clamped.length > 0) {
      this.started = true;
      this.timer.start(
        () => this.emit(),
        () => this.finish()
      );
    }

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

  finish() {
    if (this.finished) return;
    this.finished = true;
    this.timer.stop();

    const comparison = analyzeCharacters(this.targetText, this.typed);
    const totalCharacters = comparison.correctCharacters + comparison.incorrectCharacters;
    const duration =
      this.mode === "timed" ? this.timedDurationSeconds ?? 0 : this.timer.getElapsedSeconds();

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

  getResult() {
    return this.finalResult;
  }

  getWpmHistory() {
    return [...this.wpmHistory];
  }

  isFinished() {
    return this.finished;
  }

  reset() {
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

  destroy() {
    this.timer.stop();
    this.listeners = [];
  }
}
