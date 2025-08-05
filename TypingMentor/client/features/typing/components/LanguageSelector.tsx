"use client";

import { CodeLanguage } from "../types";
import { cn } from "../../../lib/utils/cn";

interface LanguageSelectorProps {
  language: CodeLanguage;
  onChange: (language: CodeLanguage) => void;
}

const LANGUAGES: { value: CodeLanguage; label: string }[] = [
  { value: "javascript", label: "JS"   },
  { value: "python",     label: "PY"   },
  { value: "cpp",        label: "C++"  },
  { value: "java",       label: "Java" },
  { value: "rust",       label: "Rust" },
];

export function LanguageSelector({ language, onChange }: LanguageSelectorProps) {
  return (
    <div className="inline-flex gap-2" aria-label="Programming language">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.value}
          onClick={() => onChange(lang.value)}
          aria-pressed={language === lang.value}
          className={cn(
            "border-2 border-[#0d0d0d] px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffd60a]",
            language === lang.value
              ? "bg-[#00b4d8] text-[#0d0d0d] shadow-[2px_2px_0_#0d0d0d]"
              : "bg-[#ffffff] text-[#5a5a5a] shadow-[2px_2px_0_#0d0d0d] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
          )}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
