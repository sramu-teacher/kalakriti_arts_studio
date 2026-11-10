import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "../../data/constants.js";

// Shown at an admin-created event's link after its "show until" date, so
// an old ad or shared link still lands somewhere useful instead of a 404.
export default function EventEnded({ event }) {
  const message = `Hi! I saw "${event.name}" at Kalakriti Art Studio. Are there any similar workshops coming up?`;
  return (
    <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm">
      <h2 className="font-display text-2xl text-brand-green-900">This event has ended</h2>
      <p className="mt-3 text-brand-green-950/80">
        Thanks for your interest! {event.name} is no longer open, but we run new workshops and
        events regularly.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
        <Link
          to="/events"
          className="flex items-center justify-center gap-2 rounded-full bg-brand-gold-500 px-6 py-3 text-sm font-semibold text-brand-green-950 transition-transform hover:scale-[1.02]"
        >
          See current events <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <a
          href={`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
        >
          <MessageCircle size={18} aria-hidden="true" />
          Ask about upcoming ones
        </a>
      </div>
    </div>
  );
}
