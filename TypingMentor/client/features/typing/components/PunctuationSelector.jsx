"use client";

import { cn } from "../../../lib/utils/cn";

export function PunctuationSelector({ hasPunctuation, onChange }) {
  return (
    <div className="inline-flex">
      <button
        type="button"
        role="switch"
        aria-checked={hasPunctuation}
        onClick={() => onChange(!hasPunctuation)}
        title={
          hasPunctuation
            ? "Punctuation ON: Capital letters & punctuation marks enabled (Click to turn OFF)"
            : "Punctuation OFF: All small letters with no punctuation (Click to turn ON)"
        }
        className={cn(
          "inline-flex items-center gap-1.5 border-2 border-[#0d0d0d] px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffd60a]",
          hasPunctuation
            ? "bg-[#ffd60a] text-[#0d0d0d] shadow-[2px_2px_0_#0d0d0d]"
            : "bg-[#ffffff] text-[#5a5a5a] shadow-[2px_2px_0_#0d0d0d] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
        )}
      >
        <span className="font-mono text-sm leading-none font-black">@</span>
        <span>punctuation</span>
        <span
          className={cn(
            "border border-[#0d0d0d] px-1 py-0.5 text-[10px] font-black leading-none uppercase",
            hasPunctuation
              ? "bg-[#0d0d0d] text-[#ffd60a]"
              : "bg-gray-200 text-[#5a5a5a]"
          )}
        >
          {hasPunctuation ? "on" : "off"}
        </span>
      </button>
    </div>
  );
}
