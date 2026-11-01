import { describe, it, expect, beforeEach } from "vitest";
import {
  MemoryCooldownStore,
  SlidingWindowRateLimiter,
} from "../utils/rateLimiter.js";

describe("MemoryCooldownStore", () => {
  let store;

  beforeEach(() => {
    store = new MemoryCooldownStore({ cleanupIntervalMs: 0 }); // Disable interval for tests
  });

  it("returns isLimited: false for unrecorded keys", () => {
    const res = store.check(["user:123", "ip:1.2.3.4"]);
    expect(res.isLimited).toBe(false);
    expect(res.remainingMs).toBe(0);
    expect(res.remainingSeconds).toBe(0);
  });

  it("enforces cooldown for single and compound keys", () => {
    const now = 1000000;
    const cooldownMs = 60 * 1000; // 1 minute

    store.set(["user:user_1", "email:user@example.com"], cooldownMs, now);

    // Check with the user key
    const check1 = store.check("user:user_1", now + 10000);
    expect(check1.isLimited).toBe(true);
    expect(check1.remainingMs).toBe(50000);
    expect(check1.remainingSeconds).toBe(50);

    // Check with the email key
    const check2 = store.check("email:user@example.com", now + 10000);
    expect(check2.isLimited).toBe(true);
    expect(check2.remainingSeconds).toBe(50);

    // Check compound array where only one matches
    const check3 = store.check(["user:unrelated", "email:user@example.com"], now + 10000);
    expect(check3.isLimited).toBe(true);
    expect(check3.remainingSeconds).toBe(50);

    // Check unrelated key
    const check4 = store.check("user:other", now + 10000);
    expect(check4.isLimited).toBe(false);
  });

  it("handles cooldown expiration accurately", () => {
    const now = 1000000;
    const cooldownMs = 30 * 1000;

    store.set("ip:192.168.1.1", cooldownMs, now);

    // 1 millisecond before expiry
    expect(store.check("ip:192.168.1.1", now + 29999).isLimited).toBe(true);

    // Exactly at expiry
    expect(store.check("ip:192.168.1.1", now + 30000).isLimited).toBe(false);

    // Past expiry
    expect(store.check("ip:192.168.1.1", now + 35000).isLimited).toBe(false);
  });

  it("lazily evicts expired keys on check", () => {
    const now = 1000000;
    store.set("key1", 5000, now);
    expect(store.size).toBe(1);

    // Check after expiry triggers lazy eviction
    store.check("key1", now + 6000);
    expect(store.size).toBe(0);
  });

  it("prunes expired entries with prune()", () => {
    const now = 1000000;
    store.set("k1", 5000, now);
    store.set("k2", 10000, now);
    store.set("k3", 20000, now);
    expect(store.size).toBe(3);

    const pruned = store.prune(now + 12000);
    expect(pruned).toBe(2);
    expect(store.size).toBe(1);
    expect(store.check("k3", now + 12000).isLimited).toBe(true);
  });

  it("clears specific keys and resets store", () => {
    store.set(["a", "b", "c"], 10000);
    expect(store.size).toBe(3);

    store.clear(["a", "b"]);
    expect(store.size).toBe(1);
    expect(store.check("c").isLimited).toBe(true);

    store.clearAll();
    expect(store.size).toBe(0);
  });

  it("ignores invalid or empty keys gracefully", () => {
    expect(() => {
      store.set(null, 1000);
      store.set(["", "   ", null, undefined], 1000);
      store.check(null);
      store.check([null, undefined, ""]);
      store.clear(null);
    }).not.toThrow();
  });
});

describe("SlidingWindowRateLimiter", () => {
  let limiter;

  beforeEach(() => {
    limiter = new SlidingWindowRateLimiter({ cleanupIntervalMs: 0 });
  });

  it("allows hits up to limit and blocks subsequent hits in window", () => {
    const now = 1000000;
    const windowMs = 60 * 1000;
    const limit = 3;

    // Hits 1, 2, 3
    const h1 = limiter.hit("ip:1.1.1.1", { limit, windowMs, now });
    expect(h1.allowed).toBe(true);
    expect(h1.count).toBe(1);
    expect(h1.remaining).toBe(2);

    const h2 = limiter.hit("ip:1.1.1.1", { limit, windowMs, now: now + 1000 });
    expect(h2.allowed).toBe(true);
    expect(h2.remaining).toBe(1);

    const h3 = limiter.hit("ip:1.1.1.1", { limit, windowMs, now: now + 2000 });
    expect(h3.allowed).toBe(true);
    expect(h3.remaining).toBe(0);

    // Hit 4 - blocked
    const h4 = limiter.hit("ip:1.1.1.1", { limit, windowMs, now: now + 3000 });
    expect(h4.allowed).toBe(false);
    expect(h4.remaining).toBe(0);
    expect(h4.resetMs).toBe(windowMs - 3000);
  });

  it("slides window forward and recovers capacity after duration", () => {
    const now = 1000000;
    const windowMs = 60 * 1000;
    const limit = 2;

    limiter.hit("user:99", { limit, windowMs, now });
    limiter.hit("user:99", { limit, windowMs, now: now + 10000 });

    // Blocked at now + 20000
    expect(limiter.hit("user:99", { limit, windowMs, now: now + 20000 }).allowed).toBe(false);

    // At now + 65000, the first hit has rolled out of the 60s window
    const recovered = limiter.hit("user:99", { limit, windowMs, now: now + 65000 });
    expect(recovered.allowed).toBe(true);
    expect(recovered.count).toBe(2); // hit 2 + new hit
  });
});

