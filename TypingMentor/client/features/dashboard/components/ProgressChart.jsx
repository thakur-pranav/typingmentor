"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils/cn.js";

const GW = 720;
const GH = 220;
const PAD = { top: 24, right: 36, bottom: 36, left: 44 };

export function ProgressChart({ tests = [], averageWpm = 0 }) {
  const [viewMode, setViewMode] = useState("wpm"); // "wpm" | "accuracy"
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!tests || tests.length < 2) {
    return (
      <div className="w-full border-2 border-nb-border bg-nb-card p-6 shadow-nb text-center">
        <p className="text-sm font-black uppercase tracking-wider text-nb-text">
          Performance Progression
        </p>
        <p className="mt-2 text-xs text-nb-sub">
          Complete at least 2 typing tests to unlock your speed and accuracy progression trendline.
        </p>
      </div>
    );
  }

  // Chronological order: oldest -> newest (left -> right)
  const chronological = [...tests].reverse();
  const n = chronological.length;

  const iw = GW - PAD.left - PAD.right;
  const ih = GH - PAD.top - PAD.bottom;

  function gx(i) {
    return PAD.left + (i / Math.max(n - 1, 1)) * iw;
  }

  // WPM Scaling
  const maxWpmRaw = Math.max(...chronological.map((t) => t.wpm), averageWpm, 20);
  const maxWpm = Math.ceil(maxWpmRaw / 10) * 10;
  const minWpm = 0;

  // Accuracy Scaling (fixed 50 to 100 or min to 100)
  const minAccRaw = Math.min(...chronological.map((t) => t.accuracy));
  const minAcc = Math.max(0, Math.floor(Math.min(minAccRaw, 80) / 10) * 10);
  const maxAcc = 100;

  function gyWpm(v) {
    return PAD.top + ih - ((v - minWpm) / Math.max(maxWpm - minWpm, 1)) * ih;
  }

  function gyAcc(v) {
    return PAD.top + ih - ((v - minAcc) / Math.max(maxAcc - minAcc, 1)) * ih;
  }

  function smoothPath(pts) {
    if (pts.length < 2) return "";
    let d = `M ${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const cx = (pts[i - 1][0] + pts[i][0]) / 2;
      d += ` C ${cx},${pts[i - 1][1]} ${cx},${pts[i][1]} ${pts[i][0]},${pts[i][1]}`;
    }
    return d;
  }

  // WPM Paths
  const wpmPts = chronological.map((t, i) => [gx(i), gyWpm(t.wpm)]);
  const netWpmPts = chronological.map((t, i) => [gx(i), gyWpm(t.netWpm)]);
  const wpmLine = smoothPath(wpmPts);
  const wpmFill = wpmLine + ` L ${PAD.left + iw},${PAD.top + ih} L ${PAD.left},${PAD.top + ih} Z`;
  const netWpmLine = smoothPath(netWpmPts);

  // Accuracy Paths
  const accPts = chronological.map((t, i) => [gx(i), gyAcc(t.accuracy)]);
  const accLine = smoothPath(accPts);
  const accFill = accLine + ` L ${PAD.left + iw},${PAD.top + ih} L ${PAD.left},${PAD.top + ih} Z`;

  // Ticks
  const yTicksWpm = [minWpm, Math.round(maxWpm / 2), maxWpm];
  const yTicksAcc = [minAcc, Math.round((minAcc + maxAcc) / 2), maxAcc];

  const xStep = Math.max(1, Math.round(n / 6));
  const xTicks = Array.from({ length: n }, (_, i) => i).filter(
    (i) => i === 0 || i === n - 1 || i % xStep === 0
  );

  // Trend Delta
  const firstWpm = chronological[0].wpm;
  const lastWpm = chronological[n - 1].wpm;
  const wpmDelta = Math.round((lastWpm - firstWpm) * 10) / 10;

  const hoveredItem = hoveredIdx !== null ? chronological[hoveredIdx] : null;

  return (
    <div className="w-full border-2 border-nb-border bg-nb-card p-6 shadow-nb">
      {/* Chart Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-nb-text">
              Performance Progression
            </h2>
            {viewMode === "wpm" && (
              <span
                className={cn(
                  "border border-nb-border px-2 py-0.5 font-mono text-[11px] font-black",
                  wpmDelta >= 0 ? "bg-nb-green/20 text-[#0d0d0d]" : "bg-red-200 text-[#0d0d0d]"
                )}
              >
                {wpmDelta >= 0 ? `+${wpmDelta}` : wpmDelta} WPM
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-nb-sub">
            Tracked across your last {n} completed test sessions
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="inline-flex gap-2">
          <button
            onClick={() => setViewMode("wpm")}
            className={cn(
              "border-2 border-nb-border px-3 py-1 text-xs font-bold uppercase tracking-widest transition-all",
              viewMode === "wpm"
                ? "bg-nb-yellow text-nb-text shadow-nb-sm"
                : "bg-nb-bg text-nb-sub hover:text-nb-text shadow-nb-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
            )}
          >
            Speed (WPM)
          </button>
          <button
            onClick={() => setViewMode("accuracy")}
            className={cn(
              "border-2 border-nb-border px-3 py-1 text-xs font-bold uppercase tracking-widest transition-all",
              viewMode === "accuracy"
                ? "bg-nb-green text-nb-text shadow-nb-sm"
                : "bg-nb-bg text-nb-sub hover:text-nb-text shadow-nb-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
            )}
          >
            Accuracy (%)
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${GW} ${GH}`}
          width="100%"
          height="100%"
          preserveAspectRatio="xMinYMid meet"
          style={{ display: "block", aspectRatio: `${GW} / ${GH}` }}
          aria-label="Performance progression chart"
          role="img"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {/* Horizontal Gridlines */}
          {(viewMode === "wpm" ? yTicksWpm : yTicksAcc).map((v) => {
            const y = viewMode === "wpm" ? gyWpm(v) : gyAcc(v);
            return (
              <line
                key={v}
                x1={PAD.left}
                x2={PAD.left + iw}
                y1={y}
                y2={y}
                stroke="#e5e0d0"
                strokeWidth="1"
              />
            );
          })}

          {/* Average WPM Baseline Line */}
          {viewMode === "wpm" && averageWpm > 0 && (
            <g>
              <line
                x1={PAD.left}
                x2={PAD.left + iw}
                y1={gyWpm(averageWpm)}
                y2={gyWpm(averageWpm)}
                stroke="#aaa89c"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x={PAD.left + iw}
                y={gyWpm(averageWpm) - 5}
                textAnchor="end"
                fontSize="10"
                fill="#5a5a5a"
                fontFamily="Roboto Mono, monospace"
                fontWeight="bold"
              >
                Avg {averageWpm}
              </text>
            </g>
          )}

          {/* Speed View Paths */}
          {viewMode === "wpm" && (
            <>
              {/* Raw WPM Area & Stroke */}
              <motion.path
                d={wpmFill}
                fill="#ffd60a"
                initial={{ fillOpacity: 0 }}
                animate={{ fillOpacity: 0.18 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              />
              <motion.path
                d={wpmLine}
                fill="none"
                stroke="#0d0d0d"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />

              {/* Net WPM Stroke */}
              <motion.path
                d={netWpmLine}
                fill="none"
                stroke="#00b4d8"
                strokeWidth="2"
                strokeDasharray="3 3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              />

              {/* Interactive Dots */}
              {wpmPts.map(([x, y], i) => (
                <motion.circle
                  key={`wpm-${i}`}
                  cx={x}
                  cy={y}
                  r={hoveredIdx === i ? 6 : 3.5}
                  fill="#ffd60a"
                  stroke="#0d0d0d"
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 + (i / Math.max(n - 1, 1)) * 0.6, duration: 0.15 }}
                  onMouseEnter={() => setHoveredIdx(i)}
                />
              ))}

              {netWpmPts.map(([x, y], i) => (
                <motion.circle
                  key={`net-${i}`}
                  cx={x}
                  cy={y}
                  r={hoveredIdx === i ? 4.5 : 2.5}
                  fill="#00b4d8"
                  stroke="#0d0d0d"
                  strokeWidth="1"
                  className="cursor-pointer transition-all"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.25 + (i / Math.max(n - 1, 1)) * 0.6, duration: 0.15 }}
                  onMouseEnter={() => setHoveredIdx(i)}
                />
              ))}
            </>
          )}

          {/* Accuracy View Paths */}
          {viewMode === "accuracy" && (
            <>
              <motion.path
                d={accFill}
                fill="#06d6a0"
                initial={{ fillOpacity: 0 }}
                animate={{ fillOpacity: 0.15 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              />
              <motion.path
                d={accLine}
                fill="none"
                stroke="#0d0d0d"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
              {accPts.map(([x, y], i) => (
                <motion.circle
                  key={`acc-${i}`}
                  cx={x}
                  cy={y}
                  r={hoveredIdx === i ? 6 : 3.5}
                  fill="#06d6a0"
                  stroke="#0d0d0d"
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 + (i / Math.max(n - 1, 1)) * 0.6, duration: 0.15 }}
                  onMouseEnter={() => setHoveredIdx(i)}
                />
              ))}
            </>
          )}

          {/* Hover Tracking Vertical Guide Line */}
          {hoveredIdx !== null && (
            <line
              x1={gx(hoveredIdx)}
              x2={gx(hoveredIdx)}
              y1={PAD.top}
              y2={PAD.top + ih}
              stroke="#0d0d0d"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          )}

          {/* Y Axis Labels */}
          {(viewMode === "wpm" ? yTicksWpm : yTicksAcc).map((v) => {
            const y = viewMode === "wpm" ? gyWpm(v) : gyAcc(v);
            return (
              <text
                key={v}
                x={PAD.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="#5a5a5a"
                fontFamily="Roboto Mono, monospace"
              >
                {viewMode === "accuracy" ? `${v}%` : v}
              </text>
            );
          })}

          {/* X Axis Labels */}
          {xTicks.map((i) => (
            <text
              key={i}
              x={gx(i)}
              y={GH - 10}
              textAnchor="middle"
              fontSize="11"
              fill="#5a5a5a"
              fontFamily="Roboto Mono, monospace"
            >
              #{i + 1}
            </text>
          ))}

          {/* Axes */}
          <line
            x1={PAD.left}
            x2={PAD.left}
            y1={PAD.top}
            y2={PAD.top + ih}
            stroke="#0d0d0d"
            strokeWidth="2"
          />
          <line
            x1={PAD.left}
            x2={PAD.left + iw}
            y1={PAD.top + ih}
            y2={PAD.top + ih}
            stroke="#0d0d0d"
            strokeWidth="2"
          />
        </svg>

        {/* Hover Tooltip Box */}
        {hoveredItem && hoveredIdx !== null && (
          <div
            className="pointer-events-none absolute z-10 border-2 border-nb-border bg-nb-card p-3 shadow-nb-sm text-xs"
            style={{
              left: `${Math.min(Math.max((gx(hoveredIdx) / GW) * 100, 15), 85)}%`,
              top: "10px",
              transform: "translateX(-50%)",
            }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-nb-border pb-1">
              <span className="font-mono font-bold text-nb-text">Test #{hoveredIdx + 1}</span>
              <span className="font-bold uppercase text-nb-sub text-[10px]">{hoveredItem.mode}</span>
            </div>
            <div className="mt-1 space-y-0.5 font-mono">
              <div className="flex justify-between gap-3">
                <span className="text-nb-sub">Raw WPM:</span>
                <span className="font-black text-nb-text">{hoveredItem.wpm}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-nb-sub">Net WPM:</span>
                <span className="font-bold text-[#00b4d8]">{hoveredItem.netWpm}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-nb-sub">Accuracy:</span>
                <span className="font-bold text-nb-text">{hoveredItem.accuracy}%</span>
              </div>
              <div className="text-[10px] text-nb-sub pt-1">
                {new Date(hoveredItem.createdAt).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-6 border-t border-nb-border pt-3 text-xs">
        {viewMode === "wpm" ? (
          <>
            <div className="flex items-center gap-1.5 font-medium text-nb-sub">
              <span className="h-3 w-3 border border-nb-border bg-nb-yellow" />
              <span>Raw WPM</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-nb-sub">
              <span className="h-2 w-4 border-b-2 border-dashed border-[#00b4d8]" />
              <span className="text-[#00b4d8]">Net WPM</span>
            </div>
            {averageWpm > 0 && (
              <div className="flex items-center gap-1.5 font-medium text-nb-sub">
                <span className="h-2 w-4 border-b-2 border-dashed border-[#aaa89c]" />
                <span>Avg Reference ({averageWpm})</span>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-1.5 font-medium text-nb-sub">
            <span className="h-3 w-3 border border-nb-border bg-nb-green" />
            <span>Accuracy %</span>
          </div>
        )}
      </div>
    </div>
  );
}
