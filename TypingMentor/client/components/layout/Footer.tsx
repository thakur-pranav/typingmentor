export function Footer() {
  return (
    <footer className="border-t-2 border-nb-border bg-nb-text py-5 text-center text-xs font-bold uppercase tracking-widest text-nb-yellow">
      © {new Date().getFullYear()} TypingMentor — Built for people who love the keyboard.
    </footer>
  );
}
