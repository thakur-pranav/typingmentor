"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SOUND_PROFILES, soundEngine } from "../utils/soundEngine.js";
import { cn } from "../../../lib/utils/cn.js";

export function SoundSelector() {
  const [profile, setProfile] = useState("clicky");
  const [volume, setVolume] = useState(0.5);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const lastActiveProfile = useRef("clicky");

  // Sync user's persisted preferences after hydration
  useEffect(() => {
    const config = soundEngine.loadFromStorage();
    setProfile(config.profile);
    if (config.profile !== "off") {
      lastActiveProfile.current = config.profile;
    }
    setVolume(config.volume);
    setMounted(true);
  }, []);

  const refocusTypingInput = () => {
    setTimeout(() => {
      const textarea = document.querySelector('textarea[aria-label="Typing input"]');
      textarea?.focus();
    }, 15);
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        refocusTypingInput();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const activeOption = SOUND_PROFILES.find((p) => p.id === profile) || SOUND_PROFILES[0];
  const isMuted = mounted && (profile === "off" || volume === 0);

  const handleToggleMute = (e) => {
    e?.stopPropagation();
    if (isMuted) {
      const next = lastActiveProfile.current === "off" ? "clicky" : lastActiveProfile.current;
      soundEngine.setProfile(next);
      setProfile(next);
      soundEngine.playKey("preview");
    } else {
      if (profile !== "off") {
        lastActiveProfile.current = profile;
      }
      soundEngine.setProfile("off");
      setProfile("off");
    }
    refocusTypingInput();
  };

  const handleSelectProfile = (id) => {
    soundEngine.setProfile(id);
    setProfile(id);
    if (id !== "off") {
      lastActiveProfile.current = id;
      soundEngine.playKey("preview");
    }
    setIsOpen(false);
    refocusTypingInput();
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    soundEngine.setVolume(val);
    setVolume(val);
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <div
        className={cn(
          "inline-flex items-stretch border-2 border-[#0d0d0d] shadow-[2px_2px_0_#0d0d0d] transition-all",
          isMuted ? "bg-[#ffffff] text-[#888888]" : "bg-[#ffffff] text-[#0d0d0d]"
        )}
      >
        {/* Quick 1-Click Mute / Unmute Button */}
        <button
          type="button"
          onClick={handleToggleMute}
          title={isMuted ? "Click to turn sound on" : "Click to mute sound"}
          aria-label={isMuted ? "Turn sound on" : "Mute sound"}
          className={cn(
            "flex items-center px-2 py-1.5 text-xs transition-colors border-r-2 border-[#0d0d0d] hover:bg-[#ffd60a] hover:text-[#0d0d0d]",
            isMuted && "bg-[#ff006e]/15 text-[#ff006e]"
          )}
        >
          <span>{isMuted ? "🔇" : "🔊"}</span>
        </button>

        {/* Profile Label & Dropdown Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label="Sound settings"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-[#ffd60a] hover:text-[#0d0d0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffd60a]"
        >
          <span>{isMuted ? "Muted" : mounted ? activeOption.label.split(" ")[0] : "Clicky"}</span>
          <span className="text-[10px] opacity-60">▼</span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            aria-label="Keyboard sound settings"
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ type: "spring", stiffness: 450, damping: 28 }}
            className="absolute right-0 mt-2 z-50 w-64 border-2 border-nb-border bg-nb-card p-3 shadow-nb space-y-3"
          >
            <div className="flex items-center justify-between border-b-2 border-nb-border pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-nb-text">
                Keyboard Sound FX
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  refocusTypingInput();
                }}
                className="border border-nb-border px-1.5 py-0.5 text-xs font-black hover:bg-nb-yellow"
                aria-label="Close sound settings"
              >
                ✕
              </button>
            </div>

            {/* Quick Master Mute / Unmute Banner */}
            <button
              type="button"
              onClick={handleToggleMute}
              className={cn(
                "flex w-full items-center justify-between border-2 border-nb-border px-2.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all",
                isMuted
                  ? "bg-nb-yellow text-nb-text shadow-[2px_2px_0_#0d0d0d] hover:bg-nb-yellow/90"
                  : "bg-nb-pink text-white shadow-[2px_2px_0_#0d0d0d] hover:bg-nb-pink/90"
              )}
            >
              <span>{isMuted ? "🔇 Sound is Muted" : "🔊 Sound is Active"}</span>
              <span className="text-[10px] underline">{isMuted ? "Turn On" : "Mute (Off)"}</span>
            </button>

            {/* Sound Profiles */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-nb-sub">
                Switch Profile
              </p>
              <div className="grid grid-cols-1 gap-1">
                {SOUND_PROFILES.map((p) => {
                  const isSelected = profile === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectProfile(p.id)}
                      className={cn(
                        "flex items-center justify-between border-2 border-nb-border px-2.5 py-1 text-xs font-bold transition-all text-left",
                        isSelected
                          ? "bg-nb-yellow text-nb-text shadow-[2px_2px_0_#0d0d0d]"
                          : "bg-nb-bg text-nb-text hover:bg-nb-card shadow-[1px_1px_0_#0d0d0d]"
                      )}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{p.icon}</span>
                        <span>{p.label}</span>
                      </span>
                      {isSelected && <span className="font-mono text-[11px]">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Volume Slider */}
            {!isMuted && (
              <div className="space-y-1 border-t-2 border-nb-border pt-2">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-nb-sub">
                  <span>Volume</span>
                  <span className="font-mono text-nb-text">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  aria-label="Keyboard sound volume"
                  className="w-full accent-nb-yellow cursor-pointer"
                />
              </div>
            )}

            {/* Test Keystroke Button */}
            {!isMuted && (
              <button
                type="button"
                onClick={() => soundEngine.playKey("preview")}
                className="w-full border-2 border-nb-border bg-nb-bg py-1 text-[11px] font-bold uppercase tracking-wider text-nb-text shadow-nb-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-nb-yellow hover:shadow-none"
              >
                Test Click
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
