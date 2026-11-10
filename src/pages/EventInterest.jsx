import { useParams } from "react-router-dom";
import SEO from "../components/shared/SEO.jsx";
import { eventInterestMeta } from "../data/pageMeta.js";
import EventInterestForm from "../components/events/EventInterestForm.jsx";
import { getEventBySlug } from "../data/events.js";
import NotFound from "./NotFound.jsx";

export default function EventInterest() {
  const { slug } = useParams();
  const event = getEventBySlug(slug);

  if (!event) return <NotFound />;

  return (
    <>
      <SEO {...eventInterestMeta(event)} />
      <div className="bg-brand-green-900 px-4 py-10 text-center text-brand-cream-100 sm:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-gold-400">Studio Event</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">{event.name}</h1>
        <p className="mt-2 text-brand-cream-100/80">{event.tagline}</p>
      </div>
      <div className="px-4 py-12 sm:px-8">
        <EventInterestForm event={event} />
      </div>
    </>
  );
}
