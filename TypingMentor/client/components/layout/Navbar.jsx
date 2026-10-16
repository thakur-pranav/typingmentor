"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../features/auth/hooks/AuthProvider.jsx";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="relative z-40 border-b-2 border-nb-border bg-nb-yellow">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3">
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-2 text-lg sm:text-xl font-black uppercase tracking-tight text-nb-text hover:underline"
        >
          {/* Keyboard icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="2" y="6" width="20" height="13" rx="2" />
            <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" />
          </svg>
          TypingMentor
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 text-sm font-bold">
          <NavLink href="/test">Test</NavLink>
          <NavLink href="/leaderboard">Leaderboard</NavLink>
          <NavLink href="/feedback">Feedback</NavLink>

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

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          className="flex md:hidden items-center justify-center border-2 border-nb-border bg-nb-card p-2 text-nb-text shadow-nb-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="18" x2="20" y2="18"></line>
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-nb-border bg-nb-yellow px-4 py-4 shadow-nb">
          <div className="flex flex-col gap-2">
            <MobileNavLink href="/test" onClick={closeMenu}>
              ⌨️ Test
            </MobileNavLink>
            <MobileNavLink href="/leaderboard" onClick={closeMenu}>
              🏆 Leaderboard
            </MobileNavLink>
            <MobileNavLink href="/feedback" onClick={closeMenu}>
              💬 Feedback & Support
            </MobileNavLink>

            <div className="my-1 border-t border-nb-border/30" />

            {isAuthenticated ? (
              <>
                <MobileNavLink href="/dashboard" onClick={closeMenu}>
                  📊 Dashboard
                </MobileNavLink>
                <MobileNavLink href="/history" onClick={closeMenu}>
                  📜 History
                </MobileNavLink>
                <MobileNavLink href="/profile" onClick={closeMenu}>
                  👤 Profile ({user?.username})
                </MobileNavLink>
                <button
                  onClick={() => {
                    closeMenu();
                    logout();
                  }}
                  className="mt-1 flex w-full items-center justify-center border-2 border-nb-border bg-nb-pink py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-nb-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex items-center justify-center border-2 border-nb-border bg-nb-card py-2.5 text-xs font-black uppercase tracking-wider text-nb-text shadow-nb-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="flex items-center justify-center border-2 border-nb-border bg-nb-text py-2.5 text-xs font-black uppercase tracking-wider text-nb-yellow shadow-nb-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="px-3 py-1 text-xs uppercase tracking-wide text-nb-text transition-colors hover:underline"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between border-2 border-nb-border bg-nb-card px-4 py-2.5 text-xs font-black uppercase tracking-wider text-nb-text shadow-nb-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
    >
      <span>{children}</span>
      <span className="text-nb-sub">&rarr;</span>
    </Link>
  );
}
