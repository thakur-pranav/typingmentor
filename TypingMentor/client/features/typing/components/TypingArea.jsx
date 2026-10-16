"use client";

import { useEffect, useRef } from "react";
import { TypingText } from "./TypingText";
import { soundEngine } from "../utils/soundEngine.js";

export function TypingArea({ statuses, typed, onInput, disabled, targetText }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
