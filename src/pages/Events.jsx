import SEO from "../components/shared/SEO.jsx";
import EventSection from "../components/events/EventSection.jsx";
import { EVENTS } from "../data/events.js";

export default function Events() {
  return (
    <>
      <SEO
        title="Art Events & Celebrations in Bengaluru"
        description="Host a birthday party, holiday camp, or special celebration at Kalakriti Art Studio in Uttarahalli, Bengaluru — everything taken care of."
      />
      <div className="bg-brand-green-900 px-4 py-14 text-center text-brand-cream-100 sm:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-gold-400">Studio Events</p>
        <h1 className="mt-2 font-display text-4xl">Celebrate, Create, Remember</h1>
        <p className="mx-auto mt-3 max-w-xl text-brand-cream-100/85">
          From birthday parties to creative get-togethers, we host memorable art experiences —
          reach out and let's plan something beautiful together.
        </p>
      </div>

      <div className="space-y-10 px-4 py-14 sm:px-8">
        {EVENTS.map((event) => (
          <EventSection key={event.slug} event={event} />
        ))}
      </div>
    </>
  );
}
