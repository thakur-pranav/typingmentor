export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-6 py-16">
      <h1 className="text-3xl font-semibold text-white">About TypingMentor</h1>
      <p className="text-slate-400">
        TypingMentor is a focused typing-speed practice platform. Take timed or passage-based
        tests, watch your words-per-minute and accuracy update in real time, and track your
        progress with a personal history and global leaderboard.
      </p>
      <p className="text-slate-400">
        Built with Next.js, Express, and MongoDB, TypingMentor keeps the typing experience simple
        and distraction-free so you can focus on getting faster and more accurate.
      </p>
    </div>
  );
}
