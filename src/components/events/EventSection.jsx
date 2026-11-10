import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, MessageCircle, ArrowRight, CalendarDays } from "lucide-react";
import { WHATSAPP_URL } from "../../data/constants.js";
import ShareButton from "../shared/ShareButton.jsx";

// An admin-created event's picture. Hidden if it can't load — e.g. an
// event saved moments ago whose picture is copied into the site by the
// rebuild that's still running.
function EventImage({ event }) {
  const [failed, setFailed] = useState(false);
  if (!event.image || failed) return null;
  return (
    <img
      src={`${import.meta.env.BASE_URL}${event.image}`}
      alt={event.name}
      onError={() => setFailed(true)}
      className="mt-6 max-h-[28rem] w-full rounded-2xl bg-brand-cream-100 object-cover first:mt-0"
    />
  );
}

// Used on the Events list (title links to the event's own page) and on
// that page itself (showHeader=false — the page renders the name as its
// <h1> above this).
export default function EventSection({ event, showHeader = true }) {
  const path = `/events/${event.slug}`;
  return (
    <section
      aria-labelledby={showHeader ? `event-${event.slug}` : undefined}
      aria-label={showHeader ? undefined : "Event details"}
      className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-sm sm:p-10"
    >
      {showHeader && (
        <>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-gold-600">Studio Event</p>
          <h2 id={`event-${event.slug}`} className="mt-2 font-display text-3xl text-brand-green-900 sm:text-4xl">
            <Link
              to={path}
              className="rounded-sm underline decoration-brand-gold-500/50 decoration-2 underline-offset-4 transition-colors hover:text-brand-gold-600 hover:decoration-brand-gold-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold-500"
            >
              {event.name}
            </Link>
          </h2>
          <p className="mt-2 font-display text-lg italic text-brand-gold-600">{event.tagline}</p>
        </>
      )}

      {event.isListing && <EventImage event={event} />}

      {event.eventDates && (
        <p className="mt-6 flex items-start gap-2 font-semibold text-brand-green-900 first:mt-0">
          <CalendarDays size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-brand-gold-600" />
          <span>
            <span className="sr-only">When: </span>
            {event.eventDates}
          </span>
        </p>
      )}

      <p className="mt-6 text-lg text-brand-green-950/90 first:mt-0">{event.intro}</p>

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

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start">
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
        <ShareButton path={path} title={event.name} />
      </div>
    </section>
  );
}
