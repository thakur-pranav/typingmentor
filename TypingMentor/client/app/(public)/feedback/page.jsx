import { FeedbackForm } from "../../../features/feedback/components/FeedbackForm.jsx";

export const metadata = {
  title: "Feedback & Support | TypingMentor",
  description:
    "Send your suggestions, report issues, or ask queries directly to the TypingMentor development team.",
};

export default function FeedbackPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-12">
      {/* Header section */}
      <div className="space-y-3">
        <div className="inline-block border-2 border-nb-border bg-nb-yellow px-3 py-1 text-xs font-black uppercase tracking-wider text-nb-text shadow-nb-sm">
          Feedback & Support
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-nb-text">
          Have an idea or issue? Tell us!
        </h1>
        <p className="text-sm font-medium leading-relaxed text-nb-sub max-w-2xl">
          Whether you have an idea for a new feature, encountered an unexpected bug, or want to ask
          a question about TypingMentor, we are all ears. Every message goes directly to our team.
        </p>
      </div>

      {/* Main Feedback Form */}
      <FeedbackForm />

      {/* Info & Admin Card */}
      <div className="border-2 border-nb-border bg-nb-bg p-5 shadow-nb-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-nb-text">
          <span>📬</span>
          <span>Direct Contact & Response Time</span>
        </div>
        <p className="text-xs font-medium text-nb-sub leading-relaxed">
          You can also reach out directly to our team at{" "}
          <a
            href="mailto:byteforgelabs.app@gmail.com"
            className="font-bold text-nb-text underline hover:text-nb-sub"
          >
            byteforgelabs.app@gmail.com
          </a>
          . We typically review all incoming suggestions and queries within 24 to 48 hours.
        </p>
      </div>
    </div>
  );
}
