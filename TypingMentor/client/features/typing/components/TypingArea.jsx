"use client";

import { useEffect, useRef } from "react";
import { TypingText } from "./TypingText";

export function TypingArea({ statuses, typed, onInput, disabled }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleChange(event) {
    onInput(event.target.value);
  }

  return (
    <div
      className="relative cursor-text border-2 border-nb-border bg-nb-card p-6 shadow-nb"
      onClick={() => inputRef.current?.focus()}
    >
      <TypingText statuses={statuses} />
      <textarea
        ref={inputRef}
        value={typed}
        onChange={handleChange}
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
