"use client";

import Link from "next/link";
import { useAuth } from "../../features/auth/hooks/AuthProvider";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="border-b-2 border-nb-border bg-nb-yellow">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="text-xl font-black uppercase tracking-tight text-nb-text hover:underline"
        >
          TypingMentor
        </Link>

        <div className="flex items-center gap-1 text-sm font-bold">
          <NavLink href="/test">Test</NavLink>
          <NavLink href="/leaderboard">Leaderboard</NavLink>

          {isAuthenticated ? (
            <>
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/history">History</NavLink>
              <NavLink href="/profile">{user?.username}</NavLink>
              <button
                onClick={() => logout()}
                className="border-2 border-nb-border bg-nb-card px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-nb-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink href="/login">Login</NavLink>
              <Link
                href="/register"
                className="border-2 border-nb-border bg-nb-text px-3 py-1 text-xs font-bold uppercase tracking-wide text-nb-yellow shadow-nb-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-1 text-xs uppercase tracking-wide text-nb-text transition-colors hover:underline"
    >
      {children}
    </Link>
  );
}
