import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";

const FEATURES = [
  { title: "Timed & passage modes", body: "Race the clock in 15–120s sprints, or complete a full passage at your own pace.", accent: "yellow" },
  { title: "Real-time accuracy", body: "Every keystroke counts — even ones you backspaced. Accuracy is honest here.", accent: "cyan" },
  { title: "Track your history", body: "Every saved test is logged so you can see your progress over time.", accent: "pink" },
  { title: "Global leaderboard", body: "Compare your best WPM against typists from around the world.", accent: "green" },
];

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-24 px-6 py-16">

      {/* Hero */}
      <section className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <div className="mb-4 inline-block border-2 border-nb-border bg-nb-yellow px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-nb-sm">
            Free · No account needed
          </div>
          <h1 className="text-5xl font-black uppercase leading-none tracking-tight text-nb-text sm:text-6xl lg:text-7xl">
            Type.<br />Compete.<br />Improve.
          </h1>
          <p className="mt-6 text-base font-medium text-nb-sub">
            TypingMentor is a typing speed platform with real-time WPM, honest accuracy tracking, and a global leaderboard.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/test">Start Typing</Button>
            <Button href="/leaderboard" variant="secondary">Leaderboard</Button>
            <Button href="/register" variant="ghost">Register</Button>
          </div>
        </div>

        {/* Decorative stat card */}
        <div className="flex flex-col gap-4 shrink-0">
          <div className="border-2 border-nb-border bg-nb-yellow p-8 shadow-nb">
            <p className="text-xs font-bold uppercase tracking-widest text-nb-text/60">Your potential</p>
            <p className="mt-1 font-mono text-7xl font-black text-nb-text">120</p>
            <p className="mt-1 text-sm font-bold uppercase text-nb-text/60">WPM</p>
          </div>
          <div className="border-2 border-nb-border bg-nb-cyan p-4 shadow-nb-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-nb-text/60">Accuracy</p>
            <p className="font-mono text-3xl font-black text-nb-text">98.4%</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-nb-sub">Features</h2>
        <h3 className="mb-8 text-3xl font-black uppercase text-nb-text">What you get</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Card key={f.title} accent={f.accent}>
              <h4 className="text-sm font-black uppercase tracking-wide text-nb-text">{f.title}</h4>
              <p className="mt-2 text-sm text-nb-sub">{f.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Info cards */}
      <section className="grid gap-6 sm:grid-cols-2">
        <div className="border-2 border-nb-border bg-nb-card p-6 shadow-nb">
          <h3 className="text-sm font-black uppercase tracking-wide text-nb-text">What is typing speed?</h3>
          <p className="mt-3 text-sm text-nb-sub">
            Typing speed measures how quickly and accurately you enter text on a keyboard. It&apos;s expressed in words per minute (WPM), combined with accuracy that reflects correctly typed characters.
          </p>
        </div>
        <div className="border-2 border-nb-border bg-nb-card p-6 shadow-nb">
          <h3 className="text-sm font-black uppercase tracking-wide text-nb-text">How is WPM calculated?</h3>
          <p className="mt-3 text-sm text-nb-sub">
            5 characters = 1 word. WPM = total chars ÷ 5 ÷ minutes. Net WPM subtracts an error penalty. Accuracy counts every keypress — including ones you backspaced.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-2 border-nb-border bg-nb-text p-10 shadow-nb text-center">
        <h2 className="text-3xl font-black uppercase text-nb-yellow">Ready to type?</h2>
        <p className="mt-3 text-sm font-medium text-nb-yellow/70">No account needed. Just open the test and start.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href="/test">Start Typing</Button>
          <Button href="/leaderboard" variant="ghost">View Leaderboard</Button>
        </div>
      </section>

    </div>
  );
}
