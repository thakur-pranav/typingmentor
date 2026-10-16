export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 sm:px-6 py-8 sm:py-16">
      <div className="border-2 border-nb-border bg-nb-card p-5 sm:p-8 shadow-nb space-y-4">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-nb-text">About TypingMentor</h1>
        <p className="text-sm font-medium leading-relaxed text-nb-sub">
          TypingMentor is a focused, distraction-free typing speed practice platform. Take standardized timed, passage,
          or code tests with zero visual clutter while typing, review pure performance metrics (Core WPM, Raw WPM,
          Accuracy, and Consistency) on your results screen, and track your progression with personal history and global leaderboards.
        </p>
        <p className="text-sm font-medium leading-relaxed text-nb-sub">
          Built with Next.js, Express, and MongoDB, TypingMentor keeps the typing experience clean, responsive,
          and distraction-free so you can focus entirely on muscle memory, speed, and precision.
        </p>
      </div>
    </div>
  );
}
