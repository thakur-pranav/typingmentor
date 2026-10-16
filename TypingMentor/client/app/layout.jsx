import "./globals.css";
import { AuthProvider } from "../features/auth/hooks/AuthProvider.jsx";
import { Navbar } from "../components/layout/Navbar.jsx";
import { Footer } from "../components/layout/Footer.jsx";

export const metadata = {
  title: "TypingMentor",
  description:
    "TypingMentor is a distraction-free typing speed platform: take timed, passage, and code tests, track pure WPM and accuracy, and compete on global leaderboards.",
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
