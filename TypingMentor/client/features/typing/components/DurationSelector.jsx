"use client";

import { TIMED_DURATIONS } from "../constants/durations";
import { cn } from "../../../lib/utils/cn";

export function DurationSelector({ duration, onChange }) {
  return (
    <div className="inline-flex gap-2">
      {TIMED_DURATIONS.map((value) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={cn(
            "border-2 border-[#0d0d0d] px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffd60a]",
            duration === value
              ? "bg-[#ffd60a] text-[#0d0d0d] shadow-[2px_2px_0_#0d0d0d]"
              : "bg-[#ffffff] text-[#5a5a5a] shadow-[2px_2px_0_#0d0d0d] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
          )}
        >
          {value}s
        </button>
      ))}
    </div>
  );
}
