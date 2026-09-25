import Link from "next/link";
import { RegisterForm } from "../../../features/auth/components/RegisterForm.jsx";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-6 py-16">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-nb-text">Create account</h1>
        <p className="mt-1 text-sm text-nb-sub">Join the leaderboard.</p>
      </div>
      <div className="border-2 border-nb-border bg-nb-card p-6 shadow-nb">
        <RegisterForm />
      </div>
      <p className="text-center text-sm text-nb-sub">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-nb-text underline hover:text-nb-sub">
          Log in
        </Link>
      </p>
    </div>
  );
}
