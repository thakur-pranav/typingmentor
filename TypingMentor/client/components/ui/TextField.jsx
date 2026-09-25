"use client";

import { forwardRef, useId } from "react";
import { cn } from "../../lib/utils/cn.js";

export const TextField = forwardRef(({ label, className, id, ...props }, ref) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-xs font-bold uppercase tracking-widest text-nb-text"
      >
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "border-2 border-nb-border bg-nb-card px-3 py-2.5 text-sm text-nb-text placeholder:text-nb-sub shadow-nb-sm focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none transition-all",
          className
        )}
        {...props}
      />
    </div>
  );
});
TextField.displayName = "TextField";
