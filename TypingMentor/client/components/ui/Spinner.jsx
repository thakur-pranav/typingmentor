import { cn } from "../../lib/utils/cn.js";

export function Spinner({ className }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "h-6 w-6 animate-spin rounded-full border-2 border-nb-border border-t-nb-yellow",
        className
      )}
    />
  );
}
