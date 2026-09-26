import "./globals.css";
import { AuthProvider } from "../features/auth/hooks/AuthProvider.jsx";
import { Navbar } from "../components/layout/Navbar.jsx";
import { Footer } from "../components/layout/Footer.jsx";

export const metadata = {
  title: "TypingMentor",
  description:
    "TypingMentor is a typing speed platform: take timed and passage tests, track WPM and accuracy, and compete on the leaderboard.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
