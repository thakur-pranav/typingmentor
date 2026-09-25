import Link from "next/link";
import { LoginForm } from "../../../features/auth/components/LoginForm.jsx";

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-6 py-16">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-nb-text">Log in</h1>
        <p className="mt-1 text-sm text-nb-sub">Welcome back.</p>
      </div>
      <div className="border-2 border-nb-border bg-nb-card p-6 shadow-nb">
        <LoginForm />
      </div>
      <p className="text-center text-sm text-nb-sub">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-bold text-nb-text underline hover:text-nb-sub">
          Register
        </Link>
      </p>
    </div>
  );
}
