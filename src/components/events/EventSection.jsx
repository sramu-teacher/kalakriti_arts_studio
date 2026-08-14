import { Link } from "react-router-dom";
import { CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";
import { WHATSAPP_URL } from "../../data/constants.js";

export default function EventSection({ event }) {
  return (
    <section className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-sm sm:p-10">
      <p className="text-xs uppercase tracking-[0.3em] text-brand-gold-600">Studio Event</p>
      <h2 className="mt-2 font-display text-3xl text-brand-green-900 sm:text-4xl">{event.name}</h2>
      <p className="mt-2 font-display text-lg italic text-brand-gold-600">{event.tagline}</p>

      <p className="mt-6 text-lg text-brand-green-950/90">{event.intro}</p>

      <div className="mt-4 space-y-4 text-brand-green-950/80">
        {event.description.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {event.highlights.map((highlight) => (
          <li key={highlight} className="flex items-start gap-2 text-sm text-brand-green-900">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-gold-600" />
            {highlight}
          </li>
        ))}
      </ul>

      {event.closing && <p className="mt-6 font-display text-lg text-brand-green-900">{event.closing}</p>}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <a
          href={`${WHATSAPP_URL}?text=${encodeURIComponent(event.whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] sm:w-auto"
        >
          <MessageCircle size={18} />
          Chat on WhatsApp
        </a>
        <Link
          to={`/events/${event.slug}/interest`}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-gold-500 px-6 py-3 text-sm font-semibold text-brand-green-950 transition-transform hover:scale-[1.02] sm:w-auto"
        >
          I'm Interested <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
