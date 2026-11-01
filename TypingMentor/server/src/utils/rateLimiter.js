/**
 * In-Memory Sliding Window & Cooldown Rate Limiter
 *
 * Provides sub-millisecond, O(1) in-RAM rate limiting and cooldown enforcement,
 * eliminating expensive disk/database queries on rapid polling or spam attacks.
 * Features automatic background TTL cleanup with non-blocking timers.
 */

export class MemoryCooldownStore {
  /**
   * @param {Object} options
   * @param {number} [options.cleanupIntervalMs=60000] - Interval to sweep expired entries
   */
  constructor({ cleanupIntervalMs = 60000 } = {}) {
    /** @type {Map<string, number>} key -> expiresAt timestamp (ms) */
    this.store = new Map();

    if (cleanupIntervalMs > 0) {
      this.cleanupTimer = setInterval(() => this.prune(), cleanupIntervalMs);
      if (this.cleanupTimer.unref) {
        this.cleanupTimer.unref(); // Prevent timer from keeping Node process alive
      }
    }
  }

  /**
   * Normalizes keys into an array of non-empty strings.
   * @param {string|string[]} keys
   * @returns {string[]}
   */
  _normalizeKeys(keys) {
    if (!keys) return [];
    const list = Array.isArray(keys) ? keys : [keys];
    return list.filter((k) => typeof k === "string" && k.trim().length > 0);
  }

  /**
   * Checks if any of the provided keys are currently in active cooldown.
   * @param {string|string[]} keys - One or more identifiers (e.g. userId, email, ip)
   * @param {number} [now=Date.now()] - Current timestamp override
   * @returns {{ isLimited: boolean, remainingMs: number, remainingSeconds: number }}
   */
  check(keys, now = Date.now()) {
    const list = this._normalizeKeys(keys);
    let maxRemainingMs = 0;

    for (const key of list) {
      const expiresAt = this.store.get(key);
      if (expiresAt) {
        if (expiresAt > now) {
          const remaining = expiresAt - now;
          if (remaining > maxRemainingMs) {
            maxRemainingMs = remaining;
          }
        } else {
          // Lazy eviction of expired key
          this.store.delete(key);
        }
      }
    }

    if (maxRemainingMs > 0) {
      return {
        isLimited: true,
        remainingMs: maxRemainingMs,
        remainingSeconds: Math.max(1, Math.ceil(maxRemainingMs / 1000)),
      };
    }

    return {
      isLimited: false,
      remainingMs: 0,
      remainingSeconds: 0,
    };
  }

  /**
   * Sets or extends cooldown duration for the given keys.
   * @param {string|string[]} keys - One or more identifiers
   * @param {number} durationMs - Duration of cooldown in milliseconds
   * @param {number} [now=Date.now()] - Current timestamp override
   */
  set(keys, durationMs, now = Date.now()) {
    if (!durationMs || durationMs <= 0) return;
    const list = this._normalizeKeys(keys);
    const expiresAt = now + durationMs;

    for (const key of list) {
      const existing = this.store.get(key) || 0;
      // Keep the longer expiry if an active cooldown is already present
      if (expiresAt > existing) {
        this.store.set(key, expiresAt);
      }
    }
  }

  /**
   * Clears specific keys from the cooldown store.
   * @param {string|string[]} keys
   */
  clear(keys) {
    const list = this._normalizeKeys(keys);
    for (const key of list) {
      this.store.delete(key);
    }
  }

  /**
   * Clears all entries from the store.
   */
  clearAll() {
    this.store.clear();
  }

  /**
   * Sweeps and evicts expired keys.
   * @param {number} [now=Date.now()]
   * @returns {number} Count of pruned entries
   */
  prune(now = Date.now()) {
    let prunedCount = 0;
    for (const [key, expiresAt] of this.store.entries()) {
      if (expiresAt <= now) {
        this.store.delete(key);
        prunedCount++;
      }
    }
    return prunedCount;
  }

  /**
   * Returns current active keys count (including unpruned expired ones).
   */
  get size() {
    return this.store.size;
  }

  /**
   * Cleans up background timer.
   */
  destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.clearAll();
  }
}

/**
 * Sliding Window Rate Limiter
 * Tracks event timestamps in memory to rate-limit events per time window.
 */
export class SlidingWindowRateLimiter {
  constructor({ cleanupIntervalMs = 60000 } = {}) {
    /** @type {Map<string, number[]>} key -> array of timestamps */
    this.windows = new Map();

    if (cleanupIntervalMs > 0) {
      this.cleanupTimer = setInterval(() => this.prune(), cleanupIntervalMs);
      if (this.cleanupTimer.unref) {
        this.cleanupTimer.unref();
      }
    }
  }

  /**
   * Records a hit and checks if the limit was exceeded.
   * @param {string} key
   * @param {Object} options
   * @param {number} options.limit - Max allowed hits in window
   * @param {number} options.windowMs - Sliding window duration in ms
   * @param {number} [options.now=Date.now()]
   * @returns {{ allowed: boolean, count: number, remaining: number, resetMs: number }}
   */
  hit(key, { limit, windowMs, now = Date.now() }) {
    if (!key) {
      return { allowed: true, count: 0, remaining: limit, resetMs: 0 };
    }

    const windowStart = now - windowMs;
    const timestamps = (this.windows.get(key) || []).filter((ts) => ts > windowStart);

    if (timestamps.length >= limit) {
      const oldestInWindow = timestamps[0];
      const resetMs = Math.max(0, oldestInWindow + windowMs - now);
      return {
        allowed: false,
        count: timestamps.length,
        remaining: 0,
        resetMs,
      };
    }

    timestamps.push(now);
    this.windows.set(key, timestamps);

    return {
      allowed: true,
      count: timestamps.length,
      remaining: limit - timestamps.length,
      resetMs: windowMs,
    };
  }

  prune(now = Date.now(), maxWindowMs = 15 * 60 * 1000) {
    const oldestAllowed = now - maxWindowMs;
    for (const [key, timestamps] of this.windows.entries()) {
      const valid = timestamps.filter((ts) => ts > oldestAllowed);
      if (valid.length === 0) {
        this.windows.delete(key);
      } else {
        this.windows.set(key, valid);
      }
    }
  }

  clearAll() {
    this.windows.clear();
  }

  destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.clearAll();
  }
}

// Global singleton instances for the application
export const feedbackCooldownStore = new MemoryCooldownStore();
export const globalRateLimiter = new SlidingWindowRateLimiter();

