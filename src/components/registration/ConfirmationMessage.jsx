import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ConfirmationMessage({ classInfo }) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl bg-brand-green-900 p-8 text-center text-brand-cream-100">
      <CheckCircle2 size={48} className="mx-auto text-brand-gold-400" />
      <h2 className="mt-4 font-display text-2xl">You're All Set!</h2>
      <p className="mt-2 text-brand-cream-100/85">
        Thank you for registering{classInfo ? ` for ${classInfo.name}` : ""}. We've received your
        details and will confirm your seat within 24 hours.
      </p>
      <Link
        to="/classes"
        className="mt-6 inline-block rounded-full bg-brand-gold-500 px-6 py-2 text-sm font-semibold text-brand-green-950"
      >
        Browse More Classes
      </Link>
    </div>
  );
}
