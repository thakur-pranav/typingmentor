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
    this.timer = new Timer(options.timedDurationSeconds ? options.timedDurationSeconds : null);

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

    // Normalize input: if user typed a space where target expects a newline, accept it as newline
    let normalized = "";
    for (let i = 0; i < value.length && i < this.targetText.length; i++) {
      if (this.targetText[i] === "\n" && value[i] === " ") {
        normalized += "\n";
      } else {
        normalized += value[i];
      }
    }

    const clamped = normalized;

    if (!this.started && clamped.length > 0) {
      this.started = true;
      this.timer.start(
        () => this.emit(),
        () => this.finish()
      );
    }

    if (clamped.length > this.typed.length) {
      for (let i = this.typed.length; i < clamped.length; i++) {
        const isMatch =
          clamped[i] === this.targetText[i] ||
          (this.targetText[i] === "\n" && clamped[i] === " ");
        if (isMatch) {
          this.rawCorrectKeystrokes++;
        } else {
          this.rawIncorrectKeystrokes++;
        }
      }
    }

    this.typed = clamped;

    if (this.typed.length === this.targetText.length) {
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
    const elapsed = this.timer.getElapsedSeconds();
    const duration =
      this.timedDurationSeconds && elapsed >= this.timedDurationSeconds
        ? this.timedDurationSeconds
        : Math.max(1, Math.round(elapsed * 100) / 100);

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
