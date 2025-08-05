import Link from "next/link";
import { TypingResult } from "../types";

interface TestResultProps {
  result: TypingResult;
  wpmHistory: number[];
  onRestart: () => void;
  isAuthenticated: boolean;
  saveStatus: "idle" | "saving" | "saved" | "error" | "skipped";
}

export function TestResult({
  result,
  wpmHistory,
  onRestart,
  isAuthenticated,
  saveStatus,
}: TestResultProps) {
  return (
    <div className="flex flex-col gap-8">

      {/* ── Hero + graph ── */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-6">

        {/* Hero stat cards */}
        <div className="flex flex-col gap-4 shrink-0">
          <HeroStat label="WPM" value={result.wpm} accent="yellow" />
          <HeroStat label="Accuracy" value={`${result.accuracy}%`} accent="cyan" />
        </div>

        {/* Graph */}
        {wpmHistory.length >= 2 && (
          <div className="flex-1 min-w-0 border-2 border-nb-border bg-nb-card p-4 shadow-nb">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-nb-sub">
              WPM over time
            </p>
            <WpmGraph wpmHistory={wpmHistory} />
          </div>
        )}
      </div>

      {/* ── Secondary stats ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <SecStat label="Raw WPM"   value={result.netWpm}                     />
        <SecStat label="Correct"   value={result.correctCharacters}          />
        <SecStat label="Incorrect" value={result.incorrectCharacters}        />
        <SecStat label="Time"      value={`${Math.round(result.duration)}s`} />
        <SecStat label="Chars"     value={result.totalCharacters}            />
      </div>

      {/* ── Save status ── */}
      {(isAuthenticated || saveStatus === "skipped") && (
        <p className="border-l-4 border-nb-border pl-3 text-sm font-medium text-nb-sub">
          {!isAuthenticated                           && "Log in to save results to your history."}
          {isAuthenticated && saveStatus === "saving" && "Saving result…"}
          {isAuthenticated && saveStatus === "saved"  && "✓ Result saved."}
          {isAuthenticated && saveStatus === "error"  && "✗ Could not save result."}
        </p>
      )}

      {/* ── Actions ── */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 border-2 border-nb-border bg-nb-yellow px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-nb-text shadow-nb transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Next test
        </button>
        <Link
          href="/dashboard"
          className="border-2 border-nb-border bg-nb-card px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-nb-text shadow-nb-sm transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
        >
          Dashboard
        </Link>
        <Link
          href="/leaderboard"
          className="border-2 border-nb-border bg-nb-card px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-nb-text shadow-nb-sm transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
        >
          Leaderboard
        </Link>
      </div>
    </div>
  );
}

/* ── WPM Graph ── */

const GW  = 600;
const GH  = 160;
const PAD = { top: 16, right: 16, bottom: 32, left: 44 };

function WpmGraph({ wpmHistory }: { wpmHistory: number[] }) {
  const iw = GW - PAD.left - PAD.right;
  const ih = GH - PAD.top  - PAD.bottom;

  const maxWpm  = Math.max(...wpmHistory, 10);
  const n       = wpmHistory.length;

  function gx(i: number) { return PAD.left + (i / Math.max(n - 1, 1)) * iw; }
  function gy(v: number) { return PAD.top  + ih - (v / maxWpm) * ih; }

  function smoothPath(pts: [number, number][]): string {
    if (pts.length < 2) return "";
    let d = `M ${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const cx = (pts[i - 1][0] + pts[i][0]) / 2;
      d += ` C ${cx},${pts[i - 1][1]} ${cx},${pts[i][1]} ${pts[i][0]},${pts[i][1]}`;
    }
    return d;
  }

  const pts: [number, number][] = wpmHistory.map((w, i) => [gx(i), gy(w)]);
  const line = smoothPath(pts);
  const fill = line + ` L ${PAD.left + iw},${PAD.top + ih} L ${PAD.left},${PAD.top + ih} Z`;

  const yTicks = [0, Math.round(maxWpm / 2), maxWpm];
  const xStep  = Math.max(1, Math.round(n / 6));
  const xTicks = Array.from({ length: n }, (_, i) => i).filter(
    (i) => i === 0 || i === n - 1 || i % xStep === 0
  );

  return (
    <svg
      viewBox={`0 0 ${GW} ${GH}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMinYMid meet"
      style={{ display: "block", aspectRatio: `${GW} / ${GH}` }}
      aria-label="WPM over time"
      role="img"
    >
      {/* Grid */}
      {yTicks.map((v) => (
        <line key={v} x1={PAD.left} x2={PAD.left + iw} y1={gy(v)} y2={gy(v)}
          stroke="#e5e0d0" strokeWidth="1" />
      ))}

      {/* Fill + curve */}
      <path d={fill} fill="#ffd60a" fillOpacity="0.18" />
      <path d={line} fill="none" stroke="#0d0d0d" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots */}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#ffd60a" stroke="#0d0d0d" strokeWidth="1.5" />
      ))}

      {/* Y labels */}
      {yTicks.map((v) => (
        <text key={v} x={PAD.left - 8} y={gy(v) + 4} textAnchor="end"
          fontSize="11" fill="#5a5a5a" fontFamily="Roboto Mono, monospace">{v}</text>
      ))}

      {/* X labels */}
      {xTicks.map((i) => (
        <text key={i} x={gx(i)} y={GH - 6} textAnchor="middle"
          fontSize="11" fill="#5a5a5a" fontFamily="Roboto Mono, monospace">{i + 1}s</text>
      ))}

      {/* Axes */}
      <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={PAD.top + ih}
        stroke="#0d0d0d" strokeWidth="2" />
      <line x1={PAD.left} x2={PAD.left + iw} y1={PAD.top + ih} y2={PAD.top + ih}
        stroke="#0d0d0d" strokeWidth="2" />
    </svg>
  );
}

/* ── Helpers ── */

function HeroStat({ label, value, accent }: { label: string; value: string | number; accent: "yellow" | "cyan" }) {
  const bg = accent === "yellow" ? "bg-nb-yellow" : "bg-nb-cyan";
  return (
    <div className={`border-2 border-nb-border ${bg} p-6 shadow-nb`}>
      <p className="text-xs font-bold uppercase tracking-widest text-nb-text/60">{label}</p>
      <p className="mt-1 font-mono text-6xl font-black tabular-nums text-nb-text leading-none">
        {value}
      </p>
    </div>
  );
}

function SecStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border-2 border-nb-border bg-nb-card p-4 shadow-nb-sm">
      <p className="text-[10px] font-bold uppercase tracking-widest text-nb-sub">{label}</p>
      <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-nb-text">{value}</p>
    </div>
  );
}
