"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "../../lib/utils/cn.js";

export const Button = forwardRef(
  ({ className, variant = "primary", isLoading, children, disabled, href, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center border-2 border-nb-border px-4 py-2.5 text-sm font-bold uppercase tracking-wide transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nb-yellow disabled:cursor-not-allowed disabled:opacity-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";

    const variants = {
      primary:   "bg-nb-yellow text-nb-text shadow-nb hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
      secondary: "bg-nb-cyan   text-nb-text shadow-nb hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
      ghost:     "bg-nb-card   text-nb-text shadow-nb-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none",
      danger:    "bg-nb-pink   text-white   shadow-nb hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
    };

    const combinedClassName = cn(base, variants[variant] || variants.primary, className);

    if (href) {
      return (
        <Link href={href} className={combinedClassName} {...props}>
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? "Please wait…" : children}
      </button>
    );
  }
);
Button.displayName = "Button";
