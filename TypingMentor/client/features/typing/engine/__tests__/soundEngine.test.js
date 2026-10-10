import { describe, it, expect, beforeEach } from "vitest";
import { soundEngine, SOUND_PROFILES } from "../../utils/soundEngine.js";

describe("SoundEngine", () => {
  beforeEach(() => {
    soundEngine.setProfile("clicky");
    soundEngine.setVolume(0.5);
  });

  it("exposes available sound profiles", () => {
    expect(SOUND_PROFILES.length).toBeGreaterThanOrEqual(4);
    const ids = SOUND_PROFILES.map((p) => p.id);
    expect(ids).toContain("clicky");
    expect(ids).toContain("thock");
    expect(ids).toContain("typewriter");
    expect(ids).toContain("bubble");
    expect(ids).toContain("off");
  });

  it("updates and gets sound profiles correctly", () => {
    expect(soundEngine.getProfile()).toBe("clicky");
    soundEngine.setProfile("thock");
    expect(soundEngine.getProfile()).toBe("thock");

    // Invalid profile is ignored
    soundEngine.setProfile("non_existent_profile");
    expect(soundEngine.getProfile()).toBe("thock");
  });

  it("clamps volume between 0 and 1", () => {
    soundEngine.setVolume(0.8);
    expect(soundEngine.getVolume()).toBe(0.8);

    soundEngine.setVolume(1.5);
    expect(soundEngine.getVolume()).toBe(1);

    soundEngine.setVolume(-0.5);
    expect(soundEngine.getVolume()).toBe(0);
  });

  it("cycles through profiles sequentially and wraps around", () => {
    soundEngine.setProfile("clicky");
    const next = soundEngine.cycleProfile();
    expect(next).toBe("thock");

    soundEngine.setProfile("off");
    const wrapped = soundEngine.cycleProfile();
    expect(wrapped).toBe("clicky");
  });

  it("executes playback methods safely without throwing in headless environments", () => {
    expect(() => soundEngine.playKey("a")).not.toThrow();
    expect(() => soundEngine.playSpace()).not.toThrow();
    expect(() => soundEngine.playBackspace()).not.toThrow();
    expect(() => soundEngine.playCompletion()).not.toThrow();
  });
});
