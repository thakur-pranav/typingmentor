"use client";

import { AnimatedNumber } from "../../../components/ui/AnimatedNumber.jsx";

export function StatCard({ label, value, className = "" }) {
  const isPercent = typeof value === "string" && value.endsWith("%");
  const numericValue = typeof value === "number" ? value : parseFloat(value);
  const isValidNumber = !isNaN(numericValue);

  return (
    <div className={`border-2 border-nb-border bg-nb-card p-3.5 sm:p-5 shadow-nb-sm sm:shadow-nb text-center ${className}`}>
      <p className="font-mono text-2xl sm:text-3xl font-black tabular-nums text-nb-text">
        {isValidNumber ? (
          <AnimatedNumber
            value={numericValue}
            suffix={isPercent ? "%" : ""}
            duration={1.0}
          />
        ) : (
          value
        )}
      </p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-nb-sub">{label}</p>
    </div>
  );
}
