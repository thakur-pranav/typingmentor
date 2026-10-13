import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t-2 border-nb-border bg-nb-text py-5 px-6 text-center text-xs font-bold uppercase tracking-widest text-nb-yellow">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
        <div>
          © {new Date().getFullYear()} TypingMentor — Built for people who love the keyboard.
        </div>
        <div className="flex items-center gap-4 text-[11px] font-black tracking-wider text-nb-yellow">
          <Link href="/feedback" className="hover:underline">
            Feedback & Support
          </Link>
          <span className="text-gray-500">•</span>
          <Link href="/about" className="hover:underline">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}
