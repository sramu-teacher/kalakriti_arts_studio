import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "../components/shared/SEO.jsx";
import EventSection from "../components/events/EventSection.jsx";
import EventEnded from "../components/events/EventEnded.jsx";
import { eventMeta } from "../data/pageMeta.js";
import { findEvent, getEventStatus } from "../data/eventListings.js";
import { useStudioEvents } from "../hooks/useStudioEvents.js";
import NotFound from "./NotFound.jsx";

// The shareable page for a single event — the link the studio puts in
// ads and posts (/events/<slug>).
export default function EventDetail() {
  const { slug } = useParams();
  const { listings, loaded } = useStudioEvents();
  const event = findEvent(slug, listings);

  if (!event) {
    // Possibly an event saved after the last build — wait for the live
    // list before deciding it doesn't exist.
    if (!loaded) return <p className="px-4 py-24 text-center text-brand-green-900/70">Loading event…</p>;
    return <NotFound />;
  }

  const status = getEventStatus(event);
  if (status === "upcoming") return <NotFound />;

  return (
    <>
      <SEO {...eventMeta(event)} noindex={status === "ended"} />
      <div className="bg-brand-green-900 px-4 py-12 text-center text-brand-cream-100 sm:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-gold-400">Studio Event</p>
        <h1 className="mt-2 font-display text-4xl">{event.name}</h1>
        {event.tagline && <p className="mt-2 font-display text-lg italic text-brand-gold-400">{event.tagline}</p>}
      </div>
      <div className="px-4 py-14 sm:px-8">
        {status === "ended" ? <EventEnded event={event} /> : <EventSection event={event} showHeader={false} />}
        <p className="mx-auto mt-8 max-w-4xl text-center">
          <Link
            to="/events"
            className="inline-flex items-center gap-1 font-semibold text-brand-green-900 underline underline-offset-4 hover:text-brand-gold-600"
          >
            <ArrowLeft size={16} aria-hidden="true" /> See all studio events
          </Link>
        </p>
      </div>
    </>
  );
}
