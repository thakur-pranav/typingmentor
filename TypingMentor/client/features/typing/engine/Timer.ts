type TickCallback = (elapsedSeconds: number) => void;
type CompleteCallback = () => void;

/**
 * Framework-agnostic countdown/count-up timer. Used by the typing engine so
 * timing logic never lives inside React components.
 */
export class Timer {
  private startedAt: number | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private readonly durationSeconds: number | null;

  constructor(durationSeconds: number | null = null) {
    // null durationSeconds => count up indefinitely (passage mode)
    this.durationSeconds = durationSeconds;
  }

  start(onTick: TickCallback, onComplete?: CompleteCallback): void {
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

  getElapsedSeconds(): number {
    if (this.startedAt === null) return 0;
    return (Date.now() - this.startedAt) / 1000;
  }

  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset(): void {
    this.stop();
    this.startedAt = null;
  }
}
