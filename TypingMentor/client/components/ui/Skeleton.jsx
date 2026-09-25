import { cn } from "../../lib/utils/cn.js";

export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "animate-pulse border-2 border-nb-border bg-[repeating-linear-gradient(45deg,#e5e0d0,#e5e0d0_4px,#fffbf0_4px,#fffbf0_12px)]",
        className
      )}
    />
  );
}
