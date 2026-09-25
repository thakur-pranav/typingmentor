import { cn } from "../../lib/utils/cn.js";

export function Card({ children, className, accent = "none" }) {
  const accents = {
    yellow: "border-t-4 border-t-nb-yellow",
    cyan:   "border-t-4 border-t-nb-cyan",
    pink:   "border-t-4 border-t-nb-pink",
    green:  "border-t-4 border-t-nb-green",
    none:   "",
  };

  return (
    <div
      className={cn(
        "border-2 border-nb-border bg-nb-card p-5 shadow-nb",
        accents[accent] || accents.none,
        className
      )}
    >
      {children}
    </div>
  );
}
