import { ReactNode } from "react";
import { cn } from "../../lib/utils/cn";

interface AlertProps {
  variant?: "error" | "success" | "info";
  children: ReactNode;
}

export function Alert({ variant = "info", children }: AlertProps) {
  const variants: Record<string, string> = {
    error:   "bg-nb-pink   text-white   border-nb-border",
    success: "bg-nb-green  text-nb-text border-nb-border",
    info:    "bg-nb-cyan   text-nb-text border-nb-border",
  };

  return (
    <div
      role="alert"
      className={cn(
        "border-2 px-4 py-3 text-sm font-medium shadow-nb-sm",
        variants[variant]
      )}
    >
      {children}
    </div>
  );
}
