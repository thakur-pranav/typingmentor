"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRESET_CATEGORIES, getRandomPreset } from "../constants/customPresets.js";

export function CustomTextModal({ isOpen, onClose, onSave, currentText = "" }) {
  const [text, setText] = useState(currentText);
  const [error, setError] = useState("");
  const [activeInfo, setActiveInfo] = useState(null);

  const handleApply = () => {
    const trimmed = text.trim();
    if (trimmed.length < 10) {
      setError("Custom text must contain at least 10 characters.");
      return;
    }
    setError("");
    onSave(trimmed);
    onClose();
  };

  const handleRoll = (categoryId) => {
    const preset = getRandomPreset(categoryId, text);
    if (preset) {
      setText(preset.text);
      setActiveInfo({
        title: preset.title,
        author: preset.author,
        categoryId,
      });
      setError("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="custom-text-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className="w-full max-w-lg border-2 border-nb-border bg-nb-card p-6 shadow-nb space-y-4"
          >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-nb-border pb-3">
          <h2 id="custom-text-title" className="text-base font-black uppercase tracking-wider text-nb-text">
            Custom Practice Text
          </h2>
          <button
            onClick={onClose}
            className="border-2 border-nb-border bg-nb-bg px-2 py-0.5 text-xs font-black uppercase shadow-nb-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Rollable Quick Presets */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-nb-sub">
              Quick Presets (Click to Roll)
            </p>
            <span className="text-[10px] font-bold text-nb-sub uppercase">
              35+ Quotes
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleRoll(cat.id)}
                className="border-2 border-nb-border bg-nb-bg px-2.5 py-1 text-xs font-bold shadow-[2px_2px_0_#0d0d0d] hover:bg-nb-yellow hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-1.5"
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {activeInfo && (
            <div className="mt-2 flex items-center justify-between border border-nb-border bg-nb-bg/80 px-2.5 py-1 text-[11px] font-bold text-nb-sub shadow-inner">
              <span className="truncate">
                <span className="text-nb-text">{activeInfo.title}</span>
                {activeInfo.author && ` · ${activeInfo.author}`}
              </span>
              <button
                type="button"
                onClick={() => handleRoll(activeInfo.categoryId || "all")}
                className="ml-2 font-mono text-xs font-bold uppercase text-nb-text hover:underline shrink-0"
              >
                🎲 Reroll
              </button>
            </div>
          )}
        </div>

        {/* Textarea */}
        <div>
          <label htmlFor="custom-text-input" className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-nb-sub">
            Paste or Type Your Text
          </label>
          <textarea
            id="custom-text-input"
            rows={5}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setActiveInfo(null);
              if (error) setError("");
            }}
            placeholder="Paste interview questions, vocabulary words, notes, or roll a preset above..."
            className="w-full border-2 border-nb-border bg-nb-bg p-3 font-mono text-sm leading-relaxed text-nb-text shadow-inner focus:outline-none focus:ring-2 focus:ring-nb-yellow"
          />
          <div className="mt-1 flex items-center justify-between text-[11px] text-nb-sub font-mono">
            <span>{text.trim().split(/\s+/).filter(Boolean).length} words · {text.length} characters</span>
            <button
              type="button"
              onClick={() => handleRoll("all")}
              className="text-xs font-bold uppercase text-nb-text hover:underline"
            >
              🎲 Roll Random
            </button>
          </div>
          {error && <p className="mt-1 font-mono text-xs font-bold text-red-600">{error}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 border-t-2 border-nb-border pt-3">
          <button
            type="button"
            onClick={onClose}
            className="border-2 border-nb-border bg-nb-bg px-4 py-2 text-xs font-bold uppercase tracking-wider text-nb-sub shadow-nb-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="border-2 border-nb-border bg-nb-yellow px-5 py-2 text-xs font-bold uppercase tracking-wider text-nb-text shadow-nb hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
          >
            Apply & Start
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
}
