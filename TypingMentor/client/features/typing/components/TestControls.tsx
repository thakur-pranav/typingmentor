interface TestControlsProps {
  onRestart: () => void;
}

export function TestControls({ onRestart }: TestControlsProps) {
  return (
    <div className="flex justify-center pt-2">
      <button
        onClick={onRestart}
        className="flex items-center gap-2 border-2 border-nb-border bg-nb-card px-4 py-2 text-xs font-bold uppercase tracking-widest text-nb-sub shadow-nb-sm transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-nb-yellow"
        aria-label="Restart test"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13" height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        Restart
      </button>
    </div>
  );
}
