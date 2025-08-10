import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../features/auth/hooks/AuthProvider";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

export const metadata: Metadata = {
  title: "TypingMentor",
  description:
    "TypingMentor is a typing speed platform: take timed and passage tests, track WPM and accuracy, and compete on the leaderboard.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
