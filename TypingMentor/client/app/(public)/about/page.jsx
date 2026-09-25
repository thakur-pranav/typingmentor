export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-6 py-16">
      <div className="border-2 border-nb-border bg-nb-card p-8 shadow-nb space-y-4">
        <h1 className="text-3xl font-black uppercase tracking-tight text-nb-text">About TypingMentor</h1>
        <p className="text-sm font-medium leading-relaxed text-nb-sub">
          TypingMentor is a focused typing-speed practice platform. Take timed or passage-based
          tests, watch your words-per-minute and accuracy update in real time, and track your
          progress with a personal history and global leaderboard.
        </p>
        <p className="text-sm font-medium leading-relaxed text-nb-sub">
          Built with Next.js, Express, and MongoDB, TypingMentor keeps the typing experience simple
          and distraction-free so you can focus on getting faster and more accurate.
        </p>
      </div>
    </div>
  );
}
