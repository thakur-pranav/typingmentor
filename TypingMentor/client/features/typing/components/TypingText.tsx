"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CharacterStatus } from "../types";

interface TypingTextProps {
  statuses: CharacterStatus[];
}

// Line height in px — must match the `leading` value on the <p> below.
const LINE_H = 54;
// How many lines are visible at once.
const VISIBLE_LINES = 3;
// Container height = visible lines × line height.
const CONTAINER_H = LINE_H * VISIBLE_LINES;

function groupIntoWords(statuses: CharacterStatus[]): CharacterStatus[][] {
  const words: CharacterStatus[][] = [];
  let current: CharacterStatus[] = [];
  for (const s of statuses) {
    current.push(s);
    if (s.char === " ") {
      words.push(current);
      current = [];
    }
  }
  if (current.length > 0) words.push(current);
  return words;
}

function charClass(state: CharacterStatus["state"]): string {
  if (state === "correct")   return "text-[#0d0d0d]";         // typed correctly: black
  if (state === "incorrect") return "text-[#ff006e] underline decoration-[#ff006e]"; // wrong: pink-red
  if (state === "current")   return "text-[#0d0d0d]";         // cursor position: black
  return "text-[#aaa89c]";                                     // untyped: warm gray
}

export function TypingText({ statuses }: TypingTextProps) {
  const words = useMemo(() => groupIntoWords(statuses), [statuses]);

  const containerRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const charRefs     = useRef<(HTMLSpanElement | null)[]>([]);

  const [caretPos, setCaretPos] = useState<{ x: number; y: number; h: number } | null>(null);
  const [translateY,  setTranslateY]  = useState(0);

  const currentIndex = statuses.findIndex((s) => s.state === "current");

  useEffect(() => {
    const para     = paragraphRef.current;
    const charEl   = currentIndex >= 0 ? charRefs.current[currentIndex] : null;
    if (!para || !charEl) { setCaretPos(null); return; }

    const paraRect = para.getBoundingClientRect();
    const charRect = charEl.getBoundingClientRect();

    // x = left edge of the character, relative to paragraph
    const x = charRect.left - paraRect.left;
    // y = top of the character's bounding box, relative to paragraph
    const y = charRect.top  - paraRect.top;
    // Use the character's actual rendered height to center the caret
    const h = charRect.height;

    setCaretPos({ x, y, h });

    // Which line (0-indexed) is the caret on?
    const caretLine = Math.round(y / LINE_H);

    // Keep caret on line 1 (middle of 3 visible lines).
    const targetLine = Math.max(0, caretLine - 1);
    setTranslateY(-(targetLine * LINE_H));
  }, [currentIndex]);

  // Keep ref array length in sync.
  charRefs.current.length = statuses.length;

  let flatIndex = 0;

  return (
    // Clipping container — fixed height shows exactly VISIBLE_LINES lines.
    <div
      ref={containerRef}
      style={{ height: CONTAINER_H }}
      className="relative w-full overflow-hidden"
      aria-hidden="true"
    >
      {/* Gliding caret */}
      {caretPos && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute z-10 w-[2.5px] rounded-[1px] bg-[#ffd60a] animate-[caretBlink_1s_step-start_infinite]"
          style={{
            left:   caretPos.x - 1,
            // y is relative to paragraph; shift into container coords via translateY.
            // Then center the caret (80% of char height) within the char box.
            top:    caretPos.y + translateY + caretPos.h * 0.1,
            height: caretPos.h * 0.8,
            transition: "left 80ms linear, top 80ms linear",
          }}
        />
      )}

      {/* Scrolling paragraph */}
      <p
        ref={paragraphRef}
        className="select-none font-mono text-[1.4rem] tracking-wide"
        style={{
          lineHeight:  `${LINE_H}px`,
          transform:   `translateY(${translateY}px)`,
          transition:  "transform 150ms ease",
          willChange:  "transform",
        }}
      >
        {words.map((word, wi) => (
          <span key={wi} className="inline">
            {word.map((status, ci) => {
              const idx = flatIndex++;
              return (
                <span
                  key={ci}
                  ref={(el) => { charRefs.current[idx] = el; }}
                  className={charClass(status.state)}
                >
                  {status.char}
                </span>
              );
            })}
          </span>
        ))}
      </p>
    </div>
  );
}
