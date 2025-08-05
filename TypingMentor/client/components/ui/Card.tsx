import { ReactNode } from "react";
import { cn } from "../../lib/utils/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
  accent?: "yellow" | "cyan" | "pink" | "green" | "none";
}

export function Card({ children, className, accent = "none" }: CardProps) {
  const accents: Record<string, string> = {
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
        accents[accent],
        className
      )}
    >
      {children}
    </div>
  );
}
