/**
 * Web Audio API Mechanical Keyboard Sound Synthesizer
 * Generates low-latency (<5ms) mechanical switch sounds, spacebar stabilizers,
 * backspace clicks, and completion chimes directly in the browser without external audio files.
 */

export const SOUND_PROFILES = [
  { id: "clicky",     label: "Clicky (MX Blue)", icon: "🔊" },
  { id: "thock",      label: "Thocky Linear",    icon: "🔊" },
  { id: "typewriter", label: "Typewriter",       icon: "🔊" },
  { id: "bubble",     label: "Soft Bubble",      icon: "🔊" },
  { id: "off",        label: "Mute",             icon: "🔇" },
];

const STORAGE_KEY_PROFILE = "typingmentor_sound_profile";
const STORAGE_KEY_VOLUME = "typingmentor_sound_volume";

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.profile = "clicky";
    this.volume = 0.5;
    this.initialized = false;
  }

  loadFromStorage() {
    if (typeof window !== "undefined") {
      try {
        const savedProfile = localStorage.getItem(STORAGE_KEY_PROFILE);
        if (savedProfile && SOUND_PROFILES.some((p) => p.id === savedProfile)) {
          this.profile = savedProfile;
        }
        const savedVolume = localStorage.getItem(STORAGE_KEY_VOLUME);
        if (savedVolume !== null) {
          const parsed = parseFloat(savedVolume);
          if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
            this.volume = parsed;
          }
        }
      } catch {
        // LocalStorage access restricted in private mode
      }
    }
    return { profile: this.profile, volume: this.volume };
  }

  getAudioContext() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  setProfile(profileId) {
    if (SOUND_PROFILES.some((p) => p.id === profileId)) {
      this.profile = profileId;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY_PROFILE, profileId);
        } catch {}
      }
    }
    return this.profile;
  }

  getProfile() {
    return this.profile;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_VOLUME, String(this.volume));
      } catch {}
    }
    return this.volume;
  }

  getVolume() {
    return this.volume;
  }

  cycleProfile() {
    const currentIndex = SOUND_PROFILES.findIndex((p) => p.id === this.profile);
    const nextIndex = (currentIndex + 1) % SOUND_PROFILES.length;
    const nextProfile = SOUND_PROFILES[nextIndex].id;
    this.setProfile(nextProfile);
    if (nextProfile !== "off") {
      this.playKey("preview");
    }
    return nextProfile;
  }

  /**
   * Generates a short white noise buffer for switch clicks
   */
  createNoiseBuffer(ctx, durationSeconds = 0.04) {
    const bufferSize = Math.floor(ctx.sampleRate * durationSeconds);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  /**
   * Primary key click sound synthesized via filtered noise + transient oscillator
   */
  playKey(key = "") {
    if (this.profile === "off" || this.volume <= 0) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, now);
    masterGain.connect(ctx.destination);

    // Natural random pitch jitter (±4%)
    const jitter = 0.96 + Math.random() * 0.08;

    switch (this.profile) {
      case "clicky":
        this.synthClicky(ctx, masterGain, now, jitter, false);
        break;
      case "thock":
        this.synthThock(ctx, masterGain, now, jitter, false);
        break;
      case "typewriter":
        this.synthTypewriter(ctx, masterGain, now, jitter, false);
        break;
      case "bubble":
        this.synthBubble(ctx, masterGain, now, jitter);
        break;
      default:
        break;
    }
  }

  /**
   * Spacebar switch with deeper resonance and acoustic body
   */
  playSpace() {
    if (this.profile === "off" || this.volume <= 0) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 1.15, now);
    masterGain.connect(ctx.destination);

    const jitter = 0.88; // Lower pitch for wide spacebar

    switch (this.profile) {
      case "clicky":
        this.synthClicky(ctx, masterGain, now, jitter, true);
        break;
      case "thock":
        this.synthThock(ctx, masterGain, now, jitter, true);
        break;
      case "typewriter":
        this.synthTypewriter(ctx, masterGain, now, jitter, true);
        break;
      case "bubble":
        this.synthBubble(ctx, masterGain, now, 0.75);
        break;
      default:
        break;
    }
  }

  /**
   * Backspace with distinct return transient
   */
  playBackspace() {
    if (this.profile === "off" || this.volume <= 0) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.9, now);
    masterGain.connect(ctx.destination);

    const jitter = 0.92;

    switch (this.profile) {
      case "clicky":
        this.synthClicky(ctx, masterGain, now, jitter, false);
        break;
      case "thock":
        this.synthThock(ctx, masterGain, now, jitter, false);
        break;
      case "typewriter":
        this.synthTypewriter(ctx, masterGain, now, jitter, false);
        break;
      case "bubble":
        this.synthBubble(ctx, masterGain, now, 1.25);
        break;
      default:
        break;
    }
  }

  /**
   * Celebratory completion chime upon test completion
   */
  playCompletion() {
    if (this.profile === "off" || this.volume <= 0) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(this.volume * 0.25, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.36);
    });
  }

  // --- SYNTHESIS VOICES ---

  synthClicky(ctx, masterGain, now, jitter, isSpace) {
    // 1. Noise transient (snap)
    const noise = ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(ctx, isSpace ? 0.035 : 0.022);

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime((isSpace ? 1800 : 2800) * jitter, now);
    filter.Q.setValueAtTime(isSpace ? 4 : 6, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.65, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + (isSpace ? 0.035 : 0.022));

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);

    noise.start(now);
    noise.stop(now + 0.04);

    // 2. High tactile metallic pop
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime((isSpace ? 280 : 540) * jitter, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + (isSpace ? 0.04 : 0.025));

    oscGain.gain.setValueAtTime(0.4, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + (isSpace ? 0.04 : 0.025));

    osc.connect(oscGain);
    oscGain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  synthThock(ctx, masterGain, now, jitter, isSpace) {
    // 1. Low frequency resonant body thump (thock)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sine";
    const startFreq = (isSpace ? 160 : 220) * jitter;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + (isSpace ? 0.055 : 0.038));

    oscGain.gain.setValueAtTime(0.7, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + (isSpace ? 0.055 : 0.038));

    osc.connect(oscGain);
    oscGain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.06);

    // 2. Muted bottom-out plastic tap
    const noise = ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(ctx, isSpace ? 0.03 : 0.018);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime((isSpace ? 650 : 950) * jitter, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + (isSpace ? 0.03 : 0.018));

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);

    noise.start(now);
    noise.stop(now + 0.035);
  }

  synthTypewriter(ctx, masterGain, now, jitter, isSpace) {
    // 1. Sharp metallic impact
    const noise = ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(ctx, isSpace ? 0.045 : 0.03);

    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime((isSpace ? 1200 : 2200) * jitter, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.75, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + (isSpace ? 0.045 : 0.03));

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);

    noise.start(now);
    noise.stop(now + 0.05);

    // 2. High metallic spring ping
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime((isSpace ? 950 : 1600) * jitter, now);

    oscGain.gain.setValueAtTime(0.2, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(oscGain);
    oscGain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  synthBubble(ctx, masterGain, now, jitter) {
    // Water droplet / bubble pop frequency sweep
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sine";

    const baseFreq = 580 * jitter;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.035);

    oscGain.gain.setValueAtTime(0.6, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(oscGain);
    oscGain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.04);
  }
}

export const soundEngine = new SoundEngine();
