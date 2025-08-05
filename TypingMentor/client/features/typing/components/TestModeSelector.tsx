"use client";

import { TestMode } from "../types";
import { cn } from "../../../lib/utils/cn";

interface TestModeSelectorProps {
  mode: TestMode;
  onChange: (mode: TestMode) => void;
}

const OPTIONS: { value: TestMode; label: string }[] = [
  { value: "timed",   label: "time"    },
  { value: "passage", label: "passage" },
  { value: "code",    label: "code"    },
];

export function TestModeSelector({ mode, onChange }: TestModeSelectorProps) {
  return (
    <div role="tablist" aria-label="Test mode" className="inline-flex gap-2">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          role="tab"
          aria-selected={mode === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "border-2 border-[#0d0d0d] px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffd60a]",
            mode === option.value
              ? "bg-[#ffd60a] text-[#0d0d0d] shadow-[2px_2px_0_#0d0d0d]"
              : "bg-[#ffffff] text-[#5a5a5a] shadow-[2px_2px_0_#0d0d0d] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
