"use client";

import { useEffect, useRef } from "react";
import { TypingText } from "./TypingText";
import { soundEngine } from "../utils/soundEngine.js";

export function TypingArea({ statuses, typed, onInput, disabled, targetText }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();

    function handleGlobalKeyDown(e) {
      if (disabled) return;
      const active = document.activeElement;

      // Do not intercept if user is typing in another input, textarea, or inside a dialog
      if (
        active &&
        (active.tagName === "INPUT" ||
          (active.tagName === "TEXTAREA" && active !== inputRef.current) ||
          active.isContentEditable ||
          active.closest("[role='dialog']"))
      ) {
        return;
      }

      // If focus is already on our typing textarea, let normal event flow handle it
      if (active === inputRef.current) {
        return;
      }

      // Ignore system shortcuts (Ctrl+C, Ctrl+R, Alt+Tab, etc.)
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      // Blur whatever button or element has focus so Space doesn't activate it
      if (active && typeof active.blur === "function") {
        active.blur();
      }
      inputRef.current?.focus();

      // Dispatch the first keypress seamlessly so no character is dropped
      if (e.key === "Tab") {
        e.preventDefault();
        soundEngine.playKey("tab");
        if (targetText && typed.length < targetText.length) {
          let spaceCount = 0;
          for (let i = typed.length; i < targetText.length && targetText[i] === " "; i++) {
            spaceCount++;
            if (spaceCount === 4) break;
          }
          if (spaceCount > 0) {
            onInput(typed + " ".repeat(spaceCount));
            return;
          }
        }
        onInput(typed + "  ");
        return;
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        soundEngine.playBackspace();
        if (typed.length > 0) {
          onInput(typed.slice(0, -1));
        }
        return;
      }

      if (e.key === " ") {
        e.preventDefault();
        soundEngine.playSpace();
        onInput(typed + " ");
        return;
      }

      if (e.key.length === 1) {
        e.preventDefault();
        soundEngine.playKey(e.key);
        onInput(typed + e.key);
      }
    }

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [disabled, typed, targetText, onInput]);

  function handleChange(event) {
    onInput(event.target.value);
  }

  function handleKeyDown(event) {
    if (disabled) return;

    if (event.key === "Tab") {
      event.preventDefault();
      soundEngine.playKey("tab");
      // If the upcoming characters in targetText are spaces (indentation), insert them
      if (targetText && typed.length < targetText.length) {
        let spaceCount = 0;
        for (let i = typed.length; i < targetText.length && targetText[i] === " "; i++) {
          spaceCount++;
          if (spaceCount === 4) break;
        }
        if (spaceCount > 0) {
          onInput(typed + " ".repeat(spaceCount));
          return;
        }
      }
      onInput(typed + "  ");
      return;
    }

    if (event.key === " ") {
      soundEngine.playSpace();
    } else if (event.key === "Backspace") {
      soundEngine.playBackspace();
    } else if (
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      soundEngine.playKey(event.key);
    }
  }

  return (
    <div
      className="relative cursor-text border-2 border-nb-border bg-nb-card p-4 sm:p-6 md:p-8 shadow-nb"
      onClick={() => inputRef.current?.focus()}
    >
      <TypingText statuses={statuses} />
      <textarea
        ref={inputRef}
        value={typed}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        aria-label="Typing input"
        className="absolute inset-0 h-full w-full resize-none overflow-hidden bg-transparent text-transparent caret-transparent opacity-0"
      />
    </div>
  );
}
