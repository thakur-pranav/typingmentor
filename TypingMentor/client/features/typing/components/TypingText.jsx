"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Line height in px — must match the `leading` value on the <p> below.
const LINE_H = 54;
// How many lines are visible at once.
const VISIBLE_LINES = 3;
// Container height = visible lines × line height.
const CONTAINER_H = LINE_H * VISIBLE_LINES;

function groupIntoWords(statuses) {
  const words = [];
  let current = [];
  for (const s of statuses) {
    current.push(s);
    if (s.char === " " || s.char === "\n") {
      words.push(current);
      current = [];
    }
  }
  if (current.length > 0) words.push(current);
  return words;
}

function charClass(state) {
  if (state === "correct")   return "text-[#0d0d0d]";         // typed correctly: black
  if (state === "incorrect") return "text-[#ff006e] underline decoration-[#ff006e]"; // wrong: pink-red
  if (state === "current")   return "text-[#aaa89c]";         // cursor position: keep untyped warm gray
  return "text-[#aaa89c]";                                     // untyped: warm gray
}

export function TypingText({ statuses }) {
  const words = useMemo(() => groupIntoWords(statuses), [statuses]);

  const containerRef = useRef(null);
  const paragraphRef = useRef(null);
  const charRefs     = useRef([]);

  const [caretPos, setCaretPos] = useState(null);
  const [translateY,  setTranslateY]  = useState(0);

  const currentIndex = statuses.findIndex((s) => s.state === "current");

  useEffect(() => {
    const para     = paragraphRef.current;
    const charEl   = currentIndex >= 0 ? charRefs.current[currentIndex] : null;
    if (!para || !charEl) { setCaretPos(null); return; }

    const paraRect = para.getBoundingClientRect();
    const charRect = charEl.getBoundingClientRect();

    const x = charRect.left - paraRect.left;
    const y = charRect.top  - paraRect.top;
    const h = charRect.height;

    setCaretPos({ x, y, h });

    const caretLine = Math.round(y / LINE_H);
    const targetLine = Math.max(0, caretLine - 1);
    setTranslateY(-(targetLine * LINE_H));
  }, [currentIndex]);

  charRefs.current.length = statuses.length;

  let flatIndex = 0;

  return (
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
            top:    caretPos.y + translateY + caretPos.h * 0.1,
            height: caretPos.h * 0.8,
            transition: "left 80ms linear, top 80ms linear",
          }}
        />
      )}

      {/* Scrolling paragraph */}
      <p
        ref={paragraphRef}
        className="select-none font-mono text-[1.4rem] tracking-wide whitespace-pre-wrap"
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
              if (status.char === "\n") {
                return (
                  <span
                    key={ci}
                    ref={(el) => { charRefs.current[idx] = el; }}
                    className={`inline ${charClass(status.state)}`}
                  >
                    ↵{"\n"}
                  </span>
                );
              }
              const isIncorrectSpace = status.char === " " && status.state === "incorrect";
              return (
                <span
                  key={ci}
                  ref={(el) => { charRefs.current[idx] = el; }}
                  className={`${charClass(status.state)} ${isIncorrectSpace ? "bg-[#ff006e]/20 rounded-sm" : ""}`}
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
