import SEO from "../components/shared/SEO.jsx";
import { PAGE_META } from "../data/pageMeta.js";
import EventSection from "../components/events/EventSection.jsx";
import { EVENTS } from "../data/events.js";
import { useStudioEvents } from "../hooks/useStudioEvents.js";
import { getEventStatus } from "../data/eventListings.js";

export default function Events() {
  const { confirmedListings } = useStudioEvents();
  // Admin-created events inside their "show on website" window first
  // (time-limited workshops), once the live list confirms them; the
  // always-on built-in events show immediately.
  const workshops = (confirmedListings ?? []).filter((event) => getEventStatus(event) === "live");

  return (
    <>
      <SEO {...PAGE_META.events} />
      <div className="bg-brand-green-900 px-4 py-14 text-center text-brand-cream-100 sm:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-gold-400">Studio Events</p>
        <h1 className="mt-2 font-display text-4xl">Celebrate, Create, Remember</h1>
        <p className="mx-auto mt-3 max-w-xl text-brand-cream-100/85">
          From birthday parties to creative get-togethers, we host memorable art experiences —
          reach out and let's plan something beautiful together.
        </p>
      </div>

      <div className="space-y-10 px-4 py-14 sm:px-8">
        <div aria-live="polite">
          {confirmedListings === null && (
            <p className="text-center text-sm text-brand-green-900/60">Checking for current workshops…</p>
          )}
        </div>
        {[...workshops, ...EVENTS].map((event) => (
          <EventSection key={event.slug} event={event} />
        ))}
      </div>
    </>
  );
}
