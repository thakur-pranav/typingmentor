"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";

/**
 * AnimatedNumber
 * Smoothly animates a numeric value from 0 to target on mount using Framer Motion.
 * Respects `prefers-reduced-motion` for accessibility.
 */
export function AnimatedNumber({
  value,
  duration = 1.0,
  suffix = "",
  decimals = 0,
  className = "",
}) {
  const numericTarget = typeof value === "number" ? value : parseFloat(value) || 0;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayValue(numericTarget);
      return;
    }

    const controls = animate(0, numericTarget, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        if (decimals > 0) {
          setDisplayValue(Number(latest.toFixed(decimals)));
        } else {
          setDisplayValue(Math.round(latest));
        }
      },
    });

    return () => controls.stop();
  }, [numericTarget, duration, decimals]);

  return (
    <span className={className}>
      {decimals > 0 ? displayValue.toFixed(decimals) : displayValue}
      {suffix}
    </span>
  );
}
