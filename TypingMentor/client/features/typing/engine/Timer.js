/**
 * Framework-agnostic countdown/count-up timer. Used by the typing engine so
 * timing logic never lives inside React components.
 */
export class Timer {
  constructor(durationSeconds = null) {
    this.startedAt = null;
    this.intervalId = null;
    // null durationSeconds => count up indefinitely (passage mode)
    this.durationSeconds = durationSeconds;
  }

  start(onTick, onComplete) {
    if (this.startedAt !== null) return;
    this.startedAt = Date.now();

    this.intervalId = setInterval(() => {
      const elapsed = this.getElapsedSeconds();

      if (this.durationSeconds !== null && elapsed >= this.durationSeconds) {
        onTick(this.durationSeconds);
        this.stop();
        onComplete?.();
        return;
      }

      onTick(elapsed);
    }, 250);
  }

  getElapsedSeconds() {
    if (this.startedAt === null) return 0;
    return (Date.now() - this.startedAt) / 1000;
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset() {
    this.stop();
    this.startedAt = null;
  }
}
